import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { mediaTools } from 'file:///C:/Users/Cong%20Duc/.gemini/config/skills/motion-studio/scripts/lib.mjs';
import { SR, renderEffects, wav } from 'file:///C:/Users/Cong%20Duc/.gemini/config/skills/motion-studio/scripts/sound.js';

const work = 'F:/App nha lam/motion-video-demo/videos/iphone-duo-review-5m';
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

// 25 Scene SFX cues locked 1:1 to exact GSAP timeline timestamps across scenes 01..25
const sceneSpecs = [
  ['sfx-s01.wav', 32.50, [
    ['click', 0.30, { peakDb: -9, pan: -0.25 }],
    ['whoosh', 3.20, { peakDb: -7, pan: -0.25 }],
    ['thump', 3.24, { peakDb: -7 }],
    ['tap', 15.20, { peakDb: -8, pan: -0.2 }],
    ['pop', 17.60, { peakDb: -7, pan: -0.25 }],
    ['pop', 21.00, { peakDb: -7, pan: 0.25 }],
    ['thump', 21.30, { peakDb: -6, pan: 0.25 }],
    ['notif', 26.50, { peakDb: -8, maxDur: 0.45 }]
  ]],
  ['sfx-s02.wav', 45.64, [
    ['click', 7.10, { peakDb: -9, pan: -0.25 }],
    ['thump', 13.80, { peakDb: -6, pan: -0.25 }],
    ['pop', 15.80, { peakDb: -7, pan: 0.25 }],
    ['whoosh', 18.80, { peakDb: -6 }],
    ['pop', 19.50, { peakDb: -7, pan: -0.25 }],
    ['ping', 26.80, { peakDb: -9, pan: -0.2, maxDur: 0.35 }],
    ['ping', 27.90, { peakDb: -9, pan: 0.0, maxDur: 0.35 }],
    ['ping', 30.30, { peakDb: -9, pan: 0.2, maxDur: 0.35 }],
    ['pop', 31.50, { peakDb: -7, pan: -0.2 }],
    ['pop', 32.80, { peakDb: -7, pan: -0.25 }],
    ['tap', 33.40, { peakDb: -8 }],
    ['tap', 34.25, { peakDb: -8 }],
    ['thump', 35.15, { peakDb: -7, pan: 0.2 }],
    ['pop', 35.80, { peakDb: -7, pan: 0.15 }],
    ['thump', 40.80, { peakDb: -6 }]
  ]],
  ['sfx-s03.wav', 50.43, [
    ['click', 0.30, { peakDb: -9, pan: -0.25 }],
    ['pop', 1.20, { peakDb: -7, pan: -0.25 }],
    ['whoosh', 7.16, { peakDb: -6 }],
    ['pop', 19.20, { peakDb: -7, pan: -0.25 }],
    ['tap', 22.40, { peakDb: -8, pan: -0.2 }],
    ['pop', 28.60, { peakDb: -7, pan: 0.0 }],
    ['pop', 36.00, { peakDb: -7, pan: 0.1 }],
    ['thump', 43.50, { peakDb: -6, pan: 0.25 }],
    ['ping', 43.55, { peakDb: -9, maxDur: 0.35 }]
  ]],
  ['sfx-s04.wav', 33.20, [
    ['click', 0.20, { peakDb: -9, pan: -0.25 }],
    ['pop', 0.80, { peakDb: -7, pan: -0.25 }],
    ['pop', 5.10, { peakDb: -7, pan: 0.25 }],
    ['whoosh', 10.27, { peakDb: -6 }],
    ['pop', 10.80, { peakDb: -8, pan: 0.15 }],
    ['pop', 11.60, { peakDb: -8, pan: 0.15 }],
    ['pop', 14.10, { peakDb: -7, pan: 0.25 }],
    ['pop', 15.60, { peakDb: -7, pan: 0.25 }],
    ['pop', 17.50, { peakDb: -7, pan: 0.25 }],
    ['thump', 20.30, { peakDb: -7, pan: -0.25 }],
    ['chime', 25.70, { peakDb: -8, maxDur: 0.45 }]
  ]],
  ['sfx-s05.wav', 52.60, [
    ['click', 0.30, { peakDb: -9, pan: -0.25 }],
    ['pop', 4.80, { peakDb: -7, pan: -0.25 }],
    ['pop', 15.50, { peakDb: -7, pan: 0.25 }],
    ['whoosh', 17.60, { peakDb: -6 }],
    ['pop', 24.80, { peakDb: -7, pan: 0.25 }],
    ['pop', 29.60, { peakDb: -7, pan: 0.25 }],
    ['whoosh', 35.60, { peakDb: -7 }],
    ['thump', 46.40, { peakDb: -6, pan: -0.25 }]
  ]],
  ['sfx-s06.wav', 49.40, [
    ['click', 2.80, { peakDb: -9, pan: -0.25 }],
    ['whoosh', 8.50, { peakDb: -7, pan: -0.25 }],
    ['tap', 9.50, { peakDb: -8, pan: -0.25 }],
    ['pop', 24.60, { peakDb: -7, pan: -0.25 }],
    ['pop', 25.70, { peakDb: -7, pan: -0.25 }],
    ['pop', 26.80, { peakDb: -7, pan: -0.25 }],
    ['pop', 38.50, { peakDb: -7, pan: 0.25 }],
    ['chime', 39.20, { peakDb: -9, maxDur: 0.45 }]
  ]],
  ['sfx-s07.wav', 28.70, [
    ['click', 0.20, { peakDb: -9, pan: -0.25 }],
    ['pop', 1.20, { peakDb: -7, pan: -0.25 }],
    ['pop', 6.80, { peakDb: -7, pan: -0.25 }],
    ['whoosh', 15.00, { peakDb: -6 }],
    ['pop', 19.80, { peakDb: -7, pan: 0.25 }],
    ['pop', 21.40, { peakDb: -7, pan: -0.25 }],
    ['thump', 23.00, { peakDb: -7 }],
    ['whoosh', 24.80, { peakDb: -7 }]
  ]],
  ['sfx-s08.wav', 19.40, [
    ['click', 0.30, { peakDb: -9, pan: -0.25 }],
    ['whoosh', 5.20, { peakDb: -7, pan: -0.25 }],
    ['ping', 8.20, { peakDb: -9, maxDur: 0.35 }],
    ['thump', 12.20, { peakDb: -6, pan: 0.25 }]
  ]],
  ['sfx-s09.wav', 83.80, [
    ['click', 0.40, { peakDb: -9, pan: -0.25 }],
    ['pop', 5.40, { peakDb: -7, pan: -0.25 }],
    ['thump', 14.50, { peakDb: -6, pan: -0.25 }],
    ['pop', 27.20, { peakDb: -7, pan: -0.2 }],
    ['pop', 30.20, { peakDb: -7, pan: -0.25 }],
    ['pop', 51.80, { peakDb: -7, pan: 0.25 }],
    ['pop', 71.50, { peakDb: -7, pan: 0.25 }],
    ['tap', 79.80, { peakDb: -8, pan: 0.25 }]
  ]],
  ['sfx-s10.wav', 39.10, [
    ['whoosh', 0.25, { peakDb: -6 }],
    ['pop', 1.80, { peakDb: -7, pan: 0.25 }],
    ['thump', 5.80, { peakDb: -6, pan: 0.25 }],
    ['pop', 14.00, { peakDb: -7, pan: -0.25 }],
    ['pop', 15.40, { peakDb: -7, pan: 0.0 }],
    ['pop', 16.80, { peakDb: -7 }],
    ['whoosh', 19.20, { peakDb: -7 }],
    ['pop', 21.00, { peakDb: -7, pan: -0.25 }],
    ['thump', 28.40, { peakDb: -6, pan: -0.25 }]
  ]],
  ['sfx-s11.wav', 60.90, [
    ['click', 0.30, { peakDb: -9, pan: -0.25 }],
    ['pop', 2.20, { peakDb: -7, pan: -0.25 }],
    ['pop', 13.50, { peakDb: -7, pan: -0.25 }],
    ['whoosh', 23.80, { peakDb: -6 }],
    ['pop', 24.20, { peakDb: -7, pan: -0.25 }],
    ['tap', 29.20, { peakDb: -8, pan: -0.2 }],
    ['thump', 38.00, { peakDb: -6, pan: -0.25 }],
    ['pop', 43.20, { peakDb: -7, pan: 0.25 }],
    ['whoosh', 44.60, { peakDb: -7 }],
    ['pop', 48.20, { peakDb: -7, pan: -0.25 }],
    ['pop', 55.00, { peakDb: -7, pan: -0.25 }]
  ]],
  ['sfx-s12.wav', 92.20, [
    ['click', 0.30, { peakDb: -9, pan: -0.25 }],
    ['pop', 1.20, { peakDb: -7, pan: -0.25 }],
    ['pop', 16.10, { peakDb: -7, pan: -0.25 }],
    ['tap', 19.30, { peakDb: -8, pan: -0.25 }],
    ['tap', 21.30, { peakDb: -8, pan: -0.25 }],
    ['tap', 23.30, { peakDb: -8, pan: -0.25 }],
    ['whoosh', 31.10, { peakDb: -6 }],
    ['pop', 31.50, { peakDb: -7 }],
    ['pop', 39.30, { peakDb: -7, pan: 0.25 }],
    ['pop', 41.50, { peakDb: -7, pan: 0.25 }],
    ['thump', 52.70, { peakDb: -6, pan: 0.25 }],
    ['whoosh', 61.30, { peakDb: -6 }],
    ['pop', 65.00, { peakDb: -7, pan: -0.25 }],
    ['pop', 70.20, { peakDb: -7, pan: 0.25 }],
    ['thump', 76.20, { peakDb: -7, pan: 0.25 }]
  ]],
  ['sfx-s13.wav', 99.00, [
    ['click', 0.30, { peakDb: -9, pan: -0.25 }],
    ['pop', 4.20, { peakDb: -7, pan: -0.25 }],
    ['thump', 26.80, { peakDb: -6, pan: -0.25 }],
    ['whoosh', 40.90, { peakDb: -6 }],
    ['pop', 41.30, { peakDb: -7, pan: -0.25 }],
    ['thump', 57.80, { peakDb: -6, pan: 0.25 }],
    ['whoosh', 68.20, { peakDb: -7 }],
    ['pop', 68.60, { peakDb: -7, pan: -0.25 }],
    ['pop', 80.70, { peakDb: -7, pan: -0.25 }]
  ]],
  ['sfx-s14.wav', 69.50, [
    ['click', 0.30, { peakDb: -9, pan: -0.25 }],
    ['pop', 6.20, { peakDb: -7, pan: -0.25 }],
    ['pop', 17.60, { peakDb: -7, pan: -0.25 }],
    ['thump', 31.70, { peakDb: -6, pan: -0.25 }],
    ['whoosh', 44.50, { peakDb: -6 }],
    ['pop', 44.90, { peakDb: -7, pan: -0.25 }],
    ['thump', 49.20, { peakDb: -6, pan: 0.25 }],
    ['whoosh', 60.00, { peakDb: -7 }]
  ]],
  ['sfx-s15.wav', 141.20, [
    ['click', 0.30, { peakDb: -9, pan: -0.25 }],
    ['pop', 14.50, { peakDb: -7, pan: -0.25 }],
    ['pop', 51.50, { peakDb: -7, pan: -0.25 }],
    ['pop', 83.40, { peakDb: -7, pan: -0.25 }],
    ['whoosh', 99.20, { peakDb: -6 }],
    ['pop', 110.00, { peakDb: -7, pan: -0.3 }],
    ['pop', 110.60, { peakDb: -7, pan: -0.1 }],
    ['pop', 111.50, { peakDb: -7, pan: 0.1 }],
    ['pop', 114.40, { peakDb: -7, pan: 0.3 }],
    ['thump', 115.80, { peakDb: -6 }],
    ['whoosh', 121.70, { peakDb: -7 }]
  ]],
  ['sfx-s16.wav', 56.60, [
    ['whoosh', 0.25, { peakDb: -6 }],
    ['pop', 0.60, { peakDb: -7, pan: -0.25 }],
    ['thump', 13.10, { peakDb: -6, pan: -0.25 }],
    ['pop', 24.70, { peakDb: -7, pan: 0.25 }],
    ['whoosh', 36.60, { peakDb: -6 }],
    ['pop', 37.00, { peakDb: -7, pan: 0.25 }],
    ['thump', 41.80, { peakDb: -6, pan: -0.25 }]
  ]],
  ['sfx-s17.wav', 108.00, [
    ['click', 0.30, { peakDb: -9, pan: -0.25 }],
    ['pop', 11.90, { peakDb: -7, pan: -0.25 }],
    ['thump', 30.50, { peakDb: -6, pan: -0.25 }],
    ['whoosh', 72.90, { peakDb: -6 }],
    ['pop', 73.30, { peakDb: -7, pan: -0.25 }],
    ['thump', 92.30, { peakDb: -6, pan: 0.25 }]
  ]],
  ['sfx-s18.wav', 130.20, [
    ['click', 0.30, { peakDb: -9, pan: -0.25 }],
    ['pop', 1.20, { peakDb: -7, pan: -0.25 }],
    ['pop', 12.80, { peakDb: -7, pan: -0.25 }],
    ['whoosh', 22.60, { peakDb: -7 }],
    ['pop', 23.00, { peakDb: -7, pan: -0.25 }],
    ['thump', 55.50, { peakDb: -6, pan: -0.25 }],
    ['whoosh', 59.90, { peakDb: -7 }],
    ['thump', 67.20, { peakDb: -6, pan: -0.25 }],
    ['whoosh', 82.90, { peakDb: -6 }],
    ['pop', 83.40, { peakDb: -7, pan: -0.25 }],
    ['pop', 95.50, { peakDb: -7, pan: -0.25 }],
    ['thump', 106.30, { peakDb: -6, pan: 0.25 }]
  ]],
  ['sfx-s19.wav', 80.80, [
    ['click', 0.30, { peakDb: -9, pan: -0.25 }],
    ['pop', 1.00, { peakDb: -7, pan: -0.25 }],
    ['thump', 25.80, { peakDb: -6, pan: -0.25 }],
    ['whoosh', 36.60, { peakDb: -6 }],
    ['pop', 37.00, { peakDb: -7, pan: -0.25 }],
    ['thump', 45.50, { peakDb: -6, pan: 0.25 }],
    ['whoosh', 62.20, { peakDb: -7 }]
  ]],
  ['sfx-s20.wav', 80.90, [
    ['pop', 0.80, { peakDb: -7, pan: -0.25 }],
    ['tap', 9.00, { peakDb: -8, pan: -0.25 }],
    ['tap', 14.10, { peakDb: -8, pan: -0.25 }],
    ['thump', 20.50, { peakDb: -6, pan: -0.25 }],
    ['whoosh', 25.70, { peakDb: -6 }],
    ['pop', 26.10, { peakDb: -7, pan: -0.25 }],
    ['thump', 34.00, { peakDb: -6, pan: 0.25 }],
    ['whoosh', 43.90, { peakDb: -7 }],
    ['pop', 61.50, { peakDb: -7, pan: -0.25 }]
  ]],
  ['sfx-s21.wav', 138.70, [
    ['click', 0.30, { peakDb: -9, pan: -0.25 }],
    ['pop', 23.00, { peakDb: -8, pan: -0.25 }],
    ['pop', 37.30, { peakDb: -8, pan: -0.25 }],
    ['pop', 54.70, { peakDb: -8, pan: -0.25 }],
    ['whoosh', 76.10, { peakDb: -7, pan: -0.25 }],
    ['pop', 89.90, { peakDb: -8, pan: -0.25 }],
    ['whoosh', 104.20, { peakDb: -6 }],
    ['thump', 108.50, { peakDb: -6, pan: 0.25 }],
    ['pop', 113.40, { peakDb: -7, pan: -0.25 }],
    ['whoosh', 117.40, { peakDb: -7 }]
  ]],
  ['sfx-s22.wav', 43.10, [
    ['pop', 0.60, { peakDb: -7, pan: -0.25 }],
    ['ping', 15.40, { peakDb: -8, pan: -0.2, maxDur: 0.35 }],
    ['thump', 26.80, { peakDb: -6, pan: -0.25 }]
  ]],
  ['sfx-s23.wav', 53.90, [
    ['whoosh', 0.40, { peakDb: -6 }],
    ['pop', 0.65, { peakDb: -7, pan: -0.25 }],
    ['pop', 15.90, { peakDb: -7, pan: 0.25 }],
    ['thump', 26.90, { peakDb: -6, pan: 0.25 }]
    // Zero SFX during 37.20s - 53.90s so the live speaker audio test is 100% untouched!
  ]],
  ['sfx-s24.wav', 33.60, [
    ['pop', 0.60, { peakDb: -7, pan: -0.25 }],
    ['whoosh', 11.20, { peakDb: -6 }],
    ['thump', 11.50, { peakDb: -6, pan: -0.25 }],
    ['pop', 19.00, { peakDb: -7, pan: 0.25 }],
    ['whoosh', 24.60, { peakDb: -7 }]
  ]],
  ['sfx-s25.wav', 66.54, [
    ['click', 0.30, { peakDb: -9, pan: -0.25 }],
    ['thump', 16.00, { peakDb: -6, pan: -0.25 }],
    ['whoosh', 21.80, { peakDb: -6 }],
    ['pop', 22.20, { peakDb: -7, pan: -0.25 }],
    ['pop', 25.60, { peakDb: -7, pan: 0.0 }],
    ['pop', 26.80, { peakDb: -7, pan: 0.25 }],
    ['thump', 30.80, { peakDb: -6 }],
    ['whoosh', 39.60, { peakDb: -7 }],
    ['pop', 43.50, { peakDb: -7, pan: -0.25 }],
    ['chime', 50.20, { peakDb: -8, maxDur: 0.45 }]
  ]],
];

for (const [name, dur, cues] of sceneSpecs) {
  buildSceneWav(name, dur, cues);
  const v2Name = name.replace('sfx-s', 'sfx-v2-s');
  buildSceneWav(v2Name, dur, cues);
}
console.log('Generated all 25 SFX wav files (sfx-s01.wav .. sfx-s25.wav) successfully.');
