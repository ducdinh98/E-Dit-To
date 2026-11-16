import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const projDir = 'f:/App nha lam/motion-video-demo/videos/iphone-duo-review-5m';
const compDir = join(projDir, 'compositions');
mkdirSync(compDir, { recursive: true });

const FONT_LINK = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Be+Vietnam+Pro:wght@500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&family=Space+Grotesk:wght@500;700&display=swap" />`;

const COMMON_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  #root {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    container-type: size;
    font-family: "Be Vietnam Pro", "Space Grotesk", sans-serif;
    color: #0F0F0F;
    background: transparent;
  }
  .cm-full-ground {
    position: absolute;
    inset: 0;
    background-color: var(--bg_cream, #EFE9D9);
    background-image: radial-gradient(#0F0F0F 1.25px, transparent 1.25px);
    background-size: 36px 36px;
    z-index: 0;
  }
  .cm-full-ground ~ * {
    z-index: 2;
  }
  .cm-corner {
    position: absolute;
    width: 28px;
    height: 28px;
    border-color: #0F0F0F;
    border-style: solid;
    z-index: 5;
  }
  .cm-corner.tl { top: 28px; left: 28px; border-width: 4px 0 0 4px; }
  .cm-corner.tr { top: 28px; right: 28px; border-width: 4px 4px 0 0; }
  .cm-corner.bl { bottom: 28px; left: 28px; border-width: 0 0 4px 4px; }
  .cm-corner.br { bottom: 28px; right: 28px; border-width: 0 4px 4px 0; }

  .cm-stage {
    position: absolute;
    inset: 0;
    z-index: 6;
  }
  .cm-kicker {
    display: inline-block;
    background: #0F0F0F;
    color: #EFE9D9;
    font-family: "JetBrains Mono", monospace;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 8px 18px;
    border: 4px solid #0F0F0F;
    box-shadow: 7px 7px 0 var(--accent_orange, #E85A1F);
    align-self: flex-start;
  }
  .cm-mono-dark-pill {
    display: inline-block;
    background: #0F0F0F;
    color: #EFE9D9;
    font-family: "JetBrains Mono", monospace;
    font-size: 17px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 5px 12px;
    align-self: flex-start;
  }
  .cm-head {
    font-family: "Be Vietnam Pro", "Archivo Black", sans-serif;
    font-weight: 900;
    text-transform: uppercase;
    line-height: 1.15;
    letter-spacing: -0.015em;
  }
  .cm-body {
    font-family: "Be Vietnam Pro", "Space Grotesk", sans-serif;
    font-weight: 600;
    line-height: 1.35;
    color: #0F0F0F;
  }
  .cm-mono {
    font-family: "JetBrains Mono", monospace;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .cm-card-cream {
    background: var(--bg_cream, #EFE9D9);
    color: #0F0F0F;
    border: 5px solid #0F0F0F;
  }
  .cm-card-cream2 {
    background: #E4DCC4;
    color: #0F0F0F;
    border: 5px solid #0F0F0F;
  }
  .cm-card-pink {
    background: var(--accent_pink, #F06CA8);
    color: #0F0F0F;
    border: 5px solid #0F0F0F;
  }
  .cm-card-yellow {
    background: var(--accent_yellow, #F5C518);
    color: #0F0F0F;
    border: 5px solid #0F0F0F;
  }
  .cm-card-orange {
    background: var(--accent_orange, #E85A1F);
    color: #0F0F0F;
    border: 5px solid #0F0F0F;
  }
  .cm-card-green {
    background: #136636;
    color: #EFE9D9;
    border: 5px solid #0F0F0F;
  }
  .cm-card-ink {
    background: #0F0F0F;
    color: #EFE9D9;
    border: 5px solid #0F0F0F;
  }
  .cm-shadow-featured {
    box-shadow: 11px 11px 0 var(--accent_orange, #E85A1F), 11px 11px 0 4px #0F0F0F;
  }
  .cm-shadow-ink {
    box-shadow: 9px 9px 0 #0F0F0F;
  }
  .cm-badge-rot {
    background: var(--accent_yellow, #F5C518);
    color: #0F0F0F;
    border: 5px solid #0F0F0F;
    box-shadow: 8px 8px 0 #0F0F0F;
    transform: rotate(-3deg);
    padding: 12px 22px;
  }
  .cm-stamp-rot {
    background: var(--accent_pink, #F06CA8);
    color: #0F0F0F;
    border: 5px solid #0F0F0F;
    box-shadow: 8px 8px 0 #0F0F0F;
    transform: rotate(-4deg);
    padding: 14px 24px;
  }
`;

function wrapSubComp(id, css, html, js) {
  return `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>
    <template>
      ${FONT_LINK}
      <style>
        ${COMMON_CSS}
        ${css}
      </style>
      <div id="root" data-composition-id="${id}" data-width="1920" data-height="1080">
        ${html}
      </div>
      <script>
        const tl = gsap.timeline({ paused: true });
        ${js}
        window.__timelines["${id}"] = tl;
      </script>
    </template>
  </body>
</html>`;
}

// ============================================================================
// SCENE 01 (0.00s - 32.50s, dur 32.50s):
// [A-roll + B-roll (7.93-13.80s) + SVG Polarity Gauge & Balance Rig Overlay]
// ============================================================================
const s1Css = `
  #s1-left {
    position: absolute;
    top: 42px;
    left: 38px;
    width: 440px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  #s1-gauge-card {
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  #s1-media-win {
    padding: 12px 18px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  #s1-right {
    position: absolute;
    top: 42px;
    right: 38px;
    width: 470px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  #s1-prod-fail {
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  #s1-buy-cta {
    padding: 14px 20px;
    margin-top: 4px;
  }
`;

const s1Html = `
  <div class="cm-stage">
    <div id="s1-left">
      <div id="s1-kicker" class="cm-kicker">ĐÁNH GIÁ THỰC TẾ // IPHONE DUO</div>
      <div id="s1-gauge-card" class="cm-card-cream cm-shadow-featured">
        <div class="cm-mono" style="font-size:16px;">ĐỒNG HỒ ĐO THỰC TẾ SAU KHI TRÊN TAY</div>
        <div class="cm-head" style="font-size:44px;" data-var-text="product_name">IPHONE DUO</div>
        <!-- Animated SVG Dual-Pole Meter -->
        <svg viewBox="0 0 440 135" width="100%" height="125" fill="none">
          <rect x="4" y="4" width="432" height="126" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="4"/>
          <!-- Left Arc: FAIL (Orange/Pink) / Right Arc: WIN (Green) -->
          <path d="M 85 106 A 135 88 0 0 1 220 22" stroke="#E85A1F" stroke-width="20" fill="none"/>
          <path d="M 220 22 A 135 88 0 0 1 355 106" stroke="#1F8A4C" stroke-width="20" fill="none"/>
          <text x="64" y="123" fill="#0F0F0F" font-family="JetBrains Mono, monospace" font-size="14" font-weight="800">SẢN PHẨM ✕</text>
          <text x="292" y="123" fill="#0F0F0F" font-family="JetBrains Mono, monospace" font-size="14" font-weight="800">TRUYỀN THÔNG ✓</text>
          <!-- Pivot & Needle -->
          <g id="s1-needle" style="transform-origin: 220px 106px;">
            <line x1="220" y1="106" x2="220" y2="28" stroke="#0F0F0F" stroke-width="8" stroke-linecap="round"/>
            <polygon points="220,16 210,36 230,36" fill="#F5C518" stroke="#0F0F0F" stroke-width="3"/>
          </g>
          <circle cx="220" cy="106" r="12" fill="#0F0F0F"/>
          <circle cx="220" cy="106" r="5" fill="#F5C518"/>
        </svg>
      </div>

      <div id="s1-media-win" class="cm-card-green cm-shadow-ink">
        <div class="cm-mono-dark-pill">MẶT TRUYỀN THÔNG · MARKETING</div>
        <div class="cm-head" style="font-size:28px;color:#EFE9D9;">THÀNH CÔNG RỰC RỠ ✓</div>
        <div class="cm-body" style="font-size:18px;color:#EFE9D9;">Độ phủ sóng và bàn tán cực lớn sau khi ra mắt.</div>
      </div>
    </div>

    <div id="s1-right">
      <div id="s1-prod-fail" class="cm-card-pink cm-shadow-ink">
        <div class="cm-mono-dark-pill">GÓC ĐỘ SẢN PHẨM THỰC TẾ</div>
        <div class="cm-head" style="font-size:34px;" data-var-text="s1_verdict">THẤT BẠI VỀ MẶT SẢN PHẨM! ✕</div>
        <!-- Animated SVG Balance Scale Tilting Down on Fail -->
        <svg viewBox="0 0 440 120" width="100%" height="120" fill="none">
          <rect x="4" y="4" width="432" height="112" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
          <polygon points="220,98 202,112 238,112" fill="#0F0F0F"/>
          <line x1="220" y1="42" x2="220" y2="98" stroke="#0F0F0F" stroke-width="6"/>
          <g id="s1-scale-beam" style="transform-origin: 220px 52px;">
            <line x1="80" y1="68" x2="360" y2="36" stroke="#0F0F0F" stroke-width="6"/>
            <rect x="38" y="68" width="110" height="34" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>
            <text x="93" y="91" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono, monospace" font-size="16" font-weight="800">TRẢI NGHIỆM</text>
            <rect x="292" y="14" width="110" height="34" fill="#136636" stroke="#0F0F0F" stroke-width="4"/>
            <text x="347" y="37" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono, monospace" font-size="16" font-weight="800">DANH TIẾNG</text>
          </g>
        </svg>
      </div>

      <div id="s1-buy-cta" class="cm-badge-rot">
        <div class="cm-mono" style="font-size:17px;">CÂU HỎI CỐT LÕI TRONG VIDEO</div>
        <div class="cm-head" style="font-size:28px;">VÌ SAO THẤT BẠI & CÓ NÊN MUA KHÔNG?</div>
      </div>
    </div>
  </div>
`;

const s1Js = `
  tl.fromTo("#s1-kicker", { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 0.30);
  // "nói về việc iPhone Duo (3.41s) vì sao nó sẽ thất bại (5.33s) và vì sao nó sẽ thành công (7.27s)"
  tl.fromTo("#s1-gauge-card", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 3.20);
  // "chính ra nó thành công phết đấy các bạn ạ (15.50s - 17.25s)"
  tl.fromTo("#s1-needle", { rotation: 0 }, { rotation: 48, duration: 0.60, ease: "back.out(1.4)" }, 15.20);
  // "Nhưng nó lại thành công về mặt truyền thông (17.63s - 19.29s)"
  tl.fromTo("#s1-media-win", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 17.60);
  // "Và theo quan điểm của tôi thì iPhone Duo lại thất bại về mặt sản phẩm (19.91s - 22.95s)"
  tl.to("#s1-needle", { rotation: -52, duration: 0.58, ease: "back.out(1.5)" }, 20.80);
  tl.fromTo("#s1-prod-fail", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 21.00);
  tl.fromTo("#s1-scale-beam", { rotation: 14 }, { rotation: 0, duration: 0.65, ease: "back.out(1.6)" }, 21.30);
  // "vì sao cá nhân tôi lại cho rằng iPhone Duo thất bại (26.91s) và liệu anh em có nên mua nó hay không (27.73s)"
  tl.fromTo("#s1-buy-cta", { scale: 1.24, rotation: -8, opacity: 0 }, { scale: 1, rotation: -3, opacity: 1, duration: 0.50, ease: "power4.out" }, 26.50);
`;

writeFileSync(join(compDir, 'scene-01.html'), wrapSubComp('scene-01', s1Css, s1Html, s1Js));

// ============================================================================
// SCENE 02 (43.93s - 89.57s, dur 45.64s):
// Phase A (0.00s - 14.57s = 43.93s - 58.50s): A-roll + SVG Price & 0 Gift Overlay
// Phase B (14.57s - 45.64s = 58.50s - 89.57s): 100% Motion Graphics Conveyor & 3 Scanner Gates
// ============================================================================
const s2Css = `
  #s2-aroll-layer {
    position: absolute;
    inset: 0;
    z-index: 4;
  }
  #s2-aroll-left {
    position: absolute;
    top: 56px;
    left: 48px;
    width: 490px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  #s2-aroll-right {
    position: absolute;
    top: 56px;
    right: 48px;
    width: 470px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  #s2-full-layer {
    position: absolute;
    inset: 0;
    z-index: 10;
    opacity: 0;
  }
  .s2-top-head {
    position: absolute;
    top: 30px;
    left: 64px;
    right: 64px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    z-index: 15;
  }
  .s2-gate-pill {
    position: absolute;
    top: 758px;
    background: #0F0F0F;
    color: #EFE9D9;
    font-family: "JetBrains Mono", monospace;
    font-size: 21px;
    font-weight: 800;
    padding: 9px 18px;
    border: 4px solid #0F0F0F;
    box-shadow: 6px 6px 0 #E4DCC4, 6px 6px 0 3px #0F0F0F;
    z-index: 16;
  }
  #s2-gp-1 { left: 265px; }
  #s2-gp-2 { left: 685px; }
  #s2-gp-3 { left: 1105px; }

  .s2-item-card {
    position: absolute;
    top: 502px;
    left: 70px;
    width: 210px;
    height: 216px;
    background: #EFE9D9;
    border: 5px solid #0F0F0F;
    box-shadow: 8px 8px 0 #0F0F0F;
    padding: 14px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 18;
    opacity: 0;
  }
  .s2-ic-boxes {
    display: flex;
    justify-content: space-between;
    gap: 8px;
  }
  .s2-ic-box {
    width: 46px;
    height: 42px;
    border: 3.5px solid #0F0F0F;
    background: #E4DCC4;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Be Vietnam Pro", sans-serif;
    font-size: 24px;
    font-weight: 900;
  }
  #s2-android-parked {
    position: absolute;
    top: 156px;
    left: 64px;
    width: 500px;
    padding: 12px 18px;
    z-index: 19;
    opacity: 0;
  }
  #s2-applecare-ticket {
    position: absolute;
    top: 156px;
    left: 610px;
    width: 680px;
    padding: 12px 18px;
    z-index: 19;
    opacity: 0;
  }
  #s2-verdict-stamp {
    position: absolute;
    bottom: 42px;
    left: 50%;
    margin-left: -450px;
    width: 900px;
    text-align: center;
    padding: 14px 28px;
    z-index: 22;
    opacity: 0;
  }
`;

const s2Html = `
  <!-- PHASE A: A-ROLL OVERLAY (0.00s - 14.57s) -->
  <div id="s2-aroll-layer">
    <div id="s2-aroll-left">
      <div id="s2-a-kicker" class="cm-kicker">YẾU TỐ 01 // CÂU CHUYỆN GIÁ BÁN</div>
      <div id="s2-a-price" class="cm-card-yellow cm-shadow-featured" style="padding:22px 26px;">
        <div class="cm-mono" style="font-size:18px;">PHIÊN BẢN THẤP NHẤT HIỆN TẠI</div>
        <div class="cm-head" style="font-size:74px;line-height:1.14;margin-top:6px;" data-var-text="price_duo">65 TRIỆU</div>
        <div class="cm-body" style="font-size:21px;margin-top:6px;">Mức giá khiến nhiều người dùng băn khoăn nhất.</div>
      </div>
    </div>
    <div id="s2-aroll-right">
      <div id="s2-a-nogift" class="cm-card-pink cm-shadow-ink" style="padding:20px 24px;display:flex;flex-direction:column;gap:12px;">
        <div class="cm-mono-dark-pill">QUYỀN LỢI ĐI KÈM</div>
        <div class="cm-head" style="font-size:34px;">0 QUÀ TẶNG ĐI KÈM! ✕</div>
        <svg viewBox="0 0 400 130" width="100%" height="130" fill="none">
          <rect x="4" y="4" width="392" height="122" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
          <!-- Gift Box SVG -->
          <rect x="150" y="46" width="100" height="64" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
          <rect x="142" y="30" width="116" height="20" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>
          <line x1="200" y1="30" x2="200" y2="110" stroke="#0F0F0F" stroke-width="8"/>
          <!-- Red X Strike -->
          <line x1="115" y1="18" x2="285" y2="114" stroke="#E85A1F" stroke-width="10"/>
          <line x1="285" y1="18" x2="115" y2="114" stroke="#E85A1F" stroke-width="10"/>
        </svg>
      </div>
    </div>
  </div>

  <!-- PHASE B: 100% MOTION GRAPHICS CONVEYOR PIPELINE (14.57s - 45.64s) -->
  <div id="s2-full-layer">
    <div class="cm-full-ground"></div>
    <div class="cm-corner tl"></div>
    <div class="cm-corner tr"></div>
    <div class="cm-corner bl"></div>
    <div class="cm-corner br"></div>

    <div class="s2-top-head">
      <div style="display:flex;flex-direction:column;gap:6px;">
        <div class="cm-kicker">BĂNG TẢI KIỂM ĐỊNH // QUYỀN LỢI MUA MÁY & BẢO HÀNH</div>
        <div class="cm-head" style="font-size:42px;">GẬP ANDROID VS IPHONE DUO (65 TRIỆU)</div>
      </div>
      <div class="cm-badge-rot">
        <div class="cm-mono" style="font-size:18px;">PHÉP THỬ 3 CỔNG QUYỀN LỢI</div>
      </div>
    </div>

    <!-- Full-screen SVG Conveyor & 3 Scanner Arches + Warranty Inspector Machine -->
    <svg viewBox="0 0 1920 1080" width="1920" height="1080" fill="none" style="position:absolute;inset:0;z-index:12;">
      <!-- Conveyor Belt Track -->
      <rect x="64" y="712" width="1440" height="36" fill="#0F0F0F"/>
      <line id="s2-belt-dashes" x1="80" y1="730" x2="1490" y2="730" stroke="#F5C518" stroke-width="6" stroke-dasharray="28 22"/>

      <!-- Arch 1: QUÀ TẶNG VẬT PHẨM (x=370) -->
      <path id="s2-arch-1" d="M 275 712 L 275 466 A 95 95 0 0 1 465 466 L 465 712 Z" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="7"/>
      <circle cx="370" cy="374" r="38" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
      <rect x="350" y="357" width="40" height="34" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
      <line x1="370" y1="357" x2="370" y2="391" stroke="#0F0F0F" stroke-width="4"/>

      <!-- Arch 2: GIẢM GIÁ TRỰC TIẾP (x=790) -->
      <path id="s2-arch-2" d="M 695 712 L 695 466 A 95 95 0 0 1 885 466 L 885 712 Z" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="7"/>
      <circle cx="790" cy="374" r="38" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
      <text x="790" y="386" text-anchor="middle" fill="#0F0F0F" font-family="Archivo Black, sans-serif" font-size="30">%</text>

      <!-- Arch 3: HỖ TRỢ BẢO HÀNH (x=1210) -->
      <path id="s2-arch-3" d="M 1115 712 L 1115 466 A 95 95 0 0 1 1305 466 L 1305 712 Z" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="7"/>
      <circle cx="1210" cy="374" r="38" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
      <path d="M 1210 351 L 1230 361 L 1230 379 C 1230 391 1210 399 1210 399 C 1210 399 1190 391 1190 379 L 1190 361 Z" fill="#136636" stroke="#0F0F0F" stroke-width="3.5"/>

      <!-- Right Processing Unit: TRẠM KIỂM ĐỊNH BẢO HÀNH (x=1480..1830) -->
      <rect x="1494" y="384" width="340" height="350" fill="#E85A1F" stroke="#0F0F0F" stroke-width="5"/>
      <rect x="1480" y="370" width="340" height="350" fill="#0F0F0F" stroke="#0F0F0F" stroke-width="6"/>
      <rect x="1555" y="324" width="190" height="48" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
      <text x="1650" y="356" text-anchor="middle" fill="#0F0F0F" font-family="JetBrains Mono, monospace" font-size="22" font-weight="800">TRẠM BẢO HÀNH</text>
      <!-- Machine Screen -->
      <rect x="1516" y="406" width="268" height="128" fill="#133829" stroke="#EFE9D9" stroke-width="4"/>
      <rect id="s2-eye-l" x="1576" y="442" width="30" height="54" rx="14" fill="#2EE58D"/>
      <rect id="s2-eye-r" x="1694" y="442" width="30" height="54" rx="14" fill="#2EE58D"/>
      <rect x="1516" y="560" width="268" height="130" fill="#182836" stroke="#EFE9D9" stroke-width="4"/>
      <text id="s2-machine-status" x="1650" y="635" text-anchor="middle" fill="#F5C518" font-family="JetBrains Mono, monospace" font-size="24" font-weight="800">CHECKING...</text>
    </svg>

    <div id="s2-gp-1" class="s2-gate-pill">01 · QUÀ TẶNG VẬT PHẨM</div>
    <div id="s2-gp-2" class="s2-gate-pill">02 · GIẢM GIÁ MUA MÁY</div>
    <div id="s2-gp-3" class="s2-gate-pill">03 · BẢO HÀNH ĐI KÈM</div>

    <!-- Traveling Card 1: GẬP ANDROID -->
    <div id="s2-card-android" class="s2-item-card">
      <div class="cm-head" style="font-size:23px;text-align:center;border-bottom:4px solid #0F0F0F;padding-bottom:6px;background:#136636;color:#EFE9D9;padding-top:4px;">GẬP ANDROID</div>
      <div class="cm-mono" style="font-size:15px;text-align:center;">QUÀ + BẢO HÀNH</div>
      <div class="s2-ic-boxes">
        <div id="s2-ac-b1" class="s2-ic-box"></div>
        <div id="s2-ac-b2" class="s2-ic-box"></div>
        <div id="s2-ac-b3" class="s2-ic-box"></div>
      </div>
    </div>

    <!-- Parked Summary for Android after passing 3 gates -->
    <div id="s2-android-parked" class="cm-card-green cm-shadow-ink">
      <div class="cm-mono-dark-pill">ĐIỆN THOẠI GẬP ANDROID</div>
      <div class="cm-head" style="font-size:28px;color:#EFE9D9;margin-top:6px;">VÔ VÀN QUÀ TẶNG + BẢO HÀNH RẤT NGON ✓</div>
    </div>

    <!-- Traveling Card 2: IPHONE DUO (65TR) -->
    <div id="s2-card-duo" class="s2-item-card">
      <div class="cm-head" style="font-size:23px;text-align:center;border-bottom:4px solid #0F0F0F;padding-bottom:6px;background:#F06CA8;color:#0F0F0F;padding-top:4px;">IPHONE DUO</div>
      <div class="cm-mono" style="font-size:16px;text-align:center;color:#E85A1F;">65 TRIỆU · BẢN THẤP</div>
      <div class="s2-ic-boxes">
        <div id="s2-dc-b1" class="s2-ic-box">✕</div>
        <div id="s2-dc-b2" class="s2-ic-box">✕</div>
        <div id="s2-dc-b3" class="s2-ic-box">?</div>
      </div>
    </div>

    <!-- AppleCare+ Add-on Warning Card -->
    <div id="s2-applecare-ticket" class="cm-card-pink cm-shadow-featured">
      <div class="cm-mono-dark-pill">MUỐN BẢO HÀNH TRÊN IPHONE DUO?</div>
      <div class="cm-head" style="font-size:30px;margin-top:6px;">PHẢI MUA THÊM GÓI APPLECARE+!</div>
      <div class="cm-body" style="font-size:20px;margin-top:4px;">Chỉ giúp tiết kiệm chi phí chứ không miễn phí hoàn toàn.</div>
    </div>

    <!-- Bottom Verdict Banner -->
    <div id="s2-verdict-stamp" class="cm-card-yellow cm-shadow-ink">
      <div class="cm-head" style="font-size:32px;" data-var-text="s2_applecare_note">APPLECARE+ KHÔNG FREE 100% KHI SỬA CHỮA SỰ CỐ! ✕</div>
    </div>
  </div>
`;

const s2Js = `
  // Phase A: A-roll overlay (0.00s - 18.80s = 43.93s - 62.73s global)
  // "Đó là về câu chuyện liên quan đến giá bán" (51.14s = 7.21s local)
  // "phiên bản thấp nhất đến tận là 65 triệu" (58.16s = 14.23s local)
  // "không đi kèm với bất kỳ một cái quà tặng nào nhá" (60.00s = 16.07s local)
  tl.fromTo("#s2-a-kicker", { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 7.10);
  tl.fromTo("#s2-a-price", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 13.80);
  tl.fromTo("#s2-a-nogift", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 15.80);

  // Transition to Phase B: 100% Motion Graphics Conveyor at 18.80s (62.73s global: "Trong khi đó với những cái mẫu điện thoại gập của điện thoại Android...")
  tl.to("#s2-aroll-layer", { opacity: 0, duration: 0.35, ease: "power2.inOut" }, 18.55);
  tl.fromTo("#s2-full-layer", { opacity: 0 }, { opacity: 1, duration: 0.42, ease: "power2.out" }, 18.80);

  // Conveyor belt continuous movement
  tl.fromTo("#s2-belt-dashes", { strokeDashoffset: 0 }, { strokeDashoffset: -600, duration: 26.5, ease: "none" }, 18.80);

  // Android Card travels across Gate 1 ("vật phẩm" 71.12s = 27.19s) -> Gate 2 ("giảm giá" 72.00s = 28.07s) -> Gate 3 ("hỗ trợ bảo hành" 74.56s = 30.63s)
  tl.fromTo("#s2-card-android", { x: 0, opacity: 0, scale: 0.9 }, { x: 195, opacity: 1, scale: 1, duration: 0.55, ease: "back.out(1.25)" }, 19.50);
  tl.to("#s2-arch-1", { fill: "#D4EFE0", stroke: "#1F8A4C", duration: 0.3 }, 26.80);
  tl.set("#s2-ac-b1", { textContent: "✓", backgroundColor: "#136636", color: "#EFE9D9" }, 26.90);

  tl.to("#s2-card-android", { x: 615, duration: 0.55, ease: "power3.inOut" }, 27.40);
  tl.to("#s2-arch-2", { fill: "#D4EFE0", stroke: "#1F8A4C", duration: 0.3 }, 27.90);
  tl.set("#s2-ac-b2", { textContent: "✓", backgroundColor: "#136636", color: "#EFE9D9" }, 28.00);

  tl.to("#s2-card-android", { x: 1035, duration: 0.55, ease: "power3.inOut" }, 29.80);
  tl.to("#s2-arch-3", { fill: "#D4EFE0", stroke: "#1F8A4C", duration: 0.3 }, 30.30);
  tl.set("#s2-ac-b3", { textContent: "✓", backgroundColor: "#136636", color: "#EFE9D9" }, 30.40);

  // Park Android summary top-left & clear conveyor for iPhone Duo
  tl.to("#s2-card-android", { y: -260, opacity: 0, duration: 0.45, ease: "power2.in" }, 31.30);
  tl.fromTo("#s2-android-parked", { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 31.50);

  // iPhone Duo Card enters conveyor at 32.80s (76.73s global: "Còn với iPhone Duo...")
  tl.fromTo("#s2-card-duo", { x: 0, opacity: 0, scale: 0.9 }, { x: 195, opacity: 1, scale: 1, duration: 0.50, ease: "back.out(1.25)" }, 32.80);
  tl.to("#s2-arch-1", { fill: "#FAD4C4", stroke: "#E85A1F", duration: 0.25 }, 33.40);
  tl.set("#s2-dc-b1", { backgroundColor: "#E85A1F", color: "#EFE9D9" }, 33.50);

  tl.to("#s2-card-duo", { x: 615, duration: 0.45, ease: "power3.inOut" }, 33.80);
  tl.to("#s2-arch-2", { fill: "#FAD4C4", stroke: "#E85A1F", duration: 0.25 }, 34.25);
  tl.set("#s2-dc-b2", { backgroundColor: "#E85A1F", color: "#EFE9D9" }, 34.35);

  tl.to("#s2-card-duo", { x: 1035, duration: 0.45, ease: "power3.inOut" }, 34.70);
  tl.to("#s2-arch-3", { fill: "#FAD4C4", stroke: "#E85A1F", duration: 0.25 }, 35.15);
  tl.set("#s2-dc-b3", { textContent: "$", backgroundColor: "#F5C518", color: "#0F0F0F" }, 35.25);
  tl.set("#s2-machine-status", { textContent: "BUY CARE+!" }, 35.25);
  tl.to(["#s2-eye-l", "#s2-eye-r"], { fill: "#E85A1F", duration: 0.3 }, 35.25);

  // AppleCare+ ticket (35.80s = 79.73s global: "cần phải mua cái gói AppleCare+") & final verdict slam (40.80s = 84.73s global: "chứ nó sẽ không free hoàn toàn")
  tl.fromTo("#s2-applecare-ticket", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 35.80);
  tl.fromTo("#s2-verdict-stamp", { scale: 1.24, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.52, ease: "power4.out" }, 40.80);
`;

writeFileSync(join(compDir, 'scene-02.html'), wrapSubComp('scene-02', s2Css, s2Html, s2Js));

// ============================================================================
// SCENE 03 (89.57s - 131.43s, dur 41.86s):
// Phase A (0.00s - 7.16s = 89.57s - 96.73s B-roll): B-roll + SVG Pulse Overlay
// Phase B (7.16s - 41.86s = 96.73s - 131.43s): 100% Motion SVG Diverging Price Chart
// ============================================================================
const s3Css = `
  #s3-broll-layer {
    position: absolute;
    inset: 0;
    z-index: 4;
  }
  #s3-broll-left {
    position: absolute;
    top: 56px;
    left: 48px;
    width: 520px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  #s3-chart-layer {
    position: absolute;
    inset: 0;
    z-index: 10;
    opacity: 0;
  }
  .s3-head-bar {
    position: absolute;
    top: 42px;
    left: 64px;
    right: 64px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    z-index: 15;
  }
  .s3-milestone-card {
    position: absolute;
    padding: 14px 20px;
    z-index: 18;
    opacity: 0;
  }
  #s3-ms-1 { top: 380px; left: 165px; width: 340px; }
  #s3-ms-2 { top: 255px; left: 710px; width: 410px; }
  #s3-ms-oppo { top: 640px; left: 740px; width: 430px; }
  #s3-ms-3 { top: 205px; right: 150px; width: 410px; }
`;

const s3Html = `
  <!-- PHASE A: B-ROLL OVERLAY (0.00s - 7.16s) -->
  <div id="s3-broll-layer">
    <div id="s3-broll-left">
      <div id="s3-b-kicker" class="cm-kicker">GÓC NHÌN LỊCH SỬ // ĐỊNH GIÁ APPLE</div>
      <div id="s3-b-card" class="cm-card-cream cm-shadow-featured" style="padding:20px 24px;">
        <div class="cm-head" style="font-size:36px;">KHÔNG QUÁ NGẠC NHIÊN VỚI MỨC GIÁ 65 TRIỆU!</div>
        <svg viewBox="0 0 460 74" width="100%" height="74" fill="none" style="margin-top:8px;">
          <rect x="2" y="2" width="456" height="70" fill="#0F0F0F"/>
          <polyline points="16,52 90,52 120,20 155,58 195,28 240,52 310,52 345,14 380,56 444,22" stroke="#F5C518" stroke-width="5" fill="none"/>
        </svg>
      </div>
    </div>
  </div>

  <!-- PHASE B: 100% MOTION SVG PRICE ESCALATION CHART (7.16s - 41.86s) -->
  <div id="s3-chart-layer">
    <div class="cm-full-ground"></div>
    <div class="cm-corner tl"></div>
    <div class="cm-corner tr"></div>
    <div class="cm-corner bl"></div>
    <div class="cm-corner br"></div>

    <div class="s3-head-bar">
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div class="cm-kicker">BIỂU ĐỒ LỊCH SỬ // QUY LUẬT THIẾT LẬP TRẦN GIÁ MỚI CỦA APPLE</div>
        <div class="cm-head" style="font-size:48px;">MỖI DÒNG MÁY MỚI THAY ĐỔI LỚN = NHẢY VỌT MỨC GIÁ</div>
      </div>
    </div>

    <svg viewBox="0 0 1920 1080" width="1920" height="1080" fill="none" style="position:absolute;inset:0;z-index:12;">
      <!-- Chart Frame Box -->
      <rect x="120" y="190" width="1680" height="740" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
      <!-- Grid Lines -->
      <line x1="120" y1="375" x2="1800" y2="375" stroke="#C9BFA8" stroke-width="3" stroke-dasharray="10 10"/>
      <line x1="120" y1="560" x2="1800" y2="560" stroke="#C9BFA8" stroke-width="3" stroke-dasharray="10 10"/>
      <line x1="120" y1="745" x2="1800" y2="745" stroke="#C9BFA8" stroke-width="3" stroke-dasharray="10 10"/>

      <!-- Vertical Milestone Guides -->
      <line x1="420" y1="190" x2="420" y2="930" stroke="#0F0F0F" stroke-width="3" stroke-dasharray="12 12"/>
      <line x1="1020" y1="190" x2="1020" y2="930" stroke="#0F0F0F" stroke-width="3" stroke-dasharray="12 12"/>
      <line x1="1580" y1="190" x2="1580" y2="930" stroke="#0F0F0F" stroke-width="3" stroke-dasharray="12 12"/>

      <!-- Shaded Divergence Polygon between Apple Flagship Curve & Market Average -->
      <path id="s3-area-gap"
        d="M 220 790 L 420 620 L 1020 440 L 1580 260 L 1580 540 L 1020 550 L 420 770 L 220 810 Z"
        fill="#F06CA8"
        opacity="0"
      />

      <!-- Lower Curve: Mặt bằng chung / OPPO Find X10 Pro Max -->
      <path id="s3-curve-market"
        d="M 220 810 C 300 800, 350 780, 420 770 C 640 740, 820 620, 1020 550 C 1240 500, 1420 490, 1580 480"
        stroke="#2A2A2A"
        stroke-width="8"
        stroke-dasharray="1600"
        stroke-dashoffset="1600"
        stroke-linecap="round"
      />

      <!-- Upper Curve: Apple Price Ceiling (iPhone X -> iPhone 18 Pro Max -> iPhone Duo 65tr) -->
      <path id="s3-curve-apple"
        d="M 220 790 C 300 720, 350 650, 420 620 C 640 560, 820 490, 1020 440 C 1240 380, 1420 310, 1580 260"
        stroke="#E85A1F"
        stroke-width="13"
        stroke-dasharray="1700"
        stroke-dashoffset="1700"
        stroke-linecap="round"
      />

      <!-- Data Nodes -->
      <circle id="s3-dot-1" cx="420" cy="620" r="16" fill="#F5C518" stroke="#0F0F0F" stroke-width="5" opacity="0"/>
      <circle id="s3-dot-1b" cx="420" cy="770" r="13" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4" opacity="0"/>
      <circle id="s3-dot-2" cx="1020" cy="440" r="16" fill="#F5C518" stroke="#0F0F0F" stroke-width="5" opacity="0"/>
      <circle id="s3-dot-2b" cx="1020" cy="550" r="14" fill="#136636" stroke="#0F0F0F" stroke-width="4" opacity="0"/>
      <circle id="s3-dot-3" cx="1580" cy="260" r="20" fill="#E85A1F" stroke="#0F0F0F" stroke-width="6" opacity="0"/>

      <!-- X-Axis Labels -->
      <text x="420" y="975" text-anchor="middle" fill="#0F0F0F" font-family="JetBrains Mono, monospace" font-size="24" font-weight="800">THỜI IPHONE X</text>
      <text x="1020" y="975" text-anchor="middle" fill="#0F0F0F" font-family="JetBrains Mono, monospace" font-size="24" font-weight="800">IPHONE 18 PRO / PRO MAX</text>
      <text x="1580" y="975" text-anchor="middle" fill="#E85A1F" font-family="JetBrains Mono, monospace" font-size="24" font-weight="800">IPHONE DUO (GẬP)</text>
    </svg>

    <!-- Milestone 1: iPhone X 1000$ vs 600-800$ -->
    <div id="s3-ms-1" class="s3-milestone-card cm-card-cream cm-shadow-ink">
      <div class="cm-mono-dark-pill">CỘT MỐC LỊCH SỬ 01</div>
      <div class="cm-head" style="font-size:32px;margin-top:6px;" data-var-text="price_iphonex">IPHONE X: 1.000 USD</div>
      <div class="cm-body" style="font-size:19px;margin-top:4px;">Trong khi mặt bằng chung lúc đó chỉ 600 – 800 USD.</div>
    </div>

    <!-- Milestone 2: iPhone 18 Pro / Pro Max >40TR -->
    <div id="s3-ms-2" class="s3-milestone-card cm-card-yellow cm-shadow-ink">
      <div class="cm-mono" style="font-size:16px;">CỘT MỐC GẦN ĐÂY NHẤT</div>
      <div class="cm-head" style="font-size:30px;margin-top:4px;" data-var-text="price_18pm">IPHONE 18 PRO MAX: >40 TRIỆU</div>
      <div class="cm-body" style="font-size:19px;">Thiết lập trần giá mới cho dòng Flagship.</div>
    </div>

    <!-- Follower Effect: OPPO Find X10 / X10 Pro Max -->
    <div id="s3-ms-oppo" class="s3-milestone-card cm-card-green cm-shadow-ink">
      <div class="cm-mono-dark-pill">KÉO MẶT BẰNG ANDROID TĂNG THEO</div>
      <div class="cm-head" style="font-size:27px;color:#EFE9D9;margin-top:6px;">OPPO FIND X10 / PRO MAX: 30–50 TRIỆU!</div>
    </div>

    <!-- Milestone 3: iPhone Duo >60TR -->
    <div id="s3-ms-3" class="s3-milestone-card cm-card-pink cm-shadow-featured">
      <div class="cm-mono-dark-pill">ĐỈNH GIÁ MỚI CỦA APPLE</div>
      <div class="cm-head" style="font-size:40px;margin-top:6px;">IPHONE DUO: >60 TRIỆU</div>
      <div class="cm-body" style="font-size:20px;">Hoàn toàn dễ hiểu với truyền thống định giá của Apple.</div>
    </div>
  </div>
`;

const s3Js = `
  // Phase A: B-roll overlay (0.00s - 7.16s = 89.57s - 96.73s global)
  tl.fromTo("#s3-b-kicker", { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 0.30);
  tl.fromTo("#s3-b-card", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 1.20);

  // Switch to Phase B: 100% Motion Chart at 7.16s (96.73s in video)
  tl.to("#s3-broll-layer", { opacity: 0, duration: 0.35, ease: "power2.inOut" }, 6.95);
  tl.fromTo("#s3-chart-layer", { opacity: 0 }, { opacity: 1, duration: 0.42, ease: "power2.out" }, 7.16);

  // Segment 1: "trong lịch sử chúng ta có con iPhone X giá đến tận cả 1.000 đô" (108.86s = 19.29s local)
  // "mặt bằng chung lúc đó... 600, 700, 800 đô" (111.40s = 21.83s local)
  tl.to("#s3-curve-apple", { strokeDashoffset: 1150, duration: 1.1, ease: "power2.out" }, 18.60);
  tl.to("#s3-dot-1", { opacity: 1, duration: 0.3 }, 19.10);
  tl.fromTo("#s3-ms-1", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 19.20);
  tl.to("#s3-curve-market", { strokeDashoffset: 1100, duration: 1.1, ease: "power2.out" }, 22.00);
  tl.to("#s3-dot-1b", { opacity: 1, duration: 0.3 }, 22.40);

  // Segment 2: "bộ đôi iPhone 18 Pro với cả iPhone 18 Pro Max... bốn mươi mấy triệu" (118.16s = 28.59s local)
  tl.to("#s3-curve-apple", { strokeDashoffset: 550, duration: 1.2, ease: "power2.out" }, 28.10);
  tl.to("#s3-dot-2", { opacity: 1, duration: 0.3 }, 28.50);
  tl.fromTo("#s3-ms-2", { y: -28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 28.60);

  // OPPO Find X10 / X10 Pro Max (30-50tr) at 125.28s (35.71s local)
  tl.to("#s3-curve-market", { strokeDashoffset: 0, duration: 1.2, ease: "power2.out" }, 35.40);
  tl.to("#s3-dot-2b", { opacity: 1, duration: 0.3 }, 35.80);
  tl.fromTo("#s3-ms-oppo", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 36.00);

  // Segment 3: Peak iPhone Duo >60tr at 133.08s (43.51s local)
  tl.to("#s3-curve-apple", { strokeDashoffset: 0, duration: 1.0, ease: "power2.out" }, 43.00);
  tl.to("#s3-area-gap", { opacity: 0.28, duration: 0.6 }, 43.30);
  tl.to("#s3-dot-3", { opacity: 1, duration: 0.3 }, 43.40);
  tl.fromTo("#s3-ms-3", { scale: 1.22, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.52, ease: "power4.out" }, 43.50);
`;

writeFileSync(join(compDir, 'scene-03.html'), wrapSubComp('scene-03', s3Css, s3Html, s3Js));

// ============================================================================
// SCENE 04 (131.43s - 172.67s, dur 41.24s):
// Phase A (0.00s - 18.84s = 131.43s - 150.27s, covers B-roll 3 & 4): Overlay
// Phase B (18.84s - 41.24s = 150.27s - 172.67s): 100% Motion Card Sorter & Meter
// ============================================================================
const s4Css = `
  #s4-overlay-layer {
    position: absolute;
    inset: 0;
    z-index: 4;
  }
  #s4-ov-left {
    position: absolute;
    top: 48px;
    left: 34px;
    width: 430px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  #s4-ov-right {
    position: absolute;
    bottom: 64px;
    right: 48px;
    width: 485px;
  }
  #s4-sorter-layer {
    position: absolute;
    inset: 0;
    z-index: 10;
    opacity: 0;
  }
  #s4-meter-card {
    position: absolute;
    top: 158px;
    left: 64px;
    width: 480px;
    padding: 26px 28px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    z-index: 15;
    opacity: 0;
  }
  .s4-meter-bar {
    width: 100%;
    height: 38px;
    background: #E4DCC4;
    border: 4px solid #0F0F0F;
    overflow: hidden;
  }
  #s4-meter-fill {
    width: 100%;
    height: 100%;
    background: #1F8A4C;
    transform-origin: left center;
  }
  .s4-col-head {
    position: absolute;
    top: 158px;
    width: 340px;
    height: 58px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 4px solid #0F0F0F;
    box-shadow: 7px 7px 0 #0F0F0F;
    font-family: "JetBrains Mono", monospace;
    font-size: 20px;
    font-weight: 800;
    z-index: 15;
  }
  #s4-col-mass { left: 1130px; background: #F06CA8; color: #0F0F0F; }
  #s4-col-vip { left: 1505px; background: #136636; color: #EFE9D9; }

  .s4-sort-card {
    position: absolute;
    width: 340px;
    height: 104px;
    background: #EFE9D9;
    border: 4px solid #0F0F0F;
    box-shadow: 6px 6px 0 #0F0F0F;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 18;
    opacity: 0;
  }
  #s4-bottom-takeaway {
    position: absolute;
    bottom: 52px;
    left: 64px;
    right: 64px;
    display: flex;
    justify-content: center;
    z-index: 20;
    opacity: 0;
  }
`;

const s4Html = `
  <!-- PHASE A: B-ROLL 3 & 4 + A-ROLL OVERLAY (0.00s - 18.84s) -->
  <div id="s4-overlay-layer">
    <div id="s4-ov-left">
      <div id="s4-o-kicker" class="cm-kicker">PHÂN HÓA TỆP KHÁCH HÀNG // >60 TRIỆU</div>
      <div id="s4-o-radar" class="cm-card-cream cm-shadow-featured" style="padding:20px 24px;display:flex;flex-direction:column;gap:10px;">
        <div class="cm-mono" style="font-size:17px;">ĐỊNH VỊ TỆP NGƯỜI DÙNG MỤC TIÊU</div>
        <div class="cm-head" style="font-size:32px;">KHÔNG DÀNH CHO ĐẠI ĐA SỐ PHỔ THÔNG!</div>
        <!-- Animated SVG Target Radar -->
        <svg viewBox="0 0 420 120" width="100%" height="120" fill="none">
          <rect x="4" y="4" width="412" height="112" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="4"/>
          <circle cx="95" cy="60" r="42" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
          <circle cx="95" cy="60" r="24" fill="#F06CA8" stroke="#0F0F0F" stroke-width="3"/>
          <circle cx="95" cy="60" r="9" fill="#E85A1F"/>
          <line x1="50" y1="60" x2="140" y2="60" stroke="#0F0F0F" stroke-width="3"/>
          <line x1="95" y1="15" x2="95" y2="105" stroke="#0F0F0F" stroke-width="3"/>
          <rect x="165" y="24" width="230" height="32" fill="#0F0F0F"/>
          <text x="280" y="46" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono, monospace" font-size="16" font-weight="800">PHỔ THÔNG: ĐỨNG NGOÀI</text>
          <rect x="165" y="66" width="230" height="32" fill="#136636" stroke="#0F0F0F" stroke-width="3"/>
          <text x="280" y="88" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono, monospace" font-size="16" font-weight="800">THƯỢNG LƯU: MỤC TIÊU ✓</text>
        </svg>
      </div>
    </div>
    <div id="s4-ov-right">
      <div id="s4-o-mass" class="cm-card-pink cm-shadow-ink" style="padding:18px 22px;">
        <div class="cm-mono-dark-pill">LÝ DO PHỔ BIẾN TRÊN MẠNG</div>
        <div class="cm-head" style="font-size:30px;margin-top:6px;">ĐA SỐ PHỔ THÔNG SẼ CHÊ RẤT NHIỀU! ✕</div>
      </div>
    </div>
  </div>

  <!-- PHASE B: 100% MOTION GRAPHICS CARD SORTER & EXCITEMENT METER (18.84s - 41.24s) -->
  <div id="s4-sorter-layer">
    <div class="cm-full-ground"></div>
    <div class="cm-corner tl"></div>
    <div class="cm-corner tr"></div>
    <div class="cm-corner bl"></div>
    <div class="cm-corner br"></div>

    <div style="position:absolute;top:44px;left:64px;z-index:15;">
      <div class="cm-kicker">BỘ PHÂN LOẠI TỆP KHÁCH HÀNG // AI CHÊ VS AI CỰC KỲ WOW?</div>
    </div>

    <!-- Left Impact & Excitement Meter Card -->
    <div id="s4-meter-card" class="cm-card-cream cm-shadow-featured">
      <div class="cm-mono" style="font-size:18px;">THƯỚC ĐO CẢM XÚC KHI CẦM TRÊN TAY</div>
      <div class="cm-head" style="font-size:38px;">ĐỘ HÀO HỨNG & "WOW"</div>
      <div class="s4-meter-bar">
        <div id="s4-meter-fill"></div>
      </div>
      <div id="s4-meter-status" class="cm-head" style="font-size:28px;color:#136636;">CẢM GIÁC Hứng Khởi Khác Hẳn Gập Android ✓</div>
      <div class="cm-body" style="font-size:20px;">Không chỉ vì được Apple gửi máy, mà vì trải nghiệm cầm thực tế tạo sự phấn khích cực lớn.</div>
    </div>

    <!-- Center Filter Gates SVG -->
    <svg viewBox="0 0 520 420" width="520" height="420" fill="none" style="position:absolute;top:250px;left:575px;z-index:12;">
      <path d="M 40 210 L 470 210" stroke="#0F0F0F" stroke-width="6" stroke-dasharray="14 10"/>
      <!-- 3 Filter Arches -->
      <path d="M 85 290 L 85 130 A 45 45 0 0 1 175 130 L 175 290 Z" fill="#D4EFE0" stroke="#1F8A4C" stroke-width="6"/>
      <text x="130" y="218" text-anchor="middle" fill="#0F0F0F" font-family="JetBrains Mono, monospace" font-size="18" font-weight="800">&gt;60TR</text>

      <path d="M 215 290 L 215 130 A 45 45 0 0 1 305 130 L 305 290 Z" fill="#D4EFE0" stroke="#1F8A4C" stroke-width="6"/>
      <text x="260" y="218" text-anchor="middle" fill="#0F0F0F" font-family="JetBrains Mono, monospace" font-size="18" font-weight="800">SHOWBIZ</text>

      <path d="M 345 290 L 345 130 A 45 45 0 0 1 435 130 L 435 290 Z" fill="#D4EFE0" stroke="#1F8A4C" stroke-width="6"/>
      <text x="390" y="218" text-anchor="middle" fill="#0F0F0F" font-family="JetBrains Mono, monospace" font-size="18" font-weight="800">TỶ ĐỒNG</text>
    </svg>

    <div id="s4-col-mass" class="s4-col-head">PHỔ THÔNG · CHÊ NHIỀU ✕</div>
    <div id="s4-col-vip" class="s4-col-head">KOL / TIỀN TỶ · RẤT WOW ✓</div>

    <!-- Sorted Cards -->
    <div id="s4-sc-1" class="s4-sort-card" style="left:1130px;top:240px;">
      <div class="cm-head" style="font-size:22px;">NGƯỜI DÙNG PHỔ THÔNG</div>
      <div class="cm-mono" style="font-size:16px;color:#E85A1F;">SO SÁNH P/P · CHÊ ĐẮT ✕</div>
    </div>
    <div id="s4-sc-2" class="s4-sort-card" style="left:1130px;top:364px;">
      <div class="cm-head" style="font-size:22px;">NGƯỜI CHỜ HOÀN THIỆN</div>
      <div class="cm-mono" style="font-size:16px;color:#E85A1F;">KHÔNG THUỘC TỆP MỤC TIÊU ✕</div>
    </div>

    <div id="s4-sc-3" class="s4-sort-card" style="left:1505px;top:240px;background:#D4EFE0;">
      <div class="cm-head" style="font-size:22px;">KOL &amp; INFLUENCER</div>
      <div class="cm-mono" style="font-size:16px;color:#136636;">NHẬN MÁY SỚM · CỰC WOW ✓</div>
    </div>
    <div id="s4-sc-4" class="s4-sort-card" style="left:1505px;top:364px;background:#D4EFE0;">
      <div class="cm-head" style="font-size:22px;">CA SĨ &amp; DIỄN VIÊN</div>
      <div class="cm-mono" style="font-size:16px;color:#136636;">HÀO HỨNG KHI CẦM TRÊN TAY ✓</div>
    </div>
    <div id="s4-sc-5" class="s4-sort-card" style="left:1505px;top:488px;background:#F5C518;">
      <div class="cm-head" style="font-size:22px;">THU NHẬP VÀI TỶ / NĂM</div>
      <div class="cm-mono" style="font-size:16px;color:#0F0F0F;">65 TRIỆU LÀ TRẢI NGHIỆM MỚI ✓</div>
    </div>

    <div id="s4-bottom-takeaway">
      <div class="cm-card-yellow cm-shadow-ink" style="padding:14px 32px;transform:rotate(-1deg);">
        <div class="cm-head" style="font-size:28px;">TẠO CẢM GIÁC HÀO HỨNG KHÁC BIỆT HOÀN TOÀN VỚI GẬP ANDROID!</div>
      </div>
    </div>
  </div>
`;

const s4Js = `
  // Phase A: A-roll + B-roll overlay (0.00s - 10.27s = 140.00s - 150.27s global)
  // "tệp khách hàng của con iPhone Duo này nó không phải dành cho đại đa số người dùng phổ thông" (140.16s - 144.64s)
  tl.fromTo("#s4-o-kicker", { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 0.20);
  tl.fromTo("#s4-o-radar", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 0.80);
  // "đa số người dùng phổ thông sẽ chê con máy này rất là nhiều" (144.96s = 4.96s local)
  tl.fromTo("#s4-o-mass", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 5.10);

  // Switch to Phase B: 100% Motion Card Sorter at 10.27s (150.27s global)
  tl.to("#s4-overlay-layer", { opacity: 0, duration: 0.35, ease: "power2.inOut" }, 10.00);
  tl.fromTo("#s4-sorter-layer", { opacity: 0 }, { opacity: 1, duration: 0.42, ease: "power2.out" }, 10.27);

  // Sort cards progressively synced to KOL/Influencer (154.12s = 14.12s local), Ca sĩ & Diễn viên (155.70s = 15.70s local), Vài tỷ đồng (157.54s = 17.54s local)
  tl.fromTo("#s4-sc-1", { x: -380, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 10.80);
  tl.fromTo("#s4-sc-2", { x: -380, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 11.60);
  tl.fromTo("#s4-sc-3", { x: -550, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 14.10);
  tl.fromTo("#s4-sc-4", { x: -550, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 15.60);
  tl.fromTo("#s4-sc-5", { x: -550, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 17.50);

  // "Thì họ rất là WOW khi mà cầm trên tay con iPhone Duo này" at 160.38s (20.38s local)
  tl.fromTo("#s4-meter-card", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 20.30);
  tl.fromTo("#s4-meter-fill", { scaleX: 0.18 }, { scaleX: 0.96, duration: 1.1, ease: "power3.out" }, 20.80);
  // "tạo ra cảm giác rất là hào hứng... không giống như những chiếc điện thoại gập của Android" at 165.74s (25.74s local)
  tl.fromTo("#s4-bottom-takeaway", { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 25.70);
`;

writeFileSync(join(compDir, 'scene-04.html'), wrapSubComp('scene-04', s4Css, s4Html, s4Js));

// ============================================================================
// SCENE 05 (172.67s - 219.10s, dur 46.43s):
// Phase A (0.00s - 10.36s = 172.67s - 183.03s B-roll 5): B-roll + SVG Overlay
// Phase B (10.36s - 32.86s = 183.03s - 205.53s): 100% Motion Split-Event Pipeline
// Phase C (32.86s - 46.43s = 205.53s - 219.10s B-roll 6 + A-roll): Summary Stamp Overlay
// ============================================================================
const s5Css = `
  #s5-broll1-layer, #s5-broll2-layer {
    position: absolute;
    inset: 0;
    z-index: 4;
  }
  #s5-broll2-layer { opacity: 0; }
  #s5-b1-left {
    position: absolute;
    top: 56px;
    left: 48px;
    width: 495px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  #s5-b1-right {
    position: absolute;
    bottom: 64px;
    right: 48px;
    width: 495px;
  }
  #s5-split-layer {
    position: absolute;
    inset: 0;
    z-index: 10;
    opacity: 0;
  }
  .s5-track-card {
    position: absolute;
    right: 76px;
    width: 680px;
    padding: 22px 26px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    z-index: 16;
    opacity: 0;
  }
  #s5-tk-1 { top: 215px; }
  #s5-tk-2 { top: 555px; }
`;

const s5Html = `
  <!-- PHASE A: B-ROLL 5 OVERLAY (0.00s - 10.36s) -->
  <div id="s5-broll1-layer">
    <div id="s5-b1-left">
      <div id="s5-b1-kicker" class="cm-kicker">HIỆU ỨNG NHẬN DIỆN // APPLE MỞ ĐƯỜNG</div>
      <div id="s5-b1-card" class="cm-card-cream cm-shadow-featured" style="padding:20px 24px;">
        <div class="cm-head" style="font-size:32px;">NHỜ APPLE RA MẮT MỚI BIẾT CÓ ĐIỆN THOẠI GẬP!</div>
        <div class="cm-body" style="font-size:20px;margin-top:6px;">Nhiều người dùng phổ thông chưa từng biết đến gập Android trước đó.</div>
      </div>
    </div>
    <div id="s5-b1-right">
      <div id="s5-b1-wow" class="cm-card-yellow cm-shadow-ink" style="padding:18px 22px;">
        <div class="cm-mono" style="font-size:17px;">ĐẶT CẠNH IPHONE DẠNG THANH</div>
        <div class="cm-head" style="font-size:30px;margin-top:4px;">TẠO CẢM GIÁC "WOW" HƠN RẤT NHIỀU ✓</div>
      </div>
    </div>
  </div>

  <!-- PHASE B: 100% MOTION GRAPHICS 2-EVENT SPLIT PIPELINE (10.36s - 32.86s) -->
  <div id="s5-split-layer">
    <div class="cm-full-ground"></div>
    <div class="cm-corner tl"></div>
    <div class="cm-corner tr"></div>
    <div class="cm-corner bl"></div>
    <div class="cm-corner br"></div>

    <div style="position:absolute;top:44px;left:64px;right:64px;z-index:15;">
      <div class="cm-kicker">SƠ ĐỒ PHÂN LUỒNG SỰ KIỆN // CHIẾN LƯỢC CỦA APPLE</div>
      <div class="cm-head" style="font-size:50px;margin-top:10px;">VÌ SAO APPLE TÁCH RIÊNG 2 BUỔI RA MẮT SẢN PHẨM?</div>
    </div>

    <!-- SVG Split Railway & Diverter Hub -->
    <svg viewBox="0 0 1920 1080" width="1920" height="1080" fill="none" style="position:absolute;inset:0;z-index:12;">
      <!-- Left Source Hub: APPLE KEYNOTE DISPATCHER -->
      <rect x="86" y="380" width="380" height="260" fill="#0F0F0F" stroke="#0F0F0F" stroke-width="6"/>
      <rect x="100" y="394" width="352" height="64" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
      <text x="276" y="435" text-anchor="middle" fill="#0F0F0F" font-family="JetBrains Mono, monospace" font-size="24" font-weight="800">APPLE KEYNOTE</text>
      <text x="276" y="520" text-anchor="middle" fill="#EFE9D9" font-family="Be Vietnam Pro, sans-serif" font-size="28" font-weight="900">CỔNG PHÂN TỆP</text>
      <text x="276" y="562" text-anchor="middle" fill="#2EE58D" font-family="JetBrains Mono, monospace" font-size="20" font-weight="800">2 NGÀY RIÊNG BIỆT</text>

      <!-- Upper Branch Track (to iPhone 18 Pro / Pro Max) -->
      <path id="s5-branch-up" d="M 466 460 C 680 460, 760 320, 1140 320" stroke="#1F8A4C" stroke-width="14" stroke-dasharray="900" stroke-dashoffset="900" fill="none"/>
      <circle cx="840" cy="378" r="34" fill="#136636" stroke="#0F0F0F" stroke-width="5"/>
      <text x="840" y="388" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono, monospace" font-size="24" font-weight="800">01</text>

      <!-- Lower Branch Track (to iPhone Duo >60tr) -->
      <path id="s5-branch-down" d="M 466 560 C 680 560, 760 690, 1140 690" stroke="#E85A1F" stroke-width="14" stroke-dasharray="900" stroke-dashoffset="900" fill="none"/>
      <circle cx="840" cy="634" r="34" fill="#E85A1F" stroke="#0F0F0F" stroke-width="5"/>
      <text x="840" y="644" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono, monospace" font-size="24" font-weight="800">02</text>
    </svg>

    <!-- Event 1 Card: iPhone 18 Pro / Pro Max -->
    <div id="s5-tk-1" class="s5-track-card cm-card-green cm-shadow-ink">
      <div class="cm-mono-dark-pill">BUỔI GIỚI THIỆU 01 · DÒNG TRUYỀN THỐNG</div>
      <div class="cm-head" style="font-size:36px;color:#EFE9D9;">IPHONE 18 PRO &amp; 18 PRO MAX</div>
      <div class="cm-body" style="font-size:21px;color:#EFE9D9;">Dành cho người có thói quen đổi điện thoại hàng năm — dễ tiếp cận, dễ nâng cấp ✓</div>
    </div>

    <!-- Event 2 Card: iPhone Duo (>60tr) -->
    <div id="s5-tk-2" class="s5-track-card cm-card-cream cm-shadow-featured">
      <div class="cm-mono-dark-pill">BUỔI GIỚI THIỆU 02 · TÁCH RIÊNG 1 NGÀY KHÁC</div>
      <div class="cm-head" style="font-size:36px;color:#E85A1F;">IPHONE DUO (&gt;60 TRIỆU)</div>
      <div class="cm-body" style="font-size:21px;">Dành riêng cho Doanh nhân · Ca sĩ · Diễn viên thu nhập rất cao muốn trải nghiệm sản phẩm mới mẻ đủ WOW!</div>
    </div>
  </div>

  <!-- PHASE C: B-ROLL 6 + A-ROLL CLOSING PRICE STAMP (32.86s - 46.43s) -->
  <div id="s5-broll2-layer">
    <div style="position:absolute;bottom:64px;left:48px;width:580px;">
      <div id="s5-b2-stamp" class="cm-card-yellow cm-shadow-featured" style="padding:20px 26px;transform:rotate(-2deg);">
        <div class="cm-mono" style="font-size:17px;">KHÉP LẠI CÂU CHUYỆN GIÁ BÁN</div>
        <div class="cm-head" style="font-size:32px;margin-top:4px;">MUỐN TRẢI NGHIỆM ĐỦ WOW TỪ APPLE = CHI HƠN 60 TRIỆU!</div>
      </div>
    </div>
  </div>
`;

const s5Js = `
  // Phase A: B-roll 5 + A-roll overlay (0.00s - 17.60s = 173.20s - 190.80s global)
  tl.fromTo("#s5-b1-kicker", { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 0.30);
  // "không biết ở ngoài kia có những chiếc điện thoại gập cho đến khi Apple ra mắt iPhone Duo" (178.14s = 4.94s local)
  tl.fromTo("#s5-b1-card", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 4.80);
  // "so với cả những cái mẫu điện thoại dạng thanh... cảm thấy WOW rất là nhiều" (189.22s = 16.02s local)
  tl.fromTo("#s5-b1-wow", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 15.50);

  // Switch to Phase B: 100% Motion Split-Event Pipeline at 17.60s (190.80s global: "chia làm hai buổi giới thiệu")
  tl.to("#s5-broll1-layer", { opacity: 0, duration: 0.35, ease: "power2.inOut" }, 17.35);
  tl.fromTo("#s5-split-layer", { opacity: 0 }, { opacity: 1, duration: 0.42, ease: "power2.out" }, 17.60);

  // "iPhone 18 Pro với cả iPhone 18 Pro Max" (198.24s = 25.04s local)
  tl.to("#s5-branch-up", { strokeDashoffset: 0, duration: 0.8, ease: "power2.out" }, 21.50);
  tl.fromTo("#s5-tk-1", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 24.80);

  // "Còn với iPhone Duo họ ra mắt riêng vào một ngày khác" (202.94s = 29.74s local)
  tl.to("#s5-branch-down", { strokeDashoffset: 0, duration: 0.8, ease: "power2.out" }, 28.80);
  tl.fromTo("#s5-tk-2", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 29.60);

  // Switch back to Phase C: B-roll 6 + A-roll closing price stamp at 35.60s (208.80s global)
  tl.to("#s5-split-layer", { opacity: 0, duration: 0.35, ease: "power2.inOut" }, 35.35);
  tl.to("#s5-broll2-layer", { opacity: 1, duration: 0.35, ease: "power2.out" }, 35.60);
  // "cứ bỏ ra cái số tiền hơn 60 triệu mà thôi" (219.82s = 46.62s local)
  tl.fromTo("#s5-b2-stamp", { scale: 1.22, rotation: -7, opacity: 0 }, { scale: 1, rotation: -2, opacity: 1, duration: 0.52, ease: "power4.out" }, 46.40);
`;

writeFileSync(join(compDir, 'scene-05.html'), wrapSubComp('scene-05', s5Css, s5Html, s5Js));

// ============================================================================
// SCENE 06 (219.10s - 266.20s, dur 47.10s):
// [A-roll + 3 B-roll segments (229.70-237.10s, 247.23-253.83s, 258.50-266.20s) + SVG Caliper & Luxury Meter]
// ============================================================================
const s6Css = `
  #s6-left {
    position: absolute;
    top: 52px;
    left: 48px;
    width: 490px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  #s6-caliper-card {
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .s6-check-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: #E4DCC4;
    border: 3.5px solid #0F0F0F;
    opacity: 0;
  }
  #s6-right {
    position: absolute;
    top: 52px;
    right: 48px;
    width: 490px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  #s6-luxury-card {
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    opacity: 0;
  }
`;

const s6Html = `
  <div class="cm-stage">
    <div id="s6-left">
      <div id="s6-kicker" class="cm-kicker">ĐIỂM KHEN LỚN NHẤT // NGOẠI HÌNH &amp; THIẾT KẾ</div>
      <div id="s6-caliper-card" class="cm-card-cream cm-shadow-featured">
        <div class="cm-mono" style="font-size:17px;">THƯỚC KẸP KIỂM ĐỊNH ĐỘ HOÀN THIỆN</div>
        <div class="cm-head" style="font-size:36px;">ĐỘ HOÀN THIỆN &amp; CAO CẤP CỰC KỲ NGON ✓</div>
        <!-- Animated SVG Caliper Gauge -->
        <svg viewBox="0 0 430 88" width="100%" height="88" fill="none">
          <rect x="4" y="18" width="422" height="32" fill="#0F0F0F"/>
          <!-- Millimeter ticks -->
          <line x1="40" y1="18" x2="40" y2="36" stroke="#EFE9D9" stroke-width="3"/>
          <line x1="80" y1="18" x2="80" y2="36" stroke="#EFE9D9" stroke-width="3"/>
          <line x1="120" y1="18" x2="120" y2="36" stroke="#EFE9D9" stroke-width="3"/>
          <line x1="160" y1="18" x2="160" y2="36" stroke="#EFE9D9" stroke-width="3"/>
          <line x1="200" y1="18" x2="200" y2="36" stroke="#EFE9D9" stroke-width="3"/>
          <line x1="240" y1="18" x2="240" y2="36" stroke="#EFE9D9" stroke-width="3"/>
          <line x1="280" y1="18" x2="280" y2="36" stroke="#EFE9D9" stroke-width="3"/>
          <line x1="320" y1="18" x2="320" y2="36" stroke="#EFE9D9" stroke-width="3"/>
          <line x1="360" y1="18" x2="360" y2="36" stroke="#EFE9D9" stroke-width="3"/>
          <g id="s6-caliper-jaw">
            <rect x="260" y="6" width="120" height="68" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
            <text x="320" y="48" text-anchor="middle" fill="#0F0F0F" font-family="JetBrains Mono, monospace" font-size="20" font-weight="800">100% FIT</text>
          </g>
        </svg>
        <div id="s6-row-1" class="s6-check-row">
          <span class="cm-head" style="font-size:21px;">01 · PHẦN KHUNG VIỀN</span>
          <span class="cm-mono-dark-pill" style="background:#136636;">CHỈNH CHU ✓</span>
        </div>
        <div id="s6-row-2" class="s6-check-row">
          <span class="cm-head" style="font-size:21px;">02 · CỤM CAMERA</span>
          <span class="cm-mono-dark-pill" style="background:#136636;">RẤT GỌN ✓</span>
        </div>
        <div id="s6-row-3" class="s6-check-row">
          <span class="cm-head" style="font-size:21px;">03 · PHẦN MẶT LƯNG</span>
          <span class="cm-mono-dark-pill" style="background:#136636;">LUXURY ✓</span>
        </div>
      </div>
    </div>

    <div id="s6-right">
      <div id="s6-luxury-card" class="cm-card-green cm-shadow-ink">
        <div class="cm-mono-dark-pill">CẢM GIÁC CẦM TRÊN TAY KHÁC BIỆT</div>
        <div class="cm-head" style="font-size:32px;color:#EFE9D9;">NHƯ MỘT MÓN ĐỒ THỜI TRANG CAO CẤP!</div>
        <!-- Animated SVG Spectrum Slider: Tech -> Luxury Fashion -->
        <svg viewBox="0 0 430 92" width="100%" height="92" fill="none">
          <rect x="4" y="8" width="422" height="76" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
          <line x1="40" y1="46" x2="390" y2="46" stroke="#0F0F0F" stroke-width="8"/>
          <text x="40" y="74" fill="#2A2A2A" font-family="JetBrains Mono, monospace" font-size="14" font-weight="800">ĐỒ CÔNG NGHỆ</text>
          <text x="390" y="74" text-anchor="end" fill="#E85A1F" font-family="JetBrains Mono, monospace" font-size="14" font-weight="800">THỜI TRANG LUXURY ★</text>
          <g id="s6-lux-knob">
            <rect x="310" y="18" width="76" height="36" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
            <text x="348" y="42" text-anchor="middle" fill="#0F0F0F" font-family="JetBrains Mono, monospace" font-size="16" font-weight="800">LUXURY</text>
          </g>
        </svg>
      </div>
    </div>
  </div>
`;

const s6Js = `
  // "câu chuyện liên quan đến thiết kế" (229.12s = 3.32s local)
  tl.fromTo("#s6-kicker", { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 2.80);
  // "dành lời khen rất lớn cho Apple về độ hoàn thiện cũng như là về độ cao cấp" (234.86s = 9.06s local)
  tl.fromTo("#s6-caliper-card", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 8.50);
  tl.fromTo("#s6-caliper-jaw", { x: -180 }, { x: 0, duration: 0.85, ease: "power3.out" }, 9.50);

  // "từ phần khung viền (250.56s = 24.76s), cụm camera (251.64s = 25.84s), mặt lưng (252.76s = 26.96s)"
  tl.fromTo("#s6-row-1", { x: -28, opacity: 0 }, { x: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 24.60);
  tl.fromTo("#s6-row-2", { x: -28, opacity: 0 }, { x: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 25.70);
  tl.fromTo("#s6-row-3", { x: -28, opacity: 0 }, { x: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 26.80);

  // "giống như một cái món đồ thời trang cao cấp vậy" (264.64s = 38.84s local)
  tl.fromTo("#s6-luxury-card", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 38.50);
  tl.fromTo("#s6-lux-knob", { x: -240 }, { x: 0, duration: 0.75, ease: "back.out(1.4)" }, 39.20);
`;

writeFileSync(join(compDir, 'scene-06.html'), wrapSubComp('scene-06', s6Css, s6Html, s6Js));

// ============================================================================
// SCENE 07 (266.20s - 304.15s, dur 37.95s):
// Phase A (0.00s - 16.60s = 266.20s - 282.80s): A-roll Overlay (OPPO/Samsung vs Apple Fit & Finish)
// Phase B (16.60s - 28.80s = 282.80s - 295.00s): 100% Motion SVG X-Ray Titanium Cross-Section
// Phase C (28.80s - 37.95s = 295.00s - 304.15s B-roll 10 + A-roll): B-roll Titanium Frame Overlay
// ============================================================================
const s7Css = `
  #s7-aroll-layer {
    position: absolute;
    inset: 0;
    z-index: 4;
  }
  #s7-xray-layer {
    position: absolute;
    inset: 0;
    z-index: 10;
    opacity: 0;
  }
  #s7-broll-layer {
    position: absolute;
    inset: 0;
    z-index: 4;
    opacity: 0;
  }
  .s7-panel {
    position: absolute;
    top: 185px;
    width: 840px;
    height: 700px;
    padding: 26px 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 15;
  }
  #s7-panel-matte { left: 64px; opacity: 0; }
  #s7-panel-gloss { right: 64px; opacity: 0; }
  #s7-bottom-banner {
    position: absolute;
    bottom: 46px;
    left: 50%;
    margin-left: -460px;
    width: 920px;
    text-align: center;
    padding: 14px 28px;
    z-index: 18;
    opacity: 0;
  }
`;

const s7Html = `
  <!-- PHASE A: A-ROLL OVERLAY: OPPO/SAMSUNG VS APPLE FIT & FINISH (0.00s - 16.60s) -->
  <div id="s7-aroll-layer">
    <div style="position:absolute;top:52px;left:48px;width:500px;display:flex;flex-direction:column;gap:14px;">
      <div id="s7-a-kicker" class="cm-kicker">ĐẶT CẠNH ĐỐI THỦ // OPPO &amp; SAMSUNG VS APPLE</div>
      <div id="s7-a-card1" class="cm-card-cream cm-shadow-ink" style="padding:18px 22px;opacity:0;">
        <div class="cm-mono" style="font-size:16px;">ĐIỆN THOẠI GẬP OPPO &amp; SAMSUNG</div>
        <div class="cm-head" style="font-size:30px;margin-top:4px;">VẪN RẤT CAO CẤP &amp; XỊN SÒ ✓</div>
        <div class="cm-body" style="font-size:19px;margin-top:4px;">Không phủ nhận các hãng Android làm máy gập rất tốt.</div>
      </div>
      <div id="s7-a-card2" class="cm-card-green cm-shadow-featured" style="padding:20px 24px;opacity:0;">
        <div class="cm-mono-dark-pill">CẢM GIÁC LẦN ĐẦU NHÌN VÀO IPHONE DUO</div>
        <div class="cm-head" style="font-size:32px;color:#EFE9D9;margin-top:6px;">ĐỘ CHỈNH CHU &amp; CAO CẤP RẤT RIÊNG ĐẾN TỪ APPLE ★</div>
      </div>
    </div>
  </div>

  <!-- PHASE B: 100% MOTION GRAPHICS TITANIUM X-RAY CROSS-SECTION (16.60s - 28.80s) -->
  <div id="s7-xray-layer">
    <div class="cm-full-ground"></div>
    <div class="cm-corner tl"></div>
    <div class="cm-corner tr"></div>
    <div class="cm-corner bl"></div>
    <div class="cm-corner br"></div>

    <div style="position:absolute;top:44px;left:64px;right:64px;z-index:15;">
      <div class="cm-kicker">MẶT CẮT X-RAY KHUNG VIỀN // TITANIUM BÓNG VS TITANIUM NHÁM</div>
      <div class="cm-head" style="font-size:48px;margin-top:10px;" data-var-text="s7_frame_mat">KHUNG VIỀN BAO BỌC BẰNG TITANIUM BÓNG THU HÚT ÁNH NHÌN</div>
    </div>

    <!-- Left Cross-Section: iPhone 15 Pro / 16 Pro Brushed Matte Titanium -->
    <div id="s7-panel-matte" class="s7-panel cm-card-cream2 cm-shadow-ink">
      <div>
        <div class="cm-mono-dark-pill">THẾ HỆ TRƯỚC · IPHONE 15 PRO / 16 PRO</div>
        <div class="cm-head" style="font-size:36px;margin-top:8px;">TITANIUM NHÁM (MATTE)</div>
        <div class="cm-body" style="font-size:20px;margin-top:4px;">Bề mặt phay xước tán xạ ánh sáng, nhìn trầm và ít nổi bật hơn.</div>
      </div>

      <svg viewBox="0 0 760 420" width="100%" height="420" fill="none">
        <rect x="6" y="6" width="748" height="408" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
        <!-- Incoming Light Beam -->
        <line x1="120" y1="40" x2="340" y2="230" stroke="#7C766B" stroke-width="8" stroke-dasharray="14 10"/>
        <!--Scattered Weak Rays -->
        <line x1="340" y1="230" x2="460" y2="120" stroke="#7C766B" stroke-width="4" stroke-dasharray="8 8"/>
        <line x1="340" y1="230" x2="540" y2="160" stroke="#7C766B" stroke-width="4" stroke-dasharray="8 8"/>
        <line x1="340" y1="230" x2="580" y2="210" stroke="#7C766B" stroke-width="4" stroke-dasharray="8 8"/>
        <!-- Micro Rough Surface Cross-Section -->
        <path d="M 80 235 L 130 220 L 180 238 L 230 218 L 280 236 L 340 220 L 390 238 L 440 218 L 490 236 L 550 220 L 610 238 L 680 224 L 680 360 L 80 360 Z" fill="#7C766B" stroke="#0F0F0F" stroke-width="5"/>
        <text x="380" y="310" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono, monospace" font-size="24" font-weight="800">LỚP VỎ TITANIUM NHÁM (TÁN XẠ)</text>
      </svg>

      <div class="cm-mono" style="font-size:18px;color:#2A2A2A;">HIỆU ỨNG THỊ GIÁC: TRẦM · ÍT BẮT SÁNG</div>
    </div>

    <!-- Right Cross-Section: iPhone Duo Polished Titanium -->
    <div id="s7-panel-gloss" class="s7-panel cm-card-cream cm-shadow-featured">
      <div>
        <div class="cm-mono-dark-pill" style="background:#136636;">TRÊN IPHONE DUO MỚI</div>
        <div class="cm-head" style="font-size:36px;color:#136636;margin-top:8px;">TITANIUM BÓNG (POLISHED) ✓</div>
        <div class="cm-body" style="font-size:20px;margin-top:4px;">Bề mặt xử lý bóng gương phản xạ ánh sáng cực mạnh, thu hút mọi ánh nhìn.</div>
      </div>

      <svg viewBox="0 0 760 420" width="100%" height="420" fill="none">
        <rect x="6" y="6" width="748" height="408" fill="#0F0F0F" stroke="#0F0F0F" stroke-width="4"/>
        <!-- Specular Reflection Cone -->
        <polygon id="s7-gloss-cone" points="360,210 560,36 710,120" fill="#F5C518" opacity="0.38"/>
        <line x1="110" y1="50" x2="360" y2="210" stroke="#F5C518" stroke-width="10"/>
        <line x1="360" y1="210" x2="635" y2="68" stroke="#F5C518" stroke-width="12"/>
        <!-- Sparkle Stars -->
        <circle cx="360" cy="210" r="18" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
        <!-- 3-Layer X-Ray Anatomy -->
        <rect x="70" y="210" width="620" height="42" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
        <text x="380" y="238" text-anchor="middle" fill="#0F0F0F" font-family="JetBrains Mono, monospace" font-size="20" font-weight="800">LỚP 01: TITANIUM ĐÁNH BÓNG GƯƠNG</text>
        <rect x="70" y="252" width="620" height="54" fill="#136636" stroke="#0F0F0F" stroke-width="4"/>
        <text x="380" y="286" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono, monospace" font-size="20" font-weight="800">LỚP 02: KHUNG TITANIUM BAO BỌC TOÀN BỘ</text>
        <rect x="70" y="306" width="620" height="58" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="4"/>
        <text x="380" y="342" text-anchor="middle" fill="#0F0F0F" font-family="JetBrains Mono, monospace" font-size="20" font-weight="800">LỚP 03: CƠ CẤU BẢN LỀ GẬP SIÊU MỎNG</text>
      </svg>

      <div class="cm-mono" style="font-size:18px;color:#136636;">HIỆU ỨNG THỊ GIÁC: SANG TRỌNG · THU HÚT ÁNH NHÌN ✓</div>
    </div>

    <div id="s7-bottom-banner" class="cm-card-yellow cm-shadow-ink">
      <div class="cm-head" style="font-size:28px;">ĐỘ HOÀN THIỆN TỔNG QUAN RẤT CAO CẤP &amp; CHỈNH CHU ĐẾN TỪ APPLE!</div>
    </div>
  </div>

  <!-- PHASE C: B-ROLL 10 CLOSE-UP TITANIUM EDGE OVERLAY (28.80s - 37.95s) -->
  <div id="s7-broll-layer">
    <div style="position:absolute;top:56px;left:48px;width:510px;display:flex;flex-direction:column;gap:14px;">
      <div class="cm-kicker">CẬN CẢNH THỰC TẾ // VIỀN TITANIUM BÓNG</div>
      <div class="cm-card-cream cm-shadow-featured" style="padding:20px 24px;">
        <div class="cm-head" style="font-size:34px;">VIỀN TITANIUM BÓNG BẮT SÁNG RỰC RỠ ✓</div>
        <div class="cm-body" style="font-size:20px;margin-top:6px;">Khác biệt hoàn toàn với khung viền nhám trên iPhone 15 Pro / 16 Pro.</div>
      </div>
    </div>
  </div>
`;

const s7Js = `
  // Phase A: A-roll overlay (0.00s - 15.00s = 275.20s - 290.20s global)
  tl.fromTo("#s7-a-kicker", { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 0.20);
  // "OPPO hay là Samsung (276.66s = 1.46s local)"
  tl.fromTo("#s7-a-card1", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 1.20);
  // "cảm giác khi lần đầu tôi nhìn vào thiết kế tổng quan của iPhone Duo... rất cao cấp, rất chỉnh chu đến từ nhà Apple" (281.84s = 6.64s local)
  tl.fromTo("#s7-a-card2", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 6.80);

  // Switch to Phase B: 100% Motion Titanium X-Ray at 15.00s (290.20s global: "Hơn nữa nha là phần khung viền bao bọc toàn bộ của iPhone Duo này được làm từ Titanium")
  tl.to("#s7-aroll-layer", { opacity: 0, duration: 0.35, ease: "power2.inOut" }, 14.75);
  tl.fromTo("#s7-xray-layer", { opacity: 0 }, { opacity: 1, duration: 0.42, ease: "power2.out" }, 15.00);

  // "và đây là Titanium bóng" (295.08s = 19.88s local)
  tl.fromTo("#s7-panel-gloss", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 19.80);
  // "chứ không phải là nhám giống như là iPhone 16 Pro hay là iPhone 15 Pro trước đây" (296.46s = 21.26s local)
  tl.fromTo("#s7-panel-matte", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 21.40);
  tl.fromTo("#s7-bottom-banner", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 23.00);

  // Switch to Phase C: Close-up Titanium Edge B-roll at 24.80s (300.00s global: "Vậy nên nhìn nó sẽ thu hút ánh nhìn hơn")
  tl.to("#s7-xray-layer", { opacity: 0, duration: 0.35, ease: "power2.inOut" }, 24.55);
  tl.to("#s7-broll-layer", { opacity: 1, duration: 0.40, ease: "power2.out" }, 24.80);
`;

writeFileSync(join(compDir, 'scene-07.html'), wrapSubComp('scene-07', s7Css, s7Html, s7Js));

// ============================================================================
// SCENE 08 (304.15s - 324.40s, dur 20.25s):
// [A-roll (304.15-315.43s) + B-roll 11 Apple Logo (315.43-324.40s) + SVG Metro Cross-Section Overlay]
// ============================================================================
const s8Css = `
  #s8-left {
    position: absolute;
    top: 52px;
    left: 48px;
    width: 550px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  #s8-metro-card {
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  #s8-right-stamp {
    position: absolute;
    bottom: 58px;
    right: 54px;
    width: 520px;
    padding: 20px 26px;
    opacity: 0;
  }
`;

const s8Html = `
  <div class="cm-stage">
    <div id="s8-left">
      <div id="s8-kicker" class="cm-kicker">TRẢI NGHIỆM ĐỜI THƯỜNG // ĐI LÀM BẰNG TÀU METRO</div>
      <div id="s8-metro-card" class="cm-card-cream cm-shadow-featured">
        <div class="cm-mono" style="font-size:17px;">MẶT CẮT TOA TÀU METRO · MỌI ÁNH NHÌN ĐỔ DỒN</div>
        <div class="cm-head" style="font-size:32px;">RÚT MÁY RA LÀ NHIỀU NGƯỜI ĐỂ Ý NGAY!</div>

        <!-- Animated SVG Metro Carriage Cross-Section with Spotlight Cones -->
        <svg viewBox="0 0 490 250" width="100%" height="250" fill="none">
          <!-- Metro Carriage Outer Frame -->
          <rect x="6" y="6" width="478" height="238" fill="#182836" stroke="#0F0F0F" stroke-width="5"/>
          <!-- Metro Windows -->
          <rect x="28" y="28" width="120" height="62" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="4"/>
          <rect x="185" y="28" width="120" height="62" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="4"/>
          <rect x="342" y="28" width="120" height="62" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="4"/>
          <!-- Top Handrail -->
          <line x1="16" y1="18" x2="474" y2="18" stroke="#F5C518" stroke-width="4"/>

          <!-- Spotlight Attention Cones converging on Center User holding iPhone Duo -->
          <polygon id="s8-cone-1" points="65,145 225,165 225,195" fill="#F5C518" opacity="0"/>
          <polygon id="s8-cone-2" points="145,145 230,165 230,195" fill="#F5C518" opacity="0"/>
          <polygon id="s8-cone-3" points="345,145 260,165 260,195" fill="#F5C518" opacity="0"/>
          <polygon id="s8-cone-4" points="425,145 265,165 265,195" fill="#F5C518" opacity="0"/>

          <!-- Passengers Left & Right -->
          <circle cx="65" cy="140" r="18" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
          <rect x="45" y="162" width="40" height="56" fill="#7C766B" stroke="#0F0F0F" stroke-width="4"/>

          <circle cx="145" cy="140" r="18" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
          <rect x="125" y="162" width="40" height="56" fill="#7C766B" stroke="#0F0F0F" stroke-width="4"/>

          <circle cx="345" cy="140" r="18" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
          <rect x="325" y="162" width="40" height="56" fill="#7C766B" stroke="#0F0F0F" stroke-width="4"/>

          <circle cx="425" cy="140" r="18" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
          <rect x="405" y="162" width="40" height="56" fill="#7C766B" stroke="#0F0F0F" stroke-width="4"/>

          <!-- Center User + Glowing iPhone Duo -->
          <circle cx="245" cy="130" r="22" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
          <rect x="215" y="156" width="60" height="68" fill="#136636" stroke="#0F0F0F" stroke-width="4"/>
          <rect id="s8-mini-phone" x="227" y="162" width="36" height="46" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="3"/>
        </svg>
      </div>
    </div>

    <div id="s8-right-stamp" class="cm-card-green cm-shadow-ink" style="transform:rotate(-2deg);">
      <div class="cm-mono-dark-pill">SỨC HÚT TỪ LOGO QUẢ TÁO</div>
      <div class="cm-head" style="font-size:32px;color:#EFE9D9;margin-top:6px;" data-var-text="s8_apple_pull">KHÔNG HỀ NHỎ · KHÁC BIỆT HOÀN TOÀN VỚI ANDROID! ✓</div>
    </div>
  </div>
`;

const s8Js = `
  tl.fromTo("#s8-kicker", { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 0.30);
  // "có vài hôm tôi đi làm bằng Metro" (309.60s = 5.70s local)
  tl.fromTo("#s8-metro-card", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 5.20);
  // "rất nhiều người để ý đến con máy này ngay" (312.62s = 8.72s local)
  tl.to(["#s8-cone-1", "#s8-cone-2", "#s8-cone-3", "#s8-cone-4"], { opacity: 0.52, stagger: 0.18, duration: 0.48, ease: "power2.out" }, 8.20);
  // "sức hút đến từ logo quả táo của nhà Apple không hề nhỏ" (316.30s = 12.40s local)
  tl.fromTo("#s8-right-stamp", { scale: 1.22, rotation: -7, opacity: 0 }, { scale: 1, rotation: -2, opacity: 1, duration: 0.52, ease: "power4.out" }, 12.20);
`;

writeFileSync(join(compDir, 'scene-08.html'), wrapSubComp('scene-08', s8Css, s8Html, s8Js));

// ============================================================================
// ROOT INDEX.HTML
// ============================================================================
const VARIABLES = JSON.stringify([
  { id: "product_name", type: "string", label: "Tên sản phẩm", default: "IPHONE DUO" },
  { id: "s1_verdict", type: "string", label: "Cảnh 1: Nhận định sản phẩm", default: "THẤT BẠI VỀ MẶT SẢN PHẨM! ✕" },
  { id: "price_duo", type: "string", label: "Cảnh 2: Giá bán bản thấp nhất", default: "65 TRIỆU" },
  { id: "s2_applecare_note", type: "string", label: "Cảnh 2: Lưu ý AppleCare+", default: "APPLECARE+ KHÔNG FREE 100% KHI SỬA CHỮA SỰ CỐ! ✕" },
  { id: "price_iphonex", type: "string", label: "Cảnh 3: Cột mốc iPhone X", default: "IPHONE X: 1.000 USD" },
  { id: "price_18pm", type: "string", label: "Cảnh 3: Cột mốc iPhone 18 Pro Max", default: "IPHONE 18 PRO MAX: >40 TRIỆU" },
  { id: "s7_frame_mat", type: "string", label: "Cảnh 7: Chất liệu khung viền", default: "KHUNG VIỀN BAO BỌC BẰNG TITANIUM BÓNG THU HÚT ÁNH NHÌN" },
  { id: "s8_apple_pull", type: "string", label: "Cảnh 8: Sức hút thương hiệu", default: "KHÔNG HỀ NHỎ · KHÁC BIỆT HOÀN TOÀN VỚI ANDROID! ✓" },
  { id: "bg_cream", type: "color", label: "Màu nền giấy kem (Cream)", default: "#EFE9D9" },
  { id: "accent_pink", type: "color", label: "Màu nhấn Hồng (Pink)", default: "#F06CA8" },
  { id: "accent_green", type: "color", label: "Màu nhấn Xanh lá (Green)", default: "#136636" },
  { id: "accent_orange", type: "color", label: "Màu bóng cứng Cam (Orange)", default: "#E85A1F" },
  { id: "accent_yellow", type: "color", label: "Màu nhấn Vàng (Yellow)", default: "#F5C518" }
]);

const indexHtml = `<!doctype html>
<html lang="vi" data-composition-variables='${VARIABLES}'>
  <head>
    <meta charset="UTF-8" />
    <title>Review iPhone Duo — 5 Phút Đầu (Creative Mode Illustrated)</title>
    ${FONT_LINK}
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body {
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
        background: #0F0F0F;
      }
      #master-video {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 1;
      }
      .scene-slot {
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
    <div data-hf-id="hf-main"
      id="main"
      data-composition-id="main"
      data-width="1920"
      data-height="1080"
      data-fps="30"
      data-duration="324.4"
    >
      <video data-hf-id="hf-src-video"
        id="master-video"
        class="clip"
        src="assets/source.mp4"
        playsinline
        data-has-audio="true"
        data-start="0"
        data-duration="324.4"
        data-track-index="0"
        data-volume="1"
      ></video>

      <div data-hf-id="hf-s01" id="scene-01" class="clip scene-slot" data-composition-id="scene-01" data-composition-src="compositions/scene-01.html" data-start="0" data-duration="32.5" data-track-index="1" data-label="01: Nghịch lý iPhone Duo — Thắng Truyền thông vs Thua Sản phẩm"></div>
      <!-- 32.50s - 43.93s: Intro ĐỨC BIẾT TECH Pass-through 100% -->
      <div data-hf-id="hf-s02" id="scene-02" class="clip scene-slot" data-composition-id="scene-02" data-composition-src="compositions/scene-02.html" data-start="43.93" data-duration="45.64" data-track-index="1" data-label="02: Băng tải & 3 Cổng Quét — 65 Triệu 0 Quà tặng vs Gập Android & AppleCare+"></div>
      <div data-hf-id="hf-s03" id="scene-03" class="clip scene-slot" data-composition-id="scene-03" data-composition-src="compositions/scene-03.html" data-start="89.57" data-duration="41.86" data-track-index="1" data-label="03: Biểu đồ Tự vẽ Lịch sử Định giá Neo cao của Apple (iPhone X -> 18 Pro Max -> Duo)"></div>
      <div data-hf-id="hf-s04" id="scene-04" class="clip scene-slot" data-composition-id="scene-04" data-composition-src="compositions/scene-04.html" data-start="131.43" data-duration="41.24" data-track-index="1" data-label="04: Bộ Phân Loại Thẻ Tệp Khách Hàng — Phổ thông Chê vs KOL Tiền Tỷ Hào hứng"></div>
      <div data-hf-id="hf-s05" id="scene-05" class="clip scene-slot" data-composition-id="scene-05" data-composition-src="compositions/scene-05.html" data-start="172.67" data-duration="46.43" data-track-index="1" data-label="05: Sơ đồ Cổng Phân Luồng 2 Sự Kiện Ra Mắt của Apple (18 Pro Max vs iPhone Duo)"></div>
      <div data-hf-id="hf-s06" id="scene-06" class="clip scene-slot" data-composition-id="scene-06" data-composition-src="compositions/scene-06.html" data-start="219.1" data-duration="47.1" data-track-index="1" data-label="06: Bản vẽ Kỹ thuật SVG & Thước đo Độ Hoàn Thiện Thời Trang Luxury"></div>
      <div data-hf-id="hf-s07" id="scene-07" class="clip scene-slot" data-composition-id="scene-07" data-composition-src="compositions/scene-07.html" data-start="266.2" data-duration="37.95" data-track-index="1" data-label="07: Mặt cắt X-Ray Giải Phẫu Khung Titanium Bóng vs Titanium Nhám"></div>
      <div data-hf-id="hf-s08" id="scene-08" class="clip scene-slot" data-composition-id="scene-08" data-composition-src="compositions/scene-08.html" data-start="304.15" data-duration="20.25" data-track-index="1" data-label="08: Mặt cắt Toa Tàu Metro & Spotlight Sức hút Logo Quả Táo"></div>
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>`;

writeFileSync(join(projDir, 'index.html'), indexHtml);
console.log('Generated index.html and scene-01..scene-08 successfully.');
