/**
 * Vanta MCP surface — the capabilities the public REST API does not expose
 * (answer library, knowledge base, privacy assessments, access reviews,
 * policy generation, TPRM assessment automations).
 *
 * These need a user-delegated Admin session rather than the REST service
 * token, so they live behind `elnora-vanta mcp login`. Writes are gated exactly
 * as they are for REST: same flags, same --dry-run override.
 */

import type { Command } from "commander";
import type { OperationRisk } from "../generated/operations.js";
import { callTool, listTools, type McpTool } from "../mcp/client.js";
import { mcpLogin, mcpLogout, mcpUrl } from "../mcp/oauth.js";
import { handleAsyncCommand, outputSuccess } from "../output.js";
import { evaluateSafety, parseBodyArgument } from "../safety.js";
import { ValidationError } from "../utils/errors.js";

const READ_PREFIXES = ["list", "get", "search", "fetch", "check", "download"];
const DESTRUCTIVE_PREFIXES = ["delete", "deactivate", "remove", "reject", "unlink", "archive", "revoke"];

/**
 * Classify an MCP tool by its name. Vanta names tools verb-first and
 * consistently, and an unknown verb is treated as a write rather than a read —
 * the gate fails closed.
 */
export function classifyTool(name: string): OperationRisk {
	const lower = name.toLowerCase();
	if (DESTRUCTIVE_PREFIXES.some((prefix) => lower.startsWith(prefix))) return "destructive";
	if (READ_PREFIXES.some((prefix) => lower.startsWith(prefix))) return "read";
	return "write";
}

function describeTool(tool: McpTool): Record<string, unknown> {
	const schema = tool.inputSchema;
	return {
		name: tool.name,
		risk: classifyTool(tool.name),
		summary: (tool.description ?? "").replace(/\s+/g, " ").trim().slice(0, 200),
		...(schema?.properties ? { arguments: Object.keys(schema.properties) } : {}),
		...(schema?.required?.length ? { required: schema.required } : {}),
	};
}

export function setupMcpCommand(program: Command): void {
	const mcp = program
		.command("mcp")
		.description("Vanta MCP tools — capabilities the REST API does not expose (requires Vanta Admin)")
		.addHelpText(
			"after",
			"\nFirst run 'elnora-vanta mcp login' (opens a browser once).\n" +
				"Then 'elnora-vanta mcp tools' to see what your tenant exposes.\n" +
				"Writes obey the same --confirm / --force / --dry-run rules as 'api'.\n",
		);

	mcp
		.command("login")
		.description("Authorize the CLI against Vanta's MCP server (browser, one time)")
		.action(
			handleAsyncCommand(async () => {
				const cache = await mcpLogin();
				outputSuccess({
					connected: true,
					endpoint: cache.mcp_url,
					expiresAt: new Date(cache.expires_at).toISOString(),
					refreshable: Boolean(cache.refresh_token),
				});
			}),
		);

	mcp
		.command("logout")
		.description("Delete the cached MCP session")
		.action(
			handleAsyncCommand(async () => {
				await mcpLogout();
				outputSuccess({ connected: false });
			}),
		);

	mcp
		.command("tools")
		.description("List the MCP tools this tenant exposes, with risk level and argument names")
		.option("--name <tool>", "Show one tool with its full input schema")
		.option("--risk <level>", "Filter by risk: read, write, destructive")
		.option("--grep <term>", "Filter by name or description")
		.action(
			handleAsyncCommand(async (opts: Record<string, string>) => {
				const tools = await listTools();

				if (opts.name) {
					const match = tools.find((t) => t.name === opts.name);
					if (!match) {
						throw new ValidationError(`No MCP tool named "${opts.name}". Run 'elnora-vanta mcp tools' to list them.`);
					}
					outputSuccess({ ...describeTool(match), inputSchema: match.inputSchema });
					return;
				}

				const needle = opts.grep?.toLowerCase();
				const filtered = tools
					.filter((tool) => {
						if (opts.risk && classifyTool(tool.name) !== opts.risk) return false;
						if (!needle) return true;
						return `${tool.name} ${tool.description ?? ""}`.toLowerCase().includes(needle);
					})
					.map(describeTool);

				outputSuccess({ endpoint: mcpUrl(), tools: filtered, count: filtered.length });
			}),
		);

	mcp
		.command("call <tool>")
		.description("Invoke an MCP tool. Writes need --confirm; destructive tools also need --force")
		.option("--args <json>", "Tool arguments as JSON, or @file.json", "{}")
		.option("--confirm", "Actually invoke a write tool")
		.option("--force", "Required in addition to --confirm for destructive tools")
		.option("--dry-run", "Print what would be invoked and exit")
		.action(
			handleAsyncCommand(async (tool: string, opts: Record<string, unknown>) => {
				const parsed = await parseBodyArgument(opts.args as string | undefined);
				if (parsed !== undefined && (typeof parsed !== "object" || parsed === null || Array.isArray(parsed))) {
					throw new ValidationError("--args must be a JSON object of tool arguments");
				}
				const args = (parsed ?? {}) as Record<string, unknown>;
				const risk = classifyTool(tool);

				const decision = evaluateSafety(
					{ operationId: tool, method: "MCP", path: tool, risk, body: args },
					{
						confirm: opts.confirm === true,
						force: opts.force === true,
						dryRun: opts.dryRun === true,
					},
				);

				if (!decision.execute) {
					outputSuccess(decision.plan);
					return;
				}

				outputSuccess(await callTool(tool, args));
			}),
		);
}
