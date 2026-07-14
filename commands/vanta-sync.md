---
name: vanta-sync
description: Refresh cached Vanta reference files with current API data
user_invocable: true
allowed-tools:
  - Bash
  - Read
  - Write
---

# /vanta-sync — Refresh Cached References

Fetch current compliance state from the Vanta API (read-only) and write it to
the reference files. Uses the `elnora-vanta` CLI (must be on PATH — see the
vanta-workspace skill for install and auth).

## Steps

1. Discover the org's enrolled frameworks — never assume which ones exist:

```bash
elnora-vanta frameworks list
```

2. Fetch the rest via Bash in parallel, including one `controls list` per
   framework id discovered in step 1:

```bash
elnora-vanta tests list --status NEEDS_ATTENTION
elnora-vanta documents list
elnora-vanta vulns list
elnora-vanta controls list --framework <id>   # repeat per discovered framework id
```

3. Resolve the output directory: `$VANTA_REFERENCES_DIR` if set, otherwise
   `${CLAUDE_PLUGIN_ROOT}/references/`.

4. Write the results to four files in that directory:

- `vanta-tests.md` — failing tests summary
- `vanta-documents.md` — all documents with status
- `vanta-controls.md` — controls grouped by framework
- `vanta-vulns.md` — vulnerabilities with SLA dates

Each file gets YAML frontmatter with two fields, then compact markdown
tables:

- `updated:` — the ISO 8601 timestamp of this sync
- `source:` — replace the template's placeholder value with the phrase
  "Vanta API", then the word "via", then "vanta-workspace CLI", all on one
  line (see the shipped `*.template.md` files for the exact frontmatter
  shape; this value marks the file as generated)

5. These files now contain your org's live compliance posture. They are
   gitignored and must never be committed — the publication guard fails CI
   on the generated-file source marker.

6. Report what changed since the last sync (compare against the previous
   file contents before overwriting).
