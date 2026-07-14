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
    "elnora-vanta documents delete abc123",
    "node dist/main.js documents create --title x",
    "node ./cli/bin/vanta.js documents bulk-delete",
    "echo ok; elnora-vanta documents set-owner abc",
    'curl -X DELETE https://api.vanta.com/v1/documents/abc',
    'curl https://api.eu.vanta.com/v1/documents/abc -X POST -d "{}"',
    "wget --method=DELETE https://api.aus.vanta.com/v1/x",
]

ALLOWED = [
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

# End-to-end: the hook must exit 2 and emit a block decision for a write.
proc = subprocess.run(
    [sys.executable, str(HOOK)],
    input=json.dumps({"tool_name": "Bash", "tool_input": {"command": "elnora-vanta documents delete x"}}),
    capture_output=True,
    text=True,
)
if proc.returncode != 2:
    failures.append(f"e2e block: expected exit 2, got {proc.returncode}")
elif json.loads(proc.stdout).get("decision") != "block":
    failures.append(f"e2e block: stdout missing block decision: {proc.stdout!r}")

# End-to-end: a read must exit 0.
proc = subprocess.run(
    [sys.executable, str(HOOK)],
    input=json.dumps({"tool_name": "Bash", "tool_input": {"command": "elnora-vanta tests list"}}),
    capture_output=True,
    text=True,
)
if proc.returncode != 0:
    failures.append(f"e2e allow: expected exit 0, got {proc.returncode} ({proc.stderr!r})")

# End-to-end: unparseable stdin containing vanta + write method must fail closed
# (this is the regression test for the undefined-WRITE_METHODS crash).
proc = subprocess.run(
    [sys.executable, str(HOOK)],
    input="not json at all: curl -X DELETE api.vanta.com",
    capture_output=True,
    text=True,
)
if proc.returncode != 2:
    failures.append(f"e2e fail-closed: expected exit 2, got {proc.returncode} ({proc.stderr!r})")

if failures:
    print("FAILED:")
    for f in failures:
        print(f"  - {f}")
    sys.exit(1)

print(f"block-destructive tests passed ({len(BLOCKED) + len(ALLOWED)} pattern cases + 3 e2e).")
