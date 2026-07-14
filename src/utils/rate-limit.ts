/**
 * Token-bucket rate limiter for Vanta API (50 req/min management endpoints).
 */

const MAX_TOKENS = 50;
const REFILL_INTERVAL_MS = 60_000; // 1 minute

let tokens = MAX_TOKENS;
let lastRefill = Date.now();

export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function refill(): void {
	const now = Date.now();
	const elapsed = now - lastRefill;
	const refillAmount = Math.floor((elapsed / REFILL_INTERVAL_MS) * MAX_TOKENS);
	if (refillAmount > 0) {
		tokens = Math.min(MAX_TOKENS, tokens + refillAmount);
		// Advance by consumed time only — preserve fractional remainder
		lastRefill += (refillAmount / MAX_TOKENS) * REFILL_INTERVAL_MS;
	}
}

export async function acquireToken(): Promise<void> {
	refill();
	if (tokens > 0) {
		tokens--;
		return;
	}
	// Wait for next refill
	const waitMs = REFILL_INTERVAL_MS - (Date.now() - lastRefill);
	process.stderr.write(`Rate limit: waiting ${Math.ceil(waitMs / 1000)}s...\n`);
	await sleep(Math.max(waitMs, 0));
	refill();
	if (tokens <= 0) {
		tokens = 1; // Guarantee at least 1 token after a full wait cycle
	}
	tokens--;
}

const MAX_RETRY_SECONDS = 300; // Cap retry delay at 5 minutes

export function getRetryAfterMs(response: Response): number | null {
	const header = response.headers.get("Retry-After");
	if (!header) return null;

	// Try parsing as seconds (most common)
	const seconds = parseInt(header, 10);
	if (!isNaN(seconds)) {
		return Math.min(seconds, MAX_RETRY_SECONDS) * 1000;
	}

	// Try parsing as HTTP-date (RFC 7231)
	const date = new Date(header);
	if (!isNaN(date.getTime())) {
		const delayMs = Math.max(0, date.getTime() - Date.now());
		return Math.min(delayMs, MAX_RETRY_SECONDS * 1000);
	}

	return null;
}
