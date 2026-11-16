// Synthesized sound: a music bed (and paper-and-foley effects) made from seeded noise and sine waves, mixed with an
// optional recorded voice and leveled for the web. Plain JavaScript with no dependencies. A render always sounds the
// same, and there is no sample library, account, licence or Content ID claim. music.mjs uses it for HyperFrames
// videos, which have no music of their own without a HeyGen account or a large local model.
//
//   renderSound({ duration, cues, music, vo, voOffset, loudness, effects, musicDb })
//     cues:  [[kind, seconds, { g, dur, text, cps, note, up }], ...]   (the scene returns these from mount())
//     music: { mood: 'vibes' | 'pulse' | 'lofi' | 'keys' | 'pluck' | 'none', sections: [[name, seconds], ...] }
//     vo:    Float32Array, mono, 48 kHz (already decoded), or null
//   -> { sfx, music, mix: [left, right] Float32Arrays at 48 kHz, report }
// Effect kinds: pop, tick, click, swish, rise, fall, sheet, thump, stamp, type, scribble, strike, ding, flip,
// shimmer, lap, swell, wipe, whoosh. Every kind takes g (dB). The levels and how they were tuned: references/sound.md.

export const SR = 48000;
const db = (x) => Math.pow(10, x / 20);
const TAU = Math.PI * 2;

// ---------- small DSP ----------
function rand(seed) {
  let s = seed >>> 0, spare = null;
  const u = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let x = s;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
  const n = () => {
    if (spare !== null) { const v = spare; spare = null; return v; }
    let a = 0, b = 0;
    while (a === 0) a = u();
    b = u();
    const m = Math.sqrt(-2 * Math.log(a));
    spare = m * Math.sin(TAU * b);
    return m * Math.cos(TAU * b);
  };
  return { u, n };
}
const zeros = (n) => new Float64Array(Math.max(1, Math.floor(n)));
const len = (sec) => Math.max(1, Math.floor(sec * SR));
function noise(R, n) { const x = zeros(n); for (let i = 0; i < x.length; i++) x[i] = R.n(); return x; }
function biquad(x, type, f, q = 0.7071) {
  const w = (TAU * Math.min(f, SR * 0.45)) / SR, c = Math.cos(w), a = Math.sin(w) / (2 * q);
  let b0, b1, b2;
  if (type === 'lp') { b0 = (1 - c) / 2; b1 = 1 - c; b2 = (1 - c) / 2; } else { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = (1 + c) / 2; }
  const a0 = 1 + a, a1 = -2 * c, a2 = 1 - a;
  const B0 = b0 / a0, B1 = b1 / a0, B2 = b2 / a0, A1 = a1 / a0, A2 = a2 / a0;
  const y = new Float64Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const v = B0 * x[i] + B1 * x1 + B2 * x2 - A1 * y1 - A2 * y2;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = v; y[i] = v;
  }
  return y;
}
// band-pass noise (two poles each side, like the soft spectral masks of the original Python engine)
function band(x, lo, hi) { return biquad(biquad(biquad(biquad(x, 'hp', lo), 'hp', lo), 'lp', hi), 'lp', hi); }
function maxAbs(x) { let m = 0; for (let i = 0; i < x.length; i++) { const v = Math.abs(x[i]); if (v > m) m = v; } return m || 1; }
function peak(x, levelDb) { const k = db(levelDb) / maxAbs(x); for (let i = 0; i < x.length; i++) x[i] *= k; return x; }
function norm(x) { return peak(x, 0); }
function env(n, attack, decay) {
  const e = zeros(n);
  for (let i = 0; i < e.length; i++) { const t = i / SR; e[i] = Math.min(1, t / Math.max(attack, 1e-4)) * Math.exp(-Math.max(t - attack, 0) / decay); }
  return e;
}
const mul = (a, b) => { for (let i = 0; i < a.length; i++) a[i] *= b[i]; return a; };
function addInto(a, b, k = 1, at = 0) { for (let i = 0; i < b.length && at + i < a.length; i++) a[at + i] += b[i] * k; return a; }
function smoothNoise(R, n, rate) {
  const k = Math.max(2, Math.floor((n / SR) * rate) + 2), pts = Array.from({ length: k }, () => R.u()), out = zeros(n);
  for (let i = 0; i < out.length; i++) { const p = (i / Math.max(1, out.length - 1)) * (k - 1), j = Math.floor(p), f = p - j; out[i] = pts[j] + (pts[Math.min(k - 1, j + 1)] - pts[j]) * f; }
  return out;
}
function fadeTail(x, sec = 0.12) { const k = Math.min(x.length, Math.floor(sec * SR)); for (let i = 0; i < k; i++) x[x.length - k + i] *= 1 - i / k; return x; }
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

// ---------- effects (mono; each at its own peak level) ----------
function thumpRaw(R, n, f0) {
  const out = zeros(n), tap = band(noise(R, n), 300, 1500), te = env(n, 0.0008, 0.012), be = env(n, 0.002, 0.06);
  const tm = maxAbs(tap);
  let ph = 0;
  for (let i = 0; i < n; i++) { const t = i / SR; ph += (TAU * f0 * (1 + 0.6 * Math.exp(-t / 0.02))) / SR; out[i] = Math.sin(ph) * be[i] + (0.4 * tap[i] * te[i]) / tm; }
  return out;
}
const FX = {
  pop(R, { g = 0 }) {
    const n = len(0.07), f0 = 620 + R.u() * 220, out = zeros(n), click = band(noise(R, n), 1800, 4500), be = env(n, 0.0015, 0.018), ce = env(n, 0.0005, 0.004);
    mul(click, ce); const cm = maxAbs(click);
    let ph = 0;
    for (let i = 0; i < n; i++) { const t = i / SR; ph += (TAU * f0 * (1 + 1.4 * Math.exp(-t / 0.006))) / SR; out[i] = Math.sin(ph) * be[i] + (0.5 * click[i]) / cm; }
    return peak(out, -32 + g);
  },
  tick(R, { g = 0 }) {
    const n = len(0.03), x = mul(band(noise(R, n), 2500, 7000), env(n, 0.0003, 0.005)), m = maxAbs(x), f = 2100 + R.u() * 400, e = env(n, 0.0003, 0.006);
    for (let i = 0; i < n; i++) x[i] += 0.4 * Math.sin((TAU * f * i) / SR) * e[i] * m;
    return peak(x, -36 + g);
  },
  click(R, o) { return FX.tick(R, { ...o, g: (o.g || 0) + 2 }); },
  swish(R, { g = 0, dur = 0.45, up = 0 }) {
    const n = len(dur), x = band(noise(R, n), 900, 4200);
    for (let i = 0; i < n; i++) { const u = i / n; x[i] *= Math.pow(Math.sin(Math.PI * Math.pow(u, up ? 0.6 : 1.4)), 2); }
    return peak(x, -33 + g);
  },
  whoosh(R, o) { return FX.swish(R, { dur: 0.6, ...o, g: (o.g || 0) + 1 }); },
  rise(R, { g = 0 }) { return FX.swish(R, { g: g - 5, dur: 0.28, up: 1 }); },
  fall(R, { g = 0 }) {
    const n = len(0.75), x = band(noise(R, n), 500, 2600);
    for (let i = 0; i < n; i++) { const u = i / n; x[i] *= (0.55 + 0.45 * Math.sin(TAU * (13 + 4 * u) * u * 0.75)) * Math.min(u / 0.08, 1) * Math.pow(1 - u, 1.6); }
    return peak(x, -33 + g);
  },
  sheet(R, { g = 0 }) {
    const n = len(0.7), x = band(noise(R, n), 250, 3500);
    for (let i = 0; i < n; i++) { const u = i / n; x[i] *= Math.pow(Math.min(u / 0.35, 1), 2) * Math.exp(-Math.max(u - 0.55, 0) * 14); }
    const i0 = Math.floor(0.42 * SR), s = thumpRaw(R, n - i0, 95), m = maxAbs(x);
    addInto(x, s, 0.6 * m, i0);
    return peak(x, -27 + g);
  },
  thump(R, { g = 0 }) { return peak(thumpRaw(R, len(0.25), 110), -30 + g); },
  stamp(R, { g = 0 }) {
    const n = len(0.35), body = thumpRaw(R, n, 82), slap = mul(band(noise(R, n), 900, 4200), env(n, 0.0005, 0.02));
    addInto(body, slap, 0.7 / maxAbs(slap));
    return peak(body, -23 + g);
  },
  type(R, { g = 0, text = '', cps = 30 }) {
    const chars = [...String(text)], n = len(chars.length / cps + 0.1), out = zeros(n), m = len(0.014);
    chars.forEach((ch, i) => {
      if (ch === ' ' || R.u() < 0.25) return;
      const k = mul(band(noise(R, m), 1800, 6500), env(m, 0.0003, 0.003)), a = 0.6 + 0.4 * R.u();
      addInto(out, k, a, Math.floor((i / cps) * SR));
    });
    return peak(out, -38 + g);
  },
  scribble(R, { g = 0, dur = 0.4 }) {
    const n = len(dur), x = band(noise(R, n), 2200, 6500), s = smoothNoise(R, n, 18);
    for (let i = 0; i < n; i++) { const u = i / n; x[i] *= Math.pow(s[i], 1.5) * Math.min(u / 0.05, 1) * Math.min((1 - u) / 0.1, 1); }
    return peak(x, -36 + g);
  },
  strike(R, { g = 0 }) { return FX.scribble(R, { g: g + 2, dur: 0.3 }); },
  ding(R, { g = 0, note = 3 }) {
    const NOTES = [1047, 1175, 1319, 1568, 1760, 2093], f0 = NOTES[Math.min(Math.max(0, note), NOTES.length - 1)], n = len(0.9), x = zeros(n);
    for (const [r, a, d] of [[1, 1, 0.45], [2.76, 0.3, 0.18], [5.4, 0.12, 0.08]]) { const e = env(n, 0.003, d); for (let i = 0; i < n; i++) x[i] += a * Math.sin((TAU * f0 * r * i) / SR) * e[i]; }
    return peak(x, -33 + g);
  },
  flip(R, { g = 0 }) {
    const n = len(0.2), out = zeros(n);
    addInto(out, FX.tick(R, {}), 1, 0); addInto(out, FX.tick(R, {}), 1, Math.floor(0.13 * SR)); addInto(out, FX.swish(R, { dur: 0.18 }), 0.5, 0);
    return peak(out, -37 + g);
  },
  shimmer(R, { g = 0 }) {
    const n = len(0.5), x = zeros(n);
    for (let k = 0; k < 6; k++) { const f = 2400 + R.u() * 2600, ph = R.u() * 6, e = env(n, 0.01 + R.u() * 0.08, 0.12); for (let i = 0; i < n; i++) x[i] += Math.sin((TAU * f * i) / SR + ph) * e[i]; }
    for (let i = 0; i < n; i++) x[i] *= 0.7 + 0.3 * Math.sin((TAU * 22 * i) / SR);
    return peak(x, -37 + g);
  },
  lap(R, { g = 0, dur = 1.9 }) {
    const n = len(dur), x = band(noise(R, n), 700, 3800);
    for (let i = 0; i < n; i++) { const u = i / n; x[i] *= (0.5 + 0.5 * Math.pow(Math.sin(TAU * 2 * u - Math.PI / 2), 2)) * Math.pow(Math.sin(Math.PI * u), 0.8); }
    return peak(x, -35 + g);
  },
  swell(R, { g = 0, dur = 0.8 }) {
    const n = len(dur), nz = band(noise(R, n), 400, 5000), m = maxAbs(nz), out = zeros(n);
    let ph = 0;
    for (let i = 0; i < n; i++) { const u = i / n; ph += (TAU * (180 + 520 * u * u)) / SR; out[i] = (nz[i] / m) * Math.pow(u, 2.2) + 0.35 * Math.sin(ph) * u * u; }
    return peak(out, -29 + g);
  },
  wipe(R, { g = 0, dur = 0.65 }) {
    const n = len(dur), x = band(noise(R, n), 200, 3000);
    for (let i = 0; i < n; i++) x[i] *= Math.pow(Math.sin(Math.PI * Math.sqrt(i / n)), 2);
    return peak(x, -28 + g);
  },
};
const FX_TRIM = -4;                                                                    // every effect, under a voice
const LOUD_TRIM = { stamp: -3, sheet: -3, thump: -3, swell: -3, wipe: -3 };            // the big transitions, on top
const PAN = { type: -0.15, stamp: 0.2 };

function place(L, Rr, x, t0, pan, gain = 1) {
  const i0 = Math.floor(Math.max(0, t0) * SR), l = Math.cos(((pan + 1) * Math.PI) / 4) * Math.SQRT2 * gain, r = Math.sin(((pan + 1) * Math.PI) / 4) * Math.SQRT2 * gain;
  for (let i = 0; i < x.length && i0 + i < L.length; i++) { L[i0 + i] += x[i] * l; Rr[i0 + i] += x[i] * r; }
}

export function renderEffects(cues, n) {
  const L = zeros(n), Rr = zeros(n);
  (cues || []).forEach(([kind, t0, opts], i) => {
    const f = FX[kind];
    if (!f || !(t0 >= 0)) return;
    const R = rand(1000 + i), x = f(R, opts || {});
    const k = db(FX_TRIM + (LOUD_TRIM[kind] || 0));
    for (let j = 0; j < x.length; j++) x[j] *= k;
    if (kind === 'lap') {   // circles: two passes left to right and back
      const i0 = Math.floor(t0 * SR);
      for (let j = 0; j < x.length && i0 + j < n; j++) { const p = Math.sin(TAU * 2 * (j / x.length)) * 0.6; L[i0 + j] += x[j] * Math.cos(((p + 1) * Math.PI) / 4) * Math.SQRT2; Rr[i0 + j] += x[j] * Math.sin(((p + 1) * Math.PI) / 4) * Math.SQRT2; }
    } else place(L, Rr, x, t0, PAN[kind] ?? (R.u() - 0.5) * 0.4);
  });
  return [L, Rr];
}

// ---------- music ----------
const CHORDS = {
  Fmaj7: [41, [53, 57, 60, 64]], Em7: [40, [52, 55, 59, 62]], Dm7: [38, [50, 53, 57, 60]], Cmaj7: [36, [52, 55, 59, 60]],
  G6: [43, [55, 59, 62, 64]], Am7: [45, [55, 57, 60, 64]], Cmaj9: [36, [48, 52, 55, 59, 62]],
};
const ALIASES = { chat: 'problem', busy: 'tension', agent: 'concept', laps: 'peak' };
function tone(dur, fn) { const n = len(dur), x = zeros(n); for (let i = 0; i < n; i++) x[i] = fn(i / SR); return x; }
const I = {
  ep(f, dur, R, attack = 0.004, decay = 1.4) {
    const det = 1 + (R.u() - 0.5) * 0.003;
    return fadeTail(tone(dur, (t) => {
      const idx = 0.2 + Math.exp(-t / 0.3), w = TAU * f * det * t;
      return (Math.sin(w + idx * Math.sin(w)) + 0.12 * Math.sin(TAU * 2 * f * t) * Math.exp(-t / 0.2)) * Math.min(1, t / attack) * Math.exp(-t / decay) * (1 + 0.05 * Math.sin(TAU * 4.2 * t));
    }));
  },
  bass(f, dur) { return fadeTail(tone(dur, (t) => (Math.sin(TAU * f * t) + 0.22 * Math.sin(TAU * 2 * f * t) + 0.06 * Math.sin(TAU * 3 * f * t)) * Math.min(1, t / 0.012) * Math.exp(-t / 0.9)), 0.06); },
  kick() { let ph = 0; return tone(0.35, (t) => { ph += (TAU * 50 * (1 + 1.3 * Math.exp(-t / 0.025))) / SR; return Math.sin(ph) * Math.min(1, t / 0.002) * Math.exp(-t / 0.13); }); },
  brush(R) { const n = len(0.25), x = norm(mul(band(noise(R, n), 900, 5000), env(n, 0, 0.09))); for (let i = 0; i < n; i++) { const t = i / SR; x[i] = 0.8 * x[i] + 0.3 * Math.sin(TAU * 185 * t) * Math.exp(-t / 0.04); } return x; },
  hat(R) { const n = len(0.06); return norm(mul(band(noise(R, n), 6500, 13000), env(n, 0, 0.018))); },
  pluck(f, dur = 0.6) { return fadeTail(tone(dur, (t) => (Math.sin(TAU * f * t) + 0.3 * Math.sin(TAU * 2 * f * t) * Math.exp(-t / 0.08) + 0.1 * Math.sin(TAU * 3 * f * t) * Math.exp(-t / 0.05)) * Math.min(1, t / 0.002) * Math.exp(-t / 0.28)), 0.05); },
  saw(f, dur, cutoff = 16, decay = 0.18) {
    return fadeTail(tone(dur, (t) => { let x = 0; for (let h = 1; h < 9; h++) x += (Math.sin(TAU * f * h * t) / h) * Math.exp((-t * h) / (cutoff * decay * 10)); return x * Math.min(1, t / 0.004) * Math.exp(-t / decay); }), 0.03);
  },
  pad(notes, dur) {
    const fs = notes.map(mtof);
    return tone(dur, (t) => { let x = 0; for (const f of fs) x += Math.sin(TAU * f * 0.998 * t) + Math.sin(TAU * f * 1.002 * t) + 0.15 * Math.sin(TAU * 2 * f * t); return (x * clamp01(t / 0.9) * clamp01((dur - t) / 0.6)) / fs.length; });
  },
  bell(f, dur = 1.6) { return fadeTail(tone(dur, (t) => (Math.sin(TAU * f * t + 1.2 * Math.exp(-t / 0.4) * Math.sin(TAU * f * 3.5 * t)) + 0.25 * Math.sin(TAU * f * 2.76 * t) * Math.exp(-t / 0.3)) * Math.min(1, t / 0.002) * Math.exp(-t / 0.7))); },
  mtick(R) { const n = len(0.05), x = mul(band(noise(R, n), 2500, 9000), env(n, 0, 0.008)); for (let i = 0; i < n; i++) x[i] += 0.5 * Math.sin((TAU * 1900 * i) / SR) * Math.exp(-i / SR / 0.01); return norm(x); },
  snap(R) { const n = len(0.12); return norm(mul(band(noise(R, n), 1500, 6000), env(n, 0, 0.025))); },
  shaker(R) { const n = len(0.09), x = band(noise(R, n), 4000, 11000); for (let i = 0; i < n; i++) x[i] *= Math.pow(Math.sin(Math.PI * clamp01(i / SR / 0.09)), 2); return norm(x); },
  ks(f, dur, R, decay = 0.994) {
    const N = Math.max(2, Math.floor(SR / f)), n = len(dur), seed = zeros(N * 4);
    for (let i = 0; i < seed.length; i++) seed[i] = R.u() * 2 - 1;
    const buf = band(seed, 200, 5000), out = zeros(n + N);
    for (let i = 0; i < N; i++) out[i] = buf[i];
    for (let k = N; k < n; k += N) for (let i = 0; i < N && k + i < out.length; i++) out[k + i] = decay * 0.5 * (out[k - N + i] + (i === 0 ? out[k - 1] : out[k - N + i - 1]));
    const x = out.slice(0, n), m = maxAbs(x);
    for (let i = 0; i < n; i++) x[i] = (x[i] / m) * clamp01(i / 48);
    return fadeTail(x, 0.04);
  },
  keys(f, dur, R, decay = 0.35) {
    return fadeTail(tone(Math.min(dur, 1.6), (t) => { let x = 0; for (const d of [0.997, 1.003]) for (const [h, a] of [[1, 1], [3, 1 / 9], [5, 1 / 25], [2, 0.12]]) x += a * Math.sin(TAU * f * d * h * t) * Math.exp((-t * h) / 1.2); return x * 0.5 * Math.min(1, t / 0.005) * Math.exp(-t / decay); }), 0.04);
  },
  vibes(f, dur, R, decay = 0.9) {
    return fadeTail(tone(Math.min(dur, 2.4), (t) => (Math.sin(TAU * f * t) + 0.22 * Math.sin(TAU * f * 4 * t) * Math.exp(-t / 0.15) + 0.08 * Math.sin(TAU * f * 10 * t) * Math.exp(-t / 0.03)) * (1 + 0.18 * Math.sin(TAU * 5.2 * t)) * Math.min(1, t / 0.003) * Math.exp(-t / decay)), 0.05);
  },
  softKick(R) {
    const n = len(0.22), click = band(noise(R, n), 1800, 5000), cm = maxAbs(click), x = zeros(n);
    let ph = 0;
    for (let i = 0; i < n; i++) { const t = i / SR; ph += (TAU * (75 + 75 * Math.exp(-t / 0.03))) / SR; x[i] = (Math.sin(ph) * Math.exp(-t / 0.09) + (0.25 * click[i] * Math.exp(-t / 0.006)) / cm) * Math.min(1, t / 0.002); }
    return fadeTail(x, 0.03);
  },
  upright(f, dur) { return fadeTail(tone(dur, (t) => (Math.sin(TAU * f * t) + 0.35 * Math.sin(TAU * 2 * f * t) * Math.exp(-t / 0.12)) * Math.min(1, t / 0.006) * Math.exp(-t / 0.35)), 0.05); },
};
function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }

function arrange(spec, bpm) {
  const secs = (spec.sections || []).map(([k, t]) => [ALIASES[k] || k, t]).sort((a, b) => a[1] - b[1]);
  let hit = (secs.find(([k]) => k === 'end') || [])[1];
  if (!(hit > 0)) hit = Math.max(2, (spec.fadeOut || 10) - 2);
  const bars = Math.max(1, Math.round(hit / ((4 * 60) / bpm))), bar = hit / bars, beat = bar / 4;
  const qs = secs.map(([name, t]) => [name, Math.round(t / beat) * beat]);
  const section = (t) => { let cur = qs[0]?.[0] || 'intro'; for (const [name, t0] of qs) if (t >= t0 - 1e-6) cur = name; return cur; };
  return { hit, bars, bar, beat, qs, section };
}
function makeBus(n, R, jitter = 0) {
  const L = zeros(n), Rr = zeros(n);
  const add = (x, t0, pan = 0, gain = 1) => { if (jitter) t0 += (R.u() - 0.5) * jitter; place(L, Rr, x, t0, pan, gain * (0.9 + R.u() * 0.2)); };
  return { L, R: Rr, add };
}
function finishBus(bus, n, lo, hi, drive, level, fadeOut) {
  for (const ch of ['L', 'R']) { let x = biquad(biquad(bus[ch], 'hp', lo), 'lp', hi); for (let i = 0; i < n; i++) x[i] = Math.tanh(x[i] * drive) / drive; bus[ch] = x; }
  // about `level` dBFS RMS where the music plays, then fade in and out
  const hop = 4800, rms = [];
  for (let i = 0; i + hop <= n; i += hop) { let s = 0; for (let j = i; j < i + hop; j++) { const m = (bus.L[j] + bus.R[j]) / 2; s += m * m; } rms.push(Math.sqrt(s / hop)); }
  const top = Math.max(...rms, 1e-9), act = rms.filter((v) => v > top * 0.05);
  const cur = Math.sqrt(act.reduce((a, v) => a + v * v, 0) / Math.max(1, act.length)) || 1e-9, k = db(level) / cur;
  for (let i = 0; i < n; i++) { const t = i / SR, f = k * clamp01(t / 0.8) * clamp01((fadeOut - t) / 1.5); bus.L[i] *= f; bus.R[i] *= f; }
  return [bus.L, bus.R];
}

// 'lofi': warm and unhurried, an FM electric piano, soft bass, brushed drums with swing, an arpeggio, vinyl crackle
function lofi(spec, n) {
  const R = rand(88), A = arrange(spec, 88), { hit, bars, bar, beat, section } = A;
  const PROG_A = ['Fmaj7', 'Em7', 'Dm7', 'Cmaj7'], PROG_B = ['Fmaj7', 'G6', 'Em7', 'Am7'], TURN = ['Em7', 'Fmaj7', 'G6'], GROOVE = ['concept', 'peak', 'example'];
  const conceptBar = Math.round((A.qs.find(([k]) => k === 'concept')?.[1] || 0) / bar);
  const chord = (b) => (b >= bars ? 'Cmaj9' : b >= bars - 3 ? TURN[b - (bars - 3)] : ['intro', 'problem', 'tension'].includes(section(b * bar + 1e-3)) ? PROG_A[b % 4] : PROG_B[(((b - conceptBar) % 4) + 4) % 4]);
  const bus = makeBus(n, R, 0.012), swing = 0.07 * beat;
  for (let b = 0; b < bars; b++) {
    const tb = b * bar, [root, notes] = CHORDS[chord(b)], s = section(tb);
    let hits = s === 'intro' ? [[0, 0.5, 0.35, bar + 0.3]] : [[0, 0.55, 0.004, 1.5 * beat + swing], [1.5 * beat + swing, 0.32, 0.004, bar - 1.5 * beat]];
    if (s === 'payoff') hits = [[0, 0.55, 0.01, bar + 0.2]];
    for (const [off, vel, att, dur] of hits) notes.forEach((m, k) => bus.add(I.ep(mtof(m), dur + 0.15, R, att), tb + off + k * 0.009, (k / (notes.length - 1) - 0.5) * 0.5, vel * 0.32));
    for (let i = 0; i < 8; i++) {
      const t8 = tb + (i * beat) / 2 + (i % 2 ? swing : 0), s8 = section(tb + (i * beat) / 2);
      if (s8 !== 'intro') {
        if (i === 0) bus.add(I.bass(mtof(root), 1.6 * beat), t8, 0, 0.3);
        if (i === 5 && [...GROOVE, 'tension'].includes(s8)) bus.add(I.bass(mtof(root + (b % 2 ? 7 : 12)), beat), t8, 0, 0.22);
      }
      if (GROOVE.includes(s8)) {
        if (i === 0 || i === 5) bus.add(I.kick(), t8, 0, 0.3);
        if (i === 2 || i === 6) bus.add(I.brush(R), t8, 0.1, 0.22);
        bus.add(I.hat(R), t8, 0.3, i % 2 ? 0.07 : 0.1);
      } else if (s8 === 'problem') {
        if (i === 0) bus.add(I.kick(), t8, 0, 0.2);
        bus.add(I.hat(R), t8, 0.3, i % 2 ? 0.05 : 0.07);
      } else if (s8 === 'tension') {
        if (i === 0 || i === 4) bus.add(I.kick(), t8, 0, 0.24);
        for (const j of [0, 1]) bus.add(I.hat(R), tb + (i * beat) / 2 + (j * beat) / 4, 0.3, 0.07);
      }
      if (s8 === 'concept' || s8 === 'example') { const seq = [...notes, ...notes.slice(1, -1).reverse()]; bus.add(I.pluck(mtof(seq[(b * 8 + i) % seq.length] + 12)), t8, i % 2 ? -0.3 : 0.3, 0.15); }
    }
  }
  const [root, notes] = CHORDS.Cmaj9;
  notes.forEach((m, k) => bus.add(I.ep(mtof(m), 4.5, R, 0.006, 2.4), hit + k * 0.012, (k / (notes.length - 1) - 0.5) * 0.6, 0.4 * 0.32));
  bus.add(I.bass(mtof(root), 3.5), hit, 0, 0.32);
  [84, 79, 76, 72, 69, 67].forEach((m, k) => bus.add(I.pluck(mtof(m), 1), hit + 0.5 + k * beat * 0.75, 0.3 - k * 0.12, 0.13 * (1 - k * 0.12)));
  // light crackle to sit with paper grain
  const cr = zeros(n);
  for (let c = 0; c < Math.floor((n / SR) * 9); c++) { const i = Math.floor(R.u() * (n - 400)), a = (R.u() * 2 - 1) * Math.pow(R.u(), 2), d = 8 + R.u() * 25; for (let j = 0; j < 200; j++) cr[i + j] += a * Math.exp(-j / d); }
  const crk = band(cr, 900, 7000), hiss = band(noise(R, n), 2500, 9000);
  for (let i = 0; i < n; i++) { const v = (crk[i] + hiss[i] * 0.02) * 0.5; bus.L[i] += v; bus.R[i] += v * 0.85; }
  return finishBus(bus, n, 30, 6500, 1.5, -34, spec.fadeOut);
}

// 'vibes' (the default: a vibraphone over a light beat, about 108 BPM, steady from start to finish), 'keys', 'pluck'
// and 'pulse' (clean and modern: a soft saw pulse, pads, a clock tick, a bell motif, about 100 BPM)
const ALT = {
  pulse: { bpm: 100, prog: ['Am7', 'Fmaj7', 'Cmaj7', 'G6'], turn: ['Fmaj7', 'G6', 'G6'] },
  pluck: { bpm: 108, prog: ['Cmaj7', 'Am7', 'Fmaj7', 'G6'], turn: ['Dm7', 'Fmaj7', 'G6'] },
  keys: { bpm: 108, prog: ['Cmaj7', 'Am7', 'Fmaj7', 'G6'], turn: ['Dm7', 'Fmaj7', 'G6'] },
  vibes: { bpm: 108, prog: ['Cmaj7', 'Am7', 'Fmaj7', 'G6'], turn: ['Dm7', 'Fmaj7', 'G6'] },
};
function alt(spec, n, mood) {
  const R = rand(15), cfg = ALT[mood], A = arrange(spec, cfg.bpm), { hit, bars, bar, beat, section } = A;
  const chord = (b) => (b >= bars ? 'Cmaj9' : b >= bars - 3 ? cfg.turn[b - (bars - 3)] : cfg.prog[b % 4]);
  const bus = makeBus(n, R), busy = ['concept', 'peak', 'example'];
  const lead = { pluck: I.ks, keys: I.keys, vibes: I.vibes }[mood], lg = { pluck: 0.16, keys: 0.13, vibes: 0.12 }[mood];
  for (let b = 0; b < bars; b++) {
    const tb = b * bar, [root, notes] = CHORDS[chord(b)], s = section(tb + 1e-3);
    if (mood === 'pulse') {
      bus.add(I.pad(notes, bar + 0.4), tb, 0, s !== 'intro' ? 0.22 : 0.3);
      for (let i = 0; i < 16; i++) {
        const t16 = tb + (i * beat) / 4, s16 = section(t16 + 1e-3);
        if (s16 === 'intro') continue;
        const step = s16 === 'tension' || s16 === 'peak' ? 1 : 2;
        if (i % step === 0 && s16 !== 'payoff') bus.add(I.saw(mtof(root + 24 + (Math.floor(i / 2) % 4 === 3 ? 7 : 0)), (beat / 2) * 0.9, 16, 0.12), t16, -0.15, busy.includes(s16) ? 0.16 : 0.11);
        if (s16 !== 'payoff' && i % 4 === 2) bus.add(I.mtick(R), t16, 0.35, 0.1);
        if (busy.includes(s16)) { if (i === 0 || i === 8) bus.add(I.bass(mtof(root + 12), 1.2 * beat), t16, 0, 0.2); if (i === 4 || i === 12) bus.add(I.snap(R), t16, 0.05, 0.08); }
      }
      if (busy.includes(s) && b % 2 === 0) [notes[notes.length - 1] + 12, notes[notes.length - 2] + 12, notes[1] + 12].forEach((m, k) => bus.add(I.bell(mtof(m)), tb + k * 0.75 * beat * (s === 'peak' ? 0.5 : 1), 0.3 - k * 0.3, 0.1));
    } else {
      // one steady pattern: background music never builds to a climax
      const pattern = s === 'intro' ? [0] : s === 'payoff' ? [0, 2] : [0, 1.5, 2.5];
      for (const off of pattern) {
        const ns = s === 'intro' || off === 0 ? notes : notes.slice(1, 3);
        ns.forEach((m, j) => bus.add(lead(mtof(m + 12), 1.2, R), tb + off * beat + j * 0.018, (j / Math.max(1, notes.length - 1) - 0.5) * 0.6, lg));
      }
      if (s !== 'payoff' && s !== 'intro') { bus.add(I.upright(mtof(root + 12), beat * 0.9), tb, 0, 0.2); bus.add(I.upright(mtof(root + 19), beat * 0.6), tb + 2.5 * beat, 0, 0.15); }
      for (let i = 0; i < 8; i++) {
        const t8 = tb + (i * beat) / 2, s8 = section(t8 + 1e-3), steady = [...busy, 'problem', 'tension'].includes(s8);
        if (!steady) continue;
        if (i === 0 || i === 3 || i === 4) bus.add(I.softKick(R), t8, 0, 0.22);
        if (i % 2) bus.add(I.hat(R), t8, 0.3, 0.05);
        if (i === 2 || i === 6) bus.add(I.snap(R), t8, 0.1, 0.12);
        bus.add(I.shaker(R), t8, 0.35, i % 2 ? 0.05 : 0.06);
      }
    }
  }
  const [root, notes] = CHORDS.Cmaj9;
  if (mood === 'pulse') {
    bus.add(I.pad(notes, 4), hit, 0, 0.32); bus.add(I.bass(mtof(root + 12), 3), hit, 0, 0.2);
    [84, 79, 76, 72, 69, 67].forEach((m, k) => bus.add(I.bell(mtof(m), 2), hit + 0.4 + k * beat * 0.75, 0.3 - k * 0.12, 0.08 * (1 - k * 0.1)));
  } else {
    notes.forEach((m, j) => bus.add(mood === 'pluck' ? I.ks(mtof(m + 12), 3, R, 0.997) : lead(mtof(m + 12), 3, R, 1.6), hit + j * 0.03, (j / (notes.length - 1) - 0.5) * 0.6, 0.14));
    bus.add(I.upright(mtof(root + 12), 1.6), hit, 0, 0.2);
    [84, 79, 76, 72, 69, 67].forEach((m, k) => bus.add(mood === 'pluck' ? I.ks(mtof(m), 1.4, R, 0.996) : lead(mtof(m), 1.4, R), hit + 0.5 + k * beat * 0.75, 0.3 - k * 0.12, 0.1 * (1 - k * 0.1)));
  }
  return finishBus(bus, n, 60, 9500, 1.2, mood === 'pulse' ? -34 : -37, spec.fadeOut);
}

export const MOODS = ['vibes', 'pulse', 'lofi', 'keys', 'pluck', 'none'];
export function renderMusic(spec, n) {
  const mood = spec?.mood || 'vibes';
  if (!spec || mood === 'none' || !(spec.sections || []).length) return [zeros(n), zeros(n)];
  if (mood === 'lofi') return lofi(spec, n);
  return alt(spec, n, ALT[mood] ? mood : 'vibes');
}

// ---------- the voice, the mix and the level ----------
function follower(x, attack = 0.02, release = 0.3) {
  const hop = Math.floor(0.01 * SR), frames = Math.ceil(x.length / hop), out = new Float64Array(frames), a = Math.exp(-0.01 / attack), r = Math.exp(-0.01 / release);
  let v = 0;
  for (let f = 0; f < frames; f++) {
    let s = 0; const i0 = f * hop;
    for (let i = i0; i < Math.min(x.length, i0 + hop); i++) s += x[i] * x[i];
    const m = Math.sqrt(s / hop + 1e-12);
    v = m > v ? a * v + (1 - a) * m : r * v + (1 - r) * m;
    out[f] = 20 * Math.log10(v + 1e-9);
  }
  return { lev: out, hop };
}
// integrated loudness (ITU-R BS.1770, K-weighted, gated) of a stereo pair at 48 kHz
export function lufs(L, R) {
  const kw = (x) => {
    const st = (x, b, a) => { const y = new Float64Array(x.length); let x1 = 0, x2 = 0, y1 = 0, y2 = 0; for (let i = 0; i < x.length; i++) { const v = b[0] * x[i] + b[1] * x1 + b[2] * x2 - a[1] * y1 - a[2] * y2; x2 = x1; x1 = x[i]; y2 = y1; y1 = v; y[i] = v; } return y; };
    return st(st(x, [1.53512485958697, -2.69169618940638, 1.19839281085285], [1, -1.69065929318241, 0.73248077421585]), [1, -2, 1], [1, -1.99004745483398, 0.99007225036621]);
  };
  const a = kw(L), b = kw(R), block = Math.floor(0.4 * SR), hop = Math.floor(0.1 * SR), z = [];
  for (let i = 0; i + block <= a.length; i += hop) { let s = 0; for (let j = i; j < i + block; j++) s += a[j] * a[j] + b[j] * b[j]; z.push(s / block); }
  const loud = (m) => -0.691 + 10 * Math.log10(m + 1e-12);
  const g1 = z.filter((v) => loud(v) > -70);
  if (!g1.length) return -Infinity;
  const rel = loud(g1.reduce((s, v) => s + v, 0) / g1.length) - 10;
  const g2 = g1.filter((v) => loud(v) > rel);
  return loud(g2.reduce((s, v) => s + v, 0) / g2.length);
}

export function renderSound({ duration, cues = [], music = null, vo = null, voOffset = 0, loudness = -14, effects = true, musicDb = 0 }) {
  const n = Math.floor((duration + 0.5) * SR);
  const [fl, fr] = effects ? renderEffects(cues, n) : [zeros(n), zeros(n)];
  const [ml, mr] = music ? renderMusic({ ...music, fadeOut: duration }, n) : [zeros(n), zeros(n)];
  const mg = db(musicDb || 0);
  for (let i = 0; i < n; i++) { ml[i] *= mg; mr[i] *= mg; }
  const L = new Float64Array(n), R = new Float64Array(n);
  let voice = null;
  if (vo && vo.length) {
    voice = new Float64Array(n);
    const off = Math.round((voOffset || 0) * SR);
    for (let i = 0; i < n; i++) { const j = i + off; voice[i] = j >= 0 && j < vo.length ? vo[j] : 0; }
    // level the voice (voiced RMS about -18 dBFS, peaks under -1), then duck the bed 8 dB while it speaks
    let { lev, hop } = follower(voice);
    let s = 0, c = 0;
    for (let f = 0; f < lev.length; f++) if (lev[f] > -40) for (let i = f * hop; i < Math.min(n, (f + 1) * hop); i++) { s += voice[i] * voice[i]; c++; }
    if (c) { const k = Math.min(db(-18) / (Math.sqrt(s / c) + 1e-9), db(-1) / maxAbs(voice)); for (let i = 0; i < n; i++) voice[i] *= k; }
    ({ lev, hop } = follower(voice));
    for (let i = 0; i < n; i++) {
      const speaking = clamp01((lev[Math.min(lev.length - 1, Math.floor(i / hop))] + 45) / 10), d = db(-8 * speaking);
      L[i] = (fl[i] + ml[i]) * d + voice[i]; R[i] = (fr[i] + mr[i]) * d + voice[i];
    }
  } else for (let i = 0; i < n; i++) { L[i] = fl[i] + ml[i]; R[i] = fr[i] + mr[i]; }
  // the web's level: integrated loudness to the target (default -14 LUFS), soft ceiling at -1.5 dBFS. Effects on
  // their own (no voice, no music) sit 6 dB lower, and the gain never goes above +24 dB.
  const before = lufs(L, R);
  const bedOnly = !voice && !(music && music.mood !== 'none');
  let gain = 1;
  if (loudness != null && Number.isFinite(before)) gain = db(Math.min(24, loudness - (bedOnly ? 6 : 0) - before));
  const ceil = db(-1.5);
  const out = [new Float32Array(n), new Float32Array(n)];
  for (let i = 0; i < n; i++) { out[0][i] = ceil * Math.tanh((L[i] * gain) / ceil); out[1][i] = ceil * Math.tanh((R[i] * gain) / ceil); }
  const f32 = (a) => Float32Array.from(a, (v) => v * gain);
  return {
    sfx: [f32(fl), f32(fr)], music: [f32(ml), f32(mr)], mix: out,
    report: { cues: (cues || []).length, mood: music?.mood || 'none', voice: !!voice, before: +before.toFixed(1), after: +lufs(out[0], out[1]).toFixed(1), gainDb: +(20 * Math.log10(gain)).toFixed(1) },
  };
}

// 16-bit PCM WAV of a stereo pair
export function wav([L, R]) {
  const n = L.length, buf = new ArrayBuffer(44 + n * 4), v = new DataView(buf);
  const str = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  str(0, 'RIFF'); v.setUint32(4, 36 + n * 4, true); str(8, 'WAVE'); str(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true);
  v.setUint32(24, SR, true); v.setUint32(28, SR * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); str(36, 'data'); v.setUint32(40, n * 4, true);
  for (let i = 0, o = 44; i < n; i++, o += 4) {
    v.setInt16(o, Math.max(-1, Math.min(1, L[i])) * 32767, true);
    v.setInt16(o + 2, Math.max(-1, Math.min(1, R[i])) * 32767, true);
  }
  return new Uint8Array(buf);
}
