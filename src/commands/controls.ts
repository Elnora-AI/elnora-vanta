/**
 * Controls command — security controls by framework.
 */

import type { Command } from "commander";
import { safeId, vantaFetch } from "../client.js";
import { handleAsyncCommand, outputSuccess, parseLimit } from "../output.js";
import { fetchAllPages } from "../utils/pagination.js";

interface Control {
	id: string;
	externalId: string | null;
	name: string;
	description: string | null;
	domains: string[];
	owner: { displayName: string; emailAddress: string } | null;
}

export function setupControlsCommand(program: Command): void {
	const controls = program.command("controls").description("Query security controls");

	controls
		.command("list")
		.description("List controls with optional framework filter")
		.option("--framework <ids>", "Comma-separated framework IDs (e.g. soc2,iso27001)")
		.option("--limit <n>", "Max results")
		.action(
			handleAsyncCommand(async (opts: Record<string, string>) => {
				const params: Record<string, string> = {};
				if (opts.framework) {
					params["frameworkMatchesAny[]"] = opts.framework;
				}

				const limit = parseLimit(opts.limit);
				const data = await fetchAllPages<Control>("/controls", params, {
					limit,
				});

				const summary = data.map((c) => ({
					id: c.id,
					externalId: c.externalId,
					name: c.name,
					domains: c.domains,
					owner: c.owner?.displayName ?? null,
				}));
				outputSuccess({ controls: summary, count: summary.length });
			}),
		);

	controls
		.command("get <id>")
		.description("Get control details by ID")
		.action(
			handleAsyncCommand(async (id: string) => {
				const data = await vantaFetch<Control>(`/controls/${safeId(id)}`);
				outputSuccess(data);
			}),
		);

	controls
		.command("tests <id>")
		.description("List tests validating this control")
		.action(
			handleAsyncCommand(async (id: string) => {
				const data = await fetchAllPages(`/controls/${safeId(id)}/tests`);
				outputSuccess({ tests: data, count: data.length });
			}),
		);

	controls
		.command("documents <id>")
		.description("List evidence documents for this control")
		.action(
			handleAsyncCommand(async (id: string) => {
				const data = await fetchAllPages(`/controls/${safeId(id)}/documents`);
				outputSuccess({ documents: data, count: data.length });
			}),
		);
}
