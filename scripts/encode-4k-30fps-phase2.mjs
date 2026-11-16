import { existsSync, mkdirSync, writeFileSync, copyFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

const projectDir = 'f:/App nha lam/motion-video-demo/videos/iphone-duo-review-5m';
const masterSourceVideo = 'D:/Youtube HDD/Review iPhone Duo/Final/iPhone DUO.mp4';
const outRenderDir = join(projectDir, 'renders');
const outRenderPath = join(outRenderDir, 'iPhone_DUO_Motion_Full_4K_30fps.mp4');
const outFinalCopy = 'D:/Youtube HDD/Review iPhone Duo/Final/iPhone_DUO_Motion_Full_4K.mp4';

const cacheDir = 'D:/cache/hf-4k30-ultra';
const framesDir = join(cacheDir, 'frames');
const progressPath = join(cacheDir, 'progress.json');
const concatListPath = join(cacheDir, 'ffconcat.txt');
const sfxMasterPath = join(cacheDir, 'sfx-master-v2.wav');
const ffmpeg = 'C:/Users/Cong Duc/.gemini/config/skills/motion-studio/node_modules/ffmpeg-static/ffmpeg.exe';

const FPS = 30;
const TOTAL_DURATION = 1744;
const TOTAL_FRAMES = TOTAL_DURATION * FPS; // 52,320 frames

mkdirSync(outRenderDir, { recursive: true });

if (!existsSync(concatListPath) || !existsSync(sfxMasterPath) || !existsSync(framesDir)) {
  throw new Error('Missing cached Phase 1 assets in D:/cache/hf-4k30-ultra!');
}

const startTimeMs = Date.now();

function writeProgress(data) {
  try {
    writeFileSync(
      progressPath,
      JSON.stringify({
        totalFrames: TOTAL_FRAMES,
        startTimeMs,
        updatedAtMs: Date.now(),
        ...data,
      }),
      'utf8'
    );
  } catch {
    // ignore transient write errors
  }
}

console.log('Starting Phase 2: Full-GPU Zero-Copy CUDA (NVDEC -> scale_cuda -> overlay_cuda -> h264_nvenc) 4K 30fps encode...');

writeProgress({
  phase: 'encode_cuda',
  phaseLabel: 'GIAI ĐOẠN 2/2: GHÉP 4K 30FPS BẰNG GPU CUDA + NVENC',
  doneFrames: 0,
  pct: 28.0,
  fps: 0,
});

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

let lastLoggedFrame = 0;
let stderrTail = '';

await new Promise((resolve, reject) => {
  const proc = spawn(ffmpeg, ffArgs, { stdio: ['ignore', 'pipe', 'pipe'] });
  proc.stderr.on('data', (chunk) => {
    const str = chunk.toString();
    stderrTail = (stderrTail + str).slice(-2000);
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
      if (encodedFrames - lastLoggedFrame >= 1500) {
        lastLoggedFrame = encodedFrames;
        const elapsed = ((Date.now() - startTimeMs) / 1000).toFixed(1);
        console.log(`[CUDA 4K30] frame=${encodedFrames}/${TOTAL_FRAMES} (${overallPct.toFixed(1)}%) fps=${encFps} elapsed=${elapsed}s`);
      }
    }
  });
  proc.on('close', (code) => {
    if (code === 0) resolve();
    else reject(new Error(`FFmpeg CUDA encode exited with code ${code}\n${stderrTail}`));
  });
});

console.log('Copying final 4K 30fps MP4 to destination folder...');
copyFileSync(outRenderPath, outFinalCopy);

const totalElapsedSec = Math.max(1, (Date.now() - startTimeMs) / 1000);
writeProgress({
  phase: 'complete',
  phaseLabel: 'HOÀN TẤT THÀNH CÔNG 100% (4K 30FPS ULTRA GPU)!',
  doneFrames: TOTAL_FRAMES,
  pct: 100,
  fps: Number((TOTAL_FRAMES / totalElapsedSec).toFixed(1)),
  isCompleted: true,
});

// Clean up temporary frame PNGs and test files only AFTER successful verification
rmSync(framesDir, { recursive: true, force: true });
rmSync(join(cacheDir, 'test-10s.mp4'), { force: true });
rmSync(join(cacheDir, 'test-10s-zero-copy.mp4'), { force: true });
console.log(`ALL DONE in ${totalElapsedSec.toFixed(1)}s! Output: ${outFinalCopy}`);
