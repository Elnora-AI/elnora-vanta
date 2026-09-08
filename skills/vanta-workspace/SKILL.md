---
name: vanta-workspace
description: >
  Vanta compliance CLI — the complete documented API. Curated read-only
  commands for everyday questions (frameworks, tests, controls, documents,
  vulnerabilities, risks, people, policies, vendors), plus `api` for all 321
  REST operations and `mcp` for the answer library, knowledge base, privacy
  assessments and access reviews. Agent-friendly JSON.
  Use when: checking compliance status, failing tests, missing evidence,
  vulnerability SLAs, risk register, audit prep, or any Vanta query.
  TRIGGERS: "vanta", "compliance", "soc 2", "iso 27001", "failing tests",
  "compliance tests", "controls", "evidence", "vulnerabilities", "vulns",
  "SLA", "risk register", "audit", "security posture", "trust center",
  "answer library", "security questionnaire", "vendor review"
---

# Vanta Workspace Skill

Access to the Vanta compliance platform from the command line.

The `elnora-vanta` binary must be on your PATH (`npm install -g @elnora-ai/vanta`).
Verify with `elnora-vanta frameworks list`. If that fails, see
[INSTALL_FOR_AGENTS.md](../../INSTALL_FOR_AGENTS.md).

> Note: the binary is `elnora-vanta`, not `vanta` — we don't shadow other
> tools that claim the `vanta` name.

## Three surfaces

| Surface | What it covers | Auth |
|---------|----------------|------|
| Curated commands (`frameworks`, `tests`, ...) | Everyday questions, **read-only by construction** | client-credentials |
| `api <group> <command>` | All **321 documented REST operations**, 38 groups | client-credentials |
| `mcp call <tool>` | **165 MCP tools** — answer library, knowledge base, privacy assessments, access reviews, `generatePolicy` (not in the REST API) | `elnora-vanta mcp login` (browser, Vanta Admin only) |

Do not guess command names. Discover them:

```bash
elnora-vanta api search "policy"           # REST operations by name/path/summary
elnora-vanta api search --risk destructive # everything that can delete
elnora-vanta mcp tools --grep vendor       # MCP tools
elnora-vanta mcp tools --name generatePolicy   # one tool's full input schema
```

**Write safety — read before using `api` or `mcp call`.** Every operation is
graded, and the grade is asserted by the test suite:

- `[read]` runs immediately.
- `[write]` prints the request and stops unless `--confirm` is passed.
- `[destructive]` prints the request and stops unless `--confirm` **and** `--force`.

Exit codes matter more than the JSON here: `0` success, `2` usage, `3` auth,
`4` not found, `5` rate limit, `6` a write refused for want of `--confirm` or
`--force`. A refusal is not a success, so check the status rather than assuming
a command that printed JSON did something.

`--dry-run` always wins. **Never add `--force` on the user's behalf** — the
PreToolUse hook blocks it, because deleting live compliance evidence is a human
decision. Show the user the printed plan and let them run it themselves.

A `403 Forbidden` from `api` usually means Vanta declined the resource for this
OAuth client (integration connectors, secrets, security tasks, user accounts,
per-device records, audits, contracts need a differently-scoped Vanta app). It
is not a CLI bug — do not retry it in a loop.

## Auth

OAuth client-credentials. Credential resolution order: `VANTA_CLIENT_ID` /
`VANTA_CLIENT_SECRET` from the environment, then
`~/.config/elnora-vanta/.env` (or `$VANTA_CONFIG_DIR/.env`), then a `.env`
next to the CLI. Create the OAuth client in the Vanta dashboard at
https://app.vanta.com/settings/api with the `client_credentials` grant and
only the `vanta-api.all:read` scope. Tokens are auto-cached at
`~/.config/elnora-vanta/token.json` (mode 0600).

Default API base is `https://api.vanta.com`. EU or AUS tenants set
`VANTA_API_BASE_URL=https://api.eu.vanta.com` or
`https://api.aus.vanta.com` (the CLI pins requests to these three hosts).

## Routing Table

| Query | Command |
|-------|---------|
| Framework status / completion | `elnora-vanta frameworks list` |
| Failing tests / test status | `elnora-vanta tests list --status NEEDS_ATTENTION` |
| Test entities / resources | `elnora-vanta tests entities <id>` |
| Security controls | `elnora-vanta controls list --framework <id>` |
| Control tests | `elnora-vanta controls tests <id>` |
| Control evidence documents | `elnora-vanta controls documents <id>` |
| Missing documents / evidence | `elnora-vanta documents list --status "Needs document"` |
| Document files | `elnora-vanta documents files <id>` |
| Document links | `elnora-vanta documents links <id>` |
| Vulnerabilities / CVEs | `elnora-vanta vulns list [--severity HIGH] [--overdue] [--cve <id>] [--search <query>]` |
| Vulnerable assets | `elnora-vanta vuln-assets list` |
| Remediation tracking | `elnora-vanta vuln-remediations list` |
| Risk register | `elnora-vanta risks list` |
| People / personnel | `elnora-vanta people list [--task-status OVERDUE]` |
| User groups | `elnora-vanta groups list` |
| Connected integrations | `elnora-vanta integrations list` |
| Compliance policies | `elnora-vanta policies list [--framework <id>]` |
| Third-party vendors | `elnora-vanta vendors list` |
| Monitored computers / endpoints | `elnora-vanta computers list` |
| Shell completions | `elnora-vanta completion <bash\|zsh\|fish\|powershell>` |

Framework ids are discovered per org — run `elnora-vanta frameworks list`
and use the ids it returns (e.g. `soc2`, `iso27001` — examples only, your
tenant's ids may differ). Never assume a framework is enrolled.

## Quick Dashboard

For a quick compliance overview, run these 3 commands in parallel:

```bash
elnora-vanta tests list --status NEEDS_ATTENTION
elnora-vanta documents list --status "Needs document"
elnora-vanta vulns list --overdue
```

## Common Options

Global flags on every command:

- `--compact` — token-efficient output
- `--output json|table|csv` — output format (default: json)
- `--fields <list>` — select specific fields
- `--page-size <n>` — API page size
- `--limit <n>` — cap results on list commands (default: all pages)
- `--no-color` — disable ANSI colors

Filters:

- `--framework <id>` — filter by framework id (discover with `frameworks list`)
- `--status <status>` — tests: OK, NEEDS_ATTENTION, DEACTIVATED, IN_PROGRESS, INVALID, NOT_APPLICABLE; documents: case-insensitive text (e.g. "Needs document")
- `--severity <level>` — vulns: CRITICAL, HIGH, MEDIUM, LOW
- `--overdue` — only SLA-overdue vulnerabilities
- `--cve <id>` — filter vulns by CVE ID
- `--search <query>` — search vulns by name, description, or package identifier
- `--integration <id>` — filter tests or vulns by integration ID
- `--task-status <status>` — people: COMPLETE, DUE_SOON, OVERDUE, NONE

## Cached References

Before hitting the API for posture context, check the cached reference files
in `$VANTA_REFERENCES_DIR` (or `${CLAUDE_PLUGIN_ROOT}/references/` if unset):

- `vanta-tests.md` — failing tests summary
- `vanta-documents.md` — all documents with status
- `vanta-controls.md` — controls grouped by framework
- `vanta-vulns.md` — vulnerabilities with SLA dates

The repo ships these as `*.template.md` placeholders with fake rows; run
`/vanta-sync` to generate the real ones from your tenant. Generated files
contain your org's live compliance posture — they are gitignored and must
never be committed.

Read the cache first for context. Use the CLI for live data when freshness
matters.

## Slash Commands

- `/vanta-status` — quick compliance dashboard (failing tests, missing docs, overdue vulns)
- `/vanta-sync` — refresh cached reference files from the live API
- `/vanta-vulns` — vulnerability dashboard with SLA tracking
- `/vanta-report` — generate a full compliance report

## Output Format

All commands print JSON to stdout:

```json
{ "<data_key>": [...], "count": N }
```

Errors go to stderr:

```json
{ "error": "message", "suggestion": "how to fix" }
```
