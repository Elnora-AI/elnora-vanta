import { describe, expect, it, vi } from "vitest";

/**
 * output.ts holds --fields / --output as module state with no reset API, so
 * each case loads a fresh copy rather than leaking configuration between tests.
 */
async function freshOutput() {
	vi.resetModules();
	return import("../src/output.js");
}

/** Capture what outputSuccess prints, without letting it reach the terminal. */
function capture(fn: () => void): string {
	const lines: string[] = [];
	const spy = vi.spyOn(console, "log").mockImplementation((...args: unknown[]) => {
		lines.push(args.map(String).join(" "));
	});
	try {
		fn();
	} finally {
		spy.mockRestore();
	}
	return lines.join("\n");
}

const TOP_LEVEL = { frameworks: [{ id: "soc2", name: "SOC 2", extra: "drop me" }], count: 1 };
const ENVELOPE = {
	results: {
		pageInfo: { hasNextPage: false },
		data: [{ id: "soc2", name: "SOC 2", extra: "drop me" }],
	},
};

/**
 * The curated commands return rows at the top level; the generated API surface
 * returns Vanta's paginated envelope, which nests them under results.data.
 * --fields and --output csv/table have to see both.
 */
describe("row discovery across response shapes", () => {
	it("filters fields in a top-level array", async () => {
		const o = await freshOutput();
		o.setFields("id,name");
		o.setCompactMode(true);
		const out = capture(() => o.outputSuccess(TOP_LEVEL));
		expect(out).toContain('"id":"soc2"');
		expect(out).not.toContain("drop me");
	});

	it("filters fields inside Vanta's paginated envelope", async () => {
		const o = await freshOutput();
		o.setFields("id,name");
		o.setCompactMode(true);
		const out = capture(() => o.outputSuccess(ENVELOPE));
		expect(out).toContain('"id":"soc2"');
		expect(out).not.toContain("drop me");
	});

	it("preserves pagination metadata when filtering the envelope", async () => {
		const o = await freshOutput();
		o.setFields("id");
		o.setCompactMode(true);
		const out = capture(() => o.outputSuccess(ENVELOPE));
		expect(out).toContain("pageInfo");
		expect(out).toContain("hasNextPage");
	});

	it("emits CSV from a nested envelope rather than falling back to JSON", async () => {
		const o = await freshOutput();
		o.setOutputFormat("csv");
		const out = capture(() => o.outputSuccess(ENVELOPE));
		expect(out.split("\n")[0]).toBe("id,name,extra");
		expect(out).toContain("soc2,SOC 2,drop me");
	});

	it("emits CSV from a top-level array too", async () => {
		const o = await freshOutput();
		o.setOutputFormat("csv");
		const out = capture(() => o.outputSuccess(TOP_LEVEL));
		expect(out.split("\n")[0]).toBe("id,name,extra");
	});

	it("does not mutate the caller's object while filtering", async () => {
		const o = await freshOutput();
		const original = structuredClone(ENVELOPE);
		o.setFields("id");
		capture(() => o.outputSuccess(ENVELOPE));
		expect(ENVELOPE).toEqual(original);
	});

	it("still falls back to JSON when there is no row array at all", async () => {
		const o = await freshOutput();
		o.setOutputFormat("csv");
		const out = capture(() => o.outputSuccess({ id: "soc2", name: "SOC 2" }));
		expect(out).toContain('"id": "soc2"');
	});
});
