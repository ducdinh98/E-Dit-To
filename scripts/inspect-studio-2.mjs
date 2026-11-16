import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const chrome = 'C:/Users/Cong Duc/.cache/hyperframes/chrome/chrome-headless-shell/win64-152.0.7977.30/chrome-headless-shell-win64/chrome-headless-shell.exe';
const port = 9345;
const proc = spawn(chrome, [
  `--remote-debugging-port=${port}`,
  '--window-size=1600,1000',
  '--no-first-run',
  '--no-default-browser-check',
  'http://localhost:3002/#project/viesnap-demo?v=1&t=3.6&tab=design&rc=0'
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

  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      const txt = msg.params.args.map((a) => a.value ?? a.description ?? '').join(' ');
      console.log(`[CONSOLE ${msg.params.type}]`, txt);
    }
  });

  await call('Page.enable');
  await call('Runtime.enable');
  await call('Emulation.setDeviceMetricsOverride', { width: 1600, height: 1000, deviceScaleFactor: 1, mobile: false });

  await sleep(4500);
  const s1 = await call('Page.captureScreenshot', { format: 'png' });
  writeFileSync('C:/Users/Cong Duc/.gemini/antigravity/brain/bbfe727a-dcec-4197-bb7d-d882f0c9fe54/scratch/studio-t36.png', Buffer.from(s1.data, 'base64'));

  // Navigate to t=9.5 (which was in original contact-sheet.jpg!)
  await call('Page.navigate', { url: 'http://localhost:3002/#project/viesnap-demo?v=1&t=9.5&tab=design&rc=0' });
  await sleep(2500);
  const s2 = await call('Page.captureScreenshot', { format: 'png' });
  writeFileSync('C:/Users/Cong Duc/.gemini/antigravity/brain/bbfe727a-dcec-4197-bb7d-d882f0c9fe54/scratch/studio-t95.png', Buffer.from(s2.data, 'base64'));

  // Navigate to t=18 (which was in original contact-sheet.jpg!)
  await call('Page.navigate', { url: 'http://localhost:3002/#project/viesnap-demo?v=1&t=18&tab=design&rc=0' });
  await sleep(2500);
  const s3 = await call('Page.captureScreenshot', { format: 'png' });
  writeFileSync('C:/Users/Cong Duc/.gemini/antigravity/brain/bbfe727a-dcec-4197-bb7d-d882f0c9fe54/scratch/studio-t18.png', Buffer.from(s3.data, 'base64'));

  // Also inspect shadow roots / preview container DOM!
  const domDump = await call('Runtime.evaluate', {
    expression: `(() => {
      function walk(node, out = []) {
        if (node.shadowRoot) {
          out.push({ host: node.tagName + '#' + node.id + '.' + node.className, htmlLen: node.shadowRoot.innerHTML.length, iframes: node.shadowRoot.querySelectorAll('iframe').length });
          for (const c of node.shadowRoot.querySelectorAll('*')) walk(c, out);
        }
        for (const c of node.children || []) walk(c, out);
        return out;
      }
      const shadows = walk(document.documentElement);
      // Check if there is any element with id="root" or data-composition-id in document or shadowRoots
      const compEls = [...document.querySelectorAll('[data-composition-id]')].map(e => ({
        id: e.id,
        comp: e.getAttribute('data-composition-id'),
        rect: e.getBoundingClientRect(),
        vis: getComputedStyle(e).visibility,
        disp: getComputedStyle(e).display,
        op: getComputedStyle(e).opacity,
        children: e.children.length
      }));
      return JSON.stringify({ shadows, compEls }, null, 2);
    })()`,
    returnByValue: true
  });
  console.log(domDump.result.value);

  ws.close();
} finally {
  proc.kill();
}
