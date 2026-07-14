# elnora-vanta

**Read-only Vanta compliance data as a CLI and a Claude Code plugin — frameworks, failing tests, controls, evidence gaps, and vulnerabilities as clean, agent-friendly JSON. Built for AI agents and humans to query compliance posture from the terminal, with zero write access.**

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/@elnora-ai/vanta)](https://www.npmjs.com/package/@elnora-ai/vanta)
[![CI](https://github.com/Elnora-AI/elnora-vanta/actions/workflows/ci.yml/badge.svg)](https://github.com/Elnora-AI/elnora-vanta/actions)

What you can do in your first ten minutes:

- Query **your whole Vanta compliance surface** — frameworks, tests, controls, documents, vulnerabilities, risks, people, vendors, integrations — as `elnora-vanta <group> <command> --flags`, with clean JSON out.
- Get an instant **compliance snapshot**: `/vanta-status` shows framework completion, failing tests, and overdue vulnerabilities in one shot.
- Keep a **cached compliance reference** (tests, controls, documents, vulns) so agents answer posture questions without an API round-trip.
- Triage vulnerabilities the useful way: `elnora-vanta vulns list --severity CRITICAL --overdue`, filter by CVE, search by name.
- Ask the **compliance-auditor agent** open questions ("what's blocking our audit?") and get answers grounded in your live Vanta data.
- One-line plugin install in Claude Code: `/plugin marketplace add Elnora-AI/elnora-vanta`.

> **The binary is `elnora-vanta`, not `vanta`.** Vanta and other tools may claim the bare `vanta` name; we deliberately don't shadow it.

> **Strictly read-only.** The CLI performs HTTP GET requests only — enforced in code, by a `PreToolUse` guard in the plugin, and by the OAuth scope itself (`vanta-api.all:read`). It cannot change anything in your Vanta account. See [Read-only guarantee](#read-only-guarantee).

---

## Install

> **The CLI and the Claude Code plugin are two separate installs.** The plugin's skills, agent, and slash commands shell out to the `elnora-vanta` binary, so install the CLI **first**, even if you only want the plugin. `/plugin install` does not install the CLI.

### Step 1 — Install the CLI (required for everyone)

```sh
npm install -g @elnora-ai/vanta
elnora-vanta --version
```

Then create a Vanta OAuth client (see [Vanta OAuth setup](#vanta-oauth-setup)) and smoke-test:

```sh
elnora-vanta frameworks list
```

### Step 2 — Add the Claude Code plugin (optional, Claude Code only)

**Only after Step 1 succeeds.** Run these as **two separate slash commands** (paste the first, hit enter, wait, then paste the second):

```
/plugin marketplace add Elnora-AI/elnora-vanta
```

```
/plugin install vanta-workspace@elnora-vanta
```

Then `/plugin` inside Claude Code should list `vanta-workspace` as enabled. If `elnora-vanta --version` fails, go back to Step 1 — the skills won't work without the binary on PATH.

### Using Codex, Cursor, or any other AI coding agent

Install the CLI (Step 1), then drop [`AGENTS.md`](AGENTS.md) at your project root. Those agents read it natively for the intent → CLI mapping. No plugin needed — the plugin is Claude-Code-only.

> **Installing via an AI agent?** Point it at [`INSTALL_FOR_AGENTS.md`](INSTALL_FOR_AGENTS.md) — a gated, step-by-step runbook that creates the OAuth client, collects credentials, and smoke-tests, offering to drive the browser for you at each step.

---

## Vanta OAuth setup

You create **your own** OAuth client — nothing is shared or hosted by us.

1. Go to [app.vanta.com/settings/api](https://app.vanta.com/settings/api) → **Create** an OAuth client with the **client_credentials** grant.
2. Grant it **only** the `vanta-api.all:read` scope. Do not grant any write scope — the CLI never uses one, and a read-only credential means even a compromised token can't change your compliance posture.
3. Copy the **Client ID** and **Client Secret**.
4. Save them:
   ```sh
   mkdir -p ~/.config/elnora-vanta
   printf 'VANTA_CLIENT_ID=your-client-id\nVANTA_CLIENT_SECRET=your-client-secret\n' >> ~/.config/elnora-vanta/.env
   chmod 600 ~/.config/elnora-vanta/.env
   ```
5. `elnora-vanta frameworks list` should return your enrolled frameworks.

Credential resolution order: process environment (`VANTA_CLIENT_ID` / `VANTA_CLIENT_SECRET`) → `~/.config/elnora-vanta/.env` (or `$VANTA_CONFIG_DIR/.env`) → a `.env` next to the CLI. Access tokens are cached automatically at `~/.config/elnora-vanta/token.json` (mode `0600`) and refreshed when expired.

### Regions

The default API base is `https://api.vanta.com`. EU and Australian tenants set:

```sh
# EU
VANTA_API_BASE_URL=https://api.eu.vanta.com
# Australia
VANTA_API_BASE_URL=https://api.aus.vanta.com
```

An SSRF allow-list pins requests to exactly these three hosts — any other base URL is rejected.

---

## What you get

- **`elnora-vanta` CLI** *(npm — Step 1)* — read-only coverage of the Vanta API, scriptable and JSON-pipeable, with structured errors agents can self-correct from.
- **`vanta-workspace` Claude Code plugin** *(separate `/plugin install` — Step 2)* — a skill, an agent, four slash commands, and two hooks, all delegating to the CLI.

### Claude Code surfaces

| Surface | Does |
|---|---|
| `vanta-workspace` skill | Router + quick reference for the whole CLI; reads the cached compliance reference before hitting the API |
| `compliance-auditor` agent | Answers open compliance questions — audit readiness, failing tests, evidence gaps — grounded in live Vanta data |
| `/vanta-status` | One-shot posture snapshot: framework completion, failing tests, overdue vulns |
| `/vanta-sync` | Regenerates the reference cache (`vanta-tests.md`, `vanta-documents.md`, `vanta-controls.md`, `vanta-vulns.md`) from live Vanta data |
| `/vanta-vulns` | Vulnerability triage — severity buckets, overdue SLAs, CVE lookup |
| `/vanta-report` | Compliance report drafted from live data |
| SessionStart hook | Nags when the reference cache is stale |
| PreToolUse hook | Blocks any non-GET Vanta API call an agent might attempt — the destructive-operation guard |

### Command groups

`completion`, `computers`, `controls` (list/get/tests/documents), `documents` (list/get/files/links), `frameworks`, `groups`, `integrations`, `people` (`--task-status`), `policies` (`--framework`), `risks`, `tests` (list/get/entities), `vendors`, `vuln-assets`, `vuln-remediations`, `vulns` (list with `--severity`, `--overdue`, `--cve`, `--search`).

Every command prints JSON to stdout (`{ "<data_key>": [...], "count": N }`); errors go to stderr as `{error, suggestion}`. Global flags: `--compact`, `--output json|table|csv`, `--fields <list>`, `--no-color`, plus `--page-size <n>` and `--limit <n>` on lists. Shell completion via `elnora-vanta completion bash|zsh|fish|powershell`.

Frameworks are **discovered per org** — run `elnora-vanta frameworks list` to see yours. Where docs show a framework id (e.g. `soc2`, `iso27001`), it's an example, not an assumption.

Run `elnora-vanta --help` for every group, and `elnora-vanta <group> --help` for its commands.

---

## The compliance reference cache

The plugin keeps a cached snapshot of your compliance data so agents answer posture questions instantly. It ships as `references/*.template.md` with obviously fake rows. Run `/vanta-sync` to generate the real files — `vanta-tests.md`, `vanta-documents.md`, `vanta-controls.md`, `vanta-vulns.md` — written to `$VANTA_REFERENCES_DIR` if set, otherwise next to the templates inside the plugin (gitignored).

**Treat the generated files as sensitive.** They are your org's live security posture — failing controls, open vulnerabilities, evidence gaps. They are gitignored and must never be committed; a publication guard in CI enforces that nothing generated ever lands in the repo. There is no real compliance data anywhere in this repository — every real row comes from your own synced cache.

---

## Read-only guarantee

- **HTTP GET only, enforced three ways**: the HTTP client refuses non-GET methods in code, the plugin's `PreToolUse` hook blocks any attempt at a mutating Vanta call, and the OAuth scope `vanta-api.all:read` means the token itself cannot write.
- **SSRF allow-list** — requests go only to `api.vanta.com`, `api.eu.vanta.com`, or `api.aus.vanta.com`.
- **Secrets stay local** — credentials in a `0600` `.env`, tokens cached at `0600`, secrets redacted on every error path.
- **Nothing leaves your machine** except GET requests to Vanta's own API.

Full details in [SAFETY.md](SAFETY.md).

---

## Part of the Elnora family

Open-source agent tooling from [Elnora AI](https://github.com/Elnora-AI), one repo per tool:

- [elnora-linear](https://github.com/Elnora-AI/elnora-linear) — Linear issue management
- [elnora-slack](https://github.com/Elnora-AI/elnora-slack) — the entire Slack Web API as a CLI + plugin
- [elnora-whatsapp](https://github.com/Elnora-AI/elnora-whatsapp) — WhatsApp for agents
- [elnora-google-workspace](https://github.com/Elnora-AI/elnora-google-workspace) — Gmail, Calendar, Drive, Docs, Sheets
- [elnora-merit-aktiva](https://github.com/Elnora-AI/elnora-merit-aktiva) — Merit Aktiva accounting
- [knowledge-vault](https://github.com/Elnora-AI/knowledge-vault) — Obsidian-compatible knowledge base for agent teams
- [elnora-cli](https://github.com/Elnora-AI/elnora-cli) — the Elnora platform CLI

---

## Contributing

Issues and PRs welcome at [github.com/Elnora-AI/elnora-vanta](https://github.com/Elnora-AI/elnora-vanta). Keep changes read-only by design — anything that adds a mutating API call will not be merged. Questions: opensource@elnora.ai.

## Security

Found a vulnerability? Email security@elnora.ai — do not open a public issue. See [SAFETY.md](SAFETY.md) for the threat model.

## License

[Apache-2.0](LICENSE) © Elnora AI
