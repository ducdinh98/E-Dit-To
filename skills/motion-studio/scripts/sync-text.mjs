#!/usr/bin/env node
// Keeps the words on Studio's canvas and the video's variables the same, so an edit made either way reaches the render.
//   node <skill>/scripts/sync-text.mjs videos/<name> [--canvas[=id,id]] [--variables[=id,id]] [--dry]
// Why: a word that is a variable sits in two places, the scene's HTML (<div data-var-text="price">99k</div>) and its
// default in data-composition-variables on index.html. HyperFrames 0.8.181's Studio saves a text retyped on the canvas
// (or in Design) into the scene file only and ignores the binding; the render, and Studio's own preview once it
// reloads, fill every bound element from the variable, so the canvas edit is lost. Its Variables panel ("Set default")
// writes the default only, which the render does take. (Studio also marks these variables "unused": it only looks
// for them in index.html, not in the scene files.)
// So, before Claude renders anything: a bound text that differs from its variable is carried over to the side that
// didn't change since the last sync (canvas edit: into the variable; Variables edit: into the scene, so the canvas
// shows it too). What each variable was at that sync is kept in the project's .motion-studio/text-sync.json. When both
// sides changed, or there is no earlier sync, the script can't tell which is newer: it lists them and exits with 2,
// and nothing is written for those. Ask the user, then rerun with --canvas=<ids> (keep the canvas text) or
// --variables=<ids> (keep the variable); either flag alone settles every open one. Files it changes are copied to
// .motion-studio/before-sync/ first.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodeHtml, readVariables, writeVariables } from './lib.mjs';

const norm = (s) => decodeHtml(s).replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim().normalize('NFC');
const encode = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const q = (s) => `"${s}"`;

// Every element with data-var-text in an HTML file: its variable id, and where its own text is when it has no child
// elements (the runtime replaces that whole text; with children it only swaps a text node, so those are left alone).
function boundTexts(src) {
  const out = [], lower = src.toLowerCase();
  let i = 0;
  while ((i = src.indexOf('<', i)) !== -1) {
    if (src.startsWith('<!--', i)) { const j = src.indexOf('-->', i + 4); i = j < 0 ? src.length : j + 3; continue; }
    const m = /^<([a-zA-Z][\w:-]*)/.exec(src.slice(i, i + 80));
    if (!m) { i++; continue; }
    const tag = m[1].toLowerCase();
    let j = i + m[0].length, quote = null;
    for (; j < src.length; j++) { const c = src[j]; if (quote) { if (c === quote) quote = null; } else if (c === '"' || c === "'") quote = c; else if (c === '>') break; }
    const openEnd = j + 1, attrs = src.slice(i + m[0].length, j);
    if (tag === 'script' || tag === 'style') { const k = lower.indexOf(`</${tag}`, openEnd); i = k < 0 ? src.length : k; continue; }
    const v = /(?:^|\s)data-var-text\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/.exec(attrs);
    if (v) {
      const id = decodeHtml(v[1] ?? v[2] ?? v[3]).trim();
      const k = src.indexOf('<', openEnd);
      const simple = k >= 0 && lower.startsWith(`</${tag}`, k);
      out.push({ id, start: openEnd, end: simple ? k : openEnd, simple, text: simple ? norm(src.slice(openEnd, k)) : null });
    }
    i = openEnd;
  }
  return out;
}

// index.html and every scene it loads (data-composition-src, nested ones too)
function compositionFiles(proj) {
  const files = [], seen = new Set();
  const visit = (file) => {
    if (seen.has(file) || !existsSync(file)) return;
    seen.add(file);
    files.push(file);
    const src = readFileSync(file, 'utf8');
    for (const m of src.matchAll(/data-composition-src\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
      const rel = decodeHtml(m[1] ?? m[2]).split(/[?#]/)[0];
      const a = resolve(proj, rel), b = resolve(dirname(file), rel);
      visit(existsSync(a) ? a : b);
    }
  };
  visit(join(proj, 'index.html'));
  return files;
}

export function syncText(projArg, { canvas = null, variables = null, dry = false, log = console.log } = {}) {
  const proj = resolve(projArg);
  const indexFile = join(proj, 'index.html');
  const indexSrc = readFileSync(indexFile, 'utf8');
  const { decls, at } = readVariables(indexSrc);
  const stateFile = join(proj, '.motion-studio', 'text-sync.json');
  let base = null;
  try { base = JSON.parse(readFileSync(stateFile, 'utf8')).values || null; } catch {}
  if (!decls.length) return { changed: [], open: [], notes: [] };

  const byId = Object.fromEntries(decls.map((d) => [d.id, d]));
  const notes = [];
  if (/data-variable-values\s*=/.test(indexSrc)) notes.push('index.html có data-variable-values trên một cảnh: giá trị ở đó được ưu tiên hơn Variables, hãy kiểm tra cảnh đó bằng tay.');
  const sources = new Map();   // file -> its text, edited in place
  const bound = {};            // id -> [{file, el}]
  for (const file of compositionFiles(proj)) {
    const src = readFileSync(file, 'utf8');
    sources.set(file, src);
    if (file !== indexFile && readVariables(src).decls.length) { notes.push(`${relative(proj, file)} có variables riêng, nên đã bỏ qua.`); continue; }
    for (const el of boundTexts(src)) {
      if (!byId[el.id]) continue;
      if (!el.simple) { notes.push(`${relative(proj, file)}: chữ gắn với "${el.id}" có phần tử con, hãy so với Variables bằng tay.`); continue; }
      (bound[el.id] ||= []).push({ file, el });
    }
  }

  const pick = (list, id) => list === true || (Array.isArray(list) && list.includes(id));
  const label = (d) => (d.label ? `${d.label} (${d.id})` : d.id);
  const setText = [];                 // [{file, el, value}]
  const setDefault = {};              // id -> value
  const changed = [], open = [];
  for (const [id, els] of Object.entries(bound)) {
    const d = byId[id];
    if (d.type && !['string', 'number'].includes(d.type)) continue;
    const def = norm(d.default ?? '');
    const texts = [...new Set(els.map((x) => x.el.text))];
    if (texts.length === 1 && texts[0] === def) continue;
    const was = base && id in base ? norm(base[id]) : null;
    const canvasNew = texts.filter((t) => t !== (was ?? def));
    const canvasOne = canvasNew.length === 1 ? canvasNew[0] : null;
    let take = null;   // 'canvas' | 'variables'
    if (was !== null && def === was && canvasOne !== null) take = 'canvas';
    else if (was !== null && def !== was && (canvasNew.length === 0 || (canvasOne === def))) take = 'variables';
    else if (pick(canvas, id) && canvasOne !== null) take = 'canvas';
    else if (pick(variables, id)) take = 'variables';
    if (take === 'canvas' && d.type === 'number' && !Number.isFinite(Number(canvasOne.replace(',', '.')))) take = null;
    if (!take) { open.push({ id, label: label(d), canvas: canvasNew.length ? canvasNew : texts, variable: def }); continue; }
    const value = take === 'canvas' ? canvasOne : def;
    if (take === 'canvas') setDefault[id] = d.type === 'number' ? Number(canvasOne.replace(',', '.')) : value;
    for (const x of els) if (x.el.text !== value) setText.push({ ...x, value });
    changed.push(take === 'canvas'
      ? `${label(d)}: sửa trên khung hình thành ${q(value)}, đã ghi vào Variables (trước là ${q(def)})`
      : `${label(d)}: sửa trong Variables thành ${q(value)}, đã ghi vào khung hình (trước là ${texts.filter((t) => t !== value).map(q).join(', ')})`);
  }

  if (!dry) {
    const touched = new Set(setText.map((x) => x.file));
    if (Object.keys(setDefault).length) touched.add(indexFile);
    for (const file of touched) {
      const backup = join(proj, '.motion-studio', 'before-sync', relative(proj, file));
      mkdirSync(dirname(backup), { recursive: true });
      copyFileSync(file, backup);
    }
    // scene texts, from the end of each file so earlier offsets stay right
    for (const [file] of sources) {
      const edits = setText.filter((x) => x.file === file).sort((a, b) => b.el.start - a.el.start);
      if (!edits.length) continue;
      let src = sources.get(file);
      for (const { el, value } of edits) {
        const raw = src.slice(el.start, el.end);
        const [, lead, , trail] = /^(\s*)([\s\S]*?)(\s*)$/.exec(raw);
        src = src.slice(0, el.start) + lead + encode(value) + trail + src.slice(el.end);
      }
      sources.set(file, src);
    }
    if (Object.keys(setDefault).length) {
      const next = decls.map((d) => (d.id in setDefault ? { ...d, default: setDefault[d.id] } : d));
      const src = sources.get(indexFile);
      sources.set(indexFile, writeVariables(src, next, readVariables(src).at));
      for (const d of decls) if (d.id in setDefault) d.default = setDefault[d.id];
    }
    for (const file of touched) writeFileSync(file, sources.get(file));
    // what every variable is now; an open one keeps its earlier value, so the next run still sees both sides
    const values = Object.fromEntries(decls.map((d) => [d.id, d.default]));
    for (const o of open) if (base && o.id in base) values[o.id] = base[o.id]; else delete values[o.id];
    mkdirSync(dirname(stateFile), { recursive: true });
    writeFileSync(stateFile, JSON.stringify({ note: 'Written by motion-studio/scripts/sync-text.mjs: each variable as of the last sync. Not for editing.', values }, null, 2) + '\n');
  }

  const n = Object.values(bound).reduce((a, x) => a + x.length, 0);
  if (changed.length) { log(`${dry ? 'Sẽ đồng bộ' : 'Đã đồng bộ'} chữ giữa khung hình và Variables:`); for (const c of changed) log(`- ${c}`); }
  if (open.length) {
    log('Chưa biết bên nào mới hơn, nên chưa đổi gì ở những ô này (hỏi người dùng, rồi chạy lại với --canvas=<id> để giữ chữ trên khung hình, hoặc --variables=<id> để giữ chữ trong Variables):');
    for (const o of open) log(`- ${o.label}: khung hình ${o.canvas.map(q).join(', ')}, Variables ${q(o.variable)}`);
  }
  for (const x of notes) log(`Lưu ý: ${x}`);
  if (!changed.length && !open.length) log(`Chữ trên khung hình và Variables đã khớp (${n} chỗ).`);
  return { changed, open, notes };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const flag = (k) => { const a = args.find((x) => x === `--${k}` || x.startsWith(`--${k}=`)); return !a ? null : a.includes('=') ? a.split('=')[1].split(',').map((s) => s.trim()).filter(Boolean) : true; };
  const projArg = args.find((a) => !a.startsWith('--'));
  if (!projArg || !existsSync(join(resolve(projArg), 'index.html'))) {
    console.error('cách dùng: sync-text.mjs <thư mục video> [--canvas[=id,id]] [--variables[=id,id]] [--dry]');
    process.exit(1);
  }
  const { open } = syncText(projArg, { canvas: flag('canvas'), variables: flag('variables'), dry: args.includes('--dry') });
  process.exitCode = open.length ? 2 : 0;
}
