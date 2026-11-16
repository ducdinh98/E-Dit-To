import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { mediaTools } from 'file:///C:/Users/Cong%20Duc/.gemini/config/skills/motion-studio/scripts/lib.mjs';
import { SR, renderEffects, wav } from 'file:///C:/Users/Cong%20Duc/.gemini/config/skills/motion-studio/scripts/sound.js';

const work = 'F:/App nha lam/motion-video-demo/videos/oppo-a7-pro';
const assetsDir = join(work, 'assets');
mkdirSync(assetsDir, { recursive: true });
for (const f of readdirSync(assetsDir)) {
  if (f.startsWith('sfx-s') && f.endsWith('.wav')) unlinkSync(join(assetsDir, f));
}

const sfxDir = 'C:/Users/Cong Duc/.gemini/config/skills/media-use/audio/assets/sfx';
const { ffmpeg } = mediaTools();
const db = (x) => Math.pow(10, x / 20);

function loadSample(filename) {
  const path = join(sfxDir, filename);
  const r = spawnSync(ffmpeg, [
    '-v', 'error',
    '-i', path,
    '-f', 'f32le',
    '-ac', '2',
    '-ar', String(SR),
    'pipe:1'
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
  for (let i = 0; i < totalFrames; i++) {
    L[i] *= scale;
    R[i] *= scale;
  }
  const thresh = db(-38);
  let first = 0;
  for (let i = 0; i < totalFrames; i++) {
    if (Math.max(Math.abs(L[i]), Math.abs(R[i])) >= thresh) {
      first = Math.max(0, i - Math.floor(0.004 * SR));
      break;
    }
  }
  L = L.slice(first);
  R = R.slice(first);
  const fi = Math.min(L.length, Math.floor(0.004 * SR));
  for (let i = 0; i < fi; i++) {
    const g = i / fi;
    L[i] *= g;
    R[i] *= g;
  }
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

function loadSynth(kind, opts = {}, dur = 0.4) {
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

function buildSceneWav(name, durationSec, cues) {
  const n = Math.ceil(durationSec * SR);
  const L = new Float64Array(n);
  const R = new Float64Array(n);
  for (const [sampleName, t, opts] of cues) {
    placeSample(L, R, sampleName, t, opts);
  }
  const ceiling = db(-1.5);
  for (let i = 0; i < n; i++) {
    L[i] = Math.tanh(L[i] / ceiling) * ceiling;
    R[i] = Math.tanh(R[i] / ceiling) * ceiling;
  }
  writeFileSync(join(assetsDir, name), wav([L, R]));
}

// 21 Scene SFX cues locked 1:1 to exact Whisper tl.fromTo(...) timestamps in build-oppo-a7-pro.mjs
const sceneSpecs = [
  ['sfx-s01.wav', 12.00, [
    ['click', 1.55, { peakDb: -9, pan: -0.25 }],
    ['pop', 5.15, { peakDb: -7, pan: -0.25 }],
    ['whoosh', 8.80, { peakDb: -6, pan: 0.25 }],
    ['thump', 8.84, { peakDb: -7 }],
    ['thump', 10.75, { peakDb: -6, pan: 0.25 }],
    ['ping', 10.79, { peakDb: -9, maxDur: 0.35 }]
  ]],
  ['sfx-s02.wav', 12.30, [
    ['click', 0.35, { peakDb: -9, pan: -0.25 }],
    ['pop', 1.80, { peakDb: -7, pan: -0.25 }],
    ['whoosh', 9.15, { peakDb: -6, pan: 0.25 }],
    ['thump', 9.19, { peakDb: -7 }],
    ['tap', 10.85, { peakDb: -8, pan: 0.25 }]
  ]],
  ['sfx-s03.wav', 17.30, [
    ['click', 0.15, { peakDb: -9 }],
    ['whoosh', 0.45, { peakDb: -7 }],
    ['pop', 2.00, { peakDb: -7, rate: 0.96, pan: -0.25 }],
    ['tap', 4.95, { peakDb: -8 }],
    ['pop', 8.55, { peakDb: -7, rate: 1.04, pan: 0.0 }],
    ['whoosh', 10.90, { peakDb: -6, pan: 0.25 }],
    ['thump', 10.94, { peakDb: -7 }],
    ['notif', 14.00, { peakDb: -9, maxDur: 0.45 }]
  ]],
  ['sfx-s04.wav', 19.55, [
    ['click', 0.30, { peakDb: -9, pan: -0.25 }],
    ['whoosh', 2.80, { peakDb: -6, pan: 0.25 }],
    ['thump', 2.84, { peakDb: -7 }],
    ['whoosh', 4.15, { peakDb: -7 }],
    ['tap', 5.10, { peakDb: -8 }],
    ['pop', 8.95, { peakDb: -7, pan: -0.25 }],
    ['thump', 11.35, { peakDb: -6, pan: 0.25 }],
    ['chime', 11.40, { peakDb: -9, maxDur: 0.45 }],
    ['tap', 14.70, { peakDb: -8 }]
  ]],
  ['sfx-s05.wav', 24.90, [
    ['click', 0.55, { peakDb: -9, pan: -0.25 }],
    ['whoosh', 7.80, { peakDb: -6, pan: -0.25 }],
    ['thump', 7.84, { peakDb: -7 }],
    ['pop', 12.10, { peakDb: -7, rate: 0.98, pan: 0.25 }],
    ['pop', 14.15, { peakDb: -7, rate: 1.06, pan: 0.25 }],
    ['whoosh', 20.45, { peakDb: -7, pan: 0.25 }],
    ['ping', 20.50, { peakDb: -9, maxDur: 0.35 }]
  ]],
  ['sfx-s06.wav', 23.50, [
    ['click', 0.20, { peakDb: -9 }],
    ['tap', 4.90, { peakDb: -8 }],
    ['whoosh', 10.95, { peakDb: -7 }],
    ['pop', 13.55, { peakDb: -7, pan: -0.25 }],
    ['whoosh', 16.05, { peakDb: -6, pan: 0.25 }],
    ['thump', 16.09, { peakDb: -7 }],
    ['pop', 18.90, { peakDb: -7, rate: 1.0, pan: 0.1 }],
    ['pop', 21.15, { peakDb: -7, rate: 1.08, pan: 0.25 }],
    ['tap', 21.95, { peakDb: -8 }]
  ]],
  ['sfx-s07.wav', 15.15, [
    ['click', 0.65, { peakDb: -9, pan: -0.25 }],
    ['pop', 6.80, { peakDb: -7, pan: -0.25 }],
    ['whoosh', 12.05, { peakDb: -6, pan: 0.25 }],
    ['thump', 12.09, { peakDb: -7 }]
  ]],
  ['sfx-s08.wav', 25.90, [
    ['click', 2.70, { peakDb: -9, pan: -0.25 }],
    ['whoosh', 6.05, { peakDb: -6, pan: -0.25 }],
    ['pop', 8.30, { peakDb: -7, pan: -0.25 }],
    ['pop', 16.00, { peakDb: -7, pan: 0.25 }],
    ['pop', 21.40, { peakDb: -7, rate: 1.05, pan: 0.25 }]
  ]],
  ['sfx-s09.wav', 22.05, [
    ['click', 0.20, { peakDb: -9, pan: -0.25 }],
    ['whoosh', 1.45, { peakDb: -7, pan: -0.25 }],
    ['pop', 7.35, { peakDb: -7, pan: -0.25 }],
    ['whoosh', 10.60, { peakDb: -7 }],
    ['thump', 15.45, { peakDb: -6, pan: -0.25 }],
    ['pop', 15.49, { peakDb: -7, pan: -0.25 }],
    ['pop', 18.75, { peakDb: -7, pan: 0.25 }],
    ['tap', 20.05, { peakDb: -8 }]
  ]],
  ['sfx-s10.wav', 29.70, [
    ['click', 0.25, { peakDb: -9, pan: -0.25 }],
    ['pop', 2.35, { peakDb: -7, pan: -0.25 }],
    ['whoosh', 9.10, { peakDb: -6, pan: 0.25 }],
    ['thump', 9.14, { peakDb: -7 }],
    ['whoosh', 13.45, { peakDb: -7 }],
    ['pop', 15.10, { peakDb: -7, pan: -0.25 }],
    ['pop', 22.65, { peakDb: -7, pan: 0.25 }],
    ['tap', 26.85, { peakDb: -8 }]
  ]],
  ['sfx-s11.wav', 14.15, [
    ['click', 1.95, { peakDb: -9, pan: -0.25 }],
    ['whoosh', 4.45, { peakDb: -6, pan: 0.25 }],
    ['thump', 4.49, { peakDb: -6 }],
    ['pop', 6.80, { peakDb: -7, pan: -0.25 }],
    ['tap', 9.55, { peakDb: -8, pan: 0.25 }]
  ]],
  ['sfx-s12.wav', 30.40, [
    ['click', 0.20, { peakDb: -9 }],
    ['whoosh', 3.95, { peakDb: -7 }],
    ['thump', 4.40, { peakDb: -7 }],
    ['pop', 5.90, { peakDb: -7, rate: 0.96 }],
    ['pop', 7.85, { peakDb: -7, rate: 1.04 }],
    ['tap', 12.60, { peakDb: -8 }],
    ['pop', 23.95, { peakDb: -7, rate: 1.10 }],
    ['thump', 28.20, { peakDb: -6 }],
    ['ping', 28.25, { peakDb: -9, maxDur: 0.35 }]
  ]],
  ['sfx-s13.wav', 37.15, [
    ['click', 0.90, { peakDb: -9, pan: -0.25 }],
    ['pop', 5.35, { peakDb: -7, pan: -0.25 }],
    ['whoosh', 14.50, { peakDb: -6, pan: 0.25 }],
    ['thump', 14.54, { peakDb: -7 }],
    ['pop', 27.10, { peakDb: -7, rate: 1.02, pan: 0.25 }],
    ['pop', 34.45, { peakDb: -7, rate: 1.08, pan: 0.25 }]
  ]],
  ['sfx-s14.wav', 37.15, [
    ['click', 0.40, { peakDb: -9 }],
    ['tap', 1.20, { peakDb: -8 }],
    ['pop', 3.60, { peakDb: -7, rate: 0.96, pan: -0.25 }],
    ['pop', 6.70, { peakDb: -7, rate: 1.04, pan: 0.0 }],
    ['whoosh', 11.60, { peakDb: -7 }],
    ['pop', 19.60, { peakDb: -7, rate: 1.10, pan: 0.25 }],
    ['tap', 24.45, { peakDb: -8 }],
    ['whoosh', 28.25, { peakDb: -7, pan: 0.25 }],
    ['pop', 29.85, { peakDb: -7, pan: 0.25 }],
    ['thump', 34.10, { peakDb: -6, pan: 0.25 }]
  ]],
  ['sfx-s15.wav', 10.30, [
    ['click', 2.20, { peakDb: -9, pan: -0.25 }],
    ['pop', 6.30, { peakDb: -7, pan: -0.25 }],
    ['whoosh', 8.00, { peakDb: -6, pan: 0.25 }],
    ['thump', 8.04, { peakDb: -7 }]
  ]],
  ['sfx-s16.wav', 5.95, [
    ['click', 0.55, { peakDb: -9, pan: 0.25 }],
    ['whoosh', 1.65, { peakDb: -6, pan: 0.25 }],
    ['thump', 1.69, { peakDb: -7 }],
    ['tap', 3.95, { peakDb: -8, pan: 0.25 }]
  ]],
  ['sfx-s17.wav', 10.25, [
    ['click', 1.40, { peakDb: -9 }],
    ['whoosh', 2.90, { peakDb: -7 }],
    ['pop', 7.05, { peakDb: -7, pan: -0.25 }],
    ['whoosh', 8.95, { peakDb: -6, pan: 0.25 }],
    ['thump', 8.99, { peakDb: -6 }],
    ['chime', 9.03, { peakDb: -9, maxDur: 0.45 }]
  ]],
  ['sfx-s18.wav', 19.20, [
    ['click', 1.40, { peakDb: -9, pan: -0.25 }],
    ['whoosh', 4.20, { peakDb: -6, pan: -0.25 }],
    ['thump', 4.24, { peakDb: -7 }],
    ['tap', 7.80, { peakDb: -8, pan: -0.25 }],
    ['click', 10.50, { peakDb: -9, pan: 0.25 }],
    ['pop', 14.85, { peakDb: -7, pan: 0.25 }]
  ]],
  ['sfx-s19.wav', 18.50, [
    ['click', 0.40, { peakDb: -9, pan: -0.25 }],
    ['whoosh', 5.60, { peakDb: -6, pan: -0.25 }],
    ['thump', 5.64, { peakDb: -7 }],
    ['pop', 9.35, { peakDb: -7, rate: 0.96, pan: 0.25 }],
    ['pop', 10.80, { peakDb: -7, rate: 1.04, pan: 0.25 }],
    ['pop', 15.90, { peakDb: -7, rate: 1.12, pan: 0.25 }]
  ]],
  ['sfx-s20.wav', 42.10, [
    ['click', 0.40, { peakDb: -9 }],
    ['whoosh', 2.85, { peakDb: -7 }],
    ['pop', 3.80, { peakDb: -7, pan: -0.25 }],
    ['tap', 10.00, { peakDb: -8, pan: -0.25 }],
    ['tap', 13.55, { peakDb: -8 }],
    ['pop', 19.25, { peakDb: -7, pan: 0.25 }],
    ['tap', 23.35, { peakDb: -8 }],
    ['whoosh', 26.40, { peakDb: -6 }],
    ['tap', 27.60, { peakDb: -8 }],
    ['thump', 31.75, { peakDb: -6 }],
    ['chime', 31.80, { peakDb: -9, maxDur: 0.55 }],
    ['pop', 35.75, { peakDb: -7 }],
    ['thump', 39.65, { peakDb: -6, pan: 0.25 }],
    ['ping', 39.69, { peakDb: -9, maxDur: 0.40 }]
  ]],
  ['sfx-s21.wav', 8.25, [
    ['click', 0.20, { peakDb: -9, pan: -0.25 }],
    ['pop', 4.10, { peakDb: -7, pan: -0.25 }],
    ['whoosh', 6.80, { peakDb: -6, pan: 0.25 }],
    ['thump', 6.84, { peakDb: -6 }],
    ['notif', 6.88, { peakDb: -9, maxDur: 0.40 }]
  ]]
];

for (const [name, dur, cues] of sceneSpecs) {
  buildSceneWav(name, dur, cues);
}
console.log('Generated 21 Whisper-locked SFX WAV files for OPPO A7 Pro.');
