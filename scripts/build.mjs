#!/usr/bin/env node
// Bundle the CLI and its runtime packages into one file, dist/main.js.
//
// The package then declares no runtime dependencies, so a Claude Code plugin
// install has nothing to install from the pnpm lockfile it can't read.
// The banner gives bundled CommonJS packages (commander) a `require` for Node
// built-ins, which an ESM bundle doesn't provide.

import { rmSync } from "node:fs";
import { build } from "esbuild";

rmSync("dist", { recursive: true, force: true });

await build({
	entryPoints: ["src/main.ts"],
	outfile: "dist/main.js",
	bundle: true,
	platform: "node",
	format: "esm",
	target: "node20",
	banner: { js: "import { createRequire as __cr } from 'node:module'; const require = __cr(import.meta.url);" },
	logLevel: "warning",
});
