import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { mediaTools } from 'file:///C:/Users/Cong%20Duc/.gemini/config/skills/motion-studio/scripts/lib.mjs';
import { SR, renderEffects, wav } from 'file:///C:/Users/Cong%20Duc/.gemini/config/skills/motion-studio/scripts/sound.js';

const proj = 'F:/App nha lam/motion-video-demo/videos/viesnap-illustrated';
const compDir = join(proj, 'compositions');
const assetsDir = join(proj, 'assets');
mkdirSync(compDir, { recursive: true });
mkdirSync(assetsDir, { recursive: true });

// ============================================================================
// 1. GENERATE 10 VOICE-LOCKED SUBTLE SFX WAV TRACKS (sfx-s01.wav .. sfx-s10.wav)
// ============================================================================
const sfxDir = 'C:/Users/Cong Duc/.gemini/config/skills/media-use/audio/assets/sfx';
const { ffmpeg } = mediaTools();
const db = (x) => Math.pow(10, x / 20);

function loadSample(filename) {
  const path = join(sfxDir, filename);
  const r = spawnSync(ffmpeg, [
    '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '2', '-ar', String(SR), 'pipe:1'
  ], { maxBuffer: 32 * 1024 * 1024, shell: false });
  if (r.status !== 0) throw new Error(`ffmpeg decode failed for ${filename}`);
  const buf = r.stdout;
  const floats = new Float32Array(buf.buffer, buf.byteOffset, Math.floor(buf.byteLength / 4));
  const totalFrames = Math.floor(floats.length / 2);
  let L = new Float64Array(totalFrames);
  let R = new Float64Array(totalFrames);
  let peak = 0;
  for (let i = 0; i < totalFrames; i++) {
    L[i] = floats[i * 2];
    R[i] = floats[i * 2 + 1];
    const m = Math.max(Math.abs(L[i]), Math.abs(R[i]));
    if (m > peak) peak = m;
  }
  const scale = peak > 1e-6 ? 1 / peak : 1;
  for (let i = 0; i < totalFrames; i++) { L[i] *= scale; R[i] *= scale; }
  const thresh = db(-38);
  let first = 0;
  for (let i = 0; i < totalFrames; i++) {
    if (Math.max(Math.abs(L[i]), Math.abs(R[i])) >= thresh) {
      first = Math.max(0, i - Math.floor(0.004 * SR));
      break;
    }
  }
  L = L.slice(first);
  R = L.length ? R.slice(first) : R;
  const fi = Math.min(L.length, Math.floor(0.004 * SR));
  for (let i = 0; i < fi; i++) { const g = i / fi; L[i] *= g; R[i] *= g; }
  return [L, R];
}

function resample([L, R], rate = 1) {
  if (Math.abs(rate - 1) < 1e-4) return [L, R];
  const outLen = Math.max(1, Math.floor(L.length / rate));
  const oL = new Float64Array(outLen);
  const oR = new Float64Array(outLen);
  for (let i = 0; i < outLen; i++) {
    const pos = i * rate;
    const idx = Math.min(L.length - 1, Math.floor(pos));
    const frac = pos - idx;
    const idx2 = Math.min(L.length - 1, idx + 1);
    oL[i] = L[idx] * (1 - frac) + L[idx2] * frac;
    oR[i] = R[idx] * (1 - frac) + R[idx2] * frac;
  }
  return [oL, oR];
}

function loadSynth(kind, opts = {}, dur = 0.34) {
  const n = Math.floor(dur * SR);
  const [L, R] = renderEffects([[kind, 0, opts]], n);
  let peak = 0;
  for (let i = 0; i < n; i++) {
    const m = Math.max(Math.abs(L[i]), Math.abs(R[i]));
    if (m > peak) peak = m;
  }
  const s = peak > 1e-6 ? 1 / peak : 1;
  for (let i = 0; i < n; i++) { L[i] *= s; R[i] *= s; }
  return [L, R];
}

const SAMPLES = {
  pop: loadSample('pop.mp3'),
  whoosh: loadSample('whoosh-short.mp3'),
  click: loadSample('click-soft.mp3'),
  tap: loadSample('key-press.mp3'),
  ping: loadSample('ping.mp3'),
  chime: loadSample('chime.mp3'),
  notif: loadSample('notification.mp3'),
  thump: loadSynth('thump', {}, 0.32),
};

function placeSample(bufL, bufR, sampleName, t, { peakDb = -8, rate = 1, pan = 0, maxDur = null } = {}) {
  let [sL, sR] = resample(SAMPLES[sampleName], rate);
  if (maxDur != null) {
    const maxN = Math.min(sL.length, Math.floor(maxDur * SR));
    sL = sL.slice(0, maxN);
    sR = sR.slice(0, maxN);
    const fo = Math.min(maxN, Math.floor(0.05 * SR));
    for (let i = 0; i < fo; i++) {
      const g = 1 - i / fo;
      sL[maxN - fo + i] *= g;
      sR[maxN - fo + i] *= g;
    }
  }
  const gain = db(peakDb);
  const gL = gain * (pan <= 0 ? 1 : 1 - pan * 0.45);
  const gR = gain * (pan >= 0 ? 1 : 1 + pan * 0.45);
  const i0 = Math.max(0, Math.round(t * SR));
  for (let i = 0; i < sL.length && i0 + i < bufL.length; i++) {
    bufL[i0 + i] += sL[i] * gL;
    bufR[i0 + i] += sR[i] * gR;
  }
}

// Every SFX event is locked 1:1 to the exact word-synced GSAP entrance timestamp!
const SFX_SPECS = [
  {
    // Scene 01 (0.00 - 4.95s, dur 4.95s): "Ảo vãi! Nhiều anh em còn tải video theo cách cũ (1.9s) để dính logo (2.8s) và mờ căm (3.6s)..."
    file: 'sfx-s01.wav', dur: 4.95,
    events: [
      ['tap',    0.12, { peakDb: -9.5, pan: -0.15 }],
      ['whoosh', 0.74, { peakDb: -7.5, rate: 1.02 }],
      ['pop',    1.90, { peakDb: -7.6, rate: 0.96 }],
      ['click',  2.68, { peakDb: -9.5, pan: -0.20 }],
      ['thump',  2.82, { peakDb: -7.6, pan: -0.14 }],
      ['pop',    2.82, { peakDb: -7.0, rate: 0.88, pan: -0.14 }],
      ['thump',  3.60, { peakDb: -7.6, rate: 0.94, pan: 0.14 }],
      ['pop',    3.60, { peakDb: -7.0, rate: 0.82, pan: 0.14 }],
    ]
  },
  {
    // Scene 02 (4.95 - 11.75s, dur 6.80s): "Để tôi chỉ... nét căng (1.36s), ko logo (2.02s), FREE (2.88s), video (3.58s), hình ảnh (4.32s), âm thanh/nhạc chuông (5.02s/5.90s)"
    file: 'sfx-s02.wav', dur: 6.80,
    events: [
      ['tap',    0.12, { peakDb: -9.5 }],
      ['whoosh', 0.40, { peakDb: -7.0, rate: 1.0 }],
      ['pop',    1.36, { peakDb: -7.4, rate: 0.98 }],
      ['click',  2.02, { peakDb: -9.0 }],
      ['thump',  2.88, { peakDb: -7.8 }],
      ['pop',    2.88, { peakDb: -7.0, rate: 0.94 }],
      ['pop',    3.58, { peakDb: -7.0, rate: 0.96, pan: -0.24 }],
      ['pop',    4.32, { peakDb: -7.0, rate: 1.06, pan: 0.0 }],
      ['pop',    5.02, { peakDb: -7.0, rate: 1.16, pan: 0.24 }],
      ['ping',   5.90, { peakDb: -9.2, maxDur: 0.75, pan: 0.20 }],
    ]
  },
  {
    // Scene 03 (11.75 - 21.20s, dur 9.45s): "vào video... Chia sẻ, Sao chép (1.65s)... mở VieSnap, dán vào đây (3.45s / 4.72s)... ấn tải video HD (5.65s)... ấn tải thế là xong (8.05s)"
    file: 'sfx-s03.wav', dur: 9.45,
    events: [
      ['tap',    0.12, { peakDb: -9.5 }],
      ['whoosh', 0.26, { peakDb: -7.4, rate: 1.02 }],
      ['pop',    1.66, { peakDb: -7.0, rate: 0.96, pan: -0.24 }],
      ['click',  2.36, { peakDb: -9.2, pan: -0.20 }],
      ['pop',    3.46, { peakDb: -7.0, rate: 1.06, pan: 0.0 }],
      ['click',  4.72, { peakDb: -9.2, pan: 0.0 }],
      ['pop',    5.66, { peakDb: -6.8, rate: 1.16, pan: 0.24 }],
      ['chime',  8.06, { peakDb: -9.2, maxDur: 1.0 }],
    ]
  },
  {
    // Scene 04 (21.20 - 26.35s, dur 5.15s): "Đây! Thành quả (0.12s)... độ phân giải cao rất nét (1.42s)... không hề dính logo (2.72s) TikTok (3.54s)"
    file: 'sfx-s04.wav', dur: 5.15,
    events: [
      ['tap',    0.12, { peakDb: -9.2 }],
      ['whoosh', 0.26, { peakDb: -7.4, rate: 1.04 }],
      ['pop',    1.42, { peakDb: -7.0, rate: 1.00, pan: -0.20 }],
      ['notif',  2.72, { peakDb: -8.6, maxDur: 0.85, pan: 0.20 }],
      ['thump',  3.54, { peakDb: -7.6, pan: 0.18 }],
      ['pop',    3.54, { peakDb: -7.0, rate: 0.90, pan: 0.18 }],
    ]
  },
  {
    // Scene 05 (26.35 - 35.85s, dur 9.50s): "áp dụng cách này... tải ảnh làm hình nền (1.58s)... hoặc tải âm thanh (3.18s) làm nhạc chuông (4.65s)... tích hợp sẵn trong VieSnap (6.26s)"
    file: 'sfx-s05.wav', dur: 9.50,
    events: [
      ['tap',    0.12, { peakDb: -9.5 }],
      ['whoosh', 0.26, { peakDb: -7.4, rate: 1.02 }],
      ['pop',    1.58, { peakDb: -7.0, rate: 1.00, pan: -0.18 }],
      ['whoosh', 3.18, { peakDb: -7.2, rate: 1.06, pan: 0.18 }],
      ['ping',   4.66, { peakDb: -9.0, maxDur: 0.90, pan: 0.15 }],
      ['chime',  6.26, { peakDb: -9.2, maxDur: 0.95 }],
    ]
  },
  {
    // Scene 06 (35.85 - 40.60s, dur 4.75s): "Ngoài TikTok ra (0.24s) thì VieSnap cũng hỗ trợ (0.92s) rất nhiều nền tảng khác nhau (1.78..2.70s) thoải mái sử dụng (3.34s)"
    file: 'sfx-s06.wav', dur: 4.75,
    events: [
      ['pop',    0.26, { peakDb: -7.8, rate: 0.92, pan: -0.24 }],
      ['whoosh', 0.92, { peakDb: -7.2, rate: 1.04 }],
      ['pop',    1.80, { peakDb: -8.2, rate: 0.98, pan: 0.24 }],
      ['pop',    2.03, { peakDb: -8.2, rate: 1.04, pan: -0.24 }],
      ['pop',    2.26, { peakDb: -8.2, rate: 1.10, pan: 0.24 }],
      ['pop',    2.49, { peakDb: -8.2, rate: 1.16, pan: -0.24 }],
      ['pop',    2.72, { peakDb: -8.2, rate: 1.22, pan: 0.24 }],
      ['click',  3.34, { peakDb: -9.0 }],
    ]
  },
  {
    // Scene 07 (40.60 - 50.10s, dur 9.50s): "giao diện quen quen (1.36s)... Đúng rồi! (2.76s) công cụ do người Việt làm ra (3.76s)... trải nghiệm (5.94s, 6.62s) không thua kém hàng thế giới (7.28s, 8.18s)"
    file: 'sfx-s07.wav', dur: 9.50,
    events: [
      ['tap',    0.20, { peakDb: -9.5 }],
      ['pop',    1.36, { peakDb: -7.8, rate: 0.96 }],
      ['click',  2.76, { peakDb: -8.8 }],
      ['thump',  3.76, { peakDb: -7.6 }],
      ['pop',    3.76, { peakDb: -7.0, rate: 0.94 }],
      ['pop',    5.94, { peakDb: -8.0, rate: 1.02 }],
      ['pop',    6.62, { peakDb: -8.0, rate: 1.08 }],
      ['whoosh', 7.28, { peakDb: -7.2, rate: 1.05 }],
      ['chime',  8.18, { peakDb: -9.2, maxDur: 1.0 }],
    ]
  },
  {
    // Scene 08 (50.10 - 57.70s, dur 7.60s): "còn hơn luôn... FREE (1.86s)... không hề có quảng cáo nào (3.16s)... dùng nó sướng cực kỳ (5.56s)"
    file: 'sfx-s08.wav', dur: 7.60,
    events: [
      ['tap',    0.16, { peakDb: -9.5 }],
      ['whoosh', 0.64, { peakDb: -7.6, rate: 1.02 }],
      ['thump',  1.86, { peakDb: -7.5, pan: -0.18 }],
      ['pop',    1.86, { peakDb: -6.8, rate: 0.96, pan: -0.18 }],
      ['thump',  3.16, { peakDb: -7.4 }],
      ['pop',    3.16, { peakDb: -6.8, rate: 1.04 }],
      ['whoosh', 5.56, { peakDb: -7.2, rate: 1.06, pan: 0.18 }],
      ['ping',   5.60, { peakDb: -8.8, maxDur: 0.95, pan: 0.18 }],
    ]
  },
  {
    // Scene 09 (57.70 - 66.25s, dur 8.55s): "Vào website (0.14s)... Trống Đồng (1.24s) rồi Bản đồ Việt Nam (2.20s) đầy đủ Hoàng Sa Trường Sa (3.28s)... +1 công cụ (5.46s)"
    file: 'sfx-s09.wav', dur: 8.55,
    events: [
      ['whoosh', 0.14, { peakDb: -7.4, rate: 0.98 }],
      ['pop',    1.24, { peakDb: -7.2, rate: 0.98 }],
      ['click',  2.20, { peakDb: -9.2 }],
      ['chime',  3.28, { peakDb: -8.8, maxDur: 1.05 }],
      ['thump',  5.46, { peakDb: -7.4, pan: 0.16 }],
      ['pop',    5.46, { peakDb: -6.8, rate: 0.90, pan: 0.16 }],
    ]
  },
  {
    // Scene 10 (66.25 - 75.87s, dur 9.62s): "thường xuyên tải video TikTok Douyin (1.66s)... sử dụng VieSnap nha (5.34s / 5.68s)! Người Việt Nam (6.96s) ưu tiên dùng hàng Việt Nam (7.72s)!"
    file: 'sfx-s10.wav', dur: 9.62,
    events: [
      ['tap',    0.18, { peakDb: -9.5 }],
      ['whoosh', 0.40, { peakDb: -7.4, rate: 0.98 }],
      ['click',  1.66, { peakDb: -8.8 }],
      ['notif',  5.34, { peakDb: -8.8, maxDur: 1.0 }],
      ['pop',    6.96, { peakDb: -7.2, rate: 0.98 }],
      ['thump',  7.72, { peakDb: -7.2, rate: 0.92 }],
      ['pop',    7.72, { peakDb: -6.8, rate: 0.88 }],
    ]
  }
];

const ceil = db(-1.5);
for (const sc of SFX_SPECS) {
  const n = Math.floor(sc.dur * SR);
  const L = new Float64Array(n);
  const R = new Float64Array(n);
  for (const [name, t, opts] of sc.events) {
    placeSample(L, R, name, t, opts);
  }
  const oL = new Float32Array(n);
  const oR = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    oL[i] = ceil * Math.tanh(L[i] / ceil);
    oR[i] = ceil * Math.tanh(R[i] / ceil);
  }
  writeFileSync(join(assetsDir, sc.file), wav([oL, oR]));
}
console.log('Generated 10 phrase-synced SFX WAV tracks.');

// ============================================================================
// 2. WRITE ALL 10 SEQUENTIALLY VOICE-SYNCED COMPOSITIONS
// ============================================================================
const FONT_LINK = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Be+Vietnam+Pro:wght@600;700;800;900&family=JetBrains+Mono:wght@500;700;800&family=Space+Grotesk:wght@500;700&display=swap" />`;
const GSAP_SCRIPT = `<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>`;

const VN_FLAG_SVG = `<svg width="34" height="24" viewBox="0 0 34 24" style="vertical-align:-4px;margin-right:8px;border:2px solid #EFE9D9;display:inline-block;"><rect width="34" height="24" fill="#DA251D"/><polygon points="17,4 19.3,10.8 26.5,10.8 20.7,15 22.9,21.8 17,17.6 11.1,21.8 13.3,15 7.5,10.8 14.7,10.8" fill="#F5C518"/></svg>`;

const COMMON_CSS = `
  * { box-sizing: border-box; }
  #root {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    container-type: size;
    background: var(--bg_cream, #EFE9D9);
    color: #0F0F0F;
    font-family: "Be Vietnam Pro", "Space Grotesk", sans-serif;
  }
  .ground-fill {
    position: absolute;
    inset: 0;
    background: var(--bg_cream, #EFE9D9);
  }
  .ground-green {
    position: absolute;
    inset: 0;
    background: var(--accent_green_plate, #136636);
  }
  .cm-topbar {
    position: absolute;
    top: 48px;
    left: 56px;
    right: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 20;
  }
  .cm-sec-label {
    font-family: "JetBrains Mono", monospace;
    font-size: 21px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #0F0F0F;
  }
  .cm-pill {
    font-family: "JetBrains Mono", monospace;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 7px 20px;
    border: 3px solid #0F0F0F;
    border-radius: 999px;
    background: #EFE9D9;
    color: #0F0F0F;
  }
  .cm-footer {
    position: absolute;
    bottom: 44px;
    left: 56px;
    right: 56px;
    padding-top: 16px;
    border-top: 3px solid #0F0F0F;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: "JetBrains Mono", monospace;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #0F0F0F;
    z-index: 20;
  }
  .cm-counter {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .cm-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #0F0F0F;
    display: inline-block;
  }
  .chrome-cream .cm-sec-label,
  .chrome-cream.cm-footer {
    color: #EFE9D9;
    border-color: #EFE9D9;
  }
  .chrome-cream .cm-pill {
    background: transparent;
    color: #EFE9D9;
    border-color: #EFE9D9;
  }
  .chrome-cream .cm-dot {
    background: #EFE9D9;
  }
  .cm-kicker {
    display: inline-block;
    background: #0F0F0F;
    color: #EFE9D9;
    font-family: "JetBrains Mono", monospace;
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 10px 18px;
    border: 4px solid #0F0F0F;
  }
  .cm-head {
    font-family: "Be Vietnam Pro", "Archivo Black", sans-serif;
    font-weight: 900;
    text-transform: uppercase;
    line-height: 1.14;
    letter-spacing: -0.015em;
  }
  .cm-mono {
    font-family: "JetBrains Mono", monospace;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .cm-shadow-featured {
    box-shadow: 14px 14px 0 var(--accent_orange, #E85A1F), 14px 14px 0 4px #0F0F0F;
  }
  .cm-shadow-ink {
    box-shadow: 12px 12px 0 #0F0F0F;
  }
  .cm-browser {
    width: 968px;
    border: 5px solid #0F0F0F;
    background: #0F0F0F;
    overflow: hidden;
  }
  .cm-browser-bar {
    height: 54px;
    background: #0F0F0F;
    color: #EFE9D9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: 4px solid #0F0F0F;
  }
  .cm-browser-dots { display: flex; gap: 10px; }
  .cm-bdot { width: 16px; height: 16px; border: 2px solid #EFE9D9; }
  .cm-browser-url {
    font-family: "JetBrains Mono", monospace;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: #EFE9D9;
  }
  .cm-browser-status {
    font-family: "JetBrains Mono", monospace;
    font-size: 18px;
    font-weight: 800;
    background: var(--accent_yellow, #F5C518);
    color: #0F0F0F;
    padding: 4px 12px;
  }
  .cm-video-viewport {
    position: relative;
    width: 100%;
    overflow: hidden;
    background: #141414;
  }
  .cm-video-viewport video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

function chromeHtml() {
  return '';
}

function writeScene(id, extraCss, innerHtml, gsapCode) {
  const html = `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>
    <template>
      ${FONT_LINK}
      <style>
        ${COMMON_CSS}
        ${extraCss}
      </style>
      <div id="root" data-composition-id="${id}" data-width="1080" data-height="1920">
        ${innerHtml}
      </div>
      <script>
        const tl = gsap.timeline({ paused: true });
        ${gsapCode}
        window.__timelines["${id}"] = tl;
      </script>
    </template>
  </body>
</html>
`;
  writeFileSync(join(compDir, `${id}.html`), html, 'utf8');
}

// ============================================================================
// SCENE 01 (0.00s - 4.95s, dur: 4.95s)
// Voice: "Ảo vãi! (0.1s) Nhiều anh em còn tải video (0.75s) theo cách cũ (1.9s)
//         để dính logo (2.8s) và mờ căm (3.6s) như thế này cơ á?"
// ============================================================================
writeScene(
  'scene-01',
  `
  #s1-stage {
    position: absolute;
    top: 132px; left: 56px; right: 56px; bottom: 116px;
    display: flex; flex-direction: column; justify-content: center; gap: 34px;
  }
  #s1-header { display: flex; flex-direction: column; align-items: flex-start; gap: 22px; }
  #s1-title { font-size: 72px; }
  .s1-line { display: block; }
  #s1-mock {
    position: relative; width: 100%; height: 860px; background: #E4DCC4;
    border: 5px solid #0F0F0F; display: flex; flex-direction: column; overflow: hidden;
  }
  .s1-mock-bar {
    height: 56px; background: #0F0F0F; color: #EFE9D9;
    display: flex; align-items: center; justify-content: space-between; padding: 0 22px;
  }
  .s1-mock-screen {
    position: relative; flex: 1; background: #2A2A2A;
    display: grid; grid-template-columns: repeat(8, 1fr); grid-template-rows: repeat(10, 1fr);
    padding: 24px; gap: 6px;
  }
  .px-blk { background: #3B3B3B; border: 1px solid #232323; }
  .px-blk.mid { background: #5A534A; }
  .px-blk.hi  { background: #8E7968; }
  .s1-wm-box {
    position: absolute; background: #EFE9D9; color: #0F0F0F; border: 4px solid #0F0F0F;
    padding: 12px 22px; font-family: "JetBrains Mono", monospace; font-size: 25px; font-weight: 800;
  }
  #s1-wm-1 { top: 68px; left: 44px; }
  #s1-wm-2 { bottom: 84px; right: 44px; background: var(--accent_yellow, #F5C518); }
  #s1-lowres {
    position: absolute; top: 50%; left: 50%; margin-left: -260px; margin-top: -74px; width: 520px;
    background: #0F0F0F; color: var(--accent_yellow, #F5C518); border: 4px solid #EFE9D9;
    padding: 22px 24px; text-align: center;
  }
  #s1-callout {
    position: relative; width: 100%; background: var(--accent_pink, #F06CA8);
    border: 5px solid #0F0F0F; padding: 28px 32px; display: flex; flex-direction: column; gap: 20px;
  }
  .s1-tags { display: flex; gap: 24px; flex-wrap: wrap; }
  .s1-stamp-tag { border: 4px solid #0F0F0F; padding: 12px 28px; font-size: 42px; }
  `,
  `
  <div class="ground-fill"></div>
  ${chromeHtml('s1', '01 // NỖI ĐAU CÁCH CŨ', 'brand_url', 'VIESNAP.VN', 'LƯU VIDEO TRỰC TIẾP TRÊN APP', '01')}
  <div id="s1-stage">
    <div id="s1-header">
      <div id="s1-kicker" class="cm-kicker" data-var-text="s1_kicker">✕ CÁCH TẢI TRỰC TIẾP KIỂU CŨ</div>
      <div id="s1-title" class="cm-head">
        <span id="s1-title-l1" class="s1-line">TẢI VIDEO KIỂU CŨ?</span>
        <span id="s1-title-l2" class="s1-line">MỜ NHOÈ &amp; DÍNH LOGO!</span>
      </div>
    </div>
    <div id="s1-mock">
      <div class="s1-mock-bar">
        <span class="cm-mono" style="font-size:20px;">FILE: VIDEO_TAI_VE_360P.MP4</span>
        <span class="cm-mono" style="background:#F06CA8;color:#0F0F0F;padding:3px 12px;font-size:18px;">✕ KÉM CHẤT LƯỢNG</span>
      </div>
      <div class="s1-mock-screen">
        ${Array.from({ length: 80 }).map((_, i) => {
          const r = Math.floor(i / 8), c = i % 8;
          const center = r >= 2 && r <= 7 && c >= 2 && c <= 5;
          const cls = center ? ((r + c) % 2 === 0 ? 'hi' : 'mid') : ((i % 5 === 0) ? 'mid' : '');
          return `<div class="px-blk ${cls}"></div>`;
        }).join('')}
        <div id="s1-wm-1" class="s1-wm-box">⚠ @LOGO_APP_CHÈN_GÓC</div>
        <div id="s1-lowres">
          <div class="cm-head" style="font-size:44px;">360P VỠ HẠT</div>
          <div class="cm-mono" style="font-size:19px;color:#EFE9D9;margin-top:6px;">BỊ NÉN GIẢM ĐỘ NÉT</div>
        </div>
        <div id="s1-wm-2" class="s1-wm-box">⚠ WATERMARK NHẢY CHÉO</div>
      </div>
    </div>
    <div id="s1-callout" class="cm-shadow-featured">
      <div class="cm-mono" style="font-size:22px;">HẬU QUẢ KHI LƯU THỦ CÔNG:</div>
      <div class="s1-tags">
        <div id="s1-tag1" class="cm-head s1-stamp-tag" style="background:var(--accent_yellow,#F5C518);" data-var-text="s1_tag1">DÍNH LOGO</div>
        <div id="s1-tag2" class="cm-head s1-stamp-tag" style="background:#EFE9D9;" data-var-text="s1_tag2">MỜ CĂM</div>
      </div>
    </div>
  </div>
  `,
  `
  // 0.12s: "Ảo vãi!"
  tl.fromTo("#s1-kicker", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "power3.out" }, 0.12);
  // 0.74s: "Nhiều anh em còn tải video..."
  tl.fromTo("#s1-mock", { y: 34, scale: 0.94, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.58, ease: "power3.out" }, 0.74);
  // 1.88s: "...theo cách cũ..."
  tl.fromTo("#s1-title-l1", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.52, ease: "circ.out" }, 1.88);
  // 2.68s - 2.90s: "...để dính logo..."
  tl.fromTo("#s1-wm-1", { scale: 0.72, rotation: -10, opacity: 0 }, { scale: 1, rotation: -2.5, opacity: 1, duration: 0.46, ease: "back.out(1.3)" }, 2.66);
  tl.fromTo("#s1-callout", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.50, ease: "power3.out" }, 2.68);
  tl.fromTo("#s1-tag1", { scale: 1.48, rotation: -13, opacity: 0 }, { scale: 1, rotation: -3.5, opacity: 1, duration: 0.48, ease: "power4.out" }, 2.80);
  tl.fromTo("#s1-wm-2", { scale: 0.72, rotation: 10, opacity: 0 }, { scale: 1, rotation: 2, opacity: 1, duration: 0.46, ease: "back.out(1.3)" }, 2.94);
  // 3.50s - 3.60s: "...và mờ căm như thế này cơ á?"
  tl.fromTo("#s1-lowres", { scale: 1.30, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.48, ease: "power3.out" }, 3.48);
  tl.fromTo("#s1-title-l2", { x: -34, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "power3.out" }, 3.50);
  tl.fromTo("#s1-tag2", { scale: 1.48, rotation: 13, opacity: 0 }, { scale: 1, rotation: 2.5, opacity: 1, duration: 0.48, ease: "power4.out" }, 3.58);
  // Subtle watermark drift during closing hold (ends 4.82s < 4.95s)
  tl.to("#s1-wm-1", { x: 12, y: 5, duration: 0.36, yoyo: true, repeat: 1, ease: "sine.inOut" }, 4.10);
  tl.to("#s1-wm-2", { x: -12, y: -5, duration: 0.36, yoyo: true, repeat: 1, ease: "sine.inOut" }, 4.10);
  `
);

// ============================================================================
// SCENE 02 (4.95s - 11.75s, dur: 6.80s)
// Voice: "Để tôi chỉ cho anh em cách (0.1-1.2s) tải nét căng (1.36s), không dính logo (2.02s),
//         FREE (2.88s), cả video (3.58s), hình ảnh (4.32s) lẫn âm thanh để làm nhạc chuông (5.02s / 5.90s)!"
// ============================================================================
writeScene(
  'scene-02',
  `
  #s2-circle {
    position: absolute; top: -90px; right: -90px; width: 340px; height: 340px;
    border-radius: 50%; background: var(--accent_yellow, #F5C518); border: 5px solid #0F0F0F; z-index: 1;
  }
  #s2-stage {
    position: absolute; top: 140px; left: 56px; right: 56px; bottom: 120px;
    display: flex; flex-direction: column; justify-content: center; gap: 50px;
    align-items: center; text-align: center; z-index: 5;
  }
  #s2-hero-lockup { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 24px; }
  #s2-wordmark { font-size: 132px; line-height: 0.92; letter-spacing: -0.025em; color: #0F0F0F; }
  #s2-sub-bar { background: #0F0F0F; color: var(--accent_yellow, #F5C518); padding: 12px 28px; font-size: 26px; }
  #s2-claim-card {
    width: 100%; background: var(--accent_pink, #F06CA8); border: 5px solid #0F0F0F;
    padding: 40px 32px; display: flex; flex-direction: column; align-items: center; gap: 16px;
  }
  .s2-claim-row { display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap; }
  #s2-claim-3 {
    display: inline-block; background: var(--accent_yellow, #F5C518); color: #0F0F0F;
    border: 4px solid #0F0F0F; padding: 6px 22px; margin-top: 4px;
  }
  #s2-grid { width: 100%; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .s2-card {
    border: 5px solid #0F0F0F; padding: 34px 16px;
    display: flex; flex-direction: column; align-items: center; gap: 18px;
  }
  .s2-icon-box {
    width: 100px; height: 100px; border: 4px solid #0F0F0F; background: #EFE9D9;
    display: flex; align-items: center; justify-content: center;
  }
  `,
  `
  <div class="ground-fill"></div>
  <div id="s2-circle"></div>
  ${chromeHtml('s2', '02 // GIẢI PHÁP MỚI', 'brand_url', 'VIESNAP.VN', 'TẢI ĐA NĂNG · KHÔNG DÍNH WATERMARK', '02')}
  <div id="s2-stage">
    <div id="s2-hero-lockup">
      <div id="s2-kicker" class="cm-kicker">★ CÔNG CỤ WEB TẢI NHANH CHUẨN VIỆT</div>
      <div id="s2-wordmark" class="cm-head" data-var-text="brand_url">VIESNAP.VN</div>
      <div id="s2-sub-bar" class="cm-mono">DÁN LINK LÀ TẢI · KHÔNG CẦN CÀI APP</div>
    </div>
    <div id="s2-claim-card" class="cm-shadow-featured">
      <div class="cm-mono" style="font-size:23px;">CHỈ 1 CÔNG CỤ DUY NHẤT:</div>
      <div class="s2-claim-row cm-head" style="font-size:58px;">
        <span id="s2-claim-1">NÉT CĂNG</span>
        <span id="s2-claim-2">· KO LOGO</span>
      </div>
      <div id="s2-claim-3" class="cm-head" style="font-size:50px;">MIỄN PHÍ 100%</div>
    </div>
    <div id="s2-grid">
      <div id="s2-c1" class="s2-card" style="background:#EFE9D9;">
        <div class="s2-icon-box" style="background:var(--accent_yellow,#F5C518);">
          <svg width="54" height="54" viewBox="0 0 48 48" fill="none" stroke="#0F0F0F" stroke-width="4"><rect x="6" y="10" width="36" height="28"/><polygon points="20,17 32,24 20,31" fill="#0F0F0F"/></svg>
        </div>
        <div class="cm-head" style="font-size:32px;" data-var-text="s2_media1">VIDEO 4K/HD</div>
        <div class="cm-mono" style="font-size:17px;">GIỮ NÉT GỐC</div>
      </div>
      <div id="s2-c2" class="s2-card" style="background:var(--accent_yellow,#F5C518);">
        <div class="s2-icon-box">
          <svg width="54" height="54" viewBox="0 0 48 48" fill="none" stroke="#0F0F0F" stroke-width="4"><rect x="6" y="8" width="36" height="32"/><circle cx="17" cy="19" r="4" fill="#0F0F0F"/><polyline points="8,36 20,24 29,32 35,26 42,34"/></svg>
        </div>
        <div class="cm-head" style="font-size:32px;" data-var-text="s2_media2">HÌNH ẢNH</div>
        <div class="cm-mono" style="font-size:17px;">LÀM HÌNH NỀN</div>
      </div>
      <div id="s2-c3" class="s2-card" style="background:#E4DCC4;">
        <div id="s2-c3-icon" class="s2-icon-box" style="background:var(--accent_pink,#F06CA8);">
          <svg width="54" height="54" viewBox="0 0 48 48" fill="none" stroke="#0F0F0F" stroke-width="4"><path d="M18 35V12l20-4v23"/><circle cx="13" cy="35" r="5" fill="#0F0F0F"/><circle cx="33" cy="31" r="5" fill="#0F0F0F"/></svg>
        </div>
        <div class="cm-head" style="font-size:32px;" data-var-text="s2_media3">NHẠC MP3</div>
        <div class="cm-mono" style="font-size:17px;">LÀM NHẠC CHUÔNG</div>
      </div>
    </div>
  </div>
  `,
  `
  // 0.10s - 0.80s: "Để tôi chỉ cho anh em cách..."
  tl.fromTo("#s2-circle", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.60, ease: "power3.out" }, 0.10);
  tl.fromTo("#s2-kicker", { y: -22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power2.out" }, 0.12);
  tl.fromTo("#s2-wordmark", { scale: 1.24, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.58, ease: "power3.out" }, 0.38);
  tl.fromTo("#s2-sub-bar", { scaleX: 0.4, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.50, ease: "circ.out" }, 0.78);
  // 1.34s: "...tải nét căng..."
  tl.fromTo("#s2-claim-card", { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.52, ease: "power3.out" }, 1.22);
  tl.fromTo("#s2-claim-1", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "back.out(1.3)" }, 1.34);
  // 2.00s: "...không dính logo..."
  tl.fromTo("#s2-claim-2", { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 2.00);
  // 2.86s: "...FREE..."
  tl.fromTo("#s2-claim-3", { scale: 1.32, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.50, ease: "power4.out" }, 2.86);
  // 3.56s: "...cả video..."
  tl.fromTo("#s2-c1", { y: 36, scale: 0.88, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 3.56);
  // 4.30s: "...hình ảnh..."
  tl.fromTo("#s2-c2", { y: 36, scale: 0.88, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 4.30);
  // 5.00s: "...lẫn âm thanh để anh em làm nhạc chuông (5.90s) luôn nhá!"
  tl.fromTo("#s2-c3", { y: 36, scale: 0.88, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 5.00);
  tl.to("#s2-c3-icon", { scale: 1.14, rotation: -6, duration: 0.24, yoyo: true, repeat: 1, ease: "sine.inOut" }, 5.88);
  tl.to("#s2-circle", { scale: 1.05, duration: 0.70, yoyo: true, repeat: 3, ease: "sine.inOut" }, 3.60);
  `
);

// ============================================================================
// SCENE 03 (11.75s - 21.20s, dur: 9.45s)
// Voice: "Rồi anh em cứ vào video bất kỳ (0.1-1.5s), chọn chia sẻ sao chép liên kết (1.65s / 2.35s),
//         xong mở web VieSnap lên (3.45s), dán vào đây (4.72s), ấn nút tải video HD (5.65s)... ấn tải thế là xong (8.05s)!"
// ============================================================================
writeScene(
  'scene-03',
  `
  #s3-stage {
    position: absolute; top: 126px; left: 56px; right: 56px; bottom: 112px;
    display: flex; flex-direction: column; justify-content: center; gap: 28px;
  }
  #s3-top { display: flex; flex-direction: column; gap: 18px; }
  #s3-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .s3-step { border: 5px solid #0F0F0F; padding: 20px 18px 22px; display: flex; flex-direction: column; gap: 8px; }
  .s3-num { font-size: 62px; line-height: 0.92; }
  .s3-lbl { font-size: 27px; }
  `,
  `
  <div class="ground-fill"></div>
  ${chromeHtml('s3', '03 // HƯỚNG DẪN 3 BƯỚC', 'brand_url', 'VIESNAP.VN', 'THAO TÁC THỰC TẾ TRÊN ĐIỆN THOẠI', '03')}
  <div id="s3-stage">
    <div id="s3-top">
      <div id="s3-kicker-row" style="display:flex;align-items:center;justify-content:space-between;">
        <div class="cm-kicker">THAO TÁC SIÊU ĐƠN GIẢN</div>
        <div class="cm-mono" style="font-size:20px;">CHỈ MẤT ~3 GIÂY</div>
      </div>
      <div id="s3-head" class="cm-head" style="font-size:48px;" data-var-text="s3_headline">SAO CHÉP ➔ DÁN LINK ➔ TẢI NGAY</div>
      <div id="s3-steps">
        <div id="s3-st1" class="s3-step" style="background:#EFE9D9;">
          <div class="cm-head s3-num">01</div>
          <div class="cm-head s3-lbl" data-var-text="s3_step1">SAO CHÉP LINK</div>
          <div class="cm-mono" style="font-size:16px;">NÚT CHIA SẺ APP</div>
        </div>
        <div id="s3-st2" class="s3-step" style="background:var(--accent_yellow,#F5C518);">
          <div class="cm-head s3-num">02</div>
          <div class="cm-head s3-lbl" data-var-text="s3_step2">DÁN VÀO WEB</div>
          <div class="cm-mono" style="font-size:16px;">MỞ VIESNAP.VN</div>
        </div>
        <div id="s3-st3" class="s3-step" style="background:var(--accent_green,#1F8A4C);color:#EFE9D9;">
          <div class="cm-head s3-num">03</div>
          <div class="cm-head s3-lbl" data-var-text="s3_step3">BẤM TẢI HD</div>
          <div class="cm-mono" style="font-size:16px;background:#0F0F0F;color:#EFE9D9;padding:2px 8px;align-self:flex-start;">LƯU VỀ MÁY</div>
        </div>
      </div>
    </div>
    <div id="s3-browser" class="cm-browser cm-shadow-featured">
      <div class="cm-browser-bar">
        <div class="cm-browser-dots"><span class="cm-bdot" style="background:#F06CA8;"></span><span class="cm-bdot" style="background:#F5C518;"></span><span class="cm-bdot" style="background:#1F8A4C;"></span></div>
        <div class="cm-browser-url">https://viesnap.vn</div>
        <div class="cm-browser-status">● DEMO THẬT</div>
      </div>
      <div class="cm-video-viewport" style="height:1060px;">
        <video id="s3-vid" src="assets/broll-s3.mp4" muted playsinline data-start="0" data-duration="9.45"></video>
      </div>
    </div>
  </div>
  `,
  `
  // 0.12s - 0.62s: "Rồi anh em cứ vào video bất kỳ..."
  tl.fromTo("#s3-kicker-row", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power2.out" }, 0.12);
  tl.fromTo("#s3-browser", { y: 44, scale: 0.96, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.58, ease: "power3.out" }, 0.24);
  tl.fromTo("#s3-head", { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "circ.out" }, 0.62);
  // 1.64s: "...chọn Chia sẻ, Sao chép liên kết..."
  tl.fromTo("#s3-st1", { y: 32, scale: 0.90, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 1.64);
  tl.to("#s3-st1", { y: -8, scale: 1.04, duration: 0.20, yoyo: true, repeat: 1, ease: "power2.out" }, 2.34);
  // 3.44s: "...xong mở web VieSnap lên, dán vào đây (4.70s)..."
  tl.fromTo("#s3-st2", { y: 32, scale: 0.90, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 3.44);
  tl.to("#s3-st2", { y: -8, scale: 1.04, duration: 0.20, yoyo: true, repeat: 1, ease: "power2.out" }, 4.70);
  // 5.64s: "...ấn nút tải video HD hoặc là tải âm thanh..."
  tl.fromTo("#s3-st3", { y: 32, scale: 0.90, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 5.64);
  // 8.02s: "...anh em ấn tải, thế là xong!" (ends 8.62s < 9.45s)
  ["#s3-st1", "#s3-st2", "#s3-st3"].forEach((sel, i) => {
    tl.to(sel, { y: -6, duration: 0.22, yoyo: true, repeat: 1, ease: "sine.inOut" }, 8.02 + i * 0.08);
  });
  `
);

// ============================================================================
// SCENE 04 (21.20s - 26.35s, dur: 5.15s)
// Voice: "Đây! Thành quả là chúng ta có một cái video (0.1-1.3s) với độ phân giải cao, rất nét (1.42s)
//         và không hề dính logo (2.72s) TikTok (3.54s) một tí nào!"
// ============================================================================
writeScene(
  'scene-04',
  `
  #s4-stage {
    position: absolute; top: 126px; left: 56px; right: 56px; bottom: 112px;
    display: flex; flex-direction: column; justify-content: center; gap: 28px;
  }
  #s4-stats { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 20px; }
  .s4-cell { border: 5px solid #0F0F0F; padding: 26px 26px; display: flex; flex-direction: column; gap: 8px; }
  #s4-badge {
    position: absolute; bottom: 52px; right: 52px; background: var(--accent_pink, #F06CA8);
    color: #0F0F0F; border: 5px solid #0F0F0F; padding: 16px 26px; z-index: 10;
  }
  `,
  `
  <div class="ground-fill"></div>
  ${chromeHtml('s4', '04 // BẰNG CHỨNG KẾT QUẢ', 'brand_url', 'VIESNAP.VN', 'KIỂM CHỨNG FILE MP4 TẢI VỀ', '04')}
  <div id="s4-stage">
    <div style="display:flex;flex-direction:column;gap:18px;">
      <div id="s4-kicker" class="cm-kicker" style="align-self:flex-start;">✓ THÀNH QUẢ TẢI VỀ MÁY</div>
      <div id="s4-stats">
        <div id="s4-c1" class="s4-cell" style="background:var(--accent_yellow,#F5C518);">
          <div class="cm-head" style="font-size:64px;line-height:0.96;" data-var-text="stat_hd">FULL HD / 4K</div>
          <div class="cm-mono" style="font-size:20px;">ĐỘ PHÂN GIẢI CAO · RẤT NÉT</div>
        </div>
        <div id="s4-c2" class="s4-cell" style="background:var(--accent_green,#1F8A4C);color:#EFE9D9;">
          <div class="cm-head" style="font-size:64px;line-height:0.96;" data-var-text="stat_logo">0 LOGO</div>
          <div class="cm-mono" style="font-size:20px;background:#0F0F0F;color:#EFE9D9;padding:2px 10px;align-self:flex-start;">SẠCH WATERMARK</div>
        </div>
      </div>
    </div>
    <div id="s4-browser" class="cm-browser cm-shadow-featured" style="position:relative;">
      <div class="cm-browser-bar">
        <div class="cm-browser-dots"><span class="cm-bdot" style="background:#1F8A4C;"></span><span class="cm-bdot"></span></div>
        <div class="cm-browser-url">viesnap.vn_tiktok_HD.mp4</div>
        <div class="cm-browser-status" style="background:#1F8A4C;color:#EFE9D9;">✓ NÉT CĂNG</div>
      </div>
      <div class="cm-video-viewport" style="height:1180px;">
        <video id="s4-vid" src="assets/broll-s4.mp4" muted playsinline data-start="0" data-duration="5.15"></video>
        <div id="s4-badge" class="cm-head" style="font-size:32px;">✓ SẠCH BÓNG LOGO TIKTOK</div>
      </div>
    </div>
  </div>
  `,
  `
  // 0.12s: "Đây! Thành quả là chúng ta có một cái video..."
  tl.fromTo("#s4-kicker", { x: -36, opacity: 0 }, { x: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 0.12);
  tl.fromTo("#s4-browser", { y: 44, opacity: 0 }, { y: 0, opacity: 1, duration: 0.58, ease: "power3.out" }, 0.24);
  // 1.40s: "...với độ phân giải cao, rất nét..."
  tl.fromTo("#s4-c1", { x: -58, opacity: 0 }, { x: 0, opacity: 1, duration: 0.56, ease: "circ.out" }, 1.40);
  // 2.70s: "...và không hề dính logo..."
  tl.fromTo("#s4-c2", { x: 58, opacity: 0 }, { x: 0, opacity: 1, duration: 0.56, ease: "circ.out" }, 2.70);
  // 3.52s: "...TikTok một tí nào!"
  tl.fromTo("#s4-badge", { scale: 1.28, rotation: -12, opacity: 0 }, { scale: 1, rotation: -4, opacity: 1, duration: 0.50, ease: "power4.out" }, 3.52);
  `
);

// ============================================================================
// SCENE 05 (26.35s - 35.85s, dur: 9.50s)
// Voice: "Các bạn cũng có thể áp dụng cách này (0.1-1.4s) để có thể tải ảnh về làm hình nền (1.58s),
//         hoặc là tải âm thanh trên TikTok (3.18s) về làm nhạc chuông (4.65s)...
//         Tất cả đã được tích hợp sẵn ở bên trong VieSnap (6.26s) vậy nên dùng rất tiện!"
// ============================================================================
writeScene(
  'scene-05',
  `
  #s5-stage {
    position: absolute; top: 126px; left: 56px; right: 56px; bottom: 112px;
    display: flex; flex-direction: column; justify-content: center; gap: 26px;
  }
  #s5-cards { display: flex; flex-direction: column; gap: 16px; }
  .s5-feat {
    border: 5px solid #0F0F0F; padding: 20px 26px;
    display: flex; align-items: center; justify-content: space-between; gap: 20px;
  }
  .s5-wave { display: flex; align-items: flex-end; gap: 6px; height: 52px; }
  .s5-bar { width: 10px; background: #0F0F0F; transform-origin: 50% 100%; }
  `,
  `
  <div class="ground-fill"></div>
  ${chromeHtml('s5', '05 // HÌNH NỀN & NHẠC CHUÔNG', 'brand_url', 'VIESNAP.VN', 'TÍCH HỢP ALL-IN-ONE TRONG 1 WEB', '05')}
  <div id="s5-stage">
    <div id="s5-cards">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div id="s5-kicker" class="cm-kicker">KHÔNG CHỈ RIÊNG VIDEO</div>
        <div id="s5-allinone" class="cm-mono" style="font-size:20px;background:#0F0F0F;color:#F5C518;padding:8px 16px;border:3px solid #0F0F0F;">✓ TÍCH HỢP SẴN ALL-IN-ONE</div>
      </div>
      <div id="s5-f1" class="s5-feat" style="background:var(--accent_pink,#F06CA8);">
        <div>
          <div class="cm-mono" style="font-size:19px;">TÍNH NĂNG 01 // SLIDE PHOTO</div>
          <div class="cm-head" style="font-size:38px;margin-top:6px;" data-var-text="s5_feat1">TẢI ẢNH NÉT ➔ LÀM HÌNH NỀN</div>
        </div>
        <svg width="64" height="64" viewBox="0 0 48 48" fill="none" stroke="#0F0F0F" stroke-width="4"><rect x="6" y="6" width="36" height="36" fill="#EFE9D9"/><circle cx="17" cy="17" r="4" fill="#0F0F0F"/><path d="M8 36l11-11 9 8 6-6 8 9"/></svg>
      </div>
      <div id="s5-f2" class="s5-feat" style="background:var(--accent_yellow,#F5C518);">
        <div>
          <div class="cm-mono" style="font-size:19px;">TÍNH NĂNG 02 // EXTRACT MP3</div>
          <div class="cm-head" style="font-size:38px;margin-top:6px;" data-var-text="s5_feat2">TẢI ÂM THANH ➔ NHẠC CHUÔNG</div>
        </div>
        <div class="s5-wave">
          <span class="s5-bar" style="height:22px;"></span>
          <span class="s5-bar" style="height:44px;"></span>
          <span class="s5-bar" style="height:30px;"></span>
          <span class="s5-bar" style="height:52px;"></span>
          <span class="s5-bar" style="height:36px;"></span>
          <span class="s5-bar" style="height:18px;"></span>
        </div>
      </div>
    </div>
    <div id="s5-browser" class="cm-browser cm-shadow-featured">
      <div class="cm-browser-bar">
        <div class="cm-browser-dots"><span class="cm-bdot" style="background:#F06CA8;"></span><span class="cm-bdot" style="background:#F5C518;"></span></div>
        <div class="cm-browser-url">viesnap.vn // ẢNH SLIDE &amp; MP3</div>
        <div class="cm-browser-status">MP3 + PHOTO</div>
      </div>
      <div class="cm-video-viewport" style="height:1040px;">
        <video id="s5-vid" src="assets/broll-s5.mp4" muted playsinline data-start="0" data-duration="9.50"></video>
      </div>
    </div>
  </div>
  `,
  `
  // 0.12s: "Các bạn cũng có thể áp dụng cách này..."
  tl.fromTo("#s5-kicker", { x: -32, opacity: 0 }, { x: 0, opacity: 1, duration: 0.48, ease: "power2.out" }, 0.12);
  tl.fromTo("#s5-browser", { y: 44, opacity: 0 }, { y: 0, opacity: 1, duration: 0.58, ease: "power3.out" }, 0.24);
  // 1.56s: "...để có thể tải ảnh về làm hình nền này..."
  tl.fromTo("#s5-f1", { x: -68, opacity: 0 }, { x: 0, opacity: 1, duration: 0.58, ease: "power3.out" }, 1.56);
  // 3.16s: "...hoặc là tải âm thanh ở trên TikTok về làm nhạc chuông (4.64s)..."
  tl.fromTo("#s5-f2", { x: 68, opacity: 0 }, { x: 0, opacity: 1, duration: 0.58, ease: "power3.out" }, 3.16);
  gsap.utils.toArray(".s5-bar").forEach((bar, i) => {
    tl.to(bar, { scaleY: i % 2 === 0 ? 1.45 : 0.55, duration: 0.34, yoyo: true, repeat: 11, ease: "sine.inOut" }, 4.62 + i * 0.04);
  });
  // 6.24s: "Tất cả đã được tích hợp sẵn ở bên trong VieSnap rồi, dùng rất tiện!"
  tl.fromTo("#s5-allinone", { scale: 1.28, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.52, ease: "back.out(1.4)" }, 6.24);
  `
);

// ============================================================================
// SCENE 06 (35.85s - 40.60s, dur: 4.75s)
// Voice: "Ngoài TikTok ra (0.24s) thì VieSnap cũng hỗ trợ (0.92s) rất là nhiều những cái nền tảng khác nhau (1.78-2.70s)
//         để cho các bạn có thể thoải mái sử dụng (3.34s)."
// ============================================================================
writeScene(
  'scene-06',
  `
  #s6-stage {
    position: absolute; top: 132px; left: 56px; right: 56px; bottom: 116px;
    display: flex; flex-direction: column; justify-content: center; gap: 40px;
  }
  #s6-hub {
    background: var(--accent_pink, #F06CA8); border: 5px solid #0F0F0F;
    padding: 32px 34px; display: flex; align-items: center; justify-content: space-between;
  }
  #s6-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; }
  .s6-plat {
    border: 5px solid #0F0F0F; padding: 38px 28px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .s6-p-name { font-size: 46px; }
  .s6-p-idx {
    font-family: "JetBrains Mono", monospace; font-size: 22px; font-weight: 800;
    padding: 6px 12px; border: 3px solid #0F0F0F; background: #EFE9D9;
  }
  #s6-more {
    background: #0F0F0F; color: #EFE9D9; border: 5px solid #0F0F0F;
    padding: 28px 30px; display: flex; align-items: center; justify-content: space-between;
  }
  `,
  `
  <div class="ground-fill"></div>
  ${chromeHtml('s6', '06 // HỆ SINH THÁI HỖ TRỢ', 'brand_url', 'VIESNAP.VN', 'HỖ TRỢ ĐẦY ĐỦ MỌI ĐỊNH DẠNG', '06')}
  <div id="s6-stage">
    <div style="display:flex;flex-direction:column;align-items:flex-start;gap:20px;">
      <div id="s6-kicker" class="cm-kicker">KHÔNG CHỈ RIÊNG TIKTOK</div>
      <div id="s6-head" class="cm-head" style="font-size:74px;">CÂN MỌI NỀN TẢNG<br/>MẠNG XÃ HỘI!</div>
    </div>
    <div id="s6-hub" class="cm-shadow-featured">
      <div>
        <div class="cm-mono" style="font-size:20px;">TRUNG TÂM XỬ LÝ LINK ĐA NĂNG</div>
        <div class="cm-head" style="font-size:52px;margin-top:6px;">VIESNAP.VN HUB</div>
      </div>
      <div class="cm-head" style="font-size:54px;background:#0F0F0F;color:#F5C518;padding:10px 22px;">7+</div>
    </div>
    <div id="s6-grid">
      <div id="s6-p1" class="s6-plat" style="background:var(--accent_yellow,#F5C518);">
        <span class="cm-head s6-p-name">TIKTOK</span><span class="s6-p-idx">01</span>
      </div>
      <div id="s6-p2" class="s6-plat" style="background:#EFE9D9;">
        <span class="cm-head s6-p-name">DOUYIN</span><span class="s6-p-idx">02</span>
      </div>
      <div id="s6-p3" class="s6-plat" style="background:#E4DCC4;">
        <span class="cm-head s6-p-name">FACEBOOK</span><span class="s6-p-idx">03</span>
      </div>
      <div id="s6-p4" class="s6-plat" style="background:var(--accent_pink,#F06CA8);">
        <span class="cm-head s6-p-name">INSTAGRAM</span><span class="s6-p-idx">04</span>
      </div>
      <div id="s6-p5" class="s6-plat" style="background:#EFE9D9;">
        <span class="cm-head s6-p-name">THREADS</span><span class="s6-p-idx">05</span>
      </div>
      <div id="s6-p6" class="s6-plat" style="background:var(--accent_yellow,#F5C518);">
        <span class="cm-head s6-p-name">PINTEREST</span><span class="s6-p-idx">06</span>
      </div>
    </div>
    <div id="s6-more">
      <span class="cm-head" style="font-size:32px;color:var(--accent_yellow,#F5C518);">+ XIAOHONGSHU · REELS · STORY</span>
      <span class="cm-mono" style="font-size:20px;">✓ THOẢI MÁI DÙNG</span>
    </div>
  </div>
  `,
  `
  // 0.10s - 0.24s: "Ngoài TikTok ra..."
  tl.fromTo("#s6-kicker", { x: -32, opacity: 0 }, { x: 0, opacity: 1, duration: 0.44, ease: "power2.out" }, 0.10);
  tl.fromTo("#s6-p1", { y: 26, scale: 0.90, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.48, ease: "back.out(1.25)" }, 0.24);
  // 0.90s: "...thì VieSnap cũng hỗ trợ..."
  tl.fromTo("#s6-hub", { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.52, ease: "power3.out" }, 0.90);
  tl.fromTo("#s6-head", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.50, ease: "circ.out" }, 1.12);
  // 1.78s - 2.70s: "...rất là nhiều những cái nền tảng khác nhau..."
  ["#s6-p2", "#s6-p3", "#s6-p4", "#s6-p5", "#s6-p6"].forEach((sel, i) => {
    tl.fromTo(sel, { y: 26, scale: 0.90, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.48, ease: "back.out(1.25)" }, 1.78 + i * 0.23);
  });
  // 3.32s: "...để cho các bạn có thể thoải mái sử dụng."
  tl.fromTo("#s6-more", { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.50, ease: "power3.out" }, 3.32);
  `
);

// ============================================================================
// SCENE 07 (40.60s - 50.10s, dur: 9.50s)
// Voice: "Mà anh em đọc cái tên web cũng như là nhìn cái giao diện nó quen quen đúng không? (0.1-2.6s)
//         Đúng rồi! (2.75s) Bởi vì đây là công cụ do người Việt làm ra (3.75s),
//         vậy nên là cái trải nghiệm sử dụng (5.92-6.60s) không thua kém gì so với cả hàng của thế giới (7.26-8.16s)!"
// ============================================================================
writeScene(
  'scene-07',
  `
  #s7-stage {
    position: absolute; top: 132px; left: 56px; right: 56px; bottom: 116px;
    display: flex; flex-direction: column; justify-content: center; gap: 44px;
  }
  #s7-ledger { width: 100%; border: 5px solid #0F0F0F; background: #E4DCC4; }
  .s7-row { display: grid; grid-template-columns: 0.88fr 1.02fr 1.3fr; border-bottom: 4px solid #0F0F0F; }
  .s7-row:last-child { border-bottom: none; }
  .s7-head-row { background: #0F0F0F; color: #EFE9D9; }
  .s7-cell {
    padding: 32px 22px; border-right: 4px solid #0F0F0F;
    display: flex; flex-direction: column; justify-content: center;
  }
  .s7-cell:last-child { border-right: none; }
  .s7-win { background: var(--accent_green, #1F8A4C); color: #EFE9D9; }
  #s7-banner {
    background: var(--accent_yellow, #F5C518); border: 5px solid #0F0F0F;
    padding: 28px 32px; display: flex; align-items: center; justify-content: space-between;
  }
  `,
  `
  <div class="ground-fill"></div>
  ${chromeHtml('s7', '07 // CÔNG CỤ THUẦN VIỆT', 'brand_url', 'VIESNAP.VN', 'DO CHÍNH KỸ SƯ VIỆT NAM XÂY DỰNG', '07')}
  <div id="s7-stage">
    <div style="display:flex;flex-direction:column;align-items:flex-start;gap:20px;">
      <div id="s7-kicker" class="cm-kicker">${VN_FLAG_SVG}SẢN PHẨM CÔNG NGHỆ VIỆT NAM</div>
      <div class="cm-head" style="font-size:74px;">
        <span id="s7-head-l1" style="display:block;">CÔNG CỤ VIỆT,</span>
        <span id="s7-head-l2" style="display:block;color:var(--accent_orange,#E85A1F);">ĐẲNG CẤP QUỐC TẾ!</span>
      </div>
    </div>
    <div id="s7-ledger" class="cm-shadow-featured">
      <div class="s7-row s7-head-row">
        <div class="s7-cell cm-mono" style="font-size:21px;">TIÊU CHÍ</div>
        <div class="s7-cell cm-mono" style="font-size:21px;color:#F06CA8;">CÔNG CỤ KHÁC</div>
        <div class="s7-cell cm-mono" style="font-size:21px;color:#F5C518;">★ VIESNAP.VN</div>
      </div>
      <div id="s7-r1" class="s7-row">
        <div class="s7-cell cm-head" style="font-size:27px;">GIAO DIỆN</div>
        <div class="s7-cell" style="font-size:24px;font-weight:700;">Rối mắt, dịch máy</div>
        <div class="s7-cell s7-win cm-head" style="font-size:27px;">✓ THUẦN VIỆT MƯỢT</div>
      </div>
      <div id="s7-r2" class="s7-row">
        <div class="s7-cell cm-head" style="font-size:27px;">ĐỘ NÉT</div>
        <div class="s7-cell" style="font-size:24px;font-weight:700;">Hay bị bóp 720p</div>
        <div class="s7-cell s7-win cm-head" style="font-size:27px;">✓ GIỮ GỐC 4K / HD</div>
      </div>
      <div id="s7-r3" class="s7-row">
        <div class="s7-cell cm-head" style="font-size:27px;">CÀI ĐẶT</div>
        <div class="s7-cell" style="font-size:24px;font-weight:700;">Ép cài App / Login</div>
        <div class="s7-cell s7-win cm-head" style="font-size:27px;">✓ MỞ WEB DÙNG NGAY</div>
      </div>
      <div id="s7-r4" class="s7-row">
        <div class="s7-cell cm-head" style="font-size:27px;">TỐC ĐỘ</div>
        <div class="s7-cell" style="font-size:24px;font-weight:700;">Đợi hàng chờ lâu</div>
        <div class="s7-cell s7-win cm-head" style="font-size:27px;">✓ SIÊU NHANH QUỐC TẾ</div>
      </div>
    </div>
    <div id="s7-banner">
      <div>
        <div class="cm-mono" style="font-size:19px;">TƯƠNG THÍCH MỌI THIẾT BỊ</div>
        <div class="cm-head" style="font-size:38px;margin-top:6px;">IPHONE · ANDROID · PC · MACBOOK</div>
      </div>
      <div class="cm-head" style="font-size:46px;border:4px solid #0F0F0F;background:#EFE9D9;padding:8px 20px;">100%</div>
    </div>
  </div>
  `,
  `
  // 0.18s - 1.34s: "Mà anh em đọc cái tên web cũng như là nhìn cái giao diện nó quen quen đúng không?"
  tl.fromTo("#s7-ledger", { y: 30, scale: 0.96, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.56, ease: "power3.out" }, 0.18);
  tl.fromTo("#s7-r1", { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "power3.out" }, 1.34);
  // 2.74s: "Đúng rồi!" -> 3.74s: "Bởi vì đây là công cụ do người Việt làm ra..."
  tl.fromTo("#s7-kicker", { x: -38, opacity: 0 }, { x: 0, opacity: 1, duration: 0.48, ease: "circ.out" }, 2.74);
  tl.fromTo("#s7-head-l1", { scale: 1.20, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.54, ease: "power3.out" }, 3.74);
  // 5.92s - 6.60s: "...vậy nên là cái trải nghiệm sử dụng..."
  tl.fromTo("#s7-r2", { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "power3.out" }, 5.92);
  tl.fromTo("#s7-r3", { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "power3.out" }, 6.60);
  // 7.26s - 8.16s: "...không thua kém gì so với cả hàng của thế giới!"
  tl.fromTo("#s7-head-l2", { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 7.26);
  tl.fromTo("#s7-r4", { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "power3.out" }, 7.44);
  tl.fromTo("#s7-banner", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "circ.out" }, 8.16);
  `
);

// ============================================================================
// SCENE 08 (50.10s - 57.70s, dur: 7.60s)
// Voice: "Thậm chí là còn hơn luôn, bởi vì web này nhá: (0.1-1.8s)
//         FREE (1.84s) và không hề có bất kỳ một cái quảng cáo nào bên trong giao diện web (3.14s),
//         vậy nên là dùng nó sướng cực kỳ các bạn ạ (5.54s)!"
// ============================================================================
writeScene(
  'scene-08',
  `
  #s8-stage {
    position: absolute; top: 132px; left: 56px; right: 56px; bottom: 116px;
    display: flex; flex-direction: column; justify-content: center; gap: 44px;
  }
  #s8-stack { display: flex; flex-direction: column; gap: 28px; }
  .s8-stat-card {
    border: 5px solid #0F0F0F; padding: 42px 38px;
    display: flex; align-items: center; justify-content: space-between; gap: 24px;
  }
  .s8-big { font-size: 94px; line-height: 0.94; }
  .s8-desc { font-size: 32px; margin-top: 12px; }
  .s8-icon-badge {
    width: 152px; height: 152px; border: 5px solid #0F0F0F; background: #EFE9D9;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  `,
  `
  <div class="ground-fill"></div>
  ${chromeHtml('s8', '08 // 3 ĐẶC QUYỀN VƯỢT TRỘI', 'brand_url', 'VIESNAP.VN', 'MIỄN PHÍ · SẠCH QUẢNG CÁO · SIÊU TỐC', '08')}
  <div id="s8-stage">
    <div style="text-align:center;display:flex;flex-direction:column;align-items:center;gap:18px;">
      <div id="s8-kicker" class="cm-kicker">TRẢI NGHIỆM HƠN CẢ MONG ĐỢI</div>
      <div id="s8-head" class="cm-head" style="font-size:66px;">MIỄN PHÍ &amp; SẠCH BÓNG<br/>QUẢNG CÁO RÁC!</div>
    </div>
    <div id="s8-stack">
      <div id="s8-c1" class="s8-stat-card" style="background:var(--accent_green,#1F8A4C);color:#EFE9D9;">
        <div>
          <div class="cm-head s8-big" data-var-text="stat_free">0Đ FREE</div>
          <div class="cm-head s8-desc">KHÔNG GIỚI HẠN LƯỢT TẢI</div>
          <div class="cm-mono" style="font-size:19px;background:#0F0F0F;color:#EFE9D9;padding:3px 10px;display:inline-block;margin-top:8px;">HOÀN TOÀN MIỄN PHÍ TRỌN ĐỜI</div>
        </div>
        <div class="s8-icon-badge" style="color:#0F0F0F;">
          <span class="cm-head" style="font-size:48px;">FREE</span>
        </div>
      </div>
      <div id="s8-c2" class="s8-stat-card cm-shadow-featured" style="background:var(--accent_pink,#F06CA8);">
        <div>
          <div class="cm-head s8-big" data-var-text="stat_ads">0 ADS</div>
          <div class="cm-head s8-desc">KHÔNG QUẢNG CÁO LÀM PHIỀN</div>
          <div class="cm-mono" style="font-size:19px;margin-top:8px;">KHÔNG NHẢY POPUP · KHÔNG CHUYỂN TAB LẠ</div>
        </div>
        <div class="s8-icon-badge" style="background:var(--accent_yellow,#F5C518);">
          <svg width="92" height="92" viewBox="0 0 64 64" fill="none" stroke="#0F0F0F" stroke-width="5"><rect x="8" y="14" width="48" height="36" fill="#EFE9D9"/><text x="15" y="40" font-family="monospace" font-weight="900" font-size="22" fill="#0F0F0F" stroke="none">ADS</text><line id="s8-ads-slash" x1="6" y1="56" x2="58" y2="8" stroke="#E85A1F" stroke-width="7"/></svg>
        </div>
      </div>
      <div id="s8-c3" class="s8-stat-card" style="background:var(--accent_yellow,#F5C518);">
        <div>
          <div class="cm-head s8-big" data-var-text="stat_speed">SIÊU TỐC</div>
          <div class="cm-head s8-desc">DÙNG CỰC SƯỚNG · TỨC THÌ</div>
          <div class="cm-mono" style="font-size:19px;margin-top:8px;">AN TOÀN · KHÔNG LƯU LỊCH SỬ CÁ NHÂN</div>
        </div>
        <div class="s8-icon-badge">
          <svg width="84" height="84" viewBox="0 0 48 48" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3.5"><polygon points="26,4 10,26 23,26 20,44 38,20 25,20"/></svg>
        </div>
      </div>
    </div>
  </div>
  `,
  `
  // 0.16s - 0.62s: "Thậm chí là còn hơn luôn, bởi vì web này nhá:"
  tl.fromTo("#s8-kicker", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power2.out" }, 0.16);
  tl.fromTo("#s8-head", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.56, ease: "power3.out" }, 0.62);
  // 1.84s: "FREE..."
  tl.fromTo("#s8-c1", { x: -76, opacity: 0 }, { x: 0, opacity: 1, duration: 0.58, ease: "power3.out" }, 1.84);
  // 3.14s: "...và không hề có bất kỳ một cái quảng cáo nào..."
  tl.fromTo("#s8-c2", { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.58, ease: "back.out(1.25)" }, 3.14);
  tl.fromTo("#s8-ads-slash", { scale: 0, transformOrigin: "50% 50%", opacity: 0 }, { scale: 1, opacity: 1, duration: 0.42, ease: "power4.out" }, 3.60);
  // 5.54s: "...vậy nên là dùng nó sướng cực kỳ các bạn ạ!"
  tl.fromTo("#s8-c3", { x: 76, opacity: 0 }, { x: 0, opacity: 1, duration: 0.58, ease: "power3.out" }, 5.54);
  `
);

// ============================================================================
// SCENE 09 (57.70s - 66.25s, dur: 8.55s)
// Voice: "Vào website thôi là chúng ta đã thấy (0.1-1.1s) hình ảnh Trống Đồng (1.24s)
//         rồi Bản đồ Việt Nam (2.20s) có đầy đủ Hoàng Sa, Trường Sa (3.28s) là tôi đã ưng rồi!
//         Cộng một công cụ mà chắc chắn là tôi sẽ sử dụng một cách thường xuyên (5.46s)."
// ============================================================================
writeScene(
  'scene-09',
  `
  #s9-stage {
    position: absolute; top: 124px; left: 56px; right: 56px; bottom: 112px;
    display: flex; flex-direction: column; justify-content: center; gap: 28px;
  }
  #s9-pride-card {
    background: var(--accent_yellow, #F5C518); border: 5px solid #0F0F0F;
    padding: 26px 28px; display: flex; align-items: center; justify-content: space-between; gap: 20px;
  }
  #s9-sovereign-bar {
    background: #0F0F0F; color: var(--accent_yellow, #F5C518);
    padding: 10px 18px; margin-top: 12px; display: inline-block; font-size: 27px;
  }
  #s9-stamp {
    position: absolute; bottom: 56px; right: 56px; background: var(--accent_pink, #F06CA8);
    color: #0F0F0F; border: 5px solid #EFE9D9; outline: 5px solid #0F0F0F;
    padding: 18px 26px; z-index: 12;
  }
  `,
  `
  <div class="ground-fill"></div>
  ${chromeHtml('s9', '09 // BẢN SẮC VIỆT NAM', 'brand_url', 'VIESNAP.VN', 'TRỐNG ĐỒNG & BẢN ĐỒ CHỦ QUYỀN', '09')}
  <div id="s9-stage">
    <div id="s9-pride-card" class="cm-shadow-featured">
      <div>
        <div class="cm-mono" style="font-size:19px;">VÀO WEB LÀ ƯNG NGAY TỪ CÁI NHÌN ĐẦU TIÊN:</div>
        <div class="cm-head" style="font-size:37px;margin-top:6px;">
          <span id="s9-title-p1">TRỐNG ĐỒNG</span>
          <span id="s9-title-p2"> &amp; BẢN ĐỒ VIỆT NAM</span>
        </div>
        <div id="s9-sovereign-bar" class="cm-head" data-var-text="s9_sovereign">★ ĐẦY ĐỦ HOÀNG SA · TRƯỜNG SA ★</div>
      </div>
      <div id="s9-drum-box" style="flex-shrink:0;background:#EFE9D9;border:4px solid #0F0F0F;padding:8px;width:118px;height:118px;display:flex;align-items:center;justify-content:center;">
        <svg id="s9-sun" width="96" height="96" viewBox="0 0 100 100" fill="none" stroke="#0F0F0F" stroke-width="4" style="display:block;">
          <circle cx="50" cy="50" r="42"/>
          <circle cx="50" cy="50" r="28"/>
          <polygon points="50,18 55,42 78,32 58,48 82,50 58,52 78,68 55,58 50,82 45,58 22,68 42,52 18,50 42,48 22,32 45,42" fill="#E85A1F" stroke="#0F0F0F" stroke-width="2.5"/>
        </svg>
      </div>
    </div>
    <div id="s9-browser" class="cm-browser" style="position:relative;">
      <div class="cm-browser-bar">
        <div class="cm-browser-dots"><span class="cm-bdot" style="background:#DA251D;"></span><span class="cm-bdot" style="background:#F5C518;"></span></div>
        <div class="cm-browser-url">https://viesnap.vn // GIAO DIỆN THẬT</div>
        <div class="cm-browser-status">★ TỰ HÀO VIỆT NAM</div>
      </div>
      <div class="cm-video-viewport" style="height:1120px;">
        <video id="s9-vid" src="assets/broll-s9.mp4" muted playsinline data-start="0" data-duration="8.55"></video>
        <div id="s9-stamp">
          <div class="cm-head" style="font-size:32px;" data-var-text="s9_stamp">+1 CÔNG CỤ YÊU THÍCH</div>
          <div class="cm-mono" style="font-size:18px;margin-top:4px;">LƯU LẠI DÙNG MỖI NGÀY!</div>
        </div>
      </div>
    </div>
  </div>
  `,
  `
  // 0.14s: "Vào website thôi là chúng ta đã thấy..."
  tl.fromTo("#s9-browser", { y: 46, opacity: 0 }, { y: 0, opacity: 1, duration: 0.58, ease: "power3.out" }, 0.14);
  // 1.20s: "...hình ảnh Trống Đồng..."
  tl.fromTo("#s9-pride-card", { y: -36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "power3.out" }, 1.18);
  tl.fromTo("#s9-drum-box", { scale: 0.72, rotation: -20, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.52, ease: "back.out(1.3)" }, 1.24);
  tl.fromTo("#s9-title-p1", { opacity: 0 }, { opacity: 1, duration: 0.44, ease: "power2.out" }, 1.26);
  tl.to("#s9-sun", { rotation: 80, duration: 6.50, ease: "none" }, 1.80);
  // 2.18s: "...rồi Bản đồ Việt Nam..."
  tl.fromTo("#s9-title-p2", { opacity: 0 }, { opacity: 1, duration: 0.48, ease: "power2.out" }, 2.18);
  // 3.26s: "...có đầy đủ Hoàng Sa, Trường Sa là tôi đã ưng rồi!"
  tl.fromTo("#s9-sovereign-bar", { scale: 0.88, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 3.26);
  // 5.44s: "Cộng một công cụ mà chắc chắn là tôi sẽ sử dụng một cách thường xuyên!"
  tl.fromTo("#s9-stamp", { scale: 1.26, rotation: -12, opacity: 0 }, { scale: 1, rotation: -5.5, opacity: 1, duration: 0.52, ease: "power4.out" }, 5.44);
  `
);

// ============================================================================
// SCENE 10 (66.25s - 75.87s, dur: 9.62s)
// Voice: "Vậy nên với những anh em nào mà thường xuyên tải video ở trên TikTok, hoặc là Douyin này kia các thứ ấy (0.1-4.6s),
//         thì anh em hoàn toàn có thể sử dụng VieSnap nha (4.8-6.8s)!
//         Người Việt Nam (6.95s) ưu tiên dùng hàng Việt Nam (7.72s) anh em ạ!"
// ============================================================================
writeScene(
  'scene-10',
  `
  #s10-stage {
    position: absolute; top: 146px; left: 56px; right: 56px; bottom: 122px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 50px; text-align: center; z-index: 5;
  }
  #s10-url-box {
    background: #EFE9D9; color: #0F0F0F; border: 6px solid #0F0F0F; padding: 32px 48px; width: 100%;
  }
  #s10-platforms {
    background: #0F0F0F; color: var(--accent_yellow, #F5C518);
    border: 4px solid #EFE9D9; padding: 14px 26px; font-size: 21px;
  }
  #s10-signoff { color: #EFE9D9; font-size: 74px; }
  #s10-vn-highlight {
    display: inline-block; background: var(--accent_yellow, #F5C518); color: #0F0F0F;
    border: 5px solid #0F0F0F; padding: 14px 28px; margin-top: 16px; font-size: 54px;
  }
  #s10-stamp {
    width: 310px; height: 310px; background: var(--accent_pink, #F06CA8);
    border: 6px solid #EFE9D9; display: flex; align-items: center; justify-content: center; padding: 18px;
  }
  .s10-ring {
    width: 100%; height: 100%; border: 4px solid #EFE9D9; border-radius: 50%;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 16px; color: #0F0F0F;
  }
  `,
  `
  <div class="ground-green"></div>
  ${chromeHtml('s10', '10 // TRUY CẬP NGAY', 'brand_url', 'VIESNAP.VN', 'NGƯỜI VIỆT ƯU TIÊN DÙNG HÀNG VIỆT', '10', true)}
  <div id="s10-stage">
    <div style="width:100%;display:flex;flex-direction:column;align-items:center;gap:20px;">
      <div id="s10-kicker" class="cm-kicker" style="color:var(--accent_yellow,#F5C518);">${VN_FLAG_SVG}MỞ TRÌNH DUYỆT · DÙNG NGAY LẬP TỨC</div>
      <div id="s10-url-box" class="cm-shadow-ink">
        <div class="cm-mono" style="font-size:22px;">ĐỊA CHỈ WEBSITE CHÍNH THỨC:</div>
        <div class="cm-head" style="font-size:110px;line-height:0.96;margin-top:8px;" data-var-text="brand_url">VIESNAP.VN</div>
      </div>
      <div id="s10-platforms" class="cm-mono">TIKTOK · DOUYIN · FACEBOOK · INSTAGRAM · THREADS · PINTEREST</div>
    </div>
    <div id="s10-slogan-wrap">
      <div id="s10-signoff" class="cm-head" data-var-text="s10_slogan1">NGƯỜI VIỆT NAM</div>
      <div id="s10-vn-highlight" class="cm-head" data-var-text="s10_slogan2">ƯU TIÊN DÙNG HÀNG VIỆT!</div>
    </div>
    <div id="s10-stamp" class="cm-shadow-ink">
      <div class="s10-ring">
        <div class="cm-mono" style="font-size:20px;">KHÔNG LOGO</div>
        <div class="cm-head" style="font-size:44px;line-height:1.02;margin:8px 0;" data-var-text="s10_cta">THỬ NGAY</div>
        <div class="cm-head" style="font-size:30px;background:#0F0F0F;color:#EFE9D9;padding:4px 14px;">100% FREE</div>
      </div>
    </div>
  </div>
  `,
  `
  // 0.18s - 0.38s: Opening Closing Plate anchor
  tl.fromTo("#s10-kicker", { y: -22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power2.out" }, 0.18);
  tl.fromTo("#s10-url-box", { scale: 0.94, y: 24, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.60, ease: "power3.out" }, 0.38);
  // 1.64s: "...thường xuyên tải video ở trên TikTok, hoặc là Douyin này kia các thứ ấy..."
  tl.fromTo("#s10-platforms", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.56, ease: "power3.out" }, 1.64);
  // 5.32s - 5.66s: "...thì anh em hoàn toàn có thể sử dụng VieSnap nha!"
  tl.fromTo("#s10-stamp", { scale: 1.56, rotation: -18, opacity: 0 }, { scale: 1, rotation: -6, opacity: 1, duration: 0.52, ease: "power4.out" }, 5.32);
  tl.to("#s10-url-box", { scale: 1.04, duration: 0.24, yoyo: true, repeat: 1, ease: "sine.inOut" }, 5.66);
  // 6.94s: "Người Việt Nam..."
  tl.fromTo("#s10-signoff", { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.52, ease: "power3.out" }, 6.94);
  // 7.70s: "...ưu tiên dùng hàng Việt Nam anh em ạ!"
  tl.fromTo("#s10-vn-highlight", { scale: 0.86, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.54, ease: "back.out(1.3)" }, 7.70);
  tl.to("#s10-stamp", { scale: 1.04, duration: 0.52, yoyo: true, repeat: 1, ease: "sine.inOut" }, 8.32);
  `
);

// ============================================================================
// 3. UPDATE index.html & STORYBOARD.md WITH EXACT SENTENCE-ALIGNED TIMINGS
// ============================================================================
const VARIABLES = [
  { id: 'brand_url', type: 'string', label: 'Địa chỉ Website', default: 'VIESNAP.VN' },
  { id: 's1_kicker', type: 'string', label: 'Cảnh 1: Nhãn phụ', default: '✕ CÁCH TẢI TRỰC TIẾP KIỂU CŨ' },
  { id: 's1_tag1', type: 'string', label: 'Cảnh 1: Lỗi 1', default: 'DÍNH LOGO' },
  { id: 's1_tag2', type: 'string', label: 'Cảnh 1: Lỗi 2', default: 'MỜ CĂM' },
  { id: 's2_media1', type: 'string', label: 'Cảnh 2: Định dạng 1', default: 'VIDEO 4K/HD' },
  { id: 's2_media2', type: 'string', label: 'Cảnh 2: Định dạng 2', default: 'HÌNH ẢNH' },
  { id: 's2_media3', type: 'string', label: 'Cảnh 2: Định dạng 3', default: 'NHẠC MP3' },
  { id: 's3_headline', type: 'string', label: 'Cảnh 3: Tiêu đề 3 bước', default: 'SAO CHÉP ➔ DÁN LINK ➔ TẢI NGAY' },
  { id: 's3_step1', type: 'string', label: 'Cảnh 3: Bước 1', default: 'SAO CHÉP LINK' },
  { id: 's3_step2', type: 'string', label: 'Cảnh 3: Bước 2', default: 'DÁN VÀO WEB' },
  { id: 's3_step3', type: 'string', label: 'Cảnh 3: Bước 3', default: 'BẤM TẢI HD' },
  { id: 'stat_hd', type: 'string', label: 'Cảnh 4: Chất lượng Video', default: 'FULL HD / 4K' },
  { id: 'stat_logo', type: 'string', label: 'Cảnh 4: Chỉ số Logo', default: '0 LOGO' },
  { id: 's5_feat1', type: 'string', label: 'Cảnh 5: Tính năng Ảnh', default: 'TẢI ẢNH NÉT ➔ LÀM HÌNH NỀN' },
  { id: 's5_feat2', type: 'string', label: 'Cảnh 5: Tính năng Nhạc', default: 'TẢI ÂM THANH ➔ NHẠC CHUÔNG' },
  { id: 'stat_free', type: 'string', label: 'Cảnh 8: Giá sử dụng', default: '0Đ FREE' },
  { id: 'stat_ads', type: 'string', label: 'Cảnh 8: Quảng cáo', default: '0 ADS' },
  { id: 'stat_speed', type: 'string', label: 'Cảnh 8: Tốc độ', default: 'SIÊU TỐC' },
  { id: 's9_sovereign', type: 'string', label: 'Cảnh 9: Chủ quyền biển đảo', default: '★ ĐẦY ĐỦ HOÀNG SA · TRƯỜNG SA ★' },
  { id: 's9_stamp', type: 'string', label: 'Cảnh 9: Con dấu yêu thích', default: '+1 CÔNG CỤ YÊU THÍCH' },
  { id: 's10_slogan1', type: 'string', label: 'Cảnh 10: Khẩu hiệu dòng 1', default: 'NGƯỜI VIỆT NAM' },
  { id: 's10_slogan2', type: 'string', label: 'Cảnh 10: Khẩu hiệu dòng 2', default: 'ƯU TIÊN DÙNG HÀNG VIỆT!' },
  { id: 's10_cta', type: 'string', label: 'Cảnh 10: Nút kêu gọi', default: 'THỬ NGAY' },
  { id: 'bg_cream', type: 'color', label: 'Màu nền giấy kem', default: '#EFE9D9' },
  { id: 'accent_pink', type: 'color', label: 'Màu nhấn Hồng', default: '#F06CA8' },
  { id: 'accent_green', type: 'color', label: 'Màu nhấn Xanh lá', default: '#1F8A4C' },
  { id: 'accent_orange', type: 'color', label: 'Màu bóng cứng Cam', default: '#E85A1F' },
  { id: 'accent_yellow', type: 'color', label: 'Màu nhấn Vàng', default: '#F5C518' }
];

const SCENES = [
  { id: 'scene-01', sfx: 'sfx-s01.wav', start: 0.00,  dur: 4.95, title: '01: Nỗi đau cách tải cũ' },
  { id: 'scene-02', sfx: 'sfx-s02.wav', start: 4.95,  dur: 6.80, title: '02: Màn ra mắt VieSnap.vn' },
  { id: 'scene-03', sfx: 'sfx-s03.wav', start: 11.75, dur: 9.45, title: '03: Quy trình 3 bước siêu tốc' },
  { id: 'scene-04', sfx: 'sfx-s04.wav', start: 21.20, dur: 5.15, title: '04: Bằng chứng Full HD & 0 Logo' },
  { id: 'scene-05', sfx: 'sfx-s05.wav', start: 26.35, dur: 9.50, title: '05: Tải Ảnh nền & Nhạc chuông MP3' },
  { id: 'scene-06', sfx: 'sfx-s06.wav', start: 35.85, dur: 4.75, title: '06: Hệ sinh thái đa nền tảng' },
  { id: 'scene-07', sfx: 'sfx-s07.wav', start: 40.60, dur: 9.50, title: '07: Công cụ Việt · Đẳng cấp Quốc tế' },
  { id: 'scene-08', sfx: 'sfx-s08.wav', start: 50.10, dur: 7.60, title: '08: Đại cảnh 0Đ Free · 0 Ads · Siêu tốc' },
  { id: 'scene-09', sfx: 'sfx-s09.wav', start: 57.70, dur: 8.55, title: '09: Trống Đồng & Bản đồ Hoàng Sa - Trường Sa' },
  { id: 'scene-10', sfx: 'sfx-s10.wav', start: 66.25, dur: 9.62, title: '10: Màn kết Người Việt dùng hàng Việt' }
];

const indexHtml = `<!doctype html>
<html lang="vi" data-composition-variables='${JSON.stringify(VARIABLES)}'>
  <head>
    <meta charset="UTF-8" />
    <title>VieSnap.vn — Illustrated Motion Edition</title>
    ${FONT_LINK}
    ${GSAP_SCRIPT}
    <style>
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background: #0F0F0F;
        overflow: hidden;
      }
      #main {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: var(--bg_cream, #EFE9D9);
      }
      .scene-slot {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <div
      id="main"
      data-composition-id="main"
      data-width="1080"
      data-height="1920"
      data-fps="30"
      data-duration="75.87"
    >
      <audio
        id="voiceover"
        src="assets/voiceover.mp3"
        data-start="0"
        data-duration="75.87"
        data-track-index="0"
        data-volume="1"
      ></audio>

${SCENES.map(s => `      <div
        id="${s.id}"
        class="clip scene-slot"
        data-composition-id="${s.id}"
        data-composition-src="compositions/${s.id}.html"
        data-start="${s.start}"
        data-duration="${s.dur}"
        data-track-index="1"
        data-label="${s.title}"
      ></div>`).join('\n')}

${SCENES.map((s, idx) => `      <audio
        id="sfx-${String(idx + 1).padStart(2, '0')}"
        src="assets/${s.sfx}"
        data-start="${s.start}"
        data-duration="${s.dur}"
        data-track-index="2"
        data-volume="0.38"
      ></audio>`).join('\n')}
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`;

writeFileSync(join(proj, 'index.html'), indexHtml, 'utf8');

const storyboardMd = `---
format: 1080x1920
duration: 75.87s
message: "VieSnap.vn là công cụ thuần Việt giúp tải Video 4K/HD, Ảnh nền và Nhạc chuông MP3 không logo, 100% miễn phí & không quảng cáo từ mọi nền tảng"
arc: "Problem (Cách cũ) → Hero Reveal (VieSnap) → Live 3-Step Demo → HD Proof → Photo & MP3 All-in-One → Multi-Platform Hub → Made in Vietnam → 3-Up Free/No-Ads Grid → Sovereign Map Pride → Closing CTA"
audience: "Người dùng TikTok, Douyin, Facebook, Instagram tại Việt Nam"
mode: collaborative
---

## Frame 1: Nỗi đau cách tải cũ (0.0-4.95s)

- act: Act 1 — Nỗi đau & Giải pháp mới
- scene: Mô phỏng khung video kiểu cũ xuất hiện khi nhắc tải video, tiêu đề CÁCH CŨ, sau đó đóng dấu lần lượt DÍNH LOGO (2.8s) và MỜ CĂM (3.6s) khớp 100% từng chữ.
- duration: 4.95s
- poster: 4.3s
- transition_in: cut
- status: animated
- voiceover: "Ảo vãi! Nhiều anh em còn tải video theo cách cũ để dính logo và mờ căm như thế này cơ á?"
- src: compositions/scene-01.html

Đặt vấn đề trực diện với hiệu ứng mở tuần tự từng cụm từ theo đúng nhịp giọng nói.

## Frame 2: Màn ra mắt giải pháp VieSnap.vn (4.95-11.75s)

- act: Act 1 — Nỗi đau & Giải pháp mới
- scene: Đại cảnh VIESNAP.VN mở đầu câu, lần lượt bung NÉT CĂNG, KO LOGO, MIỄN PHÍ 100%, rồi lần lượt 3 thẻ VIDEO 4K/HD, HÌNH ẢNH, NHẠC MP3 đúng giây đọc từng từ.
- duration: 6.8s
- poster: 11.2s
- transition_in: cut
- status: animated
- voiceover: "Để tôi chỉ cho anh em cách tải nét căng, không dính logo, FREE, cả video, hình ảnh lẫn âm thanh để anh em làm nhạc chuông luôn nhá!"
- src: compositions/scene-02.html

Bung nhận diện thương hiệu và lần lượt 6 điểm nhấn đúng từng nhịp ngắt câu.

## Frame 3: Quy trình 3 bước siêu tốc (11.75-21.2s)

- act: Act 2 — Thao tác thực tế & Thành quả đa năng
- scene: Cửa sổ màn hình 4K đi cùng 3 thẻ bước xuất hiện lần lượt đúng thao tác: 01 SAO CHÉP LINK (+1.64s), 02 DÁN VÀO WEB (+3.44s), 03 BẤM TẢI HD (+5.64s).
- duration: 9.45s
- poster: 19.0s
- transition_in: cut
- status: animated
- voiceover: "Rồi anh em cứ vào video bất kỳ, chọn chia sẻ, sao chép liên kết, xong mở web VieSnap lên, dán vào đây, ấn nút tải video HD hoặc là tải âm thanh, anh em ấn tải thế là xong!"
- src: compositions/scene-03.html

Mỗi bước hướng dẫn chỉ xuất hiện đúng thời điểm người nói đọc tới bước đó.

## Frame 4: Bằng chứng thành quả Full HD & 0 Logo (21.2-26.35s)

- act: Act 2 — Thao tác thực tế & Thành quả đa năng
- scene: Khung phát video thành quả mở ra ở tiếng "Đây!", tiếp theo lần lượt thẻ FULL HD / 4K (+1.4s), thẻ 0 LOGO (+2.7s) và nhãn SẠCH BÓNG LOGO TIKTOK (+3.52s).
- duration: 5.15s
- poster: 25.6s
- transition_in: cut
- status: animated
- voiceover: "Đây! Thành quả là chúng ta có một cái video với độ phân giải cao, rất nét và không hề dính logo TikTok một tí nào!"
- src: compositions/scene-04.html

Chứng minh tuần tự từng cam kết chất lượng khớp từng cụm từ trong câu.

## Frame 5: Tải Ảnh nền & Nhạc chuông MP3 All-in-One (26.35-35.85s)

- act: Act 2 — Thao tác thực tế & Thành quả đa năng
- scene: Cửa sổ demo đi cùng thẻ TẢI ẢNH NÉT (+1.56s), thẻ TẢI ÂM THANH (+3.16s), sóng nhạc nhảy ở chữ "nhạc chuông" (+4.62s) và nhãn TÍCH HỢP SẴN ALL-IN-ONE (+6.24s).
- duration: 9.5s
- poster: 33.8s
- transition_in: cut
- status: animated
- voiceover: "Các bạn cũng có thể áp dụng cách này để có thể tải ảnh về làm hình nền này, hoặc là tải âm thanh ở trên TikTok về làm nhạc chuông cho điện thoại luôn cũng được. Tất cả đã được tích hợp sẵn ở bên trong VieSnap rồi vậy nên là dùng rất là tiện."
- src: compositions/scene-05.html

Trải đều nhịp xuất hiện xuyên suốt 9.5 giây theo đúng 3 vế câu nói.

## Frame 6: Sơ đồ kết nối đa nền tảng (35.85-40.6s)

- act: Act 3 — Sức mạnh & Giá trị thuần Việt
- scene: Mở đầu với thẻ TIKTOK (+0.24s), tiếp nối bằng VIESNAP.VN HUB (+0.90s), rồi lần lượt 5 nền tảng DOUYIN, FACEBOOK, INSTAGRAM, THREADS, PINTEREST (+1.78s..2.70s) và thanh mở rộng (+3.32s).
- duration: 4.75s
- poster: 40.0s
- transition_in: cut
- status: animated
- voiceover: "Ngoài TikTok ra thì VieSnap cũng hỗ trợ rất là nhiều những cái nền tảng khác nhau để cho các bạn có thể thoải mái sử dụng."
- src: compositions/scene-06.html

Thứ tự xuất hiện bám sát câu nói từ TikTok đến VieSnap rồi tỏa ra đa nền tảng.

## Frame 7: Tuyên ngôn Công cụ Việt - Đẳng cấp Quốc tế (40.6-50.1s)

- act: Act 3 — Sức mạnh & Giá trị thuần Việt
- scene: Mở hàng GIAO DIỆN (+1.34s) khi hỏi "giao diện quen quen?", bung nhãn Việt Nam (+2.74s) và CÔNG CỤ VIỆT (+3.74s) khi đáp "Đúng rồi! Do người Việt làm ra", rồi mở các dòng trải nghiệm và ĐẲNG CẤP QUỐC TẾ (+5.92s..8.16s).
- duration: 9.5s
- poster: 49.5s
- transition_in: cut
- status: animated
- voiceover: "Mà anh em đọc cái tên web cũng như là nhìn cái giao diện nó quen quen đúng không? Đúng rồi! Bởi vì đây là công cụ do người Việt làm ra, vậy nên là cái trải nghiệm sử dụng không thua kém gì so với cả hàng của thế giới!"
- src: compositions/scene-07.html

Giữ trọn nhịp hỏi - đáp tự nhiên của người nói, không lộ trước đáp án trên màn hình.

## Frame 8: Đại cảnh 3 trụ cột 0Đ Free · 0 Ads · Siêu tốc (50.1-57.7s)

- act: Act 3 — Sức mạnh & Giá trị thuần Việt
- scene: Lần lượt bung 3 thẻ lớn đúng giây nhấn giọng: 0Đ FREE (+1.84s), 0 ADS gạch chéo popup (+3.14s), và SIÊU TỐC dùng cực sướng (+5.54s).
- duration: 7.6s
- poster: 56.8s
- transition_in: cut
- status: animated
- voiceover: "Thậm chí là còn hơn luôn, bởi vì web này nhá: FREE và không hề có bất kỳ một cái quảng cáo nào bên trong giao diện web, vậy nên là dùng nó sướng cực kỳ các bạn ạ!"
- src: compositions/scene-08.html

Mỗi trụ cột lợi ích xuất hiện đúng từ khoá nhấn mạnh trong giọng đọc.

## Frame 9: Tự hào Trống Đồng & Bản đồ Hoàng Sa - Trường Sa (57.7-66.25s)

- act: Act 4 — Tự hào thương hiệu Việt & Lời kêu gọi
- scene: Mở giao diện web (+0.14s), lần lượt hiện TRỐNG ĐỒNG (+1.24s), BẢN ĐỒ VIỆT NAM (+2.18s), thanh ĐẦY ĐỦ HOÀNG SA · TRƯỜNG SA (+3.26s) và đóng dấu +1 CÔNG CỤ YÊU THÍCH (+5.44s).
- duration: 8.55s
- poster: 64.5s
- transition_in: cut
- status: animated
- voiceover: "Vào website thôi là chúng ta đã thấy hình ảnh Trống Đồng rồi Bản đồ Việt Nam có đầy đủ Hoàng Sa, Trường Sa là tôi đã ưng rồi! Cộng một công cụ mà chắc chắn là tôi sẽ sử dụng một cách thường xuyên."
- src: compositions/scene-09.html

Đỉnh cao cảm xúc được dẫn dắt tuần tự qua 5 nhịp khớp tuyệt đối với lời kể.

## Frame 10: Màn kết Người Việt dùng hàng Việt (66.25-75.87s)

- act: Act 4 — Tự hào thương hiệu Việt & Lời kêu gọi
- scene: Khung VIESNAP.VN trên nền Xanh lá #136636, hiện dải nền tảng TikTok · Douyin (+1.64s), đóng dấu THỬ NGAY · 100% FREE khi nhắc dùng VieSnap (+5.32s), và kết bằng NGƯỜI VIỆT NAM (+6.94s) · ƯU TIÊN DÙNG HÀNG VIỆT! (+7.70s).
- duration: 9.62s
- poster: 74.8s
- transition_in: cut
- status: animated
- voiceover: "Vậy nên với những anh em nào mà thường xuyên tải video ở trên TikTok hoặc là những cái nền tảng khác như kiểu là Douyin này kia các thứ ấy, thì anh em hoàn toàn có thể sử dụng VieSnap nha! Người Việt Nam ưu tiên dùng hàng Việt Nam anh em ạ!"
- src: compositions/scene-10.html

Câu khẩu hiệu kết chỉ bung ra ở giây 73-74 đúng khoảnh khắc người nói hô vang câu chốt.
`;

writeFileSync(join(proj, 'STORYBOARD.md'), storyboardMd, 'utf8');
console.log('Rebuilt all 10 scenes + 10 SFX tracks + index.html + STORYBOARD.md with 100% word-synced progressive reveals!');
