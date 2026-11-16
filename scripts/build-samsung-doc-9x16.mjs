import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC_16X9 = 'f:/App nha lam/motion-video-demo/scripts/build-samsung-doc.mjs';
const OUT = 'f:/App nha lam/motion-video-demo/videos/samsung-documentary-9x16';
const COMP_DIR = join(OUT, 'compositions');
mkdirSync(COMP_DIR, { recursive: true });

// =========================================================================
// Extract Single-Source-of-Truth SHOTS, TOTAL_DUR & SFX_SPEC_MAP from 16:9
// =========================================================================
const srcCode = readFileSync(SRC_16X9, 'utf8');
const shotsStart = srcCode.indexOf('const SHOTS = [');
const shotsEnd = srcCode.indexOf('\n// ====', shotsStart);
const sfxStart = srcCode.indexOf('const SFX_SPEC_MAP = {');
const sfxEnd = srcCode.indexOf('const trackEndTimes = [', sfxStart);

if (shotsStart < 0 || shotsEnd < 0 || sfxStart < 0 || sfxEnd < 0) {
  throw new Error('Failed to parse SHOTS / SFX_SPEC_MAP from 16:9 build script');
}

const parsedData = new Function(`
  ${srcCode.slice(shotsStart, shotsEnd)}
  ${srcCode.slice(sfxStart, sfxEnd)}
  const TOTAL_DUR = 1113.73;
  return { SHOTS, SFX_SPEC_MAP, TOTAL_DUR };
`)();

const { SHOTS, SFX_SPEC_MAP, TOTAL_DUR } = parsedData;

// =========================================================================
// Shared Portrait 9:16 (1080x1920) Creative-Mode Stylesheet
// Strict TikTok / Shorts / Reels Safe Zones (LESSONS_LEARNED.md §5):
// - y >= 160px, y <= 1440px, x >= 120px
// - Upper half (y: 160..840): x <= 960px (width = 840px)
// - Lower half (y: 840..1440): x <= 760px (width = 640px)
// - Font: Be Vietnam Pro only (crisp Vietnamese diacritics)
// - Rounded 4 corners on every container/badge
// =========================================================================
const BASE_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 100%; height: 100%; overflow: hidden; background: transparent; }
  #root {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: 'Be Vietnam Pro', sans-serif;
    color: #0F0F0F;
    background: #EFE9D9;
  }
  .cm-stage {
    position: absolute;
    inset: 0;
    width: 1080px;
    height: 1920px;
    background-color: #EFE9D9;
    background-image: radial-gradient(rgba(15, 15, 15, 0.15) 1.5px, transparent 1.5px);
    background-size: 36px 36px;
    overflow: hidden;
  }
  .cm-stage.dark-green {
    background-color: #136636;
    background-image: radial-gradient(rgba(239, 233, 217, 0.16) 1.5px, transparent 1.5px);
    color: #EFE9D9;
  }
  .cm-display {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-weight: 900;
    line-height: 1.14;
    letter-spacing: -0.015em;
    text-transform: uppercase;
  }
  .cm-sub {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-weight: 700;
    line-height: 1.32;
  }
  .cm-mono {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-weight: 800;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }
  .cm-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 4px solid #0F0F0F;
    border-radius: 999px;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-weight: 800;
    text-transform: uppercase;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .cm-corner {
    position: absolute;
    width: 26px;
    height: 26px;
    border-color: #0F0F0F;
    border-style: solid;
    z-index: 4;
    pointer-events: none;
  }
  .cm-corner.tl { top: 136px; left: 96px; border-width: 4px 0 0 4px; border-top-left-radius: 8px; }
  .cm-corner.tr { top: 136px; right: 96px; border-width: 4px 4px 0 0; border-top-right-radius: 8px; }
  .cm-corner.bl { top: 1438px; left: 96px; border-width: 0 0 4px 4px; border-bottom-left-radius: 8px; }
  .cm-corner.br { top: 1438px; right: 96px; border-width: 0 4px 4px 0; border-bottom-right-radius: 8px; }
  .cm-corner.light { border-color: #EFE9D9; }

  .cm-card {
    background: #EFE9D9;
    color: #0F0F0F;
    border: 5px solid #0F0F0F;
    border-radius: 20px;
  }
  .cm-shadow-featured {
    box-shadow: 10px 10px 0 #E85A1F, 10px 10px 0 4px #0F0F0F;
  }
  .cm-shadow-ink {
    box-shadow: 8px 8px 0 #0F0F0F;
  }

  /* Way B Hero 16:9 B-Roll Window (840x472 = exact 16:9, zero crop!) */
  .cm-wayb-win {
    background: #0F0F0F;
    border: 5px solid #0F0F0F;
    border-radius: 22px;
    overflow: hidden;
    position: absolute;
    z-index: 6;
  }
  .cm-wayb-win video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* Way A Full-Bleed Portrait B-Roll Container */
  .cm-waya-full {
    position: absolute;
    inset: 0;
    width: 1080px;
    height: 1920px;
    overflow: hidden;
    z-index: 2;
    background: #0F0F0F;
  }
  .cm-waya-full video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    display: block;
  }
`;

// Track Studio Variables identically to 16:9
const VARIABLES = [];
function regVar(key, label, defVal) {
  VARIABLES.push({ id: key, type: 'string', label, default: defVal });
  return `data-var-text="${key}"`;
}

function wrapScene(id, bodyHtml, scriptBody) {
  return `<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <title>${id}</title>
  </head>
  <body>
    <template>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@500;600;700;800;900&display=swap" />
      <style>
${BASE_CSS}
      </style>
      <div id="root" data-composition-id="${id}" data-width="1080" data-height="1920">
${bodyHtml}
      </div>
      <script>
        const tl = gsap.timeline({ paused: true });
${scriptBody}
        window.__timelines["${id}"] = tl;
      </script>
    </template>
  </body>
</html>
`;
}

function cornersHtml(light = false) {
  const cls = light ? 'cm-corner light' : 'cm-corner';
  return `
    <div class="${cls} tl"></div>
    <div class="${cls} tr"></div>
    <div class="${cls} bl"></div>
    <div class="${cls} br"></div>`;
}

const SFX_EVENTS = [];
let CURRENT_SHOT = null;

function beat(tLocal, sfx = 'pop') {
  if (!CURRENT_SHOT) return tLocal;
  const clamped = Math.max(0.06, Math.min(+(CURRENT_SHOT.dur - 0.35).toFixed(2), +tLocal.toFixed(2)));
  if (sfx) {
    const absTime = +(CURRENT_SHOT.start + clamped).toFixed(2);
    const clash = SFX_EVENTS.some(e => Math.abs(e.time - absTime) < 0.22);
    if (!clash) {
      SFX_EVENTS.push({ time: absTime, sfx, shotNum: CURRENT_SHOT.num });
    }
  }
  return clamped;
}

function extractYearBadge(title, sub) {
  const m = (title + ' ' + sub).match(/\b(19\d{2}|20\d{2})\b/);
  return m ? m[1] : 'SAMSUNG';
}

// Helper for crisp wrapped foreignObject text inside SVGs
function svgWrap(x, y, w, h, html, style = '') {
  return `<foreignObject x="${x}" y="${y}" width="${w}" height="${h}">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:'Be Vietnam Pro',sans-serif;${style}">${html}</div>
  </foreignObject>`;
}

// ============================================================================
// PORTRAIT 9:16 BESPOKE ILLUSTRATED MOTION BUILDER (21 SCENES)
// SVG Stage viewBox="0 0 840 1000" at left:120px, top:308px (canvas y: 308..1308)
// Rule: y_svg 0..530 -> x 0..840 allowed; y_svg 532..1000 -> content in x 0..640
// Bottom banner sits at left:120px, top:1322px, width:640px, height:106px
// ============================================================================
function buildIllustratedMotionShot(num, p) {
  const id = `scene-${String(num).padStart(2, '0')}`;
  const isDarkGreen = p.variant === 'dark_green_cta';
  const stageClass = isDarkGreen ? 'cm-stage dark-green' : 'cm-stage';
  const corners = cornersHtml(isDarkGreen);

  const vTitle = regVar(`s${num}_title`, `Cảnh ${num} - Tiêu đề`, p.title);
  const vSub = regVar(`s${num}_sub`, `Cảnh ${num} - Phụ đề`, p.sub);
  const vFoot = regVar(`s${num}_foot`, `Cảnh ${num} - Kết luận`, p.footer);

  const yearBadge = extractYearBadge(p.title, p.sub);
  const topHeader = `
    <div id="hdr_${num}" style="position:absolute;left:120px;top:164px;width:840px;height:132px;display:flex;justify-content:space-between;align-items:flex-start;gap:16px;z-index:10;">
      <div style="flex:1;min-width:0;">
        <div class="cm-display" style="font-size:26px;line-height:1.15;color:${isDarkGreen ? '#EFE9D9' : '#0F0F0F'};" ${vTitle}>${p.title}</div>
        <div class="cm-sub" style="font-size:16.5px;line-height:1.32;color:${isDarkGreen ? '#F5C518' : '#222222'};margin-top:6px;" ${vSub}>${p.sub}</div>
      </div>
      <div class="cm-pill" style="background:#F5C518;color:#0F0F0F;font-size:18px;padding:8px 18px;margin-top:2px;">${yearBadge}</div>
    </div>`;

  const bottomBanner = `
    <div id="foot_${num}" class="cm-card cm-shadow-ink" style="position:absolute;left:120px;top:1322px;width:640px;height:106px;background:#0F0F0F;border-radius:18px;padding:12px 22px;display:flex;align-items:center;gap:14px;z-index:10;">
      <div style="width:14px;height:14px;border-radius:999px;background:#F5C518;flex-shrink:0;"></div>
      <div class="cm-sub" style="font-size:17px;line-height:1.32;color:#EFE9D9;font-weight:800;" ${vFoot}>${p.footer}</div>
    </div>`;

  let svgInner = '';
  let js = `
    tl.fromTo("#hdr_${num}", { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, ${beat(0.06, null)});
  `;

  if (num === 1) {
    svgInner = `
      <!-- Upper Zone (y: 0..455, x: 0..840): iPhone + Bullets -->
      <g id="s1_left">
        <rect x="0" y="5" width="840" height="450" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
        <rect x="28" y="28" width="260" height="40" rx="20" fill="#0F0F0F"/>
        <text x="158" y="54" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="18" fill="#F5C518">iFAN CHÍNH HIỆU</text>
        <g id="s1_iphone">
          <rect x="44" y="88" width="220" height="335" rx="30" fill="#0F0F0F" stroke="#0F0F0F" stroke-width="5"/>
          <rect x="58" y="106" width="192" height="298" rx="20" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="3"/>
          <rect x="120" y="118" width="68" height="18" rx="9" fill="#0F0F0F"/>
          <rect x="76" y="156" width="156" height="98" rx="14" fill="#136636" stroke="#0F0F0F" stroke-width="4"/>
          <text x="154" y="198" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="20" fill="#EFE9D9">OLED DISPLAY</text>
          <text x="154" y="226" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="15" fill="#F5C518">BY SAMSUNG</text>
          <rect x="76" y="274" width="156" height="98" rx="14" fill="#F06CA8" stroke="#0F0F0F" stroke-width="4"/>
          <text x="154" y="316" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="20" fill="#0F0F0F">CHIP NHỚ</text>
          <text x="154" y="344" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="15" fill="#0F0F0F">DRAM / NAND</text>
        </g>
        <g id="s1_txt">
          <rect x="295" y="88" width="510" height="335" rx="20" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4.5"/>
          <text x="325" y="148" font-family="Be Vietnam Pro" font-weight="900" font-size="28" fill="#0F0F0F">CẦM TRÊN TAY</text>
          <text x="325" y="186" font-family="Be Vietnam Pro" font-weight="900" font-size="28" fill="#D2460F">CHIẾC iPHONE</text>
          ${svgWrap(325, 210, 455, 195, `
            <div style="font-size:20px;font-weight:700;line-height:1.48;color:#222222;">
              • Tự hào là iFan chính hiệu<br/>
              • Nhưng những linh kiện đắt giá nhất bên trong lại do <span style="font-weight:900;color:#136636;">Samsung sản xuất!</span>
            </div>
          `)}
        </g>
      </g>

      <!-- Vertical Connector Pipe (y: 455..560, x: 160..480) -->
      <g id="s1_pipe">
        <rect x="290" y="455" width="60" height="105" fill="#0F0F0F"/>
        <rect x="65" y="472" width="215" height="44" rx="14" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>
        <text x="172" y="501" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="17" fill="#0F0F0F">DÒNG TIỀN ẨN ↓</text>
        <g id="s1_coins">
          <circle cx="320" cy="482" r="20" fill="#F5C518" stroke="#0F0F0F" stroke-width="3"/>
          <text x="320" y="489" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="20" fill="#0F0F0F">$</text>
          <circle cx="320" cy="526" r="20" fill="#F5C518" stroke="#0F0F0F" stroke-width="3"/>
          <text x="320" y="533" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="20" fill="#0F0F0F">$</text>
        </g>
      </g>

      <!-- Lower Zone (y: 558..990, x: 0..640) -->
      <g id="s1_right">
        <rect x="10" y="570" width="630" height="418" rx="24" fill="#E85A1F"/>
        <rect x="0" y="558" width="630" height="418" rx="24" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
        <rect x="26" y="582" width="300" height="40" rx="20" fill="#136636" stroke="#0F0F0F" stroke-width="3.5"/>
        <text x="176" y="608" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="17" fill="#EFE9D9">SAMSUNG ELECTRONICS</text>
        <rect x="26" y="640" width="235" height="305" rx="20" fill="#0F0F0F"/>
        <rect x="42" y="656" width="203" height="273" rx="14" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="3"/>
        <g id="s1_wheel">
          <circle cx="143" cy="792" r="76" fill="#E85A1F" stroke="#0F0F0F" stroke-width="5"/>
          <line x1="67" y1="792" x2="219" y2="792" stroke="#0F0F0F" stroke-width="8"/>
          <line x1="143" y1="716" x2="143" y2="868" stroke="#0F0F0F" stroke-width="8"/>
          <circle cx="143" cy="792" r="28" fill="#F5C518" stroke="#0F0F0F" stroke-width="4.5"/>
        </g>
        ${svgWrap(285, 650, 320, 290, `
          <div style="font-size:27px;font-weight:900;line-height:1.18;color:#0F0F0F;text-transform:uppercase;">GIÁN TIẾP TRẢ TIỀN MỖI NGÀY</div>
          <div style="margin-top:16px;font-size:19px;font-weight:800;line-height:1.45;color:#0F0F0F;">Mỗi chiếc iPhone bán ra đều mang lại doanh thu linh kiện tỷ đô cho Samsung Electronics.</div>
        `)}
      </g>`;
    js += `
      tl.fromTo("#s1_left", { y: -35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.3)" }, ${beat(0.95, 'pop')});
      tl.fromTo("#s1_txt", { x: 25, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power2.out" }, ${beat(2.70, null)});
      tl.fromTo("#s1_pipe", { scaleY: 0, opacity: 0, svgOrigin: "320 455" }, { scaleY: 1, opacity: 1, duration: 0.5, ease: "power3.out" }, ${beat(5.55, 'whoosh')});
      tl.fromTo("#s1_coins circle, #s1_coins text", { y: -28, scale: 0.7, opacity: 0 }, { y: 0, scale: 1, opacity: 1, stagger: 0.12, duration: 0.4 }, ${beat(6.20, 'ping')});
      tl.fromTo("#s1_right", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.4)" }, ${beat(9.85, 'ding')});
      tl.fromTo("#s1_wheel", { rotation: 0, svgOrigin: "143 792" }, { rotation: 180, duration: 1.8, ease: "back.out(1.5)" }, 9.95);
      tl.fromTo("#foot_${num}", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, ${beat(11.15, null)});
    `;
  } else if (num === 5) {
    const stations = [
      { yr: '1938 → 1995', title: 'ĐỐT 150.000 MÁY', desc: 'Từ tiệm cá khô 40 người đến ngọn lửa Gumi chấn động', bg: '#EFE9D9', badgeBg: '#E85A1F', fgBadge: '#0F0F0F', icon: `<polygon points="245,45 275,98 215,98" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3.5"/><circle cx="245" cy="86" r="15" fill="#F5C518" stroke="#0F0F0F" stroke-width="3"/>` },
      { yr: '2005 – 2012', title: 'VƯỢT SONY & NOKIA', desc: 'Hạ bệ hai tượng đài điện tử và di động thế giới', bg: '#E4DCC4', badgeBg: '#136636', fgBadge: '#EFE9D9', icon: `<polygon points="212,96 224,52 246,74 268,52 280,96" fill="#F5C518" stroke="#0F0F0F" stroke-width="3.5"/>` },
      { yr: '2016 – 2017', title: 'SỐNG SÓT 5,3 TỶ USD', desc: 'Đứng dậy thần kỳ sau thảm họa thu hồi Galaxy Note 7', bg: '#EFE9D9', badgeBg: '#F06CA8', fgBadge: '#0F0F0F', icon: `<rect x="220" y="45" width="52" height="54" rx="12" fill="#F06CA8" stroke="#0F0F0F" stroke-width="3.5"/><path d="M234 72 L244 82 L262 60" fill="none" stroke="#0F0F0F" stroke-width="4.5" stroke-linecap="round"/>` },
      { yr: '2024 – 2026', title: 'CUỘC CHIẾN AI & HBM', desc: 'Bước vào trận đánh sống còn nuôi sống kỷ nguyên AI', bg: '#F5C518', badgeBg: '#0F0F0F', fgBadge: '#F5C518', icon: `<rect x="214" y="46" width="66" height="52" rx="12" fill="#0F0F0F"/><text x="247" y="80" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="22" fill="#F5C518">AI</text>` }
    ];
    svgInner = `
      <!-- Upper Zone (y: 0..335, x: 0..840): Dismissed Locations + True Origin 1938 -->
      <g id="s5_topL">
        <rect x="0" y="0" width="408" height="145" rx="20" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="4.5"/>
        <text x="204" y="60" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="23" fill="#0F0F0F">GARA CALIFORNIA?</text>
        <text x="204" y="102" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="16.5" fill="#B83B0B">KHÔNG PHẢI THUNG LŨNG SILICON ✕</text>
        <line x1="30" y1="20" x2="378" y2="125" stroke="#E85A1F" stroke-width="7" stroke-linecap="round"/>
      </g>
      <g id="s5_topM">
        <rect x="432" y="0" width="408" height="145" rx="20" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="4.5"/>
        <text x="636" y="60" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="23" fill="#0F0F0F">PHÒNG LAB TOKYO?</text>
        <text x="636" y="102" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="16.5" fill="#B83B0B">KHÔNG PHẢI XƯỞNG ĐIỆN TỬ NHẬT ✕</text>
        <line x1="462" y1="20" x2="810" y2="125" stroke="#E85A1F" stroke-width="7" stroke-linecap="round"/>
      </g>
      <g id="s5_topR">
        <rect x="0" y="164" width="840" height="135" rx="22" fill="#136636" stroke="#0F0F0F" stroke-width="5"/>
        <text x="420" y="218" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="28" fill="#F5C518">TIỆM CÁ KHÔ &amp; MÌ SỢI DAEGU (1938)</text>
        <text x="420" y="264" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="20" fill="#EFE9D9">Xuất phát điểm chỉ vỏn vẹn 40 nhân viên ✓</text>
      </g>

      <rect id="s5_pipe" x="40" y="320" width="560" height="18" rx="9" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3.5"/>

      <!-- 2x2 Illustrated Grid inside Lower Safe Zone (x: 0..640, y: 356..988) -->
      ${stations.map((st, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const gx = col * 330;
        const gy = 356 + row * 320;
        return `
        <g id="s5_st_${idx}" transform="translate(${gx}, ${gy})">
          ${idx === 3 ? `<rect x="10" y="10" width="310" height="300" rx="22" fill="#E85A1F"/>` : ''}
          <rect x="0" y="0" width="310" height="300" rx="22" fill="${st.bg}" stroke="#0F0F0F" stroke-width="4.5"/>
          <rect x="18" y="20" width="166" height="36" rx="18" fill="${st.badgeBg}" stroke="#0F0F0F" stroke-width="3"/>
          <text x="101" y="44" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="16" fill="${st.fgBadge}">${st.yr}</text>
          ${st.icon}
          <text x="18" y="156" font-family="Be Vietnam Pro" font-weight="900" font-size="22" fill="#0F0F0F">${st.title}</text>
          <line x1="18" y1="174" x2="292" y2="174" stroke="#0F0F0F" stroke-width="3"/>
          ${svgWrap(18, 190, 274, 96, `<div style="font-size:17.5px;font-weight:700;line-height:1.38;color:#0F0F0F;">${st.desc}</div>`)}
        </g>`;
      }).join('')}
    `;
    js += `
      tl.fromTo("#s5_pipe", { scaleX: 0, opacity: 0, svgOrigin: "40 329" }, { scaleX: 1, opacity: 1, duration: 1.4, ease: "power2.out" }, ${beat(2.85, null)});
      tl.fromTo("#s5_topL", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.5)" }, ${beat(8.55, 'click')});
      tl.fromTo("#s5_topM", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.5)" }, ${beat(11.10, 'click')});
      tl.fromTo("#s5_topR", { scale: 0.92, opacity: 0, svgOrigin: "420 231" }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.6)" }, ${beat(15.20, 'pop')});
      tl.fromTo("#s5_st_0", { y: 386, opacity: 0 }, { y: 356, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, ${beat(25.55, 'slam')});
      tl.fromTo("#s5_st_1", { y: 386, opacity: 0 }, { y: 356, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, ${beat(27.90, 'pop')});
      tl.fromTo("#s5_st_2", { y: 706, opacity: 0 }, { y: 676, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, ${beat(30.25, 'ping')});
      tl.fromTo("#s5_st_3", { y: 706, opacity: 0 }, { y: 676, opacity: 1, duration: 0.5, ease: "back.out(1.6)" }, ${beat(34.05, 'ding')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(35.20, null)});
    `;
  } else if (num === 6) {
    svgInner = `
      <!-- Upper Zone (y: 0..500, x: 0..840): Mechanical Rewind Clock 2026 -> 1938 -->
      <g id="s6_clock">
        <rect x="0" y="0" width="840" height="495" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
        <circle cx="420" cy="248" r="214" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="6"/>
        <circle cx="420" cy="248" r="196" fill="none" stroke="#0F0F0F" stroke-width="3.5" stroke-dasharray="12 9"/>
        <g id="s6_gear">
          <circle cx="420" cy="248" r="76" fill="#F5C518" stroke="#0F0F0F" stroke-width="4.5" stroke-dasharray="18 10"/>
        </g>
        <text x="420" y="86" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="26" fill="#0F0F0F">2026</text>
        <text x="576" y="257" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="26" fill="#0F0F0F">1995</text>
        <text x="420" y="416" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="26" fill="#0F0F0F">1969</text>
        <text x="266" y="257" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="28" fill="#D2460F">1938</text>
        <g id="s6_hand">
          <line x1="420" y1="248" x2="420" y2="160" stroke="#0F0F0F" stroke-width="9" stroke-linecap="round"/>
          <polygon points="420,142 407,168 433,168" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3"/>
        </g>
        <circle cx="420" cy="248" r="18" fill="#0F0F0F"/>
      </g>

      <!-- Lower Zone (y: 530..990, x: 0..640): Historical Dossier + CTA -->
      <g id="s6_dossier">
        <rect x="10" y="540" width="630" height="445" rx="24" fill="#E85A1F"/>
        <rect x="0" y="528" width="630" height="445" rx="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
        <rect x="28" y="556" width="350" height="42" rx="21" fill="#136636" stroke="#0F0F0F" stroke-width="3.5"/>
        <text x="203" y="584" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="18" fill="#EFE9D9">HỒ SƠ LỊCH SỬ 1938 – 2026</text>
        ${svgWrap(28, 616, 574, 200, `
          <div style="font-size:27px;font-weight:900;line-height:1.18;color:#0F0F0F;text-transform:uppercase;">TỔNG HỢP TỪ NHIỀU NGUỒN TƯ LIỆU</div>
          <div style="margin-top:12px;font-size:18.5px;font-weight:700;line-height:1.45;color:#222222;">
            • Đối chiếu lịch sử chính thức &amp; báo chí quốc tế<br/>
            • Nếu cần bổ sung hay đính chính, <span style="font-weight:800;color:#136636;">mời anh em góp ý ở phần bình luận bên dưới!</span>
          </div>
        `)}
        <g id="s6_btn">
          <rect x="28" y="832" width="574" height="110" rx="20" fill="#F5C518" stroke="#0F0F0F" stroke-width="4.5"/>
          <circle cx="96" cy="887" r="34" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3.5"/>
          <polygon points="86,869 86,905 116,887" fill="#EFE9D9"/>
          <text x="364" y="896" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="25" fill="#0F0F0F">BẮT ĐẦU HÀNH TRÌNH 1938</text>
        </g>
      </g>`;
    js += `
      tl.fromTo("#s6_clock", { scale: 0.9, opacity: 0, svgOrigin: "420 248" }, { scale: 1, opacity: 1, duration: 0.45 }, ${beat(0.95, 'pop')});
      tl.fromTo("#s6_hand", { rotation: 0, svgOrigin: "420 248" }, { rotation: -450, duration: 1.65, ease: "power2.inOut" }, ${beat(1.95, 'whoosh')});
      tl.fromTo("#s6_gear", { rotation: 0, svgOrigin: "420 248" }, { rotation: -360, duration: 2.2, ease: "power1.inOut" }, 1.95);
      tl.fromTo("#s6_dossier", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.3)" }, ${beat(4.20, 'ding')});
      tl.fromTo("#s6_btn", { scale: 0.88, opacity: 0, svgOrigin: "315 887" }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }, ${beat(11.35, 'ping')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, ${beat(12.20, null)});
    `;
  } else if (num === 8) {
    svgInner = `
      <!-- Upper Zone (y: 0..505, x: 0..840): Korea Peninsula + 4 Sectors -->
      <g id="s8_korea">
        <rect x="0" y="0" width="840" height="500" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
        <path d="M72 95 L235 78 L280 205 L260 390 L145 425 L95 295 Z" fill="#136636" stroke="#0F0F0F" stroke-width="4.5"/>
        <g id="s8_seoul_pin">
          <circle cx="165" cy="175" r="13" fill="#F5C518" stroke="#0F0F0F" stroke-width="3.5"/>
          <rect x="92" y="122" width="146" height="32" rx="16" fill="#0F0F0F"/>
          <text x="165" y="144" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="16" fill="#F5C518">SEOUL (1947)</text>
          <path d="M210 315 Q190 245 165 175" fill="none" stroke="#F5C518" stroke-width="5" stroke-dasharray="9 6"/>
        </g>
        <circle cx="210" cy="315" r="13" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3.5"/>
        <rect x="130" y="336" width="160" height="32" rx="16" fill="#0F0F0F"/>
        <text x="210" y="358" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="16" fill="#EFE9D9">DAEGU (1938)</text>

        <g id="s8_sec1">
          <rect x="340" y="28" width="470" height="96" rx="16" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
          <text x="364" y="66" font-family="Be Vietnam Pro" font-weight="900" font-size="20" fill="#0F0F0F">1. NHÀ MÁY ĐƯỜNG &amp; DỆT MAY</text>
          <text x="364" y="98" font-family="Be Vietnam Pro" font-weight="700" font-size="16.5" fill="#222222">Tái thiết đất nước sau chiến tranh 1953</text>
        </g>
        <g id="s8_sec2">
          <rect x="340" y="142" width="470" height="96" rx="16" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
          <text x="364" y="180" font-family="Be Vietnam Pro" font-weight="900" font-size="20" fill="#0F0F0F">2. BẢO HIỂM &amp; TÀI CHÍNH</text>
          <text x="364" y="212" font-family="Be Vietnam Pro" font-weight="700" font-size="16.5" fill="#222222">Bệ phóng vốn khổng lồ cho tập đoàn</text>
        </g>
        <g id="s8_sec3">
          <rect x="340" y="256" width="470" height="96" rx="16" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
          <text x="364" y="294" font-family="Be Vietnam Pro" font-weight="900" font-size="20" fill="#0F0F0F">3. BÁN LẺ &amp; THƯƠNG MẠI</text>
          <text x="364" y="326" font-family="Be Vietnam Pro" font-weight="700" font-size="16.5" fill="#222222">Trở thành Chaebol hàng đầu thập niên 1960</text>
        </g>
        <g id="s8_sec4">
          <rect x="340" y="370" width="470" height="104" rx="16" fill="#F5C518" stroke="#0F0F0F" stroke-width="4.5"/>
          <text x="364" y="410" font-family="Be Vietnam Pro" font-weight="900" font-size="21" fill="#0F0F0F">CHAEBOL SỐ 1 HÀN QUỐC</text>
          <text x="364" y="444" font-family="Be Vietnam Pro" font-weight="800" font-size="17" fill="#0F0F0F">Nhưng chưa có công nghệ điện tử cao</text>
        </g>
      </g>

      <!-- Lower Zone (y: 530..990, x: 0..640): Japan Electronics Radar -->
      <g id="s8_japan">
        <rect x="10" y="542" width="630" height="445" rx="24" fill="#E85A1F"/>
        <rect x="0" y="530" width="630" height="445" rx="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
        <rect x="28" y="556" width="380" height="42" rx="21" fill="#0F0F0F"/>
        <text x="218" y="584" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="17" fill="#F5C518">BÊN KIA EO BIỂN • NHẬT BẢN 1960s</text>

        <circle cx="155" cy="755" r="112" fill="#F5C518" stroke="#0F0F0F" stroke-width="4.5"/>
        <circle cx="155" cy="755" r="78" fill="none" stroke="#0F0F0F" stroke-width="3" stroke-dasharray="10 7"/>
        <line id="s8_radar" x1="155" y1="755" x2="155" y2="643" stroke="#E85A1F" stroke-width="7" stroke-linecap="round"/>
        <text x="155" y="744" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="21" fill="#0F0F0F">SONY • SANYO</text>
        <text x="155" y="776" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="21" fill="#136636">PANASONIC</text>

        <rect x="295" y="635" width="308" height="275" rx="18" fill="#0F0F0F"/>
        ${svgWrap(318, 660, 262, 230, `
          <div style="font-size:23px;font-weight:900;line-height:1.2;color:#F5C518;text-transform:uppercase;">LÀM GIÀU THẦN TỐC NHỜ ĐỒ ĐIỆN TỬ</div>
          <div style="margin-top:14px;font-size:18px;font-weight:700;line-height:1.42;color:#EFE9D9;">Thôi thúc Lee Byung-chul đưa Samsung bước vào ngành điện tử năm 1969.</div>
        `)}
      </g>`;
    js += `
      tl.fromTo("#s8_korea", { y: -35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(0.50, 'pop')});
      tl.fromTo("#s8_seoul_pin", { scale: 0.85, opacity: 0, svgOrigin: "165 175" }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.7)" }, ${beat(5.20, 'ping')});
      tl.fromTo("#s8_sec1", { x: 25, opacity: 0 }, { x: 0, opacity: 1, duration: 0.40, ease: "back.out(1.5)" }, ${beat(14.15, 'click')});
      tl.fromTo("#s8_sec2", { x: 25, opacity: 0 }, { x: 0, opacity: 1, duration: 0.40, ease: "back.out(1.5)" }, ${beat(15.40, 'click')});
      tl.fromTo("#s8_sec3", { x: 25, opacity: 0 }, { x: 0, opacity: 1, duration: 0.40, ease: "back.out(1.5)" }, ${beat(15.95, 'click')});
      tl.fromTo("#s8_sec4", { scale: 0.92, opacity: 0, svgOrigin: "575 422" }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.7)" }, ${beat(18.90, 'ding')});
      tl.fromTo("#s8_japan", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.50, ease: "back.out(1.5)" }, ${beat(35.60, 'whoosh')});
      tl.to("#s8_radar", { rotation: 360, duration: 3.4, repeat: 1, ease: "none", svgOrigin: "155 755" }, 35.80);
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(40.60, null)});
    `;
  } else if (num === 10) {
    svgInner = `
      <g id="s10_left">
        <rect x="0" y="0" width="840" height="495" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
        <rect x="28" y="24" width="350" height="40" rx="20" fill="#0F0F0F"/>
        <text x="203" y="50" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="18" fill="#F5C518">ĐẦU THẬP NIÊN 1980 • X-RAY</text>
        <rect x="28" y="82" width="784" height="275" rx="20" fill="#0F0F0F"/>
        <rect x="52" y="104" width="350" height="230" rx="16" fill="#136636" stroke="#EFE9D9" stroke-width="4"/>
        ${svgWrap(70, 128, 314, 185, `
          <div style="text-align:center;color:#EFE9D9;">
            <div style="font-size:24px;font-weight:900;">VỎ TV &amp; LÒ VI SÓNG</div>
            <div style="margin-top:14px;font-size:18px;font-weight:800;color:#F5C518;">Samsung lắp ráp gia công</div>
            <div style="margin-top:8px;font-size:16.5px;font-weight:700;">(Biên lợi nhuận cực mỏng)</div>
          </div>
        `)}
        <g id="s10_core">
          <rect x="434" y="104" width="354" height="230" rx="16" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
          ${svgWrap(452, 128, 318, 185, `
            <div style="text-align:center;color:#0F0F0F;">
              <div style="font-size:24px;font-weight:900;">CHIP &amp; LINH KIỆN LÕI</div>
              <div style="margin-top:14px;font-size:19px;font-weight:900;color:#B83B0B;">MUA TỪ NHẬT &amp; MỸ</div>
              <div style="margin-top:8px;font-size:16.5px;font-weight:800;">Hưởng trọn phần lãi ngon nhất</div>
            </div>
          `)}
        </g>
        <g id="s10_profit">
          <rect x="28" y="376" width="784" height="96" rx="16" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
          <text x="420" y="416" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="22" fill="#0F0F0F">LỢI NHUẬN RƠI VÀO TÚI ĐỐI TÁC NGOẠI</text>
          <text x="420" y="450" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="700" font-size="17" fill="#222222">Chỉ lắp ráp theo bản vẽ người Nhật thì không bao giờ bứt phá</text>
        </g>
      </g>

      <g id="s10_right">
        <rect x="10" y="542" width="630" height="445" rx="24" fill="#E85A1F"/>
        <rect x="0" y="530" width="630" height="445" rx="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
        <rect x="28" y="625" width="574" height="32" fill="#0F0F0F"/>
        <g id="s10_valve">
          <circle cx="315" cy="641" r="82" fill="#E85A1F" stroke="#0F0F0F" stroke-width="5.5"/>
          <line x1="233" y1="641" x2="397" y2="641" stroke="#0F0F0F" stroke-width="10"/>
          <line x1="315" y1="559" x2="315" y2="723" stroke="#0F0F0F" stroke-width="10"/>
          <circle cx="315" cy="641" r="30" fill="#F5C518" stroke="#0F0F0F" stroke-width="4.5"/>
        </g>
        <g id="s10_stamp">
          <rect x="28" y="756" width="574" height="192" rx="20" fill="#F5C518" stroke="#0F0F0F" stroke-width="4.5"/>
          ${svgWrap(46, 774, 538, 160, `
            <div style="text-align:center;">
              <div style="font-size:27px;font-weight:900;color:#B83B0B;">ĐỐI TÁC NGỪNG BÁN CHIP</div>
              <div style="margin-top:8px;font-size:25px;font-weight:900;color:#0F0F0F;">= ĐẮP CHIẾU TOÀN BỘ DÂY CHUYỀN!</div>
              <div style="margin-top:10px;font-size:17px;font-weight:800;color:#0F0F0F;">Tử huyệt buộc Samsung phải tự làm bán dẫn năm 1983</div>
            </div>
          `)}
        </g>
      </g>`;
    js += `
      tl.fromTo("#s10_left", { y: -35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(1.60, 'pop')});
      tl.fromTo("#s10_core", { scale: 0.88, opacity: 0, svgOrigin: "611 219" }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.7)" }, ${beat(12.10, 'ping')});
      tl.fromTo("#s10_profit", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(17.30, 'click')});
      tl.fromTo("#s10_right", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.50, ease: "back.out(1.5)" }, ${beat(19.90, 'whoosh')});
      tl.fromTo("#s10_valve", { rotation: 0, svgOrigin: "315 641" }, { rotation: 270, duration: 1.4, ease: "back.inOut(1.5)" }, ${beat(20.15, 'slam')});
      tl.fromTo("#s10_stamp", { scale: 0.88, opacity: 0, svgOrigin: "315 852" }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.8)" }, ${beat(22.25, 'pop')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(23.10, null)});
    `;
  } else if (num === 15) {
    const phonesSvg = Array.from({ length: 10 }, (_, idx) => {
      const col = idx % 5;
      const row = Math.floor(idx / 5);
      const px = 46 + col * 155;
      const py = 96 + row * 158;
      const isBad = idx === 9;
      return `
        <g id="s15_ph_${idx}">
          <line x1="${px + 84}" y1="${py - 20}" x2="${px + 84}" y2="${py}" stroke="#0F0F0F" stroke-width="5" stroke-linecap="round"/>
          <rect x="${px}" y="${py}" width="106" height="126" rx="15" fill="${isBad ? '#E85A1F' : '#0F0F0F'}" stroke="#0F0F0F" stroke-width="3.5"/>
          <rect x="${px + 14}" y="${py + 15}" width="78" height="44" rx="8" fill="${isBad ? '#F5C518' : '#136636'}" stroke="#0F0F0F" stroke-width="2.5"/>
          <text x="${px + 53}" y="${py + 44}" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="16" fill="${isBad ? '#0F0F0F' : '#EFE9D9'}">${isBad ? 'LỖI!' : 'OK'}</text>
        </g>`;
    }).join('');
    svgInner = `
      <g id="s15_rack">
        <rect x="0" y="0" width="840" height="495" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
        <rect x="28" y="22" width="350" height="40" rx="20" fill="#0F0F0F"/>
        <text x="203" y="48" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="17.5" fill="#F5C518">1994 • KIỂM ĐỊNH ANYCALL</text>
        ${phonesSvg}
        <g id="s15_rack_foot">
          <rect x="34" y="408" width="772" height="66" rx="15" fill="#0F0F0F"/>
          <text x="420" y="449" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="22" fill="#F5C518">CỨ 10 MÁY BÁN RA THÌ HƠN 1 MÁY BỊ HỎNG</text>
        </g>
      </g>
      <g id="s15_gauge">
        <rect x="10" y="534" width="630" height="218" rx="22" fill="#E85A1F"/>
        <rect x="0" y="524" width="630" height="218" rx="22" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4.5"/>
        <path d="M55 700 A 110 110 0 0 1 275 700" fill="none" stroke="#E4DCC4" stroke-width="24" stroke-linecap="round"/>
        <path d="M192 596 A 110 110 0 0 1 275 700" fill="none" stroke="#E85A1F" stroke-width="24" stroke-linecap="round"/>
        <g id="s15_needle">
          <line x1="165" y1="700" x2="78" y2="678" stroke="#0F0F0F" stroke-width="8" stroke-linecap="round"/>
        </g>
        <circle cx="165" cy="700" r="16" fill="#0F0F0F"/>
        <text x="455" y="646" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="68" fill="#D2460F">11,8%</text>
        <text x="455" y="692" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="21" fill="#0F0F0F">TỶ LỆ LỖI THẢM HỌA</text>
      </g>
      <g id="s15_gift">
        <rect x="0" y="766" width="630" height="214" rx="22" fill="#F5C518" stroke="#0F0F0F" stroke-width="4.5"/>
        <rect x="36" y="814" width="112" height="112" rx="14" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>
        <rect x="26" y="792" width="132" height="32" rx="8" fill="#0F0F0F"/>
        ${svgWrap(178, 796, 424, 155, `
          <div style="font-size:24px;font-weight:900;color:#0F0F0F;">QUÀ TẶNG NĂM MỚI CŨNG HỎNG!</div>
          <div style="margin-top:10px;font-size:18px;font-weight:800;line-height:1.4;color:#0F0F0F;">Ngay cả máy Chủ tịch Lee Kun-hee đem tặng dịp Năm Mới cũng không bật lên nguồn được.</div>
        `)}
      </g>`;
    js += `
      tl.fromTo("#s15_rack", { y: -35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(1.60, 'pop')});
      tl.fromTo("#s15_gauge", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.5)" }, ${beat(5.90, 'slam')});
      tl.fromTo("#s15_needle", { rotation: 0, svgOrigin: "165 700" }, { rotation: 142, duration: 1.0, ease: "elastic.out(1, 0.5)" }, ${beat(6.10, 'click')});
      tl.fromTo("#s15_rack_foot", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.40 }, ${beat(8.85, 'ping')});
      tl.fromTo("#s15_gift", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.50, ease: "back.out(1.6)" }, ${beat(12.40, 'ding')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(15.10, null)});
    `;
  } else if (num === 24) {
    svgInner = `
      <g id="s24_tower">
        <rect x="10" y="10" width="830" height="410" rx="24" fill="#E85A1F"/>
        <rect x="0" y="0" width="830" height="410" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
        <polygon points="105,175 132,80 198,128 264,80 291,175" fill="#F5C518" stroke="#0F0F0F" stroke-width="4.5"/>
        <rect x="78" y="175" width="240" height="145" rx="16" fill="#0F0F0F"/>
        <text x="198" y="260" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="34" fill="#F5C518">ĐỈNH SỐ 1</text>
        ${svgWrap(360, 88, 435, 250, `
          <div style="font-size:32px;font-weight:900;color:#B83B0B;text-transform:uppercase;">CÁI GIÁ CỦA TỐC ĐỘ</div>
          <div style="margin-top:14px;font-size:21px;font-weight:800;line-height:1.45;color:#0F0F0F;">Khi đứng trên đỉnh thế giới, bão tố ập đến từ cả 3 hướng cùng lúc.</div>
        `)}
      </g>
      <g id="s24_sp1">
        <rect x="0" y="452" width="548" height="156" rx="20" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4.5"/>
        <polygon points="548,452 630,530 548,608" fill="#F5C518" stroke="#0F0F0F" stroke-width="4.5"/>
        ${svgWrap(26, 474, 504, 114, `
          <div style="font-size:25px;font-weight:900;color:#0F0F0F;">01. MẶT TRẬN PHÁP LÝ</div>
          <div style="margin-top:8px;font-size:18px;font-weight:800;color:#0F0F0F;">Đại chiến bản quyền tỷ đô với Apple tại tòa án Mỹ</div>
        `)}
      </g>
      <g id="s24_sp2">
        <rect x="0" y="632" width="548" height="156" rx="20" fill="#F5C518" stroke="#0F0F0F" stroke-width="4.5"/>
        <polygon points="548,632 630,710 548,788" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4.5"/>
        ${svgWrap(26, 654, 504, 114, `
          <div style="font-size:25px;font-weight:900;color:#0F0F0F;">02. MẶT TRẬN THỊ TRƯỜNG</div>
          <div style="margin-top:8px;font-size:18px;font-weight:800;color:#0F0F0F;">Xiaomi, Huawei, OPPO đánh bật thị phần tại châu Á</div>
        `)}
      </g>
      <g id="s24_sp3">
        <rect x="0" y="812" width="548" height="156" rx="20" fill="#0F0F0F" stroke="#0F0F0F" stroke-width="4.5"/>
        <polygon points="548,812 630,890 548,968" fill="#F06CA8" stroke="#0F0F0F" stroke-width="4.5"/>
        ${svgWrap(26, 834, 504, 114, `
          <div style="font-size:25px;font-weight:900;color:#F5C518;">03. MẶT TRẬN KỸ THUẬT</div>
          <div style="margin-top:8px;font-size:18px;font-weight:700;color:#EFE9D9;">Rủi ro ép giới hạn vật lý dẫn tới thảm họa pin Note 7</div>
        `)}
      </g>`;
    js += `
      tl.fromTo("#s24_tower", { scale: 0.9, opacity: 0, svgOrigin: "415 205" }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, ${beat(3.85, 'whoosh')});
      tl.fromTo("#s24_sp1", { x: -45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42, ease: "back.out(1.7)" }, ${beat(8.55, 'pop')});
      tl.fromTo("#s24_sp2", { x: -45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42, ease: "back.out(1.7)" }, ${beat(9.15, 'slam')});
      tl.fromTo("#s24_sp3", { x: -45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42, ease: "back.out(1.7)" }, ${beat(9.60, 'click')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.38 }, ${beat(9.60, null)});
    `;
  } else if (num === 28) {
    svgInner = `
      <g id="s28_cal">
        <rect x="0" y="0" width="840" height="475" rx="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
        <rect x="36" y="28" width="768" height="78" rx="16" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4.5"/>
        <text x="420" y="78" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="30" fill="#0F0F0F">THÁNG 08 / 2016 • ÉP TIẾN ĐỘ</text>
        <rect x="36" y="128" width="768" height="205" rx="20" fill="#F5C518" stroke="#0F0F0F" stroke-width="4.5"/>
        <text x="360" y="212" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="48" fill="#0F0F0F">RA MẮT SỚM</text>
        <polygon points="565,172 605,196 565,220" fill="#0F0F0F"/>
        <polygon points="610,172 650,196 610,220" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3"/>
        <text x="420" y="282" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="24" fill="#0F0F0F">Tham vọng chặn đầu &amp; đè bẹp iPhone 7</text>
        ${svgWrap(36, 355, 768, 100, `
          <div style="text-align:center;font-size:20px;font-weight:800;line-height:1.4;color:#222222;">Sự hưng phấn sau Galaxy S6 / S7 khiến quy trình <span style="color:#B83B0B;">kiểm định bị rút ngắn nguy hiểm</span></div>
        `)}
      </g>
      <g id="s28_gauge">
        <rect x="10" y="530" width="630" height="450" rx="24" fill="#E85A1F"/>
        <rect x="0" y="518" width="630" height="450" rx="24" fill="#0F0F0F" stroke="#0F0F0F" stroke-width="5"/>
        <circle cx="315" cy="705" r="132" fill="#EFE9D9" stroke="#E85A1F" stroke-width="7"/>
        <path d="M206 756 A 118 118 0 1 1 424 756" fill="none" stroke="#E85A1F" stroke-width="22" stroke-linecap="round"/>
        <g id="s28_needle">
          <line x1="315" y1="705" x2="215" y2="705" stroke="#0F0F0F" stroke-width="10" stroke-linecap="round"/>
        </g>
        <circle cx="315" cy="705" r="20" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3.5"/>
        <text x="315" y="886" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="31" fill="#F5C518">THẢM HỌA TỒI TỆ NHẤT</text>
        <text x="315" y="930" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="700" font-size="18.5" fill="#EFE9D9">Lịch sử ngành điện thoại di động bắt đầu nổ ra</text>
      </g>`;
    js += `
      tl.fromTo("#s28_cal", { y: -35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(1.40, 'pop')});
      tl.fromTo("#s28_gauge", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.5)" }, ${beat(8.40, 'slam')});
      tl.fromTo("#s28_needle", { rotation: 0, svgOrigin: "315 705" }, { rotation: 160, duration: 1.0, ease: "elastic.out(1, 0.4)" }, ${beat(8.60, 'click')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, ${beat(10.80, null)});
    `;
  } else if (num === 29) {
    svgInner = `
      <!-- Upper Zone (y: 0..495, x: 0..840): Mechanical Pinch Cutaway -->
      <rect x="8" y="8" width="832" height="488" rx="24" fill="#E85A1F"/>
      <rect x="0" y="0" width="832" height="488" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
      <g id="s29_wallL">
        <rect x="20" y="34" width="176" height="420" rx="18" fill="#0F0F0F"/>
        <rect x="34" y="56" width="66" height="376" rx="12" fill="#F5C518" stroke="#EFE9D9" stroke-width="3"/>
        <text x="67" y="244" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="18" fill="#0F0F0F" transform="rotate(-90 67 244)">KHE BÚT S PEN</text>
        <text x="148" y="218" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="18" fill="#EFE9D9">VỎ TRÁI</text>
        <polygon points="196,204 232,244 196,284" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3.5"/>
        <text x="148" y="275" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="16" fill="#F5C518">ÉP →</text>
      </g>
      <g id="s29_pouch">
        <rect x="234" y="34" width="364" height="420" rx="22" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
        <rect x="252" y="52" width="328" height="44" rx="12" fill="#0F0F0F"/>
        <text x="416" y="80" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="15.5" fill="#F5C518">MẶT CẮT PIN 3.500 mAh</text>
        <g id="s29_anode">
          <rect x="252" y="114" width="132" height="315" rx="14" fill="#136636" stroke="#0F0F0F" stroke-width="4"/>
          <text x="318" y="146" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="17" fill="#EFE9D9">CỰC</text>
          <text x="318" y="172" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="17" fill="#EFE9D9">ÂM (-)</text>
        </g>
        <g id="s29_cathode">
          <rect x="448" y="114" width="132" height="315" rx="14" fill="#F06CA8" stroke="#0F0F0F" stroke-width="4"/>
          <text x="514" y="146" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="17" fill="#0F0F0F">CỰC</text>
          <text x="514" y="172" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="17" fill="#0F0F0F">DƯƠNG (+)</text>
        </g>
        <line x1="416" y1="110" x2="416" y2="430" stroke="#0F0F0F" stroke-width="6" stroke-dasharray="14 10"/>
        <g id="s29_spark">
          <circle cx="416" cy="272" r="76" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4.5"/>
          <polygon points="416,176 438,242 504,242 452,284 470,348 416,308 362,348 380,284 328,242 394,242" fill="#F5C518" stroke="#0F0F0F" stroke-width="3.5"/>
          <text x="416" y="279" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="20" fill="#0F0F0F">ĐOẢN MẠCH!</text>
        </g>
      </g>
      <g id="s29_wallR">
        <rect x="636" y="34" width="176" height="420" rx="18" fill="#0F0F0F"/>
        <polygon points="636,204 600,244 636,284" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3.5"/>
        <text x="724" y="218" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="18" fill="#EFE9D9">KÍNH CONG</text>
        <text x="724" y="246" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="18" fill="#EFE9D9">ĐỐI XỨNG</text>
        <text x="724" y="284" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="16" fill="#F5C518">← ÉP VÀO</text>
      </g>

      <!-- Lower Zone Technical Diagnosis Card (y: 530..985, x: 0..640) -->
      <g id="s29_diag">
        <rect x="0" y="530" width="632" height="450" rx="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
        <rect x="28" y="556" width="576" height="58" rx="14" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>
        <text x="316" y="593" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="22" fill="#0F0F0F">CHẨN ĐOÁN LỖI VẬT LÝ NOTE 7</text>
        ${svgWrap(28, 636, 576, 320, `
          <div style="background:#F5C518;border:4px solid #0F0F0F;border-radius:16px;padding:18px 22px;font-size:20px;font-weight:900;line-height:1.38;color:#0F0F0F;">
            • Nhồi nhét pin 3.500 mAh vào khung siêu mỏng đã bị chiếm chỗ bởi khe bút S Pen &amp; kính cong.
          </div>
          <div style="margin-top:16px;background:#0F0F0F;border-radius:16px;padding:18px 22px;font-size:19px;font-weight:700;line-height:1.42;color:#EFE9D9;">
            • Góc khoang pin chèn ép làm rách màng ngăn cách, khiến <span style="color:#F5C518;font-weight:900;">cực âm và cực dương chạm trực tiếp</span> gây cháy nổ dây chuyền.
          </div>
        `)}
      </g>`;
    js += `
      tl.fromTo("#s29_pouch", { scale: 0.9, opacity: 0, svgOrigin: "416 244" }, { scale: 1, opacity: 1, duration: 0.45 }, ${beat(0.60, 'pop')});
      tl.fromTo("#s29_wallR", { x: 40, opacity: 0 }, { x: -12, opacity: 1, duration: 1.0, ease: "power3.inOut" }, ${beat(3.05, 'whoosh')});
      tl.fromTo("#s29_wallL", { x: -40, opacity: 0 }, { x: 12, opacity: 1, duration: 1.0, ease: "power3.inOut" }, ${beat(6.00, 'whoosh')});
      tl.fromTo("#s29_diag", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, 6.40);
      tl.to("#s29_anode", { x: 24, duration: 0.65, ease: "power2.inOut" }, ${beat(10.80, 'click')});
      tl.to("#s29_cathode", { x: -24, duration: 0.65, ease: "power2.inOut" }, 10.80);
      tl.fromTo("#s29_spark", { scale: 0, opacity: 0, svgOrigin: "416 272" }, { scale: 1.1, opacity: 1, duration: 0.45, ease: "back.out(2)" }, ${beat(11.10, 'slam')});
      tl.fromTo("#foot_${num}", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, ${beat(12.50, null)});
    `;
  } else if (num === 31) {
    svgInner = `
      <g id="s31_gate">
        <rect x="0" y="0" width="840" height="485" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
        <path d="M90 385 L90 92 Q90 48 134 48 L354 48 Q398 48 398 92 L398 385" fill="none" stroke="#0F0F0F" stroke-width="24"/>
        <circle cx="244" cy="230" r="88" fill="#F5C518" stroke="#E85A1F" stroke-width="12"/>
        <rect x="218" y="176" width="52" height="108" rx="9" fill="#0F0F0F"/>
        <line x1="184" y1="168" x2="304" y2="292" stroke="#E85A1F" stroke-width="14" stroke-linecap="round"/>
        <polygon points="485,180 615,120 615,270 485,212" fill="#F5C518" stroke="#0F0F0F" stroke-width="4.5"/>
        <path id="s31_waves" d="M645 142 Q695 195 645 248 M682 115 Q748 195 682 275" fill="none" stroke="#E85A1F" stroke-width="6" stroke-linecap="round"/>
        <text x="420" y="446" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="27" fill="#0F0F0F">PHÁT LOA CẤM TRÊN TOÀN CẦU</text>
      </g>
      <g id="s31_plane">
        <rect x="10" y="538" width="630" height="445" rx="24" fill="#E85A1F"/>
        <rect x="0" y="526" width="630" height="445" rx="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
        <path d="M55 612 L435 612 Q545 612 580 652 L55 652 Z" fill="#136636" stroke="#0F0F0F" stroke-width="4"/>
        <polygon points="55,612 24,558 88,612" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>
        <rect x="34" y="728" width="44" height="122" rx="10" fill="#0F0F0F"/>
        <g id="s31_barrier">
          <rect x="52" y="746" width="548" height="44" rx="14" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>
          <text x="326" y="775" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="18.5" fill="#0F0F0F">CẤM MANG NOTE 7 LÊN MỌI CHUYẾN BAY</text>
        </g>
        <rect x="34" y="868" width="562" height="78" rx="16" fill="#0F0F0F"/>
        <text x="315" y="914" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="17.5" fill="#F5C518">NỖI SỈ NHỤC CHƯA TỪNG CÓ TIỀN LỆ VỚI SAMSUNG</text>
      </g>`;
    js += `
      tl.fromTo("#s31_gate", { y: -35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(0.40, 'pop')});
      tl.fromTo("#s31_plane", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, ${beat(3.80, 'whoosh')});
      tl.fromTo("#s31_barrier", { rotation: -16, opacity: 0, svgOrigin: "54 768" }, { rotation: 0, opacity: 1, duration: 0.70, ease: "bounce.out" }, ${beat(4.20, 'slam')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, ${beat(6.10, null)});
    `;
  } else if (num === 35) {
    svgInner = `
      <g id="s35_rivals">
        <rect x="0" y="0" width="840" height="350" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
        <text x="420" y="50" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="26" fill="#B83B0B">NẾU LÀ CÔNG TY BÌNH THƯỜNG</text>
        <g id="s35_nokia_bb">
          <g transform="rotate(-7 220 170)">
            <rect x="44" y="108" width="350" height="106" rx="16" fill="#0F0F0F"/>
            <text x="219" y="172" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="30" fill="#EFE9D9">NOKIA ✕</text>
          </g>
          <g transform="rotate(6 620 170)">
            <rect x="446" y="108" width="350" height="106" rx="16" fill="#0F0F0F"/>
            <text x="621" y="172" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="30" fill="#F06CA8">BLACKBERRY ✕</text>
          </g>
          <text x="420" y="298" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="24" fill="#0F0F0F">Mất 5,3 tỷ USD = Dấu chấm hết hoàn toàn!</text>
        </g>
      </g>
      <g id="s35_fortress">
        <rect x="10" y="392" width="630" height="594" rx="24" fill="#E85A1F"/>
        <rect x="0" y="380" width="630" height="594" rx="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
        <polygon points="24,485 68,404 562,404 606,485" fill="#136636" stroke="#0F0F0F" stroke-width="4.5"/>
        <text x="315" y="458" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="22" fill="#EFE9D9">CẤU TRÚC TÍCH HỢP DỌC ĐỠ ĐẠN</text>
        <g id="s35_pil1">
          <rect x="28" y="510" width="574" height="130" rx="18" fill="#136636" stroke="#0F0F0F" stroke-width="4.5"/>
          <text x="54" y="562" font-family="Be Vietnam Pro" font-weight="900" font-size="26" fill="#F5C518">1. BÁN DẪN DRAM</text>
          <text x="54" y="606" font-family="Be Vietnam Pro" font-weight="700" font-size="18.5" fill="#EFE9D9">Lãi kỷ lục hàng chục tỷ USD mỗi năm</text>
        </g>
        <g id="s35_pil2">
          <rect x="28" y="660" width="574" height="130" rx="18" fill="#F5C518" stroke="#0F0F0F" stroke-width="4.5"/>
          <text x="54" y="712" font-family="Be Vietnam Pro" font-weight="900" font-size="26" fill="#0F0F0F">2. MÀN HÌNH OLED</text>
          <text x="54" y="756" font-family="Be Vietnam Pro" font-weight="800" font-size="18.5" fill="#0F0F0F">Độc quyền tấm nền cung ứng toàn ngành</text>
        </g>
        <g id="s35_pil3">
          <rect x="28" y="810" width="574" height="130" rx="18" fill="#F06CA8" stroke="#0F0F0F" stroke-width="4.5"/>
          <text x="54" y="862" font-family="Be Vietnam Pro" font-weight="900" font-size="26" fill="#0F0F0F">3. TÁI SINH GALAXY</text>
          <text x="54" y="906" font-family="Be Vietnam Pro" font-weight="800" font-size="18.5" fill="#0F0F0F">Được 2 trụ cột đỡ đạn lột xác từ tro tàn</text>
        </g>
      </g>`;
    js += `
      tl.fromTo("#s35_rivals", { y: -35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(0.40, 'pop')});
      tl.fromTo("#s35_nokia_bb", { scale: 0.90, opacity: 0, svgOrigin: "420 190" }, { scale: 1, opacity: 1, duration: 0.42, ease: "back.out(1.7)" }, ${beat(7.65, 'slam')});
      tl.fromTo("#s35_fortress", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.50, ease: "back.out(1.5)" }, ${beat(10.25, 'whoosh')});
      tl.fromTo("#s35_pil1", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "back.out(1.7)" }, ${beat(13.50, 'pop')});
      tl.fromTo("#s35_pil2", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "back.out(1.7)" }, ${beat(15.70, 'ding')});
      tl.fromTo("#s35_pil3", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.48, ease: "back.out(1.7)" }, ${beat(17.15, 'ping')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(22.60, null)});
    `;
  } else if (num === 43) {
    svgInner = `
      <g id="s43_rail">
        <rect x="30" y="34" width="14" height="920" rx="7" fill="#0F0F0F"/>
        <line x1="37" y1="50" x2="37" y2="938" stroke="#F5C518" stroke-width="4" stroke-dasharray="16 12"/>
      </g>
      <g id="s43_p1">
        <rect x="64" y="0" width="776" height="305" rx="22" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
        <rect x="92" y="24" width="210" height="40" rx="20" fill="#0F0F0F"/>
        <text x="197" y="50" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="17.5" fill="#F5C518">01 • NĂM 1970</text>
        <rect x="92" y="96" width="205" height="162" rx="14" fill="#0F0F0F"/>
        <rect x="110" y="114" width="146" height="126" rx="10" fill="#E4DCC4"/>
        <line x1="165" y1="96" x2="128" y2="62" stroke="#0F0F0F" stroke-width="5"/>
        <line x1="215" y1="96" x2="252" y2="62" stroke="#0F0F0F" stroke-width="5"/>
        ${svgWrap(326, 78, 485, 200, `
          <div style="font-size:28px;font-weight:900;color:#0F0F0F;">TV ĐEN TRẮNG P-3202</div>
          <div style="margin-top:14px;font-size:20px;font-weight:800;line-height:1.42;color:#222222;">Đưa công ty buôn cá khô bước vào <span style="color:#136636;">thế giới mạch điện tử</span>.</div>
        `)}
      </g>
      <g id="s43_p2">
        <rect x="64" y="330" width="576" height="310" rx="22" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
        <rect x="92" y="354" width="210" height="40" rx="20" fill="#136636" stroke="#0F0F0F" stroke-width="3.5"/>
        <text x="197" y="380" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="17.5" fill="#EFE9D9">02 • NĂM 1983</text>
        <rect x="92" y="422" width="195" height="150" rx="16" fill="#0F0F0F"/>
        <rect x="112" y="446" width="155" height="102" rx="10" fill="#136636" stroke="#F5C518" stroke-width="3.5"/>
        <text x="189" y="508" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="25" fill="#F5C518">64K DRAM</text>
        ${svgWrap(306, 412, 310, 195, `
          <div style="font-size:24px;font-weight:900;line-height:1.2;color:#0F0F0F;">TỰ CHỦ BÁN DẪN GIHEUNG</div>
          <div style="margin-top:10px;font-size:18px;font-weight:700;line-height:1.38;color:#222222;">Thoát khỏi kiếp đi mua linh kiện từ các tập đoàn Nhật &amp; Mỹ.</div>
        `)}
      </g>
      <g id="s43_p3">
        <rect x="74" y="676" width="566" height="310" rx="22" fill="#E85A1F"/>
        <rect x="64" y="666" width="566" height="310" rx="22" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
        <rect x="92" y="690" width="210" height="40" rx="20" fill="#0F0F0F"/>
        <text x="197" y="716" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="17.5" fill="#F5C518">03 • NĂM 1992</text>
        <rect x="92" y="758" width="195" height="150" rx="16" fill="#0F0F0F"/>
        <text x="189" y="844" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="26" fill="#EFE9D9">64Mb DRAM</text>
        ${svgWrap(306, 748, 300, 200, `
          <div style="font-size:24px;font-weight:900;line-height:1.2;color:#0F0F0F;">ÔNG VUA BỘ NHỚ THẾ GIỚI</div>
          <div style="margin-top:10px;font-size:18px;font-weight:900;line-height:1.38;color:#136636;">Chính thức vượt Nhật &amp; Mỹ lên ngôi số 1 thị phần DRAM toàn cầu.</div>
        `)}
      </g>`;
    js += `
      tl.fromTo("#s43_rail", { scaleY: 0, opacity: 0, svgOrigin: "37 34" }, { scaleY: 1, opacity: 1, duration: 0.60, ease: "power2.out" }, 0.45);
      tl.to("#s43_rail", { scaleX: 1.35, svgOrigin: "37 490", duration: 0.35, yoyo: true, repeat: 1 }, ${beat(9.50, 'whoosh')});
      tl.fromTo("#s43_p1", { x: 35, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, ${beat(12.10, 'pop')});
      tl.fromTo("#s43_p2", { x: 35, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, ${beat(19.30, 'ding')});
      tl.fromTo("#s43_p3", { x: 35, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.6)" }, ${beat(22.40, 'ping')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(29.20, null)});
    `;
  } else if (num === 44) {
    const items = [
      { yr: '04 • 2002', title: 'SGH-T100', desc: 'Màn hình màu TFT LCD đầu tiên, bán >10 triệu máy — vào CLB hàng hiệu', bg: '#EFE9D9' },
      { yr: '05 • 2010–13', title: 'GALAXY S / S3 & S4', desc: '70–80 triệu máy mỗi dòng, lật đổ Nokia lên ngôi vương', bg: '#E4DCC4' },
      { yr: '06 • 2011', title: 'GALAXY NOTE 5,3"', desc: 'Kèm bút S Pen, khai sinh kỷ nguyên Phablet toàn cầu', bg: '#EFE9D9' },
      { yr: '07 • 2015', title: 'GALAXY S6 EDGE', desc: 'Định nghĩa thẩm mỹ bằng màn hình cong tràn hai cạnh', bg: '#F5C518' }
    ];
    svgInner = items.map((it, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const wCard = row === 0 ? 406 : 308;
      const gx = row === 0 ? col * 432 : col * 328;
      const gy = row * 505;
      const phW = 92;
      const phH = 148;
      return `
      <g id="s44_ped_${idx}" transform="translate(${gx}, ${gy})">
        ${idx === 3 ? `<rect x="10" y="10" width="${wCard}" height="475" rx="22" fill="#E85A1F"/>` : ''}
        <rect x="0" y="0" width="${wCard}" height="475" rx="22" fill="${it.bg}" stroke="#0F0F0F" stroke-width="4.5"/>
        <rect x="20" y="20" width="166" height="38" rx="19" fill="#0F0F0F"/>
        <text x="103" y="45" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="16" fill="#F5C518">${it.yr}</text>
        <rect x="${Math.round((wCard - phW) / 2)}" y="78" width="${phW}" height="${phH}" rx="16" fill="#0F0F0F" stroke="#0F0F0F" stroke-width="3.5"/>
        <rect x="${Math.round((wCard - phW) / 2) + 11}" y="92" width="${phW - 22}" height="${phH - 28}" rx="8" fill="${idx % 2 === 0 ? '#136636' : '#F06CA8'}"/>
        <rect x="44" y="236" width="${wCard - 88}" height="16" rx="7" fill="#0F0F0F"/>
        ${svgWrap(20, 270, wCard - 40, 185, `
          <div style="font-size:${row === 0 ? 24 : 21}px;font-weight:900;color:#0F0F0F;">${it.title}</div>
          <div style="margin-top:10px;font-size:${row === 0 ? 19 : 17.5}px;font-weight:700;line-height:1.38;color:#0F0F0F;">${it.desc}</div>
        `)}
      </g>`;
    }).join('');
    js += `
      tl.fromTo("#s44_ped_0", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, ${beat(0.20, 'pop')});
      tl.fromTo("#s44_ped_1", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, ${beat(8.10, 'whoosh')});
      tl.fromTo("#s44_ped_2", { y: 535, opacity: 0 }, { y: 505, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, ${beat(20.80, 'ding')});
      tl.fromTo("#s44_ped_3", { y: 535, opacity: 0 }, { y: 505, opacity: 1, duration: 0.50, ease: "back.out(1.6)" }, ${beat(29.85, 'ping')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(33.60, null)});
    `;
  } else if (num === 45) {
    svgInner = `
      <g id="s45_c1">
        <rect x="0" y="0" width="840" height="310" rx="22" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
        <rect x="28" y="24" width="265" height="40" rx="20" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3.5"/>
        <text x="160" y="50" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="17.5" fill="#0F0F0F">08 • GALAXY NOTE 7 (2016)</text>
        <rect x="28" y="84" width="350" height="196" rx="16" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
        ${svgWrap(44, 114, 318, 140, `
          <div style="text-align:center;">
            <div style="font-size:23px;font-weight:900;color:#0F0F0F;">THIỆT HẠI HÀNG TỶ USD</div>
            <div style="margin-top:12px;font-size:22px;font-weight:900;color:#B83B0B;">THU HỒI 2,5 TRIỆU MÁY</div>
          </div>
        `)}
        ${svgWrap(406, 94, 400, 180, `
          <div style="font-size:27px;font-weight:900;color:#0F0F0F;">TÁI LẬP CHUẨN AN TOÀN</div>
          <div style="margin-top:14px;font-size:19.5px;font-weight:800;line-height:1.42;color:#222222;">Buộc Samsung xây dựng quy trình <span style="color:#136636;">kiểm định Pin 8 Bước</span> cho toàn ngành.</div>
        `)}
      </g>
      <g id="s45_c2">
        <rect x="0" y="334" width="635" height="308" rx="22" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
        <rect x="28" y="356" width="260" height="40" rx="20" fill="#136636" stroke="#0F0F0F" stroke-width="3.5"/>
        <text x="158" y="382" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="17.5" fill="#EFE9D9">09A • GALAXY FOLD (2019)</text>
        <rect x="34" y="422" width="88" height="175" rx="12" fill="#136636" stroke="#0F0F0F" stroke-width="4"/>
        <rect x="126" y="422" width="88" height="175" rx="12" fill="#0F0F0F" stroke="#0F0F0F" stroke-width="4"/>
        ${svgWrap(246, 428, 362, 175, `
          <div style="font-size:25px;font-weight:900;color:#0F0F0F;">MỞ ĐƯỜNG ĐIỆN THOẠI GẬP</div>
          <div style="margin-top:12px;font-size:18.5px;font-weight:700;line-height:1.4;color:#222222;">Khai phá phân khúc màn hình gập thương mại đại chúng toàn cầu.</div>
        `)}
      </g>
      <g id="s45_c3">
        <rect x="10" y="676" width="625" height="310" rx="22" fill="#E85A1F"/>
        <rect x="0" y="666" width="625" height="310" rx="22" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
        <rect x="28" y="688" width="265" height="40" rx="20" fill="#0F0F0F"/>
        <text x="160" y="714" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="17.5" fill="#F5C518">09B • S22 ULTRA (2022)</text>
        <rect x="52" y="756" width="110" height="175" rx="12" fill="#0F0F0F"/>
        <rect x="178" y="766" width="16" height="160" rx="8" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3"/>
        ${svgWrap(240, 756, 360, 175, `
          <div style="font-size:25px;font-weight:900;color:#0F0F0F;">HỢP NHẤT NOTE &amp; S ULTRA</div>
          <div style="margin-top:12px;font-size:18.5px;font-weight:900;line-height:1.4;color:#136636;">Đưa bút S Pen vào thân máy S Ultra trước khi bước vào sóng thần AI.</div>
        `)}
      </g>`;
    js += `
      tl.fromTo("#s45_c1", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, ${beat(0.20, 'pop')});
      tl.fromTo("#s45_c2", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, ${beat(10.30, 'whoosh')});
      tl.fromTo("#s45_c3", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.50, ease: "back.out(1.6)" }, ${beat(15.40, 'ping')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(22.90, null)});
    `;
  } else if (num === 46) {
    svgInner = `
      <g id="s46_hynix">
        <rect x="0" y="0" width="840" height="455" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
        <rect x="28" y="22" width="320" height="40" rx="20" fill="#136636" stroke="#0F0F0F" stroke-width="3.5"/>
        <text x="188" y="48" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="17" fill="#EFE9D9">SK HYNIX • VƯỢT LÊN Ở HBM</text>
        <g id="s46_hynix_ai">
          <g id="s46_stackL">
            <rect x="34" y="88" width="225" height="42" rx="10" fill="#136636" stroke="#0F0F0F" stroke-width="3.5"/>
            <rect x="34" y="138" width="225" height="42" rx="10" fill="#136636" stroke="#0F0F0F" stroke-width="3.5"/>
            <rect x="34" y="188" width="225" height="42" rx="10" fill="#136636" stroke="#0F0F0F" stroke-width="3.5"/>
            <rect x="34" y="238" width="225" height="42" rx="10" fill="#F5C518" stroke="#0F0F0F" stroke-width="3.5"/>
            <text x="146" y="266" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="19" fill="#0F0F0F">HBM3 / HBM3E</text>
          </g>
          <rect x="285" y="88" width="522" height="192" rx="18" fill="#0F0F0F"/>
          <text x="546" y="168" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="38" fill="#F5C518">NVIDIA AI</text>
          <text x="546" y="220" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="22" fill="#EFE9D9">ĐẠT CHUẨN KIỂM ĐỊNH SỚM ✓</text>
        </g>
        ${svgWrap(34, 304, 772, 132, `
          <div style="font-size:26px;font-weight:900;color:#0F0F0F;">NGHỊCH LÝ CHẤN ĐỘNG 2023–2025</div>
          <div style="margin-top:8px;font-size:19.5px;font-weight:700;line-height:1.38;color:#222222;">Ông vua 30 năm DRAM bất ngờ bị người đồng hương SK Hynix dẫn trước ở chip nhớ HBM cho AI.</div>
        `)}
      </g>

      <g id="s46_loop_pill">
        <line x1="20" y1="490" x2="620" y2="490" stroke="#0F0F0F" stroke-width="4.5" stroke-dasharray="12 8"/>
        <rect x="190" y="466" width="260" height="48" rx="24" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
        <text x="320" y="498" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="20" fill="#0F0F0F">CHU KỲ 2023 – 2025</text>
      </g>

      <g id="s46_samsung">
        <rect x="10" y="540" width="625" height="445" rx="24" fill="#E85A1F"/>
        <rect x="0" y="528" width="625" height="445" rx="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
        <rect x="28" y="552" width="330" height="40" rx="20" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3.5"/>
        <text x="193" y="578" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="17" fill="#0F0F0F">SAMSUNG • THÁCH THỨC KÉP</text>
        <rect x="28" y="616" width="275" height="170" rx="16" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
        <text x="165" y="688" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="28" fill="#0F0F0F">HBM3E</text>
        <text x="165" y="732" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="17" fill="#0F0F0F">CHẬM KIỂM ĐỊNH NVIDIA</text>
        <rect x="322" y="616" width="275" height="170" rx="16" fill="#0F0F0F"/>
        <text x="459" y="688" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="23" fill="#F06CA8">ĐÚC CHIP FOUNDRY</text>
        <text x="459" y="732" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="700" font-size="17.5" fill="#EFE9D9">Hụt hơi trước TSMC</text>
        ${svgWrap(28, 810, 568, 145, `
          <div style="font-size:25px;font-weight:900;color:#0F0F0F;">CÚ GIẬT MÌNH TỈNH GIẤC</div>
          <div style="margin-top:8px;font-size:18.5px;font-weight:800;line-height:1.4;color:#0F0F0F;">Buộc lãnh đạo mảng bán dẫn phải phát tâm thư xin lỗi và đại phẫu toàn diện.</div>
        `)}
      </g>`;
    js += `
      tl.fromTo("#s46_loop_pill", { scale: 0.88, opacity: 0, svgOrigin: "320 490" }, { scale: 1, opacity: 1, duration: 0.40 }, ${beat(0.40, null)});
      tl.fromTo("#s46_hynix", { y: -35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(8.60, 'pop')});
      tl.fromTo("#s46_hynix_ai", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, ${beat(15.10, 'ding')});
      tl.fromTo("#s46_samsung", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.50, ease: "back.out(1.5)" }, ${beat(25.40, 'slam')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(34.80, null)});
    `;
  } else if (num === 48) {
    svgInner = `
      <g id="s48_chart">
        <rect x="0" y="0" width="840" height="495" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
        <text x="420" y="52" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="25" fill="#0F0F0F">THỊ PHẦN DOANH THU DRAM TOÀN CẦU Q1/2025</text>
        <line x1="70" y1="416" x2="770" y2="416" stroke="#0F0F0F" stroke-width="5"/>
        <g id="s48_barL">
          <rect x="130" y="102" width="240" height="314" rx="18" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4.5"/>
          <text x="250" y="210" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="54" fill="#0F0F0F">36,0%</text>
          <text x="250" y="264" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="24" fill="#0F0F0F">SK HYNIX (#1)</text>
        </g>
        <g id="s48_barR">
          <rect x="470" y="132" width="240" height="284" rx="18" fill="#136636" stroke="#0F0F0F" stroke-width="4.5"/>
          <text x="590" y="238" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="54" fill="#EFE9D9">34,4%</text>
          <text x="590" y="292" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="24" fill="#F5C518">SAMSUNG (#2)</text>
        </g>
        <text x="420" y="464" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="17" fill="#0F0F0F">Lần đầu tiên sau 33 năm (từ 1992), Samsung tạm nhường ngôi đầu DRAM</text>
      </g>
      <g id="s48_news">
        <rect x="10" y="540" width="625" height="445" rx="24" fill="#E85A1F"/>
        <rect x="0" y="528" width="625" height="445" rx="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
        <rect x="28" y="556" width="568" height="58" rx="15" fill="#0F0F0F"/>
        <text x="312" y="594" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="25" fill="#F5C518">OMDIA &amp; COUNTERPOINT</text>
        <rect x="28" y="634" width="568" height="175" rx="16" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
        ${svgWrap(44, 650, 536, 145, `
          <div style="text-align:center;color:#0F0F0F;">
            <div style="font-size:21px;font-weight:900;line-height:1.35;">"SK HYNIX SURPASSES SAMSUNG IN Q1 2025 GLOBAL DRAM SHARE"</div>
            <div style="margin-top:12px;font-size:17px;font-weight:800;">THE KOREA HERALD • 2025</div>
          </div>
        `)}
        ${svgWrap(28, 830, 568, 125, `
          <div style="font-size:19px;font-weight:800;line-height:1.45;color:#0F0F0F;">
            • Nhu cầu bộ nhớ HBM cho AI tăng vọt<br/>
            • <span style="color:#136636;">Châm ngòi cuộc tổng phản công 2025–2026</span>
          </div>
        `)}
      </g>`;
    js += `
      tl.fromTo("#s48_chart", { y: -35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(0.40, 'pop')});
      tl.fromTo("#s48_barL", { scaleY: 0, opacity: 0, svgOrigin: "250 416" }, { scaleY: 1, opacity: 1, duration: 0.55, ease: "back.out(1.6)" }, ${beat(6.05, 'whoosh')});
      tl.fromTo("#s48_barR", { scaleY: 0, opacity: 0, svgOrigin: "590 416" }, { scaleY: 1, opacity: 1, duration: 0.55, ease: "back.out(1.6)" }, ${beat(12.10, 'ding')});
      tl.fromTo("#s48_news", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.5)" }, ${beat(13.85, 'Swipe')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, ${beat(15.10, null)});
    `;
  } else if (num === 49) {
    svgInner = `
      <g id="s49_left">
        <rect x="0" y="0" width="840" height="495" rx="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
        <rect x="28" y="22" width="420" height="40" rx="20" fill="#136636" stroke="#0F0F0F" stroke-width="3.5"/>
        <text x="238" y="48" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="17" fill="#EFE9D9">MÔ HÌNH ĐỒNG CEO • TỔNG PHẢN CÔNG</text>
        <g id="s49_ceo_jun">
          <rect x="28" y="82" width="380" height="106" rx="16" fill="#0F0F0F"/>
          <text x="218" y="128" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="23" fill="#F5C518">JUN YOUNG-HYUN</text>
          <text x="218" y="164" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="700" font-size="17.5" fill="#EFE9D9">Tư lệnh Bán dẫn (DS)</text>
        </g>
        <g id="s49_ceo_roh">
          <rect x="432" y="82" width="380" height="106" rx="16" fill="#0F0F0F"/>
          <text x="622" y="128" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="23" fill="#F06CA8">ROH TAE-MOON</text>
          <text x="622" y="164" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="700" font-size="17.5" fill="#EFE9D9">Tư lệnh Di động &amp; AI (DX)</text>
        </g>
        <g id="s49_rebound">
          <rect x="28" y="210" width="784" height="256" rx="20" fill="#F5C518" stroke="#0F0F0F" stroke-width="4.5"/>
          <text x="420" y="266" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="27" fill="#0F0F0F">GIÀNH LẠI NGÔI VƯƠNG DRAM</text>
          <text x="420" y="372" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="88" fill="#136636">38,0%</text>
          <text x="420" y="432" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="20" fill="#0F0F0F">THỊ PHẦN TOÀN CẦU Q2/2026 (COUNTERPOINT)</text>
        </g>
      </g>
      <g id="s49_right">
        <rect x="10" y="540" width="625" height="445" rx="24" fill="#E85A1F"/>
        <rect x="0" y="528" width="625" height="445" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
        <text x="312" y="576" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="25" fill="#0F0F0F">3 MŨI NHỌN BÁN DẪN 2025 – 2026</text>
        <g id="s49_m1">
          <rect x="26" y="602" width="572" height="106" rx="16" fill="#136636" stroke="#0F0F0F" stroke-width="4"/>
          <text x="48" y="646" font-family="Be Vietnam Pro" font-weight="900" font-size="23" fill="#F5C518">01. HBM3E 12 LỚP (12H)</text>
          <text x="48" y="684" font-family="Be Vietnam Pro" font-weight="700" font-size="15" fill="#EFE9D9">Tăng tốc sản lượng bộ nhớ băng thông cao cho cụm GPU AI</text>
        </g>
        <g id="s49_m2">
          <rect x="26" y="724" width="572" height="106" rx="16" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
          <text x="48" y="768" font-family="Be Vietnam Pro" font-weight="900" font-size="23" fill="#0F0F0F">02. THẾ HỆ BỘ NHỚ HBM4</text>
          <text x="48" y="806" font-family="Be Vietnam Pro" font-weight="800" font-size="15.5" fill="#222222">Đón đầu kiến trúc bộ nhớ AI thế hệ tiếp theo</text>
        </g>
        <g id="s49_m3">
          <rect x="26" y="846" width="572" height="106" rx="16" fill="#0F0F0F" stroke="#0F0F0F" stroke-width="4"/>
          <text x="48" y="890" font-family="Be Vietnam Pro" font-weight="900" font-size="23" fill="#F06CA8">03. ĐÚC CHIP 2 NANOMET (GAA)</text>
          <text x="48" y="928" font-family="Be Vietnam Pro" font-weight="700" font-size="15" fill="#EFE9D9">Ký hợp đồng đúc chip tiên tiến cùng đối tác lớn như Tesla</text>
        </g>
      </g>`;
    js += `
      tl.fromTo("#s49_left", { y: -35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(4.20, 'pop')});
      tl.fromTo("#s49_ceo_jun", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.38, ease: "back.out(1.6)" }, ${beat(5.70, 'click')});
      tl.fromTo("#s49_ceo_roh", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.38, ease: "back.out(1.6)" }, ${beat(8.40, 'click')});
      tl.fromTo("#s49_rebound", { scale: 0.90, opacity: 0, svgOrigin: "420 338" }, { scale: 1, opacity: 1, duration: 0.48, ease: "back.out(1.7)" }, ${beat(17.60, 'ping')});
      tl.fromTo("#s49_right", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(23.30, 'whoosh')});
      tl.fromTo("#s49_m1", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42, ease: "back.out(1.7)" }, 23.30);
      tl.fromTo("#s49_m2", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42, ease: "back.out(1.7)" }, ${beat(26.05, 'ding')});
      tl.fromTo("#s49_m3", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42, ease: "back.out(1.7)" }, ${beat(27.15, 'ping')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(29.80, null)});
    `;
  } else if (num === 51) {
    svgInner = `
      <rect x="0" y="0" width="840" height="495" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
      <line x1="56" y1="428" x2="784" y2="428" stroke="#0F0F0F" stroke-width="5.5"/>
      <g id="s51_sam">
        <rect x="64" y="64" width="320" height="364" rx="22" fill="#136636" stroke="#0F0F0F" stroke-width="5"/>
        <text x="224" y="178" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="60" fill="#F5C518">19%–20%</text>
        <text x="224" y="242" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="32" fill="#EFE9D9">SAMSUNG</text>
        ${svgWrap(82, 272, 284, 120, `<div style="text-align:center;font-size:18px;font-weight:800;line-height:1.4;color:#EFE9D9;">Galaxy S26 Series<br/>Z TriFold • Galaxy AI</div>`)}
      </g>
      <g id="s51_app">
        <rect x="456" y="64" width="320" height="364" rx="22" fill="#0F0F0F" stroke="#0F0F0F" stroke-width="5"/>
        <text x="616" y="178" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="60" fill="#EFE9D9">19%–20%</text>
        <text x="616" y="242" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="32" fill="#F5C518">APPLE</text>
        ${svgWrap(474, 272, 284, 120, `<div style="text-align:center;font-size:18px;font-weight:800;line-height:1.4;color:#EFE9D9;">iPhone Series<br/>Hệ sinh thái iOS</div>`)}
      </g>
      <g id="s51_vs">
        <circle cx="420" cy="246" r="46" fill="#E85A1F" stroke="#0F0F0F" stroke-width="5"/>
        <text x="420" y="258" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="30" fill="#0F0F0F">VS</text>
      </g>

      <rect x="0" y="540" width="632" height="430" rx="24" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
      ${svgWrap(34, 578, 564, 355, `
        <div style="font-size:32px;font-weight:900;line-height:1.2;color:#0F0F0F;text-transform:uppercase;">THẾ SONG MÃ CÂN TÀI CÂN SỨC NHẤT LỊCH SỬ SMARTPHONE</div>
        <div style="margin-top:20px;font-size:20px;font-weight:800;line-height:1.48;color:#0F0F0F;">Cùng chia sẻ đỉnh cao thị phần toàn cầu 2026 quanh ngưỡng 19%–20%, tạo nên cuộc rượt đuổi khốc liệt nhưng vẫn liên kết chặt chẽ qua chuỗi cung ứng linh kiện.</div>
      `)}
    `;
    js += `
      tl.fromTo("#s51_sam", { scaleY: 0, opacity: 0, svgOrigin: "224 428" }, { scaleY: 1, opacity: 1, duration: 0.55, ease: "back.out(1.5)" }, ${beat(0.75, 'whoosh')});
      tl.fromTo("#s51_vs", { scale: 0.5, opacity: 0, svgOrigin: "420 246" }, { scale: 1, opacity: 1, duration: 0.40, ease: "back.out(1.8)" }, ${beat(2.60, null)});
      tl.fromTo("#s51_app", { scaleY: 0, opacity: 0, svgOrigin: "616 428" }, { scaleY: 1, opacity: 1, duration: 0.55, ease: "back.out(1.5)" }, ${beat(2.60, 'ping')});
      tl.fromTo("#foot_${num}", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, ${beat(4.50, null)});
    `;
  } else if (num === 52) {
    svgInner = `
      <g id="s52_bridge">
        <rect x="10" y="10" width="625" height="975" rx="24" fill="#E85A1F"/>
        <rect x="0" y="0" width="625" height="975" rx="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
        <line x1="65" y1="60" x2="65" y2="700" stroke="#0F0F0F" stroke-width="10"/>
      </g>
      <g id="s52_n1">
        <rect x="100" y="34" width="490" height="196" rx="20" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="4.5"/>
        <text x="132" y="88" font-family="Be Vietnam Pro" font-weight="900" font-size="30" fill="#B83B0B">1938 • DAEGU</text>
        <text x="132" y="138" font-family="Be Vietnam Pro" font-weight="900" font-size="22" fill="#0F0F0F">Tiệm cá khô 30.000 Won</text>
        <text x="132" y="178" font-family="Be Vietnam Pro" font-weight="700" font-size="18.5" fill="#222222">40 nhân viên khởi nghiệp</text>
      </g>
      <g id="s52_n2">
        <rect x="100" y="256" width="490" height="196" rx="20" fill="#136636" stroke="#0F0F0F" stroke-width="4.5"/>
        <text x="132" y="310" font-family="Be Vietnam Pro" font-weight="900" font-size="28" fill="#F5C518">MÀN HÌNH TRONG iPHONE</text>
        <text x="132" y="360" font-family="Be Vietnam Pro" font-weight="800" font-size="20" fill="#EFE9D9">Nắm giữ linh kiện yết hầu</text>
        <text x="132" y="396" font-family="Be Vietnam Pro" font-weight="700" font-size="18.5" fill="#EFE9D9">của cả đối thủ lớn nhất</text>
      </g>
      <g id="s52_n3">
        <rect x="100" y="478" width="490" height="196" rx="20" fill="#F5C518" stroke="#0F0F0F" stroke-width="4.5"/>
        <text x="132" y="532" font-family="Be Vietnam Pro" font-weight="900" font-size="30" fill="#0F0F0F">2026 • KỶ NGUYÊN AI</text>
        <text x="132" y="582" font-family="Be Vietnam Pro" font-weight="900" font-size="22" fill="#0F0F0F">Chip nhớ HBM nuôi sống AI</text>
        <text x="132" y="618" font-family="Be Vietnam Pro" font-weight="800" font-size="18.5" fill="#136636">Hành trình gần 90 năm bão tố</text>
      </g>
      <g id="s52_q">
        <rect x="34" y="706" width="556" height="236" rx="20" fill="#0F0F0F"/>
        ${svgWrap(60, 736, 504, 180, `
          <div style="text-align:center;">
            <div style="font-size:28px;font-weight:900;line-height:1.25;color:#F5C518;">SAMSUNG THẬT SỰ LÀ MỘT CÔNG TY NHƯ THẾ NÀO?</div>
            <div style="margin-top:14px;font-size:18.5px;font-weight:700;line-height:1.4;color:#EFE9D9;">Câu trả lời nằm ở sự khác biệt giữa Nghệ Sĩ và Chiến Binh Công Nghiệp</div>
          </div>
        `)}
      </g>`;
    js += `
      tl.fromTo("#s52_bridge", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.4)" }, ${beat(0.50, 'pop')});
      tl.fromTo("#s52_n1", { scale: 0.90, opacity: 0, svgOrigin: "345 132" }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.7)" }, ${beat(3.05, 'pop')});
      tl.fromTo("#s52_n2", { scale: 0.90, opacity: 0, svgOrigin: "345 354" }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.7)" }, ${beat(8.70, 'ding')});
      tl.fromTo("#s52_n3", { scale: 0.90, opacity: 0, svgOrigin: "345 576" }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.7)" }, ${beat(10.90, 'ping')});
      tl.fromTo("#s52_q", { scale: 0.92, opacity: 0, svgOrigin: "312 824" }, { scale: 1, opacity: 1, duration: 0.48, ease: "back.out(1.7)" }, ${beat(13.15, 'slam')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, ${beat(14.10, null)});
    `;
  } else if (num === 53) {
    const vA3 = regVar(`s53_a3`, `Cảnh 53 - Mệnh đề A3 PA1`, p.leftTitle);
    const stages = [
      { t: '1. HẠT CÁT SILICON', c: '#E85A1F', fg: '#0F0F0F' },
      { t: '2. CHIP DRAM / HBM', c: '#F5C518', fg: '#0F0F0F' },
      { t: '3. TẤM NỀN OLED', c: '#136636', fg: '#EFE9D9' },
      { t: '4. THIẾT BỊ CUỐI CÙNG', c: '#F06CA8', fg: '#0F0F0F' }
    ];
    svgInner = `
      <g id="s53_apple">
        <rect x="0" y="0" width="408" height="475" rx="22" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
        <path d="M104 162 A 84 84 0 0 1 272 162 Z" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4.5"/>
        <circle cx="188" cy="112" r="28" fill="#136636" stroke="#0F0F0F" stroke-width="3.5"/>
        <rect x="182" y="138" width="12" height="24" fill="#0F0F0F"/>
        <rect x="88" y="162" width="200" height="20" rx="7" fill="#0F0F0F"/>
        ${svgWrap(24, 198, 360, 260, `
          <div style="font-size:22px;font-weight:900;line-height:1.22;color:#0F0F0F;text-transform:uppercase;" ${vA3}>${p.leftTitle}</div>
          <div style="margin-top:14px;font-size:17px;font-weight:700;line-height:1.45;color:#222222;">
            • Chỉ xuất hiện khi hoàn hảo<br/>
            • Kiểm soát khu vườn hệ sinh thái<br/>
            • <span style="color:#136636;font-weight:800;">Thuê ngoài phần cứng vật lý</span>
          </div>
        `)}
      </g>
      <g id="s53_forge">
        <rect x="438" y="8" width="402" height="475" rx="22" fill="#E85A1F"/>
        <rect x="430" y="0" width="402" height="475" rx="22" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
        <path d="M510 164 L710 164 L682 114 L538 114 Z" fill="#0F0F0F"/>
        <rect x="550" y="92" width="120" height="24" rx="5" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3"/>
        <g id="s53_hammer">
          <rect x="602" y="28" width="16" height="62" rx="5" fill="#0F0F0F"/>
          <rect x="564" y="18" width="92" height="36" rx="8" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
        </g>
        ${svgWrap(454, 186, 354, 275, `
          <div style="font-size:23px;font-weight:900;color:#0F0F0F;">SAMSUNG: CHIẾN BINH</div>
          <div style="font-size:20px;font-weight:900;color:#B83B0B;">CÔNG NGHIỆP LÌ LỢM</div>
          <div style="margin-top:12px;font-size:17px;font-weight:800;line-height:1.45;color:#0F0F0F;">
            • Không ngại thử sai trước công chúng<br/>
            • Dám đốt 150.000 máy &amp; vượt bão 5,3 tỷ USD<br/>
            • <span style="color:#136636;">Tự đập đi xây lại chính mình</span>
          </div>
        `)}
      </g>
      <g id="s53_belt">
        <rect x="0" y="510" width="635" height="475" rx="24" fill="#0F0F0F"/>
        <line x1="40" y1="748" x2="595" y2="748" stroke="#F5C518" stroke-width="5" stroke-dasharray="18 12"/>
        ${stages.map((st, idx) => {
          const col = idx % 2;
          const row = Math.floor(idx / 2);
          const bx = 28 + col * 296;
          const by = 548 + row * 224;
          return `
          <g id="s53_st_${idx}">
            <rect x="${bx}" y="${by}" width="282" height="175" rx="18" fill="${st.c}" stroke="#EFE9D9" stroke-width="3.5"/>
            <text x="${bx + 141}" y="${by + 96}" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="21" fill="${st.fg}">${st.t}</text>
          </g>`;
        }).join('')}
      </g>`;
    js += `
      tl.fromTo("#s53_apple", { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(0.25, 'pop')});
      tl.fromTo("#s53_forge", { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "back.out(1.5)" }, ${beat(4.55, 'slam')});
      tl.fromTo("#s53_hammer", { rotation: -28, svgOrigin: "610 102" }, { rotation: 18, duration: 0.45, yoyo: true, repeat: 7, ease: "power2.inOut" }, 4.95);
      tl.fromTo("#s53_belt", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.4)" }, ${beat(16.05, 'whoosh')});
      tl.fromTo("#s53_st_0", { scale: 0.85, opacity: 0, svgOrigin: "169 635" }, { scale: 1, opacity: 1, duration: 0.36, ease: "back.out(1.8)" }, ${beat(18.70, 'click')});
      tl.fromTo("#s53_st_1", { scale: 0.85, opacity: 0, svgOrigin: "465 635" }, { scale: 1, opacity: 1, duration: 0.36, ease: "back.out(1.8)" }, ${beat(19.50, 'click')});
      tl.fromTo("#s53_st_2", { scale: 0.85, opacity: 0, svgOrigin: "169 859" }, { scale: 1, opacity: 1, duration: 0.36, ease: "back.out(1.8)" }, ${beat(20.20, 'ding')});
      tl.fromTo("#s53_st_3", { scale: 0.85, opacity: 0, svgOrigin: "465 859" }, { scale: 1, opacity: 1, duration: 0.40, ease: "back.out(1.8)" }, ${beat(20.85, 'ping')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, ${beat(23.80, null)});
    `;
  } else {
    svgInner = `
      <g id="s54_left">
        <rect x="0" y="0" width="840" height="475" rx="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
        <circle cx="420" cy="148" r="105" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
        <polygon points="420,62 468,162 432,154 448,224 372,138 408,146" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>
        <text x="420" y="314" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="31" fill="#0F0F0F">SAMSUNG ELECTRONICS (1938 – 2026)</text>
        <text x="420" y="366" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="21" fill="#222222">Hành trình 88 năm từ tiệm cá khô Daegu</text>
        <text x="420" y="404" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="21" fill="#136636">đến Chiến Binh Công Nghiệp không thể thay thế.</text>
      </g>
      <g id="s54_right">
        <rect x="10" y="534" width="625" height="450" rx="24" fill="#E85A1F"/>
        <rect x="0" y="522" width="625" height="450" rx="24" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
        <rect x="28" y="556" width="568" height="205" rx="18" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4.5"/>
        ${svgWrap(46, 588, 532, 145, `
          <div style="text-align:center;">
            <div style="font-size:29px;font-weight:900;color:#0F0F0F;">CẢM ƠN CÁC BẠN ĐÃ THEO DÕI!</div>
            <div style="margin-top:14px;font-size:20px;font-weight:800;color:#B83B0B;">Hẹn gặp lại mọi người ở những video tiếp theo!</div>
          </div>
        `)}
        <g id="s54_cta_btns">
          <rect x="28" y="796" width="272" height="128" rx="20" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4.5"/>
          <text x="164" y="870" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="25" fill="#0F0F0F">ĐĂNG KÝ KÊNH</text>
          <rect x="324" y="796" width="272" height="128" rx="20" fill="#0F0F0F"/>
          <text x="460" y="870" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="25" fill="#F5C518">HẸN GẶP LẠI</text>
        </g>
      </g>`;
    js += `
      tl.fromTo("#s54_left", { y: -35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.4)" }, ${beat(0.20, 'pop')});
      tl.fromTo("#s54_right", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.5)" }, ${beat(2.35, 'whoosh')});
      tl.fromTo("#s54_cta_btns", { scale: 0.85, opacity: 0, svgOrigin: "312 860" }, { scale: 1, opacity: 1, duration: 0.42, ease: "back.out(1.8)" }, ${beat(3.10, 'ping')});
      tl.fromTo("#foot_${num}", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, ${beat(3.90, null)});
    `;
  }

  const html = `
      <div class="${stageClass}">
        ${corners}
        ${topHeader}
        <svg viewBox="0 0 840 1000" style="position:absolute;left:120px;top:308px;width:840px;height:1000px;z-index:5;overflow:visible;">
          ${svgInner}
        </svg>
        ${bottomBanner}
      </div>`;

  return wrapScene(id, html, js);
}

// ============================================================================
// PORTRAIT 9:16 WAY A (FULL-BLEED) & WAY B (840x472 16:9 WINDOW) B-ROLL BUILDERS
// ============================================================================
function buildWayAShot(num, brollFile, p) {
  const id = `scene-${String(num).padStart(2, '0')}`;
  const vTitle = regVar(`s${num}_title`, `Cảnh ${num} - Tiêu đề`, p.title);
  const vSub = regVar(`s${num}_sub`, `Cảnh ${num} - Phụ đề`, p.sub);
  const vMetric = regVar(`s${num}_metric`, `Cảnh ${num} - Số liệu`, p.metric);
  const vFoot = regVar(`s${num}_foot`, `Cảnh ${num} - Kết luận`, p.footer);

  const b = p.beats || {};
  const t1 = beat(b.top ?? 0.30, 'whoosh');
  const t2 = beat(b.metric ?? Math.min(3.8, p.dur * 0.35), 'ping');
  const t3 = beat(b.bot ?? Math.max(0.5, p.dur - 1.5), null);

  const html = `
      <div class="cm-stage">
        <div class="cm-waya-full" data-layout-allow-overlap>
          <video id="vid_wa_${num}" class="clip" src="../assets/broll/${brollFile}" data-start="0" data-duration="${p.dur}" muted playsinline></video>
        </div>

        <div id="wa_top_${num}" class="cm-card cm-shadow-ink" data-layout-allow-overlap style="position:absolute;left:120px;top:164px;width:840px;padding:18px 24px;background:#EFE9D9;border-radius:20px;z-index:12;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:14px;">
            <div class="cm-display" style="font-size:27px;color:#0F0F0F;" ${vTitle}>${p.title}</div>
            <span class="cm-pill" style="background:#F5C518;color:#0F0F0F;font-size:17px;padding:6px 16px;">${extractYearBadge(p.title, p.sub)}</span>
          </div>
          <div class="cm-sub" style="font-size:17px;margin-top:8px;color:#1E1E1E;" ${vSub}>${p.sub}</div>
        </div>

        <div id="wa_metric_${num}" class="cm-card cm-shadow-featured" data-layout-allow-overlap style="position:absolute;left:120px;top:1032px;width:640px;padding:20px 24px;background:#F5C518;border-radius:20px;z-index:12;">
          <div class="cm-display" style="font-size:34px;color:#0F0F0F;line-height:1.08;" ${vMetric}>${p.metric}</div>
          <div class="cm-sub" style="font-size:17.5px;font-weight:800;color:#0F0F0F;margin-top:8px;">${p.metricLabel}</div>
        </div>

        <div id="wa_bot_${num}" class="cm-card cm-shadow-ink" data-layout-allow-overlap style="position:absolute;left:120px;top:1278px;width:640px;min-height:102px;padding:14px 22px;background:#0F0F0F;border-radius:18px;display:flex;align-items:center;gap:14px;z-index:12;">
          <span style="width:14px;height:14px;border-radius:999px;background:#F5C518;display:inline-block;flex-shrink:0;"></span>
          <span class="cm-sub" style="font-size:17px;line-height:1.32;color:#EFE9D9;font-weight:800;" ${vFoot}>${p.footer}</span>
        </div>
      </div>`;

  const js = `
    tl.fromTo("#wa_top_${num}", { y: -35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, ${t1});
    tl.fromTo("#wa_metric_${num}", { y: 30, scale: 0.92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" }, ${t2});
    tl.fromTo("#wa_bot_${num}", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" }, ${t3});
  `;
  return wrapScene(id, html, js);
}

function buildWayBShot(num, brollFile, p) {
  const id = `scene-${String(num).padStart(2, '0')}`;
  const vTitle = regVar(`s${num}_title`, `Cảnh ${num} - Tiêu đề`, p.title);
  const vSub = regVar(`s${num}_sub`, `Cảnh ${num} - Phụ đề`, p.sub);
  const vMetric = regVar(`s${num}_metric`, `Cảnh ${num} - Số liệu`, p.metric);
  const vFoot = regVar(`s${num}_foot`, `Cảnh ${num} - Kết luận`, p.footer);

  const b = p.beats || {};
  const yearTag = extractYearBadge(p.title, p.sub);
  const tWin = beat(0.06, 'whoosh');
  const tTitle = beat(b.top ?? 0.40, 'pop');
  const tMid = beat(b.mid ?? Math.min(3.8, p.dur * 0.32), p.newsSource ? 'Swipe' : 'click');
  const tMetric = beat(b.metric ?? Math.min(7.2, p.dur * 0.58), 'ping');
  const tBot = beat(b.bot ?? Math.min(10.2, p.dur * 0.80), null);

  let midCardHtml = '';
  if (p.newsSource && p.newsHeadline) {
    const vNews = regVar(`s${num}_news`, `Cảnh ${num} - Báo chí`, p.newsHeadline);
    midCardHtml = `
        <div id="wb_mid_${num}" class="cm-card cm-shadow-ink" style="position:absolute;left:120px;top:846px;width:640px;height:234px;padding:15px 20px;background:#EFE9D9;border-radius:20px;z-index:10;display:flex;flex-direction:column;justify-content:space-between;">
          <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:3.5px solid #0F0F0F;padding-bottom:6px;">
            <span class="cm-display" style="font-size:21px;color:#0F0F0F;">${p.newsSource}</span>
            <span class="cm-pill" style="background:#F5C518;color:#0F0F0F;font-size:14px;padding:3px 12px;">${yearTag}</span>
          </div>
          <div style="background:#F5C518;border:3px solid #0F0F0F;border-radius:12px;padding:10px 14px;">
            <div class="cm-sub" style="font-size:16px;font-weight:900;color:#0F0F0F;line-height:1.28;" ${vNews}>${p.newsHeadline}</div>
          </div>
          <div class="cm-sub" style="font-size:15px;font-weight:700;color:#222222;">• ${p.b1}</div>
        </div>`;
  } else {
    midCardHtml = `
        <div id="wb_mid_${num}" class="cm-card cm-shadow-ink" style="position:absolute;left:120px;top:846px;width:640px;height:234px;padding:15px 20px;background:#E4DCC4;border-radius:20px;z-index:10;display:flex;flex-direction:column;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:34px;height:34px;border-radius:10px;background:#136636;border:3px solid #0F0F0F;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <div style="width:12px;height:12px;border-radius:999px;background:#F5C518;"></div>
            </div>
            <div class="cm-display" style="font-size:19px;color:#0F0F0F;">DIỄN BIẾN TRỌNG TÂM</div>
          </div>
          <div style="background:#EFE9D9;border:3px solid #0F0F0F;border-radius:12px;padding:9px 14px;">
            <div class="cm-sub" style="font-size:14.8px;font-weight:800;line-height:1.26;color:#0F0F0F;">• ${p.b1}</div>
            <div class="cm-sub" style="font-size:14.8px;font-weight:800;line-height:1.26;color:#136636;margin-top:5px;">• ${p.b2}</div>
          </div>
          <div style="width:100%;height:12px;background:#EFE9D9;border:3px solid #0F0F0F;border-radius:999px;overflow:hidden;">
            <div id="wb_bar_${num}" style="width:100%;height:100%;background:#E85A1F;transform-origin:left center;"></div>
          </div>
        </div>`;
  }

  const html = `
      <div class="cm-stage">
        ${cornersHtml(false)}

        <div id="wb_top_${num}" class="cm-card cm-shadow-ink" style="position:absolute;left:120px;top:164px;width:840px;height:164px;padding:15px 24px;background:#EFE9D9;border-radius:20px;z-index:10;display:flex;flex-direction:column;justify-content:center;">
          <div class="cm-display" style="font-size:24px;color:#0F0F0F;line-height:1.15;" ${vTitle}>${p.title}</div>
          <div class="cm-sub" style="font-size:16px;color:#222222;margin-top:7px;line-height:1.30;" ${vSub}>${p.sub}</div>
        </div>

        <div id="wb_win_${num}" class="cm-wayb-win cm-shadow-featured" data-layout-allow-overlap style="left:120px;top:358px;width:840px;height:472px;">
          <video id="vid_wb_${num}" class="clip" src="../assets/broll/${brollFile}" data-start="0" data-duration="${p.dur}" muted playsinline></video>
        </div>

        <div id="wb_yr_${num}" class="cm-pill cm-shadow-ink" data-layout-allow-overlap style="position:absolute;left:142px;top:340px;background:#F5C518;color:#0F0F0F;font-size:17px;padding:7px 20px;z-index:14;">
          ${yearTag}
        </div>

        ${midCardHtml}

        <div id="wb_metric_${num}" class="cm-card cm-shadow-ink" style="position:absolute;left:120px;top:1094px;width:640px;height:194px;padding:15px 22px;background:#F5C518;border-radius:20px;z-index:10;display:flex;flex-direction:column;justify-content:center;">
          <div class="cm-display" style="font-size:31px;color:#0F0F0F;line-height:1.08;" ${vMetric}>${p.metric}</div>
          <div class="cm-sub" style="font-size:16.5px;font-weight:900;color:#0F0F0F;margin-top:7px;">${p.metricLabel}</div>
          <div class="cm-sub" style="font-size:15px;font-weight:700;color:#1E1E1E;margin-top:6px;">• ${p.b3}</div>
        </div>

        <div id="wb_bot_${num}" class="cm-card" style="position:absolute;left:120px;top:1302px;width:640px;height:112px;background:#0F0F0F;border-radius:18px;padding:12px 22px;display:flex;align-items:center;gap:14px;z-index:12;">
          <div style="width:14px;height:14px;border-radius:999px;background:#1F8A4C;border:2px solid #EFE9D9;flex-shrink:0;"></div>
          <div class="cm-sub" style="font-size:17px;line-height:1.32;color:#EFE9D9;font-weight:800;" ${vFoot}>${p.footer}</div>
        </div>
      </div>`;

  const js = `
    tl.fromTo("#wb_win_${num}", { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" }, ${tWin});
    tl.fromTo("#wb_yr_${num}", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.6)" }, ${tTitle});
    tl.fromTo("#wb_top_${num}", { y: -28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, ${tTitle});
    tl.fromTo("#wb_mid_${num}", { x: -35, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "back.out(1.3)" }, ${tMid});
    ${!p.newsSource ? `tl.fromTo("#wb_bar_${num}", { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power2.out" }, ${+(tMid + 0.2).toFixed(2)});` : ''}
    tl.fromTo("#wb_metric_${num}", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.6)" }, ${tMetric});
    tl.fromTo("#wb_bot_${num}", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" }, ${tBot});
  `;
  return wrapScene(id, html, js);
}

// ============================================================================
// GENERATE ALL 54 9:16 COMPOSITIONS + ROOT INDEX.HTML WITH VOICE-SYNCED SFX
// ============================================================================
console.log('Generating 54 Portrait 9:16 (1080x1920 @ 60fps) compositions...');

for (const s of SHOTS) {
  s.dur = +(s.end - s.start).toFixed(2);
  CURRENT_SHOT = s;

  let sceneHtml = '';
  if (s.mode === 'MOTION') {
    sceneHtml = buildIllustratedMotionShot(s.num, s);
  } else if (s.mode === 'WAY_A') {
    sceneHtml = buildWayAShot(s.num, s.broll, s);
  } else {
    sceneHtml = buildWayBShot(s.num, s.broll, s);
  }

  const outFile = join(COMP_DIR, `scene-${String(s.num).padStart(2, '0')}.html`);
  writeFileSync(outFile, sceneHtml, 'utf8');
}

SFX_EVENTS.sort((a, b) => a.time - b.time);

const trackEndTimes = [0, 0, 0];
const sfxClipsHtml = [];

for (let i = 0; i < SFX_EVENTS.length; i++) {
  const ev = SFX_EVENTS[i];
  const spec = SFX_SPEC_MAP[ev.sfx] || { file: 'pop', dur: 0.24, vol: 0.16 };
  const clipDur = spec.dur;
  if (ev.time + clipDur >= TOTAL_DUR - 0.1) continue;

  let chosenIdx = -1;
  for (let t = 0; t < 3; t++) {
    if (ev.time >= trackEndTimes[t] + 0.04) {
      chosenIdx = t;
      break;
    }
  }
  if (chosenIdx === -1) continue;

  trackEndTimes[chosenIdx] = ev.time + clipDur;
  const trackNum = chosenIdx + 2;
  sfxClipsHtml.push(
    `<audio id="sfx-beat-${i + 1}" class="clip" src="assets/sfx/${spec.file}.wav" data-Common-Name="SFX ${spec.file} #${i + 1}" data-start="${ev.time}" data-duration="${clipDur}" data-track-index="${trackNum}" data-volume="${spec.vol}"></audio>`
  );
}

const sfxLines = [];
for (let i = 0; i < sfxClipsHtml.length; i += 2) {
  sfxLines.push('      ' + sfxClipsHtml.slice(i, i + 2).join(' '));
}

const subCompEntries = SHOTS.map(s => {
  const pad = String(s.num).padStart(2, '0');
  return `      <div id="slot-scene-${pad}" class="clip" data-Common-Name="Cảnh ${pad}: ${s.title.replace(/"/g, '&quot;')}" data-composition-id="scene-${pad}" data-composition-src="compositions/scene-${pad}.html" data-start="${s.start}" data-duration="${s.dur}" data-track-index="0"></div>`;
}).join('\n');

const varsJsonAttr = JSON.stringify(VARIABLES).replace(/'/g, '&#39;');

const indexHtml = `<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tất Tần Tật Về Samsung (1938–2026) | Documentary 9:16</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { width: 1080px; height: 1920px; overflow: hidden; background: #EFE9D9; }
      #root { position: relative; width: 1080px; height: 1920px; overflow: hidden; background: #EFE9D9; }
      .clip { position: absolute; inset: 0; width: 100%; height: 100%; }
    </style>
  </head>
  <body>
    <div
      id="root"
      data-composition-id="main"
      data-width="1080"
      data-height="1920"
      data-fps="60"
      data-duration="${TOTAL_DUR}"
      data-composition-variables='${varsJsonAttr}'
    >
      <!-- Track 0: 54 Portrait Documentary Scenes -->
${subCompEntries}

      <!-- Track 1: Master Voiceover Audio (A1 PA2 Spliced, 1113.73s) -->
      <audio
        id="voice-master"
        class="clip"
        src="assets/voice-master.mp3"
        data-Common-Name="Voiceover Master (A1 PA2)"
        data-start="0"
        data-duration="${TOTAL_DUR}"
        data-track-index="1"
        data-volume="1"
      ></audio>

      <!-- Tracks 2-4: Exact Voice- & Motion-Synchronized SFX Beats (${sfxClipsHtml.length} events) -->
${sfxLines.join('\n')}
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`;

writeFileSync(join(OUT, 'index.html'), indexHtml, 'utf8');
console.log(`Successfully generated 54 9:16 scenes, ${VARIABLES.length} Studio variables, and ${sfxClipsHtml.length} voice-locked SFX clips!`);
