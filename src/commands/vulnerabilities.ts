/**
 * Vulnerabilities command — vulnerability tracking with SLA compliance.
 */

import type { Command } from "commander";
import { safeId, vantaFetch } from "../client.js";
import { handleAsyncCommand, outputSuccess, parseLimit } from "../output.js";
import { fetchAllPages } from "../utils/pagination.js";

interface DeactivateMetadata {
	deactivatedBy: string;
	deactivatedOnDate: string;
	deactivationReason: string;
	deactivatedUntilDate: string | null;
	isVulnDeactivatedIndefinitely: boolean;
}

interface Vulnerability {
	id: string;
	name: string;
	description: string | null;
	severity: string;
	cvssSeverityScore: number | null;
	isFixable: boolean;
	remediateByDate: string | null;
	firstDetectedDate: string | null;
	externalURL: string | null;
	integrationId: string | null;
	packageIdentifier: string | null;
	deactivateMetadata: DeactivateMetadata | null;
}

export function setupVulnerabilitiesCommand(program: Command): void {
	const vulns = program.command("vulns").description("Track vulnerabilities and SLA compliance");

	vulns
		.command("list")
		.description("List vulnerabilities with optional filters")
		.option("--severity <level>", "Filter: CRITICAL, HIGH, MEDIUM, LOW")
		.option("--integration <id>", "Filter by source integration")
		.option("--cve <id>", "Filter by CVE ID")
		.option("--search <query>", "Search by vulnerability name or CVE")
		.option("--overdue", "Show only overdue (past SLA deadline)")
		.option("--limit <n>", "Max results")
		.action(
			handleAsyncCommand(async (opts: Record<string, string | boolean>) => {
				const params: Record<string, string> = {};
				// API enum is uppercase; accept either case from the user
				if (opts.severity) params.severity = (opts.severity as string).toUpperCase();
				if (opts.integration) params.integrationId = opts.integration as string;
				if (opts.cve) params.externalVulnerabilityId = opts.cve as string;
				const limit = parseLimit(opts.limit as string);
				const searchQuery = opts.search as string | undefined;

				// When --overdue or --search is used, fetch all results before filtering
				// client-side to ensure --limit applies to the filtered set
				const needsClientFilter = !!(opts.overdue || searchQuery);
				const fetchLimit = needsClientFilter ? undefined : limit;
				let data = await fetchAllPages<Vulnerability>("/vulnerabilities", params, { limit: fetchLimit });

				const now = new Date();

				// Client-side search filter (API doesn't support searchQuery param)
				if (searchQuery) {
					const q = searchQuery.toLowerCase();
					data = data.filter(
						(v) =>
							v.name.toLowerCase().includes(q) ||
							v.description?.toLowerCase().includes(q) ||
							v.packageIdentifier?.toLowerCase().includes(q),
					);
				}

				// Client-side overdue filter (REST API doesn't reliably support slaDeadlineBefore)
				if (opts.overdue) {
					data = data.filter((v) => v.remediateByDate && new Date(v.remediateByDate) < now && !v.deactivateMetadata);
				}

				if (needsClientFilter && limit) data = data.slice(0, limit);

				const summary = data.map((v) => {
					const pastSla = v.remediateByDate && new Date(v.remediateByDate) < now;
					const status = v.deactivateMetadata ? "DEACTIVATED" : pastSla ? "OVERDUE" : "OPEN";
					return {
						id: v.id,
						name: v.name,
						severity: v.severity,
						cvss: v.cvssSeverityScore,
						fixable: v.isFixable,
						status,
						slaDeadline: v.remediateByDate,
						deactivated: v.deactivateMetadata
							? {
									reason: v.deactivateMetadata.deactivationReason,
									until: v.deactivateMetadata.isVulnDeactivatedIndefinitely
										? "indefinitely"
										: v.deactivateMetadata.deactivatedUntilDate,
								}
							: null,
					};
				});

				const overdue = summary.filter((v) => v.status === "OVERDUE").length;

				outputSuccess({
					vulnerabilities: summary,
					count: summary.length,
					overdue,
				});
			}),
		);

	vulns
		.command("get <id>")
		.description("Get vulnerability details")
		.action(
			handleAsyncCommand(async (id: string) => {
				const data = await vantaFetch<Vulnerability>(`/vulnerabilities/${safeId(id)}`);
				outputSuccess(data);
			}),
		);
}
