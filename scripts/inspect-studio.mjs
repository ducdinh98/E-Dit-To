import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const chrome = 'C:/Users/Cong Duc/.cache/hyperframes/chrome/chrome-headless-shell/win64-152.0.7977.30/chrome-headless-shell-win64/chrome-headless-shell.exe';
const port = 9344;
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
  console.log('Connected to page:', page.title, page.url);
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
      if (msg.params.type === 'error' || msg.params.type === 'warning') {
        console.log(`[CONSOLE ${msg.params.type}]`, txt);
      }
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      console.log('[EXCEPTION]', JSON.stringify(msg.params.exceptionDetails?.text));
    }
  });

  await call('Page.enable');
  await call('Runtime.enable');
  await call('Emulation.setDeviceMetricsOverride', { width: 1600, height: 1000, deviceScaleFactor: 1, mobile: false });

  await sleep(4000);

  // Screenshot at initial load
  const s0 = await call('Page.captureScreenshot', { format: 'png' });
  writeFileSync('C:/Users/Cong Duc/.gemini/antigravity/brain/bbfe727a-dcec-4197-bb7d-d882f0c9fe54/scratch/studio-t0.png', Buffer.from(s0.data, 'base64'));

  // Inspect DOM & iframe inside Studio!
  const info = await call('Runtime.evaluate', {
    expression: `(() => {
      const iframes = [...document.querySelectorAll('iframe')].map(f => ({
        src: f.src,
        srcdocLen: (f.srcdoc || '').length,
        rect: f.getBoundingClientRect(),
        innerInfo: (() => {
          try {
            const d = f.contentDocument;
            const root = d.getElementById('root');
            const hosts = [...d.querySelectorAll('[data-composition-src], [data-composition-id]')].map(el => ({
              id: el.id,
              compId: el.getAttribute('data-composition-id'),
              rect: el.getBoundingClientRect(),
              style: el.getAttribute('style'),
              computedDisplay: d.defaultView.getComputedStyle(el).display,
              computedOpacity: d.defaultView.getComputedStyle(el).opacity,
              computedVisibility: d.defaultView.getComputedStyle(el).visibility,
              childCount: el.children.length,
              innerHTMLSnippet: el.innerHTML.slice(0, 180)
            }));
            return { title: d.title, rootRect: root?.getBoundingClientRect(), hosts };
          } catch (e) { return { err: e.message }; }
        })()
      }));
      return JSON.stringify({ url: location.href, text: document.body.innerText.slice(0, 600), iframes }, null, 2);
    })()`,
    returnByValue: true
  });
  console.log(info.result.value);

  // Try seeking playhead by pressing right arrow or clicking timeline at ~15% (around 9.5s)
  await call('Runtime.evaluate', {
    expression: `(() => {
      // Find timeline ruler or video inside iframe
      const allEls = [...document.querySelectorAll('*')];
      const timeTexts = allEls.filter(e => e.children.length === 0 && /00:00|75\\.8|1:15/.test(e.textContent || '')).map(e => ({ tag: e.tagName, text: e.textContent, rect: e.getBoundingClientRect() }));
      return JSON.stringify(timeTexts);
    })()`,
    returnByValue: true
  }).then(r => console.log('Time elements:', r.result.value));

  ws.close();
} finally {
  proc.kill();
}
