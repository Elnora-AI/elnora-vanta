/**
 * Refresh the vendored OpenAPI specs in spec/.
 *
 * Vanta does not publish a single spec: api.vanta.com/openapi.json 404s even
 * with a valid token. The documentation site serves four separate documents,
 * three from Mintlify and one from Speakeasy. This script pulls all four so
 * the generated command surface can be rebuilt when Vanta ships API changes.
 *
 * Usage: pnpm spec:fetch
 */

import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SPEC_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "spec");

const SOURCES: Record<string, string> = {
	"manage-vanta.json": "https://developer.vanta.com/reference/manage-vanta.json",
	"build-integrations.json": "https://developer.vanta.com/reference/build-integrations.json",
	"webhooks.json": "https://developer.vanta.com/reference/webhooks.json",
	"audits.json": "https://spec.speakeasy.com/vanta/vanta/conduct-an-audit-with-code-samples",
};

async function fetchSpec(name: string, url: string): Promise<void> {
	const response = await fetch(url, { signal: AbortSignal.timeout(60_000) });
	if (!response.ok) {
		throw new Error(`${name}: HTTP ${response.status} from ${url}`);
	}
	const text = await response.text();

	let parsed: { openapi?: string; paths?: Record<string, unknown> };
	try {
		parsed = JSON.parse(text);
	} catch (error: unknown) {
		throw new Error(`${name}: response was not JSON (${error instanceof Error ? error.message : String(error)})`);
	}
	if (!parsed.openapi || !parsed.paths) {
		throw new Error(`${name}: JSON is not an OpenAPI document (no 'openapi'/'paths' key)`);
	}

	// Re-serialise so the vendored files have stable formatting and diff cleanly.
	await writeFile(join(SPEC_DIR, name), `${JSON.stringify(parsed, null, 2)}\n`, "utf-8");
	process.stdout.write(`${name.padEnd(26)} openapi ${parsed.openapi}  paths ${Object.keys(parsed.paths).length}\n`);
}

const results = await Promise.allSettled(Object.entries(SOURCES).map(([name, url]) => fetchSpec(name, url)));

const failures = results.filter((r) => r.status === "rejected");
for (const failure of failures) {
	process.stderr.write(`FAILED: ${(failure as PromiseRejectedResult).reason}\n`);
}
if (failures.length > 0) process.exit(1);
