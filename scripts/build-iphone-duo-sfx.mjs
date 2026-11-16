import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { mediaTools } from 'file:///C:/Users/Cong%20Duc/.gemini/config/skills/motion-studio/scripts/lib.mjs';
import { SR, renderEffects, wav } from 'file:///C:/Users/Cong%20Duc/.gemini/config/skills/motion-studio/scripts/sound.js';

const work = 'F:/App nha lam/motion-video-demo/videos/iphone-duo-quan-diem';
const assetsDir = join(work, 'assets');
mkdirSync(assetsDir, { recursive: true });

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

// 18 Scene SFX cues 1:1 locked to exact spoken tl.fromTo(...) timestamps in build-iphone-duo.mjs
const sceneSpecs = [
  ['sfx-s01.wav', 30.53, [
    ['click', 0.30, { peakDb: -9, pan: -0.25 }],
    ['whoosh', 5.65, { peakDb: -7, pan: -0.25 }],
    ['thump', 5.69, { peakDb: -7 }],
    ['tap', 9.10, { peakDb: -8, pan: -0.25 }],
    ['pop', 13.00, { peakDb: -7, rate: 1.0, pan: 0.25 }],
    ['pop', 17.49, { peakDb: -7, rate: 0.92, pan: 0.25 }],
    ['thump', 23.14, { peakDb: -6, pan: -0.25 }],
    ['ping', 23.18, { peakDb: -9, maxDur: 0.35 }]
  ]],
  ['sfx-s02.wav', 7.70, [
    ['tap', 0.15, { peakDb: -9, pan: -0.25 }],
    ['whoosh', 0.50, { peakDb: -7, pan: -0.25 }],
    ['thump', 0.54, { peakDb: -8 }],
    ['pop', 3.72, { peakDb: -7, rate: 1.04, pan: 0.25 }],
    ['pop', 6.45, { peakDb: -7, rate: 1.12, pan: 0.25 }]
  ]],
  ['sfx-s03.wav', 25.15, [
    ['click', 0.20, { peakDb: -9 }],
    ['whoosh', 0.55, { peakDb: -7 }],
    ['thump', 0.80, { peakDb: -8, pan: -0.25 }],
    ['pop', 4.47, { peakDb: -8, pan: -0.25 }],
    ['pop', 8.25, { peakDb: -8, pan: -0.25 }],
    ['whoosh', 11.57, { peakDb: -6, pan: 0.25 }],
    ['thump', 11.61, { peakDb: -7 }],
    ['pop', 13.90, { peakDb: -7, rate: 0.95, pan: 0.1 }],
    ['pop', 15.10, { peakDb: -7, rate: 1.05, pan: 0.2 }],
    ['pop', 16.30, { peakDb: -7, rate: 1.15, pan: 0.3 }],
    ['thump', 20.12, { peakDb: -6 }],
    ['notif', 20.17, { peakDb: -9, maxDur: 0.45 }]
  ]],
  ['sfx-s04.wav', 40.87, [
    ['click', 0.15, { peakDb: -9, pan: -0.25 }],
    ['whoosh', 0.50, { peakDb: -8, pan: -0.25 }],
    ['tap', 6.10, { peakDb: -8, pan: -0.25 }],
    ['pop', 13.22, { peakDb: -7, pan: -0.25 }],
    ['whoosh', 22.28, { peakDb: -6, pan: 0.25 }],
    ['thump', 24.80, { peakDb: -6, pan: 0.25 }],
    ['pop', 35.00, { peakDb: -7, rate: 1.0, pan: 0.25 }],
    ['pop', 37.42, { peakDb: -7, rate: 1.1, pan: 0.25 }]
  ]],
  ['sfx-s05.wav', 48.55, [
    ['click', 0.15, { peakDb: -9 }],
    ['whoosh', 8.25, { peakDb: -7 }],
    ['tap', 11.55, { peakDb: -8 }],
    ['tap', 17.42, { peakDb: -8 }],
    ['pop', 20.61, { peakDb: -7, pan: 0.3 }],
    ['pop', 22.70, { peakDb: -7, rate: 0.96, pan: -0.1 }],
    ['whoosh', 26.65, { peakDb: -7, pan: 0.25 }],
    ['thump', 31.24, { peakDb: -6 }],
    ['ping', 31.29, { peakDb: -9, maxDur: 0.4 }],
    ['pop', 39.19, { peakDb: -7 }],
    ['tap', 45.05, { peakDb: -8 }]
  ]],
  ['sfx-s06.wav', 14.43, [
    ['click', 0.24, { peakDb: -9, pan: -0.25 }],
    ['whoosh', 0.65, { peakDb: -6, pan: -0.25 }],
    ['thump', 0.69, { peakDb: -6 }],
    ['pop', 4.60, { peakDb: -7, rate: 0.95, pan: 0.25 }],
    ['thump', 8.40, { peakDb: -6, pan: -0.25 }],
    ['pop', 10.06, { peakDb: -7, rate: 1.08, pan: 0.25 }]
  ]],
  ['sfx-s07.wav', 21.64, [
    ['click', 0.20, { peakDb: -9, pan: -0.25 }],
    ['whoosh', 1.60, { peakDb: -7, pan: -0.25 }],
    ['thump', 1.64, { peakDb: -8 }],
    ['pop', 6.60, { peakDb: -7, rate: 1.0, pan: -0.25 }],
    ['pop', 9.84, { peakDb: -7, rate: 1.04, pan: 0.25 }],
    ['whoosh', 12.52, { peakDb: -7, pan: 0.25 }],
    ['tap', 17.87, { peakDb: -8, pan: 0.25 }]
  ]],
  ['sfx-s08.wav', 11.46, [
    ['click', 0.15, { peakDb: -9, pan: 0.25 }],
    ['pop', 0.25, { peakDb: -7, rate: 0.96, pan: 0.25 }],
    ['pop', 1.93, { peakDb: -7, rate: 1.04, pan: 0.25 }],
    ['pop', 4.13, { peakDb: -7, rate: 1.12, pan: 0.25 }],
    ['thump', 7.93, { peakDb: -7, pan: 0.25 }]
  ]],
  ['sfx-s09.wav', 27.17, [
    ['click', 0.15, { peakDb: -9 }],
    ['whoosh', 2.52, { peakDb: -7 }],
    ['pop', 7.68, { peakDb: -7, pan: -0.25 }],
    ['pop', 11.53, { peakDb: -7, pan: 0.25 }],
    ['whoosh', 16.17, { peakDb: -6 }],
    ['thump', 16.21, { peakDb: -6 }],
    ['thump', 21.88, { peakDb: -6, pan: 0.25 }],
    ['ping', 21.92, { peakDb: -9, maxDur: 0.35 }]
  ]],
  ['sfx-s10.wav', 16.93, [
    ['click', 0.34, { peakDb: -9, pan: -0.25 }],
    ['whoosh', 0.70, { peakDb: -7, pan: -0.25 }],
    ['thump', 5.05, { peakDb: -7, pan: -0.25 }],
    ['pop', 10.54, { peakDb: -7, pan: 0.25 }]
  ]],
  ['sfx-s11.wav', 31.54, [
    ['click', 0.15, { peakDb: -9, pan: -0.25 }],
    ['pop', 3.53, { peakDb: -7, pan: -0.25 }],
    ['whoosh', 8.13, { peakDb: -6, pan: -0.25 }],
    ['thump', 8.17, { peakDb: -7 }],
    ['tap', 14.56, { peakDb: -8, pan: -0.25 }],
    ['pop', 18.07, { peakDb: -7, pan: 0.25 }],
    ['tap', 24.81, { peakDb: -8, pan: 0.25 }]
  ]],
  ['sfx-s12.wav', 28.13, [
    ['click', 0.15, { peakDb: -9 }],
    ['pop', 0.25, { peakDb: -7, rate: 0.96, pan: -0.25 }],
    ['whoosh', 3.29, { peakDb: -7 }],
    ['pop', 7.50, { peakDb: -6, rate: 1.04, pan: 0.0 }],
    ['thump', 13.88, { peakDb: -7 }],
    ['tap', 16.04, { peakDb: -8 }],
    ['thump', 23.31, { peakDb: -6, pan: 0.25 }]
  ]],
  ['sfx-s13.wav', 17.33, [
    ['click', 0.14, { peakDb: -9, pan: -0.25 }],
    ['whoosh', 6.32, { peakDb: -6, pan: -0.25 }],
    ['thump', 6.36, { peakDb: -7 }],
    ['pop', 7.50, { peakDb: -7, pan: -0.25 }],
    ['pop', 12.50, { peakDb: -7, pan: 0.25 }],
    ['thump', 15.81, { peakDb: -6, pan: 0.25 }]
  ]],
  ['sfx-s14.wav', 34.32, [
    ['click', 0.15, { peakDb: -9, pan: -0.25 }],
    ['pop', 0.45, { peakDb: -7, rate: 0.95, pan: -0.25 }],
    ['pop', 6.20, { peakDb: -7, rate: 1.02, pan: 0.25 }],
    ['pop', 8.58, { peakDb: -7, rate: 1.08, pan: 0.25 }],
    ['whoosh', 12.85, { peakDb: -7 }],
    ['pop', 14.80, { peakDb: -7, rate: 1.0, pan: -0.2 }],
    ['pop', 18.39, { peakDb: -7, rate: 1.08, pan: 0.2 }],
    ['thump', 23.96, { peakDb: -6 }],
    ['tap', 31.92, { peakDb: -8 }]
  ]],
  ['sfx-s15.wav', 58.38, [
    ['click', 0.15, { peakDb: -9, pan: -0.25 }],
    ['whoosh', 6.37, { peakDb: -6, pan: -0.25 }],
    ['thump', 6.41, { peakDb: -6 }],
    ['tap', 13.40, { peakDb: -8, pan: -0.25 }],
    ['whoosh', 26.86, { peakDb: -7, pan: 0.25 }],
    ['pop', 35.95, { peakDb: -7, rate: 1.0, pan: 0.25 }],
    ['pop', 44.45, { peakDb: -7, rate: 1.08, pan: 0.25 }]
  ]],
  ['sfx-s16.wav', 44.42, [
    ['click', 0.15, { peakDb: -9 }],
    ['pop', 0.85, { peakDb: -7, pan: -0.25 }],
    ['whoosh', 4.69, { peakDb: -6, pan: 0.25 }],
    ['thump', 4.73, { peakDb: -6 }],
    ['tap', 11.27, { peakDb: -8, pan: -0.25 }],
    ['whoosh', 21.37, { peakDb: -6, pan: -0.25 }],
    ['pop', 34.48, { peakDb: -7, pan: 0.25 }],
    ['thump', 39.00, { peakDb: -6, pan: 0.25 }],
    ['ping', 39.04, { peakDb: -9, maxDur: 0.35 }]
  ]],
  ['sfx-s17.wav', 29.80, [
    ['click', 0.15, { peakDb: -9 }],
    ['whoosh', 2.93, { peakDb: -7 }],
    ['pop', 7.52, { peakDb: -7, rate: 0.96, pan: -0.25 }],
    ['pop', 12.00, { peakDb: -7, rate: 1.04, pan: 0.0 }],
    ['whoosh', 18.44, { peakDb: -6, pan: 0.25 }],
    ['thump', 18.48, { peakDb: -6 }],
    ['pop', 23.50, { peakDb: -7 }]
  ]],
  ['sfx-s18.wav', 37.72, [
    ['click', 0.15, { peakDb: -9, pan: -0.25 }],
    ['whoosh', 7.51, { peakDb: -7, pan: -0.25 }],
    ['pop', 17.62, { peakDb: -7, pan: -0.25 }],
    ['whoosh', 24.98, { peakDb: -6, pan: 0.25 }],
    ['thump', 25.02, { peakDb: -6, pan: 0.25 }],
    ['chime', 25.06, { peakDb: -9, maxDur: 0.55 }],
    ['thump', 31.17, { peakDb: -6, pan: 0.25 }],
    ['ping', 31.21, { peakDb: -9, maxDur: 0.40 }]
  ]]
];

for (const [name, dur, cues] of sceneSpecs) {
  buildSceneWav(name, dur, cues);
}
console.log('Generated 18 per-scene SFX WAV files locked to exact speech cues.');
