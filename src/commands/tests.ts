/**
 * Tests command — compliance monitoring tests.
 */

import type { Command } from "commander";
import { safeId, vantaFetch } from "../client.js";
import { handleAsyncCommand, outputSuccess, parseLimit } from "../output.js";
import { fetchAllPages } from "../utils/pagination.js";

interface VantaTest {
	id: string;
	name: string;
	status: string;
	lastTestRunDate: string | null;
	latestFlipDate: string | null;
	description: string | null;
	category: string | null;
	owner: { displayName: string; emailAddress: string } | null;
}

export function setupTestsCommand(program: Command): void {
	const tests = program.command("tests").description("Query compliance monitoring tests");

	tests
		.command("list")
		.description("List tests with optional filters")
		.option("--status <status>", "Filter: OK, NEEDS_ATTENTION, DEACTIVATED, IN_PROGRESS, INVALID, NOT_APPLICABLE")
		.option("--framework <framework>", "Filter by framework ID (e.g. soc2)")
		.option("--integration <integration>", "Filter by integration ID")
		.option("--limit <n>", "Max results")
		.action(
			handleAsyncCommand(async (opts: Record<string, string>) => {
				const params: Record<string, string> = {};
				if (opts.status) params.statusFilter = opts.status;
				if (opts.framework) params.frameworkFilter = opts.framework;
				if (opts.integration) params.integrationFilter = opts.integration;

				const limit = parseLimit(opts.limit);
				const data = await fetchAllPages<VantaTest>("/tests", params, {
					limit,
				});

				const summary = data.map((t) => ({
					id: t.id,
					name: t.name,
					status: t.status,
					category: t.category,
				}));
				const failing = summary.filter((t) => t.status === "NEEDS_ATTENTION").length;
				outputSuccess({ tests: summary, count: summary.length, failing });
			}),
		);

	tests
		.command("get <id>")
		.description("Get test details by ID")
		.action(
			handleAsyncCommand(async (id: string) => {
				const data = await vantaFetch<VantaTest>(`/tests/${safeId(id)}`);
				outputSuccess(data);
			}),
		);

	tests
		.command("entities <id>")
		.description("List entities (resources) tested by a specific test")
		.option("--limit <n>", "Max results")
		.action(
			handleAsyncCommand(async (id: string, opts: Record<string, string>) => {
				const limit = parseLimit(opts.limit);
				const data = await fetchAllPages(`/tests/${safeId(id)}/entities`, undefined, { limit });
				outputSuccess({ entities: data, count: data.length });
			}),
		);
}
