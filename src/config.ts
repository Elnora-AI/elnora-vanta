/**
 * Credential + region resolution for the elnora-vanta CLI.
 *
 * Resolution order (first hit wins):
 *   1. Process environment (VANTA_CLIENT_ID / VANTA_CLIENT_SECRET / VANTA_API_BASE_URL)
 *   2. ~/.config/elnora-vanta/.env   (or $VANTA_CONFIG_DIR/.env)
 *   3. .env next to the installed CLI (repo-local dev convenience)
 *
 * Env files are parsed with a strict key allowlist; nothing outside the config
 * directory or the CLI's own folder is ever read. Credentials only ever leave
 * the machine toward Vanta's own API hosts (see ALLOWED_API_HOSTS).
 */

import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Env allowlist — only these variables are extracted from .env files.
const ALLOWED_ENV_KEYS = new Set(["VANTA_CLIENT_ID", "VANTA_CLIENT_SECRET", "VANTA_API_BASE_URL"]);

// Vanta's regional API hosts. The SSRF guard refuses anything else, so a
// mistyped VANTA_API_BASE_URL can never redirect credentials off-platform.
export const ALLOWED_API_HOSTS = new Set(["api.vanta.com", "api.eu.vanta.com", "api.aus.vanta.com"]);

function parseEnvFile(filePath: string): void {
	if (!existsSync(filePath)) return;
	const content = readFileSync(filePath, "utf-8");
	for (const line of content.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const eqIndex = trimmed.indexOf("=");
		if (eqIndex === -1) continue;
		const key = trimmed.slice(0, eqIndex).trim();
		if (!ALLOWED_ENV_KEYS.has(key)) continue;
		let value = trimmed.slice(eqIndex + 1).trim();
		if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
			value = value.slice(1, -1);
		}
		// Only set if not already in environment (env vars take precedence).
		if (!(key in process.env) || process.env[key] === undefined) {
			process.env[key] = value;
		}
	}
}

// User config dir: $VANTA_CONFIG_DIR overrides, else ~/.config/elnora-vanta.
export function configDir(): string {
	const override = process.env.VANTA_CONFIG_DIR?.trim();
	if (override) return override;
	return join(homedir(), ".config", "elnora-vanta");
}

let envLoaded = false;

export function loadEnv(): void {
	if (envLoaded) return;
	envLoaded = true;
	// Environment always wins (parseEnvFile never overwrites an existing key).
	parseEnvFile(join(configDir(), ".env"));
	parseEnvFile(resolve(__dirname, "..", ".env"));
}

/**
 * The API origin, e.g. "https://api.vanta.com" (default) or a regional host
 * set via VANTA_API_BASE_URL (https://api.eu.vanta.com / https://api.aus.vanta.com).
 * Validated against ALLOWED_API_HOSTS — HTTPS only.
 */
export function apiOrigin(): string {
	loadEnv();
	const raw = process.env.VANTA_API_BASE_URL?.trim();
	if (!raw) return "https://api.vanta.com";
	let parsed: URL;
	try {
		parsed = new URL(raw);
	} catch {
		throw new Error(`Invalid VANTA_API_BASE_URL: ${raw}`);
	}
	if (parsed.protocol !== "https:") {
		throw new Error(`Insecure VANTA_API_BASE_URL protocol: ${parsed.protocol} — only HTTPS is allowed`);
	}
	if (!ALLOWED_API_HOSTS.has(parsed.hostname)) {
		throw new Error(
			`VANTA_API_BASE_URL host ${parsed.hostname} is not a Vanta API host (allowed: ${[...ALLOWED_API_HOSTS].join(", ")})`,
		);
	}
	return parsed.origin;
}
