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
  .cm-green-ground {
    position: absolute;
    inset: 0;
    background-color: #136636;
    background-image: radial-gradient(rgba(239,233,217,0.18) 1.5px, transparent 1.5px);
    background-size: 36px 36px;
    z-index: 0;
  }
  .cm-full-ground ~ *,
  .cm-green-ground ~ * {
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
// SCENE 09 (324.40s - 407.20s, dur 82.80s):
// Điểm chê Thiết kế #1: Trọng lượng rất nặng (15-20p mỏi tay) & Nút dồn sang phải / Lỗi vuốt Back Shopee
// [B-roll + A-roll + Shopee B-roll + Animated SVG Load-Cell Scale & Reachability Arc]
// ============================================================================
const s9Css = `
  #s9-left {
    position: absolute;
    top: 48px;
    left: 48px;
    width: 540px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  #s9-scale-card {
    padding: 18px 22px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  #s9-timer-card {
    padding: 16px 20px;
    opacity: 0;
  }
  #s9-right {
    position: absolute;
    top: 48px;
    right: 48px;
    width: 500px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  #s9-hand-card {
    padding: 18px 22px;
    opacity: 0;
  }
  #s9-shopee-card {
    padding: 18px 22px;
    opacity: 0;
  }
`;

const s9Html = `
  <div class="cm-stage">
    <div id="s9-left">
      <div id="s9-kicker" class="cm-kicker">ĐIỂM CHÊ THIẾT KẾ #01 // TRỌNG LƯỢNG &amp; CẦM NẮM</div>
      <div id="s9-scale-card" class="cm-card-cream cm-shadow-featured">
        <div class="cm-mono" style="font-size:16px;">CÂN ĐO TRỌNG LƯỢNG CẦM TRÊN TAY</div>
        <div class="cm-head" style="font-size:32px;" data-var-text="s9_weight_head">TRỌNG LƯỢNG RẤT NẶNG · MỎI TAY NGAY! ✕</div>
        <svg viewBox="0 0 480 185" width="100%" height="185" fill="none">
          <!-- Scale Dial Arch -->
          <path d="M 60 150 A 130 130 0 0 1 320 150" stroke="#0F0F0F" stroke-width="18" fill="none"/>
          <path d="M 60 150 A 130 130 0 0 1 190 20" stroke="#136636" stroke-width="12" fill="none"/>
          <path d="M 190 20 A 130 130 0 0 1 320 150" stroke="#E85A1F" stroke-width="12" fill="none"/>
          <text x="50" y="176" fill="#136636" font-family="JetBrains Mono" font-size="15" font-weight="800">NHẸ (1 TAY)</text>
          <text x="235" y="176" fill="#E85A1F" font-family="JetBrains Mono" font-size="15" font-weight="800">QUÁ NẶNG ✕</text>
          <!-- Pivot & Needle -->
          <g id="s9-scale-needle" style="transform-origin:190px 150px;">
            <line x1="190" y1="150" x2="190" y2="32" stroke="#0F0F0F" stroke-width="7"/>
            <polygon points="190,18 180,40 200,40" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3"/>
          </g>
          <circle cx="190" cy="150" r="14" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
          <!-- Fatigue Clock (Right side of SVG) -->
          <g id="s9-fatigue-box" opacity="0">
            <rect x="345" y="22" width="125" height="145" fill="#F06CA8" stroke="#0F0F0F" stroke-width="4"/>
            <text x="407" y="50" text-anchor="middle" fill="#0F0F0F" font-family="JetBrains Mono" font-size="14" font-weight="800">CHỈ SAU</text>
            <text x="407" y="92" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="25" font-weight="900">15–20 PHÚT</text>
            <rect x="360" y="110" width="95" height="40" fill="#0F0F0F"/>
            <text x="407" y="135" text-anchor="middle" fill="#F5C518" font-family="JetBrains Mono" font-size="14" font-weight="800">CẦM 2 TAY!</text>
          </g>
        </svg>
      </div>

      <div id="s9-timer-card" class="cm-card-yellow cm-shadow-ink">
        <div class="cm-mono" style="font-size:16px;">NGHỊCH LÝ GẬP NHỎ GỌN</div>
        <div class="cm-head" style="font-size:26px;margin-top:4px;">GẬP LẠI ĐỂ DÙNG 1 TAY NHƯNG NẶNG NỀ PHẢI CẦM 2 TAY!</div>
      </div>
    </div>

    <div id="s9-right">
      <div id="s9-hand-card" class="cm-card-pink cm-shadow-ink">
        <div class="cm-mono" style="font-size:16px;">THIẾT KẾ CHỮ D // DỒN NÚT SANG PHẢI</div>
        <div class="cm-head" style="font-size:28px;margin-top:4px;">NGƯỜI THUẬN TAY TRÁI CỰC KHÓ BẤM! ✕</div>
        <div class="cm-body" style="font-size:19px;margin-top:6px;">Toàn bộ phím vật lý đều bị đẩy sang cạnh phải của máy.</div>
      </div>

      <div id="s9-shopee-card" class="cm-card-cream cm-shadow-ink">
        <div class="cm-mono" style="font-size:16px;color:#E85A1F;">VÍ DỤ THỰC TẾ // LƯỚT SHOPEE</div>
        <div class="cm-head" style="font-size:26px;margin-top:4px;">KHÔNG CÓ NÚT BACK BÊN PHẢI! ✕</div>
        <svg viewBox="0 0 440 135" width="100%" height="135" fill="none" style="margin-top:8px;">
          <rect x="10" y="8" width="420" height="118" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="4"/>
          <!-- Left Edge Swipe Zone -->
          <rect x="14" y="12" width="48" height="110" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3"/>
          <text x="38" y="72" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono" font-size="14" font-weight="800">BACK</text>
          <!-- Swipe Arrow from Left to Right -->
          <path id="s9-swipe-arrow" d="M 68 68 L 235 68" stroke="#0F0F0F" stroke-width="6" stroke-dasharray="180" stroke-dashoffset="180"/>
          <polygon points="242,68 222,56 222,80" fill="#0F0F0F"/>
          <text x="255" y="56" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="18" font-weight="800">Phải dùng tay trái</text>
          <text x="255" y="82" fill="#E85A1F" font-family="Be Vietnam Pro" font-size="18" font-weight="900">vuốt từ mép trái!</text>
        </svg>
      </div>
    </div>
  </div>
`;

const s9Js = `
  tl.fromTo("#s9-kicker", { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 0.40);
  // "Đầu tiên là nó có trọng lượng rất nặng" (328.76s = 5.46s local)
  tl.fromTo("#s9-scale-card", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 5.40);
  // "nhưng khi cầm trên tay nó nặng vãi chưởng luôn" (338.46s = 15.16s local)
  tl.fromTo("#s9-scale-needle", { rotation: -65 }, { rotation: 62, duration: 0.85, ease: "elastic.out(1, 0.5)" }, 14.50);
  // "chỉ sau tầm khoảng 15 cho đến 20 phút thôi là ngay lập tức các bạn sẽ cần phải cầm bằng hai tay rồi" (350.92s = 27.62s local)
  tl.to("#s9-fatigue-box", { opacity: 1, duration: 0.40, ease: "power2.out" }, 27.20);
  tl.fromTo("#s9-timer-card", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 30.20);
  // "với những anh em nào sử dụng thuận tay trái... nút ấn đẩy hết sang bên phải" (375.40s = 52.10s local)
  tl.fromTo("#s9-hand-card", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 51.80);
  // "Ví dụ như là anh em vào Shopee đi" (394.52s = 71.22s local) -> "cầm bằng tay trái để vuốt từ mép trái" (403.12s = 79.82s local)
  tl.fromTo("#s9-shopee-card", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 71.50);
  tl.to("#s9-swipe-arrow", { strokeDashoffset: 0, duration: 0.65, ease: "power2.out" }, 79.80);
`;

writeFileSync(join(compDir, 'scene-09.html'), wrapSubComp('scene-09', s9Css, s9Html, s9Js));

// ============================================================================
// SCENE 10 (407.20s - 459.00s, dur 51.80s):
// Thiết kế chữ D "Cong không cong, thẳng không thẳng" gây OCD & Cấn lòng bàn tay trái
// Phase A (0.00s - 24.80s / 407.20s - 432.00s): 100% FULL-SCREEN MOTION GRAPHICS (Blueprint Geometry Caliper)
// Phase B (24.80s - 51.80s / 432.00s - 459.00s): B-roll + A-roll Palm Pressure Heatmap Overlay
// ============================================================================
const s10Css = `
  #s10-full-layer {
    position: absolute;
    inset: 0;
    z-index: 6;
  }
  #s10-header {
    position: absolute;
    top: 44px;
    left: 64px;
    right: 64px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  #s10-blueprint-card {
    position: absolute;
    top: 190px;
    left: 64px;
    width: 1792px;
    height: 690px;
    padding: 28px 36px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  #s10-bottom-bar {
    position: absolute;
    bottom: 42px;
    left: 64px;
    right: 64px;
    padding: 18px 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    opacity: 0;
  }
  #s10-overlay-layer {
    position: absolute;
    inset: 0;
    z-index: 8;
    opacity: 0;
    pointer-events: none;
  }
`;

const s10Html = `
  <!-- PHASE A: 100% FULL-SCREEN MOTION GRAPHICS (0.00s - 24.80s) -->
  <div id="s10-full-layer">
    <div class="cm-full-ground"></div>
    <div class="cm-corner tl"></div>
    <div class="cm-corner tr"></div>
    <div class="cm-corner bl"></div>
    <div class="cm-corner br"></div>

    <div id="s10-header">
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div class="cm-kicker">BẢN VẼ HÌNH HỌC // KIỂU DÁNG CHỮ D BẤT ĐỐI XỨNG</div>
        <div class="cm-head" style="font-size:38px;">"CONG KHÔNG CONG · THẲNG KHÔNG THẲNG" GÂY GAI MẮT!</div>
      </div>
      <div id="s10-ocd-stamp" class="cm-stamp-rot" style="opacity:0;">
        <div class="cm-mono" style="font-size:16px;">CẢNH BÁO THỊ GIÁC</div>
        <div class="cm-head" style="font-size:30px;">ÁM ẢNH NGƯỜI BỊ OCD! ✕</div>
      </div>
    </div>

    <div id="s10-blueprint-card" class="cm-card-cream cm-shadow-featured">
      <div class="cm-mono" style="font-size:19px;">PHÉP ĐO THƯỚC CẶP 3 TRƯỜNG PHÁI THIẾT KẾ ĐIỆN THOẠI GẬP</div>
      <svg viewBox="0 0 1700 540" width="100%" height="540" fill="none">
        <!-- Card 1: Bo Cong Đều 4 Góc -->
        <g id="s10-shape-1" opacity="0">
          <rect x="30" y="25" width="490" height="490" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
          <text x="275" y="75" text-anchor="middle" fill="#136636" font-family="JetBrains Mono" font-size="20" font-weight="800">PHƯƠNG ÁN 01 // ĐỒNG BỘ</text>
          <text x="275" y="115" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="30" font-weight="900">BO CONG HẲN 4 GÓC ✓</text>
          <rect x="155" y="155" width="240" height="300" rx="44" fill="#EFE9D9" stroke="#136636" stroke-width="8"/>
          <circle cx="195" cy="195" r="14" stroke="#136636" stroke-width="4" stroke-dasharray="6 4"/>
          <circle cx="355" cy="195" r="14" stroke="#136636" stroke-width="4" stroke-dasharray="6 4"/>
          <text x="275" y="492" text-anchor="middle" fill="#136636" font-family="JetBrains Mono" font-size="18" font-weight="800">THUẬN MẮT · CÂN ĐỐI 100%</text>
        </g>

        <!-- Card 2: Vuông Vức 4 Góc (Galaxy Z Fold8) -->
        <g id="s10-shape-2" opacity="0">
          <rect x="565" y="25" width="510" height="490" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
          <text x="820" y="75" text-anchor="middle" fill="#136636" font-family="JetBrains Mono" font-size="20" font-weight="800">PHƯƠNG ÁN 02 // NHƯ GALAXY Z FOLD8</text>
          <text x="820" y="115" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="30" font-weight="900">LÀM VUÔNG HẲN 4 GÓC ✓</text>
          <rect x="700" y="155" width="240" height="300" rx="4" fill="#EFE9D9" stroke="#136636" stroke-width="8"/>
          <rect x="700" y="155" width="28" height="28" stroke="#136636" stroke-width="4"/>
          <rect x="912" y="155" width="28" height="28" stroke="#136636" stroke-width="4"/>
          <text x="820" y="492" text-anchor="middle" fill="#136636" font-family="JetBrains Mono" font-size="18" font-weight="800">MẠNH MẼ · ĐỒNG NHẤT THỊ GIÁC</text>
        </g>

        <!-- Card 3: iPhone Duo Chữ D Nửa Vời -->
        <g id="s10-shape-3" opacity="0">
          <rect x="1120" y="25" width="550" height="490" fill="#F06CA8" stroke="#0F0F0F" stroke-width="5"/>
          <rect x="1145" y="45" width="500" height="42" fill="#0F0F0F"/>
          <text x="1395" y="73" text-anchor="middle" fill="#F5C518" font-family="JetBrains Mono" font-size="20" font-weight="800">IPHONE DUO // THIẾT KẾ CHỮ D ✕</text>
          <text x="1395" y="122" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="30" font-weight="900">TRÁI VUÔNG 90° · PHẢI BO TRÒN!</text>
          <!-- D-shaped Phone Path -->
          <path d="M 1275 155 L 1455 155 A 60 60 0 0 1 1515 215 L 1515 395 A 60 60 0 0 1 1455 455 L 1275 455 Z" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="8"/>
          <!-- Left Sharp Callout -->
          <rect x="1265" y="145" width="32" height="32" fill="none" stroke="#E85A1F" stroke-width="5"/>
          <rect x="1265" y="433" width="32" height="32" fill="none" stroke="#E85A1F" stroke-width="5"/>
          <text x="1205" y="310" text-anchor="middle" fill="#0F0F0F" font-family="JetBrains Mono" font-size="17" font-weight="800">THẲNG 90°</text>
          <!-- Right Curved Callout -->
          <circle cx="1495" cy="185" r="24" fill="none" stroke="#E85A1F" stroke-width="5" stroke-dasharray="8 5"/>
          <circle cx="1495" cy="425" r="24" fill="none" stroke="#E85A1F" stroke-width="5" stroke-dasharray="8 5"/>
          <text x="1590" y="310" text-anchor="middle" fill="#0F0F0F" font-family="JetBrains Mono" font-size="17" font-weight="800">CONG TRÒN</text>
          <rect x="1165" y="468" width="460" height="36" fill="#0F0F0F"/>
          <text x="1395" y="492" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono" font-size="17" font-weight="800">KHÔNG THUẬN MẮT · KHÓ CHỊU DÃ MAN ✕</text>
        </g>
      </svg>
    </div>

    <div id="s10-bottom-bar" class="cm-card-yellow cm-shadow-ink">
      <div class="cm-head" style="font-size:28px;">THÀ LÀM CONG HẲN HOẶC VUÔNG HẲN NHƯ GALAXY Z FOLD8 SẼ ĐẸP HƠN RẤT NHIỀU!</div>
      <div class="cm-mono" style="font-size:18px;">GÓC NHÌN THẨM MỸ // CHỮ D</div>
    </div>
  </div>

  <!-- PHASE B: B-ROLL + A-ROLL PALM PRESSURE OVERLAY (24.80s - 51.80s) -->
  <div id="s10-overlay-layer">
    <div style="position:absolute;top:48px;left:48px;width:540px;display:flex;flex-direction:column;gap:14px;">
      <div class="cm-kicker">TRẢI NGHIỆM CẦM NẮM // TAY PHẢI VS TAY TRÁI</div>
      <div id="s10-right-palm" class="cm-card-green cm-shadow-ink" style="padding:18px 22px;opacity:0;">
        <div class="cm-mono-dark-pill">KHI CẦM BẰNG TAY PHẢI</div>
        <div class="cm-head" style="font-size:28px;color:#EFE9D9;margin-top:6px;">CẠNH CONG TỲ ÊM VÀO LÒNG BÀN TAY ✓</div>
      </div>
      <div id="s10-left-palm" class="cm-card-orange cm-shadow-featured" style="padding:20px 22px;opacity:0;">
        <div class="cm-mono-dark-pill">CHUYỂN SANG CẦM TAY TRÁI</div>
        <div class="cm-head" style="font-size:30px;margin-top:6px;">CẠNH VUÔNG CẤN &amp; ĐÈ ĐAU LÒNG BÀN TAY! ✕</div>
        <div class="cm-body" style="font-size:19px;margin-top:6px;">Mất hoàn toàn cảm giác thoải mái khi đổi từ tay phải sang tay trái.</div>
      </div>
    </div>
  </div>
`;

const s10Js = `
  // "nhìn như một cái chữ D vậy, không được thuận mắt" (409.50s = 2.40s local)
  tl.to("#s10-shape-3", { opacity: 1, duration: 0.48, ease: "power2.out" }, 1.80);
  // "những bạn nào mà bị OCD nhá, nhìn kiểu cong - thẳng - cong - thẳng cực kỳ gai mắt" (413.10s = 6.00s local)
  tl.fromTo("#s10-ocd-stamp", { scale: 1.3, rotation: -10, opacity: 0 }, { scale: 1, rotation: -4, opacity: 1, duration: 0.50, ease: "back.out(1.4)" }, 5.80);
  // "Thà là iPhone Duo làm cong hẳn" (421.40s = 14.30s local)
  tl.to("#s10-shape-1", { opacity: 1, duration: 0.48, ease: "power2.out" }, 14.00);
  // "hoặc là làm vuông hẳn giống như là Galaxy Z Fold8" (422.50s = 15.40s local)
  tl.to("#s10-shape-2", { opacity: 1, duration: 0.48, ease: "power2.out" }, 15.40);
  tl.fromTo("#s10-bottom-bar", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "back.out(1.25)" }, 16.80);

  // Switch to Phase B at 19.20s (426.30s global: "Và với cái thiết kế như thế này nha, nếu anh em cầm bằng tay phải...")
  tl.to("#s10-full-layer", { opacity: 0, duration: 0.35, ease: "power2.inOut" }, 18.90);
  tl.to("#s10-overlay-layer", { opacity: 1, duration: 0.40, ease: "power2.out" }, 19.20);
  tl.fromTo("#s10-right-palm", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 21.00);
  // "nhưng chỉ cần chuyển sang tay trái một phát thôi là nó có vấn đề ngay, bị cấn, bị đè vào lòng bàn tay!" (435.74s = 28.64s local)
  tl.fromTo("#s10-left-palm", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 28.40);
`;

writeFileSync(join(compDir, 'scene-10.html'), wrapSubComp('scene-10', s10Css, s10Html, s10Js));

// ============================================================================
// SCENE 11 (459.00s - 530.40s, dur 71.40s):
// Nút Âm lượng đưa lên đỉnh máy (trượt 1 tay dễ rơi máy 65Tr) & Vân tay nút nguồn "rất ngu, rườm rà"
// Phase A (0.00s - 25.00s / 459.00s - 484.00s): A-roll/B-roll Intro Overlay (Top Volume Button)
// Phase B (25.00s - 50.83s / 484.00s - 509.83s): 100% FULL-SCREEN MOTION GRAPHICS (Drop-Hazard & Touch ID Pipeline)
// Phase C (50.83s - 71.40s / 509.83s - 530.40s): B-roll Close-up Side Buttons + Camera Control Overlay
// ============================================================================
const s11Css = `
  #s11-intro-layer {
    position: absolute;
    inset: 0;
    z-index: 5;
  }
  #s11-full-layer {
    position: absolute;
    inset: 0;
    z-index: 6;
    opacity: 0;
    pointer-events: none;
  }
  #s11-grid {
    position: absolute;
    top: 185px;
    left: 64px;
    right: 64px;
    height: 790px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 36px;
  }
  .s11-panel {
    padding: 26px 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  #s11-overlay-layer {
    position: absolute;
    inset: 0;
    z-index: 8;
    opacity: 0;
    pointer-events: none;
  }
`;

const s11Html = `
  <!-- PHASE A: A-ROLL + B-ROLL INTRO OVERLAY (0.00s - 25.00s = 459.00s - 484.00s) -->
  <div id="s11-intro-layer">
    <div style="position:absolute;top:48px;left:48px;width:540px;display:flex;flex-direction:column;gap:14px;">
      <div class="cm-kicker">ĐIỂM CHÊ THIẾT KẾ #02 // VỊ TRÍ PHÍM BẤM</div>
      <div id="s11-intro-c1" class="cm-card-pink cm-shadow-featured" style="padding:18px 22px;opacity:0;">
        <div class="cm-mono-dark-pill">THAY ĐỔI KHÓ HIỂU</div>
        <div class="cm-head" style="font-size:30px;margin-top:6px;">NÚT ÂM LƯỢNG ĐƯA LÊN ĐỈNH ĐẦU! ✕</div>
        <div class="cm-body" style="font-size:19px;margin-top:4px;">Không còn nằm ở cạnh bên như thói quen sử dụng thông thường.</div>
      </div>
      <div id="s11-intro-c2" class="cm-card-yellow cm-shadow-ink" style="padding:18px 22px;opacity:0;">
        <div class="cm-mono" style="font-size:16px;">BẤT TIỆN KHI THAO TÁC</div>
        <div class="cm-head" style="font-size:26px;margin-top:4px;">PHẢI MÒ TÌM MẤT THỜI GIAN · ÉP CẦM 2 TAY ĐỂ ẤN!</div>
      </div>
    </div>
  </div>

  <!-- PHASE B: 100% FULL-SCREEN MOTION GRAPHICS (25.00s - 50.83s = 484.00s - 509.83s) -->
  <div id="s11-full-layer">
    <div class="cm-full-ground"></div>
    <div class="cm-corner tl"></div>
    <div class="cm-corner tr"></div>
    <div class="cm-corner bl"></div>
    <div class="cm-corner br"></div>

    <div style="position:absolute;top:44px;left:64px;right:64px;display:flex;justify-content:space-between;align-items:flex-start;">
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div class="cm-kicker">ĐIỂM CHÊ THIẾT KẾ #02 // BỐ TRÍ PHÍM BẤM VẬT LÝ BẤT HỢP LÝ</div>
        <div class="cm-head" style="font-size:46px;">ÂM LƯỢNG TRÊN ĐỈNH DỄ TUỘT RƠI · VÂN TAY RƯỜM RÀ!</div>
      </div>
      <div id="s11-badge-65tr" class="cm-badge-rot" style="opacity:0;">
        <div class="cm-mono" style="font-size:16px;">RỦI RO VA ĐẬP</div>
        <div class="cm-head" style="font-size:28px;">MÁY GẬP 65 TRIỆU!</div>
      </div>
    </div>

    <div id="s11-grid">
      <!-- Left Panel: Top-Edge Volume Drop Hazard -->
      <div id="s11-panel-vol" class="s11-panel cm-card-cream cm-shadow-featured" style="opacity:0;">
        <div>
          <div class="cm-mono" style="font-size:18px;color:#E85A1F;">BẤT CẬP 01 // NÚT TĂNG GIẢM ÂM LƯỢNG ĐƯA LÊN ĐỈNH ĐẦU</div>
          <div class="cm-head" style="font-size:34px;margin-top:6px;">TRƯỢT MÁY BẰNG 1 TAY RẤT DỄ TUỘT RƠI XUỐNG ĐẤT! ✕</div>
        </div>

        <svg viewBox="0 0 760 460" width="100%" height="460" fill="none">
          <rect x="12" y="12" width="736" height="436" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="4"/>
          <!-- Phone Body sliding down -->
          <g id="s11-phone-drop">
            <rect x="240" y="65" width="240" height="310" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="6"/>
            <!-- Top Volume Buttons -->
            <rect x="275" y="47" width="52" height="18" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>
            <rect x="340" y="47" width="52" height="18" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>
            <text x="333" y="36" text-anchor="middle" fill="#E85A1F" font-family="JetBrains Mono" font-size="16" font-weight="800">ÂM LƯỢNG TRÊN ĐỈNH (+/-)</text>
            <text x="360" y="210" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="18.5" font-weight="900">PHẢI TRƯỢT MÁY XUỐNG</text>
            <text x="360" y="242" text-anchor="middle" fill="#E85A1F" font-family="Be Vietnam Pro" font-size="17.5" font-weight="800">ĐỂ NGÓN TRỎ VỚI TỚI!</text>
          </g>
          <!-- Downward Gravity & Slip Arrows -->
          <path d="M 160 120 L 160 360" stroke="#E85A1F" stroke-width="8" stroke-dasharray="14 8"/>
          <polygon points="160,380 142,348 178,348" fill="#E85A1F"/>
          <g id="s11-drop-alert" opacity="0">
            <rect x="515" y="150" width="205" height="160" fill="#F06CA8" stroke="#0F0F0F" stroke-width="4"/>
            <text x="617" y="195" text-anchor="middle" fill="#0F0F0F" font-family="JetBrains Mono" font-size="16" font-weight="800">MẤT TRỌNG TÂM</text>
            <text x="617" y="235" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="26" font-weight="900">TUỘT KHỎI TAY</text>
            <text x="617" y="270" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="24" font-weight="900">RƠI XUỐNG ĐẤT!</text>
          </g>
        </svg>

        <div class="cm-mono-dark-pill">MÒ TÌM MẤT THỜI GIAN · ÉP PHẢI DÙNG CẢ 2 TAY ĐỂ BẤM</div>
      </div>

      <!-- Right Panel: Side Button Touch ID & Camera Control -->
      <div id="s11-panel-touch" class="s11-panel cm-card-pink cm-shadow-ink" style="opacity:0;">
        <div>
          <div class="cm-mono-dark-pill">BẤT CẬP 02 // CẠNH BÊN ĐẶT NÚT NGUỒN + CAMERA CONTROL</div>
          <div class="cm-head" style="font-size:34px;margin-top:6px;">CẢM BIẾN VÂN TAY "RẤT NGU" &amp; HIỆU ỨNG RƯỜM RÀ! ✕</div>
        </div>

        <svg viewBox="0 0 760 460" width="100%" height="460" fill="none">
          <rect x="12" y="12" width="736" height="436" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
          <!-- 3-Step Rườm Rà Pipeline -->
          <rect x="45" y="75" width="195" height="160" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
          <text x="142" y="115" text-anchor="middle" fill="#0F0F0F" font-family="JetBrains Mono" font-size="16" font-weight="800">BƯỚC 01</text>
          <text x="142" y="158" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="24" font-weight="900">CHẠM VÂN TAY</text>
          <text x="142" y="190" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="18" font-weight="700">Nút nguồn cạnh phải</text>

          <line x1="240" y1="155" x2="285" y2="155" stroke="#0F0F0F" stroke-width="6"/>

          <rect x="285" y="75" width="195" height="160" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>
          <text x="382" y="115" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono" font-size="16" font-weight="800">BƯỚC 02</text>
          <text x="382" y="158" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="24" font-weight="900">HIỆU ỨNG CHỜ</text>
          <text x="382" y="190" text-anchor="middle" fill="#EFE9D9" font-family="Be Vietnam Pro" font-size="18" font-weight="700">Quá rườm rà nhiều bước</text>

          <line x1="480" y1="155" x2="525" y2="155" stroke="#0F0F0F" stroke-width="6"/>

          <rect x="525" y="75" width="190" height="160" fill="#0F0F0F" stroke="#0F0F0F" stroke-width="4"/>
          <text x="620" y="115" text-anchor="middle" fill="#F5C518" font-family="JetBrains Mono" font-size="16" font-weight="800">BƯỚC 03</text>
          <text x="620" y="158" text-anchor="middle" fill="#EFE9D9" font-family="Be Vietnam Pro" font-size="24" font-weight="900">MỚI VÀO MÀN</text>
          <text x="620" y="190" text-anchor="middle" fill="#F06CA8" font-family="Be Vietnam Pro" font-size="18" font-weight="700">Mất thời gian thao tác</text>

          <!-- Bottom Comparison Box -->
          <rect x="45" y="275" width="670" height="135" fill="#136636" stroke="#0F0F0F" stroke-width="4"/>
          <text x="380" y="325" text-anchor="middle" fill="#F5C518" font-family="JetBrains Mono" font-size="18" font-weight="800">GIẢI PHÁP HỢP LÝ HƠN CHO CẠNH BÊN:</text>
          <text x="380" y="370" text-anchor="middle" fill="#EFE9D9" font-family="Be Vietnam Pro" font-size="17.5" font-weight="900">BỎ CAMERA CONTROL · ĐƯA PHÍM ÂM LƯỢNG XUỐNG CẠNH BÊN! ✓</text>
        </svg>

        <div class="cm-mono-dark-pill">NÚT CAMERA CONTROL CHIẾM MẤT VỊ TRÍ ĐẸP NHẤT TRÊN CẠNH MÁY</div>
      </div>
    </div>
  </div>

  <!-- PHASE C: B-ROLL CLOSE-UP SIDE BUTTONS OVERLAY (44.60s - 60.90s = 490.80s - 507.10s) -->
  <div id="s11-overlay-layer">
    <div style="position:absolute;top:48px;left:48px;width:540px;display:flex;flex-direction:column;gap:14px;">
      <div class="cm-kicker">CẬN CẢNH CẠNH BÊN // NÚT NGUỒN VÂN TAY</div>
      <div id="s11-ov-c1" class="cm-card-cream cm-shadow-featured" style="padding:18px 22px;opacity:0;">
        <div class="cm-mono" style="font-size:16px;color:#E85A1F;">NÚT ĐẦU TIÊN TRÊN CẠNH PHẢI</div>
        <div class="cm-head" style="font-size:28px;margin-top:4px;">1. NÚT NGUỒN TÍCH HỢP CẢM BIẾN VÂN TAY</div>
      </div>
      <div id="s11-ov-c2" class="cm-card-pink cm-shadow-ink" style="padding:18px 22px;opacity:0;">
        <div class="cm-mono-dark-pill">NHƯỢC ĐIỂM MỞ KHÓA</div>
        <div class="cm-head" style="font-size:28px;margin-top:6px;">HIỆU ỨNG QUÁ RƯỜM RÀ · MẤT NHIỀU BƯỚC ĐỂ VÀO MÀN CHÍNH! ✕</div>
      </div>
    </div>
  </div>
`;

const s11Js = `
  // Phase A (0.00s - 23.80s = 446.20s - 470.00s): A-roll/B-roll Intro
  // "nút tăng giảm âm lượng lại đưa lên đỉnh đầu" (448.58s = 2.38s local)
  tl.fromTo("#s11-intro-c1", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 2.20);
  // "phải đi mò nút... phải dùng cả hai tay" (459.90s = 13.70s local)
  tl.fromTo("#s11-intro-c2", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 13.50);

  // Switch to Phase B (100% Motion) at 23.80s (470.00s global: "Ví dụ anh em sử dụng bằng một tay đi...")
  tl.to("#s11-intro-layer", { opacity: 0, duration: 0.30 }, 23.50);
  tl.to("#s11-full-layer", { opacity: 1, duration: 0.38, ease: "power2.out" }, 23.80);
  tl.fromTo("#s11-panel-vol", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 24.20);
  // "lại phải trượt con iPhone xuống" (475.46s = 29.26s local)
  tl.to("#s11-phone-drop", { y: 42, rotation: 6, duration: 0.70, ease: "bounce.out" }, 29.20);
  // "rất dễ bị trơn tuột ra khỏi lòng bàn tay và rơi xuống dưới đất" (484.44s = 38.24s local)
  tl.to("#s11-drop-alert", { opacity: 1, duration: 0.40, ease: "power2.out" }, 38.00);
  // "chiếc điện thoại gập 65 triệu" (489.72s = 43.52s local)
  tl.fromTo("#s11-badge-65tr", { scale: 1.25, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.48, ease: "back.out(1.4)" }, 43.20);

  // Switch to Phase C (B-roll Close-up Side Buttons) at 44.60s (490.80s global: "Trong khi đó phần cạnh bên lại là nơi để 2 nút...")
  tl.to("#s11-full-layer", { opacity: 0, duration: 0.35, ease: "power2.inOut" }, 44.30);
  tl.to("#s11-overlay-layer", { opacity: 1, duration: 0.40, ease: "power2.out" }, 44.60);
  // "Một là nút nguồn tích hợp cảm biến vân tay" (494.80s = 48.60s local)
  tl.fromTo("#s11-ov-c1", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 48.20);
  // "tuy nhiên thao tác và hiệu ứng quá rườm rà, mất quá nhiều bước" (501.30s = 55.10s local)
  tl.fromTo("#s11-ov-c2", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 55.00);
`;

writeFileSync(join(compDir, 'scene-11.html'), wrapSubComp('scene-11', s11Css, s11Html, s11Js));

// ============================================================================
// SCENE 12 (530.40s - 603.57s, dur 73.17s):
// Nút Camera Control bị cắt giảm cảm ứng lực/zoom & Không có khay SIM vật lý (100% 2 eSIM)
// - 0.00s - 15.87s (530.40s - 546.27s): B-roll Camera Control Overlay
// - 15.87s - 30.73s (546.27s - 561.13s): 100% Motion Graphics (Camera Control Feature Stripper)
// - 30.73s - 37.97s (561.13s - 568.37s): B-roll Side Edge Overlay
// - 37.97s - 52.13s (568.37s - 582.53s): 100% Motion Graphics (SIM Tray X-Ray: 0 Physical SIM vs 2 eSIM)
// - 52.13s - 73.17s (582.53s - 603.57s): B-roll Closing Stamp Overlay
// ============================================================================
const s12Css = `
  .s12-layer {
    position: absolute;
    inset: 0;
  }
  #s12-broll-1 { z-index: 6; }
  #s12-full-cam { z-index: 7; opacity: 0; pointer-events: none; }
  #s12-broll-mid { z-index: 8; opacity: 0; pointer-events: none; }
  #s12-full-sim { z-index: 9; opacity: 0; pointer-events: none; }
  #s12-broll-2 { z-index: 10; opacity: 0; pointer-events: none; }
`;

const s12Html = `
  <!-- LAYER 1: B-ROLL CAMERA CONTROL OVERLAY (0.00s - 31.10s = 507.10s - 538.20s) -->
  <div id="s12-broll-1" class="s12-layer">
    <div style="position:absolute;top:48px;left:48px;width:540px;display:flex;flex-direction:column;gap:14px;">
      <div class="cm-kicker">NÚT THỨ 2 CẠNH PHẢI // CAMERA CONTROL</div>
      <div id="s12-intro-card" class="cm-card-pink cm-shadow-ink" style="padding:18px 22px;opacity:0;">
        <div class="cm-mono-dark-pill">CHIẾM DIỆN TÍCH CẠNH BÊN</div>
        <div class="cm-head" style="font-size:26px;margin-top:6px;">LẼ RA NÊN ĐẶT PHÍM NGUỒN DƯỚI + PHÍM ÂM LƯỢNG TRÊN!</div>
      </div>
      <div id="s12-fn-box" class="cm-card-cream cm-shadow-featured" style="padding:18px 22px;opacity:0;">
        <div class="cm-mono" style="font-size:16px;">CHỈ CÓ ĐÚNG 3 CHỨC NĂNG CƠ BẢN</div>
        <div id="s12-fn1" class="cm-head" style="font-size:25px;margin-top:8px;opacity:0;">1. ẤN MỞ GIAO DIỆN CAMERA</div>
        <div id="s12-fn2" class="cm-head" style="font-size:25px;margin-top:6px;opacity:0;">2. ẤN THÊM PHÁT ĐỂ CHỤP ẢNH</div>
        <div id="s12-fn3" class="cm-head" style="font-size:25px;color:#136636;margin-top:6px;opacity:0;">3. ẤN GIỮ MỞ VISUAL INTELLIGENCE</div>
      </div>
    </div>
  </div>

  <!-- LAYER 2: 100% MOTION GRAPHICS - CAMERA CONTROL STRIPPER (15.87s - 30.73s) -->
  <div id="s12-full-cam" class="s12-layer">
    <div class="cm-full-ground"></div>
    <div class="cm-corner tl"></div>
    <div class="cm-corner tr"></div>
    <div class="cm-corner bl"></div>
    <div class="cm-corner br"></div>

    <div style="position:absolute;top:44px;left:64px;right:64px;display:flex;justify-content:space-between;align-items:flex-start;">
      <div>
        <div class="cm-kicker">SO SÁNH PHẦN CỨNG // CAMERA CONTROL BỊ CẮT GIẢM</div>
        <div class="cm-head" style="font-size:46px;margin-top:10px;">KHÔNG CÓ CẢM ỨNG LỰC · KHÔNG VUỐT ZOOM ĐƯỢC! ✕</div>
      </div>
      <div id="s12-cam-stamp" class="cm-stamp-rot" style="opacity:0;">
        <div class="cm-head" style="font-size:28px;">"THÀ VỨT ĐI CÒN HƠN!"</div>
      </div>
    </div>

    <div class="cm-card-cream cm-shadow-featured" style="position:absolute;top:200px;left:64px;width:1792px;height:780px;padding:30px 38px;">
      <svg viewBox="0 0 1700 680" width="100%" height="680" fill="none">
        <!-- Left Box: iPhone 18 / 18 Pro Camera Control -->
        <g id="s12-cam-left" opacity="0">
          <rect x="20" y="20" width="800" height="630" fill="#136636" stroke="#0F0F0F" stroke-width="5"/>
          <rect x="50" y="45" width="460" height="44" fill="#0F0F0F"/>
          <text x="280" y="74" text-anchor="middle" fill="#F5C518" font-family="JetBrains Mono" font-size="20" font-weight="800">TRÊN IPHONE 18 / IPHONE 18 PRO</text>
          <text x="420" y="145" text-anchor="middle" fill="#EFE9D9" font-family="Be Vietnam Pro" font-size="36" font-weight="900">ĐẦY ĐỦ CẢM ỨNG LỰC &amp; VUỐT ZOOM ✓</text>
          <rect x="80" y="195" width="680" height="110" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
          <text x="420" y="260" text-anchor="middle" fill="#136636" font-family="Be Vietnam Pro" font-size="30" font-weight="900">✓ VUỐT TRƯỢT ĐỂ ZOOM ỐNG KÍNH</text>
          <rect x="80" y="335" width="680" height="110" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
          <text x="420" y="400" text-anchor="middle" fill="#136636" font-family="Be Vietnam Pro" font-size="30" font-weight="900">✓ ẤN NHẸ CHỌN THÔNG SỐ CAMERA</text>
          <rect x="80" y="475" width="680" height="110" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
          <text x="420" y="540" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="30" font-weight="900">✓ CHỤP ẢNH &amp; VISUAL INTELLIGENCE</text>
        </g>

        <!-- Right Box: iPhone Duo Camera Control -->
        <g id="s12-cam-right-base" opacity="0">
          <rect x="880" y="20" width="800" height="630" fill="#F06CA8" stroke="#0F0F0F" stroke-width="5"/>
          <rect x="910" y="45" width="460" height="44" fill="#0F0F0F"/>
          <text x="1140" y="74" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono" font-size="20" font-weight="800">TRÊN IPHONE DUO (65 TRIỆU)</text>
          <text x="1280" y="145" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="36" font-weight="900">CẮT SẠCH CẢM ỨNG LỰC! ✕</text>
        </g>
        <g id="s12-cam-nozoom" opacity="0">
          <rect x="940" y="195" width="680" height="110" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="4"/>
          <text x="1280" y="260" text-anchor="middle" fill="#E85A1F" font-family="Be Vietnam Pro" font-size="30" font-weight="900">✕ KHÔNG THỂ VUỐT ZOOM ĐƯỢC</text>
        </g>
        <g id="s12-cam-noui" opacity="0">
          <rect x="940" y="335" width="680" height="110" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="4"/>
          <text x="1280" y="400" text-anchor="middle" fill="#E85A1F" font-family="Be Vietnam Pro" font-size="30" font-weight="900">✕ KHÔNG CHỈNH ĐƯỢC GIAO DIỆN CAM</text>
        </g>
        <g id="s12-cam-useless" opacity="0">
          <rect x="940" y="475" width="680" height="110" fill="#0F0F0F" stroke="#0F0F0F" stroke-width="4"/>
          <text x="1280" y="540" text-anchor="middle" fill="#F5C518" font-family="Be Vietnam Pro" font-size="28" font-weight="900">CHỈ BẤM CƠ HỌC ĐƠN THUẦN · VÔ DỤNG!</text>
        </g>
      </svg>
    </div>
  </div>

  <!-- LAYER 2.5: B-ROLL SIDE EDGE OVERLAY (30.73s - 37.97s) -->
  <div id="s12-broll-mid" class="s12-layer">
    <div style="position:absolute;top:48px;left:48px;width:540px;">
      <div id="s12-mid-card" class="cm-card-pink cm-shadow-featured" style="padding:18px 22px;opacity:0;">
        <div class="cm-mono-dark-pill">ĐIỂM CHÊ TIẾP THEO // CẠNH MÁY</div>
        <div class="cm-head" style="font-size:28px;margin-top:6px;">HOÀN TOÀN KHÔNG CÓ KHAY SIM VẬT LÝ! ✕</div>
      </div>
    </div>
  </div>

  <!-- LAYER 3: 100% MOTION GRAPHICS - SIM TRAY X-RAY (37.97s - 52.13s) -->
  <div id="s12-full-sim" class="s12-layer">
    <div class="cm-full-ground"></div>
    <div class="cm-corner tl"></div>
    <div class="cm-corner tr"></div>
    <div class="cm-corner bl"></div>
    <div class="cm-corner br"></div>

    <div style="position:absolute;top:44px;left:64px;right:64px;display:flex;justify-content:space-between;align-items:flex-start;">
      <div>
        <div class="cm-kicker">ĐIỂM CHÊ THIẾT KẾ #03 // LOẠI BỎ KHAY SIM VẬT LÝ</div>
        <div class="cm-head" style="font-size:46px;margin-top:10px;" data-var-text="s12_esim_head">KHÔNG CÓ KHAY SIM VẬT LÝ · BẮT BUỘC 100% DÙNG 2 eSIM! ✕</div>
      </div>
    </div>

    <div class="cm-card-cream cm-shadow-featured" style="position:absolute;top:200px;left:64px;width:1792px;height:780px;padding:32px 40px;">
      <svg viewBox="0 0 1700 680" width="100%" height="680" fill="none">
        <!-- Left: Physical SIM Crossed Out -->
        <g id="s12-sim-left" opacity="0">
          <rect x="30" y="25" width="790" height="630" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
          <text x="425" y="90" text-anchor="middle" fill="#E85A1F" font-family="Be Vietnam Pro" font-size="34" font-weight="900">0 KHAY SIM VẬT LÝ TRÊN MÁY ✕</text>
          <!-- Giant SIM Card Vector -->
          <polygon points="280,150 520,150 580,210 580,470 280,470" fill="#F5C518" stroke="#0F0F0F" stroke-width="6"/>
          <rect x="335" y="245" width="190" height="160" rx="12" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
          <line x1="230" y1="130" x2="630" y2="490" stroke="#E85A1F" stroke-width="16"/>
          <line x1="630" y1="130" x2="230" y2="490" stroke="#E85A1F" stroke-width="16"/>
          <rect x="80" y="520" width="690" height="90" fill="#0F0F0F"/>
          <text x="425" y="573" text-anchor="middle" fill="#EFE9D9" font-family="Be Vietnam Pro" font-size="22" font-weight="800">Không thể rút SIM Data đổi nhanh qua lại giữa các máy!</text>
        </g>

        <!-- Right: Mandatory Dual eSIM -->
        <g id="s12-sim-right1" opacity="0">
          <rect x="880" y="25" width="790" height="630" fill="#F06CA8" stroke="#0F0F0F" stroke-width="5"/>
          <text x="1275" y="90" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="34" font-weight="900">DÙNG 2 SIM = BẮT BUỘC 2 eSIM 100%</text>
          <rect x="960" y="150" width="630" height="150" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
          <text x="1275" y="215" text-anchor="middle" fill="#136636" font-family="Be Vietnam Pro" font-size="28" font-weight="900">NHU CẦU PHỔ BIẾN TẠI VIỆT NAM:</text>
          <text x="1275" y="260" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="26" font-weight="800">1 eSIM chính + 1 SIM Vật lý (Data / Đổi thiết bị)</text>
        </g>

        <g id="s12-sim-right2" opacity="0">
          <rect x="960" y="340" width="630" height="270" fill="#E85A1F" stroke="#0F0F0F" stroke-width="5"/>
          <text x="1275" y="415" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono" font-size="22" font-weight="800">ĐIỂM TRỪ LỚN TẠI THỊ TRƯỜNG VIỆT NAM</text>
          <text x="1275" y="475" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="34" font-weight="900">BẤT TIỆN KHI ĐỔI MÁY PHỤ</text>
          <text x="1275" y="525" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="34" font-weight="900">&amp; DÙNG SIM DATA DU LỊCH! ✕</text>
        </g>
      </svg>
    </div>
  </div>

  <!-- LAYER 4: B-ROLL CLOSING SIM OVERLAY (52.13s - 73.17s) -->
  <div id="s12-broll-2" class="s12-layer">
    <div style="position:absolute;bottom:52px;left:48px;width:620px;">
      <div class="cm-card-yellow cm-shadow-featured" style="padding:20px 26px;">
        <div class="cm-mono" style="font-size:17px;">TỔNG KẾT THIẾT KẾ &amp; CỔNG KẾT NỐI</div>
        <div class="cm-head" style="font-size:30px;margin-top:4px;">0 KHAY SIM VẬT LÝ · BẮT BUỘC DÙNG 2 eSIM TẠI VIỆT NAM! ✕</div>
      </div>
    </div>
  </div>
`;

const s12Js = `
  // Phase A (0.00s - 31.10s = 507.10s - 538.20s): Camera Control intro & 3 functions
  // "Còn cái nút thứ hai đó chính là nút Camera Control... lẽ ra nên đưa phím nguồn phía dưới và phím âm lượng lên trên" (507.14s - 522.82s)
  tl.fromTo("#s12-intro-card", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 1.20);
  // "Trong khi đó phím Camera Control này chỉ có 3 chức năng thôi" (523.22s = 16.12s local)
  tl.fromTo("#s12-fn-box", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 16.10);
  // "1 là ấn vào mở camera (526.42s = 19.32s), 2 là ấn thêm phát nữa để chụp ảnh (528.40s = 21.30s), ấn giữ mở Visual Intelligence (530.36s = 23.26s)"
  tl.fromTo("#s12-fn1", { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42, ease: "power2.out" }, 19.30);
  tl.fromTo("#s12-fn2", { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42, ease: "power2.out" }, 21.30);
  tl.fromTo("#s12-fn3", { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42, ease: "power2.out" }, 23.30);

  // Phase B (31.10s - 61.30s = 538.20s - 568.40s): Full Motion Camera Control Stripper
  // "Hết! Nó sẽ không có tính năng cảm ứng lực giống như trên iPhone 18 hay iPhone 18 Pro" (538.24s = 31.14s local)
  tl.to("#s12-broll-1", { opacity: 0, duration: 0.30 }, 30.80);
  tl.to("#s12-full-cam", { opacity: 1, duration: 0.38, ease: "power2.out" }, 31.10);
  tl.to(["#s12-cam-left", "#s12-cam-right-base"], { opacity: 1, duration: 0.45, ease: "power2.out" }, 31.50);
  // "không thể nào zoom được" (546.62s = 39.52s local)
  tl.to("#s12-cam-nozoom", { opacity: 1, duration: 0.42, ease: "power2.out" }, 39.30);
  // "không thể nào ấn chạm để sử dụng tính năng trong giao diện camera" (548.80s = 41.70s local)
  tl.to("#s12-cam-noui", { opacity: 1, duration: 0.42, ease: "power2.out" }, 41.50);
  // "thôi thà vứt mẹ nó đi" (559.94s = 52.84s local)
  tl.to("#s12-cam-useless", { opacity: 1, duration: 0.42, ease: "power2.out" }, 52.40);
  tl.fromTo("#s12-cam-stamp", { scale: 1.25, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.48, ease: "back.out(1.4)" }, 52.70);

  // Phase C (61.30s - 92.20s = 568.40s - 599.30s): Full Motion SIM X-Ray
  // "Rồi, thêm một điểm nữa mà tôi không thích... không có khay SIM vật lý" (568.46s = 61.36s local)
  tl.to("#s12-full-cam", { opacity: 0, duration: 0.30 }, 61.00);
  tl.to("#s12-full-sim", { opacity: 1, duration: 0.38, ease: "power2.out" }, 61.30);
  tl.to("#s12-sim-left", { opacity: 1, duration: 0.45, ease: "power2.out" }, 65.00);
  // "nếu sử dụng 2 SIM 2 sóng thì 100% đều phải sử dụng 2 eSIM" (577.46s = 70.36s local)
  tl.to("#s12-sim-right1", { opacity: 1, duration: 0.45, ease: "power2.out" }, 70.20);
  // "điểm trừ tại thị trường Việt Nam" (583.56s = 76.46s local)
  tl.to("#s12-sim-right2", { opacity: 1, duration: 0.45, ease: "power2.out" }, 76.20);
`;

writeFileSync(join(compDir, 'scene-12.html'), wrapSubComp('scene-12', s12Css, s12Html, s12Js));

// ============================================================================
// SCENE 13 (603.57s - 698.37s, dur 94.80s):
// Màn hình ngoài 5.4" 120Hz: Hiển thị đẹp nhưng Camera trước + Thanh trạng thái dọc bên phải quá to
// - 0.00s - 34.46s (603.57s - 638.03s): B-roll + A-roll Spec & Cutout Alert Overlay
// - 34.46s - 53.70s (638.03s - 657.27s): 100% Motion Graphics (Screen Occlusion X-Ray Comparison)
// - 53.70s - 94.80s (657.27s - 698.37s): Close-up & Top-down B-roll Content Intrusion Overlay
// ============================================================================
const s13Css = `
  .s13-layer { position: absolute; inset: 0; }
  #s13-broll-a { z-index: 6; }
  #s13-full-xray { z-index: 7; opacity: 0; pointer-events: none; }
  #s13-broll-b { z-index: 8; opacity: 0; pointer-events: none; }
`;

const s13Html = `
  <!-- PHASE A: B-ROLL SPEC & CAMERA CUTOUT OVERLAY (0.00s - 34.46s) -->
  <div id="s13-broll-a" class="s13-layer">
    <div style="position:absolute;top:48px;left:48px;width:540px;display:flex;flex-direction:column;gap:14px;">
      <div class="cm-kicker">MÀN HÌNH NGOÀI // 5.4 INCH · 120HZ</div>
      <div id="s13-praise-card" class="cm-card-green cm-shadow-ink" style="padding:18px 22px;">
        <div class="cm-mono-dark-pill">CHẤT LƯỢNG HIỂN THỊ</div>
        <div class="cm-head" style="font-size:30px;color:#EFE9D9;margin-top:6px;">5.4 INCH · 120HZ · MÀU SẮC &amp; ĐỘ CHI TIẾT CỰC ĐẸP ✓</div>
      </div>
      <div id="s13-crit-card" class="cm-card-orange cm-shadow-featured" style="padding:20px 22px;opacity:0;">
        <div class="cm-mono-dark-pill">ĐIỂM CHÊ LỚN NHẤT</div>
        <div class="cm-head" style="font-size:30px;margin-top:6px;">CAMERA TRƯỚC QUÁ TO + DỒN THANH TRẠNG THÁI DỌC BÊN PHẢI! ✕</div>
      </div>
    </div>
  </div>

  <!-- PHASE B: 100% MOTION GRAPHICS - SCREEN OCCLUSION X-RAY (34.46s - 53.70s) -->
  <div id="s13-full-xray" class="s13-layer">
    <div class="cm-full-ground"></div>
    <div class="cm-corner tl"></div>
    <div class="cm-corner tr"></div>
    <div class="cm-corner bl"></div>
    <div class="cm-corner br"></div>

    <div style="position:absolute;top:44px;left:64px;right:64px;display:flex;justify-content:space-between;align-items:flex-start;">
      <div>
        <div class="cm-kicker">MẶT CẮT KHÔNG GIAN HIỂN THỊ // CAMERA TRƯỚC &amp; THANH TRẠNG THÁI</div>
        <div class="cm-head" style="font-size:44px;margin-top:10px;">CỤM CAMERA + CỘT SÓNG/PIN XẾP DỌC CHIẾM TRỌN CẠNH PHẢI!</div>
      </div>
    </div>

    <div class="cm-card-cream cm-shadow-featured" style="position:absolute;top:195px;left:64px;width:1792px;height:790px;padding:28px 36px;">
      <svg viewBox="0 0 1700 700" width="100%" height="700" fill="none">
        <!-- Left: Standard Smartphone -->
        <g id="s13-xray-left" opacity="0">
          <rect x="30" y="20" width="780" height="650" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
          <text x="420" y="75" text-anchor="middle" fill="#136636" font-family="Be Vietnam Pro" font-size="32" font-weight="900">ĐIỆN THOẠI THÔNG THƯỜNG ✓</text>
          <rect x="190" y="110" width="460" height="460" rx="28" fill="#EFE9D9" stroke="#136636" stroke-width="7"/>
          <!-- Tiny Punch-hole -->
          <circle cx="420" cy="140" r="11" fill="#0F0F0F"/>
          <text x="420" y="330" text-anchor="middle" fill="#136636" font-family="Be Vietnam Pro" font-size="28" font-weight="900">NỐT RUỒI NHỎ · ÍT HIỆU ỨNG</text>
          <text x="420" y="370" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="22" font-weight="700">Không gây mất tập trung khi xem</text>
          <rect x="110" y="595" width="620" height="50" fill="#136636"/>
          <text x="420" y="627" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono" font-size="18" font-weight="800">KHÔNG GIAN HIỂN THỊ THOẢI MÁI · LIỀN MẠCH</text>
        </g>

        <!-- Right: iPhone Duo Outer Screen -->
        <g id="s13-xray-right" opacity="0">
          <rect x="890" y="20" width="780" height="650" fill="#F06CA8" stroke="#0F0F0F" stroke-width="5"/>
          <text x="1280" y="75" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="32" font-weight="900">MÀN NGOÀI IPHONE DUO ✕</text>
          <rect x="1030" y="110" width="500" height="460" rx="28" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="7"/>
          <!-- Giant Right-Side Vertical Camera + Status Bar Strip -->
          <rect x="1435" y="122" width="82" height="436" rx="18" fill="#E85A1F" stroke="#0F0F0F" stroke-width="5"/>
          <circle cx="1476" cy="175" r="24" fill="#0F0F0F"/>
          <text x="1476" y="255" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono" font-size="16" font-weight="800">WIFI</text>
          <text x="1476" y="310" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono" font-size="16" font-weight="800">5G</text>
          <text x="1476" y="365" text-anchor="middle" fill="#F5C518" font-family="JetBrains Mono" font-size="16" font-weight="800">PIN</text>
          <text x="1235" y="310" text-anchor="middle" fill="#E85A1F" font-family="Be Vietnam Pro" font-size="28" font-weight="900">LẸM VÀO NỘI DUNG</text>
          <text x="1235" y="350" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="24" font-weight="800">VIDEO &amp; ỨNG DỤNG!</text>
          <rect x="970" y="595" width="620" height="50" fill="#0F0F0F"/>
          <text x="1280" y="627" text-anchor="middle" fill="#F5C518" font-family="JetBrains Mono" font-size="18" font-weight="800">NẰM CHÌNH ÌNH BÊN PHẢI · GÂY MẤT TẬP TRUNG ✕</text>
        </g>
      </svg>
    </div>
  </div>

  <!-- PHASE C: B-ROLL CONTENT INTRUSION OVERLAY (53.70s - 94.80s) -->
  <div id="s13-broll-b" class="s13-layer">
    <div style="position:absolute;bottom:48px;left:48px;width:580px;display:flex;flex-direction:column;gap:12px;">
      <div id="s13-b-c1" class="cm-card-pink cm-shadow-ink" style="padding:16px 22px;opacity:0;">
        <div class="cm-mono-dark-pill">KHI XEM VIDEO &amp; MỞ ỨNG DỤNG</div>
        <div class="cm-head" style="font-size:26px;margin-top:4px;">BỊ LẸM MỘT PHẦN VÀO NỘI DUNG HIỂN THỊ! ✕</div>
      </div>
      <div id="s13-b-c2" class="cm-card-cream cm-shadow-featured" style="padding:18px 24px;opacity:0;">
        <div class="cm-mono" style="font-size:16px;color:#E85A1F;">CẬN CẢNH THANH TRẠNG THÁI DỌC</div>
        <div class="cm-head" style="font-size:28px;margin-top:4px;">LUÔN NẰM CHÌNH ÌNH BÊN PHẢI · KHIẾN TRẢI NGHIỆM MẤT LIỀN MẠCH! ✕</div>
      </div>
    </div>
  </div>
`;

const s13Js = `
  // "Màn hình bên ngoài kích thước 5.4 inch, tần số quét 120Hz" (603.42s = 4.12s local)
  tl.fromTo("#s13-praise-card", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 4.20);
  // "Nhưng cái điểm mà tôi chê... camera phía trước quá to, thanh trạng thái dồn về góc phải" (626.06s = 26.76s local)
  tl.fromTo("#s13-crit-card", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 26.80);

  // Switch to Phase B (100% Motion X-Ray) at 40.90s (640.20s global: "Thông thường với những cái điện thoại khác...")
  tl.to("#s13-broll-a", { opacity: 0, duration: 0.30 }, 40.60);
  tl.to("#s13-full-xray", { opacity: 1, duration: 0.38, ease: "power2.out" }, 40.90);
  tl.to("#s13-xray-left", { opacity: 1, duration: 0.45, ease: "power2.out" }, 41.30);
  // "Nhưng với con iPhone Duo... toàn bộ thanh trạng thái cột sóng wifi pin đưa về phần camera xếp theo chiều dọc" (657.18s = 57.88s local)
  tl.to("#s13-xray-right", { opacity: 1, duration: 0.45, ease: "power2.out" }, 57.80);

  // Switch to Phase C (B-roll overlay) at 68.20s (667.50s global: "chiếm thêm diện tích, bị lẹm một phần vào bên trong nội dung")
  tl.to("#s13-full-xray", { opacity: 0, duration: 0.30 }, 67.90);
  tl.to("#s13-broll-b", { opacity: 1, duration: 0.38, ease: "power2.out" }, 68.20);
  tl.fromTo("#s13-b-c1", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.48, ease: "back.out(1.25)" }, 68.60);
  // "luôn nằm chình ình bên phải gây mất tập trung" (679.96s = 80.66s local)
  tl.fromTo("#s13-b-c2", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 80.70);
`;

writeFileSync(join(compDir, 'scene-13.html'), wrapSubComp('scene-13', s13Css, s13Html, s13Js));

// ============================================================================
// SCENE 14 (698.37s - 767.87s, dur 69.50s):
// Tỉ lệ 13:9 Màn ngoài: Xem 4:3 vừa khít, YouTube 16:9 / TikTok 9:16 viền đen, Chơi game crop 5.4" -> 4.8"
// - 0.00s - 56.23s (698.37s - 754.60s): A-roll + B-roll Aspect-Ratio Sorter Overlay
// - 56.23s - 69.50s (754.60s - 767.87s): 100% Motion Graphics (5.4" -> 4.8" Crop Data-Viz Chart)
// ============================================================================
const s14Css = `
  .s14-layer { position: absolute; inset: 0; }
  #s14-overlay { z-index: 6; }
  #s14-full-chart { z-index: 7; opacity: 0; pointer-events: none; }
`;

const s14Html = `
  <!-- PHASE A: ASPECT RATIO SORTER OVERLAY (0.00s - 56.23s) -->
  <div id="s14-overlay" class="s14-layer">
    <div style="position:absolute;top:48px;left:48px;width:540px;display:flex;flex-direction:column;gap:12px;">
      <div class="cm-kicker">TỈ LỆ MÀN NGOÀI 13:9 // PHÂN LOẠI NỘI DUNG</div>
      <div id="s14-item-43" class="cm-card-green cm-shadow-ink" style="padding:16px 20px;opacity:0;">
        <div class="cm-mono-dark-pill">NỘI DUNG 4:3 (MV SƠN TÙNG / PHIM 4:3)</div>
        <div class="cm-head" style="font-size:26px;color:#EFE9D9;margin-top:6px;">VỪA KHÍT SÁT SẦN SẠT · KHÔNG VIỀN ĐEN ✓</div>
      </div>
      <div id="s14-item-169" class="cm-card-pink cm-shadow-ink" style="padding:16px 20px;opacity:0;">
        <div class="cm-mono" style="font-size:15px;">YOUTUBE (16:9) &amp; TIKTOK (9:16)</div>
        <div class="cm-head" style="font-size:26px;margin-top:4px;">CHẮC CHẮN XUẤT HIỆN VIỀN ĐEN! ✕</div>
      </div>
      <div id="s14-item-crop" class="cm-card-orange cm-shadow-featured" style="padding:18px 20px;opacity:0;">
        <div class="cm-mono-dark-pill">KHI MỞ ỨNG DỤNG / CHƠI GAME</div>
        <div class="cm-head" style="font-size:28px;margin-top:6px;" data-var-text="s14_crop_stat">BỊ VỆT ĐEN CROP TỪ 5.4" XUỐNG CÒN 4.8"! ✕</div>
      </div>
    </div>
  </div>

  <!-- PHASE B: 100% MOTION GRAPHICS - 5.4" TO 4.8" CROP CHART (56.23s - 69.50s) -->
  <div id="s14-full-chart" class="s14-layer">
    <div class="cm-full-ground"></div>
    <div class="cm-corner tl"></div>
    <div class="cm-corner tr"></div>
    <div class="cm-corner bl"></div>
    <div class="cm-corner br"></div>

    <div style="position:absolute;top:44px;left:64px;right:64px;display:flex;justify-content:space-between;align-items:flex-start;">
      <div>
        <div class="cm-kicker">BIỂU ĐỒ HAO HỤT DIỆN TÍCH // VỆT ĐEN DỌC PHÍA CAMERA</div>
        <div class="cm-head" style="font-size:46px;margin-top:10px;">MÀN HÌNH 5.4 INCH NHƯNG VÀO GAME CHỈ CÒN 4.8 INCH!</div>
      </div>
    </div>

    <div class="cm-card-cream cm-shadow-featured" style="position:absolute;top:195px;left:64px;width:1792px;height:790px;padding:32px 40px;">
      <svg viewBox="0 0 1700 700" width="100%" height="700" fill="none">
        <!-- Left Bar: 5.4 inch Spec -->
        <g id="s14-bar-54" opacity="0">
          <rect x="120" y="90" width="560" height="500" fill="#136636" stroke="#0F0F0F" stroke-width="6"/>
          <text x="400" y="290" text-anchor="middle" fill="#EFE9D9" font-family="Archivo Black" font-size="92">5.4"</text>
          <text x="400" y="365" text-anchor="middle" fill="#F5C518" font-family="JetBrains Mono" font-size="24" font-weight="800">THÔNG SỐ TRÊN GIẤY</text>
          <text x="400" y="420" text-anchor="middle" fill="#EFE9D9" font-family="Be Vietnam Pro" font-size="26" font-weight="700">Kỳ vọng hiển thị tràn toàn bộ viền</text>
        </g>

        <!-- Arrow & Right Bar: 4.8 inch Actual + Black Strip -->
        <g id="s14-bar-48" opacity="0">
          <path d="M 730 340 L 890 340" stroke="#0F0F0F" stroke-width="10"/>
          <polygon points="910,340 875,315 875,365" fill="#E85A1F"/>

          <rect x="960" y="90" width="470" height="500" fill="#F5C518" stroke="#0F0F0F" stroke-width="6"/>
          <rect x="1430" y="90" width="140" height="500" fill="#0F0F0F" stroke="#E85A1F" stroke-width="6"/>
          <text x="1195" y="290" text-anchor="middle" fill="#0F0F0F" font-family="Archivo Black" font-size="92">4.8"</text>
          <text x="1195" y="365" text-anchor="middle" fill="#E85A1F" font-family="JetBrains Mono" font-size="24" font-weight="800">DIỆN TÍCH THỰC DÙNG</text>
          <text x="1195" y="420" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="26" font-weight="800">Khi mở ứng dụng hoặc chơi game</text>
          <text x="1500" y="330" text-anchor="middle" fill="#E85A1F" font-family="JetBrains Mono" font-size="20" font-weight="800">VỆT ĐEN</text>
          <text x="1500" y="365" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono" font-size="18" font-weight="800">BÊN PHẢI</text>
        </g>
      </svg>
    </div>
  </div>
`;

const s14Js = `
  // "xem những nội dung tỉ lệ 4:3 ví dụ như MV của Sơn Tùng... vừa khít" (704.84s = 6.54s local)
  tl.fromTo("#s14-item-43", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 6.20);
  // "xem YouTube 16:9 hoặc TikTok 9:16 chắc chắn xuất hiện viền đen" (715.94s = 17.64s local)
  tl.fromTo("#s14-item-169", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 17.60);
  // "khi mở ứng dụng trên màn ngoài... có vệt đen dọc từ camera xuống dưới" (729.98s = 31.68s local)
  tl.fromTo("#s14-item-crop", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 31.70);

  // Switch to Phase B (100% Motion Chart) at 44.50s (742.80s global: "Nhưng nếu các bạn chơi game hoặc vào ứng dụng thì màn hình bên ngoài chỉ còn crop lại khoảng 4,8 inch...")
  tl.to("#s14-overlay", { opacity: 0, duration: 0.30 }, 44.20);
  tl.to("#s14-full-chart", { opacity: 1, duration: 0.38, ease: "power2.out" }, 44.50);
  tl.to("#s14-bar-54", { opacity: 1, duration: 0.45, ease: "power2.out" }, 44.90);
  // "chỉ còn crop lại khoảng 4,8 inch mà thôi" (747.86s = 49.56s local)
  tl.to("#s14-bar-48", { opacity: 1, duration: 0.48, ease: "power2.out" }, 49.20);

  // Switch back to B-roll/A-roll overlay at 60.00s (758.30s global)
  tl.to("#s14-full-chart", { opacity: 0, duration: 0.30 }, 59.70);
  tl.to("#s14-overlay", { opacity: 1, duration: 0.38 }, 60.00);
`;

writeFileSync(join(compDir, 'scene-14.html'), wrapSubComp('scene-14', s14Css, s14Html, s14Js));

// ============================================================================
// SCENE 15 (767.87s - 909.37s, dur 141.50s):
// Màn hình trong 7.6" (14:10): Sau 7 ngày chưa tối ưu, ép cầm 2 tay & Chơi game viền đen trên/dưới lệch nhau
// - 0.00s - 90.26s (767.87s - 858.13s): B-roll + A-roll 14:10 Viewport & 2-Hand Overlay
// - 90.26s - 104.23s (858.13s - 872.10s): 100% Motion Graphics (Game Compatibility Conveyor)
// - 104.23s - 141.50s (872.10s - 909.37s): Gaming B-roll + Asymmetric Black-Bar Caliper Overlay
// ============================================================================
const s15Css = `
  .s15-layer { position: absolute; inset: 0; }
  #s15-broll-1 { z-index: 6; }
  #s15-full-conveyor { z-index: 7; opacity: 0; pointer-events: none; }
  #s15-broll-game { z-index: 8; opacity: 0; pointer-events: none; }
`;

const s15Html = `
  <!-- PHASE A: 7.6" 14:10 & 2-HAND OVERLAY (0.00s - 88.00s) -->
  <div id="s15-broll-1" class="s15-layer">
    <div style="position:absolute;top:48px;left:48px;width:545px;display:flex;flex-direction:column;gap:12px;">
      <div class="cm-kicker">MÀN HÌNH TRONG // 7.6 INCH · TỈ LỆ 14:10</div>
      <div id="s15-c1" class="cm-card-cream cm-shadow-featured" style="padding:16px 20px;opacity:0;">
        <div class="cm-mono" style="font-size:16px;">SO SÁNH TỈ LỆ HIỂN THỊ</div>
        <div class="cm-head" style="font-size:26px;margin-top:4px;">4:3 TỐT NHẤT · YOUTUBE 16:9 &amp; TIKTOK XOAY DỌC VẪN VIỀN ĐEN! ✕</div>
      </div>
      <div id="s15-c2" class="cm-card-yellow cm-shadow-ink" style="padding:16px 20px;opacity:0;">
        <div class="cm-mono" style="font-size:16px;">SAU 7 NGÀY RA MẮT</div>
        <div class="cm-head" style="font-size:26px;margin-top:4px;">ỨNG DỤNG CHƯA ĐƯỢC TỐI ƯU 100% CHO KHUNG HÌNH!</div>
      </div>
      <div id="s15-c3" class="cm-card-pink cm-shadow-ink" style="padding:16px 20px;opacity:0;">
        <div class="cm-mono" style="font-size:16px;">KẾT LUẬN THAO TÁC</div>
        <div class="cm-head" style="font-size:26px;margin-top:4px;">APPLE TẠO RA MÁY ĐỂ BẮT BUỘC CẦM BẰNG CẢ 2 TAY!</div>
      </div>
    </div>
  </div>

  <!-- PHASE B: 100% MOTION GRAPHICS - GAME CONVEYOR (88.00s - 106.50s) -->
  <div id="s15-full-conveyor" class="s15-layer">
    <div class="cm-full-ground"></div>
    <div class="cm-corner tl"></div>
    <div class="cm-corner tr"></div>
    <div class="cm-corner bl"></div>
    <div class="cm-corner br"></div>

    <div style="position:absolute;top:44px;left:64px;right:64px;">
      <div class="cm-kicker">DÂY CHUYỀN KIỂM ĐỊNH GAME // TƯƠNG THÍCH MÀN HÌNH 14:10</div>
      <div class="cm-head" style="font-size:44px;margin-top:10px;">CHƯA CÓ TỰA GAME PHỔ BIẾN NÀO TỐI ƯU CHO IPHONE DUO! ✕</div>
    </div>

    <div class="cm-card-cream cm-shadow-featured" style="position:absolute;top:195px;left:64px;width:1792px;height:790px;padding:30px 38px;">
      <svg viewBox="0 0 1700 700" width="100%" height="700" fill="none">
        <!-- Conveyor Track -->
        <rect x="30" y="480" width="1640" height="80" rx="40" fill="#2A2A2A" stroke="#0F0F0F" stroke-width="6"/>
        <circle cx="140" cy="520" r="24" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
        <circle cx="520" cy="520" r="24" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
        <circle cx="900" cy="520" r="24" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
        <circle cx="1280" cy="520" r="24" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
        <circle cx="1560" cy="520" r="24" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>

        <!-- 4 Game Cards on Conveyor -->
        <g id="s15-g1" transform="translate(50, 140)" opacity="0">
          <rect width="360" height="310" fill="#F06CA8" stroke="#0F0F0F" stroke-width="5"/>
          <rect x="20" y="20" width="320" height="44" fill="#0F0F0F"/>
          <text x="180" y="49" text-anchor="middle" fill="#F5C518" font-family="JetBrains Mono" font-size="18" font-weight="800">GAME MOBA #01</text>
          <text x="180" y="135" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="34" font-weight="900">LIÊN QUÂN</text>
          <text x="180" y="180" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="30" font-weight="900">MOBILE</text>
          <rect x="30" y="225" width="300" height="55" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>
          <text x="180" y="260" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono" font-size="20" font-weight="800">HAI VIỀN ĐEN ✕</text>
        </g>

        <g id="s15-g2" transform="translate(460, 140)" opacity="0">
          <rect width="360" height="310" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
          <rect x="20" y="20" width="320" height="44" fill="#0F0F0F"/>
          <text x="180" y="49" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono" font-size="18" font-weight="800">GAME FPS #02</text>
          <text x="180" y="135" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="34" font-weight="900">DELTA</text>
          <text x="180" y="180" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="30" font-weight="900">FORCE</text>
          <rect x="30" y="225" width="300" height="55" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>
          <text x="180" y="260" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono" font-size="20" font-weight="800">HAI VIỀN ĐEN ✕</text>
        </g>

        <g id="s15-g3" transform="translate(870, 140)" opacity="0">
          <rect width="360" height="310" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
          <rect x="20" y="20" width="320" height="44" fill="#0F0F0F"/>
          <text x="180" y="49" text-anchor="middle" fill="#F5C518" font-family="JetBrains Mono" font-size="18" font-weight="800">OPEN WORLD #03</text>
          <text x="180" y="135" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="34" font-weight="900">GENSHIN</text>
          <text x="180" y="180" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="30" font-weight="900">IMPACT</text>
          <rect x="30" y="225" width="300" height="55" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>
          <text x="180" y="260" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono" font-size="20" font-weight="800">HAI VIỀN ĐEN ✕</text>
        </g>

        <g id="s15-g4" transform="translate(1280, 140)" opacity="0">
          <rect width="360" height="310" fill="#F06CA8" stroke="#0F0F0F" stroke-width="5"/>
          <rect x="20" y="20" width="320" height="44" fill="#0F0F0F"/>
          <text x="180" y="49" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono" font-size="18" font-weight="800">GAME AAA #04</text>
          <text x="180" y="135" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="34" font-weight="900">RESIDENT</text>
          <text x="180" y="180" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="30" font-weight="900">EVIL</text>
          <rect x="30" y="225" width="300" height="55" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>
          <text x="180" y="260" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono" font-size="20" font-weight="800">HAI VIỀN ĐEN ✕</text>
        </g>

        <g id="s15-g-bottom" opacity="0">
          <rect x="30" y="590" width="1640" height="75" fill="#0F0F0F"/>
          <text x="850" y="638" text-anchor="middle" fill="#F5C518" font-family="Be Vietnam Pro" font-size="28" font-weight="900">DÙ CỐ GẮNG ZOOM LÊN VẪN LUÔN XUẤT HIỆN 2 VIỀN ĐEN TRÊN &amp; DƯỚI!</text>
        </g>
      </svg>
    </div>
  </div>

  <!-- PHASE C: GAMING B-ROLL ASYMMETRIC BLACK BAR OVERLAY (106.50s - 141.50s) -->
  <div id="s15-broll-game" class="s15-layer">
    <div style="position:absolute;top:48px;left:48px;width:545px;display:flex;flex-direction:column;gap:14px;">
      <div class="cm-kicker">THƯỚC ĐO VIỀN ĐEN KHI CHƠI GAME</div>
      <div class="cm-card-cream cm-shadow-featured" style="padding:18px 22px;">
        <div class="cm-mono" style="font-size:16px;color:#E85A1F;">2 VIỀN ĐEN KHÔNG ĐỒNG ĐỀU NHAU!</div>
        <div class="cm-head" style="font-size:28px;margin-top:4px;">1 VIỀN DÀY HƠN · 1 VIỀN MỎNG HƠN → KHUNG HÌNH BỊ ĐẨY LỆCH HẲN LÊN TRÊN! ✕</div>
        <svg viewBox="0 0 480 155" width="100%" height="155" fill="none" style="margin-top:10px;">
          <!-- Asymmetric Screen Diagram -->
          <rect x="20" y="8" width="440" height="138" fill="#0F0F0F" stroke="#0F0F0F" stroke-width="4"/>
          <!-- Thin Top Black Bar (16px) -->
          <rect x="24" y="12" width="432" height="16" fill="#2A2A2A"/>
          <text x="240" y="25" text-anchor="middle" fill="#F5C518" font-family="JetBrains Mono" font-size="12" font-weight="800">VIỀN ĐEN TRÊN MỎNG</text>
          <!-- Game Viewport Shifted Up -->
          <rect x="24" y="28" width="432" height="72" fill="#136636"/>
          <text x="240" y="70" text-anchor="middle" fill="#EFE9D9" font-family="Be Vietnam Pro" font-size="18" font-weight="900">KHUNG GAME BỊ ĐẨY LỆCH LÊN TRÊN</text>
          <!-- Thick Bottom Black Bar (42px) -->
          <rect x="24" y="100" width="432" height="42" fill="#E85A1F"/>
          <text x="240" y="126" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono" font-size="14" font-weight="800">VIỀN ĐEN DƯỚI DÀY GẤP ĐÔI ✕</text>
        </svg>
      </div>
    </div>
  </div>
`;

const s15Js = `
  // "4:3 tốt nhất, YouTube 16:9 & TikTok xoay dọc vẫn viền đen" (782.62s = 14.82s local)
  tl.fromTo("#s15-c1", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 14.50);
  // "sau 7 ngày ra mắt... ứng dụng chưa được tối ưu 100%" (819.34s = 51.54s local)
  tl.fromTo("#s15-c2", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 51.50);
  // "Apple tạo ra chiếc điện thoại để bắt buộc mọi người sử dụng bằng cả hai tay" (851.18s = 83.38s local)
  tl.fromTo("#s15-c3", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 83.40);

  // Switch to Phase B (100% Motion Conveyor) at 99.20s (867.00s global: "Một cái điểm nữa mà tôi cũng không thích... là tối ưu khi mà chúng ta chơi game")
  tl.to("#s15-broll-1", { opacity: 0, duration: 0.30 }, 98.90);
  tl.to("#s15-full-conveyor", { opacity: 1, duration: 0.38, ease: "power2.out" }, 99.20);
  // "Liên Quân Mobile (877.86s = 110.06s), Delta Force (878.40s = 110.60s), Genshin Impact (879.38s = 111.58s), Resident Evil (882.32s = 114.52s)"
  tl.to("#s15-g1", { opacity: 1, duration: 0.38, ease: "power2.out" }, 110.00);
  tl.to("#s15-g2", { opacity: 1, duration: 0.38, ease: "power2.out" }, 110.60);
  tl.to("#s15-g3", { opacity: 1, duration: 0.38, ease: "power2.out" }, 111.50);
  tl.to("#s15-g4", { opacity: 1, duration: 0.38, ease: "power2.out" }, 114.40);
  // "luôn luôn sẽ có hai cái viền đen trên dưới" (883.60s = 115.80s local)
  tl.to("#s15-g-bottom", { opacity: 1, duration: 0.42, ease: "power2.out" }, 115.80);

  // Switch to Phase C (Gaming B-roll Overlay) at 121.70s (889.50s global: "Mà cái khó chịu ấy là cái viền đen khi các bạn chơi game nó không đồng đều nhau...")
  tl.to("#s15-full-conveyor", { opacity: 0, duration: 0.30 }, 121.40);
  tl.to("#s15-broll-game", { opacity: 1, duration: 0.38, ease: "power2.out" }, 121.70);
`;

writeFileSync(join(compDir, 'scene-15.html'), wrapSubComp('scene-15', s15Css, s15Html, s15Js));

// ============================================================================
// SCENE 16 (909.37s - 977.23s, dur 67.86s):
// Bỏ tiền lớn ở hiện tại nhưng phải chờ tối ưu tương lai vs Điện thoại gập Android có giải pháp Scale tràn màn
// - 0.00s - 30.93s (909.37s - 940.30s): 100% Motion Graphics (Payment Now vs Future Promise Machine)
// - 30.93s - 41.80s (940.30s - 951.17s): B-roll Game Black Bar Overlay
// - 41.80s - 67.86s (951.17s - 977.23s): 100% Motion Graphics (Android Full-Screen Scale vs iPhone Duo)
// ============================================================================
const s16Css = `
  .s16-layer { position: absolute; inset: 0; }
  #s16-full-1 { z-index: 6; }
  #s16-broll { z-index: 7; opacity: 0; pointer-events: none; }
  #s16-full-2 { z-index: 8; opacity: 0; pointer-events: none; }
`;

const s16Html = `
  <!-- PHASE A: 100% MOTION GRAPHICS - MONEY NOW VS FUTURE PROMISE (0.00s - 30.93s) -->
  <div id="s16-full-1" class="s16-layer">
    <div class="cm-full-ground"></div>
    <div class="cm-corner tl"></div>
    <div class="cm-corner tr"></div>
    <div class="cm-corner bl"></div>
    <div class="cm-corner br"></div>

    <div style="position:absolute;top:44px;left:64px;right:64px;">
      <div class="cm-kicker">NGHỊCH LÝ CHI PHÍ // BỎ TIỀN HIỆN TẠI NHƯNG PHẢI CHỜ TƯƠNG LAI</div>
      <div class="cm-head" style="font-size:44px;margin-top:10px;">BỎ RA 65 TRIỆU HÔM NAY · TẠI SAO PHẢI CHỜ TỐI ƯU VÔ ĐỊNH?</div>
    </div>

    <div class="cm-card-cream cm-shadow-featured" style="position:absolute;top:195px;left:64px;width:1792px;height:790px;padding:30px 38px;">
      <svg viewBox="0 0 1700 700" width="100%" height="700" fill="none">
        <!-- Left Scale Pan: 65M Cash Now -->
        <g id="s16-p1-left" opacity="0">
          <rect x="40" y="50" width="760" height="590" fill="#F5C518" stroke="#0F0F0F" stroke-width="6"/>
          <rect x="70" y="80" width="420" height="44" fill="#0F0F0F"/>
          <text x="280" y="109" text-anchor="middle" fill="#F5C518" font-family="JetBrains Mono" font-size="20" font-weight="800">THỜI ĐIỂM HIỆN TẠI // XUỐNG TIỀN</text>
          <text x="420" y="230" text-anchor="middle" fill="#0F0F0F" font-family="Archivo Black" font-size="78">65 TRIỆU</text>
          <text x="420" y="305" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="30" font-weight="900">MONG MUỐN TẬN DỤNG TỐI ĐA MÀN TO</text>
        </g>
        <g id="s16-p1-quote" opacity="0">
          <rect x="90" y="365" width="660" height="220" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
          <text x="420" y="435" text-anchor="middle" fill="#136636" font-family="Be Vietnam Pro" font-size="28" font-weight="900">"BỎ TIỀN Ở HIỆN TẠI THÌ MỌI THỨ</text>
          <text x="420" y="480" text-anchor="middle" fill="#136636" font-family="Be Vietnam Pro" font-size="28" font-weight="900">PHẢI NGON NGAY Ở HIỆN TẠI!"</text>
          <text x="420" y="535" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="22" font-weight="700">Kể cả dùng giải pháp tình thế Zoom/Scale tràn viền</text>
        </g>

        <!-- Right Scale Pan: Endless Waiting Clock -->
        <g id="s16-p1-right" opacity="0">
          <rect x="900" y="50" width="760" height="590" fill="#F06CA8" stroke="#0F0F0F" stroke-width="6"/>
          <rect x="930" y="80" width="460" height="44" fill="#0F0F0F"/>
          <text x="1160" y="109" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono" font-size="20" font-weight="800">THỰC TẾ TRÊN IPHONE DUO</text>
          <circle cx="1280" cy="275" r="105" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="7"/>
          <line x1="1280" y1="275" x2="1280" y2="195" stroke="#E85A1F" stroke-width="8"/>
          <line x1="1280" y1="275" x2="1345" y2="275" stroke="#0F0F0F" stroke-width="8"/>
          <text x="1280" y="445" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="32" font-weight="900">CHỜ CẬP NHẬT TRONG TƯƠNG LAI ✕</text>
          <rect x="950" y="485" width="660" height="110" fill="#0F0F0F"/>
          <text x="1280" y="550" text-anchor="middle" fill="#F5C518" font-family="Be Vietnam Pro" font-size="26" font-weight="800">Không biết phải chờ đến bao giờ Game/App mới tối ưu!</text>
        </g>
      </svg>
    </div>
  </div>

  <!-- PHASE B: B-ROLL OVERLAY (30.93s - 41.80s) -->
  <div id="s16-broll" class="s16-layer">
    <div style="position:absolute;bottom:48px;left:48px;width:580px;">
      <div class="cm-card-orange cm-shadow-featured" style="padding:18px 24px;">
        <div class="cm-mono-dark-pill">TRẢI NGHIỆM THỰC TẾ</div>
        <div class="cm-head" style="font-size:28px;margin-top:6px;">MÀN HÌNH LỚN NHƯNG BỊ BÓ HẸP BỞI HAI DẢI ĐEN TRÊN DƯỚI! ✕</div>
      </div>
    </div>
  </div>

  <!-- PHASE C: 100% MOTION GRAPHICS - ANDROID SCALE VS IPHONE DUO (41.80s - 67.86s) -->
  <div id="s16-full-2" class="s16-layer">
    <div class="cm-full-ground"></div>
    <div class="cm-corner tl"></div>
    <div class="cm-corner tr"></div>
    <div class="cm-corner bl"></div>
    <div class="cm-corner br"></div>

    <div style="position:absolute;top:44px;left:64px;right:64px;">
      <div class="cm-kicker">SO SÁNH GIẢI PHÁP PHẦN MỀM // ĐIỆN THOẠI GẬP ANDROID VS IPHONE DUO</div>
      <div class="cm-head" style="font-size:44px;margin-top:10px;">ANDROID CHO PHÉP SCALE VỪA KHÍT MÀN HÌNH · ĐỠ GAI MẮT HƠN NHIỀU!</div>
    </div>

    <div class="cm-card-cream cm-shadow-featured" style="position:absolute;top:195px;left:64px;width:1792px;height:790px;padding:30px 38px;">
      <svg viewBox="0 0 1700 700" width="100%" height="700" fill="none">
        <!-- Left: Android Fold Scale -->
        <g id="s16-p2-left" opacity="0">
          <rect x="40" y="35" width="770" height="630" fill="#136636" stroke="#0F0F0F" stroke-width="6"/>
          <text x="425" y="95" text-anchor="middle" fill="#F5C518" font-family="JetBrains Mono" font-size="22" font-weight="800">ĐIỆN THOẠI GẬP ANDROID</text>
          <text x="425" y="145" text-anchor="middle" fill="#EFE9D9" font-family="Be Vietnam Pro" font-size="34" font-weight="900">CÓ TÙY CHỌN SCALE TỈ LỆ ỨNG DỤNG ✓</text>
          <rect x="145" y="185" width="560" height="360" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="6"/>
          <!-- Expanding Arrows -->
          <path d="M 425 365 L 200 230 M 425 365 L 650 230 M 425 365 L 200 500 M 425 365 L 650 500" stroke="#136636" stroke-width="6"/>
          <rect x="195" y="332" width="460" height="64" fill="#136636" stroke="#0F0F0F" stroke-width="4"/>
          <text x="425" y="373" text-anchor="middle" fill="#EFE9D9" font-family="Be Vietnam Pro" font-size="26" font-weight="900">BUNG VỪA KHÍT 100% MÀN HÌNH ✓</text>
          <text x="425" y="610" text-anchor="middle" fill="#EFE9D9" font-family="Be Vietnam Pro" font-size="24" font-weight="700">Đỡ gai mắt · Tận dụng ngay không gian màn hình lớn</text>
        </g>

        <!-- Right: iPhone Duo Locked -->
        <g id="s16-p2-right" opacity="0">
          <rect x="890" y="35" width="770" height="630" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="6"/>
          <text x="1275" y="95" text-anchor="middle" fill="#E85A1F" font-family="JetBrains Mono" font-size="22" font-weight="800">IPHONE DUO Ở HIỆN TẠI</text>
          <text x="1275" y="145" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="34" font-weight="900">KHÔNG CHO SCALE · ÉP CHỊU VIỀN ĐEN ✕</text>
          <rect x="995" y="185" width="560" height="360" fill="#0F0F0F" stroke="#0F0F0F" stroke-width="6"/>
          <rect x="995" y="220" width="560" height="220" fill="#F06CA8"/>
          <text x="1275" y="340" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="28" font-weight="900">KHUNG HÌNH LỆCH + 2 DẢI ĐEN</text>
          <text x="1275" y="610" text-anchor="middle" fill="#E85A1F" font-family="Be Vietnam Pro" font-size="24" font-weight="900">Đánh giá thấp hơn hẳn các hãng Android ngoài kia!</text>
        </g>
      </svg>
    </div>
  </div>
`;

const s16Js = `
  // Phase A (0.00s - 36.60s = 909.00s - 945.60s): Progressive reveal of 65M Now -> Quote -> Waiting Clock
  tl.to("#s16-p1-left", { opacity: 1, duration: 0.45, ease: "power2.out" }, 0.60);
  // "tôi đang bỏ tiền ra ở thời điểm hiện tại thì tôi muốn tất cả mọi thứ cần phải ngon ở thời điểm hiện tại" (922.12s = 13.12s local)
  tl.to("#s16-p1-quote", { opacity: 1, duration: 0.45, ease: "power2.out" }, 13.10);
  // "chứ không muốn bỏ ra số tiền ở thời điểm hiện tại và lại phải chờ trong tương lai" (933.74s = 24.74s local)
  tl.to("#s16-p1-right", { opacity: 1, duration: 0.48, ease: "power2.out" }, 24.70);

  // 36.60s - 56.60s (945.60s - 965.60s): Phase C Full Motion comparing iPhone Duo vs Android Scale-to-Fit
  tl.to("#s16-full-1", { opacity: 0, duration: 0.30 }, 36.30);
  tl.to("#s16-full-2", { opacity: 1, duration: 0.38, ease: "power2.out" }, 36.60);
  // "để so sánh iPhone Duo với các hãng điện thoại gập Android... tôi không đánh giá cao bằng" (945.70s = 36.70s local)
  tl.to("#s16-p2-right", { opacity: 1, duration: 0.45, ease: "power2.out" }, 37.00);
  // "Ít ra điện thoại Android... có giải pháp để scale tỉ lệ màn hình ra sao cho vừa khít" (950.82s = 41.82s local)
  tl.to("#s16-p2-left", { opacity: 1, duration: 0.48, ease: "power2.out" }, 41.80);
`;

writeFileSync(join(compDir, 'scene-16.html'), wrapSubComp('scene-16', s16Css, s16Html, s16Js));

// ============================================================================
// SCENE 17 (977.23s - 1073.60s, dur 96.37s):
// Miếng dán nhám màn hình trong: 1 Lợi ích (hạn chế lóa) vs 3 Bất cập (Màu xám xịt, Dễ trầy xước HTX, Nghịch lý bút Apple Pencil)
// Note: Stops at 1073.60s so 1073.60s-1078.60s Original Stylus Infographic is 100% Pass-through!
// - 0.00s - 70.47s (977.23s - 1047.70s): B-roll Matte Screen Optical Card Sorter Overlay
// - 70.47s - 96.37s (1047.70s - 1073.60s): 100% Motion Graphics (HTX Scratch Test & 8-Year Stylus Cross-Section)
// ============================================================================
const s17Css = `
  .s17-layer { position: absolute; inset: 0; }
  #s17-broll { z-index: 6; }
  #s17-full-scratch { z-index: 7; opacity: 0; pointer-events: none; }
`;

const s17Html = `
  <!-- PHASE A: B-ROLL MATTE SCREEN OVERLAY (0.00s - 61.47s) -->
  <div id="s17-broll" class="s17-layer">
    <div style="position:absolute;top:48px;left:48px;width:550px;display:flex;flex-direction:column;gap:12px;">
      <div class="cm-kicker">MIẾNG DÁN NHÁM MÀN TRONG // LỢI ÍCH &lt; BẤT CẬP</div>
      <div id="s17-pro" class="cm-card-green cm-shadow-ink" style="padding:16px 20px;opacity:0;">
        <div class="cm-mono-dark-pill">ĐIỂM CỘNG DUY NHẤT</div>
        <div class="cm-head" style="font-size:26px;color:#EFE9D9;margin-top:6px;">HẠN CHẾ BÓNG LÓA KHI DÙNG NGOÀI TRỜI NẮNG GẮT ✓</div>
      </div>
      <div id="s17-con1" class="cm-card-pink cm-shadow-featured" style="padding:18px 20px;opacity:0;">
        <div class="cm-mono" style="font-size:16px;">BẤT CẬP #01 // CHẤT LƯỢNG HIỂN THỊ</div>
        <div class="cm-head" style="font-size:28px;margin-top:4px;" data-var-text="s17_matte_con">MÀU ĐEN SÂU BỊ BIẾN THÀNH XÁM XỊT &amp; NHỢT NHẠT! ✕</div>
        <div class="cm-body" style="font-size:18px;margin-top:6px;">Xem ở màn ngoài màu tươi rực rỡ, mở màn trong ra bị xám xịt tụt cảm xúc.</div>
      </div>
    </div>
  </div>

  <!-- PHASE B: 100% MOTION GRAPHICS - HTX SCRATCH TEST & APPLE PENCIL PARADOX (61.47s - 96.37s) -->
  <div id="s17-full-scratch" class="s17-layer">
    <div class="cm-full-ground"></div>
    <div class="cm-corner tl"></div>
    <div class="cm-corner tr"></div>
    <div class="cm-corner bl"></div>
    <div class="cm-corner br"></div>

    <div style="position:absolute;top:44px;left:64px;right:64px;">
      <div class="cm-kicker">MẶT CẮT BỀ MẶT NHÁM // TEST KÊNH HTX &amp; NGHỊCH LÝ BÚT CẢM ỨNG</div>
      <div class="cm-head" style="font-size:44px;margin-top:10px;">DỄ TRẦY XƯỚC VĨNH VIỄN · SAU 8 NĂM RẤT ÍT AI DÙNG BÚT TRÊN MÁY GẬP!</div>
    </div>

    <div class="cm-card-cream cm-shadow-featured" style="position:absolute;top:195px;left:64px;width:1792px;height:790px;padding:30px 38px;">
      <svg viewBox="0 0 1700 700" width="100%" height="700" fill="none">
        <!-- Left: HTX Scratch Test Cross-Section -->
        <g id="s17-scratch-left" opacity="0">
          <rect x="30" y="30" width="800" height="640" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
          <rect x="60" y="55" width="440" height="42" fill="#0F0F0F"/>
          <text x="280" y="83" text-anchor="middle" fill="#F5C518" font-family="JetBrains Mono" font-size="18" font-weight="800">KIỂM CHỨNG TỪ KÊNH YOUTUBE HTX</text>
          <text x="430" y="150" text-anchor="middle" fill="#E85A1F" font-family="Be Vietnam Pro" font-size="34" font-weight="900">HẠT BỤI / ĐẦU BÚT CÀO NHẸ LÀ XƯỚC! ✕</text>
          <!-- Surface Layers -->
          <rect x="90" y="360" width="680" height="80" fill="#F06CA8" stroke="#0F0F0F" stroke-width="5"/>
          <text x="430" y="408" text-anchor="middle" fill="#0F0F0F" font-family="JetBrains Mono" font-size="20" font-weight="800">LỚP DÁN NHÁM BỀ MẶT (LỘ RÕ VẾT XƯỚC)</text>
          <rect x="90" y="440" width="680" height="100" fill="#182836" stroke="#0F0F0F" stroke-width="5"/>
          <text x="430" y="498" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono" font-size="20" font-weight="800">TẤM NỀN OLED GẬP BÊN DƯỚI</text>
          <!-- Stylus Tip Scratching -->
          <polygon points="360,185 410,185 385,360" fill="#0F0F0F" stroke="#E85A1F" stroke-width="4"/>
          <path d="M 220 360 L 580 360" stroke="#E85A1F" stroke-width="10" stroke-dasharray="14 6"/>
        </g>

        <!-- Right: 8-Year Foldable Stylus Observation -->
        <g id="s17-scratch-right" opacity="0">
          <rect x="870" y="30" width="800" height="640" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
          <rect x="900" y="55" width="480" height="42" fill="#0F0F0F"/>
          <text x="1140" y="83" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono" font-size="18" font-weight="800">QUAN SÁT SAU 8 NĂM ĐIỆN THOẠI GẬP</text>
          <text x="1270" y="150" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="32" font-weight="900">HỖ TRỢ APPLE PENCIL NHƯNG BẤT TIỆN!</text>

          <rect x="930" y="195" width="680" height="170" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
          <text x="1270" y="255" text-anchor="middle" fill="#E85A1F" font-family="Be Vietnam Pro" font-size="28" font-weight="900">✕ PHẢI MANG THEO CÂY BÚT RỜI LỈNH KỈNH</text>
          <text x="1270" y="305" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="24" font-weight="700">Viết lâu dài để lại càng nhiều vết trầy trên màn nhám</text>

          <rect x="930" y="405" width="680" height="205" fill="#136636" stroke="#0F0F0F" stroke-width="5"/>
          <text x="1270" y="470" text-anchor="middle" fill="#F5C518" font-family="JetBrains Mono" font-size="20" font-weight="800">LỰA CHỌN THỰC TẾ CỦA NGƯỜI CẦN BÚT:</text>
          <text x="1270" y="535" text-anchor="middle" fill="#EFE9D9" font-family="Be Vietnam Pro" font-size="36" font-weight="900">CHỌN MÁY TÍNH BẢNG (IPAD MINI) ✓</text>
        </g>
      </svg>
    </div>
  </div>
`;

const s17Js = `
  // "Lợi ích lớn nhất... hạn chế bóng và hạn chế lóa" (977.50s = 11.90s local)
  tl.fromTo("#s17-pro", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 11.90);
  // "khả năng hiển thị bị kém đi rất nhiều... tông màu đen bị nhám một cách xám xịt luôn" (996.08s = 30.48s local)
  tl.fromTo("#s17-con1", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 30.50);

  // Switch to Phase B (100% Motion Scratch & Stylus) at 72.90s (1038.50s global: "Cái bất cập số hai... dễ bị trầy xước hơn, kênh YouTube HTX đã test")
  tl.to("#s17-broll", { opacity: 0, duration: 0.30 }, 72.60);
  tl.to("#s17-full-scratch", { opacity: 1, duration: 0.38, ease: "power2.out" }, 72.90);
  tl.to("#s17-scratch-left", { opacity: 1, duration: 0.45, ease: "power2.out" }, 73.30);
  // "yếu tố số ba... viết cây bút của nhà Apple... sau 8 năm điện thoại gập tồn tại" (1057.90s = 92.30s local)
  tl.to("#s17-scratch-right", { opacity: 1, duration: 0.48, ease: "power2.out" }, 92.30);
`;

writeFileSync(join(compDir, 'scene-17.html'), wrapSubComp('scene-17', s17Css, s17Html, s17Js));

// ============================================================================
// SCENE 18 (1078.60s - 1222.00s, dur 143.40s):
// Camera ẩn dưới màn hình "Ẩn như không ẩn", Footage test cam ẩn chỉ Full HD cực xấu & Tranh luận FaceTime
// - 0.00s - 52.40s (1078.60s - 1131.00s): A-roll + Close-up B-roll UDC Cutout Overlay
// - 52.40s - 82.97s (1131.00s - 1161.57s): Live UDC Camera Test Footage HUD Overlay
// - 82.97s - 132.87s (1161.57s - 1211.47s): 100% Motion Graphics (Video Call Pipeline: 65M UDC vs Android Punch-Hole)
// - 132.87s - 143.40s (1211.47s - 1222.00s): B-roll Inner Screen Overlay
// ============================================================================
const s18Css = `
  .s18-layer { position: absolute; inset: 0; }
  #s18-stylus-wrap { z-index: 5; }
  #s18-broll-udc { z-index: 6; opacity: 0; pointer-events: none; }
  #s18-test-hud { z-index: 7; opacity: 0; pointer-events: none; }
  #s18-full-facetime { z-index: 8; opacity: 0; pointer-events: none; }
`;

const s18Html = `
  <!-- PHASE A0: STYLUS & IPAD MINI WRAP-UP OVERLAY (0.00s - 22.60s = 1078.60s - 1101.20s) -->
  <div id="s18-stylus-wrap" class="s18-layer">
    <div style="position:absolute;top:48px;left:48px;width:545px;display:flex;flex-direction:column;gap:12px;">
      <div class="cm-kicker">THỰC TẾ SỬ DỤNG BÚT // BẤT TIỆN &amp; DỄ TRẦY MÀN NHÁM</div>
      <div id="s18-st-c1" class="cm-card-yellow cm-shadow-featured" style="padding:16px 20px;opacity:0;">
        <div class="cm-mono" style="font-size:15px;">BẤT TIỆN KHI PHẢI MANG THEO BÚT RỜI</div>
        <div class="cm-head" style="font-size:26px;margin-top:4px;">AI CẦN DÙNG BÚT ĐA SỐ SẼ NGHĨ NGAY ĐẾN IPAD MINI! ✓</div>
      </div>
      <div id="s18-st-c2" class="cm-card-pink cm-shadow-ink" style="padding:16px 20px;opacity:0;">
        <div class="cm-mono-dark-pill">HỆ QUẢ DÙNG BÚT LÂU DÀI</div>
        <div class="cm-head" style="font-size:25px;margin-top:4px;">ĐỂ LẠI NHIỀU VẾT TRẦY XƯỚC TRÊN MIẾNG DÁN NHÁM! ✕</div>
      </div>
    </div>
  </div>

  <!-- PHASE A: UDC CUTOUT OVERLAY (22.60s - 59.90s = 1101.20s - 1138.50s) -->
  <div id="s18-broll-udc" class="s18-layer">
    <div style="position:absolute;top:48px;left:48px;width:545px;display:flex;flex-direction:column;gap:14px;">
      <div class="cm-kicker">CAMERA ẨN MÀN TRONG // "ẨN NHƯ KHÔNG ẨN"</div>
      <div id="s18-c1" class="cm-card-cream cm-shadow-featured" style="padding:18px 22px;opacity:0;">
        <div class="cm-mono" style="font-size:16px;color:#E85A1F;">LỖI KHOÉT LỚP DÁN NHÁM</div>
        <div class="cm-head" style="font-size:28px;margin-top:4px;" data-var-text="s18_udc_head">KHOÉT LỖ TRÒN KHÔNG DÁN NHÁM → LỘ RÕ MỒN MỘT! ✕</div>
        <div class="cm-body" style="font-size:19px;margin-top:6px;">Xem video hay lướt web đều nhìn thấy rất rõ chấm camera chứ không hề biến mất.</div>
      </div>
      <div id="s18-c2" class="cm-card-pink cm-shadow-ink" style="padding:16px 22px;opacity:0;">
        <div class="cm-mono-dark-pill">ĐÁNH ĐỔI CHẤT LƯỢNG</div>
        <div class="cm-head" style="font-size:26px;margin-top:6px;">CHẤT LƯỢNG CHỤP ẢNH &amp; QUAY VIDEO CỰC KỲ TỆ! ✕</div>
      </div>
    </div>
  </div>

  <!-- PHASE B: LIVE UDC FOOTAGE TEST HUD (59.90s - 82.90s = 1138.50s - 1161.50s) -->
  <div id="s18-test-hud" class="s18-layer">
    <div style="position:absolute;top:42px;left:48px;width:530px;display:flex;flex-direction:column;gap:12px;">
      <div class="cm-kicker">FOOTAGE THỰC TẾ // QUAY TỪ CAMERA ẨN IPHONE DUO</div>
      <div id="s18-hud-card" class="cm-card-orange cm-shadow-featured" style="padding:18px 22px;opacity:0;">
        <div class="cm-mono-dark-pill">REC // THÔNG SỐ QUAY VIDEO</div>
        <div class="cm-head" style="font-size:30px;margin-top:6px;">CHỈ QUAY ĐƯỢC FULL HD 1080P! ✕</div>
        <div class="cm-head" style="font-size:24px;color:#EFE9D9;margin-top:4px;">KHÔNG CÓ 4K · KHÔNG CÓ 2K · CHẤT LƯỢNG CỰC TỆ!</div>
      </div>
    </div>
  </div>

  <!-- PHASE C: 100% MOTION GRAPHICS - FACETIME EXCUSE VS ANDROID PUNCH-HOLE (82.90s - 130.20s = 1161.50s - 1208.80s) -->
  <div id="s18-full-facetime" class="s18-layer">
    <div class="cm-full-ground"></div>
    <div class="cm-corner tl"></div>
    <div class="cm-corner tr"></div>
    <div class="cm-corner bl"></div>
    <div class="cm-corner br"></div>

    <div style="position:absolute;top:44px;left:64px;right:64px;display:flex;justify-content:space-between;align-items:flex-start;">
      <div>
        <div class="cm-kicker">PHẢN BIỆN QUAN ĐIỂM // "CAMERA TRONG CHỈ ĐỂ GỌI FACETIME"</div>
        <div class="cm-head" style="font-size:44px;margin-top:10px;">BỎ 65 TRIỆU KHÔNG AI MUỐN VIDEO CALL MỜ ĐỤC NHƯ VẬY!</div>
      </div>
      <div class="cm-stamp-rot">
        <div class="cm-head" style="font-size:28px;">ẨN CŨNG CHẲNG ẨN! ✕</div>
      </div>
    </div>

    <div class="cm-card-cream cm-shadow-featured" style="position:absolute;top:195px;left:64px;width:1792px;height:790px;padding:30px 38px;">
      <svg viewBox="0 0 1700 700" width="100%" height="700" fill="none">
        <!-- Left: iPhone Duo UDC Compromise -->
        <g id="s18-ft-left" opacity="0">
          <rect x="30" y="25" width="800" height="640" fill="#F06CA8" stroke="#0F0F0F" stroke-width="5"/>
          <rect x="60" y="50" width="480" height="42" fill="#0F0F0F"/>
          <text x="300" y="78" text-anchor="middle" fill="#F5C518" font-family="JetBrains Mono" font-size="18" font-weight="800">CÁCH LÀM CỦA IPHONE DUO (65 TRIỆU)</text>
          <text x="430" y="145" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="32" font-weight="900">CỐ LÀM CAMERA ẨN NỬA VỜI ✕</text>
          <rect x="85" y="185" width="690" height="190" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
          <text x="430" y="245" text-anchor="middle" fill="#E85A1F" font-family="Be Vietnam Pro" font-size="28" font-weight="900">1. THỊ GIÁC: VẪN LỘ RÕ VẾT KHOÉT</text>
          <text x="430" y="295" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="22" font-weight="700">Do khoét thủng lớp dán nhám nên mắt nhìn vào thấy ngay</text>
        </g>
        <g id="s18-ft-left-sub" opacity="0">
          <rect x="85" y="405" width="690" height="210" fill="#0F0F0F"/>
          <text x="430" y="475" text-anchor="middle" fill="#F5C518" font-family="Be Vietnam Pro" font-size="28" font-weight="900">2. CHẤT LƯỢNG: MỜ ĐỤC · CHỈ FULL HD</text>
          <text x="430" y="530" text-anchor="middle" fill="#EFE9D9" font-family="Be Vietnam Pro" font-size="22" font-weight="700">Người đối diện nhìn bạn qua Video Call cực kỳ xấu!</text>
        </g>

        <!-- Right: Samsung / Android Corner Camera -->
        <g id="s18-ft-right" opacity="0">
          <rect x="870" y="25" width="800" height="640" fill="#136636" stroke="#0F0F0F" stroke-width="5"/>
          <rect x="900" y="50" width="520" height="42" fill="#0F0F0F"/>
          <text x="1160" y="78" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono" font-size="18" font-weight="800">GIẢI PHÁP HỢP LÝ NHƯ SAMSUNG / ANDROID</text>
          <text x="1270" y="145" text-anchor="middle" fill="#EFE9D9" font-family="Be Vietnam Pro" font-size="32" font-weight="900">CAMERA NHỎ ĐẶT Ở GÓC MÀN HÌNH ✓</text>
          <rect x="925" y="185" width="690" height="190" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
          <text x="1270" y="245" text-anchor="middle" fill="#136636" font-family="Be Vietnam Pro" font-size="28" font-weight="900">1. KHÔNG ẢNH HƯỞNG TRẢI NGHIỆM</text>
          <text x="1270" y="295" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="22" font-weight="700">Nốt ruồi nhỏ gọn ở góc, hiển thị vẫn thoáng đãng</text>
          <rect x="925" y="405" width="690" height="210" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
          <text x="1270" y="475" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="28" font-weight="900">2. VIDEO CALL &amp; HỌP ONLINE SẮC NÉT ✓</text>
          <text x="1270" y="530" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="22" font-weight="800">Phục vụ tốt công việc &amp; gọi video trên màn hình lớn 7.6"</text>
        </g>
      </svg>
    </div>
  </div>
`;

const s18Js = `
  // Phase A0 (0.00s - 22.60s = 1078.60s - 1101.20s): Stylus & iPad mini wrap-up
  // "phải mang theo một cây bút rất bất tiện... nghĩ ngay đến iPad mini" (1080.14s - 1086.28s)
  tl.fromTo("#s18-st-c1", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 1.20);
  // "dùng bút lâu dài trên màn nhám để lại nhiều vết trầy xước" (1091.38s = 12.78s local)
  tl.fromTo("#s18-st-c2", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 12.80);

  // Switch to Phase A (UDC Cutout Overlay) at 22.60s (1101.20s global: "Tiếp theo đó chính là camera ẩn ở trong cái màn hình bên trong này")
  tl.to("#s18-stylus-wrap", { opacity: 0, duration: 0.30 }, 22.30);
  tl.to("#s18-broll-udc", { opacity: 1, duration: 0.38, ease: "power2.out" }, 22.60);
  tl.fromTo("#s18-c1", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 23.00);
  // "mà đổi ngược lại nha, cái camera ẩn này chất lượng chụp ảnh của nó cực kỳ tệ" (1134.08s = 55.48s local)
  tl.fromTo("#s18-c2", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 55.50);

  // Switch to Phase B (Live UDC Camera Test HUD) at 59.90s (1138.50s global: "Và đây là video mà tôi đang quay ở trên camera ẩn...")
  tl.to("#s18-broll-udc", { opacity: 0, duration: 0.30 }, 59.60);
  tl.to("#s18-test-hud", { opacity: 1, duration: 0.38, ease: "power2.out" }, 59.90);
  // "camera con máy này nó chỉ quay được Full HD mà thôi, không quay được 4K 2K gì cả" (1145.90s = 67.30s local)
  tl.fromTo("#s18-hud-card", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 67.20);

  // Switch to Phase C (100% Motion FaceTime Comparison) at 82.90s (1161.50s global)
  tl.to("#s18-test-hud", { opacity: 0, duration: 0.30 }, 82.60);
  tl.to("#s18-full-facetime", { opacity: 1, duration: 0.38, ease: "power2.out" }, 82.90);
  tl.to("#s18-ft-left", { opacity: 1, duration: 0.45, ease: "power2.out" }, 83.40);
  // "không muốn người đối diện nhìn thấy bạn qua camera ẩn cực kỳ tệ" (1174.10s = 95.50s local)
  tl.to("#s18-ft-left-sub", { opacity: 1, duration: 0.45, ease: "power2.out" }, 95.50);
  // "Trong khi đó lẽ ra Apple đã có thể đưa ra một cái camera nhỏ đặt ở bên phía góc giống như Samsung hoặc Android" (1184.92s = 106.32s local)
  tl.to("#s18-ft-right", { opacity: 1, duration: 0.48, ease: "power2.out" }, 106.30);
`;

writeFileSync(join(compDir, 'scene-18.html'), wrapSubComp('scene-18', s18Css, s18Html, s18Js));

// ============================================================================
// SCENE 19 (1222.00s - 1289.80s, dur 67.80s):
// Nếp gập mờ nhưng Lỗi bản lề gây sọc màn hình (Sửa vẫn tốn tiền, ngại mở máy) & Quy luật vật lý
// - 0.00s - 25.40s (1222.00s - 1247.40s): A-roll + B-roll Crease Praise & Hinge Defect Overlay
// - 25.40s - 52.70s (1247.40s - 1274.70s): 100% Motion Graphics (Hinge Stress X-Ray & Anxiety Meter)
// - 52.70s - 67.80s (1274.70s - 1289.80s): B-roll Crease + Physical Wear Curve Overlay
// ============================================================================
const s19Css = `
  .s19-layer { position: absolute; inset: 0; }
  #s19-broll-1 { z-index: 6; }
  #s19-full-hinge { z-index: 7; opacity: 0; pointer-events: none; }
  #s19-broll-2 { z-index: 8; opacity: 0; pointer-events: none; }
`;

const s19Html = `
  <!-- PHASE A: CREASE PRAISE & DEFECT OVERLAY (0.00s - 25.40s) -->
  <div id="s19-broll-1" class="s19-layer">
    <div style="position:absolute;top:48px;left:48px;width:540px;display:flex;flex-direction:column;gap:12px;">
      <div class="cm-kicker">NẾP GẬP &amp; ĐỘ BỀN BẢN LỀ</div>
      <div id="s19-praise" class="cm-card-green cm-shadow-ink" style="padding:16px 20px;">
        <div class="cm-mono-dark-pill">ĐIỂM KHEN CHO APPLE</div>
        <div class="cm-head" style="font-size:26px;color:#EFE9D9;margin-top:6px;">NẾP GẬP BAN ĐẦU KHÁ MỜ NHỜ BẢN LỀ + LỚP NHÁM ✓</div>
      </div>
      <div id="s19-fault" class="cm-card-orange cm-shadow-featured" style="padding:18px 20px;opacity:0;">
        <div class="cm-mono-dark-pill">CẢNH BÁO RỦI RO LỚN</div>
        <div class="cm-head" style="font-size:28px;margin-top:6px;">LỖI BẢN LỀ KHIẾN MÀN HÌNH DỄ BỊ HỎNG &amp; SỌC! ✕</div>
      </div>
    </div>
  </div>

  <!-- PHASE B: 100% MOTION GRAPHICS - HINGE DEFECT & REPAIR COST X-RAY (25.40s - 52.70s) -->
  <div id="s19-full-hinge" class="s19-layer">
    <div class="cm-full-ground"></div>
    <div class="cm-corner tl"></div>
    <div class="cm-corner tr"></div>
    <div class="cm-corner bl"></div>
    <div class="cm-corner br"></div>

    <div style="position:absolute;top:44px;left:64px;right:64px;display:flex;justify-content:space-between;align-items:flex-start;">
      <div>
        <div class="cm-kicker">MẶT CẮT RỦI RO BẢN LỀ // APPLE ĐÃ XÁC NHẬN LỖI</div>
        <div class="cm-head" style="font-size:44px;margin-top:10px;" data-var-text="s19_hinge_head">SỬA CHỮA VẪN TỐN TIỀN · KHIẾN NGƯỜI DÙNG NGẠI MỞ MÁY! ✕</div>
      </div>
      <div class="cm-badge-rot">
        <div class="cm-head" style="font-size:28px;">KHÔNG FREE 100%!</div>
      </div>
    </div>

    <div class="cm-card-cream cm-shadow-featured" style="position:absolute;top:195px;left:64px;width:1792px;height:790px;padding:30px 38px;">
      <svg viewBox="0 0 1700 700" width="100%" height="700" fill="none">
        <!-- Left: Hinge Screen Stripe X-Ray -->
        <g id="s19-hinge-left" opacity="0">
          <rect x="30" y="30" width="800" height="640" fill="#182836" stroke="#0F0F0F" stroke-width="5"/>
          <text x="430" y="85" text-anchor="middle" fill="#F5C518" font-family="JetBrains Mono" font-size="20" font-weight="800">MẶT CẮT LỖI BẢN LỀ TÁC ĐỘNG LÊN TẤM NỀN</text>
          <rect x="140" y="130" width="580" height="360" fill="#0F0F0F" stroke="#EFE9D9" stroke-width="5"/>
          <!-- Center Hinge & Green Stripe Fault -->
          <rect x="415" y="130" width="30" height="360" fill="#E85A1F"/>
          <line x1="430" y1="130" x2="430" y2="490" stroke="#2EE58D" stroke-width="8"/>
          <circle cx="430" cy="310" r="55" stroke="#E85A1F" stroke-width="6" stroke-dasharray="12 6"/>
          <rect x="85" y="525" width="690" height="105" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>
          <text x="430" y="568" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="24" font-weight="900">APPLE CONFIRM LỖI NHƯNG SỬA VẪN TỐN TIỀN!</text>
          <text x="430" y="608" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono" font-size="18" font-weight="800">KHÔNG ĐƯỢC MIỄN PHÍ 100% KHI THAY THẾ</text>
        </g>

        <!-- Right: User Psychological Fear Meter -->
        <g id="s19-hinge-right" opacity="0">
          <rect x="870" y="30" width="800" height="640" fill="#F06CA8" stroke="#0F0F0F" stroke-width="5"/>
          <text x="1270" y="85" text-anchor="middle" fill="#0F0F0F" font-family="JetBrains Mono" font-size="20" font-weight="800">TÂM LÝ THỰC TẾ KHI SỬ DỤNG HÀNG NGÀY</text>
          <text x="1270" y="150" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="36" font-weight="900">CỰC KỲ NGẠI MỞ MÀN HÌNH TRONG! ✕</text>
          <rect x="930" y="195" width="680" height="200" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
          <text x="1270" y="265" text-anchor="middle" fill="#136636" font-family="Be Vietnam Pro" font-size="30" font-weight="900">ĐA SỐ CHỈ DÁM DÙNG MÀN HÌNH NGOÀI</text>
          <text x="1270" y="320" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="24" font-weight="700">Sợ mở ra một ngày đẹp trời bị sọc màn hình là "ối giời ơi"!</text>
          <rect x="930" y="435" width="680" height="195" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
          <text x="1270" y="510" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="30" font-weight="900">MUA MÁY GẬP 65 TRIỆU MÀ SỢ MỞ MÁY</text>
          <text x="1270" y="560" text-anchor="middle" fill="#E85A1F" font-family="Be Vietnam Pro" font-size="28" font-weight="900">→ MẤT HOÀN TOÀN Ý NGHĨA ĐIỆN THOẠI GẬP!</text>
        </g>
      </svg>
    </div>
  </div>

  <!-- PHASE C: PHYSICAL LAW CREASE WEAR OVERLAY (52.70s - 67.80s) -->
  <div id="s19-broll-2" class="s19-layer">
    <div style="position:absolute;bottom:48px;left:48px;width:620px;">
      <div class="cm-card-yellow cm-shadow-featured" style="padding:18px 24px;">
        <div class="cm-mono" style="font-size:16px;">ĐỊNH LUẬT VẬT LÝ</div>
        <div class="cm-head" style="font-size:28px;margin-top:4px;">DÙNG LÂU DÀI 100% NẾP GẬP SẼ RÕ LÊN · KHÔNG THỂ MỜ MÃI MÃI!</div>
      </div>
    </div>
  </div>
`;

const s19Js = `
  tl.fromTo("#s19-praise", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 1.00);
  // "Tuy nhiên nó lại đi kèm nhiều lỗi khác liên quan đến bản lề dễ khiến màn hình bị hỏng hơn" (1234.66s = 25.86s local)
  tl.fromTo("#s19-fault", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 25.80);

  // Switch to Phase B (100% Motion Hinge X-Ray) at 36.60s (1245.40s global: "Và cái này thì Apple cũng đã confirm đó là lỗi rồi, sửa chữa thay thế vẫn tốn tiền")
  tl.to("#s19-broll-1", { opacity: 0, duration: 0.30 }, 36.30);
  tl.to("#s19-full-hinge", { opacity: 1, duration: 0.38, ease: "power2.out" }, 36.60);
  tl.to("#s19-hinge-left", { opacity: 1, duration: 0.45, ease: "power2.out" }, 37.00);
  // "Cá nhân tôi kể từ khi biết có cái lỗi này thì tôi đã cực kỳ ngại mở con máy này ra luôn" (1254.34s = 45.54s local)
  tl.to("#s19-hinge-right", { opacity: 1, duration: 0.48, ease: "power2.out" }, 45.50);

  // Switch to Phase C (B-roll Physical Law) at 62.20s (1271.00s global: "Còn nếu anh em sử dụng về lâu về dài thì câu chuyện nếp gập chắc chắn 100% sẽ rõ lên")
  tl.to("#s19-full-hinge", { opacity: 0, duration: 0.30 }, 61.90);
  tl.to("#s19-broll-2", { opacity: 1, duration: 0.38, ease: "power2.out" }, 62.20);
`;

writeFileSync(join(compDir, 'scene-19.html'), wrapSubComp('scene-19', s19Css, s19Html, s19Js));

// ============================================================================
// SCENE 20 (1289.80s - 1374.10s, dur 84.30s):
// Đa nhiệm chia đôi màn hình "Trang bị cho có" vs Điểm sáng ứng dụng Canva & LaziBook tràn viền
// - 0.00s - 35.00s (1289.80s - 1324.80s): B-roll Split-Screen Multitasking Overlay
// - 35.00s - 50.23s (1324.80s - 1340.03s): 100% Motion Graphics (Multitasking Window Manager Comparison)
// - 50.23s - 84.30s (1340.03s - 1374.10s): B-roll Canva & LaziBook + A-roll Overlay
// ============================================================================
const s20Css = `
  .s20-layer { position: absolute; inset: 0; }
  #s20-broll-1 { z-index: 6; }
  #s20-full-multi { z-index: 7; opacity: 0; pointer-events: none; }
  #s20-broll-2 { z-index: 8; opacity: 0; pointer-events: none; }
`;

const s20Html = `
  <!-- PHASE A: B-ROLL MULTITASKING OVERLAY (0.00s - 25.00s) -->
  <div id="s20-broll-1" class="s20-layer">
    <div style="position:absolute;top:48px;left:48px;width:540px;display:flex;flex-direction:column;gap:12px;">
      <div class="cm-kicker">PHẦN MỀM ĐA NHIỆM // CHIA ĐÔI 2 ỨNG DỤNG</div>
      <div id="s20-m1" class="cm-card-cream cm-shadow-featured" style="padding:18px 22px;">
        <div class="cm-mono" style="font-size:16px;color:#E85A1F;">ĐA NHIỆM TRÊN MÀN HÌNH TRONG</div>
        <div id="s20-l1" class="cm-head" style="font-size:26px;margin-top:6px;opacity:0;">✕ KHÔNG RESIZE ĐƯỢC KÍCH THƯỚC CỬA SỔ</div>
        <div id="s20-l2" class="cm-head" style="font-size:26px;margin-top:6px;opacity:0;">✕ KHÔNG MỞ ĐƯỢC 3–4 APP NHƯ ANDROID</div>
        <div id="s20-l3" class="cm-head" style="font-size:26px;color:#E85A1F;margin-top:6px;opacity:0;">→ CHỈ ĐƯỢC TRANG BỊ "CHO CÓ" MÀ THÔI! ✕</div>
      </div>
    </div>
  </div>

  <!-- PHASE B: 100% MOTION GRAPHICS - MULTITASKING WINDOW SORTER (25.00s - 50.23s) -->
  <div id="s20-full-multi" class="s20-layer">
    <div class="cm-full-ground"></div>
    <div class="cm-corner tl"></div>
    <div class="cm-corner tr"></div>
    <div class="cm-corner bl"></div>
    <div class="cm-corner br"></div>

    <div style="position:absolute;top:44px;left:64px;right:64px;">
      <div class="cm-kicker">SO SÁNH ĐA NHIỆM // IPHONE DUO VS ĐIỆN THOẠI GẬP ANDROID</div>
      <div class="cm-head" style="font-size:44px;margin-top:10px;">KHÔNG TẬN DỤNG ĐƯỢC TOÀN BỘ KHÔNG GIAN MÀN HÌNH HƠN 7 INCH!</div>
    </div>

    <div class="cm-card-cream cm-shadow-featured" style="position:absolute;top:195px;left:64px;width:1792px;height:790px;padding:30px 38px;">
      <svg viewBox="0 0 1700 700" width="100%" height="700" fill="none">
        <!-- Left: iPhone Duo Split Screen -->
        <g id="s20-multi-left" opacity="0">
          <rect x="30" y="30" width="800" height="640" fill="#F06CA8" stroke="#0F0F0F" stroke-width="5"/>
          <text x="430" y="90" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="34" font-weight="900">CHIA MÀN HÌNH IPHONE DUO ✕</text>
          <rect x="85" y="135" width="690" height="390" fill="#0F0F0F" stroke="#0F0F0F" stroke-width="5"/>
          <!-- Lost Sidebars -->
          <rect x="85" y="135" width="75" height="390" fill="#E85A1F"/>
          <rect x="700" y="135" width="75" height="390" fill="#E85A1F"/>
          <!-- 2 Fixed Apps -->
          <rect x="165" y="145" width="260" height="370" fill="#EFE9D9"/>
          <rect x="435" y="145" width="260" height="370" fill="#E4DCC4"/>
          <text x="295" y="335" text-anchor="middle" fill="#0F0F0F" font-family="JetBrains Mono" font-size="22" font-weight="800">APP 01 (CỐ ĐỊNH)</text>
          <text x="565" y="335" text-anchor="middle" fill="#0F0F0F" font-family="JetBrains Mono" font-size="22" font-weight="800">APP 02 (CỐ ĐỊNH)</text>
          <text x="430" y="590" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="26" font-weight="900">Mất 2 dải cạnh bên · Không chỉnh được tỉ lệ cửa sổ!</text>
        </g>

        <!-- Right: Android Fold Multi-Window -->
        <g id="s20-multi-right" opacity="0">
          <rect x="870" y="30" width="800" height="640" fill="#136636" stroke="#0F0F0F" stroke-width="5"/>
          <text x="1270" y="90" text-anchor="middle" fill="#EFE9D9" font-family="Be Vietnam Pro" font-size="34" font-weight="900">ĐA NHIỆM GẬP ANDROID ✓</text>
          <rect x="925" y="135" width="690" height="390" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
          <rect x="935" y="145" width="410" height="370" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
          <rect x="1355" y="145" width="250" height="180" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="4"/>
          <rect x="1355" y="335" width="250" height="180" fill="#F06CA8" stroke="#0F0F0F" stroke-width="4"/>
          <text x="1140" y="320" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="23" font-weight="900">RESIZE TỰ DO</text>
          <text x="1140" y="355" text-anchor="middle" fill="#136636" font-family="Be Vietnam Pro" font-size="23" font-weight="900">+ MỞ 3–4 APP CÙNG LÚC ✓</text>
          <text x="1270" y="590" text-anchor="middle" fill="#F5C518" font-family="Be Vietnam Pro" font-size="26" font-weight="900">Tận dụng trọn vẹn 100% diện tích màn hình gập</text>
        </g>
      </svg>
    </div>
  </div>

  <!-- PHASE C: CANVA & LAZIBOOK FULL-BLEED SHOWCASE OVERLAY (50.23s - 84.30s) -->
  <div id="s20-broll-2" class="s20-layer">
    <div style="position:absolute;top:48px;left:48px;width:540px;display:flex;flex-direction:column;gap:12px;">
      <div class="cm-kicker">ĐIỂM SÁNG HIẾM HOI // APP TỐI ƯU TỐT</div>
      <div id="s20-c1" class="cm-card-green cm-shadow-featured" style="padding:18px 22px;">
        <div class="cm-mono-dark-pill">ỨNG DỤNG CANVA &amp; LAZIBOOK</div>
        <div class="cm-head" style="font-size:28px;color:#EFE9D9;margin-top:6px;">ẨN THANH THÔNG BÁO · HIỂN THỊ TRÀN HẾT RA BÊN NGOÀI ✓</div>
      </div>
      <div id="s20-c2" class="cm-card-yellow cm-shadow-ink" style="padding:16px 22px;opacity:0;">
        <div class="cm-mono" style="font-size:16px;">KỲ VỌNG TƯƠNG LAI</div>
        <div class="cm-head" style="font-size:24px;margin-top:4px;">MONG APPLE CỞI MỞ HƠN ĐỂ DEVELOPER ĐẶT PHÍM LÊN TRÊN/DƯỚI ✓</div>
      </div>
    </div>
  </div>
`;

const s20Js = `
  tl.fromTo("#s20-m1", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 0.80);
  // "không thể nào resize kích thước ứng dụng" (1298.62s = 9.02s local)
  tl.fromTo("#s20-l1", { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42, ease: "power2.out" }, 9.00);
  // "không thể mở được 3 hay 4 ứng dụng cùng lúc giống như Android" (1303.76s = 14.16s local)
  tl.fromTo("#s20-l2", { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42, ease: "power2.out" }, 14.10);
  // "chỉ được gọi là trang bị cho có mà thôi" (1310.16s = 20.56s local)
  tl.fromTo("#s20-l3", { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42, ease: "power2.out" }, 20.50);

  // Switch to Phase B (100% Motion Multitasking Sorter) at 25.70s (1315.30s global: "Hơn nữa việc sử dụng cùng lúc hai ứng dụng thì kiểu gì cũng bị mất đi hai phần bên hông...")
  tl.to("#s20-broll-1", { opacity: 0, duration: 0.30 }, 25.40);
  tl.to("#s20-full-multi", { opacity: 1, duration: 0.38, ease: "power2.out" }, 25.70);
  tl.to("#s20-multi-left", { opacity: 1, duration: 0.45, ease: "power2.out" }, 26.10);
  // "không tận dụng được toàn bộ không gian của cái màn hình hơn 7 inch này" (1323.60s = 34.00s local)
  tl.to("#s20-multi-right", { opacity: 1, duration: 0.48, ease: "power2.out" }, 34.00);

  // Switch to Phase C (Canva & LaziBook B-roll) at 43.90s (1333.50s global: "Mặc dù vậy sẽ có vài những ứng dụng được tối ưu khá tốt, ví dụ như ứng dụng Canva...")
  tl.to("#s20-full-multi", { opacity: 0, duration: 0.30 }, 43.60);
  tl.to("#s20-broll-2", { opacity: 1, duration: 0.38, ease: "power2.out" }, 43.90);
  // "nên tôi hy vọng là Apple sẽ cởi mở hơn cho các nhà phát triển" (1351.14s = 61.54s local)
  tl.fromTo("#s20-c2", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 61.50);
`;

writeFileSync(join(compDir, 'scene-20.html'), wrapSubComp('scene-20', s20Css, s20Html, s20Js));

// ============================================================================
// SCENE 21 (1374.10s - 1509.37s, dur 135.27s):
// Đánh giá 2 Camera sau 48MP (= iPhone 17): Đủ sáng nịnh mắt, Thiếu sáng giảm flare nhưng hơi lệch màu; Quay 4K60 mượt nhưng thiếu Apple Log / ProRes
// - 0.00s - 68.60s (1374.10s - 1442.70s): Camera B-roll & Photo Samples + Compact Top-Left Optical Card
// - 68.60s - 100.77s (1442.70s - 1474.87s): 4K60 Video Samples + Top-Left Video Gauge
// - 100.77s - 121.40s (1474.87s - 1495.50s): 100% Motion Graphics (Pro-Codec Gatekeeper: No Apple Log / ProRes)
// - 121.40s - 135.27s (1495.50s - 1509.37s): A-roll Outer Screen Preview Overlay
// ============================================================================
const s21Css = `
  .s21-layer { position: absolute; inset: 0; }
  #s21-photo-hud { z-index: 6; }
  #s21-video-hud { z-index: 7; opacity: 0; pointer-events: none; }
  #s21-full-codec { z-index: 8; opacity: 0; pointer-events: none; }
  #s21-preview-hud { z-index: 9; opacity: 0; pointer-events: none; }
`;

const s21Html = `
  <!-- PHASE A: PHOTO SAMPLES COMPACT TOP-LEFT HUD (0.00s - 68.60s) -->
  <div id="s21-photo-hud" class="s21-layer">
    <div style="position:absolute;top:36px;left:40px;width:460px;display:flex;flex-direction:column;gap:10px;">
      <div class="cm-kicker" style="font-size:17px;padding:6px 14px;">2 CAMERA SAU 48MP // Y HỆT IPHONE 17</div>
      <div id="s21-p1" class="cm-card-cream cm-shadow-ink" style="padding:14px 18px;opacity:0;">
        <div class="cm-mono" style="font-size:15px;color:#136636;">ĐỦ SÁNG: MÀU NỊNH MẮT HƠN ✓</div>
        <div class="cm-body" style="font-size:17px;margin-top:4px;">Không còn quá gai, tiệm cận gu màu nịnh mắt của Android.</div>
      </div>
      <div id="s21-p2" class="cm-card-yellow cm-shadow-ink" style="padding:14px 18px;opacity:0;">
        <div class="cm-mono" style="font-size:15px;">THIẾU SÁNG &amp; PHƠI SÁNG ĐÊM</div>
        <div class="cm-head" style="font-size:21px;margin-top:4px;">ĐẨY SÁNG &amp; GIẢM FLARE ĐÈN TỐT ✓</div>
      </div>
      <div id="s21-p3" class="cm-card-pink cm-shadow-ink" style="padding:14px 18px;opacity:0;">
        <div class="cm-mono" style="font-size:15px;">NHƯỢC ĐIỂM PHƠI SÁNG ĐÊM</div>
        <div class="cm-head" style="font-size:20px;margin-top:4px;">HƠI LỆCH MÀU NỀN TRỜI · NHƯNG TỔNG THỂ ÍT NOISE ✓</div>
      </div>
    </div>
  </div>

  <!-- PHASE B: 4K60 VIDEO SAMPLES TOP-LEFT HUD (68.60s - 106.40s) -->
  <div id="s21-video-hud" class="s21-layer">
    <div style="position:absolute;top:36px;left:40px;width:480px;display:flex;flex-direction:column;gap:10px;">
      <div class="cm-kicker" style="font-size:17px;padding:6px 14px;">TEST QUAY VIDEO // 4K 60FPS THỰC TẾ</div>
      <div id="s21-v1" class="cm-card-green cm-shadow-featured" style="padding:16px 20px;">
        <div class="cm-mono-dark-pill">QUAY ĐỦ SÁNG</div>
        <div class="cm-head" style="font-size:24px;color:#EFE9D9;margin-top:6px;">4K 60FPS CHUYỂN ỐNG KÍNH &amp; CHỐNG RUNG CỰC MƯỢT ✓</div>
      </div>
      <div id="s21-v2" class="cm-card-cream cm-shadow-ink" style="padding:14px 18px;opacity:0;">
        <div class="cm-mono" style="font-size:15px;color:#136636;">QUAY THIẾU SÁNG BAN ĐÊM</div>
        <div class="cm-head" style="font-size:22px;margin-top:4px;">HẠN CHẾ FLARE ÁNH ĐÈN &amp; GIẢM NOISE KHÁ NHIỀU ✓</div>
      </div>
    </div>
  </div>

  <!-- PHASE C: 100% MOTION GRAPHICS - PRO CODEC GATEKEEPER (106.40s - 121.40s) -->
  <div id="s21-full-codec" class="s21-layer">
    <div class="cm-full-ground"></div>
    <div class="cm-corner tl"></div>
    <div class="cm-corner tr"></div>
    <div class="cm-corner bl"></div>
    <div class="cm-corner br"></div>

    <div style="position:absolute;top:44px;left:64px;right:64px;">
      <div class="cm-kicker">CỔNG KIỂM SOÁT CHẾ ĐỘ QUAY VIDEO // CẮT GIẢM TÍNH NĂNG PRO</div>
      <div class="cm-head" style="font-size:44px;margin-top:10px;">MÁY 65 TRIỆU NHƯNG KHÔNG CÓ APPLE LOG &amp; KHÔNG CÓ PRORES! ✕</div>
    </div>

    <div class="cm-card-cream cm-shadow-featured" style="position:absolute;top:195px;left:64px;width:1792px;height:790px;padding:30px 38px;">
      <svg viewBox="0 0 1700 700" width="100%" height="700" fill="none">
        <!-- Left: Allowed Standard Modes -->
        <g id="s21-codec-left" opacity="0">
          <rect x="40" y="40" width="760" height="620" fill="#136636" stroke="#0F0F0F" stroke-width="5"/>
          <text x="420" y="105" text-anchor="middle" fill="#F5C518" font-family="JetBrains Mono" font-size="22" font-weight="800">CHẾ ĐỘ ĐƯỢC TRANG BỊ TRÊN IPHONE DUO</text>
          <rect x="95" y="155" width="650" height="190" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
          <text x="420" y="235" text-anchor="middle" fill="#136636" font-family="Be Vietnam Pro" font-size="34" font-weight="900">✓ QUAY MẶC ĐỊNH 4K 60FPS</text>
          <text x="420" y="285" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="24" font-weight="700">Chuyển ống kính mượt · Ít flare ánh đèn</text>
          <rect x="95" y="385" width="650" height="190" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
          <text x="420" y="465" text-anchor="middle" fill="#136636" font-family="Be Vietnam Pro" font-size="29" font-weight="900">✓ QUAY VIDEO ĐIỆN ẢNH (CINEMATIC)</text>
          <text x="420" y="515" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="24" font-weight="700">Phục vụ nhu cầu quay cơ bản hàng ngày</text>
        </g>

        <!-- Right: Blocked Pro Modes -->
        <g id="s21-codec-right" opacity="0">
          <rect x="900" y="40" width="760" height="620" fill="#F06CA8" stroke="#0F0F0F" stroke-width="5"/>
          <text x="1280" y="105" text-anchor="middle" fill="#0F0F0F" font-family="JetBrains Mono" font-size="22" font-weight="800">CHẾ ĐỘ CHUYÊN NGHIỆP BỊ CẮT BỎ ✕</text>
          <rect x="955" y="155" width="650" height="190" fill="#0F0F0F" stroke="#0F0F0F" stroke-width="5"/>
          <text x="1280" y="240" text-anchor="middle" fill="#E85A1F" font-family="Be Vietnam Pro" font-size="36" font-weight="900">✕ KHÔNG CÓ APPLE LOG</text>
          <text x="1280" y="290" text-anchor="middle" fill="#EFE9D9" font-family="Be Vietnam Pro" font-size="22" font-weight="700">Không thể hậu kỳ chỉnh màu chuyên sâu</text>
          <rect x="955" y="385" width="650" height="190" fill="#0F0F0F" stroke="#0F0F0F" stroke-width="5"/>
          <text x="1280" y="470" text-anchor="middle" fill="#E85A1F" font-family="Be Vietnam Pro" font-size="36" font-weight="900">✕ KHÔNG CÓ PRORES</text>
          <text x="1280" y="520" text-anchor="middle" fill="#EFE9D9" font-family="Be Vietnam Pro" font-size="22" font-weight="700">Thiếu vắng hoàn toàn chuẩn quay dòng Pro</text>
        </g>
      </svg>
    </div>
  </div>

  <!-- PHASE D: OUTER PREVIEW OVERLAY (121.40s - 135.27s) -->
  <div id="s21-preview-hud" class="s21-layer">
    <div style="position:absolute;bottom:48px;left:48px;width:560px;">
      <div class="cm-card-cream cm-shadow-featured" style="padding:18px 22px;">
        <div class="cm-mono" style="font-size:16px;">TÍNH NĂNG BỔ SUNG</div>
        <div class="cm-head" style="font-size:26px;margin-top:4px;">TỰ ĐỘNG CHỤP KHI VÀO DÁNG &amp; BẬT PREVIEW MÀN HÌNH NGOÀI ✓</div>
      </div>
    </div>
  </div>
`;

const s21Js = `
  // "trong điều kiện đủ sáng... màu sắc không còn quá gai, bắt đầu nịnh mắt hơn" (1393.16s = 22.66s local)
  tl.fromTo("#s21-p1", { x: -36, opacity: 0 }, { x: 0, opacity: 1, duration: 0.48, ease: "power2.out" }, 23.00);
  // "trong điều kiện thiếu sáng... đẩy sáng nhiều hơn, giảm flare ánh đèn" (1407.78s = 37.28s local)
  tl.fromTo("#s21-p2", { x: -36, opacity: 0 }, { x: 0, opacity: 1, duration: 0.48, ease: "power2.out" }, 37.30);
  // "nhưng đi kèm với đó bị lệch màu đi khá nhiều, nền trời đen chuyển sang xanh" (1425.14s = 54.64s local)
  tl.fromTo("#s21-p3", { x: -36, opacity: 0 }, { x: 0, opacity: 1, duration: 0.48, ease: "power2.out" }, 54.70);

  // Switch to Phase B (4K60 Video HUD) at 76.10s (1446.60s global: "Về khả năng quay video thì anh em quay video trong điều kiện đủ sáng...")
  tl.to("#s21-photo-hud", { opacity: 0, duration: 0.30 }, 75.80);
  tl.to("#s21-video-hud", { opacity: 1, duration: 0.38 }, 76.10);
  // "quay video trong điều kiện thiếu sáng... hạn chế flare và noise khá nhiều" (1460.38s = 89.88s local)
  tl.fromTo("#s21-v2", { x: -36, opacity: 0 }, { x: 0, opacity: 1, duration: 0.48, ease: "power2.out" }, 89.90);

  // Switch to Phase C (100% Motion Pro-Codec Gatekeeper) at 104.20s (1474.70s global: "Tuy nhiên hơi đáng tiếc... không có chế độ quay video chuyên nghiệp")
  tl.to("#s21-video-hud", { opacity: 0, duration: 0.30 }, 103.90);
  tl.to("#s21-full-codec", { opacity: 1, duration: 0.38, ease: "power2.out" }, 104.20);
  // "không có Apple Log, không có ProRes" (1479.10s = 108.60s local)
  tl.to("#s21-codec-right", { opacity: 1, duration: 0.45, ease: "power2.out" }, 108.50);
  // "chỉ có chế độ quay mặc định hoặc điện ảnh" (1483.88s = 113.38s local)
  tl.to("#s21-codec-left", { opacity: 1, duration: 0.45, ease: "power2.out" }, 113.40);

  // Switch to Phase D (Outer Preview HUD) at 117.40s (1487.90s global: "Và ngoài ra thì iPhone Duo cũng bổ sung một vài tính năng liên quan đến chụp ảnh...")
  tl.to("#s21-full-codec", { opacity: 0, duration: 0.30 }, 117.10);
  tl.to("#s21-preview-hud", { opacity: 1, duration: 0.38 }, 117.40);
`;

writeFileSync(join(compDir, 'scene-21.html'), wrapSubComp('scene-21', s21Css, s21Html, s21Js));

// ============================================================================
// SCENE 22 (1509.37s - 1568.30s, dur 58.93s):
// Hiệu năng Apple A20 Pro siêu mượt, Nhiệt độ mát mẻ & Lỗi ứng dụng AnTuTu không bấm test được
// [B-roll A20 Pro & AnTuTu + Animated SVG Silicon Die & Thermal Gauge + AnTuTu Bug Alert]
// ============================================================================
const s22Css = `
  #s22-left {
    position: absolute;
    top: 48px;
    left: 48px;
    width: 545px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
`;

const s22Html = `
  <div class="cm-stage">
    <div id="s22-left">
      <div class="cm-kicker">HIỆU NĂNG &amp; NHIỆT ĐỘ // CHIP APPLE A20 PRO</div>
      <div id="s22-chip-card" class="cm-card-cream cm-shadow-featured" style="padding:18px 22px;">
        <div class="cm-mono" style="font-size:16px;color:#136636;">VI XỬ LÝ THẾ HỆ MỚI</div>
        <div class="cm-head" style="font-size:32px;margin-top:4px;" data-var-text="s22_chip_name">APPLE A20 PRO: SIÊU MƯỢT · MÁT MẺ ✓</div>
        <svg viewBox="0 0 490 150" width="100%" height="150" fill="none" style="margin-top:8px;">
          <!-- Chip Die SVG -->
          <rect x="15" y="15" width="140" height="120" fill="#0F0F0F" stroke="#136636" stroke-width="5"/>
          <rect x="35" y="35" width="100" height="80" fill="#136636" stroke="#F5C518" stroke-width="3"/>
          <text x="85" y="82" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono" font-size="20" font-weight="800">A20 PRO</text>
          <!-- Thermal Bar -->
          <g id="s22-thermal-group" opacity="0">
            <rect x="180" y="25" width="295" height="44" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="4"/>
            <rect x="184" y="29" width="287" height="36" fill="#136636"/>
            <text x="327" y="52" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono" font-size="13" font-weight="800">NHIỆT ĐỘ: MÁT MẺ NGOÀI NẮNG ✓</text>
          </g>
          <rect x="180" y="82" width="295" height="44" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
          <text x="327" y="109" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="15.5" font-weight="900">Không giật lag · Dùng lâu dài yên tâm</text>
        </svg>
      </div>

      <div id="s22-antutu-card" class="cm-card-pink cm-shadow-ink" style="padding:18px 22px;opacity:0;">
        <div class="cm-mono" style="font-size:16px;">LỖI TƯƠNG THÍCH ỨNG DỤNG</div>
        <div class="cm-head" style="font-size:28px;margin-top:4px;">APP ANTUTU LỖI HIỂN THỊ · KHÔNG BẤM TEST ĐƯỢC ĐIỂM SỐ! ✕</div>
        <div class="cm-body" style="font-size:18px;margin-top:6px;">Lại tiếp tục phải chờ các nhà phát triển cập nhật tối ưu trong tương lai.</div>
      </div>
    </div>
  </div>
`;

const s22Js = `
  tl.fromTo("#s22-chip-card", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 0.60);
  // "đánh giá cao về câu chuyện nhiệt độ... ngoài trời nắng không quá nóng" (1524.56s = 15.36s local)
  tl.to("#s22-thermal-group", { opacity: 1, duration: 0.45, ease: "power2.out" }, 15.40);
  // "Hơi tiếc một tí đấy chính là ứng dụng AnTuTu đang bị lỗi hiển thị, không ấn được để test điểm số" (1535.96s = 26.76s local)
  tl.fromTo("#s22-antutu-card", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 26.80);
`;

writeFileSync(join(compDir, 'scene-22.html'), wrapSubComp('scene-22', s22Css, s22Html, s22Js));

// ============================================================================
// SCENE 23 (1568.30s - 1613.17s, dur 44.87s):
// Pin >4.800mAh rất trâu trụ trọn 1 ngày & Loa ngoài bật 100% bị rè (chỉ 80-90% mới ổn) + Live Speaker Test
// - 0.00s - 21.43s (1568.30s - 1589.73s): 100% Motion Graphics (4800mAh Battery X-Ray & Speaker Distortion Waveform)
// - 21.43s - 44.87s (1589.73s - 1613.17s): Live Speaker Test B-roll + A-roll Spectrum HUD Overlay
// ============================================================================
const s23Css = `
  .s23-layer { position: absolute; inset: 0; }
  #s23-full-bat { z-index: 6; }
  #s23-broll-speaker { z-index: 7; opacity: 0; pointer-events: none; }
`;

const s23Html = `
  <!-- PHASE A: 100% MOTION GRAPHICS - BATTERY & SPEAKER WAVEFORM (0.00s - 21.43s) -->
  <div id="s23-full-bat" class="s23-layer">
    <div class="cm-full-ground"></div>
    <div class="cm-corner tl"></div>
    <div class="cm-corner tr"></div>
    <div class="cm-corner bl"></div>
    <div class="cm-corner br"></div>

    <div style="position:absolute;top:44px;left:64px;right:64px;">
      <div class="cm-kicker">THỜI LƯỢNG PIN &amp; ÂM THANH LOA NGOÀI // KIỂM ĐỊNH THỰC TẾ</div>
      <div class="cm-head" style="font-size:44px;margin-top:10px;">PIN &gt;4.800mAh RẤT TRÂU ✓ · NHƯNG LOA BẬT 100% BỊ HƠI RÈ! ✕</div>
    </div>

    <div class="cm-card-cream cm-shadow-featured" style="position:absolute;top:195px;left:64px;width:1792px;height:790px;padding:30px 38px;">
      <svg viewBox="0 0 1700 700" width="100%" height="700" fill="none">
        <!-- Left: 4800mAh Battery Cross-Section -->
        <g id="s23-bat-left" opacity="0">
          <rect x="30" y="30" width="790" height="640" fill="#136636" stroke="#0F0F0F" stroke-width="5"/>
          <text x="425" y="90" text-anchor="middle" fill="#F5C518" font-family="JetBrains Mono" font-size="22" font-weight="800">DUNG LƯỢNG PIN // HƠN 4.800 mAh</text>
          <text x="425" y="145" text-anchor="middle" fill="#EFE9D9" font-family="Be Vietnam Pro" font-size="36" font-weight="900">PIN RẤT TRÂU · TRỤ TRỌN 1 NGÀY ✓</text>
          <!-- Battery Body -->
          <rect x="135" y="195" width="540" height="240" fill="#0F0F0F" stroke="#EFE9D9" stroke-width="6"/>
          <rect x="675" y="265" width="32" height="100" fill="#EFE9D9"/>
          <rect id="s23-bat-fill" x="150" y="210" width="510" height="210" fill="#2EE58D"/>
          <text x="405" y="330" text-anchor="middle" fill="#0F0F0F" font-family="Archivo Black" font-size="64">&gt;4.800 mAh</text>
          <rect x="95" y="475" width="660" height="140" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
          <text x="425" y="535" text-anchor="middle" fill="#136636" font-family="Be Vietnam Pro" font-size="28" font-weight="900">ĐA TÁC VỤ HỖN HỢP TRỌN VẸN 1 NGÀY</text>
          <text x="425" y="580" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="22" font-weight="700">Chơi game + Quay video 4K60 + Chụp ảnh liên tục</text>
        </g>

        <!-- Right: Speaker Distortion Oscilloscope -->
        <g id="s23-spk-right" opacity="0">
          <rect x="880" y="30" width="790" height="640" fill="#F06CA8" stroke="#0F0F0F" stroke-width="5"/>
          <text x="1275" y="90" text-anchor="middle" fill="#0F0F0F" font-family="JetBrains Mono" font-size="22" font-weight="800">CHẤT LƯỢNG LOA NGOÀI // SO VỚI IPHONE KHÁC</text>
          <text x="1275" y="145" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="34" font-weight="900">BẬT MAX 100% ÂM LƯỢNG BỊ HƠI RÈ! ✕</text>
          <rect x="935" y="195" width="680" height="190" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
          <text x="1275" y="245" text-anchor="middle" fill="#136636" font-family="JetBrains Mono" font-size="20" font-weight="800">MỨC ÂM LƯỢNG 80% – 90%: NGHE ỔN ✓</text>
          <path d="M 980 320 Q 1030 260, 1080 320 T 1180 320 T 1280 320 T 1380 320 T 1480 320 T 1580 320" stroke="#136636" stroke-width="7" fill="none"/>
        </g>
        <g id="s23-spk-100" opacity="0">
          <rect x="935" y="420" width="680" height="195" fill="#0F0F0F" stroke="#0F0F0F" stroke-width="5"/>
          <text x="1275" y="470" text-anchor="middle" fill="#E85A1F" font-family="JetBrains Mono" font-size="20" font-weight="800">MỨC ÂM LƯỢNG 100%: BẮT ĐẦU RÈ RÈ ✕</text>
          <polyline points="980,550 1010,495 1040,585 1070,490 1100,590 1130,495 1160,585 1190,490 1220,590 1250,495 1280,585 1310,490 1340,590 1370,495 1400,585 1430,490 1460,590 1490,495 1520,585 1560,540" stroke="#E85A1F" stroke-width="6" fill="none"/>
        </g>
      </svg>
    </div>
  </div>

  <!-- PHASE B: LIVE SPEAKER TEST B-ROLL HUD (21.43s - 44.87s) -->
  <div id="s23-broll-speaker" class="s23-layer">
    <div style="position:absolute;top:42px;left:48px;width:520px;">
      <div class="cm-card-yellow cm-shadow-featured" style="padding:16px 22px;">
        <div class="cm-mono" style="font-size:16px;">TEST ÂM THANH THỰC TẾ // LOA NGOÀI</div>
        <div class="cm-head" style="font-size:26px;margin-top:4px;">MỞ 100% HƠI RÈ · NÊN ĐỂ MỨC 80% – 90%!</div>
      </div>
    </div>
  </div>
`;

const s23Js = `
  // "Về pin thì cá nhân tôi đánh giá là pin của iPhone Duo rất trâu nha" (1552.34s = 0.04s local)
  tl.to("#s23-bat-left", { opacity: 1, duration: 0.45, ease: "power2.out" }, 0.40);
  // "Về loa thì trước đây cá nhân tôi rất thích loa trên iPhone nha, nhưng loa trên iPhone Duo không còn quá hay" (1568.22s = 15.92s local)
  tl.to("#s23-spk-right", { opacity: 1, duration: 0.45, ease: "power2.out" }, 15.90);
  // "khi bật lên 100% bắt đầu xảy ra hiện tượng hơi rè rè" (1579.24s = 26.94s local)
  tl.to("#s23-spk-100", { opacity: 1, duration: 0.45, ease: "power2.out" }, 26.90);

  // Switch to Phase B (Live Speaker Test B-roll) at 37.20s (1589.50s global)
  tl.to("#s23-full-bat", { opacity: 0, duration: 0.30 }, 36.90);
  tl.to("#s23-broll-speaker", { opacity: 1, duration: 0.38, ease: "power2.out" }, 37.20);
`;

writeFileSync(join(compDir, 'scene-23.html'), wrapSubComp('scene-23', s23Css, s23Html, s23Js));

// ============================================================================
// SCENE 24 (1613.17s - 1640.03s, dur 26.86s):
// Quan điểm "Không mua vì lời hứa" & Trải nghiệm thực tế tại hệ thống CellphoneS
// Note: Stops at 1640.03s so 1640.03s-1654.53s CellphoneS Website is 100% Pass-through!
// - 0.00s - 14.50s (1613.17s - 1627.67s): 100% Motion Graphics ("Không mua vì lời hứa" Stamp & CellphoneS Gate)
// - 14.50s - 26.86s (1627.67s - 1640.03s): A-roll CellphoneS Callout Overlay
// ============================================================================
const s24Css = `
  .s24-layer { position: absolute; inset: 0; }
  #s24-intro-aroll { z-index: 5; }
  #s24-full-verdict { z-index: 6; opacity: 0; pointer-events: none; }
  #s24-aroll { z-index: 7; opacity: 0; pointer-events: none; }
`;

const s24Html = `
  <!-- PHASE A0: INTRO WRAP-UP OVERLAY (0.00s - 11.20s = 1606.20s - 1617.40s) -->
  <div id="s24-intro-aroll" class="s24-layer">
    <div style="position:absolute;top:48px;left:48px;width:540px;">
      <div id="s24-intro-card" class="cm-card-cream cm-shadow-featured" style="padding:18px 22px;opacity:0;">
        <div class="cm-mono" style="font-size:16px;color:#136636;">ĐÚC KẾT TRẢI NGHIỆM THỰC TẾ</div>
        <div class="cm-head" style="font-size:28px;margin-top:4px;">VIDEO REVIEW DÀI NHẤT &amp; CHI TIẾT NHẤT TRÊN KÊNH! ✓</div>
      </div>
    </div>
  </div>

  <!-- PHASE A: 100% MOTION GRAPHICS - KHÔNG MUA VÌ LỜI HỨA (11.20s - 24.60s = 1617.40s - 1630.80s) -->
  <div id="s24-full-verdict" class="s24-layer">
    <div class="cm-full-ground"></div>
    <div class="cm-corner tl"></div>
    <div class="cm-corner tr"></div>
    <div class="cm-corner bl"></div>
    <div class="cm-corner br"></div>

    <div style="position:absolute;top:44px;left:64px;right:64px;">
      <div class="cm-kicker">ĐÚC KẾT QUAN ĐIỂM CÁ NHÂN // VIDEO DÀI NHẤT TRÊN KÊNH</div>
      <div class="cm-head" style="font-size:48px;margin-top:10px;" data-var-text="s24_principle">QUAN ĐIỂM RÕ RÀNG: "KHÔNG MUA VÌ LỜI HỨA!"</div>
    </div>

    <div class="cm-card-cream cm-shadow-featured" style="position:absolute;top:195px;left:64px;width:1792px;height:790px;padding:32px 40px;">
      <svg viewBox="0 0 1700 700" width="100%" height="700" fill="none">
        <g id="s24-v-left" opacity="0">
          <rect x="40" y="35" width="770" height="630" fill="#F06CA8" stroke="#0F0F0F" stroke-width="6"/>
          <rect x="80" y="70" width="460" height="44" fill="#0F0F0F"/>
          <text x="310" y="99" text-anchor="middle" fill="#F5C518" font-family="JetBrains Mono" font-size="20" font-weight="800">NẾU PHẢI BỎ TIỀN TÚI 65 TRIỆU</text>
          <text x="425" y="235" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="44" font-weight="900">CHẮC CHẮN TÔI SẼ</text>
          <text x="425" y="295" text-anchor="middle" fill="#E85A1F" font-family="Be Vietnam Pro" font-size="48" font-weight="900">KHÔNG XUỐNG TIỀN MUA! ✕</text>
          <rect x="90" y="365" width="670" height="230" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
          <text x="425" y="450" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="30" font-weight="900">"KHÔNG MUA VÌ LỜI HỨA TƯƠNG LAI"</text>
          <text x="425" y="510" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="21.5" font-weight="700">Mọi trải nghiệm phải hoàn thiện xứng đáng ngay lúc trả tiền</text>
        </g>

        <g id="s24-v-right" opacity="0">
          <rect x="890" y="35" width="770" height="630" fill="#F5C518" stroke="#0F0F0F" stroke-width="6"/>
          <rect x="930" y="70" width="480" height="44" fill="#0F0F0F"/>
          <text x="1170" y="99" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono" font-size="20" font-weight="800">ĐƠN VỊ CHO MƯỢN MÁY TRẢI NGHIỆM</text>
          <text x="1275" y="235" text-anchor="middle" fill="#0F0F0F" font-family="Archivo Black" font-size="64">CELLPHONES</text>
          <rect x="940" y="310" width="670" height="285" fill="#136636" stroke="#0F0F0F" stroke-width="5"/>
          <text x="1275" y="395" text-anchor="middle" fill="#F5C518" font-family="JetBrains Mono" font-size="22" font-weight="800">LỜI KHUYÊN CHO ANH EM QUAN TÂM:</text>
          <text x="1275" y="460" text-anchor="middle" fill="#EFE9D9" font-family="Be Vietnam Pro" font-size="30" font-weight="900">RA TẬN CỬA HÀNG CELLPHONES</text>
          <text x="1275" y="515" text-anchor="middle" fill="#EFE9D9" font-family="Be Vietnam Pro" font-size="30" font-weight="900">TRÊN TAY TRẢI NGHIỆM THỰC TẾ! ✓</text>
        </g>
      </svg>
    </div>
  </div>

  <!-- PHASE B: A-ROLL CELLPHONES OVERLAY (24.60s - 33.60s = 1630.80s - 1639.80s) -->
  <div id="s24-aroll" class="s24-layer">
    <div style="position:absolute;top:48px;left:48px;width:540px;">
      <div class="cm-card-yellow cm-shadow-featured" style="padding:18px 22px;">
        <div class="cm-mono" style="font-size:16px;">HỆ THỐNG BÁN LẺ // CELLPHONES</div>
        <div class="cm-head" style="font-size:28px;margin-top:4px;">GHÉ CỬA HÀNG TRÊN TAY THỬ TRƯỚC KHI QUYẾT ĐỊNH! ✓</div>
        <div class="cm-body" style="font-size:18px;margin-top:6px;">Đầy đủ phiên bản · Giá bán &amp; bảo hành rõ ràng · Link dưới mô tả.</div>
      </div>
    </div>
  </div>
`;

const s24Js = `
  tl.fromTo("#s24-intro-card", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 0.60);

  // Switch to Phase A ("quan điểm của tôi là không mua vì lời hứa!" at 1617.50s = 11.30s local)
  tl.to("#s24-intro-aroll", { opacity: 0, duration: 0.30 }, 10.90);
  tl.to("#s24-full-verdict", { opacity: 1, duration: 0.38, ease: "power2.out" }, 11.20);
  tl.to("#s24-v-left", { opacity: 1, duration: 0.45, ease: "power2.out" }, 11.50);
  // "bởi vì đơn giản đây là máy mà tôi mượn đến từ CellphoneS" (1625.20s = 19.00s local)
  tl.to("#s24-v-right", { opacity: 1, duration: 0.48, ease: "power2.out" }, 19.00);

  // Switch to Phase B (A-roll CellphoneS Store Experience) at 24.60s (1630.80s global)
  tl.to("#s24-full-verdict", { opacity: 0, duration: 0.30 }, 24.30);
  tl.to("#s24-aroll", { opacity: 1, duration: 0.38, ease: "power2.out" }, 24.60);
`;

writeFileSync(join(compDir, 'scene-24.html'), wrapSubComp('scene-24', s24Css, s24Html, s24Js));

// ============================================================================
// SCENE 25 (1654.53s - 1704.60s, dur 50.07s):
// Tổng kết cuối video: Chỉ đạt 70-80% tiêu chuẩn điện thoại gập (chừa đất bán iPhone Duo 2 / Duo 3) & Ai nên mua
// Note: Stops at 1704.60s so 1704.60s-1744.00s YouTube PiP End-Screen Outro is 100% Pass-through!
// - 0.00s - 21.70s (1654.53s - 1676.23s): Outdoor B-roll + 70-80% Completion Gauge Overlay
// - 21.70s - 36.50s (1676.23s - 1691.03s): 100% Motion Graphics CLOSING PLATE ON #136636 DARK GREEN
// - 36.50s - 50.07s (1691.03s - 1704.60s): Final B-roll Buyer Recommendation Overlay
// ============================================================================
const s25Css = `
  .s25-layer { position: absolute; inset: 0; }
  #s25-broll-1 { z-index: 6; }
  #s25-closing-green { z-index: 7; opacity: 0; pointer-events: none; }
  #s25-broll-2 { z-index: 8; opacity: 0; pointer-events: none; }
  #s25-pip-bar { z-index: 9; opacity: 0; pointer-events: none; }
`;

const s25Html = `
  <!-- PHASE A: OUTDOOR B-ROLL 70-80% GAUGE OVERLAY (0.00s - 21.80s = 1654.36s - 1676.16s) -->
  <div id="s25-broll-1" class="s25-layer">
    <div style="position:absolute;top:48px;left:48px;width:550px;display:flex;flex-direction:column;gap:12px;">
      <div class="cm-kicker">ĐÁNH GIÁ TỔNG KẾT // CHẤM ĐIỂM ĐỘ HOÀN THIỆN</div>
      <div id="s25-b1-c1" class="cm-card-yellow cm-shadow-ink" style="padding:16px 20px;">
        <div class="cm-mono" style="font-size:15px;">MỤC ĐÍCH CHÍNH CỦA APPLE</div>
        <div class="cm-head" style="font-size:24px;margin-top:4px;">TẠO SÓNG TRUYỀN THÔNG &amp; TRANH CÃI NHIỀU HƠN SẢN PHẨM!</div>
      </div>
      <div id="s25-b1-c2" class="cm-card-cream cm-shadow-featured" style="padding:18px 22px;opacity:0;">
        <div class="cm-mono" style="font-size:16px;">SO VỚI TIÊU CHUẨN ĐIỆN THOẠI GẬP</div>
        <div class="cm-head" style="font-size:32px;color:#E85A1F;margin-top:4px;" data-var-text="s25_score_stat">CHỈ ĐÁP ỨNG ĐƯỢC 70% – 80%!</div>
      </div>
    </div>
  </div>

  <!-- PHASE B: 100% MOTION GRAPHICS - DARK GREEN #136636 CLOSING PLATE (21.80s - 39.60s = 1676.16s - 1693.96s) -->
  <div id="s25-closing-green" class="s25-layer">
    <div class="cm-green-ground"></div>
    <div class="cm-corner tl" style="border-color:#EFE9D9;"></div>
    <div class="cm-corner tr" style="border-color:#EFE9D9;"></div>
    <div class="cm-corner bl" style="border-color:#EFE9D9;"></div>
    <div class="cm-corner br" style="border-color:#EFE9D9;"></div>

    <div style="position:absolute;top:44px;left:64px;right:64px;display:flex;justify-content:space-between;align-items:flex-start;">
      <div>
        <div class="cm-kicker">CHIẾN LƯỢC CỦA APPLE // LỘ TRÌNH THẾ HỆ TIẾP THEO</div>
        <div class="cm-head" style="font-size:36px;color:#EFE9D9;margin-top:10px;">HOÀN THIỆN QUÁ THÌ LÀM SAO BÁN ĐƯỢC IPHONE DUO 2 &amp; DUO 3?</div>
      </div>
      <div class="cm-badge-rot">
        <div class="cm-head" style="font-size:28px;">ĐỜI ĐẦU CÒN LỖI!</div>
      </div>
    </div>

    <div class="cm-card-cream cm-shadow-featured" style="position:absolute;top:195px;left:64px;width:1792px;height:790px;padding:30px 38px;">
      <svg viewBox="0 0 1700 700" width="100%" height="700" fill="none">
        <!-- Top Roadmap Pipeline: Duo 1 -> Duo 2 -> Duo 3 -->
        <g id="s25-rm-1" opacity="0">
          <rect x="30" y="30" width="500" height="280" fill="#F06CA8" stroke="#0F0F0F" stroke-width="5"/>
          <text x="280" y="95" text-anchor="middle" fill="#0F0F0F" font-family="JetBrains Mono" font-size="20" font-weight="800">THẾ HỆ 01 (HIỆN TẠI)</text>
          <text x="280" y="165" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="36" font-weight="900">IPHONE DUO (70–80%)</text>
          <text x="280" y="230" text-anchor="middle" fill="#E85A1F" font-family="Be Vietnam Pro" font-size="22" font-weight="800">Còn lỗi bản lề · Chờ tối ưu App</text>
        </g>

        <g id="s25-rm-2" opacity="0">
          <line x1="530" y1="170" x2="600" y2="170" stroke="#0F0F0F" stroke-width="8"/>
          <rect x="600" y="30" width="500" height="280" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
          <text x="850" y="95" text-anchor="middle" fill="#0F0F0F" font-family="JetBrains Mono" font-size="20" font-weight="800">THẾ HỆ 02 (TƯƠNG LAI)</text>
          <text x="850" y="165" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="36" font-weight="900">IPHONE DUO 2</text>
          <text x="850" y="230" text-anchor="middle" fill="#0F0F0F" font-family="Be Vietnam Pro" font-size="22" font-weight="800">Sửa dần lỗi phần cứng &amp; tỉ lệ</text>
        </g>

        <g id="s25-rm-3" opacity="0">
          <line x1="1100" y1="170" x2="1170" y2="170" stroke="#0F0F0F" stroke-width="8"/>
          <rect x="1170" y="30" width="500" height="280" fill="#136636" stroke="#0F0F0F" stroke-width="5"/>
          <text x="1420" y="95" text-anchor="middle" fill="#F5C518" font-family="JetBrains Mono" font-size="20" font-weight="800">THẾ HỆ 03 (HOÀN THIỆN)</text>
          <text x="1420" y="165" text-anchor="middle" fill="#EFE9D9" font-family="Be Vietnam Pro" font-size="36" font-weight="900">IPHONE DUO 3 ✓</text>
          <text x="1420" y="230" text-anchor="middle" fill="#EFE9D9" font-family="Be Vietnam Pro" font-size="22" font-weight="700">Lúc đó hệ sinh thái mới chín muồi</text>
        </g>

        <!-- Bottom Takeaway Box (1685.14s - 1693.92s) -->
        <g id="s25-buy-left" opacity="0">
          <rect x="30" y="360" width="1640" height="290" fill="#0F0F0F" stroke="#0F0F0F" stroke-width="5"/>
          <rect x="70" y="395" width="580" height="46" fill="#E85A1F"/>
          <text x="360" y="426" text-anchor="middle" fill="#EFE9D9" font-family="JetBrains Mono" font-size="20" font-weight="800">QUY LUẬT SẢN PHẨM THẾ HỆ ĐẦU TIÊN</text>
          <text x="850" y="515" text-anchor="middle" fill="#F5C518" font-family="Be Vietnam Pro" font-size="38" font-weight="900">KIỂU GÌ CŨNG PHẢI CÓ LỖI &amp; TỐN NHIỀU THỜI GIAN TỐI ƯU!</text>
          <text x="850" y="580" text-anchor="middle" fill="#EFE9D9" font-family="Be Vietnam Pro" font-size="26" font-weight="700">Hiện tại chưa phải là thời điểm thích hợp nhất để số đông xuống tiền mua iPhone Duo</text>
        </g>
      </svg>
    </div>
  </div>

  <!-- PHASE C: FINAL B-ROLL RECOMMENDATION OVERLAY (39.60s - 50.20s = 1693.96s - 1704.56s) -->
  <div id="s25-broll-2" class="s25-layer">
    <div style="position:absolute;top:48px;left:48px;width:580px;display:flex;flex-direction:column;gap:12px;">
      <div class="cm-kicker">AI CÓ THỂ MUA IPHONE DUO NGAY LÚC NÀY?</div>
      <div id="s25-b2-c1" class="cm-card-yellow cm-shadow-featured" style="padding:18px 24px;opacity:0;">
        <div class="cm-mono" style="font-size:16px;">DÀNH CHO NGƯỜI THÍCH TRẢI NGHIỆM SỚM</div>
        <div class="cm-head" style="font-size:28px;margin-top:4px;">MUA VÌ THÍCH CÁI MỚI · DƯ DẢ TÀI CHÍNH (65 TRIỆU)!</div>
      </div>
    </div>
  </div>

  <!-- PHASE D: BOTTOM LETTERBOX BANNER UNDER PIP OUTRO (50.20s - 66.54s = 1704.56s - 1720.90s) -->
  <div id="s25-pip-bar" class="s25-layer">
    <div style="position:absolute;bottom:36px;left:50%;margin-left:-640px;width:1280px;">
      <div class="cm-card-green cm-shadow-featured" style="padding:18px 32px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div class="cm-mono-dark-pill">LỜI KHUYÊN THỰC DỤNG &amp; CÂN ĐỐI HƠN</div>
          <div class="cm-head" style="font-size:30px;color:#EFE9D9;margin-top:6px;">CẦN MÁY GẬP CÂN ĐỐI, TIẾT KIỆM &amp; TỐI ƯU HÀNG NGÀY → CHỌN GẬP ANDROID! ✓</div>
        </div>
        <div class="cm-badge-rot" style="transform:rotate(-2deg);">
          <div class="cm-head" style="font-size:24px;">ĐÁNG TIỀN HƠN! ✓</div>
        </div>
      </div>
    </div>
  </div>
`;

const s25Js = `
  // "so với tiêu chuẩn điện thoại gập thông thường thì nó mới chỉ đáp ứng được đâu đấy tầm khoảng từ 70 cho đến 80% mà thôi" (1670.60s = 16.24s local)
  tl.fromTo("#s25-b1-c2", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 16.00);

  // Switch to Phase B (Dark Green Closing Plate) at 21.80s (1676.16s global: "Mà tôi nghĩ rằng Apple cũng không muốn con iPhone Duo này nó hoàn thiện cơ!")
  tl.to("#s25-broll-1", { opacity: 0, duration: 0.30 }, 21.50);
  tl.to("#s25-closing-green", { opacity: 1, duration: 0.38, ease: "power2.out" }, 21.80);
  tl.to("#s25-rm-1", { opacity: 1, duration: 0.42, ease: "power2.out" }, 22.20);
  // "làm sao mà Apple sau này bán được iPhone Duo 2 hay là Duo 3 đúng không?" (1679.58s - 1684.50s = 25.22s - 30.14s local)
  tl.to("#s25-rm-2", { opacity: 1, duration: 0.42, ease: "power2.out" }, 25.60);
  tl.to("#s25-rm-3", { opacity: 1, duration: 0.42, ease: "power2.out" }, 26.80);
  // "vậy nên kiểu gì con iPhone Duo này cũng sẽ phải có lỗi và tốn rất nhiều thời gian khác để tối ưu" (1685.14s = 30.78s local)
  tl.to("#s25-buy-left", { opacity: 1, duration: 0.45, ease: "power2.out" }, 30.80);

  // Switch to Phase C (Close-up B-roll) at 39.60s (1693.96s global: "Vậy nên tôi nghĩ ở thời điểm hiện tại chưa phải là thời điểm thích hợp...")
  tl.to("#s25-closing-green", { opacity: 0, duration: 0.30 }, 39.30);
  tl.to("#s25-broll-2", { opacity: 1, duration: 0.38, ease: "power2.out" }, 39.60);
  // "Các bạn có thể mua vì cảm thấy thích, vì đây là một sản phẩm mới, vì đủ tiền để mua" (1697.90s = 43.54s local)
  tl.fromTo("#s25-b2-c1", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 43.50);

  // Switch to Phase D (Bottom Banner under PiP) at 50.20s (1704.56s global: "Còn nếu như các bạn thích điện thoại gập mà muốn tìm một con máy phù hợp hơn, cân đối hơn, tiết kiệm tài chính hơn... mua điện thoại gập Android")
  tl.to("#s25-broll-2", { opacity: 0, duration: 0.30 }, 49.90);
  tl.to("#s25-pip-bar", { opacity: 1, duration: 0.40, ease: "power2.out" }, 50.20);
`;

writeFileSync(join(compDir, 'scene-25.html'), wrapSubComp('scene-25', s25Css, s25Html, s25Js));

// ============================================================================
// FULL VIDEO ROOT INDEX.HTML (1744.00s / 29m 04s, 25 SCENES + 25 SFX TRACKS)
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
  { id: "s9_weight_head", type: "string", label: "Cảnh 9: Trọng lượng cầm nắm", default: "TRỌNG LƯỢNG RẤT NẶNG · MỎI TAY NGAY! ✕" },
  { id: "s12_esim_head", type: "string", label: "Cảnh 12: Hạn chế eSIM", default: "KHÔNG CÓ KHAY SIM VẬT LÝ · BẮT BUỘC 100% DÙNG 2 eSIM! ✕" },
  { id: "s14_crop_stat", type: "string", label: "Cảnh 14: Màn ngoài bị crop", default: "BỊ VỆT ĐEN CROP TỪ 5.4\" XUỐNG CÒN 4.8\"! ✕" },
  { id: "s17_matte_con", type: "string", label: "Cảnh 17: Nhược điểm màn nhám", default: "MÀU ĐEN SÂU BỊ BIẾN THÀNH XÁM XỊT & NHỢT NHẠT! ✕" },
  { id: "s18_udc_head", type: "string", label: "Cảnh 18: Camera ẩn màn trong", default: "KHOÉT LỖ TRÒN KHÔNG DÁN NHÁM → LỘ RÕ MỒN MỘT! ✕" },
  { id: "s19_hinge_head", type: "string", label: "Cảnh 19: Lỗi bản lề & chi phí", default: "SỬA CHỮA VẪN TỐN TIỀN · KHIẾN NGƯỜI DÙNG NGẠI MỞ MÁY! ✕" },
  { id: "s22_chip_name", type: "string", label: "Cảnh 22: Hiệu năng vi xử lý", default: "APPLE A20 PRO: SIÊU MƯỢT · MÁT MẺ ✓" },
  { id: "s24_principle", type: "string", label: "Cảnh 24: Quan điểm mua hàng", default: "QUAN ĐIỂM RÕ RÀNG: \"KHÔNG MUA VÌ LỜI HỨA!\"" },
  { id: "s25_score_stat", type: "string", label: "Cảnh 25: Điểm độ hoàn thiện", default: "CHỈ ĐÁP ỨNG ĐƯỢC 70% – 80%!" },
  { id: "bg_cream", type: "color", label: "Màu nền giấy kem (Cream)", default: "#EFE9D9" },
  { id: "accent_pink", type: "color", label: "Màu nhấn Hồng (Pink)", default: "#F06CA8" },
  { id: "accent_green", type: "color", label: "Màu nhấn Xanh lá (Green)", default: "#136636" },
  { id: "accent_orange", type: "color", label: "Màu bóng cứng Cam (Orange)", default: "#E85A1F" },
  { id: "accent_yellow", type: "color", label: "Màu nhấn Vàng (Yellow)", default: "#F5C518" }
]);

const sceneTimeline = [
  [1, 0.00, 32.50, "01: Nghịch lý iPhone Duo — Thắng Truyền thông vs Thua Sản phẩm"],
  // 32.50 - 43.93: Intro ĐỨC BIẾT TECH Pass-through 100%
  [2, 43.93, 45.64, "02: Băng tải & 3 Cổng Quét — 65 Triệu 0 Quà tặng vs Gập Android & AppleCare+"],
  [3, 89.57, 50.43, "03: Biểu đồ Tự vẽ Lịch sử Định giá Neo cao của Apple (iPhone X -> 18 Pro Max -> Duo)"],
  [4, 140.00, 33.20, "04: Bộ Phân Loại Thẻ Tệp Khách Hàng — Phổ thông Chê vs KOL Tiền Tỷ Hào hứng"],
  [5, 173.20, 52.60, "05: Sơ đồ Cổng Phân Luồng 2 Sự Kiện Ra Mắt của Apple (18 Pro Max vs iPhone Duo)"],
  [6, 225.80, 49.40, "06: Bản vẽ Kỹ thuật SVG & Thước đo Độ Hoàn Thiện Thời Trang Luxury"],
  [7, 275.20, 28.70, "07: Mặt cắt X-Ray Giải Phẫu Khung Titanium Bóng vs Titanium Nhám"],
  [8, 303.90, 19.40, "08: Mặt cắt Toa Tàu Metro & Spotlight Sức hút Logo Quả Táo"],
  [9, 323.30, 83.80, "09: Đồng hồ Đo Trọng Lượng Rất Nặng (15–20 Phút Mỏi Tay) & Lỗi Vuốt Back Shopee"],
  [10, 407.10, 39.10, "10: Thước Đo Hình Học Chữ D 'Cong Không Cong Thẳng Không Thẳng' Gây OCD & Cấn Tay Trái"],
  [11, 446.20, 60.90, "11: Cơ Cấu Nút Âm Lượng Trên Đỉnh Dễ Tuột Rơi Máy 65 Triệu & Vân Tay Touch ID Rườm Rà"],
  [12, 507.10, 92.20, "12: Băng Tải Cắt Giảm Nút Camera Control & Mặt Cắt X-Ray Bỏ Khay SIM Vật Lý (2 eSIM)"],
  [13, 599.30, 99.00, "13: Mặt Cắt X-Ray Màn Ngoài 5.4\" 120Hz — Cụm Camera Trước & Thanh Trạng Thái Dọc Quá To"],
  [14, 698.30, 69.50, "14: Bộ Phân Loại Tỉ Lệ 13:9 & Biểu Đồ Vệt Đen Crop Màn Hình Ngoài Từ 5.4\" Xuống 4.8\""],
  [15, 767.80, 141.20, "15: Băng Tải Kiểm Định Game Màn Trong 7.6\" (14:10) & Thước Đo 2 Viền Đen Lệch Nhau"],
  [16, 909.00, 56.60, "16: Cỗ Máy 65 Triệu Hiện Tại vs Chờ Tối Ưu Tương Lai (So Với Gập Android Scale Toàn Màn)"],
  [17, 965.60, 108.00, "17: Giải Phẫu Miếng Dán Nhám — Màu Đen Xám Xịt, Dễ Trầy Xước (HTX) & Nghịch Lý Bút Rời"],
  // 1073.60 - 1078.60: Infographic gốc Thống kê dùng bút Pass-through 100%
  [18, 1078.60, 130.20, "18: Giải Phẫu Camera Ẩn 'Ẩn Như Không Ẩn', Test Quay Full HD Cực Tệ & Tranh Luận FaceTime"],
  [19, 1208.80, 80.80, "19: Mặt Cắt X-Ray Lỗi Bản Lề Gây Sọc Màn Hình (Sửa Tốn Tiền) & Quy Luật Vật Lý Nếp Gập"],
  [20, 1289.60, 80.90, "20: Bộ Phân Loại Đa Nhiệm Chia Đôi 2 App Cố Định vs Điểm Sáng Canva & LaziBook Tràn Viền"],
  [21, 1370.50, 138.70, "21: Phòng Lab 2 Camera Sau 48MP (= iPhone 17), Quay 4K60 & Cổng Chặn Thiếu Apple Log / ProRes"],
  [22, 1509.20, 43.10, "22: Mặt Cắt Chip Apple A20 Pro Siêu Mượt, Nhiệt Độ Mát Mẻ & Báo Lỗi App AnTuTu"],
  [23, 1552.30, 53.90, "23: Mặt Cắt Pin >4800mAh Trụ Trọn 1 Ngày & Máy Hiện Sóng Loa Ngoài Bật 100% Bị Rè"],
  [24, 1606.20, 33.60, "24: Đúc Kết Quan Điểm 'Không Mua Vì Lời Hứa' & Trải Nghiệm Thực Tế Tại CellphoneS"],
  // 1639.80 - 1654.36: Trang web CellphoneS Pass-through 100%
  [25, 1654.36, 66.54, "25: Đại Cảnh Kết Xanh Lá #136636 — Chỉ Đạt 70-80% Để Bán Duo 2 / Duo 3 & Lời Khuyên Mua Hàng"]
  // 1720.90 - 1744.00: Màn hình Outro End-Screen PiP Pass-through 100%
];

const sceneDivs = sceneTimeline.map(([id, start, dur, label]) => {
  const pad = String(id).padStart(2, '0');
  return `      <div data-hf-id="hf-s${pad}" id="scene-${pad}" class="clip scene-slot" data-composition-id="scene-${pad}" data-composition-src="compositions/scene-${pad}.html" data-start="${start}" data-duration="${dur}" data-track-index="1" data-label="${label}"></div>`;
}).join('\n');

const sfxAudios = sceneTimeline.map(([id, start, dur]) => {
  const pad = String(id).padStart(2, '0');
  return `      <audio data-hf-id="hf-sfx-${pad}" id="sfx-${pad}" class="clip" src="assets/sfx-v2-s${pad}.wav" data-start="${start}" data-duration="${dur}" data-track-index="2" data-volume="0.38"></audio>`;
}).join('\n');

const indexHtml = `<!doctype html>
<html lang="vi" data-composition-variables='${VARIABLES}'>
  <head>
    <meta charset="UTF-8" />
    <title>Review iPhone Duo — Full Video 29 Phút (Creative Mode Illustrated)</title>
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
      data-duration="1744"
    >
      <video data-hf-id="hf-src-video"
        id="master-video"
        class="clip"
        src="assets/source.mp4"
        playsinline
        data-has-audio="true"
        data-start="0"
        data-duration="1744"
        data-track-index="0"
        data-volume="1"
      ></video>

${sceneDivs}

${sfxAudios}
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>`;

writeFileSync(join(projDir, 'index.html'), indexHtml);
console.log('Generated full 1744s index.html and scene-09..scene-25 successfully.');
