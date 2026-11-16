import { writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const projDir = 'f:/App nha lam/motion-video-demo/videos/oppo-a7-pro';
const compDir = join(projDir, 'compositions');
mkdirSync(compDir, { recursive: true });
for (const f of readdirSync(compDir)) {
  if (f.endsWith('.html')) unlinkSync(join(compDir, f));
}

const mode = process.argv[2] || 'animated';

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
  .ground-cream {
    position: absolute;
    inset: 0;
    background: var(--bg_cream, #EFE9D9);
    z-index: 0;
  }
  .ground-green {
    position: absolute;
    inset: 0;
    background: #136636;
    z-index: 0;
  }
  .cm-stage {
    position: absolute;
    inset: 0;
    z-index: 2;
  }
  .cm-kicker {
    display: inline-block;
    background: #0F0F0F;
    color: #EFE9D9;
    font-family: "JetBrains Mono", monospace;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 7px 16px;
    border: 4px solid #0F0F0F;
    align-self: flex-start;
  }
  .cm-pill {
    display: inline-block;
    background: #EFE9D9;
    color: #0F0F0F;
    font-family: "JetBrains Mono", monospace;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 6px 18px;
    border: 4px solid #0F0F0F;
    border-radius: 999px;
    align-self: flex-start;
  }
  .cm-mono-dark-pill {
    display: inline-block;
    background: #0F0F0F;
    color: #EFE9D9;
    font-family: "JetBrains Mono", monospace;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 4px 12px;
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
    font-weight: 700;
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
    background: var(--accent_green, #136636);
    color: #EFE9D9;
    border: 5px solid #0F0F0F;
  }
  .cm-card-ink {
    background: #0F0F0F;
    color: #EFE9D9;
    border: 5px solid #0F0F0F;
  }
  .cm-shadow-featured {
    box-shadow: 12px 12px 0 var(--accent_orange, #E85A1F), 12px 12px 0 4px #0F0F0F;
  }
  .cm-shadow-ink {
    box-shadow: 10px 10px 0 #0F0F0F;
  }
  .cm-badge-rot {
    background: var(--accent_yellow, #F5C518);
    color: #0F0F0F;
    border: 5px solid #0F0F0F;
    transform: rotate(-3deg);
    padding: 12px 22px;
  }
  .cm-stamp-rot {
    background: var(--accent_pink, #F06CA8);
    color: #0F0F0F;
    border: 5px solid #0F0F0F;
    transform: rotate(-4deg);
    padding: 14px 24px;
  }
`;

// All 21 scenes & internal tl.fromTo(...) cues are 100% locked (±0.02s) to OpenAI Whisper word-level timecodes (oppo_whisper.txt).
const scenes = [
  // =========================================================================
  // SCENE 01: 0.00 - 12.00s (dur 12.00s) [A-roll + B-roll + Motion Overlay]
  // Verified Whisper words:
  // 1.60..2.60: "lấy[1.60] tay che[1.92] logo[2.16] này đi"
  // 5.18..6.40: "đặc[5.18] biệt là cái cụm[5.94] camera[6.18] này"
  // 8.52..10.50: "nghĩ[8.52] đây là iPhone[9.40] Air[9.76] thế hệ thứ 2[10.50]"
  // 10.78..11.20: "Nhưng[10.78] không![11.20]"
  // =========================================================================
  {
    id: 'scene-01',
    start: 0.00,
    duration: 12.00,
    label: '01: Thử thách che logo — Tưởng iPhone Air thế hệ 2',
    css: `
      #s1-left { position: absolute; top: 64px; left: 48px; width: 460px; display: flex; flex-direction: column; gap: 14px; }
      #s1-right { position: absolute; top: 64px; right: 48px; width: 490px; display: flex; flex-direction: column; gap: 14px; }
    `,
    html: `
      <div class="cm-stage">
        <div id="s1-left">
          <div id="s1-kicker" class="cm-kicker">THỬ THÁCH CHE LOGO MẶT LƯNG</div>
          <div id="s1-card1" class="cm-card-cream cm-shadow-ink" style="padding:18px 22px;display:flex;flex-direction:column;gap:8px;">
            <div class="cm-mono" style="font-size:16px;">ĐIỂM NHẤN NGOẠI HÌNH</div>
            <div class="cm-head" style="font-size:30px;">CỤM CAMERA NGANG KÉO DÀI</div>
          </div>
        </div>
        <div id="s1-right">
          <div id="s1-guess" class="cm-card-pink cm-shadow-featured" style="padding:20px 24px;display:flex;flex-direction:column;gap:8px;">
            <div class="cm-mono" style="font-size:16px;">NHIỀU NGƯỜI SẼ LẦM TƯỞNG</div>
            <div class="cm-head" style="font-size:32px;" data-var-text="s1_guess">IPHONE AIR THẾ HỆ 2?</div>
          </div>
          <div id="s1-nope" class="cm-badge-rot" style="align-self:flex-end;">
            <div class="cm-head" style="font-size:28px;">NHƯNG KHÔNG PHẢI! ✕</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s1-kicker", { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 1.55);
      tl.fromTo("#s1-card1", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 5.15);
      tl.fromTo("#s1-guess", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 8.80);
      tl.fromTo("#s1-nope", { scale: 1.22, rotation: -9, opacity: 0 }, { scale: 1, rotation: -3, opacity: 1, duration: 0.48, ease: "power4.out" }, 10.75);
    `
  },

  // [PASS-THROUGH 1: 12.00s - 19.35s — Chữ lớn "OPPO A7 PRO" của video gốc]

  // =========================================================================
  // SCENE 02: 19.35 - 31.65s (dur 12.30s) [A-roll + Motion Overlay]
  // Local = global - 19.35:
  // 19.38..22.36 (0.03..3.01): "Có lẽ tôi là người trên tay cũng như đánh[21.20] giá con máy này muộn[21.98] nhất YouTube[22.36]"
  // 28.54..29.86 (9.19..10.51): "mức[28.54] giá[28.68] của nó đã dễ[29.38] chịu hơn"
  // 30.22..31.46 (10.87..12.11): "so với thời[30.22] điểm mới[30.52] ra mắt rất rất nhiều rồi"
  // =========================================================================
  {
    id: 'scene-02',
    start: 19.35,
    duration: 12.30,
    label: '02: Đánh giá muộn nhưng Giá đã hạ nhiệt rất nhiều',
    css: `
      #s2-left { position: absolute; top: 64px; left: 48px; width: 460px; display: flex; flex-direction: column; gap: 14px; }
      #s2-right { position: absolute; top: 64px; right: 48px; width: 460px; display: flex; flex-direction: column; gap: 14px; }
    `,
    html: `
      <div class="cm-stage">
        <div id="s2-left">
          <div id="s2-kicker" class="cm-kicker">GÓC NHÌN THỰC TẾ</div>
          <div id="s2-card1" class="cm-card-cream cm-shadow-ink" style="padding:18px 22px;display:flex;flex-direction:column;gap:8px;">
            <div class="cm-mono" style="font-size:16px;" data-var-text="product_name">OPPO A7 PRO 5G</div>
            <div class="cm-head" style="font-size:30px;">ĐÁNH GIÁ MUỘN NHẤT YOUTUBE?</div>
          </div>
        </div>
        <div id="s2-right">
          <div id="s2-card2" class="cm-card-yellow cm-shadow-featured" style="padding:20px 24px;display:flex;flex-direction:column;gap:10px;">
            <div class="cm-mono" style="font-size:16px;">LÝ DO ĐÁNG XEM LÚC NÀY</div>
            <div class="cm-head" style="font-size:34px;">MỨC GIÁ ĐÃ DỄ CHỊU HƠN RẤT NHIỀU!</div>
            <div id="s2-sub" class="cm-mono-dark-pill">SO VỚI THỜI ĐIỂM MỚI RA MẮT</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s2-kicker", { y: -22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 0.35);
      tl.fromTo("#s2-card1", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 1.80);
      tl.fromTo("#s2-card2", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 9.15);
      tl.fromTo("#s2-sub", { scale: 1.16, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.48, ease: "power3.out" }, 10.85);
    `
  },

  // =========================================================================
  // SCENE 03: 31.65 - 48.95s (dur 17.30s) [100% Motion Graphics — Price Drop]
  // Local = global - 31.65:
  // 31.70..34.74 (0.05..3.09): "lúc[32.14] ra mắt thì giá tầm khoảng 13[33.82]–14[34.08] triệu[34.74]"
  // 36.66..38.04 (5.01..6.39): "kiểm[36.66] tra lại giá ở trên Shopee[38.04]"
  // 40.34..41.40 (8.69..9.75): "chỉ loanh quanh 9[40.34]–10[40.56] triệu[41.12] thôi"
  // 42.58..44.32 (10.93..12.67): "không[42.58] phải mức giá rẻ[43.24] nhất"
  // 45.70..48.80 (14.05..17.15): "mua[45.70] thông qua video[46.32] này ➔ áp[48.14] thêm voucher[48.80]"
  // =========================================================================
  {
    id: 'scene-03',
    start: 31.65,
    duration: 17.30,
    label: '03: Cú rơi giá 13–14 Triệu xuống 9–10 Triệu & Đặc quyền Voucher',
    css: `
      #s3-wrap { position: absolute; inset: 60px 84px; display: flex; flex-direction: column; justify-content: center; gap: 26px; }
      #s3-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; align-items: stretch; }
      .s3-cell { padding: 28px 26px; display: flex; flex-direction: column; justify-content: space-between; gap: 14px; }
      #s3-banner { padding: 20px 28px; display: flex; align-items: center; justify-content: space-between; }
    `,
    html: `
      <div class="ground-cream"></div>
      <div class="cm-stage">
        <div id="s3-wrap">
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div id="s3-kicker" class="cm-kicker">BÀI TOÁN GIÁ BÁN HIỆN TẠI</div>
              <div id="s3-pill" class="cm-pill">KIỂM TRA TRỰC TIẾP TRÊN SHOPEE</div>
            </div>
            <div id="s3-title" class="cm-head" style="font-size:62px;">HẠ NHIỆT SÂU SO VỚI LÚC MỚI RA MẮT</div>
          </div>

          <div id="s3-grid">
            <div id="s3-c1" class="s3-cell cm-card-cream2">
              <div class="cm-mono" style="font-size:18px;">01 // THỜI ĐIỂM RA MẮT</div>
              <div class="cm-head" style="font-size:66px;text-decoration:line-through;color:#2A2A2A;" data-var-text="price_launch">13 – 14TR</div>
              <div class="cm-body" style="font-size:21px;">Mức giá niêm yết ban đầu khá cao so với mặt bằng cấu hình</div>
            </div>

            <div id="s3-c2" class="s3-cell cm-card-yellow cm-shadow-ink">
              <div class="cm-mono" style="font-size:18px;">02 // KIỂM TRA TRÊN SHOPEE</div>
              <div class="cm-head" style="font-size:66px;" data-var-text="price_shopee">9 – 10TR</div>
              <div class="cm-mono-dark-pill">ĐÃ GIẢM NGAY ~4 TRIỆU ĐỒNG</div>
            </div>

            <div id="s3-c3" class="s3-cell cm-card-pink cm-shadow-featured">
              <div class="cm-mono" style="font-size:18px;">03 // CHƯA PHẢI RẺ NHẤT!</div>
              <div class="cm-head" style="font-size:40px;">ÁP THÊM VOUCHER ĐỘC QUYỀN</div>
              <div class="cm-mono-dark-pill">YOUTUBE SHOPPING × SHOPEE</div>
            </div>
          </div>

          <div id="s3-banner" class="cm-card-ink">
            <div class="cm-head" style="font-size:28px;color:#EFE9D9;">MUA QUA GIỎ HÀNG VIDEO NÀY ➔ ÁP THÊM MÃ GIẢM 20% – 50%</div>
            <div class="cm-mono" style="font-size:19px;color:#F5C518;">XEM VOUCHER NGAY SAU ĐÂY ▶</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s3-kicker", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 0.15);
      tl.fromTo("#s3-title", { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "power3.out" }, 0.45);
      tl.fromTo("#s3-c1", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 2.00);
      tl.fromTo("#s3-pill", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 4.95);
      tl.fromTo("#s3-c2", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 8.55);
      tl.fromTo("#s3-c3", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 10.90);
      tl.fromTo("#s3-banner", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.50, ease: "power3.out" }, 14.00);
    `
  },

  // [PASS-THROUGH 2 (VOUCHER): 48.95s - 67.10s — Giữ nguyên 100% Voucher YouTube Shopping & Banner Shopee]

  // =========================================================================
  // SCENE 04: 67.10 - 86.65s (dur 19.55s) [Part 1: A-roll Overlay (0..4.15s) ➔ Part 2: 100% Motion (4.15..19.55s)]
  // Local = global - 67.10:
  // 67.44..71.10 (0.34..4.00): "mức giá[67.72] nhiều khi chỉ loanh quanh 9[70.06] triệu 1 đến 9[70.68] triệu 2 thôi"
  // 71.26..74.62 (4.16..7.52): "Bây[71.26] giờ đang xem không[72.26] phải ngày lễ[72.84] gì hết mà xem trực tiếp trên Shopee[74.62]"
  // 75.24..77.14 (8.14..10.04): "giá[75.24] của nó đã là tầm 9[76.42] triệu 7[76.74] rồi"
  // 78.46..80.78 (11.36..13.68): "săn[78.46] với mức giá rẻ[79.20] hơn vài trăm K là điều khá là dễ[80.64]"
  // 81.80..85.92 (14.70..18.82): "Vậy[81.80] thì câu hỏi[82.58] đặt ra... về dưới[85.44] 10 triệu[85.92]"
  // =========================================================================
  {
    id: 'scene-04',
    start: 67.10,
    duration: 19.55,
    label: '04: Giá thực tế sau áp mã — Chỉ còn 9,1 đến 9,2 Triệu',
    css: `
      #s4-part1, #s4-part2 { position: absolute; inset: 0; }
      #s4-p1-left { position: absolute; top: 64px; left: 48px; width: 460px; display: flex; flex-direction: column; gap: 14px; }
      #s4-p1-right { position: absolute; top: 64px; right: 48px; width: 470px; display: flex; flex-direction: column; gap: 14px; }
      #s4-p2-wrap { position: absolute; inset: 60px 84px; display: flex; flex-direction: column; justify-content: center; gap: 28px; }
      #s4-p2-grid { display: grid; grid-template-columns: 1fr 1.15fr; gap: 32px; align-items: stretch; }
    `,
    html: `
      <div id="s4-part1" class="cm-stage">
        <div id="s4-p1-left">
          <div id="s4-kicker" class="cm-kicker">MỨC GIÁ SAU KHI SĂN SALE</div>
        </div>
        <div id="s4-p1-right">
          <div id="s4-deal" class="cm-card-yellow cm-shadow-featured" style="padding:20px 24px;display:flex;flex-direction:column;gap:8px;">
            <div class="cm-mono" style="font-size:16px;">CHỐT ĐƠN THỰC TẾ CHỈ CÒN</div>
            <div class="cm-head" style="font-size:48px;" data-var-text="price_voucher">9,1 – 9,2 TRIỆU</div>
            <div class="cm-mono-dark-pill">ĐÃ ÁP VOUCHER ĐỘC QUYỀN</div>
          </div>
        </div>
      </div>

      <div id="s4-part2" class="cm-stage" style="opacity:0;">
        <div class="ground-cream"></div>
        <div id="s4-p2-wrap" style="z-index:2;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div id="s4-p2-kicker" class="cm-kicker">XEM TRỰC TIẾP TRÊN SHOPEE</div>
            <div id="s4-p2-pill" class="cm-pill">KHÔNG PHẢI NGÀY LỄ LỚN</div>
          </div>
          <div id="s4-p2-title" class="cm-head" style="font-size:60px;">SĂN RẺ HƠN VÀI TRĂM K CỰC KỲ DỄ!</div>

          <div id="s4-p2-grid">
            <div id="s4-normal" class="cm-card-cream2 cm-shadow-ink" style="padding:32px 34px;display:flex;flex-direction:column;gap:14px;">
              <div class="cm-mono" style="font-size:18px;">GIÁ NGÀY THƯỜNG TRÊN SHOPEE</div>
              <div class="cm-head" style="font-size:76px;">9,7 TRIỆU</div>
              <div class="cm-body" style="font-size:22px;">Mức giá ngày thường chưa cần đợi dịp lễ hội lớn</div>
            </div>

            <div id="s4-final" class="cm-card-green cm-shadow-featured" style="padding:32px 34px;display:flex;flex-direction:column;gap:14px;">
              <div class="cm-mono-dark-pill">SĂN THÊM MÃ GIẢM VÀI TRĂM K</div>
              <div class="cm-head" style="font-size:76px;color:#EFE9D9;">9,1 – 9,2 TRIỆU</div>
              <div class="cm-head" style="font-size:26px;color:#F5C518;">TIẾT KIỆM NGAY 500K – 600K RẤT DỄ DÀNG ✓</div>
            </div>
          </div>

          <div id="s4-bottom" class="cm-card-ink" style="padding:18px 28px;display:flex;justify-content:space-between;align-items:center;">
            <div class="cm-head" style="font-size:28px;color:#EFE9D9;">CÂU HỎI ĐẶT RA: KHI VỀ DƯỚI 10 TRIỆU ➔ LIỆU CÓ ĐÁNG MUA?</div>
            <div class="cm-mono" style="font-size:19px;color:#F5C518;">ĐÁNH GIÁ CHI TIẾT ▶</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s4-kicker", { y: -22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 0.30);
      tl.fromTo("#s4-deal", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 2.80);

      tl.to("#s4-part1", { opacity: 0, duration: 0.25, ease: "power2.inOut" }, 4.10);
      tl.fromTo("#s4-part2", { opacity: 0 }, { opacity: 1, duration: 0.30, ease: "power2.out" }, 4.15);
      tl.fromTo("#s4-p2-kicker", { y: -18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.46, ease: "power3.out" }, 4.25);
      tl.fromTo("#s4-p2-pill", { y: -18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.46, ease: "power3.out" }, 5.10);
      tl.fromTo("#s4-p2-title", { x: -36, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "power3.out" }, 6.80);
      tl.fromTo("#s4-normal", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 8.95);
      tl.fromTo("#s4-final", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 11.35);
      tl.fromTo("#s4-bottom", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.50, ease: "power3.out" }, 14.70);
    `
  },

  // [PASS-THROUGH 3: 86.65s - 97.60s — Hộp câu hỏi gốc góc dưới trái + Intro ĐỨC BIẾT TECH]

  // =========================================================================
  // SCENE 05: 97.60 - 122.50s (dur 24.90s) [A-roll & B-roll + Motion Overlay]
  // Local = global - 97.60:
  // 98.18..98.68 (0.58..1.08): "yếu[98.18] tố đầu tiên[98.68]"
  // 104.50..106.28 (6.90..8.68): "liên quan thiết[106.00] kế[106.28]"
  // 109.84..110.54 (12.24..12.94): "Xanh[109.84] Sóng[110.24] Biển[110.54]"
  // 111.92..112.54 (14.32..14.94): "Titan[111.92] Ánh[112.36] Kim[112.54]"
  // 118.10..122.30 (20.50..24.70): "hiệu[118.10] ứng màu xanh... sóng[120.14] biển thay đổi theo ánh sáng[122.30]"
  // =========================================================================
  {
    id: 'scene-05',
    start: 97.60,
    duration: 24.90,
    label: '05: Thiết kế — 2 Phiên bản Xanh Sóng Biển & Titan Ánh Kim',
    css: `
      #s5-left { position: absolute; top: 64px; left: 48px; width: 460px; display: flex; flex-direction: column; gap: 14px; }
      #s5-right { position: absolute; top: 64px; right: 48px; width: 460px; display: flex; flex-direction: column; gap: 14px; }
    `,
    html: `
      <div class="cm-stage">
        <div id="s5-left">
          <div id="s5-kicker" class="cm-kicker">01 // YẾU TỐ GÂY "WOW" ĐẦU TIÊN</div>
          <div id="s5-wow" class="cm-card-yellow cm-shadow-featured" style="padding:20px 24px;display:flex;flex-direction:column;gap:8px;">
            <div class="cm-mono" style="font-size:16px;">ĐIỂM SÁNG LỚN NHẤT</div>
            <div class="cm-head" style="font-size:31px;">NGOẠI HÌNH & THIẾT KẾ</div>
          </div>
        </div>
        <div id="s5-right">
          <div id="s5-v1" class="cm-card-green cm-shadow-ink" style="padding:18px 22px;display:flex;flex-direction:column;gap:6px;">
            <div class="cm-mono-dark-pill">PHIÊN BẢN 01 (TRÊN TAY)</div>
            <div class="cm-head" style="font-size:32px;color:#EFE9D9;">XANH SÓNG BIỂN</div>
          </div>
          <div id="s5-v2" class="cm-card-cream cm-shadow-ink" style="padding:18px 22px;display:flex;flex-direction:column;gap:6px;">
            <div class="cm-mono" style="font-size:16px;">PHIÊN BẢN 02</div>
            <div class="cm-head" style="font-size:32px;">TITAN ÁNH KIM</div>
          </div>
          <div id="s5-wave" class="cm-card-pink cm-shadow-ink" style="padding:18px 22px;display:flex;flex-direction:column;gap:6px;">
            <div class="cm-mono" style="font-size:16px;">HIỆU ỨNG THỊ GIÁC</div>
            <div class="cm-head" style="font-size:26px;">VÂN SÓNG BIỂN ĐỔI MÀU THEO ÁNH SÁNG!</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s5-kicker", { y: -22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 0.55);
      tl.fromTo("#s5-wow", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 7.80);
      tl.fromTo("#s5-v1", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 12.10);
      tl.fromTo("#s5-v2", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 14.15);
      tl.fromTo("#s5-wave", { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 20.45);
    `
  },

  // =========================================================================
  // SCENE 06: 122.50 - 146.00s (dur 23.50s) [100% Motion Graphics — OPPO Design DNA]
  // Local = global - 122.50:
  // 122.52..126.40 (0.02..3.90): "những dòng điện thoại của Oppo[124.90] dòng tầm trung[126.40]"
  // 127.54..129.84 (5.04..7.34): "dòng Reno[127.54] hay dòng giá rẻ dòng A[129.62]"
  // 133.52..135.22 (11.02..12.72): "phong[133.52] cách thiết kế rất là mới, rất là độc lạ[135.22]"
  // 136.16..137.40 (13.66..14.90): "không[136.16] đụng hàng với các hãng khác[137.26]"
  // 138.60..140.60 (16.10..18.10): "ngay[138.60] cả dòng sản phẩm của họ cũng không đụng hàng[140.42]"
  // 141.48..143.08 (18.98..20.58): "A6[141.48] khác A7[143.08]"
  // 143.74..145.80 (21.24..23.30): "Reno[143.74] 16 khác Reno 17[145.56]"
  // =========================================================================
  {
    id: 'scene-06',
    start: 122.50,
    duration: 23.50,
    label: '06: DNA Thiết kế OPPO — Không đụng hàng & Không lặp lại chính mình',
    css: `
      #s6-wrap { position: absolute; inset: 60px 84px; display: flex; flex-direction: column; justify-content: center; gap: 26px; }
      #s6-grid { display: grid; grid-template-columns: 1fr 1.15fr; gap: 30px; align-items: stretch; }
      .s6-col { padding: 28px 30px; display: flex; flex-direction: column; gap: 16px; }
    `,
    html: `
      <div class="ground-cream"></div>
      <div class="cm-stage">
        <div id="s6-wrap">
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div id="s6-kicker" class="cm-kicker">TRIẾT LÝ NGOẠI HÌNH CỦA OPPO</div>
              <div id="s6-pill" class="cm-pill">TẦM TRUNG (RENO) & GIÁ RẺ (DÒNG A)</div>
            </div>
            <div id="s6-title" class="cm-head" style="font-size:60px;">PHONG CÁCH MỚI MẺ · RẤT ĐỘC LẠ</div>
          </div>

          <div id="s6-grid">
            <div id="s6-left" class="s6-col cm-card-yellow cm-shadow-ink">
              <div class="cm-kicker">SO VỚI THỊ TRƯỜNG</div>
              <div class="cm-head" style="font-size:34px;">KHÔNG ĐỤNG HÀNG CÁC HÃNG KHÁC</div>
              <div class="cm-card-cream" style="padding:18px 20px;border-width:4px;">
                <div class="cm-mono" style="font-size:17px;">NHẬN DIỆN THƯƠNG HIỆU</div>
                <div class="cm-head" style="font-size:28px;">MỚI LẠ · RIÊNG BIỆT · NỔI BẬT NGAY</div>
              </div>
            </div>

            <div id="s6-right" class="s6-col cm-card-pink cm-shadow-featured">
              <div class="cm-kicker">NGAY TRONG NỘI BỘ OPPO</div>
              <div class="cm-head" style="font-size:34px;">MỖI THẾ HỆ MỘT DIỆN MẠO MỚI</div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                <div id="s6-r1" class="cm-card-cream" style="padding:18px 18px;border-width:4px;">
                  <div class="cm-mono" style="font-size:16px;">DÒNG A SERIES</div>
                  <div class="cm-head" style="font-size:30px;">OPPO A6 ≠ A7</div>
                </div>
                <div id="s6-r2" class="cm-card-green" style="padding:18px 18px;border-width:4px;">
                  <div class="cm-mono-dark-pill">DÒNG RENO SERIES</div>
                  <div class="cm-head" style="font-size:30px;color:#EFE9D9;">RENO 16 ≠ 17</div>
                </div>
              </div>
            </div>
          </div>

          <div id="s6-bottom" class="cm-card-ink" style="padding:18px 28px;display:flex;justify-content:space-between;align-items:center;">
            <div class="cm-head" style="font-size:28px;color:#EFE9D9;">KHÔNG LẶP LẠI CHÍNH MÌNH QUA TỪNG ĐỜI MÁY</div>
            <div class="cm-mono" style="font-size:19px;color:#F5C518;">ĐẶC SẢN NHÀ OPPO ✓</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s6-kicker", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 0.20);
      tl.fromTo("#s6-pill", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 4.90);
      tl.fromTo("#s6-title", { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "power3.out" }, 10.95);
      tl.fromTo("#s6-left", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 13.55);
      tl.fromTo("#s6-right", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 16.05);
      tl.fromTo("#s6-r1", { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.48, ease: "back.out(1.25)" }, 18.90);
      tl.fromTo("#s6-r2", { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.48, ease: "back.out(1.25)" }, 21.15);
      tl.fromTo("#s6-bottom", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 21.95);
    `
  },

  // =========================================================================
  // SCENE 07: 146.00 - 161.15s (dur 15.15s) [A-roll & B-roll + Motion Overlay]
  // Local = global - 146.00:
  // 146.66..148.20 (0.66..2.20): "cảm[146.66] giác cầm[147.74] trên tay những dòng sản phẩm mới..."
  // 152.82..156.52 (6.82..10.52): "nhìn[152.82] nó đã[153.16] mắt... nhìn nó khác,[154.42] không[155.24] giống ai, không đụng hàng"
  // 158.10..160.32 (12.10..14.32): "không[158.10] thích đeo ốp[158.56] lưng ➔ thêm điểm[160.00] cộng nữa"
  // =========================================================================
  {
    id: 'scene-07',
    start: 146.00,
    duration: 15.15,
    label: '07: Cầm trên tay cực đã mắt & Điểm cộng khi dùng trần không ốp',
    css: `
      #s7-left { position: absolute; top: 64px; left: 48px; width: 460px; display: flex; flex-direction: column; gap: 14px; }
      #s7-right { position: absolute; top: 64px; right: 48px; width: 470px; display: flex; flex-direction: column; gap: 14px; }
    `,
    html: `
      <div class="cm-stage">
        <div id="s7-left">
          <div id="s7-kicker" class="cm-kicker">TRẢI NGHIỆM CẦM TRÊN TAY</div>
          <div id="s7-eye" class="cm-card-cream cm-shadow-ink" style="padding:18px 22px;display:flex;flex-direction:column;gap:8px;">
            <div class="cm-mono" style="font-size:16px;">THỊ GIÁC KHÁC BIỆT</div>
            <div class="cm-head" style="font-size:32px;">NHÌN ĐÃ MẮT · KHÔNG GIỐNG AI</div>
          </div>
        </div>
        <div id="s7-right">
          <div id="s7-case" class="cm-card-pink cm-shadow-featured" style="padding:20px 24px;display:flex;flex-direction:column;gap:8px;">
            <div class="cm-mono" style="font-size:16px;">ĐIỂM CỘNG LỚN</div>
            <div class="cm-head" style="font-size:30px;">CỰC HỢP NGƯỜI KHÔNG THÍCH ĐEO ỐP LƯNG!</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s7-kicker", { y: -22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 0.65);
      tl.fromTo("#s7-eye", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 6.80);
      tl.fromTo("#s7-case", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 12.05);
    `
  },

  // [PASS-THROUGH 4: 161.15s - 166.50s — Cảnh B-roll cạnh chậu cây có chữ lớn "OPPO A7 PRO"]

  // =========================================================================
  // SCENE 08: 166.50 - 192.40s (dur 25.90s) [A-roll & B-roll + Motion Overlay]
  // Local = global - 166.50:
  // 169.32..169.80 (2.82..3.30): "ví dụ như cụm[169.32] camera[169.52] này"
  // 172.58..173.28 (6.08..6.78): "khá là giống[172.58] như iPhone[173.04] Air[173.28]"
  // 174.78..178.22 (8.28..11.72): "viền[174.78] camera kéo[175.50] dài + 2[177.30] chấm camera"
  // 182.54..184.34 (16.04..17.84): "tổng[182.54] quan thiết kế khá là đẹp[184.34]"
  // 187.92..191.46 (21.42..24.96): "dưới[187.92] 10 triệu không[189.48] thể đòi hỏi chất[190.70] liệu cao cấp hơn"
  // =========================================================================
  {
    id: 'scene-08',
    start: 166.50,
    duration: 25.90,
    label: '08: Cụm camera kiểu iPhone Air & Giới hạn vật liệu dưới 10 triệu',
    css: `
      #s8a-left { position: absolute; top: 64px; left: 48px; width: 460px; display: flex; flex-direction: column; gap: 14px; }
      #s8a-right { position: absolute; top: 64px; right: 48px; width: 470px; display: flex; flex-direction: column; gap: 14px; }
    `,
    html: `
      <div class="cm-stage">
        <div id="s8a-left">
          <div id="s8a-kicker" class="cm-kicker">ĐIỂM NHẤN CỤM CAMERA</div>
          <div id="s8a-air" class="cm-card-yellow cm-shadow-featured" style="padding:18px 22px;display:flex;flex-direction:column;gap:6px;">
            <div class="cm-mono" style="font-size:16px;">PHONG CÁCH THIẾT KẾ</div>
            <div class="cm-head" style="font-size:30px;">KHÁ GIỐNG IPHONE AIR</div>
          </div>
          <div id="s8a-bar" class="cm-card-cream cm-shadow-ink" style="padding:16px 20px;display:flex;flex-direction:column;gap:4px;">
            <div class="cm-mono" style="font-size:15px;">BỐ CỤC MẶT LƯNG</div>
            <div class="cm-head" style="font-size:26px;">VIỀN CAM KÉO DÀI + 2 CHẤM ỐNG KÍNH</div>
          </div>
        </div>
        <div id="s8a-right">
          <div id="s8a-pretty" class="cm-card-green cm-shadow-ink" style="padding:18px 22px;display:flex;flex-direction:column;gap:6px;">
            <div class="cm-mono-dark-pill">ĐÁNH GIÁ NGOẠI HÌNH</div>
            <div class="cm-head" style="font-size:30px;color:#EFE9D9;">TỔNG QUAN THIẾT KẾ KHÁ ĐẸP ✓</div>
          </div>
          <div id="s8a-mat" class="cm-card-pink cm-shadow-ink" style="padding:18px 22px;display:flex;flex-direction:column;gap:6px;">
            <div class="cm-mono" style="font-size:16px;">PHÂN KHÚC DƯỚI 10 TRIỆU</div>
            <div class="cm-head" style="font-size:26px;">KHÓ ĐÒI HỎI VẬT LIỆU CAO CẤP HƠN</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s8a-kicker", { y: -22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 2.70);
      tl.fromTo("#s8a-air", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 6.05);
      tl.fromTo("#s8a-bar", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 8.30);
      tl.fromTo("#s8a-pretty", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 16.00);
      tl.fromTo("#s8a-mat", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 21.40);
    `
  },

  // [PASS-THROUGH 5: 192.40s - 197.00s — Chữ "KHUNG VIỀN NHỰA" góc trên phải]

  // =========================================================================
  // SCENE 09: 197.00 - 219.05s (dur 22.05s) [Part 1: B-roll Overlay (0..10.6s) ➔ Part 2: 100% Motion (10.6..22.05s)]
  // Local = global - 197.00:
  // 198.44..202.76 (1.44..5.76): "làm[198.44] nhám, không phải làm bóng ➔ hạn[201.24] chế bám mồ hôi & vân tay"
  // 204.40..207.44 (7.40..10.44): "cầm[204.40] nắm khá thoải[205.56] mái, không quá to nặng[207.22]"
  // 207.62..210.46 (10.62..13.46): "mặc[207.62] dù bên trong viên pin[209.32] khá là khủng[210.20]"
  // 212.82..213.98 (15.82..16.98): "khoảng[212.82] 205g[213.00] thôi"
  // 215.80..218.50 (18.80..21.50): "cầm[215.80] trên tay thoải mái, kể[216.96] cả dùng bằng một[218.06] tay[218.14]"
  // =========================================================================
  {
    id: 'scene-09',
    start: 197.00,
    duration: 22.05,
    label: '09: Mặt lưng nhám chống vân tay & Nặng chỉ 205g cầm 1 tay',
    css: `
      #s9a-part1, #s9a-part2 { position: absolute; inset: 0; }
      #s9a-p1-left { position: absolute; top: 64px; left: 48px; width: 470px; display: flex; flex-direction: column; gap: 14px; }
      #s9a-p2-wrap { position: absolute; inset: 60px 84px; display: flex; flex-direction: column; justify-content: center; gap: 28px; }
      #s9a-p2-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 32px; align-items: stretch; }
    `,
    html: `
      <div id="s9a-part1" class="cm-stage">
        <div id="s9a-p1-left">
          <div id="s9a-kicker" class="cm-kicker">HOÀN THIỆN BỀ MẶT</div>
          <div id="s9a-matte" class="cm-card-cream cm-shadow-featured" style="padding:20px 24px;display:flex;flex-direction:column;gap:8px;">
            <div class="cm-mono" style="font-size:16px;">MẶT LƯNG & KHUNG VIỀN NHÁM</div>
            <div class="cm-head" style="font-size:32px;">HẠN CHẾ MỒ HÔI & DẤU VÂN TAY ✓</div>
          </div>
          <div id="s9a-grip" class="cm-card-yellow cm-shadow-ink" style="padding:16px 22px;">
            <div class="cm-head" style="font-size:28px;">CẦM NẮM THOẢI MÁI · KHÔNG QUÁ TO NẶNG</div>
          </div>
        </div>
      </div>

      <div id="s9a-part2" class="cm-stage" style="opacity:0;">
        <div class="ground-cream"></div>
        <div id="s9a-p2-wrap" style="z-index:2;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div class="cm-kicker">CÂN BẰNG TRỌNG LƯỢNG & DUNG LƯỢNG PIN</div>
            <div class="cm-pill">PIN KHỦNG TRONG THÂN MÁY GỌN</div>
          </div>
          <div class="cm-head" style="font-size:60px;">MANG VIÊN PIN KHỦNG NHƯNG THÂN MÁY VẪN NHẸ!</div>

          <div id="s9a-p2-grid">
            <div id="s9a-w" class="cm-card-pink cm-shadow-featured" style="padding:28px 32px;display:flex;flex-direction:column;gap:12px;">
              <div class="cm-mono" style="font-size:18px;">TRỌNG LƯỢNG THỰC TẾ</div>
              <div class="cm-head" style="font-size:82px;" data-var-text="weight_val">205 GRAM</div>
              <div class="cm-mono-dark-pill">DÙ BÊN TRONG LÀ VIÊN PIN 8000mAh</div>
            </div>

            <div id="s9a-hand" class="cm-card-green cm-shadow-ink" style="padding:28px 32px;display:flex;flex-direction:column;justify-content:center;gap:14px;">
              <div class="cm-mono-dark-pill">TRẢI NGHIỆM CẦM NẮM</div>
              <div class="cm-head" style="font-size:44px;color:#EFE9D9;">DÙNG BẰNG 1 TAY RẤT THOẢI MÁI</div>
              <div class="cm-body" style="font-size:22px;color:#EFE9D9;">Không gây mỏi cổ tay khi sử dụng liên tục hàng ngày</div>
            </div>
          </div>

          <div id="s9a-bottom" class="cm-card-ink" style="padding:18px 28px;display:flex;justify-content:space-between;align-items:center;">
            <div class="cm-head" style="font-size:27px;color:#EFE9D9;">KỂ CẢ KHI THAO TÁC BẰNG MỘT TAY VẪN RẤT GỌN GÀNG, DỄ CHỊU</div>
            <div class="cm-mono" style="font-size:18px;color:#F5C518;">CÔNG THÁI HỌC TỐT ✓</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s9a-kicker", { y: -22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 0.20);
      tl.fromTo("#s9a-matte", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 1.45);
      tl.fromTo("#s9a-grip", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "power3.out" }, 7.35);

      tl.to("#s9a-part1", { opacity: 0, duration: 0.26, ease: "power2.inOut" }, 10.55);
      tl.fromTo("#s9a-part2", { opacity: 0 }, { opacity: 1, duration: 0.30, ease: "power2.out" }, 10.60);
      tl.fromTo("#s9a-w", { y: 38, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 15.45);
      tl.fromTo("#s9a-hand", { y: 38, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 18.75);
      tl.fromTo("#s9a-bottom", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 20.05);
    `
  },

  // [PASS-THROUGH 6: 219.05s - 233.10s — Lật mặt trước & 4 thông số màn hình 6.57" / AMOLED / FHD+ / 120HZ]

  // =========================================================================
  // SCENE 10: 233.10 - 262.80s (dur 29.70s) [Part 1: B-roll Overlay (0..13.45s) ➔ Part 2: 100% Motion (13.45..29.70s)]
  // Local = global - 233.10:
  // 235.52..238.32 (2.42..5.22): "bốc[235.52] bừa một con máy cũng có thông số giống vậy"
  // 242.26..245.64 (9.16..12.54): "viền[242.26] màn hình không quá mỏng, không mỏng đều các cạnh[245.64]"
  // 246.56..253.76 (13.46..20.66): "phần[246.56] cằm dưới dày[248.56] hơn một chút so với 3 cạnh còn lại... chấp nhận được"
  // 255.90..259.68 (22.80..26.58): "Samsung[255.90] hay Xiaomi[257.02] thì nó cũng thế thôi"
  // 259.96..262.62 (26.86..29.52): "không[259.96] có quá nhiều điểm để nói về màn hình..."
  // =========================================================================
  {
    id: 'scene-10',
    start: 233.10,
    duration: 29.70,
    label: '10: Nhận xét viền màn hình & Đối chiếu mặt bằng tầm giá',
    css: `
      #s10a-part1, #s10a-part2 { position: absolute; inset: 0; }
      #s10a-p1-left { position: absolute; top: 64px; left: 48px; width: 460px; display: flex; flex-direction: column; gap: 14px; }
      #s10a-p1-right { position: absolute; top: 64px; right: 48px; width: 460px; display: flex; flex-direction: column; gap: 14px; }
      #s10a-p2-wrap { position: absolute; inset: 60px 84px; display: flex; flex-direction: column; justify-content: center; gap: 26px; }
    `,
    html: `
      <div id="s10a-part1" class="cm-stage">
        <div id="s10a-p1-left">
          <div id="s10a-kicker" class="cm-kicker">02 // ĐÁNH GIÁ MÀN HÌNH 6.57"</div>
          <div id="s10a-std" class="cm-card-cream cm-shadow-ink" style="padding:18px 22px;display:flex;flex-direction:column;gap:8px;">
            <div class="cm-mono" style="font-size:16px;">AMOLED · FHD+ · 120HZ</div>
            <div class="cm-head" style="font-size:30px;">THÔNG SỐ PHỔ BIẾN TRONG TẦM GIÁ</div>
          </div>
        </div>
        <div id="s10a-p1-right">
          <div id="s10a-bezel" class="cm-card-pink cm-shadow-featured" style="padding:20px 24px;display:flex;flex-direction:column;gap:8px;">
            <div class="cm-mono" style="font-size:16px;">ĐỘ DÀY VIỀN MÀN HÌNH</div>
            <div class="cm-head" style="font-size:32px;">CHƯA MỎNG ĐỀU 4 CẠNH</div>
          </div>
        </div>
      </div>

      <div id="s10a-part2" class="cm-stage" style="opacity:0;">
        <div class="ground-cream"></div>
        <div id="s10a-p2-wrap" style="z-index:2;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div class="cm-kicker">SO SÁNH MẶT BẰNG CHUNG DƯỚI 10 TRIỆU</div>
            <div class="cm-pill">GÓC NHÌN CÔNG BẰNG</div>
          </div>
          <div class="cm-head" style="font-size:58px;">VIỀN CẰM DƯỚI HƠI DÀY — NHƯNG CHẤP NHẬN ĐƯỢC!</div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:30px;">
            <div id="s10a-chin" class="cm-card-yellow cm-shadow-ink" style="padding:26px 30px;display:flex;flex-direction:column;gap:12px;">
              <div class="cm-mono" style="font-size:18px;">ĐẶC ĐIỂM MẶT TRƯỚC</div>
              <div class="cm-head" style="font-size:40px;">CẰM DƯỚI DÀY HƠN 3 CẠNH CÒN LẠI</div>
              <div class="cm-body" style="font-size:21px;">Điểm hoàn toàn có thể chấp nhận được ở phân khúc này</div>
            </div>

            <div id="s10a-rival" class="cm-card-green cm-shadow-featured" style="padding:26px 30px;display:flex;flex-direction:column;gap:12px;">
              <div class="cm-mono-dark-pill">ĐỐI CHIẾU CÙNG TẦM GIÁ</div>
              <div class="cm-head" style="font-size:40px;color:#EFE9D9;">SAMSUNG & XIAOMI CŨNG TƯƠNG TỰ!</div>
              <div class="cm-body" style="font-size:21px;color:#EFE9D9;">Mặt bằng chung tầm giá đều có thiết kế viền tương đương</div>
            </div>
          </div>

          <div id="s10a-bottom" class="cm-card-ink" style="padding:18px 28px;display:flex;justify-content:space-between;align-items:center;">
            <div class="cm-head" style="font-size:27px;color:#EFE9D9;">TỔNG KẾT MÀN HÌNH: TRÒN VAI · KHÔNG CÓ ĐIỂM TRỪ ĐÁNG KỂ</div>
            <div class="cm-mono" style="font-size:18px;color:#F5C518;">CHUYỂN SANG HIỆU NĂNG ▶</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s10a-kicker", { y: -22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 0.25);
      tl.fromTo("#s10a-std", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 2.35);
      tl.fromTo("#s10a-bezel", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 9.10);

      tl.to("#s10a-part1", { opacity: 0, duration: 0.26, ease: "power2.inOut" }, 13.40);
      tl.fromTo("#s10a-part2", { opacity: 0 }, { opacity: 1, duration: 0.30, ease: "power2.out" }, 13.45);
      tl.fromTo("#s10a-chin", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 15.10);
      tl.fromTo("#s10a-rival", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 22.65);
      tl.fromTo("#s10a-bottom", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.50, ease: "power3.out" }, 26.85);
    `
  },

  // =========================================================================
  // SCENE 11: 262.80 - 276.95s (dur 14.15s) [A-roll + Motion Overlay]
  // Local = global - 262.80:
  // 264.94 (2.14): "nói đến câu chuyện hiệu[264.94] năng đi"
  // 267.32..268.44 (4.52..5.64): "chưa[267.32] bao giờ là điểm[268.24] cộng"
  // 269.60..271.32 (6.80..8.52): "dòng Oppo[269.60] tầm trung giá rẻ[271.32]"
  // 272.50..273.62 (9.70..10.82): "và con Oppo[272.50] A7 Pro này cũng vậy[273.62]"
  // =========================================================================
  {
    id: 'scene-11',
    start: 262.80,
    duration: 14.15,
    label: '11: Mở đầu Hiệu năng — Chưa bao giờ là điểm cộng của OPPO tầm trung',
    css: `
      #s11a-left { position: absolute; top: 64px; left: 48px; width: 460px; display: flex; flex-direction: column; gap: 14px; }
      #s11a-right { position: absolute; top: 64px; right: 48px; width: 470px; display: flex; flex-direction: column; gap: 14px; }
    `,
    html: `
      <div class="cm-stage">
        <div id="s11a-left">
          <div id="s11a-kicker" class="cm-kicker">03 // CÂU CHUYỆN HIỆU NĂNG</div>
          <div id="s11a-sub" class="cm-card-cream cm-shadow-ink" style="padding:18px 22px;">
            <div class="cm-head" style="font-size:28px;">ĐẶC TRƯNG OPPO TẦM TRUNG & GIÁ RẺ</div>
          </div>
        </div>
        <div id="s11a-right">
          <div id="s11a-marker" class="cm-card-pink cm-shadow-featured" style="padding:22px 26px;display:flex;flex-direction:column;gap:10px;">
            <div class="cm-mono" style="font-size:16px;">NHẬN ĐỊNH THẲNG THẮN</div>
            <div class="cm-head" style="font-size:34px;">HIỆU NĂNG CHƯA BAO GIỜ LÀ ĐIỂM CỘNG!</div>
            <div id="s11a-tag" class="cm-mono-dark-pill">VÀ OPPO A7 PRO CŨNG KHÔNG NGOẠI LỆ</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s11a-kicker", { y: -22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 1.95);
      tl.fromTo("#s11a-marker", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 4.45);
      tl.fromTo("#s11a-sub", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 6.80);
      tl.fromTo("#s11a-tag", { scale: 1.16, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.48, ease: "power3.out" }, 9.55);
    `
  },

  // [PASS-THROUGH 7: 276.95s - 297.90s — Chữ lớn "DIMENSITY 6360 MAX 5G" ở giữa trên]

  // =========================================================================
  // SCENE 12: 297.90 - 328.30s (dur 30.40s) [100% Motion Graphics — Comparison Ledger vs Galaxy A57]
  // Local = global - 297.90:
  // 297.96..299.24 (0.06..1.34): "theo cá nhân tôi đánh giá là không[299.24]"
  // 301.96..302.68 (4.06..4.78): "mua[301.96] được Galaxy[302.32] A57[302.68]"
  // 303.86..304.88 (5.96..6.98): "hiệu[303.86] năng khỏe[304.68] hơn"
  // 305.78..307.16 (7.88..9.26): "tiết[305.78] kiệm khoảng 1[306.42]–2[306.66] triệu[307.16]"
  // 310.52..312.70 (12.62..14.80): "về hiệu[310.52] năng thì không[311.66] phải lựa chọn quá tốt"
  // 321.94..325.50 (24.04..27.60): "thiết[321.94] kế đẹp[322.70] hơn, trẻ[323.48] trung hơn Galaxy A57"
  // 326.12..327.90 (28.22..30.00): "hiệu[326.30] năng thọt[326.84] đi cũng dễ hiểu thôi[327.90]"
  // =========================================================================
  {
    id: 'scene-12',
    start: 297.90,
    duration: 30.40,
    label: '12: Bảng đối chiếu Hiệu năng & Giá — OPPO A7 Pro vs Galaxy A57',
    css: `
      #s12a-wrap { position: absolute; inset: 54px 80px; display: flex; flex-direction: column; justify-content: center; gap: 22px; }
      #s12a-ledger { border: 5px solid #0F0F0F; background: #E4DCC4; display: flex; flex-direction: column; }
      .s12a-row { display: grid; grid-template-columns: 0.9fr 1.3fr 1.3fr; border-bottom: 4px solid #0F0F0F; }
      .s12a-row:last-child { border-bottom: none; }
      .s12a-cell { padding: 18px 22px; border-right: 4px solid #0F0F0F; display: flex; flex-direction: column; justify-content: center; gap: 6px; }
      .s12a-cell:last-child { border-right: none; }
    `,
    html: `
      <div class="ground-cream"></div>
      <div class="cm-stage">
        <div id="s12a-wrap">
          <div style="display:flex;flex-direction:column;gap:10px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div id="s12a-kicker" class="cm-kicker">KHÔNG PHẢI HIỆU NĂNG NGON NHẤT TẦM GIÁ</div>
              <div id="s12a-pill" class="cm-pill">CHƯA TỐI ƯU NẾU MUA VÌ HIỆU NĂNG</div>
            </div>
            <div id="s12a-title" class="cm-head" style="font-size:56px;">ĐẶT LÊN BÀN CÂN: OPPO A7 PRO vs GALAXY A57</div>
          </div>

          <div id="s12a-ledger" class="cm-shadow-featured">
            <div class="s12a-row" style="background:#0F0F0F;color:#EFE9D9;">
              <div class="s12a-cell"><div class="cm-mono" style="font-size:18px;color:#F5C518;">TIÊU CHÍ ĐỐI CHIẾU</div></div>
              <div class="s12a-cell"><div class="cm-head" style="font-size:28px;color:#EFE9D9;">OPPO A7 PRO 5G</div></div>
              <div class="s12a-cell"><div class="cm-head" style="font-size:28px;color:#F5C518;" data-var-text="rival_name">SAMSUNG GALAXY A57</div></div>
            </div>

            <div id="s12a-r1" class="s12a-row">
              <div class="s12a-cell" style="background:#EFE9D9;"><div class="cm-head" style="font-size:26px;">01 · SỨC MẠNH CHIP</div></div>
              <div class="s12a-cell" style="background:#F06CA8;">
                <div class="cm-head" style="font-size:26px;">NGANG SNAP ĐẦU 6 / HELIO G99+</div>
                <div class="cm-mono" style="font-size:16px;">DIMENSITY 6360 MAX (~640K) ✕</div>
              </div>
              <div class="s12a-cell" style="background:#136636;color:#EFE9D9;">
                <div class="cm-head" style="font-size:26px;color:#EFE9D9;">HIỆU NĂNG KHỎE HƠN RÕ RỆT ✓</div>
                <div class="cm-mono-dark-pill">XỬ LÝ TÁC VỤ NẶNG TỐT HƠN</div>
              </div>
            </div>

            <div id="s12a-r2" class="s12a-row">
              <div class="s12a-cell" style="background:#EFE9D9;"><div class="cm-head" style="font-size:26px;">02 · MỨC GIÁ BÁN</div></div>
              <div class="s12a-cell" style="background:#EFE9D9;">
                <div class="cm-head" style="font-size:26px;">LOANH QUANH 9 – 10 TRIỆU</div>
                <div class="cm-mono" style="font-size:16px;">CAO HƠN SO VỚI SỨC MẠNH CHIP</div>
              </div>
              <div class="s12a-cell" style="background:#F5C518;">
                <div class="cm-head" style="font-size:26px;">TIẾT KIỆM 1 – 2 TRIỆU ĐỒNG ✓</div>
                <div class="cm-mono" style="font-size:16px;">P/P HIỆU NĂNG TRÊN GIÁ TỐT HƠN</div>
              </div>
            </div>

            <div id="s12a-r3" class="s12a-row">
              <div class="s12a-cell" style="background:#EFE9D9;"><div class="cm-head" style="font-size:26px;">03 · NGOẠI HÌNH</div></div>
              <div class="s12a-cell" style="background:#136636;color:#EFE9D9;">
                <div class="cm-head" style="font-size:26px;color:#EFE9D9;">ĐẸP & TRẺ TRUNG HƠN HẲN ✓</div>
                <div class="cm-mono-dark-pill">VÂN SÓNG BIỂN KHÔNG ĐỤNG HÀNG</div>
              </div>
              <div class="s12a-cell" style="background:#EFE9D9;">
                <div class="cm-head" style="font-size:26px;">THIẾT KẾ AN TOÀN, QUEN THUỘC</div>
                <div class="cm-mono" style="font-size:16px;">ÍT ĐỘT PHÁ VỀ THỊ GIÁC</div>
              </div>
            </div>
          </div>

          <div id="s12a-verdict" class="cm-card-ink" style="padding:18px 26px;display:flex;justify-content:space-between;align-items:center;">
            <div class="cm-head" style="font-size:27px;color:#EFE9D9;">QUY LUẬT BÙ TRỪ: ĐƯỢC THIẾT KẾ TRẺ TRUNG ⇄ HIỆU NĂNG THỌT ĐI LÀ DỄ HIỂU</div>
            <div class="cm-mono" style="font-size:18px;color:#F5C518;">CÂN NHẮC NHU CẦU</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s12a-kicker", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 0.20);
      tl.fromTo("#s12a-title", { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "power3.out" }, 3.95);
      tl.fromTo("#s12a-ledger", { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.52, ease: "power3.out" }, 4.40);
      tl.fromTo("#s12a-r1", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "power3.out" }, 5.90);
      tl.fromTo("#s12a-r2", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "power3.out" }, 7.85);
      tl.fromTo("#s12a-pill", { y: -18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 12.60);
      tl.fromTo("#s12a-r3", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 23.95);
      tl.fromTo("#s12a-verdict", { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 28.20);
    `
  },

  // =========================================================================
  // SCENE 13: 328.30 - 365.45s (dur 37.15s) [B-roll & A-roll + Motion Overlay]
  // Local = global - 328.30:
  // 329.28..330.88 (0.98..2.58): "tác[329.28] vụ sử dụng hàng ngày"
  // 333.74..339.40 (5.44..11.10): "TikTok[333.74], YouTube[335.10], Liên Quân[337.60] vẫn đáp ứng được"
  // 342.80..349.34 (14.50..21.04): "đóng[342.80] mở quá nhiều app, lướt Shopee[345.66] dài ➔ giật lag[349.16]"
  // 355.46..359.94 (27.16..31.64): "tốn nhiều RAM[355.46]: Shopee[356.50], TikTok[358.54], Instagram[359.34], Facebook[359.94]"
  // 362.76..365.32 (34.46..37.02): "hơn[362.76] 1 năm[363.22] sẽ xảy ra giật lag[364.92]"
  // =========================================================================
  {
    id: 'scene-13',
    start: 328.30,
    duration: 37.15,
    label: '13: Trải nghiệm thực tế hàng ngày vs Giới hạn sau hơn 1 năm',
    css: `
      #s13a-left { position: absolute; top: 64px; left: 48px; width: 460px; display: flex; flex-direction: column; gap: 14px; }
      #s13a-right { position: absolute; top: 64px; right: 48px; width: 470px; display: flex; flex-direction: column; gap: 12px; }
    `,
    html: `
      <div class="cm-stage">
        <div id="s13a-left">
          <div id="s13a-kicker" class="cm-kicker">TÁC VỤ SỬ DỤNG HÀNG NGÀY</div>
          <div id="s13a-ok" class="cm-card-green cm-shadow-ink" style="padding:20px 24px;display:flex;flex-direction:column;gap:8px;">
            <div class="cm-mono-dark-pill">NHU CẦU CƠ BẢN (ĐÁP ỨNG TỐT ✓)</div>
            <div class="cm-head" style="font-size:30px;color:#EFE9D9;">TIKTOK · YOUTUBE · LIÊN QUÂN</div>
            <div class="cm-body" style="font-size:19px;color:#EFE9D9;">Đóng mở ứng dụng nhẹ nhàng không thành vấn đề</div>
          </div>
        </div>
        <div id="s13a-right">
          <div id="s13a-lag" class="cm-card-pink cm-shadow-featured" style="padding:18px 22px;display:flex;flex-direction:column;gap:6px;">
            <div class="cm-mono" style="font-size:16px;">KHI ĐA NHIỆM NẶNG</div>
            <div class="cm-head" style="font-size:28px;">MỞ NHIỀU APP / LƯỚT SHOPEE LÂU ➔ GIẬT LAG ✕</div>
          </div>
          <div id="s13a-apps" class="cm-card-cream cm-shadow-ink" style="padding:16px 20px;display:flex;flex-direction:column;gap:4px;">
            <div class="cm-mono" style="font-size:15px;">APP NGỐN NHIỀU RAM & CHẠY NGẦM</div>
            <div class="cm-head" style="font-size:25px;">SHOPEE · TIKTOK · INSTAGRAM · FACEBOOK</div>
          </div>
          <div id="s13a-year" class="cm-card-yellow cm-shadow-ink" style="padding:16px 20px;display:flex;flex-direction:column;gap:4px;">
            <div class="cm-mono" style="font-size:15px;">ĐỘ MƯỢT VỀ LÂU DÀI</div>
            <div class="cm-head" style="font-size:27px;">SAU HƠN 1 NĂM DỄ XẢY RA GIẬT LAG!</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s13a-kicker", { y: -22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 0.90);
      tl.fromTo("#s13a-ok", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 5.35);
      tl.fromTo("#s13a-lag", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 14.50);
      tl.fromTo("#s13a-apps", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 27.10);
      tl.fromTo("#s13a-year", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 34.45);
    `
  },

  // =========================================================================
  // SCENE 14: 365.45 - 402.60s (dur 37.15s) [Part 1: 100% Motion (0..28.25s) ➔ Part 2: A-roll Overlay (28.25..37.15s)]
  // Local = global - 365.45:
  // 369.10..370.84 (3.65..5.39): "không[369.10] có bất kỳ tính năng Oppo[370.52] AI[370.84]"
  // 372.14..374.82 (6.69..9.37): "không[372.14] có cả nút Snap[373.06] Key giống dòng Reno[374.82]"
  // 377.10..382.44 (11.65..16.99): "cắt[377.10] giảm[377.36] khá nhiều tính năng trên máy giá rẻ[382.44]"
  // 385.08..393.42 (19.63..27.97): "nâng[385.08] cấp ColorOS[386.26] mới nhất... ColorOS 16[390.42] ➔ ColorOS 17[393.42]"
  // 393.72..396.72 (28.27..31.27): "Nhưng[393.72] chắc chỉ thay[395.54] đổi giao diện[396.36] thôi"
  // 399.54..402.48 (34.09..37.03): "không[399.54] thể có thêm tính năng AI[401.36] mới đâu"
  // =========================================================================
  {
    id: 'scene-14',
    start: 365.45,
    duration: 37.15,
    label: '14: Cắt giảm OPPO AI, Không có Snap Key & Lộ trình ColorOS 16 ➔ 17',
    css: `
      #s14a-part1, #s14a-part2 { position: absolute; inset: 0; }
      #s14a-p1-wrap { position: absolute; inset: 60px 84px; display: flex; flex-direction: column; justify-content: center; gap: 26px; }
      #s14a-p2-right { position: absolute; top: 64px; right: 48px; width: 470px; display: flex; flex-direction: column; gap: 14px; }
    `,
    html: `
      <div id="s14a-part1" class="cm-stage">
        <div class="ground-cream"></div>
        <div id="s14a-p1-wrap" style="z-index:2;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div id="s14a-kicker" class="cm-kicker">LƯU Ý QUAN TRỌNG VỀ TÍNH NĂNG & PHẦN MỀM</div>
            <div id="s14a-pill" class="cm-pill">OPPO A7 PRO DÒNG A GIÁ RẺ</div>
          </div>
          <div id="s14a-title" class="cm-head" style="font-size:56px;">OPPO ĐÃ CẮT GIẢM KHÁ NHIỀU TÍNH NĂNG CAO CẤP</div>

          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:26px;">
            <div id="s14a-c1" class="cm-card-pink cm-shadow-featured" style="padding:26px 24px;display:flex;flex-direction:column;gap:12px;">
              <div class="cm-mono" style="font-size:17px;">CẮT GIẢM 01</div>
              <div class="cm-head" style="font-size:40px;">0% OPPO AI ✕</div>
              <div class="cm-body" style="font-size:20px;">Không trang bị các tính năng trí tuệ nhân tạo OPPO AI</div>
            </div>

            <div id="s14a-c2" class="cm-card-yellow cm-shadow-ink" style="padding:26px 24px;display:flex;flex-direction:column;gap:12px;">
              <div class="cm-mono" style="font-size:17px;">CẮT GIẢM 02</div>
              <div class="cm-head" style="font-size:40px;">KHÔNG SNAP KEY ✕</div>
              <div class="cm-body" style="font-size:20px;">Lược bỏ phím cứng thông minh vốn có trên dòng Reno</div>
            </div>

            <div id="s14a-c3" class="cm-card-green cm-shadow-ink" style="padding:26px 24px;display:flex;flex-direction:column;gap:12px;">
              <div class="cm-mono-dark-pill">VỀ LÂU DÀI</div>
              <div class="cm-head" style="font-size:40px;color:#EFE9D9;">NÂNG CẤP COLOROS</div>
              <div class="cm-body" style="font-size:20px;color:#EFE9D9;">Vẫn được cập nhật lên các bản ColorOS mới nhất</div>
            </div>
          </div>

          <div id="s14a-bottom" class="cm-card-ink" style="padding:18px 28px;display:flex;justify-content:space-between;align-items:center;">
            <div class="cm-head" style="font-size:27px;color:#EFE9D9;">HIỆN TẠI ĐANG CHẠY COLOROS 16 ➔ TƯƠNG LAI VẪN LÊN COLOROS 17</div>
            <div class="cm-mono" style="font-size:18px;color:#F5C518;">HỖ TRỢ LÂU DÀI ✓</div>
          </div>
        </div>
      </div>

      <div id="s14a-part2" class="cm-stage" style="opacity:0;">
        <div id="s14a-p2-right">
          <div id="s14a-os17" class="cm-card-yellow cm-shadow-featured" style="padding:20px 24px;display:flex;flex-direction:column;gap:8px;">
            <div class="cm-mono" style="font-size:16px;">KHI LÊN COLOROS 17</div>
            <div class="cm-head" style="font-size:32px;">CHỈ THAY ĐỔI GIAO DIỆN</div>
          </div>
          <div id="s14a-noai" class="cm-card-pink cm-shadow-ink" style="padding:18px 22px;display:flex;flex-direction:column;gap:6px;">
            <div class="cm-mono" style="font-size:15px;">GIỚI HẠN PHẦN CỨNG</div>
            <div class="cm-head" style="font-size:26px;">KHÔNG CÓ THÊM TÍNH NĂNG AI MỚI ✕</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s14a-kicker", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 0.40);
      tl.fromTo("#s14a-pill", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 1.20);
      tl.fromTo("#s14a-c1", { y: 38, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 3.60);
      tl.fromTo("#s14a-c2", { y: 38, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 6.70);
      tl.fromTo("#s14a-title", { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "power3.out" }, 11.60);
      tl.fromTo("#s14a-c3", { y: 38, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 19.60);
      tl.fromTo("#s14a-bottom", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.50, ease: "power3.out" }, 24.45);

      tl.to("#s14a-part1", { opacity: 0, duration: 0.26, ease: "power2.inOut" }, 28.20);
      tl.fromTo("#s14a-part2", { opacity: 0 }, { opacity: 1, duration: 0.30, ease: "power2.out" }, 28.25);
      tl.fromTo("#s14a-os17", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 29.85);
      tl.fromTo("#s14a-noai", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 34.10);
    `
  },

  // =========================================================================
  // SCENE 15: 402.60 - 412.90s (dur 10.30s) [A-roll + Motion Overlay]
  // Local = global - 402.60:
  // 404.90..406.72 (2.30..4.12): "liên quan đến camera[404.90] đi... camera sau[406.72]"
  // 408.94..410.10 (6.34..7.50): "trông có vẻ[409.16] như có 2[409.74] ống kính[410.10]"
  // 410.60..412.12 (8.00..9.52): "nhưng thực[410.60] tế chỉ có 1[411.96] camera[412.12]"
  // =========================================================================
  {
    id: 'scene-15',
    start: 402.60,
    duration: 10.30,
    label: '15: Sự thật cụm 2 ống kính — Thực tế chỉ 1 Camera hoạt động',
    css: `
      #s15a-left { position: absolute; top: 64px; left: 48px; width: 450px; display: flex; flex-direction: column; gap: 14px; }
      #s15a-right { position: absolute; top: 64px; right: 48px; width: 470px; display: flex; flex-direction: column; gap: 14px; }
    `,
    html: `
      <div class="cm-stage">
        <div id="s15a-left">
          <div id="s15a-kicker" class="cm-kicker">04 // ĐÁNH GIÁ CAMERA SAU</div>
          <div id="s15a-look" class="cm-card-cream cm-shadow-ink" style="padding:18px 22px;">
            <div class="cm-mono" style="font-size:16px;">NGOẠI HÌNH CỤM CAM</div>
            <div class="cm-head" style="font-size:30px;">TRÔNG NHƯ CÓ 2 ỐNG KÍNH</div>
          </div>
        </div>
        <div id="s15a-right">
          <div id="s15a-real" class="cm-card-yellow cm-shadow-featured" style="padding:20px 24px;display:flex;flex-direction:column;gap:8px;">
            <div class="cm-mono" style="font-size:16px;">CẤU HÌNH THỰC TẾ</div>
            <div class="cm-head" style="font-size:34px;">CHỈ CÓ 1 CAMERA HOẠT ĐỘNG!</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s15a-kicker", { y: -22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 2.20);
      tl.fromTo("#s15a-look", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 6.30);
      tl.fromTo("#s15a-real", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 8.00);
    `
  },

  // [PASS-THROUGH 8: 412.90s - 422.00s — Chữ lớn "CAMERA CHÍNH 50 MP, f/1.9" góc trên trái]

  // =========================================================================
  // SCENE 16: 422.00 - 427.95s (dur 5.95s) [B-roll + Motion Overlay]
  // Local = global - 422.00:
  // 422.64 (0.64): "camera[422.64]"
  // 423.70..423.90 (1.70..1.90): "cũng là 1 điểm[423.70] yếu[423.90] trên Oppo A7 Pro"
  // 426.00..427.95 (4.00..5.95): "chất[426.00] lượng ảnh chụp ở mức trung bình"
  // =========================================================================
  {
    id: 'scene-16',
    start: 422.00,
    duration: 5.95,
    label: '16: Điểm yếu Camera sau — Chất lượng ảnh ở mức trung bình',
    css: `
      #s16a-right { position: absolute; top: 64px; right: 48px; width: 480px; display: flex; flex-direction: column; gap: 14px; }
    `,
    html: `
      <div class="cm-stage">
        <div id="s16a-right">
          <div id="s16a-kicker" class="cm-kicker">NHẬN ĐỊNH CAMERA SAU</div>
          <div id="s16a-weak" class="cm-card-pink cm-shadow-featured" style="padding:20px 24px;display:flex;flex-direction:column;gap:8px;">
            <div class="cm-mono" style="font-size:16px;">ĐIỂM YẾU TRÊN OPPO A7 PRO</div>
            <div class="cm-head" style="font-size:32px;">LÀ MỘT ĐIỂM YẾU CỦA MÁY ✕</div>
            <div id="s16a-sub" class="cm-mono-dark-pill">CHẤT LƯỢNG ẢNH CHỤP MỨC TRUNG BÌNH</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s16a-kicker", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.44, ease: "power3.out" }, 0.55);
      tl.fromTo("#s16a-weak", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 1.65);
      tl.fromTo("#s16a-sub", { scale: 1.14, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.44, ease: "power3.out" }, 3.95);
    `
  },

  // [PASS-THROUGH 9: 427.95s - 489.95s — Loạt ảnh mẫu ban ngày/đêm & Video test "FULL HD 60FPS"]

  // =========================================================================
  // SCENE 17: 489.95 - 500.20s (dur 10.25s) [100% Motion Graphics — Camera trước 8MP góc rộng 100°]
  // Local = global - 489.95:
  // 491.42..492.32 (1.47..2.37): "vẫn cứu[491.42] vớt[491.74] được ở một điểm"
  // 492.90..494.38 (2.95..4.43): "camera[492.90] trước[493.22] lại làm khá tốt[494.38] nha"
  // 497.06..498.00 (7.11..8.05): "độ phân giải chỉ là 8[497.20] MP[497.66] thôi"
  // 499.00..500.76 (9.05..10.81): "có 1 góc[499.28] chụp rất rộng[500.02] đến 100 độ"
  // =========================================================================
  {
    id: 'scene-17',
    start: 489.95,
    duration: 10.25,
    label: '17: Bước ngoặt cứu cánh — Camera trước 8MP góc chụp siêu rộng 100°',
    css: `
      #s17a-wrap { position: absolute; inset: 60px 84px; display: flex; flex-direction: column; justify-content: center; gap: 26px; }
      #s17a-grid { display: grid; grid-template-columns: 1fr 1.25fr; gap: 30px; align-items: stretch; }
    `,
    html: `
      <div class="ground-cream"></div>
      <div class="cm-stage">
        <div id="s17a-wrap">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div id="s17a-kicker" class="cm-kicker">ĐIỂM CỨU VỚT ĐÁNG GIÁ TRÊN OPPO A7 PRO</div>
            <div class="cm-pill">ĐẢO CHIỀU TRẢI NGHIỆM</div>
          </div>
          <div id="s17a-title" class="cm-head" style="font-size:60px;">CAMERA TRƯỚC LẠI LÀM KHÁ TỐT! ✓</div>

          <div id="s17a-grid">
            <div id="s17a-c1" class="cm-card-yellow cm-shadow-ink" style="padding:28px 30px;display:flex;flex-direction:column;gap:12px;">
              <div class="cm-mono" style="font-size:18px;">THÔNG SỐ CẢM BIẾN</div>
              <div class="cm-head" style="font-size:64px;">8 MP</div>
              <div class="cm-body" style="font-size:21px;">Độ phân giải vừa đủ nhưng thuật toán xử lý da rất tốt</div>
            </div>

            <div id="s17a-c2" class="cm-card-green cm-shadow-featured" style="padding:28px 30px;display:flex;flex-direction:column;gap:12px;">
              <div class="cm-mono-dark-pill">TIÊU CỰ ĐẶC BIỆT</div>
              <div class="cm-head" style="font-size:48px;color:#EFE9D9;" data-var-text="selfie_spec">GÓC RỘNG TỚI 100° ✓</div>
              <div class="cm-head" style="font-size:25px;color:#F5C518;">CHỤP SELFIE NHÓM ĐÔNG NGƯỜI CỰC THOẢI MÁI!</div>
            </div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s17a-kicker", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.46, ease: "power3.out" }, 1.40);
      tl.fromTo("#s17a-title", { x: -36, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "power3.out" }, 2.90);
      tl.fromTo("#s17a-c1", { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 7.05);
      tl.fromTo("#s17a-c2", { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 8.95);
    `
  },

  // [PASS-THROUGH 10: 500.20s - 528.00s — Loạt ảnh mẫu Selfie thực tế trên nền chấm bi]

  // =========================================================================
  // SCENE 18: 528.00 - 547.20s (dur 19.20s) [A-roll & B-roll + Motion Overlay]
  // Local = global - 528.00:
  // 529.46..530.72 (1.46..2.72): "giúp các bạn sale[529.46] ở cửa hàng điện thoại"
  // 532.24..535.12 (4.24..7.12): "bán[532.24] cho học sinh sinh[534.06] viên, đặc biệt chị[534.84] em phụ nữ"
  // 535.82..537.16 (7.82..9.16): "camera[535.82] trước khá là nịnh[537.04] mắt"
  // 538.52..540.88 (10.52..12.88): "yếu[538.52] tố cuối cùng: pin[540.30] và tốc độ sạc[540.88]"
  // 542.92..544.82 (14.92..16.82): "điểm[542.92] cộng hiếm[543.30] hoi trên Oppo A7 Pro"
  // =========================================================================
  {
    id: 'scene-18',
    start: 528.00,
    duration: 19.20,
    label: '18: Vũ khí chốt đơn Selfie & Mở đầu chương Pin khủng',
    css: `
      #s18a-left { position: absolute; top: 64px; left: 48px; width: 460px; display: flex; flex-direction: column; gap: 14px; }
      #s18a-right { position: absolute; top: 64px; right: 48px; width: 470px; display: flex; flex-direction: column; gap: 14px; }
    `,
    html: `
      <div class="cm-stage">
        <div id="s18a-left">
          <div id="s18a-kicker" class="cm-kicker">LỢI THẾ TẠI CỬA HÀNG</div>
          <div id="s18a-skin" class="cm-card-pink cm-shadow-featured" style="padding:20px 24px;display:flex;flex-direction:column;gap:8px;">
            <div class="cm-mono" style="font-size:16px;">TỆP KHÁCH DỄ CHỐT ĐƠN</div>
            <div class="cm-head" style="font-size:29px;">HỌC SINH, SINH VIÊN & CHỊ EM PHỤ NỮ</div>
            <div id="s18a-eye" class="cm-mono-dark-pill">CAMERA TRƯỚC KHÁ NỊNH MẮT ✓</div>
          </div>
        </div>
        <div id="s18a-right">
          <div id="s18a-bat-kicker" class="cm-kicker">05 // YẾU TỐ CUỐI: PIN & TỐC ĐỘ SẠC</div>
          <div id="s18a-bat" class="cm-card-green cm-shadow-ink" style="padding:20px 24px;display:flex;flex-direction:column;gap:8px;">
            <div class="cm-mono-dark-pill">ĐÁNH GIÁ NĂNG LƯỢNG</div>
            <div class="cm-head" style="font-size:32px;color:#EFE9D9;">ĐIỂM CỘNG HIẾM HOI TRÊN OPPO A7 PRO!</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s18a-kicker", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 1.40);
      tl.fromTo("#s18a-skin", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 4.20);
      tl.fromTo("#s18a-eye", { scale: 1.14, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.46, ease: "power3.out" }, 7.80);
      tl.fromTo("#s18a-bat-kicker", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 10.50);
      tl.fromTo("#s18a-bat", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 14.85);
    `
  },

  // [PASS-THROUGH 11: 547.20s - 570.05s — Chữ lớn "VIÊN PIN 8000mAh" & "TỐC ĐỘ SẠC 45W"]

  // =========================================================================
  // SCENE 19: 570.05 - 588.55s (dur 18.50s) [A-roll & B-roll + Motion Overlay]
  // Local = global - 570.05:
  // 575.72..577.30 (5.67..7.25): "không[575.72] đáng mua 100%[576.40] thì cũng không[577.16] đúng"
  // 579.44..580.48 (9.39..10.43): "camera[579.44] trước chụp đẹp[580.24] này"
  // 580.86..582.54 (10.81..12.49): "thiết[580.86] kế nhìn độc[581.70] đáo, không đụng hàng[582.54]"
  // 586.02..588.38 (15.97..18.33): "dung lượng pin[586.02] rất là trâu[586.40] yên tâm dùng cả ngày"
  // =========================================================================
  {
    id: 'scene-19',
    start: 570.05,
    duration: 18.50,
    label: '19: Nhìn nhận công tâm — 3 Ưu điểm giữ chân người dùng',
    css: `
      #s19a-left { position: absolute; top: 64px; left: 48px; width: 460px; display: flex; flex-direction: column; gap: 14px; }
      #s19a-right { position: absolute; top: 64px; right: 48px; width: 490px; display: flex; flex-direction: column; gap: 12px; }
    `,
    html: `
      <div class="cm-stage">
        <div id="s19a-left">
          <div id="s19a-kicker" class="cm-kicker">NHÌN NHẬN CÔNG TÂM</div>
          <div id="s19a-fair" class="cm-card-yellow cm-shadow-featured" style="padding:20px 24px;display:flex;flex-direction:column;gap:8px;">
            <div class="cm-mono" style="font-size:16px;" data-var-text="battery_spec">PIN 8000mAh + SẠC NHANH 45W</div>
            <div class="cm-head" style="font-size:30px;">NÓI "KHÔNG ĐÁNG MUA 100%" LÀ KHÔNG ĐÚNG!</div>
            <div class="cm-mono-dark-pill">MÁY VẪN CÓ NHỮNG ƯU ĐIỂM RIÊNG</div>
          </div>
        </div>
        <div id="s19a-right">
          <div id="s19a-p1" class="cm-card-pink cm-shadow-ink" style="padding:16px 20px;display:flex;flex-direction:column;gap:4px;">
            <div class="cm-mono" style="font-size:15px;">ƯU ĐIỂM 01</div>
            <div class="cm-head" style="font-size:23px;">CAMERA TRƯỚC 100° CHỤP ĐẸP, NỊNH MẮT ✓</div>
          </div>
          <div id="s19a-p2" class="cm-card-cream cm-shadow-ink" style="padding:16px 20px;display:flex;flex-direction:column;gap:4px;">
            <div class="cm-mono" style="font-size:15px;">ƯU ĐIỂM 02</div>
            <div class="cm-head" style="font-size:23px;">THIẾT KẾ ĐỘC ĐÁO, KHÔNG ĐỤNG HÀNG ✓</div>
          </div>
          <div id="s19a-p3" class="cm-card-green cm-shadow-ink" style="padding:16px 20px;display:flex;flex-direction:column;gap:4px;">
            <div class="cm-mono-dark-pill">ƯU ĐIỂM 03</div>
            <div class="cm-head" style="font-size:23px;color:#EFE9D9;">PIN 8000mAh RẤT TRÂU DÙNG CẢ NGÀY ✓</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s19a-kicker", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 0.40);
      tl.fromTo("#s19a-fair", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 5.60);
      tl.fromTo("#s19a-p1", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 9.35);
      tl.fromTo("#s19a-p2", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 10.80);
      tl.fromTo("#s19a-p3", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 15.90);
    `
  },

  // =========================================================================
  // SCENE 20: 588.55 - 630.65s (dur 42.10s) [Part 1: 100% Motion (0..26.40s) ➔ Part 2: Closing Plate #136636 (26.40..42.10s)]
  // Local = global - 588.55:
  // 591.46..593.76 (2.91..5.21): "hợp[591.46] với học sinh sinh[592.38] viên, đặc biệt chị[593.36] em phụ nữ"
  // 598.64..600.60 (10.09..12.05): "selfie,[598.64] quay TikTok[599.92] hoặc Locket[600.60]"
  // 602.16..603.22 (13.61..14.67): "pin[602.16] trâu & độ bền[603.06] tốt"
  // 607.84..609.48 (19.29..20.93): "kháng[607.84] nước kháng bụi IP68,[608.92] IP69K[609.48]"
  // 611.92..614.72 (23.37..26.17): "ngoài mưa[612.06] hay cát[612.94] bụi rơi vào ít hư hỏng[614.52]"
  // 614.96..618.14 (26.41..29.59): "không[616.22] quan tâm hiệu năng, không quan tâm camera sau[618.14]"
  // 620.38..622.52 (31.83..33.97): "ổn[620.38] định, thương hiệu Oppo[621.72], thiết kế đẹp[622.52]"
  // 624.40..626.10 (35.85..37.55): "lựa[624.40] chọn khá ổn trong năm 2026[625.68]"
  // 628.22..630.14 (39.67..41.59): "giá dễ[628.22] chịu chỉ dưới[629.58] 10 triệu[629.92]"
  // =========================================================================
  {
    id: 'scene-20',
    start: 588.55,
    duration: 42.10,
    label: '20: Chân dung người mua, Chuẩn bền IP68/IP69K & Closing Plate 2026',
    css: `
      #s20a-part1, #s20a-part2 { position: absolute; inset: 0; }
      #s20a-p1-wrap { position: absolute; inset: 58px 84px; display: flex; flex-direction: column; justify-content: center; gap: 24px; }
      #s20a-p2-wrap { position: absolute; inset: 64px 96px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; gap: 24px; }
      #s20a-stamp { position: absolute; right: 76px; bottom: 68px; }
    `,
    html: `
      <div id="s20a-part1" class="cm-stage">
        <div class="ground-cream"></div>
        <div id="s20a-p1-wrap" style="z-index:2;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div id="s20a-kicker" class="cm-kicker">06 // AI NÊN MUA OPPO A7 PRO 5G?</div>
            <div id="s20a-pill" class="cm-pill">PIN TRÂU & ĐỘ BỀN TỐT</div>
          </div>
          <div id="s20a-title" class="cm-head" style="font-size:56px;">CHÂN DUNG NGƯỜI DÙNG PHÙ HỢP NHẤT</div>

          <div style="display:grid;grid-template-columns:1.15fr 1fr;gap:28px;">
            <div id="s20a-user" class="cm-card-pink cm-shadow-featured" style="padding:26px 30px;display:flex;flex-direction:column;gap:14px;">
              <div class="cm-mono" style="font-size:18px;">TỆP KHÁCH HÀNG LÝ TƯỞNG</div>
              <div class="cm-head" style="font-size:42px;">HỌC SINH · SINH VIÊN · CHỊ EM PHỤ NỮ</div>
              <div id="s20a-apps" class="cm-card-cream" style="padding:14px 18px;border-width:4px;">
                <div class="cm-head" style="font-size:24px;">SELFIE 100° · QUAY TIKTOK · CHỤP LOCKET</div>
              </div>
            </div>

            <div id="s20a-ip" class="cm-card-yellow cm-shadow-ink" style="padding:26px 30px;display:flex;flex-direction:column;gap:14px;">
              <div class="cm-mono" style="font-size:18px;">TIÊU CHUẨN KHÁNG NƯỚC & BỤI</div>
              <div class="cm-head" style="font-size:48px;" data-var-text="ip_rating">CHUẨN IP68 & IP69K</div>
              <div class="cm-body" style="font-size:21px;">Bảo vệ an toàn cho các tình huống sử dụng hàng ngày</div>
            </div>
          </div>

          <div id="s20a-p1-bottom" class="cm-card-ink" style="padding:18px 28px;display:flex;justify-content:space-between;align-items:center;">
            <div class="cm-head" style="font-size:27px;color:#EFE9D9;">ĐI NGOÀI MƯA HAY CÁT BỤI RƠI VÀO CŨNG ÍT BỊ HƯ HỎNG HƠN ✓</div>
            <div class="cm-mono" style="font-size:18px;color:#F5C518;">BỀN BỈ LÂU DÀI</div>
          </div>
        </div>
      </div>

      <div id="s20a-part2" class="cm-stage" style="opacity:0;">
        <div class="ground-green"></div>
        <div id="s20a-p2-wrap" style="z-index:2;">
          <div id="s20a-close-pill" class="cm-mono-dark-pill" style="align-self:center;font-size:19px;padding:8px 20px;">KHÔNG QUAN TÂM HIỆU NĂNG NẶNG & CAMERA SAU</div>
          <div id="s20a-close-head" class="cm-head" style="font-size:56px;color:#EFE9D9;max-width:1580px;" data-var-text="s19_verdict">CẦN MÁY ỔN ĐỊNH · THƯƠNG HIỆU OPPO · THIẾT KẾ ĐẸP & PIN 8000mAh</div>
          <div id="s20a-close-sub" class="cm-card-cream cm-shadow-ink" style="padding:18px 32px;">
            <div class="cm-head" style="font-size:30px;">OPPO A7 PRO LÀ LỰA CHỌN KHÁ ỔN TRONG NĂM 2026!</div>
          </div>
        </div>
        <div id="s20a-stamp" class="cm-stamp-rot" style="z-index:3;display:flex;flex-direction:column;gap:8px;" data-layout-allow-overlap>
          <div class="cm-mono" style="font-size:15px;">PHÂN KHÚC DỄ CHỊU</div>
          <div class="cm-head" style="font-size:28px;">DƯỚI 10 TRIỆU ✓</div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s20a-kicker", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 0.40);
      tl.fromTo("#s20a-title", { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "power3.out" }, 2.85);
      tl.fromTo("#s20a-user", { y: 38, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 3.80);
      tl.fromTo("#s20a-apps", { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.48, ease: "back.out(1.25)" }, 10.00);
      tl.fromTo("#s20a-pill", { y: -18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 13.55);
      tl.fromTo("#s20a-ip", { y: 38, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 19.25);
      tl.fromTo("#s20a-p1-bottom", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.50, ease: "power3.out" }, 23.35);

      tl.to("#s20a-part1", { opacity: 0, duration: 0.28, ease: "power2.inOut" }, 26.35);
      tl.fromTo("#s20a-part2", { opacity: 0 }, { opacity: 1, duration: 0.32, ease: "power2.out" }, 26.40);
      tl.fromTo("#s20a-close-pill", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 27.60);
      tl.fromTo("#s20a-close-head", { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "power3.out" }, 31.75);
      tl.fromTo("#s20a-close-sub", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 35.75);
      tl.fromTo("#s20a-stamp", { scale: 1.24, rotation: -10, opacity: 0 }, { scale: 1, rotation: -4, opacity: 1, duration: 0.50, ease: "power4.out" }, 39.65);
    `
  },

  // =========================================================================
  // SCENE 21: 630.65 - 638.90s (dur 8.25s) [A-roll + Motion Overlay]
  // Local = global - 630.65:
  // 630.74 (0.09): "Rồi, và đó là tất cả..."
  // 634.82..637.06 (4.17..6.41): "ý[634.82] kiến của các bạn sao? Anh em cảm thấy thế nào?"
  // 637.50..638.30 (6.85..7.65): "các bạn có xuống[637.62] tiền[637.82] mua hay không?"
  // =========================================================================
  {
    id: 'scene-21',
    start: 630.65,
    duration: 8.25,
    label: '21: Câu hỏi tương tác cuối video trước khung Outro',
    css: `
      #s21a-left { position: absolute; top: 64px; left: 48px; width: 460px; display: flex; flex-direction: column; gap: 14px; }
      #s21a-right { position: absolute; top: 64px; right: 48px; width: 470px; display: flex; flex-direction: column; gap: 14px; }
    `,
    html: `
      <div class="cm-stage">
        <div id="s21a-left">
          <div id="s21a-kicker" class="cm-kicker">GÓC NHÌN CỦA BẠN</div>
          <div id="s21a-q" class="cm-card-cream cm-shadow-ink" style="padding:18px 22px;display:flex;flex-direction:column;gap:8px;">
            <div class="cm-mono" style="font-size:16px;">CẢM NHẬN CÁ NHÂN</div>
            <div class="cm-head" style="font-size:30px;">Ý KIẾN CỦA BẠN VỀ OPPO A7 PRO?</div>
          </div>
        </div>
        <div id="s21a-right">
          <div id="s21a-cta" class="cm-card-pink cm-shadow-featured" style="padding:20px 24px;display:flex;flex-direction:column;gap:8px;">
            <div class="cm-mono" style="font-size:16px;">DƯỚI 10 TRIỆU ĐỒNG</div>
            <div class="cm-head" style="font-size:30px;" data-var-text="cta_comment">ANH EM CÓ XUỐNG TIỀN MUA KHÔNG?</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s21a-kicker", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.46, ease: "power3.out" }, 0.20);
      tl.fromTo("#s21a-q", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 4.10);
      tl.fromTo("#s21a-cta", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, ease: "back.out(1.25)" }, 6.80);
    `
  }

  // [PASS-THROUGH 12 (OUTRO HÒM CÔNG ĐỨC): 638.90s - 651.77s — Giữ nguyên 100% khung hình Outro gốc]
];

for (const s of scenes) {
  const scriptBody = mode === 'sketch'
    ? `const tl = gsap.timeline({ paused: true });\nwindow.__timelines["${s.id}"] = tl;`
    : `const tl = gsap.timeline({ paused: true });\n${s.anim}\nwindow.__timelines["${s.id}"] = tl;`;

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
        ${s.css}
      </style>
      <div id="root" data-composition-id="${s.id}" data-width="1920" data-height="1080">
        ${s.html}
      </div>
      <script>
        ${scriptBody}
      </script>
    </template>
  </body>
</html>
`;
  writeFileSync(join(compDir, `${s.id}.html`), html);
}

const variables = [
  { id: 'product_name', type: 'string', label: 'Tên sản phẩm', default: 'OPPO A7 PRO 5G' },
  { id: 's1_guess', type: 'string', label: 'Cảnh 1: Nghi vấn che logo', default: 'IPHONE AIR THẾ HỆ 2?' },
  { id: 'price_launch', type: 'string', label: 'Cảnh 3: Giá lúc mới ra mắt', default: '13 – 14TR' },
  { id: 'price_shopee', type: 'string', label: 'Cảnh 3: Giá Shopee hiện tại', default: '9 – 10TR' },
  { id: 'price_voucher', type: 'string', label: 'Cảnh 4: Giá sau áp mã', default: '9,1 – 9,2 TRIỆU' },
  { id: 'weight_val', type: 'string', label: 'Cảnh 9: Trọng lượng máy', default: '205 GRAM' },
  { id: 'rival_name', type: 'string', label: 'Cảnh 12: Đối thủ hiệu năng', default: 'SAMSUNG GALAXY A57' },
  { id: 'selfie_spec', type: 'string', label: 'Cảnh 17: Thông số Camera trước', default: 'GÓC RỘNG TỚI 100° ✓' },
  { id: 'battery_spec', type: 'string', label: 'Cảnh 19: Thông số Pin & Sạc', default: 'PIN 8000mAh + SẠC NHANH 45W' },
  { id: 'ip_rating', type: 'string', label: 'Cảnh 20: Chuẩn kháng nước bụi', default: 'CHUẨN IP68 & IP69K' },
  { id: 's19_verdict', type: 'string', label: 'Cảnh 20: Kết luận tổng kết', default: 'CẦN MÁY ỔN ĐỊNH · THƯƠNG HIỆU OPPO · THIẾT KẾ ĐẸP & PIN 8000mAh' },
  { id: 'cta_comment', type: 'string', label: 'Cảnh 21: Lời kêu gọi cuối video', default: 'ANH EM CÓ XUỐNG TIỀN MUA KHÔNG?' },
  { id: 'bg_cream', type: 'color', label: 'Màu nền giấy kem (Cream)', default: '#EFE9D9' },
  { id: 'accent_pink', type: 'color', label: 'Màu nhấn Hồng (Pink)', default: '#F06CA8' },
  { id: 'accent_green', type: 'color', label: 'Màu nhấn Xanh lá (Green)', default: '#136636' },
  { id: 'accent_orange', type: 'color', label: 'Màu bóng cứng Cam (Orange)', default: '#E85A1F' },
  { id: 'accent_yellow', type: 'color', label: 'Màu nhấn Vàng (Yellow)', default: '#F5C518' }
];

const sceneSlotsHtml = scenes.map(s => `      <div id="${s.id}" class="clip scene-slot" data-composition-id="${s.id}" data-composition-src="compositions/${s.id}.html" data-start="${s.start}" data-duration="${s.duration}" data-track-index="1" data-label="${s.label}"></div>`).join('\n');

const sfxSlotsHtml = mode === 'animated'
  ? scenes.map((s, idx) => `      <audio id="sfx-${String(idx + 1).padStart(2, '0')}" src="assets/sfx-s${String(idx + 1).padStart(2, '0')}.wav" data-start="${s.start}" data-duration="${s.duration}" data-track-index="2" data-volume="0.38"></audio>`).join('\n')
  : '';

const indexHtml = `<!doctype html>
<html lang="vi" data-composition-variables='${JSON.stringify(variables)}'>
  <head>
    <meta charset="UTF-8" />
    <title>OPPO A7 Pro 5G — Đánh Giá & Phân Tích (Creative Mode)</title>
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
    <div
      id="main"
      data-composition-id="main"
      data-width="1920"
      data-height="1080"
      data-fps="30"
      data-duration="651.77"
    >
      <video
        id="master-video"
        class="clip"
        src="assets/source.mp4"
        playsinline
        data-has-audio="true"
        data-start="0"
        data-duration="651.77"
        data-track-index="0"
        data-volume="1"
      ></video>

${sceneSlotsHtml}
${sfxSlotsHtml}
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`;

writeFileSync(join(projDir, 'index.html'), indexHtml);
console.log(`Built ${scenes.length} Whisper-locked scenes and index.html for OPPO A7 Pro in ${mode} mode.`);
