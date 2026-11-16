// Shared helpers for the motion-studio scripts: where things are, and how to run npx on Mac, Windows and Linux.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import { spawnSync, spawn } from 'node:child_process';

export const SKILL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// The HyperFrames this skill is built and tested on (Nathan, 25 Oct: pinned to what V4 shows): its skills from that
// release's tag, its CLI always run as `npx hyperframes@<version>`. Newer HyperFrames works differently.
export const HF = JSON.parse(readFileSync(join(SKILL, 'package.json'), 'utf8')).hyperframesVersion;
export const hfCli = `hyperframes@${HF}`;
const WIN = process.platform === 'win32';

// The videos folder: the project this skill is installed in (<root>/.claude/skills/motion-studio or .agents/skills/motion-studio), else the current
// folder. A global install (~/.claude/skills or ~/.gemini/config/skills) means the current folder, never the home folder itself.
export function root() {
  for (const marker of [`${sep}.claude${sep}skills${sep}`, `${sep}.agents${sep}skills${sep}`, `${sep}.agent${sep}skills${sep}`]) {
    const i = SKILL.lastIndexOf(marker);
    const r = i > 0 ? SKILL.slice(0, i) : '';
    if (r && resolve(r) !== resolve(homedir())) return r;
  }
  return process.cwd();
}

// Where this skill is installed. Supports both Claude Code (~/.claude/skills) and Antigravity (~/.gemini/config/skills).
export const userClaudeDir = () => resolve(process.env.CLAUDE_CONFIG_DIR || join(homedir(), '.claude'));
export const userGeminiDir = () => resolve(join(homedir(), '.gemini', 'config'));
export function userInstall() {
  const skills = dirname(SKILL);
  if (basename(skills) !== 'skills') return false;
  const parent = resolve(dirname(skills));
  return parent === userClaudeDir() || parent === userGeminiDir();
}
export const claudeDir = () => {
  const skills = dirname(SKILL);
  if (basename(skills) === 'skills') {
    const parent = resolve(dirname(skills));
    if (parent === userGeminiDir()) return userGeminiDir();
    if (parent === userClaudeDir()) return userClaudeDir();
  }
  return join(root(), '.claude');
};
// the style library: with the skill in a user install (so it follows the user to every folder), else in the videos folder
export const styleLib = () => (userInstall() ? join(SKILL, 'styles') : join(root(), 'styles'));
// a private Node.js that install.sh put in the skill (when the computer had no Node.js 22 or newer)
export const privateNode = () => resolve(process.execPath).startsWith(join(SKILL, '.tools') + sep);

// HyperFrames' skills: where setup puts them first, then a global install.
export function hfSkill(name) {
  for (const base of [
    dirname(SKILL),
    join(claudeDir(), 'skills'),
    join(userGeminiDir(), 'skills'),
    join(root(), '.agents', 'skills'),
    join(root(), '.claude', 'skills'),
    join(homedir(), '.claude', 'skills'),
    join(homedir(), '.agents', 'skills'),
  ]) {
    const p = join(base, name);
    if (existsSync(join(p, 'SKILL.md'))) return p;
  }
  return null;
}

// FFmpeg and FFprobe from npm (installed with this skill), so nobody has to install them system-wide.
export function mediaTools() {
  const req = createRequire(join(SKILL, 'package.json'));
  let ffmpeg = null, ffprobe = null;
  try { ffmpeg = req('ffmpeg-static'); } catch {}
  try { ffprobe = req('@ffprobe-installer/ffprobe').path; } catch {}
  return { ffmpeg: ffmpeg && existsSync(ffmpeg) ? ffmpeg : null, ffprobe: ffprobe && existsSync(ffprobe) ? ffprobe : null };
}

// The environment HyperFrames runs with: our FFmpeg and FFprobe, and no global skill installs.
export function hfEnv() {
  const { ffmpeg, ffprobe } = mediaTools();
  return { ...process.env, ...(ffmpeg ? { HYPERFRAMES_FFMPEG_PATH: ffmpeg } : {}), ...(ffprobe ? { HYPERFRAMES_FFPROBE_PATH: ffprobe } : {}), HYPERFRAMES_SKIP_SKILLS: '1', HYPERFRAMES_NO_UPDATE_CHECK: '1' };
}

// Run a command; on Windows npm and npx are .cmd files and need a shell, whereas direct .exe paths (with spaces like "Cong Duc") should run with shell: false.
const quoteShellArgs = (args, useShell) => useShell ? args.map((a) => /\s/.test(String(a)) && !/^".*"$/.test(String(a)) ? `"${String(a).replace(/"/g, '\\"')}"` : a) : args;
export function run(cmd, args, { cwd = root(), env = process.env, capture = false } = {}) {
  const useShell = WIN && !/[\\/]/.test(cmd);
  const r = spawnSync(cmd, quoteShellArgs(args, useShell), { cwd, env, shell: useShell, encoding: 'utf8', stdio: capture ? 'pipe' : 'inherit' });
  return { status: r.status ?? 1, out: (r.stdout || '') + (r.stderr || '') };
}
export function runAsync(cmd, args, { cwd = root(), env = process.env } = {}) {
  const useShell = WIN && !/[\\/]/.test(cmd);
  return new Promise((res) => {
    const p = spawn(cmd, quoteShellArgs(args, useShell), { cwd, env, shell: useShell, stdio: 'inherit' });
    p.on('close', (code) => res(code ?? 1));
  });
}

export function openInBrowser(file) {
  const [cmd, args] = process.platform === 'darwin' ? ['open', [file]] : WIN ? ['cmd', ['/c', 'start', '', file]] : ['xdg-open', [file]];
  spawnSync(cmd, args, { stdio: 'ignore', shell: false });
}

// A frame.md: YAML frontmatter (the tokens) and a markdown body. A small reader for what the gallery shows: name,
// description, colours and font families. Not a general YAML parser.
export function readFrame(file) {
  const text = readFileSync(file, 'utf8');
  const m = text.match(/^---\s*\n([\s\S]*?)\n---/);
  const fm = m ? m[1] : '';
  const line = (k) => (fm.match(new RegExp(`^${k}:\\s*(.+)$`, 'm')) || [])[1]?.trim().replace(/^["']|["']$/g, '') || '';
  let description = line('description');
  if (description === '>' || description === '|' || description === '>-') {
    const block = fm.split('\n');
    const i = block.findIndex((l) => /^description:/.test(l));
    const out = [];
    for (let j = i + 1; j < block.length && /^\s+/.test(block[j]); j++) out.push(block[j].trim());
    description = out.join(' ');
  }
  const colors = [];
  const cs = fm.match(/^colors:\s*\n((?:[ \t]+.+\n?)+)/m);
  if (cs) for (const l of cs[1].split('\n')) { const c = l.match(/^\s+([\w-]+):\s*["']?(#[0-9a-fA-F]{3,8})/); if (c) colors.push([c[1], c[2]]); }
  const fonts = [...new Set([...fm.matchAll(/fontFamily:\s*["']([^"']+)["']/g)].map((x) => x[1]))];
  return { name: line('name').replace(/\s+—.*$/, ''), description, colors, fonts };
}

// HTML entities, enough for attribute values and text that HyperFrames or Studio wrote (Studio saves the variables
// as data-composition-variables="[{&quot;id&quot;...]", HyperFrames' build as data-composition-variables='[{"id"...]').
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0' };
export const decodeHtml = (s) => String(s).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) =>
  e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : ENTITIES[e.toLowerCase()] ?? m);

// A composition's variable declarations (the first data-composition-variables, the one on <html>), and where they sit
// in the file so writeVariables can put them back in the same quoting.
export function readVariables(html) {
  const m = /data-composition-variables\s*=\s*(?:"([^"]*)"|'([^']*)')/.exec(html);
  if (!m) return { decls: [], at: null };
  let decls = [];
  try { decls = JSON.parse(decodeHtml(m[1] ?? m[2])); } catch {}
  return { decls: Array.isArray(decls) ? decls : [], at: { start: m.index, end: m.index + m[0].length, quote: m[1] !== undefined ? '"' : "'" } };
}
export function writeVariables(html, decls, at) {
  const q = at.quote, json = JSON.stringify(decls).replace(/&/g, '&amp;').replace(q === '"' ? /"/g : /'/g, q === '"' ? '&quot;' : '&#39;');
  return html.slice(0, at.start) + `data-composition-variables=${q}${json}${q}` + html.slice(at.end);
}

export function listDirs(p) {
  try { return readdirSync(p).filter((d) => !d.startsWith('.') && statSync(join(p, d)).isDirectory()).sort(); } catch { return []; }
}
export const slug = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50) || 'style';
