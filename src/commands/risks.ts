/**
 * Risks command — risk register management.
 */

import type { Command } from "commander";
import { safeId, vantaFetch } from "../client.js";
import { handleAsyncCommand, outputSuccess, parseLimit } from "../output.js";
import { fetchAllPages } from "../utils/pagination.js";

interface Risk {
	riskId: string;
	description: string;
	categories: string[];
	likelihood: number;
	impact: number;
	residualLikelihood: number;
	residualImpact: number;
	treatment: string | null;
	reviewStatus: string;
	owner: string | null;
}

export function setupRisksCommand(program: Command): void {
	const risks = program.command("risks").description("Query risk register");

	risks
		.command("list")
		.description("List risk scenarios")
		.option("--status <status>", "Filter review status: PENDING, APPROVED, REJECTED")
		.option("--category <category>", "Filter by category")
		.option("--limit <n>", "Max results")
		.action(
			handleAsyncCommand(async (opts: Record<string, string>) => {
				const params: Record<string, string> = {};
				if (opts.status) params["reviewStatusMatchesAny[]"] = opts.status;
				if (opts.category) params["categoryMatchesAny[]"] = opts.category;

				const limit = parseLimit(opts.limit);
				const data = await fetchAllPages<Risk>("/risk-scenarios", params, {
					limit,
				});

				const summary = data.map((r) => ({
					id: r.riskId,
					description: r.description,
					categories: r.categories,
					inherent: `${r.likelihood}/${r.impact}`,
					residual: `${r.residualLikelihood}/${r.residualImpact}`,
					treatment: r.treatment,
					status: r.reviewStatus,
				}));
				outputSuccess({ risks: summary, count: summary.length });
			}),
		);

	risks
		.command("get <id>")
		.description("Get risk scenario details")
		.action(
			handleAsyncCommand(async (id: string) => {
				const data = await vantaFetch<Risk>(`/risk-scenarios/${safeId(id)}`);
				outputSuccess(data);
			}),
		);
}
