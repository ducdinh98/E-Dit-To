#!/usr/bin/env node
/**
 * proof-sheet.mjs — Captures HyperFrames snapshots and stitches them into 1 single JPEG grid
 * to cut AI vision token consumption by ~70%.
 * Usage: node token-lite/scripts/proof-sheet.mjs "videos/<slug>" <t1> <t2> <t3> <t4>
 */
import { execFileSync, execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [, , projectRelDir, ...times] = process.argv;
if (!projectRelDir || times.length === 0) {
  console.error('Usage: node token-lite/scripts/proof-sheet.mjs "videos/<slug>" <t1> <t2> ...');
  process.exit(1);
}

const projectDir = path.resolve(process.cwd(), projectRelDir);
const slug = path.basename(projectDir);
const outDir = path.join("D:\\cache", `proof_${slug}`);
fs.mkdirSync(outDir, { recursive: true });

// Clean old PNGs
for (const f of fs.readdirSync(outDir)) {
  if (f.endsWith(".png") || f.endsWith(".jpg")) {
    fs.unlinkSync(path.join(outDir, f));
  }
}

const atFlag = `--at ${times.join(",")}`;
execSync(
  `npx --yes hyperframes@0.8.181 snapshot ${atFlag} --no-end --output "${outDir}"`,
  { cwd: projectDir, stdio: "inherit" }
);

const pngs = fs.readdirSync(outDir)
  .filter((f) => f.endsWith(".png"))
  .sort()
  .map((f) => path.join(outDir, f));

if (pngs.length === 0) {
  console.error("No snapshot PNGs generated.");
  process.exit(1);
}

const cols = pngs.length <= 4 ? 2 : 3;
const rows = Math.ceil(pngs.length / cols);
const gridJpg = path.join(outDir, "proof-grid.jpg");

const inputs = pngs.flatMap((p) => ["-i", p]);
const filterInputs = pngs.map((_, i) => `[${i}:v]scale=720:-1[v${i}]`).join(";");
const xstackInputs = pngs.map((_, i) => `[v${i}]`).join("");
const layoutParts = [];
for (let i = 0; i < pngs.length; i++) {
  const c = i % cols;
  const r = Math.floor(i / cols);
  const xExpr = c === 0 ? "0" : Array.from({ length: c }, (_, k) => `w${k}`).join("+");
  const yExpr = r === 0 ? "0" : Array.from({ length: r }, (_, k) => `h${k * cols}`).join("+");
  layoutParts.push(`${xExpr}_${yExpr}`);
}

const filterComplex = pngs.length === 1
  ? `[0:v]scale=1280:-1[out]`
  : `${filterInputs};${xstackInputs}xstack=inputs=${pngs.length}:layout=${layoutParts.join("|")}:fill=black[out]`;

execFileSync("ffmpeg", [
  "-y", "-v", "error",
  ...inputs,
  "-filter_complex", filterComplex,
  "-map", "[out]",
  "-q:v", "3",
  gridJpg
]);

console.log(JSON.stringify({
  status: "PROOF_READY",
  framesCaptured: pngs.length,
  singleProofGridJpg: gridJpg
}, null, 2));
