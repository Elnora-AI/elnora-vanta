# Safety guardrails

`elnora-vanta` covers the whole documented Vanta API, and makes changing your
compliance program something you have to mean — without your posture data ever
entering a git repo. Three defense layers ship in this repository; the first
holds at the CLI layer, so it cannot be talked around by an agent.

## Layer 1: graded execution + scope separation

Every operation carries a risk level, generated from the OpenAPI documents in
`spec/` and asserted by the test suite:

| Risk | Methods | To execute |
|------|---------|------------|
| `read` | `GET` | runs immediately |
| `write` | `POST` `PUT` `PATCH` | `--confirm` |
| `destructive` | `DELETE`, and any `deactivate`/`archive`/`revoke`/`remove`/`offboard` operation | `--confirm` **and** `--force` |

Without those flags the CLI prints the exact request it *would* have sent —
method, path, query, body — and exits without sending it. `--dry-run` overrides
everything, so an agent handed a command line that already contains `--confirm`
still cannot mutate anything. The curated top-level commands (`frameworks`,
`tests`, `controls`, ...) remain read-only by construction: they call
`vantaFetch()`, which cannot issue anything but a `GET`.

**Read and write use separate OAuth scopes and separate tokens.** A read
request presents a `vanta-api.all:read` token cached at `token.json`; a write
presents a `vanta-api.all:write` token cached at `token-write.json`. A
deployment that never writes never requests the write scope, and never has a
write-capable token on disk.

That separation is the real control, because the credential itself may be more
powerful than you assume. If the OAuth client at
`https://app.vanta.com/settings/api` has been granted `vanta-api.all:write`,
Vanta **will** honour a write — the API does not stop you. To pin this CLI to
reads at the credential layer, grant the OAuth client only
`vanta-api.all:read`; every write then fails at Vanta's token endpoint rather
than relying on the flags alone.

Nothing leaves your machine except to Vanta: every request is checked against
an SSRF host allow-list (`api.vanta.com`, `api.eu.vanta.com`,
`api.aus.vanta.com`) over HTTPS only. No telemetry, no analytics, no
third-party endpoint.

### Credentials

- `VANTA_CLIENT_ID` / `VANTA_CLIENT_SECRET` resolve from the environment first,
  then `~/.config/elnora-vanta/.env` (or `$VANTA_CONFIG_DIR/.env`), then a
  `.env` next to the installed CLI. The environment always wins.
- `.env` parsing uses a strict 3-key allow-list (`VANTA_CLIENT_ID`,
  `VANTA_CLIENT_SECRET`, `VANTA_API_BASE_URL`) — nothing else in the file is
  read, and no directory outside the config dir or the CLI's own folder is
  ever touched.
- The bearer token is cached at `~/.config/elnora-vanta/token.json` with mode
  `0600`.
- `VANTA_API_BASE_URL` is validated against the three-host allow-list above; a
  redirected or injected base URL fails before any request is made.

## Layer 2: PreToolUse hook

`hooks/block-destructive.py` is registered in `hooks/hooks.json` as a
`PreToolUse` hook on `Bash`. It draws a line the flags alone cannot: an agent
may read freely and may perform a confirmed non-destructive write, but
**`--force` is reserved for a human at a terminal**. It inspects every shell
command before execution and blocks:

- **Destructive executions** — any `elnora-vanta api ... --force`, the flag that
  turns a printed plan into a real deletion.
- **Write-shaped CLI calls** — `documents create` / `delete` / `bulk-delete` /
  `link` / `set-owner` invocations against the legacy command names.
- **HTTP writes to any Vanta regional host** — a real HTTP client (`curl`,
  `wget`, `http`, `httpie`) in the same statement as a Vanta API host and a
  `POST`/`PUT`/`PATCH`/`DELETE` method, covering all three regions.

The hook matches only real invocations at a statement boundary, so
`grep "POST api.vanta.com" docs.md` doesn't trip it. If the hook cannot parse
its input, it fails closed for anything that looks like a Vanta write.

### What this layer is, and is not

The hook is a heuristic over shell text. It reads the command an agent proposes
and decides whether it looks like a Vanta write; it does not run the command or
inspect the process. Shell is easy to write in ways a regex does not anticipate,
and a review of this rule found six routes to the same binary that it missed:
a backslash-newline splitting the command, `npx @elnora-ai/vanta`, a bare
`VAR=value` prefix, `pnpm exec`, `tsx src/main.ts`, and `pnpm dev` — plus a
wrapped `curl -X POST`, which is how anyone writes a curl carrying a body. All
of them are now covered and pinned by tests, which is the point worth taking
from it: the list of shapes is empirical, so treat it as one that will grow
again.

The hook also ships on its own schedule, and a session enforces the copy it
loaded rather than the copy on disk. The CLI comes from npm and the plugin from
the marketplace, so `npm install -g @elnora-ai/vanta@latest` upgrades the binary
and leaves the plugin where it was, and on an already-installed plugin
`/plugin install` reports it as installed and changes nothing. Updating the
plugin files is not enough either: the new hook takes effect only after
`/reload-plugins`, and only if the reload comes after the update. A plugin
installed at more than one scope updates per scope, so one scope can report the
new version while another still runs the old hook.

This was observed rather than reasoned about. On a machine running the 0.1.2
CLI with 0.1.2 plugin files on disk, in a session that had reloaded before the
update landed, `api vendors delete-by-id … --confirm --force` was not blocked
and the DELETE reached Vanta, while `documents delete …` in the same session
was blocked. The `documents delete` rule exists in both versions and the
`--force` rule only in the newer one, so the session was in all likelihood
still enforcing the older hook; that part is the conclusion the behaviour
supports rather than something read off disk. After `/reload-plugins` ran
again, the same `--force` command was refused by this hook's own message, and a
read, a confirmed non-destructive write and a `--confirm` without `--force` all
behaved correctly, so the rule itself is sound and the failure was the upgrade
window.

So: `/plugin marketplace update elnora-vanta`, then `/reload-plugins`, then
check that `elnora-vanta --version` matches the version `/plugin` reports for
every scope. Between the CLI upgrade and that reload, the flags in
`src/safety.ts` are the only thing standing between an agent and `--force`,
which is the sharpest available argument for treating them, and not this hook,
as the real control.

**The CLI's own gate is the control.** `--confirm` and `--force` are enforced in
`src/safety.ts` before any request is built, they apply to every caller
including scripts and cron that never pass through a hook, and the OAuth scope
sits underneath both. Read this layer as raising the cost of an accident inside
Claude Code, not as a boundary that holds against someone trying to get around
it. If you need a hard guarantee, grant the OAuth client `vanta-api.all:read`
and let Vanta refuse the write.

## Layer 3: publication guard (CI)

Cached references generated by `/vanta-sync` (`vanta-tests.md`,
`vanta-documents.md`, `vanta-controls.md`, `vanta-vulns.md`) contain **your
organization's live compliance posture**. They are gitignored and stay local;
the repo ships only `*.template.md` placeholders with obviously fake rows.

`scripts/check-no-populated-references.mjs` runs in CI and fails the build if
any of the following enters the tracked tree:

- a populated reference file (only `references/*.template.md` and
  `references/vanta-config.json` may be committed)
- the generated-file frontmatter marker that `/vanta-sync` writes into synced
  references
- a concrete `VANTA_CLIENT_ID` / `VANTA_CLIENT_SECRET` value
- a tenant-scoped `app.vanta.com` URL (these identify a real Vanta customer)
- an `@elnora.ai` email other than the OSS contacts

## Recommended extra hardening

If you want a belt-and-braces deny rule in your own project, add this to
`.claude/settings.json`:

```json
{
  "permissions": {
    "deny": [
      "Bash(elnora-vanta documents delete:*)",
      "Bash(elnora-vanta documents bulk-delete:*)",
      "Bash(elnora-vanta document delete:*)",
      "Bash(curl -X POST https://api.vanta.com:*)",
      "Bash(curl -X PUT https://api.vanta.com:*)",
      "Bash(curl -X PATCH https://api.vanta.com:*)",
      "Bash(curl -X DELETE https://api.vanta.com:*)"
    ]
  }
}
```

These commands are already impossible (the CLI has no write verbs, and the
hook blocks flag-order variants and the EU/AUS hosts) — the deny list just
adds a harness-level refusal that works even if the hook is disabled.

## What this does NOT do

- It does not make your posture data non-sensitive. The read scope exposes
  your full compliance state — failing tests, open vulnerabilities, vendor
  list. Treat the populated `references/*.md` files and the cached token like
  secrets: keep them gitignored and off shared machines.
- It does not restrict the Vanta dashboard or any other tool. A separate
  OAuth client with write scopes can still modify your Vanta data; keep the
  client used with this CLI scoped to `vanta-api.all:read` only.
- The hook inspects Bash tool calls inside Claude Code. Scripts run outside
  the agent bypass it — the `--confirm`/`--force` gate and the OAuth scope are
  the layers that still hold there.
