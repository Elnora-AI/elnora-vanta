import { type ExecFileSyncOptions, execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const CLI = resolve(import.meta.dirname, "../dist/main.js");
const EXEC_OPTS: ExecFileSyncOptions = { encoding: "utf-8", timeout: 10_000 };

function run(...args: string[]): { stdout: string; stderr: string; exitCode: number } {
	try {
		const stdout = execFileSync("node", [CLI, ...args], {
			...EXEC_OPTS,
			env: { ...process.env, NO_COLOR: "1" },
		}) as string;
		return { stdout, stderr: "", exitCode: 0 };
	} catch (error: unknown) {
		const e = error as { stdout?: string; stderr?: string; status?: number };
		return {
			stdout: (e.stdout ?? "") as string,
			stderr: (e.stderr ?? "") as string,
			exitCode: e.status ?? 1,
		};
	}
}

describe("vanta CLI plumbing", () => {
	it("--help exits 0 and shows all global options", () => {
		const { stdout, exitCode } = run("--help");
		expect(exitCode).toBe(0);
		expect(stdout).toContain("Read-only Vanta compliance CLI");
		expect(stdout).toContain("--compact");
		expect(stdout).toContain("--output");
		expect(stdout).toContain("--fields");
		expect(stdout).toContain("--page-size");
		expect(stdout).toContain("--no-color");
	});

	it("--version exits 0 and prints semver", () => {
		const { stdout, exitCode } = run("--version");
		expect(exitCode).toBe(0);
		expect(stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it("unknown command exits non-zero", () => {
		const { stderr, exitCode } = run("nonexistent-command");
		expect(exitCode).not.toBe(0);
		expect(stderr).toContain("unknown command");
	});

	it("subcommand --help lists available actions", () => {
		const { stdout, exitCode } = run("tests", "--help");
		expect(exitCode).toBe(0);
		expect(stdout).toContain("list");
	});

	it("command without credentials exits 1 with structured error", () => {
		const { stderr, exitCode } = (() => {
			try {
				const stdout = execFileSync("node", [CLI, "frameworks", "list"], {
					...EXEC_OPTS,
					env: {
						PATH: process.env.PATH,
						HOME: process.env.HOME,
						NO_COLOR: "1",
						// Point the config dir somewhere empty so a developer's real
						// ~/.config/elnora-vanta/.env can't satisfy the auth check.
						VANTA_CONFIG_DIR: resolve(import.meta.dirname, "nonexistent-config"),
					},
				}) as string;
				return { stdout, stderr: "", exitCode: 0 };
			} catch (error: unknown) {
				const e = error as { stdout?: string; stderr?: string; status?: number };
				return {
					stdout: (e.stdout ?? "") as string,
					stderr: (e.stderr ?? "") as string,
					exitCode: e.status ?? 1,
				};
			}
		})();
		expect(exitCode).toBe(3); // EXIT_CODES.AUTH
		const parsed = JSON.parse(stderr.trim());
		expect(parsed.error).toBeDefined();
	});

	it("error output redacts long secrets", () => {
		const fakeSecret = "b".repeat(50);
		const { stderr } = (() => {
			try {
				execFileSync("node", [CLI, "frameworks", "list"], {
					...EXEC_OPTS,
					env: { PATH: process.env.PATH, VANTA_CLIENT_ID: "test", VANTA_CLIENT_SECRET: fakeSecret, NO_COLOR: "1" },
				});
				return { stderr: "" };
			} catch (error: unknown) {
				return { stderr: ((error as { stderr?: string }).stderr ?? "") as string };
			}
		})();
		expect(stderr).not.toContain(fakeSecret);
	});
});
