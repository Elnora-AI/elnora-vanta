# Contributing to `elnora-vanta`

Thanks for your interest. This project is open to community contributions.

## Bug Reports and Feature Requests

Open an issue using the appropriate template:

- **Bug report** — something doesn't work, or works differently than documented
- **Feature request** — a new command, skill, or capability you'd find useful

Please search existing issues first so we can avoid duplicates.

## Pull Requests

PRs are welcome from anyone. The Elnora engineering team reviews and merges.

Before opening a PR:

1. Open an issue first if the change is non-trivial — saves you time if we'd prefer a different approach.
2. Fork the repo, create a feature branch off `main`.
3. Match the existing style (Biome enforces formatting; `pnpm lint:fix` cleans it up).
4. Add tests (Vitest) for new behavior.
5. Use [Conventional Commits](https://www.conventionalcommits.org/) in your PR title — Release Please uses these to generate version bumps and changelog entries.
6. Run the full local check before pushing:
   ```bash
   pnpm install
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm build
   node scripts/check-no-populated-references.mjs
   ```
7. Open the PR against `main`. CI runs automatically; an Elnora maintainer will review.

## A note on write safety

The CLI covers the whole Vanta API, but a write never happens by accident.
Every operation carries a risk grade asserted by the test suite: `read` runs,
`write` requires `--confirm`, and `destructive` requires `--confirm` and
`--force`. `--dry-run` overrides all of it, and the PreToolUse hook blocks
`--force` so destructive changes stay with a human.

Keep that grading intact. A PR that adds a mutating operation must classify it
and route it through `evaluateSafety()`; anything that lets a write execute
without `--confirm`, or that grades a cascading or deleting operation as merely
`write`, will be declined — it's a design constraint, not an oversight.

## Conventional Commit Types

| Prefix | Version bump | When to use |
|--------|--------------|-------------|
| `fix:` | Patch | Bug fixes |
| `feat:` | Minor | New features |
| `feat!:` or `BREAKING CHANGE:` | Major | Breaking changes |
| `chore:`, `docs:`, `style:`, `refactor:`, `test:`, `ci:`, `build:`, `perf:`, `revert:` | None | Maintenance, no release |

## Security Issues

**Do not open a public issue for security vulnerabilities.** Use one of the private channels listed in [SECURITY.md](SECURITY.md).

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating you agree to uphold it.
