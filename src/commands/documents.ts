/**
 * Documents command — compliance evidence documents (read-only).
 */

import type { Command } from "commander";
import { safeId, vantaFetch } from "../client.js";
import { handleAsyncCommand, outputSuccess, parseLimit } from "../output.js";
import { fetchAllPages } from "../utils/pagination.js";

interface Document {
	id: string;
	description: string | null;
	category: string | null;
	status: string | null;
	ownerId: string | null;
}

export function setupDocumentsCommand(program: Command): void {
	const documents = program.command("documents").description("Query compliance evidence documents");

	documents
		.command("list")
		.description("List documents with optional filters")
		.option("--framework <ids>", "Comma-separated framework IDs")
		.option("--status <status>", "Filter by document status (case-insensitive)")
		.option("--limit <n>", "Max results")
		.action(
			handleAsyncCommand(async (opts: Record<string, string>) => {
				const params: Record<string, string> = {};
				if (opts.framework) params["frameworkMatchesAny[]"] = opts.framework;

				const statusFilter = opts.status as string | undefined;
				const limit = parseLimit(opts.limit);

				// When --status is used, fetch all then filter client-side
				const needsClientFilter = !!statusFilter;
				const fetchLimit = needsClientFilter ? undefined : limit;
				let data = await fetchAllPages<Document>("/documents", params, {
					limit: fetchLimit,
				});

				if (statusFilter) {
					const q = statusFilter.toLowerCase();
					data = data.filter((d) => d.status?.toLowerCase().includes(q));
				}

				if (needsClientFilter && limit) data = data.slice(0, limit);

				const summary = data.map((d) => ({
					id: d.id,
					description:
						d.description && d.description.length > 100 ? d.description.slice(0, 100) + "..." : d.description,
					category: d.category,
					status: d.status,
					ownerId: d.ownerId,
				}));
				outputSuccess({ documents: summary, count: summary.length });
			}),
		);

	documents
		.command("get <id>")
		.description("Get document details by ID")
		.action(
			handleAsyncCommand(async (id: string) => {
				const data = await vantaFetch<Document>(`/documents/${safeId(id)}`);
				outputSuccess(data);
			}),
		);

	documents
		.command("files <id>")
		.description("List uploaded files for a document")
		.action(
			handleAsyncCommand(async (id: string) => {
				const data = await fetchAllPages(`/documents/${safeId(id)}/uploads`);
				outputSuccess({ files: data, count: data.length });
			}),
		);

	documents
		.command("links <id>")
		.description("List links attached to a document")
		.action(
			handleAsyncCommand(async (id: string) => {
				const data = await fetchAllPages(`/documents/${safeId(id)}/links`);
				outputSuccess({ links: data, count: data.length });
			}),
		);
}
