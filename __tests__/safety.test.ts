import { describe, expect, it } from "vitest";
import { classifyTool } from "../src/commands/mcp.js";
import { OPERATIONS } from "../src/generated/operations.js";
import { evaluateSafety, parseBodyArgument } from "../src/safety.js";

const READ = { operationId: "ListVendors", method: "GET", path: "/vendors", risk: "read" } as const;
const WRITE = { operationId: "CreateVendor", method: "POST", path: "/vendors", risk: "write" } as const;
const DESTRUCTIVE = { operationId: "DeleteById", method: "DELETE", path: "/vendors/x", risk: "destructive" } as const;

describe("write-safety gate", () => {
	it("runs reads without any flags", () => {
		expect(evaluateSafety(READ, {}).execute).toBe(true);
	});

	it("refuses a write with no --confirm", () => {
		const decision = evaluateSafety(WRITE, {});
		expect(decision.execute).toBe(false);
		expect(decision.plan.addFlags).toEqual(["--confirm"]);
	});

	it("allows a write once --confirm is given", () => {
		expect(evaluateSafety(WRITE, { confirm: true }).execute).toBe(true);
	});

	it("refuses a destructive operation that has only --confirm", () => {
		const decision = evaluateSafety(DESTRUCTIVE, { confirm: true });
		expect(decision.execute).toBe(false);
		expect(decision.plan.addFlags).toEqual(["--force"]);
	});

	it("refuses a destructive operation that has only --force", () => {
		const decision = evaluateSafety(DESTRUCTIVE, { force: true });
		expect(decision.execute).toBe(false);
		expect(decision.plan.addFlags).toEqual(["--confirm"]);
	});

	it("allows a destructive operation with both flags", () => {
		expect(evaluateSafety(DESTRUCTIVE, { confirm: true, force: true }).execute).toBe(true);
	});

	it("lets --dry-run override a fully confirmed destructive call", () => {
		const decision = evaluateSafety(DESTRUCTIVE, { confirm: true, force: true, dryRun: true });
		expect(decision.execute).toBe(false);
		expect(decision.plan.dryRun).toBe(true);
	});

	it("never executes a non-read operation without an explicit flag", () => {
		for (const operation of OPERATIONS) {
			if (operation.risk === "read") continue;
			const decision = evaluateSafety(
				{ operationId: operation.id, method: operation.method, path: operation.path, risk: operation.risk },
				{},
			);
			expect(decision.execute, `${operation.group} ${operation.command} executed unflagged`).toBe(false);
		}
	});
});

describe("--body parsing", () => {
	it("returns undefined when no body is passed", async () => {
		expect(await parseBodyArgument(undefined)).toBeUndefined();
	});

	it("parses inline JSON", async () => {
		expect(await parseBodyArgument('{"name":"Acme"}')).toEqual({ name: "Acme" });
	});

	it("rejects malformed JSON with a usable message", async () => {
		await expect(parseBodyArgument("{not json")).rejects.toThrow(/not valid JSON/);
	});

	it("reports an unreadable @file rather than silently sending nothing", async () => {
		await expect(parseBodyArgument("@/nonexistent/body.json")).rejects.toThrow(/Could not read --body file/);
	});
});

describe("generated operation registry", () => {
	it("covers the whole documented surface", () => {
		expect(OPERATIONS.length).toBeGreaterThanOrEqual(321);
	});

	it("classifies every DELETE as destructive", () => {
		for (const operation of OPERATIONS) {
			if (operation.method === "delete") {
				expect(operation.risk, `${operation.id} is DELETE but not destructive`).toBe("destructive");
			}
		}
	});

	it("classifies every GET as read and nothing else as read", () => {
		for (const operation of OPERATIONS) {
			expect(operation.risk === "read").toBe(operation.method === "get");
		}
	});

	it("has a unique group+command for every operation", () => {
		const seen = new Set<string>();
		for (const operation of OPERATIONS) {
			const key = `${operation.group} ${operation.command}`;
			expect(seen.has(key), `duplicate command ${key}`).toBe(false);
			seen.add(key);
		}
	});

	it("declares every {placeholder} in a path as a path parameter", () => {
		for (const operation of OPERATIONS) {
			for (const match of operation.path.matchAll(/\{([^}]+)\}/g)) {
				expect(operation.pathParams, `${operation.id} missing ${match[1]}`).toContain(match[1]);
			}
		}
	});

	it("strips the /v1 prefix the client adds back", () => {
		for (const operation of OPERATIONS) {
			expect(operation.path.startsWith("/v1/"), `${operation.id} double-prefixes /v1`).toBe(false);
		}
	});
});

describe("MCP tool risk classification", () => {
	it("treats Vanta's read verbs as reads", () => {
		for (const name of [
			"listFrameworks",
			"getSlas",
			"searchKnowledgeBase",
			"fetchTrustCenterContent",
			"downloadPolicy",
			"checkRemainingPolicyDrafts",
		]) {
			expect(classifyTool(name), name).toBe("read");
		}
	});

	it("treats deletion-shaped verbs as destructive", () => {
		for (const name of [
			"deletePolicy",
			"deactivateControls",
			"removeKnowledgeBaseTags",
			"rejectPendingAnswerLibraryQuestionAnswers",
			"unlinkRiskScenarioFromImpactAssessment",
		]) {
			expect(classifyTool(name), name).toBe("destructive");
		}
	});

	it("treats mutating verbs as writes", () => {
		for (const name of [
			"createControls",
			"updatePolicyDetails",
			"uploadNewPolicyDraft",
			"generatePolicy",
			"triggerTestRun",
			"approvePendingAnswerLibraryQuestionAnswers",
		]) {
			expect(classifyTool(name), name).toBe("write");
		}
	});

	it("fails closed on an unrecognised verb", () => {
		expect(classifyTool("frobnicateEverything")).toBe("write");
	});
});
