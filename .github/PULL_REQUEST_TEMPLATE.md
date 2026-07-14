## Summary

<!-- What does this PR do? 1-3 bullet points. -->

## PR Title Convention

> **Important:** PR titles must use [Conventional Commits](https://www.conventionalcommits.org/) format.
> Release Please parses the **squash-merge commit message** (which defaults to the PR title) to determine version bumps and changelog entries. A PR merged without a conventional prefix will not trigger a release.

| Prefix | Version bump | Example |
|--------|-------------|---------|
| `fix:` | Patch (0.0.x) | `fix: paginate past 100 results in vulns list` |
| `feat:` | Minor (0.x.0) | `feat: add --severity flag to vulns list` |
| `feat!:` or `BREAKING CHANGE:` | Major (x.0.0) | `feat!: rename VANTA_CONFIG_DIR env var` |
| `chore:` | No release | `chore: update dev dependencies` |
| `docs:` | No release | `docs: clarify credential resolution order` |
| `style:` | No release | `style: fix lint warnings` |
| `refactor:` | No release | `refactor: extract output formatting` |
| `test:` | No release | `test: add read-only enforcement cases` |
| `ci:` | No release | `ci: pin actions to commit SHAs` |
| `build:` | No release | `build: drop unused dependency` |

Optional scope: `fix(vulns): ...`, `feat(tests): ...`

## Testing

- [ ] `pnpm install` succeeds
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes
- [ ] `pnpm build` succeeds
- [ ] `node dist/main.js --version` and `--help` both work
- [ ] `node scripts/check-no-populated-references.mjs` passes
- [ ] If touching command coverage: tested against a real Vanta tenant (read-only OAuth client)

## Related Issues

<!-- Link related issues: Fixes #NN, Refs #NN -->
