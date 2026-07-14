/**
 * Vulnerable Assets command — assets affected by vulnerabilities (read-only).
 */

import type { Command } from "commander";
import { safeId, vantaFetch } from "../client.js";
import { handleAsyncCommand, outputSuccess, parseLimit } from "../output.js";
import { fetchAllPages } from "../utils/pagination.js";

interface Scanner {
	integrationId: string;
	parentAccountOrOrganization: string | null;
}

interface VulnerableAsset {
	id: string;
	name: string | null;
	assetType: string | null;
	hasBeenScanned: boolean | null;
	scanners: Scanner[] | null;
}

export function setupVulnAssetsCommand(program: Command): void {
	const vulnAssets = program.command("vuln-assets").description("Query assets affected by vulnerabilities");

	vulnAssets
		.command("list")
		.description("List vulnerable assets")
		.option("--limit <n>", "Max results")
		.action(
			handleAsyncCommand(async (opts: Record<string, string>) => {
				const limit = parseLimit(opts.limit);
				const data = await fetchAllPages<VulnerableAsset>("/vulnerable-assets", undefined, { limit });

				const summary = data.map((a) => ({
					id: a.id,
					name: a.name,
					type: a.assetType,
					scanned: a.hasBeenScanned,
					scanners: a.scanners?.map((s) => s.integrationId).join(", ") ?? null,
				}));
				outputSuccess({ vulnerableAssets: summary, count: summary.length });
			}),
		);

	vulnAssets
		.command("get <id>")
		.description("Get vulnerable asset details")
		.action(
			handleAsyncCommand(async (id: string) => {
				const data = await vantaFetch<VulnerableAsset>(`/vulnerable-assets/${safeId(id)}`);
				outputSuccess(data);
			}),
		);
}
