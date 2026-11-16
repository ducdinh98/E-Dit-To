import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const chrome = 'C:/Users/Cong Duc/.cache/hyperframes/chrome/chrome-headless-shell/win64-152.0.7977.30/chrome-headless-shell-win64/chrome-headless-shell.exe';
const port = 9346;
const proc = spawn(chrome, [
  `--remote-debugging-port=${port}`,
  '--window-size=1600,1000',
  '--no-first-run',
  '--no-default-browser-check',
  'http://localhost:3002/#project/viesnap-demo'
], { stdio: 'ignore', shell: false });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

try {
  let targets = null;
  for (let i = 0; i < 30; i++) {
    await sleep(300);
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json`);
      targets = await res.json();
      if (targets.some((t) => t.type === 'page')) break;
    } catch {}
  }
  const page = targets.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res) => ws.addEventListener('open', res, { once: true }));

  let id = 1;
  const call = (method, params = {}) => new Promise((res, rej) => {
    const cid = id++;
    const handler = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id === cid) {
        ws.removeEventListener('message', handler);
        if (msg.error) rej(msg.error);
        else res(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: cid, method, params }));
  });

  await call('Page.enable');
  await call('Runtime.enable');
  await call('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
  await call('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
  await sleep(2000);
  // Press Space to play!
  await call('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
  await call('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
  await sleep(2800);
  const sPlay = await call('Page.captureScreenshot', { format: 'png' });
  writeFileSync('C:/Users/Cong Duc/.gemini/antigravity/brain/bbfe727a-dcec-4197-bb7d-d882f0c9fe54/scratch/studio-play.png', Buffer.from(sPlay.data, 'base64'));

  // Inspect iframe inside HYPERFRAMES-PLAYER shadowRoot!
  const playerInfo = await call('Runtime.evaluate', {
    expression: `(() => {
      const hp = document.querySelector('hyperframes-player');
      if (!hp || !hp.shadowRoot) return 'no player';
      const ifr = hp.shadowRoot.querySelector('iframe');
      if (!ifr) return 'no iframe in shadowRoot: ' + hp.shadowRoot.innerHTML.slice(0, 400);
      const d = ifr.contentDocument;
      return JSON.stringify({
        iframeRect: ifr.getBoundingClientRect(),
        timelines: Object.keys(ifr.contentWindow.__timelines || {}),
        hosts: [...d.querySelectorAll('[data-composition-id]')].map(e => ({
          id: e.id,
          comp: e.getAttribute('data-composition-id'),
          vis: d.defaultView.getComputedStyle(e).visibility,
          disp: d.defaultView.getComputedStyle(e).display,
          op: d.defaultView.getComputedStyle(e).opacity
        }))
      }, null, 2);
    })()`,
    returnByValue: true
  });
  console.log(playerInfo.result.value);

  ws.close();
} finally {
  proc.kill();
}
