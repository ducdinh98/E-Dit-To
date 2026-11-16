import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("videos/nvidia-drama");
const COMP_DIR = path.join(ROOT, "compositions");
const BROLL_DIR = path.join(ROOT, "assets/broll");
const SFX_DIR = path.join(ROOT, "assets/sfx");

fs.mkdirSync(COMP_DIR, { recursive: true });

// --- Asset Verification ---
const VOICE_PATH = path.join(ROOT, "assets/voice-master.mp3");
if (!fs.existsSync(VOICE_PATH)) {
  throw new Error(`Missing voice master: ${VOICE_PATH}`);
}

const SFX_SPEC_MAP = {
  whoosh: { file: "whoosh-short.wav", dur: 0.36, vol: 0.09, label: "Whoosh" },
  swipe: { file: "whoosh-short.wav", dur: 0.32, vol: 0.08, label: "Swipe" },
  pop: { file: "pop.wav", dur: 0.24, vol: 0.16, label: "Pop" },
  click: { file: "click-soft.wav", dur: 0.20, vol: 0.16, label: "Click" },
  key: { file: "key-press.wav", dur: 0.18, vol: 0.15, label: "Key Press" },
  ding: { file: "chime.wav", dur: 0.50, vol: 0.22, label: "Chime" },
  ping: { file: "ping.wav", dur: 0.45, vol: 0.24, label: "Ping" },
  notify: { file: "notification.wav", dur: 0.55, vol: 0.20, label: "Notify" },
  sparkle: { file: "sparkle.wav", dur: 0.60, vol: 0.18, label: "Sparkle" },
  slam: { file: "thump.wav", dur: 0.24, vol: 0.07, label: "Slam" },
  warn: { file: "error.wav", dur: 0.36, vol: 0.16, label: "Warning" },
};

for (const [key, spec] of Object.entries(SFX_SPEC_MAP)) {
  const f = path.join(SFX_DIR, spec.file);
  if (!fs.existsSync(f)) {
    throw new Error(`Missing SFX "${key}" file: ${f}`);
  }
}

// --- Composition Variables & SFX Scheduler ---
const COMP_VARS = [];
function regVar(key, label, defVal) {
  COMP_VARS.push({ id: key, type: "string", label, default: String(defVal) });
  return key;
}

const RAW_SFX_EVENTS = [];
function queueSfx(sceneStart, tLocal, kind) {
  const spec = SFX_SPEC_MAP[kind];
  if (!spec) throw new Error(`Unknown SFX kind: ${kind}`);
  const start = Number((sceneStart + Math.max(0.02, tLocal)).toFixed(3));
  if (start + spec.dur > 734.09) return;
  RAW_SFX_EVENTS.push({
    start,
    dur: spec.dur,
    vol: spec.vol,
    file: spec.file,
    label: spec.label,
  });
}

// --- Inline Vector Flags & Editorial Icons (ZERO EMOJIS) ---
const FLAGS = {
  US: `<svg class="cm-flag" viewBox="0 0 60 40" width="42" height="28" aria-label="US Flag"><rect width="60" height="40" rx="5" fill="#FFFFFF" stroke="#0F0F0F" stroke-width="2.5"/><g fill="#B91C1C"><rect y="2" width="60" height="3.2"/><rect y="8.4" width="60" height="3.2"/><rect y="14.8" width="60" height="3.2"/><rect y="21.2" width="60" height="3.2"/><rect y="27.6" width="60" height="3.2"/><rect y="34" width="60" height="3.2"/></g><rect width="27" height="21.5" rx="3" fill="#1E3A8A" stroke="#0F0F0F" stroke-width="2"/><g fill="#FFFFFF"><circle cx="6.5" cy="5.5" r="1.3"/><circle cx="13.5" cy="5.5" r="1.3"/><circle cx="20.5" cy="5.5" r="1.3"/><circle cx="10" cy="10.7" r="1.3"/><circle cx="17" cy="10.7" r="1.3"/><circle cx="6.5" cy="16" r="1.3"/><circle cx="13.5" cy="16" r="1.3"/><circle cx="20.5" cy="16" r="1.3"/></g></svg>`,
  CN: `<svg class="cm-flag" viewBox="0 0 60 40" width="42" height="28" aria-label="China Flag"><rect width="60" height="40" rx="5" fill="#DC2626" stroke="#0F0F0F" stroke-width="2.5"/><polygon points="12,6.5 13.7,11.6 19,11.6 14.7,14.7 16.3,19.8 12,16.7 7.7,19.8 9.3,14.7 5,11.6 10.3,11.6" fill="#F5C518"/><circle cx="23.5" cy="7.5" r="1.7" fill="#F5C518"/><circle cx="26" cy="12" r="1.7" fill="#F5C518"/><circle cx="24" cy="17" r="1.7" fill="#F5C518"/><circle cx="20" cy="20.5" r="1.7" fill="#F5C518"/></svg>`,
  SG: `<svg class="cm-flag" viewBox="0 0 60 40" width="42" height="28" aria-label="Singapore Flag"><rect width="60" height="40" rx="5" fill="#FFFFFF" stroke="#0F0F0F" stroke-width="2.5"/><rect width="60" height="20" rx="3" fill="#DC2626"/><rect x="1.2" y="1.2" width="57.6" height="37.6" rx="4" fill="none" stroke="#0F0F0F" stroke-width="2"/><path d="M16 5.5 A7 7 0 1 0 16 16.5 A5.5 5.5 0 1 1 16 5.5 Z" fill="#FFFFFF"/><circle cx="19" cy="8.5" r="1.1" fill="#FFFFFF"/><circle cx="22.5" cy="10.8" r="1.1" fill="#FFFFFF"/><circle cx="21" cy="14.2" r="1.1" fill="#FFFFFF"/><circle cx="17" cy="14.2" r="1.1" fill="#FFFFFF"/><circle cx="15.5" cy="10.8" r="1.1" fill="#FFFFFF"/></svg>`,
  MY: `<svg class="cm-flag" viewBox="0 0 60 40" width="42" height="28" aria-label="Malaysia Flag"><rect width="60" height="40" rx="5" fill="#FFFFFF" stroke="#0F0F0F" stroke-width="2.5"/><g fill="#DC2626"><rect y="2" width="60" height="3"/><rect y="8" width="60" height="3"/><rect y="14" width="60" height="3"/><rect y="20" width="60" height="3"/><rect y="26" width="60" height="3"/><rect y="32" width="60" height="3"/></g><rect width="29" height="22" rx="3" fill="#1E3A8A" stroke="#0F0F0F" stroke-width="2"/><path d="M13 5.5 A6 6 0 1 0 13 16.5 A4.6 4.6 0 1 1 13 5.5 Z" fill="#F5C518"/><polygon points="20,7 21.3,10 24.5,10 22,12 23,15 20,13.2 17,15 18,12 15.5,10 18.7,10" fill="#F5C518"/></svg>`,
  TW: `<svg class="cm-flag" viewBox="0 0 60 40" width="42" height="28" aria-label="Taiwan Flag"><rect width="60" height="40" rx="5" fill="#DC2626" stroke="#0F0F0F" stroke-width="2.5"/><rect width="28" height="20" rx="3" fill="#1E3A8A" stroke="#0F0F0F" stroke-width="2"/><circle cx="14" cy="10" r="4.5" fill="#FFFFFF"/><polygon points="14,3.5 15.5,7 19,6 17,9 20,10 17,11 19,14 15.5,13 14,16.5 12.5,13 9,14 11,11 8,10 11,9 9,6 12.5,7" fill="none" stroke="#FFFFFF" stroke-width="1.3"/></svg>`,
  MX: `<svg class="cm-flag" viewBox="0 0 60 40" width="42" height="28" aria-label="Mexico Flag"><rect width="60" height="40" rx="5" fill="#FFFFFF" stroke="#0F0F0F" stroke-width="2.5"/><rect x="1.2" y="1.2" width="19" height="37.6" rx="3" fill="#136636"/><rect x="39.8" y="1.2" width="19" height="37.6" rx="3" fill="#DC2626"/><circle cx="30" cy="20" r="5" fill="#92400E" stroke="#0F0F0F" stroke-width="1.5"/><rect x="1.2" y="1.2" width="57.6" height="37.6" rx="4" fill="none" stroke="#0F0F0F" stroke-width="2"/></svg>`,
  KR: `<svg class="cm-flag" viewBox="0 0 60 40" width="42" height="28" aria-label="South Korea Flag"><rect width="60" height="40" rx="5" fill="#FFFFFF" stroke="#0F0F0F" stroke-width="2.5"/><circle cx="30" cy="20" r="8.5" fill="#DC2626" stroke="#0F0F0F" stroke-width="1.5"/><path d="M21.5 20 A8.5 8.5 0 0 0 38.5 20 A4.25 4.25 0 0 1 30 20 A4.25 4.25 0 0 0 21.5 20 Z" fill="#1D4ED8"/><g stroke="#0F0F0F" stroke-width="2.2" stroke-linecap="round"><line x1="11" y1="10" x2="17" y2="6"/><line x1="13" y1="13" x2="19" y2="9"/><line x1="43" y1="6" x2="49" y2="10"/><line x1="41" y1="9" x2="47" y2="13"/><line x1="11" y1="30" x2="17" y2="34"/><line x1="43" y1="34" x2="49" y2="30"/></g></svg>`,
};

const ICONS = {
  alert: `<svg viewBox="0 0 32 32" width="24" height="24"><polygon points="16,3 30,28 2,28" fill="#F5C518" stroke="#0F0F0F" stroke-width="3" stroke-linejoin="round"/><line x1="16" y1="11" x2="16" y2="19" stroke="#0F0F0F" stroke-width="3" stroke-linecap="round"/><circle cx="16" cy="23.5" r="1.8" fill="#0F0F0F"/></svg>`,
  shield: `<svg viewBox="0 0 32 32" width="24" height="24"><path d="M16 3 L27 7 V15 C27 22.5 22 27.5 16 29.5 C10 27.5 5 22.5 5 15 V7 Z" fill="#136636" stroke="#0F0F0F" stroke-width="2.8" stroke-linejoin="round"/><path d="M11 16 L14.5 19.5 L21.5 12" fill="none" stroke="#EFE9D9" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  cpu: `<svg viewBox="0 0 32 32" width="24" height="24"><rect x="7" y="7" width="18" height="18" rx="3" fill="#4FA7F5" stroke="#0F0F0F" stroke-width="2.6"/><rect x="11.5" y="11.5" width="9" height="9" rx="1.5" fill="#F5C518" stroke="#0F0F0F" stroke-width="2"/><path d="M11 3 V7 M16 3 V7 M21 3 V7 M11 25 V29 M16 25 V29 M21 25 V29 M3 11 H7 M3 16 H7 M3 21 H7 M25 11 H29 M25 16 H29 M25 21 H29" stroke="#0F0F0F" stroke-width="2.4" stroke-linecap="round"/></svg>`,
  gavel: `<svg viewBox="0 0 32 32" width="24" height="24"><rect x="4" y="24" width="24" height="5" rx="2" fill="#0F0F0F"/><rect x="11" y="5" width="12" height="8" rx="2" transform="rotate(-35 17 9)" fill="#E85A1F" stroke="#0F0F0F" stroke-width="2.4"/><line x1="17" y1="12" x2="26" y2="22" stroke="#0F0F0F" stroke-width="3.2" stroke-linecap="round"/></svg>`,
  mail: `<svg viewBox="0 0 32 32" width="24" height="24"><rect x="3" y="6" width="26" height="20" rx="4" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="2.8"/><path d="M4 8 L16 18 L28 8" fill="none" stroke="#0F0F0F" stroke-width="2.8" stroke-linejoin="round"/></svg>`,
  dollar: `<svg viewBox="0 0 32 32" width="24" height="24"><circle cx="16" cy="16" r="13" fill="#F5C518" stroke="#0F0F0F" stroke-width="2.8"/><path d="M16 7 V25 M20 11.5 C20 9.5 18 8.5 16 8.5 C13.5 8.5 12 9.8 12 11.5 C12 15.5 20.5 14.5 20.5 19.5 C20.5 21.5 18.5 23 16 23 C13 23 11.5 21.5 11.5 19.5" fill="none" stroke="#0F0F0F" stroke-width="2.6" stroke-linecap="round"/></svg>`,
  doc: `<svg viewBox="0 0 32 32" width="24" height="24"><path d="M7 3 H20 L26 9 V29 H7 Z" fill="#FBF7EC" stroke="#0F0F0F" stroke-width="2.6" stroke-linejoin="round"/><path d="M19 3 V10 H26" fill="none" stroke="#0F0F0F" stroke-width="2.4"/><line x1="11" y1="15" x2="22" y2="15" stroke="#0F0F0F" stroke-width="2.4" stroke-linecap="round"/><line x1="11" y1="21" x2="19" y2="21" stroke="#0F0F0F" stroke-width="2.4" stroke-linecap="round"/></svg>`,
  phone: `<svg viewBox="0 0 32 32" width="24" height="24"><path d="M6.5 5 H12 L14.5 11 L11 13.5 C12.8 17 15 19.2 18.5 21 L21 17.5 L27 20 V25.5 C27 26.8 25.8 28 24.3 28 C14.5 27.5 4.5 17.5 4 7.7 C4 6.2 5.2 5 6.5 5 Z" fill="#E85A1F" stroke="#0F0F0F" stroke-width="2.6" stroke-linejoin="round"/></svg>`,
  lock: `<svg viewBox="0 0 32 32" width="24" height="24"><path d="M10 14 V10 A6 6 0 0 1 22 10 V14" fill="none" stroke="#0F0F0F" stroke-width="3.2" stroke-linecap="round"/><rect x="6" y="14" width="20" height="14" rx="4" fill="#F5C518" stroke="#0F0F0F" stroke-width="2.8"/><circle cx="16" cy="21" r="2.2" fill="#0F0F0F"/></svg>`,
  arrowRight: `<svg viewBox="0 0 36 24" width="32" height="22"><path d="M2 12 H30 M22 4 L31 12 L22 20" fill="none" stroke="#0F0F0F" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  broken: `<svg viewBox="0 0 32 32" width="24" height="24"><circle cx="16" cy="16" r="12.5" fill="#DC2626" stroke="#0F0F0F" stroke-width="2.6"/><path d="M11 11 L21 21 M21 11 L11 21" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/></svg>`,
};

// --- Shared CSS ---
const BASE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@500;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1920px; height: 1080px; overflow: hidden; background: #EFE9D9; }
  #root {
    position: absolute;
    inset: 0;
    width: 1920px;
    height: 1080px;
    overflow: hidden;
    background: #EFE9D9;
    color: #0F0F0F;
    font-family: 'Be Vietnam Pro', sans-serif;
    line-height: 1.18;
    -webkit-font-smoothing: antialiased;
  }
  .cm-canvas {
    position: relative;
    width: 1920px;
    height: 1080px;
    overflow: hidden;
    background: #EFE9D9;
    color: #0F0F0F;
  }
  .cm-canvas.cm-outro { background: #136636; color: #EFE9D9; }
  .cm-grid-bg {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(to right, rgba(15,15,15,0.055) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(15,15,15,0.055) 1px, transparent 1px);
    background-size: 64px 64px;
    pointer-events: none;
  }
  .cm-canvas.cm-outro .cm-grid-bg {
    background-image:
      linear-gradient(to right, rgba(239,233,217,0.09) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(239,233,217,0.09) 1px, transparent 1px);
  }
  .cm-corner {
    position: absolute;
    width: 34px;
    height: 34px;
    border-color: #0F0F0F;
    border-style: solid;
    pointer-events: none;
  }
  .cm-canvas.cm-outro .cm-corner { border-color: #EFE9D9; }
  .cm-corner.tl { top: 28px; left: 28px; border-width: 4px 0 0 4px; border-top-left-radius: 10px; }
  .cm-corner.tr { top: 28px; right: 28px; border-width: 4px 4px 0 0; border-top-right-radius: 10px; }
  .cm-corner.bl { bottom: 28px; left: 28px; border-width: 0 0 4px 4px; border-bottom-left-radius: 10px; }
  .cm-corner.br { bottom: 28px; right: 28px; border-width: 0 4px 4px 0; border-bottom-right-radius: 10px; }

  .cm-header {
    position: absolute;
    top: 44px;
    left: 68px;
    right: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }
  .cm-kicker {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #F5C518;
    color: #0F0F0F;
    border: 3.5px solid #0F0F0F;
    border-radius: 14px;
    padding: 8px 18px;
    font-size: 22px;
    font-weight: 800;
    letter-spacing: 0.02em;
    box-shadow: 5px 5px 0 #0F0F0F;
    line-height: 1.18;
  }
  .cm-kicker.dark { background: #136636; color: #EFE9D9; }
  .cm-kicker.orange { background: #E85A1F; color: #0F0F0F; }
  .cm-kicker.cream { background: #FBF7EC; color: #0F0F0F; }

  .cm-date-pill {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #0F0F0F;
    color: #EFE9D9;
    border: 3px solid #0F0F0F;
    border-radius: 14px;
    padding: 8px 18px;
    font-size: 22px;
    font-weight: 800;
    box-shadow: 5px 5px 0 #E85A1F;
    line-height: 1.18;
  }

  .cm-wayb-win {
    position: absolute;
    border-radius: 22px;
    border: 5px solid #0F0F0F;
    overflow: hidden;
    background: #141414;
    box-shadow: 10px 10px 0 #E85A1F;
  }
  .cm-wayb-win.shadow-green { box-shadow: 10px 10px 0 #136636; }
  .cm-wayb-win.shadow-yellow { box-shadow: 10px 10px 0 #F5C518; }
  .cm-wayb-win.shadow-ink { box-shadow: 10px 10px 0 #0F0F0F; }
  .cm-wayb-win video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .cm-waya-full {
    position: absolute;
    inset: 0;
    background: #0F0F0F;
    overflow: hidden;
  }
  .cm-waya-full video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .cm-waya-scrim {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(15,15,15,0.62) 0%, rgba(15,15,15,0) 28%, rgba(15,15,15,0) 62%, rgba(15,15,15,0.78) 100%);
    pointer-events: none;
  }

  .cm-card {
    background: #FBF7EC;
    color: #0F0F0F;
    border: 4px solid #0F0F0F;
    border-radius: 20px;
    padding: 18px 24px;
    box-shadow: 7px 7px 0 #0F0F0F;
    line-height: 1.2;
  }
  .cm-card.orange-shadow { box-shadow: 7px 7px 0 #E85A1F; }
  .cm-card.green-shadow { box-shadow: 7px 7px 0 #136636; }
  .cm-card.yellow { background: #F5C518; color: #0F0F0F; }
  .cm-card.orange { background: #E85A1F; color: #0F0F0F; }
  .cm-card.green { background: #136636; color: #EFE9D9; }
  .cm-card.dark { background: #161618; color: #EFE9D9; }

  .cm-stat-num {
    font-size: 56px;
    font-weight: 900;
    line-height: 1.12;
    letter-spacing: -0.02em;
  }
  .cm-h1 {
    font-size: 46px;
    font-weight: 900;
    line-height: 1.15;
    letter-spacing: -0.015em;
  }
  .cm-h2 {
    font-size: 32px;
    font-weight: 800;
    line-height: 1.18;
  }
  .cm-body {
    font-size: 24px;
    font-weight: 700;
    line-height: 1.24;
  }
  .cm-sub {
    font-size: 19px;
    font-weight: 700;
    line-height: 1.24;
    color: #262626;
  }
  .cm-card.green .cm-sub, .cm-card.dark .cm-sub { color: #E4DCC4; }
  .cm-orange-ink { color: #B83B0B; }
  .cm-green-ink { color: #136636; }
  .cm-hl-yellow {
    display: inline;
    background: #F5C518;
    color: #0F0F0F;
    padding: 2px 8px;
    border-radius: 6px;
  }

  .cm-lower-banner {
    position: absolute;
    left: 68px;
    right: 68px;
    bottom: 42px;
    display: flex;
    align-items: stretch;
    justify-content: center;
    gap: 18px;
  }
  .cm-float-badge {
    position: absolute;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px;
    border-radius: 16px;
    border: 4px solid #0F0F0F;
    font-size: 23px;
    font-weight: 800;
    line-height: 1.18;
    box-shadow: 6px 6px 0 #0F0F0F;
  }
  .cm-stamp {
    position: absolute;
    border: 5px solid #B83B0B;
    color: #B83B0B;
    background: rgba(251, 247, 236, 0.96);
    border-radius: 14px;
    padding: 10px 22px;
    font-size: 26px;
    font-weight: 900;
    letter-spacing: 0.04em;
    line-height: 1.15;
    box-shadow: 5px 5px 0 #0F0F0F;
  }
  .cm-evidence-paper {
    background: #FBF7EC;
    color: #0F0F0F;
    border: 4px solid #0F0F0F;
    border-radius: 20px;
    box-shadow: 10px 10px 0 #0F0F0F;
    padding: 28px 34px;
  }
  .cm-masthead {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 14px;
    margin-bottom: 18px;
    border-bottom: 3.5px solid #0F0F0F;
    font-size: 21px;
    font-weight: 900;
    letter-spacing: 0.04em;
  }
  .cm-flag {
    display: inline-block;
    vertical-align: middle;
    flex-shrink: 0;
  }
`;

// --- Helper: Wrap Scene Template ---
function wrapScene(num, title, dur, bodyHtml, jsBody, extraCss = "", isOutro = false) {
  const numStr = String(num).padStart(2, "0");
  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=1920, height=1080" />
<title>Scene ${numStr} — ${title}</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
</head>
<body>
<template>
<style>${BASE_CSS}${extraCss}</style>
<div id="root" data-composition-id="scene-${numStr}" data-width="1920" data-height="1080" data-fps="60" data-duration="${dur.toFixed(2)}">
  <div class="cm-canvas${isOutro ? " cm-outro" : ""}" data-layout-allow-overlap>
    <div class="cm-grid-bg" data-layout-allow-overlap></div>
    <div class="cm-corner tl" data-layout-allow-overlap></div>
    <div class="cm-corner tr" data-layout-allow-overlap></div>
    <div class="cm-corner bl" data-layout-allow-overlap></div>
    <div class="cm-corner br" data-layout-allow-overlap></div>
    ${bodyHtml}
  </div>
</div>
<script>
(function() {
  const host = document.querySelector('#slot-scene-${numStr}');
  const scope = (host && host.shadowRoot)
    ? (host.shadowRoot.querySelector('#root') || host.shadowRoot)
    : (document.querySelector('#slot-scene-${numStr} #root')
       || document.querySelector('#root[data-composition-id="scene-${numStr}"]')
       || document.getElementById('root'));
  if (!scope || typeof gsap === 'undefined') return;
  const q = (sel) => scope.querySelector(sel);
  const qa = (sel) => Array.from(scope.querySelectorAll(sel));
  window.__timelines = window.__timelines || {};
  const tl = gsap.timeline({ paused: true });
  const popIn = (sel, t, fromVars = { y: 20, scale: 0.92 }, toVars = { y: 0, scale: 1 }, dur = 0.40, ease = 'back.out(1.4)') => {
    const el = typeof sel === 'string' ? q(sel) : sel;
    if (!el) return;
    if (t <= 0.25) {
      tl.fromTo(el, fromVars, { ...toVars, duration: dur, ease }, t);
    } else {
      tl.set(el, { autoAlpha: 0 }, 0);
      tl.fromTo(el, { autoAlpha: 1, ...fromVars }, { autoAlpha: 1, ...toVars, duration: dur, ease, immediateRender: false }, t);
    }
  };
  ${jsBody}
  tl.set(scope, { opacity: 1 }, ${dur.toFixed(2)});
  window.__timelines["scene-${numStr}"] = tl;
})();
</script>
</template>
</body>
</html>
`;
}

// --- Way B Builder (32 Scenes) ---
function buildWayBScene(spec) {
  const {
    num,
    title,
    start,
    dur,
    broll,
    kicker,
    kickerStyle = "",
    datePill,
    flags = [],
    shadow = "orange",
    winRect = { left: 288, top: 128, width: 1344, height: 756 },
    cornerBadges = [],
    bottomCards = [],
    sideCards = [],
    stamp = null,
    miniClip = null,
    arrowsSvg = "",
    prefix = `s${String(num).padStart(2, "0")}`,
  } = spec;

  const numStr = String(num).padStart(2, "0");
  const shadowClass = shadow === "green" ? "shadow-green" : shadow === "yellow" ? "shadow-yellow" : shadow === "ink" ? "shadow-ink" : "";
  const kickerKey = regVar(`${prefix}_kicker`, `Cảnh ${numStr} — Nhãn tiêu đề`, kicker);
  const dateKey = regVar(`${prefix}_date`, `Cảnh ${numStr} — Mốc thời gian`, datePill);

  const flagsHtml = flags.map((f) => FLAGS[f] || "").join("");

  const headerHtml = `
    <div class="cm-header">
      <div class="cm-kicker ${kickerStyle}" id="${prefix}-kicker">
        ${flagsHtml}
        <span data-var="${kickerKey}">${kicker}</span>
      </div>
      <div class="cm-date-pill" id="${prefix}-date">
        <span data-var="${dateKey}">${datePill}</span>
      </div>
    </div>`;

  const winHtml = `
    <div class="cm-wayb-win ${shadowClass}" id="${prefix}-win" data-layout-allow-overlap style="left:${winRect.left}px;top:${winRect.top}px;width:${winRect.width}px;height:${winRect.height}px;">
      <video id="vid_wb_${numStr}" class="clip" data-layout-allow-overlap src="../assets/broll/${broll}" data-start="0" data-duration="${dur.toFixed(2)}" muted playsinline></video>
    </div>`;

  const cornerHtml = cornerBadges
    .map((b, idx) => {
      const bKey = regVar(`${prefix}_cb${idx + 1}`, `Cảnh ${numStr} — Thẻ góc ${idx + 1}`, b.text);
      const bg = b.bg || "#F5C518";
      const fg = bg === "#136636" || bg === "#161618" ? "#EFE9D9" : "#0F0F0F";
      const iconHtml = b.icon ? ICONS[b.icon] || "" : "";
      const pos = [];
      if (b.top !== undefined) pos.push(`top:${b.top}px`);
      if (b.left !== undefined) pos.push(`left:${b.left}px`);
      if (b.right !== undefined) pos.push(`right:${b.right}px`);
      if (b.bottom !== undefined) pos.push(`bottom:${b.bottom}px`);
      return `<div class="cm-float-badge" id="${prefix}-cb-${idx}" data-layout-allow-overlap data-layout-allow-occlusion style="${pos.join(";")};background:${bg};color:${fg};">
        ${iconHtml}<span data-var="${bKey}">${b.text}</span>
      </div>`;
    })
    .join("\n");

  const sideHtml = sideCards
    .map((c, idx) => {
      const tKey = regVar(`${prefix}_sc_t${idx + 1}`, `Cảnh ${numStr} — Thẻ cạnh ${idx + 1} (Tiêu đề)`, c.title);
      const sKey = c.sub ? regVar(`${prefix}_sc_s${idx + 1}`, `Cảnh ${numStr} — Thẻ cạnh ${idx + 1} (Mô tả)`, c.sub) : null;
      const cls = c.variant || "orange-shadow";
      const pos = [`top:${c.top}px`];
      if (c.left !== undefined) pos.push(`left:${c.left}px`);
      if (c.right !== undefined) pos.push(`right:${c.right}px`);
      if (c.width !== undefined) pos.push(`width:${c.width}px`);
      return `<div class="cm-card ${cls}" id="${prefix}-sc-${idx}" style="position:absolute;${pos.join(";")};padding:14px 20px;">
        <div style="display:flex;align-items:center;gap:10px;font-size:24px;font-weight:900;line-height:1.18;">
          ${c.flag ? FLAGS[c.flag] : ""}${c.icon ? ICONS[c.icon] : ""}
          <span data-var="${tKey}">${c.title}</span>
        </div>
        ${c.sub ? `<div class="cm-sub" style="margin-top:6px;font-size:18px;" data-var="${sKey}">${c.sub}</div>` : ""}
      </div>`;
    })
    .join("\n");

  const bottomHtml =
    bottomCards.length > 0
      ? `<div class="cm-lower-banner" id="${prefix}-lower">
          ${bottomCards
            .map((c, idx) => {
              const tKey = regVar(`${prefix}_bc_t${idx + 1}`, `Cảnh ${numStr} — Nhãn đáy ${idx + 1}`, c.title);
              const sKey = c.sub ? regVar(`${prefix}_bc_s${idx + 1}`, `Cảnh ${numStr} — Phụ đề đáy ${idx + 1}`, c.sub) : null;
              const cls = c.variant || "green-shadow";
              const wStyle = c.flex ? `flex:${c.flex};` : "flex:1;";
              return `<div class="cm-card ${cls}" id="${prefix}-bc-${idx}" style="${wStyle}padding:14px 22px;display:flex;align-items:center;gap:14px;">
                ${c.flag ? FLAGS[c.flag] : ""}${c.icon ? ICONS[c.icon] : ""}
                <div style="min-width:0;">
                  <div style="font-size:25px;font-weight:900;line-height:1.18;" data-var="${tKey}">${c.title}</div>
                  ${c.sub ? `<div class="cm-sub" style="margin-top:4px;font-size:18px;" data-var="${sKey}">${c.sub}</div>` : ""}
                </div>
              </div>`;
            })
            .join("")}
        </div>`
      : "";

  const miniHtml = miniClip
    ? (() => {
        const mHead = regVar(`${prefix}_mh`, `Cảnh ${numStr} — Tiêu đề báo`, miniClip.headline);
        return `<div class="cm-evidence-paper" id="${prefix}-mini" data-layout-allow-overlap data-layout-allow-occlusion style="position:absolute;top:${miniClip.top}px;right:${miniClip.right}px;width:${miniClip.width || 430}px;padding:16px 20px;box-shadow:7px 7px 0 #136636;">
          <div class="cm-masthead" style="font-size:15px;padding-bottom:8px;margin-bottom:10px;">
            <span>${miniClip.source}</span>
            <span>${miniClip.date}</span>
          </div>
          <div style="font-size:19px;font-weight:800;line-height:1.25;">
            <span class="cm-hl-yellow" data-var="${mHead}">${miniClip.headline}</span>
          </div>
        </div>`;
      })()
    : "";

  const stampHtml = stamp
    ? (() => {
        const stKey = regVar(`${prefix}_stamp`, `Cảnh ${numStr} — Dấu mộc`, stamp.text);
        return `<div class="cm-stamp" id="${prefix}-stamp" data-layout-allow-overlap data-layout-allow-occlusion style="top:${stamp.top}px;${stamp.left !== undefined ? `left:${stamp.left}px;` : `right:${stamp.right}px;`}color:${stamp.color || "#B83B0B"};border-color:${stamp.color || "#B83B0B"};">
          <span data-var="${stKey}">${stamp.text}</span>
        </div>`;
      })()
    : "";

  const bodyHtml = `
    ${headerHtml}
    ${winHtml}
    ${arrowsSvg}
    ${cornerHtml}
    ${sideHtml}
    ${miniHtml}
    ${bottomHtml}
    ${stampHtml}
  `;

  // Schedule animation & voice-synced SFX
  queueSfx(start, 0.08, "whoosh");
  const animLines = [
    `tl.fromTo(q('#${prefix}-win'), { scale: 0.96 }, { scale: 1, duration: 0.45, ease: 'power3.out' }, 0);`,
    `popIn('#${prefix}-kicker', 0.06, { y: -14, scale: 0.96 }, { y: 0, scale: 1 }, 0.36, 'power2.out');`,
    `popIn('#${prefix}-date', 0.14, { y: -14, scale: 0.96 }, { y: 0, scale: 1 }, 0.36, 'power2.out');`,
  ];

  cornerBadges.forEach((b, idx) => {
    const tCue = Math.min(dur - 0.8, Math.max(0.28, b.t ?? 0.6 + idx * 1.4));
    queueSfx(start, tCue, b.sfx || "pop");
    animLines.push(
      `popIn('#${prefix}-cb-${idx}', ${tCue.toFixed(2)}, { scale: 0.82, y: 14 }, { scale: 1, y: 0 }, 0.40, 'back.out(1.6)');`
    );
  });

  sideCards.forEach((c, idx) => {
    const tCue = Math.min(dur - 0.8, Math.max(0.3, c.t ?? 1.2 + idx * 1.8));
    queueSfx(start, tCue, c.sfx || "click");
    const dx = c.left !== undefined ? -26 : 26;
    animLines.push(
      `popIn('#${prefix}-sc-${idx}', ${tCue.toFixed(2)}, { x: ${dx} }, { x: 0 }, 0.42, 'power3.out');`
    );
  });

  bottomCards.forEach((c, idx) => {
    const tCue = Math.min(dur - 0.8, Math.max(0.35, c.t ?? 1.5 + idx * 2.2));
    queueSfx(start, tCue, c.sfx || (idx === bottomCards.length - 1 ? "ping" : "click"));
    animLines.push(
      `popIn('#${prefix}-bc-${idx}', ${tCue.toFixed(2)}, { y: 24 }, { y: 0 }, 0.42, 'power3.out');`
    );
  });

  if (miniClip) {
    const tCue = Math.min(dur - 1.0, Math.max(0.5, miniClip.t ?? 2.2));
    queueSfx(start, tCue, "notify");
    animLines.push(
      `popIn('#${prefix}-mini', ${tCue.toFixed(2)}, { y: -20, rotation: -3 }, { y: 0, rotation: 1.8 }, 0.48, 'back.out(1.4)');`
    );
  }

  if (stamp) {
    const tCue = Math.min(dur - 0.7, Math.max(0.5, stamp.t ?? dur * 0.55));
    queueSfx(start, tCue, stamp.sfx || "slam");
    const rot = stamp.rot ?? -7;
    animLines.push(
      `popIn('#${prefix}-stamp', ${tCue.toFixed(2)}, { scale: 1.45, rotation: ${rot - 6} }, { scale: 1, rotation: ${rot} }, 0.34, 'back.out(2)');`
    );
  }

  if (arrowsSvg) {
    animLines.push(
      `qa('.cm-vec-arrow').forEach((p, idx) => { tl.fromTo(p, { strokeDashoffset: 320 }, { strokeDashoffset: 0, duration: 0.55, ease: 'power2.out' }, ${(Math.min(dur - 1.2, 2.0)).toFixed(2)} + idx * 0.45); });`
    );
  }

  return wrapScene(num, title, dur, bodyHtml, animLines.join("\n  "));
}

// --- Way A Builder (#03 Santa Clara HQ Aerial) ---
function buildWayAScene03() {
  const num = 3, start = 25.20, dur = 10.30;
  const k1 = regVar("s03_date1", "Cảnh 03 — Mốc cao trào", "14/11/2026 • WASHINGTON & SILICON VALLEY");
  const k2 = regVar("s03_peak", "Cảnh 03 — Đỉnh lịch sử", "06/10/2026: ĐỈNH VỐN HOÁ $5.000 TỶ USD");
  const k3 = regVar("s03_hq", "Cảnh 03 — Trụ sở", "TRỤ SỞ NVIDIA — SANTA CLARA, CALIFORNIA");
  queueSfx(start, 0.1, "whoosh");
  queueSfx(start, 1.35, "click");
  queueSfx(start, 4.05, "pop");
  queueSfx(start, 7.75, "ding");

  const bodyHtml = `
    <div class="cm-waya-full" id="s03-win" data-layout-allow-overlap>
      <video id="vid_wb_03" class="clip" data-layout-allow-overlap src="../assets/broll/shot-03.mp4" data-start="0" data-duration="${dur.toFixed(2)}" muted playsinline></video>
      <div class="cm-waya-scrim" data-layout-allow-overlap></div>
    </div>
    <div class="cm-header" style="z-index:4;">
      <div class="cm-kicker yellow" id="s03-p1" style="background:#F5C518;color:#0F0F0F;">
        ${FLAGS.US}<span data-var="${k1}">14/11/2026 • WASHINGTON & SILICON VALLEY</span>
      </div>
      <div class="cm-date-pill" id="s03-p2">${ICONS.building || ICONS.cpu}<span data-var="${k3}">TRỤ SỞ NVIDIA — SANTA CLARA, CALIFORNIA</span></div>
    </div>
    <div class="cm-lower-banner" style="z-index:4;justify-content:center;">
      <div class="cm-card yellow" id="s03-peak" style="max-width:1100px;display:flex;align-items:center;gap:18px;padding:18px 34px;box-shadow:8px 8px 0 #136636;">
        ${ICONS.dollar}
        <div class="cm-h2" data-var="${k2}">06/10/2026: ĐỈNH VỐN HOÁ $5.000 TỶ USD</div>
      </div>
    </div>
  `;
  const js = `
    popIn('#s03-p1', 1.35, { y: -20 }, { y: 0 }, 0.45, 'power3.out');
    popIn('#s03-p2', 4.05, { y: -20 }, { y: 0 }, 0.45, 'power3.out');
    popIn('#s03-peak', 7.75, { y: 28, scale: 0.92 }, { y: 0, scale: 1 }, 0.50, 'back.out(1.5)');
  `;
  return wrapScene(num, "Santa Clara HQ & Đỉnh $5.000 Tỷ", dur, bodyHtml, js);
}

// =========================================================================
// 28 BESPOKE ILLUSTRATED FULL-MOTION & EVIDENCE SCENES
// =========================================================================

function scene04() {
  const num = 4, start = 35.50, dur = 9.50;
  const hk = regVar("s04_head", "Cảnh 04 — Nhãn biểu đồ", "CÚ LAO DỐC VỐN HOÁ LỊCH SỬ");
  const dropK = regVar("s04_drop", "Cảnh 04 — Mức giảm", "LAO DỐC HƠN 30%");
  const lossK = regVar("s04_loss", "Cảnh 04 — Thiệt hại", "-$1.800+ TỶ USD BỐC HƠI");
  const gdpK = regVar("s04_gdp", "Cảnh 04 — So sánh GDP", "VƯỢT TỔNG GDP MEXICO + HÀN QUỐC");
  queueSfx(start, 0.1, "whoosh");
  queueSfx(start, 1.15, "warn");
  queueSfx(start, 3.10, "slam");
  queueSfx(start, 7.10, "ping");

  const bodyHtml = `
    <div class="cm-header">
      <div class="cm-kicker orange" id="s04-k">${ICONS.alert}<span data-var="${hk}">CÚ LAO DỐC VỐN HOÁ LỊCH SỬ</span></div>
      <div class="cm-date-pill" id="s04-d">06/10/2026 → 14/11/2026</div>
    </div>
    <div class="cm-card" id="s04-stage" style="position:absolute;left:96px;top:138px;width:1240px;height:680px;padding:26px;">
      <svg viewBox="0 0 1180 620" width="1180" height="620">
        <g stroke="#E4DCC4" stroke-width="2">
          <line x1="80" y1="80" x2="1120" y2="80"/>
          <line x1="80" y1="210" x2="1120" y2="210"/>
          <line x1="80" y1="340" x2="1120" y2="340"/>
          <line x1="80" y1="470" x2="1120" y2="470"/>
        </g>
        <line x1="80" y1="530" x2="1130" y2="530" stroke="#0F0F0F" stroke-width="4" stroke-linecap="round"/>
        <line x1="80" y1="50" x2="80" y2="530" stroke="#0F0F0F" stroke-width="4" stroke-linecap="round"/>
        <text x="68" y="90" text-anchor="end" font-size="22" font-weight="800" fill="#0F0F0F">$5.0T</text>
        <text x="68" y="348" text-anchor="end" font-size="22" font-weight="800" fill="#0F0F0F">$3.2T</text>
        <text x="160" y="575" font-size="22" font-weight="800" fill="#0F0F0F">06/10/2026 (ĐỈNH)</text>
        <text x="900" y="575" font-size="22" font-weight="800" fill="#B83B0B">14/11/2026</text>

        <path id="s04-climb" d="M 110 380 C 220 260, 340 120, 440 85" fill="none" stroke="#136636" stroke-width="9" stroke-linecap="round" stroke-dasharray="520" stroke-dashoffset="0"/>
        <polygon id="s04-area" data-layout-allow-overlap points="440,85 590,150 740,260 890,340 1050,388 1050,530 440,530" fill="rgba(232,90,31,0.18)"/>
        <path id="s04-crash" d="M 440 85 L 590 155 L 710 235 L 850 325 L 1050 390" fill="none" stroke="#B83B0B" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="800" stroke-dashoffset="800"/>

        <circle id="s04-dot-peak" cx="440" cy="85" r="14" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
        <rect x="330" y="20" width="240" height="44" rx="10" fill="#136636" stroke="#0F0F0F" stroke-width="3"/>
        <text x="450" y="49" text-anchor="middle" font-size="21" font-weight="900" fill="#EFE9D9">ĐỈNH $5.000 TỶ</text>

        <circle id="s04-dot-low" cx="1050" cy="390" r="15" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>
      </svg>
    </div>

    <div class="cm-card orange" id="s04-stat1" style="position:absolute;left:1376px;top:138px;width:476px;">
      <div style="font-size:22px;font-weight:900;letter-spacing:0.03em;">MỨC SUY GIẢM</div>
      <div class="cm-stat-num" style="margin-top:8px;" data-var="${dropK}">LAO DỐC HƠN 30%</div>
      <div class="cm-sub" style="margin-top:8px;color:#0F0F0F;">Chỉ trong 39 ngày biến động liên tiếp</div>
    </div>

    <div class="cm-card dark" id="s04-stat2" style="position:absolute;left:1376px;top:374px;width:476px;box-shadow:8px 8px 0 #E85A1F;">
      <div style="font-size:21px;font-weight:800;color:#F5C518;">GIÁ TRỊ BỊ THỔI BAY</div>
      <div class="cm-stat-num" style="margin-top:8px;font-size:48px;color:#EFE9D9;" data-var="${lossK}">-$1.800+ TỶ USD</div>
    </div>

    <div class="cm-card green-shadow" id="s04-stat3" style="position:absolute;left:1376px;top:594px;width:476px;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
        ${FLAGS.MX}<span style="font-size:26px;font-weight:900;">+</span>${FLAGS.KR}
      </div>
      <div style="font-size:27px;font-weight:900;line-height:1.18;" data-var="${gdpK}">VƯỢT TỔNG GDP MEXICO + HÀN QUỐC</div>
      <div class="cm-sub" style="margin-top:6px;">Cú xoá sổ tài sản lớn nhất lịch sử tài chính</div>
    </div>

    <div class="cm-lower-banner">
      <div class="cm-card yellow" id="s04-bot" style="flex:1;padding:16px 28px;text-align:center;">
        <span class="cm-h2">CÚ SỤP ĐỔ CHƯA TỪNG CÓ TIỀN LỆ TRÊN PHỐ WALL</span>
      </div>
    </div>
  `;
  const js = `
    popIn('#s04-k', 0, { y: -16 }, { y: 0 }, 0.35, 'back.out(1.4)');
    popIn('#s04-d', 0.08, { y: -16 }, { y: 0 }, 0.35, 'back.out(1.4)');
    popIn('#s04-stage', 0.12, { scale: 0.96 }, { scale: 1 }, 0.45, 'back.out(1.4)');
    tl.fromTo(q('#s04-crash'), { strokeDashoffset: 800 }, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut' }, 1.15);
    tl.fromTo(q('#s04-area'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2 }, 1.5);
    tl.fromTo(q('#s04-dot-low'), { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2)', svgOrigin: '1050 390' }, 3.10);
    popIn('#s04-stat1', 1.15, { x: 30 }, { x: 0 }, 0.45, 'back.out(1.4)');
    popIn('#s04-stat2', 3.10, { x: 30 }, { x: 0 }, 0.45, 'back.out(1.4)');
    popIn('#s04-stat3', 7.10, { x: 30 }, { x: 0 }, 0.45, 'back.out(1.4)');
    popIn('#s04-bot', 7.45, { y: 20 }, { y: 0 }, 0.4, 'back.out(1.4)');
  `;
  return wrapScene(num, "Cú Lao Dốc $1.800+ Tỷ", dur, bodyHtml, js);
}

function scene06() {
  const num = 6, start = 53.20, dur = 20.40;
  const k = regVar("s06_k", "Cảnh 06 — Tiêu đề", "BÍ MẬT ĐẰNG SAU CÁNH CỬA ĐÓNG KÍN");
  const s1K = regVar("s06_s1", "Cảnh 06 — Đầu mối 1", "NỮ DOANH NHÂN GỐC HOA");
  const s2K = regVar("s06_s2", "Cảnh 06 — Đầu mối 2", "VỎ BỌC SINGAPORE TỶ USD");
  const s3K = regVar("s06_s3", "Cảnh 06 — Đầu mối 3", "HAI MỐI TÌNH NỘI BỘ BỊ CHE GIẤU");
  const endK = regVar("s06_end", "Cảnh 06 — Kết quả", "ĐÁNH GỤC CEO TRONG CHƯA ĐẦY 2 TUẦN");

  queueSfx(start, 2.15, "slam");
  queueSfx(start, 4.50, "pop");
  queueSfx(start, 6.55, "pop");
  queueSfx(start, 9.85, "warn");
  queueSfx(start, 12.70, "ping");

  const bodyHtml = `
    <div class="cm-header">
      <div class="cm-kicker dark" id="s06-k">${ICONS.lock}<span data-var="${k}">BÍ MẬT ĐẰNG SAU CÁNH CỬA ĐÓNG KÍN</span></div>
      <div class="cm-date-pill" id="s06-d">BIẾN CỐ 2 TUẦN LỄ</div>
    </div>

    <div style="position:absolute;left:90px;top:145px;width:700px;height:730px;">
      <svg viewBox="0 0 700 730" width="700" height="730">
        <!-- Closed Boardroom Doors -->
        <rect x="70" y="40" width="560" height="630" rx="22" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="6"/>
        <rect id="s06-doorL" x="95" y="65" width="250" height="580" rx="14" fill="#136636" stroke="#0F0F0F" stroke-width="5"/>
        <rect id="s06-doorR" x="355" y="65" width="250" height="580" rx="14" fill="#136636" stroke="#0F0F0F" stroke-width="5"/>
        <rect x="130" y="120" width="180" height="190" rx="10" fill="#0F4D29" stroke="#0F0F0F" stroke-width="3.5"/>
        <rect x="390" y="120" width="180" height="190" rx="10" fill="#0F4D29" stroke="#0F0F0F" stroke-width="3.5"/>
        <circle cx="322" cy="360" r="11" fill="#F5C518" stroke="#0F0F0F" stroke-width="3"/>
        <circle cx="378" cy="360" r="11" fill="#F5C518" stroke="#0F0F0F" stroke-width="3"/>

        <!-- Giant Padlock Center -->
        <g id="s06-lock">
          <path d="M295 335 V285 A55 55 0 0 1 405 285 V335" fill="none" stroke="#0F0F0F" stroke-width="14" stroke-linecap="round"/>
          <rect x="260" y="330" width="180" height="145" rx="22" fill="#F5C518" stroke="#0F0F0F" stroke-width="6"/>
          <circle cx="350" cy="390" r="18" fill="#0F0F0F"/>
          <path d="M342 400 L358 400 L363 442 L337 442 Z" fill="#0F0F0F"/>
          <text x="350" y="535" text-anchor="middle" font-size="30" font-weight="900" fill="#EFE9D9">HỘI ĐỒNG QUẢN TRỊ</text>
        </g>

        <!-- Dashed Signal Connector Arcs to 3 Satellites -->
        <path id="s06-arc1" data-layout-allow-overlap d="M 605 180 C 655 180, 675 170, 700 170" fill="none" stroke="#0F0F0F" stroke-width="5" stroke-dasharray="10 8"/>
        <path id="s06-arc2" data-layout-allow-overlap d="M 605 385 C 655 385, 675 385, 700 385" fill="none" stroke="#0F0F0F" stroke-width="5" stroke-dasharray="10 8"/>
        <path id="s06-arc3" data-layout-allow-overlap d="M 605 585 C 655 585, 675 585, 700 585" fill="none" stroke="#B83B0B" stroke-width="5" stroke-dasharray="10 8"/>
      </svg>
    </div>

    <div class="cm-card orange-shadow" id="s06-sat1" style="position:absolute;left:830px;top:148px;width:995px;display:flex;align-items:center;gap:22px;">
      <div style="width:68px;height:68px;border-radius:16px;background:#E85A1F;border:3.5px solid #0F0F0F;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:900;">01</div>
      <div>
        <div style="display:flex;align-items:center;gap:12px;">
          ${FLAGS.CN}<span class="cm-h2" data-var="${s1K}">NỮ DOANH NHÂN GỐC HOA</span>
        </div>
        <div class="cm-sub" style="margin-top:6px;">Nhân vật bí ẩn đứng sau chuỗi cung ứng đặc quyền</div>
      </div>
    </div>

    <div class="cm-card green-shadow" id="s06-sat2" style="position:absolute;left:830px;top:345px;width:995px;display:flex;align-items:center;gap:22px;">
      <div style="width:68px;height:68px;border-radius:16px;background:#4FA7F5;border:3.5px solid #0F0F0F;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:900;">02</div>
      <div>
        <div style="display:flex;align-items:center;gap:12px;">
          ${FLAGS.SG}<span class="cm-h2" data-var="${s2K}">VỎ BỌC SINGAPORE TỶ USD</span>
        </div>
        <div class="cm-sub" style="margin-top:6px;">Đơn vị nhận hàng trăm lô chip AI vượt hàng rào cấm vận</div>
      </div>
    </div>

    <div class="cm-card orange-shadow" id="s06-sat3" style="position:absolute;left:830px;top:542px;width:995px;display:flex;align-items:center;gap:22px;">
      <div style="width:68px;height:68px;border-radius:16px;background:#F06CA8;border:3.5px solid #0F0F0F;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:900;">03</div>
      <div>
        <div style="display:flex;align-items:center;gap:12px;">
          ${ICONS.alert}<span class="cm-h2" data-var="${s3K}">HAI MỐI TÌNH NỘI BỘ BỊ CHE GIẤU</span>
        </div>
        <div class="cm-sub" style="margin-top:6px;">Quan hệ cấp dưới trực tiếp & những lời phủ nhận trước luật sư</div>
      </div>
    </div>

    <div class="cm-lower-banner">
      <div class="cm-card dark" id="s06-end" style="flex:1;padding:18px 34px;text-align:center;box-shadow:8px 8px 0 #E85A1F;">
        <span class="cm-h2" style="color:#F5C518;" data-var="${endK}">ĐÁNH GỤC CEO TRONG CHƯA ĐẦY 2 TUẦN</span>
      </div>
    </div>
  `;
  const js = `
    popIn('#s06-k', 0, { y: -16 }, { y: 0 }, 0.35, 'back.out(1.4)');
    popIn('#s06-d', 0.1, { y: -16 }, { y: 0 }, 0.35, 'back.out(1.4)');
    tl.fromTo(q('#s06-doorL'), { x: -45 }, { x: 0, duration: 0.4, ease: 'power3.in' }, 2.15);
    tl.fromTo(q('#s06-doorR'), { x: 45 }, { x: 0, duration: 0.4, ease: 'power3.in' }, 2.15);
    tl.fromTo(q('#s06-lock'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2)', svgOrigin: '350 380' }, 2.55);
    popIn('#s06-sat1', 4.50, { x: 40 }, { x: 0 }, 0.45, 'power3.out');
    popIn('#s06-sat2', 6.55, { x: 40 }, { x: 0 }, 0.45, 'power3.out');
    popIn('#s06-sat3', 9.85, { x: 40 }, { x: 0 }, 0.45, 'power3.out');
    popIn('#s06-end', 12.70, { y: 26, scale: 0.94 }, { y: 0, scale: 1 }, 0.5, 'back.out(1.4)');
  `;
  return wrapScene(num, "Bí Mật Đằng Sau Cánh Cửa", dur, bodyHtml, js);
}

function scene07() {
  const num = 7, start = 73.60, dur = 9.40;
  const k = regVar("s07_k", "Cảnh 07 — Ghi chú mở đầu", "LƯU Ý NGUỒN TIN & THẢO LUẬN");
  const p1 = regVar("s07_p1", "Cảnh 07 — Lưu ý nguồn", "Tổng hợp từ nhiều đầu báo quốc tế & hồ sơ điều trần");
  const p2 = regVar("s07_p2", "Cảnh 07 — Tương tác", "MỜI BẠN BÌNH LUẬN Ý KIẾN BÊN DƯỚI");
  const p3 = regVar("s07_p3", "Cảnh 07 — Chuyển cảnh", "BẮT ĐẦU CÂU CHUYỆN");

  queueSfx(start, 0.25, "pop");
  queueSfx(start, 2.40, "click");
  queueSfx(start, 5.80, "ding");
  queueSfx(start, 8.25, "whoosh");

  const bodyHtml = `
    <div class="cm-header">
      <div class="cm-kicker yellow" id="s07-k">${ICONS.doc}<span data-var="${k}">LƯU Ý NGUỒN TIN & THẢO LUẬN</span></div>
      <div class="cm-date-pill">PHIM TÀI LIỆU</div>
    </div>

    <div class="cm-evidence-paper" id="s07-memo" style="position:absolute;left:220px;top:165px;width:1480px;height:560px;box-shadow:12px 12px 0 #136636;">
      <div class="cm-masthead">
        <span>GHI CHÚ BIÊN TẬP</span>
        <span>TRƯỚC KHI BẮT ĐẦU</span>
      </div>
      <div style="display:flex;align-items:center;gap:48px;height:400px;">
        <svg viewBox="0 0 260 280" width="260" height="280" style="flex-shrink:0;">
          <rect x="25" y="25" width="210" height="230" rx="18" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
          <rect x="55" y="65" width="150" height="22" rx="6" fill="#F5C518" stroke="#0F0F0F" stroke-width="3"/>
          <line x1="55" y1="118" x2="205" y2="118" stroke="#0F0F0F" stroke-width="6" stroke-linecap="round"/>
          <line x1="55" y1="148" x2="185" y2="148" stroke="#0F0F0F" stroke-width="6" stroke-linecap="round"/>
          <line x1="55" y1="178" x2="165" y2="178" stroke="#B83B0B" stroke-width="6" stroke-linecap="round"/>
          <circle cx="195" cy="215" r="28" fill="#136636" stroke="#0F0F0F" stroke-width="4"/>
          <path d="M184 215 L192 223 L207 207" fill="none" stroke="#EFE9D9" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div style="flex:1;">
          <div id="s07-line1" style="font-size:38px;font-weight:900;line-height:1.25;margin-bottom:26px;" data-var="${p1}">
            Tổng hợp từ nhiều đầu báo quốc tế & hồ sơ điều trần
          </div>
          <div id="s07-line2" class="cm-card yellow" style="display:inline-flex;align-items:center;gap:14px;padding:16px 26px;">
            ${ICONS.mail}
            <span class="cm-h2" data-var="${p2}">MỜI BẠN BÌNH LUẬN Ý KIẾN BÊN DƯỚI</span>
          </div>
        </div>
      </div>
    </div>

    <div class="cm-lower-banner">
      <div class="cm-card green" id="s07-start" style="max-width:740px;flex:1;padding:18px 34px;text-align:center;box-shadow:8px 8px 0 #F5C518;">
        <span class="cm-h2" style="color:#EFE9D9;" data-var="${p3}">BẮT ĐẦU CÂU CHUYỆN ▶</span>
      </div>
    </div>
  `;
  const js = `
    popIn('#s07-memo', 0.25, { y: 24 }, { y: 0 }, 0.45, 'power3.out');
    popIn('#s07-line1', 2.40, { x: 24 }, { x: 0 }, 0.45, 'back.out(1.4)');
    popIn('#s07-line2', 5.80, { scale: 0.9 }, { scale: 1 }, 0.45, 'back.out(1.6)');
    popIn('#s07-start', 8.25, { y: 22 }, { y: 0 }, 0.4, 'power3.out');
  `;
  return wrapScene(num, "Lưu Ý Nguồn Tin & Bắt Đầu", dur, bodyHtml, js);
}

function scene09() {
  const num = 9, start = 99.20, dur = 12.20;
  const k = regVar("s09_k", "Cảnh 09 — Tiêu đề", "DÂY CHUYỀN THÀNH LẬP VỎ BỌC SINGAPORE");
  const st1 = regVar("s09_st1", "Cảnh 09 — Tên 1", "HUANG LE LTD");
  const st2 = regVar("s09_st2", "Cảnh 09 — Tên 2", "MEGASPEED");
  const st3 = regVar("s09_st3", "Cảnh 09 — Tên 3", "SWIFTDATA SINGAPORE");

  queueSfx(start, 0.12, "click");
  queueSfx(start, 4.05, "pop");
  queueSfx(start, 6.90, "slam");
  queueSfx(start, 9.25, "ding");

  const bodyHtml = `
    <div class="cm-header">
      <div class="cm-kicker dark" id="s09-k">${ICONS.cpu}<span data-var="${k}">DÂY CHUYỀN THÀNH LẬP VỎ BỌC SINGAPORE</span></div>
      <div class="cm-date-pill" id="s09-date">THÁNG 11/2023</div>
    </div>

    <svg viewBox="0 0 1760 560" width="1760" height="560" style="position:absolute;left:80px;top:210px;">
      <!-- Conveyor Track -->
      <rect x="40" y="340" width="1680" height="64" rx="32" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
      <circle cx="95" cy="372" r="20" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
      <circle cx="480" cy="372" r="20" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
      <circle cx="880" cy="372" r="20" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
      <circle cx="1280" cy="372" r="20" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
      <circle cx="1665" cy="372" r="20" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>

      <!-- Pipes Between Stations -->
      <path d="M 480 205 H 630" stroke="#0F0F0F" stroke-width="8" stroke-dasharray="14 10"/>
      <path d="M 1090 205 H 1240" stroke="#0F0F0F" stroke-width="8" stroke-dasharray="14 10"/>

      <!-- Station 1: HUANG LE LTD -->
      <g id="s09-box1">
        <rect x="60" y="75" width="420" height="230" rx="22" fill="#FBF7EC" stroke="#0F0F0F" stroke-width="5"/>
        <rect x="60" y="75" width="420" height="54" rx="18" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
        <text x="270" y="111" text-anchor="middle" font-size="22" font-weight="900" fill="#0F0F0F">BƯỚC 1 • KHỞI TẠO</text>
        <text x="270" y="210" text-anchor="middle" font-size="38" font-weight="900" fill="#0F0F0F" data-var="${st1}">HUANG LE LTD</text>
        <text x="270" y="262" text-anchor="middle" font-size="21" font-weight="700" fill="#262626">Pháp nhân tiền thân (11/2023)</text>
      </g>

      <!-- Station 2: MEGASPEED -->
      <g id="s09-box2">
        <rect x="630" y="55" width="460" height="250" rx="22" fill="#E85A1F" stroke="#0F0F0F" stroke-width="5"/>
        <rect x="630" y="55" width="460" height="54" rx="18" fill="#0F0F0F"/>
        <text x="860" y="91" text-anchor="middle" font-size="22" font-weight="900" fill="#F5C518">BƯỚC 2 • ĐỔI TÊN THẦN TỐC</text>
        <text x="860" y="198" text-anchor="middle" font-size="42" font-weight="900" fill="#0F0F0F" data-var="${st2}">MEGASPEED</text>
        <text x="860" y="255" text-anchor="middle" font-size="22" font-weight="800" fill="#0F0F0F">Trung tâm gom chip AI</text>
      </g>

      <!-- Station 3: SWIFTDATA SINGAPORE -->
      <g id="s09-box3">
        <rect x="1240" y="55" width="460" height="250" rx="22" fill="#136636" stroke="#0F0F0F" stroke-width="5"/>
        <rect x="1240" y="55" width="460" height="54" rx="18" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
        <text x="1470" y="91" text-anchor="middle" font-size="22" font-weight="900" fill="#0F0F0F">BƯỚC 3 • TRẠM TRUNG CHUYỂN</text>
        <text x="1470" y="185" text-anchor="middle" font-size="34" font-weight="900" fill="#EFE9D9" data-var="${st3}">SWIFTDATA</text>
        <text x="1470" y="232" text-anchor="middle" font-size="28" font-weight="800" fill="#F5C518">SINGAPORE</text>
      </g>
    </svg>

    <div class="cm-lower-banner">
      <div class="cm-card orange-shadow" id="s09-foot" style="flex:1;display:flex;align-items:center;justify-content:center;gap:16px;padding:16px 28px;">
        ${FLAGS.SG}
        <span class="cm-h2">MỘT PHÁP NHÂN BÍ ẨN NỔI LÊN TẠI ĐÔNG NAM Á</span>
      </div>
    </div>
  `;
  const js = `
    popIn('#s09-date', 0.10, { scale: 0.9 }, { scale: 1 }, 0.4, 'back.out(1.4)');
    popIn('#s09-box1', 4.05, { y: -32 }, { y: 0 }, 0.5, 'back.out(1.4)');
    popIn('#s09-box2', 6.90, { scale: 1.15, svgOrigin: '860 180' }, { scale: 1, svgOrigin: '860 180' }, 0.45, 'back.out(1.6)');
    popIn('#s09-box3', 9.25, { x: 40 }, { x: 0 }, 0.5, 'back.out(1.4)');
    popIn('#s09-foot', 9.60, { y: 20 }, { y: 0 }, 0.4, 'back.out(1.4)');
  `;
  return wrapScene(num, "Dây Chuyền Vỏ Bọc Singapore", dur, bodyHtml, js);
}

function scene12() {
  const num = 12, start = 140.50, dur = 17.40;
  const k = regVar("s12_k", "Cảnh 12 — Nhãn bản đồ", "DỮ LIỆU HẢI QUAN IMPORTGENIUS");
  const shipsK = regVar("s12_ships", "Cảnh 12 — Số lô", "HƠN 200 LÔ HÀNG CHIP AI");
  const valK = regVar("s12_val", "Cảnh 12 — Giá trị PA1", "HÀNG TỶ USD (ĐỈNH >$7 TỶ USD)");

  queueSfx(start, 1.15, "click");
  queueSfx(start, 4.40, "ping");
  queueSfx(start, 10.85, "pop");
  queueSfx(start, 14.30, "notify");

  const bodyHtml = `
    <div class="cm-header">
      <div class="cm-kicker" id="s12-k">${ICONS.doc}<span data-var="${k}">DỮ LIỆU HẢI QUAN IMPORTGENIUS</span></div>
      <div class="cm-date-pill" id="s12-date">06/2024 – ĐẦU 2026</div>
    </div>

    <!-- Left 56%: Southeast Asia Radar Map -->
    <div class="cm-card green-shadow" style="position:absolute;left:68px;top:145px;width:960px;height:710px;padding:24px;">
      <svg viewBox="0 0 900 650" width="900" height="650">
        <rect x="10" y="10" width="880" height="630" rx="18" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="3"/>
        <!-- Stylized Coastlines & Trade Sea -->
        <path d="M 120 70 Q 170 210 260 300 L 340 420 L 290 460 L 180 350 Q 95 250 75 95 Z" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
        <path d="M 430 430 C 490 385, 595 405, 650 475 C 625 565, 485 595, 420 530 Z" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>

        <!-- Radar Pulse at Malaysia & Singapore -->
        <circle id="s12-ring1" cx="270" cy="360" r="65" fill="none" stroke="#136636" stroke-width="4" stroke-dasharray="10 8"/>
        <circle id="s12-ring2" cx="325" cy="445" r="80" fill="none" stroke="#B83B0B" stroke-width="5"/>

        <!-- Animated Shipping Trajectory Arc -->
        <path id="s12-route" d="M 790 120 Q 520 140 270 360 L 325 445" fill="none" stroke="#E85A1F" stroke-width="9" stroke-linecap="round" stroke-dasharray="900" stroke-dashoffset="900"/>

        <!-- Origin US/Global Hub -->
        <rect x="650" y="70" width="210" height="66" rx="14" fill="#0F0F0F"/>
        <text x="755" y="112" text-anchor="middle" font-size="22" font-weight="900" fill="#F5C518">NGUỒN CUNG MỸ</text>

        <!-- Node MY -->
        <circle cx="270" cy="360" r="14" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
        <rect x="60" y="330" width="185" height="54" rx="12" fill="#FBF7EC" stroke="#0F0F0F" stroke-width="3.5"/>
        <text x="152" y="365" text-anchor="middle" font-size="23" font-weight="900" fill="#0F0F0F">MALAYSIA</text>

        <!-- Node SG -->
        <circle cx="325" cy="445" r="16" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>
        <rect x="355" y="425" width="205" height="56" rx="12" fill="#136636" stroke="#0F0F0F" stroke-width="3.5"/>
        <text x="457" y="461" text-anchor="middle" font-size="23" font-weight="900" fill="#EFE9D9">SINGAPORE</text>
      </svg>
    </div>

    <!-- Right: Evidence Paper + Numbers -->
    <div class="cm-evidence-paper" id="s12-paper" style="position:absolute;left:1066px;top:145px;width:786px;">
      <div class="cm-masthead">
        <span>FORTUNE & NEW YORK TIMES</span>
        <span>HỒ SƠ XUẤT NHẬP KHẨU</span>
      </div>
      <div style="font-size:26px;font-weight:800;line-height:1.3;margin-bottom:14px;">
        <span class="cm-hl-yellow">"Mystery buyer Megaspeed in Malaysia & Singapore linked to $7.5B in Nvidia AI servers"</span>
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        ${FLAGS.MY}${FLAGS.SG}
        <span class="cm-sub">Dữ liệu vận đơn cảng biển xác nhận chuỗi nhập khẩu dồn dập</span>
      </div>
    </div>

    <div class="cm-card orange" id="s12-c1" style="position:absolute;left:1066px;top:450px;width:786px;">
      <div style="font-size:20px;font-weight:900;">QUY MÔ ĐƠN HÀNG</div>
      <div class="cm-stat-num" style="font-size:46px;margin-top:6px;" data-var="${shipsK}">HƠN 200 LÔ HÀNG CHIP AI</div>
    </div>

    <div class="cm-card dark" id="s12-c2" style="position:absolute;left:1066px;top:648px;width:786px;box-shadow:8px 8px 0 #136636;">
      <div style="font-size:20px;font-weight:800;color:#F5C518;">GIÁ TRỊ ƯỚC TÍNH</div>
      <div class="cm-stat-num" style="font-size:40px;margin-top:8px;color:#EFE9D9;" data-var="${valK}">HÀNG TỶ USD (ĐỈNH >$7 TỶ USD)</div>
    </div>

    <div class="cm-lower-banner">
      <div class="cm-card green-shadow" style="flex:1;padding:15px 26px;text-align:center;">
        <span class="cm-h2">MỘT CÔNG TY VỎ BỌC NẮM KHỐI LƯỢNG GPU KHỔNG LỒ CHỈ TRONG HƠN 1 NĂM</span>
      </div>
    </div>
  `;
  const js = `
    popIn('#s12-paper', 1.15, { x: 30 }, { x: 0 }, 0.45, 'back.out(1.4)');
    tl.fromTo(q('#s12-ring1'), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1.05, duration: 0.7, svgOrigin: '270 360' }, 4.40);
    tl.fromTo(q('#s12-ring2'), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1.08, duration: 0.7, svgOrigin: '325 445' }, 4.65);
    tl.fromTo(q('#s12-route'), { strokeDashoffset: 900 }, { strokeDashoffset: 0, duration: 2.0, ease: 'power2.inOut' }, 5.0);
    popIn('#s12-c1', 10.85, { y: 24 }, { y: 0 }, 0.45, 'back.out(1.4)');
    popIn('#s12-c2', 14.30, { y: 24 }, { y: 0 }, 0.45, 'back.out(1.4)');
  `;
  return wrapScene(num, "Dữ Liệu Hải Quan Malaysia & Singapore", dur, bodyHtml, js);
}

function scene13() {
  const num = 13, start = 157.90, dur = 7.80;
  const k = regVar("s13_k", "Cảnh 13 — Cơ chế", "CƠ CHẾ LÁCH LUẬT BẰNG HẠ TẦNG ĐÁM MÂY");
  const a1 = regVar("s13_a1", "Cảnh 13 — Đích 1", "ALIBABA CLOUD");
  const a2 = regVar("s13_a2", "Cảnh 13 — Đích 2", "TENCENT CLOUD");

  queueSfx(start, 0.15, "slam");
  queueSfx(start, 2.70, "ping");
  queueSfx(start, 3.50, "ping");
  queueSfx(start, 4.65, "sparkle");

  const bodyHtml = `
    <div class="cm-header">
      <div class="cm-kicker orange" id="s13-k">${ICONS.cpu}<span data-var="${k}">CƠ CHẾ LÁCH LUẬT BẰNG HẠ TẦNG ĐÁM MÂY</span></div>
      <div class="cm-date-pill">THUÊ TỪ XA</div>
    </div>

    <svg viewBox="0 0 1760 680" width="1760" height="680" style="position:absolute;left:80px;top:155px;">
      <!-- Embargo Brick Wall in Middle -->
      <rect x="760" y="210" width="240" height="420" rx="18" fill="#B83B0B" stroke="#0F0F0F" stroke-width="6"/>
      <g stroke="#0F0F0F" stroke-width="4" opacity="0.65">
        <line x1="760" y1="280" x2="1000" y2="280"/>
        <line x1="760" y1="350" x2="1000" y2="350"/>
        <line x1="760" y1="420" x2="1000" y2="420"/>
        <line x1="760" y1="490" x2="1000" y2="490"/>
        <line x1="760" y1="560" x2="1000" y2="560"/>
      </g>
      <rect x="778" y="375" width="204" height="72" rx="12" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
      <text x="880" y="420" text-anchor="middle" font-size="25" font-weight="900" fill="#0F0F0F">CẤM VẬN MỸ</text>

      <!-- Left: Singapore Server Hub -->
      <rect x="70" y="250" width="430" height="330" rx="24" fill="#136636" stroke="#0F0F0F" stroke-width="6"/>
      <text x="285" y="325" text-anchor="middle" font-size="30" font-weight="900" fill="#EFE9D9">CỤM GPU SINGAPORE</text>
      <rect x="125" y="365" width="320" height="44" rx="10" fill="#0F0F0F"/>
      <circle cx="155" cy="387" r="7" fill="#F5C518"/><circle cx="180" cy="387" r="7" fill="#4FA7F5"/>
      <rect x="125" y="430" width="320" height="44" rx="10" fill="#0F0F0F"/>
      <circle cx="155" cy="452" r="7" fill="#F5C518"/><circle cx="180" cy="452" r="7" fill="#4FA7F5"/>
      <rect x="125" y="495" width="320" height="44" rx="10" fill="#0F0F0F"/>
      <circle cx="155" cy="517" r="7" fill="#E85A1F"/><circle cx="180" cy="517" r="7" fill="#F5C518"/>

      <!-- Blocked Direct Line -->
      <path d="M 510 420 H 735" stroke="#B83B0B" stroke-width="8" stroke-linecap="round"/>
      <circle cx="715" cy="420" r="24" fill="#DC2626" stroke="#0F0F0F" stroke-width="4"/>
      <path d="M 704 409 L 726 431 M 726 409 L 704 431" stroke="#FFFFFF" stroke-width="5"/>

      <!-- Bypass Cloud Fiber Over Wall! -->
      <path id="s13-arcA" data-layout-allow-overlap d="M 285 250 C 420 35, 1180 25, 1340 165" fill="none" stroke="#4FA7F5" stroke-width="11" stroke-linecap="round" stroke-dasharray="1400" stroke-dashoffset="1400"/>
      <path id="s13-arcB" data-layout-allow-overlap d="M 285 250 C 480 85, 1150 95, 1340 430" fill="none" stroke="#E85A1F" stroke-width="11" stroke-linecap="round" stroke-dasharray="1400" stroke-dashoffset="1400"/>

      <!-- Right Nodes: Alibaba & Tencent -->
      <g id="s13-n1">
        <rect x="1250" y="135" width="440" height="175" rx="22" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
        <text x="1470" y="210" text-anchor="middle" font-size="38" font-weight="900" fill="#0F0F0F" data-var="${a1}">ALIBABA CLOUD</text>
        <text x="1470" y="265" text-anchor="middle" font-size="22" font-weight="800" fill="#0F0F0F">Thuê năng lực tính toán từ xa</text>
      </g>
      <g id="s13-n2">
        <rect x="1250" y="385" width="440" height="175" rx="22" fill="#FBF7EC" stroke="#0F0F0F" stroke-width="5"/>
        <text x="1470" y="460" text-anchor="middle" font-size="38" font-weight="900" fill="#0F0F0F" data-var="${a2}">TENCENT CLOUD</text>
        <text x="1470" y="515" text-anchor="middle" font-size="22" font-weight="800" fill="#136636">Chạm thẳng lõi chip AI Nvidia</text>
      </g>
    </svg>

    <div class="cm-lower-banner">
      <div class="cm-card dark" id="s13-bot" style="flex:1;text-align:center;padding:16px 28px;box-shadow:8px 8px 0 #4FA7F5;">
        <span class="cm-h2" style="color:#EFE9D9;">CHIP KHÔNG CẦN QUA BIÊN GIỚI — DỮ LIỆU ĐI THẲNG QUA CÁP QUANG</span>
      </div>
    </div>
  `;
  const js = `
    tl.fromTo(q('#s13-arcA'), { strokeDashoffset: 1400 }, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.out' }, 1.60);
    popIn('#s13-n1', 2.70, { scale: 0.85 }, { scale: 1 }, 0.45, 'back.out(1.6)');
    tl.fromTo(q('#s13-arcB'), { strokeDashoffset: 1400 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.out' }, 2.35);
    popIn('#s13-n2', 3.50, { scale: 0.85 }, { scale: 1 }, 0.45, 'back.out(1.6)');
    popIn('#s13-bot', 4.65, { y: 20 }, { y: 0 }, 0.4, 'back.out(1.4)');
  `;
  return wrapScene(num, "Vượt Tường Cấm Vận Bằng Cloud", dur, bodyHtml, js);
}

function scene16() {
  const num = 16, start = 193.70, dur = 7.20;
  const k = regVar("s16_k", "Cảnh 16 — Báo động", "CHUÔNG BÁO ĐỘNG WASHINGTON RÉO VANG");
  queueSfx(start, 0.25, "pop");
  queueSfx(start, 2.90, "click");
  queueSfx(start, 5.10, "warn");

  const bodyHtml = `
    <div class="cm-header">
      <div class="cm-kicker orange" id="s16-k">${ICONS.alert}<span data-var="${k}">CHUÔNG BÁO ĐỘNG WASHINGTON RÉO VANG</span></div>
      <div class="cm-date-pill">${FLAGS.US} AN NINH QUỐC GIA</div>
    </div>

    <div style="position:absolute;left:110px;top:180px;width:1700px;height:660px;display:flex;align-items:center;gap:46px;">
      <div class="cm-card green-shadow" style="flex:1;height:580px;display:flex;flex-direction:column;justify-content:center;gap:26px;">
        <div id="s16-item1" class="cm-card yellow" style="padding:22px 28px;">
          <div style="font-size:32px;font-weight:900;">1. DÒNG CHIP AI TỶ ĐÔ CHẢY VỀ SINGAPORE</div>
          <div class="cm-sub" style="margin-top:6px;">Hàng trăm lô hàng tối tân cập bến nhà thầu bí ẩn</div>
        </div>
        <div id="s16-item2" class="cm-card" style="padding:22px 28px;">
          <div style="font-size:32px;font-weight:900;">2. NHỮNG CHUYẾN ĐI CHUNG KÍN TIẾNG</div>
          <div class="cm-sub" style="margin-top:6px;">Cuộc gặp Đài Bắc & mối liên hệ trực tiếp CEO Nvidia</div>
        </div>
      </div>

      <div class="cm-card dark" id="s16-bell-card" style="width:660px;height:580px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:12px 12px 0 #E85A1F;">
        <svg viewBox="0 0 360 320" width="360" height="320">
          <!-- Sound Shockwaves -->
          <path id="s16-w1" d="M 65 95 C 35 130, 35 180, 65 215" fill="none" stroke="#F5C518" stroke-width="8" stroke-linecap="round"/>
          <path id="s16-w2" d="M 295 95 C 325 130, 325 180, 295 215" fill="none" stroke="#F5C518" stroke-width="8" stroke-linecap="round"/>
          <!-- Brass Bell -->
          <g id="s16-bell">
            <path d="M 110 210 L 122 125 A 58 58 0 0 1 238 125 L 250 210 Z" fill="#E85A1F" stroke="#EFE9D9" stroke-width="6" stroke-linejoin="round"/>
            <rect x="92" y="205" width="176" height="28" rx="14" fill="#F5C518" stroke="#0F0F0F" stroke-width="4"/>
            <circle cx="180" cy="248" r="18" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="4"/>
          </g>
        </svg>
        <div class="cm-h2" style="color:#F5C518;text-align:center;margin-top:10px;">BÁO ĐỘNG ĐỎ TẠI WASHINGTON</div>
      </div>
    </div>
  `;
  const js = `
    popIn('#s16-item1', 0.25, { x: -30 }, { x: 0 }, 0.45, 'back.out(1.4)');
    popIn('#s16-item2', 2.90, { x: -30 }, { x: 0 }, 0.45, 'back.out(1.4)');
    tl.fromTo(q('#s16-bell'), { rotation: 0 }, { rotation: 10, duration: 0.22, svgOrigin: '180 75', yoyo: true, repeat: 5 }, 5.10);
    tl.fromTo([q('#s16-w1'), q('#s16-w2')], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, yoyo: true, repeat: 4 }, 5.15);
  `;
  return wrapScene(num, "Chuông Báo Động Washington", dur, bodyHtml, js);
}

function scene18() {
  const num = 18, start = 208.30, dur = 13.10;
  const k = regVar("s18_k", "Cảnh 18 — Tình báo", "BÁO CÁO MẬT: BỘ AN NINH QUỐC GIA TRUNG QUỐC (MSS)");
  const s1 = regVar("s18_s1", "Cảnh 18 — Bước 1", "1. TIẾP CẬN");
  const s2 = regVar("s18_s2", "Cảnh 18 — Bước 2", "2. THU THẬP");
  const s3 = regVar("s18_s3", "Cảnh 18 — Bước 3", "3. THAO TÚNG");

  queueSfx(start, 0.55, "click");
  queueSfx(start, 6.00, "notify");
  queueSfx(start, 8.60, "pop");
  queueSfx(start, 9.40, "pop");
  queueSfx(start, 10.15, "warn");

  const bodyHtml = `
    <div class="cm-header">
      <div class="cm-kicker dark" id="s18-k">${FLAGS.US}${FLAGS.CN}<span data-var="${k}">BÁO CÁO MẬT: BỘ AN NINH QUỐC GIA TRUNG QUỐC (MSS)</span></div>
      <div class="cm-date-pill">MÙA THU 2025</div>
    </div>

    <!-- X-Ray Scanner Frame -->
    <div class="cm-card" style="position:absolute;left:90px;top:155px;width:960px;height:690px;background:#161618;color:#EFE9D9;box-shadow:12px 12px 0 #136636;overflow:hidden;">
      <div style="font-size:22px;font-weight:900;color:#F5C518;margin-bottom:14px;">QUÉT HỒ SƠ PHẢN GIÁN • MSS</div>
      <svg viewBox="0 0 900 570" width="900" height="570">
        <rect x="20" y="20" width="860" height="520" rx="18" fill="#0D291C" stroke="#1F8A4C" stroke-width="3"/>
        <circle cx="450" cy="270" r="190" fill="none" stroke="#1F8A4C" stroke-width="2" stroke-dasharray="8 8"/>
        <circle cx="450" cy="270" r="115" fill="none" stroke="#4FA7F5" stroke-width="2.5"/>
        <!-- Cross-section dossier silhouette -->
        <rect x="190" y="130" width="520" height="290" rx="16" fill="rgba(79,167,245,0.12)" stroke="#4FA7F5" stroke-width="4"/>
        <text x="450" y="235" text-anchor="middle" font-size="34" font-weight="900" fill="#F5C518">NGHI VẤN TUYỂN MỘ ĐIỆP VIÊN</text>
        <text x="450" y="290" text-anchor="middle" font-size="24" font-weight="700" fill="#EFE9D9">Khai thác điểm yếu đời tư & quyền truy cập CEO</text>
        <rect x="290" y="330" width="320" height="52" rx="10" fill="#E85A1F"/>
        <text x="450" y="364" text-anchor="middle" font-size="22" font-weight="900" fill="#0F0F0F">NGUỒN TIN TÌNH BÁO MỸ</text>
        <!-- Sweeping X-ray Bar -->
        <rect id="s18-beam" data-layout-allow-overlap x="20" y="30" width="16" height="500" rx="8" fill="#F5C518" opacity="0.85"/>
      </svg>
    </div>

    <!-- 3-Step Cycle Cards -->
    <div id="s18-c1" class="cm-card yellow" style="position:absolute;left:1095px;top:175px;width:745px;display:flex;align-items:center;justify-content:space-between;">
      <span class="cm-h1" style="font-size:38px;" data-var="${s1}">1. TIẾP CẬN</span>
      <span class="cm-sub" style="font-size:20px;color:#0F0F0F;">Xây dựng quan hệ cá nhân mật thiết</span>
    </div>
    <div id="s18-c2" class="cm-card orange" style="position:absolute;left:1095px;top:375px;width:745px;display:flex;align-items:center;justify-content:space-between;">
      <span class="cm-h1" style="font-size:38px;" data-var="${s2}">2. THU THẬP</span>
      <span class="cm-sub" style="font-size:20px;color:#0F0F0F;">Tiếp cận thông tin cấp cao & chuỗi chip</span>
    </div>
    <div id="s18-c3" class="cm-card dark" style="position:absolute;left:1095px;top:575px;width:745px;box-shadow:8px 8px 0 #E85A1F;display:flex;align-items:center;justify-content:space-between;">
      <span class="cm-h1" style="font-size:38px;color:#F5C518;" data-var="${s3}">3. THAO TÚNG</span>
      <span class="cm-sub" style="font-size:20px;color:#EFE9D9;">Gây sức ép lên đầu tàu AI số 1 nước Mỹ</span>
    </div>

    <div class="cm-lower-banner">
      <div class="cm-card green-shadow" style="flex:1;padding:15px 28px;text-align:center;">
        <span class="cm-h2">BÁO CÁO PHẢN GIÁN GÂY CHẤN ĐỘNG HỘI ĐỒNG AN NINH QUỐC GIA MỸ</span>
      </div>
    </div>
  `;
  const js = `
    tl.fromTo(q('#s18-beam'), { x: 0 }, { x: 830, duration: 4.5, ease: 'power1.inOut', repeat: 1, yoyo: true }, 0.55);
    popIn('#s18-c1', 8.60, { x: 40 }, { x: 0 }, 0.42, 'back.out(1.4)');
    popIn('#s18-c2', 9.40, { x: 40 }, { x: 0 }, 0.42, 'back.out(1.4)');
    popIn('#s18-c3', 10.15, { x: 40 }, { x: 0 }, 0.45, 'back.out(1.4)');
  `;
  return wrapScene(num, "X-Ray Tình Báo MSS Trung Quốc", dur, bodyHtml, js);
}

function scene21() {
  const num = 21, start = 239.20, dur = 10.00;
  const k = regVar("s21_k", "Cảnh 21 — Đề xuất bị chặn", "ĐỒNG THUẬN AN NINH vs RÀO CHẮN ENTITY LIST");
  const c4 = regVar("s21_c4", "Cảnh 21 — Đồng thuận", "4/4 CƠ QUAN AN NINH MỸ ĐỒNG Ý");
  const blk = regVar("s21_blk", "Cảnh 21 — Kết quả", "BỊ CHẶN ĐỨNG TRƯỚC VẠCH ĐỎ");

  queueSfx(start, 0.2, "click");
  queueSfx(start, 2.80, "ding");
  queueSfx(start, 5.25, "pop");
  queueSfx(start, 7.70, "slam");

  const bodyHtml = `
    <div class="cm-header">
      <div class="cm-kicker dark" id="s21-k">${ICONS.shield}<span data-var="${k}">ĐỒNG THUẬN AN NINH vs RÀO CHẮN ENTITY LIST</span></div>
      <div class="cm-date-pill">${FLAGS.US} ENTITY LIST</div>
    </div>

    <!-- 4 Voting Dossiers -->
    <div style="position:absolute;left:85px;top:170px;width:960px;display:grid;grid-template-columns:1fr 1fr;gap:26px;">
      ${["CƠ QUAN 01 • TÌNH BÁO", "CƠ QUAN 02 • BỘ NGOẠI GIAO", "CƠ QUAN 03 • QUỐC PHÒNG", "CƠ QUAN 04 • AN NINH MẠNG"]
        .map(
          (ag, i) => `
        <div id="s21-ag-${i}" class="cm-card green-shadow" style="padding:26px;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span style="font-size:21px;font-weight:900;">${ag}</span>
            ${ICONS.shield}
          </div>
          <div style="margin-top:16px;padding:12px 16px;border-radius:12px;background:#136636;color:#EFE9D9;font-size:24px;font-weight:900;text-align:center;">
            ĐƯA VÀO ENTITY LIST ✓
          </div>
        </div>`
        )
        .join("")}
    </div>

    <!-- Right: Gate Barrier Machine -->
    <div class="cm-card orange-shadow" style="position:absolute;left:1095px;top:170px;width:740px;height:520px;padding:24px;">
      <div class="cm-h2" style="margin-bottom:14px;" data-var="${c4}">4/4 CƠ QUAN AN NINH MỸ ĐỒNG Ý</div>
      <svg viewBox="0 0 680 390" width="680" height="390">
        <!-- Entity List Hopper Target -->
        <rect x="440" y="130" width="210" height="190" rx="18" fill="#161618" stroke="#0F0F0F" stroke-width="5"/>
        <text x="545" y="218" text-anchor="middle" font-size="26" font-weight="900" fill="#F5C518">ENTITY</text>
        <text x="545" y="255" text-anchor="middle" font-size="26" font-weight="900" fill="#F5C518">LIST</text>

        <!-- Token sliding right -->
        <g id="s21-token">
          <rect x="15" y="180" width="295" height="86" rx="16" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
          <text x="162" y="232" text-anchor="middle" font-size="22" font-weight="900" fill="#0F0F0F">HỒ SƠ MEGASPEED</text>
        </g>

        <!-- Red Gate Arm Slams Down! -->
        <g id="s21-arm">
          <rect x="380" y="55" width="34" height="290" rx="10" fill="#DC2626" stroke="#0F0F0F" stroke-width="5"/>
          <line x1="380" y1="120" x2="414" y2="155" stroke="#FFFFFF" stroke-width="6"/>
          <line x1="380" y1="185" x2="414" y2="220" stroke="#FFFFFF" stroke-width="6"/>
          <line x1="380" y1="250" x2="414" y2="285" stroke="#FFFFFF" stroke-width="6"/>
        </g>
        <circle cx="397" cy="60" r="22" fill="#0F0F0F" stroke="#EFE9D9" stroke-width="4"/>
      </svg>
    </div>

    <div class="cm-lower-banner">
      <div class="cm-card orange" id="s21-bot" style="flex:1;padding:18px 34px;text-align:center;">
        <span class="cm-h1" style="font-size:36px;" data-var="${blk}">BỊ CHẶN ĐỨNG TRƯỚC VẠCH ĐỎ</span>
      </div>
    </div>
  `;
  const js = `
    qa('[id^="s21-ag-"]').forEach((el, idx) => {
      popIn(el, 0.3 + idx * 0.55, { scale: 0.9 }, { scale: 1 }, 0.35, 'back.out(1.4)');
    });
    tl.fromTo(q('#s21-token'), { x: 0 }, { x: 42, duration: 1.8, ease: 'power2.out' }, 5.25);
    tl.fromTo(q('#s21-arm'), { rotation: -75 }, { rotation: 0, duration: 0.35, ease: 'bounce.out', svgOrigin: '397 60' }, 7.70);
    popIn('#s21-bot', 7.90, { y: 20 }, { y: 0 }, 0.4, 'back.out(1.4)');
  `;
  return wrapScene(num, "4/4 Cơ Quan vs Rào Chắn Entity List", dur, bodyHtml, js);
}

function scene25() {
  const num = 25, start = 285.40, dur = 10.70;
  const k = regVar("s25_k", "Cảnh 25 — Đối chất pháp lý", "CUỘC CHẤT VẤN NỘI BỘ NVIDIA");
  const lawK = regVar("s25_law", "Cảnh 25 — Nhân sự pháp lý", "TIM TETER (PHÁP CHẾ) & ALISON WAGONFELD (TRUYỀN THÔNG)");
  const defK = regVar("s25_def", "Cảnh 25 — Lời khai", "\"CHỈ LÀ GIAO TIẾP CÔNG VIỆC ĐÚNG MỰC\"");
  const lieK = regVar("s25_lie", "Cảnh 25 — Dấu mộc", "NÓI DỐI TRỰC TIẾP");

  queueSfx(start, 1.20, "slam");
  queueSfx(start, 3.70, "click");
  queueSfx(start, 5.40, "click");
  queueSfx(start, 7.80, "pop");
  queueSfx(start, 8.90, "warn");

  const bodyHtml = `
    <div class="cm-header">
      <div class="cm-kicker" id="s25-k">${ICONS.gavel}<span data-var="${k}">CUỘC CHẤT VẤN NỘI BỘ NVIDIA</span></div>
      <div class="cm-date-pill">THU 2025 & THÁNG 10/2026</div>
    </div>

    <!-- Tablet Conference Frame -->
    <div class="cm-card green-shadow" style="position:absolute;left:180px;top:155px;width:1560px;height:690px;padding:30px;">
      <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:18px;border-bottom:4px solid #0F0F0F;">
        <div class="cm-h2" data-var="${lawK}">TIM TETER (PHÁP CHẾ) & ALISON WAGONFELD (TRUYỀN THÔNG)</div>
        <span style="padding:8px 16px;border-radius:10px;background:#0F0F0F;color:#F5C518;font-weight:900;font-size:20px;">PHÒNG HỌP KÍN</span>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:34px;margin-top:26px;">
        <div id="s25-q1" class="cm-card" style="background:#EFE9D9;">
          <div style="font-size:20px;font-weight:900;color:#136636;">CÂU HỎI TỪ BỘ PHẬN PHÁP CHẾ & TRUYỀN THÔNG</div>
          <div class="cm-h2" style="margin-top:14px;">"Mối quan hệ thực sự giữa ông và bà Alice Huang là gì?"</div>
        </div>

        <div id="s25-a1" class="cm-card yellow">
          <div style="font-size:20px;font-weight:900;">CÂU TRẢ LỜI CỦA JENSEN HUANG</div>
          <div class="cm-h2" style="margin-top:14px;" data-var="${defK}">"CHỈ LÀ GIAO TIẾP CÔNG VIỆC ĐÚNG MỰC"</div>
        </div>
      </div>

      <!-- Animated Cursor & Stamp Overlay -->
      <div class="cm-stamp" id="s25-stamp" data-layout-allow-overlap data-layout-allow-occlusion style="bottom:68px;left:500px;font-size:44px;padding:18px 46px;border-width:7px;">
        <span data-var="${lieK}">NÓI DỐI TRỰC TIẾP</span>
      </div>
    </div>

    <div class="cm-lower-banner">
      <div class="cm-card dark" style="flex:1;padding:15px 28px;text-align:center;">
        <span class="cm-h2" style="color:#EFE9D9;">CHÊNH LỆCH LỜI KHAI VỚI CỐ VẤN PHÁP LÝ TRỞ THÀNH BẰNG CHỨNG CHÍ MẠNG</span>
      </div>
    </div>
  `;
  const js = `
    popIn('#s25-q1', 3.70, { x: -24 }, { x: 0 }, 0.45, 'back.out(1.4)');
    popIn('#s25-a1', 7.40, { x: 24 }, { x: 0 }, 0.45, 'back.out(1.4)');
    popIn('#s25-stamp', 8.90, { scale: 1.5, rotation: -14 }, { scale: 1, rotation: -5 }, 0.35, 'back.out(2)');
  `;
  return wrapScene(num, "Cuộc Chất Vấn & Dấu Mộc Nói Dối", dur, bodyHtml, js);
}

function scene26() {
  const num = 26, start = 296.10, dur = 11.50;
  const k = regVar("s26_k", "Cảnh 26 — Tạp chí Fortune", "TẠP CHÍ FORTUNE PHÁT HIỆN ĐIỂM BẤT THƯỜNG");
  const hK = regVar("s26_h", "Cảnh 26 — Tiêu đề báo", "Nvidia abruptly changed how it reported revenue in Singapore");
  const subK = regVar("s26_sub", "Cảnh 26 — Diễn giải", "THAY ĐỔI ĐỘT NGỘT CÁCH BÁO CÁO DOANH THU SINGAPORE");

  queueSfx(start, 1.05, "notify");
  queueSfx(start, 2.40, "pop");
  queueSfx(start, 6.30, "ping");

  const bodyHtml = `
    <div class="cm-header">
      <div class="cm-kicker yellow" id="s26-k">${FLAGS.SG}<span data-var="${k}">TẠP CHÍ FORTUNE PHÁT HIỆN ĐIỂM BẤT THƯỜNG</span></div>
      <div class="cm-date-pill" id="s26-d">THÁNG 06/2025</div>
    </div>

    <div class="cm-evidence-paper" id="s26-paper" style="position:absolute;left:130px;top:160px;width:1660px;height:690px;">
      <div class="cm-masthead" style="font-size:28px;">
        <span>FORTUNE MAGAZINE</span>
        <span>HỒ SƠ BCTC • THÁNG 06/2025</span>
      </div>

      <div style="display:flex;align-items:center;gap:48px;margin-top:24px;">
        <div style="flex:1.25;">
          <div style="font-size:46px;font-weight:900;line-height:1.26;">
            <span class="cm-hl-yellow" data-var="${hK}">"Nvidia abruptly changed how it reported revenue in Singapore"</span>
          </div>
          <div class="cm-card orange-shadow" style="margin-top:34px;padding:22px 26px;">
            <div class="cm-h2" data-var="${subK}">THAY ĐỔI ĐỘT NGỘT CÁCH BÁO CÁO DOANH THU SINGAPORE</div>
            <div class="cm-sub" style="margin-top:8px;">Tín hiệu bất thường xuất hiện giữa lúc lượng hàng qua Đông Nam Á tăng vọt</div>
          </div>
        </div>

        <!-- Magnifying Glass SVG over Revenue Chart -->
        <div style="width:460px;height:470px;position:relative;flex-shrink:0;">
          <svg viewBox="0 0 460 470" width="460" height="470">
            <rect x="20" y="20" width="420" height="430" rx="20" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
            <rect x="65" y="260" width="65" height="140" rx="8" fill="#136636" stroke="#0F0F0F" stroke-width="4"/>
            <rect x="155" y="185" width="65" height="215" rx="8" fill="#136636" stroke="#0F0F0F" stroke-width="4"/>
            <rect x="245" y="100" width="65" height="300" rx="8" fill="#E85A1F" stroke="#0F0F0F" stroke-width="4"/>
            <rect x="335" y="280" width="65" height="120" rx="8" fill="#9CA3AF" stroke="#0F0F0F" stroke-width="4" stroke-dasharray="8 6"/>
            <text x="230" y="65" text-anchor="middle" font-size="22" font-weight="900" fill="#0F0F0F">CHUẨN DOANH THU BỊ SỬA ĐỔI</text>

            <!-- Sweeping Magnifying Glass -->
            <g id="s26-lens" data-layout-allow-overlap>
              <circle cx="240" cy="210" r="88" fill="rgba(245,197,24,0.28)" stroke="#0F0F0F" stroke-width="10"/>
              <line x1="302" y1="272" x2="375" y2="345" stroke="#0F0F0F" stroke-width="16" stroke-linecap="round"/>
            </g>
          </svg>
        </div>
      </div>
    </div>

    <div class="cm-lower-banner">
      <div class="cm-card dark" style="flex:1;padding:15px 28px;text-align:center;">
        <span class="cm-h2" style="color:#F5C518;">SỐ LIỆU TÀI CHÍNH SINGAPORE ĐÃ GÂY HOÀI NGHI TỪ GIỮA NĂM 2025</span>
      </div>
    </div>
  `;
  const js = `
    popIn('#s26-paper', 1.05, { y: 26 }, { y: 0 }, 0.45, 'back.out(1.4)');
    tl.fromTo(q('#s26-lens'), { x: -110, y: 40 }, { x: 45, y: -35, duration: 2.6, ease: 'power2.inOut', repeat: 1, yoyo: true }, 4.5);
  `;
  return wrapScene(num, "Fortune & Báo Cáo Doanh Thu Singapore", dur, bodyHtml, js);
}

function scene29() {
  const num = 29, start = 331.80, dur = 5.60;
  const k = regVar("s29_k", "Cảnh 29 — Khủng hoảng 10 ngày", "BỨC TƯỜNG PHÒNG THỦ SỤP ĐỔ TRONG ĐÚNG 10 NGÀY");
  queueSfx(start, 0.55, "whoosh");
  queueSfx(start, 3.65, "slam");

  const bodyHtml = `
    <div class="cm-header">
      <div class="cm-kicker orange" id="s29-k">${ICONS.alert}<span data-var="${k}">BỨC TƯỜNG PHÒNG THỦ SỤP ĐỔ TRONG ĐÚNG 10 NGÀY</span></div>
      <div class="cm-date-pill">29/10 → 08/11/2026</div>
    </div>

    <svg viewBox="0 0 1760 660" width="1760" height="660" style="position:absolute;left:80px;top:175px;">
      <!-- Stress Meter Bar -->
      <rect x="60" y="30" width="1640" height="58" rx="16" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
      <rect id="s29-meter" x="68" y="38" width="120" height="42" rx="12" fill="#E85A1F"/>
      <text x="880" y="68" text-anchor="middle" font-size="25" font-weight="900" fill="#0F0F0F">SỨC ÉP TRUYỀN THÔNG & ẢNH CHỤP DÀY ĐẶC</text>

      <!-- Wall Blocks Collapsing -->
      <g id="s29-wallL">
        <rect x="330" y="135" width="520" height="110" rx="16" fill="#136636" stroke="#0F0F0F" stroke-width="5"/>
        <text x="590" y="202" text-anchor="middle" font-size="31" font-weight="900" fill="#EFE9D9">"KHÔNG BẤT THƯỜNG"</text>
      </g>
      <g id="s29-wallR">
        <rect x="890" y="135" width="540" height="110" rx="16" fill="#136636" stroke="#0F0F0F" stroke-width="5"/>
        <text x="1160" y="202" text-anchor="middle" font-size="31" font-weight="900" fill="#EFE9D9">"CHƯA TỪNG CẢNH BÁO"</text>
      </g>
      <g id="s29-base">
        <rect x="330" y="340" width="1100" height="135" rx="18" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
        <text x="880" y="425" text-anchor="middle" font-size="46" font-weight="900" fill="#0F0F0F">SỤP ĐỔ SAU ĐÚNG 10 NGÀY</text>
      </g>
    </svg>

    <div class="cm-lower-banner">
      <div class="cm-card dark" style="flex:1;padding:16px 28px;text-align:center;">
        <span class="cm-h2" style="color:#EFE9D9;">BẰNG CHỨNG HÌNH ẢNH LIÊN HOÀN XÉ TOANG MỌI TUYÊN BỐ PHỦ NHẬN</span>
      </div>
    </div>
  `;
  const js = `
    tl.fromTo(q('#s29-meter'), { width: 120 }, { width: 1624, duration: 3.1, ease: 'power2.in' }, 0.55);
    tl.to(q('#s29-wallL'), { y: 20, x: -35, rotation: -7, duration: 0.55, ease: 'power3.in', svgOrigin: '590 190' }, 3.65);
    tl.to(q('#s29-wallR'), { y: 22, x: 40, rotation: 8, duration: 0.55, ease: 'power3.in', svgOrigin: '1160 190' }, 3.65);
    tl.fromTo(q('#s29-base'), { scale: 0.9 }, { scale: 1, duration: 0.4, ease: 'back.out(1.6)', svgOrigin: '880 407' }, 3.85);
  `;
  return wrapScene(num, "Sụp Đổ Trong 10 Ngày", dur, bodyHtml, js);
}

function scene31() {
  const num = 31, start = 355.20, dur = 6.40;
  const k = regVar("s31_k", "Cảnh 31 — Thông cáo HĐQT", "THÔNG CÁO CHÍNH THỨC TỪ HĐQT NVIDIA");
  const q1 = regVar("s31_q1", "Cảnh 31 — Tiêu đề báo", "Statement From NVIDIA Board of Directors");
  const q2 = regVar("s31_q2", "Cảnh 31 — Trích dẫn", "HOÀN TOÀN TIN TƯỞNG VÀO JENSEN");

  queueSfx(start, 0.25, "notify");
  queueSfx(start, 3.05, "click");
  queueSfx(start, 4.60, "ding");

  const bodyHtml = `
    <div class="cm-header">
      <div class="cm-kicker green" style="background:#136636;color:#EFE9D9;">${ICONS.shield}<span data-var="${k}">THÔNG CÁO CHÍNH THỨC TỪ HĐQT NVIDIA</span></div>
      <div class="cm-date-pill">08/11/2026</div>
    </div>

    <div class="cm-evidence-paper" id="s31-doc" style="position:absolute;left:210px;top:185px;width:1500px;height:620px;box-shadow:12px 12px 0 #136636;">
      <div class="cm-masthead" style="font-size:26px;">
        <span>NVIDIA NEWSROOM</span>
        <span>08 NOVEMBER 2026</span>
      </div>
      <div style="font-size:48px;font-weight:900;line-height:1.25;margin-top:24px;" data-var="${q1}">
        "Statement From NVIDIA Board of Directors"
      </div>
      <div id="s31-inv" class="cm-card" style="margin-top:36px;background:#EFE9D9;">
        <div class="cm-h2">Mở cuộc điều tra chính thức về các cáo buộc liên quan</div>
      </div>
      <div id="s31-trust" class="cm-card yellow" style="margin-top:26px;padding:24px 30px;">
        <div class="cm-h1" style="font-size:40px;" data-var="${q2}">"HOÀN TOÀN TIN TƯỞNG VÀO JENSEN"</div>
      </div>
    </div>

    <div class="cm-lower-banner">
      <div class="cm-card green-shadow" style="flex:1;padding:15px 28px;text-align:center;">
        <span class="cm-h2">NHƯNG SỰ ỦNG HỘ NÀY CHỈ TỒN TẠI ĐƯỢC VẺN VẸN 4 NGÀY</span>
      </div>
    </div>
  `;
  const js = `
    popIn('#s31-doc', 0.25, { y: 24 }, { y: 0 }, 0.45, 'back.out(1.4)');
    popIn('#s31-inv', 3.05, { x: -20 }, { x: 0 }, 0.45, 'back.out(1.4)');
    popIn('#s31-trust', 4.60, { scale: 0.94 }, { scale: 1 }, 0.45, 'back.out(1.5)');
  `;
  return wrapScene(num, "Thông Cáo 08/11 Của HĐQT Nvidia", dur, bodyHtml, js);
}

function scene34() {
  const num = 34, start = 388.10, dur = 9.60;
  const k = regVar("s34_k", "Cảnh 34 — Đêm 11/11", "TỐI THỨ TƯ 11/11/2026: ĐÒN CHÍ MẠNG TỪ NEW YORK TIMES");
  const d1 = regVar("s34_d1", "Cảnh 34 — Đầu mối 1", "#1 ALICE HUANG");
  const d2 = regVar("s34_d2", "Cảnh 34 — Đầu mối 2", "#2 KHÔNG PHẢI NGƯỜI DUY NHẤT");

  queueSfx(start, 1.10, "slam");
  queueSfx(start, 5.00, "notify");
  queueSfx(start, 7.75, "warn");

  const bodyHtml = `
    <div class="cm-header">
      <div class="cm-kicker orange">${ICONS.alert}<span data-var="${k}">TỐI THỨ TƯ 11/11/2026: ĐÒN CHÍ MẠNG TỪ NEW YORK TIMES</span></div>
      <div class="cm-date-pill">11/11/2026</div>
    </div>

    <!-- Tear-Off Calendar Left -->
    <div id="s34-cal" style="position:absolute;left:95px;top:185px;width:430px;height:520px;">
      <svg viewBox="0 0 430 520" width="430" height="520">
        <rect x="20" y="40" width="390" height="450" rx="26" fill="#FBF7EC" stroke="#0F0F0F" stroke-width="6"/>
        <rect x="20" y="40" width="390" height="105" rx="22" fill="#B83B0B" stroke="#0F0F0F" stroke-width="6"/>
        <circle cx="120" cy="40" r="16" fill="#0F0F0F"/><circle cx="310" cy="40" r="16" fill="#0F0F0F"/>
        <text x="215" y="108" text-anchor="middle" font-size="34" font-weight="900" fill="#EFE9D9">THÁNG 11 / 2026</text>
        <text x="215" y="295" text-anchor="middle" font-size="145" font-weight="900" fill="#0F0F0F">11</text>
        <text x="215" y="410" text-anchor="middle" font-size="34" font-weight="900" fill="#B83B0B">TỐI THỨ TƯ</text>
      </svg>
    </div>

    <!-- Split NYT Bomb Cards Right -->
    <div style="position:absolute;left:585px;top:195px;width:1255px;display:flex;flex-direction:column;gap:34px;">
      <div class="cm-evidence-paper" id="s34-nyt">
        <div class="cm-masthead">
          <span>THE NEW YORK TIMES • BREAKING INVESTIGATION</span>
          <span>11/11/2026</span>
        </div>
        <div class="cm-h1" style="font-size:38px;">BÀI ĐIỀU TRA BÙNG NỔ ĐÊM THỨ TƯ THAY ĐỔI TẤT CẢ</div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:30px;">
        <div class="cm-card orange-shadow" id="s34-box1" style="padding:32px;">
          <div style="font-size:21px;font-weight:900;color:#136636;">HỒ SƠ BỊ LỘ ĐẦU TIÊN</div>
          <div class="cm-h1" style="margin-top:14px;" data-var="${d1}">#1 ALICE HUANG</div>
        </div>
        <div class="cm-card orange" id="s34-box2" style="padding:32px;">
          <div style="font-size:21px;font-weight:900;">TIẾT LỘ CHẤN ĐỘNG</div>
          <div class="cm-h1" style="margin-top:14px;" data-var="${d2}">#2 KHÔNG PHẢI NGƯỜI DUY NHẤT</div>
        </div>
      </div>
    </div>

    <div class="cm-lower-banner">
      <div class="cm-card dark" style="flex:1;padding:16px 28px;text-align:center;">
        <span class="cm-h2" style="color:#F5C518;">CÚ RẼ BƯỚC NGOẶT BIẾN KHỦNG HOẢNG ĐỊA CHÍNH TRỊ THÀNH ÁN TỬ QUẢN TRỊ</span>
      </div>
    </div>
  `;
  const js = `
    popIn('#s34-cal', 1.10, { y: -30 }, { y: 0 }, 0.45, 'back.out(1.6)');
    popIn('#s34-nyt', 5.00, { x: 40 }, { x: 0 }, 0.48, 'back.out(1.4)');
    popIn('#s34-box1', 6.60, { y: 24 }, { y: 0 }, 0.4, 'back.out(1.4)');
    popIn('#s34-box2', 7.75, { scale: 0.9 }, { scale: 1 }, 0.45, 'back.out(1.6)');
  `;
  return wrapScene(num, "Đêm Thứ Tư 11/11 Đòn Chí Mạng", dur, bodyHtml, js);
}

function scene36() {
  const num = 36, start = 407.70, dur = 9.90;
  const k = regVar("s36_k", "Cảnh 36 — Cuộc gọi NYT", "CUỘC GỌI CHẤT VẤN TỪ PHÓNG VIÊN NEW YORK TIMES");
  const quoteK = regVar("s36_q", "Cảnh 36 — Câu nói nguyên văn", "\"Tôi không nghĩ các người nên nói chuyện trực tiếp với tôi.\"");
  const endK = regVar("s36_end", "Cảnh 36 — Kết thúc", "× CÚP MÁY");

  queueSfx(start, 0.65, "notify");
  queueSfx(start, 6.20, "pop");
  queueSfx(start, 8.85, "slam");

  const bodyHtml = `
    <div class="cm-header">
      <div class="cm-kicker" id="s36-k">${ICONS.phone}<span data-var="${k}">CUỘC GỌI CHẤT VẤN TỪ PHÓNG VIÊN NEW YORK TIMES</span></div>
      <div class="cm-date-pill">PHẢN ỨNG BẤT NGỜ</div>
    </div>

    <div class="cm-card green-shadow" style="position:absolute;left:190px;top:170px;width:1540px;height:660px;padding:34px;display:flex;align-items:center;gap:48px;">
      <!-- Call UI Screen -->
      <div style="width:450px;height:560px;border-radius:26px;background:#161618;color:#EFE9D9;border:5px solid #0F0F0F;padding:32px;display:flex;flex-direction:column;justify-content:space-between;flex-shrink:0;">
        <div>
          <div style="font-size:18px;font-weight:800;color:#4FA7F5;">CUỘC GỌI ĐẾN • TRỰC TIẾP</div>
          <div style="font-size:32px;font-weight:900;margin-top:10px;">THE NEW YORK TIMES</div>
          <div style="font-size:20px;color:#E4DCC4;margin-top:4px;">Phóng viên điều tra</div>
        </div>
        <!-- Animated Waveform Bars -->
        <svg viewBox="0 0 360 110" width="360" height="110">
          ${[20, 48, 76, 104, 132, 160, 188, 216, 244, 272, 300, 328]
            .map((x, idx) => `<rect class="s36-wave" x="${x}" y="${35 - (idx % 3) * 14}" width="16" height="${40 + (idx % 3) * 28}" rx="8" fill="#F5C518"/>`)
            .join("")}
        </svg>
        <div id="s36-hangup" style="padding:18px 26px;border-radius:999px;background:#DC2626;color:#FFFFFF;border:4px solid #EFE9D9;text-align:center;font-size:28px;font-weight:900;" data-var="${endK}">
          × CÚP MÁY
        </div>
      </div>

      <!-- Speech Bubble Verbatim Quote -->
      <div style="flex:1;">
        <div id="s36-bubble" class="cm-card yellow" style="padding:36px 40px;box-shadow:10px 10px 0 #0F0F0F;">
          <div style="font-size:22px;font-weight:900;color:#136636;margin-bottom:16px;">PHẢN HỒI QUA ĐIỆN THOẠI</div>
          <div style="font-size:44px;font-weight:900;line-height:1.25;" data-var="${quoteK}">
            "Tôi không nghĩ các người nên nói chuyện trực tiếp với tôi."
          </div>
        </div>
        <div class="cm-card" id="s36-note" style="margin-top:28px;">
          <span class="cm-h2">Thái độ im lặng khó hiểu trước câu hỏi về mối quan hệ với cấp dưới trực tiếp</span>
        </div>
      </div>
    </div>

    <div class="cm-lower-banner">
      <div class="cm-card dark" style="flex:1;padding:15px 28px;text-align:center;">
        <span class="cm-h2" style="color:#EFE9D9;">PHẢN ỨNG NÉ TRÁNH CÀNG LÀM LỘ RÕ VẾT RẠN NỨT QUẢN TRỊ</span>
      </div>
    </div>
  `;
  const js = `
    tl.fromTo(qa('.s36-wave'), { scaleY: 0.4 }, { scaleY: 1.15, duration: 0.35, stagger: 0.08, yoyo: true, repeat: 14, svgOrigin: '180 55' }, 0.65);
    popIn('#s36-bubble', 6.20, { scale: 0.9, y: 20 }, { scale: 1, y: 0 }, 0.45, 'back.out(1.5)');
    popIn('#s36-note', 6.80, { y: 12 }, { y: 0 }, 0.4, 'back.out(1.4)');
    tl.fromTo(q('#s36-hangup'), { scale: 1 }, { scale: 1.12, duration: 0.25, yoyo: true, repeat: 1 }, 8.85);
  `;
  return wrapScene(num, "Phản Ứng & Cuộc Gọi NYT", dur, bodyHtml, js);
}

function scene37() {
  const num = 37, start = 417.60, dur = 10.00;
  const k = regVar("s37_k", "Cảnh 37 — Loạt bài nối tiếp", "REUTERS & FORBES ĐỒNG LOẠT VÀO CUỘC");
  const totalK = regVar("s37_tot", "Cảnh 37 — Tổng số", "3 CUỘC NGOẠI TÌNH BỊ PHANH PHUI");

  queueSfx(start, 1.55, "notify");
  queueSfx(start, 5.65, "pop");
  queueSfx(start, 8.15, "warn");

  const bodyHtml = `
    <div class="cm-header">
      <div class="cm-kicker orange">${ICONS.doc}<span data-var="${k}">REUTERS & FORBES ĐỒNG LOẠT VÀO CUỘC</span></div>
      <div class="cm-date-pill">SAU ĐÚNG 1 NGÀY</div>
    </div>

    <div style="position:absolute;left:110px;top:175px;width:1700px;display:grid;grid-template-columns:1fr 1fr;gap:34px;">
      <div class="cm-evidence-paper" id="s37-p1">
        <div class="cm-masthead"><span>REUTERS • INVESTIGATION</span><span>12–13/11/2026</span></div>
        <div class="cm-h1" style="font-size:34px;line-height:1.25;">Xác minh thêm mối quan hệ nội bộ ngoài danh sách ban đầu của báo chí</div>
      </div>
      <div class="cm-evidence-paper" id="s37-p2" style="box-shadow:10px 10px 0 #E85A1F;">
        <div class="cm-masthead"><span>FORBES • CORPORATE REPORT</span><span>12–13/11/2026</span></div>
        <div class="cm-h1" style="font-size:34px;line-height:1.25;">Hé lộ nhân sự thứ 3 từng có quan hệ tình cảm ngay trong tập đoàn</div>
      </div>
    </div>

    <div id="s37-count" class="cm-card orange" style="position:absolute;left:220px;top:545px;width:1480px;display:flex;align-items:center;justify-content:space-between;padding:30px 44px;box-shadow:12px 12px 0 #0F0F0F;">
      <div style="display:flex;gap:18px;">
        <span style="padding:14px 24px;border-radius:14px;background:#0F0F0F;color:#F5C518;font-size:34px;font-weight:900;">#1</span>
        <span style="padding:14px 24px;border-radius:14px;background:#0F0F0F;color:#F5C518;font-size:34px;font-weight:900;">#2</span>
        <span style="padding:14px 24px;border-radius:14px;background:#F5C518;color:#0F0F0F;border:3px solid #0F0F0F;font-size:34px;font-weight:900;">#3</span>
      </div>
      <div class="cm-h1" style="font-size:44px;" data-var="${totalK}">3 CUỘC NGOẠI TÌNH BỊ PHANH PHUI</div>
    </div>
  `;
  const js = `
    popIn('#s37-p1', 1.55, { x: -30 }, { x: 0 }, 0.45, 'back.out(1.4)');
    popIn('#s37-p2', 5.65, { x: 30 }, { x: 0 }, 0.45, 'back.out(1.4)');
    popIn('#s37-count', 8.15, { scale: 0.92, y: 24 }, { scale: 1, y: 0 }, 0.5, 'back.out(1.6)');
  `;
  return wrapScene(num, "Reuters & Forbes: 3 Cuộc Ngoại Tình", dur, bodyHtml, js);
}

function scene38() {
  const num = 38, start = 427.60, dur = 12.20;
  const k = regVar("s38_k", "Cảnh 38 — Chuẩn mực Mỹ", "NGUYÊN TẮC QUẢN TRỊ DOANH NGHIỆP MỸ");
  const wK = regVar("s38_w", "Cảnh 38 — Điểm chí tử", "QUAN HỆ CẤP DƯỚI TRỰC TIẾP");
  const verdictK = regVar("s38_v", "Cảnh 38 — Án tử", "ÁN TỬ QUẢN TRỊ MỸ");
  const preK = regVar("s38_pre", "Cảnh 38 — Tiền lệ", "TIỀN LỆ: INTEL (2018) • MCDONALD'S (2019)");

  queueSfx(start, 0.25, "click");
  queueSfx(start, 4.25, "slam");
  queueSfx(start, 6.35, "warn");
  queueSfx(start, 10.50, "ping");

  const bodyHtml = `
    <div class="cm-header">
      <div class="cm-kicker dark">${ICONS.gavel}<span data-var="${k}">NGUYÊN TẮC QUẢN TRỊ DOANH NGHIỆP MỸ</span></div>
      <div class="cm-date-pill">${FLAGS.US} LUẬT QUẢN TRỊ</div>
    </div>

    <div class="cm-card" style="position:absolute;left:130px;top:155px;width:1660px;height:660px;padding:24px;">
      <svg viewBox="0 0 1600 600" width="1600" height="600">
        <!-- Fulcrum Pillar -->
        <polygon points="730,540 870,540 818,220 782,220" fill="#161618" stroke="#0F0F0F" stroke-width="5"/>
        <rect x="660" y="535" width="280" height="36" rx="10" fill="#0F0F0F"/>

        <!-- Tilting Balance Beam -->
        <g id="s38-beam">
          <rect x="260" y="205" width="1080" height="28" rx="14" fill="#F5C518" stroke="#0F0F0F" stroke-width="5"/>
          <circle cx="800" cy="219" r="24" fill="#0F0F0F"/>

          <!-- Left Pan: Excuses -->
          <line x1="330" y1="233" x2="290" y2="380" stroke="#0F0F0F" stroke-width="4"/>
          <line x1="330" y1="233" x2="370" y2="380" stroke="#0F0F0F" stroke-width="4"/>
          <rect x="190" y="380" width="280" height="80" rx="18" fill="#E4DCC4" stroke="#0F0F0F" stroke-width="5"/>
          <text x="330" y="428" text-anchor="middle" font-size="24" font-weight="900" fill="#0F0F0F">CHUYỆN ĐỜI TƯ</text>

          <!-- Right Pan: Heavy Direct Subordinate Weight -->
          <line x1="1270" y1="233" x2="1220" y2="365" stroke="#0F0F0F" stroke-width="4"/>
          <line x1="1270" y1="233" x2="1320" y2="365" stroke="#0F0F0F" stroke-width="4"/>
          <rect x="1035" y="340" width="470" height="125" rx="20" fill="#E85A1F" stroke="#0F0F0F" stroke-width="6"/>
          <text x="1270" y="395" text-anchor="middle" font-size="26" font-weight="900" fill="#0F0F0F" data-var="${wK}">QUAN HỆ CẤP DƯỚI TRỰC TIẾP</text>
          <text x="1270" y="438" text-anchor="middle" font-size="22" font-weight="900" fill="#0F0F0F" data-var="${verdictK}">→ ÁN TỬ QUẢN TRỊ MỸ</text>
        </g>
      </svg>
    </div>

    <div class="cm-lower-banner">
      <div class="cm-card yellow" id="s38-pre" style="flex:1;padding:18px 34px;text-align:center;">
        <span class="cm-h2" data-var="${preK}">TIỀN LỆ: INTEL (2018) • MCDONALD'S (2019)</span>
      </div>
    </div>
  `;
  const js = `
    tl.fromTo(q('#s38-beam'), { rotation: 0 }, { rotation: 10, duration: 0.9, ease: 'bounce.out', svgOrigin: '800 219' }, 4.25);
    popIn('#s38-pre', 10.50, { y: 20 }, { y: 0 }, 0.45, 'back.out(1.4)');
  `;
  return wrapScene(num, "Cân Đối Trọng Án Tử Quản Trị Mỹ", dur, bodyHtml, js);
}

function scene39() {
  const num = 39, start = 439.80, dur = 7.60;
  const k = regVar("s39_k", "Cảnh 39 — Quyền biểu quyết", "CẤU TRÚC CỔ PHẦN: KHÔNG CÓ KHIÊN BẢO VỆ");
  const s1 = regVar("s39_s1", "Cảnh 39 — Tỷ lệ", "<3–4% CỔ PHẦN");
  const s2 = regVar("s39_s2", "Cảnh 39 — Biểu quyết", "× KHÔNG CÓ SIÊU BIỂU QUYẾT");
  const s3 = regVar("s39_s3", "Cảnh 39 — Mất tín nhiệm", "NÓI DỐI LUẬT SƯ TIM TETER");

  queueSfx(start, 3.15, "pop");
  queueSfx(start, 4.80, "warn");
  queueSfx(start, 6.00, "slam");

  const bodyHtml = `
    <div class="cm-header">
      <div class="cm-kicker dark">${ICONS.dollar}<span data-var="${k}">CẤU TRÚC CỔ PHẦN: KHÔNG CÓ KHIÊN BẢO VỆ</span></div>
      <div class="cm-date-pill">PHỐ WALL & HĐQT</div>
    </div>

    <div class="cm-card green-shadow" style="position:absolute;left:110px;top:170px;width:780px;height:660px;display:flex;flex-direction:column;align-items:center;justify-content:center;">
      <svg viewBox="0 0 460 460" width="460" height="460">
        <circle cx="230" cy="230" r="160" fill="none" stroke="#E4DCC4" stroke-width="56"/>
        <circle id="s39-slice" cx="230" cy="230" r="160" fill="none" stroke="#136636" stroke-width="56" stroke-dasharray="38 970" stroke-dashoffset="0" transform="rotate(-90 230 230)"/>
        <circle cx="230" cy="230" r="112" fill="#FBF7EC" stroke="#0F0F0F" stroke-width="5"/>
        <text x="230" y="216" text-anchor="middle" font-size="56" font-weight="900" fill="#136636" data-var="${s1}">&lt;3%</text>
        <text x="230" y="260" text-anchor="middle" font-size="18" font-weight="800" fill="#0F0F0F">CỔ PHẦN SỞ HỮU</text>
      </svg>
    </div>

    <div style="position:absolute;left:940px;top:170px;width:870px;display:flex;flex-direction:column;gap:34px;">
      <div class="cm-card orange" id="s39-c1" style="padding:32px;">
        <div class="cm-h1" style="font-size:38px;" data-var="${s2}">× KHÔNG CÓ SIÊU BIỂU QUYẾT</div>
        <div class="cm-sub" style="margin-top:10px;font-size:22px;color:#0F0F0F;">Khác với Meta hay Alphabet — cổ phần Jensen không có quyền phủ quyết đặc biệt</div>
      </div>

      <div class="cm-card dark" id="s39-c2" style="padding:32px;box-shadow:10px 10px 0 #E85A1F;">
        <div class="cm-h1" style="font-size:38px;color:#F5C518;" data-var="${s3}">NÓI DỐI LUẬT SƯ TIM TETER</div>
        <div class="cm-sub" style="margin-top:10px;font-size:22px;color:#EFE9D9;">HĐQT mất hoàn toàn cơ sở pháp lý để tiếp tục giữ ghế CEO</div>
      </div>
    </div>

    <div class="cm-lower-banner">
      <div class="cm-card" style="flex:1;padding:15px 28px;text-align:center;">
        <span class="cm-h2">KHÔNG CÓ QUYỀN PHỦ QUYẾT ĐỂ CỨU VÃN CHIẾC GHẾ TẠI SANTA CLARA</span>
      </div>
    </div>
  `;
  const js = `
    tl.fromTo(q('#s39-slice'), { strokeDashoffset: 120 }, { strokeDashoffset: 0, duration: 1.0, ease: 'power2.out' }, 2.20);
    popIn('#s39-c1', 4.80, { x: 30 }, { x: 0 }, 0.42, 'back.out(1.4)');
    popIn('#s39-c2', 6.00, { x: 30 }, { x: 0 }, 0.45, 'back.out(1.4)');
  `;
  return wrapScene(num, "Cổ Phần <3% & Không Siêu Biểu Quyết", dur, bodyHtml, js);
}

function scene40() {
  const num = 40, start = 447.40, dur = 7.00;
  const k = regVar("s40_k", "Cảnh 40 — Tiêu đề Bloomberg", "TỜ BÁO CHẤN ĐỘNG TỪ BLOOMBERG / THE STAR");
  const h = regVar("s40_h", "Cảnh 40 — Nguyên văn tiêu đề", "\"I'm a Piece of Sh—\": Jensen Huang's Last Hours as Nvidia CEO");

  queueSfx(start, 0.3, "notify");
  queueSfx(start, 2.70, "slam");

  const bodyHtml = `
    <div class="cm-header">
      <div class="cm-kicker yellow">${ICONS.doc}<span data-var="${k}">TỜ BÁO CHẤN ĐỘNG TỪ BLOOMBERG / THE STAR</span></div>
      <div class="cm-date-pill">13/11/2026</div>
    </div>

    <div class="cm-evidence-paper" id="s40-paper" style="position:absolute;left:180px;top:210px;width:1560px;height:570px;box-shadow:14px 14px 0 #E85A1F;display:flex;flex-direction:column;justify-content:center;">
      <div class="cm-masthead" style="font-size:28px;">
        <span>THE STAR • BLOOMBERG REPORT</span>
        <span>13 NOVEMBER 2026</span>
      </div>
      <div id="s40-title" style="font-size:62px;font-weight:900;line-height:1.25;margin-top:20px;">
        <span class="cm-hl-yellow" data-var="${h}">"I'm a Piece of Sh—": Jensen Huang's Last Hours as Nvidia CEO</span>
      </div>
      <div class="cm-sub" style="margin-top:28px;font-size:25px;">Ghi lại những giờ phút cuối cùng đầy kịch tính trước khi rời chiếc ghế điều hành</div>
    </div>
  `;
  const js = `
    popIn('#s40-paper', 0.3, { scale: 0.94 }, { scale: 1 }, 0.45, 'power3.out');
    popIn('#s40-title', 2.70, { y: 18 }, { y: 0 }, 0.45, 'back.out(1.4)');
  `;
  return wrapScene(num, "Tiêu Đề Bloomberg / The Star", dur, bodyHtml, js);
}

function scene44() {
  const num = 44, start = 502.20, dur = 14.00;
  const k = regVar("s44_k", "Cảnh 44 — Thông cáo chuyển giao", "THÔNG CÁO RÚT LUI SÁNG THỨ NĂM 12/11/2026");
  const titleK = regVar("s44_t", "Cảnh 44 — Tiêu đề thông cáo", "NVIDIA Announces CEO Transition");
  const endK = regVar("s44_end", "Cảnh 44 — Kết thúc kỷ nguyên", "CHẤM DỨT 33 NĂM CẦM QUYỀN");

  queueSfx(start, 2.25, "notify");
  queueSfx(start, 6.40, "slam");
  queueSfx(start, 7.45, "slam");
  queueSfx(start, 8.55, "slam");
  queueSfx(start, 10.30, "ping");

  const bodyHtml = `
    <div class="cm-header">
      <div class="cm-kicker dark">${ICONS.doc}<span data-var="${k}">THÔNG CÁO RÚT LUI SÁNG THỨ NĂM 12/11/2026</span></div>
      <div class="cm-date-pill">12/11/2026</div>
    </div>

    <div class="cm-evidence-paper" style="position:absolute;left:160px;top:165px;width:1600px;height:660px;box-shadow:12px 12px 0 #136636;">
      <div class="cm-masthead" style="font-size:26px;">
        <span>NVIDIA NEWSROOM • SANTA CLARA</span>
        <span>THURSDAY, NOV 12, 2026</span>
      </div>
      <div class="cm-h1" style="font-size:48px;margin-bottom:32px;" data-var="${titleK}">"NVIDIA Announces CEO Transition"</div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:26px;margin-top:20px;">
        <div id="s44-r1" class="cm-card" style="background:#EFE9D9;padding:28px;text-align:center;">
          <div style="font-size:28px;font-weight:900;">CHỦ TỊCH</div>
          <div style="margin-top:16px;padding:10px;border-radius:10px;background:#DC2626;color:#FFFFFF;font-size:24px;font-weight:900;">× BÃI NHIỆM</div>
        </div>
        <div id="s44-r2" class="cm-card" style="background:#EFE9D9;padding:28px;text-align:center;">
          <div style="font-size:28px;font-weight:900;">TỔNG GIÁM ĐỐC</div>
          <div style="margin-top:16px;padding:10px;border-radius:10px;background:#DC2626;color:#FFFFFF;font-size:24px;font-weight:900;">× RỜI GHẾ</div>
        </div>
        <div id="s44-r3" class="cm-card" style="background:#EFE9D9;padding:28px;text-align:center;">
          <div style="font-size:28px;font-weight:900;">THÀNH VIÊN HĐQT</div>
          <div style="margin-top:16px;padding:10px;border-radius:10px;background:#DC2626;color:#FFFFFF;font-size:24px;font-weight:900;">× RÚT KHỎI</div>
        </div>
      </div>

      <div id="s44-era" class="cm-card yellow" style="margin-top:34px;text-align:center;padding:22px;">
        <span class="cm-stat-num" style="font-size:46px;" data-var="${endK}">CHẤM DỨT 33 NĂM CẦM QUYỀN</span>
      </div>
    </div>
  `;
  const js = `
    popIn('#s44-r1', 6.40, { scale: 0.9 }, { scale: 1 }, 0.4, 'back.out(1.5)');
    popIn('#s44-r2', 7.45, { scale: 0.9 }, { scale: 1 }, 0.4, 'back.out(1.5)');
    popIn('#s44-r3', 8.55, { scale: 0.9 }, { scale: 1 }, 0.4, 'back.out(1.5)');
    popIn('#s44-era', 10.30, { y: 20 }, { y: 0 }, 0.5, 'power3.out');
  `;
  return wrapScene(num, "Thông Cáo 12/11 Chấm Dứt 33 Năm", dur, bodyHtml, js);
}

function scene46() {
  const num = 46, start = 524.40, dur = 8.00;
  const k = regVar("s46_k", "Cảnh 46 — Soi chi tiết thông cáo", "SOI KỸ KHOẢNG TRỐNG TRONG BẢN THÔNG CÁO RỜI ĐI");
  const z1 = regVar("s46_z1", "Cảnh 46 — Mất 1", "0 DÒNG CẢM ƠN");
  const z2 = regVar("s46_z2", "Cảnh 46 — Mất 2", "0 LỜI CHIA TAY");

  queueSfx(start, 1.40, "click");
  queueSfx(start, 4.30, "warn");
  queueSfx(start, 5.70, "warn");

  const bodyHtml = `
    <div class="cm-header">
      <div class="cm-kicker dark">${ICONS.doc}<span data-var="${k}">SOI KỸ KHOẢNG TRỐNG TRONG BẢN THÔNG CÁO RỜI ĐI</span></div>
      <div class="cm-date-pill">SỰ IM LẶNG LẠNH LÙNG</div>
    </div>

    <div class="cm-card" style="position:absolute;left:160px;top:170px;width:980px;height:660px;padding:30px;overflow:hidden;">
      <svg viewBox="0 0 920 600" width="920" height="600">
        <rect x="20" y="20" width="880" height="560" rx="18" fill="#EFE9D9" stroke="#0F0F0F" stroke-width="5"/>
        <text x="65" y="90" font-size="26" font-weight="900" fill="#0F0F0F">NỘI DUNG THÔNG CÁO BÁO CHÍ</text>
        <rect x="65" y="135" width="790" height="390" rx="14" fill="#FFFFFF" stroke="#0F0F0F" stroke-width="3" stroke-dasharray="14 10"/>
        <text x="460" y="335" text-anchor="middle" font-size="34" font-weight="900" fill="#B83B0B">[ KHOẢNG GIẤY TRẮNG TRỐNG RỖNG ]</text>
        <!-- Sweeping Blacklight / X-Ray Scanner -->
        <rect id="s46-scan" data-layout-allow-overlap x="20" y="125" width="880" height="18" rx="9" fill="#4FA7F5" opacity="0.7"/>
      </svg>
    </div>

    <div style="position:absolute;left:1190px;top:195px;width:620px;display:flex;flex-direction:column;gap:42px;">
      <div id="s46-z1" class="cm-card orange" style="padding:36px;">
        <div class="cm-stat-num" style="font-size:48px;" data-var="${z1}">0 DÒNG CẢM ƠN</div>
        <div class="cm-sub" style="margin-top:10px;font-size:22px;color:#0F0F0F;">Không một lời tri ân 33 năm gây dựng từ 1993</div>
      </div>
      <div id="s46-z2" class="cm-card dark" style="padding:36px;box-shadow:10px 10px 0 #E85A1F;">
        <div class="cm-stat-num" style="font-size:48px;color:#F5C518;" data-var="${z2}">0 LỜI CHIA TAY</div>
        <div class="cm-sub" style="margin-top:10px;font-size:22px;color:#EFE9D9;">Sự chấm dứt lạnh lùng chưa từng có ở Silicon Valley</div>
      </div>
    </div>
  `;
  const js = `
    tl.fromTo(q('#s46-scan'), { y: 0 }, { y: 400, duration: 3.2, ease: 'power1.inOut', repeat: 1, yoyo: true }, 1.40);
    popIn('#s46-z1', 4.30, { x: 30 }, { x: 0 }, 0.45, 'back.out(1.4)');
    popIn('#s46-z2', 5.70, { x: 30 }, { x: 0 }, 0.45, 'back.out(1.4)');
  `;
  return wrapScene(num, "0 Dòng Cảm Ơn • 0 Lời Chia Tay", dur, bodyHtml, js);
}

function scene47() {
  const num = 47, start = 532.40, dur = 11.80;
  const k = regVar("s47_k", "Cảnh 47 — Hiệu ứng Domino 48h", "HIỆU ỨNG DOMINO TRONG 48 GIỜ: 12/11 → 14/11/2026");
  const d1 = regVar("s47_d1", "Cảnh 47 — Domino 1", "01. PHỐ WALL");
  const d2 = regVar("s47_d2", "Cảnh 47 — Domino 2", "02. NỘI BỘ NVIDIA");
  const d3 = regVar("s47_d3", "Cảnh 47 — Domino 3", "03. PHÒNG TÌNH HUỐNG NHÀ TRẮNG");

  queueSfx(start, 4.55, "click");
  queueSfx(start, 8.05, "slam");
  queueSfx(start, 9.00, "slam");
  queueSfx(start, 10.35, "warn");

  const bodyHtml = `
    <div class="cm-header">
      <div class="cm-kicker orange">${ICONS.alert}<span data-var="${k}">HIỆU ỨNG DOMINO TRONG 48 GIỜ: 12/11 → 14/11/2026</span></div>
      <div class="cm-date-pill" id="s47-date">48 GIỜ BÃO TỐ</div>
    </div>

    <svg viewBox="0 0 1760 660" width="1760" height="660" style="position:absolute;left:80px;top:170px;">
      <line x1="60" y1="560" x2="1700" y2="560" stroke="#0F0F0F" stroke-width="8" stroke-linecap="round"/>

      <!-- Domino 1 -->
      <g id="s47-dom1">
        <rect x="130" y="135" width="380" height="425" rx="24" fill="#F5C518" stroke="#0F0F0F" stroke-width="6"/>
        <text x="320" y="250" text-anchor="middle" font-size="38" font-weight="900" fill="#0F0F0F" data-var="${d1}">01. PHỐ WALL</text>
        <text x="320" y="330" text-anchor="middle" font-size="24" font-weight="800" fill="#0F0F0F">Bán tháo hoảng loạn</text>
      </g>

      <!-- Domino 2 -->
      <g id="s47-dom2">
        <rect x="650" y="135" width="420" height="425" rx="24" fill="#E85A1F" stroke="#0F0F0F" stroke-width="6"/>
        <text x="860" y="250" text-anchor="middle" font-size="36" font-weight="900" fill="#0F0F0F" data-var="${d2}">02. NỘI BỘ NVIDIA</text>
        <text x="860" y="330" text-anchor="middle" font-size="24" font-weight="800" fill="#0F0F0F">Hoang mang & chia rẽ</text>
      </g>

      <!-- Domino 3 -->
      <g id="s47-dom3">
        <rect x="1200" y="105" width="460" height="455" rx="24" fill="#136636" stroke="#0F0F0F" stroke-width="6"/>
        <text x="1430" y="235" text-anchor="middle" font-size="34" font-weight="900" fill="#EFE9D9">03. PHÒNG TÌNH HUỐNG</text>
        <text x="1430" y="288" text-anchor="middle" font-size="34" font-weight="900" fill="#F5C518" data-var="${d3}">NHÀ TRẮNG</text>
        <text x="1430" y="365" text-anchor="middle" font-size="24" font-weight="800" fill="#EFE9D9">Cuộc họp khẩn Bộ trưởng</text>
      </g>
    </svg>
  `;
  const js = `
    tl.fromTo(q('#s47-dom1'), { rotation: 0 }, { rotation: 16, duration: 0.45, ease: 'power2.in', svgOrigin: '320 560' }, 8.05);
    tl.fromTo(q('#s47-dom2'), { rotation: 0 }, { rotation: 16, duration: 0.45, ease: 'power2.in', svgOrigin: '860 560' }, 9.00);
    tl.fromTo(q('#s47-dom3'), { scale: 0.96 }, { scale: 1.03, rotation: 8, duration: 0.5, ease: 'back.out(1.6)', svgOrigin: '1430 560' }, 10.35);
  `;
  return wrapScene(num, "3 Quân Domino Trong 48 Giờ", dur, bodyHtml, js);
}

function scene50() {
  const num = 50, start = 572.90, dur = 11.10;
  const k = regVar("s50_k", "Cảnh 50 — Phòng Tình huống", "PHÒNG TÌNH HUỐNG NHÀ TRẮNG & MẶT BÁO THE KOREA TIMES");
  const headK = regVar("s50_h", "Cảnh 50 — Tiêu đề thật", "Bessent blames Lutnick's Commerce Department for failing to block Nvidia chip smuggling");

  queueSfx(start, 0.35, "ping");
  queueSfx(start, 6.85, "notify");

  const bodyHtml = `
    <div class="cm-header">
      <div class="cm-kicker dark">${FLAGS.US}<span data-var="${k}">PHÒNG TÌNH HUỐNG NHÀ TRẮNG & MẶT BÁO THE KOREA TIMES</span></div>
      <div class="cm-date-pill">14/11/2026</div>
    </div>

    <!-- Left Situation Room Radar -->
    <div class="cm-card dark" style="position:absolute;left:85px;top:165px;width:680px;height:660px;box-shadow:10px 10px 0 #136636;display:flex;flex-direction:column;align-items:center;justify-content:center;">
      <svg viewBox="0 0 460 460" width="460" height="460">
        <circle cx="230" cy="230" r="190" fill="#0D291C" stroke="#1F8A4C" stroke-width="5"/>
        <circle cx="230" cy="230" r="130" fill="none" stroke="#1F8A4C" stroke-width="2.5"/>
        <circle cx="230" cy="230" r="70" fill="none" stroke="#F5C518" stroke-width="2.5"/>
        <line x1="230" y1="40" x2="230" y2="420" stroke="#1F8A4C" stroke-width="2"/>
        <line x1="40" y1="230" x2="420" y2="230" stroke="#1F8A4C" stroke-width="2"/>
        <path id="s50-sweep" d="M 230 230 L 230 40 A 190 190 0 0 1 380 115 Z" fill="rgba(245,197,24,0.38)"/>
        <circle cx="315" cy="145" r="11" fill="#E85A1F" stroke="#EFE9D9" stroke-width="3"/>
      </svg>
      <div class="cm-h2" style="color:#F5C518;margin-top:16px;">PHÒNG TÌNH HUỐNG NHÀ TRẮNG</div>
    </div>

    <!-- Right Korea Times Newspaper Evidence -->
    <div class="cm-evidence-paper" id="s50-kt" style="position:absolute;left:815px;top:165px;width:1020px;height:660px;display:flex;flex-direction:column;justify-content:center;box-shadow:12px 12px 0 #E85A1F;">
      <div class="cm-masthead" style="font-size:26px;">
        <span>THE KOREA TIMES • WASHINGTON DESK</span>
        <span>14 NOVEMBER 2026</span>
      </div>
      <div style="font-size:48px;font-weight:900;line-height:1.26;margin-top:16px;">
        <span class="cm-hl-yellow" data-var="${headK}">"Bessent blames Lutnick's Commerce Department for failing to block Nvidia chip smuggling"</span>
      </div>
      <div class="cm-card" style="margin-top:36px;background:#EFE9D9;">
        <div class="cm-h2">Mâu thuẫn gay gắt bùng phát giữa Bộ Tài chính & Bộ Thương mại Mỹ ngay trong Nhà Trắng</div>
      </div>
    </div>
  `;
  const js = `
    tl.fromTo(q('#s50-sweep'), { rotation: 0 }, { rotation: 720, duration: 9.5, ease: 'none', svgOrigin: '230 230' }, 0.35);
    popIn('#s50-kt', 6.85, { x: 36 }, { x: 0 }, 0.45, 'power3.out');
  `;
  return wrapScene(num, "Nhà Trắng & The Korea Times 14/11", dur, bodyHtml, js);
}

function scene53() {
  const num = 53, start = 615.30, dur = 9.60;
  const k = regVar("s53_k", "Cảnh 53 — Trát cưỡng chế", "TRÁT CƯỠNG CHẾ THƯỢNG VIỆN & LUẬT SƯ BÀO CHỮA");
  const subp = regVar("s53_subp", "Cảnh 53 — Mộc Trát", "SUBPOENA (TRÁT CƯỠNG CHẾ)");
  const l1 = regVar("s53_l1", "Cảnh 53 — Luật sư 1", "1. MELINDA HAAG (Cựu Công tố viên Liên bang)");
  const l2 = regVar("s53_l2", "Cảnh 53 — Luật sư 2", "2. WALTER BROWN (Chuyên gia án Hình sự Trắng)");

  queueSfx(start, 1.00, "slam");
  queueSfx(start, 5.10, "notify");
  queueSfx(start, 6.65, "pop");
  queueSfx(start, 7.75, "pop");

  const bodyHtml = `
    <div class="cm-header">
      <div class="cm-kicker orange">${ICONS.gavel}<span data-var="${k}">TRÁT CƯỠNG CHẾ THƯỢNG VIỆN & LUẬT SƯ BÀO CHỮA</span></div>
      <div class="cm-date-pill">12/11/2026</div>
    </div>

    <!-- Left Senate Subpoena Document -->
    <div class="cm-evidence-paper" id="s53-doc" style="position:absolute;left:95px;top:175px;width:820px;height:660px;box-shadow:10px 10px 0 #0F0F0F;">
      <div class="cm-masthead">
        <span>U.S. SENATE OVERSIGHT</span>
        <span>12 NOVEMBER 2026</span>
      </div>
      <div class="cm-h1" style="font-size:36px;margin-top:20px;">ỦY BAN THƯỢNG VIỆN MỸ PHÁT LỆNH TRIỆU TẬP BẮT BUỘC</div>
      <div class="cm-body" style="margin-top:22px;">Yêu cầu nộp toàn bộ tài liệu xuất khẩu & giao dịch chip qua Singapore</div>
      <div class="cm-stamp" id="s53-stamp" data-layout-allow-overlap data-layout-allow-occlusion style="bottom:68px;left:48px;font-size:30px;white-space:nowrap;padding:16px 28px;border-width:6px;">
        <span data-var="${subp}">SUBPOENA (TRÁT CƯỠNG CHẾ)</span>
      </div>
    </div>

    <!-- Right Paul, Weiss Dossier -->
    <div style="position:absolute;left:965px;top:175px;width:865px;display:flex;flex-direction:column;gap:28px;">
      <div id="s53-firm" class="cm-card dark" style="padding:26px 32px;box-shadow:10px 10px 0 #136636;">
        <div style="font-size:20px;font-weight:800;color:#F5C518;">HÃNG LUẬT BÀO CHỮA HẠNG NẶNG</div>
        <div class="cm-h1" style="color:#EFE9D9;font-size:38px;margin-top:8px;">PAUL, WEISS, RIFKIND, WHARTON & GARRISON</div>
      </div>

      <div id="s53-p1" class="cm-card yellow" style="padding:28px;">
        <div class="cm-h2" data-var="${l1}">1. MELINDA HAAG (Cựu Công tố viên Liên bang)</div>
      </div>

      <div id="s53-p2" class="cm-card orange-shadow" style="padding:28px;">
        <div class="cm-h2" data-var="${l2}">2. WALTER BROWN (Chuyên gia án Hình sự Trắng)</div>
      </div>
    </div>
  `;
  const js = `
    popIn('#s53-stamp', 1.00, { scale: 1.5, rotation: -12 }, { scale: 1, rotation: -5 }, 0.35, 'back.out(2)');
    popIn('#s53-firm', 5.10, { x: 35 }, { x: 0 }, 0.42, 'back.out(1.4)');
    popIn('#s53-p1', 6.65, { x: 35 }, { x: 0 }, 0.42, 'back.out(1.4)');
    popIn('#s53-p2', 7.75, { x: 35 }, { x: 0 }, 0.42, 'back.out(1.4)');
  `;
  return wrapScene(num, "Subpoena & Luật Sư Paul, Weiss", dur, bodyHtml, js);
}

function scene56() {
  const num = 56, start = 646.20, dur = 9.80;
  const k = regVar("s56_k", "Cảnh 56 — Biến động tài sản", "TÀI SẢN RÒNG CỦA JENSEN HUANG BỐC HƠI THEO GHẾ CEO");
  const fromK = regVar("s56_from", "Cảnh 56 — Đỉnh trước", "$155 TỶ USD");
  const toK = regVar("s56_to", "Cảnh 56 — Mức hiện tại C11", "$131 – $143 TỶ USD");

  queueSfx(start, 1.80, "click");
  queueSfx(start, 4.15, "pop");
  queueSfx(start, 6.35, "warn");

  const bodyHtml = `
    <div class="cm-header">
      <div class="cm-kicker orange">${ICONS.dollar}<span data-var="${k}">TÀI SẢN RÒNG CỦA JENSEN HUANG BỐC HƠI THEO GHẾ CEO</span></div>
      <div class="cm-date-pill">CHỈ TRONG VÀI NGÀY</div>
    </div>

    <div class="cm-card" style="position:absolute;left:140px;top:170px;width:1640px;height:660px;padding:30px;">
      <svg viewBox="0 0 1580 580" width="1580" height="580">
        <line x1="120" y1="490" x2="1460" y2="490" stroke="#0F0F0F" stroke-width="5"/>
        <!-- Before Bar ($155B) -->
        <rect id="s56-b1" x="280" y="120" width="320" height="370" rx="20" fill="#136636" stroke="#0F0F0F" stroke-width="5"/>
        <text id="s56-l1" x="440" y="92" text-anchor="middle" font-size="38" font-weight="900" fill="#136636" data-var="${fromK}">$155 TỶ USD</text>
        <text x="440" y="542" text-anchor="middle" font-size="26" font-weight="900" fill="#0F0F0F">TRƯỚC BIẾN CỐ</text>

        <!-- Downward Arrow -->
        <path id="s56-arr" d="M 670 155 Q 820 155 935 280" fill="none" stroke="#B83B0B" stroke-width="11" stroke-linecap="round"/>
        <polygon points="945,295 900,275 935,245" fill="#B83B0B"/>

        <!-- After Bar ($131-$143B) -->
        <rect id="s56-b2" x="980" y="210" width="360" height="280" rx="20" fill="#E85A1F" stroke="#0F0F0F" stroke-width="5"/>
        <text id="s56-l2" x="1160" y="182" text-anchor="middle" font-size="38" font-weight="900" fill="#B83B0B" data-var="${toK}">$131 – $143 TỶ USD</text>
        <text x="1160" y="542" text-anchor="middle" font-size="26" font-weight="900" fill="#0F0F0F">CHỈ TRONG VÀI NGÀY</text>
      </svg>
    </div>

    <div class="cm-lower-banner">
      <div class="cm-card dark" style="flex:1;padding:15px 28px;text-align:center;">
        <span class="cm-h2" style="color:#F5C518;">HÀNG CHỤC TỶ USD BAY MÀU CÙNG LỆNH CHẤM DỨT QUYỀN LỰC</span>
      </div>
    </div>
  `;
  const js = `
    tl.fromTo(q('#s56-b1'), { attr: { y: 490, height: 0 } }, { attr: { y: 120, height: 370 }, duration: 0.65, ease: 'power3.out' }, 1.80);
    popIn('#s56-l1', 2.15, { y: 12 }, { y: 0 }, 0.35, 'power2.out');
    tl.fromTo(q('#s56-arr'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 4.50);
    tl.fromTo(q('#s56-b2'), { attr: { y: 490, height: 0 } }, { attr: { y: 210, height: 280 }, duration: 0.65, ease: 'back.out(1.4)' }, 6.35);
    popIn('#s56-l2', 6.65, { y: 12 }, { y: 0 }, 0.35, 'power2.out');
  `;
  return wrapScene(num, "Tài Sản Ròng Giảm Về $131–$143B", dur, bodyHtml, js);
}

function scene58() {
  const num = 58, start = 676.90, dur = 16.20;
  const k = regVar("s58_k", "Cảnh 58 — Bức tranh hệ thống", "RỦI RO TẬP TRUNG CỦA TOÀN BỘ NỀN KINH TẾ AI");
  const topK = regVar("s58_top", "Cảnh 58 — Đỉnh kim tự tháp", "KINH TẾ AI TOÀN CẦU (HÀNG CHỤC NGHÌN TỶ USD)");
  const pinK = regVar("s58_pin", "Cảnh 58 — Điểm tựa duy nhất", "1 CÁ NHÂN • 0 PHƯƠNG ÁN DỰ PHÒNG");

  queueSfx(start, 0.4, "whoosh");
  queueSfx(start, 7.50, "ping");
  queueSfx(start, 13.55, "warn");

  const bodyHtml = `
    <div class="cm-header">
      <div class="cm-kicker dark">${ICONS.alert}<span data-var="${k}">RỦI RO TẬP TRUNG CỦA TOÀN BỘ NỀN KINH TẾ AI</span></div>
      <div class="cm-date-pill">ĐIỂM TỰA MONG MANH</div>
    </div>

    <div class="cm-card" style="position:absolute;left:130px;top:155px;width:1660px;height:690px;padding:24px;display:flex;align-items:center;justify-content:center;">
      <svg viewBox="0 0 1560 630" width="1560" height="630">
        <!-- Base Needle Fulcrum -->
        <polygon points="710,590 850,590 780,455" fill="#161618" stroke="#0F0F0F" stroke-width="5"/>
        <rect x="440" y="535" width="680" height="72" rx="16" fill="#E85A1F" stroke="#0F0F0F" stroke-width="5"/>
        <text x="780" y="582" text-anchor="middle" font-size="30" font-weight="900" fill="#0F0F0F" data-var="${pinK}">1 CÁ NHÂN • 0 PHƯƠNG ÁN DỰ PHÒNG</text>

        <!-- Inverted Massive AI Economy Pyramid Wobbling -->
        <g id="s58-pyr">
          <polygon points="220,45 1340,45 780,445" fill="#136636" stroke="#0F0F0F" stroke-width="7" stroke-linejoin="round"/>
          <line x1="360" y1="145" x2="1200" y2="145" stroke="#EFE9D9" stroke-width="4" stroke-dasharray="10 8"/>
          <line x1="510" y1="255" x2="1050" y2="255" stroke="#EFE9D9" stroke-width="4" stroke-dasharray="10 8"/>
          <text x="780" y="108" text-anchor="middle" font-size="34" font-weight="900" fill="#F5C518" data-var="${topK}">KINH TẾ AI TOÀN CẦU (HÀNG CHỤC NGHÌN TỶ USD)</text>
          <text x="780" y="212" text-anchor="middle" font-size="26" font-weight="800" fill="#EFE9D9">HẠ TẦNG GPU • CLOUD • NGÂN SÁCH QUỐC GIA</text>
          <text x="780" y="325" text-anchor="middle" font-size="26" font-weight="900" fill="#EFE9D9">NVIDIA CORRIDOR</text>
        </g>
      </svg>
    </div>

    <div class="cm-lower-banner">
      <div class="cm-card yellow" style="flex:1;padding:15px 28px;text-align:center;">
        <span class="cm-h2">TOÀN BỘ KIM TỰ THÁP TỶ ĐÔ NẰM THĂNG BẰNG TRÊN ĐÚNG MỘT ĐẦU KIM DUY NHẤT</span>
      </div>
    </div>
  `;
  const js = `
    popIn('#s58-pyr', 0.4, { y: -30 }, { y: 0 }, 0.6, 'back.out(1.4)');
    tl.to(q('#s58-pyr'), { rotation: -2.5, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: 7, svgOrigin: '780 445' }, 3.0);
  `;
  return wrapScene(num, "Kim Tự Tháp Đảo Ngược Kinh Tế AI", dur, bodyHtml, js);
}

function scene60() {
  const num = 60, start = 713.80, dur = 13.50;
  const k = regVar("s60_k", "Cảnh 60 — Nhìn về 2027", "CHẶNG ĐƯỜNG PHÍA TRƯỚC: TỪ CUỐI 2026 SANG NĂM 2027");
  const b1 = regVar("s60_b1", "Cảnh 60 — Nhánh 1", "1. BI KỊCH QUẢN TRỊ DOANH NGHIỆP");
  const b2 = regVar("s60_b2", "Cảnh 60 — Nhánh 2", "2. ÁN HÌNH SỰ • VẼ LẠI BẢN ĐỒ BÁN DẪN 2027");

  queueSfx(start, 2.25, "click");
  queueSfx(start, 5.75, "pop");
  queueSfx(start, 8.45, "ping");

  const bodyHtml = `
    <div class="cm-header">
      <div class="cm-kicker dark">${ICONS.gavel}<span data-var="${k}">CHẶNG ĐƯỜNG PHÍA TRƯỚC: TỪ CUỐI 2026 SANG NĂM 2027</span></div>
      <div class="cm-date-pill">TRƯỚC LỄ TẠ ƠN & 03/12/2026</div>
    </div>

    <svg viewBox="0 0 1760 660" width="1760" height="660" style="position:absolute;left:80px;top:170px;">
      <!-- Main Track Splitting to 2 Outcomes -->
      <path d="M 60 330 H 540" stroke="#0F0F0F" stroke-width="14" stroke-linecap="round"/>
      <path id="s60-p1" d="M 540 330 C 660 330, 720 155, 860 155" fill="none" stroke="#136636" stroke-width="12" stroke-linecap="round" stroke-dasharray="600" stroke-dashoffset="600"/>
      <path id="s60-p2" d="M 540 330 C 660 330, 720 505, 860 505" fill="none" stroke="#B83B0B" stroke-width="12" stroke-linecap="round" stroke-dasharray="600" stroke-dashoffset="600"/>

      <!-- Left Hub -->
      <rect x="40" y="220" width="500" height="220" rx="26" fill="#F5C518" stroke="#0F0F0F" stroke-width="6"/>
      <text x="290" y="310" text-anchor="middle" font-size="30" font-weight="900" fill="#0F0F0F">ĐIỀU TRẦN QUỐC HỘI</text>
      <text x="290" y="362" text-anchor="middle" font-size="26" font-weight="900" fill="#B83B0B">TRƯỚC TẠ ƠN & 03/12/2026</text>

      <!-- Branch 1 -->
      <g id="s60-g1">
        <rect x="860" y="55" width="840" height="210" rx="26" fill="#FBF7EC" stroke="#0F0F0F" stroke-width="6"/>
        <text x="905" y="135" font-size="34" font-weight="900" fill="#136636" data-var="${b1}">1. BI KỊCH QUẢN TRỊ DOANH NGHIỆP</text>
        <text x="905" y="195" font-size="24" font-weight="700" fill="#262626">Bài học đắt giá về quản trị quyền lực tại Silicon Valley</text>
      </g>

      <!-- Branch 2 -->
      <g id="s60-g2">
        <rect x="860" y="395" width="840" height="210" rx="26" fill="#E85A1F" stroke="#0F0F0F" stroke-width="6"/>
        <text x="905" y="475" font-size="33" font-weight="900" fill="#0F0F0F" data-var="${b2}">2. ÁN HÌNH SỰ • VẼ LẠI BẢN ĐỒ BÁN DẪN 2027</text>
        <text x="905" y="535" font-size="24" font-weight="800" fill="#0F0F0F">Truy tố hình sự & tái cấu trúc trật tự chip toàn cầu</text>
      </g>
    </svg>

    <div class="cm-lower-banner">
      <div class="cm-card dark" style="flex:1;padding:15px 28px;text-align:center;">
        <span class="cm-h2" style="color:#EFE9D9;">CÂU TRẢ LỜI SẼ ĐỊNH HÌNH TOÀN BỘ NGÀNH BÁN DẪN THẾ GIỚI NĂM 2027</span>
      </div>
    </div>
  `;
  const js = `
    tl.fromTo(q('#s60-p1'), { strokeDashoffset: 600 }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.out' }, 4.8);
    popIn('#s60-g1', 5.75, { x: 30 }, { x: 0 }, 0.45, 'back.out(1.4)');
    tl.fromTo(q('#s60-p2'), { strokeDashoffset: 600 }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.out' }, 7.5);
    popIn('#s60-g2', 8.45, { x: 30 }, { x: 0 }, 0.45, 'back.out(1.4)');
  `;
  return wrapScene(num, "2 Kịch Bản Hướng Về 2027", dur, bodyHtml, js);
}

function scene61() {
  const num = 61, start = 727.30, dur = 6.79;
  const k = regVar("s61_k", "Cảnh 61 — Lời cảm ơn", "CẢM ƠN BẠN ĐÃ XEM HẾT VIDEO");
  const subK = regVar("s61_sub", "Cảnh 61 — Kêu gọi hành động", "ĐĂNG KÝ KÊNH");
  const yrK = regVar("s61_yr", "Cảnh 61 — Hẹn gặp lại", "HẸN GẶP LẠI NĂM 2026");

  queueSfx(start, 0.25, "ding");
  queueSfx(start, 2.95, "sparkle");
  queueSfx(start, 4.80, "pop");

  const bodyHtml = `
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:38px;padding:80px;">
      <div id="s61-thanks" style="font-size:66px;font-weight:900;color:#EFE9D9;text-align:center;line-height:1.18;" data-var="${k}">
        CẢM ƠN BẠN ĐÃ XEM HẾT VIDEO
      </div>

      <div id="s61-cta" class="cm-card yellow" style="padding:28px 64px;border-radius:999px;border:5px solid #0F0F0F;box-shadow:10px 10px 0 #0F0F0F;display:inline-flex;align-items:center;gap:20px;">
        <svg viewBox="0 0 40 40" width="40" height="40"><circle cx="20" cy="20" r="18" fill="#DC2626" stroke="#0F0F0F" stroke-width="3"/><polygon points="16,12 29,20 16,28" fill="#FFFFFF"/></svg>
        <span style="font-size:42px;font-weight:900;color:#0F0F0F;" data-var="${subK}">ĐĂNG KÝ KÊNH</span>
      </div>

      <div id="s61-end" style="padding:14px 36px;border-radius:16px;border:3.5px solid #EFE9D9;color:#EFE9D9;font-size:30px;font-weight:900;" data-var="${yrK}">
        HẸN GẶP LẠI NĂM 2026
      </div>
    </div>
  `;
  const js = `
    popIn('#s61-thanks', 0.25, { y: 20 }, { y: 0 }, 0.5, 'power3.out');
    popIn('#s61-cta', 2.95, { scale: 0.84 }, { scale: 1 }, 0.5, 'back.out(1.7)');
    popIn('#s61-end', 4.80, { y: 16 }, { y: 0 }, 0.45, 'back.out(1.4)');
  `;
  return wrapScene(num, "Outro & CTA Đăng Ký Kênh", dur, bodyHtml, js, "", true);
}

// =========================================================================
// ALL 61 SHOTS MANIFEST & TIMING VERIFICATION
// =========================================================================

const SCENE_SPECS = [
  // #01 — WAY_B
  () => buildWayBScene({
    num: 1, title: "Hook: Jensen & $5.000 Tỷ USD", start: 0.00, dur: 11.40, broll: "shot-01.mp4",
    kicker: "KIẾN TRÚC SƯ TRƯỞNG KỶ NGUYÊN AI", datePill: "$5.000 TỶ USD",
    bottomCards: [
      { title: "JENSEN HUANG", sub: "Người đàn ông quyền lực nhất giới công nghệ", t: 2.45, variant: "green-shadow" },
      { title: "ĐẾ CHẾ BÁN DẪN $5.000 TỶ", sub: "Tâm điểm mọi con chip AI toàn cầu", t: 6.30, variant: "yellow" },
    ],
  }),
  // #02 — WAY_B
  () => buildWayBScene({
    num: 2, title: "33 Năm Quyền Lực & Bão Bê Bối", start: 11.40, dur: 13.80, broll: "shot-02.mp4",
    kicker: "TỪ ĐỈNH CAO QUYỀN LỰC ĐẾN RỜI GHẾ TRONG NHÁY MẮT", kickerStyle: "orange", datePill: "33 NĂM SÁNG LẬP",
    shadow: "ink",
    bottomCards: [
      { title: "TƯỚC SẠCH CHỨC VỤ SAU 33 NĂM", sub: "Rời bỏ ngai vàng ngay giữa tâm bão", t: 0.45, variant: "orange" },
      { title: "ĐIỀU TRẦN QUỐC HỘI • TÌNH ÁI • GIÁN ĐIỆP", sub: "Kịch bản còn khốc liệt hơn cả phim điện ảnh", t: 6.35, variant: "dark" },
    ],
  }),
  // #03 — WAY_A
  buildWayAScene03,
  // #04 — MOTION
  scene04,
  // #05 — WAY_B (D1 rotated Denny's 11/2026 badge)
  () => buildWayBScene({
    num: 5, title: "Quán Ăn Denny's & Tấm Bảng Đồng", start: 45.00, dur: 8.20, broll: "shot-05.mp4",
    kicker: "NƠI KHAI SINH ĐẾ CHẾ NVIDIA (1993)", datePill: "ĐÔNG SAN JOSE",
    shadow: "yellow",
    stamp: { text: "ĐÃ THÁO BẢNG VINH DANH • 11/2026", t: 5.80, top: 158, right: 92, rot: -6 },
    bottomCards: [
      { title: "QUÁN ĂN BÌNH DÂN DENNY'S — ĐÔNG SAN JOSE", sub: "Tấm bảng đồng vinh danh góc bàn kỷ niệm đã âm thầm bị tháo xuống", t: 0.45, variant: "green-shadow" },
    ],
  }),
  // #06 — MOTION
  scene06,
  // #07 — MOTION (Ad-lib B1)
  scene07,
  // #08 — WAY_B
  () => buildWayBScene({
    num: 8, title: "Cuộc Chiến Bán Dẫn Mỹ – Trung", start: 83.00, dur: 16.20, broll: "shot-08.mp4",
    flags: ["US", "CN"], kicker: "MẶT TRẬN CÔNG NGHỆ THẾ KỶ 21", kickerStyle: "dark", datePill: "CUỐI NĂM 2023",
    shadow: "green",
    bottomCards: [
      { flag: "US", title: "SẮC LỆNH CẤM XUẤT KHẨU CHIP AI", sub: "Chính quyền Tổng thống Joe Biden phong tỏa dòng chip cao cấp sang Trung Quốc", t: 4.00, variant: "orange-shadow" },
      { flag: "MY", title: "DỊCH CHUYỂN NGẦM ĐÔNG NAM Á", sub: "Các lô hàng bất ngờ chuyển hướng qua cảng khu vực", t: 13.75, variant: "yellow" },
    ],
  }),
  // #09 — MOTION
  scene09,
  // #10 — WAY_B
  () => buildWayBScene({
    num: 10, title: "Đặc Quyền Nvidia Cloud Partner", start: 111.40, dur: 16.40, broll: "shot-10.mp4",
    flags: ["SG"], kicker: "TẤM THẺ KIM CƯƠNG: NVIDIA CLOUD PARTNER", datePill: "ƯU TIÊN ĐẶC BIỆT",
    bottomCards: [
      { icon: "cpu", title: "ĐƯỢC PHÂN BỔ HÀNG TRĂM LÔ CHIP TỐI TÂN", sub: "Trong khi cả thế giới phải xếp hàng chờ đợi nhiều tháng liền", t: 7.80, variant: "yellow" },
    ],
  }),
  // #11 — WAY_B (Ad-lib B2)
  () => buildWayBScene({
    num: 11, title: "Alice Huang — Trùng Họ Không Huyết Thống", start: 127.80, dur: 12.70, broll: "shot-11.mp4",
    flags: ["CN"], kicker: "CHÂN DUNG NGƯỜI ĐỨNG SAU: ALICE HUANG", kickerStyle: "orange", datePill: "CỰU NHÂN VIÊN NGÂN HÀNG",
    bottomCards: [
      { title: "TRÙNG HỌ • KHÔNG QUAN HỆ HUYẾT THỐNG", sub: "Chuyển hướng bất ngờ sang thâu tóm hạ tầng công nghệ cao hàng tỷ đô", t: 4.50, variant: "green-shadow" },
    ],
  }),
  // #12 — MOTION (PA1 A1)
  scene12,
  // #13 — MOTION
  scene13,
  // #14 — WAY_B
  () => buildWayBScene({
    num: 14, title: "Câu Hỏi An Ninh Washington", start: 165.70, dur: 10.00, broll: "shot-14.mp4",
    flags: ["US"], kicker: "NGHI VẤN ĐẶT RA TỪ WASHINGTON", kickerStyle: "dark", datePill: "LÝ LỊCH MỜ ÁM",
    bottomCards: [
      { icon: "alert", title: "VÌ SAO PHÁP NHÂN NON TRẺ DỄ DÀNG NẮM NGUỒN CUNG KHỔNG LỒ?", sub: "Mọi đầu mối truy ngược đều dẫn thẳng về cuộc gặp bất ngờ", t: 1.65, variant: "orange-shadow" },
    ],
  }),
  // #15 — WAY_B
  () => buildWayBScene({
    num: 15, title: "Đài Bắc 12/2023 & 06/2024", start: 175.70, dur: 18.00, broll: "shot-15.mp4",
    flags: ["TW"], kicker: "BỮA TIỆC KÍN TẠI ĐÀI BẮC & MỐI QUAN HỆ NGOÀI LUỒNG", datePill: "12/2023 & 06/2024",
    cornerBadges: [
      { text: "KANG WEI GIỚI THIỆU VỢ", top: 152, right: 110, bg: "#F5C518", t: 7.30 },
      { text: "41 NĂM HÔN NHÂN", bottom: 172, left: 110, bg: "#E85A1F", t: 16.50 },
    ],
    bottomCards: [
      { flag: "TW", title: "TỪ QUÁN BAR ĐÀI BẮC ĐẾN CHUYẾN BAY MỸ ↔ ĐÀI LOAN ↔ TRUNG QUỐC", sub: "Những cuộc gặp gỡ vượt khỏi khuôn khổ giao dịch kinh doanh", t: 1.95, variant: "green-shadow" },
    ],
  }),
  // #16 — MOTION
  scene16,
  // #17 — WAY_B
  () => buildWayBScene({
    num: 17, title: "Tháng 09/2024: Bộ Thương Mại Mỹ Điều Tra", start: 200.90, dur: 7.40, broll: "shot-17.mp4",
    flags: ["US"], kicker: "BỘ THƯƠNG MẠI HOA KỲ ÂM THẦM MỞ HỒ SƠ", kickerStyle: "dark", datePill: "THÁNG 09/2024",
    bottomCards: [
      { icon: "shield", title: "TRUY VẾT DÒNG CHIP AI CHẢY QUA MEGASPEED", sub: "Bước điều tra mở màn cho cơn địa chấn tình báo", t: 0.50, variant: "green-shadow" },
    ],
  }),
  // #18 — MOTION
  scene18,
  // #19 — WAY_B
  () => buildWayBScene({
    num: 19, title: "Báo Cáo Lên Tổng Thống Trump 10/2025", start: 221.40, dur: 9.00, broll: "shot-19.mp4",
    flags: ["US"], kicker: "BÀN LÀM VIỆC TỔNG THỐNG DONALD TRUMP", datePill: "THÁNG 10/2025",
    bottomCards: [
      { flag: "US", title: "TIN TÌNH BÁO BÁO CÁO TRỰC TIẾP NHÀ TRẮNG", sub: "Xác nhận của các nguồn điều tra tờ The New York Times", t: 1.00, variant: "yellow" },
    ],
  }),
  // #20 — WAY_B
  () => buildWayBScene({
    num: 20, title: "Ngoại Trưởng Marco Rubio & Bản Ghi Nhớ Mật", start: 230.40, dur: 8.80, broll: "shot-20.mp4",
    flags: ["US"], kicker: "NGOẠI TRƯỞNG MARCO RUBIO & BẢN GHI NHỚ TÌNH BÁO", kickerStyle: "dark", datePill: "THÁNG 05/2026",
    bottomCards: [
      { icon: "doc", title: "DỮ LIỆU NGHE LÉN & GIÁM SÁT ĐIỆN TỬ", sub: "Cảnh báo nguy cơ điệp viên gây áp lực trực diện lên CEO Nvidia", t: 4.45, variant: "orange-shadow" },
    ],
  }),
  // #21 — MOTION
  scene21,
  // #22 — WAY_B (Howard Lutnick)
  () => buildWayBScene({
    num: 22, title: "Bộ Trưởng Thương Mại Howard Lutnick Trì Hoãn", start: 249.20, dur: 5.80, broll: "shot-22.mp4",
    flags: ["US"], kicker: "BỘ TRƯỞNG THƯƠNG MẠI HOWARD LUTNICK", kickerStyle: "orange", datePill: "TRÌ HOÃN NHIỀU THÁNG",
    bottomCards: [
      { icon: "alert", title: "HỒ SƠ CẤM VẬN MEGASPEED BỊ TREO LƠ LỬNG NHIỀU THÁNG TRỜI", t: 1.80, variant: "dark" },
    ],
  }),
  // #23 — WAY_B (PA1 A2: 2025 – 2026)
  () => buildWayBScene({
    num: 23, title: "Chiến Lược Ngoại Giao Mar-a-Lago", start: 255.00, dur: 16.10, broll: "shot-23.mp4",
    flags: ["US"], kicker: "MAR-A-LAGO & QUỐC YẾN NHÀ TRẮNG", datePill: "2025 – 2026",
    bottomCards: [
      { title: "BỮA TỐI MAR-A-LAGO THÁNG 04/2025", sub: "Ngồi bàn danh dự & vận động nới lỏng quy định xuất khẩu chip châu Á", t: 9.10, variant: "yellow" },
    ],
  }),
  // #24 — WAY_B + Economic Times/Reuters clipping
  () => buildWayBScene({
    num: 24, title: "Reuters: Ex-Nvidia CEO Misled Top Lawyer", start: 271.10, dur: 14.30, broll: "shot-24.mp4",
    kicker: "NHỮNG CUỘC CHẤT VẤN NỘI BỘ TẠI SANTA CLARA", kickerStyle: "dark", datePill: "THU 2025 → 14/11/2026",
    miniClip: { source: "ECONOMIC TIMES • REUTERS", date: "14/11/2026", headline: "Ex-Nvidia CEO misled top lawyer on relationship with Chinese woman", t: 8.50, top: 155, right: 86 },
    bottomCards: [
      { icon: "gavel", title: "PHÁP CHẾ NVIDIA ĐẶT CÂU HỎI VỀ MỐI QUAN HỆ VỚI ALICE HUANG", sub: "Lời khai thuở ban đầu sau này lại mâu thuẫn hoàn toàn", t: 6.40, variant: "orange-shadow" },
    ],
  }),
  // #25 — MOTION
  scene25,
  // #26 — MOTION
  scene26,
  // #27 — WAY_B
  () => buildWayBScene({
    num: 27, title: "29/10/2026: NYT Kích Nổ Quả Bom Đầu Tiên", start: 307.60, dur: 13.60, broll: "shot-27.mp4",
    kicker: "QUẢ BOM TRUYỀN THÔNG ĐẦU TIÊN PHÁT NỔ", kickerStyle: "orange", datePill: "29/10/2026",
    bottomCards: [
      { icon: "doc", title: "THE NEW YORK TIMES PHANH PHUI ĐƯỜNG DÂY ALICE HUANG & TÌNH BÁO", sub: "Gió đảo chiều hoàn toàn vào những ngày cuối tháng 10 năm 2026", t: 1.75, variant: "dark" },
    ],
  }),
  // #28 — WAY_B
  () => buildWayBScene({
    num: 28, title: "Phản Biện Ban Đầu: Rizzo & Jensen", start: 321.20, dur: 10.60, broll: "shot-28.mp4",
    kicker: "PHẢN ỨNG PHỦ NHẬN BAN ĐẦU CỦA NVIDIA", datePill: "SAU 29/10/2026",
    bottomCards: [
      { title: "JOHN RIZZO (PHÁT NGÔN VIÊN): \"KHÔNG CÓ GÌ BẤT THƯỜNG\"", t: 2.90, variant: "green-shadow" },
      { title: "JENSEN (BLOOMBERG): \"CHÍNH PHỦ CHƯA TỪNG CẢNH BÁO\"", t: 7.30, variant: "yellow" },
    ],
  }),
  // #29 — MOTION (PA1 A3)
  scene29,
  // #30 — WAY_B
  () => buildWayBScene({
    num: 30, title: "08/11/2026: Email Gửi >40.000 Nhân Viên", start: 337.40, dur: 17.80, broll: "shot-30.mp4",
    kicker: "LÁ THƯ XIN LỖI GỬI HƠN 40.000 NHÂN VIÊN TOÀN CẦU", kickerStyle: "dark", datePill: "08/11/2026",
    cornerBadges: [
      { icon: "mail", text: "GỬI >40.000 NHÂN VIÊN", top: 150, left: 105, bg: "#F5C518", t: 3.55 },
    ],
    bottomCards: [
      { title: "THỪA NHẬN QUAN HỆ NGOÀI LUỒNG • XIN LỖI GIA ĐÌNH", sub: "Khẳng định không rò rỉ bí mật công nghệ & tuyên bố sẽ tiếp tục chèo lái tập đoàn", t: 7.40, variant: "orange-shadow" },
    ],
  }),
  // #31 — MOTION
  scene31,
  // #32 — WAY_B + D2 Techmeme p66
  () => buildWayBScene({
    num: 32, title: "09/11/2026: FBI Điều Tra & Lời Khuyên Của Trump", start: 361.60, dur: 8.70, broll: "shot-32.mp4",
    flags: ["US"], kicker: "TỔNG THỐNG TRUMP TIẾT LỘ CUỘC ĐIỀU TRA FBI", datePill: "09/11/2026",
    miniClip: { source: "TECHMEME • THE NEW YORK TIMES", date: "09/11/2026", headline: "Trump says FBI investigating Jensen Huang matter, advises against stepping down", t: 3.60, top: 150, right: 86 },
    bottomCards: [
      { flag: "US", title: "CUỘC ĐIỆN THOẠI RIÊNG: \"ĐỪNG TỪ CHỨC\"", sub: "Bất chấp tuyên bố điều tra liên bang đang tiến hành", t: 5.50, variant: "yellow" },
    ],
  }),
  // #33 — WAY_B + Guardian Nov 10
  () => buildWayBScene({
    num: 33, title: "10/11: Kiện Tập Thể & Hãng Luật Wachtell", start: 370.30, dur: 17.80, broll: "shot-33.mp4",
    kicker: "SÓNG GIÓ PHÁP LÝ ẬP ĐẾN TỪ CỔ ĐÔNG", kickerStyle: "dark", datePill: "10/11/2026",
    miniClip: { source: "THE GUARDIAN", date: "10/11/2026", headline: "Nvidia shareholders sue board over Huang disclosure; Wachtell tapped to investigate", t: 5.20, top: 150, right: 86 },
    bottomCards: [
      { icon: "gavel", title: "CỔ ĐÔNG CALIFORNIA ĐỆ ĐƠN KIỆN TẬP THỂ", t: 3.70, variant: "orange-shadow" },
      { title: "THUÊ WACHTELL, LIPTON, ROSEN & KATZ ĐIỀU TRA ĐỘC LẬP", t: 13.45, variant: "green" },
    ],
  }),
  // #34 — MOTION
  scene34,
  // #35 — WAY_B
  () => buildWayBScene({
    num: 35, title: "Kimberly Powell — VP Mảng Y Tế", start: 397.70, dur: 10.00, broll: "shot-35.mp4",
    kicker: "NHÂN VẬT THỨ HAI: PHÓ CHỦ TỊCH MẢNG Y TẾ", kickerStyle: "orange", datePill: "KIMBERLY POWELL",
    bottomCards: [
      { icon: "alert", title: "KIMBERLY POWELL — BÁO CÁO TRỰC TIẾP DƯỚI QUYỀN CEO", sub: "Mối quan hệ công sở vi phạm trực diện chuẩn mực đạo đức lãnh đạo", t: 3.80, variant: "dark" },
    ],
  }),
  // #36 — MOTION
  scene36,
  // #37 — MOTION
  scene37,
  // #38 — MOTION
  scene38,
  // #39 — MOTION
  scene39,
  // #40 — MOTION
  scene40,
  // #41 — WAY_B
  () => buildWayBScene({
    num: 41, title: "Đêm Trắng 11/11 Tại Santa Clara", start: 454.40, dur: 14.70, broll: "shot-41.mp4",
    kicker: "ĐÊM TRẮNG ĐỊNH MỆNH TẠI SANTA CLARA", kickerStyle: "dark", datePill: "ĐÊM 11/11/2026",
    bottomCards: [
      { title: "VỊ THUYỀN TRƯỞNG 63 TUỔI TRƯỚC TỐI HẬU THƯ CỦA HĐQT", sub: "Chọn lựa khắc nghiệt: TỰ ĐỆ ĐƠN TỪ CHỨC hoặc BỊ SA THẢI NGAY LẬP TỨC", t: 8.25, variant: "orange" },
    ],
  }),
  // #42 — WAY_B
  () => buildWayBScene({
    num: 42, title: "Khoảnh Khắc Buông Xuôi Của Áo Khoác Da", start: 469.10, dur: 18.70, broll: "shot-42.mp4",
    kicker: "NHỮNG GIỜ PHÚT CUỐI CÙNG TRONG PHÒNG HỌP", datePill: "BIỂU TƯỢNG TAN VỠ",
    bottomCards: [
      { title: "\"SAO CŨNG ĐƯỢC. TÔI KHÔNG QUAN TÂM NỮA.\"", sub: "\"Tôi là một gã tồi tệ\" — Khoảnh khắc sụp đổ của người đứng đầu đế chế 5 nghìn tỷ", t: 13.35, variant: "dark" },
    ],
  }),
  // #43 — WAY_B (PA1 A4)
  () => buildWayBScene({
    num: 43, title: "Stephen Witt & Văn Hóa Sùng Bái Cá Nhân", start: 487.80, dur: 14.40, broll: "shot-43.mp4",
    kicker: "PHÂN TÍCH TÁC GIẢ THE NEW YORK TIMES", datePill: "STEPHEN WITT",
    bottomCards: [
      { icon: "doc", title: "VĂN HÓA SÙNG BÁI CÁ NHÂN QUÁ LỚN TẠI NVIDIA", sub: "Không ai trong bộ máy dám thẳng thắn phản biện hay ngăn cản người sáng lập", t: 5.45, variant: "yellow" },
    ],
  }),
  // #44 — MOTION
  scene44,
  // #45 — WAY_B
  () => buildWayBScene({
    num: 45, title: "Bộ Đôi Kế Nhiệm Tạm Thời", start: 516.20, dur: 8.20, broll: "shot-45.mp4",
    kicker: "NHÂN SỰ TIẾP QUẢN KHẨN CẤP", kickerStyle: "dark", datePill: "CHUYỂN GIAO QUYỀN LỰC",
    bottomCards: [
      { title: "COLETTE KRESS", sub: "CFO → CEO tạm quyền", t: 0.95, variant: "green" },
      { title: "HARVEY C. JONES", sub: "Chủ tịch HĐQT độc lập đầu tiên", t: 4.45, variant: "yellow" },
    ],
  }),
  // #46 — MOTION
  scene46,
  // #47 — MOTION
  scene47,
  // #48 — WAY_B
  () => buildWayBScene({
    num: 48, title: "Phản Ứng DOJ & Bắc Kinh", start: 544.20, dur: 18.40, broll: "shot-48.mp4",
    flags: ["US", "CN"], kicker: "BỘ TƯ PHÁP MỸ & PHẢN ỨNG TỪ BẮC KINH", datePill: "CHƯA KẾT LUẬN 100%",
    bottomCards: [
      { flag: "US", title: "TODD BLANCHE (CNN): CHƯA ĐỦ CHỨNG CỨ HOÀN TOÀN", sub: "Chính quyền nhấn mạnh chưa kết luận mọi cáo buộc gián điệp", t: 3.55, variant: "green-shadow" },
      { flag: "CN", title: "BẮC KINH BÁC BỎ HOÀN TOÀN: \"BÔI NHỌ\"", sub: "Gọi các cáo buộc từ Washington là suy diễn vô căn cứ", t: 16.00, variant: "orange-shadow" },
    ],
  }),
  // #49 — WAY_B
  () => buildWayBScene({
    num: 49, title: "Singapore Cấm Nhập Cảnh & Siết Điều Tra", start: 562.60, dur: 10.30, broll: "shot-49.mp4",
    flags: ["SG", "US"], kicker: "SINGAPORE & BỘ TƯ PHÁP MỸ SIẾT CHẶT VÒNG VÂY", datePill: "CẤM NHẬP CẢNH",
    bottomCards: [
      { flag: "SG", title: "SINGAPORE CHÍNH THỨC CẤM CỬA ALICE HUANG", sub: "Đồng thời mở rộng phối hợp điều tra gian lận thương mại cùng DOJ Mỹ", t: 0.45, variant: "orange" },
    ],
  }),
  // #50 — MOTION
  scene50,
  // #51 — WAY_B
  () => buildWayBScene({
    num: 51, title: "Scott Bessent Chất Vấn Howard Lutnick", start: 584.00, dur: 13.90, broll: "shot-51.mp4",
    flags: ["US"], kicker: "NỘI BỘ CHÍNH QUYỀN MỸ ĐỐI ĐẦU GAY GẮT", kickerStyle: "orange", datePill: "3 LẦN PHÊ DUYỆT",
    bottomCards: [
      { title: "BỘ TRƯỞNG TÀI CHÍNH SCOTT BESSENT vs HOWARD LUTNICK", sub: "Chất vấn kịch liệt vì lệnh cấm vận bị trì hoãn suốt từ tháng 10/2025", t: 1.00, variant: "dark" },
    ],
  }),
  // #52 — WAY_B + Techmeme p70 Politico
  () => buildWayBScene({
    num: 52, title: "Triệu Tập 03/12 & Điều Trần Quốc Hội", start: 597.90, dur: 17.40, broll: "shot-52.mp4",
    flags: ["US"], kicker: "QUỐC HỘI MỸ ĐỒNG LOẠT VÀO CUỘC", datePill: "LỄ TẠ ƠN & 03/12/2026",
    miniClip: { source: "TECHMEME • POLITICO", date: "13/11/2026", headline: "Sen. Tim Scott subpoenas Huang, Lutnick for Dec. 3 banking panel hearing", t: 9.50, top: 150, right: 86 },
    bottomCards: [
      { title: "HẠ VIỆN (BRIAN MAST)", sub: "Điều trần kín ngay trước Lễ Tạ ơn", t: 2.40, variant: "green-shadow" },
      { title: "THƯỢNG VIỆN (TIM SCOTT)", sub: "Triệu tập Huang & Lutnick ngày 03/12", t: 10.95, variant: "yellow" },
    ],
  }),
  // #53 — MOTION (PA1 A5 & D2)
  scene53,
  // #54 — WAY_B
  () => buildWayBScene({
    num: 54, title: "Kiến Nghị 'Bring Back The Boss'", start: 624.90, dur: 14.90, broll: "shot-54.mp4",
    kicker: "CƠN ĐỊA CHẤN CHIA RẼ NỘI BỘ NVIDIA", kickerStyle: "dark", datePill: "TRƯỚC BCTC Q3 (17/11)",
    bottomCards: [
      { title: "KIẾN NGHỊ \"BRING BACK THE BOSS\"", sub: "Cuộc giằng xé niềm tin trước ngày công bố báo cáo tài chính Quý 3 (17/11)", t: 8.55, variant: "yellow" },
    ],
  }),
  // #55 — WAY_B (C11 verified Rene Haas)
  () => buildWayBScene({
    num: 55, title: "Ứng Viên Kế Nhiệm Rene Haas (Arm)", start: 639.80, dur: 6.40, broll: "shot-55.mp4",
    kicker: "CUỘC ĐUA TÌM CEO DÀI HẠN", datePill: "ỨNG VIÊN NỔI BẬT",
    bottomCards: [
      { icon: "cpu", title: "RENE HAAS — GIÁM ĐỐC ĐIỀU HÀNH ARM", sub: "Cái tên được Phố Wall đồn đoán thay thế chiếc ghế bỏ trống", t: 2.45, variant: "green-shadow" },
    ],
  }),
  // #56 — MOTION (C11 $131-$143B)
  scene56,
  // #57 — WAY_B
  () => buildWayBScene({
    num: 57, title: "Cuộc Hôn Nhân 41 Năm & Nguy Cơ $70 Tỷ USD", start: 656.00, dur: 20.90, broll: "shot-57.mp4",
    kicker: "CƠN BÃO GIA ĐÌNH & LUẬT CHIA TÀI SẢN CALIFORNIA", kickerStyle: "orange", datePill: "41 NĂM HÔN NHÂN",
    cornerBadges: [
      { icon: "dollar", text: "LUẬT CALIFORNIA: CHIA ĐÔI 50% / 50%", top: 152, right: 105, bg: "#F5C518", t: 8.15 },
    ],
    bottomCards: [
      { title: "JENSEN & LORI HUANG — 41 NĂM ĐỒNG HÀNH TỪ NĂM 1985", sub: "Nguy cơ cuộc ly hôn đắt giá nhất lịch sử nhân loại: lên tới ~$70 TỶ USD", t: 5.55, variant: "dark" },
    ],
  }),
  // #58 — MOTION
  scene58,
  // #59 — WAY_B (3 SVG Arrows piercing frame)
  () => buildWayBScene({
    num: 59, title: "3 Mũi Tên Xuyên Thủng Áo Giáp $5.000 Tỷ", start: 693.10, dur: 20.70, broll: "shot-59.mp4",
    kicker: "SỰ SỤP ĐỔ CỦA BỘ GIÁP DA ĐEN", kickerStyle: "dark", datePill: "3 VẾT NỨT CHÍ MẠNG",
    arrowsSvg: `<svg viewBox="0 0 1920 1080" width="1920" height="1080" data-layout-allow-overlap style="position:absolute;inset:0;pointer-events:none;">
      <path class="cm-vec-arrow" d="M 160 320 C 260 320, 320 355, 420 390" fill="none" stroke="#E85A1F" stroke-width="10" stroke-linecap="round" stroke-dasharray="320"/>
      <path class="cm-vec-arrow" d="M 160 510 C 260 510, 320 510, 420 510" fill="none" stroke="#F5C518" stroke-width="10" stroke-linecap="round" stroke-dasharray="320"/>
      <path class="cm-vec-arrow" d="M 160 700 C 260 700, 320 665, 420 630" fill="none" stroke="#DC2626" stroke-width="10" stroke-linecap="round" stroke-dasharray="320"/>
    </svg>`,
    bottomCards: [
      { title: "1. VÙNG XÁM ĐỊA CHÍNH TRỊ", t: 14.50, variant: "orange-shadow" },
      { title: "2. ẢO TƯỞNG QUYỀN LỰC", t: 16.50, variant: "yellow" },
      { title: "3. NHỮNG LỜI NÓI DỐI", t: 18.40, variant: "orange" },
    ],
  }),
  // #60 — MOTION
  scene60,
  // #61 — MOTION
  scene61,
];

// Explicit Scene Meta for exact timing mapping
const TIMELINE_META = [
  [1, 0.00, 11.40, "01 — Hook: Đế Chế $5.000 Tỷ & Jensen"],
  [2, 11.40, 25.20, "02 — Hook: Bị Tước Chức Vụ Sau 33 Năm"],
  [3, 25.20, 35.50, "03 — Trụ Sở Santa Clara & Đỉnh 06/10"],
  [4, 35.50, 45.00, "04 — Lao Dốc >30% (-$1.800B > GDP MX+KR)"],
  [5, 45.00, 53.20, "05 — Denny's San Jose Tháo Bảng 11/2026"],
  [6, 53.20, 73.60, "06 — Cánh Cửa Đóng Kín & 3 Đầu Mối"],
  [7, 73.60, 83.00, "07 — Lưu Ý Nguồn Tin & Bắt Đầu"],
  [8, 83.00, 99.20, "08 — Ch.1: Cuộc Chiến Bán Dẫn Mỹ–Trung"],
  [9, 99.20, 111.40, "09 — Huang Le → Megaspeed → SwiftData"],
  [10, 111.40, 127.80, "10 — Đặc Quyền Nvidia Cloud Partner"],
  [11, 127.80, 140.50, "11 — Alice Huang (Trùng Họ, Không Huyết Thống)"],
  [12, 140.50, 157.90, "12 — ImportGenius: >200 Lô & Đỉnh >$7B"],
  [13, 157.90, 165.70, "13 — Thuê Cloud Từ Xa Alibaba & Tencent"],
  [14, 165.70, 175.70, "14 — Câu Hỏi Lớn Từ Washington"],
  [15, 175.70, 193.70, "15 — Ảnh Đài Bắc 12/2023 & 06/2024"],
  [16, 193.70, 200.90, "16 — Chuông Báo Động Washington"],
  [17, 200.90, 208.30, "17 — Ch.2: 09/2024 Bộ Thương Mại Điều Tra"],
  [18, 208.30, 221.40, "18 — Tình Báo Mỹ: MSS Tuyển Mộ Điệp Viên"],
  [19, 221.40, 230.40, "19 — 10/2025 Báo Cáo Tổng Thống Trump"],
  [20, 230.40, 239.20, "20 — 05/2026 Ngoại Trưởng Rubio & Ghi Nhớ Mật"],
  [21, 239.20, 249.20, "21 — 4/4 Cơ Quan An Ninh vs Entity List"],
  [22, 249.20, 255.00, "22 — Bộ Trưởng Howard Lutnick Trì Hoãn"],
  [23, 255.00, 271.10, "23 — Mar-a-Lago 04/2025 & Quốc Yến (2025–2026)"],
  [24, 271.10, 285.40, "24 — Chất Vấn Pháp Chế & Reuters 14/11"],
  [25, 285.40, 296.10, "25 — Tim Teter, Alison Wagonfeld & Dấu Mộc Nói Dối"],
  [26, 296.10, 307.60, "26 — Fortune 06/2025: Doanh Thu Singapore"],
  [27, 307.60, 321.20, "27 — Ch.3: 29/10/2026 NYT Nổ Quả Bom Đầu Tiên"],
  [28, 321.20, 331.80, "28 — John Rizzo & Jensen Phủ Nhận Ban Đầu"],
  [29, 331.80, 337.40, "29 — Sụp Đổ Hoàn Toàn Sau 10 Ngày"],
  [30, 337.40, 355.20, "30 — 08/11: Email Gửi >40.000 Nhân Viên"],
  [31, 355.20, 361.60, "31 — 08/11: Thông Cáo Tin Tưởng Từ HĐQT"],
  [32, 361.60, 370.30, "32 — Ch.4: 09/11 Trump Báo FBI & Khuyên Đừng Từ Chức"],
  [33, 370.30, 388.10, "33 — 10/11: Kiện Tập Thể & Thuê Wachtell"],
  [34, 388.10, 397.70, "34 — Tối Thứ Tư 11/11: Đòn Chí Mạng NYT"],
  [35, 397.70, 407.70, "35 — Kimberly Powell — VP Y Tế"],
  [36, 407.70, 417.60, "36 — Phản Ứng Cúp Máy Phóng Viên NYT"],
  [37, 417.60, 427.60, "37 — Reuters & Forbes: 3 Cuộc Ngoại Tình"],
  [38, 427.60, 439.80, "38 — Ch.5: Án Tử Quản Trị Mỹ (Intel/McDonald's)"],
  [39, 39.80 + 400, 447.40, "39 — <3% Cổ Phần & Không Siêu Biểu Quyết"],
  [40, 447.40, 454.40, "40 — Bloomberg/The Star: 'Piece of Sh—'"],
  [41, 454.40, 469.10, "41 — Đêm Trắng 11/11 & Tối Hậu Thư 63 Tuổi"],
  [42, 469.10, 487.80, "42 — Buông Xuôi Trong Áo Khoác Da Đen"],
  [43, 487.80, 502.20, "43 — Stephen Witt & Sùng Bái Cá Nhân"],
  [44, 502.20, 516.20, "44 — Sáng 12/11: Chấm Dứt 33 Năm Cầm Quyền"],
  [45, 516.20, 524.40, "45 — Colette Kress & Harvey C. Jones"],
  [46, 524.40, 532.40, "46 — 0 Dòng Cảm Ơn • 0 Lời Chia Tay"],
  [47, 532.40, 544.20, "47 — Ch.6: Domino 48h (12/11 → 14/11)"],
  [48, 544.20, 562.60, "48 — AG Todd Blanche & Bắc Kinh Bác Bỏ"],
  [49, 562.60, 572.90, "49 — Singapore Cấm Alice Huang & Siết DOJ"],
  [50, 572.90, 584.00, "50 — Nhà Trắng & Korea Times 14/11"],
  [51, 584.00, 597.90, "51 — Bessent Chất Vấn Lutnick Trì Hoãn"],
  [52, 597.90, 615.30, "52 — Mast Trước Tạ Ơn & Tim Scott 03/12"],
  [53, 615.30, 624.90, "53 — Subpoena & Hãng Luật Paul, Weiss"],
  [54, 624.90, 639.80, "54 — Nội Bộ Chia Rẽ: 'Bring Back The Boss'"],
  [55, 639.80, 646.20, "55 — Ứng Viên Kế Nhiệm Rene Haas (Arm)"],
  [56, 646.20, 656.00, "56 — Tài Sản Ròng Giảm Về $131–$143 Tỷ"],
  [57, 656.00, 676.90, "57 — Hôn Nhân 41 Năm & Nguy Cơ Ly Hôn ~$70B"],
  [58, 676.90, 693.10, "58 — Ch.7: Kim Tự Tháp AI Trên 1 Cá Nhân"],
  [59, 693.10, 713.80, "59 — 3 Mũi Tên Xuyên Áo Giáp $5.000 Tỷ"],
  [60, 713.80, 727.30, "60 — Hai Nhánh Hướng Tới Năm 2027"],
  [61, 727.30, 734.09, "61 — Cảm Ơn & Đăng Ký Kênh"],
];

if (SCENE_SPECS.length !== 61 || TIMELINE_META.length !== 61) {
  throw new Error(`Expected 61 scenes, got specs=${SCENE_SPECS.length}, meta=${TIMELINE_META.length}`);
}

// Check continuous timestamps
for (let i = 0; i < TIMELINE_META.length; i++) {
  const [n, st, en] = TIMELINE_META[i];
  if (n !== i + 1) throw new Error(`Index mismatch at ${i}`);
  if (i > 0 && Math.abs(st - TIMELINE_META[i - 1][2]) > 1e-6) {
    throw new Error(`Gap/overlap at scene ${n}: prevEnd=${TIMELINE_META[i - 1][2]} curStart=${st}`);
  }
}

// Verify all 33 B-roll files exist on disk before building
const BROLL_FILES = new Set(fs.readdirSync(BROLL_DIR));
for (const meta of TIMELINE_META) {
  const numStr = String(meta[0]).padStart(2, "0");
  // Check referenced broll files during HTML generation
}

// Generate all 61 sub-compositions
for (let i = 0; i < SCENE_SPECS.length; i++) {
  const num = i + 1;
  const numStr = String(num).padStart(2, "0");
  const html = SCENE_SPECS[i]();

  // Verify any video src referenced exists on disk
  const m = html.match(/src="\.\.\/assets\/broll\/(shot-\d+\.mp4)"/);
  if (m && !BROLL_FILES.has(m[1])) {
    throw new Error(`Missing B-roll file on disk: ${m[1]} required by scene-${numStr}.html`);
  }

  fs.writeFileSync(path.join(COMP_DIR, `scene-${numStr}.html`), html, "utf-8");
}

// Pack RAW_SFX_EVENTS onto Tracks 2, 3, 4 without overlap
RAW_SFX_EVENTS.sort((a, b) => a.start - b.start);
const trackLastEnd = { 2: -1, 3: -1, 4: -1 };
const PACKED_SFX = [];

for (const ev of RAW_SFX_EVENTS) {
  let chosenTrack = null;
  for (const tIdx of [2, 3, 4]) {
    if (ev.start >= trackLastEnd[tIdx] + 0.06) {
      chosenTrack = tIdx;
      break;
    }
  }
  if (!chosenTrack) {
    // Drop overflow if all 3 SFX tracks are saturated at the exact millisecond
    continue;
  }
  trackLastEnd[chosenTrack] = ev.start + ev.dur;
  PACKED_SFX.push({ ...ev, track: chosenTrack });
}

// Build Root index.html
const sceneClipsHtml = TIMELINE_META.map(([n, st, en, name]) => {
  const numStr = String(n).padStart(2, "0");
  const dur = (en - st).toFixed(2);
  return `  <div id="slot-scene-${numStr}" class="clip" data-Common-Name="${name}" data-composition-id="scene-${numStr}" data-composition-src="compositions/scene-${numStr}.html" data-start="${st.toFixed(2)}" data-duration="${dur}" data-track-index="0" data-width="1920" data-height="1080"></div>`;
}).join("\n");

const sfxClipsHtml = PACKED_SFX.map((ev, idx) => {
  const id = `sfx-beat-${String(idx + 1).padStart(3, "0")}`;
  return `  <audio id="${id}" class="clip" src="assets/sfx/${ev.file}" data-Common-Name="${ev.label}" data-start="${ev.start.toFixed(2)}" data-duration="${ev.dur.toFixed(2)}" data-track-index="${ev.track}" data-volume="${ev.vol}"></audio>`;
}).join("\n");

const varsJsonAttr = JSON.stringify(COMP_VARS).replace(/'/g, "&#39;");

const INDEX_HTML = `<!DOCTYPE html>
<html lang="vi" data-composition-variables='${varsJsonAttr}'>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=1920, height=1080" />
<title>Nvidia Drama — Documentary (1920x1080 @ 60fps)</title>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@500;600;700;800;900&display=swap" rel="stylesheet" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1920px; height: 1080px; overflow: hidden; background: #EFE9D9; font-family: 'Be Vietnam Pro', sans-serif; }
  #root { position: relative; width: 1920px; height: 1080px; overflow: hidden; background: #EFE9D9; }
  .clip[data-composition-src] { position: absolute; inset: 0; width: 1920px; height: 1080px; }
</style>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
</head>
<body>
<div id="root" data-composition-id="main" data-width="1920" data-height="1080" data-fps="60" data-duration="734.09">
${sceneClipsHtml}
  <audio id="voice-master" class="clip" src="assets/voice-master.mp3" data-Common-Name="Voiceover Master" data-start="0.00" data-duration="734.09" data-track-index="1" data-volume="1.00"></audio>
${sfxClipsHtml}
</div>
<script>
window.__timelines = window.__timelines || {};
const tl = gsap.timeline({ paused: true });
tl.set(document.getElementById('root'), { opacity: 1 }, 734.09);
window.__timelines["main"] = tl;
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(ROOT, "index.html"), INDEX_HTML, "utf-8");

console.log(
  JSON.stringify(
    {
      status: "ok",
      scenes: SCENE_SPECS.length,
      duration: 734.09,
      variablesCount: COMP_VARS.length,
      sfxQueued: RAW_SFX_EVENTS.length,
      sfxPacked: PACKED_SFX.length,
    },
    null,
    2
  )
);
