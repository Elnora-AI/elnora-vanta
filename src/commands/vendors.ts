/**
 * Vendors command — third-party vendor management (read-only).
 */

import type { Command } from "commander";
import { safeId, vantaFetch } from "../client.js";
import { handleAsyncCommand, outputSuccess, parseLimit } from "../output.js";
import { fetchAllPages } from "../utils/pagination.js";

interface Vendor {
	id: string;
	name: string;
	websiteUrl: string | null;
	status: string | null;
	inherentRiskLevel: string | null;
	residualRiskLevel: string | null;
	category: { displayName: string } | null;
	securityOwnerUserId: string | null;
	businessOwnerUserId: string | null;
	nextSecurityReviewDueDate: string | null;
	lastSecurityReviewCompletionDate: string | null;
}

export function setupVendorsCommand(program: Command): void {
	const vendors = program.command("vendors").description("Query third-party vendors");

	vendors
		.command("list")
		.description("List all vendors")
		.option("--limit <n>", "Max results")
		.action(
			handleAsyncCommand(async (opts: Record<string, string>) => {
				const limit = parseLimit(opts.limit);
				const data = await fetchAllPages<Vendor>("/vendors", undefined, {
					limit,
				});

				const summary = data.map((v) => ({
					id: v.id,
					name: v.name,
					status: v.status,
					category: v.category?.displayName ?? null,
					inherentRisk: v.inherentRiskLevel,
					residualRisk: v.residualRiskLevel,
					nextReview: v.nextSecurityReviewDueDate,
				}));
				outputSuccess({ vendors: summary, count: summary.length });
			}),
		);

	vendors
		.command("get <id>")
		.description("Get vendor details")
		.action(
			handleAsyncCommand(async (id: string) => {
				const data = await vantaFetch<Vendor>(`/vendors/${safeId(id)}`);
				outputSuccess(data);
			}),
		);
}
