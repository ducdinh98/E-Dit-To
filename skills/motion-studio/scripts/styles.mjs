#!/usr/bin/env node
// Styles: pick a look before anything else.
// (<skill> is this skill's folder, e.g. ~/.claude/skills/motion-studio; the library is styleLib() in lib.mjs: in the skill
// for a user install, in the videos folder's styles/ for a project install)
//   node <skill>/scripts/styles.mjs gallery [--open]     <library>/gallery.html: every built-in preset and your saved looks
//   node <skill>/scripts/styles.mjs lib                   where the library is
//   node <skill>/scripts/styles.mjs list                  the same, as text
//   node <skill>/scripts/styles.mjs path <name>           where a style's FRAME.md is (for the hand-off)
//   node <skill>/scripts/styles.mjs frames <video> [--count 12]   stills from a reference video + a contact sheet
//   node <skill>/scripts/styles.mjs save <FRAME.md> --name "<name>" [--refs a.png,b.png]   add a look to your library
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, rmSync } from 'node:fs';
import { basename, extname, join, relative, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { hfSkill, mediaTools, readFrame, listDirs, slug, openInBrowser, styleLib } from './lib.mjs';
import { PRESETS_VI } from './presets-vi.mjs';

const [cmd, ...rest] = process.argv.slice(2);
const opt = (k, d) => { const i = rest.indexOf(`--${k}`); return i >= 0 && rest[i + 1] && !rest[i + 1].startsWith('--') ? rest[i + 1] : d; };
const LIB = styleLib();
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const relUrl = (from, to) => relative(from, to).split(sep).map(encodeURIComponent).join('/');

// "Look" and "Pick when" for each preset, from HyperFrames' own design-spec table
function presetNotes(creative) {
  const notes = {};
  try {
    const md = readFileSync(join(creative, 'references', 'design-spec.md'), 'utf8');
    for (const row of md.split('\n')) {
      const m = row.match(/^\|\s*`?\[([\w-]+)\]\([^)]*\)`?\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*$/);
      if (m) notes[m[1]] = { look: m[2], when: m[3] };
    }
  } catch {}
  return notes;
}

// HyperFrames' built-in looks: in hyperframes/assets/frame-presets since 0.8.195 (25 Oct), in
// hyperframes-creative/frame-presets before; the English notes come from the older design-spec table when it's there
function presetHome() {
  const now = hfSkill('hyperframes');
  if (now && existsSync(join(now, 'assets', 'frame-presets'))) return { creative: now, dir: join(now, 'assets', 'frame-presets') };
  const old = hfSkill('hyperframes-creative');
  if (old && existsSync(join(old, 'frame-presets'))) return { creative: old, dir: join(old, 'frame-presets') };
  return { creative: null, dir: null };
}

function collect() {
  const { creative, dir } = presetHome();
  const presets = [];
  if (creative) {
    const notes = presetNotes(creative);
    for (const id of listDirs(dir)) {
      const f = join(dir, id, 'FRAME.md');
      if (!existsSync(f)) continue;
      const fr = readFrame(f);
      const en = notes[id] ? { mood: notes[id].when.split(';')[0].trim(), when: notes[id].when.split(';').slice(1).join(';').trim().replace(/^./, (c) => c.toUpperCase()), look: notes[id].look } : {};
      presets.push({ id, kind: 'preset', file: f, showcase: existsSync(join(dir, id, 'frame-showcase.html')) ? join(dir, id, 'frame-showcase.html') : null, ...fr, ...en, ...(PRESETS_VI[id] || {}) });
    }
  }
  const mine = [];
  for (const id of listDirs(LIB)) {
    const f = join(LIB, id, 'FRAME.md');
    if (!existsSync(f)) continue;
    const refs = readdirSync(join(LIB, id)).filter((x) => /\.(png|jpe?g|webp|gif)$/i.test(x)).map((x) => join(LIB, id, x));
    mine.push({ id, kind: 'mine', file: f, refs, ...readFrame(f) });
  }
  return { presets, mine, creative };
}

function gallery() {
  const { presets, mine, creative } = collect();
  if (!creative) { console.error('Chưa có skill của HyperFrames: hãy chạy install.sh của Motion Studio trước'); process.exit(1); }
  mkdirSync(LIB, { recursive: true });
  const fontsUrl = (fonts) => fonts.length ? `https://fonts.googleapis.com/css2?${fonts.slice(0, 3).map((f) => `family=${encodeURIComponent(f).replace(/%20/g, '+')}`).join('&')}&display=swap` : '';
  const swatches = (colors) => colors.slice(0, 8).map(([k, v]) => `<i title="${esc(k)} ${esc(v)}" style="background:${esc(v)}"></i>`).join('');
  let n = 0;
  const card = (s) => {
    n++;
    const preview = s.showcase
      ? `<div class="pv"><iframe loading="lazy" src="${relUrl(LIB, s.showcase)}" tabindex="-1"></iframe></div>`
      : `<div class="pv mine">${(s.refs || []).slice(0, 3).map((r) => `<img src="${relUrl(LIB, r)}" alt="">`).join('') || '<div class="noref">chưa có ảnh tham khảo</div>'}
         <div class="type" style="${s.fonts[0] ? `font-family:'${esc(s.fonts[0])}'` : ''}">${esc(s.name || s.id)}</div></div>`;
    return `<article class="card" data-id="${esc(s.id)}">
      ${preview}
      <div class="meta">
        <div class="row"><span class="n">${n}</span><h2>${esc(s.name || s.id)}</h2><code>${esc(s.id)}</code></div>
        <div class="sw">${swatches(s.colors)}</div>
        ${s.mood ? `<p class="mood">${esc(s.mood)}</p>` : ''}
        ${s.when ? `<p class="when">${esc(s.when)}</p>` : ''}
        ${s.look || s.description ? `<p class="look">${esc(s.look || s.description)}</p>` : ''}
        <p class="fonts">${s.fonts.slice(0, 3).map(esc).join(' · ')}</p>
        <div class="acts">${s.showcase ? `<a href="${relUrl(LIB, s.showcase)}" target="_blank">Xem bản lớn</a>` : `<a href="${relUrl(LIB, s.file)}" target="_blank">Mở file FRAME.md</a>`}
          <button data-say="Dùng phong cách ${esc(s.id)}">Chọn</button></div>
      </div></article>`;
  };
  const fontLinks = [...new Set(mine.flatMap((s) => [fontsUrl(s.fonts)]).filter(Boolean))].map((u) => `<link rel="stylesheet" href="${u}">`).join('\n');
  const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Chọn phong cách</title>${fontLinks}
<style>
:root { --bg:#f3f1ec; --card:#fff; --ink:#17181c; --muted:#6b6f78; --line:#e3e0d8; --accent:#2f5bea; }
* { box-sizing:border-box } body { margin:0; background:var(--bg); color:var(--ink); font:15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif }
header { padding:36px 40px 8px; max-width:1500px; margin:0 auto }
h1 { margin:0 0 6px; font-size:30px; letter-spacing:-.01em } header p { margin:0; color:var(--muted); max-width:820px }
.how { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:14px; margin:22px 0 4px }
.how div { background:var(--card); border:1px solid var(--line); border-radius:12px; padding:14px 16px }
.how b { display:block; margin-bottom:2px }
section { max-width:1500px; margin:0 auto; padding:18px 40px 40px }
section h3 { font-size:13px; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); margin:18px 0 12px }
.grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(340px,1fr)); gap:20px }
.card { background:var(--card); border:1px solid var(--line); border-radius:14px; overflow:hidden; display:flex; flex-direction:column; transition:box-shadow .15s, transform .15s }
.card:hover { box-shadow:0 14px 40px rgba(0,0,0,.10); transform:translateY(-2px) }
.card.picked { outline:3px solid var(--accent) }
.pv { position:relative; aspect-ratio:16/9; overflow:hidden; background:#ddd; border-bottom:1px solid var(--line) }
.pv iframe { position:absolute; left:0; top:0; width:1600px; height:900px; border:0; transform-origin:0 0; pointer-events:none }
.pv.mine { display:flex; gap:4px; background:#222; align-items:stretch }
.pv.mine img { flex:1; min-width:0; object-fit:cover }
.pv .noref { color:#bbb; margin:auto }
.pv .type { position:absolute; left:12px; bottom:10px; color:#fff; font-size:28px; text-shadow:0 2px 10px rgba(0,0,0,.6) }
.meta { padding:14px 16px 16px; display:flex; flex-direction:column; gap:6px; flex:1 }
.row { display:flex; align-items:center; gap:8px } .row h2 { font-size:17px; margin:0; flex:1 } .row code { color:var(--muted); font-size:12px }
.n { width:24px; height:24px; border-radius:50%; background:var(--ink); color:#fff; font-size:12px; font-weight:700; display:inline-flex; align-items:center; justify-content:center; flex:none }
.sw { display:flex; gap:4px } .sw i { width:22px; height:22px; border-radius:6px; border:1px solid rgba(0,0,0,.12) }
.meta p { margin:0; color:#33363d; font-size:13.5px } .meta p.fonts { color:var(--muted); font-size:12.5px }
.meta p.mood { font-weight:600; font-size:14.5px; color:var(--ink) } .meta p.when { color:#33363d }
.meta p.look { color:var(--muted); font-size:12.5px; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden }
.acts { margin-top:auto; padding-top:8px; display:flex; align-items:center; justify-content:space-between; gap:8px }
.acts a { color:var(--accent); text-decoration:none; font-size:13px }
.acts button { background:var(--ink); color:#fff; border:0; border-radius:8px; padding:7px 14px; font:600 13px system-ui,sans-serif; cursor:pointer }
.empty { color:var(--muted); background:var(--card); border:1px dashed var(--line); border-radius:12px; padding:18px }
#toast { position:fixed; left:50%; bottom:24px; transform:translateX(-50%); background:var(--ink); color:#fff; padding:12px 18px; border-radius:10px; display:none; font-weight:600 }
@media (max-width:700px) { header, section { padding-left:16px; padding-right:16px } .grid { grid-template-columns:1fr } }
</style></head><body>
<header>
  <h1>Chọn phong cách cho video</h1>
  <p>Video nào cũng bắt đầu từ một phong cách: màu sắc, font chữ, và cách bố cục từng khung hình. Bạn có thể chọn một phong cách có sẵn bên dưới, hoặc dùng phong cách của riêng bạn, rồi nhắn cho Claude trong chat là bạn chọn phong cách nào.</p>
  <div class="how">
    <div><b>Chọn một phong cách ở đây</b>Bấm "Chọn" (câu nhắn đã được copy sẵn), rồi dán vào chat với Claude, ví dụ "Dùng phong cách coral".</div>
    <div><b>Dùng phong cách của riêng bạn</b>Gửi cho Claude 3 đến 5 ảnh chụp màn hình có phong cách bạn thích, một link website, hoặc một file video, kèm một câu về điều bạn thích ở đó. Claude sẽ tạo thành một phong cách mới trong mục "Phong cách của bạn".</div>
    <div><b>Chưa biết chọn gì?</b>Hãy nhắn cho Claude "bạn chọn giúp mình". HyperFrames sẽ gợi ý một phong cách hợp với video, hoặc cho bạn xem vài mood board để chọn.</div>
  </div>
</header>
<section><h3>Phong cách của bạn</h3>
${mine.length ? `<div class="grid">${mine.map(card).join('')}</div>` : '<div class="empty">Chưa có phong cách nào. Những phong cách Claude tạo từ ảnh, website, hay video bạn gửi sẽ nằm ở đây, sẵn sàng cho video tiếp theo.</div>'}
<h3>Phong cách có sẵn (của HyperFrames)</h3><div class="grid">${presets.map(card).join('')}</div></section>
<div id="toast"></div>
<script>
function fit(){ document.querySelectorAll('.pv iframe').forEach(f => { const w = f.parentElement.clientWidth; f.style.transform = 'scale(' + (w / 1600) + ')'; }); }
addEventListener('resize', fit); fit();
document.querySelectorAll('button[data-say]').forEach(b => b.onclick = async () => {
  document.querySelectorAll('.card').forEach(c => c.classList.remove('picked')); b.closest('.card').classList.add('picked');
  const t = b.dataset.say; let copied = false; try { await navigator.clipboard.writeText(t); copied = true; } catch {}
  const el = document.getElementById('toast'); el.textContent = copied ? 'Đã copy. Bạn dán vào chat với Claude: "' + t + '"' : 'Bạn nhắn cho Claude: "' + t + '"'; el.style.display = 'block';
  clearTimeout(window.__t); window.__t = setTimeout(() => el.style.display = 'none', 4000);
});
</script></body></html>`;
  const out = join(LIB, 'gallery.html');
  writeFileSync(out, html);
  console.log(`${relative(process.cwd(), out) || out}: ${mine.length} phong cách của bạn, ${presets.length} phong cách có sẵn`);
  if (rest.includes('--open')) openInBrowser(out);
}

function list() {
  const { presets, mine } = collect();
  console.log('Phong cách của bạn:' + (mine.length ? '' : ' chưa có'));
  for (const s of mine) console.log(`  ${s.id.padEnd(18)} ${s.description.slice(0, 90)}`);
  console.log('Có sẵn (HyperFrames):');
  for (const s of presets) console.log(`  ${s.id.padEnd(18)} ${(s.look || s.description).slice(0, 90)}`);
}

function where() {
  const name = slug(rest[0] || '');
  const { presets, mine } = collect();
  const s = mine.find((x) => x.id === name) || presets.find((x) => x.id === name);
  if (!s) { console.error(`không có phong cách "${rest[0]}" (xem danh sách: styles.mjs list)`); process.exit(1); }
  console.log(s.file);
}

// stills from a reference video, spread over its length, and one contact sheet Claude can read in a single look
function frames() {
  const src = resolve(rest[0] || '');
  if (!existsSync(src)) { console.error('cách dùng: styles.mjs frames <file video> [--count 12]'); process.exit(1); }
  const { ffmpeg, ffprobe } = mediaTools();
  if (!ffmpeg || !ffprobe) { console.error('Thiếu FFmpeg: hãy chạy install.sh của Motion Studio'); process.exit(1); }
  const count = Math.max(4, Math.min(24, Number(opt('count', 12))));
  const dur = parseFloat(spawnSync(ffprobe, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', src], { encoding: 'utf8' }).stdout) || 0;
  if (!dur) { console.error('không đọc được độ dài của video'); process.exit(1); }
  const dir = join(LIB, '_refs', slug(basename(src, extname(src))));
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const files = [];
  for (let i = 0; i < count; i++) {
    const t = (dur * (i + 0.5)) / count;
    const f = join(dir, `f${String(i + 1).padStart(2, '0')}-${t.toFixed(1)}s.jpg`);
    spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-ss', t.toFixed(3), '-i', src, '-frames:v', '1', '-vf', 'scale=960:-2', '-q:v', '3', f]);
    if (existsSync(f)) files.push(f);
  }
  const cols = 4, sheet = join(dir, 'sheet.jpg');
  const inputs = files.flatMap((f) => ['-i', f]);
  const n = files.length, rows = Math.ceil(n / cols);
  const pads = Array.from({ length: rows * cols - n }, () => 'color=c=black:s=480x270:d=1');
  const filt = files.map((_, i) => `[${i}:v]scale=480:270:force_original_aspect_ratio=decrease,pad=480:270:(ow-iw)/2:(oh-ih)/2[v${i}]`).join(';') +
    (pads.length ? ';' + pads.map((p, j) => `${p}[p${j}]`).join(';') : '') + ';' +
    [...files.map((_, i) => `[v${i}]`), ...pads.map((_, j) => `[p${j}]`)].join('') + `xstack=inputs=${rows * cols}:layout=` +
    Array.from({ length: rows * cols }, (_, k) => `${(k % cols) * 480}_${Math.floor(k / cols) * 270}`).join('|');
  spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...inputs, '-filter_complex', filt, '-frames:v', '1', '-q:v', '3', sheet]);
  for (const f of files) console.log(f);
  console.log(existsSync(sheet) ? `ảnh tổng hợp (contact sheet): ${sheet}` : 'không tạo được ảnh tổng hợp; hãy xem từng ảnh một');
}

// add a look to the library: styles/<name>/FRAME.md plus its reference images
function save() {
  const src = resolve(rest[0] || '');
  const name = opt('name');
  if (!existsSync(src) || !name) { console.error('cách dùng: styles.mjs save <FRAME.md> --name "<tên>" [--refs a.png,b.png]'); process.exit(1); }
  const dir = join(LIB, slug(name));
  mkdirSync(dir, { recursive: true });
  copyFileSync(src, join(dir, 'FRAME.md'));
  for (const r of (opt('refs', '') || '').split(',').filter(Boolean)) {
    const p = resolve(r);
    if (existsSync(p)) copyFileSync(p, join(dir, `ref-${basename(p)}`));
  }
  console.log(`đã lưu ${relative(process.cwd(), dir) || dir}`);
  gallery();
}

const cmds = { gallery, list, path: where, frames, save, lib: () => console.log(LIB) };
const HELP = `Phong cách: chọn trước khi làm gì khác.
  node <skill>/scripts/styles.mjs gallery [--open]     gallery.html trong thư viện: mọi phong cách có sẵn và phong cách của bạn
  node <skill>/scripts/styles.mjs lib                   thư viện phong cách nằm ở đâu
  node <skill>/scripts/styles.mjs list                  danh sách phong cách, dạng chữ
  node <skill>/scripts/styles.mjs path <tên>            file FRAME.md của một phong cách nằm ở đâu
  node <skill>/scripts/styles.mjs frames <video> [--count 12]   ảnh trích từ một video tham khảo, kèm ảnh tổng hợp
  node <skill>/scripts/styles.mjs save <FRAME.md> --name "<tên>" [--refs a.png,b.png]   thêm một phong cách vào thư viện`;
if (!cmds[cmd]) { console.log(HELP); process.exitCode = cmd ? 1 : 0; }
else cmds[cmd]();
