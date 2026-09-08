/**
 * Minimal MCP client for Vanta's hosted server.
 *
 * Vanta speaks streamable HTTP: a POST carrying one JSON-RPC message, answered
 * either with JSON or with an SSE stream whose data: frames carry the response.
 * Only initialize / tools/list / tools/call are needed here, so this is a
 * direct implementation rather than a dependency — it keeps the CLI free of a
 * transitive SDK on the credential path.
 */

import { CliError } from "../utils/errors.js";
import { getMcpToken, mcpUrl } from "./oauth.js";

const PROTOCOL_VERSION = "2025-06-18";
const REQUEST_TIMEOUT_MS = 120_000; // tools/call can be slow on large tenants

export interface McpTool {
	name: string;
	description?: string;
	inputSchema?: {
		type?: string;
		properties?: Record<string, { type?: string; description?: string; enum?: string[] }>;
		required?: string[];
	};
}

interface JsonRpcResponse {
	result?: unknown;
	error?: { code: number; message: string; data?: unknown };
}

let sessionId: string | undefined;
let nextId = 1;

/** Pull the JSON-RPC payload out of either a plain JSON body or an SSE stream. */
function parseBody(contentType: string, text: string): JsonRpcResponse {
	if (contentType.includes("text/event-stream")) {
		for (const line of text.split("\n")) {
			if (!line.startsWith("data:")) continue;
			const payload = line.slice(5).trim();
			if (!payload || payload === "[DONE]") continue;
			try {
				return JSON.parse(payload) as JsonRpcResponse;
			} catch {
				// Keep scanning — a stream may carry keep-alive frames before the result.
			}
		}
		throw new CliError("Vanta MCP returned an event stream with no JSON-RPC payload");
	}
	try {
		return JSON.parse(text) as JsonRpcResponse;
	} catch {
		throw new CliError(`Vanta MCP returned a non-JSON response: ${text.slice(0, 200)}`);
	}
}

async function rpc(method: string, params?: Record<string, unknown>): Promise<unknown> {
	const url = mcpUrl();
	const token = await getMcpToken();

	const response = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
			Accept: "application/json, text/event-stream",
			"MCP-Protocol-Version": PROTOCOL_VERSION,
			...(sessionId ? { "Mcp-Session-Id": sessionId } : {}),
		},
		body: JSON.stringify({ jsonrpc: "2.0", id: nextId++, method, ...(params ? { params } : {}) }),
		signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
	});

	const returnedSession = response.headers.get("mcp-session-id");
	if (returnedSession) sessionId = returnedSession;

	if (response.status === 401) {
		throw new CliError("Vanta MCP rejected the session. Run 'elnora-vanta mcp login' to reconnect.");
	}
	const text = await response.text();
	if (!response.ok) {
		throw new CliError(`Vanta MCP error ${response.status}: ${text.slice(0, 200)}`);
	}

	const parsed = parseBody(response.headers.get("content-type") ?? "", text);
	if (parsed.error) {
		throw new CliError(`Vanta MCP: ${parsed.error.message}`, {
			suggestion: "Check the tool arguments against 'elnora-vanta mcp tools --name <tool>'.",
		});
	}
	return parsed.result;
}

let initialised = false;

async function ensureInitialised(): Promise<void> {
	if (initialised) return;
	await rpc("initialize", {
		protocolVersion: PROTOCOL_VERSION,
		capabilities: {},
		clientInfo: { name: "elnora-vanta", version: "cli" },
	});
	initialised = true;
}

export async function listTools(): Promise<McpTool[]> {
	await ensureInitialised();
	const tools: McpTool[] = [];
	let cursor: string | undefined;
	do {
		const result = (await rpc("tools/list", cursor ? { cursor } : undefined)) as {
			tools?: McpTool[];
			nextCursor?: string;
		};
		tools.push(...(result.tools ?? []));
		cursor = result.nextCursor;
	} while (cursor);
	return tools;
}

export async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
	await ensureInitialised();
	const result = (await rpc("tools/call", { name, arguments: args })) as {
		isError?: boolean;
		content?: { type?: string; text?: string }[];
	};

	// A tool that fails answers with isError on an otherwise successful JSON-RPC
	// call. Reporting that as success would let a script read failure as success,
	// so surface it as a CLI error with a non-zero exit code.
	if (result?.isError === true) {
		const detail = (result.content ?? [])
			.map((part) => part.text ?? "")
			.join(" ")
			.replace(/\s+/g, " ")
			.trim();
		throw new CliError(`Vanta MCP tool "${name}" failed: ${detail || "no detail returned"}`, {
			suggestion: `Check the arguments against 'elnora-vanta mcp tools --name ${name}'.`,
		});
	}

	return result;
}
