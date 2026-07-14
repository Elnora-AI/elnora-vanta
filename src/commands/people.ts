/**
 * People command — personnel management.
 */

import type { Command } from "commander";
import { safeId, vantaFetch } from "../client.js";
import { handleAsyncCommand, outputSuccess, parseLimit } from "../output.js";
import { fetchAllPages } from "../utils/pagination.js";

interface Person {
	id: string;
	emailAddress: string;
	name: { display: string; first: string; last: string };
	employment: {
		status: string;
		jobTitle: string | null;
		startDate: string | null;
		endDate: string | null;
	};
	groupIds: string[];
}

export function setupPeopleCommand(program: Command): void {
	const people = program.command("people").description("Query personnel");

	people
		.command("list")
		.description("List all people")
		.option("--task-status <status>", "Filter: COMPLETE, DUE_SOON, OVERDUE, NONE")
		.option("--limit <n>", "Max results")
		.action(
			handleAsyncCommand(async (opts: Record<string, string>) => {
				const params: Record<string, string> = {};
				if (opts.taskStatus) params["taskStatusMatchesAny[]"] = opts.taskStatus;

				const limit = parseLimit(opts.limit);
				const data = await fetchAllPages<Person>("/people", params, { limit });
				const summary = data.map((p) => ({
					id: p.id,
					name: p.name.display,
					email: p.emailAddress,
					status: p.employment.status,
					title: p.employment.jobTitle,
				}));
				outputSuccess({ people: summary, count: summary.length });
			}),
		);

	people
		.command("get <id>")
		.description("Get person details")
		.action(
			handleAsyncCommand(async (id: string) => {
				const data = await vantaFetch<Person>(`/people/${safeId(id)}`);
				outputSuccess(data);
			}),
		);
}
