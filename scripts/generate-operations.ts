/**
 * Generate src/generated/operations.ts from the vendored OpenAPI specs.
 *
 * Emits one entry per callable REST operation so the CLI can expose the whole
 * Vanta API without 300+ hand-written command files. Regenerate after
 * `pnpm spec:fetch` to pick up Vanta API changes.
 *
 * Usage: pnpm generate
 */

import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SPEC_DIR = join(ROOT, "spec");
const OUT_FILE = join(ROOT, "src", "generated", "operations.ts");

// webhooks.json documents inbound event payloads, not callable endpoints.
const CALLABLE_SPECS = ["manage-vanta.json", "build-integrations.json", "audits.json"];
const HTTP_METHODS = ["get", "post", "put", "patch", "delete"] as const;

type HttpMethod = (typeof HTTP_METHODS)[number];

/**
 * Operations that change state but whose name does not start with a destructive
 * verb. Offboarding is here because Vanta cascades it: offboarding a person
 * automatically marks their unmonitored accounts deactivated.
 */
const DESTRUCTIVE_PATTERNS = [/deactivate/i, /archive/i, /revoke/i, /remove/i, /offboard/i];

interface SpecParameter {
	name: string;
	in: "path" | "query" | "header" | "cookie";
	required?: boolean;
	description?: string;
	schema?: { type?: string; enum?: string[]; items?: { type?: string } };
}

interface SpecOperation {
	operationId?: string;
	summary?: string;
	description?: string;
	tags?: string[];
	parameters?: SpecParameter[];
	requestBody?: {
		required?: boolean;
		content?: Record<string, { schema?: JsonSchema }>;
	};
	deprecated?: boolean;
}

interface JsonSchema {
	$ref?: string;
	type?: string;
	properties?: Record<string, JsonSchema>;
	required?: string[];
	items?: JsonSchema;
	allOf?: JsonSchema[];
	description?: string;
}

interface SpecDocument {
	servers?: { url: string }[];
	paths: Record<string, Record<string, SpecOperation | unknown>>;
	components?: { schemas?: Record<string, JsonSchema> };
}

function kebab(input: string): string {
	return input
		.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
		.replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
		.replace(/[_\s]+/g, "-")
		.replace(/-+/g, "-")
		.toLowerCase()
		.replace(/^-|-$/g, "");
}

/**
 * The path the CLI's client should request, relative to the /v1 prefix that
 * vantaFetch() adds. Specs disagree about where /v1 lives: manage-vanta and
 * audits carry it on the server URL, build-integrations bakes it into each path.
 */
function normalisePath(rawPath: string, servers: { url: string }[] | undefined): string {
	let basePath = "";
	const serverUrl = servers?.[0]?.url;
	if (serverUrl) {
		try {
			basePath = new URL(serverUrl).pathname.replace(/\/$/, "");
		} catch {
			basePath = "";
		}
	}
	const full = `${basePath}${rawPath}`;
	const stripped = full.replace(/^\/v1(?=\/|$)/, "");
	return stripped === "" ? "/" : stripped;
}

function classifyRisk(method: HttpMethod, operationId: string): "read" | "write" | "destructive" {
	if (method === "get") return "read";
	if (method === "delete") return "destructive";
	if (DESTRUCTIVE_PATTERNS.some((pattern) => pattern.test(operationId))) return "destructive";
	return "write";
}

/** Resolve a local $ref against the spec's component schemas (one level is enough here). */
function resolveSchema(schema: JsonSchema | undefined, doc: SpecDocument, depth = 0): JsonSchema | undefined {
	if (!schema || depth > 5) return schema;
	if (schema.$ref) {
		const name = schema.$ref.replace("#/components/schemas/", "");
		return resolveSchema(doc.components?.schemas?.[name], doc, depth + 1);
	}
	if (schema.allOf?.length) {
		const merged: JsonSchema = { type: "object", properties: {}, required: [] };
		for (const part of schema.allOf) {
			const resolved = resolveSchema(part, doc, depth + 1);
			Object.assign(merged.properties as object, resolved?.properties ?? {});
			if (resolved?.required) (merged.required as string[]).push(...resolved.required);
		}
		return merged;
	}
	return schema;
}

interface GeneratedOperation {
	id: string;
	group: string;
	command: string;
	method: HttpMethod;
	path: string;
	summary: string;
	risk: "read" | "write" | "destructive";
	pathParams: string[];
	queryParams: { name: string; description: string; type: string; enum?: string[] }[];
	body?: { required: boolean; properties: string[]; requiredProperties: string[] };
	deprecated?: boolean;
}

const operations: GeneratedOperation[] = [];
const seen = new Map<string, string>();

for (const specFile of CALLABLE_SPECS) {
	const doc: SpecDocument = JSON.parse(await readFile(join(SPEC_DIR, specFile), "utf-8"));

	for (const [rawPath, pathItem] of Object.entries(doc.paths)) {
		for (const method of HTTP_METHODS) {
			const op = pathItem[method] as SpecOperation | undefined;
			if (!op) continue;

			const operationId = op.operationId;
			if (!operationId) {
				process.stderr.write(`SKIP ${method.toUpperCase()} ${rawPath} — no operationId\n`);
				continue;
			}

			const tag = op.tags?.[0] ?? "misc";
			const group = kebab(tag);
			const command = kebab(operationId);
			const key = `${group} ${command}`;

			const apiPath = normalisePath(rawPath, doc.servers);

			// Some endpoints are documented in more than one spec. An identical
			// method+path pair is the same operation, so keep the first and move on;
			// anything else sharing a command name is a real conflict.
			const previous = seen.get(key);
			if (previous) {
				if (previous === `${method} ${apiPath}`) {
					process.stderr.write(`DEDUPE ${key} — ${operationId} already defined identically (${specFile})\n`);
					continue;
				}
				throw new Error(
					`Conflicting command "${key}": ${method.toUpperCase()} ${apiPath} (${specFile}) collides with ${previous}`,
				);
			}
			seen.set(key, `${method} ${apiPath}`);

			const params = op.parameters ?? [];
			const pathParams = params.filter((p) => p.in === "path").map((p) => p.name);
			const queryParams = params
				.filter((p) => p.in === "query")
				.map((p) => ({
					name: p.name,
					description: (p.description ?? "").replace(/\s+/g, " ").trim().slice(0, 120),
					type: p.schema?.type ?? "string",
					...(p.schema?.enum ? { enum: p.schema.enum } : {}),
				}));

			// Path params must appear in the template, or the request would be malformed.
			const templateParams = [...rawPath.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
			for (const templateParam of templateParams) {
				if (!pathParams.includes(templateParam)) pathParams.push(templateParam);
			}

			let body: GeneratedOperation["body"];
			const jsonContent = op.requestBody?.content?.["application/json"]?.schema;
			if (jsonContent) {
				const resolved = resolveSchema(jsonContent, doc);
				body = {
					required: op.requestBody?.required === true,
					properties: Object.keys(resolved?.properties ?? {}),
					requiredProperties: resolved?.required ?? [],
				};
			} else if (op.requestBody) {
				body = { required: op.requestBody.required === true, properties: [], requiredProperties: [] };
			}

			operations.push({
				id: operationId,
				group,
				command,
				method,
				path: apiPath,
				summary: (op.summary ?? op.description ?? operationId).replace(/\s+/g, " ").trim().slice(0, 160),
				risk: classifyRisk(method, operationId),
				pathParams,
				queryParams,
				...(body ? { body } : {}),
				...(op.deprecated ? { deprecated: true } : {}),
			});
		}
	}
}

operations.sort((a, b) => a.group.localeCompare(b.group) || a.command.localeCompare(b.command));

const counts = operations.reduce<Record<string, number>>((acc, op) => {
	acc[op.risk] = (acc[op.risk] ?? 0) + 1;
	return acc;
}, {});
const groupCount = new Set(operations.map((o) => o.group)).size;

const banner = `/**
 * GENERATED FILE — DO NOT EDIT.
 *
 * Produced by scripts/generate-operations.ts from the OpenAPI documents in spec/.
 * To refresh: pnpm spec:fetch && pnpm generate
 *
 * ${operations.length} operations across ${groupCount} groups
 * (${counts.read ?? 0} read, ${counts.write ?? 0} write, ${counts.destructive ?? 0} destructive).
 */

export type OperationRisk = "read" | "write" | "destructive";

export interface QueryParam {
	name: string;
	description: string;
	type: string;
	enum?: string[];
}

export interface OperationBody {
	required: boolean;
	properties: string[];
	requiredProperties: string[];
}

export interface Operation {
	/** Vanta's own operationId, e.g. "ListVendors". */
	id: string;
	/** CLI command group, from the OpenAPI tag, e.g. "vendors". */
	group: string;
	/** CLI subcommand, from the operationId, e.g. "list-vendors". */
	command: string;
	method: "get" | "post" | "put" | "patch" | "delete";
	/** Request path relative to the /v1 prefix the client adds. */
	path: string;
	summary: string;
	risk: OperationRisk;
	pathParams: string[];
	queryParams: QueryParam[];
	body?: OperationBody;
	deprecated?: boolean;
}

export const OPERATIONS: readonly Operation[] = `;

await writeFile(OUT_FILE, `${banner}${JSON.stringify(operations, null, "\t")} as const;\n`, "utf-8");

process.stdout.write(
	`Wrote ${OUT_FILE}\n  ${operations.length} operations, ${groupCount} groups ` +
		`(${counts.read ?? 0} read, ${counts.write ?? 0} write, ${counts.destructive ?? 0} destructive)\n`,
);
