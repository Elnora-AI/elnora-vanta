# Security Policy

## Supported Versions

The latest published `0.x` release is supported. Once `1.0.0` ships, the current
major line is supported.

## Reporting a Vulnerability

**DO NOT open a public GitHub issue for security vulnerabilities.**

Please report security vulnerabilities via one of the following channels:

- **Email:** [security@elnora.ai](mailto:security@elnora.ai)
- **GitHub Security Advisories:** [Report a vulnerability](https://github.com/Elnora-AI/elnora-vanta/security/advisories/new)

Include as much detail as possible:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Response Timeline

- **Acknowledgement:** Within 48 hours of report
- **Initial assessment:** Within 5 business days
- **Fix and disclosure:** Within 90 days of report

## Responsible Disclosure

We follow a 90-day disclosure timeline. We ask that you:

- Allow us reasonable time to fix the issue before public disclosure
- Do not access or modify other users' data
- Do not perform actions that could negatively impact other users
- Act in good faith to avoid privacy violations, data destruction, and service disruption

## Scope

**In scope:**

- The `elnora-vanta` CLI and plugin code in this repository
- Credential handling: env-var resolution, `~/.config/elnora-vanta/.env` storage
  (or `$VANTA_CONFIG_DIR/.env`), the token cache at
  `~/.config/elnora-vanta/token.json`, and secret redaction in output and logs
- The read-only guarantee (anything that lets the CLI issue a non-GET request)
- The SSRF regional-host allow-list (`api.vanta.com`, `api.eu.vanta.com`, `api.aus.vanta.com`)
- The publication guard (`scripts/check-no-populated-references.mjs`)

**Out of scope:**

- The Vanta API and platform themselves (report to Vanta)
- Third-party dependencies (please report to their respective maintainers)
- The scopes a user grants their own Vanta OAuth client — those are the user's choice
- Social engineering attacks against Elnora staff
- Denial of service attacks
- Issues in services not operated by Elnora

## Security Best Practices for Users

- Never commit credentials to version control — keep `VANTA_CLIENT_ID` /
  `VANTA_CLIENT_SECRET` in `~/.config/elnora-vanta/.env` (or your environment).
- Create the OAuth client with **only** the `vanta-api.all:read` scope. The CLI
  is read-only by design and never needs write scopes.
- Rotate the client secret periodically, and revoke immediately if it is exposed.
- The token cache (`~/.config/elnora-vanta/token.json`) is written with mode
  `0600`; delete it after revoking a client.
- Keep the generated `vanta-*.md` reference cache out of version control — it
  contains your org's live compliance posture and is gitignored by default.
