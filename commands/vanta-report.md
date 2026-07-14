---
name: vanta-report
description: Generate full compliance report from live Vanta API data
user_invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
---

# /vanta-report — Compliance Report Generator

Generate a comprehensive compliance report at
`./vanta-compliance-report.md` in the current working directory, unless the
user names a different path. Uses the `elnora-vanta` CLI (read-only, must be
on PATH — see the vanta-workspace skill for install and auth).

## Steps

1. Run `/vanta-sync` first so the reference data is fresh.

2. Read all four reference files from `$VANTA_REFERENCES_DIR` (or
   `${CLAUDE_PLUGIN_ROOT}/references/` if unset):
   - `vanta-tests.md`
   - `vanta-documents.md`
   - `vanta-controls.md`
   - `vanta-vulns.md`

3. Fetch the data the cache doesn't cover, via Bash in parallel:

```bash
elnora-vanta frameworks list
elnora-vanta risks list
```

4. Generate the report with these sections:
   - **Executive Summary** — 3-sentence compliance posture
   - **Framework Status** — table with completion counts per enrolled framework
   - **Failing Tests** — grouped by framework
   - **Document Gaps** — what's missing
   - **Vulnerability Status** — grouped by severity with SLA
   - **Risk Register** — approved vs pending
   - **Recommendations** — prioritized action items

5. Write the report with YAML frontmatter:

   ```yaml
   ---
   title: Vanta Compliance Report
   generated: {ISO date}
   generator: elnora-vanta
   ---
   ```

6. If a previous report exists at the target path, show a diff summary vs
   the previous report (counts up/down, newly failing tests, resolved items).

The report contains your org's live compliance posture — do not commit it to
a public repository.
