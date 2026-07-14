/**
 * HTTP client for the Vanta REST API.
 * Wraps fetch() with auth, rate limiting, and retry logic.
 */

import { clearCachedToken, getAccessToken } from "./auth.js";
import { apiOrigin } from "./config.js";
import { AuthError, CliError, RateLimitError } from "./utils/errors.js";
import { acquireToken, getRetryAfterMs, sleep } from "./utils/rate-limit.js";

const FETCH_TIMEOUT_MS = 30_000; // 30s timeout per request

/** Validate a bearer token string (prevents header injection from cached file data). */
function sanitizeBearerToken(token: string): string {
	if (typeof token !== "string" || token.length === 0) {
		throw new Error("Invalid bearer token: must be a non-empty string");
	}
	if (!/^[\x20-\x7e]+$/.test(token)) {
		throw new Error("Bearer token contains invalid characters");
	}
	// Encode→decode via binary creates a provably new string (taint barrier)
	return new TextDecoder().decode(new TextEncoder().encode(token));
}

function stripHtml(body: string): string {
	let result = body;
	let prev: string;
	do {
		prev = result;
		result = result.replace(/<[^>]*>/g, "");
	} while (result !== prev);
	return result.replace(/\s+/g, " ").trim();
}

function sanitizeErrorBody(body: string, maxLen = 200): string {
	const cleaned = body.includes("<") ? stripHtml(body) : body;
	const truncated = cleaned.slice(0, maxLen);
	return truncated.replace(/[a-zA-Z0-9_-]{40,}/g, "[REDACTED]");
}

function apiError(status: number, body: string, endpoint: string): CliError {
	const message = sanitizeErrorBody(body);
	return new CliError(`Vanta API error ${status}: ${message}`, {
		suggestion:
			status === 404
				? `Resource not found at ${endpoint}. Check the ID and try again.`
				: `Unexpected API error. Check Vanta API status or retry.`,
	});
}

async function parseJsonResponse<T>(response: Response, url: string): Promise<T> {
	const text = await response.text();
	try {
		return JSON.parse(text) as T;
	} catch (parseError: unknown) {
		const parseMsg = parseError instanceof Error ? parseError.message : String(parseError);
		throw new CliError(
			`Vanta API returned non-JSON response from ${url} (status ${response.status}). ` +
				`Parse error: ${parseMsg}. Body starts with: ${sanitizeErrorBody(text)}`,
		);
	}
}

/**
 * Encode a user-supplied ID for safe use in URL path segments.
 * Prevents path traversal and query injection via crafted IDs.
 */
export function safeId(id: string): string {
	return encodeURIComponent(id);
}

export async function vantaFetch<T>(path: string, options?: Omit<RequestInit, "method">): Promise<T> {
	await acquireToken();

	const token = await getAccessToken();
	const origin = apiOrigin();
	const allowedHost = new URL(origin).hostname;
	const url = path.startsWith("http") ? path : `${origin}/v1${path.startsWith("/") ? "" : "/"}${path}`;

	// Validate URL always points to the configured Vanta API host over HTTPS — prevents SSRF
	const parsed = new URL(url);
	if (parsed.hostname !== allowedHost) {
		throw new Error(`Refusing to send authenticated request to ${parsed.hostname} (only ${allowedHost} is allowed)`);
	}
	if (parsed.protocol !== "https:") {
		throw new Error(`Refusing to send authenticated request over ${parsed.protocol} (only HTTPS is allowed)`);
	}

	const makeHeaders = (bearerToken: string): Record<string, string> => ({
		Authorization: `Bearer ${sanitizeBearerToken(bearerToken)}`,
		"Content-Type": "application/json",
		Accept: "application/json",
		...(options?.headers as Record<string, string> | undefined),
	});

	const response = await fetch(url, {
		...options,
		method: "GET", // Read-only CLI — never allow write methods
		headers: makeHeaders(token),
		signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
	});

	// Handle 401 — clear cached token (file + memory) and retry once
	if (response.status === 401) {
		await clearCachedToken();
		const newToken = await getAccessToken();

		if (newToken === token) {
			throw new AuthError(
				"Token refresh returned the same token. The OAuth server may be caching stale credentials. " +
					"Try deleting ~/.config/elnora-vanta/token.json manually and check that VANTA_CLIENT_ID and VANTA_CLIENT_SECRET are correct.",
			);
		}

		await acquireToken();
		const retryResponse = await fetch(url, {
			...options,
			method: "GET",
			headers: makeHeaders(newToken),
			signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
		});

		if (!retryResponse.ok) {
			const retryBody = await retryResponse.text();
			throw new AuthError(
				`Authentication failed after token refresh (${retryResponse.status}): ${sanitizeErrorBody(retryBody)}. ` +
					`Verify VANTA_CLIENT_ID and VANTA_CLIENT_SECRET are correct and the OAuth app has 'vanta-api.all:read' scope.`,
			);
		}

		return parseJsonResponse<T>(retryResponse, url);
	}

	// Handle 429 — respect Retry-After and retry once
	if (response.status === 429) {
		const retryMs = getRetryAfterMs(response) ?? 60_000;
		process.stderr.write(`Rate limited. Waiting ${Math.ceil(retryMs / 1000)}s...\n`);
		await sleep(retryMs);

		await acquireToken();
		const retryToken = await getAccessToken();
		const retryResponse = await fetch(url, {
			...options,
			method: "GET",
			headers: makeHeaders(retryToken),
			signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
		});

		if (retryResponse.status === 429) {
			throw new RateLimitError();
		}

		if (retryResponse.status === 401) {
			throw new AuthError(
				`Authentication failed after rate-limit retry (401). ` +
					`Token may have expired during wait. ` +
					`Verify VANTA_CLIENT_ID and VANTA_CLIENT_SECRET are correct and the OAuth app has 'vanta-api.all:read' scope.`,
			);
		}

		if (!retryResponse.ok) {
			const body = await retryResponse.text();
			throw apiError(retryResponse.status, body, path);
		}

		return parseJsonResponse<T>(retryResponse, url);
	}

	if (!response.ok) {
		const body = await response.text();
		throw apiError(response.status, body, path);
	}

	return parseJsonResponse<T>(response, url);
}
