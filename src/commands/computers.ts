/**
 * Computers command — monitored computers/devices (read-only).
 */

import type { Command } from "commander";
import { safeId, vantaFetch } from "../client.js";
import { handleAsyncCommand, outputSuccess, parseLimit } from "../output.js";
import { fetchAllPages } from "../utils/pagination.js";

interface MonitoredComputer {
	id: string;
	serialNumber: string | null;
	operatingSystem: { type: string; version: string } | null;
	owner: { displayName: string; emailAddress: string } | null;
	lastCheckDate: string | null;
	screenlock: { outcome: string } | null;
	diskEncryption: { outcome: string } | null;
	passwordManager: { outcome: string } | null;
	antivirusInstallation: { outcome: string } | null;
}

export function setupComputersCommand(program: Command): void {
	const computers = program.command("computers").description("Query monitored computers and devices");

	computers
		.command("list")
		.description("List all monitored computers")
		.option("--limit <n>", "Max results")
		.action(
			handleAsyncCommand(async (opts: Record<string, string>) => {
				const limit = parseLimit(opts.limit);
				const data = await fetchAllPages<MonitoredComputer>("/monitored-computers", undefined, { limit });

				const summary = data.map((c) => ({
					id: c.id,
					serial: c.serialNumber,
					os: c.operatingSystem
						? c.operatingSystem.version?.startsWith(c.operatingSystem.type)
							? c.operatingSystem.version
							: `${c.operatingSystem.type} ${c.operatingSystem.version ?? ""}`.trim()
						: null,
					owner: c.owner?.displayName ?? null,
					lastCheck: c.lastCheckDate,
					screenlock: c.screenlock?.outcome ?? null,
					diskEncryption: c.diskEncryption?.outcome ?? null,
					antivirus: c.antivirusInstallation?.outcome ?? null,
				}));
				outputSuccess({ computers: summary, count: summary.length });
			}),
		);

	computers
		.command("get <id>")
		.description("Get computer details")
		.action(
			handleAsyncCommand(async (id: string) => {
				const data = await vantaFetch<MonitoredComputer>(`/monitored-computers/${safeId(id)}`);
				outputSuccess(data);
			}),
		);
}
