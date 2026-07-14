#!/usr/bin/env node

/**
 * elnora-vanta — read-only Vanta compliance CLI, agent-friendly JSON output.
 */

function redactSecrets(text: string): string {
	return text.replace(/[a-zA-Z0-9_-]{40,}/g, "[REDACTED]");
}

// Ensure structured JSON output even for unexpected errors
process.on("unhandledRejection", (reason) => {
	const msg = reason instanceof Error ? reason.message : String(reason);
	console.error(
		JSON.stringify(
			{
				error: redactSecrets(msg),
				type: "unhandledRejection",
			},
			null,
			2,
		),
	);
	process.exit(10); // EXIT_CODES.UNEXPECTED — import not available at top-level guard
});

process.on("uncaughtException", (error) => {
	console.error(
		JSON.stringify(
			{
				error: redactSecrets(error.message),
				type: "uncaughtException",
			},
			null,
			2,
		),
	);
	process.exit(10); // EXIT_CODES.UNEXPECTED
});

import { createRequire } from "node:module";
import { Command } from "commander";
import { setupCompletionCommand } from "./commands/completion.js";
import { setupComputersCommand } from "./commands/computers.js";
import { setupControlsCommand } from "./commands/controls.js";
import { setupDocumentsCommand } from "./commands/documents.js";
import { setupFrameworksCommand } from "./commands/frameworks.js";
import { setupGroupsCommand } from "./commands/groups.js";
import { setupIntegrationsCommand } from "./commands/integrations.js";
import { setupPeopleCommand } from "./commands/people.js";
import { setupPoliciesCommand } from "./commands/policies.js";
import { setupRisksCommand } from "./commands/risks.js";
import { setupTestsCommand } from "./commands/tests.js";
import { setupVendorsCommand } from "./commands/vendors.js";
import { setupVulnAssetsCommand } from "./commands/vuln-assets.js";
import { setupVulnRemediationsCommand } from "./commands/vuln-remediations.js";
import { setupVulnerabilitiesCommand } from "./commands/vulnerabilities.js";
import { outputError, setCompactMode, setFields, setOutputFormat, setPageSize } from "./output.js";

const program = new Command();

program
	.name("elnora-vanta")
	.description(
		"Read-only Vanta compliance CLI — frameworks, tests, controls, documents, vulnerabilities, and more as agent-friendly JSON",
	)
	.version(createRequire(import.meta.url)("../package.json").version);

// Register all command groups (read-only)
setupFrameworksCommand(program);
setupTestsCommand(program);
setupControlsCommand(program);
setupDocumentsCommand(program);
setupVulnerabilitiesCommand(program);
setupRisksCommand(program);
setupPeopleCommand(program);
setupIntegrationsCommand(program);
setupPoliciesCommand(program);
setupVendorsCommand(program);
setupGroupsCommand(program);
setupComputersCommand(program);
setupVulnAssetsCommand(program);
setupVulnRemediationsCommand(program);
setupCompletionCommand(program);

program.option("--compact", "Compact JSON output (saves tokens)");
program.option("--output <format>", "Output format: json (default), table, csv");
program.option("--page-size <n>", "API page size (1-100, default 100)");
program.option("--fields <list>", "Comma-separated fields to include (e.g. id,name,severity)");
program.option("--no-color", "Disable colored output (also respects NO_COLOR env)");
program.hook("preAction", (thisCommand) => {
	try {
		const opts = thisCommand.optsWithGlobals();
		if (opts.compact) setCompactMode(true);
		if (opts.output) setOutputFormat(opts.output);
		if (opts.pageSize) setPageSize(opts.pageSize);
		if (opts.fields) setFields(opts.fields);
	} catch (error) {
		outputError(error);
		process.exit(error instanceof Error && "exitCode" in error ? (error as { exitCode: number }).exitCode : 1);
	}
});

program.parse();
