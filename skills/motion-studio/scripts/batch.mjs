#!/usr/bin/env node
// One video per row of a spreadsheet, through HyperFrames' batch render.
//   node <skill>/scripts/batch.mjs videos/<name> prices.csv [--quality draft|looks|delivery] [--dry]
// The CSV's columns are the video's variables (the words, numbers, colours and pictures it declares in
// data-composition-variables on index.html), by id or by the label Studio shows; a "name" column names each file. Excel's "CSV UTF-8" works, and so do
// semicolons. The rows go to renders/batch/rows.json, then: hyperframes render --batch rows.json
// -o renders/batch/{index}-{name}.mp4. An empty cell keeps that variable's default. sync-text.mjs runs first, and
// a word it can't settle (exit 2) stops the batch until the user says which wording to keep.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseCSV } from './csv.mjs';
import { hfEnv, run, slug, hfCli, readVariables } from './lib.mjs';
import { syncText } from './sync-text.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d; };
const [projArg, csvArg] = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--quality');
const proj = resolve(projArg || '');
const csvFile = resolve(csvArg || '');
if (!existsSync(join(proj, 'index.html')) || !existsSync(csvFile)) {
  console.error('cách dùng: batch.mjs <thư mục video> <data.csv> [--quality draft|looks|delivery] [--dry]');
  process.exit(1);
}

// words retyped on Studio's canvas go into their variables first, or every row would bring back the old ones
if (syncText(proj, { dry: args.includes('--dry') }).open.length) process.exit(2);

// the variables the video declares
const { decls } = readVariables(readFileSync(join(proj, 'index.html'), 'utf8'));
if (!decls.length) {
  console.error('Video này chưa có variables nào. Hãy nhờ Claude biến những chữ bạn muốn đổi ở mỗi phiên bản thành variables (HyperFrames gọi là composition variables), rồi chạy lại.');
  process.exit(1);
}
const types = Object.fromEntries(decls.map((d) => [d.id, d.type]));
// a column may be named by the variable's id, its label as Studio shows it ("Giá (Price)"), or either part of a
// "local (English)" label, in any case
const norm = (x) => String(x).normalize('NFC').toLowerCase().replace(/\s+/g, ' ').trim();
const byName = {};
for (const d of decls) {
  byName[norm(d.id)] = d.id;
  if (d.label) {
    byName[norm(d.label)] = d.id;
    const m2 = String(d.label).match(/^(.*?)\s*\((.*)\)\s*$/);
    if (m2) { byName[norm(m2[1])] = byName[norm(m2[1])] || d.id; byName[norm(m2[2])] = byName[norm(m2[2])] || d.id; }
  }
}

const rows = parseCSV(readFileSync(csvFile, 'utf8'));
if (!rows.length) { console.error('file CSV không có dòng nào bên dưới dòng tiêu đề'); process.exit(1); }
const unknown = new Set();
const out = rows.map((row, i) => {
  const r = {};
  for (const [k, v] of Object.entries(row)) {
    const key = k.trim();
    if (/^(name|file|filename)$/i.test(key)) { r.name = slug(v || `row-${i + 1}`); continue; }
    const id = byName[norm(key)];
    if (!id) { if (key) unknown.add(key); continue; }
    if (v === '') continue;   // an empty cell keeps the default
    const t = types[id];
    r[id] = t === 'number' ? Number(String(v).replace(',', '.')) : t === 'boolean' ? /^(true|yes|1|x)$/i.test(v) : String(v).normalize('NFC');
  }
  if (!r.name) r.name = slug(Object.values(r).find((x) => typeof x === 'string') || `row-${i + 1}`);
  return r;
});

const dir = join(proj, 'renders', 'batch');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'rows.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`${out.length} phiên bản từ ${csvArg}; variables: ${decls.map((d) => d.id).join(', ')}`);
if (unknown.size) console.log(`các cột không khớp với variable nào (bỏ qua): ${[...unknown].join(', ')}`);
if (args.includes('--dry')) { console.log(`đã ghi ${join(dir, 'rows.json')} (chạy thử, chưa render video nào)`); process.exit(0); }

// the HyperFrames version this project was made with (its package.json pins it), so a batch matches the original
let cli = hfCli;   // the pinned CLI, unless the project pins its own
try { cli = (JSON.parse(readFileSync(join(proj, 'package.json'), 'utf8')).scripts?.render || '').match(/hyperframes@[\w.-]+/)?.[0] || cli; } catch {}
const r = run('npx', ['-y', cli, 'render', '.', '--batch', 'renders/batch/rows.json', '-o', 'renders/batch/{index}-{name}.mp4', '--quality', opt('quality', 'looks')], { cwd: proj, env: hfEnv() });
process.exitCode = r.status;
