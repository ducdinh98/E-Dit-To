import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { mediaTools } from 'file:///C:/Users/Cong%20Duc/.gemini/config/skills/motion-studio/scripts/lib.mjs';
import { SR, wav } from 'file:///C:/Users/Cong%20Duc/.gemini/config/skills/motion-studio/scripts/sound.js';

const { ffmpeg } = mediaTools();
const voPath = 'F:/App nha lam/motion-video-demo/videos/viesnap-illustrated/assets/voiceover.mp3';
const scratch = 'C:/Users/Cong Duc/.gemini/antigravity/brain/bbfe727a-dcec-4197-bb7d-d882f0c9fe54/scratch';

const r = spawnSync(ffmpeg, ['-v', 'error', '-i', voPath, '-f', 'f32le', '-ac', '1', '-ar', String(SR), 'pipe:1'], {
  maxBuffer: 64 * 1024 * 1024,
  shell: false
});
if (r.status !== 0) throw new Error('ffmpeg failed');
const mono = new Float32Array(r.stdout.buffer, r.stdout.byteOffset, Math.floor(r.stdout.byteLength / 4));

const scenes = [
  [1, 0.0, 6.2],
  [2, 6.2, 5.6],
  [3, 11.8, 9.85],
  [4, 21.65, 4.7],
  [5, 26.35, 9.5],
  [6, 35.85, 4.05],
  [7, 39.9, 8.6],
  [8, 48.5, 7.3],
  [9, 55.8, 10.45],
  [10, 66.25, 9.62]
];

for (const [id, st, dur] of scenes) {
  const i0 = Math.round(st * SR);
  const len = Math.min(mono.length - i0, Math.round(dur * SR));
  const L = new Float32Array(len);
  const R = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    L[i] = mono[i0 + i] * 0.9;
    R[i] = mono[i0 + i] * 0.9;
  }
  // Add crisp audible ruler pips in R channel:
  // Every 1.0s: 1500Hz 22ms pip; every 0.5s: 900Hz 14ms pip
  for (let t = 0; t < dur; t += 0.5) {
    const isSec = Math.abs(t - Math.round(t)) < 0.01;
    const freq = isSec ? 1500 : 880;
    const pipDur = isSec ? 0.024 : 0.014;
    const amp = isSec ? 0.35 : 0.16;
    const p0 = Math.round(t * SR);
    const pN = Math.round(pipDur * SR);
    for (let k = 0; k < pN && p0 + k < len; k++) {
      const env = Math.sin((Math.PI * k) / pN);
      R[p0 + k] += amp * env * Math.sin((2 * Math.PI * freq * k) / SR);
    }
  }
  const wavPath = `${scratch}/vo-ruler-s${String(id).padStart(2, '0')}.wav`;
  const mp3Path = `${scratch}/vo-ruler-s${String(id).padStart(2, '0')}.mp3`;
  writeFileSync(wavPath, wav([L, R]));
  spawnSync(ffmpeg, ['-y', '-v', 'error', '-i', wavPath, '-b:a', '128k', mp3Path], { shell: false });

  // Print 0.1s RMS ASCII bar chart for this scene
  let line = `\n=== SCENE ${String(id).padStart(2, '0')} (global ${st}s..${+(st + dur).toFixed(2)}s, local 0..${dur}s) ===\n`;
  for (let t = 0; t < dur; t += 0.1) {
    const a = i0 + Math.round(t * SR);
    const b = Math.min(mono.length, a + Math.round(0.1 * SR));
    let sum = 0;
    for (let k = a; k < b; k++) sum += mono[k] * mono[k];
    const rms = Math.sqrt(sum / Math.max(1, b - a));
    const db = rms > 1e-5 ? 20 * Math.log10(rms) : -60;
    const bars = Math.max(0, Math.min(20, Math.round((db + 45) / 2)));
    if (Math.round(t * 10) % 5 === 0) line += `\n${t.toFixed(1).padStart(4, ' ')}s: `;
    line += bars === 0 ? '.' : bars < 6 ? ':' : bars < 12 ? '+' : '#';
  }
  console.log(line);
}
