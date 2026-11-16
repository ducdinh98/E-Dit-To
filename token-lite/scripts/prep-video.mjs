#!/usr/bin/env node
/**
 * prep-video.mjs — 1-Command Video Inspection & Project Scaffolder (Token-Lite Edition)
 * Usage: node token-lite/scripts/prep-video.mjs "<input-video.mp4>" "<project-slug>"
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [, , inputVideo, slug] = process.argv;
if (!inputVideo || !slug) {
  console.error('Usage: node token-lite/scripts/prep-video.mjs "<input-video.mp4>" "<project-slug>"');
  process.exit(1);
}

const workspaceRoot = process.cwd();
const projectDir = path.join(workspaceRoot, "videos", slug);
const assetsDir = path.join(projectDir, "assets");
const compsDir = path.join(projectDir, "compositions");
const rendersDir = path.join(projectDir, "renders");
const cacheInspectDir = "D:\\cache\\video_inspect";

for (const dir of [projectDir, assetsDir, compsDir, rendersDir, cacheInspectDir]) {
  fs.mkdirSync(dir, { recursive: true });
}

// 1. Probe input video metadata
const probeRaw = execFileSync(
  "ffprobe",
  [
    "-v", "error",
    "-show_entries", "format=duration:stream=codec_type,width,height,r_frame_rate",
    "-of", "json",
    inputVideo
  ],
  { encoding: "utf8" }
);
const probe = JSON.parse(probeRaw);
const vStream = (probe.streams || []).find((s) => s.codec_type === "video") || {};
const duration = parseFloat(probe.format?.duration || "0");
const width = vStream.width || 1920;
const height = vStream.height || 1080;
const [num, den] = (vStream.r_frame_rate || "30/1").split("/").map(Number);
const fps = den ? Math.round(num / den) : 30;

// 2. Copy shared CSS, JS, and SFX into project assets
const sharedDir = path.join(workspaceRoot, "token-lite", "shared");
fs.copyFileSync(path.join(sharedDir, "creative-mode.css"), path.join(assetsDir, "creative-mode.css"));
fs.copyFileSync(path.join(sharedDir, "cm-helpers.js"), path.join(assetsDir, "cm-helpers.js"));

const sfxPrimaryDir = path.join(workspaceRoot, "assets", "sfx");
const sfxFallbackDir = path.join(workspaceRoot, "videos", "oppo-a7-pro", "assets", "sfx");
const sfxSrcDir = fs.existsSync(sfxPrimaryDir) ? sfxPrimaryDir : sfxFallbackDir;
const sfxDestDir = path.join(assetsDir, "sfx");
if (fs.existsSync(sfxSrcDir)) {
  fs.mkdirSync(sfxDestDir, { recursive: true });
  for (const f of fs.readdirSync(sfxSrcDir)) {
    fs.copyFileSync(path.join(sfxSrcDir, f), path.join(sfxDestDir, f));
  }
}

// 3. Create package.json & hyperframes.json if not present
const pkgPath = path.join(projectDir, "package.json");
if (!fs.existsSync(pkgPath)) {
  fs.writeFileSync(
    pkgPath,
    JSON.stringify({ name: slug, version: "1.0.0", private: true }, null, 2)
  );
}
const hfJsonPath = path.join(projectDir, "hyperframes.json");
if (!fs.existsSync(hfJsonPath)) {
  fs.writeFileSync(
    hfJsonPath,
    JSON.stringify({ name: slug, entry: "index.html", width, height, fps }, null, 2)
  );
}

// 4. Extract voiceover.mp3 cleanly
const voPath = path.join(assetsDir, "voiceover.mp3");
if (!fs.existsSync(voPath)) {
  execFileSync("ffmpeg", [
    "-y", "-v", "error",
    "-i", inputVideo,
    "-vn", "-acodec", "libmp3lame", "-q:a", "2",
    voPath
  ]);
}

// 5. Generate 1 single 4x4 Contact Sheet JPEG (1280px wide, low vision token cost)
const sheetPath = path.join(cacheInspectDir, `${slug}-sheet.jpg`);
const stepSec = Math.max(1, duration / 16).toFixed(2);
const vf = [
  `fps=1/${stepSec}`,
  `scale=320:-1`,
  `drawtext=fontfile='C\\:/Windows/Fonts/consola.ttf':text='%{pts\\:hms}':x=8:y=8:fontsize=16:fontcolor=white:box=1:boxcolor=black@0.75:boxborderw=4`,
  `tile=4x4`
].join(",");

execFileSync("ffmpeg", [
  "-y", "-v", "error",
  "-i", inputVideo,
  "-vf", vf,
  "-frames:v", "1",
  "-q:v", "4",
  sheetPath
]);

console.log(JSON.stringify({
  status: "READY",
  projectDir,
  inputVideo,
  durationSeconds: Number(duration.toFixed(2)),
  width,
  height,
  fps,
  voiceoverPath: voPath,
  contactSheetJpg: sheetPath,
  sharedAssetsCopied: ["assets/creative-mode.css", "assets/cm-helpers.js", "assets/sfx/"]
}, null, 2));
