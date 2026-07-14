#!/usr/bin/env python3
"""
Vanta workspace auto-sync check - Cross-platform Python version
Checks if reference data is stale and provides reminder
"""

import json
import os
import sys
import time
from pathlib import Path


def load_config(refs_dir: Path, plugin_refs_dir: Path) -> dict:
    """Load vanta-config.json (from the references dir, else the plugin), falling back to defaults."""
    config_path = refs_dir / "vanta-config.json"
    if not config_path.exists():
        config_path = plugin_refs_dir / "vanta-config.json"
    defaults = {"freshHours": 24, "warnHours": 72, "urgentHours": 168}
    try:
        with open(config_path) as f:
            config = json.load(f)
        return config.get("staleness", defaults)
    except OSError:
        return defaults  # File missing — expected on first setup
    except json.JSONDecodeError as e:
        sys.stderr.write(
            f"Warning: Invalid JSON in {config_path}: {e}. Using default staleness thresholds.\n"
        )
        return defaults


def get_file_age_hours(file_path: Path) -> int:
    """Get file age in hours. Returns 999 if file doesn't exist, -1 on filesystem error."""
    if not file_path.exists():
        return 999

    try:
        mtime = file_path.stat().st_mtime
        now = time.time()
        age_seconds = now - mtime
        age_hours = int(age_seconds / 3600)
        return age_hours
    except OSError as e:
        sys.stderr.write(f"Warning: could not stat {file_path}: {e}\n")
        return -1


def main():
    # Get plugin root
    plugin_root = os.environ.get("CLAUDE_PLUGIN_ROOT")
    if plugin_root:
        plugin_root = Path(plugin_root)
    else:
        plugin_root = Path(__file__).parent.parent

    # Populated references live next to the templates by default; users who
    # keep them elsewhere (e.g. a private repo) point VANTA_REFERENCES_DIR there.
    refs_override = os.environ.get("VANTA_REFERENCES_DIR")
    refs_dir = Path(refs_override) if refs_override else plugin_root / "references"

    # Check all reference files
    ref_files = [
        refs_dir / "vanta-tests.md",
        refs_dir / "vanta-documents.md",
        refs_dir / "vanta-controls.md",
        refs_dir / "vanta-vulns.md",
    ]

    # Find the oldest reference file
    ages = [get_file_age_hours(f) for f in ref_files]
    max_age = max(ages) if ages else 999

    # Check if any reference files are missing
    missing = [f.name for f in ref_files if not f.exists()]

    staleness = load_config(refs_dir, plugin_root / "references")
    fresh_hours = staleness.get("freshHours", 24)
    warn_hours = staleness.get("warnHours", 72)
    urgent_hours = staleness.get("urgentHours", 168)

    if missing:
        print(f"Vanta reference files missing: {', '.join(missing)}. Run /vanta-sync to initialize.")
    elif max_age > urgent_hours:
        print("Vanta reference data is over a week old. Run /vanta-sync to refresh compliance data.")
    elif max_age > warn_hours:
        print(f"Vanta reference data is {max_age} hours old. Consider running /vanta-sync for fresh data.")
    elif max_age > fresh_hours:
        print(f"Vanta reference data last updated {max_age} hours ago.")
    # Data is fresh — no message needed


if __name__ == "__main__":
    main()
