/**
 * User-delegated OAuth for Vanta's hosted MCP server.
 *
 * The REST API uses client_credentials — a service token that works headless.
 * The MCP server does not: it requires an authorization-code grant tied to a
 * real Vanta Admin, so `elnora-vanta mcp login` opens a browser once and caches
 * the result. Everything here is discovered from the server's own metadata
 * rather than hardcoded, so a Vanta endpoint change does not strand the CLI.
 *
 * PKCE (S256) throughout, loopback redirect bound to 127.0.0.1 on an ephemeral
 * port, and a `state` check on the callback.
 */

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { platform } from "node:os";
import { join } from "node:path";
import { configDir } from "../config.js";
import { AuthError, CliError } from "../utils/errors.js";

/** Vanta's regional MCP hosts. Anything else is refused before a request is built. */
export const ALLOWED_MCP_HOSTS = new Set(["mcp.vanta.com", "mcp.eu.vanta.com", "mcp.aus.vanta.com"]);

const LOGIN_TIMEOUT_MS = 300_000; // 5 minutes to finish the browser flow
const TOKEN_REFRESH_BUFFER_MS = 60_000;

export interface McpTokenCache {
	access_token: string;
	refresh_token?: string;
	expires_at: number;
	client_id: string;
	mcp_url: string;
}

interface AuthServerMetadata {
	authorization_endpoint: string;
	token_endpoint: string;
	registration_endpoint?: string;
	scopes_supported?: string[];
}

function tokenPath(): string {
	return join(configDir(), "mcp-token.json");
}

/** The MCP endpoint for the configured region, validated against the host allow-list. */
export function mcpUrl(): string {
	const raw = process.env.VANTA_MCP_URL?.trim() || "https://mcp.vanta.com/mcp";
	let parsed: URL;
	try {
		parsed = new URL(raw);
	} catch {
		throw new CliError(`Invalid VANTA_MCP_URL: ${raw}`);
	}
	if (parsed.protocol !== "https:") {
		throw new CliError(`VANTA_MCP_URL must be HTTPS (got ${parsed.protocol})`);
	}
	if (!ALLOWED_MCP_HOSTS.has(parsed.hostname)) {
		throw new CliError(
			`VANTA_MCP_URL host ${parsed.hostname} is not a Vanta MCP host (allowed: ${[...ALLOWED_MCP_HOSTS].join(", ")})`,
		);
	}
	return parsed.toString();
}

async function discoverMetadata(origin: string): Promise<AuthServerMetadata> {
	const response = await fetch(`${origin}/.well-known/oauth-authorization-server`, {
		headers: { Accept: "application/json" },
		signal: AbortSignal.timeout(30_000),
	});
	if (!response.ok) {
		throw new AuthError(`Could not read OAuth metadata from ${origin} (HTTP ${response.status})`);
	}
	const metadata = (await response.json()) as AuthServerMetadata;
	for (const field of ["authorization_endpoint", "token_endpoint"] as const) {
		const value = metadata[field];
		if (!value || new URL(value).protocol !== "https:") {
			throw new AuthError(`OAuth metadata from ${origin} has no usable HTTPS ${field}`);
		}
	}
	return metadata;
}

/** Register a public client via RFC 7591 dynamic registration. */
async function registerClient(metadata: AuthServerMetadata, redirectUri: string): Promise<string> {
	if (!metadata.registration_endpoint) {
		throw new AuthError(
			"Vanta's OAuth metadata offers no registration endpoint, so the CLI cannot register itself. " +
				"Set VANTA_MCP_CLIENT_ID to a client you created manually.",
		);
	}
	const response = await fetch(metadata.registration_endpoint, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			client_name: "elnora-vanta CLI",
			redirect_uris: [redirectUri],
			grant_types: ["authorization_code", "refresh_token"],
			response_types: ["code"],
			token_endpoint_auth_method: "none",
		}),
		signal: AbortSignal.timeout(30_000),
	});
	if (!response.ok) {
		const body = (await response.text()).slice(0, 200);
		throw new AuthError(`Dynamic client registration failed (${response.status}): ${body}`);
	}
	const data = (await response.json()) as { client_id?: string };
	if (!data.client_id) throw new AuthError("Registration response contained no client_id");
	return data.client_id;
}

/** Serve exactly one loopback callback, then shut down. */
async function awaitCallback(
	expectedState: string,
): Promise<{ redirectUri: string; code: Promise<string>; close: () => void }> {
	let resolveCode: (code: string) => void;
	let rejectCode: (error: Error) => void;
	const code = new Promise<string>((resolve, reject) => {
		resolveCode = resolve;
		rejectCode = reject;
	});

	const server = createServer((req, res) => {
		const url = new URL(req.url ?? "/", "http://127.0.0.1");
		if (url.pathname !== "/callback") {
			res.writeHead(404).end("Not found");
			return;
		}
		const returnedState = url.searchParams.get("state") ?? "";
		const expected = Buffer.from(expectedState);
		const actual = Buffer.from(returnedState);
		if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
			res.writeHead(400).end("State mismatch — authorization rejected.");
			rejectCode(new AuthError("OAuth state mismatch; the callback did not come from the flow we started."));
			return;
		}
		const error = url.searchParams.get("error");
		if (error) {
			res.writeHead(400).end(`Authorization failed: ${error}`);
			rejectCode(new AuthError(`Vanta returned "${error}" instead of an authorization code.`));
			return;
		}
		const returnedCode = url.searchParams.get("code");
		if (!returnedCode) {
			res.writeHead(400).end("No authorization code in callback.");
			rejectCode(new AuthError("Callback carried no authorization code."));
			return;
		}
		res
			.writeHead(200, { "Content-Type": "text/plain" })
			.end("elnora-vanta is connected to Vanta MCP. You can close this tab.");
		resolveCode(returnedCode);
	});

	// listen() is asynchronous — the port is only known once 'listening' fires.
	await new Promise<void>((resolve, reject) => {
		server.once("error", reject);
		server.listen(0, "127.0.0.1", resolve);
	});

	const address = server.address();
	if (!address || typeof address === "string") {
		server.close();
		throw new CliError("Could not bind a loopback port for the OAuth callback");
	}

	return {
		redirectUri: `http://127.0.0.1:${address.port}/callback`,
		code,
		close: () => server.close(),
	};
}

async function writeTokenCache(cache: McpTokenCache): Promise<void> {
	const path = tokenPath();
	await mkdir(configDir(), { recursive: true, mode: 0o700 });
	await writeFile(path, JSON.stringify(cache, null, 2), { encoding: "utf-8", mode: 0o600 });
	if (platform() === "win32" && process.env.USERNAME) {
		try {
			const { execFileSync } = await import("node:child_process");
			execFileSync("icacls", [path, "/inheritance:r", "/grant:r", `${process.env.USERNAME}:(R,W,D)`], {
				stdio: "ignore",
			});
		} catch {
			// Best-effort — Windows ACL enforcement is not always available.
		}
	}
}

async function readTokenCache(): Promise<McpTokenCache | null> {
	try {
		return JSON.parse(await readFile(tokenPath(), "utf-8")) as McpTokenCache;
	} catch (error: unknown) {
		if (error instanceof Error && (error as NodeJS.ErrnoException).code === "ENOENT") return null;
		process.stderr.write(`Warning: MCP token cache unreadable; re-authenticate with 'elnora-vanta mcp login'.\n`);
		return null;
	}
}

async function exchange(
	metadata: AuthServerMetadata,
	params: Record<string, string>,
	clientId: string,
	target: string,
): Promise<McpTokenCache> {
	const response = await fetch(metadata.token_endpoint, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams(params),
		signal: AbortSignal.timeout(30_000),
	});
	if (!response.ok) {
		const body = (await response.text()).slice(0, 200).replace(/[a-zA-Z0-9_-]{40,}/g, "[REDACTED]");
		throw new AuthError(`MCP token exchange failed (${response.status}): ${body}`);
	}
	const data = (await response.json()) as {
		access_token?: string;
		refresh_token?: string;
		expires_in?: number;
	};
	if (!data.access_token || !/^[\x20-\x7e]+$/.test(data.access_token)) {
		throw new AuthError("MCP token response contained no usable access_token");
	}
	return {
		access_token: new TextDecoder().decode(new TextEncoder().encode(data.access_token)),
		refresh_token: data.refresh_token,
		expires_at: Date.now() + (data.expires_in ?? 3600) * 1000,
		client_id: clientId,
		mcp_url: target,
	};
}

/**
 * Run the browser flow and cache the result. Prints the URL rather than
 * shelling out to a browser opener, so it behaves the same over SSH.
 */
export async function mcpLogin(): Promise<McpTokenCache> {
	const target = mcpUrl();
	const origin = new URL(target).origin;
	const metadata = await discoverMetadata(origin);

	const verifier = randomBytes(32).toString("base64url");
	const challenge = createHash("sha256").update(verifier).digest("base64url");
	const state = randomBytes(16).toString("base64url");

	const callback = await awaitCallback(state);
	try {
		const clientId = process.env.VANTA_MCP_CLIENT_ID?.trim() || (await registerClient(metadata, callback.redirectUri));

		const authorizeUrl = new URL(metadata.authorization_endpoint);
		authorizeUrl.searchParams.set("response_type", "code");
		authorizeUrl.searchParams.set("client_id", clientId);
		authorizeUrl.searchParams.set("redirect_uri", callback.redirectUri);
		authorizeUrl.searchParams.set("code_challenge", challenge);
		authorizeUrl.searchParams.set("code_challenge_method", "S256");
		authorizeUrl.searchParams.set("state", state);
		authorizeUrl.searchParams.set("scope", metadata.scopes_supported?.join(" ") ?? "mcp-api.all:write");
		authorizeUrl.searchParams.set("resource", `${origin}/`);

		process.stderr.write(`\nOpen this URL to authorize elnora-vanta with Vanta MCP:\n\n${authorizeUrl}\n\n`);
		process.stderr.write("Waiting for the callback (Ctrl-C to abort)...\n");

		const code = await Promise.race([
			callback.code,
			new Promise<never>((_, reject) =>
				setTimeout(() => reject(new AuthError("Timed out waiting for the browser callback.")), LOGIN_TIMEOUT_MS),
			),
		]);

		const cache = await exchange(
			metadata,
			{
				grant_type: "authorization_code",
				code,
				redirect_uri: callback.redirectUri,
				client_id: clientId,
				code_verifier: verifier,
				resource: `${origin}/`,
			},
			clientId,
			target,
		);
		await writeTokenCache(cache);
		return cache;
	} finally {
		callback.close();
	}
}

/** A valid MCP access token, refreshed if possible, else a clear instruction to log in. */
export async function getMcpToken(): Promise<string> {
	const cached = await readTokenCache();
	if (!cached) {
		throw new AuthError(
			"Not connected to Vanta MCP.",
			"Run 'elnora-vanta mcp login'. It needs a Vanta Admin account; the MCP server does not accept non-Admin users.",
		);
	}
	if (cached.expires_at > Date.now() + TOKEN_REFRESH_BUFFER_MS) {
		return cached.access_token;
	}
	if (!cached.refresh_token) {
		throw new AuthError(
			"The Vanta MCP session expired.",
			"Run 'elnora-vanta mcp login'. It needs a Vanta Admin account; the MCP server does not accept non-Admin users.",
		);
	}

	const origin = new URL(cached.mcp_url).origin;
	const metadata = await discoverMetadata(origin);
	const refreshed = await exchange(
		metadata,
		{
			grant_type: "refresh_token",
			refresh_token: cached.refresh_token,
			client_id: cached.client_id,
			resource: `${origin}/`,
		},
		cached.client_id,
		cached.mcp_url,
	);
	// Vanta may not reissue a refresh token; keep the existing one if so.
	refreshed.refresh_token ??= cached.refresh_token;
	await writeTokenCache(refreshed);
	return refreshed.access_token;
}

export async function mcpLogout(): Promise<void> {
	try {
		await unlink(tokenPath());
	} catch (error: unknown) {
		if (error instanceof Error && (error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
	}
}
