import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const work = 'F:/App nha lam/motion-video-demo/videos/viesnap-demo';
const compDir = join(work, 'compositions');
mkdirSync(compDir, { recursive: true });

// Remove legacy captions sub-composition if present
const oldCaptions = join(compDir, 'captions.html');
if (existsSync(oldCaptions)) {
  rmSync(oldCaptions);
}

// 1. package.json & hyperframes.json
writeFileSync(join(work, 'package.json'), JSON.stringify({
  name: 'viesnap-demo',
  private: true,
  version: '0.1.0',
  scripts: {
    preview: 'npx hyperframes@0.8.181 preview',
    check: 'npx hyperframes@0.8.181 check',
    render: 'npx hyperframes@0.8.181 render'
  }
}, null, 2) + '\n');

writeFileSync(join(work, 'hyperframes.json'), JSON.stringify({
  name: 'viesnap-demo',
  entry: 'index.html',
  width: 1080,
  height: 1920,
  fps: 30
}, null, 2) + '\n');

const FONT_LINK = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Be+Vietnam+Pro:wght@600;700;800;900&family=JetBrains+Mono:wght@500;700&family=Space+Grotesk:wght@500;700&display=swap" />`;

const COMMON_CSS = `
  #root {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: "Be Vietnam Pro", "Space Grotesk", sans-serif;
    color: #0F0F0F;
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
    padding: 8px 16px;
    border: 4px solid #0F0F0F;
  }
  .cm-pill {
    display: inline-block;
    background: #EFE9D9;
    color: #0F0F0F;
    font-family: "JetBrains Mono", monospace;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 6px 18px;
    border: 3px solid #0F0F0F;
    border-radius: 999px;
  }
  .cm-card-cream {
    background: #EFE9D9;
    color: #0F0F0F;
    border: 5px solid #0F0F0F;
    box-shadow: 12px 12px 0 var(--accent_orange, #E85A1F), 12px 12px 0 4px #0F0F0F;
  }
  .cm-card-pink {
    background: var(--accent_pink, #F06CA8);
    color: #0F0F0F;
    border: 5px solid #0F0F0F;
    box-shadow: 12px 12px 0 var(--accent_orange, #E85A1F), 12px 12px 0 4px #0F0F0F;
  }
  .cm-card-green {
    background: var(--accent_green, #1F8A4C);
    color: #EFE9D9;
    border: 5px solid #0F0F0F;
    box-shadow: 12px 12px 0 #0F0F0F;
  }
  .cm-flat-cell {
    border: 4px solid #0F0F0F;
    background: #EFE9D9;
    color: #0F0F0F;
  }
  .cm-head {
    font-family: "Be Vietnam Pro", "Archivo Black", sans-serif;
    font-weight: 900;
    text-transform: uppercase;
    line-height: 1.02;
    letter-spacing: -0.01em;
  }
`;

function writeSubComp(id, innerCss, bodyHtml, gsapCode) {
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
        ${innerCss}
      </style>
      <div id="root" data-composition-id="${id}" data-width="1080" data-height="1920">
        ${bodyHtml}
      </div>
      <script>
        const tl = gsap.timeline({ paused: true });
        ${gsapCode}
        window.__timelines["${id}"] = tl;
      </script>
    </template>
  </body>
</html>
`;
  writeFileSync(join(compDir, `${id}.html`), html, 'utf8');
}

// SCENE 01 (0.5s - 6.2s, dur 5.7s) — EXACT original from contact-sheet.jpg
writeSubComp(
  'scene-01',
  `
  #s1-wrap {
    position: absolute;
    top: 96px;
    right: 84px;
    width: 640px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;
  }
  #s1-main {
    width: 100%;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .s1-badges {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }
  .s1-tag {
    background: var(--accent_yellow, #F5C518);
    color: #0F0F0F;
    border: 4px solid #0F0F0F;
    padding: 10px 20px;
    font-size: 34px;
  }
  .s1-tag-alt {
    background: #EFE9D9;
    color: #0F0F0F;
    border: 4px solid #0F0F0F;
    padding: 10px 20px;
    font-size: 34px;
  }
  `,
  `
  <div id="s1-wrap">
    <div id="s1-kicker" class="cm-kicker" data-var-text="scene1_kicker">❌ CÁCH CŨ</div>
    <div id="s1-main" class="cm-card-pink">
      <div class="cm-head" style="font-size: 36px;">TẢI TRỰC TIẾP TRÊN APP:</div>
      <div class="s1-badges">
        <div id="s1-tag1" class="cm-head s1-tag" data-var-text="scene1_tag1">DÍNH LOGO</div>
        <div id="s1-tag2" class="cm-head s1-tag-alt" data-var-text="scene1_tag2">MỜ CĂM</div>
      </div>
    </div>
  </div>
  `,
  `
  tl.fromTo("#s1-kicker", { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "power3.out" }, 0.05);
  tl.fromTo("#s1-main", { x: 80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "back.out(1.4)" }, 0.18);
  tl.fromTo("#s1-tag1", { scale: 0.7, rotation: -8, opacity: 0 }, { scale: 1, rotation: -3, opacity: 1, duration: 0.35, ease: "back.out(1.8)" }, 0.55);
  tl.fromTo("#s1-tag2", { scale: 0.7, rotation: 6, opacity: 0 }, { scale: 1, rotation: 2, opacity: 1, duration: 0.35, ease: "back.out(1.8)" }, 0.85);
  tl.to("#s1-wrap", { opacity: 0, y: -20, duration: 0.3, ease: "power2.in" }, 5.25);
  `
);

// SCENE 02 (6.3s - 11.7s, dur 5.4s) — EXACT original from contact-sheet.jpg
writeSubComp(
  'scene-02',
  `
  #s2-wrap {
    position: absolute;
    top: 1185px;
    left: 84px;
    right: 84px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .s2-toprow {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  #s2-card {
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .s2-chips {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  .s2-chip {
    padding: 10px 8px;
    text-align: center;
    font-size: 23px;
    font-weight: 800;
    border: 4px solid #0F0F0F;
  }
  `,
  `
  <div id="s2-wrap">
    <div class="s2-toprow">
      <div id="s2-kicker" class="cm-kicker">GIẢI PHÁP MỚI</div>
      <div id="s2-pill" class="cm-pill" data-var-text="brand_url">VIESNAP.VN</div>
    </div>
    <div id="s2-card" class="cm-card-cream">
      <div id="s2-title" class="cm-head" style="font-size: 44px;" data-var-text="scene2_title">NÉT CĂNG · KO LOGO · FREE</div>
      <div class="s2-chips">
        <div id="s2-c1" class="cm-head s2-chip" style="background: var(--accent_yellow, #F5C518);">🎬 VIDEO HD</div>
        <div id="s2-c2" class="cm-head s2-chip" style="background: var(--accent_pink, #F06CA8);">🖼️ HÌNH ẢNH</div>
        <div id="s2-c3" class="cm-head s2-chip" style="background: var(--accent_green, #1F8A4C); color: #EFE9D9;">🎵 ÂM THANH</div>
      </div>
    </div>
  </div>
  `,
  `
  tl.fromTo("#s2-kicker", { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ease: "power3.out" }, 0.05);
  tl.fromTo("#s2-pill", { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ease: "power3.out" }, 0.1);
  tl.fromTo("#s2-card", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.4)" }, 0.18);
  tl.fromTo("#s2-c1", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "back.out(1.6)" }, 1.6);
  tl.fromTo("#s2-c2", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "back.out(1.6)" }, 2.1);
  tl.fromTo("#s2-c3", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "back.out(1.6)" }, 2.6);
  tl.to("#s2-wrap", { opacity: 0, y: 20, duration: 0.3, ease: "power2.in" }, 5.0);
  `
);

// SCENE 03 (11.8s - 21.6s, dur 9.8s) — EXACT original from contact-sheet.jpg
writeSubComp(
  'scene-03',
  `
  #s3-wrap {
    position: absolute;
    top: 96px;
    left: 84px;
    right: 84px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .s3-steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  .s3-step {
    padding: 14px 14px;
    border: 4px solid #0F0F0F;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .s3-num {
    font-family: "Archivo Black", "Be Vietnam Pro", sans-serif;
    font-size: 40px;
    line-height: 0.9;
  }
  .s3-txt {
    font-size: 21px;
    font-weight: 800;
    line-height: 1.15;
    text-transform: uppercase;
  }
  `,
  `
  <div id="s3-wrap">
    <div id="s3-head" class="cm-kicker">3 BƯỚC TẢI SIÊU TỐC</div>
    <div class="s3-steps">
      <div id="s3-st1" class="s3-step" style="background: #EFE9D9;">
        <div class="s3-num">01</div>
        <div class="s3-txt" data-var-text="scene3_step1">SAO CHÉP LINK VIDEO</div>
      </div>
      <div id="s3-st2" class="s3-step" style="background: var(--accent_yellow, #F5C518);">
        <div class="s3-num">02</div>
        <div class="s3-txt" data-var-text="scene3_step2">DÁN VÀO VIESNAP.VN</div>
      </div>
      <div id="s3-st3" class="s3-step" style="background: var(--accent_green, #1F8A4C); color: #EFE9D9; box-shadow: 8px 8px 0 #0F0F0F;">
        <div class="s3-num">03</div>
        <div class="s3-txt" data-var-text="scene3_step3">BẤM TẢI HD / MP3</div>
      </div>
    </div>
  </div>
  `,
  `
  tl.fromTo("#s3-head", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power3.out" }, 0.05);
  tl.fromTo("#s3-st1", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "back.out(1.5)" }, 0.3);
  tl.fromTo("#s3-st2", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "back.out(1.5)" }, 2.6);
  tl.fromTo("#s3-st3", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "back.out(1.5)" }, 5.0);
  tl.to("#s3-wrap", { opacity: 0, y: -20, duration: 0.3, ease: "power2.in" }, 9.3);
  `
);

// SCENE 04 (21.7s - 26.3s, dur 4.6s) — EXACT original from contact-sheet.jpg
writeSubComp(
  'scene-04',
  `
  #s4-wrap {
    position: absolute;
    top: 96px;
    left: 84px;
    right: 84px;
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 16px;
  }
  .s4-cell {
    padding: 18px 22px;
    border: 5px solid #0F0F0F;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .s4-big {
    font-family: "Be Vietnam Pro", "Archivo Black", sans-serif;
    font-weight: 900;
    font-size: 46px;
    line-height: 0.95;
    text-transform: uppercase;
  }
  .s4-sub {
    font-family: "JetBrains Mono", monospace;
    font-size: 20px;
    font-weight: 700;
    text-transform: uppercase;
  }
  `,
  `
  <div id="s4-wrap">
    <div id="s4-c1" class="s4-cell" style="background: var(--accent_yellow, #F5C518); box-shadow: 10px 10px 0 #0F0F0F;">
      <div class="s4-sub">CHẤT LƯỢNG GỐC</div>
      <div class="s4-big" data-var-text="scene4_stat1">FULL HD / 4K</div>
    </div>
    <div id="s4-c2" class="s4-cell" style="background: var(--accent_green, #1F8A4C); color: #EFE9D9; box-shadow: 10px 10px 0 var(--accent_orange, #E85A1F), 10px 10px 0 4px #0F0F0F;">
      <div class="s4-sub">SẠCH WATERMARK</div>
      <div class="s4-big" data-var-text="scene4_stat2">0 LOGO</div>
    </div>
  </div>
  `,
  `
  tl.fromTo("#s4-c1", { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: "back.out(1.5)" }, 0.1);
  tl.fromTo("#s4-c2", { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: "back.out(1.5)" }, 0.45);
  tl.to("#s4-wrap", { opacity: 0, y: -20, duration: 0.3, ease: "power2.in" }, 4.2);
  `
);

// SCENE 05 (26.4s - 35.8s, dur 9.4s) — EXACT original from contact-sheet.jpg
writeSubComp(
  'scene-05',
  `
  #s5-wrap {
    position: absolute;
    top: 96px;
    left: 84px;
    right: 84px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .s5-row {
    padding: 16px 20px;
    border: 4px solid #0F0F0F;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .s5-title {
    font-size: 28px;
    font-weight: 900;
    text-transform: uppercase;
  }
  `,
  `
  <div id="s5-wrap">
    <div id="s5-kicker" class="cm-kicker">TÍCH HỢP ALL-IN-ONE TRONG VIESNAP</div>
    <div id="s5-r1" class="s5-row" style="background: #EFE9D9; box-shadow: 8px 8px 0 #0F0F0F;">
      <div class="s5-title" data-var-text="scene5_feat1">TẢI ẢNH NÉT -> HÌNH NỀN</div>
      <div class="cm-pill">JPG / PNG</div>
    </div>
    <div id="s5-r2" class="s5-row" style="background: var(--accent_pink, #F06CA8); box-shadow: 8px 8px 0 var(--accent_orange, #E85A1F), 8px 8px 0 4px #0F0F0F;">
      <div class="s5-title" data-var-text="scene5_feat2">TẢI ÂM THANH -> NHẠC CHUÔNG</div>
      <div class="cm-pill">MP3 GỐC</div>
    </div>
  </div>
  `,
  `
  tl.fromTo("#s5-kicker", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power3.out" }, 0.05);
  tl.fromTo("#s5-r1", { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: "back.out(1.4)" }, 0.35);
  tl.fromTo("#s5-r2", { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: "back.out(1.4)" }, 2.4);
  tl.to("#s5-wrap", { opacity: 0, y: -20, duration: 0.3, ease: "power2.in" }, 8.9);
  `
);

// SCENE 06 (35.9s - 39.8s, dur 3.9s) — EXACT original from contact-sheet.jpg
writeSubComp(
  'scene-06',
  `
  #s6-wrap {
    position: absolute;
    top: 96px;
    left: 84px;
    right: 84px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .s6-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  .s6-item {
    padding: 12px 10px;
    border: 4px solid #0F0F0F;
    font-family: "Be Vietnam Pro", "Archivo Black", sans-serif;
    font-weight: 900;
    font-size: 25px;
    text-align: center;
    text-transform: uppercase;
  }
  `,
  `
  <div id="s6-wrap">
    <div id="s6-kicker" class="cm-kicker">HỖ TRỢ ĐA NỀN TẢNG</div>
    <div class="s6-grid">
      <div id="s6-p1" class="s6-item" style="background: var(--accent_yellow, #F5C518);">TIKTOK</div>
      <div id="s6-p2" class="s6-item" style="background: var(--accent_pink, #F06CA8);">DOUYIN</div>
      <div id="s6-p3" class="s6-item" style="background: #EFE9D9;">FACEBOOK</div>
      <div id="s6-p4" class="s6-item" style="background: #EFE9D9;">INSTAGRAM</div>
      <div id="s6-p5" class="s6-item" style="background: var(--accent_green, #1F8A4C); color: #EFE9D9;">THREADS</div>
      <div id="s6-p6" class="s6-item" style="background: var(--accent_orange, #E85A1F); color: #EFE9D9;">PINTEREST</div>
    </div>
  </div>
  `,
  `
  tl.fromTo("#s6-kicker", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25 }, 0.05);
  tl.fromTo(["#s6-p1", "#s6-p2", "#s6-p3", "#s6-p4", "#s6-p5", "#s6-p6"], { scale: 0.75, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.28, stagger: 0.1, ease: "back.out(1.7)" }, 0.2);
  tl.to("#s6-wrap", { opacity: 0, y: -20, duration: 0.25 }, 3.5);
  `
);

// SCENE 07 (39.9s - 55.7s, dur 15.8s) — EXACT original from contact-sheet.jpg
writeSubComp(
  'scene-07',
  `
  #s7-wrap {
    position: absolute;
    top: 96px;
    left: 84px;
    right: 84px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  #s7-banner {
    padding: 16px 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .s7-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  .s7-cell {
    padding: 16px 14px;
    border: 4px solid #0F0F0F;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .s7-num {
    font-family: "Be Vietnam Pro", "Archivo Black", sans-serif;
    font-weight: 900;
    font-size: 36px;
    line-height: 0.95;
  }
  .s7-lbl {
    font-family: "JetBrains Mono", monospace;
    font-size: 18px;
    font-weight: 700;
    text-transform: uppercase;
  }
  `,
  `
  <div id="s7-wrap">
    <div id="s7-banner" class="cm-card-cream">
      <div class="cm-head" style="font-size: 36px;" data-var-text="scene7_kicker">CÔNG CỤ VIỆT · CHẤT VIỆT</div>
      <div class="cm-pill">MADE IN VN</div>
    </div>
    <div class="s7-stats">
      <div id="s7-c1" class="s7-cell" style="background: var(--accent_green, #1F8A4C); color: #EFE9D9;">
        <div class="s7-num" data-var-text="scene7_stat1">0Đ FREE</div>
        <div class="s7-lbl">MIỄN PHÍ 100%</div>
      </div>
      <div id="s7-c2" class="s7-cell" style="background: var(--accent_pink, #F06CA8);">
        <div class="s7-num" data-var-text="scene7_stat2">0 ADS</div>
        <div class="s7-lbl">KO QUẢNG CÁO</div>
      </div>
      <div id="s7-c3" class="s7-cell" style="background: var(--accent_yellow, #F5C518);">
        <div class="s7-num">SIÊU TỐC</div>
        <div class="s7-lbl">KHÔNG GIỚI HẠN</div>
      </div>
    </div>
  </div>
  `,
  `
  tl.fromTo("#s7-banner", { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.4)" }, 0.2);
  tl.fromTo("#s7-c1", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "back.out(1.6)" }, 9.8);
  tl.fromTo("#s7-c2", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "back.out(1.6)" }, 10.6);
  tl.fromTo("#s7-c3", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "back.out(1.6)" }, 11.4);
  tl.to("#s7-wrap", { opacity: 0, y: -20, duration: 0.3, ease: "power2.in" }, 15.3);
  `
);

// SCENE 08 (55.8s - 66.2s, dur 10.4s) — EXACT original from contact-sheet.jpg
writeSubComp(
  'scene-08',
  `
  #s8-wrap {
    position: absolute;
    top: 96px;
    left: 84px;
    right: 84px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;
  }
  #s8-card {
    width: 100%;
    padding: 20px 24px;
    background: var(--accent_yellow, #F5C518);
    border: 5px solid #0F0F0F;
    box-shadow: 12px 12px 0 var(--accent_orange, #E85A1F), 12px 12px 0 4px #0F0F0F;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  #s8-stamp {
    background: var(--accent_green, #1F8A4C);
    color: #EFE9D9;
    border: 4px solid #0F0F0F;
    padding: 10px 22px;
    font-size: 26px;
  }
  `,
  `
  <div id="s8-wrap">
    <div id="s8-card">
      <div class="cm-kicker">TRỐNG ĐỒNG &amp; BẢN ĐỒ VIỆT NAM</div>
      <div class="cm-head" style="font-size: 38px;" data-var-text="scene8_stamp">HOÀNG SA · TRƯỜNG SA</div>
      <div style="font-size: 23px; font-weight: 700;">Đầy đủ chủ quyền biển đảo Việt Nam ngay trên trang chủ!</div>
    </div>
    <div id="s8-stamp" class="cm-head">+1 CÔNG CỤ DÙNG THƯỜNG XUYÊN</div>
  </div>
  `,
  `
  tl.fromTo("#s8-card", { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.4)" }, 0.2);
  tl.fromTo("#s8-stamp", { scale: 0.7, rotation: -8, opacity: 0 }, { scale: 1, rotation: -3, opacity: 1, duration: 0.4, ease: "back.out(1.8)" }, 4.5);
  tl.to("#s8-wrap", { opacity: 0, y: -20, duration: 0.3, ease: "power2.in" }, 9.9);
  `
);

// SCENE 09 (66.3s - 75.86s, dur 9.56s) — EXACT original from contact-sheet.jpg
writeSubComp(
  'scene-09',
  `
  #s9-wrap {
    position: absolute;
    top: 1185px;
    left: 84px;
    right: 84px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  #s9-plate {
    padding: 24px 28px;
    background: var(--accent_green, #1F8A4C);
    color: #EFE9D9;
    border: 5px solid #0F0F0F;
    box-shadow: 12px 12px 0 var(--accent_orange, #E85A1F), 12px 12px 0 4px #0F0F0F;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .s9-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  #s9-stamp {
    align-self: flex-end;
    background: var(--accent_pink, #F06CA8);
    color: #0F0F0F;
    border: 4px solid #0F0F0F;
    padding: 10px 22px;
    font-size: 26px;
  }
  `,
  `
  <div id="s9-wrap">
    <div id="s9-plate">
      <div class="s9-top">
        <div class="cm-kicker">TRUY CẬP NGAY</div>
        <div class="cm-pill" data-var-text="brand_url">VIESNAP.VN</div>
      </div>
      <div class="cm-head" style="font-size: 44px; color: #EFE9D9;" data-var-text="scene9_cta">NGƯỜI VIỆT DÙNG HÀNG VIỆT</div>
      <div style="font-size: 23px; font-weight: 700; color: #EFE9D9;">Tải Video · Ảnh · MP3 TikTok, Douyin, FB, IG miễn phí!</div>
    </div>
    <div id="s9-stamp" class="cm-head">THỬ NGAY · 100% FREE</div>
  </div>
  `,
  `
  tl.fromTo("#s9-plate", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.4)" }, 0.15);
  tl.fromTo("#s9-stamp", { scale: 0.6, rotation: -10, opacity: 0 }, { scale: 1, rotation: -4, opacity: 1, duration: 0.4, ease: "back.out(1.8)" }, 2.2);
  `
);

// ROOT index.html — EXACT original host slots from contact-sheet.jpg, minus captions, plus 9 synced SFX tracks
const VARIABLES = [
  { id: 'brand_url', type: 'string', label: 'Địa chỉ Web (Brand URL)', default: 'VIESNAP.VN' },
  { id: 'scene1_kicker', type: 'string', label: 'Cảnh 1 - Nhãn', default: '❌ CÁCH CŨ' },
  { id: 'scene1_tag1', type: 'string', label: 'Cảnh 1 - Lỗi 1', default: 'DÍNH LOGO' },
  { id: 'scene1_tag2', type: 'string', label: 'Cảnh 1 - Lỗi 2', default: 'MỜ CĂM' },
  { id: 'scene2_title', type: 'string', label: 'Cảnh 2 - Tiêu đề giải pháp', default: 'NÉT CĂNG · KO LOGO · FREE' },
  { id: 'scene3_step1', type: 'string', label: 'Cảnh 3 - Bước 1', default: 'SAO CHÉP LINK VIDEO' },
  { id: 'scene3_step2', type: 'string', label: 'Cảnh 3 - Bước 2', default: 'DÁN VÀO VIESNAP.VN' },
  { id: 'scene3_step3', type: 'string', label: 'Cảnh 3 - Bước 3', default: 'BẤM TẢI HD / MP3' },
  { id: 'scene4_stat1', type: 'string', label: 'Cảnh 4 - Độ phân giải', default: 'FULL HD / 4K' },
  { id: 'scene4_stat2', type: 'string', label: 'Cảnh 4 - Watermark', default: '0 LOGO' },
  { id: 'scene5_feat1', type: 'string', label: 'Cảnh 5 - Tính năng 1', default: 'TẢI ẢNH NÉT -> HÌNH NỀN' },
  { id: 'scene5_feat2', type: 'string', label: 'Cảnh 5 - Tính năng 2', default: 'TẢI ÂM THANH -> NHẠC CHUÔNG' },
  { id: 'scene7_kicker', type: 'string', label: 'Cảnh 7 - Khẩu hiệu', default: 'CÔNG CỤ VIỆT · CHẤT VIỆT' },
  { id: 'scene7_stat1', type: 'string', label: 'Cảnh 7 - Giá', default: '0Đ FREE' },
  { id: 'scene7_stat2', type: 'string', label: 'Cảnh 7 - Quảng cáo', default: '0 ADS' },
  { id: 'scene8_stamp', type: 'string', label: 'Cảnh 8 - Bản đồ Việt Nam', default: 'HOÀNG SA · TRƯỜNG SA' },
  { id: 'scene9_cta', type: 'string', label: 'Cảnh 9 - Lời kêu gọi kết', default: 'NGƯỜI VIỆT DÙNG HÀNG VIỆT' },
  { id: 'accent_pink', type: 'color', label: 'Màu nhấn Hồng (Pink)', default: '#F06CA8' },
  { id: 'accent_green', type: 'color', label: 'Màu nhấn Xanh lá (Green)', default: '#1F8A4C' },
  { id: 'accent_orange', type: 'color', label: 'Màu nhấn Cam (Orange)', default: '#E85A1F' },
  { id: 'accent_yellow', type: 'color', label: 'Màu nhấn Vàng (Yellow)', default: '#F5C518' }
];

const SFX_VOL = '0.38';

const indexHtml = `<!doctype html>
<html lang="vi" data-composition-variables='${JSON.stringify(VARIABLES)}'>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <title>VieSnap Demo — Creative Mode</title>
    ${FONT_LINK}
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        margin: 0;
        background: #0F0F0F;
        color: #0F0F0F;
        font-family: "Be Vietnam Pro", "Space Grotesk", sans-serif;
      }
      #root {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #0F0F0F;
      }
      #a-roll {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 1;
      }
      .scene-host {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
        pointer-events: none;
      }
    </style>
  </head>
  <body>
    <div
      id="root"
      data-composition-id="main"
      data-start="0"
      data-width="1080"
      data-height="1920"
      data-duration="75.86"
    >
      <video
        id="a-roll"
        class="clip"
        src="assets/demo.mp4"
        playsinline
        data-has-audio="true"
        data-start="0"
        data-duration="75.86"
        data-track-index="0"
        data-volume="1"
      ></video>

      <div id="host-s1" class="clip scene-host" data-composition-id="scene-01" data-composition-src="compositions/scene-01.html" data-start="0.5" data-duration="5.7" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>
      <div id="host-s2" class="clip scene-host" data-composition-id="scene-02" data-composition-src="compositions/scene-02.html" data-start="6.3" data-duration="5.4" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>
      <div id="host-s3" class="clip scene-host" data-composition-id="scene-03" data-composition-src="compositions/scene-03.html" data-start="11.8" data-duration="9.8" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>
      <div id="host-s4" class="clip scene-host" data-composition-id="scene-04" data-composition-src="compositions/scene-04.html" data-start="21.7" data-duration="4.6" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>
      <div id="host-s5" class="clip scene-host" data-composition-id="scene-05" data-composition-src="compositions/scene-05.html" data-start="26.4" data-duration="9.4" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>
      <div id="host-s6" class="clip scene-host" data-composition-id="scene-06" data-composition-src="compositions/scene-06.html" data-start="35.9" data-duration="3.9" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>
      <div id="host-s7" class="clip scene-host" data-composition-id="scene-07" data-composition-src="compositions/scene-07.html" data-start="39.9" data-duration="15.8" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>
      <div id="host-s8" class="clip scene-host" data-composition-id="scene-08" data-composition-src="compositions/scene-08.html" data-start="55.8" data-duration="10.4" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>
      <div id="host-s9" class="clip scene-host" data-composition-id="scene-09" data-composition-src="compositions/scene-09.html" data-start="66.3" data-duration="9.56" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>

      <audio id="sfx-s1" src="assets/sfx-s1.wav" data-start="0.5" data-duration="5.7" data-track-index="2" data-volume="${SFX_VOL}"></audio>
      <audio id="sfx-s2" src="assets/sfx-s2.wav" data-start="6.3" data-duration="5.4" data-track-index="2" data-volume="${SFX_VOL}"></audio>
      <audio id="sfx-s3" src="assets/sfx-s3.wav" data-start="11.8" data-duration="9.8" data-track-index="2" data-volume="${SFX_VOL}"></audio>
      <audio id="sfx-s4" src="assets/sfx-s4.wav" data-start="21.7" data-duration="4.6" data-track-index="2" data-volume="${SFX_VOL}"></audio>
      <audio id="sfx-s5" src="assets/sfx-s5.wav" data-start="26.4" data-duration="9.4" data-track-index="2" data-volume="${SFX_VOL}"></audio>
      <audio id="sfx-s6" src="assets/sfx-s6.wav" data-start="35.9" data-duration="3.9" data-track-index="2" data-volume="${SFX_VOL}"></audio>
      <audio id="sfx-s7" src="assets/sfx-s7.wav" data-start="39.9" data-duration="15.8" data-track-index="2" data-volume="${SFX_VOL}"></audio>
      <audio id="sfx-s8" src="assets/sfx-s8.wav" data-start="55.8" data-duration="10.4" data-track-index="2" data-volume="${SFX_VOL}"></audio>
      <audio id="sfx-s9" src="assets/sfx-s9.wav" data-start="66.3" data-duration="9.56" data-track-index="2" data-volume="${SFX_VOL}"></audio>
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`;

writeFileSync(join(work, 'index.html'), indexHtml, 'utf8');
console.log('Restored exact original visual timings + caption-free index.html + 9 synced SFX tracks.');
