/**
 * Vulnerability Remediations command — remediation tracking (read-only).
 */

import type { Command } from "commander";
import { safeId, vantaFetch } from "../client.js";
import { handleAsyncCommand, outputSuccess, parseLimit } from "../output.js";
import { fetchAllPages } from "../utils/pagination.js";

interface VulnerabilityRemediation {
	id: string;
	vulnerabilityId: string | null;
	vulnerableAssetId: string | null;
	severity: string | null;
	detectedDate: string | null;
	slaDeadlineDate: string | null;
	remediationDate: string | null;
}

export function setupVulnRemediationsCommand(program: Command): void {
	const vulnRemediations = program.command("vuln-remediations").description("Query vulnerability remediation tracking");

	vulnRemediations
		.command("list")
		.description("List vulnerability remediations")
		.option("--limit <n>", "Max results")
		.action(
			handleAsyncCommand(async (opts: Record<string, string>) => {
				const limit = parseLimit(opts.limit);
				const data = await fetchAllPages<VulnerabilityRemediation>("/vulnerability-remediations", undefined, { limit });

				const now = new Date();
				const summary = data.map((r) => {
					const pastSla = r.slaDeadlineDate && new Date(r.slaDeadlineDate) < now;
					return {
						id: r.id,
						severity: r.severity,
						vulnerabilityId: r.vulnerabilityId,
						assetId: r.vulnerableAssetId,
						detected: r.detectedDate,
						slaDeadline: r.slaDeadlineDate,
						remediated: r.remediationDate,
						overdue: r.remediationDate ? false : !!pastSla,
					};
				});

				const overdue = summary.filter((r) => r.overdue).length;
				outputSuccess({
					remediations: summary,
					count: summary.length,
					overdue,
				});
			}),
		);

	vulnRemediations
		.command("get <id>")
		.description("Get vulnerability remediation details")
		.action(
			handleAsyncCommand(async (id: string) => {
				const data = await vantaFetch<VulnerabilityRemediation>(`/vulnerability-remediations/${safeId(id)}`);
				outputSuccess(data);
			}),
		);
}
