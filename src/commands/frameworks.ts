/**
 * Frameworks command — compliance framework status.
 */

import type { Command } from "commander";
import { safeId, vantaFetch } from "../client.js";
import { handleAsyncCommand, outputSuccess } from "../output.js";
import { fetchAllPages } from "../utils/pagination.js";

interface Framework {
	id: string;
	displayName: string;
	description: string;
	numControlsCompleted: number;
	numControlsTotal: number;
	numDocumentsPassing: number;
	numDocumentsTotal: number;
	numTestsPassing: number;
	numTestsTotal: number;
}

export function setupFrameworksCommand(program: Command): void {
	const frameworks = program.command("frameworks").description("Query compliance frameworks");

	frameworks
		.command("list")
		.description("List all frameworks with completion status")
		.action(
			handleAsyncCommand(async () => {
				const data = await fetchAllPages<Framework>("/frameworks");
				const summary = data.map((f) => ({
					id: f.id,
					name: f.displayName,
					controls: `${f.numControlsCompleted}/${f.numControlsTotal}`,
					documents: `${f.numDocumentsPassing}/${f.numDocumentsTotal}`,
					tests: `${f.numTestsPassing}/${f.numTestsTotal}`,
				}));
				outputSuccess({ frameworks: summary, count: summary.length });
			}),
		);

	frameworks
		.command("get <id>")
		.description("Get framework details by ID")
		.action(
			handleAsyncCommand(async (id: string) => {
				const data = await vantaFetch<Framework>(`/frameworks/${safeId(id)}`);
				outputSuccess(data);
			}),
		);
}
