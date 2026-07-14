/**
 * Error hierarchy for the elnora-vanta CLI.
 */

/**
 * Exit codes by error type.
 * 1 = generic, 2 = usage/validation, 3 = auth, 4 = not found,
 * 5 = rate limit, 10 = unexpected/crash.
 */
export const EXIT_CODES = {
	GENERIC: 1,
	USAGE: 2,
	AUTH: 3,
	NOT_FOUND: 4,
	RATE_LIMIT: 5,
	UNEXPECTED: 10,
} as const;

export class CliError extends Error {
	readonly userMessage: string;
	readonly suggestion?: string;
	readonly exitCode: number;

	constructor(message: string, options?: { suggestion?: string; exitCode?: number }) {
		super(message);
		this.name = "CliError";
		this.userMessage = message;
		this.suggestion = options?.suggestion;
		this.exitCode = options?.exitCode ?? EXIT_CODES.GENERIC;
	}
}

export class AuthError extends CliError {
	constructor(message?: string) {
		super(message ?? "Vanta credentials not found. Set VANTA_CLIENT_ID and VANTA_CLIENT_SECRET in your .env file.", {
			suggestion:
				"Add VANTA_CLIENT_ID=... and VANTA_CLIENT_SECRET=... to your .env file. Get credentials from Vanta > Settings > Developer Console.",
			exitCode: EXIT_CODES.AUTH,
		});
		this.name = "AuthError";
	}
}

export class RateLimitError extends CliError {
	readonly retryAfter?: number;

	constructor(retryAfter?: number) {
		super(`Rate limit exceeded${retryAfter ? `. Retry after ${retryAfter}s` : ""}`, {
			suggestion: "Wait and retry. Vanta allows 50 requests/min for management endpoints.",
			exitCode: EXIT_CODES.RATE_LIMIT,
		});
		this.name = "RateLimitError";
		this.retryAfter = retryAfter;
	}
}

export class ValidationError extends CliError {
	constructor(message: string, suggestion?: string) {
		super(message, { suggestion, exitCode: EXIT_CODES.USAGE });
		this.name = "ValidationError";
	}
}
