/**
 * Full Vanta REST surface, generated from the OpenAPI documents in spec/.
 *
 * Every operation Vanta documents is reachable as:
 *   elnora-vanta api <group> <command> [pathArgs...] [--query flags] [--body JSON]
 *
 * The hand-written top-level commands (frameworks, tests, controls, ...) stay
 * the ergonomic read-only front door; this tree is the complete surface and is
 * nested under `api` so the two never collide.
 *
 * Writes are gated by src/safety.ts — see `elnora-vanta api --help`.
 */

import type { Command } from "commander";
import { type HttpMethod, vantaRequest } from "../client.js";
import { OPERATIONS, type Operation } from "../generated/operations.js";
import { handleAsyncCommand, outputSuccess } from "../output.js";
import { evaluateSafety, parseBodyArgument } from "../safety.js";
import { EXIT_CODES, ValidationError } from "../utils/errors.js";

/** Reserved by the safety gate and the generic escape hatches. */
const RESERVED_FLAGS = new Set(["confirm", "force", "dryRun", "body", "query"]);

/** Substitute {placeholders} with encoded values; throws if one is unfilled. */
function buildPath(operation: Operation, args: string[]): string {
	let path = operation.path;
	operation.pathParams.forEach((name, index) => {
		const value = args[index];
		if (value === undefined || value === "") {
			throw new ValidationError(`Missing path parameter <${name}> for ${operation.id}`);
		}
		path = path.replace(`{${name}}`, encodeURIComponent(value));
	});
	const unfilled = path.match(/\{([^}]+)\}/);
	if (unfilled) {
		throw new ValidationError(`Path parameter {${unfilled[1]}} was not supplied for ${operation.id}`);
	}
	return path;
}

/** Collect query values from typed flags plus any repeated --query key=value pairs. */
function buildQuery(operation: Operation, opts: Record<string, unknown>): Record<string, string> {
	const query: Record<string, string> = {};

	for (const param of operation.queryParams) {
		if (RESERVED_FLAGS.has(param.name)) continue;
		const value = opts[param.name];
		if (value === undefined || value === null) continue;
		query[param.name] = String(value);
	}

	const extra = opts.query;
	if (Array.isArray(extra)) {
		for (const pair of extra as string[]) {
			const eq = pair.indexOf("=");
			if (eq <= 0) {
				throw new ValidationError(`--query expects key=value, got "${pair}"`);
			}
			query[pair.slice(0, eq)] = pair.slice(eq + 1);
		}
	}

	return query;
}

function registerOperation(groupCommand: Command, operation: Operation): void {
	const argSignature = operation.pathParams.map((p) => `<${p}>`).join(" ");
	const cmd = groupCommand
		.command(`${operation.command}${argSignature ? ` ${argSignature}` : ""}`)
		.description(`[${operation.risk}] ${operation.summary}${operation.deprecated ? " (DEPRECATED)" : ""}`);

	for (const param of operation.queryParams) {
		if (RESERVED_FLAGS.has(param.name)) continue;
		const hint = param.enum?.length ? ` (${param.enum.slice(0, 8).join("|")})` : "";
		cmd.option(`--${param.name} <value>`, `${param.description || param.type}${hint}`.slice(0, 160));
	}

	cmd.option(
		"--query <key=value>",
		"Extra query parameter (repeatable)",
		(value: string, previous: string[]) => [...previous, value],
		[] as string[],
	);

	if (operation.body) {
		const props = operation.body.properties.length
			? ` Body fields: ${operation.body.properties.slice(0, 12).join(", ")}`
			: "";
		cmd.option("--body <json>", `Request body as JSON, or @file.json.${props}`.slice(0, 200));
	}

	if (operation.risk !== "read") {
		cmd.option("--confirm", "Actually send this write (without it, the request is only printed)");
		if (operation.risk === "destructive") {
			cmd.option("--force", "Required in addition to --confirm for destructive operations");
		}
	}
	cmd.option("--dry-run", "Print the request that would be sent and exit");

	cmd.action(
		handleAsyncCommand(async (...actionArgs: unknown[]) => {
			// commander passes positionals, then the options object, then the Command.
			const opts = actionArgs[operation.pathParams.length] as Record<string, unknown>;
			const pathArgs = actionArgs.slice(0, operation.pathParams.length) as string[];

			const path = buildPath(operation, pathArgs);
			const query = buildQuery(operation, opts);
			const body = await parseBodyArgument(opts.body as string | undefined);

			if (operation.body?.required && body === undefined) {
				throw new ValidationError(
					`${operation.id} requires a request body. Pass --body '<json>' or --body @file.json.` +
						(operation.body.requiredProperties.length
							? ` Required fields: ${operation.body.requiredProperties.join(", ")}`
							: ""),
				);
			}

			const decision = evaluateSafety(
				{
					operationId: operation.id,
					method: operation.method.toUpperCase(),
					path,
					risk: operation.risk,
					query,
					body,
				},
				{
					confirm: opts.confirm === true,
					force: opts.force === true,
					dryRun: opts.dryRun === true,
				},
			);

			if (!decision.execute) {
				outputSuccess(decision.plan);
				// A refusal must not look like success to a script or an agent.
				if (decision.blocked) process.exitCode = EXIT_CODES.BLOCKED;
				return;
			}

			const search = new URLSearchParams(query).toString();
			const result = await vantaRequest<unknown>(
				operation.method.toUpperCase() as HttpMethod,
				`${path}${search ? `?${search}` : ""}`,
				body === undefined ? undefined : { body: JSON.stringify(body) },
			);
			outputSuccess(result);
		}),
	);
}

export function setupApiCommand(program: Command): void {
	const api = program
		.command("api")
		.description(`Full Vanta REST API — ${OPERATIONS.length} operations across every documented resource`)
		.addHelpText(
			"after",
			"\nWrite safety:\n" +
				"  [read]        runs immediately\n" +
				"  [write]       prints the request; add --confirm to send it\n" +
				"  [destructive] prints the request; needs --confirm AND --force\n" +
				"  --dry-run always wins, even alongside --confirm.\n\n" +
				"Discover operations:  elnora-vanta api search <term>\n",
		);

	api
		.command("search [term]")
		.description("Find operations by id, path, summary or group")
		.option("--risk <level>", "Filter by risk: read, write, destructive")
		.option("--group <name>", "Filter by command group")
		.action(
			handleAsyncCommand(async (term: string | undefined, opts: Record<string, string>) => {
				const needle = term?.toLowerCase();
				const matches = OPERATIONS.filter((op) => {
					if (opts.risk && op.risk !== opts.risk) return false;
					if (opts.group && op.group !== opts.group) return false;
					if (!needle) return true;
					return `${op.id} ${op.group} ${op.command} ${op.path} ${op.summary}`.toLowerCase().includes(needle);
				}).map((op) => ({
					command: `api ${op.group} ${op.command}`,
					method: op.method.toUpperCase(),
					path: op.path,
					risk: op.risk,
					summary: op.summary,
				}));
				outputSuccess({ operations: matches, count: matches.length });
			}),
		);

	const groups = new Map<string, Command>();
	for (const operation of OPERATIONS) {
		let groupCommand = groups.get(operation.group);
		if (!groupCommand) {
			const count = OPERATIONS.filter((o) => o.group === operation.group).length;
			groupCommand = api.command(operation.group).description(`${operation.group} — ${count} operations`);
			groups.set(operation.group, groupCommand);
		}
		registerOperation(groupCommand, operation as Operation);
	}
}
