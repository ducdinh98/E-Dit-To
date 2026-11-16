import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { mediaTools } from 'file:///C:/Users/Cong%20Duc/.gemini/config/skills/motion-studio/scripts/lib.mjs';
import { SR, renderEffects, wav } from 'file:///C:/Users/Cong%20Duc/.gemini/config/skills/motion-studio/scripts/sound.js';

const work = 'F:/App nha lam/motion-video-demo/videos/viesnap-demo';
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
  if (r.status !== 0) throw new Error(`ffmpeg decode failed for ${filename}: ${r.stderr?.toString()}`);
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

// 100% locked to the EXACT original GSAP entrance timestamps that produced contact-sheet.jpg!
const SCENES = [
  {
    id: 's1',
    dur: 5.7, // host 0.5s - 6.2s
    events: [
      // 0.05s: #s1-kicker, 0.18s: #s1-main, 0.55s: #s1-tag1, 0.85s: #s1-tag2
      ['tap', 0.05, { peakDb: -9.5, pan: 0.15 }],
      ['whoosh', 0.18, { peakDb: -6.5, rate: 1.05, pan: 0.2 }],
      ['thump', 0.57, { peakDb: -7.5, rate: 1.0, pan: 0.1 }],
      ['pop', 0.57, { peakDb: -7.0, rate: 0.90, pan: 0.1 }],
      ['click', 0.58, { peakDb: -10.5, pan: 0.1 }],
      ['thump', 0.87, { peakDb: -7.5, rate: 0.92, pan: 0.22 }],
      ['pop', 0.87, { peakDb: -7.0, rate: 0.84, pan: 0.22 }],
      ['click', 0.88, { peakDb: -10.5, pan: 0.22 }],
    ],
  },
  {
    id: 's2',
    dur: 5.4, // host 6.3s - 11.7s
    events: [
      // 0.05s: #s2-kicker, 0.10s: #s2-pill, 0.18s: #s2-card, 1.6s/2.1s/2.6s: #s2-c1..c3
      ['tap', 0.05, { peakDb: -9.5, pan: -0.2 }],
      ['click', 0.10, { peakDb: -10.0, pan: 0.2 }],
      ['whoosh', 0.18, { peakDb: -6.5, rate: 1.0 }],
      ['ping', 0.30, { peakDb: -9.5, maxDur: 0.9 }],
      ['pop', 1.62, { peakDb: -6.5, rate: 0.98, pan: -0.25 }],
      ['pop', 2.12, { peakDb: -6.5, rate: 1.07, pan: 0.0 }],
      ['pop', 2.62, { peakDb: -6.5, rate: 1.16, pan: 0.25 }],
    ],
  },
  {
    id: 's3',
    dur: 9.8, // host 11.8s - 21.6s
    events: [
      // 0.05s: #s3-head, 0.3s: #s3-st1, 2.6s: #s3-st2, 5.0s: #s3-st3
      ['tap', 0.05, { peakDb: -9.5 }],
      ['whoosh', 0.30, { peakDb: -10.0, rate: 1.15, pan: -0.25 }],
      ['pop', 0.32, { peakDb: -6.5, rate: 0.98, pan: -0.25 }],
      ['whoosh', 2.60, { peakDb: -10.0, rate: 1.18, pan: 0.0 }],
      ['pop', 2.62, { peakDb: -6.5, rate: 1.07, pan: 0.0 }],
      ['pop', 5.02, { peakDb: -6.5, rate: 1.16, pan: 0.25 }],
      ['chime', 5.05, { peakDb: -9.0, maxDur: 1.4, pan: 0.15 }],
    ],
  },
  {
    id: 's4',
    dur: 4.6, // host 21.7s - 26.3s
    events: [
      // 0.1s: #s4-c1, 0.45s: #s4-c2
      ['whoosh', 0.10, { peakDb: -6.5, rate: 1.02, pan: -0.2 }],
      ['pop', 0.18, { peakDb: -8.5, rate: 1.0, pan: -0.2 }],
      ['whoosh', 0.45, { peakDb: -7.5, rate: 1.10, pan: 0.2 }],
      ['notif', 0.53, { peakDb: -8.5, maxDur: 1.4, pan: 0.15 }],
    ],
  },
  {
    id: 's5',
    dur: 9.4, // host 26.4s - 35.8s
    events: [
      // 0.05s: #s5-kicker, 0.35s: #s5-r1, 2.4s: #s5-r2
      ['tap', 0.05, { peakDb: -9.5 }],
      ['whoosh', 0.35, { peakDb: -6.5, rate: 1.04, pan: -0.15 }],
      ['click', 0.48, { peakDb: -9.5, pan: 0.15 }],
      ['whoosh', 2.40, { peakDb: -6.5, rate: 1.10, pan: 0.15 }],
      ['ping', 2.52, { peakDb: -9.0, maxDur: 1.0, pan: 0.15 }],
    ],
  },
  {
    id: 's6',
    dur: 3.9, // host 35.9s - 39.8s
    events: [
      // 0.05s: #s6-kicker, 0.20s..0.70s: #s6-p1..p6
      ['tap', 0.05, { peakDb: -10.0 }],
      ['pop', 0.21, { peakDb: -8.5, rate: 0.94, pan: -0.25 }],
      ['pop', 0.31, { peakDb: -8.5, rate: 1.00, pan: 0.0 }],
      ['pop', 0.41, { peakDb: -8.5, rate: 1.06, pan: 0.25 }],
      ['pop', 0.51, { peakDb: -8.5, rate: 1.12, pan: -0.25 }],
      ['pop', 0.61, { peakDb: -8.5, rate: 1.19, pan: 0.0 }],
      ['pop', 0.71, { peakDb: -8.0, rate: 1.26, pan: 0.25 }],
    ],
  },
  {
    id: 's7',
    dur: 15.8, // host 39.9s - 55.7s (EXACT original slot!)
    events: [
      // 0.2s: #s7-banner, 9.8s: #s7-c1, 10.6s: #s7-c2, 11.4s: #s7-c3
      ['whoosh', 0.20, { peakDb: -6.5, rate: 1.02 }],
      ['click', 0.34, { peakDb: -9.5, pan: 0.2 }],
      ['pop', 9.82, { peakDb: -6.5, rate: 0.98, pan: -0.25 }],
      ['pop', 10.62, { peakDb: -6.5, rate: 1.08, pan: 0.0 }],
      ['pop', 11.42, { peakDb: -6.5, rate: 1.18, pan: 0.25 }],
      ['ping', 11.46, { peakDb: -9.0, maxDur: 1.1, pan: 0.2 }],
    ],
  },
  {
    id: 's8',
    dur: 10.4, // host 55.8s - 66.2s
    events: [
      // 0.2s: #s8-card, 4.5s: #s8-stamp
      ['whoosh', 0.20, { peakDb: -6.5, rate: 1.0 }],
      ['chime', 0.32, { peakDb: -9.5, maxDur: 1.4 }],
      ['thump', 4.52, { peakDb: -7.5, rate: 1.02, pan: 0.15 }],
      ['pop', 4.52, { peakDb: -7.5, rate: 1.05, pan: 0.15 }],
      ['click', 4.53, { peakDb: -10.5, pan: 0.15 }],
    ],
  },
  {
    id: 's9',
    dur: 9.56, // host 66.3s - 75.86s
    events: [
      // 0.15s: #s9-plate, 2.2s: #s9-stamp
      ['whoosh', 0.15, { peakDb: -6.5, rate: 0.98 }],
      ['thump', 2.22, { peakDb: -7.5, rate: 1.0, pan: 0.18 }],
      ['pop', 2.22, { peakDb: -7.5, rate: 1.04, pan: 0.18 }],
      ['notif', 2.26, { peakDb: -8.5, maxDur: 1.5, pan: 0.15 }],
    ],
  },
];

const ceil = db(-1.5);
for (const sc of SCENES) {
  const n = Math.floor(sc.dur * SR);
  const L = new Float64Array(n);
  const R = new Float64Array(n);
  for (const [kind, t, opts] of sc.events) {
    placeSample(L, R, kind, t, opts);
  }
  const oL = new Float32Array(n);
  const oR = new Float32Array(n);
  let maxPeak = 0;
  for (let i = 0; i < n; i++) {
    oL[i] = ceil * Math.tanh(L[i] / ceil);
    oR[i] = ceil * Math.tanh(R[i] / ceil);
    const m = Math.max(Math.abs(oL[i]), Math.abs(oR[i]));
    if (m > maxPeak) maxPeak = m;
  }
  const outPath = join(assetsDir, `sfx-${sc.id}.wav`);
  writeFileSync(outPath, wav([oL, oR]));
  console.log(`Wrote sfx-${sc.id}.wav (${sc.dur}s, ${sc.events.length} events, peak ${(20 * Math.log10(maxPeak || 1e-9)).toFixed(1)} dBFS)`);
}
