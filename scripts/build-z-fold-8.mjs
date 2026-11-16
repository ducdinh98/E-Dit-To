import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'videos/z-fold-8';
const COMP_DIR = join(OUT, 'compositions');
mkdirSync(COMP_DIR, { recursive: true });

const sfxManifest = JSON.parse(readFileSync(join(OUT, 'assets/sfx/manifest.json'), 'utf8'));

// =========================================================================
// Shared Inline SVG Icon Helpers (Editorial Neo-Brutalist, Rounded Strokes)
// Zero emojis used anywhere. Zero 0px square corners.
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
  flame: (sz = 34) =>
    `<svg width="${sz}" height="${sz}" viewBox="0 0 36 36" fill="none"><path d="M19 3C19 3 27 10 27 19C27 25 22.5 31 16 31C9.5 31 6 26 6 20C6 15 9.5 11 12 9C11.5 12.5 13.5 15 15.5 15C14 11 15.5 6.5 19 3Z" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3" stroke-linejoin="round"/><path d="M17.5 19C17.5 19 21 22 21 25C21 27.5 19 29.5 16.5 29.5C14 29.5 12.5 27.5 12.5 25C12.5 22.5 15 20.5 17.5 19Z" fill="#F5C518" stroke="#0F0F0F" stroke-width="2"/></svg>`,
  bolt: (sz = 34) =>
    `<svg width="${sz}" height="${sz}" viewBox="0 0 36 36" fill="none"><path d="M20 3L8 20H17L15 33L28 15H19L20 3Z" fill="#F5C518" stroke="#0F0F0F" stroke-width="3" stroke-linejoin="round"/></svg>`,
  shield: (sz = 44) =>
    `<svg width="${sz}" height="${sz}" viewBox="0 0 44 44" fill="none"><path d="M22 4L38 10V22C38 31.5 30.8 38.6 22 41C13.2 38.6 6 31.5 6 22V10L22 4Z" fill="#136636" stroke="#0F0F0F" stroke-width="3.5" stroke-linejoin="round"/><path d="M14.5 22.5L20 28L30 17" stroke="#F5C518" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  arrowDown: (sz = 36) =>
    `<svg width="${sz}" height="${sz}" viewBox="0 0 36 36" fill="none"><path d="M18 5V27M18 27L9 18M18 27L27 18" stroke="#0F0F0F" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  crown: (sz = 48) =>
    `<svg width="${sz}" height="${sz}" viewBox="0 0 48 48" fill="none"><path d="M6 34L10 13L18.5 22L24 10L29.5 22L38 13L42 34H6Z" fill="#F5C518" stroke="#0F0F0F" stroke-width="3.5" stroke-linejoin="round"/><rect x="8" y="34" width="32" height="7" rx="3.5" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3"/></svg>`,
};

// =========================================================================
// Shared Stylesheet Across Every Sub-Composition
// Mandatory Rules Enforced:
//  - Safe Zone: Upper x:128..952 y:176..830; Lower x:128..752 y:854..1424
//  - Rounded 4 corners everywhere (12..22px, pill 999px)
//  - Zero CSS transform on gsap.to/fromTo targets (rotated tags wrapped cleanly)
// =========================================================================
const BASE_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 100%; height: 100%; overflow: hidden; background: transparent; }
  #root {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    font-family: 'Be Vietnam Pro', 'Inter', sans-serif;
    color: var(--ink, #0F0F0F);
  }
  .ground-cream {
    position: absolute;
    inset: 0;
    background: var(--paper, #EFE9D9);
  }
  .ground-green {
    position: absolute;
    inset: 0;
    background: #136636;
  }
  .subtle-grid {
    position: absolute;
    left: 128px;
    top: 176px;
    width: 824px;
    height: 1248px;
    background-image: radial-gradient(rgba(15, 15, 15, 0.14) 2px, transparent 2px);
    background-size: 32px 32px;
    border-radius: 22px;
    pointer-events: none;
    clip-path: polygon(0 0, 100% 0, 100% 53%, 76% 53%, 76% 100%, 0 100%);
  }
  .subtle-grid-green {
    position: absolute;
    left: 128px;
    top: 176px;
    width: 824px;
    height: 1248px;
    background-image: radial-gradient(rgba(239, 233, 217, 0.16) 2px, transparent 2px);
    background-size: 32px 32px;
    border-radius: 22px;
    pointer-events: none;
    clip-path: polygon(0 0, 100% 0, 100% 53%, 76% 53%, 76% 100%, 0 100%);
  }

  /* Inverted-L Safe Zone Containers */
  .sz-upper {
    position: absolute;
    left: 128px;
    top: 176px;
    width: 824px;
    height: 648px;
  }
  .sz-lower {
    position: absolute;
    left: 128px;
    top: 854px;
    width: 624px;
    height: 570px;
  }

  /* Editorial Neo-Brutalist Typography */
  .cm-head {
    font-family: 'Be Vietnam Pro', sans-serif;
    font-weight: 900;
    line-height: 1.15;
    letter-spacing: -0.02em;
    text-transform: uppercase;
  }
  .cm-sub {
    font-family: 'Be Vietnam Pro', 'Inter', sans-serif;
    font-weight: 700;
    line-height: 1.32;
  }
  .cm-mono {
    font-family: 'JetBrains Mono', 'Be Vietnam Pro', monospace;
    font-weight: 800;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }

  /* Pills & Kicker Tags (999px) */
  .cm-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #0F0F0F;
    color: #EFE9D9;
    border: 4px solid #0F0F0F;
    border-radius: 999px;
    padding: 8px 18px;
    font-family: 'JetBrains Mono', 'Be Vietnam Pro', monospace;
    font-weight: 800;
    font-size: 17px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    align-self: flex-start;
  }
  .cm-pill-yellow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #F5C518;
    color: #0F0F0F;
    border: 4px solid #0F0F0F;
    border-radius: 999px;
    padding: 7px 16px;
    font-family: 'JetBrains Mono', 'Be Vietnam Pro', monospace;
    font-weight: 800;
    font-size: 16px;
    text-transform: uppercase;
  }
  .cm-pill-green {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #136636;
    color: #EFE9D9;
    border: 4px solid #0F0F0F;
    border-radius: 999px;
    padding: 7px 16px;
    font-family: 'JetBrains Mono', 'Be Vietnam Pro', monospace;
    font-weight: 800;
    font-size: 16px;
    text-transform: uppercase;
  }
  .cm-pill-pink {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #F06CA8;
    color: #0F0F0F;
    border: 4px solid #0F0F0F;
    border-radius: 999px;
    padding: 7px 16px;
    font-family: 'JetBrains Mono', 'Be Vietnam Pro', monospace;
    font-weight: 800;
    font-size: 16px;
    text-transform: uppercase;
  }

  /* Rounded 4 Corners Card Surfaces (ZERO 0px corners) */
  .cm-card {
    background: #EFE9D9;
    border: 5px solid #0F0F0F;
    border-radius: 20px;
  }
  .cm-card-alt {
    background: #E4DCC4;
    border: 5px solid #0F0F0F;
    border-radius: 20px;
  }
  .cm-card-orange {
    background: #E85A1F;
    color: #0F0F0F;
    border: 5px solid #0F0F0F;
    border-radius: 20px;
  }
  .cm-card-yellow {
    background: #F5C518;
    color: #0F0F0F;
    border: 5px solid #0F0F0F;
    border-radius: 20px;
  }
  .cm-card-green {
    background: #136636;
    color: #EFE9D9;
    border: 5px solid #0F0F0F;
    border-radius: 20px;
  }
  .cm-card-pink {
    background: #F06CA8;
    color: #0F0F0F;
    border: 5px solid #0F0F0F;
    border-radius: 20px;
  }
  .cm-card-sm {
    border: 4px solid #0F0F0F;
    border-radius: 14px;
  }

  /* Hard Offset Shadows (Featured Orange max 1 per scene) */
  .cm-shadow-featured {
    box-shadow: 10px 10px 0 #E85A1F, 10px 10px 0 4px #0F0F0F;
  }
  .cm-shadow-ink {
    box-shadow: 8px 8px 0 #0F0F0F;
  }
  .cm-shadow-yellow {
    box-shadow: 10px 10px 0 #F5C518, 10px 10px 0 4px #0F0F0F;
  }

  /* Rotated Seals (ALWAYS put on child inside non-rotated GSAP wrapper!) */
  .cm-rot-neg3 { transform: rotate(-3deg); border-radius: 14px; }
  .cm-rot-pos3 { transform: rotate(3deg); border-radius: 14px; }

  /* Anti-Crop Hero Way B Portrait Video Window (22px radius, pure 9:16 video viewport) */
  .cm-wayb-win {
    background: #0F0F0F;
    border: 5px solid #0F0F0F;
    border-radius: 22px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .cm-video-viewport {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #0F0F0F;
    position: relative;
  }
  .cm-video-viewport video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

// Build HTML sub-composition file
function wrapScene(id, bodyHtml, extraCss, scriptBody) {
  return `<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <title>${id}</title>
  </head>
  <body>
    <template>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@500;600;700;800;900&family=Inter:wght@500;700;800;900&family=JetBrains+Mono:wght@600;700;800&display=swap" />
      <style>
${BASE_CSS}
${extraCss}
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

// Track studio variables cleanly (JSON array contract for HyperFrames Studio)
const VARIABLES = [];
function regVar(key, title, defVal) {
  VARIABLES.push({ id: key, type: 'string', label: title, default: defVal });
  return `data-var-text="${key}"`;
}

// Way B Pure Hero Rounded Video Window Builder (exact 9:16 zero crop)
function waybWinHtml(winId, vidId, brollFile, dur, styleAttr, shadowClass = 'cm-shadow-featured') {
  return `
  <div id="${winId}" class="cm-wayb-win ${shadowClass}" style="${styleAttr}">
    <div class="cm-video-viewport">
      <video id="${vidId}" src="assets/${brollFile}" muted playsinline data-start="0" data-duration="${dur}"></video>
    </div>
  </div>`;
}

// =========================================================================
// SCENE DEFINITIONS (17 Active Scenes + 2 Pass-Through Beats = 100.23s)
// =========================================================================
const scenes = [];

// -------------------------------------------------------------------------
// SCENE 01 [0.00 -> 4.23] Way B HERO (600x1066 = exact 9:16 zero crop!)
// Arch 8: Semicircular Rating Gauge + Pointer Orbiting Hero B-Roll
// -------------------------------------------------------------------------
scenes.push({
  id: 'scene-01',
  start: 0.00,
  duration: 4.23,
  sfx: [
    [0.05, 'whoosh-short'],
    [1.00, 'ping'],
    [2.56, 'error'],
    [3.35, 'thump'],
  ],
  build() {
    const kKicker = regVar('s01_kicker', '01 • Nhãn mở đầu', 'CHẤM ĐIỂM THẬT');
    const kTitle = regVar('s01_title', '01 • Tên máy', 'GALAXY Z FOLD 8');
    const kGood = regVar('s01_good', '01 • Nhận định đầu', 'ĐIỆN THOẠI GẬP TỐT');
    const kBut = regVar('s01_but', '01 • Kết câu hook', 'NHƯNG KHÔNG PHẢI HOÀN HẢO NHẤT');

    const body = `
      <div class="ground-cream"></div>
      <div class="subtle-grid"></div>
      <!-- Top Slim Strip above Hero B-Roll: x:128..952, y:172..224 -->
      <div id="s1-top" style="position:absolute;left:128px;top:172px;width:824px;height:52px;display:flex;align-items:center;justify-content:space-between;gap:12px;">
        <div id="s1-kicker" class="cm-kicker" style="padding:6px 16px;font-size:15px;" ${kKicker}>CHẤM ĐIỂM THẬT</div>
        <div id="s1-title" class="cm-head" style="font-size:32px;color:#0F0F0F;" ${kTitle}>GALAXY Z FOLD 8</div>
        <div id="s1-good-pill" class="cm-pill-green" style="font-size:14px;padding:6px 14px;" ${kGood}>ĐIỆN THOẠI GẬP TỐT</div>
      </div>

      <!-- Giant Hero B-Roll Portrait Frame: 600x1066 (9:16 0% crop, x:128..728, y:238..1304) -->
      ${waybWinHtml(
        's1-win', 's1-vid', 'broll-s01.mp4', 4.23,
        'position:absolute;left:128px;top:238px;width:600px;height:1066px;',
        'cm-shadow-featured'
      )}

      <!-- Right Upper Orbit Column: x:746..952 (w=206), y:238..832 (h=594) -->
      <div id="s1-side" style="position:absolute;left:746px;top:238px;width:206px;height:594px;display:flex;flex-direction:column;justify-content:space-between;gap:12px;">
        <div id="s1-gauge-wrap" class="cm-card-alt cm-shadow-ink" style="padding:14px 12px;display:flex;flex-direction:column;align-items:center;gap:8px;">
          <div class="cm-mono" style="font-size:13px;">ĐÁNH GIÁ TỔNG</div>
          <svg width="174" height="122" viewBox="0 0 220 156" fill="none">
            <path d="M 24 134 A 86 86 0 0 1 196 134" stroke="#D3CBB4" stroke-width="20" stroke-linecap="round" fill="none"/>
            <path id="s1-arc-green" d="M 24 134 A 86 86 0 0 1 196 134" stroke="#1F8A4C" stroke-width="20" stroke-linecap="round" fill="none" stroke-dasharray="270.2" stroke-dashoffset="270.2"/>
            <path id="s1-arc-gap" d="M 177 74 A 86 86 0 0 1 196 134" stroke="#F06CA8" stroke-width="20" stroke-linecap="round" fill="none" opacity="0" stroke-dasharray="8 8"/>
            <rect x="64" y="88" width="92" height="48" rx="12" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
            <text x="110" y="121" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-weight="900" font-size="28" fill="#0F0F0F">88%</text>
          </svg>
          <div class="cm-mono" style="font-size:12px;color:#136636;text-align:center;">MỎNG • MÀN • BỀN ✓</div>
        </div>

        <!-- SVG Pointer Arrow Aimed Straight At Hero Phone -->
        <div id="s1-ptr" style="display:flex;align-items:center;justify-content:center;gap:6px;padding:6px 0;">
          <svg width="188" height="48" viewBox="0 0 188 48" fill="none">
            <path d="M 176 24 H 16 M 16 24 L 36 10 M 16 24 L 36 38" stroke="#E85A1F" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <div id="s1-warn-row" class="cm-card-pink cm-shadow-ink" style="padding:14px 12px;display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;">
          ${ICO.warn(32)}
          <div class="cm-head" style="font-size:19px;">CÒN 12% ĐIỂM TRỪ</div>
          <div class="cm-mono" style="font-size:12px;">PIN • APP • TELE</div>
        </div>
      </div>

      <!-- Bottom Slim Punchline Strip: x:128..752 (w=624), y:1320..1424 (h=104) -->
      <div id="s1-but-wrap" style="position:absolute;left:128px;top:1320px;width:624px;height:104px;background:#0F0F0F;border:5px solid #0F0F0F;border-radius:18px;box-shadow:8px 8px 0 #136636;padding:12px 20px;display:flex;align-items:center;justify-content:center;gap:12px;">
        ${ICO.warn(32)}
        <div class="cm-head" style="font-size:25px;color:#F5C518;text-align:center;" ${kBut}>NHƯNG KHÔNG PHẢI HOÀN HẢO NHẤT</div>
      </div>`;

    const js = `
      tl.fromTo("#s1-win", { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.42, ease: "back.out(1.15)" }, 0.00);
      tl.fromTo("#s1-kicker", { y: -14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.38 }, 0.12);
      tl.fromTo("#s1-title", { y: -14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42 }, 0.25);
      tl.fromTo("#s1-arc-green", { attr: { "stroke-dashoffset": 270.2 } }, { attr: { "stroke-dashoffset": 34 }, duration: 0.90, ease: "power2.out" }, 0.95);
      tl.fromTo("#s1-good-pill", { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.40, ease: "back.out(1.3)" }, 1.45);
      tl.fromTo("#s1-ptr", { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.40, ease: "power3.out" }, 1.75);
      tl.fromTo("#s1-arc-gap", { opacity: 0 }, { opacity: 1, duration: 0.35 }, 2.52);
      tl.fromTo("#s1-warn-row", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.44, ease: "back.out(1.3)" }, 2.60);
      tl.fromTo("#s1-but-wrap", { y: 24, scale: 0.92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.48, ease: "back.out(1.4)" }, 3.35);
    `;
    return wrapScene(this.id, body, '', js);
  },
});

// -------------------------------------------------------------------------
// SCENE 02 [4.23 -> 9.20] Way A Full-Bleed B-roll (Top-down Z Fold 8 vs iPhone Duo)
// Safe Open Zones: Top y:176..435; Bottom-Left x:128..752 y:1090..1420 (empty black mat!)
// Arch 11: Balance Beam Seesaw & Dashed SVG Pointer toward iPhone Duo
// -------------------------------------------------------------------------
scenes.push({
  id: 'scene-02',
  start: 4.23,
  duration: 4.97,
  sfx: [
    [0.20, 'whoosh-short'],
    [2.20, 'ping'],
    [2.85, 'thump'],
    [3.95, 'error'],
    [4.28, 'pop'],
  ],
  build() {
    const kVs = regVar('s02_vs', '02 • Đối đầu', 'Z FOLD 8 VS iPHONE DUO');
    const kFail = regVar('s02_fail', '02 • Nhận định đối thủ', 'TỰ ĐÁ VÀO CHÂN');
    const kBugs = regVar('s02_bugs', '02 • Nhãn lỗi', 'HÀNG LOẠT LỖI!');

    const body = `
      <!-- Top Open Strip (Keyboard zone y:176..430): Balance Seesaw Comparison -->
      <div id="s2-top" class="cm-card cm-shadow-ink" style="position:absolute;left:128px;top:176px;width:824px;padding:18px 24px;display:flex;flex-direction:column;gap:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="cm-kicker">BÀN CÂN ĐỐI THỦ DUY NHẤT</div>
          <div class="cm-pill-yellow" ${kVs}>Z FOLD 8 VS iPHONE DUO</div>
        </div>
        <svg width="772" height="126" viewBox="0 0 772 126" fill="none">
          <!-- Fulcrum triangle -->
          <path d="M386 72 L364 114 H408 Z" fill="#0F0F0F" stroke="#0F0F0F" stroke-width="4" stroke-linejoin="round"/>
          <!-- Seesaw group pivots cleanly at bottom-tipping moment -->
          <g id="s2-beam">
            <rect x="44" y="64" width="684" height="14" rx="7" fill="#0F0F0F"/>
            <!-- Left green card -->
            <rect x="20" y="12" width="286" height="48" rx="14" fill="#136636" stroke="#0F0F0F" stroke-width="4"/>
            <text x="163" y="44" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-weight="900" font-size="19" fill="#EFE9D9">Z FOLD 8: ỔN ĐỊNH ✓</text>
            <!-- Right pink card -->
            <rect x="466" y="12" width="286" height="48" rx="14" fill="#F06CA8" stroke="#0F0F0F" stroke-width="4"/>
            <text x="609" y="44" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-weight="900" font-size="19" fill="#0F0F0F">iPHONE DUO: TỤT DỐC</text>
          </g>
        </svg>
      </div>

      <!-- Dashed SVG Pointer Arrow from Lower-Left upward to empty edge below iPhone Duo (y:990..1160) -->
      <svg style="position:absolute;left:128px;top:970px;width:624px;height:160px;pointer-events:none;overflow:visible;" viewBox="0 0 624 160" fill="none">
        <defs>
          <clipPath id="s2-clip"><rect id="s2-clip-rect" x="0" y="160" width="624" height="0"/></clipPath>
        </defs>
        <path clip-path="url(#s2-clip)" d="M 320 140 Q 470 115 510 22" stroke="#E85A1F" stroke-width="7" stroke-linecap="round" stroke-dasharray="14 10"/>
        <path id="s2-arrow-head" d="M 490 36 L 512 16 L 524 44" stroke="#E85A1F" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0"/>
      </svg>

      <!-- Bottom-Left Open Mat Zone (y:1110..1420, strictly left of x:752!) -->
      <div id="s2-bot" style="position:absolute;left:128px;top:1100px;width:624px;display:flex;flex-direction:column;gap:14px;">
        <div id="s2-fail-card" class="cm-card-orange cm-shadow-featured" style="padding:18px 22px;display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:14px;">
            ${ICO.warn(38)}
            <div>
              <div class="cm-mono" style="font-size:15px;color:#0F0F0F;">SỰ CỐ ĐỐI THỦ DUY NHẤT</div>
              <div class="cm-head" style="font-size:32px;color:#0F0F0F;" ${kFail}>TỰ ĐÁ VÀO CHÂN</div>
            </div>
          </div>
          <div class="cm-pill-pink" ${kBugs}>HÀNG LOẠT LỖI!</div>
        </div>

        <div style="display:flex;gap:12px;">
          <div id="s2-e1" class="cm-card-pink cm-shadow-ink" style="flex:1;padding:12px 14px;display:flex;align-items:center;gap:8px;border-radius:14px;">
            ${ICO.cross('#EFE9D9', 24)}
            <span class="cm-mono" style="font-size:16px;">LỖI PHẦN MỀM</span>
          </div>
          <div id="s2-e2" class="cm-card-yellow cm-shadow-ink" style="flex:1;padding:12px 14px;display:flex;align-items:center;gap:8px;border-radius:14px;">
            ${ICO.warn(24)}
            <span class="cm-mono" style="font-size:16px;">NẾP GẤP / BẢN LỀ</span>
          </div>
        </div>
      </div>`;

    const js = `
      tl.fromTo("#s2-top", { y: -36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 0.15);
      tl.fromTo("#s2-beam", { rotation: 0, transformOrigin: "386px 71px" }, { rotation: 7.5, duration: 0.65, ease: "back.out(1.4)" }, 2.20);
      tl.fromTo("#s2-clip-rect", { attr: { y: 160, height: 0 } }, { attr: { y: 0, height: 160 }, duration: 0.55, ease: "power2.out" }, 2.20);
      tl.fromTo("#s2-arrow-head", { opacity: 0 }, { opacity: 1, duration: 0.25 }, 2.65);
      tl.fromTo("#s2-fail-card", { y: 34, scale: 0.90, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.50, ease: "back.out(1.3)" }, 2.85);
      tl.fromTo("#s2-e1", { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42, ease: "back.out(1.3)" }, 3.95);
      tl.fromTo("#s2-e2", { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42, ease: "back.out(1.3)" }, 4.25);
    `;
    return wrapScene(this.id, body, '', js);
  },
});

// -------------------------------------------------------------------------
// SCENE 03 [9.20 -> 12.93] 100% Full Motion (#EFE9D9)
// Arch 10: Diverging Trend Curve + Rising Podium Rating Bars
// -------------------------------------------------------------------------
scenes.push({
  id: 'scene-03',
  start: 9.20,
  duration: 3.73,
  sfx: [
    [0.15, 'whoosh-short'],
    [1.15, 'ping'],
    [2.05, 'chime'],
  ],
  build() {
    const kKicker = regVar('s03_kicker', '03 • Nhãn xu hướng', 'PHẢN HỒI THỊ TRƯỜNG');
    const kHead = regVar('s03_head', '03 • Tiêu đề chính', 'ĐƯỢC ĐÁNH GIÁ RẤT CAO');
    const kPeak = regVar('s03_peak', '03 • Chốt đỉnh', 'LỰA CHỌN ĐẦU BẢNG HIỆN TẠI');

    const body = `
      <div class="ground-cream"></div>
      <div class="subtle-grid"></div>
      <div class="sz-upper" style="display:flex;flex-direction:column;gap:18px;">
        <div id="s3-head-grp" style="display:flex;flex-direction:column;gap:10px;">
          <div class="cm-kicker" ${kKicker}>PHẢN HỒI THỊ TRƯỜNG</div>
          <div class="cm-head" style="font-size:56px;color:#0F0F0F;" ${kHead}>ĐƯỢC ĐÁNH GIÁ RẤT CAO</div>
        </div>

        <!-- Giant Diverging Trend SVG Card (Rounded 22px, Orange Featured Shadow) -->
        <div id="s3-chart-card" class="cm-card-alt cm-shadow-featured" style="flex:1;padding:24px;display:flex;flex-direction:column;justify-content:space-between;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span class="cm-mono" style="font-size:17px;">ĐỘ TIN CẬY NGƯỜI DÙNG 2026</span>
            <span class="cm-pill-green">Z FOLD 8 +94%</span>
          </div>
          <svg width="760" height="360" viewBox="0 0 760 360" fill="none">
            <rect x="10" y="10" width="740" height="340" rx="18" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
            <!-- Horizontal grid dashed -->
            <line x1="56" y1="90" x2="710" y2="90" stroke="#D3CBB4" stroke-width="3" stroke-dasharray="8 8"/>
            <line x1="56" y1="175" x2="710" y2="175" stroke="#D3CBB4" stroke-width="3" stroke-dasharray="8 8"/>
            <line x1="56" y1="260" x2="710" y2="260" stroke="#D3CBB4" stroke-width="3" stroke-dasharray="8 8"/>
            <!-- Pink Rival Dropping Curve -->
            <defs>
              <clipPath id="s3-pink-clip"><rect id="s3-pink-crect" x="50" y="0" width="0" height="360"/></clipPath>
            </defs>
            <path clip-path="url(#s3-pink-clip)" d="M 70 185 C 210 190, 340 245, 670 305" stroke="#F06CA8" stroke-width="7" stroke-linecap="round" stroke-dasharray="14 10"/>
            <rect id="s3-lbl-pink" x="455" y="294" width="235" height="36" rx="12" fill="#F06CA8" stroke="#0F0F0F" stroke-width="3" opacity="0"/>
            <text id="s3-txt-pink" x="572" y="318" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="16" fill="#0F0F0F" opacity="0">ĐỐI THỦ: MẤT ĐIỂM</text>

            <!-- Emerald Z Fold 8 Shooting Upward -->
            <path id="s3-line-green" d="M 70 220 C 220 205, 360 120, 668 62" stroke="#136636" stroke-width="10" stroke-linecap="round" stroke-dasharray="720" stroke-dashoffset="720"/>
            <circle id="s3-dot-peak" cx="668" cy="62" r="14" fill="#F5C518" stroke="#0F0F0F" stroke-width="5" opacity="0"/>
            <rect id="s3-lbl-green" x="430" y="24" width="222" height="44" rx="14" fill="#136636" stroke="#0F0F0F" stroke-width="4" opacity="0"/>
            <text id="s3-txt-green" x="541" y="52" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-weight="900" font-size="19" fill="#EFE9D9" opacity="0">Z FOLD 8 TOP</text>
          </svg>
        </div>
      </div>

      <!-- Lower Safe Zone: x:128..752 y:854..1424 -> Rising 3-Bar Rating Lockup -->
      <div class="sz-lower" style="display:flex;flex-direction:column;justify-content:space-between;gap:18px;">
        <div id="s3-bars-card" class="cm-card cm-shadow-ink" style="flex:1;padding:24px;display:flex;flex-direction:column;justify-content:space-between;">
          <div class="cm-mono" style="font-size:18px;">ĐIỂM ĐÁNH GIÁ CỘNG ĐỒNG</div>
          <svg width="568" height="270" viewBox="0 0 568 270" fill="none">
            <!-- Base track bars -->
            <rect x="28" y="36" width="144" height="210" rx="16" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="4"/>
            <rect x="212" y="36" width="144" height="210" rx="16" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="4"/>
            <rect x="396" y="36" width="144" height="210" rx="16" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="4"/>
            <!-- Animated Fill Bars -->
            <rect id="s3-bar-a" x="28" y="246" width="144" height="0" rx="16" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
            <rect id="s3-bar-b" x="212" y="246" width="144" height="0" rx="16" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="4"/>
            <rect id="s3-bar-c" x="396" y="246" width="144" height="0" rx="16" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>
            <text x="100" y="232" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="16" fill="#0F0F0F">PHẦN CỨNG</text>
            <text x="284" y="232" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="16" fill="#0F0F0F">MÀN HÌNH</text>
            <text x="468" y="232" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="16" fill="#0F0F0F">ĐỘ BỀN</text>
          </svg>
        </div>

        <div id="s3-peak-card" class="cm-card-yellow cm-shadow-ink" style="padding:20px 26px;display:flex;align-items:center;justify-content:space-between;">
          <div class="cm-head" style="font-size:28px;" ${kPeak}>LỰA CHỌN ĐẦU BẢNG HIỆN TẠI</div>
          ${ICO.check('#136636', 40)}
        </div>
      </div>`;

    const js = `
      tl.fromTo("#s3-head-grp", { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, 0.12);
      tl.fromTo("#s3-chart-card", { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.48, ease: "power2.out" }, 0.40);
      tl.fromTo("#s3-pink-crect", { attr: { width: 0 } }, { attr: { width: 650 }, duration: 0.85, ease: "power2.out" }, 0.70);
      tl.to(["#s3-lbl-pink", "#s3-txt-pink"], { opacity: 1, duration: 0.35 }, 1.20);
      tl.fromTo("#s3-line-green", { attr: { "stroke-dashoffset": 720 } }, { attr: { "stroke-dashoffset": 0 }, duration: 1.05, ease: "power3.out" }, 1.15);
      tl.to(["#s3-dot-peak", "#s3-lbl-green", "#s3-txt-green"], { opacity: 1, duration: 0.36, ease: "back.out(1.4)" }, 1.95);
      tl.fromTo("#s3-bar-a", { attr: { y: 246, height: 0 } }, { attr: { y: 80, height: 166 }, duration: 0.55, ease: "back.out(1.2)" }, 2.05);
      tl.fromTo("#s3-bar-b", { attr: { y: 246, height: 0 } }, { attr: { y: 48, height: 198 }, duration: 0.55, ease: "back.out(1.2)" }, 2.22);
      tl.fromTo("#s3-bar-c", { attr: { y: 246, height: 0 } }, { attr: { y: 66, height: 180 }, duration: 0.55, ease: "back.out(1.2)" }, 2.38);
      tl.fromTo("#s3-peak-card", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "back.out(1.3)" }, 2.75);
    `;
    return wrapScene(this.id, body, '', js);
  },
});

// -------------------------------------------------------------------------
// SCENE 04 [12.93 -> 18.30] Way B HERO (600x1066 = exact 9:16 zero crop!)
// Arch 16: Physical Engineering Test Orbiting Hero B-Roll
// -------------------------------------------------------------------------
scenes.push({
  id: 'scene-04',
  start: 12.93,
  duration: 5.37,
  sfx: [
    [0.15, 'whoosh-short'],
    [1.65, 'pop'],
    [2.85, 'click-soft'],
    [3.65, 'ping'],
    [4.35, 'chime'],
  ],
  build() {
    const kTag = regVar('s04_tag', '04 • Kicker thiết kế', 'ƯU ĐIỂM #1 • THIẾT KẾ');
    const kSpec1 = regVar('s04_spec1', '04 • Thông số 1', 'MỎNG NHẸ VƯỢT TRỘI');
    const kSpec2 = regVar('s04_spec2', '04 • Thông số 2', 'CÂN ĐỐI • CẦM NẮM TỐT');

    const body = `
      <div class="ground-cream"></div>
      <div class="subtle-grid"></div>
      <!-- Top Slim Header Strip: x:128..952, y:172..224 -->
      <div style="position:absolute;left:128px;top:172px;width:824px;height:52px;display:flex;align-items:center;justify-content:space-between;gap:12px;">
        <div id="s4-kicker" class="cm-kicker" style="padding:6px 16px;font-size:15px;" ${kTag}>ƯU ĐIỂM #1 • THIẾT KẾ</div>
        <div id="s4-head" class="cm-head" style="font-size:32px;color:#0F0F0F;" ${kSpec1}>MỎNG NHẸ VƯỢT TRỘI</div>
      </div>

      <!-- Giant Hero B-Roll Portrait Frame: 600x1066 (x:128..728, y:238..1304) -->
      ${waybWinHtml(
        's4-win', 's4-vid', 'broll-s04.mp4', 5.37,
        'position:absolute;left:128px;top:238px;width:600px;height:1066px;',
        'cm-shadow-featured'
      )}

      <!-- Right Upper Orbit Column: x:746..952 (w=206), y:238..832 (h=594) -->
      <div style="position:absolute;left:746px;top:238px;width:206px;height:594px;display:flex;flex-direction:column;justify-content:space-between;gap:12px;">
        <!-- Mechanical Caliper Card -->
        <div class="cm-card-alt cm-shadow-ink" style="padding:14px 12px;display:flex;flex-direction:column;align-items:center;gap:8px;">
          <div class="cm-mono" style="font-size:13px;">ĐỘ DÀY THÂN MÁY</div>
          <svg width="174" height="170" viewBox="0 0 180 170" fill="none">
            <rect x="12" y="16" width="156" height="14" rx="7" fill="#0F0F0F"/>
            <path d="M 52 30 H 78 V 116 L 64 126 V 30 Z" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3.5" stroke-linejoin="round"/>
            <rect x="80" y="38" width="18" height="88" rx="6" fill="#F5C518" stroke="#0F0F0F" stroke-width="3.5"/>
            <g id="s4-jaw-r">
              <path d="M 100 30 H 126 V 30 L 114 126 L 100 116 Z" fill="#136636" stroke="#0F0F0F" stroke-width="3.5" stroke-linejoin="round"/>
            </g>
            <rect x="26" y="136" width="128" height="30" rx="12" fill="#136636" stroke="#0F0F0F" stroke-width="3"/>
            <text x="90" y="156" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-weight="900" font-size="14" fill="#EFE9D9">SIÊU MỎNG</text>
          </svg>
        </div>

        <!-- Spirit Balance Level Card -->
        <div class="cm-card cm-shadow-ink" style="padding:14px 12px;display:flex;flex-direction:column;align-items:center;gap:8px;">
          <div class="cm-mono" style="font-size:13px;">CÂN BẰNG 50:50</div>
          <svg width="174" height="44" viewBox="0 0 174 44" fill="none">
            <rect x="6" y="8" width="162" height="28" rx="14" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="3.5"/>
            <line x1="72" y1="8" x2="72" y2="36" stroke="#0F0F0F" stroke-width="2.5"/>
            <line x1="102" y1="8" x2="102" y2="36" stroke="#0F0F0F" stroke-width="2.5"/>
            <circle id="s4-bubble" cx="46" cy="22" r="10" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="3"/>
          </svg>
        </div>

        <!-- Ergonomic Comfort Waves Card -->
        <div id="s4-c1" class="cm-card-yellow cm-shadow-ink" style="padding:12px;display:flex;flex-direction:column;align-items:center;gap:6px;">
          <svg width="150" height="90" viewBox="0 0 150 90" fill="none">
            <rect x="52" y="8" width="46" height="74" rx="10" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="3.5"/>
            <rect x="60" y="18" width="30" height="48" rx="6" fill="#136636" stroke="#0F0F0F" stroke-width="2.5"/>
            <path id="s4-wave1" d="M 38 24 C 24 40, 24 52, 38 68" stroke="#136636" stroke-width="4.5" stroke-linecap="round" opacity="0"/>
            <path id="s4-wave2" d="M 24 14 C 6 38, 6 54, 24 78" stroke="#E85A1F" stroke-width="4.5" stroke-linecap="round" opacity="0"/>
            <path id="s4-wave3" d="M 112 24 C 126 40, 126 52, 112 68" stroke="#136636" stroke-width="4.5" stroke-linecap="round" opacity="0"/>
            <path id="s4-wave4" d="M 126 14 C 144 38, 144 54, 126 78" stroke="#E85A1F" stroke-width="4.5" stroke-linecap="round" opacity="0"/>
          </svg>
          <div class="cm-mono" style="font-size:13px;">ÊM TAY • GỌN GÀNG</div>
        </div>
      </div>

      <!-- Bottom Slim Emerald Ribbon: x:128..752 (w=624), y:1320..1424 (h=104) -->
      <div id="s4-bot" class="cm-card-green cm-shadow-ink" style="position:absolute;left:128px;top:1320px;width:624px;height:104px;padding:12px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <div class="cm-head" style="font-size:30px;color:#EFE9D9;" ${kSpec2}>CÂN ĐỐI • CẦM NẮM TỐT</div>
        ${ICO.check('#F5C518', 46)}
      </div>`;

    const js = `
      tl.fromTo("#s4-win", { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.42, ease: "back.out(1.15)" }, 0.00);
      tl.fromTo("#s4-kicker", { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.38 }, 0.15);
      tl.fromTo("#s4-head", { y: -14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.44 }, 1.65);
      tl.fromTo("#s4-jaw-r", { x: 58 }, { x: 0, duration: 0.62, ease: "back.out(1.3)" }, 2.85);
      tl.fromTo("#s4-bubble", { attr: { cx: 40 } }, { attr: { cx: 87 }, duration: 0.62, ease: "power3.out" }, 3.65);
      tl.fromTo(["#s4-wave1", "#s4-wave3"], { opacity: 0 }, { opacity: 1, duration: 0.32 }, 4.25);
      tl.fromTo(["#s4-wave2", "#s4-wave4"], { opacity: 0 }, { opacity: 1, duration: 0.32 }, 4.45);
      tl.fromTo("#s4-bot", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.3)" }, 4.15);
    `;
    return wrapScene(this.id, body, '', js);
  },
});

// -------------------------------------------------------------------------
// SCENE 05 [18.30 -> 23.13] 100% Full Motion (#EFE9D9)
// Arch 9: Hinge Mechanical Cross-Section & Unfolding Outer + Inner Screen
// -------------------------------------------------------------------------
scenes.push({
  id: 'scene-05',
  start: 18.30,
  duration: 4.83,
  sfx: [
    [0.15, 'whoosh-short'],
    [0.80, 'ping'],
    [2.10, 'pop'],
    [3.40, 'chime'],
  ],
  build() {
    const kKicker = regVar('s05_kicker', '05 • Nhãn hiển thị', 'TRẢI NGHIỆM 2 MÀN HÌNH');
    const kHead = regVar('s05_head', '05 • Tiêu đề', 'CẢ TRONG LẪN NGOÀI ĐỀU XUẤT SẮC');
    const kOut = regVar('s05_outer', '05 • Màn ngoài', 'MÀN HÌNH NGOÀI');
    const kIn = regVar('s05_inner', '05 • Màn trong', 'MÀN HÌNH TRONG');

    const body = `
      <div class="ground-cream"></div>
      <div class="subtle-grid"></div>
      <div class="sz-upper" style="display:flex;flex-direction:column;gap:16px;">
        <div id="s5-head-blk" style="display:flex;flex-direction:column;gap:10px;">
          <div class="cm-kicker" ${kKicker}>TRẢI NGHIỆM 2 MÀN HÌNH</div>
          <div class="cm-head" style="font-size:48px;" ${kHead}>CẢ TRONG LẪN NGOÀI ĐỀU XUẤT SẮC</div>
        </div>

        <!-- SVG Unfolding Dual-Screen Blueprint Card -->
        <div id="s5-bp" class="cm-card-alt cm-shadow-featured" style="flex:1;padding:24px;display:flex;flex-direction:column;justify-content:space-between;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span class="cm-mono" style="font-size:17px;">TẦN SỐ QUÉT MƯỢT MÀ 120HZ</span>
            <span class="cm-pill-yellow">LTPO AMOLED 2X</span>
          </div>
          <svg width="760" height="330" viewBox="0 0 760 330" fill="none">
            <!-- Smooth 120Hz sine wave ribbon -->
            <path id="s5-wave" d="M 34 52 C 94 12, 154 92, 214 52 C 274 12, 334 92, 394 52 C 454 12, 514 92, 574 52 C 634 12, 694 92, 728 52" stroke="#136636" stroke-width="6" stroke-linecap="round" stroke-dasharray="900" stroke-dashoffset="900"/>
            <!-- Left half / Outer screen -->
            <rect id="s5-wing-l" x="152" y="102" width="212" height="214" rx="18" fill="#136636" stroke="#0F0F0F" stroke-width="5"/>
            <text x="258" y="198" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-weight="900" font-size="24" fill="#EFE9D9">MÀN NGOÀI</text>
            <text x="258" y="232" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="18" fill="#EFE9D9">120HZ MƯỢT</text>
            <!-- Center hinge spine -->
            <rect x="366" y="96" width="28" height="226" rx="12" fill="#0F0F0F"/>
            <!-- Right unfolding inner half -->
            <g id="s5-wing-r" opacity="0">
              <rect x="396" y="102" width="212" height="214" rx="18" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
              <text x="502" y="198" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-weight="900" font-size="24" fill="#0F0F0F">MÀN TRONG</text>
              <text x="502" y="232" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="18" fill="#0F0F0F">RỘNG • SẮC NÉT</text>
            </g>
          </svg>
        </div>
      </div>

      <!-- Lower Dual Score Cards: x:128..752 y:854..1424 -->
      <div class="sz-lower" style="display:flex;flex-direction:column;justify-content:space-between;gap:18px;">
        <div id="s5-card-out" class="cm-card cm-shadow-ink" style="flex:1;padding:24px;display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;flex-direction:column;gap:8px;">
            <div class="cm-pill-green" ${kOut}>MÀN HÌNH NGOÀI</div>
            <div class="cm-head" style="font-size:34px;">HIỂN THỊ SẮC NÉT</div>
            <div class="cm-sub" style="font-size:20px;">Gõ phím, cuộn lướt một tay cực nhanh.</div>
          </div>
          <div class="cm-head" style="font-size:48px;color:#136636;">10/10</div>
        </div>

        <div id="s5-card-in" class="cm-card-yellow cm-shadow-ink" style="flex:1;padding:24px;display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;flex-direction:column;gap:8px;">
            <div class="cm-kicker" ${kIn}>MÀN HÌNH TRONG</div>
            <div class="cm-head" style="font-size:34px;">CỰC KỲ XUẤT SẮC</div>
            <div class="cm-sub" style="font-size:20px;">Chơi game, xem phim, đọc báo đều đã mắt.</div>
          </div>
          ${ICO.check('#136636', 54)}
        </div>
      </div>`;

    const js = `
      tl.fromTo("#s5-head-blk", { y: -22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, 0.12);
      tl.fromTo("#s5-wave", { attr: { "stroke-dashoffset": 900 } }, { attr: { "stroke-dashoffset": 0 }, duration: 1.0, ease: "power2.out" }, 0.72);
      tl.fromTo("#s5-card-out", { x: -34, opacity: 0 }, { x: 0, opacity: 1, duration: 0.48, ease: "back.out(1.2)" }, 2.10);
      tl.fromTo("#s5-wing-r", { scaleX: 0.1, opacity: 0, transformOrigin: "366px 209px" }, { scaleX: 1, opacity: 1, duration: 0.58, ease: "back.out(1.3)" }, 3.40);
      tl.fromTo("#s5-card-in", { x: 34, opacity: 0 }, { x: 0, opacity: 1, duration: 0.48, ease: "back.out(1.2)" }, 3.60);
    `;
    return wrapScene(this.id, body, '', js);
  },
});

// -------------------------------------------------------------------------
// SCENE 06 [23.13 -> 30.30] Way B HERO (600x1066 = exact 9:16 zero crop!)
// Arch 13: OS Multi-Window Split & Cursor Orbiting Live Screen B-Roll
// -------------------------------------------------------------------------
scenes.push({
  id: 'scene-06',
  start: 23.13,
  duration: 7.17,
  sfx: [
    [0.20, 'whoosh-short'],
    [1.10, 'ping'],
    [3.05, 'click-soft'],
    [4.60, 'pop'],
    [5.75, 'pop'],
    [6.35, 'chime'],
  ],
  build() {
    const kKicker = regVar('s06_kicker', '06 • Phần mềm', 'PHẦN MỀM ĐÃ TỐI ƯU HƠN');
    const kWork = regVar('s06_work', '06 • Chia đôi 1', 'LÀM VIỆC ĐA NHIỆM');
    const kGame = regVar('s06_game', '06 • Chia đôi 2', 'CHIẾN GAME ĐỀU NGON');

    const body = `
      <div class="ground-cream"></div>
      <div class="subtle-grid"></div>
      <!-- Top Slim OS Smoothness Strip: x:128..952, y:172..224 -->
      <div id="s6-top" style="position:absolute;left:128px;top:172px;width:824px;height:52px;display:flex;align-items:center;justify-content:space-between;gap:14px;">
        <div class="cm-kicker" style="padding:6px 16px;font-size:15px;" ${kKicker}>PHẦN MỀM ĐÃ TỐI ƯU HƠN</div>
        <div style="flex:1;background:#EFE9D9;border:4px solid #0F0F0F;border-radius:999px;padding:6px 14px;display:flex;align-items:center;gap:10px;">
          <span class="cm-mono" style="font-size:13px;">OS</span>
          <svg width="240" height="18" viewBox="0 0 240 18" fill="none" style="flex:1;">
            <rect x="2" y="2" width="236" height="14" rx="7" fill="#D3CBB4" stroke="#0F0F0F" stroke-width="2.5"/>
            <rect id="s6-os-bar" x="2" y="2" width="60" height="14" rx="7" fill="#136636" stroke="#0F0F0F" stroke-width="2.5"/>
          </svg>
          <span class="cm-head" style="font-size:15px;color:#136636;">MƯỢT ✓</span>
        </div>
      </div>

      <!-- Giant Hero B-Roll Portrait Frame: 600x1066 (x:128..728, y:238..1304) -->
      ${waybWinHtml(
        's6-win', 's6-vid', 'broll-s06.mp4', 7.17,
        'position:absolute;left:128px;top:238px;width:600px;height:1066px;',
        'cm-shadow-featured'
      )}

      <!-- Right Upper Orbit Column: x:746..952 (w=206), y:238..832 (h=594) -->
      <div style="position:absolute;left:746px;top:238px;width:206px;height:594px;display:flex;flex-direction:column;justify-content:space-between;gap:12px;">
        <div id="s6-os-frame" class="cm-card-alt cm-shadow-ink" style="flex:1;padding:12px;display:flex;flex-direction:column;justify-content:space-between;gap:10px;position:relative;overflow:hidden;">
          <div class="cm-mono" style="font-size:13px;text-align:center;">SPLIT-VIEW 2 CỬA SỔ</div>
          <div id="s6-pane-work" class="cm-card-green cm-shadow-ink" style="flex:1;padding:10px;display:flex;flex-direction:column;justify-content:space-between;">
            <div class="cm-pill-yellow" style="font-size:11px;padding:4px 8px;">CỬA SỔ A</div>
            <div class="cm-head" style="font-size:18px;color:#EFE9D9;" ${kWork}>LÀM VIỆC ĐA NHIỆM</div>
          </div>
          <div id="s6-pane-game" class="cm-card-orange cm-shadow-ink" style="flex:1;padding:10px;display:flex;flex-direction:column;justify-content:space-between;">
            <div class="cm-kicker" style="font-size:11px;padding:4px 8px;">CỬA SỔ B</div>
            <div class="cm-head" style="font-size:18px;color:#0F0F0F;" ${kGame}>CHIẾN GAME ĐỀU NGON</div>
          </div>
          <!-- Animated SVG Cursor snapping divider -->
          <svg id="s6-cursor" data-layout-allow-overlap data-layout-allow-occlusion width="54" height="54" viewBox="0 0 48 48" style="position:absolute;left:90px;top:170px;pointer-events:none;">
            <path d="M8 6L20 40L25 27L38 22L8 6Z" fill="#F5C518" stroke="#0F0F0F" stroke-width="4" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <!-- Bottom Slim Feature Strip: x:128..752 (w=624), y:1320..1424 (h=104) -->
      <div style="position:absolute;left:128px;top:1320px;width:624px;height:104px;display:flex;gap:12px;align-items:stretch;">
        <div id="s6-chk1" class="cm-card cm-shadow-ink" style="flex:1;padding:10px 12px;display:flex;align-items:center;gap:8px;">
          ${ICO.check('#136636', 28)}
          <div class="cm-head" style="font-size:17px;">TỐI ƯU OS</div>
        </div>
        <div id="s6-chk2" class="cm-card-yellow cm-shadow-ink" style="flex:1;padding:10px 12px;display:flex;align-items:center;gap:8px;">
          ${ICO.check('#0F0F0F', 28)}
          <div class="cm-head" style="font-size:17px;">CHIA 2 APP</div>
        </div>
        <div id="s6-chk3" class="cm-card-pink cm-shadow-ink" style="flex:1;padding:10px 12px;display:flex;align-items:center;gap:8px;">
          ${ICO.check('#0F0F0F', 28)}
          <div class="cm-head" style="font-size:17px;">GAMING NGON</div>
        </div>
      </div>`;

    const js = `
      tl.fromTo("#s6-win", { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.42, ease: "back.out(1.15)" }, 0.00);
      tl.fromTo("#s6-top", { y: -14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.38 }, 0.15);
      tl.fromTo("#s6-os-bar", { attr: { width: 60 } }, { attr: { width: 220 }, duration: 1.15, ease: "power2.out" }, 1.10);
      tl.fromTo("#s6-cursor", { x: 40, y: 40, opacity: 0 }, { x: -10, y: -18, opacity: 1, duration: 0.72, ease: "power3.out" }, 2.80);
      tl.to("#s6-cursor", { scale: 0.80, duration: 0.14, yoyo: true, repeat: 1 }, 3.55);
      tl.fromTo("#s6-pane-work", { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.46, ease: "back.out(1.2)" }, 4.55);
      tl.fromTo("#s6-pane-game", { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.46, ease: "back.out(1.2)" }, 5.65);
      tl.fromTo("#s6-chk1", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.38 }, 1.40);
      tl.fromTo("#s6-chk2", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.38 }, 3.80);
      tl.fromTo("#s6-chk3", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.38 }, 5.95);
    `;
    return wrapScene(this.id, body, '', js);
  },
});

// -------------------------------------------------------------------------
// SCENE 07 [30.30 -> 35.38] 100% Full Motion (#EFE9D9)
// Arch 14: 8-Year Foldable Legacy Timeline (Gen 1 -> Fold 8) + Durability Counter
// -------------------------------------------------------------------------
scenes.push({
  id: 'scene-07',
  start: 30.30,
  duration: 5.08,
  sfx: [
    [0.15, 'whoosh-short'],
    [1.45, 'thump'],
    [2.85, 'pop'],
    [3.55, 'ping'],
    [4.15, 'chime'],
  ],
  build() {
    const kKicker = regVar('s07_kicker', '07 • Độ bền', 'KIỂM CHỨNG ĐỘ BỀN');
    const kHead = regVar('s07_head', '07 • Khẳng định', 'ĐỘ BỀN ĐỈNH CAO');
    const kYears = regVar('s07_years', '07 • Kinh nghiệm', '8 NĂM KINH NGHIỆM LÀM MÁY GẬP');

    const body = `
      <div class="ground-cream"></div>
      <div class="subtle-grid"></div>
      <div class="sz-upper" style="display:flex;flex-direction:column;justify-content:space-between;gap:16px;">
        <div id="s7-hero" class="cm-card-orange cm-shadow-featured" style="padding:22px 26px;display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;flex-direction:column;gap:8px;">
            <div class="cm-kicker" ${kKicker}>KIỂM CHỨNG ĐỘ BỀN</div>
            <div class="cm-head" style="font-size:48px;color:#0F0F0F;" ${kHead}>ĐỘ BỀN ĐỈNH CAO</div>
          </div>
          ${ICO.shield(64)}
        </div>

        <!-- 8-Year Self-Drawing SVG Timeline -->
        <div id="s7-tl-box" class="cm-card-alt cm-shadow-ink" style="flex:1;padding:24px;display:flex;flex-direction:column;justify-content:space-between;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span class="cm-mono" style="font-size:17px;">TIẾN HOÁ BẢN LỀ SAMSUNG FOLD</span>
            <span class="cm-pill-yellow">2019 — 2026</span>
          </div>
          <svg width="760" height="270" viewBox="0 0 760 270" fill="none">
            <line x1="60" y1="125" x2="700" y2="125" stroke="#D3CBB4" stroke-width="10" stroke-linecap="round"/>
            <line id="s7-track" x1="60" y1="125" x2="700" y2="125" stroke="#136636" stroke-width="10" stroke-linecap="round" stroke-dasharray="640" stroke-dashoffset="640"/>

            <g id="s7-n1" opacity="0">
              <circle cx="80" cy="125" r="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
              <text x="80" y="132" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="16" fill="#0F0F0F">F1</text>
              <text x="80" y="180" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-weight="800" font-size="17" fill="#0F0F0F">2019</text>
            </g>
            <g id="s7-n2" opacity="0">
              <circle cx="280" cy="125" r="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
              <text x="280" y="132" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="16" fill="#0F0F0F">F4</text>
              <text x="280" y="180" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-weight="800" font-size="17" fill="#0F0F0F">2022</text>
            </g>
            <g id="s7-n3" opacity="0">
              <circle cx="480" cy="125" r="24" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
              <text x="480" y="132" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="16" fill="#0F0F0F">F6</text>
              <text x="480" y="180" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-weight="800" font-size="17" fill="#0F0F0F">2024</text>
            </g>
            <g id="s7-n4" opacity="0">
              <rect x="615" y="66" width="120" height="118" rx="18" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
              <text x="675" y="120" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-weight="900" font-size="30" fill="#0F0F0F">F8</text>
              <text x="675" y="154" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="16" fill="#0F0F0F">8 NĂM ✓</text>
            </g>
          </svg>
        </div>
      </div>

      <!-- Lower Safe Armor Banner -->
      <div class="sz-lower" style="display:flex;flex-direction:column;justify-content:space-between;gap:18px;">
        <div id="s7-exp" class="cm-card-green cm-shadow-ink" style="flex:1;padding:28px;display:flex;flex-direction:column;justify-content:center;gap:14px;">
          <div class="cm-pill-yellow" style="align-self:flex-start;">CHỨNG NHẬN THỰC TẾ</div>
          <div class="cm-head" style="font-size:44px;color:#EFE9D9;" ${kYears}>8 NĂM KINH NGHIỆM LÀM MÁY GẬP</div>
          <div class="cm-sub" style="font-size:22px;color:#EFE9D9;">Khung viền &amp; bản lề tối ưu qua 8 thế hệ liên tiếp.</div>
        </div>
        <div id="s7-armor" class="cm-card cm-shadow-ink" style="padding:20px 24px;display:flex;justify-content:space-between;align-items:center;gap:16px;">
          <span class="cm-mono" style="font-size:17px;white-space:nowrap;">CHUẨN BỀN BỈ</span>
          <span class="cm-head" style="font-size:25px;color:#136636;text-align:right;">HÀNG ĐẦU THỊ TRƯỜNG</span>
        </div>
      </div>`;

    const js = `
      tl.fromTo("#s7-hero", { y: -26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "back.out(1.25)" }, 0.12);
      tl.fromTo("#s7-tl-box", { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45 }, 0.65);
      tl.fromTo("#s7-exp", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.50, ease: "back.out(1.3)" }, 1.45);
      tl.fromTo("#s7-track", { attr: { "stroke-dashoffset": 640 } }, { attr: { "stroke-dashoffset": 0 }, duration: 1.45, ease: "power2.out" }, 2.75);
      tl.to("#s7-n1", { opacity: 1, duration: 0.25 }, 2.80);
      tl.to("#s7-n2", { opacity: 1, duration: 0.25 }, 3.20);
      tl.to("#s7-n3", { opacity: 1, duration: 0.25 }, 3.60);
      tl.fromTo("#s7-n4", { scale: 0.82, opacity: 0, transformOrigin: "675px 125px" }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.5)" }, 4.05);
      tl.fromTo("#s7-armor", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42 }, 4.25);
    `;
    return wrapScene(this.id, body, '', js);
  },
});

// -------------------------------------------------------------------------
// SCENE 08 [35.38 -> 40.30] Way A Full-Bleed B-Roll (09_37.8s Outdoor Unfold Test)
// Safe Placement: Top-left clean leaves (x:128..450, y:176..255) + Lower-Left below hands (x:128..736, y:1235..1415)
// Arch 7: Durability Check Scan Bar & Shield Seal
// -------------------------------------------------------------------------
scenes.push({
  id: 'scene-08',
  start: 35.38,
  duration: 4.92,
  sfx: [
    [0.15, 'pop'],
    [1.15, 'whoosh-short'],
    [2.85, 'ping'],
    [3.80, 'chime'],
  ],
  build() {
    const kTop = regVar('s08_top', '08 • Góc test', 'GẬP MỞ THỰC TẾ');
    const kTrust = regVar('s08_trust', '08 • An tâm', 'KHÔNG LO HƯ HỎNG QUÁ NHANH');

    const body = `
      <div id="s8-top-pill" class="cm-kicker cm-shadow-ink" style="position:absolute;left:128px;top:176px;" ${kTop}>GẬP MỞ THỰC TẾ</div>

      <!-- Lower-Left below hands/phone: x:128..744 (w=616), y:1235..1415 (h=180) -->
      <div id="s8-scan-card" class="cm-card-green cm-shadow-ink" style="position:absolute;left:128px;top:1230px;width:616px;height:185px;padding:18px 22px;display:flex;flex-direction:column;justify-content:space-between;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:12px;">
            ${ICO.shield(40)}
            <div class="cm-head" style="font-size:28px;color:#EFE9D9;" ${kTrust}>KHÔNG LO HƯ HỎNG QUÁ NHANH</div>
          </div>
        </div>

        <!-- Animated 5-Segment Durability Sweep Track -->
        <svg width="564" height="44" viewBox="0 0 564 44" fill="none">
          <rect x="2" y="4" width="560" height="36" rx="14" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="3.5"/>
          <rect id="s8-fill" x="8" y="10" width="0" height="24" rx="10" fill="#F5C518" stroke="#0F0F0F" stroke-width="2.5"/>
          <text x="282" y="29" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="16" fill="#0F0F0F">KIỂM TRA ĐỘ BỀN: ĐẠT CHUẨN ✓</text>
        </svg>
      </div>`;

    const js = `
      tl.fromTo("#s8-top-pill", { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42, ease: "back.out(1.3)" }, 0.15);
      tl.fromTo("#s8-scan-card", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "back.out(1.25)" }, 1.15);
      tl.fromTo("#s8-fill", { attr: { width: 0 } }, { attr: { width: 548 }, duration: 1.15, ease: "power2.out" }, 2.75);
    `;
    return wrapScene(this.id, body, '', js);
  },
});

// >>> [PASS-THROUGH 1] 40.30 -> 43.50 (dur 3.20s): Camera sample shots with Galaxy Z Fold8 watermark (NO overlay, NO SFX)

// -------------------------------------------------------------------------
// SCENE 09 [43.50 -> 46.63] Way A Upper Studio Gap (11a_45.0s Pro Video UI)
// Safe Placement: Top Shelf Area ONLY (x:128..952, y:176..364 -> zero touch with phone screen y>=390!)
// Arch 12: Node Inheritance Pipeline [GALAXY S SERIES] -> [Z FOLD 8]
// -------------------------------------------------------------------------
scenes.push({
  id: 'scene-09',
  start: 43.50,
  duration: 3.13,
  sfx: [
    [0.15, 'whoosh-short'],
    [1.15, 'ping'],
    [2.05, 'chime'],
  ],
  build() {
    const kSrc = regVar('s09_src', '09 • Nguồn tính năng', 'QUAY VIDEO PRO • DÒNG S');
    const kDest = regVar('s09_dest', '09 • Thừa kế', 'GIỮ NGUYÊN TRÊN Z FOLD 8 ✓');

    const body = `
      <div id="s9-flow" class="cm-card cm-shadow-ink" style="position:absolute;left:128px;top:176px;width:824px;height:186px;padding:18px 22px;display:flex;flex-direction:column;justify-content:space-between;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="cm-kicker" style="font-size:15px;padding:6px 14px;" ${kSrc}>QUAY VIDEO PRO • DÒNG S</div>
          <div class="cm-pill-yellow" style="font-size:15px;padding:5px 14px;" ${kDest}>GIỮ NGUYÊN TRÊN Z FOLD 8 ✓</div>
        </div>
        <svg width="772" height="82" viewBox="0 0 772 82" fill="none">
          <rect x="6" y="14" width="230" height="54" rx="16" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="4"/>
          <text x="121" y="48" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-weight="900" font-size="21" fill="#0F0F0F">GALAXY S SERIES</text>

          <line x1="242" y1="41" x2="504" y2="41" stroke="#0F0F0F" stroke-width="5" stroke-dasharray="10 8"/>
          <line id="s9-beam" x1="242" y1="41" x2="504" y2="41" stroke="#E85A1F" stroke-width="6" stroke-dasharray="262" stroke-dashoffset="262"/>
          <circle id="s9-pulse" cx="250" cy="41" r="10" fill="#F5C518" stroke="#0F0F0F" stroke-width="3.5"/>

          <rect id="s9-node-r" x="510" y="14" width="256" height="54" rx="16" fill="#136636" stroke="#0F0F0F" stroke-width="4" opacity="0"/>
          <text id="s9-node-rt" x="638" y="48" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-weight="900" font-size="18" fill="#EFE9D9" opacity="0">Z FOLD 8 PRO CAM ✓</text>
        </svg>
      </div>`;

    const js = `
      tl.fromTo("#s9-flow", { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, 0.12);
      tl.fromTo("#s9-beam", { attr: { "stroke-dashoffset": 276 } }, { attr: { "stroke-dashoffset": 0 }, duration: 0.85, ease: "power2.out" }, 0.70);
      tl.fromTo("#s9-pulse", { attr: { cx: 250 } }, { attr: { cx: 510 }, duration: 0.85, ease: "power2.out" }, 0.70);
      tl.to(["#s9-node-r", "#s9-node-rt"], { opacity: 1, duration: 0.38, ease: "back.out(1.4)" }, 1.65);
    `;
    return wrapScene(this.id, body, '', js);
  },
});

// -------------------------------------------------------------------------
// SCENE 10 [46.63 -> 50.40] 100% Full Motion (#EFE9D9)
// Arch 16b: Vertical Price Gravity Drop (High Price Struck -> "MỀM HƠN NHIỀU ↓")
// -------------------------------------------------------------------------
scenes.push({
  id: 'scene-10',
  start: 46.63,
  duration: 3.77,
  sfx: [
    [0.15, 'whoosh-short'],
    [1.40, 'click-soft'],
    [2.10, 'thump'],
    [2.85, 'chime'],
  ],
  build() {
    const kKicker = regVar('s10_kicker', '10 • Giá bán', 'CẬP NHẬT GIÁ HIỆN TẠI');
    const kHead = regVar('s10_head', '10 • Thông điệp giá', 'GIÁ ĐÃ MỀM HƠN TRƯỚC');
    const kDrop = regVar('s10_drop', '10 • Nhận xét giá', 'DỄ TIẾP CẬN HƠN RẤT NHIỀU');

    const body = `
      <div class="ground-cream"></div>
      <div class="subtle-grid"></div>
      <div class="sz-upper" style="display:flex;flex-direction:column;justify-content:space-between;gap:16px;">
        <div id="s10-head-blk" style="display:flex;flex-direction:column;gap:10px;">
          <div class="cm-kicker" ${kKicker}>CẬP NHẬT GIÁ HIỆN TẠI</div>
          <div class="cm-head" style="font-size:52px;" ${kHead}>GIÁ ĐÃ MỀM HƠN TRƯỚC</div>
        </div>

        <!-- Price Elevator Drop SVG Stage -->
        <div id="s10-scale" class="cm-card-alt cm-shadow-featured" style="flex:1;padding:26px;display:flex;align-items:center;justify-content:space-between;gap:24px;">
          <svg width="260" height="390" viewBox="0 0 260 390" fill="none">
            <!-- Vertical Guide Rail -->
            <rect x="112" y="20" width="36" height="350" rx="18" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
            <rect id="s10-green-fill" x="116" y="210" width="28" height="156" rx="14" fill="#136636"/>
            <!-- Old price high pill -->
            <rect x="24" y="34" width="212" height="58" rx="16" fill="#F06CA8" stroke="#0F0F0F" stroke-width="4.5"/>
            <text x="130" y="71" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-weight="900" font-size="22" fill="#0F0F0F">GIÁ KHỞI ĐIỂM</text>
            <line id="s10-strike" x1="34" y1="63" x2="226" y2="63" stroke="#0F0F0F" stroke-width="6" stroke-dasharray="192" stroke-dashoffset="192"/>

            <!-- Animated Descending Price Shuttle -->
            <g id="s10-shuttle">
              <rect x="14" y="96" width="232" height="82" rx="18" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
              <text x="130" y="134" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-weight="900" font-size="26" fill="#0F0F0F">MỀM HƠN</text>
              <text x="130" y="164" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="16" fill="#0F0F0F">HIỆN TẠI ✓</text>
            </g>
          </svg>

          <div style="flex:1;display:flex;flex-direction:column;gap:18px;">
            <div class="cm-card-green cm-shadow-ink" style="padding:22px;display:flex;align-items:center;gap:14px;">
              <div style="background:#F5C518;border:4px solid #0F0F0F;border-radius:14px;padding:10px;">
                ${ICO.arrowDown(38)}
              </div>
              <div class="cm-head" style="font-size:30px;color:#EFE9D9;">HẠ NHIỆT MẠNH SO VỚI LÚC MỚI RA MẮT</div>
            </div>
            <div class="cm-card cm-shadow-ink" style="padding:20px;">
              <div class="cm-sub" style="font-size:22px;">Giữ đủ tính năng cao cấp nhưng mức giá dễ chịu hơn nhiều cho người mua mới.</div>
            </div>
          </div>
        </div>
      </div>

      <div class="sz-lower" style="display:flex;flex-direction:column;justify-content:space-between;gap:18px;">
        <div id="s10-bot" class="cm-card-yellow cm-shadow-ink" style="flex:1;padding:30px 28px;display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;flex-direction:column;gap:10px;">
            <div class="cm-kicker">CƠ HỘI SỞ HỮU</div>
            <div class="cm-head" style="font-size:40px;" ${kDrop}>DỄ TIẾP CẬN HƠN RẤT NHIỀU</div>
          </div>
          ${ICO.check('#136636', 56)}
        </div>
        <div style="display:flex;gap:16px;">
          <div class="cm-card cm-shadow-ink" style="flex:1;padding:20px 18px;display:flex;flex-direction:column;gap:8px;">
            <div class="cm-mono" style="font-size:14px;color:#136636;">HIỆU NĂNG &amp; MÀN HÌNH</div>
            <div class="cm-head" style="font-size:21px;">GIỮ NGUYÊN TRẢI NGHIỆM</div>
          </div>
          <div class="cm-card-pink cm-shadow-ink" style="flex:1;padding:20px 18px;display:flex;flex-direction:column;gap:8px;">
            <div class="cm-mono" style="font-size:14px;">SO VỚI GIÁ MỞ BÁN</div>
            <div class="cm-head" style="font-size:21px;">GIẢM MẠNH ĐÁNG KỂ</div>
          </div>
        </div>
      </div>`;

    const js = `
      tl.fromTo("#s10-head-blk", { y: -22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, 0.12);
      tl.fromTo("#s10-strike", { attr: { "stroke-dashoffset": 192 } }, { attr: { "stroke-dashoffset": 0 }, duration: 0.42 }, 1.25);
      tl.fromTo("#s10-shuttle", { y: 0 }, { y: 172, duration: 0.72, ease: "bounce.out" }, 2.00);
      tl.fromTo("#s10-bot", { y: 30, scale: 0.94, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.48, ease: "back.out(1.3)" }, 2.75);
    `;
    return wrapScene(this.id, body, '', js);
  },
});

// -------------------------------------------------------------------------
// SCENE 11 [50.40 -> 55.85] Way A FULL-BLEED HERO B-Roll (12_53.0s)
// Phone sits untouched center (y:410..1530); all graphics sit in open top stone (y:176..394)
// Arch 8b: Checklist Audit -> Battery Downgrade Meter
// -------------------------------------------------------------------------
scenes.push({
  id: 'scene-11',
  start: 50.40,
  duration: 5.45,
  sfx: [
    [0.20, 'pop'],
    [1.10, 'ping'],
    [2.50, 'error'],
    [4.20, 'thump'],
  ],
  build() {
    const kPerfect = regVar('s11_perf', '11 • Mở chuyển ý', 'MỌI THỨ GẦN NHƯ HOÀN HẢO');
    const kBatWarn = regVar('s11_warn', '11 • Nhược điểm pin', 'PIN KHÔNG QUÁ TỐT');

    const body = `
      <!-- Top Open Stone Zone ONLY: x:128..952, y:176..394 (100% leaves Z Fold 8 full-screen visible!) -->
      <div id="s11-top" class="cm-card cm-shadow-featured" style="position:absolute;left:128px;top:176px;width:824px;height:218px;padding:18px 24px;display:flex;align-items:center;justify-content:space-between;gap:18px;">
        <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;gap:8px;height:100%;">
          <div id="s11-r1" class="cm-pill-green" style="font-size:14px;padding:6px 14px;" ${kPerfect}>MỌI THỨ GẦN NHƯ HOÀN HẢO ✓</div>
          <div id="s11-bot" style="display:flex;align-items:center;gap:12px;">
            ${ICO.bolt(44)}
            <div class="cm-head" style="font-size:34px;color:#0F0F0F;" ${kBatWarn}>PIN KHÔNG QUÁ TỐT</div>
          </div>
          <div id="s11-r2" class="cm-mono" style="font-size:15px;color:#B83B0B;">NHƯỢC ĐIỂM #1 • TỤT NHANH KHI TẢI NẶNG</div>
        </div>

        <!-- SVG Segmented Battery Cell Graphic -->
        <div style="background:#E4DCC4;border:4px solid #0F0F0F;border-radius:16px;padding:12px 14px;display:flex;flex-direction:column;align-items:center;gap:6px;">
          <svg width="230" height="82" viewBox="0 0 260 92" fill="none">
            <rect x="8" y="10" width="224" height="72" rx="14" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
            <rect x="232" y="30" width="16" height="32" rx="6" fill="#0F0F0F"/>
            <rect id="s11-bc1" x="20" y="20" width="42" height="52" rx="8" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3"/>
            <rect id="s11-bc2" x="70" y="20" width="42" height="52" rx="8" fill="#F5C518" stroke="#0F0F0F" stroke-width="3"/>
            <rect id="s11-bc3" x="120" y="20" width="42" height="52" rx="8" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="3"/>
            <rect id="s11-bc4" x="170" y="20" width="42" height="52" rx="8" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="3"/>
          </svg>
          <div class="cm-mono" style="font-size:13px;color:#0F0F0F;">THỜI LƯỢNG PIN HẠN CHẾ</div>
        </div>
      </div>`;

    const js = `
      tl.fromTo("#s11-top", { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, 0.15);
      tl.fromTo("#s11-r1", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.38 }, 0.35);
      tl.fromTo("#s11-r2", { x: 18, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42 }, 2.55);
      tl.to("#s11-bc4", { opacity: 0.12, duration: 0.35 }, 3.10);
      tl.to("#s11-bc3", { opacity: 0.12, duration: 0.35 }, 3.65);
      tl.fromTo("#s11-bot", { scale: 0.90, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.46, ease: "back.out(1.3)" }, 4.20);
    `;
    return wrapScene(this.id, body, '', js);
  },
});

// -------------------------------------------------------------------------
// SCENE 12 [55.85 -> 62.70] 100% Full Motion (#EFE9D9)
// Arch 12b: Causal Domino Pipeline (MỎNG + HIỆU NĂNG -> NHANH NÓNG -> HAO PIN)
// -------------------------------------------------------------------------
scenes.push({
  id: 'scene-12',
  start: 55.85,
  duration: 6.85,
  sfx: [
    [0.40, 'pop'],
    [1.70, 'click-soft'],
    [2.95, 'ping'],
    [4.45, 'error'],
    [5.40, 'thump'],
  ],
  build() {
    const kStep1 = regVar('s12_s1', '12 • Nguyên nhân', 'MÁY MỎNG + HIỆU NĂNG CAO');
    const kStep2 = regVar('s12_s2', '12 • Hệ quả 1', 'CHẮC CHẮN NHANH NÓNG');
    const kStep3 = regVar('s12_s3', '12 • Hệ quả 2', 'HAO PIN RẤT LÀ NHANH');

    const body = `
      <div class="ground-cream"></div>
      <div class="subtle-grid"></div>
      <div class="sz-upper" style="display:flex;flex-direction:column;justify-content:space-between;gap:14px;">
        <div class="cm-kicker">CHUỖI HỆ QUẢ VẬT LÝ</div>

        <!-- Vertical 3-Node Domino Cause Chain + Thermometer SVG -->
        <div id="s12-pipe" class="cm-card-alt cm-shadow-featured" style="flex:1;padding:24px;display:flex;align-items:stretch;gap:20px;">
          <!-- Left Domino Chain -->
          <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;gap:12px;">
            <div id="s12-d1" class="cm-card cm-shadow-ink" style="padding:16px 20px;display:flex;align-items:center;justify-content:space-between;">
              <div>
                <div class="cm-mono" style="font-size:14px;color:#136636;">NGUYÊN NHÂN #01</div>
                <div class="cm-head" style="font-size:28px;" ${kStep1}>MÁY MỎNG + HIỆU NĂNG CAO</div>
              </div>
            </div>

            <svg width="48" height="32" viewBox="0 0 48 32" style="align-self:center;">
              <path d="M24 2V26M24 26L14 16M24 26L34 16" stroke="#0F0F0F" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

            <div id="s12-d2" class="cm-card-yellow cm-shadow-ink" style="padding:16px 20px;display:flex;align-items:center;justify-content:space-between;">
              <div>
                <div class="cm-mono" style="font-size:14px;">TỎA NHIỆT CAO</div>
                <div class="cm-head" style="font-size:28px;" ${kStep2}>CHẮC CHẮN NHANH NÓNG</div>
              </div>
              ${ICO.flame(42)}
            </div>

            <svg width="48" height="32" viewBox="0 0 48 32" style="align-self:center;">
              <path d="M24 2V26M24 26L14 16M24 26L34 16" stroke="#E85A1F" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

            <div id="s12-d3" class="cm-card-pink cm-shadow-ink" style="padding:16px 20px;display:flex;align-items:center;justify-content:space-between;">
              <div>
                <div class="cm-mono" style="font-size:14px;">HẬU QUẢ CUỐI</div>
                <div class="cm-head" style="font-size:28px;" ${kStep3}>HAO PIN RẤT LÀ NHANH</div>
              </div>
              ${ICO.bolt(40)}
            </div>
          </div>

          <!-- Right Animated Thermometer Gauge -->
          <div style="width:150px;background:#EFE9D9;border:4px solid #0F0F0F;border-radius:18px;padding:16px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;">
            <div class="cm-mono" style="font-size:14px;">NHIỆT ĐỘ</div>
            <svg width="96" height="340" viewBox="0 0 96 340" fill="none">
              <rect x="30" y="18" width="36" height="250" rx="18" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
              <circle cx="48" cy="288" r="34" fill="#E85A1F" stroke="#0F0F0F" stroke-width="5"/>
              <!-- Rising mercury column -->
              <rect id="s12-merc" x="37" y="255" width="22" height="15" rx="11" fill="#E85A1F"/>
            </svg>
            <div class="cm-head" style="font-size:18px;color:#B83B0B;">HOT!</div>
          </div>
        </div>
      </div>

      <!-- Lower Live 8-Cell Drain Array -->
      <div class="sz-lower" style="display:flex;flex-direction:column;justify-content:center;">
        <div class="cm-card cm-shadow-ink" style="padding:28px;display:flex;flex-direction:column;gap:20px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span class="cm-mono" style="font-size:18px;">MỨC SỤT PIN THEO TẢI NHIỆT</span>
            <span class="cm-pill-pink">-40% / PHIÊN NẶNG</span>
          </div>
          <svg width="564" height="120" viewBox="0 0 564 120" fill="none">
            <rect x="4" y="8" width="556" height="104" rx="18" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="4.5"/>
            <rect id="s12-c1" x="20" y="24" width="58" height="72" rx="12" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3.5"/>
            <rect id="s12-c2" x="86" y="24" width="58" height="72" rx="12" fill="#E85A1F" stroke="#0F0F0F" stroke-width="3.5"/>
            <rect id="s12-c3" x="152" y="24" width="58" height="72" rx="12" fill="#F5C518" stroke="#0F0F0F" stroke-width="3.5"/>
            <rect id="s12-c4" x="218" y="24" width="58" height="72" rx="12" fill="#F5C518" stroke="#0F0F0F" stroke-width="3.5"/>
            <rect id="s12-c5" x="284" y="24" width="58" height="72" rx="12" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="3.5"/>
            <rect id="s12-c6" x="350" y="24" width="58" height="72" rx="12" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="3.5"/>
            <rect id="s12-c7" x="416" y="24" width="58" height="72" rx="12" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="3.5"/>
            <rect id="s12-c8" x="482" y="24" width="58" height="72" rx="12" fill="#1F8A4C" stroke="#0F0F0F" stroke-width="3.5"/>
          </svg>
          <div class="cm-sub" style="font-size:22px;">Máy mỏng tản nhiệt ít hơn, khiến hiệu năng cao đốt năng lượng nhanh hơn.</div>
        </div>
      </div>`;

    const js = `
      tl.fromTo("#s12-d1", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.48, ease: "back.out(1.2)" }, 0.35);
      tl.fromTo("#s12-merc", { attr: { y: 245, height: 25 } }, { attr: { y: 42, height: 228 }, duration: 2.10, ease: "power2.out" }, 1.65);
      tl.fromTo("#s12-d2", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.48, ease: "back.out(1.3)" }, 2.90);
      tl.fromTo("#s12-d3", { y: 24, scale: 0.92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.50, ease: "back.out(1.4)" }, 5.20);
      ["#s12-c8", "#s12-c7", "#s12-c6", "#s12-c5", "#s12-c4", "#s12-c3"].forEach((id, i) => {
        tl.to(id, { opacity: 0.14, duration: 0.25 }, 3.80 + i * 0.38);
      });
    `;
    return wrapScene(this.id, body, '', js);
  },
});

// -------------------------------------------------------------------------
// SCENE 13 [62.70 -> 71.10] Way B Right-Top (346x654 -> zero crop!)
// Arch 17: Responsive App Scaling -> Forced Oversized Zoom Diagram
// -------------------------------------------------------------------------
scenes.push({
  id: 'scene-13',
  start: 62.70,
  duration: 8.40,
  sfx: [
    [0.20, 'whoosh-short'],
    [1.10, 'ping'],
    [3.15, 'pop'],
    [5.40, 'error'],
    [6.80, 'click-soft'],
  ],
  build() {
    const kTitle = regVar('s13_title', '13 • Phần mềm chưa tối ưu', 'APP CHƯA HỖ TRỢ BỊ PHÓNG TO');
    const kNote = regVar('s13_note', '13 • Cảm giác dùng', 'ĐÔI KHI HƠI KHÓ CHỊU');

    const body = `
      <!-- Top-Left Open Shelf Zone: x:128..636, y:176..318 (Clears tilted upper-right bezel across all shots!) -->
      <div id="s13-left" class="cm-card cm-shadow-ink" style="position:absolute;left:128px;top:176px;width:512px;height:142px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;gap:12px;">
        <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
          <div class="cm-kicker" style="padding:4px 12px;font-size:13px;">NHƯỢC ĐIỂM #2 • PHẦN MỀM</div>
          <div class="cm-head" style="font-size:24px;color:#0F0F0F;" ${kTitle}>APP CHƯA HỖ TRỢ BỊ PHÓNG TO</div>
        </div>
        <!-- Compact Morphing Zoom Icon -->
        <svg width="118" height="104" viewBox="0 0 118 104" fill="none" style="flex-shrink:0;">
          <rect x="4" y="4" width="110" height="96" rx="14" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="3.5" stroke-dasharray="7 5"/>
          <rect id="s13-appbox" x="34" y="24" width="50" height="54" rx="10" fill="#136636" stroke="#0F0F0F" stroke-width="3.5"/>
          <text id="s13-apptxt" x="59" y="57" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-weight="900" font-size="14" fill="#EFE9D9">1:1</text>
          <text id="s13-apptxt-bad" x="59" y="58" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-weight="900" font-size="20" fill="#0F0F0F" opacity="0">ZOOM X2!</text>
        </svg>
      </div>

      <!-- Bottom-Left Sleek Consequence Pill: x:128..456 (clean over hand/mint lower-left corner, y:1296..1420) -->
      <div id="s13-ok" class="cm-card-green cm-shadow-ink" style="position:absolute;left:128px;top:1296px;width:328px;height:124px;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:10px;">
        <div>
          <div class="cm-mono" style="font-size:12px;color:#F5C518;">APP TABLET</div>
          <div class="cm-head" style="font-size:21px;color:#EFE9D9;">ĐÃ CẢI THIỆN ✓</div>
        </div>
        ${ICO.check('#F5C518', 36)}
      </div>

      <div id="s13-bad" data-layout-allow-overlap data-layout-allow-occlusion class="cm-card-orange cm-shadow-featured" style="position:absolute;left:128px;top:1296px;width:328px;height:124px;padding:14px 16px;display:flex;flex-direction:column;justify-content:center;gap:6px;opacity:0;">
        <div class="cm-mono" style="font-size:12px;color:#0F0F0F;">APP CHƯA TỐI ƯU</div>
        <div class="cm-head" style="font-size:22px;color:#0F0F0F;" ${kNote}>ĐÔI KHI HƠI KHÓ CHỊU</div>
      </div>`;

    const js = `
      tl.fromTo("#s13-left", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.44, ease: "power3.out" }, 0.20);
      tl.fromTo("#s13-ok", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.44 }, 0.90);
      tl.fromTo("#s13-appbox", { attr: { x: 34, y: 24, width: 50, height: 54 } }, { attr: { x: 10, y: 10, width: 98, height: 84, fill: "#F06CA8" }, duration: 0.80, ease: "back.out(1.3)" }, 5.10);
      tl.to("#s13-apptxt", { opacity: 0, duration: 0.22 }, 5.10);
      tl.to("#s13-apptxt-bad", { opacity: 1, duration: 0.32 }, 5.30);
      tl.to("#s13-ok", { opacity: 0, duration: 0.28 }, 6.60);
      tl.fromTo("#s13-bad", { y: 20, scale: 0.94, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.48, ease: "back.out(1.25)" }, 6.75);
    `;
    return wrapScene(this.id, body, '', js);
  },
});

// -------------------------------------------------------------------------
// SCENE 14 [71.10 -> 76.23] Way A Full-Bleed Macro Camera (17_73.6s)
// Camera bump stays completely untouched at x:280..540, y:520..920!
// Arch 15: Telephoto Zoom Radar Scope & Missing 3rd Lens Target
// -------------------------------------------------------------------------
scenes.push({
  id: 'scene-14',
  start: 71.10,
  duration: 5.13,
  sfx: [
    [0.65, 'whoosh-short'],
    [1.80, 'ping'],
    [2.60, 'error'],
    [3.60, 'pop'],
  ],
  build() {
    const kTop = regVar('s14_top', '14 • Lỗi camera', 'THIẾU CAMERA TELE');
    const kLim = regVar('s14_lim', '14 • Hạn chế', 'HẠN CHẾ QUAY CHỤP XA');

    const body = `
      <!-- Top Open Stone Zone: x:128..952, y:176..420 (completely above the camera island!) -->
      <div id="s14-top" class="cm-card cm-shadow-ink" style="position:absolute;left:128px;top:176px;width:824px;padding:20px 26px;display:flex;align-items:center;justify-content:space-between;gap:20px;">
        <div style="display:flex;flex-direction:column;gap:8px;">
          <div class="cm-kicker">NHƯỢC ĐIỂM #3 • CAMERA</div>
          <div class="cm-head" style="font-size:44px;color:#0F0F0F;" ${kTop}>THIẾU CAMERA TELE</div>
        </div>
        <!-- 3-Step Lens Selector Bar (1x, 2x, 5x blocked) -->
        <svg width="268" height="74" viewBox="0 0 268 74" fill="none">
          <rect x="6" y="10" width="76" height="54" rx="14" fill="#136636" stroke="#0F0F0F" stroke-width="4"/>
          <text x="44" y="45" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="22" fill="#EFE9D9">1x</text>
          <rect x="94" y="10" width="76" height="54" rx="14" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
          <text x="132" y="45" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="22" fill="#0F0F0F">2x</text>
          <rect id="s14-5x" x="182" y="10" width="80" height="54" rx="14" fill="#F06CA8" stroke="#0F0F0F" stroke-width="4" stroke-dasharray="6 4"/>
          <text x="222" y="45" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="20" fill="#0F0F0F">✕ 5x</text>
        </svg>
      </div>

      <!-- Dashed SVG Pointer leading cleanly up-left toward empty glass spot below flash (never covering lenses!) -->
      <svg style="position:absolute;left:128px;top:940px;width:624px;height:185px;pointer-events:none;overflow:visible;" viewBox="0 0 624 185" fill="none">
        <defs>
          <clipPath id="s14-clip"><rect id="s14-crect" x="0" y="185" width="624" height="0"/></clipPath>
        </defs>
        <path clip-path="url(#s14-clip)" d="M 300 172 Q 350 100 264 48" stroke="#E85A1F" stroke-width="7" stroke-linecap="round" stroke-dasharray="14 10"/>
        <circle id="s14-ring" cx="256" cy="42" r="22" stroke="#F06CA8" stroke-width="5" stroke-dasharray="8 6" opacity="0"/>
      </svg>

      <!-- Bottom-Left Open Blur Zone: x:128..752, y:1115..1415 -->
      <div id="s14-bot" class="cm-card-pink cm-shadow-featured" style="position:absolute;left:128px;top:1115px;width:624px;height:298px;padding:24px 28px;display:flex;align-items:center;justify-content:space-between;gap:20px;">
        <svg width="136" height="136" viewBox="0 0 136 136" fill="none">
          <circle cx="68" cy="68" r="56" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
          <circle cx="68" cy="68" r="34" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="4" stroke-dasharray="8 6"/>
          <line x1="68" y1="6" x2="68" y2="130" stroke="#0F0F0F" stroke-width="3"/>
          <line x1="6" y1="68" x2="130" y2="68" stroke="#0F0F0F" stroke-width="3"/>
          <path d="M46 46L90 90M90 46L46 90" stroke="#E85A1F" stroke-width="7" stroke-linecap="round"/>
        </svg>
        <div style="flex:1;display:flex;flex-direction:column;gap:12px;">
          <div class="cm-pill-yellow" style="align-self:flex-start;">ZOOM XA BỊ GIỚI HẠN</div>
          <div class="cm-head" style="font-size:36px;" ${kLim}>HẠN CHẾ QUAY CHỤP XA</div>
          <div class="cm-sub" style="font-size:20px;">Cụm máy chỉ trang bị 2 ống kính, thiếu tele chuyên dụng.</div>
        </div>
      </div>`;

    const js = `
      tl.fromTo("#s14-top", { y: -32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 0.65);
      tl.fromTo("#s14-crect", { attr: { y: 185, height: 0 } }, { attr: { y: 0, height: 185 }, duration: 0.72, ease: "power2.out" }, 2.15);
      tl.to("#s14-ring", { opacity: 1, duration: 0.35, ease: "back.out(1.5)" }, 2.75);
      tl.fromTo("#s14-bot", { y: 34, scale: 0.92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 3.45);
    `;
    return wrapScene(this.id, body, '', js);
  },
});

// -------------------------------------------------------------------------
// SCENE 15 [76.23 -> 82.70] 100% Full Motion (#EFE9D9)
// Arch 18: Giant Price Receipt Ticket (> 30 TRIỆU) vs 3-Slot Camera Rack
// -------------------------------------------------------------------------
scenes.push({
  id: 'scene-15',
  start: 76.23,
  duration: 6.47,
  sfx: [
    [0.35, 'whoosh-short'],
    [2.75, 'thump'],
    [4.45, 'error'],
    [5.35, 'ping'],
  ],
  build() {
    const kPrice = regVar('s15_price', '15 • Giá tiền', 'HƠN 30 TRIỆU ĐỒNG');
    const kCam = regVar('s15_cam', '15 • Số camera', 'NHƯNG CHỈ CÓ 2 CAMERA');
    const kVerdict = regVar('s15_verdict', '15 • Kết luận phụ', 'KHÔNG PHẢI AI CŨNG CHẤP NHẬN');

    const body = `
      <div class="ground-cream"></div>
      <div class="subtle-grid"></div>
      <div class="sz-upper" style="display:flex;flex-direction:column;justify-content:space-between;gap:18px;">
        <div class="cm-kicker">BÀI TOÁN GIÁ BÁN VS TRANG BỊ</div>

        <!-- Giant Price Receipt Tag SVG/HTML -->
        <div id="s15-receipt" class="cm-card cm-shadow-featured" style="flex:1;padding:30px;display:flex;flex-direction:column;justify-content:space-between;border-style:dashed;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span class="cm-mono" style="font-size:18px;">HÓA ĐƠN GIÁ TRỊ SẢN PHẨM</span>
            <span class="cm-pill-yellow">FLAGSHIP GẬP</span>
          </div>
          <div style="border-top:4px dashed #0F0F0F;border-bottom:4px dashed #0F0F0F;padding:28px 0;display:flex;align-items:center;justify-content:space-between;gap:16px;">
            <div class="cm-head" style="font-size:50px;color:#B83B0B;" ${kPrice}>HƠN 30 TRIỆU ĐỒNG</div>
            <div class="cm-card-orange" style="padding:14px 20px;border-radius:16px;flex-shrink:0;">
              <div class="cm-head" style="font-size:26px;color:#0F0F0F;">MỨC GIÁ CAO</div>
            </div>
          </div>
          <div class="cm-sub" style="font-size:24px;">Với tầm tiền hơn 30 triệu đồng, kỳ vọng của người dùng là rất lớn.</div>
        </div>
      </div>

      <!-- Lower Safe Zone: 3-Slot Camera Rack + Stamp Verdict -->
      <div class="sz-lower" style="display:flex;flex-direction:column;justify-content:space-between;gap:18px;">
        <div id="s15-rack" class="cm-card-alt cm-shadow-ink" style="flex:1;padding:24px;display:flex;flex-direction:column;justify-content:space-between;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span class="cm-head" style="font-size:28px;" ${kCam}>NHƯNG CHỈ CÓ 2 CAMERA</span>
            ${ICO.warn(32)}
          </div>
          <svg width="564" height="150" viewBox="0 0 564 150" fill="none">
            <rect x="4" y="10" width="556" height="130" rx="20" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4.5"/>
            <!-- Lens 1 -->
            <circle cx="106" cy="75" r="46" fill="#0F0F0F"/>
            <circle cx="106" cy="75" r="24" fill="#136636" stroke="#EFE9D9" stroke-width="4"/>
            <!-- Lens 2 -->
            <circle cx="282" cy="75" r="46" fill="#0F0F0F"/>
            <circle cx="282" cy="75" r="24" fill="#136636" stroke="#EFE9D9" stroke-width="4"/>
            <!-- Missing Slot 3 Tele -->
            <circle id="s15-slot3" cx="458" cy="75" r="46" fill="#F06CA8" stroke="#0F0F0F" stroke-width="5" stroke-dasharray="10 8"/>
            <text x="458" y="82" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="18" fill="#0F0F0F">TRỐNG</text>
          </svg>
        </div>

        <div id="s15-stamp-wrap" data-layout-allow-overlap data-layout-allow-occlusion>
          <div class="cm-card-pink cm-shadow-ink cm-rot-neg3" style="padding:22px 26px;text-align:center;">
            <div class="cm-head" style="font-size:32px;" ${kVerdict}>KHÔNG PHẢI AI CŨNG CHẤP NHẬN</div>
          </div>
        </div>
      </div>`;

    const js = `
      tl.fromTo("#s15-receipt", { y: -32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.50, ease: "power3.out" }, 0.35);
      tl.fromTo("#s15-rack", { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.48 }, 2.75);
      tl.fromTo("#s15-slot3", { scale: 0.72, transformOrigin: "458px 75px" }, { scale: 1, duration: 0.45, ease: "back.out(1.6)" }, 4.45);
      tl.fromTo("#s15-stamp-wrap", { scale: 0.85, y: 24, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.48, ease: "back.out(1.4)" }, 5.15);
    `;
    return wrapScene(this.id, body, '', js);
  },
});

// -------------------------------------------------------------------------
// SCENE 16 [82.70 -> 89.13] Way B Lower-Left (300x570 -> zero crop!)
// Arch 17b: Flaw Noise Sweep -> Value Filter Lock
// -------------------------------------------------------------------------
scenes.push({
  id: 'scene-16',
  start: 82.70,
  duration: 6.43,
  sfx: [
    [0.20, 'whoosh-short'],
    [1.45, 'click-soft'],
    [2.60, 'pop'],
    [4.25, 'chime'],
  ],
  build() {
    const kIgnore = regVar('s16_ignore', '16 • Lọc nhược điểm', 'BỎ QUA 3 NHƯỢC ĐIỂM?');
    const kBuy = regVar('s16_buy', '16 • Chốt giá trị', 'ĐIỆN THOẠI GẬP TỐT TRONG TẦM GIÁ');

    const body = `
      <div class="ground-cream"></div>
      <div class="subtle-grid"></div>
      <!-- Top Slim Strip Crossing Out 3 Flaws: x:128..952, y:172..224 -->
      <div style="position:absolute;left:128px;top:172px;width:824px;height:52px;display:flex;align-items:center;justify-content:space-between;gap:10px;">
        <div class="cm-kicker" style="padding:6px 14px;font-size:14px;" ${kIgnore}>BỎ QUA 3 NHƯỢC ĐIỂM?</div>
        <div id="s16-f1" class="cm-pill-pink" style="padding:5px 12px;font-size:13px;">01 PIN NÓNG</div>
        <div id="s16-f2" class="cm-pill-pink" style="padding:5px 12px;font-size:13px;">02 APP PHÓNG</div>
        <div id="s16-f3" class="cm-pill-pink" style="padding:5px 12px;font-size:13px;">03 THIẾU TELE</div>
      </div>

      <!-- Giant Hero B-Roll Portrait Frame: 600x1066 (x:128..728, y:238..1304) -->
      ${waybWinHtml(
        's16-win', 's16-vid', 'broll-s16.mp4', 6.43,
        'position:absolute;left:128px;top:238px;width:600px;height:1066px;',
        'cm-shadow-featured'
      )}

      <!-- Right Upper Orbit Column (3 Compact Core Strengths): x:746..952 (w=206), y:238..832 (h=594) -->
      <div style="position:absolute;left:746px;top:238px;width:206px;height:594px;display:flex;flex-direction:column;justify-content:space-between;gap:14px;">
        <div id="s16-k1" class="cm-card cm-shadow-ink" style="flex:1;padding:12px;display:flex;flex-direction:column;justify-content:center;gap:6px;">
          <div class="cm-mono" style="font-size:12px;color:#136636;">ĐIỂM MẠNH #1</div>
          <div class="cm-head" style="font-size:20px;">MỎNG NHẸ GỌN</div>
        </div>
        <div id="s16-k2" class="cm-card-yellow cm-shadow-ink" style="flex:1;padding:12px;display:flex;flex-direction:column;justify-content:center;gap:6px;">
          <div class="cm-mono" style="font-size:12px;">ĐIỂM MẠNH #2</div>
          <div class="cm-head" style="font-size:20px;">BỀN BỈ 8 NĂM</div>
        </div>
        <div id="s16-k3" class="cm-card-orange cm-shadow-ink" style="flex:1;padding:12px;display:flex;flex-direction:column;justify-content:center;gap:6px;">
          <div class="cm-mono" style="font-size:12px;">ĐIỂM MẠNH #3</div>
          <div class="cm-head" style="font-size:20px;">GIÁ MỀM HƠN</div>
        </div>
      </div>

      <!-- Bottom Slim Emerald Verdict Ribbon: x:128..752 (w=624), y:1320..1424 (h=104) -->
      <div id="s16-win-cta" class="cm-card-green cm-shadow-ink" style="position:absolute;left:128px;top:1320px;width:624px;height:104px;padding:12px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;">
        <div class="cm-head" style="font-size:25px;color:#EFE9D9;" ${kBuy}>ĐIỆN THOẠI GẬP TỐT TRONG TẦM GIÁ</div>
        ${ICO.check('#F5C518', 42)}
      </div>`;

    const js = `
      tl.fromTo("#s16-win", { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.42, ease: "back.out(1.15)" }, 0.00);
      tl.to("#s16-f1", { opacity: 0.72, background: "#E4DCC4", textDecoration: "line-through", duration: 0.36 }, 1.45);
      tl.to("#s16-f2", { opacity: 0.72, background: "#E4DCC4", textDecoration: "line-through", duration: 0.36 }, 2.15);
      tl.to("#s16-f3", { opacity: 0.72, background: "#E4DCC4", textDecoration: "line-through", duration: 0.36 }, 2.85);
      tl.fromTo("#s16-win-cta", { y: 20, scale: 0.94, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.48, ease: "back.out(1.3)" }, 4.20);
      tl.fromTo(["#s16-k1", "#s16-k2", "#s16-k3"], { x: 20, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.24, duration: 0.40 }, 4.45);
    `;
    return wrapScene(this.id, body, '', js);
  },
});

// -------------------------------------------------------------------------
// SCENE 17 [89.13 -> 95.90] CLOSING SUMMARY PLATE ON DARK GREEN #136636!
// Palette Rule: "#136636 dark green closing ground, #EFE9D9 bold cream type, #F5C518 yellow trophy"
// Arch 18b: Dual-Screen Trophy Verdict Lockup
// -------------------------------------------------------------------------
scenes.push({
  id: 'scene-17',
  start: 89.13,
  duration: 6.77,
  sfx: [
    [0.25, 'whoosh-short'],
    [0.95, 'pop'],
    [2.95, 'thump'],
    [4.40, 'sparkle'],
  ],
  build() {
    const kKicker = regVar('s17_kicker', '17 • Tổng kết', 'CHỐT KÈO ĐÁNH GIÁ');
    const kSub = regVar('s17_sub', '17 • Thế mạnh chốt', 'ĐA NHIỆM TỐT • 2 MÀN HÌNH LINH HOẠT');
    const kTitle = regVar('s17_title', '17 • Kết luận cuối', 'LỰA CHỌN GẦN NHƯ DUY NHẤT');
    const kStamp = regVar('s17_stamp', '17 • Con dấu', 'GALAXY Z FOLD 8 • HIỆN TẠI ✓');

    const body = `
      <div class="ground-green"></div>
      <div class="subtle-grid-green"></div>
      <div class="sz-upper" style="display:flex;flex-direction:column;justify-content:space-between;gap:18px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="cm-pill-yellow" ${kKicker}>CHỐT KÈO ĐÁNH GIÁ</div>
          ${ICO.crown(54)}
        </div>

        <!-- Cream Card + Gold Dual-Screen Trophy Graphic -->
        <div id="s17-dual-card" class="cm-card cm-shadow-featured" style="flex:1;padding:24px 26px;display:flex;flex-direction:column;justify-content:space-between;gap:14px;">
          <div class="cm-head" style="font-size:36px;color:#0F0F0F;" ${kSub}>ĐA NHIỆM TỐT • 2 MÀN HÌNH LINH HOẠT</div>
          <svg width="760" height="350" viewBox="0 0 760 350" fill="none" style="flex:1;width:100%;">
            <!-- Outer unfolded tablet silhouette -->
            <rect x="20" y="10" width="720" height="330" rx="22" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
            <!-- Left screen: Green work workspace -->
            <rect x="44" y="30" width="320" height="290" rx="18" fill="#136636" stroke="#0F0F0F" stroke-width="4.5"/>
            <rect x="64" y="52" width="280" height="86" rx="12" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="3.5"/>
            <text x="204" y="104" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-weight="900" font-size="24" fill="#0F0F0F">APP 01 • GHI CHÚ</text>
            <text x="204" y="205" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-weight="900" font-size="28" fill="#EFE9D9">MÀN HÌNH LỚN</text>
            <text x="204" y="246" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="20" fill="#EFE9D9">WORK + MULTI-APP</text>

            <!-- Folding hinge bar -->
            <rect x="368" y="20" width="24" height="310" rx="12" fill="#0F0F0F"/>

            <!-- Right screen: Yellow flexible display -->
            <rect x="396" y="30" width="320" height="290" rx="18" fill="#F5C518" stroke="#0F0F0F" stroke-width="4.5"/>
            <rect x="416" y="52" width="280" height="86" rx="12" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="3.5"/>
            <text x="556" y="104" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-weight="900" font-size="24" fill="#0F0F0F">APP 02 • ĐA NHIỆM</text>
            <text x="556" y="205" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-weight="900" font-size="28" fill="#0F0F0F">LINH HOẠT GẬP MỞ</text>
            <text x="556" y="246" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="800" font-size="20" fill="#0F0F0F">ỔN ĐỊNH &amp; MƯỢT ✓</text>
          </svg>
        </div>
      </div>

      <!-- Lower Final Gold Headline + Rotated Seal -->
      <div class="sz-lower" style="display:flex;flex-direction:column;justify-content:space-between;gap:20px;">
        <div id="s17-verdict" class="cm-card-yellow cm-shadow-ink" style="flex:1;padding:30px;display:flex;flex-direction:column;justify-content:center;gap:12px;">
          <div class="cm-mono" style="font-size:18px;">KẾT LUẬN SAU TRẢI NGHIỆM</div>
          <div class="cm-head" style="font-size:52px;color:#0F0F0F;" ${kTitle}>LỰA CHỌN GẦN NHƯ DUY NHẤT</div>
        </div>

        <div id="s17-seal-wrap" data-layout-allow-overlap data-layout-allow-occlusion>
          <div class="cm-card cm-shadow-ink cm-rot-neg3" style="padding:20px 26px;text-align:center;">
            <div class="cm-head" style="font-size:30px;color:#136636;" ${kStamp}>GALAXY Z FOLD 8 • HIỆN TẠI ✓</div>
          </div>
        </div>
      </div>`;

    const js = `
      tl.fromTo("#s17-dual-card", { y: -24, scale: 0.94, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.50, ease: "back.out(1.2)" }, 0.25);
      tl.fromTo("#s17-verdict", { scale: 0.88, y: 30, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.52, ease: "back.out(1.35)" }, 2.90);
      tl.fromTo("#s17-seal-wrap", { scale: 0.84, y: 24, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.48, ease: "back.out(1.4)" }, 4.45);
    `;
    return wrapScene(this.id, body, '', js);
  },
});

// >>> [PASS-THROUGH 2] 95.90 -> 100.23 (dur 4.33s): Red Chinese Square Foldable Twist Outro + Burned Text (NO overlay, NO SFX)

// =========================================================================
// Write All Sub-Compositions + Collect Track-2/Track-3 Safe Audio Clips
// =========================================================================
const trackEnds = { 2: 0, 3: 0 };
const audioTags = [];
let sfxCounter = 1;

for (const sc of scenes) {
  const html = sc.build();
  writeFileSync(join(COMP_DIR, `${sc.id}.html`), html, 'utf8');

  for (const [offsetSec, sampleName] of sc.sfx) {
    const absStart = +(sc.start + offsetSec).toFixed(3);
    const wavDur = sfxManifest[sampleName] || 0.4;
    // Clamp duration inside scene span and avoid overlapping same track
    const safeDur = +Math.min(wavDur, Math.max(0.15, sc.start + sc.duration - absStart - 0.05)).toFixed(3);
    let track = 2;
    if (absStart < trackEnds[2] + 0.02) {
      track = 3;
    }
    trackEnds[track] = Math.max(trackEnds[track], absStart + safeDur);
    const sfxId = `sfx-${String(sfxCounter++).padStart(2, '0')}`;
    audioTags.push(
      `      <audio id="${sfxId}" class="clip" src="assets/sfx/${sampleName}.wav" data-start="${absStart}" data-duration="${safeDur}" data-track-index="${track}" data-volume="0.38"></audio>`
    );
  }
}

const compTags = scenes
  .map(
    (sc) =>
      `      <div id="${sc.id}" class="clip scene-slot" data-composition-id="${sc.id}" data-composition-src="compositions/${sc.id}.html" data-start="${sc.start.toFixed(2)}" data-duration="${sc.duration.toFixed(2)}" data-track-index="1" data-label="${sc.id} (${sc.start.toFixed(2)}s)"></div>`
  )
  .join('\n');

const escapedVarsJson = JSON.stringify(VARIABLES).replace(/'/g, '&#39;');

const indexHtml = `<!DOCTYPE html>
<html lang="vi" data-composition-variables='${escapedVarsJson}'>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920, initial-scale=1.0" />
    <title>Galaxy Z Fold 8 — 9:16 Creative Motion</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@500;600;700;800;900&family=Inter:wght@500;700;800;900&family=JetBrains+Mono:wght@600;700;800&display=swap" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.12/dist/gsap.min.js"></script>
    <style>
      :root {
        --paper: #EFE9D9;
        --paper_alt: #E4DCC4;
        --ink: #0F0F0F;
        --accent_green: #136636;
        --accent_pink: #F06CA8;
        --accent_orange: #E85A1F;
        --accent_yellow: #F5C518;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #0F0F0F;
      }
      #composition {
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
        display: block;
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
    <div
      id="composition"
      data-composition-id="main"
      data-width="1080"
      data-height="1920"
      data-fps="30"
      data-duration="100.23"
    >
      <video
        id="master-video"
        class="clip"
        src="assets/source.mp4"
        playsinline
        data-has-audio="true"
        data-start="0"
        data-duration="100.23"
        data-track-index="0"
        data-volume="1"
      ></video>

      <!-- Track 1: 17 Motion Compositions (gaps 40.30..43.50 and 95.90..100.23 are strict 100% Pass-through) -->
${compTags}

      <!-- Track 2 / 3: Trimmed SFX + Deep Thump locked to GSAP keyframes at volume 0.38 -->
${audioTags.join('\n')}
    </div>

    <script>
      const tl = gsap.timeline({ paused: true });
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = tl;
      window.__hfApplyVariables = function (vars) {
        if (!vars) return;
        const root = document.documentElement;
        for (const [k, v] of Object.entries(vars)) {
          if (k === 'accent_green' || k === 'accent_pink' || k === 'accent_orange' || k === 'accent_yellow' || k === 'paper' || k === 'ink') {
            root.style.setProperty('--' + k, String(v));
          }
          document.querySelectorAll('[data-var-text="' + k + '"]').forEach((el) => {
            el.textContent = String(v);
          });
        }
      };
    </script>
  </body>
</html>
`;

writeFileSync(join(OUT, 'index.html'), indexHtml, 'utf8');
console.log(`Built ${scenes.length} compositions + ${audioTags.length} SFX tags cleanly in ${OUT}`);
