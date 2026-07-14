---
name: vanta-status
description: Quick compliance dashboard — failing tests, missing docs, overdue vulns
user_invocable: true
allowed-tools:
  - Bash
  - Read
---

# /vanta-status — Compliance Dashboard

Uses the `elnora-vanta` CLI (read-only, must be on PATH — see the
vanta-workspace skill for install and auth).

Run these 4 commands via Bash in parallel:

```bash
elnora-vanta frameworks list
```

```bash
elnora-vanta tests list --status NEEDS_ATTENTION
```

```bash
elnora-vanta documents list --status "Needs document"
```

```bash
elnora-vanta vulns list --overdue
```

Then present the framework completion (controls/documents/tests per framework)
followed by a summary table:

| Category | Count | Status |
|----------|-------|--------|
| Failing tests | {count from tests response} | {NEEDS_ATTENTION if >0, else OK} |
| Missing documents | {count from docs response} | {ACTION_REQUIRED if >0, else OK} |
| Overdue vulns | {count from vulns response} | {CRITICAL if >0, else OK} |

If any items need attention, list the details below the table grouped by
category.
