#!/usr/bin/env python3
"""Unit tests for block-destructive.py — run directly: python hooks/test_block_destructive.py"""

import importlib.util
import json
import subprocess
import sys
from pathlib import Path

HOOK = Path(__file__).parent / "block-destructive.py"

spec = importlib.util.spec_from_file_location("block_destructive", HOOK)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

BLOCKED = [
    # Routes to the same binary that once slipped past the --force rule.
    "elnora-vanta api controls delete-control X --confirm \\\n--force",
    "npx @elnora-ai/vanta api controls delete-control X --confirm --force",
    "VANTA_CONFIG_DIR=/x elnora-vanta api controls delete-control X --confirm --force",
    "pnpm exec elnora-vanta api controls delete-control X --confirm --force",
    "tsx src/main.ts api controls delete-control X --confirm --force",
    "pnpm dev api controls delete-control X --confirm --force",
    "npm run dev api controls delete-control X --confirm --force",
    # The --force rule: destructive execution is reserved for a human.
    "elnora-vanta api vendors delete-by-id X --confirm --force",
    "elnora-vanta api controls delete-control X --force",
    "elnora-vanta api people offboard-people --body '{}' --confirm --force",
    "elnora-vanta mcp call deletePolicy --args '{}' --confirm --force",
    "node /usr/local/lib/node_modules/@elnora-ai/vanta/dist/main.js api controls delete-control X --force",
    "elnora-vanta documents delete abc123",
    "node dist/main.js documents create --title x",
    "node ./cli/bin/vanta.js documents bulk-delete",
    "echo ok; elnora-vanta documents set-owner abc",
    'curl -X DELETE https://api.vanta.com/v1/documents/abc',
    'curl https://api.eu.vanta.com/v1/documents/abc -X POST -d "{}"',
    "wget --method=DELETE https://api.aus.vanta.com/v1/x",
    # wrapper / substitution shapes must not bypass the guard
    "$(curl -X POST https://api.vanta.com/v1/documents)",
    "`curl -X DELETE https://api.vanta.com/v1/documents/abc`",
    "env curl -X POST https://api.vanta.com/v1/documents",
    "command curl -X DELETE https://api.vanta.com/v1/x",
    "xargs curl -X DELETE https://api.vanta.com/v1/x",
    "timeout 5 curl -X POST https://api.vanta.com/v1/documents",
    "env FOO=bar curl -X POST https://api.vanta.com/v1/documents",
]

ALLOWED = [
    # Package-runner commands that have nothing to do with the CLI.
    "pnpm dev",
    "npm run build",
    "npx prettier --write .",
    "cat docs/api-force-notes.md",
    # Reads and confirmed non-destructive writes are the agent's to run.
    "elnora-vanta api frameworks list-frameworks",
    "elnora-vanta api vendors create-vendor --body '{}' --confirm",
    "elnora-vanta mcp call getSlas",
    "elnora-vanta mcp call createControls --args '{}' --confirm",
    "elnora-vanta api vendors delete-by-id X --dry-run",
    # prose about --force is not an invocation
    "echo 'pass --force to really delete' >> notes.md",
    'grep -n "api .* --force" docs/runbook.md',
    "elnora-vanta tests list --status NEEDS_ATTENTION",
    "elnora-vanta frameworks list",
    "node dist/main.js vulns list --overdue",
    'grep "POST api.vanta.com" docs.md',
    'echo "elnora-vanta documents delete is blocked"',
    "curl https://api.vanta.com/v1/frameworks",
    "elnora-vanta documents list --status 'Needs document'",
]

failures = []

for cmd in BLOCKED:
    blocked, reason = mod.check_command(cmd)
    if not blocked:
        failures.append(f"should BLOCK but allowed: {cmd}")

for cmd in ALLOWED:
    blocked, reason = mod.check_command(cmd)
    if blocked:
        failures.append(f"should ALLOW but blocked ({reason}): {cmd}")


def run_hook(stdin_text):
    return subprocess.run([sys.executable, str(HOOK)], input=stdin_text, capture_output=True, text=True)


def assert_blocks(proc, label):
    # Blocking contract: exit 0 + stdout JSON with permissionDecision deny.
    # A non-zero exit would fire hooks.json's `|| python` fallback with
    # consumed stdin, converting the block into an allow.
    if proc.returncode != 0:
        failures.append(f"{label}: expected exit 0 (block-via-JSON), got {proc.returncode} ({proc.stderr!r})")
        return
    try:
        out = json.loads(proc.stdout)
    except ValueError:
        failures.append(f"{label}: stdout is not JSON: {proc.stdout!r}")
        return
    if out.get("hookSpecificOutput", {}).get("permissionDecision") != "deny":
        failures.append(f"{label}: missing permissionDecision deny: {proc.stdout!r}")
    if out.get("decision") != "block":
        failures.append(f"{label}: missing legacy decision block: {proc.stdout!r}")


# End-to-end: a write must be denied.
assert_blocks(
    run_hook(json.dumps({"tool_name": "Bash", "tool_input": {"command": "elnora-vanta documents delete x"}})),
    "e2e block",
)

# End-to-end: a read must be allowed (exit 0, no deny decision).
proc = run_hook(json.dumps({"tool_name": "Bash", "tool_input": {"command": "elnora-vanta tests list"}}))
if proc.returncode != 0:
    failures.append(f"e2e allow: expected exit 0, got {proc.returncode} ({proc.stderr!r})")
elif proc.stdout.strip():
    failures.append(f"e2e allow: expected empty stdout, got {proc.stdout!r}")

# End-to-end: unparseable stdin containing vanta + write method must fail closed.
assert_blocks(run_hook("not json at all: curl -X DELETE api.vanta.com"), "e2e fail-closed")

# Pipeline-level: the exact hooks.json shape (`python3 X || python X`) must
# still deny — the block path exits 0 so the fallback never fires.
proc = subprocess.run(
    ["sh", "-c", f'"{sys.executable}" "{HOOK}" || python "{HOOK}"'],
    input=json.dumps({"tool_name": "Bash", "tool_input": {"command": "elnora-vanta documents delete x"}}),
    capture_output=True,
    text=True,
)
assert_blocks(proc, "pipeline block")

if failures:
    print("FAILED:")
    for f in failures:
        print(f"  - {f}")
    sys.exit(1)

print(f"block-destructive tests passed ({len(BLOCKED) + len(ALLOWED)} pattern cases + 4 e2e).")
