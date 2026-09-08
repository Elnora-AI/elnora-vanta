# elnora-vanta

**Your Vanta compliance programme from the terminal. Ask what is failing, pull the evidence, fix what you can, and let an AI agent work on it with you. Reads run straight away, and a write shows you the request before it sends it.**

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/@elnora-ai/vanta)](https://www.npmjs.com/package/@elnora-ai/vanta)
[![CI](https://github.com/Elnora-AI/elnora-vanta/actions/workflows/ci.yml/badge.svg)](https://github.com/Elnora-AI/elnora-vanta/actions)

In your first ten minutes you can:

- See where you stand: `/vanta-status` gives framework completion, failing tests and overdue vulnerabilities in one shot.
- Triage vulnerabilities properly, filtering by severity, CVE, or what has blown its SLA.
- Reach the whole documented Vanta API, 321 operations across 38 resource groups, as `elnora-vanta api <group> <command>`.
- Reach the parts of Vanta that have no public REST endpoint, among them the answer library, knowledge base, privacy assessments and access reviews, through `elnora-vanta mcp`.
- Ask the compliance-auditor agent an open question like "what is blocking our audit?" and get an answer grounded in your live data.

> The binary is `elnora-vanta`, not `vanta`. Vanta and other tools may claim the bare name, so we keep our own.

> **A write takes a deliberate flag.** Without `--confirm` a write prints the request it would send and stops. A destructive operation also wants `--force`, and `--dry-run` beats both. See [Write safety](#write-safety).

---

## Install

The CLI and the Claude Code plugin are two installs. The plugin shells out to the `elnora-vanta` binary, so do the CLI first even if you only want the plugin.

### 1. Install the CLI

```sh
npm install -g @elnora-ai/vanta
elnora-vanta --version
```

Create a Vanta OAuth client (below), then check it works:

```sh
elnora-vanta frameworks list
```

### 2. Add the Claude Code plugin (optional)

Run these as two separate slash commands, waiting for the first to finish:

```
/plugin marketplace add Elnora-AI/elnora-vanta
```

```
/plugin install vanta-workspace@elnora-vanta
```

`/plugin` should then list `vanta-workspace` as enabled. If `elnora-vanta --version` fails, go back to step 1, because the skills need the binary on PATH.

### Upgrading

The CLI and the plugin ship through different channels and upgrade separately. Upgrade both together, because the plugin carries the `PreToolUse` hook that guards the CLI:

```sh
npm install -g @elnora-ai/vanta@latest      # the CLI
```

```
/plugin marketplace update elnora-vanta     # the plugin
/reload-plugins                             # then load it, in that order
```

The hook a session enforces is the one it loaded at start, not the one on disk, so the update takes effect only after the reload and only if the reload comes after it. A plugin can also be installed at more than one scope, and `/plugin` reports each separately, so check that every scope shows the new version rather than the first one you see.

Until then the newer binary is paired with the older hook, and a hook predating a guard it was written to enforce lets the command through. `elnora-vanta --version` and the version `/plugin` reports should match.

### Codex, Cursor, and other agents

Install the CLI, then drop [`AGENTS.md`](AGENTS.md) at your project root. Those agents read it natively and map intent to CLI commands. The plugin is Claude Code only. To have an agent do the install, point it at [`INSTALL_FOR_AGENTS.md`](INSTALL_FOR_AGENTS.md), a runbook that creates the OAuth client, collects credentials and smoke-tests, pausing for you at each step.

---

## Vanta OAuth setup

The OAuth client is yours: you create it, you hold the secret, and it stays on your machine.

1. Go to [app.vanta.com/settings/api](https://app.vanta.com/settings/api) and create an OAuth client with the `client_credentials` grant.
2. Choose its scopes deliberately.
   - `vanta-api.all:read` alone is the safest default. Reads work, and writes fail at Vanta itself, so the CLI's flags are not the last line of defence.
   - Add `vanta-api.all:write` if you intend to change things. The CLI still asks for `--confirm`, and `--force` when destructive, and the credential can now modify your compliance data.
3. Copy the client ID and secret.
4. Save them:
   ```sh
   mkdir -p ~/.config/elnora-vanta
   printf 'VANTA_CLIENT_ID=your-client-id\nVANTA_CLIENT_SECRET=your-client-secret\n' >> ~/.config/elnora-vanta/.env
   chmod 600 ~/.config/elnora-vanta/.env
   ```
5. Run `elnora-vanta frameworks list` and you should see your enrolled frameworks.

Credentials resolve from the process environment first, then `~/.config/elnora-vanta/.env` (or `$VANTA_CONFIG_DIR/.env`), then a `.env` beside the CLI. Tokens are cached at mode `0600` and refreshed when they expire.

### Regions

The default API base is `https://api.vanta.com`. EU and Australian tenants set one of:

```sh
VANTA_API_BASE_URL=https://api.eu.vanta.com
VANTA_API_BASE_URL=https://api.aus.vanta.com
```

Requests are pinned to those three hosts, and any other base URL is rejected.

---

## Using it

### Everyday commands

`frameworks`, `tests`, `controls`, `documents`, `vulns`, `risks`, `people`, `policies`, `vendors`, `groups`, `integrations`, `computers`, `vuln-assets`, `vuln-remediations`. These are read-only by construction and cover the usual questions:

```sh
elnora-vanta vulns list --severity CRITICAL --overdue
elnora-vanta policies list --framework soc2
elnora-vanta tests list --limit 20
```

Frameworks are discovered per organisation, so run `elnora-vanta frameworks list` to see yours. Where the docs show an id like `soc2`, it is an example rather than an assumption.

### The full API

Everything Vanta documents lives under `api`, generated from the OpenAPI specs in `spec/`. Search instead of guessing command names:

```sh
elnora-vanta api search "policy"             # find operations by name, path or summary
elnora-vanta api search --risk destructive   # everything that can delete
elnora-vanta api controls list-controls
elnora-vanta api --help                      # all 38 groups
```

Some endpoint families answer `403` on a standard management client, among them integration connectors, secrets, security tasks, user accounts, per-device records, audits and contracts. Vanta gates those on a differently scoped app, so the request is correct and Vanta is declining it.

To pick up Vanta API changes: `pnpm spec:fetch && pnpm generate && pnpm build`

### Capabilities outside the REST API

The answer library, knowledge base, privacy assessments, access reviews, TPRM assessment automations and policy generation live on Vanta's hosted MCP server. That wants a Vanta Admin sign-in rather than the service token:

```sh
elnora-vanta mcp login                        # browser, once
elnora-vanta mcp tools                        # what your tenant exposes, with risk and arguments
elnora-vanta mcp tools --name generatePolicy  # one tool's input schema
elnora-vanta mcp call getSlas
```

The tool list is read from your own tenant at run time, so it reflects the Vanta features you have. `mcp call` follows the same write rules as `api`. EU and Australian tenants set `VANTA_MCP_URL`, pinned to Vanta's three MCP hosts.

### Output

Commands print JSON to stdout, and errors go to stderr as `{error, suggestion}`. Global flags: `--compact`, `--output json|table|csv`, `--fields <list>`, `--no-color`, plus `--page-size` and `--limit` on lists. Shell completion comes from `elnora-vanta completion bash|zsh|fish|powershell`.

Exit codes: `0` success, `2` usage, `3` auth, `4` not found, `5` rate limit, `6` a write refused for want of `--confirm` or `--force`.

---

## Write safety

| Risk | Operations | To run it |
|---|---|---|
| `read` | `GET` | runs immediately |
| `write` | `POST`, `PUT`, `PATCH` | `--confirm` |
| `destructive` | `DELETE`, and anything that deactivates, archives, revokes, removes or offboards | `--confirm` and `--force` |

Without the flags you get the request that would have been sent, and nothing goes to Vanta:

```console
$ elnora-vanta api vendors delete-by-id VENDOR-ID
{
  "dryRun": true,
  "wouldRequest": { "operationId": "DeleteById", "method": "DELETE", "path": "/vendors/VENDOR-ID", "risk": "destructive" },
  "blocked": "This destructive operation was not sent.",
  "addFlags": ["--confirm", "--force"]
}
```

A refusal exits `6`, so a script or an agent can tell it apart from success. `--dry-run` wins over `--confirm`, which means an agent handed a ready-made command line still cannot change anything. The plugin's hook goes further and blocks `--force`, keeping deletions with a person at a terminal.

Reads and writes use separate OAuth scopes and separate cached tokens, so an install that only reads asks for the read scope alone. Requests go to `api.vanta.com`, `api.eu.vanta.com` or `api.aus.vanta.com` and nowhere else. Credentials sit in a `0600` file, tokens are cached at `0600`, and secrets are redacted on every error path.

Full details, including the limits of each layer, are in [SAFETY.md](SAFETY.md).

---

## What the plugin adds

| Surface | What it does |
|---|---|
| `vanta-workspace` skill | Routes a question to the right command, and reads the cached reference before calling the API |
| `compliance-auditor` agent | Answers open questions on audit readiness, failing tests and evidence gaps from live data |
| `/vanta-status` | Posture snapshot: framework completion, failing tests, overdue vulnerabilities |
| `/vanta-sync` | Regenerates the cached compliance reference from live data |
| `/vanta-vulns` | Vulnerability triage by severity, overdue SLA and CVE |
| `/vanta-report` | A compliance report drafted from live data |
| SessionStart hook | Says when the cached reference has gone stale |
| PreToolUse hook | Blocks `--force`, so an agent cannot execute a destructive operation |

### The compliance reference cache

The plugin keeps a snapshot of your compliance data so agents can answer posture questions without an API round trip. It ships as `references/*.template.md` with obviously fake rows, and `/vanta-sync` writes the real files to `$VANTA_REFERENCES_DIR`, or beside the templates if that is unset.

Treat the generated files as sensitive, because they are your live security posture: failing controls, open vulnerabilities, evidence gaps. They are gitignored, and a CI guard fails the build if generated data is ever committed. Every real row comes from your own synced cache, and this repository ships none of it.

---

## Part of the Elnora family

Open-source agent tooling from [Elnora AI](https://github.com/Elnora-AI): free, config-driven tools that wire Claude Code, or any AI coding agent, into the systems you run your company on. Each one works standalone, and they chain together when you install several.

<!-- ELNORA-FAMILY:START -->
- [elnora-linear](https://github.com/Elnora-AI/elnora-linear) — Linear issue management — search, bulk edit, agents, and a config-driven curator
- [elnora-slack](https://github.com/Elnora-AI/elnora-slack) — the entire Slack Web API as a CLI plus agent skills with a draft-and-approve send gate
- [elnora-whatsapp](https://github.com/Elnora-AI/elnora-whatsapp) — read, search, and send WhatsApp from your own paired account, 100% local
- [elnora-google-workspace](https://github.com/Elnora-AI/elnora-google-workspace) — Gmail, Calendar, Drive, Docs, Sheets, Forms, Tasks, plus any Google API via Discovery
- [elnora-merit-aktiva](https://github.com/Elnora-AI/elnora-merit-aktiva) — Merit Aktiva accounting and Merit Palk payroll as a CLI and plugin
- [elnora-luma](https://github.com/Elnora-AI/elnora-luma) — Luma (lu.ma) events — all 61 public API endpoints as a spec-driven CLI with safety guardrails
- [elnora-travel](https://github.com/Elnora-AI/elnora-travel) — a real travel agent — live flights, hotels, Airbnb, Booking.com, and routes in one itinerary
- [elnora-websearch-tools](https://github.com/Elnora-AI/elnora-websearch-tools) — web search — Exa, Tavily, Perplexity, Firecrawl, and Valyu CLIs and skills in one plugin
- [knowledge-vault](https://github.com/Elnora-AI/knowledge-vault) — an Obsidian-compatible knowledge base for agent teams — search and save your work to any vault
<!-- ELNORA-FAMILY:END -->

## Contributing

Issues and PRs are welcome at [github.com/Elnora-AI/elnora-vanta](https://github.com/Elnora-AI/elnora-vanta)

Keep the safety grading intact. A new mutating operation has to be classified `write` or `destructive` and go through the same gate, and a change that lets a write execute without `--confirm` will be sent back. Questions: opensource@elnora.ai

## Security

Report a vulnerability to security@elnora.ai rather than opening a public issue. [SAFETY.md](SAFETY.md) has the threat model.

## License

[Apache-2.0](LICENSE) © Elnora AI
