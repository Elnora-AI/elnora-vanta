/**
 * Output contract for the Elnora Vanta CLI.
 * - Success: JSON to stdout, exit 0
 * - Error: JSON to stderr, exit 1
 */

import { CliError, EXIT_CODES, ValidationError } from "./utils/errors.js";

// --- Global output settings ---

let compactMode = false;
export function setCompactMode(value: boolean): void {
	compactMode = value;
}

type OutputFormat = "json" | "table" | "csv";
let outputFormat: OutputFormat = "json";
export function setOutputFormat(value: string): void {
	const valid: OutputFormat[] = ["json", "table", "csv"];
	if (!valid.includes(value as OutputFormat)) {
		throw new ValidationError(`Invalid --output value: "${value}". Must be one of: ${valid.join(", ")}.`);
	}
	outputFormat = value as OutputFormat;
}

let fieldFilter: string[] | null = null;
export function setFields(value: string): void {
	const fields = value
		.split(",")
		.map((f) => f.trim())
		.filter(Boolean);
	if (fields.length === 0) {
		throw new ValidationError(`Invalid --fields value: "${value}". Provide comma-separated field names.`);
	}
	fieldFilter = fields;
}
export function getFields(): string[] | null {
	return fieldFilter;
}

let globalPageSize = 100;
export function setPageSize(value: string): void {
	const n = parseInt(value, 10);
	if (isNaN(n) || n < 1 || n > 100) {
		throw new ValidationError(`Invalid --page-size value: "${value}". Must be an integer between 1 and 100.`);
	}
	globalPageSize = n;
}
export function getPageSize(): number {
	return globalPageSize;
}

// --- Output functions ---

/**
 * Find the primary data array in a result object.
 * Looks for the first array-valued property (skipping scalar metadata like "count").
 */
function findDataArray(data: unknown): { key: string; rows: Record<string, unknown>[] } | null {
	if (typeof data !== "object" || data === null || Array.isArray(data)) return null;
	const obj = data as Record<string, unknown>;
	for (const key of Object.keys(obj)) {
		if (Array.isArray(obj[key])) {
			const arr = obj[key] as unknown[];
			if (arr.length === 0) {
				return { key, rows: [] };
			}
			const first = arr[0];
			if (typeof first === "object" && first !== null) {
				return { key, rows: obj[key] as Record<string, unknown>[] };
			}
		}
	}
	return null;
}

function formatCell(value: unknown): string {
	if (value === null || value === undefined) return "";
	if (typeof value === "object") return JSON.stringify(value);
	return String(value);
}

function outputTable(data: unknown): void {
	const found = findDataArray(data);
	if (!found) {
		process.stderr.write(`Warning: --output table requested but response is not a list. Falling back to JSON.\n`);
		console.log(JSON.stringify(data, null, 2));
		return;
	}

	const { rows } = found;
	if (rows.length === 0) {
		console.log("(no results)");
		return;
	}
	const keys = Object.keys(rows[0]);
	const cells = rows.map((row) => keys.map((k) => formatCell(row[k])));

	// Calculate column widths (capped to keep tables readable)
	const MAX_COL_WIDTH = 60;
	const widths = keys.map((k, i) => Math.min(MAX_COL_WIDTH, Math.max(k.length, ...cells.map((row) => row[i].length))));

	function truncateCell(value: string, maxWidth: number): string {
		return value.length > maxWidth ? value.slice(0, maxWidth - 3) + "..." : value;
	}

	// Header
	const header = keys.map((k, i) => k.toUpperCase().padEnd(widths[i])).join("  ");
	const separator = widths.map((w) => "-".repeat(w)).join("  ");
	console.log(header);
	console.log(separator);

	// Rows
	for (const row of cells) {
		console.log(row.map((c, i) => truncateCell(c, widths[i]).padEnd(widths[i])).join("  "));
	}

	// Summary from metadata
	const obj = data as Record<string, unknown>;
	const meta: string[] = [];
	for (const [k, v] of Object.entries(obj)) {
		if (k !== found.key && typeof v !== "object") {
			meta.push(`${k}: ${v}`);
		}
	}
	if (meta.length > 0) {
		console.log(`\n${meta.join(" | ")}`);
	}
}

function csvEscape(value: string): string {
	if (value.includes(",") || value.includes('"') || value.includes("\n")) {
		return `"${value.replace(/"/g, '""')}"`;
	}
	return value;
}

function outputCsv(data: unknown): void {
	const found = findDataArray(data);
	if (!found) {
		process.stderr.write(`Warning: --output csv requested but response is not a list. Falling back to JSON.\n`);
		console.log(JSON.stringify(data, null, 2));
		return;
	}

	const { rows } = found;
	if (rows.length === 0) {
		return;
	}
	const keys = Object.keys(rows[0]);

	// Header
	console.log(keys.map((k) => csvEscape(k)).join(","));

	// Rows
	for (const row of rows) {
		console.log(keys.map((k) => csvEscape(formatCell(row[k]))).join(","));
	}
}

function applyFieldFilter(data: unknown): unknown {
	if (!fieldFilter) return data;
	const found = findDataArray(data);
	if (!found) {
		process.stderr.write(`Warning: --fields requested but response is not a list. Field filter ignored.\n`);
		return data;
	}

	// Warn about fields that don't exist in the data
	if (found.rows.length > 0) {
		const availableFields = Object.keys(found.rows[0]);
		const missingFields = fieldFilter.filter((f) => !(f in found.rows[0]));
		if (missingFields.length > 0) {
			process.stderr.write(
				`Warning: --fields requested non-existent field(s): ${missingFields.join(", ")}. ` +
					`Available: ${availableFields.join(", ")}\n`,
			);
		}
	}

	const filteredRows = found.rows.map((row) => {
		const filtered: Record<string, unknown> = {};
		for (const field of fieldFilter!) {
			if (field in row) filtered[field] = row[field];
		}
		return filtered;
	});

	// Rebuild the object with filtered rows and preserve metadata
	const obj = { ...(data as Record<string, unknown>) };
	obj[found.key] = filteredRows;
	return obj;
}

export function outputSuccess(data: unknown): void {
	const filtered = applyFieldFilter(data);
	switch (outputFormat) {
		case "table":
			outputTable(filtered);
			break;
		case "csv":
			outputCsv(filtered);
			break;
		default:
			console.log(compactMode ? JSON.stringify(filtered) : JSON.stringify(filtered, null, 2));
	}
}

export function outputError(error: unknown): void {
	if (error instanceof CliError) {
		const payload: Record<string, string> = {
			error: error.userMessage,
		};
		if (error.suggestion) {
			payload.suggestion = error.suggestion;
		}
		console.error(JSON.stringify(payload, null, 2));
	} else if (error instanceof Error) {
		console.error(JSON.stringify({ error: error.message }, null, 2));
	} else {
		console.error(JSON.stringify({ error: String(error) }, null, 2));
	}
}

/**
 * Parse and validate a --limit option. Returns undefined if not provided.
 * Throws ValidationError for invalid values.
 */
export function parseLimit(value: string | undefined): number | undefined {
	if (!value) return undefined;
	const n = parseInt(value, 10);
	if (isNaN(n) || n <= 0) {
		throw new ValidationError(`Invalid --limit value: "${value}". Must be a positive integer.`);
	}
	return n;
}

/**
 * Wraps an async command handler with error handling.
 * Every command action should be wrapped in this.
 */
function redactSecrets(text: string): string {
	return text.replace(/[a-zA-Z0-9_-]{40,}/g, "[REDACTED]");
}

export function handleAsyncCommand<A extends unknown[]>(
	fn: (...args: A) => Promise<void>,
): (...args: A) => Promise<void> {
	return async (...args: A) => {
		try {
			await fn(...args);
		} catch (error) {
			if (error instanceof CliError) {
				outputError(error);
				process.exit(error.exitCode);
			} else if (error instanceof Error) {
				// Unexpected error — redact secrets, omit stack unless debug mode
				const payload: Record<string, string> = {
					error: redactSecrets(error.message),
					type: error.constructor.name,
				};
				if (process.env.VANTA_CLI_DEBUG) {
					payload.stack = redactSecrets(error.stack ?? "");
				}
				console.error(JSON.stringify(payload, null, 2));
			} else {
				outputError(error);
			}
			process.exit(EXIT_CODES.UNEXPECTED);
		}
	};
}
