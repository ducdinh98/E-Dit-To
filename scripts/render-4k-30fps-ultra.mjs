import { mkdirSync, rmSync, readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { mediaTools } from 'file:///C:/Users/Cong%20Duc/.gemini/config/skills/motion-studio/scripts/lib.mjs';
import { SR, wav } from 'file:///C:/Users/Cong%20Duc/.gemini/config/skills/motion-studio/scripts/sound.js';

const require = createRequire(import.meta.url);
const puppeteer = require('D:/cache/npm-cache/_npx/ac3b1248114d4dbf/node_modules/puppeteer-core');

const projDir = 'f:/App nha lam/motion-video-demo/videos/iphone-duo-review-5m';
const compDir = join(projDir, 'compositions');
const assetsDir = join(projDir, 'assets');
const rendersDir = join(projDir, 'renders');

// Canonical cache on D:\cache per Global Cache Policy
const workCacheDir = 'D:/cache/hf-4k30-ultra';
const framesDir = join(workCacheDir, 'frames');
const progressPath = join(workCacheDir, 'progress.json');
const sfxMasterPath = join(workCacheDir, 'sfx-master-v2.wav');
const concatListPath = join(workCacheDir, 'ffconcat.txt');
const transPngPath = join(workCacheDir, 'transparent-4k.png');

const masterSourceVideo = 'D:/Youtube HDD/Review iPhone Duo/Final/iPhone DUO.mp4';
const outRenderPath = join(rendersDir, 'iPhone_DUO_Motion_Full_4K_30fps.mp4');
const outFinalCopy = 'D:/Youtube HDD/Review iPhone Duo/Final/iPhone_DUO_Motion_Full_4K.mp4';

const chromePath = 'D:/cache/hyperframes/chrome/chrome-headless-shell/win64-152.0.7977.30/chrome-headless-shell-win64/chrome-headless-shell.exe';
const { ffmpeg } = mediaTools();

const FPS = 30;
const TOTAL_DUR = 1744.00;
const TOTAL_FRAMES = Math.round(TOTAL_DUR * FPS); // 52,320 frames

rmSync(framesDir, { recursive: true, force: true });
mkdirSync(rendersDir, { recursive: true });
mkdirSync(framesDir, { recursive: true });

const startTimeMs = Date.now();

function writeProgress(state) {
  try {
    writeFileSync(progressPath, JSON.stringify({
      startTimeMs,
      updatedAtMs: Date.now(),
      totalFrames: TOTAL_FRAMES,
      totalVideoSec: TOTAL_DUR,
      ...state,
    }));
  } catch {}
}

writeProgress({
  phase: 'init',
  phaseLabel: 'ĐANG KHỞI TẠO PIPELINE 4K 30FPS ULTRA GPU...',
  doneFrames: 0,
  pct: 0,
  fps: 0,
});

// 1. Create a 1x reusable 3840x2160 transparent RGBA PNG for pass-through windows
console.log('Generating reusable 3840x2160 transparent frame...');
spawnSync(ffmpeg, [
  '-y', '-f', 'lavfi',
  '-i', 'color=c=black@0.0:s=3840x2160,format=rgba',
  '-frames:v', '1',
  transPngPath
], { stdio: 'ignore' });

// 2. Parse scenes and CSS/text variables from index.html
const indexHtml = readFileSync(join(projDir, 'index.html'), 'utf8');
const varsMatch = indexHtml.match(/data-composition-variables='([^']+)'/);
const compVars = varsMatch ? JSON.parse(varsMatch[1]) : [];
const cssVarLines = compVars
  .filter(v => v.type === 'color')
  .map(v => `--${v.id}: ${v.default};`)
  .join(' ');

const tagRegex = /<div\b[^>]*data-composition-src="compositions\/(scene-\d+\.html)"[^>]*>/g;
const scenes = [];
let m;
while ((m = tagRegex.exec(indexHtml)) !== null) {
  const tag = m[0];
  const file = m[1];
  const idMatch = tag.match(/\bid="([^"]+)"/);
  const startMatch = tag.match(/\bdata-start="([^"]+)"/);
  const durMatch = tag.match(/\bdata-duration="([^"]+)"/);
  if (idMatch && startMatch && durMatch) {
    const start = parseFloat(startMatch[1]);
    const duration = parseFloat(durMatch[1]);
    scenes.push({
      id: idMatch[1],
      file,
      start,
      duration,
      startFrame: Math.round(start * FPS),
      endFrame: Math.min(TOTAL_FRAMES, Math.round((start + duration) * FPS)),
    });
  }
}

console.log(`Loaded ${scenes.length} scenes covering ${TOTAL_DUR}s (${TOTAL_FRAMES} frames @ ${FPS}fps).`);

// 3. Build full-length 1744.00s synced SFX master WAV from sfx-v2-s01.wav..sfx-v2-s25.wav
writeProgress({
  phase: 'audio',
  phaseLabel: 'ĐANG TRỘN MASTER AUDIO SFX 25 PHÂN CẢNH (48KHZ)...',
  doneFrames: 0,
  pct: 1.0,
  fps: 0,
});
console.log('Building full-length 1744.00s synced SFX master WAV...');
{
  const totalSamples = Math.ceil(TOTAL_DUR * SR);
  const masterL = new Float64Array(totalSamples);
  const masterR = new Float64Array(totalSamples);
  const sfxGain = 0.38;

  for (let i = 0; i < scenes.length; i++) {
    const pad = String(i + 1).padStart(2, '0');
    const sfxFile = join(assetsDir, `sfx-v2-s${pad}.wav`);
    if (!existsSync(sfxFile)) continue;
    const buf = readFileSync(sfxFile);
    const dataOffset = 44;
    const sampleFrames = Math.floor((buf.length - dataOffset) / 4);
    const startSample = Math.round(scenes[i].start * SR);
    for (let j = 0; j < sampleFrames && startSample + j < totalSamples; j++) {
      const off = dataOffset + j * 4;
      const sL = buf.readInt16LE(off) / 32768;
      const sR = buf.readInt16LE(off + 2) / 32768;
      masterL[startSample + j] += sL * sfxGain;
      masterR[startSample + j] += sR * sfxGain;
    }
  }
  writeFileSync(sfxMasterPath, wav([masterL, masterR]));
  console.log('Saved synced SFX master WAV:', sfxMasterPath);
}

// 4. Fetch GSAP once for deterministic in-memory execution
const gsapJs = await (await fetch('https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js')).text();

function buildStandaloneSceneHtml(sceneFile) {
  const raw = readFileSync(join(compDir, sceneFile), 'utf8');
  const tplMatch = raw.match(/<template>([\s\S]*?)<\/template>/i);
  const inner = tplMatch ? tplMatch[1] : raw;
  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <script>${gsapJs}</script>
  <style>
    :root { ${cssVarLines} }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 1920px;
      height: 1080px;
      margin: 0;
      padding: 0;
      background: transparent !important;
      overflow: hidden;
    }
    #root {
      position: relative;
      width: 1920px;
      height: 1080px;
      overflow: hidden;
      background: transparent;
    }
  </style>
</head>
<body>
  <script>window.__timelines = {};</script>
  ${inner}
  <script>
    window.__sceneTl = Object.values(window.__timelines)[0];
    window.__getTweenWindows = function() {
      const tl = window.__sceneTl;
      if (!tl) return [];
      const children = tl.getChildren(true, true, false);
      return children
        .filter(c => c.duration() <= 5.0)
        .map(c => ({
          start: c.startTime(),
          end: c.endTime()
        }));
    };
    window.__seekScene = function(t) {
      if (window.__sceneTl) {
        window.__sceneTl.seek(t, false);
      }
    };
  </script>
</body>
</html>`;
}

// 5. Phase 1: Parallel 8-Worker GPU Chrome 4K Capture of Unique Tween Frames
console.log('Launching 8-Worker HeadlessChrome with Hardware GPU at 4K (3840x2160)...');
const browser = await puppeteer.launch({
  executablePath: chromePath,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--use-gl=angle',
    '--use-angle=d3d11',
    '--enable-gpu-rasterization',
    '--enable-zero-copy',
    '--ignore-gpu-blocklist',
    '--font-render-hinting=none'
  ]
});

// Array mapping every global frame [0..TOTAL_FRAMES-1] to its PNG path on disk
const frameToFile = new Array(TOTAL_FRAMES).fill(transPngPath);

let capturedUniqueCount = 0;
let processedSceneFrames = 0;
const totalSceneFrames = scenes.reduce((acc, s) => acc + (s.endFrame - s.startFrame), 0);
let completedScenes = 0;
const captureStartMs = Date.now();

async function renderSceneWorker(scene) {
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 2 // 3840x2160 4K UHD
  });

  const html = buildStandaloneSceneHtml(scene.file);
  await page.setContent(html, { waitUntil: 'load', timeout: 60000 });
  await page.evaluate(async () => {
    if (document.fonts) {
      await Promise.race([
        Promise.all([
          document.fonts.load('900 48px "Be Vietnam Pro"'),
          document.fonts.load('700 24px "Be Vietnam Pro"'),
          document.fonts.load('800 20px "JetBrains Mono"'),
          document.fonts.load('400 64px "Archivo Black"'),
          document.fonts.ready,
        ]),
        new Promise((r) => setTimeout(r, 6000))
      ]);
    }
  });

  const windows = await page.evaluate(() => window.__getTweenWindows());
  let lastUniquePngPath = null;
  let lastCompletedCount = -1;
  let sceneUnique = 0;

  for (let f = scene.startFrame; f < scene.endFrame; f++) {
    const globalT = f / FPS;
    const localT = Math.max(0, globalT - scene.start);

    let inActiveTween = false;
    let completedCount = 0;
    for (const w of windows) {
      if (localT >= w.start - 0.04 && localT <= w.end + 0.04) {
        inActiveTween = true;
      }
      if (localT > w.end + 0.04) {
        completedCount++;
      }
    }

    const needCapture =
      f === scene.startFrame ||
      inActiveTween ||
      completedCount !== lastCompletedCount ||
      lastUniquePngPath === null;

    if (needCapture) {
      const pngPath = join(framesDir, `${scene.id}-f${String(f).padStart(6, '0')}.png`);
      await page.evaluate((t) => window.__seekScene(t), localT);
      await page.screenshot({
        path: pngPath,
        type: 'png',
        omitBackground: true,
        clip: { x: 0, y: 0, width: 1920, height: 1080 }
      });
      lastUniquePngPath = pngPath;
      lastCompletedCount = completedCount;
      sceneUnique++;
      capturedUniqueCount++;
    }

    frameToFile[f] = lastUniquePngPath;
    processedSceneFrames++;

    if (processedSceneFrames % 120 === 0) {
      const elapsedSec = Math.max(0.5, (Date.now() - captureStartMs) / 1000);
      const effectiveFps = processedSceneFrames / elapsedSec;
      const phase1Pct = Math.min(28, (processedSceneFrames / totalSceneFrames) * 28);
      const virtualDoneFrames = Math.round((phase1Pct / 100) * TOTAL_FRAMES);
      writeProgress({
        phase: 'capture_unique',
        phaseLabel: `GIAI ĐOẠN 1/2: CHỤP 4K GPU (8 WORKERS) · ${capturedUniqueCount} FRAME ĐỘC NHẤT`,
        doneFrames: virtualDoneFrames,
        pct: Number(phase1Pct.toFixed(2)),
        fps: Number(effectiveFps.toFixed(1)),
      });
    }
  }

  await page.close();
  completedScenes++;
  const elapsed = ((Date.now() - captureStartMs) / 1000).toFixed(1);
  console.log(`[${completedScenes}/${scenes.length}] ${scene.file}: ${sceneUnique} unique 4K frames captured (${elapsed}s)`);
}

const CONCURRENCY = 8;
const queue = [...scenes];
const workers = Array.from({ length: CONCURRENCY }, async () => {
  while (queue.length > 0) {
    const s = queue.shift();
    if (!s) break;
    await renderSceneWorker(s);
  }
});

await Promise.all(workers);
await browser.close();

const captureElapsedSec = ((Date.now() - captureStartMs) / 1000).toFixed(1);
console.log(`Phase 1 complete: ${capturedUniqueCount} unique 4K frames captured across ${scenes.length} scenes in ${captureElapsedSec}s.`);

// 6. Build zero-drift run-length-encoded ffconcat file for all 52,320 frames
console.log('Building zero-drift ffconcat schedule for 52,320 frames...');
{
  const lines = ['ffconcat version 1.0'];
  let prevTime = 0;
  let runStart = 0;
  for (let f = 1; f <= TOTAL_FRAMES; f++) {
    if (f === TOTAL_FRAMES || frameToFile[f] !== frameToFile[runStart]) {
      const targetTime = f / FPS;
      const segDur = (targetTime - prevTime).toFixed(6);
      prevTime += Number(segDur);
      const cleanPath = frameToFile[runStart].replace(/\\/g, '/');
      lines.push(`file '${cleanPath}'`);
      lines.push(`duration ${segDur}`);
      runStart = f;
    }
  }
  // Repeat last file per ffconcat spec
  const lastCleanPath = frameToFile[TOTAL_FRAMES - 1].replace(/\\/g, '/');
  lines.push(`file '${lastCleanPath}'`);
  writeFileSync(concatListPath, lines.join('\n'), 'utf8');
  console.log(`Saved ffconcat schedule with ${(lines.length - 2) / 2} segments.`);
}

// 7. Phase 2: Full-GPU CUDA Compositing (hwupload_cuda + overlay_cuda) & NVENC 4K 30fps Encode
console.log('Starting Phase 2: Full-GPU CUDA overlay_cuda + h264_nvenc 4K 30fps encode...');
const encodeStartMs = Date.now();

const ffArgs = [
  '-y',
  '-hwaccel', 'cuda',
  '-hwaccel_output_format', 'cuda',
  '-thread_queue_size', '1024',
  '-i', masterSourceVideo,
  '-reinit_filter', '0',
  '-threads', '16',
  '-thread_queue_size', '1024',
  '-f', 'concat',
  '-safe', '0',
  '-i', concatListPath,
  '-thread_queue_size', '1024',
  '-i', sfxMasterPath,
  '-filter_complex',
  '[0:v]scale_cuda=format=yuv420p[bg];[1:v]format=yuva420p,fps=30,hwupload_cuda[ov];[bg][ov]overlay_cuda=0:0:eof_action=pass[vout];[0:a]aresample=48000,volume=1.0[a0];[2:a]aresample=48000,volume=1.0[a1];[a0][a1]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[aout]',
  '-map', '[vout]',
  '-map', '[aout]',
  '-c:v', 'h264_nvenc',
  '-preset', 'p4',
  '-tune', 'hq',
  '-rc', 'vbr',
  '-cq', '18',
  '-b:v', '45M',
  '-maxrate', '68M',
  '-bufsize', '96M',
  '-r', '30',
  '-c:a', 'aac',
  '-b:a', '256k',
  '-ar', '48000',
  '-movflags', '+faststart',
  outRenderPath
];

await new Promise((resolve, reject) => {
  const proc = spawn(ffmpeg, ffArgs, { stdio: ['ignore', 'pipe', 'pipe'] });
  proc.stderr.on('data', (chunk) => {
    const str = chunk.toString();
    const fMatch = str.match(/frame=\s*(\d+)/);
    const fpsMatch = str.match(/fps=\s*([\d.]+)/);
    if (fMatch) {
      const encodedFrames = parseInt(fMatch[1], 10);
      const encFps = fpsMatch ? parseFloat(fpsMatch[1]) : 0;
      const overallPct = Math.min(99.9, 28 + (encodedFrames / TOTAL_FRAMES) * 72);
      writeProgress({
        phase: 'encode_cuda',
        phaseLabel: 'GIAI ĐOẠN 2/2: GHÉP 4K 30FPS BẰNG GPU CUDA + NVENC',
        doneFrames: encodedFrames,
        pct: Number(overallPct.toFixed(2)),
        fps: encFps,
      });
    }
  });
  proc.on('close', (code) => {
    if (code === 0) resolve();
    else reject(new Error(`FFmpeg CUDA encode exited with code ${code}`));
  });
});

console.log('Copying final 4K 30fps MP4 to destination folder...');
copyFileSync(outRenderPath, outFinalCopy);

writeProgress({
  phase: 'complete',
  phaseLabel: 'HOÀN TẤT THÀNH CÔNG 100% (4K 30FPS ULTRA GPU)!',
  doneFrames: TOTAL_FRAMES,
  pct: 100,
  fps: Number((TOTAL_FRAMES / ((Date.now() - startTimeMs) / 1000)).toFixed(1)),
  isCompleted: true,
});

// Clean up temporary frame PNGs while keeping progress.json
rmSync(framesDir, { recursive: true, force: true });
console.log(`ALL DONE in ${((Date.now() - startTimeMs) / 1000).toFixed(1)}s! Output: ${outFinalCopy}`);
