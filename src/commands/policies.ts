/**
 * Policies command — compliance policies (read-only).
 */

import type { Command } from "commander";
import { safeId, vantaFetch } from "../client.js";
import { handleAsyncCommand, outputSuccess, parseLimit } from "../output.js";
import { fetchAllPages } from "../utils/pagination.js";

interface Policy {
	id: string;
	name: string;
	description: string | null;
	status: string | null;
	approvedAtDate: string | null;
	latestVersion: { status: string } | null;
}

export function setupPoliciesCommand(program: Command): void {
	const policies = program.command("policies").description("Query compliance policies");

	policies
		.command("list")
		.description("List all policies with optional filters")
		.option("--framework <ids>", "Comma-separated framework IDs")
		.option("--limit <n>", "Max results")
		.action(
			handleAsyncCommand(async (opts: Record<string, string>) => {
				const params: Record<string, string> = {};
				if (opts.framework) params["frameworkMatchesAny[]"] = opts.framework;

				const limit = parseLimit(opts.limit);
				const data = await fetchAllPages<Policy>("/policies", params, {
					limit,
				});

				const summary = data.map((p) => ({
					id: p.id,
					name: p.name,
					status: p.status,
					versionStatus: p.latestVersion?.status ?? null,
					approvedAt: p.approvedAtDate,
				}));
				outputSuccess({ policies: summary, count: summary.length });
			}),
		);

	policies
		.command("get <id>")
		.description("Get policy details by ID")
		.action(
			handleAsyncCommand(async (id: string) => {
				const data = await vantaFetch<Policy>(`/policies/${safeId(id)}`);
				outputSuccess(data);
			}),
		);
}
