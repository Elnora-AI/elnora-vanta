---
updated: never (template)
source: template — run /vanta-sync
---

<!--
  TEMPLATE — this file ships with the plugin and contains only fake example rows.
  Run `/vanta-sync` to generate the real vanta-controls.md next to this template
  (or in $VANTA_REFERENCES_DIR if set). The generated file is your org's live
  compliance posture — it is gitignored and must never be committed.

  Framework IDs are discovered per org (`elnora-vanta frameworks list`), never
  hardcoded. Every row below is fake.
-->

# Security Controls by Framework

## Framework Summary

| Framework | Controls Completed | Documents | Tests |
|-----------|-------------------|-----------|-------|
| Example Framework A (fake) | 0/0 | 0/0 | 0/0 |
| Example Framework B (fake) | 0/0 | 0/0 | 0/0 |

## Quick Lookup

Discover your org's frameworks first, then query controls with the CLI:

```bash
# Discover framework IDs enrolled for your org
elnora-vanta frameworks list

# List controls for a framework (framework IDs are examples — use your own)
elnora-vanta controls list --framework soc2
elnora-vanta controls list --framework iso27001

# Get specific control details
elnora-vanta controls get <control-id>

# List tests for a control
elnora-vanta controls tests <control-id>

# List documents for a control
elnora-vanta controls documents <control-id>
```

Template placeholder. Run `/vanta-sync` for real data.
