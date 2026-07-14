---
name: vanta-vulns
description: Vulnerability dashboard with SLA tracking and remediation status
user_invocable: true
allowed-tools:
  - Bash
  - Read
---

# /vanta-vulns — Vulnerability Dashboard

Uses the `elnora-vanta` CLI (read-only, must be on PATH — see the
vanta-workspace skill for install and auth).

## Steps

1. Run via Bash:

```bash
elnora-vanta vulns list
```

2. Group results by severity (CRITICAL > HIGH > MEDIUM > LOW).

3. For each vulnerability, calculate SLA status:
   - **Overdue**: `slaDeadline` is in the past
   - **Due soon**: `slaDeadline` is within 7 days
   - **On track**: `slaDeadline` is >7 days away

4. Present as table:

| CVE | Severity | CVSS | Fixable | SLA Deadline | Status |
|-----|----------|------|---------|--------------|--------|

5. Show summary: total count, overdue count, fixable count.
