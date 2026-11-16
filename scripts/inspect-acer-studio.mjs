import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const chrome = 'C:/Users/Cong Duc/.cache/hyperframes/chrome/chrome-headless-shell/win64-152.0.7977.30/chrome-headless-shell-win64/chrome-headless-shell.exe';
const port = 9346;
const proc = spawn(chrome, [
  `--remote-debugging-port=${port}`,
  '--window-size=1600,1000',
  '--no-first-run',
  '--no-default-browser-check',
  'http://localhost:3002/#project/acer250trieu-lite'
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await sleep(3000);

try {
  const res = await fetch(`http://127.0.0.1:${port}/json`);
  const targets = await res.json();
  const page = targets.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));

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
  await sleep(4000);

  const evalRes = await call('Runtime.evaluate', {
    expression: `(() => {
      const lintBtn = [...document.querySelectorAll('*')].find(e => /lint/i.test(e.textContent) && e.children.length <= 2);
      const iframes = [...document.querySelectorAll('iframe')].map(f => ({
        src: f.src,
        w: f.clientWidth,
        h: f.clientHeight,
        rect: f.getBoundingClientRect()
      }));
      const panels = [...document.querySelectorAll('[class*="panel"], [class*="drawer"], [class*="layout"], [class*="view"]')].map(p => ({
        tag: p.tagName,
        cls: p.className,
        rect: p.getBoundingClientRect()
      }));
      return JSON.stringify({
        title: document.title,
        lintText: lintBtn ? lintBtn.textContent.trim() : null,
        iframes,
        bodyTextSnippet: document.body.innerText.slice(0, 500)
      }, null, 2);
    })()`,
    returnByValue: true
  });
  console.log('STUDIO STATE:', evalRes.result.value);

  // Take screenshot of what Studio looks like
  const s = await call('Page.captureScreenshot', { format: 'png' });
  writeFileSync('D:/cache/studio-screen-inspect.png', Buffer.from(s.data, 'base64'));
  console.log('Saved screenshot to D:/cache/studio-screen-inspect.png');

  ws.close();
} finally {
  proc.kill();
}
