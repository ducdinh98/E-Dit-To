import { mkdirSync, rmSync, readFileSync, writeFileSync, linkSync, copyFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { mediaTools } from 'file:///C:/Users/Cong%20Duc/.gemini/config/skills/motion-studio/scripts/lib.mjs';
import { SR, wav } from 'file:///C:/Users/Cong%20Duc/.gemini/config/skills/motion-studio/scripts/sound.js';

const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/Cong Duc/AppData/Local/npm-cache/_npx/ac3b1248114d4dbf/node_modules/puppeteer-core');

const projDir = 'F:/App nha lam/motion-video-demo/videos/iphone-duo-quan-diem';
const compDir = join(projDir, 'compositions');
const assetsDir = join(projDir, 'assets');
const rendersDir = join(projDir, 'renders');
const framesDir = 'F:/App nha lam/motion-video-demo/.hf-2k-frames';

const masterSourceVideo = 'D:/Youtube HDD/iPhone DUO/IPHONE DUO QUAN DIEM DEMO.mp4';
const outRenderPath = join(rendersDir, 'iphone-duo-quan-diem-2k-30fps.mp4');
const outSourceDirCopy = 'D:/Youtube HDD/iPhone DUO/IPHONE DUO QUAN DIEM MOTION 2K 30FPS.mp4';

const chromePath = 'C:/Users/Cong Duc/.cache/hyperframes/chrome/chrome-headless-shell/win64-152.0.7977.30/chrome-headless-shell-win64/chrome-headless-shell.exe';
const { ffmpeg, ffprobe } = mediaTools();

const FPS = 30;
const TOTAL_DUR = 526.07;
const TOTAL_FRAMES = Math.round(TOTAL_DUR * FPS); // 15782 frames

mkdirSync(rendersDir, { recursive: true });
mkdirSync(framesDir, { recursive: true });

console.log('Fetching GSAP once for inline deterministic execution...');
const gsapJs = await (await fetch('https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js')).text();

// 1. Parse scenes from index.html (attribute-order independent)
const indexHtml = readFileSync(join(projDir, 'index.html'), 'utf8');
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
    scenes.push({
      id: idMatch[1],
      file,
      start: parseFloat(startMatch[1]),
      duration: parseFloat(durMatch[1]),
    });
  }
}

console.log(`Found ${scenes.length} scenes totaling ${TOTAL_DUR}s (${TOTAL_FRAMES} frames @ ${FPS}fps).`);

// Compute exact frame range [startFrame, endFrame) for each scene
for (let i = 0; i < scenes.length; i++) {
  const s = scenes[i];
  s.startFrame = i === 0 ? 0 : scenes[i - 1].endFrame;
  s.endFrame = i === scenes.length - 1 ? TOTAL_FRAMES : Math.round((s.start + s.duration) * FPS);
}

const sfxMasterPath = join(framesDir, 'sfx-master.wav');
if (!existsSync(sfxMasterPath)) {
  console.log('Building full-length 526.07s synced SFX master track...');
  const totalSamples = Math.ceil(TOTAL_DUR * SR);
  const masterL = new Float64Array(totalSamples);
  const masterR = new Float64Array(totalSamples);
  const sfxGain = 0.38;

  for (let i = 0; i < scenes.length; i++) {
    const sfxFile = join(assetsDir, `sfx-s${String(i + 1).padStart(2, '0')}.wav`);
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
  console.log('Saved SFX master WAV:', sfxMasterPath);
} else {
  console.log('Reusing existing SFX master WAV:', sfxMasterPath);
}

// 3. Build standalone HTML wrapper for a scene composition
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
      const children = tl.getChildren(true, true, true);
      return children.map(c => ({
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

// 4. Render all 18 scenes in parallel using 6 Chrome pages at 2560x1440 (deviceScaleFactor = 2560/1920)
console.log('Launching HeadlessChrome with hardware GPU at 2560x1440 (2K)...');
const browser = await puppeteer.launch({
  executablePath: chromePath,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--use-gl=angle',
    '--use-angle=d3d11',
    '--enable-gpu-rasterization',
    '--ignore-gpu-blocklist',
    '--font-render-hinting=none'
  ]
});

let totalUniqueFrames = 0;
let totalLinkedFrames = 0;
let completedScenes = 0;
const t0 = Date.now();

async function renderSceneOnPage(scene) {
  const firstFramePath = join(framesDir, `frame-${String(scene.startFrame).padStart(6, '0')}.png`);
  const lastFramePath = join(framesDir, `frame-${String(scene.endFrame - 1).padStart(6, '0')}.png`);
  if (scene.startFrame < 5017 && existsSync(firstFramePath) && existsSync(lastFramePath) && statSync(lastFramePath).size > 0) {
    completedScenes++;
    console.log(`[${completedScenes}/${scenes.length}] ${scene.file} (${scene.startFrame}..${scene.endFrame - 1}): already rendered, skipping.`);
    return;
  }

  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 2560 / 1920
  });

  const html = buildStandaloneSceneHtml(scene.file);
  await page.setContent(html, { waitUntil: 'load', timeout: 45000 });
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) {
      await Promise.race([
        document.fonts.ready,
        new Promise((r) => setTimeout(r, 5000))
      ]);
    }
  });
  const windows = await page.evaluate(() => window.__getTweenWindows());
  if (!windows || windows.length === 0) {
    throw new Error(`Scene ${scene.file} returned 0 tween windows!`);
  }

  let lastUniquePngPath = null;
  let linksToCurrentFile = 0;
  let lastCompletedCount = -1;
  let sceneUnique = 0;
  let sceneLinked = 0;

  for (let f = scene.startFrame; f < scene.endFrame; f++) {
    const globalT = f / FPS;
    const localT = Math.max(0, globalT - scene.start);
    const framePath = join(framesDir, `frame-${String(f).padStart(6, '0')}.png`);
    if (existsSync(framePath)) {
      rmSync(framePath, { force: true });
    }

    // Check if localT is inside any active tween window (with +/- 0.05s safety margin)
    let inActiveTween = false;
    let completedCount = 0;
    for (const w of windows) {
      if (localT >= w.start - 0.05 && localT <= w.end + 0.05) {
        inActiveTween = true;
      }
      if (localT > w.end + 0.05) {
        completedCount++;
      }
    }

    const needCapture =
      f === scene.startFrame ||
      inActiveTween ||
      completedCount !== lastCompletedCount ||
      lastUniquePngPath === null;

    if (needCapture) {
      await page.evaluate((t) => window.__seekScene(t), localT);
      await page.screenshot({
        path: framePath,
        type: 'png',
        omitBackground: true,
        clip: { x: 0, y: 0, width: 1920, height: 1080 }
      });
      lastUniquePngPath = framePath;
      linksToCurrentFile = 0;
      lastCompletedCount = completedCount;
      sceneUnique++;
      totalUniqueFrames++;
    } else {
      // NTFS max hardlinks per file is 1023; start a fresh copy every 700 links
      if (linksToCurrentFile >= 700) {
        copyFileSync(lastUniquePngPath, framePath);
        lastUniquePngPath = framePath;
        linksToCurrentFile = 0;
      } else {
        linkSync(lastUniquePngPath, framePath);
        linksToCurrentFile++;
      }
      sceneLinked++;
      totalLinkedFrames++;
    }
  }

  await page.close();
  completedScenes++;
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`[${completedScenes}/${scenes.length}] ${scene.file} (${scene.startFrame}..${scene.endFrame - 1}): ${sceneUnique} captured, ${sceneLinked} linked (${elapsed}s)`);
}

const CONCURRENCY = 4;
const queue = [...scenes];
const workers = Array.from({ length: CONCURRENCY }, async () => {
  while (queue.length > 0) {
    const s = queue.shift();
    if (!s) break;
    await renderSceneOnPage(s);
  }
});

await Promise.all(workers);
await browser.close();

console.log(`All ${TOTAL_FRAMES} 2K RGBA frames ready (${totalUniqueFrames} unique captured, ${totalLinkedFrames} hardlinked) in ${((Date.now() - t0) / 1000).toFixed(1)}s.`);

// 5. Composite 4K master source video -> 2K (2560x1440) 30fps + 2K RGBA overlay + synced SFX using NVIDIA NVENC
console.log('Encoding final 2K (2560x1440) 30fps MP4 via FFmpeg h264_nvenc...');
const encodeStart = Date.now();

const ffArgs = [
  '-y',
  '-i', masterSourceVideo,
  '-framerate', '30',
  '-i', join(framesDir, 'frame-%06d.png'),
  '-i', sfxMasterPath,
  '-filter_complex',
  '[0:v]scale=2560:1440:flags=lanczos,fps=30[bg];[bg][1:v]overlay=0:0:format=auto,format=yuv420p[vout];[0:a]volume=1.0[a0];[2:a]volume=1.0[a1];[a0][a1]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[aout]',
  '-map', '[vout]',
  '-map', '[aout]',
  '-c:v', 'h264_nvenc',
  '-preset', 'p6',
  '-tune', 'hq',
  '-rc', 'vbr',
  '-cq', '18',
  '-b:v', '20M',
  '-maxrate', '32M',
  '-bufsize', '48M',
  '-r', '30',
  '-c:a', 'aac',
  '-b:a', '256k',
  '-ar', '48000',
  '-movflags', '+faststart',
  outRenderPath
];

await new Promise((resolve, reject) => {
  const proc = spawn(ffmpeg, ffArgs, { stdio: ['ignore', 'pipe', 'pipe'] });
  let lastLog = 0;
  proc.stderr.on('data', (chunk) => {
    const line = chunk.toString();
    const mTime = line.match(/time=(\d+:\d+:\d+\.\d+)/);
    if (mTime && Date.now() - lastLog > 4000) {
      lastLog = Date.now();
      console.log(`  FFmpeg progress: time=${mTime[1]}`);
    }
  });
  proc.on('close', (code) => {
    if (code === 0) resolve();
    else reject(new Error(`FFmpeg exited with code ${code}`));
  });
});

console.log(`Encoded 2K 30fps MP4 in ${((Date.now() - encodeStart) / 1000).toFixed(1)}s: ${outRenderPath}`);

// Copy to D:\Youtube HDD\iPhone DUO\ as well for user convenience
copyFileSync(outRenderPath, outSourceDirCopy);
console.log(`Copied output to: ${outSourceDirCopy}`);

// Clean up temporary frame directory
rmSync(framesDir, { recursive: true, force: true });
console.log('Cleaned up temporary 2K frame cache.');
