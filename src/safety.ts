/**
 * Write-safety gate for the generated API surface.
 *
 * The CLI talks to live SOC 2 / ISO 27001 evidence, so a write never happens
 * as a side effect of a mistyped command. Every non-GET operation is planned
 * and printed first, and only executes when the caller has said so explicitly:
 *
 *   read         — runs immediately.
 *   write        — prints the plan and stops unless --confirm is passed.
 *   destructive  — prints the plan and stops unless BOTH --confirm and --force.
 *
 * --dry-run always wins, so an agent can be handed a confirm-carrying command
 * line and still be prevented from mutating anything.
 */

import type { OperationRisk } from "./generated/operations.js";
import { ValidationError } from "./utils/errors.js";

export interface SafetyFlags {
	confirm?: boolean;
	force?: boolean;
	dryRun?: boolean;
}

export interface RequestPlan {
	operationId: string;
	method: string;
	path: string;
	risk: OperationRisk;
	query?: Record<string, string>;
	body?: unknown;
}

/** Explains, in the plan output, what the caller must add to actually run it. */
function requiredFlags(risk: OperationRisk): string[] {
	if (risk === "destructive") return ["--confirm", "--force"];
	if (risk === "write") return ["--confirm"];
	return [];
}

export interface SafetyDecision {
	execute: boolean;
	plan: Record<string, unknown>;
}

/**
 * Decide whether an operation may run. Returns the decision plus the plan
 * object to print — the caller prints it either way, so a dry run and a real
 * run describe the request identically.
 */
export function evaluateSafety(plan: RequestPlan, flags: SafetyFlags): SafetyDecision {
	const needed = requiredFlags(plan.risk);

	const described: Record<string, unknown> = {
		operationId: plan.operationId,
		method: plan.method,
		path: plan.path,
		risk: plan.risk,
		...(plan.query && Object.keys(plan.query).length > 0 ? { query: plan.query } : {}),
		...(plan.body !== undefined ? { body: plan.body } : {}),
	};

	if (plan.risk === "read") {
		if (flags.dryRun) {
			return { execute: false, plan: { dryRun: true, wouldRequest: described } };
		}
		return { execute: true, plan: described };
	}

	if (flags.dryRun) {
		return {
			execute: false,
			plan: { dryRun: true, wouldRequest: described, note: "--dry-run was passed; nothing was sent." },
		};
	}

	const missing = needed.filter((flag) => (flag === "--confirm" ? !flags.confirm : !flags.force));
	if (missing.length > 0) {
		return {
			execute: false,
			plan: {
				dryRun: true,
				wouldRequest: described,
				blocked: `This ${plan.risk} operation was not sent.`,
				addFlags: missing,
				hint: `Re-run with ${needed.join(" ")} to execute it.`,
			},
		};
	}

	return { execute: true, plan: described };
}

/**
 * Parse a --body argument: either inline JSON, or @path to read a JSON file.
 * Returns undefined when no body was supplied.
 */
export async function parseBodyArgument(raw: string | undefined): Promise<unknown> {
	if (raw === undefined) return undefined;

	let text = raw;
	if (raw.startsWith("@")) {
		const { readFile } = await import("node:fs/promises");
		const path = raw.slice(1);
		try {
			text = await readFile(path, "utf-8");
		} catch (error: unknown) {
			throw new ValidationError(
				`Could not read --body file "${path}": ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	try {
		return JSON.parse(text);
	} catch (error: unknown) {
		throw new ValidationError(
			`--body is not valid JSON (${error instanceof Error ? error.message : String(error)}). ` +
				`Pass inline JSON, or @file.json to read it from disk.`,
		);
	}
}
