# AGENTS.md

Universal guide for any coding agent working with `elnora-vanta`. Read natively by Codex, Cursor, Aider, Continue, Amp, Jules, and Roo. Claude Code reads `CLAUDE.md` / the plugin skills instead — see [the Claude Code section](#claude-code).

## What this is

`@elnora-ai/vanta` — one npm package exposing the `elnora-vanta` CLI: read-only coverage of the Vanta compliance API (frameworks, tests, controls, documents, vulnerabilities, risks, people, vendors, and more). Any agent shells out to the CLI; JSON output and structured errors are designed for self-correction.

> The binary is `elnora-vanta`, not `vanta` — this avoids shadowing other tools named `vanta` on PATH.

## Setup

```sh
npm install -g @elnora-ai/vanta
mkdir -p ~/.config/elnora-vanta
printf 'VANTA_CLIENT_ID=your-client-id\nVANTA_CLIENT_SECRET=your-client-secret\n' >> ~/.config/elnora-vanta/.env
chmod 600 ~/.config/elnora-vanta/.env
elnora-vanta frameworks list --compact    # smoke test
```

Create the OAuth client in your Vanta dashboard at [app.vanta.com/settings/api](https://app.vanta.com/settings/api) — **client_credentials** grant with **only** the `vanta-api.all:read` scope. Requires a Vanta admin. For a guided install, see [`INSTALL_FOR_AGENTS.md`](INSTALL_FOR_AGENTS.md).

Credential resolution order: process env `VANTA_CLIENT_ID` / `VANTA_CLIENT_SECRET` → `~/.config/elnora-vanta/.env` (or `$VANTA_CONFIG_DIR/.env`) → a `.env` next to the CLI. The OAuth token is auto-cached at `~/.config/elnora-vanta/token.json` (mode 0600) and refreshed on expiry — no manual token handling.

## Read-only guarantee

The CLI **cannot modify your Vanta tenant.** Every request is HTTP GET, enforced three ways: in the HTTP client code, by a PreToolUse guard hook (Claude Code plugin), and by the OAuth scope itself (`vanta-api.all:read`). Requests go only to `api.vanta.com`, `api.eu.vanta.com`, or `api.aus.vanta.com` (SSRF allowlist). See [`SAFETY.md`](SAFETY.md).

## Dispatch — when to use what

| User intent | Command |
|---|---|
| Compliance status / framework progress | `elnora-vanta frameworks list` — framework ids are org-specific (e.g. `soc2`, `iso27001` as examples); always discover them here, never assume |
| Failing / flagged tests | `elnora-vanta tests list --status NEEDS_ATTENTION` |
| What a test checks, which entities fail | `elnora-vanta tests get <id>` · `elnora-vanta tests entities <id>` |
| Missing evidence | `elnora-vanta documents list --status "Needs document"` |
| Controls and their tests / evidence | `elnora-vanta controls list` · `elnora-vanta controls tests <id>` · `elnora-vanta controls documents <id>` |
| Serious CVEs | `elnora-vanta vulns list --severity HIGH` (also `CRITICAL`, `MEDIUM`, `LOW`) |
| SLA-overdue vulnerabilities | `elnora-vanta vulns list --overdue` |
| Look up a specific CVE | `elnora-vanta vulns list --cve CVE-2026-1234` · `--search <text>` |
| Affected assets / remediation state | `elnora-vanta vuln-assets list` · `elnora-vanta vuln-remediations list` |
| Risk register | `elnora-vanta risks list` |
| Personnel onboarding / security tasks | `elnora-vanta people list --task-status NOT_STARTED` (also `COMPLETED`, `IN_PROGRESS`, `FAILED`) |
| Vendors | `elnora-vanta vendors list` |
| Connected integrations | `elnora-vanta integrations list` |
| Policies (optionally per framework) | `elnora-vanta policies list --framework <id>` |
| Managed devices / access groups | `elnora-vanta computers list` · `elnora-vanta groups list` |
| Anything else | `elnora-vanta --help`, then `elnora-vanta <group> --help` |

## Output

Every command prints JSON to stdout — `{ "<data_key>": [...], "count": N }` — and JSON errors to stderr (`{ "error": …, "suggestion": … }`). Global flags on lists: `--compact` (save tokens), `--output json|table|csv`, `--fields id,name,status` (project columns), `--limit <n>`, `--page-size <n>`, `--no-color`. Shell completion: `elnora-vanta completion bash|zsh|fish|powershell`.

## Live compliance data stays local

The Claude Code `/vanta-sync` command writes cached reference files (`vanta-tests.md`, `vanta-documents.md`, `vanta-controls.md`, `vanta-vulns.md`) into `$VANTA_REFERENCES_DIR` (or the plugin's `references/` directory). These contain **your org's live compliance posture** and are gitignored — never commit them, never paste them into public issues. The repo ships only `*.template.md` placeholders with fake rows.

## Claude Code

The Claude Code plugin (`vanta-workspace`) adds a native skill, slash commands (`/vanta-status`, `/vanta-report`, `/vanta-vulns`, `/vanta-sync`), a `compliance-auditor` agent, and a hook that blocks any non-GET Vanta call. Install after the CLI:

```
/plugin marketplace add Elnora-AI/elnora-vanta
```

```
/plugin install vanta-workspace@elnora-vanta
```

Definitions in [`skills/`](skills/), [`commands/`](commands/), [`agents/`](agents/), [`hooks/`](hooks/).

To make Claude Code also load this file: `ln -s AGENTS.md CLAUDE.md`.

## Per-harness install

- **Codex CLI** — `AGENTS.md` auto-loads at repo root; also reads `~/.codex/AGENTS.md`. Add prompts in `~/.codex/prompts/*.md` mirroring the dispatch table for slash-style entry points.
- **Cursor** — reads `AGENTS.md` at repo root. Pin frequent verbs as `.cursor/rules/*.mdc` if desired.
- **Aider** — `aider --read AGENTS.md`, or `read: AGENTS.md` in `.aider.conf.yml`.
- **Continue / Amp / Jules / Roo** — read `AGENTS.md` at repo root automatically.

## Contributing to this repo

```sh
pnpm install
pnpm typecheck && pnpm lint && pnpm test && pnpm build
node scripts/check-no-populated-references.mjs
```

| Path | Purpose |
|---|---|
| `src/main.ts`, `src/commands/` | CLI entry + command groups (all read-only) |
| `src/auth.ts`, `src/client.ts`, `src/config.ts`, `src/output.ts` | OAuth client-credentials flow, GET-only HTTP client, env resolution, output layer |
| `skills/`, `commands/`, `agents/`, `hooks/` | Claude Code plugin surfaces |
| `references/` | Config + `*.template.md` placeholders — generated live-data files are gitignored |
| `__tests__/` | Vitest |

CI runs a publication guard (`scripts/check-no-populated-references.mjs`) that fails the build if a generated reference file — or its provenance marker — lands in a commit. Templates use the frontmatter line `source: template — run /vanta-sync`.

Security contact: security@elnora.ai · maintainer: opensource@elnora.ai (Elnora AI). Apache-2.0.
