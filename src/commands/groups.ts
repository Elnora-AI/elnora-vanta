/**
 * Groups command — people groups (read-only).
 */

import type { Command } from "commander";
import { safeId, vantaFetch } from "../client.js";
import { handleAsyncCommand, outputSuccess, parseLimit } from "../output.js";
import { fetchAllPages } from "../utils/pagination.js";

interface Group {
	id: string;
	name: string;
	creationDate: string | null;
}

export function setupGroupsCommand(program: Command): void {
	const groups = program.command("groups").description("Query people groups");

	groups
		.command("list")
		.description("List all groups")
		.option("--limit <n>", "Max results")
		.action(
			handleAsyncCommand(async (opts: Record<string, string>) => {
				const limit = parseLimit(opts.limit);
				const data = await fetchAllPages<Group>("/groups", undefined, {
					limit,
				});

				const summary = data.map((g) => ({
					id: g.id,
					name: g.name,
					created: g.creationDate,
				}));
				outputSuccess({ groups: summary, count: summary.length });
			}),
		);

	groups
		.command("get <id>")
		.description("Get group details")
		.action(
			handleAsyncCommand(async (id: string) => {
				const data = await vantaFetch<Group>(`/groups/${safeId(id)}`);
				outputSuccess(data);
			}),
		);
}
