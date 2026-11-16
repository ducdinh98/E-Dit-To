import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'f:/App nha lam/motion-video-demo/videos/samsung-documentary';
const COMP_DIR = join(OUT, 'compositions');
mkdirSync(COMP_DIR, { recursive: true });

const sfxManifest = JSON.parse(readFileSync(join(OUT, 'assets/sfx/manifest.json'), 'utf8'));

// =========================================================================
// Shared Inline SVG Icons & Flags (Editorial Neo-Brutalist, Rounded Strokes)
// Zero emojis anywhere. Zero redundant meta-labels.
// =========================================================================
const ICO = {
  check: (c = '#136636', sz = 28) => {
    const stroke = c === '#F5C518' || c === '#EFE9D9' || c === '#F06CA8' ? '#0F0F0F' : '#EFE9D9';
    return `<svg width="${sz}" height="${sz}" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" fill="${c}" stroke="#0F0F0F" stroke-width="3"/><path d="M9.5 16.5L14 21L22.5 11.5" stroke="${stroke}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  },
  cross: (c = '#F06CA8', sz = 28) =>
    `<svg width="${sz}" height="${sz}" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" fill="${c}" stroke="#0F0F0F" stroke-width="3"/><path d="M11 11L21 21M21 11L11 21" stroke="#0F0F0F" stroke-width="3.4" stroke-linecap="round"/></svg>`,
  warn: (sz = 28) =>
    `<svg width="${sz}" height="${sz}" viewBox="0 0 32 32" fill="none"><path d="M16 4L29 27H3L16 4Z" fill="#F5C518" stroke="#0F0F0F" stroke-width="3" stroke-linejoin="round"/><line x1="16" y1="12" x2="16" y2="19" stroke="#0F0F0F" stroke-width="3" stroke-linecap="round"/><circle cx="16" cy="23" r="1.7" fill="#0F0F0F"/></svg>`,
  flame: (sz = 32) =>
    `<svg width="${sz}" height="${sz}" viewBox="0 0 36 36" fill="none"><path d="M19 3C19 3 27 10 27 19C27 25 22.5 31 16 31C9.5 31 6 26 6 20C6 15 9.5 11 12 9C11.5 12.5 13.5 15 15.5 15C14 11 15.5 6.5 19 3Z" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3" stroke-linejoin="round"/><path d="M17.5 19C17.5 19 21 22 21 25C21 27.5 19 29.5 16.5 29.5C14 29.5 12.5 27.5 12.5 25C12.5 22.5 15 20.5 17.5 19Z" fill="#F5C518" stroke="#0F0F0F" stroke-width="2"/></svg>`,
  bolt: (sz = 32) =>
    `<svg width="${sz}" height="${sz}" viewBox="0 0 36 36" fill="none"><path d="M20 3L8 20H17L15 33L28 15H19L20 3Z" fill="#F5C518" stroke="#0F0F0F" stroke-width="3" stroke-linejoin="round"/></svg>`,
  chip: (sz = 32) =>
    `<svg width="${sz}" height="${sz}" viewBox="0 0 36 36" fill="none"><rect x="8" y="8" width="20" height="20" rx="4" fill="#136636" stroke="#0F0F0F" stroke-width="3"/><rect x="13" y="13" width="10" height="10" rx="2" fill="#F5C518" stroke="#0F0F0F" stroke-width="2.5"/><path d="M13 3V8M18 3V8M23 3V8M13 28V33M18 28V33M23 28V33M3 13H8M3 18H8M3 23H8M28 13H33M28 18H33M28 23H33" stroke="#0F0F0F" stroke-width="2.8" stroke-linecap="round"/></svg>`,
  crown: (sz = 34) =>
    `<svg width="${sz}" height="${sz}" viewBox="0 0 48 48" fill="none"><path d="M6 34L10 13L18.5 22L24 10L29.5 22L38 13L42 34H6Z" fill="#F5C518" stroke="#0F0F0F" stroke-width="3.5" stroke-linejoin="round"/><rect x="8" y="34" width="32" height="7" rx="3.5" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3"/></svg>`,
  flagVN: (w = 36, h = 24) =>
    `<svg width="${w}" height="${h}" viewBox="0 0 36 24" fill="none"><rect x="1.5" y="1.5" width="33" height="21" rx="4" fill="#DA251D" stroke="#0F0F0F" stroke-width="3"/><polygon points="18,5.5 19.9,11.2 25.9,11.2 21,14.7 22.9,20.4 18,16.9 13.1,20.4 15,14.7 10.1,11.2 16.1,11.2" fill="#FFFF00"/></svg>`,
  flagKR: (w = 36, h = 24) =>
    `<svg width="${w}" height="${h}" viewBox="0 0 36 24" fill="none"><rect x="1.5" y="1.5" width="33" height="21" rx="4" fill="#FFFFFF" stroke="#0F0F0F" stroke-width="3"/><circle cx="18" cy="12" r="5.2" fill="#CD2E3A"/><path d="M12.8 12A5.2 5.2 0 0 0 23.2 12A2.6 2.6 0 0 1 18 12A2.6 2.6 0 0 0 12.8 12Z" fill="#0047A0"/><line x1="8" y1="6" x2="11" y2="9" stroke="#0F0F0F" stroke-width="2"/><line x1="25" y1="6" x2="28" y2="9" stroke="#0F0F0F" stroke-width="2"/><line x1="8" y1="18" x2="11" y2="15" stroke="#0F0F0F" stroke-width="2"/><line x1="25" y1="18" x2="28" y2="15" stroke="#0F0F0F" stroke-width="2"/></svg>`,
  newsIcon: (sz = 26) =>
    `<svg width="${sz}" height="${sz}" viewBox="0 0 32 32" fill="none"><rect x="4" y="5" width="24" height="22" rx="4" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="3"/><line x1="9" y1="11" x2="23" y2="11" stroke="#0F0F0F" stroke-width="3" stroke-linecap="round"/><line x1="9" y1="16" x2="23" y2="16" stroke="#E85A1F" stroke-width="2.5" stroke-linecap="round"/><line x1="9" y1="21" x2="18" y2="21" stroke="#0F0F0F" stroke-width="2.5" stroke-linecap="round"/></svg>`,
};

// =========================================================================
// Shared Stylesheet Across All 54 Sub-Compositions (1920x1080 16:9)
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
  .ground-cream {
    position: absolute;
    inset: 0;
    background-color: #EFE9D9;
    background-image: radial-gradient(rgba(15, 15, 15, 0.15) 1.5px, transparent 1.5px);
    background-size: 36px 36px;
    z-index: 0;
  }
  .ground-green {
    position: absolute;
    inset: 0;
    background-color: #136636;
    background-image: radial-gradient(rgba(239, 233, 217, 0.16) 1.5px, transparent 1.5px);
    background-size: 36px 36px;
    z-index: 0;
  }
  .cm-stage {
    position: absolute;
    inset: 0;
    width: 1920px;
    height: 1080px;
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
    line-height: 1.1;
    letter-spacing: -0.015em;
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
    width: 28px;
    height: 28px;
    border-color: #0F0F0F;
    border-style: solid;
    z-index: 4;
    pointer-events: none;
  }
  .cm-corner.tl { top: 24px; left: 24px; border-width: 4px 0 0 4px; border-top-left-radius: 8px; }
  .cm-corner.tr { top: 24px; right: 24px; border-width: 4px 4px 0 0; border-top-right-radius: 8px; }
  .cm-corner.bl { bottom: 24px; left: 24px; border-width: 0 0 4px 4px; border-bottom-left-radius: 8px; }
  .cm-corner.br { bottom: 24px; right: 24px; border-width: 0 4px 4px 0; border-bottom-right-radius: 8px; }
  .cm-corner.light { border-color: #EFE9D9; }

  .cm-head {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-weight: 900;
    line-height: 1.15;
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

  /* Pill Badges (999px) */
  .cm-kicker {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #0F0F0F;
    color: #EFE9D9;
    border: 4px solid #0F0F0F;
    border-radius: 999px;
    padding: 8px 22px;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-weight: 800;
    font-size: 18px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .cm-pill-yellow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #F5C518;
    color: #0F0F0F;
    border: 4px solid #0F0F0F;
    border-radius: 999px;
    padding: 8px 20px;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-weight: 800;
    font-size: 17px;
    text-transform: uppercase;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .cm-pill-green {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #136636;
    color: #EFE9D9;
    border: 4px solid #0F0F0F;
    border-radius: 999px;
    padding: 8px 20px;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-weight: 800;
    font-size: 17px;
    text-transform: uppercase;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .cm-pill-pink {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #F06CA8;
    color: #0F0F0F;
    border: 4px solid #0F0F0F;
    border-radius: 999px;
    padding: 8px 20px;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-weight: 800;
    font-size: 17px;
    text-transform: uppercase;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .cm-pill-orange {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #E85A1F;
    color: #0F0F0F;
    border: 4px solid #0F0F0F;
    border-radius: 999px;
    padding: 8px 20px;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-weight: 800;
    font-size: 17px;
    text-transform: uppercase;
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* Rounded 4 Corners Cards (18px - 22px) */
  .cm-card {
    background: #EFE9D9;
    color: #0F0F0F;
    border: 5px solid #0F0F0F;
    border-radius: 20px;
  }
  .cm-card-alt {
    background: #E4DCC4;
    color: #0F0F0F;
    border: 5px solid #0F0F0F;
    border-radius: 20px;
  }
  .cm-card-dark {
    background: #0F0F0F;
    color: #EFE9D9;
    border: 5px solid #0F0F0F;
    border-radius: 20px;
  }
  .cm-card-green {
    background: #136636;
    color: #EFE9D9;
    border: 5px solid #0F0F0F;
    border-radius: 20px;
  }
  .cm-card-yellow {
    background: #F5C518;
    color: #0F0F0F;
    border: 5px solid #0F0F0F;
    border-radius: 20px;
  }
  .cm-card-pink {
    background: #F06CA8;
    color: #0F0F0F;
    border: 5px solid #0F0F0F;
    border-radius: 20px;
  }
  .cm-card-orange {
    background: #E85A1F;
    color: #0F0F0F;
    border: 5px solid #0F0F0F;
    border-radius: 20px;
  }

  /* Shadows (Featured Orange max 1 per scene) */
  .cm-shadow-featured {
    box-shadow: 12px 12px 0 #E85A1F, 12px 12px 0 4px #0F0F0F;
  }
  .cm-shadow-ink {
    box-shadow: 8px 8px 0 #0F0F0F;
  }
  .cm-shadow-green {
    box-shadow: 8px 8px 0 #136636, 8px 8px 0 4px #0F0F0F;
  }
  .cm-shadow-yellow {
    box-shadow: 10px 10px 0 #F5C518, 10px 10px 0 4px #0F0F0F;
  }

  /* Way B Hero B-Roll Window (1248x702 = exact 16:9, 22px radius, 5px ink border) */
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

  /* Way A Full-Bleed B-Roll Container */
  .cm-waya-full {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 2;
    background: #0F0F0F;
  }
  .cm-waya-full video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

// Track studio variables cleanly
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
      <div id="root" data-composition-id="${id}" data-width="1920" data-height="1080">
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


// Global SFX event collector so every GSAP visual beat emits an exact SFX clip on index.html
const SFX_EVENTS = [];
let CURRENT_SHOT = null;

function beat(tLocal, sfx = 'pop') {
  if (!CURRENT_SHOT) return tLocal;
  const clamped = Math.max(0.06, Math.min(+(CURRENT_SHOT.dur - 0.35).toFixed(2), +tLocal.toFixed(2)));
  if (sfx) {
    const absTime = +(CURRENT_SHOT.start + clamped).toFixed(2);
    // Avoid duplicate SFX within 0.22s
    const clash = SFX_EVENTS.some(e => Math.abs(e.time - absTime) < 0.22);
    if (!clash) {
      SFX_EVENTS.push({ time: absTime, sfx, shotNum: CURRENT_SHOT.num });
    }
  }
  return clamped;
}

// Clean year/topic extractors (zero meta labels!)
function extractYearBadge(title, sub) {
  const m = (title + ' ' + sub).match(/\b(19\d{2}|20\d{2})\b/);
  return m ? m[1] : 'SAMSUNG';
}

// ============================================================================
// 100% FULL MOTION BESPOKE ILLUSTRATED STAGE BUILDER (21 SHOTS IN STORYBOARD.MD)
// ============================================================================
function buildIllustratedMotionShot(num, p) {
  const id = `scene-${String(num).padStart(2, '0')}`;
  const isDarkGreen = p.variant === 'dark_green_cta';
  const stageClass = isDarkGreen ? 'cm-stage dark-green' : 'cm-stage';
  const corners = cornersHtml(isDarkGreen);

  const vTitle = regVar(`s${num}_title`, `Cảnh ${num} - Tiêu đề`, p.title);
  const vSub = regVar(`s${num}_sub`, `Cảnh ${num} - Phụ đề`, p.sub);
  const vFoot = regVar(`s${num}_foot`, `Cảnh ${num} - Kết luận`, p.footer);

  let html = '';
  let js = '';

  const yearBadge = extractYearBadge(p.title, p.sub);
  const topHeader = `
    <div id="hdr_${num}" style="position:absolute;left:64px;right:64px;top:38px;display:flex;justify-content:space-between;align-items:center;z-index:10;">
      <div style="max-width:1500px;overflow:hidden;">
        <div class="cm-display" style="font-size:36px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:${isDarkGreen ? '#EFE9D9' : '#0F0F0F'};" ${vTitle}>${p.title}</div>
        <div class="cm-sub" style="font-size:19px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:${isDarkGreen ? '#F5C518' : '#222222'};margin-top:4px;" ${vSub}>${p.sub}</div>
      </div>
      <div class="cm-pill" style="background:#F5C518;color:#0F0F0F;font-size:20px;padding:10px 24px;">${yearBadge}</div>
    </div>`;

  const bottomBanner = `
    <div id="foot_${num}" class="cm-card" style="position:absolute;left:64px;right:64px;bottom:42px;height:78px;background:#0F0F0F;border-radius:18px;padding:0 32px;display:flex;align-items:center;justify-content:space-between;z-index:10;">
      <div style="display:flex;align-items:center;gap:16px;">
        <div style="width:16px;height:16px;border-radius:999px;background:#F5C518;"></div>
        <div class="cm-sub" style="font-size:20px;color:#EFE9D9;font-weight:800;" ${vFoot}>${p.footer}</div>
      </div>
      <div class="cm-mono" style="font-size:18px;color:#F5C518;">${p.leftTitle} → ${p.rightTitle}</div>
    </div>`;

  js += `
    tl.fromTo("#hdr_${num}", { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, ${beat(0.06, null)});
  `;

  if (num === 1) {
    // SHOT #01 (00:00.0 - 00:12.4): iPhone in iFan's Hand -> Hidden Money Pipe ($) -> Samsung Electronics Vault
    html = `
      <div class="${stageClass}">
        ${corners}
        ${topHeader}
        <svg viewBox="0 0 1792 730" style="position:absolute;left:64px;top:172px;width:1792px;height:730px;z-index:5;overflow:visible;">
          <!-- Left Card: iFan Holding iPhone -->
          <g id="s1_left">
            <rect x="0" y="15" width="730" height="665" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
            <rect x="32" y="42" width="280" height="44" rx="22" fill="#0F0F0F"/>
            <text x="172" y="71" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="19" fill="#F5C518">iFAN CHÍNH HIỆU</text>
            <!-- Drawn iPhone with OLED + NAND Callout -->
            <g id="s1_iphone">
              <rect x="75" y="120" width="240" height="450" rx="34" fill="#0F0F0F" stroke="#0F0F0F" stroke-width="5"/>
              <rect x="92" y="142" width="206" height="406" rx="22" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="3"/>
              <rect x="155" y="156" width="80" height="22" rx="11" fill="#0F0F0F"/>
              <!-- Exploded OLED & NAND layers inside iPhone -->
              <rect x="115" y="210" width="160" height="115" rx="14" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="4"/>
              <text x="195" y="262" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="22" fill="#EFE9D9">OLED DISPLAY</text>
              <text x="195" y="294" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="15" fill="#F5C518">BY SAMSUNG</text>
              <rect x="115" y="350" width="160" height="115" rx="14" fill="#F06CA8" stroke="#0F0F0F" stroke-width="4"/>
              <text x="195" y="402" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="22" fill="#0F0F0F">CHIP NHỚ</text>
              <text x="195" y="434" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="15" fill="#0F0F0F">DRAM / NAND</text>
            </g>
            <g id="s1_txt">
              <rect x="355" y="150" width="335" height="410" rx="20" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4.5"/>
              <text x="385" y="220" font-family="Be Vietnam Pro" font-weight="900" font-size="28" fill="#0F0F0F">CẦM TRÊN TAY</text>
              <text x="385" y="260" font-family="Be Vietnam Pro" font-weight="900" font-size="28" fill="#E85A1F">CHIẾC IPHONE</text>
              <text x="385" y="325" font-family="Be Vietnam Pro" font-weight="700" font-size="21" fill="#222222">• Tự hào là iFan chính hiệu</text>
              <text x="385" y="370" font-family="Be Vietnam Pro" font-weight="700" font-size="21" fill="#222222">• Nhưng linh kiện đắt giá</text>
              <text x="385" y="405" font-family="Be Vietnam Pro" font-weight="700" font-size="21" fill="#222222">  nhất bên trong lại do</text>
              <text x="385" y="440" font-family="Be Vietnam Pro" font-weight="900" font-size="21" fill="#1F8A4C">  Samsung sản xuất!</text>
            </g>
          </g>

          <!-- Center Money Pipeline ($) -->
          <g id="s1_pipe">
            <rect x="730" y="310" width="332" height="64" fill="#0F0F0F"/>
            <g id="s1_coins">
              <circle cx="805" cy="342" r="24" fill="#F5C518" stroke="#0F0F0F" stroke-width="3.5"/>
              <text x="805" y="350" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="22" fill="#0F0F0F">$</text>
              <circle cx="896" cy="342" r="24" fill="#F5C518" stroke="#0F0F0F" stroke-width="3.5"/>
              <text x="896" y="350" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="22" fill="#0F0F0F">$</text>
              <circle cx="987" cy="342" r="24" fill="#F5C518" stroke="#0F0F0F" stroke-width="3.5"/>
              <text x="987" y="350" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="22" fill="#0F0F0F">$</text>
            </g>
            <rect x="765" y="235" width="262" height="52" rx="14" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>
            <text x="896" y="268" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="18" fill="#0F0F0F">DÒNG TIỀN ẨN →</text>
          </g>

          <!-- Right Card: Samsung Electronics Steel Vault -->
          <g id="s1_right">
            <rect x="1074" y="27" width="718" height="665" rx="24" fill="#E85A1F"/>
            <rect x="1062" y="15" width="718" height="665" rx="24" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
            <rect x="1096" y="42" width="340" height="44" rx="22" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="3.5"/>
            <text x="1266" y="71" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="19" fill="#EFE9D9">SAMSUNG ELECTRONICS</text>
            <!-- Drawn Bank Vault Door & Rotating Wheel -->
            <rect x="1140" y="125" width="560" height="340" rx="26" fill="#0F0F0F"/>
            <rect x="1170" y="152" width="500" height="286" rx="18" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
            <g id="s1_wheel">
              <circle cx="1420" cy="295" r="95" fill="#E85A1F" stroke="#0F0F0F" stroke-width="6"/>
              <line x1="1325" y1="295" x2="1515" y2="295" stroke="#0F0F0F" stroke-width="9"/>
              <line x1="1420" y1="200" x2="1420" y2="390" stroke="#0F0F0F" stroke-width="9"/>
              <circle cx="1420" cy="295" r="36" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
            </g>
            <text x="1420" y="535" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="32" fill="#0F0F0F">GIÁN TIẾP TRẢ TIỀN MỖI NGÀY</text>
            <text x="1420" y="585" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="21" fill="#0F0F0F">Mỗi chiếc iPhone bán ra đều mang lại</text>
            <text x="1420" y="618" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="21" fill="#0F0F0F">doanh thu linh kiện tỷ đô cho Samsung</text>
          </g>
        </svg>
        ${bottomBanner}
      </div>`;
    js += `
      tl.fromTo("#s1_left", { x: -45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "back.out(1.3)" }, ${beat(0.95, 'pop')});
      tl.fromTo("#s1_txt", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" }, ${beat(2.70, null)});
      tl.fromTo("#s1_pipe", { scaleX: 0, opacity: 0, svgOrigin: "730 342" }, { scaleX: 1, opacity: 1, duration: 0.5, ease: "power3.out" }, ${beat(5.55, 'whoosh')});
      tl.fromTo("#s1_coins circle, #s1_coins text", { x: -65, scale: 0.7, opacity: 0 }, { x: 0, scale: 1, opacity: 1, stagger: 0.1, duration: 0.4 }, ${beat(6.20, 'ping')});
      tl.fromTo("#s1_right", { x: 45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "back.out(1.4)" }, ${beat(9.85, 'ding')});
      tl.fromTo("#s1_wheel", { rotation: 0, svgOrigin: "1420 295" }, { rotation: 180, duration: 1.8, ease: "back.out(1.5)" }, 9.95);
      tl.fromTo("#foot_${num}", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, ${beat(11.15, null)});
    `;
  } else if (num === 5) {
    // SHOT #05 (00:45.2 - 01:22.0, dur 36.8s): Crossed-out California/Tokyo -> 1938 Daegu Shop + 4 Domino Stations
    const stations = [
      { yr: '1938 → 1995', title: 'ĐỐT 150.000 MÁY', desc: 'Từ tiệm cá khô 40 nhân viên đến ngọn lửa Gumi chấn động', bg: '#EFE9D9', badgeBg: '#E85A1F', icon: `<polygon points="200,105 245,195 155,195" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/><circle cx="200" cy="180" r="26" fill="#F5C518" stroke="#0F0F0F" stroke-width="3.5"/>` },
      { yr: '2005 – 2012', title: 'VƯỢT SONY & NOKIA', desc: 'Lần lượt hạ bệ hai tượng đài điện tử và di động thế giới', bg: '#E4DCC4', badgeBg: '#1F8A4C', icon: `<polygon points="135,195 155,125 200,160 245,125 265,195" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>` },
      { yr: '2016 – 2017', title: 'SỐNG SÓT 5,3 TỶ USD', desc: 'Đứng dậy thần kỳ sau thảm họa thu hồi Galaxy Note 7', bg: '#EFE9D9', badgeBg: '#F06CA8', icon: `<rect x="155" y="110" width="90" height="95" rx="14" fill="#F06CA8" stroke="#0F0F0F" stroke-width="4"/><path d="M180 158 L195 175 L225 140" fill="none" stroke="#0F0F0F" stroke-width="6" stroke-linecap="round"/>` },
      { yr: '2024 – 2026', title: 'CUỘC CHIẾN AI & HBM', desc: 'Bước vào trận đánh sống còn nuôi sống kỷ nguyên AI', bg: '#F5C518', badgeBg: '#0F0F0F', icon: `<rect x="145" y="115" width="110" height="85" rx="12" fill="#0F0F0F"/><text x="200" y="168" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="26" fill="#F5C518">AI</text>` }
    ];
    html = `
      <div class="${stageClass}">
        ${corners}
        ${topHeader}
        <svg viewBox="0 0 1792 730" style="position:absolute;left:64px;top:172px;width:1792px;height:730px;z-index:5;overflow:visible;">
          <!-- Top Row: Not California Garage (X) / Not Tokyo Lab (X) -> 1938 Daegu Dried Fish Shop -->
          <g id="s5_topL">
            <rect x="0" y="5" width="510" height="175" rx="20" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="4.5"/>
            <text x="255" y="75" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="26" fill="#0F0F0F">GARA CALIFORNIA?</text>
            <text x="255" y="120" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="20" fill="#E85A1F">KHÔNG PHẢI THUNG LŨNG SILICON ✕</text>
            <line x1="45" y1="25" x2="465" y2="155" stroke="#E85A1F" stroke-width="8" stroke-linecap="round"/>
          </g>
          <g id="s5_topM">
            <rect x="545" y="5" width="510" height="175" rx="20" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="4.5"/>
            <text x="800" y="75" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="26" fill="#0F0F0F">PHÒNG LAB TOKYO?</text>
            <text x="800" y="120" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="20" fill="#E85A1F">KHÔNG PHẢI XƯỞNG ĐIỆN TỬ NHẬT ✕</text>
            <line x1="590" y1="25" x2="1010" y2="155" stroke="#E85A1F" stroke-width="8" stroke-linecap="round"/>
          </g>
          <g id="s5_topR">
            <rect x="1090" y="5" width="702" height="175" rx="20" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="5"/>
            <text x="1441" y="68" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="28" fill="#F5C518">TIỆM CÁ KHÔ &amp; MÌ SỢI DAEGU (1938)</text>
            <text x="1441" y="115" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="21" fill="#EFE9D9">Xuất phát điểm chỉ vỏn vẹn 40 nhân viên ✓</text>
          </g>

          <!-- Connecting Pipe -->
          <rect id="s5_pipe" x="80" y="420" width="1620" height="22" rx="11" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>

          <!-- Bottom Row: 4 Illustrated Domino Stations -->
          ${stations.map((st, idx) => {
            const x = idx * 456;
            return `
            <g id="s5_st_${idx}" transform="translate(${x}, 210)">
              ${idx === 3 ? `<rect x="12" y="12" width="400" height="465" rx="24" fill="#E85A1F"/>` : ''}
              <rect x="0" y="0" width="400" height="465" rx="24" fill="${st.bg}" stroke="#0F0F0F" stroke-width="5"/>
              <rect x="28" y="24" width="175" height="42" rx="21" fill="${st.badgeBg}" stroke="#0F0F0F" stroke-width="3.5"/>
              <text x="115" y="52" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="18" fill="${st.badgeBg === '#1F8A4C' || st.badgeBg === '#0F0F0F' ? '#EFE9D9' : '#0F0F0F'}">${st.yr}</text>
              ${st.icon}
              <text x="28" y="255" font-family="Be Vietnam Pro" font-weight="900" font-size="27" fill="#0F0F0F">${st.title}</text>
              <line x1="28" y1="278" x2="372" y2="278" stroke="#0F0F0F" stroke-width="3.5"/>
              <foreignObject x="28" y="295" width="344" height="145">
                <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:'Be Vietnam Pro',sans-serif;font-weight:700;font-size:20px;line-height:1.38;color:#0F0F0F;">${st.desc}</div>
              </foreignObject>
            </g>`;
          }).join('')}
        </svg>
        ${bottomBanner}
      </div>`;
    js += `
      tl.fromTo("#s5_pipe", { scaleX: 0, opacity: 0, svgOrigin: "80 431" }, { scaleX: 1, opacity: 1, duration: 1.4, ease: "power2.out" }, ${beat(2.85, null)});
      tl.fromTo("#s5_topL", { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.5)" }, ${beat(8.55, 'click')});
      tl.fromTo("#s5_topM", { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.5)" }, ${beat(11.10, 'click')});
      tl.fromTo("#s5_topR", { scale: 0.92, opacity: 0, svgOrigin: "1441 92" }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.6)" }, ${beat(15.20, 'pop')});
      tl.fromTo("#s5_st_0", { y: 240, opacity: 0 }, { y: 210, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, ${beat(25.55, 'slam')});
      tl.fromTo("#s5_st_1", { y: 240, opacity: 0 }, { y: 210, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, ${beat(27.90, 'pop')});
      tl.fromTo("#s5_st_2", { y: 240, opacity: 0 }, { y: 210, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, ${beat(30.25, 'ping')});
      tl.fromTo("#s5_st_3", { y: 240, opacity: 0 }, { y: 210, opacity: 1, duration: 0.5, ease: "back.out(1.6)" }, ${beat(34.05, 'ding')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(35.20, null)});
    `;
  } else if (num === 6) {
    // SHOT #06 (01:22.0 - 01:35.5, dur 13.5s): Rewinding Chronometer Clock (2026 -> 1938) + Multi-Source Note
    html = `
      <div class="${stageClass}">
        ${corners}
        ${topHeader}
        <svg viewBox="0 0 1792 730" style="position:absolute;left:64px;top:172px;width:1792px;height:730px;z-index:5;overflow:visible;">
          <!-- Left: Giant Mechanical Time-Rewind Clock -->
          <g id="s6_clock">
            <rect x="0" y="15" width="840" height="665" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
            <circle cx="420" cy="345" r="265" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="6"/>
            <circle cx="420" cy="345" r="228" fill="none" stroke="#0F0F0F" stroke-width="3.5" stroke-dasharray="14 10"/>
            <g id="s6_gear">
              <circle cx="420" cy="345" r="95" fill="#F5C518" stroke="#0F0F0F" stroke-width="4.5" stroke-dasharray="22 12"/>
            </g>
            <text x="420" y="145" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="30" fill="#0F0F0F">2026</text>
            <text x="622" y="355" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="30" fill="#0F0F0F">1995</text>
            <text x="420" y="555" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="30" fill="#0F0F0F">1969</text>
            <text x="218" y="355" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="34" fill="#D2460F">1938</text>
            <g id="s6_hand">
              <line x1="420" y1="345" x2="420" y2="212" stroke="#0F0F0F" stroke-width="10" stroke-linecap="round"/>
              <polygon points="420,192 404,224 436,224" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3"/>
            </g>
            <circle cx="420" cy="345" r="20" fill="#0F0F0F"/>
          </g>

          <!-- Right: Multi-Source Dossier & Start Button -->
          <g id="s6_dossier">
            <rect x="912" y="27" width="880" height="665" rx="24" fill="#E85A1F"/>
            <rect x="900" y="15" width="880" height="665" rx="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
            <rect x="945" y="55" width="420" height="48" rx="24" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="3.5"/>
            <text x="1155" y="86" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="20" fill="#EFE9D9">HỒ SƠ LỊCH SỬ 1938 – 2026</text>
            <text x="945" y="175" font-family="Be Vietnam Pro" font-weight="900" font-size="36" fill="#0F0F0F">TỔNG HỢP TỪ NHIỀU NGUỒN TƯ LIỆU</text>
            <text x="945" y="240" font-family="Be Vietnam Pro" font-weight="700" font-size="22" fill="#222222">• Đối chiếu lịch sử chính thức &amp; báo chí quốc tế</text>
            <text x="945" y="290" font-family="Be Vietnam Pro" font-weight="700" font-size="22" fill="#222222">• Nếu có chi tiết nào cần bổ sung hoặc đính chính,</text>
            <text x="945" y="330" font-family="Be Vietnam Pro" font-weight="800" font-size="22" fill="#136636">  mời anh em để lại góp ý ở phần bình luận bên dưới!</text>

            <g id="s6_btn">
              <rect x="945" y="435" width="790" height="150" rx="22" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
              <circle cx="1045" cy="510" r="46" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>
              <polygon points="1032,486 1032,534 1072,510" fill="#EFE9D9"/>
              <text x="1400" y="522" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="34" fill="#0F0F0F">BẮT ĐẦU HÀNH TRÌNH 1938</text>
            </g>
          </g>
        </svg>
        ${bottomBanner}
      </div>`;
    js += `
      tl.fromTo("#s6_clock", { scale: 0.9, opacity: 0, svgOrigin: "420 345" }, { scale: 1, opacity: 1, duration: 0.45 }, ${beat(0.95, 'pop')});
      tl.fromTo("#s6_hand", { rotation: 0, svgOrigin: "420 345" }, { rotation: -450, duration: 1.65, ease: "power2.inOut" }, ${beat(1.95, 'whoosh')});
      tl.fromTo("#s6_gear", { rotation: 0, svgOrigin: "420 345" }, { rotation: -360, duration: 2.2, ease: "power1.inOut" }, 1.95);
      tl.fromTo("#s6_dossier", { x: 45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "back.out(1.3)" }, ${beat(4.20, 'ding')});
      tl.fromTo("#s6_btn", { scale: 0.88, opacity: 0, svgOrigin: "1340 510" }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }, ${beat(11.35, 'ping')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, ${beat(12.20, null)});
    `;
  } else if (num === 8) {
    // SHOT #08 (02:15.3 - 02:58.0, dur 42.7s): Map of Korea (Daegu -> Seoul + 4 Chaebol Sectors) vs Japan Electronics Boom
    html = `
      <div class="${stageClass}">
        ${corners}
        ${topHeader}
        <svg viewBox="0 0 1792 730" style="position:absolute;left:64px;top:172px;width:1792px;height:730px;z-index:5;overflow:visible;">
          <!-- Left: Korea Peninsula (Daegu 1938 -> Seoul 1947 + 4 Chaebol Industries) -->
          <g id="s8_korea">
            <rect x="0" y="15" width="900" height="665" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
            <path d="M120 130 L320 110 L380 260 L350 490 L210 530 L145 380 Z" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="5"/>
            <!-- Seoul 1947 & Daegu 1938 Pins with Dark High-Contrast Pills -->
            <g id="s8_seoul_pin">
              <circle cx="235" cy="225" r="16" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
              <rect x="150" y="165" width="170" height="36" rx="18" fill="#0F0F0F"/>
              <text x="235" y="190" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="18" fill="#F5C518">SEOUL (1947)</text>
              <path d="M295 405 Q265 315 235 225" fill="none" stroke="#F5C518" stroke-width="6" stroke-dasharray="10 6"/>
            </g>
            <circle cx="295" cy="405" r="15" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>
            <rect x="205" y="428" width="180" height="36" rx="18" fill="#0F0F0F"/>
            <text x="295" y="453" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="18" fill="#EFE9D9">DAEGU (1938)</text>

            <!-- 4 Post-War Chaebol Sectors -->
            <g id="s8_sectors">
              <g id="s8_sec1">
                <rect x="420" y="65" width="445" height="120" rx="16" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
                <text x="448" y="116" font-family="Be Vietnam Pro" font-weight="900" font-size="22" fill="#0F0F0F">1. NHÀ MÁY ĐƯỜNG &amp; DỆT MAY</text>
                <text x="448" y="155" font-family="Be Vietnam Pro" font-weight="700" font-size="18" fill="#222222">Tái thiết đất nước sau chiến tranh 1953</text>
              </g>

              <g id="s8_sec2">
                <rect x="420" y="210" width="445" height="120" rx="16" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
                <text x="448" y="261" font-family="Be Vietnam Pro" font-weight="900" font-size="22" fill="#0F0F0F">2. BẢO HIỂM &amp; TÀI CHÍNH</text>
                <text x="448" y="300" font-family="Be Vietnam Pro" font-weight="700" font-size="18" fill="#222222">Bệ phóng vốn khổng lồ cho tập đoàn</text>
              </g>

              <g id="s8_sec3">
                <rect x="420" y="355" width="445" height="120" rx="16" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
                <text x="448" y="406" font-family="Be Vietnam Pro" font-weight="900" font-size="22" fill="#0F0F0F">3. BÁN LẺ &amp; THƯƠNG MẠI</text>
                <text x="448" y="445" font-family="Be Vietnam Pro" font-weight="700" font-size="18" fill="#222222">Trở thành Chaebol hàng đầu thập niên 1960</text>
              </g>

              <g id="s8_sec4">
                <rect x="420" y="500" width="445" height="130" rx="16" fill="#F5C518" stroke="#0F0F0F" stroke-width="4.5"/>
                <text x="448" y="553" font-family="Be Vietnam Pro" font-weight="900" font-size="23" fill="#0F0F0F">CHAEBOL SỐ 1 HÀN QUỐC</text>
                <text x="448" y="595" font-family="Be Vietnam Pro" font-weight="800" font-size="19" fill="#0F0F0F">Nhưng chưa có công nghệ điện tử cao</text>
              </g>
            </g>
          </g>

          <!-- Right: Japan Across the Strait (Sony, Sanyo, Panasonic Electronics Radar) -->
          <g id="s8_japan">
            <rect x="952" y="27" width="840" height="665" rx="24" fill="#E85A1F"/>
            <rect x="940" y="15" width="840" height="665" rx="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
            <rect x="975" y="45" width="440" height="46" rx="23" fill="#0F0F0F"/>
            <text x="1195" y="75" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="19" fill="#F5C518">BÊN KIA EO BIỂN • NHẬT BẢN 1960s</text>

            <circle cx="1360" cy="305" r="165" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
            <circle cx="1360" cy="305" r="120" fill="none" stroke="#0F0F0F" stroke-width="3.5" stroke-dasharray="12 8"/>
            <line id="s8_radar" x1="1360" y1="305" x2="1360" y2="140" stroke="#E85A1F" stroke-width="8" stroke-linecap="round"/>
            <text x="1360" y="285" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="34" fill="#0F0F0F">SONY • SANYO</text>
            <text x="1360" y="335" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="34" fill="#136636">PANASONIC</text>

            <rect x="980" y="510" width="760" height="130" rx="18" fill="#0F0F0F"/>
            <text x="1360" y="562" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="27" fill="#F5C518">LÀM GIÀU THẦN TỐC NHỜ ĐỒ ĐIỆN TỬ</text>
            <text x="1360" y="605" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="700" font-size="20" fill="#EFE9D9">Thôi thúc Lee Byung-chul đưa Samsung bước vào ngành điện tử năm 1969</text>
          </g>
        </svg>
        ${bottomBanner}
      </div>`;
    js += `
      tl.fromTo("#s8_korea", { x: -45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45 }, ${beat(0.50, 'pop')});
      tl.fromTo("#s8_seoul_pin", { scale: 0.85, opacity: 0, svgOrigin: "235 225" }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.7)" }, ${beat(5.20, 'ping')});
      tl.fromTo("#s8_sec1", { x: 25, opacity: 0 }, { x: 0, opacity: 1, duration: 0.40, ease: "back.out(1.5)" }, ${beat(14.15, 'click')});
      tl.fromTo("#s8_sec2", { x: 25, opacity: 0 }, { x: 0, opacity: 1, duration: 0.40, ease: "back.out(1.5)" }, ${beat(15.40, 'click')});
      tl.fromTo("#s8_sec3", { x: 25, opacity: 0 }, { x: 0, opacity: 1, duration: 0.40, ease: "back.out(1.5)" }, ${beat(15.95, 'click')});
      tl.fromTo("#s8_sec4", { scale: 0.92, opacity: 0, svgOrigin: "642 565" }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.7)" }, ${beat(18.90, 'ding')});
      tl.fromTo("#s8_japan", { x: 45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.5)" }, ${beat(35.60, 'whoosh')});
      tl.to("#s8_radar", { rotation: 360, duration: 3.4, repeat: 1, ease: "none", svgOrigin: "1360 305" }, 35.80);
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(40.60, null)});
    `;
  } else if (num === 10) {
    // SHOT #10 (03:31.8 - 03:56.1, dur 24.3s): X-Ray TV/Microwave + Foreign Chip Shutoff Valve ("Đắp chiếu dây chuyền")
    html = `
      <div class="${stageClass}">
        ${corners}
        ${topHeader}
        <svg viewBox="0 0 1792 730" style="position:absolute;left:64px;top:172px;width:1792px;height:730px;z-index:5;overflow:visible;">
          <!-- Left: X-Ray Cutaway of Samsung TV & Microwave -->
          <g id="s10_left">
            <rect x="0" y="15" width="860" height="665" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
            <rect x="32" y="42" width="390" height="44" rx="22" fill="#0F0F0F"/>
            <text x="227" y="71" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="19" fill="#F5C518">ĐẦU THẬP NIÊN 1980 • X-RAY</text>
            <!-- TV & Microwave Cutaway -->
            <rect x="55" y="120" width="750" height="380" rx="22" fill="#0F0F0F"/>
            <rect x="85" y="150" width="320" height="320" rx="16" fill="#1F8A4C" stroke="#EFE9D9" stroke-width="4"/>
            <text x="245" y="235" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="28" fill="#EFE9D9">VỎ TV &amp; LÒ VI SÓNG</text>
            <text x="245" y="280" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="20" fill="#F5C518">Samsung lắp ráp gia công</text>
            <text x="245" y="315" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="700" font-size="18" fill="#EFE9D9">(Biên lợi nhuận cực mỏng)</text>

            <g id="s10_core">
              <rect x="445" y="150" width="330" height="320" rx="16" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
              <text x="610" y="235" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="28" fill="#0F0F0F">CHIP &amp; LINH KIỆN LÕI</text>
              <text x="610" y="280" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="21" fill="#E85A1F">MUA TỪ NHẬT &amp; MỸ</text>
              <text x="610" y="320" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="18" fill="#0F0F0F">Hưởng trọn phần lãi ngon nhất</text>
            </g>

            <g id="s10_profit">
              <rect x="55" y="530" width="750" height="115" rx="16" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
              <text x="430" y="580" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="25" fill="#0F0F0F">LỢI NHUẬN RƠI VÀO TÚI ĐỐI TÁC NGOẠI</text>
              <text x="430" y="618" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="700" font-size="19" fill="#222222">Chỉ lắp ráp theo bản vẽ người Nhật thì không bao giờ bứt phá</text>
            </g>
          </g>

          <!-- Right: Supply Valve Shutoff -> Factory Shutdown -->
          <g id="s10_right">
            <rect x="944" y="27" width="848" height="665" rx="24" fill="#E85A1F"/>
            <rect x="932" y="15" width="848" height="665" rx="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
            <!-- Pipe + Rotating Red Valve -->
            <rect x="980" y="220" width="750" height="44" fill="#0F0F0F"/>
            <g id="s10_valve">
              <circle cx="1355" cy="242" r="110" fill="#E85A1F" stroke="#0F0F0F" stroke-width="6"/>
              <line x1="1245" y1="242" x2="1465" y2="242" stroke="#0F0F0F" stroke-width="12"/>
              <line x1="1355" y1="132" x2="1355" y2="352" stroke="#0F0F0F" stroke-width="12"/>
              <circle cx="1355" cy="242" r="40" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
            </g>
            <g id="s10_stamp">
              <rect x="1010" y="410" width="690" height="215" rx="22" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
              <text x="1355" y="485" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="38" fill="#E85A1F">ĐỐI TÁC NGỪNG BÁN CHIP</text>
              <text x="1355" y="545" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="34" fill="#0F0F0F">= ĐẮP CHIẾU TOÀN BỘ DÂY CHUYỀN!</text>
              <text x="1355" y="592" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="20" fill="#0F0F0F">Tử huyệt buộc Samsung phải tự làm bán dẫn năm 1983</text>
            </g>
          </g>
        </svg>
        ${bottomBanner}
      </div>`;
    js += `
      tl.fromTo("#s10_left", { x: -45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45 }, ${beat(1.60, 'pop')});
      tl.fromTo("#s10_core", { scale: 0.88, opacity: 0, svgOrigin: "610 310" }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.7)" }, ${beat(12.10, 'ping')});
      tl.fromTo("#s10_profit", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(17.30, 'click')});
      tl.fromTo("#s10_right", { x: 45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.5)" }, ${beat(19.90, 'whoosh')});
      tl.fromTo("#s10_valve", { rotation: 0, svgOrigin: "1355 242" }, { rotation: 270, duration: 1.4, ease: "back.inOut(1.5)" }, ${beat(20.15, 'slam')});
      tl.fromTo("#s10_stamp", { scale: 0.88, opacity: 0, svgOrigin: "1355 517" }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.8)" }, ${beat(22.25, 'pop')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(23.10, null)});
    `;
  } else if (num === 15) {
    // SHOT #15 (05:33.1 - 05:49.6, dur 16.5s): 10 Drawn Anycall Phones + 11.8% Defect Gauge + New Year Gift Box
    const phonesSvg = Array.from({ length: 10 }, (_, idx) => {
      const col = idx % 5;
      const row = Math.floor(idx / 5);
      const px = 48 + col * 145;
      const py = 135 + row * 225;
      const isBad = idx === 9;
      return `
        <g id="s15_ph_${idx}">
          <line x1="${px + 85}" y1="${py - 28}" x2="${px + 85}" y2="${py}" stroke="#0F0F0F" stroke-width="6" stroke-linecap="round"/>
          <rect x="${px}" y="${py}" width="108" height="175" rx="16" fill="${isBad ? '#E85A1F' : '#0F0F0F'}" stroke="#0F0F0F" stroke-width="4"/>
          <rect x="${px + 14}" y="${py + 18}" width="80" height="54" rx="8" fill="${isBad ? '#F5C518' : '#1F8A4C'}" stroke="#0F0F0F" stroke-width="3"/>
          <text x="${px + 54}" y="${py + 52}" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="18" fill="${isBad ? '#0F0F0F' : '#EFE9D9'}">${isBad ? 'LỖI!' : 'OK'}</text>
        </g>`;
    }).join('');
    html = `
      <div class="${stageClass}">
        ${corners}
        ${topHeader}
        <svg viewBox="0 0 1792 730" style="position:absolute;left:64px;top:172px;width:1792px;height:730px;z-index:5;overflow:visible;">
          <g id="s15_rack">
            <rect x="0" y="15" width="820" height="665" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
            <rect x="28" y="40" width="380" height="44" rx="22" fill="#0F0F0F"/>
            <text x="218" y="69" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="19" fill="#F5C518">1994 • KIỂM ĐỊNH ANYCALL</text>
            ${phonesSvg}
            <g id="s15_rack_foot">
              <rect x="38" y="565" width="744" height="82" rx="16" fill="#0F0F0F"/>
              <text x="410" y="615" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="24" fill="#F5C518">CỨ 10 MÁY BÁN RA THÌ HƠN 1 MÁY BỊ HỎNG</text>
            </g>
          </g>
          <g id="s15_gauge">
            <rect x="872" y="27" width="920" height="345" rx="24" fill="#E85A1F"/>
            <rect x="860" y="15" width="920" height="345" rx="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
            <path d="M960 285 A 160 160 0 0 1 1280 285" fill="none" stroke="#E4DCC4" stroke-width="34" stroke-linecap="round"/>
            <path d="M1160 135 A 160 160 0 0 1 1280 285" fill="none" stroke="#E85A1F" stroke-width="34" stroke-linecap="round"/>
            <g id="s15_needle">
              <line x1="1120" y1="285" x2="995" y2="255" stroke="#0F0F0F" stroke-width="10" stroke-linecap="round"/>
            </g>
            <circle cx="1120" cy="285" r="22" fill="#0F0F0F"/>
            <text x="1530" y="165" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="88" fill="#E85A1F">11,8%</text>
            <text x="1530" y="225" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="28" fill="#0F0F0F">TỶ LỆ LỖI THẢM HỌA</text>
          </g>
          <g id="s15_gift">
            <rect x="860" y="395" width="920" height="285" rx="24" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
            <rect x="910" y="465" width="160" height="160" rx="16" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4.5"/>
            <rect x="898" y="435" width="184" height="42" rx="10" fill="#0F0F0F"/>
            <text x="1125" y="495" font-family="Be Vietnam Pro" font-weight="900" font-size="32" fill="#0F0F0F">QUÀ TẶNG NĂM MỚI CŨNG HỎNG!</text>
            <text x="1125" y="548" font-family="Be Vietnam Pro" font-weight="800" font-size="22" fill="#0F0F0F">Ngay cả máy Chủ tịch Lee Kun-hee đem tặng</text>
            <text x="1125" y="584" font-family="Be Vietnam Pro" font-weight="800" font-size="22" fill="#0F0F0F">dịp Năm Mới cũng không bật lên nguồn được.</text>
          </g>
        </svg>
        ${bottomBanner}
      </div>`;
    js += `
      tl.fromTo("#s15_rack", { x: -45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45 }, ${beat(1.60, 'pop')});
      tl.fromTo("#s15_gauge", { x: 45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "back.out(1.5)" }, ${beat(5.90, 'slam')});
      tl.fromTo("#s15_needle", { rotation: 0, svgOrigin: "1120 285" }, { rotation: 142, duration: 1.0, ease: "elastic.out(1, 0.5)" }, ${beat(6.10, 'click')});
      tl.fromTo("#s15_rack_foot", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.40 }, ${beat(8.85, 'ping')});
      tl.fromTo("#s15_gift", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.50, ease: "back.out(1.6)" }, ${beat(12.40, 'ding')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(15.10, null)});
    `;
  } else if (num === 24) {
    // SHOT #24 (08:55.6 - 09:07.6, dur 12.0s): 3 Crisis Spears (Pháp lý, Thị trường, Kỹ thuật)
    html = `
      <div class="${stageClass}">
        ${corners}
        ${topHeader}
        <svg viewBox="0 0 1792 730" style="position:absolute;left:64px;top:172px;width:1792px;height:730px;z-index:5;overflow:visible;">
          <g id="s24_sp1">
            <rect x="0" y="35" width="980" height="180" rx="20" fill="#E85A1F" stroke="#0F0F0F" stroke-width="5"/>
            <polygon points="980,35 1090,125 980,215" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
            <text x="60" y="110" font-family="Be Vietnam Pro" font-weight="900" font-size="34" fill="#0F0F0F">01. MẶT TRẬN PHÁP LÝ</text>
            <text x="60" y="158" font-family="Be Vietnam Pro" font-weight="800" font-size="22" fill="#EFE9D9">Đại chiến bản quyền tỷ đô với Apple tại tòa án Mỹ</text>
          </g>
          <g id="s24_sp2">
            <rect x="0" y="255" width="980" height="180" rx="20" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
            <polygon points="980,255 1090,345 980,435" fill="#E85A1F" stroke="#0F0F0F" stroke-width="5"/>
            <text x="60" y="330" font-family="Be Vietnam Pro" font-weight="900" font-size="34" fill="#0F0F0F">02. MẶT TRẬN THỊ TRƯỜNG</text>
            <text x="60" y="378" font-family="Be Vietnam Pro" font-weight="800" font-size="22" fill="#0F0F0F">Xiaomi, Huawei, OPPO đánh bật thị phần tại châu Á</text>
          </g>
          <g id="s24_sp3">
            <rect x="0" y="475" width="980" height="180" rx="20" fill="#0F0F0F" stroke="#0F0F0F" stroke-width="5"/>
            <polygon points="980,475 1090,565 980,655" fill="#F06CA8" stroke="#0F0F0F" stroke-width="5"/>
            <text x="60" y="550" font-family="Be Vietnam Pro" font-weight="900" font-size="34" fill="#F5C518">03. MẶT TRẬN KỸ THUẬT</text>
            <text x="60" y="598" font-family="Be Vietnam Pro" font-weight="700" font-size="22" fill="#EFE9D9">Rủi ro ép giới hạn vật lý dẫn tới thảm họa pin Note 7</text>
          </g>
          <g id="s24_tower">
            <rect x="1162" y="47" width="630" height="620" rx="24" fill="#E85A1F"/>
            <rect x="1150" y="35" width="630" height="620" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
            <polygon points="1365,240 1395,140 1465,190 1535,140 1565,240" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
            <rect x="1335" y="240" width="260" height="180" rx="16" fill="#0F0F0F"/>
            <text x="1465" y="345" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="38" fill="#F5C518">ĐỈNH SỐ 1</text>
            <text x="1465" y="495" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="32" fill="#E85A1F">CÁI GIÁ CỦA TỐC ĐỘ</text>
            <text x="1465" y="548" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="22" fill="#0F0F0F">Khi đứng trên đỉnh thế giới,</text>
            <text x="1465" y="584" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="22" fill="#0F0F0F">bão tố ập đến từ cả 3 hướng</text>
          </g>
        </svg>
        ${bottomBanner}
      </div>`;
    js += `
      tl.fromTo("#s24_tower", { scale: 0.9, opacity: 0, svgOrigin: "1465 345" }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, ${beat(3.85, 'whoosh')});
      tl.fromTo("#s24_sp1", { x: -45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42, ease: "back.out(1.7)" }, ${beat(8.55, 'pop')});
      tl.fromTo("#s24_sp2", { x: -45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42, ease: "back.out(1.7)" }, ${beat(9.15, 'slam')});
      tl.fromTo("#s24_sp3", { x: -45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42, ease: "back.out(1.7)" }, ${beat(9.60, 'click')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.38 }, ${beat(9.60, null)});
    `;
  } else if (num === 28) {
    // SHOT #28 (10:03.8 - 10:15.8, dur 12.0s): Fast-Forward Calendar 08/2016 + Pre-empting iPhone 7 + Red Danger Gauge
    html = `
      <div class="${stageClass}">
        ${corners}
        ${topHeader}
        <svg viewBox="0 0 1792 730" style="position:absolute;left:64px;top:172px;width:1792px;height:730px;z-index:5;overflow:visible;">
          <g id="s28_cal">
            <rect x="0" y="20" width="840" height="655" rx="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
            <rect x="45" y="55" width="750" height="95" rx="18" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4.5"/>
            <text x="420" y="116" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="36" fill="#0F0F0F">THÁNG 08 / 2016 • ÉP TIẾN ĐỘ</text>
            <rect x="45" y="180" width="750" height="270" rx="22" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
            <text x="420" y="265" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="56" fill="#0F0F0F">RA MẮT SỚM ⏩</text>
            <text x="420" y="340" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="26" fill="#0F0F0F">Tham vọng chặn đầu &amp; đè bẹp iPhone 7</text>
            <text x="420" y="535" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="23" fill="#222222">Sự hưng phấn sau thành công của Galaxy S6 / S7</text>
            <text x="420" y="575" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="23" fill="#E85A1F">khiến quy trình kiểm định bị rút ngắn nguy hiểm</text>
          </g>
          <g id="s28_gauge">
            <rect x="912" y="32" width="880" height="655" rx="24" fill="#E85A1F"/>
            <rect x="900" y="20" width="880" height="655" rx="24" fill="#0F0F0F" stroke="#0F0F0F" stroke-width="5"/>
            <circle cx="1340" cy="285" r="165" fill="#EFE9D9" stroke="#E85A1F" stroke-width="8"/>
            <path d="M1210 345 A 145 145 0 1 1 1470 345" fill="none" stroke="#E85A1F" stroke-width="26" stroke-linecap="round"/>
            <g id="s28_needle">
              <line x1="1340" y1="285" x2="1220" y2="285" stroke="#0F0F0F" stroke-width="12" stroke-linecap="round"/>
            </g>
            <circle cx="1340" cy="285" r="24" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>
            <text x="1340" y="520" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="38" fill="#F5C518">THẢM HỌA TỒI TỆ NHẤT</text>
            <text x="1340" y="575" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="700" font-size="22" fill="#EFE9D9">Lịch sử ngành điện thoại di động bắt đầu nổ ra</text>
          </g>
        </svg>
        ${bottomBanner}
      </div>`;
    js += `
      tl.fromTo("#s28_cal", { x: -45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45 }, ${beat(1.40, 'pop')});
      tl.fromTo("#s28_gauge", { x: 45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "back.out(1.5)" }, ${beat(8.40, 'slam')});
      tl.fromTo("#s28_needle", { rotation: 0, svgOrigin: "1340 285" }, { rotation: 160, duration: 1.0, ease: "elastic.out(1, 0.4)" }, ${beat(8.60, 'click')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, ${beat(10.80, null)});
    `;
  } else if (num === 29) {
    // SHOT #29 (10:15.8 - 10:29.8, dur 14.0s): Technical Cross-Section of Note 7 Battery Short-Circuit
    html = `
      <div class="${stageClass}">
        ${corners}
        ${topHeader}
        <svg viewBox="0 0 1792 730" style="position:absolute;left:64px;top:172px;width:1792px;height:730px;z-index:5;overflow:visible;">
          <rect x="12" y="27" width="1780" height="655" rx="24" fill="#E85A1F"/>
          <rect x="0" y="15" width="1780" height="655" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
          <g id="s29_wallL">
            <rect x="45" y="85" width="380" height="515" rx="24" fill="#0F0F0F"/>
            <rect x="75" y="125" width="140" height="435" rx="18" fill="#F5C518" stroke="#EFE9D9" stroke-width="3"/>
            <text x="145" y="350" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="24" fill="#0F0F0F" transform="rotate(-90 145 350)">KHE BÚT S PEN</text>
            <text x="320" y="295" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="28" fill="#EFE9D9">VỎ CONG TRÁI</text>
            <polygon points="425,280 485,342 425,405" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>
            <text x="320" y="365" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="22" fill="#F5C518">ÉP VÀO →</text>
          </g>
          <g id="s29_pouch">
            <rect x="500" y="85" width="780" height="515" rx="28" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="6"/>
            <rect x="535" y="115" width="710" height="52" rx="14" fill="#0F0F0F"/>
            <text x="890" y="150" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="21" fill="#F5C518">MẶT CẮT VIÊN PIN 3.500 mAh — BỊ ÉP QUÁ GIỚI HẠN</text>
            <rect id="s29_anode" x="555" y="195" width="230" height="365" rx="16" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="4.5"/>
            <text x="670" y="365" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="36" fill="#EFE9D9">CỰC ÂM (-)</text>
            <rect id="s29_cathode" x="995" y="195" width="230" height="365" rx="16" fill="#F06CA8" stroke="#0F0F0F" stroke-width="4.5"/>
            <text x="1110" y="365" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="36" fill="#0F0F0F">CỰC DƯƠNG (+)</text>
            <line x1="890" y1="190" x2="890" y2="565" stroke="#0F0F0F" stroke-width="7" stroke-dasharray="18 12"/>
            <g id="s29_spark">
              <circle cx="890" cy="375" r="105" fill="#E85A1F" stroke="#0F0F0F" stroke-width="5"/>
              <polygon points="890,245 920,335 1010,335 938,390 965,480 890,425 815,480 842,390 770,335 860,335" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
              <text x="890" y="385" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="28" fill="#0F0F0F">ĐOẢN MẠCH!</text>
            </g>
          </g>
          <g id="s29_wallR">
            <rect x="1355" y="85" width="380" height="515" rx="24" fill="#0F0F0F"/>
            <polygon points="1355,280 1295,342 1355,405" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>
            <text x="1545" y="295" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="28" fill="#EFE9D9">KÍNH CONG ĐỐI XỨNG</text>
            <text x="1545" y="365" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="22" fill="#F5C518">← ÉP VÀO</text>
          </g>
        </svg>
        ${bottomBanner}
      </div>`;
    js += `
      tl.fromTo("#s29_pouch", { scale: 0.9, opacity: 0, svgOrigin: "890 342" }, { scale: 1, opacity: 1, duration: 0.45 }, ${beat(0.60, 'pop')});
      tl.fromTo("#s29_wallR", { x: 80, opacity: 0 }, { x: -32, opacity: 1, duration: 1.0, ease: "power3.inOut" }, ${beat(3.05, 'whoosh')});
      tl.fromTo("#s29_wallL", { x: -80, opacity: 0 }, { x: 32, opacity: 1, duration: 1.0, ease: "power3.inOut" }, ${beat(6.00, 'whoosh')});
      tl.to("#s29_anode", { x: 48, duration: 0.65, ease: "power2.inOut" }, ${beat(10.80, 'click')});
      tl.to("#s29_cathode", { x: -48, duration: 0.65, ease: "power2.inOut" }, 10.80);
      tl.fromTo("#s29_spark", { scale: 0, opacity: 0, svgOrigin: "890 375" }, { scale: 1.12, opacity: 1, duration: 0.45, ease: "back.out(2)" }, ${beat(11.10, 'slam')});
      tl.fromTo("#foot_${num}", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, ${beat(12.50, null)});
    `;
  } else if (num === 31) {
    // SHOT #31 (10:52.4 - 11:01.4, dur 9.0s): Global Aviation Ban Gate & Megaphone
    html = `
      <div class="${stageClass}">
        ${corners}
        ${topHeader}
        <svg viewBox="0 0 1792 730" style="position:absolute;left:64px;top:172px;width:1792px;height:730px;z-index:5;overflow:visible;">
          <g id="s31_gate">
            <rect x="0" y="15" width="760" height="665" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
            <path d="M120 620 L120 140 Q120 85 175 85 L425 85 Q480 85 480 140 L480 620" fill="none" stroke="#0F0F0F" stroke-width="28"/>
            <circle cx="300" cy="360" r="105" fill="#F5C518" stroke="#E85A1F" stroke-width="14"/>
            <rect x="268" y="295" width="64" height="130" rx="10" fill="#0F0F0F"/>
            <line x1="225" y1="285" x2="375" y2="435" stroke="#E85A1F" stroke-width="16" stroke-linecap="round"/>
            <polygon points="520,220 625,165 625,295 520,245" fill="#F5C518" stroke="#0F0F0F" stroke-width="4.5"/>
            <path id="s31_waves" d="M645 185 Q685 230 645 275 M675 160 Q730 230 675 300" fill="none" stroke="#E85A1F" stroke-width="6" stroke-linecap="round"/>
            <text x="380" y="565" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="28" fill="#0F0F0F">PHÁT LOA CẤM TRÊN TOÀN CẦU</text>
          </g>
          <g id="s31_plane">
            <rect x="812" y="27" width="980" height="665" rx="24" fill="#E85A1F"/>
            <rect x="800" y="15" width="980" height="665" rx="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
            <path d="M920 145 L1460 145 Q1620 145 1670 195 L920 195 Z" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="4.5"/>
            <polygon points="920,145 875,75 965,145" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4.5"/>
            <rect x="855" y="325" width="64" height="175" rx="12" fill="#0F0F0F"/>
            <g id="s31_barrier" data-layout-allow-overlap>
              <rect x="885" y="345" width="820" height="44" rx="14" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4.5"/>
              <text x="1295" y="375" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="23" fill="#0F0F0F">CẤM MANG GALAXY NOTE 7 LÊN MỌI CHUYẾN BAY</text>
            </g>
            <rect x="855" y="520" width="870" height="115" rx="18" fill="#0F0F0F"/>
            <text x="1290" y="585" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="27" fill="#F5C518">NỖI SỈ NHỤC CHƯA TỪNG CÓ TIỀN LỆ VỚI SAMSUNG</text>
          </g>
        </svg>
        ${bottomBanner}
      </div>`;
    js += `
      tl.fromTo("#s31_gate", { x: -45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45 }, ${beat(0.40, 'pop')});
      tl.fromTo("#s31_plane", { x: 45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, ${beat(3.80, 'whoosh')});
      tl.fromTo("#s31_barrier", { rotation: -16, opacity: 0, svgOrigin: "887 367" }, { rotation: 0, opacity: 1, duration: 0.70, ease: "bounce.out" }, ${beat(4.20, 'slam')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, ${beat(6.10, null)});
    `;
  } else if (num === 35) {
    // SHOT #35 (11:44.3 - 12:09.1, dur 24.8s): 3-Pillar Vertical Integration Shield vs Fallen Nokia/BlackBerry
    html = `
      <div class="${stageClass}">
        ${corners}
        ${topHeader}
        <svg viewBox="0 0 1792 730" style="position:absolute;left:64px;top:172px;width:1792px;height:730px;z-index:5;overflow:visible;">
          <g id="s35_rivals">
            <rect x="0" y="20" width="580" height="655" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
            <text x="290" y="85" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="28" fill="#E85A1F">NẾU LÀ CÔNG TY BÌNH THƯỜNG</text>
            <g id="s35_nokia_bb">
              <g transform="rotate(-10 290 230)">
                <rect x="75" y="170" width="430" height="120" rx="18" fill="#0F0F0F"/>
                <text x="290" y="242" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="34" fill="#EFE9D9">NOKIA ✕</text>
              </g>
              <g transform="rotate(9 290 410)">
                <rect x="75" y="350" width="430" height="120" rx="18" fill="#0F0F0F"/>
                <text x="290" y="422" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="34" fill="#F06CA8">BLACKBERRY ✕</text>
              </g>
              <text x="290" y="585" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="21" fill="#0F0F0F">Mất 5,3 tỷ USD = Dấu chấm hết!</text>
            </g>
          </g>
          <g id="s35_fortress">
            <rect x="632" y="32" width="1160" height="655" rx="24" fill="#E85A1F"/>
            <rect x="620" y="20" width="1160" height="655" rx="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
            <polygon points="650,155 710,55 1690,55 1750,155" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="5"/>
            <text x="1200" y="118" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="25" fill="#EFE9D9">CẤU TRÚC TÍCH HỢP DỌC ĐỠ ĐẠN CHO MẢNG DI ĐỘNG</text>
            <g id="s35_pil1">
              <rect x="680" y="185" width="320" height="420" rx="20" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="5"/>
              <text x="840" y="295" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="30" fill="#F5C518">BÁN DẪN DRAM</text>
              <text x="840" y="365" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="20" fill="#EFE9D9">Lãi kỷ lục hàng chục</text>
              <text x="840" y="398" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="20" fill="#EFE9D9">tỷ USD mỗi năm</text>
            </g>
            <g id="s35_pil2">
              <rect x="1040" y="185" width="320" height="420" rx="20" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
              <text x="1200" y="295" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="30" fill="#0F0F0F">MÀN HÌNH OLED</text>
              <text x="1200" y="365" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="20" fill="#0F0F0F">Độc quyền tấm nền</text>
              <text x="1200" y="398" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="20" fill="#0F0F0F">cung ứng toàn ngành</text>
            </g>
            <g id="s35_pil3">
              <rect x="1400" y="185" width="320" height="420" rx="20" fill="#F06CA8" stroke="#0F0F0F" stroke-width="5"/>
              <text x="1560" y="295" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="30" fill="#0F0F0F">TÁI SINH GALAXY</text>
              <text x="1560" y="365" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="20" fill="#0F0F0F">Được 2 trụ cột đỡ đạn</text>
              <text x="1560" y="398" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="20" fill="#0F0F0F">để lột xác từ tro tàn</text>
            </g>
          </g>
        </svg>
        ${bottomBanner}
      </div>`;
    js += `
      tl.fromTo("#s35_rivals", { x: -45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45 }, ${beat(0.40, 'pop')});
      tl.fromTo("#s35_nokia_bb", { scale: 0.90, opacity: 0, svgOrigin: "290 340" }, { scale: 1, opacity: 1, duration: 0.42, ease: "back.out(1.7)" }, ${beat(7.65, 'slam')});
      tl.fromTo("#s35_fortress", { x: 45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.5)" }, ${beat(10.25, 'whoosh')});
      tl.fromTo("#s35_pil1", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.7)" }, ${beat(13.50, 'pop')});
      tl.fromTo("#s35_pil2", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.7)" }, ${beat(15.70, 'ding')});
      tl.fromTo("#s35_pil3", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "back.out(1.7)" }, ${beat(17.15, 'ping')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(22.60, null)});
    `;
  } else if (num === 43) {
    // SHOT #43 (14:17.9 - 14:51.0, dur 33.1s): Museum Hall Part 1 — P-3202 TV (1970), 64K DRAM (1983), 64Mb DRAM (1992)
    html = `
      <div class="${stageClass}">
        ${corners}
        ${topHeader}
        <svg viewBox="0 0 1792 730" style="position:absolute;left:64px;top:172px;width:1792px;height:730px;z-index:5;overflow:visible;">
          <!-- Subtle Timeline Rail -->
          <g id="s43_rail">
            <rect x="40" y="344" width="1712" height="16" rx="8" fill="#0F0F0F"/>
            <line x1="60" y1="352" x2="1732" y2="352" stroke="#F5C518" stroke-width="4" stroke-dasharray="18 14"/>
          </g>
          <!-- Pedestal 1: 1970 P-3202 Black & White TV -->
          <g id="s43_p1">
            <rect x="0" y="25" width="560" height="650" rx="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
            <rect x="28" y="50" width="220" height="44" rx="22" fill="#0F0F0F"/>
            <text x="138" y="79" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="19" fill="#F5C518">01 • NĂM 1970</text>
            <rect x="130" y="145" width="300" height="210" rx="18" fill="#0F0F0F"/>
            <rect x="155" y="170" width="205" height="160" rx="12" fill="#E4DCC4"/>
            <line x1="230" y1="145" x2="180" y2="95" stroke="#0F0F0F" stroke-width="6"/>
            <line x1="290" y1="145" x2="340" y2="95" stroke="#0F0F0F" stroke-width="6"/>
            <text x="280" y="425" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="32" fill="#0F0F0F">TV ĐEN TRẮNG P-3202</text>
            <text x="280" y="480" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="21" fill="#222222">Đưa công ty buôn cá khô bước</text>
            <text x="280" y="515" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="21" fill="#1F8A4C">vào thế giới mạch điện tử</text>
          </g>
          <!-- Pedestal 2: 1983 64K DRAM -->
          <g id="s43_p2">
            <rect x="616" y="25" width="560" height="650" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
            <rect x="644" y="50" width="220" height="44" rx="22" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="3.5"/>
            <text x="754" y="79" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="19" fill="#EFE9D9">02 • NĂM 1983</text>
            <rect x="736" y="155" width="320" height="190" rx="20" fill="#0F0F0F"/>
            <rect x="786" y="190" width="220" height="120" rx="12" fill="#1F8A4C" stroke="#F5C518" stroke-width="4"/>
            <text x="896" y="262" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="38" fill="#F5C518">64K DRAM</text>
            <text x="896" y="425" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="32" fill="#0F0F0F">TỰ CHỦ BÁN DẪN GIHEUNG</text>
            <text x="896" y="480" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="21" fill="#222222">Thoát khỏi kiếp đi mua linh kiện</text>
            <text x="896" y="515" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="21" fill="#0F0F0F">từ các tập đoàn Nhật &amp; Mỹ</text>
          </g>
          <!-- Pedestal 3: 1992 64Mb DRAM World #1 -->
          <g id="s43_p3">
            <rect x="1244" y="37" width="548" height="650" rx="24" fill="#E85A1F"/>
            <rect x="1232" y="25" width="548" height="650" rx="24" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
            <rect x="1260" y="50" width="220" height="44" rx="22" fill="#0F0F0F"/>
            <text x="1370" y="79" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="19" fill="#F5C518">03 • NĂM 1992</text>
            <rect x="1346" y="155" width="320" height="190" rx="20" fill="#0F0F0F"/>
            <text x="1506" y="262" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="38" fill="#EFE9D9">64Mb DRAM</text>
            <text x="1506" y="425" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="32" fill="#0F0F0F">ÔNG VUA BỘ NHỚ THẾ GIỚI</text>
            <text x="1506" y="480" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="21" fill="#0F0F0F">Chính thức vượt Nhật &amp; Mỹ lên</text>
            <text x="1506" y="515" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="21" fill="#136636">ngôi số 1 thị phần DRAM toàn cầu</text>
          </g>
        </svg>
        ${bottomBanner}
      </div>`;
    js += `
      tl.fromTo("#s43_rail", { scaleX: 0, opacity: 0, svgOrigin: "40 352" }, { scaleX: 1, opacity: 1, duration: 0.60, ease: "power2.out" }, 0.45);
      tl.to("#s43_rail", { scaleY: 1.35, svgOrigin: "896 352", duration: 0.35, yoyo: true, repeat: 1 }, ${beat(9.50, 'whoosh')});
      tl.fromTo("#s43_p1", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, ${beat(12.10, 'pop')});
      tl.fromTo("#s43_p2", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, ${beat(19.30, 'ding')});
      tl.fromTo("#s43_p3", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.50, ease: "back.out(1.6)" }, ${beat(22.40, 'ping')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(29.20, null)});
    `;
  } else if (num === 44) {
    // SHOT #44 (14:51.0 - 15:27.4, dur 36.4s): Museum Hall Part 2 — 4 Mobile Icons (T100, Galaxy S/S3/S4, Note 1, S6 Edge)
    const items = [
      { yr: '04 • 2002', title: 'SGH-T100', desc: 'Màn hình màu TFT LCD đầu tiên, bán >10 triệu máy — bước vào CLB hàng hiệu', bg: '#EFE9D9' },
      { yr: '05 • 2010–2013', title: 'GALAXY S / S3 & S4', desc: '70–80 triệu máy mỗi dòng, chính thức lật đổ Nokia lên ngôi vương', bg: '#E4DCC4' },
      { yr: '06 • 2011', title: 'GALAXY NOTE 5,3"', desc: 'Đi kèm bút S Pen, bất chấp định kiến để khai sinh kỷ nguyên Phablet', bg: '#EFE9D9' },
      { yr: '07 • 2015', title: 'GALAXY S6 EDGE', desc: 'Định nghĩa lại thẩm mỹ công nghiệp bằng màn hình cong tràn hai cạnh', bg: '#F5C518' }
    ];
    html = `
      <div class="${stageClass}">
        ${corners}
        ${topHeader}
        <svg viewBox="0 0 1792 730" style="position:absolute;left:64px;top:172px;width:1792px;height:730px;z-index:5;overflow:visible;">
          ${items.map((it, idx) => {
            const x = idx * 456;
            return `
            <g id="s44_ped_${idx}" transform="translate(${x}, 25)">
              ${idx === 3 ? `<rect x="12" y="12" width="400" height="630" rx="24" fill="#E85A1F"/>` : ''}
              <rect x="0" y="0" width="400" height="630" rx="24" fill="${it.bg}" stroke="#0F0F0F" stroke-width="5"/>
              <rect x="28" y="28" width="190" height="44" rx="22" fill="#0F0F0F"/>
              <text x="123" y="57" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="18" fill="#F5C518">${it.yr}</text>
              <rect x="140" y="105" width="120" height="190" rx="20" fill="#0F0F0F" stroke="#0F0F0F" stroke-width="4"/>
              <rect x="154" y="125" width="92" height="145" rx="10" fill="${idx % 2 === 0 ? '#1F8A4C' : '#F06CA8'}"/>
              <rect x="75" y="310" width="250" height="20" rx="8" fill="#0F0F0F"/>
              <text x="28" y="385" font-family="Be Vietnam Pro" font-weight="900" font-size="27" fill="#0F0F0F">${it.title}</text>
              <foreignObject x="28" y="415" width="344" height="185">
                <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:'Be Vietnam Pro',sans-serif;font-weight:700;font-size:20px;line-height:1.4;color:#0F0F0F;">${it.desc}</div>
              </foreignObject>
            </g>`;
          }).join('')}
        </svg>
        ${bottomBanner}
      </div>`;
    js += `
      tl.fromTo("#s44_ped_0", { y: 55, opacity: 0 }, { y: 25, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, ${beat(0.20, 'pop')});
      tl.fromTo("#s44_ped_1", { y: 55, opacity: 0 }, { y: 25, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, ${beat(8.10, 'whoosh')});
      tl.fromTo("#s44_ped_2", { y: 55, opacity: 0 }, { y: 25, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, ${beat(20.80, 'ding')});
      tl.fromTo("#s44_ped_3", { y: 55, opacity: 0 }, { y: 25, opacity: 1, duration: 0.50, ease: "back.out(1.6)" }, ${beat(29.85, 'ping')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(33.60, null)});
    `;
  } else if (num === 45) {
    // SHOT #45 (15:27.4 - 15:52.3, dur 24.9s): Museum Hall Part 3 — Note 7 (A2 PA1), Galaxy Fold (2019), S22 Ultra (2022)
    html = `
      <div class="${stageClass}">
        ${corners}
        ${topHeader}
        <svg viewBox="0 0 1792 730" style="position:absolute;left:64px;top:172px;width:1792px;height:730px;z-index:5;overflow:visible;">
          <!-- Card 1: Note 7 (2016) with A2 PA1 Neutral Label -->
          <g id="s45_c1">
            <rect x="0" y="25" width="560" height="650" rx="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
            <rect x="28" y="50" width="260" height="44" rx="22" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3.5"/>
            <text x="158" y="79" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="19" fill="#0F0F0F">08 • GALAXY NOTE 7 (2016)</text>
            <rect x="45" y="130" width="470" height="190" rx="18" fill="#F5C518" stroke="#0F0F0F" stroke-width="4.5"/>
            <text x="280" y="205" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="28" fill="#0F0F0F">THIỆT HẠI HÀNG TỶ USD</text>
            <text x="280" y="255" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="26" fill="#E85A1F">THU HỒI 2,5 TRIỆU MÁY</text>
            <text x="45" y="395" font-family="Be Vietnam Pro" font-weight="900" font-size="28" fill="#0F0F0F">TÁI LẬP CHUẨN AN TOÀN</text>
            <text x="45" y="450" font-family="Be Vietnam Pro" font-weight="700" font-size="21" fill="#222222">Buộc Samsung xây dựng quy trình</text>
            <text x="45" y="485" font-family="Be Vietnam Pro" font-weight="800" font-size="21" fill="#1F8A4C">kiểm định Pin 8 Bước cho toàn ngành</text>
          </g>
          <!-- Card 2: Galaxy Fold (2019) -->
          <g id="s45_c2">
            <rect x="616" y="25" width="560" height="650" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
            <rect x="644" y="50" width="260" height="44" rx="22" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="3.5"/>
            <text x="774" y="79" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="19" fill="#EFE9D9">09A • GALAXY FOLD (2019)</text>
            <rect x="766" y="135" width="125" height="195" rx="14" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="4.5"/>
            <rect x="895" y="135" width="125" height="195" rx="14" fill="#0F0F0F" stroke="#0F0F0F" stroke-width="4.5"/>
            <text x="896" y="405" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="30" fill="#0F0F0F">MỞ ĐƯỜNG ĐIỆN THOẠI GẬP</text>
            <text x="896" y="460" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="700" font-size="21" fill="#222222">Khai phá phân khúc màn hình gập</text>
            <text x="896" y="495" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="700" font-size="21" fill="#222222">thương mại đại chúng toàn cầu</text>
          </g>
          <!-- Card 3: Galaxy S22 Ultra (2022) -->
          <g id="s45_c3">
            <rect x="1244" y="37" width="548" height="650" rx="24" fill="#E85A1F"/>
            <rect x="1232" y="25" width="548" height="650" rx="24" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
            <rect x="1260" y="50" width="280" height="44" rx="22" fill="#0F0F0F"/>
            <text x="1400" y="79" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="19" fill="#F5C518">09B • S22 ULTRA (2022)</text>
            <rect x="1410" y="130" width="140" height="205" rx="12" fill="#0F0F0F"/>
            <rect x="1570" y="145" width="18" height="185" rx="8" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3.5"/>
            <text x="1506" y="405" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="30" fill="#0F0F0F">HỢP NHẤT NOTE &amp; S ULTRA</text>
            <text x="1506" y="460" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="21" fill="#0F0F0F">Đưa bút S Pen vào thân máy S Ultra</text>
            <text x="1506" y="495" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="21" fill="#136636">trước khi bước vào sóng thần AI</text>
          </g>
        </svg>
        ${bottomBanner}
      </div>`;
    js += `
      tl.fromTo("#s45_c1", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, ${beat(0.20, 'pop')});
      tl.fromTo("#s45_c2", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, ${beat(10.30, 'whoosh')});
      tl.fromTo("#s45_c3", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.50, ease: "back.out(1.6)" }, ${beat(15.40, 'ping')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(22.90, null)});
    `;
  } else if (num === 46) {
    // SHOT #46 (15:52.3 - 16:27.8, dur 35.5s): Nvidia AI GPU + SK Hynix HBM3E vs Samsung HBM3E Gate & TSMC Foundry
    html = `
      <div class="${stageClass}">
        ${corners}
        ${topHeader}
        <svg viewBox="0 0 1792 730" style="position:absolute;left:64px;top:172px;width:1792px;height:730px;z-index:5;overflow:visible;">
          <g id="s46_loop_pill">
            <line x1="896" y1="70" x2="896" y2="625" stroke="#0F0F0F" stroke-width="5" stroke-dasharray="14 10"/>
            <rect x="756" y="316" width="280" height="58" rx="29" fill="#F5C518" stroke="#0F0F0F" stroke-width="4.5"/>
            <text x="896" y="353" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="22" fill="#0F0F0F">CHU KỲ 2023 – 2025</text>
          </g>
          <g id="s46_hynix">
            <rect x="0" y="20" width="840" height="655" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
            <rect x="32" y="45" width="340" height="44" rx="22" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="3.5"/>
            <text x="202" y="74" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="19" fill="#EFE9D9">SK HYNIX • VƯỢT LÊN Ở HBM</text>
            <g id="s46_hynix_ai">
              <g id="s46_stackL">
                <rect x="75" y="140" width="260" height="48" rx="10" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="4"/>
                <rect x="75" y="200" width="260" height="48" rx="10" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="4"/>
                <rect x="75" y="260" width="260" height="48" rx="10" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="4"/>
                <rect x="75" y="320" width="260" height="48" rx="10" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
                <text x="205" y="352" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="22" fill="#0F0F0F">HBM3 / HBM3E</text>
              </g>
              <rect x="425" y="140" width="365" height="230" rx="20" fill="#0F0F0F"/>
              <text x="607" y="245" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="38" fill="#F5C518">NVIDIA AI</text>
              <text x="607" y="295" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="20" fill="#1F8A4C">ĐẠT CHUẨN SỚM ✓</text>
            </g>
            <text x="55" y="465" font-family="Be Vietnam Pro" font-weight="900" font-size="30" fill="#0F0F0F">NGHỊCH LÝ CHẤN ĐỘNG 2023–2025</text>
            <text x="55" y="518" font-family="Be Vietnam Pro" font-weight="700" font-size="21" fill="#222222">Ông vua 30 năm DRAM bất ngờ bị người</text>
            <text x="55" y="554" font-family="Be Vietnam Pro" font-weight="700" font-size="21" fill="#222222">đồng hương SK Hynix dẫn trước ở chip nhớ HBM</text>
          </g>
          <g id="s46_samsung">
            <rect x="964" y="32" width="828" height="655" rx="24" fill="#E85A1F"/>
            <rect x="952" y="20" width="828" height="655" rx="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
            <rect x="984" y="45" width="380" height="44" rx="22" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3.5"/>
            <text x="1174" y="74" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="19" fill="#0F0F0F">SAMSUNG • THÁCH THỨC KÉP</text>
            <rect x="1015" y="145" width="330" height="220" rx="18" fill="#F5C518" stroke="#0F0F0F" stroke-width="4.5"/>
            <text x="1180" y="240" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="30" fill="#0F0F0F">HBM3E</text>
            <text x="1180" y="285" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="20" fill="#0F0F0F">CHẬM KIỂM ĐỊNH NVIDIA</text>
            <rect x="1375" y="145" width="355" height="220" rx="18" fill="#0F0F0F"/>
            <text x="1552" y="240" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="30" fill="#F06CA8">ĐÚC CHIP FOUNDRY</text>
            <text x="1552" y="285" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="700" font-size="20" fill="#EFE9D9">Hụt hơi trước TSMC</text>
            <text x="1015" y="465" font-family="Be Vietnam Pro" font-weight="900" font-size="30" fill="#0F0F0F">CÚ GIẬT MÌNH TỈNH GIẤC</text>
            <text x="1015" y="518" font-family="Be Vietnam Pro" font-weight="800" font-size="21" fill="#0F0F0F">Buộc lãnh đạo mảng bán dẫn phải phát</text>
            <text x="1015" y="554" font-family="Be Vietnam Pro" font-weight="800" font-size="21" fill="#0F0F0F">tâm thư xin lỗi và đại phẫu toàn diện.</text>
          </g>
        </svg>
        ${bottomBanner}
      </div>`;
    js += `
      tl.fromTo("#s46_loop_pill", { scale: 0.88, opacity: 0, svgOrigin: "896 345" }, { scale: 1, opacity: 1, duration: 0.40 }, ${beat(0.40, null)});
      tl.fromTo("#s46_hynix", { x: -45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45 }, ${beat(8.60, 'pop')});
      tl.fromTo("#s46_hynix_ai", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, ${beat(15.10, 'ding')});
      tl.fromTo("#s46_samsung", { x: 45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.5)" }, ${beat(25.40, 'slam')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(34.80, null)});
    `;
  } else if (num === 48) {
    // SHOT #48 (16:43.4 - 17:00.6, dur 17.2s): Q1/2025 Global DRAM Share Chart (SK Hynix 36% vs Samsung 34.4% — Omdia/Counterpoint)
    html = `
      <div class="${stageClass}">
        ${corners}
        ${topHeader}
        <svg viewBox="0 0 1792 730" style="position:absolute;left:64px;top:172px;width:1792px;height:730px;z-index:5;overflow:visible;">
          <g id="s48_chart">
            <rect x="0" y="15" width="1050" height="665" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
            <text x="525" y="75" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="30" fill="#0F0F0F">THỊ PHẦN DOANH THU DRAM TOÀN CẦU Q1/2025</text>
            <line x1="90" y1="560" x2="960" y2="560" stroke="#0F0F0F" stroke-width="5"/>
            <g id="s48_barL">
              <rect x="170" y="140" width="300" height="420" rx="20" fill="#E85A1F" stroke="#0F0F0F" stroke-width="5"/>
              <text x="320" y="245" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="64" fill="#EFE9D9">36,0%</text>
              <text x="320" y="305" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="32" fill="#F5C518">SK HYNIX (#1)</text>
            </g>
            <g id="s48_barR">
              <rect x="580" y="175" width="300" height="385" rx="20" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="5"/>
              <text x="730" y="280" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="64" fill="#EFE9D9">34,4%</text>
              <text x="730" y="340" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="32" fill="#F5C518">SAMSUNG (#2)</text>
            </g>
            <text x="525" y="618" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="21" fill="#0F0F0F">Lần đầu tiên sau 33 năm (từ 1992), Samsung tạm nhường ngôi đầu DRAM</text>
          </g>
          <g id="s48_news">
            <rect x="1112" y="27" width="680" height="665" rx="24" fill="#E85A1F"/>
            <rect x="1100" y="15" width="680" height="665" rx="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
            <rect x="1140" y="55" width="600" height="70" rx="16" fill="#0F0F0F"/>
            <text x="1440" y="102" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="30" fill="#F5C518">OMDIA &amp; COUNTERPOINT</text>
            <rect x="1140" y="165" width="600" height="220" rx="18" fill="#F5C518" stroke="#0F0F0F" stroke-width="4.5"/>
            <text x="1440" y="240" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="28" fill="#0F0F0F">"SK HYNIX SURPASSES SAMSUNG</text>
            <text x="1440" y="285" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="28" fill="#0F0F0F">IN Q1 2025 GLOBAL DRAM SHARE"</text>
            <text x="1440" y="340" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="19" fill="#0F0F0F">THE KOREA HERALD • 2025</text>
            <text x="1140" y="465" font-family="Be Vietnam Pro" font-weight="800" font-size="22" fill="#0F0F0F">• Nhu cầu bộ nhớ HBM cho AI tăng vọt</text>
            <text x="1140" y="515" font-family="Be Vietnam Pro" font-weight="800" font-size="22" fill="#136636">• Châm ngòi cho cuộc tổng phản công</text>
            <text x="1140" y="550" font-family="Be Vietnam Pro" font-weight="800" font-size="22" fill="#136636">  quyết liệt của Samsung năm 2025–2026</text>
          </g>
        </svg>
        ${bottomBanner}
      </div>`;
    js += `
      tl.fromTo("#s48_chart", { x: -45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45 }, ${beat(0.40, 'pop')});
      tl.fromTo("#s48_barL", { scaleY: 0, opacity: 0, svgOrigin: "320 560" }, { scaleY: 1, opacity: 1, duration: 0.55, ease: "back.out(1.6)" }, ${beat(6.05, 'whoosh')});
      tl.fromTo("#s48_barR", { scaleY: 0, opacity: 0, svgOrigin: "730 560" }, { scaleY: 1, opacity: 1, duration: 0.55, ease: "back.out(1.6)" }, ${beat(12.10, 'ding')});
      tl.fromTo("#s48_news", { x: 45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "back.out(1.5)" }, ${beat(13.85, 'Swipe')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, ${beat(15.10, null)});
    `;
  } else if (num === 49) {
    // SHOT #49 (17:00.6 - 17:32.5, dur 31.9s): 2025-2026 Counter-Attack (Dual CEOs, 38% DRAM Q2/2026, HBM3E 12H, HBM4, 2nm Tesla)
    html = `
      <div class="${stageClass}">
        ${corners}
        ${topHeader}
        <svg viewBox="0 0 1792 730" style="position:absolute;left:64px;top:172px;width:1792px;height:730px;z-index:5;overflow:visible;">
          <g id="s49_left">
            <rect x="0" y="15" width="860" height="665" rx="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
            <rect x="36" y="45" width="440" height="46" rx="23" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="3.5"/>
            <text x="256" y="75" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="19" fill="#EFE9D9">MÔ HÌNH ĐỒNG CEO • TỔNG PHẢN CÔNG</text>
            <g id="s49_ceo_jun">
              <rect x="45" y="120" width="365" height="135" rx="18" fill="#0F0F0F"/>
              <text x="227" y="175" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="24" fill="#F5C518">JUN YOUNG-HYUN</text>
              <text x="227" y="215" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="700" font-size="19" fill="#EFE9D9">Tư lệnh Bán dẫn (DS)</text>
            </g>
            <g id="s49_ceo_roh">
              <rect x="445" y="120" width="365" height="135" rx="18" fill="#0F0F0F"/>
              <text x="627" y="175" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="24" fill="#F06CA8">ROH TAE-MOON</text>
              <text x="627" y="215" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="700" font-size="19" fill="#EFE9D9">Tư lệnh Di động &amp; AI (DX)</text>
            </g>

            <g id="s49_rebound">
              <rect x="45" y="285" width="765" height="350" rx="22" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
              <text x="427" y="355" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="32" fill="#0F0F0F">GIÀNH LẠI NGÔI VƯƠNG DRAM</text>
              <text x="427" y="475" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="92" fill="#136636">38,0%</text>
              <text x="427" y="545" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="22" fill="#0F0F0F">THỊ PHẦN TOÀN CẦU Q2/2026 (COUNTERPOINT)</text>
            </g>
          </g>
          <g id="s49_right">
            <rect x="924" y="27" width="868" height="665" rx="24" fill="#E85A1F"/>
            <rect x="912" y="15" width="868" height="665" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
            <text x="1346" y="80" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="32" fill="#0F0F0F">3 MŨI NHỌN BÁN DẪN 2025 – 2026</text>
            <g id="s49_m1">
              <rect x="960" y="120" width="772" height="155" rx="20" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="4.5"/>
              <text x="1005" y="185" font-family="Be Vietnam Pro" font-weight="900" font-size="32" fill="#F5C518">01. HBM3E 12 LỚP (12H)</text>
              <text x="1005" y="232" font-family="Be Vietnam Pro" font-weight="700" font-size="21" fill="#EFE9D9">Tăng tốc sản lượng bộ nhớ băng thông cao cho cụm GPU AI</text>
            </g>
            <g id="s49_m2">
              <rect x="960" y="305" width="772" height="155" rx="20" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4.5"/>
              <text x="1005" y="370" font-family="Be Vietnam Pro" font-weight="900" font-size="32" fill="#0F0F0F">02. THẾ HỆ BỘ NHỚ HBM4</text>
              <text x="1005" y="417" font-family="Be Vietnam Pro" font-weight="800" font-size="21" fill="#222222">Đón đầu kiến trúc bộ nhớ AI thế hệ tiếp theo</text>
            </g>
            <g id="s49_m3">
              <rect x="960" y="490" width="772" height="155" rx="20" fill="#0F0F0F" stroke="#0F0F0F" stroke-width="4.5"/>
              <text x="1005" y="555" font-family="Be Vietnam Pro" font-weight="900" font-size="32" fill="#F06CA8">03. ĐÚC CHIP 2 NANOMET (GAA)</text>
              <text x="1005" y="602" font-family="Be Vietnam Pro" font-weight="700" font-size="21" fill="#EFE9D9">Ký kết hợp đồng sản xuất chip tiên tiến cùng đối tác lớn như Tesla</text>
            </g>
          </g>
        </svg>
        ${bottomBanner}
      </div>`;
    js += `
      tl.fromTo("#s49_left", { x: -45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45 }, ${beat(4.20, 'pop')});
      tl.fromTo("#s49_ceo_jun", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.38, ease: "back.out(1.6)" }, ${beat(5.70, 'click')});
      tl.fromTo("#s49_ceo_roh", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.38, ease: "back.out(1.6)" }, ${beat(8.40, 'click')});
      tl.fromTo("#s49_rebound", { scale: 0.90, opacity: 0, svgOrigin: "427 460" }, { scale: 1, opacity: 1, duration: 0.48, ease: "back.out(1.7)" }, ${beat(17.60, 'ping')});
      tl.fromTo("#s49_right", { x: 45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45 }, ${beat(23.30, 'whoosh')});
      tl.fromTo("#s49_m1", { x: 35, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42, ease: "back.out(1.7)" }, 23.30);
      tl.fromTo("#s49_m2", { x: 35, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42, ease: "back.out(1.7)" }, ${beat(26.05, 'ding')});
      tl.fromTo("#s49_m3", { x: 35, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42, ease: "back.out(1.7)" }, ${beat(27.15, 'ping')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, ${beat(29.80, null)});
    `;
  } else if (num === 51) {
    // SHOT #51 (17:44.3 - 17:50.4, dur 6.1s): Duopoly Balance Scale & Twin Columns (19% - 20% vs Apple)
    html = `
      <div class="${stageClass}">
        ${corners}
        ${topHeader}
        <svg viewBox="0 0 1792 730" style="position:absolute;left:64px;top:172px;width:1792px;height:730px;z-index:5;overflow:visible;">
          <rect x="0" y="15" width="1792" height="665" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
          <line x1="160" y1="560" x2="1632" y2="560" stroke="#0F0F0F" stroke-width="6"/>
          <g id="s51_sam">
            <rect x="280" y="110" width="520" height="450" rx="24" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="5"/>
            <text x="540" y="260" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="84" fill="#F5C518">19%–20%</text>
            <text x="540" y="340" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="42" fill="#EFE9D9">SAMSUNG</text>
            <text x="540" y="395" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="22" fill="#EFE9D9">Galaxy S26 Series • Z TriFold • Galaxy AI</text>
          </g>
          <g id="s51_app">
            <rect x="992" y="110" width="520" height="450" rx="24" fill="#0F0F0F" stroke="#0F0F0F" stroke-width="5"/>
            <text x="1252" y="260" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="84" fill="#EFE9D9">19%–20%</text>
            <text x="1252" y="340" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="42" fill="#F5C518">APPLE</text>
            <text x="1252" y="395" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="22" fill="#EFE9D9">iPhone Series • Hệ sinh thái iOS</text>
          </g>
          <g id="s51_vs">
            <circle cx="896" cy="335" r="56" fill="#E85A1F" stroke="#0F0F0F" stroke-width="5"/>
            <text x="896" y="349" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="34" fill="#0F0F0F">VS</text>
          </g>
        </svg>
        ${bottomBanner}
      </div>`;
    js += `
      tl.fromTo("#s51_sam", { scaleY: 0, opacity: 0, svgOrigin: "540 560" }, { scaleY: 1, opacity: 1, duration: 0.55, ease: "back.out(1.5)" }, ${beat(0.75, 'whoosh')});
      tl.fromTo("#s51_vs", { scale: 0.5, opacity: 0, svgOrigin: "896 335" }, { scale: 1, opacity: 1, duration: 0.40, ease: "back.out(1.8)" }, ${beat(2.60, null)});
      tl.fromTo("#s51_app", { scaleY: 0, opacity: 0, svgOrigin: "1252 560" }, { scaleY: 1, opacity: 1, duration: 0.55, ease: "back.out(1.5)" }, ${beat(2.60, 'ping')});
      tl.fromTo("#foot_${num}", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, ${beat(4.50, null)});
    `;
  } else if (num === 52) {
    // SHOT #52 (17:50.4 - 18:01.3, dur 10.9s): 88-Year Historical Bridge (1938 Daegu Shop -> OLED iPhone -> AI HBM)
    html = `
      <div class="${stageClass}">
        ${corners}
        ${topHeader}
        <svg viewBox="0 0 1792 730" style="position:absolute;left:64px;top:172px;width:1792px;height:730px;z-index:5;overflow:visible;">
          <g id="s52_bridge">
            <rect x="12" y="27" width="1780" height="655" rx="24" fill="#E85A1F"/>
            <rect x="0" y="15" width="1780" height="655" rx="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
            <!-- Suspension Bridge Towers & Cable -->
            <path d="M260 150 Q896 390 1532 150" fill="none" stroke="#0F0F0F" stroke-width="8"/>
            <rect x="120" y="355" width="1552" height="28" rx="12" fill="#0F0F0F"/>
          </g>

          <g id="s52_n1">
            <rect x="90" y="120" width="440" height="220" rx="22" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
            <text x="310" y="185" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="36" fill="#E85A1F">1938 • DAEGU</text>
            <text x="310" y="240" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="23" fill="#0F0F0F">Tiệm cá khô 30.000 Won</text>
            <text x="310" y="278" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="700" font-size="19" fill="#222222">40 nhân viên khởi nghiệp</text>
          </g>

          <g id="s52_n2">
            <rect x="676" y="120" width="440" height="220" rx="22" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="5"/>
            <text x="896" y="185" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="34" fill="#F5C518">MÀN HÌNH TRONG iPHONE</text>
            <text x="896" y="240" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="22" fill="#EFE9D9">Nắm giữ linh kiện yết hầu</text>
            <text x="896" y="278" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="700" font-size="19" fill="#EFE9D9">của cả đối thủ lớn nhất</text>
          </g>

          <g id="s52_n3">
            <rect x="1262" y="120" width="440" height="220" rx="22" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
            <text x="1482" y="185" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="36" fill="#0F0F0F">2026 • KỶ NGUYÊN AI</text>
            <text x="1482" y="240" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="23" fill="#0F0F0F">Chip nhớ HBM nuôi sống AI</text>
            <text x="1482" y="278" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="19" fill="#136636">Hành trình gần 90 năm bão tố</text>
          </g>

          <g id="s52_q">
            <rect x="180" y="435" width="1432" height="185" rx="24" fill="#0F0F0F"/>
            <text x="896" y="520" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="40" fill="#F5C518">SAMSUNG THẬT SỰ LÀ MỘT CÔNG TY NHƯ THẾ NÀO?</text>
            <text x="896" y="575" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="700" font-size="22" fill="#EFE9D9">Câu trả lời nằm ở sự khác biệt cốt lõi giữa một Nghệ Sĩ và một Chiến Binh Công Nghiệp</text>
          </g>
        </svg>
        ${bottomBanner}
      </div>`;
    js += `
      tl.fromTo("#s52_bridge", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.4)" }, ${beat(0.50, 'pop')});
      tl.fromTo("#s52_n1", { scale: 0.90, opacity: 0, svgOrigin: "310 230" }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.7)" }, ${beat(3.05, 'pop')});
      tl.fromTo("#s52_n2", { scale: 0.90, opacity: 0, svgOrigin: "896 230" }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.7)" }, ${beat(8.70, 'ding')});
      tl.fromTo("#s52_n3", { scale: 0.90, opacity: 0, svgOrigin: "1482 230" }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.7)" }, ${beat(10.90, 'ping')});
      tl.fromTo("#s52_q", { scale: 0.92, opacity: 0, svgOrigin: "896 527" }, { scale: 1, opacity: 1, duration: 0.48, ease: "back.out(1.7)" }, ${beat(13.15, 'slam')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, ${beat(14.10, null)});
    `;
  } else if (num === 53) {
    // SHOT #53 (18:01.3 - 18:28.9, dur 27.6s): Apple Walled Garden (A3 PA1) vs Samsung Industrial Warrior + 4-Stage Silicon Conveyor Belt
    const vA3 = regVar(`s53_a3`, `Cảnh 53 - Mệnh đề A3 PA1`, p.leftTitle);
    const stages = [
      { t: '1. HẠT CÁT SILICON', c: '#E85A1F', fg: '#0F0F0F' },
      { t: '2. CHIP DRAM / HBM', c: '#F5C518', fg: '#0F0F0F' },
      { t: '3. TẤM NỀN OLED', c: '#1F8A4C', fg: '#EFE9D9' },
      { t: '4. THIẾT BỊ CUỐI CÙNG', c: '#F06CA8', fg: '#0F0F0F' }
    ];
    html = `
      <div class="${stageClass}">
        ${corners}
        ${topHeader}
        <svg viewBox="0 0 1792 730" style="position:absolute;left:64px;top:172px;width:1792px;height:730px;z-index:5;overflow:visible;">
          <g id="s53_apple">
            <rect x="0" y="10" width="855" height="415" rx="24" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
            <path d="M85 330 A 110 110 0 0 1 305 330 Z" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
            <circle cx="195" cy="260" r="38" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="4"/>
            <rect x="187" y="295" width="16" height="35" fill="#0F0F0F"/>
            <rect x="65" y="330" width="260" height="26" rx="8" fill="#0F0F0F"/>
            <foreignObject x="345" y="45" width="480" height="145">
              <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:'Be Vietnam Pro',sans-serif;font-weight:900;font-size:27px;line-height:1.22;color:#0F0F0F;text-transform:uppercase;" ${vA3}>${p.leftTitle}</div>
            </foreignObject>
            <text x="345" y="245" font-family="Be Vietnam Pro" font-weight="700" font-size="21" fill="#222222">• Chỉ xuất hiện khi mọi thứ đã hoàn hảo</text>
            <text x="345" y="288" font-family="Be Vietnam Pro" font-weight="700" font-size="21" fill="#222222">• Kiểm soát chặt khu vườn hệ sinh thái</text>
            <text x="345" y="331" font-family="Be Vietnam Pro" font-weight="800" font-size="21" fill="#1F8A4C">• Thuê ngoài sản xuất phần cứng vật lý</text>
          </g>
          <g id="s53_forge">
            <rect x="949" y="22" width="843" height="415" rx="24" fill="#E85A1F"/>
            <rect x="937" y="10" width="843" height="415" rx="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
            <path d="M985 335 L1235 335 L1200 265 L1020 265 Z" fill="#0F0F0F"/>
            <rect x="1035" y="235" width="150" height="30" rx="6" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3.5"/>
            <g id="s53_hammer">
              <rect x="1095" y="95" width="22" height="125" rx="6" fill="#0F0F0F"/>
              <rect x="1045" y="75" width="122" height="52" rx="10" fill="#F5C518" stroke="#0F0F0F" stroke-width="4.5"/>
            </g>
            <text x="1275" y="95" font-family="Be Vietnam Pro" font-weight="900" font-size="30" fill="#0F0F0F">SAMSUNG: CHIẾN BINH</text>
            <text x="1275" y="138" font-family="Be Vietnam Pro" font-weight="900" font-size="26" fill="#E85A1F">CÔNG NGHIỆP LÌ LỢM</text>
            <text x="1275" y="205" font-family="Be Vietnam Pro" font-weight="800" font-size="21" fill="#0F0F0F">• Không ngại thử sai trước công chúng</text>
            <text x="1275" y="248" font-family="Be Vietnam Pro" font-weight="800" font-size="21" fill="#0F0F0F">• Dám đốt 150.000 máy &amp; vượt bão 5,3 tỷ USD</text>
            <text x="1275" y="291" font-family="Be Vietnam Pro" font-weight="800" font-size="21" fill="#136636">• Tự đập đi xây lại chính mình</text>
          </g>
          <g id="s53_belt">
            <rect x="0" y="455" width="1780" height="225" rx="24" fill="#0F0F0F"/>
            <line x1="60" y1="635" x2="1720" y2="635" stroke="#F5C518" stroke-width="6" stroke-dasharray="22 14"/>
            ${stages.map((st, idx) => {
              const x = 42 + idx * 432;
              return `
              <g id="s53_st_${idx}">
                <rect x="${x}" y="485" width="400" height="120" rx="18" fill="${st.c}" stroke="#EFE9D9" stroke-width="4"/>
                <text x="${x + 200}" y="555" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="25" fill="${st.fg}">${st.t}</text>
              </g>`;
            }).join('')}
          </g>
        </svg>
        ${bottomBanner}
      </div>`;
    js += `
      tl.fromTo("#s53_apple", { x: -45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45 }, ${beat(0.25, 'pop')});
      tl.fromTo("#s53_forge", { x: 45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.48, ease: "back.out(1.5)" }, ${beat(4.55, 'slam')});
      tl.fromTo("#s53_hammer", { rotation: -28, svgOrigin: "1106 215" }, { rotation: 18, duration: 0.45, yoyo: true, repeat: 7, ease: "power2.inOut" }, 4.95);
      tl.fromTo("#s53_belt", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.4)" }, ${beat(16.05, 'whoosh')});
      tl.fromTo("#s53_st_0", { scale: 0.85, opacity: 0, svgOrigin: "242 545" }, { scale: 1, opacity: 1, duration: 0.36, ease: "back.out(1.8)" }, ${beat(18.70, 'click')});
      tl.fromTo("#s53_st_1", { scale: 0.85, opacity: 0, svgOrigin: "674 545" }, { scale: 1, opacity: 1, duration: 0.36, ease: "back.out(1.8)" }, ${beat(19.50, 'click')});
      tl.fromTo("#s53_st_2", { scale: 0.85, opacity: 0, svgOrigin: "1106 545" }, { scale: 1, opacity: 1, duration: 0.36, ease: "back.out(1.8)" }, ${beat(20.20, 'ding')});
      tl.fromTo("#s53_st_3", { scale: 0.85, opacity: 0, svgOrigin: "1538 545" }, { scale: 1, opacity: 1, duration: 0.40, ease: "back.out(1.8)" }, ${beat(20.85, 'ping')});
      tl.fromTo("#foot_${num}", { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, ${beat(23.80, null)});
    `;
  } else {
    // SHOT #54 (18:28.9 - 18:33.73, dur 4.83s): Dark Green Closing Stage (#136636)
    html = `
      <div class="${stageClass}">
        ${corners}
        ${topHeader}
        <svg viewBox="0 0 1792 730" style="position:absolute;left:64px;top:172px;width:1792px;height:730px;z-index:5;overflow:visible;">
          <g id="s54_left">
            <rect x="0" y="20" width="860" height="650" rx="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
            <circle cx="430" cy="240" r="125" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
            <polygon points="430,135 485,255 445,245 465,325 375,225 415,235" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>
            <text x="430" y="435" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="34" fill="#0F0F0F">SAMSUNG ELECTRONICS (1938 – 2026)</text>
            <text x="430" y="492" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="22" fill="#222222">Hành trình 88 năm từ tiệm cá khô Daegu</text>
            <text x="430" y="532" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="22" fill="#136636">đến Chiến Binh Công Nghiệp không thể thay thế.</text>
          </g>
          <g id="s54_right">
            <rect x="932" y="32" width="860" height="650" rx="24" fill="#E85A1F"/>
            <rect x="920" y="20" width="860" height="650" rx="24" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
            <rect x="970" y="85" width="760" height="240" rx="20" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
            <text x="1350" y="165" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="34" fill="#0F0F0F">CẢM ƠN CÁC BẠN ĐÃ THEO DÕI!</text>
            <text x="1350" y="235" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="800" font-size="23" fill="#E85A1F">Hẹn gặp lại mọi người ở những video tiếp theo!</text>
            <g id="s54_cta_btns">
              <rect x="970" y="385" width="360" height="110" rx="22" fill="#E85A1F" stroke="#0F0F0F" stroke-width="5"/>
              <text x="1150" y="452" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="30" fill="#0F0F0F">ĐĂNG KÝ KÊNH</text>
              <rect x="1370" y="385" width="360" height="110" rx="22" fill="#0F0F0F"/>
              <text x="1550" y="452" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="900" font-size="30" fill="#F5C518">HẸN GẶP LẠI</text>
            </g>
          </g>
        </svg>
        ${bottomBanner}
      </div>`;
    js += `
      tl.fromTo("#s54_left", { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "back.out(1.4)" }, ${beat(0.20, 'pop')});
      tl.fromTo("#s54_right", { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "back.out(1.5)" }, ${beat(2.35, 'whoosh')});
      tl.fromTo("#s54_cta_btns", { scale: 0.85, opacity: 0, svgOrigin: "1350 440" }, { scale: 1, opacity: 1, duration: 0.42, ease: "back.out(1.8)" }, ${beat(3.10, 'ping')});
      tl.fromTo("#foot_${num}", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, ${beat(3.90, null)});
    `;
  }

  return wrapScene(id, html, js);
}

// ============================================================================
// WAY A & WAY B B-ROLL SCENE BUILDERS (ZERO META TEXT, VOICE-LOCKED BEATS)
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

        <div id="wa_top_${num}" class="cm-card cm-shadow-ink" data-layout-allow-overlap style="position:absolute;left:56px;top:48px;width:780px;padding:22px 28px;background:#EFE9D9;border-radius:20px;z-index:12;">
          <div class="cm-display" style="font-size:34px;color:#0F0F0F;" ${vTitle}>${p.title}</div>
          <div class="cm-sub" style="font-size:19px;margin-top:8px;color:#1E1E1E;" ${vSub}>${p.sub}</div>
        </div>

        <div id="wa_metric_${num}" class="cm-card cm-shadow-featured" data-layout-allow-overlap style="position:absolute;right:56px;top:48px;width:430px;padding:20px 26px;background:#F5C518;border-radius:20px;z-index:12;">
          <div class="cm-display" style="font-size:38px;color:#0F0F0F;line-height:1.05;" ${vMetric}>${p.metric}</div>
          <div class="cm-sub" style="font-size:18px;font-weight:800;color:#0F0F0F;margin-top:6px;">${p.metricLabel}</div>
        </div>

        <div id="wa_bot_${num}" class="cm-card cm-shadow-ink" data-layout-allow-overlap style="position:absolute;left:56px;right:56px;bottom:48px;padding:18px 28px;background:#0F0F0F;border-radius:18px;display:flex;align-items:center;justify-content:space-between;z-index:12;">
          <div style="display:flex;align-items:center;gap:14px;">
            <span style="width:14px;height:14px;border-radius:999px;background:#F5C518;display:inline-block;"></span>
            <span class="cm-sub" style="font-size:20px;color:#EFE9D9;font-weight:800;" ${vFoot}>${p.footer}</span>
          </div>
          <span class="cm-mono" style="font-size:18px;color:#F5C518;">${extractYearBadge(p.title, p.sub)}</span>
        </div>
      </div>`;

  const js = `
    tl.fromTo("#wa_top_${num}", { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, ${t1});
    tl.fromTo("#wa_metric_${num}", { y: -40, scale: 0.9, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" }, ${t2});
    tl.fromTo("#wa_bot_${num}", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" }, ${t3});
  `;
  return wrapScene(id, html, js);
}

function buildWayBShot(num, brollFile, p) {
  const id = `scene-${String(num).padStart(2, '0')}`;
  const isLeftWin = num % 2 === 0;
  const winLeft = isLeftWin ? 60 : 612;
  const colLeft = isLeftWin ? 1336 : 60;
  const colWidth = 524;

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
        <div id="wb_mid_${num}" class="cm-card cm-shadow-ink" style="position:absolute;left:${colLeft}px;top:338px;width:${colWidth}px;height:256px;padding:22px 24px;background:#EFE9D9;border-radius:20px;z-index:10;display:flex;flex-direction:column;justify-content:space-between;">
          <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:4px solid #0F0F0F;padding-bottom:10px;">
            <span class="cm-display" style="font-size:24px;color:#0F0F0F;">${p.newsSource}</span>
            <span class="cm-pill" style="background:#F5C518;color:#0F0F0F;font-size:14px;padding:4px 12px;">${yearTag}</span>
          </div>
          <div style="background:#F5C518;border:3px solid #0F0F0F;border-radius:12px;padding:12px 16px;">
            <div class="cm-sub" style="font-size:18px;font-weight:900;color:#0F0F0F;line-height:1.3;" ${vNews}>${p.newsHeadline}</div>
          </div>
          <div class="cm-sub" style="font-size:16px;font-weight:700;color:#222222;">• ${p.b1}</div>
        </div>`;
  } else {
    midCardHtml = `
        <div id="wb_mid_${num}" class="cm-card cm-shadow-ink" style="position:absolute;left:${colLeft}px;top:338px;width:${colWidth}px;height:256px;padding:22px 24px;background:#E4DCC4;border-radius:20px;z-index:10;display:flex;flex-direction:column;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:14px;">
            <div style="width:44px;height:44px;border-radius:12px;background:#1F8A4C;border:3.5px solid #0F0F0F;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <div style="width:16px;height:16px;border-radius:999px;background:#F5C518;"></div>
            </div>
            <div class="cm-display" style="font-size:22px;color:#0F0F0F;">DIỄN BIẾN TRỌNG TÂM</div>
          </div>
          <div style="background:#EFE9D9;border:3.5px solid #0F0F0F;border-radius:14px;padding:12px 16px;">
            <div class="cm-sub" style="font-size:17px;font-weight:800;color:#0F0F0F;">• ${p.b1}</div>
            <div class="cm-sub" style="font-size:17px;font-weight:800;color:#136636;margin-top:8px;">• ${p.b2}</div>
          </div>
          <div style="width:100%;height:14px;background:#EFE9D9;border:3px solid #0F0F0F;border-radius:999px;overflow:hidden;">
            <div id="wb_bar_${num}" style="width:100%;height:100%;background:#E85A1F;transform-origin:left center;"></div>
          </div>
        </div>`;
  }

  const html = `
      <div class="cm-stage">
        ${cornersHtml(false)}

        <div id="wb_win_${num}" class="cm-wayb-win cm-shadow-featured" data-layout-allow-overlap style="left:${winLeft}px;top:128px;width:1248px;height:702px;">
          <video id="vid_wb_${num}" class="clip" src="../assets/broll/${brollFile}" data-start="0" data-duration="${p.dur}" muted playsinline></video>
        </div>

        <div id="wb_yr_${num}" class="cm-pill cm-shadow-ink" data-layout-allow-overlap style="position:absolute;left:${isLeftWin ? winLeft + 28 : winLeft + 1010}px;top:98px;background:#F5C518;color:#0F0F0F;font-size:20px;padding:10px 26px;z-index:14;">
          ${yearTag}
        </div>

        <div id="wb_top_${num}" class="cm-card cm-shadow-ink" style="position:absolute;left:${colLeft}px;top:76px;width:${colWidth}px;height:242px;padding:24px 26px;background:#EFE9D9;border-radius:20px;z-index:10;display:flex;flex-direction:column;justify-content:center;">
          <div class="cm-display" style="font-size:29px;color:#0F0F0F;line-height:1.12;" ${vTitle}>${p.title}</div>
          <div class="cm-sub" style="font-size:17px;color:#222222;margin-top:12px;line-height:1.38;" ${vSub}>${p.sub}</div>
        </div>

        ${midCardHtml}

        <div id="wb_metric_${num}" class="cm-card cm-shadow-ink" data-layout-allow-overlap style="position:absolute;left:${isLeftWin ? colLeft - 36 : colLeft + 36}px;top:614px;width:${colWidth}px;height:216px;padding:22px 26px;background:#F5C518;border-radius:20px;z-index:14;display:flex;flex-direction:column;justify-content:center;">
          <div class="cm-display" style="font-size:38px;color:#0F0F0F;line-height:1.05;" ${vMetric}>${p.metric}</div>
          <div class="cm-sub" style="font-size:18px;font-weight:900;color:#0F0F0F;margin-top:8px;">${p.metricLabel}</div>
          <div class="cm-sub" style="font-size:16px;font-weight:700;color:#1E1E1E;margin-top:6px;">• ${p.b3}</div>
        </div>

        <div id="wb_bot_${num}" class="cm-card" style="position:absolute;left:60px;right:60px;bottom:46px;height:82px;background:#0F0F0F;border-radius:18px;padding:0 32px;display:flex;align-items:center;justify-content:space-between;z-index:12;">
          <div style="display:flex;align-items:center;gap:16px;">
            <div style="width:16px;height:16px;border-radius:999px;background:#1F8A4C;border:2px solid #EFE9D9;"></div>
            <div class="cm-sub" style="font-size:20px;color:#EFE9D9;font-weight:800;" ${vFoot}>${p.footer}</div>
          </div>
          <div class="cm-mono" style="font-size:18px;color:#F5C518;">${p.metric}</div>
        </div>
      </div>`;

  const js = `
    tl.fromTo("#wb_win_${num}", { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" }, ${tWin});
    tl.fromTo("#wb_yr_${num}", { y: -25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.6)" }, ${tTitle});
    tl.fromTo("#wb_top_${num}", { x: ${isLeftWin ? 45 : -45}, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, ${tTitle});
    tl.fromTo("#wb_mid_${num}", { x: ${isLeftWin ? 45 : -45}, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "back.out(1.3)" }, ${tMid});
    ${!p.newsSource ? `tl.fromTo("#wb_bar_${num}", { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power2.out" }, ${+(tMid + 0.2).toFixed(2)});` : ''}
    tl.fromTo("#wb_metric_${num}", { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.6)" }, ${tMetric});
    tl.fromTo("#wb_bot_${num}", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" }, ${tBot});
  `;
  return wrapScene(id, html, js);
}

// ============================================================================
// EXACT 54 SHOTS FROM APPROVED STORYBOARD.MD & B_ROLL_SHEET.MD
// ============================================================================
const SHOTS = [
  // CHƯƠNG MỞ ĐẦU (00:00.0 – 01:35.45)
  {
    num: 1, start: 0.00, end: 12.50, mode: 'MOTION', variant: 'split_2col',
    title: 'NGHỊCH LÝ CHIẾC IPHONE TRÊN TAY iFAN',
    sub: 'Cầm iPhone nhưng rất có thể bạn đang gián tiếp trả tiền cho Samsung mỗi ngày',
    leftTitle: 'CẦM IPHONE TRÊN TAY', rightTitle: 'DOANH THU VỀ SAMSUNG',
    footer: 'Mối quan hệ vừa đối đầu vừa phụ thuộc kỳ lạ nhất thế giới công nghệ'
  },
  {
    num: 2, start: 12.50, end: 27.80, mode: 'WAY_B', broll: 'shot-02.mp4',
    beats: { top: 0.45, mid: 6.35, metric: 9.65, bot: 12.80 },
    title: 'MỔ BỤNG IPHONE: MÀN HÌNH OLED & CHIP NHỚ SAMSUNG',
    sub: 'Bên dưới lớp kính bóng bẩy từ thời iPhone X là tấm nền OLED và chip nhớ Hàn Quốc',
    metric: 'OLED + NAND FLASH', metricLabel: 'Bước ra từ dây chuyền sản xuất của Samsung',
    b1: 'Tấm nền Super Retina OLED rực rỡ do Samsung Display cung ứng',
    b2: 'Các dòng chip nhớ tốc độ cao hiện diện bên trong bo mạch',
    b3: 'Samsung kiếm hàng tỷ USD mỗi năm từ chính đối thủ truyền kiếp',
    footer: 'Nắm giữ những linh kiện yết hầu bên trong các dòng smartphone cao cấp'
  },
  {
    num: 3, start: 27.80, end: 36.15, mode: 'WAY_A', broll: 'shot-03.mp4',
    beats: { top: 1.60, metric: 4.45, bot: 6.10 },
    title: 'THÁP BURJ KHALIFA (828M) & SIÊU TÀU KHÍ HÓA LỎNG LNG',
    sub: 'Từ tòa tháp cao nhất thế giới tại Dubai đến những siêu tàu khổng lồ ngoài đại dương',
    metric: '828 MÉT • DUBAI', metricLabel: 'Samsung C&T thi công & Samsung Heavy Industries đóng tàu',
    footer: 'Quy mô công nghiệp nặng vượt xa khỏi giới hạn của một hãng điện tử thông thường'
  },
  {
    num: 4, start: 36.15, end: 45.35, mode: 'WAY_B', broll: 'shot-04.mp4',
    beats: { top: 0.55, mid: 3.30, metric: 5.65, bot: 7.25 },
    title: 'ĐẠI CÔNG XƯỞNG BẮC NINH & THÁI NGUYÊN (VIỆT NAM)',
    sub: 'Nơi đã xuất xưởng hơn 2 tỷ thiết bị di động đi khắp toàn cầu tính đến giữa năm 2025',
    metric: '> 2 TỶ THIẾT BỊ', metricLabel: 'Cột mốc xuất xưởng tại Việt Nam đến giữa năm 2025',
    newsSource: 'THE INVESTOR / KOREA HERALD',
    newsHeadline: 'Samsung Vietnam Cumulative Mobile Production Surpasses 2 Billion Units',
    b1: 'Hai tổ hợp công nghệ cao quy mô bậc nhất tại Bắc Ninh và Thái Nguyên',
    b2: 'Cung ứng hơn một nửa sản lượng điện thoại toàn cầu của Samsung',
    b3: 'Tất cả cùng mang chung một cái tên: Đế chế Samsung',
    footer: 'Việt Nam là cứ điểm sản xuất chiến lược lớn nhất toàn cầu của Samsung'
  },
  {
    num: 5, start: 45.35, end: 81.85, mode: 'MOTION', variant: 'domino_4steps',
    title: 'TỪ TIỆM CÁ KHÔ 40 NHÂN VIÊN ĐẾN CUỘC CHIẾN KỶ NGUYÊN AI',
    sub: 'Không bắt đầu từ gara California hay phòng lab Tokyo mà từ tiệm buôn nhỏ tại Daegu',
    leftTitle: 'TIỆM CÁ KHÔ 1938', rightTitle: 'ĐẾ CHẾ AI 2026',
    footer: 'Đốt 150.000 máy • Vượt Sony & Nokia • Sống sót sau Note 7 • Quyết chiến kỷ nguyên AI'
  },
  {
    num: 6, start: 81.85, end: 95.45, mode: 'MOTION', variant: 'clock_rewind',
    title: 'QUAY NGƯỢC KIM ĐỒNG HỒ VỀ NĂM 1938',
    sub: 'Hồ sơ lịch sử tổng hợp đa nguồn — mời anh em cùng góp ý và bắt đầu hành trình!',
    leftTitle: 'HIỆN TẠI 2026', rightTitle: 'KHỞI NGUỒN 1938',
    footer: 'Cùng trở lại ngày 01/03/1938 tại thành phố Daegu, Hàn Quốc'
  },

  // CHƯƠNG I: KHỞI NGUỒN DAEGU 1938 & BƯỚC NGOẶT ĐIỆN TỬ (01:35.45 – 03:31.85)
  {
    num: 7, start: 95.45, end: 135.25, mode: 'WAY_B', broll: 'shot-07.mp4',
    beats: { top: 0.15, metric: 11.15, mid: 32.65, bot: 37.95 },
    title: '01/03/1938: LEE BYUNG-CHUL LẬP TIỆM SAMSUNG SANGHOE',
    sub: 'Vốn khởi nghiệp 30.000 Won (~27 USD), 40 nhân viên buôn cá khô, rau củ và mì sợi',
    metric: '30.000 WON', metricLabel: 'SAM (Ba: Lớn mạnh) + SUNG (Ngôi sao: Vĩnh cửu)',
    b1: 'Thành lập ngày 01/03/1938 tại thành phố Daegu với 40 nhân viên',
    b2: 'Thu mua cá khô, rau củ địa phương và mì sợi tự làm xuất sang Mãn Châu & Bắc Kinh',
    b3: 'Ước mơ xây dựng một doanh nghiệp to lớn, mạnh mẽ và trường tồn như những vì sao',
    footer: 'Khởi đầu khiêm tốn của tập đoàn lớn nhất lịch sử kinh tế Hàn Quốc'
  },
  {
    num: 8, start: 135.25, end: 177.85, mode: 'MOTION', variant: 'map_korea_japan',
    title: 'BÀNH TRƯỚNG CHAEBOL ĐA NGÀNH & SỨC ÉP TỪ NHẬT BẢN',
    sub: 'Dời trụ sở lên Seoul (1947), mở dệt may, đường, bảo hiểm và nhìn sang làn sóng điện tử Nhật',
    leftTitle: 'CHAEBOL HÀN QUỐC', rightTitle: 'ĐIỆN TỬ NHẬT BẢN',
    footer: 'Sony, Sanyo, Panasonic làm giàu thần tốc nhờ điện tử bên kia eo biển'
  },
  {
    num: 9, start: 177.85, end: 211.85, mode: 'WAY_B', broll: 'shot-09.mp4',
    beats: { top: 6.75, mid: 9.50, metric: 29.15, bot: 31.60 },
    title: '1969–1978: TV ĐEN TRẮNG P-3202 & NGÔI SỐ 1 SẢN LƯỢNG',
    sub: 'Lập Samsung Electronics (1969), cử 137 thực tập sinh sang Nhật và cán mốc 4 triệu TV năm 1978',
    metric: '> 4 TRIỆU TV (1978)', metricLabel: 'Số 1 thế giới về sản lượng TV đen trắng',
    b1: 'Năm 1969 cử 137 thực tập sinh sang học công nghệ của Sanyo và NEC (Nhật Bản)',
    b2: 'Năm 1970 ra mắt chiếc TV đen trắng 12 inch đầu tiên mang mã P-3202',
    b3: 'Năm 1978 đạt hơn 4 triệu chiếc, dẫn đầu sản lượng TV đen trắng toàn cầu',
    footer: 'Bước nhảy vọt thần tốc từ con số 0 lên nhà sản xuất TV đen trắng lớn nhất thế giới'
  },

  // CHƯƠNG II: TỬ HUYỆT GIA CÔNG & CANH BẠC DRAM 1983–1992 (03:31.85 – 04:41.38)
  {
    num: 10, start: 211.85, end: 236.00, mode: 'MOTION', variant: 'xray_machine',
    title: 'TỬ HUYỆT GIA CÔNG ĐẦU THẬP NIÊN 1980',
    sub: 'Linh kiện cốt lõi trong TV, lò vi sóng đều mua từ Nhật & Mỹ — ngừng bán chip là đắp chiếu',
    leftTitle: 'VỎ LẮP RÁP GIÁ RẺ', rightTitle: 'KHÓA VAN CHIP LÕI',
    footer: 'Lợi nhuận ngon ăn nhất rơi vào túi đối tác ngoại nếu không tự chủ được bán dẫn'
  },
  {
    num: 11, start: 236.00, end: 263.05, mode: 'WAY_B', broll: 'shot-11.mp4',
    beats: { top: 1.25, mid: 6.20, metric: 19.55, bot: 24.80 },
    title: 'TUYÊN BỐ TOKYO 1983 & CHIẾN THUẬT ĐẦU TƯ NGƯỢC CHU KỲ',
    sub: 'Ở tuổi ngoài 70, Lee Byung-chul đặt cược vào DRAM và vay tiền xây nhà máy khi thị trường suy thoái',
    metric: 'TUYÊN BỐ TOKYO 1983', metricLabel: 'Đầu tư ngược chu kỳ khi các đối thủ cắt giảm',
    newsSource: 'KOREA JOONGANG DAILY',
    newsHeadline: '1983 Tokyo Declaration Launches Samsung Into Global DRAM Semiconductor Race',
    b1: 'Đầu năm 1983 tuyên bố tại Tokyo rằng Samsung sẽ tự sản xuất bộ nhớ bán dẫn DRAM',
    b2: 'Khi thị trường chip suy thoái, các hãng co cụm thì Samsung vay vốn xây thêm nhà máy',
    b3: 'Kỷ luật sắt đá giúp rút ngắn khoảng cách công nghệ hàng chục năm với Mỹ và Nhật',
    footer: 'Chiến thuật Đầu tư Ngược Chu Kỳ trở thành bản sắc sống còn của bán dẫn Samsung'
  },
  {
    num: 12, start: 263.05, end: 281.38, mode: 'WAY_B', broll: 'shot-12.mp4',
    beats: { top: 0.55, mid: 2.55, metric: 11.80, bot: 15.95 },
    title: 'TỪ DRAM 64K (1983) ĐẾN NGÔI VƯƠNG DRAM 64Mb (1992)',
    sub: 'Làm chủ 64K DRAM cuối năm 1983, 256K sau 3 tháng và lên ngôi số 1 thế giới năm 1992',
    metric: 'SỐ 1 DRAM (1992)', metricLabel: 'Phát triển thành công chip DRAM 64Mb đầu tiên trên thế giới',
    b1: 'Cuối năm 1983 phát triển thành công chip DRAM 64K tại nhà máy Giheung',
    b2: 'Chỉ 3 tháng sau tiếp tục ra mắt thành công thế hệ DRAM 256K',
    b3: 'Năm 1992 trình làng DRAM 64Mb đầu tiên, chính thức vượt Nhật & Mỹ lên ngôi vương',
    footer: 'Chỉ mất 9 năm (1983–1992) để từ kẻ học việc trở thành ông vua chip nhớ toàn cầu'
  },

  // CHƯƠNG III: TUYÊN BỐ FRANKFURT 1993 & NGỌN LỬA GUMI 1995 (04:41.38 – 06:18.50)
  {
    num: 13, start: 281.38, end: 315.40, mode: 'WAY_B', broll: 'shot-13.mp4',
    beats: { metric: 6.00, top: 12.45, mid: 22.75, bot: 32.20 },
    title: 'CÚ SỐC KỆ GIẢM GIÁ MỸ & BĂNG VIDEO GỌT NẮP MÁY GIẶT LỖI',
    sub: 'Chủ tịch kế vị Lee Kun-hee bàng hoàng trước cảnh sản phẩm phủ bụi và lắp ghép cẩu thả',
    metric: 'CUỐI NĂM 1987', metricLabel: 'Lee Kun-hee kế vị và trực diện căn bệnh số lượng đè chất lượng',
    b1: 'TV và đầu video Samsung nằm phủ bụi ở góc dưới cùng của kệ giảm giá tại Mỹ',
    b2: 'Đoạn băng ghi cảnh công nhân dùng dao gọt phần nhựa thừa của nắp máy giặt đúc lỗi',
    b3: 'Nhận ra nếu không thay đổi tư duy chất lượng, Samsung sẽ sớm bị đào thải',
    footer: 'Giọt nước tràn ly buộc vị tân Chủ tịch phải phát động cuộc cách mạng quản trị'
  },
  {
    num: 14, start: 315.40, end: 333.10, mode: 'WAY_B', broll: 'shot-14.mp4',
    beats: { top: 1.70, metric: 10.95, mid: 11.80, bot: 15.50 },
    title: 'TUYÊN BỐ QUẢN TRỊ MỚI TẠI FRANKFURT (THÁNG 6/1993)',
    sub: 'Triệu tập hàng trăm lãnh đạo cấp cao tới khách sạn Kempinski (Đức) với mệnh lệnh lịch sử',
    metric: 'THÁNG 06 / 1993', metricLabel: 'Hãy thay đổi tất cả mọi thứ, trừ vợ và con!',
    newsSource: 'THE KOREA HERALD',
    newsHeadline: 'Change Everything Except Your Wife and Children — Lee Kun-hee Frankfurt 1993',
    b1: 'Hàng trăm lãnh đạo cấp cao được triệu tập sang khách sạn Kempinski ở Frankfurt',
    b2: 'Tuyên bố Quản trị Mới đặt chất lượng sản phẩm lên trên sản lượng bằng mọi giá',
    b3: 'Câu nói đi vào lịch sử quản trị kinh doanh hiện đại toàn cầu',
    footer: 'Bước ngoặt tư duy biến Samsung từ hãng gia công giá rẻ thành thương hiệu toàn cầu'
  },
  {
    num: 15, start: 333.10, end: 349.65, mode: 'MOTION', variant: 'defect_meter',
    title: 'NĂM 1994: TỶ LỆ LỖI ANYCALL VỌT LÊN MỨC THẢM HỌA 11,8%',
    sub: 'Cứ 10 máy bán ra có hơn 1 máy hỏng — quà tặng Năm Mới của Chủ tịch cũng không bật lên được',
    leftTitle: '10 MÁY HỎNG HƠN 1', rightTitle: 'TỶ LỆ LỖI 11,8%',
    footer: 'Khi lời cảnh báo tại Frankfurt chưa đủ sức thức tỉnh thói quen làm hàng ẩu'
  },
  {
    num: 16, start: 349.65, end: 378.50, mode: 'WAY_A', broll: 'shot-16.mp4',
    beats: { top: 0.15, metric: 4.95, bot: 22.70 },
    title: '09/03/1995: ĐỐT 150.000 MÁY LỖI TRƯỚC 2.000 NHÂN VIÊN GUMI',
    sub: '10 công nhân cầm búa tạ đập nát, châm lửa đốt sạch và xe ủi cán phẳng 50 tỷ Won thiết bị',
    metric: '150.000 MÁY (50 TỶ WON)', metricLabel: 'Ngọn lửa Gumi ngày 09/03/1995 khắc sâu khẩu hiệu Chất lượng là trên hết',
    footer: 'Cú sốc thị giác mạnh mẽ nhất lịch sử công nghiệp Hàn Quốc xóa sổ tư duy làm hàng lỗi'
  },

  // CHƯƠNG IV: BƯỚC NHẢY VỌT DI ĐỘNG, CỨ ĐIỂM VIỆT NAM & NGAI VÀNG 2012 (06:18.50 – 08:55.60)
  {
    num: 17, start: 378.50, end: 404.50, mode: 'WAY_B', broll: 'shot-17.mp4',
    beats: { top: 9.10, mid: 12.10, metric: 19.75, bot: 24.10 },
    title: 'ĐẶT CƯỢC MẠNG SỐ CDMA (1996) & ĐIỆN THOẠI ĐỒNG HỒ SPH-WP10',
    sub: 'Bỏ qua mạng Analog cũ kỹ của Motorola để đi thẳng vào kỷ nguyên kỹ thuật số',
    metric: 'CDMA & SPH-WP10', metricLabel: 'Liên tục tung ra các thiết bị đi trước thời đại cuối thập niên 1990',
    b1: 'Năm 1996 đặt cược toàn bộ vào chuẩn mạng kỹ thuật số CDMA với mẫu SCH-100',
    b2: 'Ra mắt chiếc điện thoại đồng hồ đầu tiên thế giới SPH-WP10 (1998–1999)',
    b3: 'Tiên phong tích hợp máy nghe nhạc MP3 vào điện thoại di động',
    footer: 'Bộ máy R&D vận hành như một đoàn tàu cao tốc sau cú sốc tinh thần ở Gumi'
  },
  {
    num: 18, start: 404.50, end: 426.28, mode: 'WAY_B', broll: 'shot-18.mp4',
    beats: { top: 3.75, mid: 8.70, metric: 14.80, bot: 18.45 },
    title: 'THÁNG 3/2002: NẮP GẬP SGH-T100 MÀN HÌNH MÀU TFT LCD',
    sub: 'Ra mắt tại triển lãm CeBIT (Đức) với 4.096 màu rực rỡ và nhanh chóng vượt mốc 10 triệu máy',
    metric: '> 10 TRIỆU MÁY', metricLabel: 'Điện thoại màn hình ma trận chủ động TFT LCD 4.096 màu đầu tiên',
    b1: 'Trình làng tháng 03/2002 tại triển lãm công nghệ CeBIT ở Đức',
    b2: 'Trang bị màn hình màu TFT LCD rực rỡ thay thế màn hình đơn sắc nhàm chán',
    b3: 'Cán mốc hơn 10 triệu máy bán ra vào năm 2003, mở cánh cửa vào phân khúc cao cấp',
    footer: 'Chiếc điện thoại nắp gập đưa thương hiệu Samsung bước vào câu lạc bộ hàng hiệu'
  },
  {
    num: 19, start: 426.28, end: 452.65, mode: 'WAY_B', broll: 'shot-19.mp4',
    beats: { top: 4.40, mid: 14.75, metric: 22.90, bot: 24.85 },
    title: 'CƠN ĐỊA CHẤN IPHONE 2007 & QUYẾT ĐỊNH HỘI TỤ VÀO ANDROID',
    sub: 'Từ bỏ sự phân tán giữa Windows Mobile, Symbian và Bada để dồn toàn lực cho Google Android',
    metric: 'ALL-IN ANDROID', metricLabel: 'Nhận diện chính xác làn sóng màn hình cảm ứng & kho ứng dụng',
    b1: 'Năm 2007 Steve Jobs ra mắt iPhone làm đảo lộn toàn bộ trật tự ngành di động',
    b2: 'Trong khi Nokia và BlackBerry chủ quan, Samsung kịp thời xoay trục chiến lược',
    b3: 'Thu gọn các nhánh Windows Mobile, Symbian, Bada để hội tụ vào hệ sinh thái Android',
    footer: 'Sự nhạy bén chiến lược giúp Samsung bắt kịp chuyến tàu smartphone cảm ứng'
  },
  {
    num: 20, start: 452.65, end: 470.50, mode: 'WAY_B', broll: 'shot-20.mp4',
    beats: { top: 4.45, mid: 14.90, metric: 15.55, bot: 16.60 },
    title: 'THÁNG 6/2010: ĐÒN QUYẾT ĐỊNH MANG TÊN GALAXY S',
    sub: 'Màn hình Super AMOLED 4 inch rực rỡ + chip Hummingbird 1GHz bán hơn 10 triệu máy sau 7 tháng',
    metric: '> 10 TRIỆU MÁY', metricLabel: 'Doanh số Galaxy S (GT-I9000) chỉ sau khoảng 7 tháng lên kệ',
    newsSource: 'THE KOREA HERALD',
    newsHeadline: 'Samsung Galaxy S Sales Surpass 10 Million Units Globally Within Seven Months',
    b1: 'Sau mẫu thử nghiệm GT-I7500 (2009), tháng 06/2010 tung ra chiếc Galaxy S đầu tiên',
    b2: 'Sở hữu tấm nền Super AMOLED 4 inch và vi xử lý Hummingbird 1GHz tự phát triển',
    b3: 'Trở thành đối trọng xứng tầm nhất với iPhone trên thị trường toàn cầu',
    footer: 'Cú nổ mở màn cho đế chế dòng điện thoại thông minh Galaxy'
  },
  {
    num: 21, start: 470.50, end: 487.75, mode: 'WAY_B', broll: 'shot-21.mp4',
    beats: { top: 2.20, mid: 11.50, metric: 15.10, bot: 15.80 },
    title: 'NƯỚC CỜ CHUỖI CUNG ỨNG: BẮC NINH (2008) & THÁI NGUYÊN (2013)',
    sub: 'Biến Việt Nam thành đại bản doanh sản xuất hơn một nửa sản lượng điện thoại toàn cầu của hãng',
    metric: '> 50% SẢN LƯỢNG', metricLabel: 'Tổ hợp SEV Bắc Ninh (2008/2009) & SEVT Thái Nguyên (2013)',
    b1: 'Khởi công nhà máy Bắc Ninh từ năm 2008 và vận hành chính thức tháng 04/2009',
    b2: 'Tiếp nối bằng siêu tổ hợp nhà máy Thái Nguyên vào năm 2013',
    b3: 'Đảm bảo năng lực cung ứng hàng trăm triệu máy mỗi năm với chi phí tối ưu',
    footer: 'Bệ phóng sản xuất giúp Samsung bứt tốc vượt qua mọi đối thủ về quy mô'
  },
  {
    num: 22, start: 487.75, end: 514.85, mode: 'WAY_B', broll: 'shot-22.mp4',
    beats: { top: 2.05, mid: 7.05, metric: 15.15, bot: 21.50 },
    title: 'IFA BERLIN 09/2011: GALAXY NOTE 5,3" KHAI SINH PHABLET',
    sub: 'Bất chấp lời chế giễu "úp lát bánh mì nướng lên mặt", Galaxy Note bán hơn 10 triệu máy',
    metric: '5,3 INCH + S PEN', metricLabel: 'Bán hơn 10 triệu máy trong chưa đầy 1 năm và mở ra kỷ nguyên màn lớn',
    b1: 'Truyền thông phương Tây từng chê màn hình 5,3 inch là quá khổ và kỳ dị',
    b2: 'Sự kết hợp giữa màn hình lớn và bút cảm ứng S Pen chinh phục người dùng cao cấp',
    b3: 'Buộc toàn bộ ngành di động (kể cả Apple sau này) phải đi theo xu hướng màn hình lớn',
    footer: 'Chứng minh Samsung không chỉ biết chạy theo mà có thể tự định hình xu hướng mới'
  },
  {
    num: 23, start: 514.85, end: 535.60, mode: 'WAY_B', broll: 'shot-23.mp4',
    beats: { top: 5.10, mid: 8.10, metric: 18.25, bot: 19.30 },
    title: '2012–2013: LẬT ĐỔ 14 NĂM CỦA NOKIA & ĐỈNH CAO GALAXY S3, S4',
    sub: 'Vượt qua cả Apple lẫn Nokia năm 2012, mỗi thế hệ Galaxy S3 và S4 bán tới 70–80 triệu máy',
    metric: '70–80 TRIỆU MÁY', metricLabel: 'Doanh số kỷ lục của mỗi thế hệ Galaxy S3 (2012) và Galaxy S4 (2013)',
    newsSource: 'SOUTH CHINA MORNING POST',
    newsHeadline: 'Samsung Ends Nokia 14-Year Reign to Become World Largest Mobile Phone Maker',
    b1: 'Năm 2012 chính thức chấm dứt 14 năm thống trị của Nokia trên thị trường di động',
    b2: 'Đồng thời vượt qua Apple để giữ ngôi số 1 thị phần smartphone toàn cầu',
    b3: 'Bộ đôi Galaxy S3 và Galaxy S4 đạt doanh số 70–80 triệu máy mỗi dòng',
    footer: 'Thời kỳ hoàng kim rực rỡ đưa Samsung lên đỉnh cao quyền lực ngành di động'
  },

  // CHƯƠNG V: ÁN PHẠT TỶ ĐÔ VỚI APPLE & THẢM HỌA GALAXY NOTE 7 (08:55.60 – 11:44.45)
  {
    num: 24, start: 535.60, end: 545.80, mode: 'MOTION', variant: 'crisis_spears',
    title: 'CÁI GIÁ CỦA TỐC ĐỘ: BÃO TỐ ẬP ĐẾN TỪ 3 PHÍA',
    sub: 'Ngay trên đỉnh vinh quang, áp lực dồn dập tìm đến từ Pháp lý, Thị trường và Kỹ thuật',
    leftTitle: 'PHÁP LÝ • THỊ TRƯỜNG', rightTitle: 'KỸ THUẬT PIN',
    footer: 'Khi sự tăng trưởng quá nóng bắt đầu bộc lộ những vết nứt nguy hiểm'
  },
  {
    num: 25, start: 545.80, end: 572.25, mode: 'WAY_B', broll: 'shot-25.mp4',
    beats: { top: 4.00, metric: 14.60, mid: 21.70, bot: 23.80 },
    title: 'CUỘC CHIẾN PHÁP LÝ 7 NĂM VỚI APPLE (2011 – 2018)',
    sub: 'Từ phán quyết 1,05 tỷ USD tháng 8/2012 đến mức án 539 triệu USD và thỏa thuận tháng 6/2018',
    metric: '1,05 TỶ → 539 TRIỆU USD', metricLabel: 'Cuộc chiến bản quyền kéo dài 7 năm lên tới Tối cao Pháp viện Mỹ',
    newsSource: 'VOA NEWS / CBS NEWS',
    newsHeadline: 'Apple and Samsung Settle Seven-Year Patent Dispute After $539M Verdict',
    b1: 'Tháng 04/2011, Steve Jobs khởi kiện cáo buộc dòng Galaxy sao chép thiết kế iPhone & iPad',
    b2: 'Tháng 08/2012, bồi thẩm đoàn Mỹ tuyên mức bồi thường chấn động 1,05 tỷ USD',
    b3: 'Tháng 06/2018, khép lại sau 7 năm bằng mức án 539 triệu USD và thỏa thuận dàn xếp',
    footer: 'Đòn giáng pháp lý từ chính khách hàng mua linh kiện lớn nhất của Samsung'
  },
  {
    num: 26, start: 572.25, end: 592.90, mode: 'WAY_B', broll: 'shot-26.mp4',
    beats: { top: 2.35, mid: 12.50, metric: 17.65, bot: 18.95 },
    title: 'GALAXY S5 (2014) BỊ CHÊ TRÁCH & CÚ SỤP ĐỔ THỊ PHẦN TẠI TRUNG QUỐC',
    sub: 'Mặt lưng nhựa đục lỗ bị ví như băng cá nhân trong khi Xiaomi, Huawei, OPPO trỗi dậy mạnh mẽ',
    metric: 'THỊ PHẦN TRUNG QUỐC ↓', metricLabel: 'Từ vị trí dẫn đầu lao dốc xuống chạm đáy trước các hãng nội địa',
    b1: 'Galaxy S5 (2014) với mặt lưng nhựa đục lỗ bị chê thiếu sang trọng ở phân khúc cao cấp',
    b2: 'Xiaomi, Huawei và OPPO tung vũ khí cấu hình cao giá mềm đánh chiếm phân khúc tầm trung',
    b3: 'Thị phần Samsung tại thị trường tỷ dân Trung Quốc bị đánh bật từ đỉnh xuống sát đáy',
    footer: 'Sức ép kép buộc Samsung phải lột xác hoàn toàn về ngôn ngữ thiết kế'
  },
  {
    num: 27, start: 592.90, end: 603.60, mode: 'WAY_A', broll: 'shot-27.mp4',
    beats: { top: 2.35, metric: 7.45, bot: 9.00 },
    title: 'NĂM 2015: ĐẠI PHẪU THIẾT KẾ VỚI GALAXY S6 & S6 EDGE',
    sub: 'Từ bỏ vỏ nhựa để trình làng smartphone màn hình kính cong tràn hai cạnh và khung kim loại đầu tiên',
    metric: 'KÍNH CONG 2 CẠNH', metricLabel: 'Galaxy S6 Edge (2015) lấy lại vị thế dẫn đầu về thiết kế công nghiệp',
    footer: 'Màn lột xác ngoạn mục về ngoại hình nhưng cũng mở đầu cho cuộc đua ép mỏng thân máy'
  },
  {
    num: 28, start: 603.60, end: 615.95, mode: 'MOTION', variant: 'fast_calendar',
    title: 'THÁNG 8/2016: VỘI VÃ TUNG GALAXY NOTE 7 ĐỂ ĐÈ BẸP IPHONE 7',
    sub: 'Tiếp đà hưng phấn, Samsung đẩy sớm lịch ra mắt và mở màn cho thảm họa lớn nhất lịch sử di động',
    leftTitle: 'RA SỚM THÁNG 08/2016', rightTitle: 'THẢM HỌA BÙNG PHÁT',
    footer: 'Sự nôn nóng muốn áp đảo đối thủ dẫn tới sai lầm kỹ thuật đắt giá nhất'
  },
  {
    num: 29, start: 615.95, end: 629.65, mode: 'MOTION', variant: 'battery_anatomy',
    title: 'GIẢI PHẪU VIÊN PIN 3.500 mAh BỊ ÉP QUÁ GIỚI HẠN VẬT LÝ',
    sub: 'Thân máy siêu mỏng đối xứng hai cạnh cong cùng khe bút S Pen làm cực âm và cực dương chạm nhau',
    leftTitle: 'KHUNG CONG + S PEN ÉP PIN', rightTitle: 'CHẠM CỰC GÂY ĐOẢN MẠCH',
    footer: 'Thiết kế pin vượt quá giới hạn an toàn vật lý bên trong khoang máy quá chật'
  },
  {
    num: 30, start: 629.65, end: 654.05, mode: 'WAY_B', broll: 'shot-30.mp4',
    beats: { top: 3.15, mid: 9.50, metric: 16.95, bot: 20.65 },
    title: 'THU HỒI ĐỢT 1 & VỤ CHÁY TRÊN CHUYẾN BAY SOUTHWEST AIRLINES',
    sub: 'Ngay cả lô máy thay thế dùng pin nhà cung cấp thứ hai vẫn bốc khói trên máy bay Mỹ',
    metric: 'LỖI KÉP CẢ 2 LÔ PIN', metricLabel: 'Máy đổi mới tiếp tục cháy trên chuyến bay Southwest Airlines',
    b1: 'Chỉ vài ngày sau mở bán, hàng loạt video Note 7 bốc khói và phát nổ xuất hiện',
    b2: 'Tháng 09/2016 thu hồi đợt 1 để đổi sang lô máy dùng pin của nhà cung cấp thứ hai',
    b3: 'Nhưng lô pin thứ hai lại dính lỗi hàn siêu âm & thiếu băng cách điện, cháy ngay trên máy bay',
    footer: 'Cơn ác mộng nhân đôi khi bản vá lỗi cũng phát nổ trước mắt công chúng'
  },
  {
    num: 31, start: 654.05, end: 661.30, mode: 'MOTION', variant: 'airport_gate',
    title: 'LỆNH CẤM MANG GALAXY NOTE 7 LÊN MÁY BAY TOÀN CẦU',
    sub: 'Các hãng hàng không khắp thế giới đồng loạt phát loa cấm tuyệt đối hành khách mang theo Note 7',
    leftTitle: 'PHÁT LOA CẤM TOÀN CẦU', rightTitle: 'CẤM BAY TUYỆT ĐỐI',
    footer: 'Đòn giáng nặng nề chưa từng có tiền lệ vào danh tiếng của tập đoàn Hàn Quốc'
  },
  {
    num: 32, start: 661.30, end: 674.02, mode: 'WAY_B', broll: 'shot-32.mp4',
    beats: { top: 3.20, mid: 7.05, metric: 10.95, bot: 11.40 },
    title: '11/10/2016: KHAI TỬ VĨNH VIỄN NOTE 7 & THIỆT HẠI 5,3 TỶ USD',
    sub: 'Thu hồi hơn 2,5 triệu máy chỉ sau chưa đầy 2 tháng ra mắt và cúi đầu nhận lỗi',
    metric: 'THIỆT HẠI 5,3 TỶ USD', metricLabel: 'Khai tử ngày 11/10/2016 • Thu hồi hơn 2,5 triệu thiết bị',
    newsSource: 'AP NEWS / REUTERS',
    newsHeadline: 'Samsung Permanently Discontinues Galaxy Note 7 Taking $5.3 Billion Hit',
    b1: 'Ngày 11/10/2016 tuyên bố dừng sản xuất và khai tử vĩnh viễn Galaxy Note 7',
    b2: 'Thu hồi hơn 2,5 triệu máy trên phạm vi toàn cầu chỉ sau chưa đầy 2 tháng',
    b3: 'Tổng thiệt hại trực tiếp lẫn gián tiếp ước tính lên tới khoảng 5,3 tỷ USD',
    footer: 'Quyết định cắt bỏ đau đớn nhất để cứu lấy uy tín sống còn của thương hiệu Galaxy'
  },
  {
    num: 33, start: 674.02, end: 694.15, mode: 'WAY_B', broll: 'shot-33.mp4',
    beats: { top: 3.55, metric: 6.45, mid: 12.10, bot: 17.50 },
    title: 'HIỆN TƯỢNG MẠNG: MOD BOM GTA 5 & SƯU TẦM NOTE 7',
    sub: 'Từ bản mod quả bom trong game GTA 5 đến những tin rao sưu tầm máy đã tháo pin tại Việt Nam',
    metric: 'MOD BOM GTA 5', metricLabel: 'Góc nhìn văn hóa đại chúng & giới sưu tầm sau sự cố Note 7',
    b1: 'Cộng đồng game thủ mod hình ảnh Galaxy Note 7 thành lựu đạn trong GTA 5 & San Andreas',
    b2: 'Nhiều người chơi công nghệ tại Việt Nam tìm mua xác máy Note 7 để làm kỷ niệm',
    b3: 'Các máy lưu hành sưu tầm đều được khuyến cáo tháo bỏ pin để đảm bảo an toàn',
    footer: 'Một sự cố kỹ thuật biến thành hiện tượng văn hóa đại chúng được nhắc lại nhiều năm'
  },
  {
    num: 34, start: 694.15, end: 704.45, mode: 'WAY_B', broll: 'shot-34.mp4',
    beats: { top: 5.45, mid: 6.40, metric: 7.50, bot: 8.70 },
    title: 'GALAXY NOTE FE (FAN EDITION): LỜI TRI ÂN KHẮC PHỤC SỰ CỐ',
    sub: 'Tái sử dụng linh kiện an toàn kèm viên pin mới 3.200 mAh đã qua kiểm định nghiêm ngặt',
    metric: 'NOTE FE (3.200 mAh)', metricLabel: 'Phiên bản Fan Edition an toàn dành cho người hâm mộ dòng Note',
    b1: 'Hạ dung lượng pin xuống mức an toàn 3.200 mAh trong khoang máy rộng rãi hơn',
    b2: 'Trải qua toàn bộ quy trình kiểm định an toàn 8 bước mới trước khi xuất xưởng',
    b3: 'Khép lại trọn vẹn chương buồn của Note 7 để chuẩn bị cho thế hệ tiếp theo',
    footer: 'Nỗ lực lắng nghe và hàn gắn niềm tin với cộng đồng người dùng trung thành'
  },

  // CHƯƠNG VI: TÍCH HỢP DỌC ĐỠ ĐẠN, KỶ NGUYÊN GẬP Z & S ULTRA (11:44.45 – 14:17.92)
  {
    num: 35, start: 704.45, end: 729.25, mode: 'MOTION', variant: 'shield_3pillars',
    title: 'CẤU TRÚC TÍCH HỢP DỌC ĐỠ ĐẠN CHO MẢNG DI ĐỘNG',
    sub: 'Lợi nhuận hàng chục tỷ USD từ Bán dẫn & Màn hình OLED giúp mảng điện thoại tái sinh từ tro tàn',
    leftTitle: 'NOKIA & BLACKBERRY SỤP ĐỔ', rightTitle: 'BÁN DẪN & OLED ĐỠ ĐẠN',
    footer: 'Sức mạnh độc nhất vô nhị giúp Samsung đứng vững sau cú sốc mất hơn 5 tỷ USD'
  },
  {
    num: 36, start: 729.25, end: 749.55, mode: 'WAY_B', broll: 'shot-36.mp4',
    beats: { top: 0.35, metric: 5.00, mid: 13.25, bot: 17.50 },
    title: 'THÁNG 1/2017: 700 KỸ SƯ, 200.000 MÁY & QUY TRÌNH PIN 8 BƯỚC',
    sub: 'Thẳng thắn nhận toàn bộ lỗi về mình và thiết lập chuẩn kiểm tra X-quang, đâm xuyên, tháo rời',
    metric: 'AN TOÀN PIN 8 BƯỚC', metricLabel: '700 kỹ sư điều tra trên 200.000 thiết bị và 30.000 viên pin',
    newsSource: 'FORBES / REUTERS',
    newsHeadline: 'Samsung Unveils 8-Point Battery Safety Check Following 700-Engineer Probe',
    b1: 'Công bố kết quả điều tra độc lập từ 700 kỹ sư và 200.000 thiết bị thử nghiệm',
    b2: 'Nhận toàn bộ trách nhiệm về thiết kế và sản xuất pin chứ không đổ lỗi cho người dùng',
    b3: 'Áp dụng quy trình kiểm tra pin 8 bước từ chụp X-quang đến thử nghiệm cực hạn',
    footer: 'Sự minh bạch tuyệt đối đã cứu vãn niềm tin của người tiêu dùng toàn cầu'
  },
  {
    num: 37, start: 749.55, end: 759.78, mode: 'WAY_A', broll: 'shot-37.mp4',
    beats: { top: 2.55, metric: 5.05, bot: 8.90 },
    title: 'NĂM 2017: GALAXY S8 & NOTE 8 THÀNH CÔNG VANG DỘI',
    sub: 'Màn hình vô cực Infinity Display xóa bỏ viền dày và đưa dòng flagship Galaxy trở lại đỉnh cao',
    metric: 'INFINITY DISPLAY', metricLabel: 'Galaxy S8 & Note 8 (2017) lấy lại trọn vẹn niềm tin thị trường',
    footer: 'Màn trở lại ngoạn mục ngay sau cuộc khủng hoảng lớn nhất lịch sử hãng'
  },
  {
    num: 38, start: 759.78, end: 794.50, mode: 'WAY_B', broll: 'shot-38.mp4',
    beats: { top: 10.75, mid: 21.70, metric: 28.90, bot: 32.50 },
    title: 'GALAXY FOLD 1 (2019): CÚ VẤP BẢN LỀ & 5 THÁNG GIA CỐ',
    sub: 'Ra mắt tháng 2/2019 với giá 1.980 USD, hoãn mở bán 5 tháng từ tháng 4 đến tháng 9/2019 để hoàn thiện',
    metric: 'HOÃN 5 THÁNG (2019)', metricLabel: 'Gia cố khe bản lề và lớp màng bảo vệ trước khi thương mại hóa',
    newsSource: 'THE GUARDIAN / THE VERGE',
    newsHeadline: 'Samsung Delays Galaxy Fold Launch to Reinforce Hinge and Screen Protection',
    b1: 'Tháng 02/2019 trình làng chiếc điện thoại gập Galaxy Fold đầu tiên giá 1.980 USD',
    b2: 'Tháng 04/2019 phát hiện sự cố khi reviewer bóc lớp màng bảo vệ hoặc bụi lọt khe bản lề',
    b3: 'Chấp nhận hoãn mở bán suốt 5 tháng để gia cố cấu trúc và bán ra lại tháng 09/2019',
    footer: 'Kiên trì mở đường cho chiến trường điện thoại màn hình gập hoàn toàn mới'
  },
  {
    num: 39, start: 794.50, end: 804.90, mode: 'WAY_A', broll: 'shot-39.mp4',
    beats: { top: 2.45, metric: 6.75, bot: 8.40 },
    title: 'GALAXY Z FLIP & Z FOLD: BIỂU TƯỢNG GẬP THỜI THƯỢNG',
    sub: 'Biến thiết kế gập vỏ sò và gập mở cánh bướm thành nhận diện mới của giới công nghệ',
    metric: 'Z FLIP & Z FOLD', metricLabel: 'Dẫn đầu phân khúc điện thoại màn hình gập toàn cầu',
    footer: 'Từ một ý tưởng bị hoài nghi trở thành dòng sản phẩm thương mại triệu bản'
  },
  {
    num: 40, start: 804.90, end: 826.40, mode: 'WAY_B', broll: 'shot-40.mp4',
    beats: { top: 2.90, mid: 12.35, metric: 14.30, bot: 18.80 },
    title: 'THÁNG 2/2022: GALAXY S22 ULTRA HỢP NHẤT DÒNG NOTE & DÒNG S',
    sub: 'Khép lại tên gọi Galaxy Note sau 11 năm nhưng đưa khung vuông và bút S Pen vào thân máy S Ultra',
    metric: 'S ULTRA + S PEN', metricLabel: 'Quyết định hợp nhất lịch sử vào tháng 02/2022 trên Galaxy S22 Ultra',
    newsSource: 'TECHTARGET / CNET',
    newsHeadline: 'Galaxy S22 Ultra Merges the Best of Galaxy Note S Pen and S Series Cameras',
    b1: 'Chính thức khép lại dòng tên Galaxy Note độc lập sau 11 năm (2011–2022)',
    b2: 'Đưa thiết kế vuông vức nam tính và khe chứa bút S Pen vào trong dòng S Ultra',
    b3: 'Tạo nên mẫu flagship hợp nhất thống lĩnh phân khúc điện thoại Android cao cấp',
    footer: 'Linh hồn của Galaxy Note tiếp tục sống mạnh mẽ bên trong dòng S Ultra'
  },
  {
    num: 41, start: 826.40, end: 842.05, mode: 'WAY_B', broll: 'shot-41.mp4',
    beats: { top: 1.70, mid: 7.20, metric: 9.05, bot: 13.00 },
    title: 'GÓC NHÌN THỰC TẾ S22 ULTRA: MÁY NGON NHƯNG DỄ BỊ SỌC MÀN HÌNH',
    sub: 'Trải nghiệm thực tế các đời màn hình cong: hiệu năng tốt nhưng tiềm ẩn rủi ro sọc dọc màn hình',
    metric: 'BỆNH SỌC MÀN CONG', metricLabel: 'Điểm trừ thực tế trên các thế hệ màn hình tràn viền cong',
    b1: 'Galaxy S22 Ultra cho trải nghiệm sử dụng, bút S Pen và hiệu năng rất ấn tượng',
    b2: 'Tuy nhiên thiết kế màn hình cong tràn cạnh dễ phát sinh lỗi sọc màn hình sau thời gian dài',
    b3: 'Nỗi ám ảnh chung của nhiều người dùng các đời flagship màn cong thời kỳ đó',
    footer: 'Nhìn nhận thẳng thắn cả ưu điểm lẫn hạn chế thực tế trong quá trình sử dụng'
  },
  {
    num: 42, start: 842.05, end: 857.92, mode: 'WAY_B', broll: 'shot-42.mp4',
    beats: { top: 1.40, metric: 2.75, mid: 4.45, bot: 12.15 },
    title: 'GALAXY S24 ULTRA: MÀN HÌNH PHẲNG 100% & ĐỈNH CAO CAMERA ZOOM',
    sub: 'Chuyển hẳn sang màn hình phẳng khắc phục lỗi sọc và khẳng định sức mạnh ống kính Tele',
    metric: 'MÀN PHẲNG 100%', metricLabel: 'Galaxy S24 Ultra tối ưu độ bền và khả năng quay chụp Zoom xa',
    b1: 'Từ thế hệ S24 Ultra chuyển sang thiết kế màn hình phẳng hoàn toàn 100%',
    b2: 'Hạn chế tối đa rủi ro sọc màn hình và giúp thao tác viết vẽ S Pen sát mép tốt hơn',
    b3: 'Hệ thống camera zoom quang học xa vẫn giữ lợi thế vượt trội trên thị trường',
    footer: 'Sự lắng nghe người dùng để hoàn thiện độ bền thực tế cho dòng Ultra'
  },

  // CHƯƠNG VII: ĐẠI SẢNH TIẾN HÓA 9 CỘT MỐC PHẦN CỨNG (14:17.92 – 15:50.35)
  {
    num: 43, start: 857.92, end: 889.30, mode: 'MOTION', variant: 'museum_3pedestals',
    title: 'ĐẠI SẢNH TIẾN HÓA PHẦN CỨNG (PHẦN 1): ĐIỆN TỬ & BÁN DẪN',
    sub: '3 cột mốc đầu tiên bẻ lái lịch sử: TV P-3202 (1970), DRAM 64K (1983) và DRAM 64Mb (1992)',
    leftTitle: '1970: TV P-3202', rightTitle: '1992: VUA DRAM 64Mb',
    footer: 'Từ bước chân đầu tiên vào mạch điện tử đến ngôi vương bộ nhớ toàn cầu'
  },
  {
    num: 44, start: 889.30, end: 925.20, mode: 'MOTION', variant: 'museum_4pedestals',
    title: 'ĐẠI SẢNH TIẾN HÓA PHẦN CỨNG (PHẦN 2): ĐẾ CHẾ DI ĐỘNG',
    sub: 'SGH-T100 (2002), Galaxy S / S3 & S4 (2010–2013), Galaxy Note 1 (2011) và Galaxy S6 Edge (2015)',
    leftTitle: '2002: SGH-T100', rightTitle: '2015: S6 EDGE CONG',
    footer: '4 cột mốc đưa Samsung từ kẻ thách thức lên ngai vàng thiết kế và doanh số smartphone'
  },
  {
    num: 45, start: 925.20, end: 950.35, mode: 'MOTION', variant: 'split_4quad',
    title: 'ĐẠI SẢNH TIẾN HÓA (PHẦN 3): TỪ BÀI HỌC NOTE 7 ĐẾN KỶ NGUYÊN GẬP & ULTRA',
    sub: 'Chuẩn an toàn Pin 8 bước sau Note 7 (2016), mở đường gập Galaxy Fold (2019) và hợp nhất S22 Ultra (2022)',
    leftTitle: 'CHUẨN AN TOÀN PIN 8 BƯỚC', rightTitle: 'FOLD & S ULTRA HỢP NHẤT',
    footer: 'Định hình hoàn chỉnh chân dung phần cứng Samsung trước cơn sóng thần Trí tuệ nhân tạo'
  },

  // CHƯƠNG VIII: CÚ SỐC HBM, TỔNG PHẢN CÔNG 2025–2026 & BẢN SẮC CHIẾN BINH (15:50.35 – 18:33.73)
  {
    num: 46, start: 950.35, end: 987.70, mode: 'MOTION', variant: 'hbm_chip_stack',
    title: 'CÚ GIẬT MÌNH KỶ NGUYÊN AI: CHẬM NHỊP HBM TRƯỚC SK HYNIX',
    sub: 'Ông vua 30 năm chip nhớ bất ngờ bị SK Hynix vượt mặt ở mảng HBM3E cho GPU AI Nvidia (2023–2025)',
    leftTitle: 'SK HYNIX DẪN TRƯỚC HBM', rightTitle: 'SAMSUNG CHẬM KIỂM ĐỊNH',
    footer: 'Vòng lặp lịch sử giữa đỉnh cao kiêu hãnh và những cú giật mình tỉnh giấc'
  },
  {
    num: 47, start: 987.70, end: 1003.25, mode: 'WAY_B', broll: 'shot-47.mp4',
    beats: { metric: 0.25, top: 2.20, mid: 6.30, bot: 10.85 },
    title: 'THÁNG 10/2024: TÂM THƯ XIN LỖI CÔNG KHAI CỦA LÃNH ĐẠO BÁN DẪN',
    sub: 'Phó Chủ tịch Jun Young-hyun thẳng thắn nhận trách nhiệm trước cổ đông, khách hàng và nhân viên',
    metric: 'THÁNG 10 / 2024', metricLabel: 'Tâm thư nhận trách nhiệm của tân lãnh đạo mảng bán dẫn Jun Young-hyun',
    newsSource: 'VNEXPRESS INTL / REUTERS',
    newsHeadline: 'Samsung Chip Chief Apologizes to Investors Over AI Memory Crisis and Delays',
    b1: 'Ông Jun Young-hyun gửi bức tâm thư xin lỗi công khai hiếm hoi vào tháng 10/2024',
    b2: 'Khẳng định mọi trách nhiệm thuộc về ban lãnh đạo chứ không đổ cho hoàn cảnh',
    b3: 'Cam kết khôi phục sức cạnh tranh công nghệ cốt lõi bằng tinh thần quyết liệt nhất',
    footer: 'Nhiều người đang nói về khủng hoảng của Samsung, và trách nhiệm thuộc về chúng tôi'
  },
  {
    num: 48, start: 1003.25, end: 1019.65, mode: 'MOTION', variant: 'patent_scale',
    title: 'QUÝ 1/2025: SK HYNIX TẠM VƯỢT LÊN SỐ 1 DOANH THU DRAM (36% VS 34,4%)',
    sub: 'Lần đầu tiên sau hơn 3 thập kỷ kể từ năm 1992, Samsung tạm mất ngôi đầu DRAM theo Omdia & Counterpoint',
    leftTitle: 'SK HYNIX: 36,0% (Q1/2025)', rightTitle: 'SAMSUNG: 34,4% (Q1/2025)',
    footer: 'Đỉnh điểm của sức ép buộc Samsung phải phát động cuộc tổng phản công 2025–2026'
  },
  {
    num: 49, start: 1019.65, end: 1051.50, mode: 'MOTION', variant: 'chart_2025_2026',
    title: 'CUỘC TỔNG PHẢN CÔNG 2025–2026: GIÀNH LẠI NGÔI ĐẦU 38% DRAM',
    sub: 'Dưới mô hình Đồng CEO, Samsung vươn lên 38% DRAM (Q2/2026), tăng tốc HBM3E 12H, HBM4 và đúc 2nm cho Tesla',
    leftTitle: 'ĐỒNG CEO PHẢN CÔNG', rightTitle: '38% DRAM (Q2/2026)',
    footer: 'Dồn toàn lực cải tổ thiết kế chip nhớ AI và tiến trình đúc bán dẫn 2 nanomet'
  },
  {
    num: 50, start: 1051.50, end: 1062.30, mode: 'WAY_B', broll: 'shot-50.mp4',
    beats: { top: 0.15, metric: 2.65, mid: 5.05, bot: 7.60 },
    title: 'MẶT TRẬN DI ĐỘNG 2026: GALAXY S26 SERIES, Z TRIFOLD & GALAXY AI',
    sub: 'Biến hệ sinh thái trí tuệ nhân tạo Galaxy AI và tham vọng gập ba Z TriFold thành vũ khí cốt lõi',
    metric: 'S26 & Z TRIFOLD', metricLabel: 'Đưa Galaxy AI thành vũ khí trung tâm trên thế hệ 2025–2026',
    b1: 'Từ thế hệ Galaxy S24, S25 đến Galaxy S26 Series ra mắt đầu năm 2026',
    b2: 'Trình diễn công nghệ gập ba cánh Galaxy Z TriFold khẳng định vị thế tiên phong màn hình',
    b3: 'Tích hợp sâu hệ sinh thái Galaxy AI làm đòn bẩy giữ vững thị phần cao cấp',
    footer: 'Kết hợp sức mạnh phần cứng màn hình gập với trí tuệ nhân tạo trên thiết bị'
  },
  {
    num: 51, start: 1062.30, end: 1068.10, mode: 'MOTION', variant: 'balance_scale',
    title: 'CUỘC ĐUA SONG MÃ SÁT NÚT 19% – 20% VỚI APPLE',
    sub: 'Giữ vững thế cân bằng chiến lược quanh mốc 19–20% thị phần smartphone toàn cầu',
    leftTitle: 'SAMSUNG: 19% – 20%', rightTitle: 'APPLE: 19% – 20%',
    footer: 'Hai siêu cường công nghệ chia sẻ ngôi đầu thị trường điện thoại thế giới'
  },
  {
    num: 52, start: 1068.10, end: 1083.25, mode: 'MOTION', variant: 'duopoly_columns',
    title: 'NHÌN LẠI 88 NĂM (1938 – 2026): SAMSUNG THẬT SỰ LÀ AI?',
    sub: 'Từ tiệm cá khô 30.000 Won ở Daegu đến đế chế nắm giữ từ màn hình trong iPhone tới chip nhớ AI',
    leftTitle: '1938: TIỆM CÁ KHÔ', rightTitle: '2026: YẾT HẦU CÔNG NGHỆ',
    footer: 'Hành trình gần 90 năm định hình nên bản sắc độc nhất của tập đoàn Hàn Quốc'
  },
  {
    num: 53, start: 1083.25, end: 1108.75, mode: 'MOTION', variant: 'garden_vs_forge',
    title: 'NGHỆ SĨ KHU VƯỜN ĐÓNG KÍN VS CHIẾN BINH CÔNG NGHIỆP LÌ LỢM',
    sub: 'Nắm trọn chuỗi thức ăn công nghệ từ hạt cát silicon đến thiết bị cuối cùng để tự đập đi xây lại',
    leftTitle: 'APPLE: NGHỆ SĨ TOÀN CẦU — TRAU CHUỐT KHU VƯỜN ĐÓNG KÍN',
    rightTitle: 'SAMSUNG: CHIẾN BINH CÔNG NGHIỆP TỰ CHỦ TỪ CÁT SILICON',
    footer: 'Không ngại thử sai, dám tự đốt sản phẩm lỗi để không ai trên thế giới có thể sống thiếu họ'
  },
  {
    num: 54, start: 1108.75, end: 1113.73, mode: 'MOTION', variant: 'dark_green_cta',
    title: 'CẢM ƠN & HẸN GẶP LẠI Ở NHỮNG VIDEO TIẾP THEO!',
    sub: 'Khép lại hành trình 88 năm đầy bão tố của Samsung Electronics (1938 – 2026)',
    leftTitle: 'CẢM ƠN BẠN ĐÃ XEM', rightTitle: 'HẸN GẶP LẠI',
    footer: 'Đừng quên để lại bình luận chia sẻ suy nghĩ của bạn và đăng ký kênh nhé!'
  }
];

// ============================================================================
// GENERATE ALL 54 SCENE COMPOSITIONS + ROOT INDEX.HTML WITH VOICE-SYNCED SFX
// ============================================================================
const TOTAL_DUR = 1113.73;
console.log('Generating 54 exact Storyboard-aligned compositions with bespoke SVG illustrations & voice-locked SFX...');

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

const SFX_SPEC_MAP = {
  whoosh: { file: 'whoosh-short', dur: 0.36, vol: 0.09 },
  Swipe:  { file: 'whoosh-short', dur: 0.32, vol: 0.08 },
  pop:    { file: 'pop',          dur: 0.24, vol: 0.16 },
  click:  { file: 'click-soft',   dur: 0.20, vol: 0.16 },
  tap:    { file: 'key-press',    dur: 0.20, vol: 0.42 },
  ding:   { file: 'chime',        dur: 0.50, vol: 0.22 },
  ping:   { file: 'ping',         dur: 0.45, vol: 0.24 },
  cash:   { file: 'ping',         dur: 0.45, vol: 0.24 },
  slam:   { file: 'thump',        dur: 0.24, vol: 0.07 },
  Boing:  { file: 'click-soft',   dur: 0.22, vol: 0.15 }
};

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
    <title>Tất Tần Tật Về Samsung (1938–2026) | Documentary 16:9</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { width: 1920px; height: 1080px; overflow: hidden; background: #EFE9D9; }
      #root { position: relative; width: 1920px; height: 1080px; overflow: hidden; background: #EFE9D9; }
      .clip { position: absolute; inset: 0; width: 100%; height: 100%; }
    </style>
  </head>
  <body>
    <div
      id="root"
      data-composition-id="main"
      data-width="1920"
      data-height="1080"
      data-fps="60"
      data-duration="${TOTAL_DUR}"
      data-composition-variables='${varsJsonAttr}'
    >
      <!-- Track 0: 54 Visual Documentary Scenes -->
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
console.log(`Successfully generated 54 scenes, ${VARIABLES.length} Studio variables, and ${sfxClipsHtml.length} voice-locked SFX clips!`);
