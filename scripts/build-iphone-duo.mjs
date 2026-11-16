import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const projDir = 'f:/App nha lam/motion-video-demo/videos/iphone-duo-quan-diem';
const compDir = join(projDir, 'compositions');
mkdirSync(compDir, { recursive: true });

// Mode: 'sketch' or 'animated'
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
    font-size: 19px;
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
    font-size: 17px;
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

const scenes = [
  // SCENE 01: 0.00 - 30.53s (Talk-head — Balanced Left & Right)
  // Verified spoken timecodes:
  // 0.30..4.42: "Rồi, đây có lẽ là một trong số những chiếc điện thoại tạo ra cái sự tranh cãi lớn nhất"
  // 4.58..7.12: "của Apple từ trước cho đến nay — iPhone Duo." ("iPhone Duo" @ 5.70s)
  // 7.54..13.00: "Lý do thì cũng cực kỳ đơn giản... lướt trên Facebook hay Threads (9.10s) thì đang xảy ra 2 luồng ý kiến (11.30s)"
  // 13.00..17.16: "một là khen con iPhone Duo này cao ngất ngưởng," (Right card 1)
  // 17.49..22.73: "và hai là chê con iPhone Duo này gần như là thậm tệ luôn, không có lời nào để bào chữa được luôn." (Right card 2)
  // 23.14..30.53: "Thì trên thực tế cá nhân tôi đánh giá đây là một trong số những cái nước đi khá là hay của Apple và thực ra là Apple họ muốn thế luôn..." (Left verdict)
  {
    id: 'scene-01',
    start: 0.0,
    duration: 30.53,
    label: '01: Cơn bão tranh cãi lớn nhất của Apple',
    css: `
      #s1-left {
        position: absolute;
        top: 68px;
        left: 48px;
        width: 480px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      #s1-hero {
        padding: 22px 26px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      #s1-verdict {
        padding: 16px 22px;
        margin-top: 6px;
      }
      #s1-right {
        position: absolute;
        top: 68px;
        right: 48px;
        width: 480px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .s1-pole {
        padding: 18px 22px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
    `,
    html: `
      <div class="cm-stage">
        <div id="s1-left">
          <div id="s1-kicker" class="cm-kicker">TRANH CÃI LỚN NHẤT CỦA APPLE</div>
          <div id="s1-hero" class="cm-card-cream cm-shadow-featured">
            <div class="cm-head" style="font-size:62px;" data-var-text="product_name">IPHONE DUO</div>
            <div id="s1-sub" style="display:flex;flex-direction:column;gap:8px;">
              <div class="cm-mono" style="font-size:17px;">TRÊN FACEBOOK & THREADS DẠO GẦN ĐÂY</div>
              <div class="cm-head" style="font-size:26px;background:#0F0F0F;color:#EFE9D9;padding:6px 14px;align-self:flex-start;">XẢY RA 2 LUỒNG Ý KIẾN</div>
            </div>
          </div>
          <div id="s1-verdict" class="cm-badge-rot">
            <div class="cm-mono" style="font-size:17px;">ĐÁNH GIÁ CÁ NHÂN</div>
            <div class="cm-head" style="font-size:28px;" data-var-text="s1_verdict">NƯỚC ĐI CÓ CHỦ ĐÍCH CỦA APPLE!</div>
          </div>
        </div>

        <div id="s1-right">
          <div id="s1-pole1" class="s1-pole cm-card-green cm-shadow-ink">
            <div class="cm-mono-dark-pill">LUỒNG 01 · PHE KHEN</div>
            <div class="cm-head" style="font-size:32px;color:#EFE9D9;">KHEN CAO NGẤT NGƯỞNG</div>
          </div>
          <div id="s1-pole2" class="s1-pole cm-card-pink cm-shadow-ink">
            <div class="cm-mono" style="font-size:17px;">LUỒNG 02 · PHE CHÊ</div>
            <div class="cm-head" style="font-size:32px;">CHÊ THẬM TỆ · KO BÀO CHỮA</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s1-kicker", { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 0.30);
      tl.fromTo("#s1-hero", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 5.65);
      tl.fromTo("#s1-sub", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power2.out" }, 9.10);
      tl.fromTo("#s1-pole1", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 13.00);
      tl.fromTo("#s1-pole2", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 17.49);
      tl.fromTo("#s1-verdict", { scale: 1.22, rotation: -9, opacity: 0 }, { scale: 1, rotation: -3, opacity: 1, duration: 0.50, ease: "power4.out" }, 23.14);
    `
  },

  // SCENE 02: 30.53 - 38.23s (B-roll 1 outdoor — Balanced Left & Right)
  // Verified spoken timecodes (local = global - 30.53):
  // 0.00..1.53 (30.53..32.06): "...như là cái năm đầu tiên mà Ap-"
  // 1.67..3.59 (32.20..34.12): "-ple họ gửi con iPhone Duo này cho"
  // 3.72..6.10 (34.25..36.63): "cả những cái Influencer, cho cả những cái KOL"
  // 6.45..7.60 (36.98..38.13): "không phải trong giới công nghệ."
  {
    id: 'scene-02',
    start: 30.53,
    duration: 7.70,
    label: '02: Năm đầu tiên gửi máy cho KOL ngoài ngành',
    css: `
      #s2-left {
        position: absolute;
        left: 48px;
        bottom: 68px;
        width: 490px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      #s2-main {
        padding: 22px 26px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      #s2-right {
        position: absolute;
        top: 68px;
        right: 48px;
        width: 490px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
    `,
    html: `
      <div class="cm-stage">
        <div id="s2-left">
          <div id="s2-kicker" class="cm-kicker">TIỀN LỆ CHƯA TỪNG CÓ</div>
          <div id="s2-main" class="cm-card-yellow cm-shadow-featured">
            <div class="cm-mono" style="font-size:17px;">CHIẾN DỊCH IPHONE DUO</div>
            <div class="cm-head" style="font-size:38px;">NĂM ĐẦU TIÊN APPLE GỬI MÁY</div>
          </div>
        </div>

        <div id="s2-right">
          <div id="s2-r-card" class="cm-card-pink cm-shadow-ink" style="padding:20px 24px;display:flex;flex-direction:column;gap:10px;">
            <div class="cm-mono" style="font-size:17px;">MỞ RỘNG TỆP NGƯỜI NHẬN</div>
            <div class="cm-head" style="font-size:32px;">CHO CẢ INFLUENCER & KOL</div>
            <div id="s2-r-sub" class="cm-mono-dark-pill">KHÔNG PHẢI TRONG GIỚI CÔNG NGHỆ</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s2-kicker", { x: -32, opacity: 0 }, { x: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 0.15);
      tl.fromTo("#s2-main", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 0.50);
      tl.fromTo("#s2-r-card", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 3.72);
      tl.fromTo("#s2-r-sub", { scale: 1.15, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.48, ease: "power3.out" }, 6.45);
    `
  },

  // SCENE 03: 38.23 - 63.38s (100% Motion Graphics — TOL vs Multi-Category KOLs)
  // Verified spoken timecodes (local = global - 38.23):
  // 0.23..4.34 (38.46..42.57): "Nếu như mà trước đây những cái sự kiện khác của Apple ấy thì thường là họ sẽ chỉ gửi máy cho các"
  // 4.47..7.88 (42.70..46.11): "TOL, tức có nghĩa là những người reviewer làm trong giới công nghệ mà thôi,"
  // 8.25..11.22 (46.48..49.45): "và kể cả là mời đi sự kiện thì cũng phải là người trong giới công nghệ mời đi."
  // 11.57..14.63 (49.80..52.86): "Nhưng giờ đây anh em có thể thấy này: cả những cái người làm về Life-" (Lifestyle @ 13.90s)
  // 14.79..18.00 (53.02..56.23): "-style, làm về Vlog (15.10s), thậm chí là làm về Game giống như là anh PewPew (16.30s)"
  // 18.38..22.88 (56.61..61.11): "cũng được trên tay con iPhone Duo (18.38s). Thì đó cũng là lý do vì sao nó tạo ra một cái sự tranh cãi lớn như vậy (20.12s)"
  // 23.18..25.06 (61.41..63.29): "ở trên tất cả các nền tảng mạng xã hội luôn."
  {
    id: 'scene-03',
    start: 38.23,
    duration: 25.15,
    label: '03: Chiến lược TOL Công nghệ vs KOL Đa ngành',
    css: `
      #s3-wrap {
        position: absolute;
        inset: 60px 84px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 28px;
      }
      #s3-header {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      #s3-grid {
        display: grid;
        grid-template-columns: 1fr 1.25fr;
        gap: 32px;
        align-items: stretch;
      }
      .s3-col {
        padding: 28px 32px;
        display: flex;
        flex-direction: column;
        gap: 18px;
      }
      .s3-kol-list {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        margin-top: 6px;
      }
      .s3-kol-item {
        padding: 18px 16px;
        border: 4px solid #0F0F0F;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      #s3-bottom {
        padding: 20px 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    `,
    html: `
      <div class="ground-cream"></div>
      <div class="cm-stage">
        <div id="s3-wrap">
          <div id="s3-header">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div id="s3-kicker" class="cm-kicker">CHIẾN LƯỢC PHỦ SÓNG CỦA APPLE</div>
              <div id="s3-pill" class="cm-pill">TẠO ĐỘ THẢO LUẬN ĐA TẦNG</div>
            </div>
            <div id="s3-title" class="cm-head" style="font-size:66px;">TỪ GIỚI TECH ➔ BÙNG NỔ ĐA NGÀNH</div>
          </div>

          <div id="s3-grid">
            <div id="s3-left" class="s3-col cm-card-cream2">
              <div class="cm-kicker">TRƯỚC ĐÂY · CÁC SỰ KIỆN CŨ</div>
              <div class="cm-head" style="font-size:44px;">CHỈ GỬI CHO TOL CÔNG NGHỆ</div>
              <div id="s3-l-item1" class="cm-card-cream" style="padding:16px 20px;border-width:4px;">
                <div class="cm-mono" style="font-size:18px;">ĐỐI TƯỢNG NHẬN MÁY</div>
                <div class="cm-head" style="font-size:28px;">REVIEWER LÀM TRONG GIỚI TECH</div>
              </div>
              <div id="s3-l-item2" class="cm-card-cream" style="padding:16px 20px;border-width:4px;">
                <div class="cm-mono" style="font-size:18px;">MỜI ĐI SỰ KIỆN APPLE</div>
                <div class="cm-head" style="font-size:28px;">100% NGƯỜI TRONG GIỚI CÔNG NGHỆ</div>
              </div>
            </div>

            <div id="s3-right" class="s3-col cm-card-pink cm-shadow-featured">
              <div class="cm-kicker">GIỜ ĐÂY · CHIẾN DỊCH IPHONE DUO</div>
              <div class="cm-head" style="font-size:44px;">MỞ RỘNG TOÀN BỘ CREATOR</div>
              <div class="s3-kol-list">
                <div id="s3-k1" class="s3-kol-item" style="background:#EFE9D9;">
                  <div class="cm-head" style="font-size:44px;">01</div>
                  <div class="cm-head" style="font-size:26px;">LIFESTYLE</div>
                  <div class="cm-mono" style="font-size:16px;">THỜI TRANG & ĐỜI SỐNG</div>
                </div>
                <div id="s3-k2" class="s3-kol-item" style="background:#F5C518;">
                  <div class="cm-head" style="font-size:44px;">02</div>
                  <div class="cm-head" style="font-size:26px;">VLOGGERS</div>
                  <div class="cm-mono" style="font-size:16px;">SÁNG TẠO NỘI DUNG</div>
                </div>
                <div id="s3-k3" class="s3-kol-item" style="background:#136636;color:#EFE9D9;">
                  <div class="cm-head" style="font-size:44px;">03</div>
                  <div class="cm-head" style="font-size:26px;">GAMING</div>
                  <div class="cm-mono-dark-pill" style="font-size:15px;">ANH PEWPEW TRÊN TAY</div>
                </div>
              </div>
            </div>
          </div>

          <div id="s3-bottom" class="cm-card-ink">
            <div class="cm-head" style="font-size:34px;color:#EFE9D9;">LÝ DO TẠO RA SỰ TRANH CÃI LỚN TRÊN TẤT CẢ NỀN TẢNG MẠNG XÃ HỘI</div>
            <div class="cm-badge-rot" style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:20px;padding:8px 18px;">VIRAL TOÀN CẦU</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s3-kicker, #s3-pill, #s3-title", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, stagger: 0.10, ease: "power2.out" }, 0.20);
      tl.fromTo("#s3-left", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "power3.out" }, 0.80);
      tl.fromTo("#s3-l-item1", { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.48, ease: "power2.out" }, 4.47);
      tl.fromTo("#s3-l-item2", { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.48, ease: "power2.out" }, 8.25);
      tl.fromTo("#s3-right", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.56, ease: "back.out(1.25)" }, 11.57);
      tl.fromTo("#s3-k1", { y: 28, scale: 0.92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.48, ease: "back.out(1.25)" }, 13.90);
      tl.fromTo("#s3-k2", { y: 28, scale: 0.92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.48, ease: "back.out(1.25)" }, 15.10);
      tl.fromTo("#s3-k3", { y: 28, scale: 0.92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.48, ease: "back.out(1.25)" }, 16.30);
      tl.fromTo("#s3-bottom", { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "power3.out" }, 20.12);
    `
  },

  // SCENE 04: 63.38 - 104.25s (Talk-head — Balanced Left & Right: Left Positioning + Right Rule #1)
  // Verified spoken timecodes (local = global - 63.38):
  // 0.10..5.77 (63.48..69.15): "Đây sẽ không phải là một cái video mà tôi đánh giá về con iPhone Duo này, bởi vì trên thực tế tôi cũng vừa mới được trên tay con máy này thôi."
  // 6.10..12.78 (69.48..76.16): "Cái video đó có lẽ là tôi sẽ để khoảng vài ngày nữa đi, thì tôi sẽ đưa ra những góc nhìn riêng về con iPhone Duo này."
  // 13.22..22.13 (76.60..85.51): "Còn trong giới hạn của video này thì tôi sẽ nêu ra một vài những quan điểm cá nhân về câu chuyện tại vì sao con iPhone Duo này lại trở nên tranh cãi như vậy."
  // 22.28..26.81 (85.66..90.19): "Đầu tiên thì theo quan điểm của tôi nha: với bất kỳ một sản phẩm nào thì với tôi, tôi sẽ không mua vì lời hứa." ("không mua vì lời hứa" @ 24.80s / 88.18s)
  // 27.35..32.40 (90.73..95.78): "Tức có nghĩa là khi mà tôi đã bỏ tiền ra cho một sản phẩm nào đấy bất kỳ, đặc biệt là sản phẩm công nghệ,"
  // 32.88..37.42 (96.26..100.80): "thì tôi sẽ muốn là: à, sản phẩm đấy nó phải đáp ứng được cái nhu cầu sử dụng của mình," (Check 1 @ 35.00s)
  // 37.42..40.63 (100.80..104.01): "nó có được những cái gì và nó có xứng đáng với số tiền của chúng ta bỏ ra hay không." (Check 2 @ 37.42s)
  {
    id: 'scene-04',
    start: 63.38,
    duration: 40.87,
    label: '04: Định vị Video & Nguyên tắc Không mua vì lời hứa',
    css: `
      #s4-left {
        position: absolute;
        top: 68px;
        left: 48px;
        width: 480px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .s4-box {
        padding: 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      #s4-right {
        position: absolute;
        top: 68px;
        right: 48px;
        width: 490px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      #s4-rule {
        padding: 22px 26px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .s4-check {
        background: #EFE9D9;
        border: 4px solid #0F0F0F;
        padding: 12px 16px;
        font-size: 23px;
      }
    `,
    html: `
      <div class="cm-stage">
        <div id="s4-left">
          <div id="s4-kicker" class="cm-kicker">ĐỊNH VỊ VIDEO HÔM NAY</div>
          <div id="s4-note" class="s4-box cm-card-cream">
            <div class="cm-mono" style="font-size:17px;">VỪA MỚI TRÊN TAY</div>
            <div class="cm-head" style="font-size:30px;">CHƯA PHẢI VIDEO ĐÁNH GIÁ CHI TIẾT</div>
            <div id="s4-wait" class="cm-mono-dark-pill" style="margin-top:4px;">BÀI REVIEW: ĐỂ VÀI NGÀY NỮA</div>
          </div>
          <div id="s4-scope" class="s4-box cm-card-yellow cm-shadow-ink">
            <div class="cm-mono" style="font-size:17px;">TRONG GIỚI HẠN VIDEO NÀY</div>
            <div class="cm-head" style="font-size:28px;">QUAN ĐIỂM CÁ NHÂN: VÌ SAO IPHONE DUO GÂY TRANH CÃI?</div>
          </div>
        </div>

        <div id="s4-right">
          <div id="s4-rule" class="cm-card-pink cm-shadow-featured">
            <div class="cm-kicker">QUAN ĐIỂM SỐ 01 · NGUYÊN TẮC MUA HÀNG</div>
            <div id="s4-p-title" class="cm-head" style="font-size:44px;" data-var-text="s4_principle">"KHÔNG MUA VÌ LỜI HỨA!"</div>
          </div>
          <div id="s4-c1" class="cm-head s4-check cm-shadow-ink">01 · ĐÁP ỨNG ĐÚNG NHU CẦU SỬ DỤNG</div>
          <div id="s4-c2" class="cm-head s4-check cm-shadow-ink" style="background:#F5C518;">02 · XỨNG ĐÁNG VỚI SỐ TIỀN BỎ RA</div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s4-kicker, #s4-note", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, stagger: 0.12, ease: "power3.out" }, 0.15);
      tl.fromTo("#s4-wait", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power2.out" }, 6.10);
      tl.fromTo("#s4-scope", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 13.22);
      tl.fromTo("#s4-rule", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.56, ease: "back.out(1.25)" }, 22.28);
      tl.fromTo("#s4-p-title", { scale: 1.18, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.48, ease: "power4.out" }, 24.80);
      tl.fromTo("#s4-c1", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 35.00);
      tl.fromTo("#s4-c2", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power3.out" }, 37.42);
    `
  },

  // SCENE 05: 104.25 - 152.80s (100% Motion Graphics — P/P Formula & 20M Comparison Ledger)
  // Verified spoken timecodes (local = global - 104.25):
  // 0.15..3.55 (104.40..107.80): "Thường thì chúng ta sẽ chia làm hai phần: đầu tiên là những yếu tố liên quan đến phần cứng."
  // 3.87..9.20 (108.12..113.45): "Ví dụ như là các bạn sẽ thấy ở trong điện thoại hay những dòng sản phẩm khác nhau hay có một cái thuật ngữ gọi là P/P," (P/P @ 8.25s)
  // 9.66..17.03 (113.91..121.28): "tức có nghĩa là giá trị trên giá bán. Thì từ xưa đến nay phần cứng ngon chưa bao giờ là điều người ta hình dung về điện thoại Apple (11.55s),"
  // 17.42..20.08 (121.67..124.33): "mà thường họ sẽ hình dung về câu chuyện liên quan đến phần mềm nhiều hơn."
  // 20.61..22.33 (124.86..126.58): "Ví dụ như là cùng số tiền là 20 triệu đi,"
  // 22.70..30.84 (126.95..135.09): "thì anh em chỉ có thể mua được những con iPhone là 2 camera này, màn hình bé tí này (22.70s), trong khi đó 20 triệu mua Android thì phần cứng xôi thịt hơn rất nhiều (26.65s)."
  // 31.24..38.90 (135.49..143.15): "Nhưng những mẫu điện thoại iPhone thì nó lại có một cái phần mềm cực kỳ ngon, và đó là lý do lớn nhất vì sao người ta lựa chọn iPhone:"
  // 39.19..48.21 (143.44..152.46): "bởi vì hệ sinh thái, bởi vì phần mềm, bởi vì sự ổn định trong cuộc sống hàng ngày cũng như khả năng tối ưu rất tốt (39.19s) — điều mà Android ngoài kia nhiều khi còn không làm được (45.05s)."
  {
    id: 'scene-05',
    start: 104.25,
    duration: 48.55,
    label: '05: Bài toán P/P — Bảng đối chiếu 20 Triệu iPhone vs Android',
    css: `
      #s5-wrap {
        position: absolute;
        inset: 56px 84px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 28px;
      }
      #s5-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
      }
      #s5-ledger {
        border: 5px solid #0F0F0F;
        background: #E4DCC4;
      }
      .s5-row {
        display: grid;
        grid-template-columns: 1.1fr 1.45fr 1.45fr;
        border-bottom: 4px solid #0F0F0F;
      }
      .s5-row:last-child { border-bottom: none; }
      .s5-cell {
        padding: 22px 26px;
        border-right: 4px solid #0F0F0F;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 8px;
      }
      .s5-cell:last-child { border-right: none; }
      .s5-head-row {
        background: #0F0F0F;
        color: #EFE9D9;
      }
      #s5-footer-bar {
        padding: 20px 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    `,
    html: `
      <div class="ground-cream"></div>
      <div class="cm-stage">
        <div id="s5-wrap">
          <div id="s5-top">
            <div style="display:flex;flex-direction:column;gap:10px;">
              <div id="s5-kicker" class="cm-kicker">HAI YẾU TỐ ĐÁNH GIÁ: PHẦN CỨNG & PHẦN MỀM</div>
              <div id="s5-title" class="cm-head" style="font-size:64px;">THUẬT NGỮ P/P: GIÁ TRỊ / GIÁ BÁN</div>
            </div>
            <div id="s5-price-badge" class="cm-card-yellow cm-shadow-featured" style="padding:18px 28px;">
              <div class="cm-mono" style="font-size:18px;">VÍ DỤ CÙNG SỐ TIỀN</div>
              <div class="cm-head" style="font-size:52px;" data-var-text="price_mid">20 TRIỆU</div>
            </div>
          </div>

          <div id="s5-ledger">
            <div id="s5-r0" class="s5-row s5-head-row">
              <div class="s5-cell"><div class="cm-head" style="font-size:28px;color:#EFE9D9;">TRỤ CỘT ĐÁNH GIÁ</div></div>
              <div class="s5-cell"><div class="cm-head" style="font-size:28px;color:#F06CA8;">IPHONE (20 TRIỆU)</div></div>
              <div class="s5-cell"><div class="cm-head" style="font-size:28px;color:#F5C518;">ANDROID (20 TRIỆU)</div></div>
            </div>

            <div id="s5-r1" class="s5-row">
              <div id="s5-r1-c0" class="s5-cell" style="background:#EFE9D9;">
                <div class="cm-mono" style="font-size:18px;">YẾU TỐ 01</div>
                <div class="cm-head" style="font-size:38px;">PHẦN CỨNG</div>
                <div id="s5-r1-sub" class="cm-body" style="font-size:20px;">Chưa bao giờ là điều người ta hình dung về Apple.</div>
              </div>
              <div id="s5-r1-c1" class="s5-cell" style="background:#EFE9D9;">
                <div class="cm-head" style="font-size:34px;">CHỈ 2 CAMERA · MÀN BÉ TÍ ✕</div>
                <div class="cm-body" style="font-size:22px;">Thông số phần cứng khiêm tốn ở mức giá 20 triệu.</div>
              </div>
              <div id="s5-r1-c2" class="s5-cell" style="background:#F5C518;">
                <div class="cm-head" style="font-size:34px;">PHẦN CỨNG "XÔI THỊT" HƠN ✓</div>
                <div class="cm-body" style="font-size:22px;">Trang bị phần cứng vượt trội trong cùng tầm giá.</div>
              </div>
            </div>

            <div id="s5-r2" class="s5-row">
              <div id="s5-r2-c0" class="s5-cell" style="background:#EFE9D9;">
                <div class="cm-mono" style="font-size:18px;">YẾU TỐ 02</div>
                <div class="cm-head" style="font-size:38px;">PHẦN MỀM</div>
                <div class="cm-body" style="font-size:20px;">Thứ người dùng luôn hình dung về iPhone.</div>
              </div>
              <div id="s5-r2-c1" class="s5-cell" style="background:#136636;color:#EFE9D9;">
                <div class="cm-mono-dark-pill">LÝ DO LỚN NHẤT CHỌN IPHONE</div>
                <div class="cm-head" style="font-size:34px;color:#EFE9D9;">PHẦN MỀM CỰC NGON · HỆ SINH THÁI ✓</div>
                <div class="cm-body" style="font-size:22px;color:#EFE9D9;">Ổn định hàng ngày & khả năng tối ưu rất tốt.</div>
              </div>
              <div id="s5-r2-c2" class="s5-cell" style="background:#EFE9D9;">
                <div class="cm-head" style="font-size:34px;">NHIỀU MẪU CHƯA LÀM ĐƯỢC ✕</div>
                <div class="cm-body" style="font-size:22px;">Khó đạt độ ổn định & tối ưu tương đương iPhone.</div>
              </div>
            </div>
          </div>

          <div id="s5-footer-bar" class="cm-card-pink">
            <div class="cm-head" style="font-size:32px;">HỆ SINH THÁI · PHẦN MỀM · SỰ ỔN ĐỊNH HÀNG NGÀY & TỐI ƯU RẤT TỐT!</div>
            <div class="cm-pill">CHUẨN MỰC APPLE</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s5-kicker, #s5-r0, #s5-r1-c0", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, stagger: 0.10, ease: "power2.out" }, 0.15);
      tl.fromTo("#s5-title", { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "power3.out" }, 8.25);
      tl.fromTo("#s5-r1-sub", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power2.out" }, 11.55);
      tl.fromTo("#s5-r2-c0", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.50, ease: "power2.out" }, 17.42);
      tl.fromTo("#s5-price-badge", { scale: 0.88, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 20.61);
      tl.fromTo("#s5-r1-c1", { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.52, ease: "power3.out" }, 22.70);
      tl.fromTo("#s5-r1-c2", { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 26.65);
      tl.fromTo("#s5-r2-c1", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.56, ease: "back.out(1.25)" }, 31.24);
      tl.fromTo("#s5-footer-bar", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.52, ease: "power3.out" }, 39.19);
      tl.fromTo("#s5-r2-c2", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.50, ease: "power2.out" }, 45.05);
    `
  },

  // SCENE 06: 152.80 - 167.23s (Talk-head 152.80-157.13s + B-roll 2 157.13-167.23s — Balanced Left & Right)
  // Verified spoken timecodes (local = global - 152.80):
  // 0.24..4.33 (153.04..157.13): "Thì với con iPhone Duo này, nó làm không tốt ở cả hai yếu tố luôn."
  // 4.60..9.86 (157.40..162.66): "Tức có nghĩa là về câu chuyện liên quan đến phần cứng nhá, thì nó đã không thể nào tương xứng với cả mức giá 65 triệu," ("65 triệu" @ 8.40s / 161.20s)
  // 10.06..14.43 (162.86..167.23): "đúng không? Về mặt cơ bản là 65 triệu anh em có thể mua bất kỳ một con điện thoại gập nào..."
  {
    id: 'scene-06',
    start: 152.80,
    duration: 14.43,
    label: '06: Mức giá 65 Triệu — Điểm liệt cả Phần cứng lẫn Phần mềm',
    css: `
      #s6-left {
        position: absolute;
        top: 76px;
        left: 48px;
        width: 490px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      #s6-price {
        padding: 22px 26px;
      }
      #s6-right {
        position: absolute;
        top: 76px;
        right: 48px;
        width: 500px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
    `,
    html: `
      <div class="cm-stage">
        <div id="s6-left">
          <div id="s6-kicker" class="cm-kicker">THỰC TẾ TRÊN IPHONE DUO</div>
          <div id="s6-price" class="cm-card-pink cm-shadow-featured">
            <div class="cm-mono" style="font-size:18px;">ĐÁNH GIÁ TỔNG QUAN P/P</div>
            <div class="cm-head" style="font-size:38px;margin-top:4px;">LÀM KHÔNG TỐT Ở CẢ 2 YẾU TỐ LUÔN!</div>
          </div>
          <div id="s6-p-num" class="cm-card-cream cm-shadow-ink" style="padding:18px 24px;">
            <div class="cm-mono" style="font-size:18px;">MỨC GIÁ BÁN HIỆN TẠI</div>
            <div class="cm-head" style="font-size:72px;" data-var-text="price_duo">65 TRIỆU</div>
          </div>
        </div>
        <div id="s6-right">
          <div id="s6-fail1" class="cm-card-yellow cm-shadow-ink" style="padding:20px 24px;">
            <div class="cm-mono" style="font-size:18px;">YẾU TỐ 01 · PHẦN CỨNG</div>
            <div class="cm-head" style="font-size:34px;">KHÔNG THỂ TƯƠNG XỨNG VỚI 65TR ✕</div>
          </div>
          <div id="s6-fail2" class="cm-card-cream cm-shadow-ink" style="padding:20px 24px;">
            <div class="cm-mono" style="font-size:18px;">SO SÁNH CÙNG TẦM GIÁ 65TR</div>
            <div class="cm-head" style="font-size:32px;">MUA ĐƯỢC BẤT KỲ MÁY GẬP NÀO!</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s6-kicker, #s6-price", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, stagger: 0.12, ease: "back.out(1.25)" }, 0.24);
      tl.fromTo("#s6-fail1", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 4.60);
      tl.fromTo("#s6-p-num", { scale: 1.22, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.48, ease: "power4.out" }, 8.40);
      tl.fromTo("#s6-fail2", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "power3.out" }, 10.06);
    `
  },

  // SCENE 07: 167.23 - 188.87s (Talk-head — Balanced Left & Right)
  // Verified spoken timecodes (local = global - 167.23):
  // 0.00..1.47 (167.23..168.70): "...đến từ các hãng điện thoại Android và"
  // 1.60..6.37 (168.83..173.60): "chắc chắn là những cái con điện thoại gập đó nó đều có cái phần cứng tốt hơn so với cả con iPhone Duo này."
  // 6.60..9.44 (173.83..176.67): "Vậy thì cái câu chuyện ở đây nó sẽ nằm ở việc là liên quan đến phần mềm,"
  // 9.84..12.38 (177.07..179.61): "bởi vì rõ ràng iPhone từ xưa đến nay luôn luôn"
  // 12.52..17.48 (179.75..184.71): "in dấu trong đầu của người dùng đấy chính là mang lại một cái giao diện mượt mà, những cái animation nhìn nó"
  // 17.87..21.25 (185.10..188.48): "hiện đại, nhìn nó sang, nhìn nó kiểu chuyển cảnh mượt này kia các thứ,"
  {
    id: 'scene-07',
    start: 167.23,
    duration: 21.64,
    label: '07: Phần cứng Gập Android vượt trội & Câu chuyện Phần mềm iOS',
    css: `
      #s7-left {
        position: absolute;
        top: 68px;
        left: 48px;
        width: 480px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .s7-box {
        padding: 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      #s7-right {
        position: absolute;
        top: 68px;
        right: 48px;
        width: 490px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
    `,
    html: `
      <div class="cm-stage">
        <div id="s7-left">
          <div id="s7-kicker" class="cm-kicker">SO SÁNH VỚI GẬP ANDROID</div>
          <div id="s7-b1" class="s7-box cm-card-cream cm-shadow-featured">
            <div class="cm-mono" style="font-size:17px;">KẾT LUẬN VỀ PHẦN CỨNG</div>
            <div class="cm-head" style="font-size:34px;">CHẮC CHẮN GẬP ANDROID TỐT HƠN IPHONE DUO ✓</div>
          </div>
          <div id="s7-b2" class="s7-box cm-card-yellow cm-shadow-ink">
            <div class="cm-mono" style="font-size:17px;">VẬY CÂU CHUYỆN CÒN LẠI LÀ GÌ?</div>
            <div class="cm-head" style="font-size:36px;">NẰM Ở YẾU TỐ PHẦN MỀM!</div>
          </div>
        </div>

        <div id="s7-right">
          <div id="s7-r-kicker" class="cm-kicker">DI SẢN IN DẤU CỦA IPHONE</div>
          <div id="s7-r1" class="s7-box cm-card-green cm-shadow-ink">
            <div class="cm-mono-dark-pill">ẤN TƯỢNG 01 · GIAO DIỆN</div>
            <div class="cm-head" style="font-size:32px;color:#EFE9D9;">GIAO DIỆN MƯỢT MÀ & ANIMATION</div>
          </div>
          <div id="s7-r2" class="s7-box cm-card-pink cm-shadow-ink">
            <div class="cm-mono" style="font-size:17px;">ẤN TƯỢNG 02 · CHUYỂN ĐỘNG</div>
            <div class="cm-head" style="font-size:32px;">HIỆN ĐẠI · SANG · CHUYỂN CẢNH MƯỢT</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s7-kicker", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power2.out" }, 0.15);
      tl.fromTo("#s7-b1", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 1.60);
      tl.fromTo("#s7-b2", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "power3.out" }, 6.60);
      tl.fromTo("#s7-r-kicker", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power2.out" }, 9.84);
      tl.fromTo("#s7-r1", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 12.52);
      tl.fromTo("#s7-r2", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 17.87);
    `
  },

  // SCENE 08: 188.87 - 200.33s (B-roll 3 outer screen on left + Right Motion Overlay)
  // Verified spoken timecodes (local = global - 188.87):
  // 0.00..3.57 (188.87..192.44): "cũng như là những ứng dụng luôn luôn tương thích với việc mà chúng ta sử dụng trong cuộc sống hàng ngày."
  // 4.13..7.47 (193.00..196.34): "Thì bây giờ cái việc đó chúng ta lại phải chờ"
  // 7.93..11.46 (196.80..200.33): "để cho các lập trình viên có thể tối ưu ở trên con iPhone Duo này."
  {
    id: 'scene-08',
    start: 188.87,
    duration: 11.46,
    label: '08: Ứng dụng hàng ngày lại phải chờ Lập trình viên tối ưu',
    css: `
      #s8-right {
        position: absolute;
        top: 84px;
        right: 68px;
        width: 700px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .s8-item {
        padding: 20px 26px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    `,
    html: `
      <div class="cm-stage">
        <div id="s8-right">
          <div id="s8-kicker" class="cm-kicker">TIÊU CHUẨN SỬ DỤNG HÀNG NGÀY</div>
          <div id="s8-i1" class="s8-item cm-card-green cm-shadow-featured">
            <div class="cm-head" style="font-size:34px;color:#EFE9D9;">ỨNG DỤNG LUÔN TƯƠNG THÍCH HÀNG NGÀY ✓</div>
            <div class="cm-mono-dark-pill">CHUẨN IPHONE</div>
          </div>
          <div id="s8-i2" class="s8-item cm-card-yellow">
            <div class="cm-head" style="font-size:34px;">NHƯNG TRÊN IPHONE DUO: LẠI PHẢI CHỜ! ✕</div>
          </div>
          <div id="s8-i3" class="s8-item cm-card-pink">
            <div class="cm-head" style="font-size:32px;">CHỜ LẬP TRÌNH VIÊN TỐI ƯU CHO MÀN GẬP</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s8-kicker, #s8-i1", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, stagger: 0.12, ease: "back.out(1.25)" }, 0.15);
      tl.fromTo("#s8-i2", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "power3.out" }, 4.13);
      tl.fromTo("#s8-i3", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 7.93);
    `
  },

  // SCENE 09: 200.33 - 227.50s (100% Motion Graphics — The 65M Future Promise Paradox)
  // Verified spoken timecodes (local = global - 200.33):
  // 0.15..2.32 (200.48..202.65): "Trong khi đó quay trở lại cái câu nói mà tôi nói với các bạn lúc nãy,"
  // 2.52..7.51 (202.85..207.84): "đấy là tôi không mua những cái sản phẩm mà dựa vào lời hứa trong tương lai. Tức có nghĩa là"
  // 7.68..10.98 (208.01..211.31): "bây giờ các bạn đang bỏ tiền cho một sản phẩm ở thời điểm hiện tại,"
  // 11.53..16.07 (211.86..216.40): "nhưng để có thể sử dụng tốt nhất thì các bạn lại phải chờ nó được tối ưu trong tương lai."
  // 16.17..21.61 (216.50..221.94): "Thế thì tại vì sao các bạn không chờ đến tương lai rồi các bạn hẵng mua, mà các bạn lại phải mua ở thời điểm hiện tại để làm gì?"
  // 21.88..27.05 (222.21..227.38): "Đúng không? Thì tôi thấy đấy là một cái sự khá là lãng phí và cái việc chờ đợi đấy nó không hề đáng một tí nào."
  {
    id: 'scene-09',
    start: 200.33,
    duration: 27.17,
    label: '09: Nghịch lý Bỏ tiền hiện tại nhưng Chờ tối ưu tương lai',
    css: `
      #s9-wrap {
        position: absolute;
        inset: 60px 84px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 32px;
      }
      #s9-boxes {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 32px;
      }
      .s9-card {
        padding: 30px 34px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      #s9-question {
        padding: 32px 38px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    `,
    html: `
      <div class="ground-cream"></div>
      <div class="cm-stage">
        <div id="s9-wrap">
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div id="s9-kicker" class="cm-kicker">QUAY TRỞ LẠI NGUYÊN TẮC CỐT LÕI</div>
            <div id="s9-head" class="cm-head" style="font-size:62px;">KHÔNG MUA SẢN PHẨM DỰA VÀO LỜI HỨA TƯƠNG LAI!</div>
          </div>

          <div id="s9-boxes">
            <div id="s9-now" class="s9-card cm-card-cream">
              <div class="cm-kicker">THỜI ĐIỂM HIỆN TẠI</div>
              <div class="cm-head" style="font-size:48px;">ĐANG BỎ TIỀN MUA NGAY</div>
              <div class="cm-body" style="font-size:24px;">Xuống tiền tươi thóc thật ở hiện tại cho một thiết bị 65 triệu.</div>
            </div>

            <div id="s9-future" class="s9-card cm-card-yellow">
              <div class="cm-kicker">ĐỂ SỬ DỤNG TỐT NHẤT</div>
              <div class="cm-head" style="font-size:48px;">LẠI PHẢI CHỜ TƯƠNG LAI!</div>
              <div class="cm-body" style="font-size:24px;">Phải chờ ứng dụng được cập nhật & tối ưu trong tương lai.</div>
            </div>
          </div>

          <div id="s9-question" class="cm-card-pink cm-shadow-featured">
            <div style="display:flex;flex-direction:column;gap:8px;max-width:1180px;">
              <div class="cm-mono" style="font-size:20px;">CÂU HỎI ĐẶT RA CHO NGƯỜI MUA:</div>
              <div class="cm-head" style="font-size:46px;" data-var-text="s9_question">"TẠI SAO KHÔNG CHỜ ĐẾN TƯƠNG LAI RỒI HẴNG MUA?"</div>
            </div>
            <div id="s9-stamp" class="cm-badge-rot" style="background:#0F0F0F;color:#EFE9D9;">
              <div class="cm-head" style="font-size:30px;color:#F5C518;">KHÁ LÃNG PHÍ!</div>
              <div class="cm-mono" style="font-size:16px;color:#EFE9D9;">KHÔNG ĐÁNG CHỜ ĐỢI</div>
            </div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s9-kicker", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power2.out" }, 0.15);
      tl.fromTo("#s9-head", { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "power3.out" }, 2.52);
      tl.fromTo("#s9-now", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "power3.out" }, 7.68);
      tl.fromTo("#s9-future", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "power3.out" }, 11.53);
      tl.fromTo("#s9-question", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.58, ease: "back.out(1.25)" }, 16.17);
      tl.fromTo("#s9-stamp", { scale: 1.25, rotation: -10, opacity: 0 }, { scale: 1, rotation: -3, opacity: 1, duration: 0.50, ease: "power4.out" }, 21.88);
    `
  },

  // SCENE 10: 227.50 - 244.43s (B-roll 4 inner screen — Balanced Left & Right)
  // Verified spoken timecodes (local = global - 227.50):
  // 0.34..4.58 (227.84..232.08): "Hơn nữa nha, kể cả khi chúng ta nhìn vào những cái ứng dụng đã được tối ưu ở trên con iPhone Duo này,"
  // 5.05..10.12 (232.55..237.62): "thì dựa vào những cái trải nghiệm của cá nhân tôi, tôi thấy rằng là nó cũng không được gọi là tối ưu cho lắm."
  // 10.54..16.85 (238.04..244.35): "Bởi vì để mà có thể sử dụng được thì gần như là các bạn sẽ phải thay đổi hết toàn bộ những cái thói quen mà các bạn đã sử dụng điện thoại từ trước đến nay luôn."
  {
    id: 'scene-10',
    start: 227.50,
    duration: 16.93,
    label: '10: Ứng dụng đã tối ưu vẫn bắt thay đổi 100% thói quen',
    css: `
      #s10-left {
        position: absolute;
        top: 76px;
        left: 48px;
        width: 490px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      #s10-right {
        position: absolute;
        bottom: 76px;
        right: 48px;
        width: 500px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .s10-card {
        padding: 22px 26px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
    `,
    html: `
      <div class="cm-stage">
        <div id="s10-left">
          <div id="s10-kicker" class="cm-kicker">NGAY CẢ VỚI ỨNG DỤNG ĐÃ TỐI ƯU</div>
          <div id="s10-c1" class="s10-card cm-card-cream cm-shadow-featured">
            <div class="cm-mono" style="font-size:18px;">TRẢI NGHIỆM CÁ NHÂN TRÊN TAY</div>
            <div class="cm-head" style="font-size:38px;">CŨNG KHÔNG TỐI ƯU CHO LẮM!</div>
          </div>
        </div>
        <div id="s10-right">
          <div id="s10-c2" class="s10-card cm-card-pink cm-shadow-ink">
            <div class="cm-mono" style="font-size:18px;">RÀO CẢN KHI SỬ DỤNG</div>
            <div class="cm-head" style="font-size:34px;">PHẢI THAY ĐỔI 100% THÓI QUEN DÙNG ĐIỆN THOẠI TỪ TRƯỚC ĐẾN NAY</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s10-kicker", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power2.out" }, 0.34);
      tl.fromTo("#s10-c1", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 5.05);
      tl.fromTo("#s10-c2", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 10.54);
    `
  },

  // SCENE 11: 244.43 - 275.97s (Talk-head 244.43-251.90s + B-roll 5 & 6 251.90-275.97s — Balanced Left & Right)
  // Verified spoken timecodes (local = global - 244.43):
  // 0.05..3.17 (244.48..247.60): "Ví dụ như là từ trước đến nay các bạn sử dụng iPhone dạng thanh bình thường đi,"
  // 3.53..7.69 (247.96..252.12): "thì các bạn đã rất là quen những cái biểu tượng, những cái công cụ nó nằm phía dưới rồi."
  // 8.13..14.27 (252.56..258.70): "Bây giờ với những ứng dụng được tối ưu cho con iPhone Duo này, thì các bạn sẽ cần phải sử dụng bằng tay phải,"
  // 14.56..17.94 (258.99..262.37): "bởi vì những cái công cụ đấy, những cái giao diện đấy nó đều đưa hết sang bên phải."
  // 18.07..24.68 (262.50..269.11): "Ví dụ như là những cái nút quay về, nút về Home các thứ, thì đều được đưa hết sang bên phải luôn. Nên những cái thao tác khi mà các bạn sử dụng"
  // 24.81..31.54 (269.24..275.97): "thì các bạn gần như là sẽ phải học lại từ đầu, chứ nó sẽ không tạo ra một cái cảm giác quen thuộc giống như là những cái dòng điện thoại gập khác."
  {
    id: 'scene-11',
    start: 244.43,
    duration: 31.54,
    label: '11: Dịch chuyển thanh công cụ từ Cạnh đáy sang Cạnh phải',
    css: `
      #s11-left {
        position: absolute;
        top: 68px;
        left: 48px;
        width: 490px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      #s11-right {
        position: absolute;
        top: 68px;
        right: 48px;
        width: 490px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .s11-box {
        padding: 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
    `,
    html: `
      <div class="cm-stage">
        <div id="s11-left">
          <div id="s11-kicker" class="cm-kicker">IPHONE DẠNG THANH BÌNH THƯỜNG</div>
          <div id="s11-old" class="s11-box cm-card-cream">
            <div class="cm-mono" style="font-size:17px;">THÓI QUEN TỪ TRƯỚC ĐẾN NAY</div>
            <div class="cm-head" style="font-size:34px;">BIỂU TƯỢNG & CÔNG CỤ NẰM PHÍA DƯỚI ✓</div>
          </div>
          <div id="s11-new" class="s11-box cm-card-yellow cm-shadow-featured">
            <div class="cm-mono" style="font-size:17px;">ỨNG DỤNG TRÊN IPHONE DUO</div>
            <div class="cm-head" style="font-size:34px;">CẦN SỬ DỤNG BẰNG TAY PHẢI</div>
            <div id="s11-new-sub" class="cm-card-ink" style="padding:10px 14px;margin-top:4px;">
              <div class="cm-head" style="font-size:23px;color:#F5C518;">CÔNG CỤ ĐƯA HẾT SANG BÊN PHẢI ➔</div>
            </div>
          </div>
        </div>
        <div id="s11-right">
          <div id="s11-call" class="s11-box cm-card-pink cm-shadow-ink">
            <div class="cm-kicker">VÍ DỤ TRỰC QUAN</div>
            <div class="cm-head" style="font-size:32px;">NÚT QUAY VỀ · NÚT HOME ĐƯA HẾT SANG PHẢI</div>
          </div>
          <div id="s11-relearn" class="s11-box cm-card-green cm-shadow-ink">
            <div class="cm-mono-dark-pill">HỆ QUẢ TRẢI NGHIỆM</div>
            <div class="cm-head" style="font-size:30px;color:#EFE9D9;">PHẢI HỌC LẠI TỪ ĐẦU · MẤT CẢM GIÁC QUEN THUỘC!</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s11-kicker", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power2.out" }, 0.15);
      tl.fromTo("#s11-old", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "power3.out" }, 3.53);
      tl.fromTo("#s11-new", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 8.13);
      tl.fromTo("#s11-new-sub", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power2.out" }, 14.56);
      tl.fromTo("#s11-call", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 18.07);
      tl.fromTo("#s11-relearn", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 24.81);
    `
  },

  // SCENE 12: 275.97 - 304.10s (100% Motion Graphics — Zero User Agency & Failure Reasons Already Visible)
  // Verified spoken timecodes (local = global - 275.97):
  // 0.15..3.00 (276.12..278.93): "Hơn nữa cá nhân tôi đánh giá rằng là việc mà chúng ta đã bỏ ra một số tiền lớn"
  // 3.29..7.40 (279.26..283.37): "mà gần như là chúng ta sẽ không được chủ động trong bất kỳ một thứ gì trên cái sản phẩm của mình,"
  // 7.50..13.48 (283.47..289.45): "mà đều phải chờ đợi những nhà phát triển, chờ đợi Apple cũng như là chờ đợi những cái người ngoài kia tối ưu những ứng dụng đấy,"
  // 13.88..15.83 (289.85..291.80): "thì đấy là một cái sự chờ đợi nó không xứng đáng một tí nào."
  // 16.04..23.02 (292.01..298.99): "Trước đây thì cá nhân tôi cũng đã có một cái video nói về việc là con iPhone Duo này vì sao nó sẽ thất bại hoặc là vì sao nó sẽ thành công."
  // 23.31..28.03 (299.28..304.00): "Trên thực tế thì cái lý do thất bại của nó khá là nhiều và nó cũng đã hiện hữu khi mà con máy này ra mắt rồi."
  {
    id: 'scene-12',
    start: 275.97,
    duration: 28.13,
    label: '12: Bỏ số tiền lớn nhưng 0% chủ động & Lý do thất bại hiện hữu',
    css: `
      #s12-wrap {
        position: absolute;
        inset: 60px 84px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 32px;
      }
      #s12-cards {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 28px;
      }
      .s12-card {
        padding: 34px 30px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      #s12-bottom {
        padding: 22px 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    `,
    html: `
      <div class="ground-cream"></div>
      <div class="cm-stage">
        <div id="s12-wrap">
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div id="s12-kicker" class="cm-kicker">GÓC NHÌN ĐÁNH GIÁ CÁ NHÂN</div>
            <div id="s12-title" class="cm-head" style="font-size:62px;">BỎ RA SỐ TIỀN LỚN NHƯNG BỊ ĐỘNG HOÀN TOÀN</div>
          </div>

          <div id="s12-cards">
            <div id="s12-c1" class="s12-card cm-card-cream">
              <div class="cm-head" style="font-size:70px;line-height:0.9;">01</div>
              <div class="cm-head" style="font-size:34px;">0% CHỦ ĐỘNG TRÊN MÁY</div>
              <div class="cm-body" style="font-size:22px;">Không được chủ động trong bất kỳ thứ gì trên chính sản phẩm của mình.</div>
            </div>

            <div id="s12-c2" class="s12-card cm-card-pink cm-shadow-featured">
              <div class="cm-head" style="font-size:70px;line-height:0.9;">02</div>
              <div class="cm-head" style="font-size:34px;">PHẢI CHỜ DEV & APPLE</div>
              <div class="cm-body" style="font-size:22px;">Phụ thuộc hoàn toàn vào nhà phát triển bên thứ 3 tối ưu ứng dụng.</div>
              <div id="s12-c2-sub" class="cm-mono-dark-pill">CHỜ ĐỢI KHÔNG XỨNG ĐÁNG!</div>
            </div>

            <div id="s12-c3" class="s12-card cm-card-yellow">
              <div class="cm-head" style="font-size:70px;line-height:0.9;">03</div>
              <div class="cm-head" style="font-size:34px;">THẤT BẠI HAY THÀNH CÔNG?</div>
              <div class="cm-body" style="font-size:22px;">Đối chiếu lại video phân tích trước đây về số phận của iPhone Duo.</div>
            </div>
          </div>

          <div id="s12-bottom" class="cm-card-ink">
            <div class="cm-head" style="font-size:32px;color:#EFE9D9;">THỰC TẾ KHI RA MẮT: LÝ DO THẤT BẠI ĐÃ HIỆN HỮU RẤT NHIỀU! ➔</div>
            <div class="cm-pill">ĐÃ LỘ DIỆN</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s12-kicker, #s12-title", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, stagger: 0.12, ease: "power2.out" }, 0.15);
      tl.fromTo("#s12-c1", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 3.29);
      tl.fromTo("#s12-c2", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.56, ease: "back.out(1.25)" }, 7.50);
      tl.fromTo("#s12-c2-sub", { scale: 1.15, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.48, ease: "power3.out" }, 13.88);
      tl.fromTo("#s12-c3", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 16.04);
      tl.fromTo("#s12-bottom", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.52, ease: "power3.out" }, 23.31);
    `
  },

  // SCENE 13: 304.10 - 321.43s (Talk-head 304.10-313.07s + B-roll 7 Hinge 313.07-321.43s — Balanced Left & Right)
  // Verified spoken timecodes (local = global - 304.10):
  // 0.14..3.71 (304.24..307.81): "Ví dụ như là câu chuyện liên quan đến phần cứng nhá, nó dễ bị hỏng như thế nào nhá,"
  // 3.90..6.20 (308.00..310.30): "thì anh em xem ở trên mạng tràn lan luôn:"
  // 6.32..9.04 (310.42..313.14): "nó cực kỳ dễ bị hỏng về cái phần bản lề (6.32s), dễ bị sọc màn hình xanh (7.50s)!"
  // 9.35..12.09 (313.45..316.19): "Đến mức mà bây giờ khi mà tôi cầm con máy này trên tay thì"
  // 12.50..16.96 (316.60..321.06): "tôi gần như là rất ngại để mở sử dụng màn hình bên trong (12.50s), vì tôi sợ nó bị hỏng các bạn ạ (15.81s)."
  {
    id: 'scene-13',
    start: 304.10,
    duration: 17.33,
    label: '13: Ám ảnh độ bền — Bản lề dễ hỏng & Sọc màn hình xanh',
    css: `
      #s13-left {
        position: absolute;
        top: 68px;
        left: 48px;
        width: 490px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      #s13-right {
        position: absolute;
        top: 68px;
        right: 48px;
        width: 495px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .s13-box {
        padding: 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
    `,
    html: `
      <div class="cm-stage">
        <div id="s13-left">
          <div id="s13-kicker" class="cm-kicker">PHẦN CỨNG DỄ HỎNG · TRÀN LAN TRÊN MẠNG</div>
          <div id="s13-b1" class="s13-box cm-card-yellow cm-shadow-featured">
            <div class="cm-mono" style="font-size:17px;">ĐIỂM YẾU CHÍ MẠNG 01</div>
            <div class="cm-head" style="font-size:36px;">CỰC KỲ DỄ HỎNG BẢN LỀ!</div>
          </div>
          <div id="s13-b2" class="s13-box cm-card-pink cm-shadow-ink">
            <div class="cm-mono" style="font-size:17px;">ĐIỂM YẾU CHÍ MẠNG 02</div>
            <div class="cm-head" style="font-size:36px;">DỄ BỊ SỌC MÀN HÌNH XANH!</div>
          </div>
        </div>
        <div id="s13-right">
          <div id="s13-fear" class="s13-box cm-card-ink cm-shadow-featured">
            <div class="cm-mono" style="font-size:17px;color:#F5C518;">KHI CẦM MÁY TRÊN TAY</div>
            <div class="cm-head" style="font-size:32px;color:#EFE9D9;">"RẤT NGẠI MỞ MÀN HÌNH BÊN TRONG..."</div>
            <div id="s13-fear-sub" class="cm-badge-rot" style="align-self:flex-start;margin-top:6px;padding:8px 16px;">
              <div class="cm-head" style="font-size:26px;">VÌ SỢ NÓ BỊ HỎNG!</div>
            </div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s13-kicker", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power2.out" }, 0.14);
      tl.fromTo("#s13-b1", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 6.32);
      tl.fromTo("#s13-b2", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "power3.out" }, 7.50);
      tl.fromTo("#s13-fear", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 12.50);
      tl.fromTo("#s13-fear-sub", { scale: 1.2, rotation: -8, opacity: 0 }, { scale: 1, rotation: -3, opacity: 1, duration: 0.48, ease: "power4.out" }, 15.81);
    `
  },

  // SCENE 14: 321.43 - 355.75s (Hybrid: 0..12.47s B-roll 8 Parrot Inner Screen with Balanced Left & Right -> 12.47..34.32s 100% Motion Graphics)
  // Verified spoken timecodes (local = global - 321.43):
  // --- Part 1 over B-roll 8 (321.43..333.90s, local 0.00..12.47s) ---
  // 0.03..4.56 (321.46..325.99): "Hay là những cái câu chuyện liên quan đến khả năng hiển thị, cái việc mà cái tấm nền nhám của nó sẽ"
  // 4.83..8.21 (326.26..329.64): "giảm cái chất lượng hiển thị ra sao, camera trước ẩn như không ẩn (6.20s / 327.63s),"
  // 8.58..12.47 (330.01..333.90): "chất lượng ảnh chụp từ cái camera của cái màn hình bên trong nó tệ như thế nào,"
  // --- Part 2 100% Motion Graphics (333.90..355.75s, local 12.47..34.32s) ---
  // 12.90..18.23 (334.33..339.66): "rồi cho đến cả cái câu chuyện là trọng lượng nó nặng nề (12.90s), những cái thao tác khi mà các bạn cầm trên tay các bạn sử dụng nó không thoải mái ra sao (14.80s)."
  // 18.39..23.52 (339.82..344.95): "Những câu chuyện liên quan đến phần cứng đấy thì nó đang hiện hữu rất là nhiều và đã có rất là nhiều cái sự tranh cãi ở ngoài kia."
  // 23.96..28.91 (345.39..350.34): "Thì trong cái lý do mà tôi nói là vì sao con iPhone Duo này có thể thành công — đấy chính là câu chuyện liên quan tối ưu phần mềm —"
  // 29.35..34.08 (350.78..355.51): "thì rõ ràng ở thời điểm hiện tại khi con máy này nó ra mắt thì cái khả năng tối ưu phần mềm của nó cũng không quá cao (31.92s / 353.35s)."
  {
    id: 'scene-14',
    start: 321.43,
    duration: 34.32,
    label: '14: Màn nhám, Cam ẩn tệ, Nặng nề & Tối ưu phần mềm chưa cao',
    css: `
      #s14-part1 {
        position: absolute;
        inset: 0;
        z-index: 3;
      }
      #s14-p1-left {
        position: absolute;
        top: 68px;
        left: 48px;
        width: 480px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      #s14-p1-right {
        position: absolute;
        bottom: 68px;
        right: 48px;
        width: 490px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      #s14-part2 {
        position: absolute;
        inset: 0;
        z-index: 4;
        opacity: 0;
      }
      #s14-wrap {
        position: absolute;
        inset: 60px 84px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 28px;
      }
      #s14-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 28px;
      }
      .s14-cell {
        padding: 30px 32px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      #s14-sw-bar {
        padding: 24px 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    `,
    html: `
      <div id="s14-part1">
        <div id="s14-p1-left">
          <div id="s14-b-kicker" class="cm-kicker">NHƯỢC ĐIỂM MÀN HÌNH TRONG</div>
          <div id="s14-b1" class="cm-card-cream cm-shadow-featured" style="padding:22px 26px;display:flex;flex-direction:column;gap:8px;">
            <div class="cm-mono" style="font-size:17px;">KHẢ NĂNG HIỂN THỊ</div>
            <div class="cm-head" style="font-size:36px;">TẤM NỀN NHÁM GIẢM CHẤT LƯỢNG HIỂN THỊ ✕</div>
          </div>
        </div>
        <div id="s14-p1-right">
          <div id="s14-b2" class="cm-card-pink cm-shadow-ink" style="padding:22px 26px;display:flex;flex-direction:column;gap:8px;">
            <div class="cm-mono" style="font-size:17px;">CAMERA MÀN HÌNH TRONG</div>
            <div class="cm-head" style="font-size:34px;">CAMERA TRƯỚC ẨN NHƯ KHÔNG ẨN</div>
            <div id="s14-b2-sub" class="cm-mono-dark-pill">CHẤT LƯỢNG ẢNH CHỤP RẤT TỆ!</div>
          </div>
        </div>
      </div>

      <div id="s14-part2">
        <div class="ground-cream"></div>
        <div id="s14-wrap">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="display:flex;flex-direction:column;gap:10px;">
              <div id="s14-kicker" class="cm-kicker">CÔNG THÁI HỌC & TỐI ƯU KHI RA MẮT</div>
              <div id="s14-title" class="cm-head" style="font-size:58px;">NHƯỢC ĐIỂM CẦM NẮM & BÀI TOÁN PHẦN MỀM</div>
            </div>
            <div id="s14-pill" class="cm-pill">TRANH CÃI GAY GẮT</div>
          </div>

          <div id="s14-grid">
            <div id="s14-c3" class="s14-cell cm-card-yellow">
              <div class="cm-mono" style="font-size:18px;">VẤN ĐỀ 03 · TRỌNG LƯỢNG</div>
              <div class="cm-head" style="font-size:40px;">TRỌNG LƯỢNG MÁY NẶNG NỀ</div>
              <div class="cm-body" style="font-size:22px;">Gây mỏi tay khi cầm sử dụng thực tế hàng ngày.</div>
            </div>
            <div id="s14-c4" class="s14-cell cm-card-green">
              <div class="cm-mono-dark-pill">VẤN ĐỀ 04 · THAO TÁC CẦM NẮM</div>
              <div class="cm-head" style="font-size:40px;color:#EFE9D9;">SỬ DỤNG KHÔNG THOẢI MÁI</div>
              <div class="cm-body" style="font-size:22px;color:#EFE9D9;">Cảm giác cầm trên tay thao tác còn nhiều bất tiện.</div>
            </div>
          </div>

          <div id="s14-sw-bar" class="cm-card-pink cm-shadow-featured">
            <div style="display:flex;flex-direction:column;gap:6px;">
              <div class="cm-mono" style="font-size:18px;">LÝ DO THÀNH CÔNG: TỐI ƯU PHẦN MỀM</div>
              <div class="cm-head" style="font-size:36px;">KHI MỚI RA MẮT: KHẢ NĂNG TỐI ƯU PHẦN MỀM CŨNG KHÔNG QUÁ CAO!</div>
            </div>
            <div id="s14-sw-stamp" class="cm-badge-rot" style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:19px;">CHƯA ĐẠT KỲ VỌNG</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s14-b-kicker, #s14-b1", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.50, stagger: 0.12, ease: "back.out(1.25)" }, 0.15);
      tl.fromTo("#s14-b2", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 6.20);
      tl.fromTo("#s14-b2-sub", { scale: 1.15, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.48, ease: "power3.out" }, 8.58);
      // At 12.47s (global 333.90s, end of B-roll 8), switch to 100% Motion Graphics Part 2!
      tl.to("#s14-part1", { opacity: 0, duration: 0.25 }, 12.40);
      tl.to("#s14-part2", { opacity: 1, duration: 0.30 }, 12.47);
      tl.fromTo("#s14-kicker, #s14-title, #s14-c3", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.50, stagger: 0.10, ease: "back.out(1.25)" }, 12.85);
      tl.fromTo("#s14-c4", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.52, ease: "back.out(1.25)" }, 14.80);
      tl.fromTo("#s14-pill", { scale: 1.15, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.48, ease: "back.out(1.25)" }, 18.39);
      tl.fromTo("#s14-sw-bar", { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 23.96);
      tl.fromTo("#s14-sw-stamp", { scale: 1.22, rotation: -9, opacity: 0 }, { scale: 1, rotation: -3, opacity: 1, duration: 0.48, ease: "power4.out" }, 31.92);
    `
  },

  // SCENE 15: 355.75 - 414.13s (Talk-head + B-roll 9 & 10 — Balanced Left & Right)
  // Verified spoken timecodes (local = global - 355.75):
  // 0.15..6.21 (355.90..361.96): "Tuy nhiên, nếu như mà chúng ta xét về một cái phương diện là liên quan đến về mặt truyền thông, thì con iPhone Duo này lại"
  // 6.37..13.06 (362.12..368.81): "cực kỳ thành công về cái câu chuyện đấy, bởi vì nó đã tạo ra một cái sự tranh cãi, một cái sự thảo luận cực kỳ lớn ở trên các nền tảng MXH."
  // 13.40..26.70 (369.15..382.45): "Và tôi nói thật với các bạn là liên quan đến câu chuyện truyền thông thì dù nó là tiêu cực hay tích cực đi chăng nữa, việc tất cả mọi người nói về con máy này — kể cả chê hay khen — đó cũng đã là một thành công của iPhone Duo rồi."
  // 26.86..35.61 (382.61..391.36): "Cá nhân tôi nghĩ rằng là sẽ có rất là nhiều người ở trong cái thời gian đầu sẽ bị hype về con máy này..."
  // 35.95..44.35 (391.70..400.10): "Anti ấy thì sẽ tò mò xem là con máy này nó có cái gì hay, cũng sẽ ra cửa hàng, cầm trên tay thử xem có đúng như lời chê hay không."
  // 44.45..58.25 (400.20..414.00): "Còn đối với những ai thích về con máy này... thì cũng sẽ cố gắng bỏ tiền ra mua, đặt cọc để mua (51.58s / 407.33s) để xem nó có thật sự đúng như những gì người ta nói hay không."
  {
    id: 'scene-15',
    start: 355.75,
    duration: 58.38,
    label: '15: Thắng lợi tuyệt đối về Truyền thông — Anti-fan & Fan đều cuốn vào',
    css: `
      #s15-left {
        position: absolute;
        top: 68px;
        left: 48px;
        width: 485px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      #s15-hero {
        padding: 22px 26px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      #s15-right {
        position: absolute;
        top: 68px;
        right: 48px;
        width: 490px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .s15-group {
        padding: 18px 22px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
    `,
    html: `
      <div class="cm-stage">
        <div id="s15-left">
          <div id="s15-kicker" class="cm-kicker">XÉT VỀ PHƯƠNG DIỆN TRUYỀN THÔNG</div>
          <div id="s15-hero" class="cm-card-green cm-shadow-featured">
            <div class="cm-mono-dark-pill">THẢO LUẬN CỰC LỚN TRÊN MXH</div>
            <div class="cm-head" style="font-size:40px;color:#EFE9D9;" data-var-text="s15_win">CỰC KỲ THÀNH CÔNG VỀ TRUYỀN THÔNG!</div>
          </div>
          <div id="s15-viral" class="s15-group cm-card-cream cm-shadow-ink">
            <div class="cm-mono" style="font-size:17px;">TIÊU CỰC HAY TÍCH CỰC · KHEN HAY CHÊ</div>
            <div class="cm-head" style="font-size:28px;">TẤT CẢ MỌI NGƯỜI ĐỀU NÓI VỀ IPHONE DUO!</div>
          </div>
        </div>

        <div id="s15-right">
          <div id="s15-r-kicker" class="cm-kicker">HIỆU ỨNG BỊ HYPE THỜI GIAN ĐẦU</div>
          <div id="s15-g1" class="s15-group cm-card-yellow cm-shadow-ink">
            <div class="cm-mono" style="font-size:17px;">NHÓM 01 · ANTI-FAN</div>
            <div class="cm-head" style="font-size:28px;">TÒ MÒ RA CỬA HÀNG CẦM THỬ XEM CÓ ĐÚNG NHƯ LỜI CHÊ</div>
          </div>
          <div id="s15-g2" class="s15-group cm-card-pink cm-shadow-ink">
            <div class="cm-mono" style="font-size:17px;">NHÓM 02 · NGƯỜI YÊU THÍCH</div>
            <div class="cm-head" style="font-size:28px;">ĐẶT CỌC XUỐNG TIỀN MUA ĐỂ TỰ KIỂM CHỨNG</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s15-kicker", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power2.out" }, 0.15);
      tl.fromTo("#s15-hero", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.56, ease: "back.out(1.25)" }, 6.37);
      tl.fromTo("#s15-viral", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52, ease: "power3.out" }, 13.40);
      tl.fromTo("#s15-r-kicker", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power2.out" }, 26.86);
      tl.fromTo("#s15-g1", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 35.95);
      tl.fromTo("#s15-g2", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 44.45);
    `
  },

  // SCENE 16: 414.13 - 458.55s (Hybrid: 0..17.67s 100% Motion Graphics 7-8 Years Paradox -> 17.67..44.42s B-roll 11 & Talk-head with Balanced Left & Right Overlays)
  // Verified spoken timecodes (local = global - 414.13):
  // 0.10..4.39 (414.23..418.52): "Và có một sự thật đấy chính là mặc dù điện thoại gập đã xuất hiện ở trên thị trường từ 7 cho đến 8 năm nay rồi,"
  // 4.69..10.99 (418.82..425.12): "nhưng phải cho đến khi con iPhone Duo này ra mắt thì nhiều người mới biết là có sự tồn tại của điện thoại gập."
  // 11.27..17.60 (425.40..431.73): "Bởi vì nhiều người cho rằng là những cái mẫu điện thoại gập Android ngoài kia nó chỉ là những cái dòng sản phẩm bình thường, nó kiểu không quá wow để cho mọi người"
  // --- At 17.67s (431.80s), reveal B-roll 11 & Talk-head underneath ---
  // 21.37..30.21 (435.50..444.34): "Nhưng khi một hãng như kiểu iPhone họ tạo ra một cái điện thoại gập như thế này thì mọi người mới kiểu: Uầy! Điện thoại gập bây giờ nó xịn như thế này cơ á, màn hình của nó to thế này cơ á!"
  // 34.48..38.85 (448.61..452.98): "Vậy nên đó cũng là lý do vì sao mà có rất nhiều người đã xuống tiền và đặt cọc con iPhone này."
  // 39.00..44.37 (453.13..458.50): "Và tôi nghĩ rằng là cái tình trạng mà khan hàng cũng như là cháy hàng của con iPhone Duo này là thật, chứ nó không hề giả một tí nào đâu."
  {
    id: 'scene-16',
    start: 414.13,
    duration: 44.42,
    label: '16: Nghịch lý 7–8 Năm Gập Android vs Cơn sốt Cháy hàng iPhone Duo',
    css: `
      #s16-part1 {
        position: absolute;
        inset: 0;
        z-index: 3;
      }
      #s16-wrap {
        position: absolute;
        inset: 60px 84px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 36px;
      }
      #s16-cols {
        display: grid;
        grid-template-columns: 1fr 1.15fr;
        gap: 32px;
      }
      .s16-col {
        padding: 40px 38px;
        display: flex;
        flex-direction: column;
        gap: 18px;
      }
      #s16-part2 {
        position: absolute;
        inset: 0;
        z-index: 4;
        opacity: 0;
      }
      #s16-p2-left {
        position: absolute;
        top: 68px;
        left: 48px;
        width: 490px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      #s16-p2-right {
        position: absolute;
        top: 68px;
        right: 48px;
        width: 495px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
    `,
    html: `
      <div id="s16-part1">
        <div class="ground-cream"></div>
        <div id="s16-wrap">
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div id="s16-kicker" class="cm-kicker">SỰ THẬT THÚ VỊ TRÊN THỊ TRƯỜNG</div>
            <div id="s16-title" class="cm-head" style="font-size:64px;">ĐỊNH HÌNH LẠI NHẬN THỨC VỀ ĐIỆN THOẠI GẬP</div>
          </div>

          <div id="s16-cols">
            <div id="s16-c1" class="s16-col cm-card-cream2">
              <div class="cm-kicker">ĐIỆN THOẠI GẬP TRÊN THỊ TRƯỜNG</div>
              <div class="cm-head" style="font-size:76px;line-height:0.95;" data-var-text="fold_years">7 – 8 NĂM</div>
              <div class="cm-head" style="font-size:32px;">ĐÃ XUẤT HIỆN TỪ RẤT LÂU</div>
              <div id="s16-c1-sub" class="cm-card-cream" style="padding:14px 18px;border-width:4px;">
                <div class="cm-head" style="font-size:24px;">GẬP ANDROID BỊ COI LÀ BÌNH THƯỜNG · KHÔNG QUÁ "WOW"</div>
              </div>
            </div>

            <div id="s16-c2" class="s16-col cm-card-pink cm-shadow-featured">
              <div class="cm-kicker">ĐẾN KHI IPHONE DUO RA MẮT</div>
              <div class="cm-head" style="font-size:46px;">NHIỀU NGƯỜI MỚI BIẾT CÓ SỰ TỒN TẠI CỦA ĐIỆN THOẠI GẬP!</div>
              <div class="cm-body" style="font-size:23px;">Sức ảnh hưởng của Apple khiến đại chúng lần đầu thực sự chú ý tới chuẩn máy gập.</div>
            </div>
          </div>
        </div>
      </div>

      <div id="s16-part2">
        <div id="s16-p2-left">
          <div class="cm-kicker">KHI IPHONE TẠO RA ĐIỆN THOẠI GẬP</div>
          <div id="s16-wow" class="cm-card-pink cm-shadow-featured" style="padding:22px 26px;display:flex;flex-direction:column;gap:10px;">
            <div class="cm-mono" style="font-size:17px;">PHẢN ỨNG CỦA ĐÁM ĐÔNG</div>
            <div class="cm-head" style="font-size:34px;">"UẦY! XỊN THẾ NÀY CƠ Á, MÀN HÌNH TO THẾ CƠ Á!"</div>
          </div>
        </div>

        <div id="s16-p2-right">
          <div id="s16-deposit" class="cm-card-cream cm-shadow-ink" style="padding:20px 24px;display:flex;flex-direction:column;gap:8px;">
            <div class="cm-mono" style="font-size:17px;">HỆ QUẢ TRỰC TIẾP</div>
            <div class="cm-head" style="font-size:32px;">RẤT NHIỀU NGƯỜI XUỐNG TIỀN & ĐẶT CỌC NGAY</div>
          </div>
          <div id="s16-soldout" class="cm-card-yellow cm-shadow-ink" style="padding:20px 24px;display:flex;flex-direction:column;gap:8px;">
            <div class="cm-mono" style="font-size:17px;">XÁC NHẬN THỰC TẾ</div>
            <div class="cm-head" style="font-size:36px;">KHAN HÀNG & CHÁY HÀNG LÀ THẬT 100%!</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s16-kicker, #s16-title", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, stagger: 0.12, ease: "power2.out" }, 0.15);
      tl.fromTo("#s16-c1", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "power3.out" }, 0.80);
      tl.fromTo("#s16-c2", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.56, ease: "back.out(1.25)" }, 4.69);
      tl.fromTo("#s16-c1-sub", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power2.out" }, 11.27);
      // At 17.67s (global 431.80s), reveal B-roll 11 underneath!
      tl.to("#s16-part1", { opacity: 0, duration: 0.30 }, 17.60);
      tl.set("#s16-part2", { opacity: 1 }, 17.90);
      tl.fromTo("#s16-p2-left", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 21.37);
      tl.fromTo("#s16-deposit", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 34.48);
      tl.fromTo("#s16-soldout", { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 39.00);
    `
  },

  // SCENE 17: 458.55 - 488.35s (100% Motion Graphics — 3-Step Post-FOMO Forecast)
  // Verified spoken timecodes (local = global - 458.55):
  // 0.15..2.60 (458.70..461.15): "Nhưng theo dự đoán của tôi cũng như là theo quan điểm của tôi,"
  // 2.93..7.05 (461.48..465.60): "thì khả năng cao là mọi người sẽ rất là nhanh chán con máy này sau một khoảng thời gian sử dụng."
  // 7.52..11.68 (466.07..470.23): "Lúc này khi mà mọi người sử dụng, mọi người đã bắt đầu qua cái cơn hype, qua cái cơn FOMO đi,"
  // 12.00..18.14 (470.55..476.69): "và cảm thấy rằng là những cái nhược điểm của con máy này đang dần dần hiện hữu và ảnh hưởng đến cái trải nghiệm sử dụng hàng ngày."
  // 18.44..23.25 (476.99..481.80): "Thì phần nào đấy tôi nghĩ rằng là khả năng cao trong thời gian sắp tới thì con iPhone Duo này sẽ bị trả hàng khá là nhiều,"
  // 23.50..29.70 (482.05..488.25): "hoặc là nó có thể sẽ được sử dụng để trade-in quay trở lại những cái dòng sản phẩm khác như kiểu là iPhone 18 Pro hoặc là iPhone 18 Pro Max chẳng hạn."
  {
    id: 'scene-17',
    start: 458.55,
    duration: 29.80,
    label: '17: Dự báo Hậu FOMO — Nhanh chán, Trả hàng & Trade-in iPhone 18 Pro Max',
    css: `
      #s17-wrap {
        position: absolute;
        inset: 60px 84px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 32px;
      }
      #s17-steps {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 28px;
      }
      .s17-step {
        padding: 36px 32px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      #s17-footer {
        padding: 22px 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    `,
    html: `
      <div class="ground-cream"></div>
      <div class="cm-stage">
        <div id="s17-wrap">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="display:flex;flex-direction:column;gap:10px;">
              <div id="s17-kicker" class="cm-kicker">DỰ ĐOÁN CỦA CÁ NHÂN TÔI</div>
              <div id="s17-title" class="cm-head" style="font-size:60px;">RẤT NHANH CHÁN SAU MỘT THỜI GIAN SỬ DỤNG!</div>
            </div>
            <div class="cm-badge-rot" style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:20px;">KỊCH BẢN HẬU FOMO</div>
          </div>

          <div id="s17-steps">
            <div id="s17-st1" class="s17-step cm-card-cream">
              <div class="cm-head" style="font-size:74px;line-height:0.9;">01</div>
              <div class="cm-head" style="font-size:36px;">QUA CƠN HYPE & FOMO</div>
              <div class="cm-body" style="font-size:22px;">Sau giai đoạn hào hứng ban đầu, người mua bắt đầu đối diện với thực tế sử dụng.</div>
            </div>

            <div id="s17-st2" class="s17-step cm-card-yellow">
              <div class="cm-head" style="font-size:74px;line-height:0.9;">02</div>
              <div class="cm-head" style="font-size:36px;">NHƯỢC ĐIỂM HIỆN HỮU</div>
              <div class="cm-body" style="font-size:22px;">Các điểm yếu dần lộ rõ và ảnh hưởng trực tiếp tới trải nghiệm hàng ngày.</div>
            </div>

            <div id="s17-st3" class="s17-step cm-card-green cm-shadow-featured">
              <div class="cm-mono-dark-pill">GIAI ĐOẠN 03 · SẮP TỚI</div>
              <div class="cm-head" style="font-size:38px;color:#EFE9D9;">BỊ TRẢ HÀNG KHÁ NHIỀU!</div>
              <div class="cm-body" style="font-size:22px;color:#EFE9D9;">Làn sóng hoàn trả máy khi trải nghiệm không tương xứng kỳ vọng.</div>
            </div>
          </div>

          <div id="s17-footer" class="cm-card-pink">
            <div class="cm-head" style="font-size:34px;" data-var-text="s17_tradein">HOẶC DÙNG TRADE-IN QUAY LẠI: IPHONE 18 PRO / IPHONE 18 PRO MAX!</div>
            <div class="cm-pill">QUAY VỀ MÁY THANH</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s17-kicker", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power2.out" }, 0.15);
      tl.fromTo("#s17-title", { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "power3.out" }, 2.93);
      tl.fromTo("#s17-st1", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 7.52);
      tl.fromTo("#s17-st2", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 12.00);
      tl.fromTo("#s17-st3", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.56, ease: "back.out(1.25)" }, 18.44);
      tl.fromTo("#s17-footer", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.54, ease: "power3.out" }, 23.50);
    `
  },

  // SCENE 18: 488.35 - 526.07s (Talk-head Preserved Throughout — Balanced Left & Right Closing CTA)
  // Verified spoken timecodes (local = global - 488.35):
  // 0.09..7.25 (488.44..495.60): "Và đó là những cái quan điểm cũng như là những cái suy nghĩ cá nhân của tôi liên quan đến con iPhone Duo, lý do vì sao nó lại tạo ra cái sự tranh cãi như vậy, và liệu"
  // 7.51..14.59 (495.86..502.94): "nó có trở nên thành công trong năm 2026 này hay không, hay nó chỉ đơn giản là một sản phẩm thương mại, nó là một sản phẩm marketing của nhà Apple mà thôi?"
  // 17.62..24.66 (505.97..513.01): "Trong thời gian sắp tới thì tôi cũng sẽ có những cái video nói về con iPhone Duo này, từ những cái video ví dụ như là đánh giá này, hay là so sánh với cả Galaxy Z Fold."
  // 24.98..30.89 (513.33..519.24): "Vậy nên là anh em hoàn toàn có thể để lại 1 Like, 1 Share, 1 Đăng ký kênh của tôi để có thể chờ đón những cái video tiếp theo nhá. Rồi,"
  // 31.17..37.57 (519.52..525.92): "cảm ơn tất cả các bạn đã xem đến giây phút này của video... Tạm biệt mọi người và hẹn gặp lại mọi người ở những video lần sau!"
  {
    id: 'scene-18',
    start: 488.35,
    duration: 37.72,
    label: '18: Tổng kết 2026 & Kêu gọi Like · Share · Đăng ký kênh (Talk-head)',
    css: `
      #s18-left {
        position: absolute;
        top: 68px;
        left: 48px;
        width: 490px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        z-index: 3;
      }
      #s18-right {
        position: absolute;
        top: 68px;
        right: 48px;
        width: 495px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        z-index: 4;
      }
      #s18-cta-card {
        background: #136636;
        color: #EFE9D9;
        border: 5px solid #0F0F0F;
        padding: 22px 26px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
    `,
    html: `
      <div class="cm-stage">
        <div id="s18-left">
          <div id="s18-kicker" class="cm-kicker">TỔNG KẾT QUAN ĐIỂM CÁ NHÂN</div>
          <div id="s18-q" class="cm-card-cream cm-shadow-ink" style="padding:20px 24px;display:flex;flex-direction:column;gap:8px;">
            <div class="cm-mono" style="font-size:17px;">CÂU HỎI MỞ CHO NĂM 2026</div>
            <div class="cm-head" style="font-size:30px;">THÀNH CÔNG THẬT SỰ HAY CHỈ LÀ SẢN PHẨM MARKETING CỦA APPLE?</div>
          </div>

          <div id="s18-next" class="cm-card-yellow cm-shadow-ink" style="padding:20px 24px;display:flex;flex-direction:column;gap:6px;">
            <div class="cm-mono" style="font-size:17px;">VIDEO SẮP TỚI TRÊN KÊNH</div>
            <div class="cm-head" style="font-size:30px;">ĐÁNH GIÁ CHI TIẾT & SO SÁNH GALAXY Z FOLD</div>
          </div>
        </div>

        <div id="s18-right" data-layout-allow-overlap>
          <div id="s18-cta-card" class="cm-shadow-featured">
            <div class="cm-mono-dark-pill">ỦNG HỘ KÊNH ĐỂ CHỜ ĐÓN VIDEO TIẾP THEO</div>
            <div class="cm-head" style="font-size:40px;color:#EFE9D9;" data-var-text="cta_closing">LIKE · SHARE · ĐĂNG KÝ KÊNH</div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:2px;">
              <div class="cm-pill" style="font-size:16px;padding:4px 14px;">BẤM CHUÔNG THÔNG BÁO</div>
            </div>
          </div>

          <div id="s18-stamp" class="cm-stamp-rot cm-shadow-ink" style="align-self:flex-end;">
            <div class="cm-head" style="font-size:28px;">CẢM ƠN & HẸN GẶP LẠI!</div>
          </div>
        </div>
      </div>
    `,
    anim: `
      tl.fromTo("#s18-kicker", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48, ease: "power2.out" }, 0.15);
      tl.fromTo("#s18-q", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "back.out(1.25)" }, 7.51);
      tl.fromTo("#s18-next", { x: -44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.54, ease: "power3.out" }, 17.62);
      tl.fromTo("#s18-cta-card", { x: 48, scale: 0.94, opacity: 0 }, { x: 0, scale: 1, opacity: 1, duration: 0.56, ease: "back.out(1.25)" }, 24.98);
      tl.fromTo("#s18-stamp", { scale: 1.24, rotation: -10, opacity: 0 }, { scale: 1, rotation: -4, opacity: 1, duration: 0.50, ease: "power4.out" }, 31.17);
    `
  }
];

for (const s of scenes) {
  const scriptBody = mode === 'sketch'
    ? (s.id === 'scene-14'
        ? `const tl = gsap.timeline({ paused: true });\ntl.set("#s14-part1", { opacity: 0 }, 12.47);\ntl.set("#s14-part2", { opacity: 1 }, 12.47);\nwindow.__timelines["${s.id}"] = tl;`
        : s.id === 'scene-16'
          ? `const tl = gsap.timeline({ paused: true });\ntl.set("#s16-part1", { opacity: 0 }, 17.67);\ntl.set("#s16-part2", { opacity: 1 }, 17.67);\nwindow.__timelines["${s.id}"] = tl;`
          : `const tl = gsap.timeline({ paused: true });\nwindow.__timelines["${s.id}"] = tl;`)
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
  { id: 'product_name', type: 'string', label: 'Tên sản phẩm', default: 'IPHONE DUO' },
  { id: 's1_verdict', type: 'string', label: 'Cảnh 1: Nhận định chiến lược', default: 'NƯỚC ĐI CÓ CHỦ ĐÍCH CỦA APPLE!' },
  { id: 's4_principle', type: 'string', label: 'Cảnh 4: Nguyên tắc mua hàng', default: '"KHÔNG MUA VÌ LỜI HỨA!"' },
  { id: 'price_mid', type: 'string', label: 'Cảnh 5: Mốc giá so sánh tầm trung', default: '20 TRIỆU' },
  { id: 'price_duo', type: 'string', label: 'Cảnh 6: Giá bán iPhone Duo', default: '65 TRIỆU' },
  { id: 's9_question', type: 'string', label: 'Cảnh 9: Câu hỏi nghịch lý', default: '"TẠI SAO KHÔNG CHỜ ĐẾN TƯƠNG LAI RỒI HẴNG MUA?"' },
  { id: 's15_win', type: 'string', label: 'Cảnh 15: Điểm thắng lợi', default: 'CỰC KỲ THÀNH CÔNG VỀ TRUYỀN THÔNG!' },
  { id: 'fold_years', type: 'string', label: 'Cảnh 16: Số năm điện thoại gập', default: '7 – 8 NĂM' },
  { id: 's17_tradein', type: 'string', label: 'Cảnh 17: Dự báo Trade-in', default: 'HOẶC DÙNG TRADE-IN QUAY LẠI: IPHONE 18 PRO / IPHONE 18 PRO MAX!' },
  { id: 'cta_closing', type: 'string', label: 'Cảnh 18: Lời kêu gọi kết video', default: 'LIKE · SHARE · ĐĂNG KÝ KÊNH' },
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
    <title>iPhone Duo — Quan Điểm & Phân Tích (Creative Mode)</title>
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
      data-duration="526.07"
    >
      <video
        id="master-video"
        class="clip"
        src="assets/source.mp4"
        playsinline
        data-has-audio="true"
        data-start="0"
        data-duration="526.07"
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
console.log(`Built 18 scenes and index.html in ${mode} mode.`);
