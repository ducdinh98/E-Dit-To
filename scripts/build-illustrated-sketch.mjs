import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const proj = 'F:/App nha lam/motion-video-demo/videos/viesnap-illustrated';
const compDir = join(proj, 'compositions');
const boardsDir = join(proj, 'boards');
mkdirSync(compDir, { recursive: true });
mkdirSync(join(boardsDir, 'stills'), { recursive: true });

const FONT_LINK = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Be+Vietnam+Pro:wght@600;700;800;900&family=JetBrains+Mono:wght@500;700;800&family=Space+Grotesk:wght@500;700&display=swap" />`;
const GSAP_SCRIPT = `<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>`;

const VN_FLAG_SVG = `<svg width="34" height="24" viewBox="0 0 34 24" style="vertical-align:-4px;margin-right:8px;border:2px solid #EFE9D9;display:inline-block;"><rect width="34" height="24" fill="#DA251D"/><polygon points="17,4 19.3,10.8 26.5,10.8 20.7,15 22.9,21.8 17,17.6 11.1,21.8 13.3,15 7.5,10.8 14.7,10.8" fill="#F5C518"/></svg>`;

const COMMON_CSS = `
  * { box-sizing: border-box; }
  #root {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    container-type: size;
    background: var(--bg_cream, #EFE9D9);
    color: #0F0F0F;
    font-family: "Be Vietnam Pro", "Space Grotesk", sans-serif;
  }
  .ground-fill {
    position: absolute;
    inset: 0;
    background: var(--bg_cream, #EFE9D9);
  }
  .ground-green {
    position: absolute;
    inset: 0;
    background: var(--accent_green, #1F8A4C);
  }
  /* Frame Chrome (frame.md) */
  .cm-topbar {
    position: absolute;
    top: 48px;
    left: 56px;
    right: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 20;
  }
  .cm-sec-label {
    font-family: "JetBrains Mono", monospace;
    font-size: 21px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #0F0F0F;
  }
  .cm-pill {
    font-family: "JetBrains Mono", monospace;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 7px 20px;
    border: 3px solid #0F0F0F;
    border-radius: 999px;
    background: #EFE9D9;
    color: #0F0F0F;
  }
  .cm-footer {
    position: absolute;
    bottom: 44px;
    left: 56px;
    right: 56px;
    padding-top: 16px;
    border-top: 3px solid #0F0F0F;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: "JetBrains Mono", monospace;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #0F0F0F;
    z-index: 20;
  }
  .cm-counter {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .cm-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #0F0F0F;
    display: inline-block;
  }
  .chrome-cream .cm-sec-label,
  .chrome-cream.cm-footer {
    color: #EFE9D9;
    border-color: #EFE9D9;
  }
  .chrome-cream .cm-pill {
    background: transparent;
    color: #EFE9D9;
    border-color: #EFE9D9;
  }
  .chrome-cream .cm-dot {
    background: #EFE9D9;
  }
  .cm-kicker {
    display: inline-block;
    background: #0F0F0F;
    color: #EFE9D9;
    font-family: "JetBrains Mono", monospace;
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 10px 18px;
    border: 4px solid #0F0F0F;
  }
  .cm-head {
    font-family: "Be Vietnam Pro", "Archivo Black", sans-serif;
    font-weight: 900;
    text-transform: uppercase;
    line-height: 1.14;
    letter-spacing: -0.015em;
  }
  .cm-mono {
    font-family: "JetBrains Mono", monospace;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .cm-shadow-featured {
    box-shadow: 14px 14px 0 var(--accent_orange, #E85A1F), 14px 14px 0 4px #0F0F0F;
  }
  .cm-shadow-ink {
    box-shadow: 12px 12px 0 #0F0F0F;
  }
  /* Brutalist Browser Window for Clean 4K B-Roll */
  .cm-browser {
    width: 968px;
    border: 5px solid #0F0F0F;
    background: #0F0F0F;
    overflow: hidden;
  }
  .cm-browser-bar {
    height: 54px;
    background: #0F0F0F;
    color: #EFE9D9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: 4px solid #0F0F0F;
  }
  .cm-browser-dots {
    display: flex;
    gap: 10px;
  }
  .cm-bdot {
    width: 16px;
    height: 16px;
    border: 2px solid #EFE9D9;
  }
  .cm-browser-url {
    font-family: "JetBrains Mono", monospace;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: #EFE9D9;
  }
  .cm-browser-status {
    font-family: "JetBrains Mono", monospace;
    font-size: 18px;
    font-weight: 800;
    background: var(--accent_yellow, #F5C518);
    color: #0F0F0F;
    padding: 4px 12px;
  }
  .cm-video-viewport {
    position: relative;
    width: 100%;
    overflow: hidden;
    background: #141414;
  }
  .cm-video-viewport video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

function chromeHtml(secText, pillVar, pillDefault, footDesc, idxStr, cream = false) {
  const cls = cream ? 'chrome-cream' : '';
  return `
    <div class="cm-topbar ${cls}">
      <div class="cm-sec-label">${secText}</div>
      <div class="cm-pill" data-var-text="${pillVar}">${pillDefault}</div>
    </div>
    <div class="cm-footer ${cls}">
      <div>${footDesc}</div>
      <div class="cm-counter"><span>${idxStr}</span><span class="cm-dot"></span><span>10</span></div>
    </div>
  `;
}

function writeScene(id, extraCss, innerHtml, initJs = '') {
  const html = `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>
    <template>
      ${FONT_LINK}
      <style>
        ${COMMON_CSS}
        ${extraCss}
      </style>
      <div id="root" data-composition-id="${id}" data-width="1080" data-height="1920">
        ${innerHtml}
      </div>
      <script>
        const tl = gsap.timeline({ paused: true });
        ${initJs}
        window.__timelines["${id}"] = tl;
      </script>
    </template>
  </body>
</html>
`;
  writeFileSync(join(compDir, `${id}.html`), html, 'utf8');
}

// SCENE 01
writeScene(
  'scene-01',
  `
  #s1-stage {
    position: absolute;
    top: 132px;
    left: 56px;
    right: 56px;
    bottom: 116px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 34px;
  }
  #s1-header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 22px;
  }
  #s1-title {
    font-size: 72px;
  }
  #s1-mock {
    position: relative;
    width: 100%;
    height: 860px;
    background: #E4DCC4;
    border: 5px solid #0F0F0F;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .s1-mock-bar {
    height: 56px;
    background: #0F0F0F;
    color: #EFE9D9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 22px;
  }
  .s1-mock-screen {
    position: relative;
    flex: 1;
    background: #2A2A2A;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(10, 1fr);
    padding: 24px;
    gap: 6px;
  }
  .px-blk { background: #3B3B3B; border: 1px solid #232323; }
  .px-blk.mid { background: #5A534A; }
  .px-blk.hi  { background: #8E7968; }
  .s1-wm-box {
    position: absolute;
    background: #EFE9D9;
    color: #0F0F0F;
    border: 4px solid #0F0F0F;
    padding: 12px 22px;
    font-family: "JetBrains Mono", monospace;
    font-size: 25px;
    font-weight: 800;
  }
  #s1-wm-1 { top: 68px; left: 44px; }
  #s1-wm-2 { bottom: 84px; right: 44px; background: var(--accent_yellow, #F5C518); }
  #s1-lowres {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -260px;
    margin-top: -74px;
    width: 520px;
    background: #0F0F0F;
    color: var(--accent_yellow, #F5C518);
    border: 4px solid #EFE9D9;
    padding: 22px 24px;
    text-align: center;
  }
  #s1-callout {
    position: relative;
    width: 100%;
    background: var(--accent_pink, #F06CA8);
    border: 5px solid #0F0F0F;
    padding: 28px 32px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .s1-tags {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
  }
  .s1-stamp-tag {
    border: 4px solid #0F0F0F;
    padding: 12px 28px;
    font-size: 42px;
  }
  `,
  `
  <div class="ground-fill"></div>
  ${chromeHtml('01 // NỖI ĐAU CÁCH CŨ', 'brand_url', 'VIESNAP.VN', 'LƯU VIDEO TRỰC TIẾP TRÊN APP', '01')}
  <div id="s1-stage">
    <div id="s1-header">
      <div id="s1-kicker" class="cm-kicker" data-var-text="s1_kicker">✕ CÁCH TẢI TRỰC TIẾP KIỂU CŨ</div>
      <div id="s1-title" class="cm-head">TẢI VIDEO KIỂU CŨ?<br/>MỜ NHOÈ &amp; DÍNH LOGO!</div>
    </div>

    <div id="s1-mock">
      <div class="s1-mock-bar">
        <span class="cm-mono" style="font-size:20px;">FILE: VIDEO_TAI_VE_360P.MP4</span>
        <span class="cm-mono" style="background:#F06CA8;color:#0F0F0F;padding:3px 12px;font-size:18px;">✕ KÉM CHẤT LƯỢNG</span>
      </div>
      <div class="s1-mock-screen">
        ${Array.from({ length: 80 }).map((_, i) => {
          const r = Math.floor(i / 8), c = i % 8;
          const center = r >= 2 && r <= 7 && c >= 2 && c <= 5;
          const cls = center ? ((r + c) % 2 === 0 ? 'hi' : 'mid') : ((i % 5 === 0) ? 'mid' : '');
          return `<div class="px-blk ${cls}"></div>`;
        }).join('')}
        <div id="s1-wm-1" class="s1-wm-box">⚠ @LOGO_APP_CHÈN_GÓC</div>
        <div id="s1-lowres">
          <div class="cm-head" style="font-size:44px;">360P VỠ HẠT</div>
          <div class="cm-mono" style="font-size:19px;color:#EFE9D9;margin-top:6px;">BỊ NÉN GIẢM ĐỘ NÉT</div>
        </div>
        <div id="s1-wm-2" class="s1-wm-box">⚠ WATERMARK NHẢY CHÉO</div>
      </div>
    </div>

    <div id="s1-callout" class="cm-shadow-featured">
      <div class="cm-mono" style="font-size:22px;">HẬU QUẢ KHI LƯU THỦ CÔNG:</div>
      <div class="s1-tags">
        <div id="s1-tag1" class="cm-head s1-stamp-tag" style="background:var(--accent_yellow,#F5C518);" data-var-text="s1_tag1">DÍNH LOGO</div>
        <div id="s1-tag2" class="cm-head s1-stamp-tag" style="background:#EFE9D9;" data-var-text="s1_tag2">MỜ CĂM</div>
      </div>
    </div>
  </div>
  `,
  `
  tl.set("#s1-tag1", { rotation: -3.5 }, 0);
  tl.set("#s1-tag2", { rotation: 2.5 }, 0);
  tl.set("#s1-wm-1", { rotation: -2.5 }, 0);
  tl.set("#s1-wm-2", { rotation: 2 }, 0);
  `
);

// SCENE 02
writeScene(
  'scene-02',
  `
  #s2-circle {
    position: absolute;
    top: -90px;
    right: -90px;
    width: 340px;
    height: 340px;
    border-radius: 50%;
    background: var(--accent_yellow, #F5C518);
    border: 5px solid #0F0F0F;
    z-index: 1;
  }
  #s2-stage {
    position: absolute;
    top: 140px;
    left: 56px;
    right: 56px;
    bottom: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 54px;
    align-items: center;
    text-align: center;
    z-index: 5;
  }
  #s2-hero-lockup {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }
  #s2-wordmark {
    font-size: 132px;
    line-height: 0.92;
    letter-spacing: -0.025em;
    color: #0F0F0F;
  }
  #s2-sub-bar {
    background: #0F0F0F;
    color: var(--accent_yellow, #F5C518);
    padding: 12px 28px;
    font-size: 26px;
  }
  #s2-claim-card {
    width: 100%;
    background: var(--accent_pink, #F06CA8);
    border: 5px solid #0F0F0F;
    padding: 44px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  #s2-grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .s2-card {
    border: 5px solid #0F0F0F;
    padding: 34px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
  }
  .s2-icon-box {
    width: 100px;
    height: 100px;
    border: 4px solid #0F0F0F;
    background: #EFE9D9;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  `,
  `
  <div class="ground-fill"></div>
  <div id="s2-circle"></div>
  ${chromeHtml('02 // GIẢI PHÁP MỚI', 'brand_url', 'VIESNAP.VN', 'TẢI ĐA NĂNG · KHÔNG DÍNH WATERMARK', '02')}
  <div id="s2-stage">
    <div id="s2-hero-lockup">
      <div class="cm-kicker">★ CÔNG CỤ WEB TẢI NHANH CHUẨN VIỆT</div>
      <div id="s2-wordmark" class="cm-head" data-var-text="brand_url">VIESNAP.VN</div>
      <div id="s2-sub-bar" class="cm-mono">DÁN LINK LÀ TẢI · KHÔNG CẦN CÀI APP</div>
    </div>

    <div id="s2-claim-card" class="cm-shadow-featured">
      <div class="cm-mono" style="font-size:23px;">CHỈ 1 CÔNG CỤ DUY NHẤT:</div>
      <div class="cm-head" style="font-size:62px;">NÉT CĂNG · KO LOGO<br/>MIỄN PHÍ 100%</div>
    </div>

    <div id="s2-grid">
      <div id="s2-c1" class="s2-card" style="background:#EFE9D9;">
        <div class="s2-icon-box" style="background:var(--accent_yellow,#F5C518);">
          <svg width="54" height="54" viewBox="0 0 48 48" fill="none" stroke="#0F0F0F" stroke-width="4"><rect x="6" y="10" width="36" height="28"/><polygon points="20,17 32,24 20,31" fill="#0F0F0F"/></svg>
        </div>
        <div class="cm-head" style="font-size:32px;" data-var-text="s2_media1">VIDEO 4K/HD</div>
        <div class="cm-mono" style="font-size:17px;">GIỮ NÉT GỐC</div>
      </div>

      <div id="s2-c2" class="s2-card" style="background:var(--accent_yellow,#F5C518);">
        <div class="s2-icon-box">
          <svg width="54" height="54" viewBox="0 0 48 48" fill="none" stroke="#0F0F0F" stroke-width="4"><rect x="6" y="8" width="36" height="32"/><circle cx="17" cy="19" r="4" fill="#0F0F0F"/><polyline points="8,36 20,24 29,32 35,26 42,34"/></svg>
        </div>
        <div class="cm-head" style="font-size:32px;" data-var-text="s2_media2">HÌNH ẢNH</div>
        <div class="cm-mono" style="font-size:17px;">LÀM HÌNH NỀN</div>
      </div>

      <div id="s2-c3" class="s2-card" style="background:#E4DCC4;">
        <div class="s2-icon-box" style="background:var(--accent_pink,#F06CA8);">
          <svg width="54" height="54" viewBox="0 0 48 48" fill="none" stroke="#0F0F0F" stroke-width="4"><path d="M18 35V12l20-4v23"/><circle cx="13" cy="35" r="5" fill="#0F0F0F"/><circle cx="33" cy="31" r="5" fill="#0F0F0F"/></svg>
        </div>
        <div class="cm-head" style="font-size:32px;" data-var-text="s2_media3">NHẠC MP3</div>
        <div class="cm-mono" style="font-size:17px;">LÀM NHẠC CHUÔNG</div>
      </div>
    </div>
  </div>
  `
);

// SCENE 03
writeScene(
  'scene-03',
  `
  #s3-stage {
    position: absolute;
    top: 126px;
    left: 56px;
    right: 56px;
    bottom: 112px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 28px;
  }
  #s3-top {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  #s3-steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  .s3-step {
    border: 5px solid #0F0F0F;
    padding: 20px 18px 22px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .s3-num {
    font-size: 62px;
    line-height: 0.92;
  }
  .s3-lbl {
    font-size: 27px;
  }
  `,
  `
  <div class="ground-fill"></div>
  ${chromeHtml('03 // HƯỚNG DẪN 3 BƯỚC', 'brand_url', 'VIESNAP.VN', 'THAO TÁC THỰC TẾ TRÊN ĐIỆN THOẠI', '03')}
  <div id="s3-stage">
    <div id="s3-top">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div class="cm-kicker">THAO TÁC SIÊU ĐƠN GIẢN</div>
        <div class="cm-mono" style="font-size:20px;">CHỈ MẤT ~3 GIÂY</div>
      </div>
      <div class="cm-head" style="font-size:48px;" data-var-text="s3_headline">SAO CHÉP ➔ DÁN LINK ➔ TẢI NGAY</div>
      <div id="s3-steps">
        <div id="s3-st1" class="s3-step" style="background:#EFE9D9;">
          <div class="cm-head s3-num">01</div>
          <div class="cm-head s3-lbl" data-var-text="s3_step1">SAO CHÉP LINK</div>
          <div class="cm-mono" style="font-size:16px;">NÚT CHIA SẺ APP</div>
        </div>
        <div id="s3-st2" class="s3-step" style="background:var(--accent_yellow,#F5C518);">
          <div class="cm-head s3-num">02</div>
          <div class="cm-head s3-lbl" data-var-text="s3_step2">DÁN VÀO WEB</div>
          <div class="cm-mono" style="font-size:16px;">MỞ VIESNAP.VN</div>
        </div>
        <div id="s3-st3" class="s3-step" style="background:var(--accent_green,#1F8A4C);color:#EFE9D9;">
          <div class="cm-head s3-num">03</div>
          <div class="cm-head s3-lbl" data-var-text="s3_step3">BẤM TẢI HD</div>
          <div class="cm-mono" style="font-size:16px;color:#EFE9D9;">LƯU VỀ MÁY</div>
        </div>
      </div>
    </div>

    <div id="s3-browser" class="cm-browser cm-shadow-featured">
      <div class="cm-browser-bar">
        <div class="cm-browser-dots"><span class="cm-bdot" style="background:#F06CA8;"></span><span class="cm-bdot" style="background:#F5C518;"></span><span class="cm-bdot" style="background:#1F8A4C;"></span></div>
        <div class="cm-browser-url">https://viesnap.vn</div>
        <div class="cm-browser-status">● DEMO THẬT</div>
      </div>
      <div class="cm-video-viewport" style="height:1060px;">
        <video id="s3-vid" src="assets/broll-s3.mp4" muted playsinline data-start="0" data-duration="9.85"></video>
      </div>
    </div>
  </div>
  `
);

// SCENE 04
writeScene(
  'scene-04',
  `
  #s4-stage {
    position: absolute;
    top: 126px;
    left: 56px;
    right: 56px;
    bottom: 112px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 28px;
  }
  #s4-stats {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 20px;
  }
  .s4-cell {
    border: 5px solid #0F0F0F;
    padding: 26px 26px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  #s4-badge {
    position: absolute;
    bottom: 34px;
    right: 34px;
    background: var(--accent_pink, #F06CA8);
    color: #0F0F0F;
    border: 5px solid #0F0F0F;
    padding: 16px 26px;
    z-index: 10;
  }
  `,
  `
  <div class="ground-fill"></div>
  ${chromeHtml('04 // BẰNG CHỨNG KẾT QUẢ', 'brand_url', 'VIESNAP.VN', 'KIỂM CHỨNG FILE MP4 TẢI VỀ', '04')}
  <div id="s4-stage">
    <div style="display:flex;flex-direction:column;gap:18px;">
      <div class="cm-kicker">✓ THÀNH QUẢ TẢI VỀ MÁY</div>
      <div id="s4-stats">
        <div id="s4-c1" class="s4-cell" style="background:var(--accent_yellow,#F5C518);">
          <div class="cm-head" style="font-size:64px;line-height:0.96;" data-var-text="stat_hd">FULL HD / 4K</div>
          <div class="cm-mono" style="font-size:20px;">ĐỘ PHÂN GIẢI CAO · RẤT NÉT</div>
        </div>
        <div id="s4-c2" class="s4-cell" style="background:var(--accent_green,#1F8A4C);color:#EFE9D9;">
          <div class="cm-head" style="font-size:64px;line-height:0.96;" data-var-text="stat_logo">0 LOGO</div>
          <div class="cm-mono" style="font-size:20px;color:#EFE9D9;">SẠCH WATERMARK</div>
        </div>
      </div>
    </div>

    <div id="s4-browser" class="cm-browser cm-shadow-featured" style="position:relative;">
      <div class="cm-browser-bar">
        <div class="cm-browser-dots"><span class="cm-bdot" style="background:#1F8A4C;"></span><span class="cm-bdot"></span></div>
        <div class="cm-browser-url">viesnap.vn_tiktok_HD.mp4</div>
        <div class="cm-browser-status" style="background:#1F8A4C;color:#EFE9D9;">✓ NÉT CĂNG</div>
      </div>
      <div class="cm-video-viewport" style="height:1180px;">
        <video id="s4-vid" src="assets/broll-s4.mp4" muted playsinline data-start="0" data-duration="4.70"></video>
        <div id="s4-badge" class="cm-head" style="font-size:32px;">✓ SẠCH BÓNG LOGO TIKTOK</div>
      </div>
    </div>
  </div>
  `,
  `tl.set("#s4-badge", { rotation: -4 }, 0);`
);

// SCENE 05
writeScene(
  'scene-05',
  `
  #s5-stage {
    position: absolute;
    top: 126px;
    left: 56px;
    right: 56px;
    bottom: 112px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 26px;
  }
  #s5-cards {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .s5-feat {
    border: 5px solid #0F0F0F;
    padding: 20px 26px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }
  .s5-wave {
    display: flex;
    align-items: flex-end;
    gap: 6px;
    height: 52px;
  }
  .s5-bar {
    width: 10px;
    background: #0F0F0F;
  }
  `,
  `
  <div class="ground-fill"></div>
  ${chromeHtml('05 // HÌNH NỀN & NHẠC CHUÔNG', 'brand_url', 'VIESNAP.VN', 'TÍCH HỢP ALL-IN-ONE TRONG 1 WEB', '05')}
  <div id="s5-stage">
    <div id="s5-cards">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div class="cm-kicker">ALL-IN-ONE · KHÔNG CHỈ TẢI VIDEO</div>
        <div class="cm-mono" style="font-size:20px;background:#0F0F0F;color:#F5C518;padding:6px 14px;">2 TÍNH NĂNG CỰC TIỆN</div>
      </div>

      <div id="s5-f1" class="s5-feat" style="background:var(--accent_pink,#F06CA8);">
        <div>
          <div class="cm-mono" style="font-size:19px;">TÍNH NĂNG 01 // SLIDE PHOTO</div>
          <div class="cm-head" style="font-size:38px;margin-top:6px;" data-var-text="s5_feat1">TẢI ẢNH NÉT ➔ LÀM HÌNH NỀN</div>
        </div>
        <svg width="64" height="64" viewBox="0 0 48 48" fill="none" stroke="#0F0F0F" stroke-width="4"><rect x="6" y="6" width="36" height="36" fill="#EFE9D9"/><circle cx="17" cy="17" r="4" fill="#0F0F0F"/><path d="M8 36l11-11 9 8 6-6 8 9"/></svg>
      </div>

      <div id="s5-f2" class="s5-feat" style="background:var(--accent_yellow,#F5C518);">
        <div>
          <div class="cm-mono" style="font-size:19px;">TÍNH NĂNG 02 // EXTRACT MP3</div>
          <div class="cm-head" style="font-size:38px;margin-top:6px;" data-var-text="s5_feat2">TẢI ÂM THANH ➔ NHẠC CHUÔNG</div>
        </div>
        <div class="s5-wave">
          <span class="s5-bar" style="height:22px;"></span>
          <span class="s5-bar" style="height:44px;"></span>
          <span class="s5-bar" style="height:30px;"></span>
          <span class="s5-bar" style="height:52px;"></span>
          <span class="s5-bar" style="height:36px;"></span>
          <span class="s5-bar" style="height:18px;"></span>
        </div>
      </div>
    </div>

    <div id="s5-browser" class="cm-browser cm-shadow-featured">
      <div class="cm-browser-bar">
        <div class="cm-browser-dots"><span class="cm-bdot" style="background:#F06CA8;"></span><span class="cm-bdot" style="background:#F5C518;"></span></div>
        <div class="cm-browser-url">viesnap.vn // ẢNH SLIDE &amp; MP3</div>
        <div class="cm-browser-status">MP3 + PHOTO</div>
      </div>
      <div class="cm-video-viewport" style="height:1040px;">
        <video id="s5-vid" src="assets/broll-s5.mp4" muted playsinline data-start="0" data-duration="9.50"></video>
      </div>
    </div>
  </div>
  `
);

// SCENE 06
writeScene(
  'scene-06',
  `
  #s6-stage {
    position: absolute;
    top: 132px;
    left: 56px;
    right: 56px;
    bottom: 116px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 40px;
  }
  #s6-hub {
    background: var(--accent_pink, #F06CA8);
    border: 5px solid #0F0F0F;
    padding: 32px 34px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  #s6-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 22px;
  }
  .s6-plat {
    border: 5px solid #0F0F0F;
    padding: 38px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .s6-p-name {
    font-size: 46px;
  }
  .s6-p-idx {
    font-family: "JetBrains Mono", monospace;
    font-size: 22px;
    font-weight: 800;
    padding: 6px 12px;
    border: 3px solid #0F0F0F;
    background: #EFE9D9;
  }
  #s6-more {
    background: #0F0F0F;
    color: #EFE9D9;
    border: 5px solid #0F0F0F;
    padding: 28px 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  `,
  `
  <div class="ground-fill"></div>
  ${chromeHtml('06 // HỆ SINH THÁI HỖ TRỢ', 'brand_url', 'VIESNAP.VN', 'HỖ TRỢ ĐẦY ĐỦ MỌI ĐỊNH DẠNG', '06')}
  <div id="s6-stage">
    <div style="display:flex;flex-direction:column;align-items:flex-start;gap:20px;">
      <div class="cm-kicker">KHÔNG CHỈ RIÊNG TIKTOK</div>
      <div class="cm-head" style="font-size:74px;">CÂN MỌI NỀN TẢNG<br/>MẠNG XÃ HỘI!</div>
    </div>

    <div id="s6-hub" class="cm-shadow-featured">
      <div>
        <div class="cm-mono" style="font-size:20px;">TRUNG TÂM XỬ LÝ LINK ĐA NĂNG</div>
        <div class="cm-head" style="font-size:52px;margin-top:6px;">VIESNAP.VN HUB</div>
      </div>
      <div class="cm-head" style="font-size:54px;background:#0F0F0F;color:#F5C518;padding:10px 22px;">7+</div>
    </div>

    <div id="s6-grid">
      <div id="s6-p1" class="s6-plat" style="background:var(--accent_yellow,#F5C518);">
        <span class="cm-head s6-p-name">TIKTOK</span><span class="s6-p-idx">01</span>
      </div>
      <div id="s6-p2" class="s6-plat" style="background:#EFE9D9;">
        <span class="cm-head s6-p-name">DOUYIN</span><span class="s6-p-idx">02</span>
      </div>
      <div id="s6-p3" class="s6-plat" style="background:#E4DCC4;">
        <span class="cm-head s6-p-name">FACEBOOK</span><span class="s6-p-idx">03</span>
      </div>
      <div id="s6-p4" class="s6-plat" style="background:var(--accent_pink,#F06CA8);">
        <span class="cm-head s6-p-name">INSTAGRAM</span><span class="s6-p-idx">04</span>
      </div>
      <div id="s6-p5" class="s6-plat" style="background:#EFE9D9;">
        <span class="cm-head s6-p-name">THREADS</span><span class="s6-p-idx">05</span>
      </div>
      <div id="s6-p6" class="s6-plat" style="background:var(--accent_yellow,#F5C518);">
        <span class="cm-head s6-p-name">PINTEREST</span><span class="s6-p-idx">06</span>
      </div>
    </div>

    <div id="s6-more">
      <span class="cm-head" style="font-size:32px;color:var(--accent_yellow,#F5C518);">+ XIAOHONGSHU · REELS · STORY</span>
      <span class="cm-mono" style="font-size:20px;">✓ VIDEO / ẢNH / MP3</span>
    </div>
  </div>
  `
);

// SCENE 07
writeScene(
  'scene-07',
  `
  #s7-stage {
    position: absolute;
    top: 132px;
    left: 56px;
    right: 56px;
    bottom: 116px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 44px;
  }
  #s7-ledger {
    width: 100%;
    border: 5px solid #0F0F0F;
    background: #E4DCC4;
  }
  .s7-row {
    display: grid;
    grid-template-columns: 0.88fr 1.02fr 1.3fr;
    border-bottom: 4px solid #0F0F0F;
  }
  .s7-row:last-child { border-bottom: none; }
  .s7-head-row {
    background: #0F0F0F;
    color: #EFE9D9;
  }
  .s7-cell {
    padding: 32px 22px;
    border-right: 4px solid #0F0F0F;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .s7-cell:last-child { border-right: none; }
  .s7-win {
    background: var(--accent_green, #1F8A4C);
    color: #EFE9D9;
  }
  #s7-banner {
    background: var(--accent_yellow, #F5C518);
    border: 5px solid #0F0F0F;
    padding: 28px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  `,
  `
  <div class="ground-fill"></div>
  ${chromeHtml('07 // CÔNG CỤ THUẦN VIỆT', 'brand_url', 'VIESNAP.VN', 'DO CHÍNH KỸ SƯ VIỆT NAM XÂY DỰNG', '07')}
  <div id="s7-stage">
    <div style="display:flex;flex-direction:column;align-items:flex-start;gap:20px;">
      <div class="cm-kicker">${VN_FLAG_SVG}SẢN PHẨM CÔNG NGHỆ VIỆT NAM</div>
      <div class="cm-head" style="font-size:74px;">CÔNG CỤ VIỆT,<br/><span style="color:var(--accent_orange,#E85A1F);">ĐẲNG CẤP QUỐC TẾ!</span></div>
    </div>

    <div id="s7-ledger" class="cm-shadow-featured">
      <div class="s7-row s7-head-row">
        <div class="s7-cell cm-mono" style="font-size:21px;">TIÊU CHÍ</div>
        <div class="s7-cell cm-mono" style="font-size:21px;color:#F06CA8;">CÔNG CỤ KHÁC</div>
        <div class="s7-cell cm-mono" style="font-size:21px;color:#F5C518;">★ VIESNAP.VN</div>
      </div>

      <div id="s7-r1" class="s7-row">
        <div class="s7-cell cm-head" style="font-size:27px;">GIAO DIỆN</div>
        <div class="s7-cell" style="font-size:24px;font-weight:700;">Rối mắt, dịch máy</div>
        <div class="s7-cell s7-win cm-head" style="font-size:27px;">✓ THUẦN VIỆT MƯỢT</div>
      </div>

      <div id="s7-r2" class="s7-row">
        <div class="s7-cell cm-head" style="font-size:27px;">ĐỘ NÉT</div>
        <div class="s7-cell" style="font-size:24px;font-weight:700;">Hay bị bóp 720p</div>
        <div class="s7-cell s7-win cm-head" style="font-size:27px;">✓ GIỮ GỐC 4K / HD</div>
      </div>

      <div id="s7-r3" class="s7-row">
        <div class="s7-cell cm-head" style="font-size:27px;">CÀI ĐẶT</div>
        <div class="s7-cell" style="font-size:24px;font-weight:700;">Ép cài App / Login</div>
        <div class="s7-cell s7-win cm-head" style="font-size:27px;">✓ MỞ WEB DÙNG NGAY</div>
      </div>

      <div id="s7-r4" class="s7-row">
        <div class="s7-cell cm-head" style="font-size:27px;">TỐC ĐỘ</div>
        <div class="s7-cell" style="font-size:24px;font-weight:700;">Đợi hàng chờ lâu</div>
        <div class="s7-cell s7-win cm-head" style="font-size:27px;">✓ SIÊU NHANH QUỐC TẾ</div>
      </div>
    </div>

    <div id="s7-banner">
      <div>
        <div class="cm-mono" style="font-size:19px;">TƯƠNG THÍCH MỌI THIẾT BỊ</div>
        <div class="cm-head" style="font-size:38px;margin-top:6px;">IPHONE · ANDROID · PC · MACBOOK</div>
      </div>
      <div class="cm-head" style="font-size:46px;border:4px solid #0F0F0F;background:#EFE9D9;padding:8px 20px;">100%</div>
    </div>
  </div>
  `
);

// SCENE 08
writeScene(
  'scene-08',
  `
  #s8-stage {
    position: absolute;
    top: 132px;
    left: 56px;
    right: 56px;
    bottom: 116px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 44px;
  }
  #s8-stack {
    display: flex;
    flex-direction: column;
    gap: 28px;
  }
  .s8-stat-card {
    border: 5px solid #0F0F0F;
    padding: 42px 38px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }
  .s8-big {
    font-size: 94px;
    line-height: 0.94;
  }
  .s8-desc {
    font-size: 32px;
    margin-top: 12px;
  }
  .s8-icon-badge {
    width: 152px;
    height: 152px;
    border: 5px solid #0F0F0F;
    background: #EFE9D9;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  `,
  `
  <div class="ground-fill"></div>
  ${chromeHtml('08 // 3 ĐẶC QUYỀN VƯỢT TRỘI', 'brand_url', 'VIESNAP.VN', 'MIỄN PHÍ · SẠCH QUẢNG CÁO · SIÊU TỐC', '08')}
  <div id="s8-stage">
    <div style="text-align:center;display:flex;flex-direction:column;align-items:center;gap:18px;">
      <div class="cm-kicker">TRẢI NGHIỆM SƯỚNG TUYỆT ĐỐI</div>
      <div class="cm-head" style="font-size:66px;">MIỄN PHÍ &amp; SẠCH BÓNG<br/>QUẢNG CÁO RÁC!</div>
    </div>

    <div id="s8-stack">
      <div id="s8-c1" class="s8-stat-card" style="background:var(--accent_green,#1F8A4C);color:#EFE9D9;">
        <div>
          <div class="cm-head s8-big" data-var-text="stat_free">0Đ FREE</div>
          <div class="cm-head s8-desc">KHÔNG GIỚI HẠN LƯỢT TẢI</div>
          <div class="cm-mono" style="font-size:19px;color:#EFE9D9;margin-top:8px;">HOÀN TOÀN MIỄN PHÍ TRỌN ĐỜI</div>
        </div>
        <div class="s8-icon-badge" style="color:#0F0F0F;">
          <span class="cm-head" style="font-size:48px;">FREE</span>
        </div>
      </div>

      <div id="s8-c2" class="s8-stat-card cm-shadow-featured" style="background:var(--accent_pink,#F06CA8);">
        <div>
          <div class="cm-head s8-big" data-var-text="stat_ads">0 ADS</div>
          <div class="cm-head s8-desc">KHÔNG QUẢNG CÁO LÀM PHIỀN</div>
          <div class="cm-mono" style="font-size:19px;margin-top:8px;">KHÔNG NHẢY POPUP · KHÔNG CHUYỂN TAB LẠ</div>
        </div>
        <div class="s8-icon-badge" style="background:var(--accent_yellow,#F5C518);">
          <svg width="92" height="92" viewBox="0 0 64 64" fill="none" stroke="#0F0F0F" stroke-width="5"><rect x="8" y="14" width="48" height="36" fill="#EFE9D9"/><text x="15" y="40" font-family="monospace" font-weight="900" font-size="22" fill="#0F0F0F" stroke="none">ADS</text><line x1="6" y1="56" x2="58" y2="8" stroke="#E85A1F" stroke-width="7"/></svg>
        </div>
      </div>

      <div id="s8-c3" class="s8-stat-card" style="background:var(--accent_yellow,#F5C518);">
        <div>
          <div class="cm-head s8-big" data-var-text="stat_speed">SIÊU TỐC</div>
          <div class="cm-head s8-desc">TẢI NGAY TRONG TÍCH TẮC</div>
          <div class="cm-mono" style="font-size:19px;margin-top:8px;">AN TOÀN · KHÔNG LƯU LỊCH SỬ CÁ NHÂN</div>
        </div>
        <div class="s8-icon-badge">
          <svg width="84" height="84" viewBox="0 0 48 48" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3.5"><polygon points="26,4 10,26 23,26 20,44 38,20 25,20"/></svg>
        </div>
      </div>
    </div>
  </div>
  `
);

// SCENE 09
writeScene(
  'scene-09',
  `
  #s9-stage {
    position: absolute;
    top: 124px;
    left: 56px;
    right: 56px;
    bottom: 112px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 28px;
  }
  #s9-pride-card {
    background: var(--accent_yellow, #F5C518);
    border: 5px solid #0F0F0F;
    padding: 26px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }
  #s9-sovereign-bar {
    background: #0F0F0F;
    color: var(--accent_yellow, #F5C518);
    padding: 10px 18px;
    margin-top: 12px;
    display: inline-block;
    font-size: 27px;
  }
  #s9-stamp {
    position: absolute;
    bottom: 34px;
    right: 34px;
    background: var(--accent_pink, #F06CA8);
    color: #0F0F0F;
    border: 5px solid #EFE9D9;
    outline: 5px solid #0F0F0F;
    padding: 18px 26px;
    z-index: 12;
  }
  `,
  `
  <div class="ground-fill"></div>
  ${chromeHtml('09 // BẢN SẮC VIỆT NAM', 'brand_url', 'VIESNAP.VN', 'TRỐNG ĐỒNG & BẢN ĐỒ CHỦ QUYỀN', '09')}
  <div id="s9-stage">
    <div id="s9-pride-card" class="cm-shadow-featured">
      <div>
        <div class="cm-mono" style="font-size:19px;">VÀO WEB LÀ ƯNG NGAY TỪ CÁI NHÌN ĐẦU TIÊN:</div>
        <div class="cm-head" style="font-size:37px;margin-top:6px;">TRỐNG ĐỒNG &amp; BẢN ĐỒ VIỆT NAM</div>
        <div id="s9-sovereign-bar" class="cm-head" data-var-text="s9_sovereign">★ ĐẦY ĐỦ HOÀNG SA · TRƯỜNG SA ★</div>
      </div>
      <svg width="118" height="118" viewBox="0 0 100 100" fill="none" stroke="#0F0F0F" stroke-width="4" style="flex-shrink:0;background:#EFE9D9;border:4px solid #0F0F0F;padding:8px;">
        <circle cx="50" cy="50" r="42"/>
        <circle cx="50" cy="50" r="28"/>
        <polygon points="50,18 55,42 78,32 58,48 82,50 58,52 78,68 55,58 50,82 45,58 22,68 42,52 18,50 42,48 22,32 45,42" fill="#E85A1F" stroke="#0F0F0F" stroke-width="2.5"/>
      </svg>
    </div>

    <div id="s9-browser" class="cm-browser" style="position:relative;">
      <div class="cm-browser-bar">
        <div class="cm-browser-dots"><span class="cm-bdot" style="background:#DA251D;"></span><span class="cm-bdot" style="background:#F5C518;"></span></div>
        <div class="cm-browser-url">https://viesnap.vn // GIAO DIỆN THẬT</div>
        <div class="cm-browser-status">★ TỰ HÀO VIỆT NAM</div>
      </div>
      <div class="cm-video-viewport" style="height:1120px;">
        <video id="s9-vid" src="assets/broll-s9.mp4" muted playsinline data-start="0" data-duration="10.45"></video>
        <div id="s9-stamp">
          <div class="cm-head" style="font-size:32px;" data-var-text="s9_stamp">+1 CÔNG CỤ YÊU THÍCH</div>
          <div class="cm-mono" style="font-size:18px;margin-top:4px;">LƯU LẠI DÙNG MỖI NGÀY!</div>
        </div>
      </div>
    </div>
  </div>
  `,
  `tl.set("#s9-stamp", { rotation: -5.5 }, 0);`
);

// SCENE 10
writeScene(
  'scene-10',
  `
  #s10-stage {
    position: absolute;
    top: 146px;
    left: 56px;
    right: 56px;
    bottom: 122px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 56px;
    text-align: center;
    z-index: 5;
  }
  #s10-url-box {
    background: #EFE9D9;
    color: #0F0F0F;
    border: 6px solid #0F0F0F;
    padding: 32px 48px;
    width: 100%;
  }
  #s10-signoff {
    color: #EFE9D9;
    font-size: 74px;
  }
  #s10-vn-highlight {
    display: inline-block;
    background: var(--accent_yellow, #F5C518);
    color: #0F0F0F;
    border: 5px solid #0F0F0F;
    padding: 14px 28px;
    margin-top: 16px;
    font-size: 54px;
  }
  #s10-stamp {
    width: 316px;
    height: 316px;
    background: var(--accent_pink, #F06CA8);
    border: 6px solid #EFE9D9;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px;
  }
  .s10-ring {
    width: 100%;
    height: 100%;
    border: 4px solid #EFE9D9;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px;
    color: #0F0F0F;
  }
  `,
  `
  <div class="ground-green"></div>
  ${chromeHtml('10 // TRUY CẬP NGAY', 'brand_url', 'VIESNAP.VN', 'NGƯỜI VIỆT ƯU TIÊN DÙNG HÀNG VIỆT', '10', true)}
  <div id="s10-stage">
    <div style="width:100%;display:flex;flex-direction:column;align-items:center;gap:20px;">
      <div class="cm-kicker" style="color:var(--accent_yellow,#F5C518);">${VN_FLAG_SVG}MỞ TRÌNH DUYỆT · DÙNG NGAY LẬP TỨC</div>
      <div id="s10-url-box" class="cm-shadow-ink">
        <div class="cm-mono" style="font-size:22px;">ĐỊA CHỈ WEBSITE CHÍNH THỨC:</div>
        <div class="cm-head" style="font-size:110px;line-height:0.96;margin-top:8px;" data-var-text="brand_url">VIESNAP.VN</div>
      </div>
    </div>

    <div id="s10-slogan-wrap">
      <div id="s10-signoff" class="cm-head" data-var-text="s10_slogan1">NGƯỜI VIỆT NAM</div>
      <div id="s10-vn-highlight" class="cm-head" data-var-text="s10_slogan2">ƯU TIÊN DÙNG HÀNG VIỆT!</div>
      <div class="cm-mono" style="font-size:22px;color:#EFE9D9;margin-top:24px;">TIKTOK · DOUYIN · FACEBOOK · INSTAGRAM · THREADS · PINTEREST</div>
    </div>

    <div id="s10-stamp" class="cm-shadow-ink">
      <div class="s10-ring">
        <div class="cm-mono" style="font-size:20px;">KHÔNG LOGO</div>
        <div class="cm-head" style="font-size:44px;line-height:1.02;margin:8px 0;" data-var-text="s10_cta">THỬ NGAY</div>
        <div class="cm-head" style="font-size:30px;background:#0F0F0F;color:#EFE9D9;padding:4px 14px;">100% FREE</div>
      </div>
    </div>
  </div>
  `,
  `tl.set("#s10-stamp", { rotation: -6 }, 0);`
);

const VARIABLES = [
  { id: 'brand_url', type: 'string', label: 'Địa chỉ Website', default: 'VIESNAP.VN' },
  { id: 's1_kicker', type: 'string', label: 'Cảnh 1: Nhãn phụ', default: '✕ CÁCH TẢI TRỰC TIẾP KIỂU CŨ' },
  { id: 's1_tag1', type: 'string', label: 'Cảnh 1: Lỗi 1', default: 'DÍNH LOGO' },
  { id: 's1_tag2', type: 'string', label: 'Cảnh 1: Lỗi 2', default: 'MỜ CĂM' },
  { id: 's2_media1', type: 'string', label: 'Cảnh 2: Định dạng 1', default: 'VIDEO 4K/HD' },
  { id: 's2_media2', type: 'string', label: 'Cảnh 2: Định dạng 2', default: 'HÌNH ẢNH' },
  { id: 's2_media3', type: 'string', label: 'Cảnh 2: Định dạng 3', default: 'NHẠC MP3' },
  { id: 's3_headline', type: 'string', label: 'Cảnh 3: Tiêu đề 3 bước', default: 'SAO CHÉP ➔ DÁN LINK ➔ TẢI NGAY' },
  { id: 's3_step1', type: 'string', label: 'Cảnh 3: Bước 1', default: 'SAO CHÉP LINK' },
  { id: 's3_step2', type: 'string', label: 'Cảnh 3: Bước 2', default: 'DÁN VÀO WEB' },
  { id: 's3_step3', type: 'string', label: 'Cảnh 3: Bước 3', default: 'BẤM TẢI HD' },
  { id: 'stat_hd', type: 'string', label: 'Cảnh 4: Chất lượng Video', default: 'FULL HD / 4K' },
  { id: 'stat_logo', type: 'string', label: 'Cảnh 4: Chỉ số Logo', default: '0 LOGO' },
  { id: 's5_feat1', type: 'string', label: 'Cảnh 5: Tính năng Ảnh', default: 'TẢI ẢNH NÉT ➔ LÀM HÌNH NỀN' },
  { id: 's5_feat2', type: 'string', label: 'Cảnh 5: Tính năng Nhạc', default: 'TẢI ÂM THANH ➔ NHẠC CHUÔNG' },
  { id: 'stat_free', type: 'string', label: 'Cảnh 8: Giá sử dụng', default: '0Đ FREE' },
  { id: 'stat_ads', type: 'string', label: 'Cảnh 8: Quảng cáo', default: '0 ADS' },
  { id: 'stat_speed', type: 'string', label: 'Cảnh 8: Tốc độ', default: 'SIÊU TỐC' },
  { id: 's9_sovereign', type: 'string', label: 'Cảnh 9: Chủ quyền biển đảo', default: '★ ĐẦY ĐỦ HOÀNG SA · TRƯỜNG SA ★' },
  { id: 's9_stamp', type: 'string', label: 'Cảnh 9: Con dấu yêu thích', default: '+1 CÔNG CỤ YÊU THÍCH' },
  { id: 's10_slogan1', type: 'string', label: 'Cảnh 10: Khẩu hiệu dòng 1', default: 'NGƯỜI VIỆT NAM' },
  { id: 's10_slogan2', type: 'string', label: 'Cảnh 10: Khẩu hiệu dòng 2', default: 'ƯU TIÊN DÙNG HÀNG VIỆT!' },
  { id: 's10_cta', type: 'string', label: 'Cảnh 10: Nút kêu gọi', default: 'THỬ NGAY' },
  { id: 'bg_cream', type: 'color', label: 'Màu nền giấy kem', default: '#EFE9D9' },
  { id: 'accent_pink', type: 'color', label: 'Màu nhấn Hồng', default: '#F06CA8' },
  { id: 'accent_green', type: 'color', label: 'Màu nhấn Xanh lá', default: '#1F8A4C' },
  { id: 'accent_orange', type: 'color', label: 'Màu bóng cứng Cam', default: '#E85A1F' },
  { id: 'accent_yellow', type: 'color', label: 'Màu nhấn Vàng', default: '#F5C518' }
];

const SCENES = [
  { id: 'scene-01', start: 0.0,   dur: 6.2,   shot: '3s',    act: 'Act 1: Nỗi đau & Giải pháp mới', title: '01: Nỗi đau cách tải cũ', time: '0.0 to 6.2s', words: '100% Motion Graphics: Mô phỏng khung video lưu thủ công bị vỡ hạt 360p và dính watermark nhảy góc, đi cùng 2 nhãn đóng dấu nghiêng DÍNH LOGO & MỜ CĂM.' },
  { id: 'scene-02', start: 6.2,   dur: 5.6,   shot: '9.2s',  act: null, title: '02: Màn ra mắt VieSnap.vn', time: '6.2 to 11.8s', words: '100% Motion Graphics: Đại cảnh nhận diện VIESNAP.VN cỡ lớn trên nền kem, khối tuyên ngôn NÉT CĂNG · KO LOGO · MIỄN PHÍ 100% và 3 thẻ VIDEO 4K/HD · HÌNH ẢNH · NHẠC MP3.' },
  { id: 'scene-03', start: 11.8,  dur: 9.85,  shot: '18s',   act: 'Act 2: Thao tác thực tế & Thành quả đa năng', title: '03: Quy trình 3 bước siêu tốc', time: '11.8 to 21.65s', words: 'Motion Poster + Khung 4K sạch #1: 3 thẻ bước (01 Sao chép ➔ 02 Dán vào Web ➔ 03 Bấm tải HD) dẫn dắt trực tiếp khung cửa sổ màn hình điện thoại đã cắt bỏ cảnh bàn làm việc.' },
  { id: 'scene-04', start: 21.65, dur: 4.7,   shot: '24s',   act: null, title: '04: Bằng chứng Full HD & 0 Logo', time: '21.65 to 26.35s', words: 'Motion Poster + Khung 4K sạch #2: Kiểm chứng file video tải về nét căng cùng 2 ô số liệu lớn FULL HD / 4K và 0 LOGO sạch watermark 100%.' },
  { id: 'scene-05', start: 26.35, dur: 9.5,   shot: '31s',   act: null, title: '05: Tải Ảnh nền & Nhạc chuông MP3', time: '26.35 to 35.85s', words: 'Motion Poster + Khung 4K sạch #3: 2 thẻ tính năng TẢI ẢNH NÉT ➔ LÀM HÌNH NỀN và TẢI ÂM THANH ➔ NHẠC CHUÔNG kết hợp khung thao tác thật trên giao diện VieSnap.' },
  { id: 'scene-06', start: 35.85, dur: 4.05,  shot: '38.2s', act: 'Act 3: Sức mạnh & Giá trị thuần Việt', title: '06: Hệ sinh thái đa nền tảng', time: '35.85 to 39.9s', words: '100% Motion Graphics: Trung tâm VIESNAP.VN HUB kết nối lưới 6+ nền tảng phổ biến (TikTok, Douyin, Facebook, Instagram, Threads, Pinterest, Xiaohongshu).' },
  { id: 'scene-07', start: 39.9,  dur: 8.6,   shot: '44.5s', act: null, title: '07: Công cụ Việt · Đẳng cấp Quốc tế', time: '39.9 to 48.5s', words: '100% Motion Graphics: Tuyên ngôn sản phẩm công nghệ Việt Nam cùng bảng Comparison Ledger đối chiếu trực diện 4 tiêu chí vượt trội của VieSnap.vn.' },
  { id: 'scene-08', start: 48.5,  dur: 7.3,   shot: '52.5s', act: null, title: '08: Đại cảnh 0Đ Free · 0 Ads · Siêu tốc', time: '48.5 to 55.8s', words: '100% Motion Graphics: Bố cục Stat Grid 3 tầng đặc sản của Creative Mode nhấn mạnh 0Đ FREE trọn đời, 0 ADS sạch quảng cáo rác và tốc độ xử lý tức thì.' },
  { id: 'scene-09', start: 55.8,  dur: 10.45, shot: '61.5s', act: 'Act 4: Tự hào thương hiệu Việt & Kêu gọi hành động', title: '09: Trống Đồng & Bản đồ Hoàng Sa - Trường Sa', time: '55.8 to 66.25s', words: 'Motion Poster + Khung 4K sạch #4: Cận cảnh giao diện thật của VieSnap hiển thị trọn vẹn Bản đồ Việt Nam rực sáng đủ Hoàng Sa - Trường Sa và con dấu nghiêng +1 CÔNG CỤ YÊU THÍCH.' },
  { id: 'scene-10', start: 66.25, dur: 9.62,  shot: '71.5s', act: null, title: '10: Màn kết Người Việt dùng hàng Việt', time: '66.25 to 75.87s', words: '100% Motion Graphics: Closing Plate nền Xanh lá #1F8A4C duy nhất của toàn video với địa chỉ VIESNAP.VN cỡ đại và con dấu Hồng xoay -6° THỬ NGAY · 100% FREE.' }
];

const indexHtml = `<!doctype html>
<html lang="vi" data-composition-variables='${JSON.stringify(VARIABLES)}'>
  <head>
    <meta charset="UTF-8" />
    <title>VieSnap.vn — Illustrated Motion Edition</title>
    ${FONT_LINK}
    ${GSAP_SCRIPT}
    <style>
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background: #0F0F0F;
        overflow: hidden;
      }
      #main {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: var(--bg_cream, #EFE9D9);
      }
      .scene-slot {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <div
      id="main"
      data-composition-id="main"
      data-width="1080"
      data-height="1920"
      data-fps="30"
      data-duration="75.87"
    >
      <audio
        id="voiceover"
        src="assets/voiceover.mp3"
        data-start="0"
        data-duration="75.87"
        data-track-index="0"
        data-volume="1"
      ></audio>

${SCENES.map(s => `      <div
        id="${s.id}"
        class="clip scene-slot"
        data-composition-id="${s.id}"
        data-composition-src="compositions/${s.id}.html"
        data-start="${s.start}"
        data-duration="${s.dur}"
        data-track-index="1"
        data-label="${s.title}"
      ></div>`).join('\n')}
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`;

writeFileSync(join(proj, 'index.html'), indexHtml, 'utf8');

// Write boards/storyboard.html following storyboard-recipe.md § 2 exact DOM structure
const storyboardHtml = `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <title>Storyboard — VieSnap.vn Illustrated Motion Edition (10 Cảnh)</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 40px 48px 80px;
        background: #F6F5F1;
        color: #141414;
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      header {
        max-width: 1480px;
        margin: 0 auto 36px;
        padding-bottom: 24px;
        border-bottom: 2px solid #E2DFD7;
      }
      header h1 {
        margin: 0 0 8px;
        font-size: 28px;
        font-weight: 800;
        letter-spacing: -0.02em;
      }
      header p {
        margin: 0;
        color: #555;
        font-size: 15px;
        line-height: 1.5;
      }
      .board-wrap {
        max-width: 1480px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(268px, 1fr));
        gap: 24px;
      }
      section.act {
        grid-column: 1 / -1;
        margin-top: 20px;
        padding: 10px 16px;
        background: #141414;
        color: #EFE9D9;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      .frame {
        background: #FFFFFF;
        border: 1px solid #DFDCD3;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 4px 14px rgba(0,0,0,0.05);
        display: flex;
        flex-direction: column;
      }
      .frame img {
        width: 100%;
        aspect-ratio: 9 / 16;
        object-fit: cover;
        display: block;
        border-bottom: 1px solid #ECE9E0;
      }
      .frame .title {
        padding: 14px 16px 4px;
        font-size: 15px;
        font-weight: 700;
        color: #111;
      }
      .frame .time {
        padding: 0 16px 8px;
        font-size: 12px;
        font-weight: 600;
        color: #E85A1F;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      }
      .frame p.words {
        margin: 0;
        padding: 0 16px 16px;
        font-size: 13px;
        line-height: 1.48;
        color: #4A4A4A;
      }
    </style>
  </head>
  <body>
    <header>
      <h1>Storyboard — VieSnap.vn (Phiên bản Minh Hoạ Motion · 10 Phân cảnh · 75.87s)</h1>
      <p>Phong cách: <strong>#11 Creative Mode</strong> · Khung dọc <code>1080×1920</code> (9:16) · Loại bỏ 100% cảnh người nói · 6 đại cảnh 100% Motion Graphics + 4 cảnh đóng khung màn hình 4K sạch.</p>
    </header>
    <div class="board-wrap">
${SCENES.map((s, idx) => {
  const num = String(idx).padStart(2, '0');
  const actLine = s.act ? `      <section class="act">${s.act}</section>\n` : '';
  return `${actLine}      <div class="frame">
        <img src="stills/frame-${num}-at-${s.shot}.png" alt="${s.title}" />
        <div class="title">${s.title}</div>
        <div class="time">${s.time}</div>
        <p class="words">${s.words}</p>
      </div>`;
}).join('\n')}
    </div>
  </body>
</html>
`;

writeFileSync(join(boardsDir, 'storyboard.html'), storyboardHtml, 'utf8');
console.log('Polished all 10 scenes and wrote boards/storyboard.html');
