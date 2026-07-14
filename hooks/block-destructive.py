#!/usr/bin/env python3
"""
Vanta workspace safety hook — blocks ALL write operations.
The elnora-vanta CLI is read-only by design. This hook blocks any attempt
to use POST, PUT, PATCH, or DELETE against the Vanta API.

This is a PreToolUse hook that inspects Bash commands before execution.
"""

import json
import re
import sys

WRITE_METHODS = ["POST", "PUT", "PATCH", "DELETE"]

# A statement boundary: start of command OR after a shell separator (; && || | newline).
# Used as a lookbehind-equivalent prefix so we only match real invocations, not quoted
# strings inside grep/echo/cat/etc.
_STATEMENT_PREFIX = r"(?:^|[\n;&|])\s*"

# Blocked CLI subcommands — each requires an actual CLI invocation
# (optional `node ` or path prefix) at statement start, followed by the subcommand.
# The read-only CLI does not even implement these; the hook is defense in depth
# against someone wiring up a mutated build.
_BLOCKED_SUBCOMMANDS = [
    r"documents\s+create",
    r"documents\s+delete(?:-all)?",
    r"documents\s+link",
    r"documents\s+set-owner",
    r"documents\s+bulk-delete",
    r"document\s+delete",
]

_BLOCKED_CLI_RE = re.compile(
    _STATEMENT_PREFIX
    + r"(?:node\s+)?"                       # optional `node ` prefix
    + r"(?:[^\s;&|]*/)?"                    # optional path prefix like ./dist/
    + r"(?:vanta\.js|main\.js|elnora-vanta)\s+"  # the CLI (built entry or installed bin)
    + r"(?:" + "|".join(_BLOCKED_SUBCOMMANDS) + r")\b",
    re.IGNORECASE,
)

# HTTP write methods against the Vanta API (any region). Blocks when a real
# HTTP client (curl/wget/http/httpie) appears at statement start AND the same
# statement contains both a Vanta API host and a write method.
# Uses lookaheads so the order of --method and URL doesn't matter. Plain
# `grep "POST api.vanta.com" docs.md` won't trip this because grep is not an
# HTTP client.
_VANTA_HOST = r"api(?:\.eu|\.aus)?\.vanta\.com"
_API_WRITE_RE = re.compile(
    _STATEMENT_PREFIX
    + r"(?:curl|wget|http|httpie)\b"                             # HTTP client invocation
    + r"(?=[^\n;&|]*\b" + _VANTA_HOST + r"\b)"                   # same statement has vanta API
    + r"(?=[^\n;&|]*\b(?:" + "|".join(WRITE_METHODS) + r")\b)",  # same statement has write method
    re.IGNORECASE,
)


def check_command(command: str) -> "tuple[bool, str]":
    """Check if a command is a write operation. Returns (blocked, reason).

    Only matches real shell invocations. Does NOT trip on commands that merely
    contain the pattern as a quoted argument (grep, echo, cat, rg, etc.).
    """
    match = _BLOCKED_CLI_RE.search(command)
    if match:
        matched_text = match.group(0).strip()
        return True, f"Blocked write operation: '{matched_text}'"

    match = _API_WRITE_RE.search(command)
    if match:
        return True, "Blocked Vanta API write: HTTP write method against the Vanta API"

    return False, ""


def _block(reason: str) -> None:
    result = {
        "decision": "block",
        "reason": f"SAFETY: {reason}. The elnora-vanta CLI is read-only. "
                  f"All modifications must be done in the Vanta dashboard.",
    }
    print(json.dumps(result))
    sys.stderr.write(result["reason"] + "\n")
    sys.exit(2)


def main():
    # Read hook input from stdin
    raw_input = ""
    try:
        raw_input = sys.stdin.read()
        hook_input = json.loads(raw_input)
    except Exception as e:
        # Safety hook could not parse input — block if vanta-related write, allow otherwise
        if "vanta" in raw_input.lower():
            for method in WRITE_METHODS:
                if method.lower() in raw_input.lower():
                    _block(
                        f"Hook parse error ({type(e).__name__}), but detected "
                        f"'{method}' + 'vanta' in raw input. Blocking as precaution"
                    )
            # Vanta-related but no write method detected — likely a read, allow with warning
            sys.stderr.write(
                f"Warning: block-destructive hook could not parse input ({type(e).__name__}). "
                f"Allowing vanta command (no write method detected in raw input).\n"
            )
            sys.exit(0)
        # Not vanta-related at all — safe to allow
        sys.exit(0)

    tool_name = hook_input.get("tool_name", "")
    tool_input = hook_input.get("tool_input", {})

    # Only inspect Bash commands
    if tool_name != "Bash":
        sys.exit(0)

    command = tool_input.get("command", "")

    # Skip if not a vanta-related command
    if "vanta" not in command.lower():
        sys.exit(0)

    blocked, reason = check_command(command)
    if blocked:
        _block(reason)

    # Allow the command
    sys.exit(0)


if __name__ == "__main__":
    main()
