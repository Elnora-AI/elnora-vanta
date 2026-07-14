#!/usr/bin/env node
// Publication guard for elnora-vanta.
//
// Fails (exit 1) if anything that would leak a private compliance posture, a
// real credential, or Elnora-internal data has entered the tracked file set:
//
//   1. A populated reference file is tracked (only references/*.template.md and
//      references/vanta-config.json may be committed — the real vanta-*.md are
//      gitignored and stay local).
//   2. A synced-posture marker ("source: Vanta API via" frontmatter) in any
//      tracked file — that line is written by /vanta-sync into generated files
//      and must never appear in the repo outside this guard.
//   3. A concrete VANTA_CLIENT_ID / VANTA_CLIENT_SECRET value (anything other
//      than an obvious placeholder).
//   4. A tenant-scoped Vanta app URL (app.vanta.com/c/<tenant>/…) — these
//      encode a real customer tenant.
//   5. An @elnora.ai email other than the allowed OSS contacts.
//
// Run locally:  node scripts/check-no-populated-references.mjs
// Run in CI:    same; a non-zero exit surfaces the violators.

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const SELF = "scripts/check-no-populated-references.mjs";

function trackedFiles() {
	return execSync("git ls-files", { encoding: "utf8" })
		.split("\n")
		.map((s) => s.trim())
		.filter(Boolean);
}

// Patterns are assembled from fragments so this guard file contains no literal
// forbidden string (a repo-wide grep for the raw patterns must not hit here).
const SYNC_MARKER = new RegExp("source:\\s*Vanta API " + "via");
const CRED_ASSIGNMENT = /VANTA_CLIENT_(ID|SECRET)\s*[=:]\s*["']?([A-Za-z0-9_-]{16,})["']?/g;
const TENANT_URL = new RegExp("app\\.vanta\\.com/" + "c/[A-Za-z0-9.-]+");
const ELNORA_EMAIL = /([A-Za-z0-9._%+-]+)@elnora\.ai/g;

const ALLOWED_EMAILS = new Set(["opensource@elnora.ai", "security@elnora.ai"]);

// Placeholder credential values are fine (your-…, PASTE_YOUR_…, <…>, x-runs, "test", "example").
const isPlaceholderCred = (v) =>
	/^(your[-_]|paste[-_]?your|<|x+$|test$|example|placeholder|dummy)/i.test(v) || /^X{4,}/.test(v);

// Files excluded from the content scans (still checked for tracked-ness above).
const isContentExempt = (f) => f === SELF;

const files = trackedFiles();
const violations = [];

for (const file of files) {
	// 1. references/: only *.template.md and vanta-config.json may be committed.
	if (file.startsWith("references/") && file.endsWith(".md") && !file.endsWith(".template.md")) {
		violations.push(`${file}: populated reference file is tracked — only references/*.template.md may be committed`);
	}

	if (isContentExempt(file)) continue;

	let content;
	try {
		content = readFileSync(file, "utf8");
	} catch {
		continue; // unreadable/binary — skip content scan
	}

	// 2. Synced-posture marker.
	if (SYNC_MARKER.test(content)) {
		violations.push(
			`${file}: contains a /vanta-sync output marker — generated compliance data must never be committed`,
		);
	}

	// 3. Concrete credential assignments.
	for (const match of content.matchAll(CRED_ASSIGNMENT)) {
		if (!isPlaceholderCred(match[2])) {
			violations.push(
				`${file}: VANTA_CLIENT_${match[1]} appears to have a concrete value — credentials must never be committed`,
			);
		}
	}

	// 4. Tenant-scoped Vanta URLs.
	if (TENANT_URL.test(content)) {
		violations.push(`${file}: contains a tenant-scoped app.vanta.com/c/… URL — these identify a real Vanta customer`);
	}

	// 5. Elnora emails outside the allowed OSS contacts.
	for (const match of content.matchAll(ELNORA_EMAIL)) {
		const email = match[0].toLowerCase();
		if (!ALLOWED_EMAILS.has(email)) {
			violations.push(`${file}: contains non-OSS Elnora email ${email}`);
		}
	}
}

if (violations.length > 0) {
	console.error("Publication guard FAILED:\n");
	for (const v of violations) console.error(`  - ${v}`);
	console.error(`\n${violations.length} violation(s). See .gitignore and README for the reference-file policy.`);
	process.exit(1);
}

console.log(`Publication guard passed (${files.length} tracked files scanned).`);
