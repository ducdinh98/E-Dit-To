#!/usr/bin/env node
// One-time setup, run by install.sh (which brings a private Node.js when the computer has none):
//   bash <skill>/scripts/install.sh [--update]      or, with Node.js 22+ already there: node <skill>/scripts/setup.mjs [--update]
// Two kinds of install (lib.mjs `userInstall`):
//   user:    the skill sits next to the user's other skills (~/.claude/skills/motion-studio, from the zip). HyperFrames'
//            skills go next to it, the settings go into Claude Code's user settings, the style library lives in the
//            skill, and videos go into whatever folder Claude Code is open in.
//   project: the skill sits in a videos folder's .claude/skills (or is a dev copy run from a videos folder). Everything
//            goes into that folder's .claude, and styles/ and videos/ are made there.
// Steps:
//   1. checks Node (HyperFrames needs 22 or newer)
//   2. installs this skill's FFmpeg and FFprobe from npm, into the skill (no system install)
//   3. installs HyperFrames' skills next to this one, from the release this skill pins (package.json
//      "hyperframesVersion"), with every `npx hyperframes` in them rewritten to that version (--update fetches them again)
//   4. settings: our FFmpeg and FFprobe for HyperFrames, no skill installs or update nags from HyperFrames, and a
//      SessionStart hook (scripts/session-env.sh) that keeps `npx hyperframes` on the pinned version and puts a private
//      Node.js first on PATH (Claude Code's commands take PATH from the user's shell, so an `env` PATH is dropped)
//   5. project install only: makes styles/ (the style library) and videos/ (one folder per video)
//   6. runs HyperFrames' doctor and says what's ready
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { SKILL, root, hfSkill, mediaTools, hfEnv, run, userInstall, claudeDir, styleLib, privateNode, listDirs, HF, hfCli } from './lib.mjs';

const update = process.argv.includes('--update');
const USER = userInstall();
const ROOT = root();
const CLAUDE = claudeDir();
const say = (...a) => console.log(...a);
let problems = 0;
const ok = (what, detail = '') => say(`ok   ${what}${detail ? ': ' + detail : ''}`);
const no = (what, fix) => { problems++; say(`LỖI  ${what}: ${fix}`); };

if (!USER && resolve(ROOT) === resolve(homedir())) {
  console.error('Lệnh này sẽ cài vào cả thư mục home của bạn. Hãy tạo một thư mục riêng cho video (ví dụ Videos), mở Claude Code trong thư mục đó, rồi chạy setup từ đó.');
  process.exit(1);
}
say(USER ? `Đang cài đặt Motion Studio cùng chỗ với các skill khác của bạn (${join(CLAUDE, 'skills')})\n` : `Đang cài đặt vào ${ROOT}\n`);

// 1. Node
const major = Number(process.versions.node.split('.')[0]);
if (major >= 22) ok('Node.js', `${process.versions.node}${privateNode() ? ' (bản riêng của skill, trong .tools/node)' : ''}`);
else { no('Node.js', `bản ${process.versions.node} đã cũ, HyperFrames cần bản 22 trở lên. Hãy chạy "bash ${join(SKILL, 'scripts', 'install.sh')}": nó sẽ tải 1 bản Node.js 22 riêng cho skill.`); process.exit(1); }

// 2. FFmpeg and FFprobe
let tools = mediaTools();
if (!tools.ffmpeg || !tools.ffprobe) {
  say('đang cài FFmpeg và FFprobe (qua npm, khoảng 80 MB, chỉ một lần)...');
  run('npm', ['install', '--no-audit', '--no-fund'], { cwd: SKILL });
  tools = mediaTools();
}
tools.ffmpeg ? ok('FFmpeg', 'đi kèm skill') : no('FFmpeg', `npm không tải về được; hãy chạy "npm install" trong ${SKILL} và kiểm tra mạng hoặc proxy`);
tools.ffprobe ? ok('FFprobe', 'đi kèm skill') : no('FFprobe', `npm không tải về được; hãy chạy "npm install" trong ${SKILL}`);

// 3. HyperFrames' skills, next to this one: fetched into a scratch folder (the skills tool only writes to the folder
// it runs in), then copied over, so it never touches other agents' folders
const target = join(CLAUDE, 'skills');
if (update || !existsSync(join(target, 'hyperframes', 'SKILL.md'))) {
  say(`đang ${update ? 'cập nhật' : 'cài'} các skill của HyperFrames vào ${target}...`);
  const tmp = join(SKILL, '.tools', 'hf-skills');
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  const r = run('npx', ['-y', 'skills@1.7.2', 'add', `https://github.com/heygen-com/hyperframes/tree/v${HF}`, '--skill', '*', '--agent', 'claude-code', '--yes', '--copy'], { cwd: tmp, capture: true });
  const got = listDirs(join(tmp, '.claude', 'skills')).filter((d) => d !== 'motion-studio');
  for (const d of got) pinCli(join(tmp, '.claude', 'skills', d));
  if (r.status !== 0 || !got.length) no('Skill của HyperFrames', `cài không thành công: ${r.out.trim().split('\n').slice(-2).join(' ')}`);
  else {
    mkdirSync(target, { recursive: true });
    for (const d of got) {
      rmSync(join(target, d), { recursive: true, force: true });
      cpSync(join(tmp, '.claude', 'skills', d), join(target, d), { recursive: true });
    }
  }
  rmSync(tmp, { recursive: true, force: true });
}
hfSkill('hyperframes') ? ok('Skill của HyperFrames', target) : no('Skill của HyperFrames', 'cài xong nhưng không tìm thấy');

// every `npx hyperframes` (and `hyperframes@latest`) in HyperFrames' skills names the pinned version instead
function pinCli(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { pinCli(p); continue; }
    if (!/\.(md|txt|sh|json|ya?ml)$/i.test(name)) continue;
    const text = readFileSync(p, 'utf8');
    const next = text
      .replace(/hyperframes@latest\b/g, hfCli)
      .replace(/\bnpx (-y |--yes )?hyperframes(?=[\s`'")\],;]|$)/gm, (_, y) => `npx ${y || ''}${hfCli}`);
    if (next !== text) writeFileSync(p, next);
  }
}

// 4. settings: FFmpeg paths, no global skill installs, and the session hook
const settingsFile = join(CLAUDE, 'settings.json');
let settings = {};
let readable = true;
if (existsSync(settingsFile)) {
  try { settings = JSON.parse(readFileSync(settingsFile, 'utf8')); } catch { readable = false; }
}
if (!readable) no('Cài đặt', `${settingsFile} không đọc được (không phải JSON hợp lệ), nên mình không sửa nó. Hãy sửa file đó rồi chạy lại setup.`);
else {
  // a user install edits Claude Code's own user settings: keep a copy of them as they were, once
  const backup = `${settingsFile}.before-motion-studio`;
  if (USER && existsSync(settingsFile) && !existsSync(backup)) copyFileSync(settingsFile, backup);
  settings.env = { ...(settings.env || {}), HYPERFRAMES_SKIP_SKILLS: '1', HYPERFRAMES_NO_UPDATE_CHECK: '1' };
  if (tools.ffmpeg) settings.env.HYPERFRAMES_FFMPEG_PATH = tools.ffmpeg;
  if (tools.ffprobe) settings.env.HYPERFRAMES_FFPROBE_PATH = tools.ffprobe;
  // the session hook (Git Bash on Windows wants /c/... paths); replaces any earlier Motion Studio hook
  let hook = join(SKILL, 'scripts', 'session-env.sh');
  if (process.platform === 'win32') hook = hook.replace(/^([A-Za-z]):/, (_, d) => `/${d.toLowerCase()}`).replace(/\\/g, '/');
  const ours = (g) => (g.hooks || []).some((h) => /session-env\.sh|# motion-studio:/.test(String(h.command || '')));
  settings.hooks = settings.hooks || {};
  settings.hooks.SessionStart = [...(settings.hooks.SessionStart || []).filter((g) => !ours(g)), { hooks: [{ type: 'command', command: `bash "${hook}"` }] }];
  mkdirSync(CLAUDE, { recursive: true });
  writeFileSync(settingsFile, JSON.stringify(settings, null, 2) + '\n');
  ok('Cài đặt', `${settingsFile} (đường dẫn FFmpeg, HyperFrames ${HF}${privateNode() ? ', Node.js của skill cho mọi lệnh' : ''})`);
}

// 5. folders
const lib = styleLib();
mkdirSync(lib, { recursive: true });
const readme = join(lib, 'README.md');
if (!existsSync(readme)) writeFileSync(readme, '# Phong cách của bạn\n\nMỗi phong cách bạn tạo từ ảnh, website, hay video tham khảo là một thư mục ở đây, gồm file `FRAME.md` (phong cách,\ntheo định dạng của HyperFrames) và các ảnh tham khảo. Trang `gallery.html` hiện chúng cạnh các phong cách có sẵn.\n');
if (!USER) mkdirSync(join(ROOT, 'videos'), { recursive: true });
ok('Thư mục', USER ? `phong cách của bạn: ${lib}; mỗi video là 1 thư mục trong videos/ ở thư mục bạn đang làm việc` : 'styles/ (phong cách của bạn), videos/ (mỗi video một thư mục)');

// 6. HyperFrames' doctor, with our environment
say('\nđang kiểm tra HyperFrames (lần đầu sẽ tải về một bản Chrome chạy ngầm, hơi lâu)...');
const d = run('npx', ['-y', hfCli, 'doctor'], { env: hfEnv(), capture: true, cwd: USER ? SKILL : ROOT });
const lines = d.out.split('\n').map((l) => l.replace(/\x1b\[[0-9;]*m/g, ''));
for (const want of ['Version', 'Node.js', 'FFmpeg', 'FFprobe', 'Chrome']) {
  const l = lines.find((x) => new RegExp(`^\\s*[✓✗]\\s+${want.replace('.', '\\.')}\\b`).test(x));
  if (!l) { no(`HyperFrames ${want}`, 'không thấy trong kết quả của "npx hyperframes doctor"'); continue; }
  const good = l.trim().startsWith('✓');
  const detail = l.replace(/^\s*[✓✗]\s+\S+(\.\S+)?\s*/, '').trim();
  good ? ok(`HyperFrames ${want}`, detail.slice(0, 70)) : no(`HyperFrames ${want}`, detail);
}

say(`\nLưu ý: HyperFrames có gửi dữ liệu sử dụng ẩn danh. Muốn tắt thì chạy: npx ${hfCli} telemetry disable`);
say(problems ? `\nCòn ${problems} chỗ cần sửa ở trên, sửa xong hãy chạy lại setup.` : `\nXong. Hãy mở một phiên Claude Code mới${USER ? '' : ' trong thư mục này'} để nạp các skill và cài đặt mới, rồi nhờ Claude làm video.`);
process.exitCode = problems ? 1 : 0;
