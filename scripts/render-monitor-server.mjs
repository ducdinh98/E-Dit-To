import http from 'node:http';
import fs from 'node:fs';

const PORT = 3005;
const PROGRESS_JSON_PATH = 'D:\\cache\\hf-4k30-ultra\\progress.json';
const TOTAL_FRAMES = 52320;
const TOTAL_VIDEO_SEC = 1744.00;

function formatDuration(sec) {
  if (isNaN(sec) || sec < 0) return '00:00:00';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatClock(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleTimeString('vi-VN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function getProgress() {
  const now = Date.now();
  let startTimeMs = now - 1000;
  let done = 0;
  let exactPct = 0;
  let fps = 0;
  let phaseLabel = 'ĐANG KHỞI TẠO PIPELINE 4K 30FPS ULTRA GPU...';
  let isCompleted = false;

  try {
    const raw = fs.readFileSync(PROGRESS_JSON_PATH, 'utf8');
    const data = JSON.parse(raw);
    startTimeMs = data.startTimeMs || startTimeMs;
    done = Number(data.doneFrames || 0);
    exactPct = Number(data.pct || 0);
    fps = Number(data.fps || 0);
    phaseLabel = data.phaseLabel || phaseLabel;
    isCompleted = Boolean(data.isCompleted);
  } catch (err) {
    // fallback
  }

  const elapsedSec = Math.max(1, (now - startTimeMs) / 1000);
  const remainingPct = Math.max(0, 100 - exactPct);
  const pctPerSec = exactPct > 0.5 ? exactPct / elapsedSec : 0;
  const remainingSec = isCompleted ? 0 : (pctPerSec > 0 ? remainingPct / pctPerSec : 0);
  const etaTimestamp = now + remainingSec * 1000;
  const videoCurrentSec = (exactPct / 100) * TOTAL_VIDEO_SEC;

  return {
    done,
    total: TOTAL_FRAMES,
    exactPct: Number(exactPct.toFixed(2)),
    fps: Number(fps.toFixed(2)),
    elapsedFormatted: formatDuration(elapsedSec),
    remainingFormatted: formatDuration(remainingSec),
    etaClock: formatClock(etaTimestamp),
    videoCurrent: formatDuration(videoCurrentSec).slice(3), // mm:ss
    videoTotal: formatDuration(TOTAL_VIDEO_SEC).slice(3), // mm:ss
    phaseLabel,
    isCompleted,
  };
}

const HTML = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>HyperFrames 4K 60FPS Live Render Monitor</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0B0D11;
      color: #E2E8F0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: #14171F;
      border: 1px solid #232936;
      border-radius: 18px;
      width: 100%;
      max-width: 820px;
      padding: 32px 36px;
      box-shadow: 0 20px 45px rgba(0,0,0,0.6);
      position: relative;
      overflow: hidden;
    }
    .badge-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(16, 185, 129, 0.15);
      color: #10B981;
      border: 1px solid rgba(16, 185, 129, 0.35);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .pulse-dot {
      width: 9px;
      height: 9px;
      background: #10B981;
      border-radius: 50%;
      box-shadow: 0 0 10px #10B981;
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    .spec-tag {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 13px;
      color: #94A3B8;
      background: #1E232F;
      padding: 6px 12px;
      border-radius: 8px;
    }
    h1 {
      font-size: 24px;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 6px;
    }
    .subtitle {
      font-size: 14px;
      color: #94A3B8;
      margin-bottom: 28px;
      word-break: break-all;
    }
    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 10px;
    }
    .pct-big {
      font-size: 52px;
      font-weight: 900;
      color: #F5C518;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      letter-spacing: -1px;
    }
    .frames-count {
      font-size: 16px;
      color: #94A3B8;
      font-family: ui-monospace, monospace;
      font-weight: 600;
    }
    .frames-count span {
      color: #FFFFFF;
      font-size: 20px;
      font-weight: 800;
    }
    .progress-track {
      width: 100%;
      height: 22px;
      background: #232936;
      border-radius: 11px;
      overflow: hidden;
      margin-bottom: 28px;
      border: 1px solid #333C4D;
      position: relative;
    }
    .progress-fill {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #10B981, #F5C518);
      border-radius: 11px;
      transition: width 0.3s ease;
      position: relative;
      box-shadow: 0 0 16px rgba(245, 197, 24, 0.4);
    }
    .progress-fill::after {
      content: "";
      position: absolute;
      top: 0; left: 0; bottom: 0; right: 0;
      background-image: linear-gradient(
        -45deg,
        rgba(255, 255, 255, 0.15) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.15) 50%,
        rgba(255, 255, 255, 0.15) 75%,
        transparent 75%,
        transparent
      );
      background-size: 30px 30px;
      animation: moveStripes 1.5s linear infinite;
    }
    @keyframes moveStripes {
      0% { background-position: 0 0; }
      100% { background-position: 30px 0; }
    }
    .grid-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-box {
      background: #1A1F2B;
      border: 1px solid #283042;
      border-radius: 12px;
      padding: 16px 18px;
    }
    .stat-label {
      font-size: 12px;
      font-weight: 600;
      color: #94A3B8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .stat-value {
      font-size: 19px;
      font-weight: 800;
      color: #FFFFFF;
      font-family: ui-monospace, monospace;
    }
    .stat-value.highlight {
      color: #38BDF8;
    }
    .footer-bar {
      border-top: 1px solid #232936;
      padding-top: 18px;
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #64748B;
    }
    .footer-bar strong {
      color: #94A3B8;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge-bar">
      <div class="status-badge" id="badge">
        <span class="pulse-dot"></span>
        <span id="badge-text">ĐANG STREAM RENDER REALTIME</span>
      </div>
      <div class="spec-tag">4K · 30FPS · 3 WORKERS · NVENC GPU · RTX 3060</div>
    </div>

    <h1>Render Tiến Trình Video iPhone DUO</h1>
    <div class="subtitle">Đích đến: D:\\Youtube HDD\\Review iPhone Duo\\Final\\iPhone_DUO_Motion_Full_4K.mp4</div>

    <div class="progress-header">
      <div class="pct-big"><span id="pct">0.00</span>%</div>
      <div class="frames-count">Frame <span id="done">0</span> / 52.320</div>
    </div>

    <div class="progress-track">
      <div class="progress-fill" id="bar"></div>
    </div>

    <div class="grid-stats">
      <div class="stat-box">
        <div class="stat-label">Thời Lượng Video</div>
        <div class="stat-value highlight" id="video-time">00:00 / 29:04</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Tốc Độ Render</div>
        <div class="stat-value" id="fps-val">0.00 fps</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Thời Gian Đã Chạy</div>
        <div class="stat-value" id="elapsed">00:00:00</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Thời Gian Còn Lại (ETA)</div>
        <div class="stat-value" id="remaining">00:00:00</div>
      </div>
    </div>

    <div class="footer-bar">
      <div>Dự kiến hoàn thành lúc: <strong id="clock">--:--:--</strong></div>
      <div>Cơ chế: <strong>Direct Memory Stream (0 byte ảnh đĩa)</strong></div>
    </div>
  </div>

  <script>
    async function update() {
      try {
        const res = await fetch('/api/progress');
        if (!res.ok) return;
        const data = await res.json();
        document.getElementById('pct').textContent = data.exactPct.toFixed(2);
        document.getElementById('done').textContent = data.done.toLocaleString('vi-VN');
        document.getElementById('bar').style.width = Math.min(100, Math.max(0, data.exactPct)) + '%';
        document.getElementById('video-time').textContent = data.videoCurrent + ' / ' + data.videoTotal;
        document.getElementById('fps-val').textContent = data.fps.toFixed(2) + ' fps';
        document.getElementById('elapsed').textContent = data.elapsedFormatted;
        document.getElementById('remaining').textContent = data.remainingFormatted;
        document.getElementById('clock').textContent = data.etaClock;
        if (data.phaseLabel) {
          document.getElementById('badge-text').textContent = data.phaseLabel;
        }
        if (data.isCompleted) {
          document.getElementById('badge-text').textContent = 'HOÀN TẤT THÀNH CÔNG!';
          document.getElementById('badge').style.background = 'rgba(16, 185, 129, 0.3)';
        }
      } catch (e) {}
    }
    setInterval(update, 800);
    update();
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  const url = req.url || '/';
  if (url === '/api/progress') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
    });
    res.end(JSON.stringify(getProgress()));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(HTML);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Render monitor dashboard running at http://localhost:${PORT}`);
});
