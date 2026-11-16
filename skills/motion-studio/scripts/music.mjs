#!/usr/bin/env node
// A music bed for a HyperFrames video, made on this computer: no account, no download, no licence.
//   node <skill>/scripts/music.mjs videos/<name> [--mood vibes|pulse|lofi|keys|pluck] [--loudness -16]
// Reads the video's length and scene starts (npx hyperframes timeline --json), lets the music change with the scenes
// and land its final chord about 2 s before the end, and writes assets/music.wav. Then ask HyperFrames to place it
// as the music bed under the whole video at full volume (an <audio> clip from 0 with a short fade out; it is already
// leveled); its audio skill carves it under a voiceover. Moods: vibes (light vibraphone and beat, the default), pulse (clean, modern, for corporate and
// data), lofi (warm piano and brushes), keys, pluck.
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { renderSound, wav, MOODS } from './sound.js';
import { hfEnv, run, hfCli } from './lib.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : d; };
const proj = resolve(args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--')) || '.');
if (!existsSync(join(proj, 'index.html'))) { console.error('cách dùng: music.mjs <thư mục video> [--mood vibes] [--loudness -16]'); process.exit(1); }
const mood = opt('mood', 'vibes');
if (!MOODS.includes(mood)) { console.error(`mood phải là một trong: ${MOODS.join(', ')}`); process.exit(1); }

const t = run('npx', ['-y', hfCli, 'timeline', '--json'], { cwd: proj, env: hfEnv(), capture: true });
let duration = Number(opt('seconds', 0)), starts = [0];
try {
  const tl = JSON.parse(t.out.slice(t.out.indexOf('{'))).timeline;
  duration = duration || tl.duration;
  starts = [...new Set(tl.tracks.flatMap((tr) => tr.rows).filter((r) => !r.nested && r.trackKind !== 'audio').map((r) => +r.absStart.toFixed(2)))].sort((a, b) => a - b);
} catch {}
if (!(duration > 0)) { console.error('không đọc được độ dài của video; hãy thêm --seconds N'); process.exit(1); }

// scene starts become the music's sections, in story order; the last scene is the payoff
const names = ['intro', 'problem', 'concept', 'example'];
const sections = starts.map((s, i) => [i === starts.length - 1 && i > 0 ? 'payoff' : names[Math.min(i, names.length - 1)], s]);
sections.push(['end', Math.max(1, duration - 2)]);
const r = renderSound({ duration, cues: [], music: { mood, sections }, loudness: Number(opt('loudness', -16)), effects: false });
mkdirSync(join(proj, 'assets'), { recursive: true });
const out = join(proj, 'assets', 'music.wav');
writeFileSync(out, wav(r.mix));
console.log(`${relative(process.cwd(), out) || out}: ${duration.toFixed(1)} giây, ${mood}, ${sections.length - 1} đoạn, ${r.report.after} LUFS`);
console.log('Tiếp theo: nhờ HyperFrames đặt file này làm nhạc nền cho cả video, giữ nguyên âm lượng (đã cân sẵn; nếu có voiceover thì để skill audio của nó hạ nhạc dưới giọng nói), bắt đầu từ 0 giây và nhỏ dần trong 1,5 giây cuối.');
