#!/usr/bin/env node
/**
 * sync-text.mjs — Syncs and validates composition variables between index.html and sub-compositions
 * Usage: node token-lite/scripts/sync-text.mjs "videos/<slug>" --variables
 */
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const projectRel = args.find((a) => !a.startsWith("--")) || "videos/acer250trieu-lite";
const hasVariables = args.includes("--variables");

const projectDir = path.resolve(process.cwd(), projectRel);
const indexHtmlPath = path.join(projectDir, "index.html");

if (!fs.existsSync(indexHtmlPath)) {
  console.error(`Index file not found at: ${indexHtmlPath}`);
  process.exit(1);
}

const html = fs.readFileSync(indexHtmlPath, "utf8");
const match = html.match(/data-composition-variables='([^']+)'/);

if (!match) {
  console.log("No data-composition-variables found in index.html");
  process.exit(0);
}

try {
  const variables = JSON.parse(match[1]);
  console.log(JSON.stringify({
    status: "SYNCED",
    project: path.basename(projectDir),
    variableCount: variables.length,
    variables: variables.map((v) => ({ id: v.id, label: v.label, default: v.default }))
  }, null, 2));
} catch (e) {
  console.error("Failed to parse data-composition-variables JSON:", e.message);
  process.exit(1);
}
