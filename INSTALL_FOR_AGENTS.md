# INSTALL_FOR_AGENTS.md — `elnora-vanta` setup

A gated, step-by-step runbook for an AI agent installing `elnora-vanta` for a
user. Do the steps **in order**, and **stop at each checkpoint** for the user to
act or confirm — you cannot create a Vanta OAuth client or read a secret on
their behalf without them. Never guess a credential, never paste a credential
into the chat, and never `echo` one in a command the user can see logged.

Two safety facts to keep in mind (and tell the user if they ask):

- The CLI is **strictly read-only** — HTTP GET only, enforced in code, by a
  guard hook, and by the OAuth scope. Nothing in this runbook can change their
  Vanta tenant.
- The CLI sends data **only** to `api.vanta.com` (or `api.eu.vanta.com` /
  `api.aus.vanta.com` for EU/AUS tenants). No telemetry, no third parties,
  nothing to Elnora.

At every step that involves a web page (app.vanta.com), **offer to drive the
browser** if you have a browser tool available (Chrome DevTools MCP, Playwright,
etc.): "I can open and walk this page for you, or you can do it and tell me when
it's done." If the user prefers to click themselves, wait for their confirmation
before moving on. If you have no browser tool, give the exact URL and what to
click.

---

## Step 0 — Prerequisites

Confirm Node.js >= 20:

```sh
node --version
```

If it's missing or older, have the user install Node 20+ before continuing.

---

## Step 1 — Install the CLI

```sh
npm install -g @elnora-ai/vanta
elnora-vanta --version
```

**Checkpoint:** `elnora-vanta --version` prints a version. If `command not
found`, the npm global bin dir isn't on PATH. Find it with `npm prefix -g`
(`npm bin -g` was removed in npm 9): the bin dir is `$(npm prefix -g)/bin` on
macOS/Linux and the prefix path itself on Windows. Add that dir to PATH, then
retry.

> The binary is `elnora-vanta`, not `vanta` — this avoids shadowing other
> tools named `vanta`.

---

## Step 2 — Create the Vanta OAuth client

The user creates **their own** OAuth client in **their own** Vanta tenant.
Nothing is shared with or hosted by Elnora. **The user must be a Vanta admin**
— if they aren't, stop here and have them loop one in.

1. Open [https://app.vanta.com/settings/api](https://app.vanta.com/settings/api).
   *(Offer to open and drive this page.)*
2. Create a new API app / OAuth client (name it something like
   `elnora-vanta-cli`).
3. Grant type: **client_credentials**.
4. Scope: select **only** `vanta-api.all:read`.

**Warn the user if they select anything broader.** Write scopes (or
`vanta-api.all:write`) grant powers this CLI will never use — the read scope is
the whole point, and it is the third layer of the read-only guarantee. If a
broader scope is already selected, ask them to remove it before creating the
client.

Vanta shows the **Client ID** and **Client Secret** on creation — the secret is
shown **once**. Tell the user to keep that page open until Step 3 is done.

**Checkpoint:** the OAuth client exists with the single read scope, and the
user can see the Client ID and Client Secret. Wait for them to confirm. Do not
ask them to read either value to you.

---

## Step 3 — Save the credentials

> **Heads-up for the user:** when a terminal prompt hides input, pasting shows
> **nothing** — no characters, no dots. That's hidden input working correctly,
> not a bug.

Write both values to the per-user config file (mode 0600). Have the **user**
run this so the secret never passes through the chat — give them the exact
commands with placeholders and let them substitute the real values themselves:

macOS / Linux:

```sh
mkdir -p ~/.config/elnora-vanta
umask 077
printf 'VANTA_CLIENT_ID=%s\n' 'PASTE_YOUR_CLIENT_ID' >> ~/.config/elnora-vanta/.env
printf 'VANTA_CLIENT_SECRET=%s\n' 'PASTE_YOUR_CLIENT_SECRET' >> ~/.config/elnora-vanta/.env
chmod 600 ~/.config/elnora-vanta/.env
```

Windows / PowerShell:

```powershell
$dir = "$env:USERPROFILE\.config\elnora-vanta"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
Add-Content "$dir\.env" "VANTA_CLIENT_ID=PASTE_YOUR_CLIENT_ID"
Add-Content "$dir\.env" "VANTA_CLIENT_SECRET=PASTE_YOUR_CLIENT_SECRET"
```

Alternatives, if the user prefers: set `VANTA_CLIENT_ID` / `VANTA_CLIENT_SECRET`
as process environment variables (they win over the file), or point
`VANTA_CONFIG_DIR` at a different directory containing the `.env`.

**Never display, `echo`, or log the secret. Never write it into a repo.**

**Checkpoint:** the `.env` file exists with both values. Wait for the user to
confirm.

---

## Step 4 — Smoke test

```sh
elnora-vanta frameworks list --compact
```

**Checkpoint:** JSON with a `frameworks` array and a `count`. This also proves
the OAuth flow: a token was fetched and cached at
`~/.config/elnora-vanta/token.json` (mode 0600) — the user never handles tokens
manually.

Troubleshooting:

- **Auth error** — re-check the Client ID/Secret in the `.env` (typos,
  truncated paste) and that the client's grant type is `client_credentials`
  with the `vanta-api.all:read` scope.
- **Errors on an EU or Australia tenant** — the default endpoint is
  `api.vanta.com`. Do Step 6 first, then re-run the smoke test.

The framework ids in the output are **your org's** — they vary per tenant
(examples elsewhere in these docs like `soc2` or `iso27001` are just examples).

---

## Step 5 — Optional: Claude Code plugin

If the user runs Claude Code, offer the plugin — it adds slash commands
(`/vanta-status`, `/vanta-report`, `/vanta-vulns`, `/vanta-sync`), a
`compliance-auditor` agent, and a hook that blocks any non-GET Vanta call.
Inside Claude Code:

```
/plugin marketplace add Elnora-AI/elnora-vanta
```

```
/plugin install vanta-workspace@elnora-vanta
```

Then run `/vanta-sync` once. It generates cached reference files
(`vanta-tests.md`, `vanta-documents.md`, `vanta-controls.md`,
`vanta-vulns.md`) into `$VANTA_REFERENCES_DIR` if set, else the plugin's
`references/` directory. **These files contain the org's live compliance
posture.** They are gitignored — never commit them, never paste their contents
anywhere public. Only the shipped `*.template.md` placeholders belong in git.

**Checkpoint:** `/vanta-status` returns a live dashboard, and the four generated `vanta-*.md` reference files exist.

---

## Step 6 — Optional: EU / Australia region

Only for tenants hosted in the EU or Australia. Append to the same `.env`
(or set as an environment variable):

```sh
# EU:
printf 'VANTA_API_BASE_URL=https://api.eu.vanta.com\n' >> ~/.config/elnora-vanta/.env
# Australia:
printf 'VANTA_API_BASE_URL=https://api.aus.vanta.com\n' >> ~/.config/elnora-vanta/.env
```

These two hosts and the default `https://api.vanta.com` are the **only** values
the CLI accepts — anything else is rejected by the SSRF allowlist. Re-run the
Step 4 smoke test after setting it.

---

Done. Point the user at [`AGENTS.md`](AGENTS.md) (dispatch table of intents →
commands) and [`SAFETY.md`](SAFETY.md) (the read-only guarantee in full).
Questions: opensource@elnora.ai · security issues: security@elnora.ai.
