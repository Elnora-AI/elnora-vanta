/**
 * Integrations command — connected service integrations.
 */

import type { Command } from "commander";
import { safeId, vantaFetch } from "../client.js";
import { handleAsyncCommand, outputSuccess } from "../output.js";
import { fetchAllPages } from "../utils/pagination.js";

interface Integration {
	integrationId: string;
	displayName: string;
	resourceKinds: string[];
}

export function setupIntegrationsCommand(program: Command): void {
	const integrations = program.command("integrations").description("Query connected integrations");

	integrations
		.command("list")
		.description("List all connected integrations")
		.action(
			handleAsyncCommand(async () => {
				const data = await fetchAllPages<Integration>("/integrations");
				const summary = data.map((i) => ({
					id: i.integrationId,
					name: i.displayName,
					resourceKinds: i.resourceKinds?.length ?? 0,
				}));
				outputSuccess({ integrations: summary, count: summary.length });
			}),
		);

	integrations
		.command("get <id>")
		.description("Get integration details")
		.action(
			handleAsyncCommand(async (id: string) => {
				const data = await vantaFetch<Integration>(`/integrations/${safeId(id)}`);
				outputSuccess(data);
			}),
		);
}
