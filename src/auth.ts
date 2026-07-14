/**
 * OAuth 2.0 client_credentials authentication for the Vanta API.
 * Token cached to ~/.config/elnora-vanta/token.json with auto-refresh.
 */

import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { platform } from "node:os";
import { join } from "node:path";
import { apiOrigin, configDir, loadEnv } from "./config.js";
import { AuthError } from "./utils/errors.js";

const TOKEN_CACHE_PATH = join(configDir(), "token.json");
const TOKEN_REFRESH_BUFFER_MS = 60_000; // Refresh 60s before expiry

interface TokenCache {
	access_token: string;
	expires_at: number; // epoch ms
}

function getCredentials(): { clientId: string; clientSecret: string } {
	loadEnv();
	const clientId = process.env.VANTA_CLIENT_ID;
	const clientSecret = process.env.VANTA_CLIENT_SECRET;
	if (!clientId || !clientSecret) {
		throw new AuthError();
	}
	return { clientId: clientId.trim(), clientSecret: clientSecret.trim() };
}

async function readCachedToken(): Promise<TokenCache | null> {
	try {
		const data = await readFile(TOKEN_CACHE_PATH, "utf-8");
		const cache: TokenCache = JSON.parse(data);
		if (
			cache.access_token &&
			typeof cache.expires_at === "number" &&
			cache.expires_at > Date.now() + TOKEN_REFRESH_BUFFER_MS
		) {
			return cache;
		}
		return null;
	} catch (error: unknown) {
		if (error instanceof Error && "code" in error && (error as NodeJS.ErrnoException).code === "ENOENT") {
			return null; // File doesn't exist yet — expected on first run
		}
		const msg = error instanceof Error ? error.message : String(error);
		process.stderr.write(
			`Warning: Token cache at ${TOKEN_CACHE_PATH} is unreadable (${msg}). Deleting and re-authenticating.\n`,
		);
		try {
			await unlink(TOKEN_CACHE_PATH);
		} catch (unlinkError: unknown) {
			const unlinkMsg = unlinkError instanceof Error ? unlinkError.message : String(unlinkError);
			process.stderr.write(
				`Warning: Could not delete corrupt token cache at ${TOKEN_CACHE_PATH}: ${unlinkMsg}. ` +
					`Delete it manually if this warning persists.\n`,
			);
		}
		return null;
	}
}

async function writeCachedToken(cache: TokenCache): Promise<void> {
	await mkdir(configDir(), { recursive: true, mode: 0o700 });
	await writeFile(TOKEN_CACHE_PATH, JSON.stringify(cache, null, 2), {
		encoding: "utf-8",
		mode: 0o600, // Owner-only read/write — token is sensitive (Unix only)
	});
	// On Windows, fs.writeFile mode is ignored — tighten permissions via icacls
	if (platform() === "win32" && process.env.USERNAME) {
		try {
			const { execFileSync } = await import("node:child_process");
			execFileSync("icacls", [TOKEN_CACHE_PATH, "/inheritance:r", "/grant:r", `${process.env.USERNAME}:(R,W,D)`], {
				stdio: "ignore",
			});
		} catch {
			// Best-effort — Windows ACL enforcement is not always available
		}
	}
}

async function fetchNewToken(clientId: string, clientSecret: string): Promise<TokenCache> {
	const response = await fetch(`${apiOrigin()}/oauth/token`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			grant_type: "client_credentials",
			client_id: clientId,
			client_secret: clientSecret,
			scope: "vanta-api.all:read",
		}),
	});

	if (!response.ok) {
		const body = await response.text();
		const truncated = body.slice(0, 200).replace(/[a-zA-Z0-9_-]{40,}/g, "[REDACTED]");
		throw new AuthError(`OAuth token request failed (${response.status}): ${truncated}`);
	}

	const data = await response.json();
	if (!data.access_token || typeof data.access_token !== "string") {
		throw new AuthError(
			`OAuth response missing 'access_token'. Response keys: ${Object.keys(data).join(", ")}. ` +
				`Verify the OAuth app is configured for client_credentials grant.`,
		);
	}
	if (typeof data.expires_in !== "number" || data.expires_in <= 0) {
		throw new AuthError(
			`OAuth response has invalid 'expires_in': ${JSON.stringify(data.expires_in)}. ` +
				`Expected a positive number of seconds.`,
		);
	}
	// Validate token: printable ASCII only
	const rawToken = String(data.access_token);
	if (!/^[\x20-\x7e]+$/.test(rawToken)) {
		throw new AuthError("OAuth access_token contains invalid characters");
	}
	// Encode→decode via binary creates a provably new string (taint barrier)
	const safeToken = new TextDecoder().decode(new TextEncoder().encode(rawToken));
	const cache: TokenCache = {
		access_token: safeToken,
		expires_at: Date.now() + Number(data.expires_in) * 1000,
	};

	try {
		await writeCachedToken(cache);
	} catch (error: unknown) {
		process.stderr.write(
			`Warning: Could not cache token to ${TOKEN_CACHE_PATH}: ${error instanceof Error ? error.message : String(error)}. ` +
				`Token is valid but won't be cached (each CLI run will re-authenticate). ` +
				`Fix: check write permissions on ${TOKEN_CACHE_PATH} or its parent directory.\n`,
		);
	}
	return cache;
}

let cachedToken: TokenCache | null = null;

export async function getAccessToken(): Promise<string> {
	if (cachedToken && cachedToken.expires_at > Date.now() + TOKEN_REFRESH_BUFFER_MS) {
		return cachedToken.access_token;
	}
	cachedToken = null;

	// Check file cache
	const cached = await readCachedToken();
	if (cached) {
		cachedToken = cached;
		return cached.access_token;
	}

	// Fetch new token
	const { clientId, clientSecret } = getCredentials();
	const token = await fetchNewToken(clientId, clientSecret);
	cachedToken = token;
	return token.access_token;
}

export async function clearCachedToken(): Promise<void> {
	cachedToken = null;
	try {
		await unlink(TOKEN_CACHE_PATH);
	} catch (error: unknown) {
		const code = error instanceof Error && "code" in error ? (error as NodeJS.ErrnoException).code : undefined;
		if (code !== "ENOENT") {
			process.stderr.write(
				`Warning: could not delete token cache: ${error instanceof Error ? error.message : String(error)}\n`,
			);
		}
	}
}
