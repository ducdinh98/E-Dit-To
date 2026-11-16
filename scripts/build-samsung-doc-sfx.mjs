import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { mediaTools } from 'file:///C:/Users/Cong%20Duc/.gemini/config/skills/motion-studio/scripts/lib.mjs';
import { SR, renderEffects, wav } from 'file:///C:/Users/Cong%20Duc/.gemini/config/skills/motion-studio/scripts/sound.js';

const srcDir = 'C:/Users/Cong Duc/.gemini/config/skills/media-use/audio/assets/sfx';
const outDir = 'videos/samsung-documentary/assets/sfx';
mkdirSync(outDir, { recursive: true });

const { ffmpeg } = mediaTools();
const ffmpegBin = ffmpeg || 'ffmpeg';

const samples = [
  'pop',
  'whoosh-short',
  'click-soft',
  'key-press',
  'ping',
  'chime',
  'notification',
  'error',
  'sparkle',
];

const manifest = {};

function wavDurationSec(wavPath) {
  const buf = readFileSync(wavPath);
  const dataBytes = buf.length - 44;
  return +(dataBytes / (SR * 4)).toFixed(3);
}

for (const name of samples) {
  const inPath = join(srcDir, `${name}.mp3`);
  const outPath = join(outDir, `${name}.wav`);
  if (!existsSync(inPath)) {
    throw new Error(`Missing SFX source: ${inPath}`);
  }
  const r = spawnSync(
    ffmpegBin,
    [
      '-y',
      '-i', inPath,
      '-af', 'silenceremove=start_periods=1:start_threshold=-38dB,afade=t=in:d=0.004,volume=-3dB',
      '-ar', String(SR),
      '-ac', '2',
      '-c:a', 'pcm_s16le',
      outPath,
    ],
    { encoding: 'utf8' }
  );
  if (r.status !== 0) {
    throw new Error(`ffmpeg failed for ${name}: ${r.stderr}`);
  }
  manifest[name] = wavDurationSec(outPath);
}

// Synthesize low-end stamp/door thump via motion-studio DSP engine
const nThump = Math.floor(0.28 * SR);
const [L, R] = renderEffects([['thump', 0, { g: 16 }]], nThump);
let peak = 0;
for (let i = 0; i < L.length; i++) {
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const normGain = peak > 0 ? 0.72 / peak : 1;
for (let i = 0; i < L.length; i++) {
  L[i] *= normGain;
  R[i] *= normGain;
}
const thumpPath = join(outDir, 'thump.wav');
writeFileSync(thumpPath, wav([L, R]));
manifest.thump = wavDurationSec(thumpPath);

writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('Samsung Documentary SFX ready:', manifest);
