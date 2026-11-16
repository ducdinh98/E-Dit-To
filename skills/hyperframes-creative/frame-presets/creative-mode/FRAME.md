---
version: alpha
name: Creative Mode — Frame (video / frame layer)
description: >
  Video-first companion to Creative Mode's design.md. The unit is the frame (1920×1080),
  not the slide-in-a-deck. Atoms are identical and sacred — warm cream canvas, 4px ink
  borders, hard offset shadows (no blur), Archivo Black uppercase at 0.92 line-height,
  JetBrains Mono taxonomy, Space Grotesk body, the four-accent palette. Composition,
  frame scale, and aspect-ratio behavior are rewritten for the frame. Motion is out of scope.
unit: the frame — 1920×1080 primary; 9:16 and 1:1 documented
principle: atoms are sacred · composition is free · numbers come from the script

colors:
  cream: "#EFE9D9"
  cream-2: "#E4DCC4"
  ink: "#0F0F0F"
  ink-2: "#2A2A2A"
  green: "#1F8A4C"
  green-dark: "#136636"
  pink: "#F06CA8"
  pink-dark: "#D14E8B"
  orange: "#E85A1F"
  yellow: "#F5C518"

typography:
  # — reading ramp (px @ 1920, with cqw) —
  body-lg:    { fontFamily: "Space Grotesk", px: 28, cqw: 1.46, weight: 400, lineHeight: 1.4 }
  body-md:    { fontFamily: "Space Grotesk", px: 24, cqw: 1.25, weight: 400, lineHeight: 1.3 }
  mono-label: { fontFamily: "JetBrains Mono", px: 24, cqw: 1.25, weight: 400, tracking: "0.06em", upper: true }
  mono-kicker:{ fontFamily: "JetBrains Mono", px: 24, cqw: 1.25, weight: 400, tracking: "0.14em", upper: true }
  table-head: { fontFamily: "Archivo Black", px: 28, cqw: 1.46, weight: 400, upper: true }
  # — display / hero ramp (frame-native, cqw-first) —
  step-title: { fontFamily: "Archivo Black", px: 34,  cqw: 1.77, weight: 400, lineHeight: 1.0, upper: true }
  badge-label:{ fontFamily: "Archivo Black", px: 28,  cqw: 1.46, weight: 400, upper: true }
  marker:     { fontFamily: "Archivo Black", cqw: 2.4, weight: 400, lineHeight: 1.0, upper: true }
  stamp-num:  { fontFamily: "Archivo Black", cqw: 2.2, weight: 400, lineHeight: 0.9 }
  stat-num:   { fontFamily: "Archivo Black", cqw: 6.4, weight: 400, lineHeight: 0.88 }
  step-num:   { fontFamily: "Archivo Black", cqw: 7.0, weight: 400, lineHeight: 0.85 }
  display-head: { fontFamily: "Archivo Black", cqw: 4.2, weight: 400, lineHeight: 0.92, tracking: "-0.01em", upper: true }
  display-lg: { fontFamily: "Archivo Black", cqw: 8.0,  weight: 400, lineHeight: 0.9,  tracking: "-0.01em", upper: true }
  display-xl: { fontFamily: "Archivo Black", cqw: 11.0, weight: 400, lineHeight: 0.9,  tracking: "-0.01em", upper: true }
  display-hero:{ fontFamily: "Archivo Black", cqw: 15.5,weight: 400, lineHeight: 0.84, tracking: "-0.02em", upper: true }

spacing:
  frame-pad: "3.3cqw"        # 64px chrome gutter @1920
  content-gutter: "5cqw"     # 96px content gutter @1920
  grid-gap: "1.5cqw"         # 28px
  cell-pad: "1.7cqw"         # 32px

components:
  frame-chrome:
    typography: "{typography.mono-label}"
    placement: "OMITTED on motion videos (especially 9:16 vertical and narrated videos); reserved only for static 16:9 slide-deck adaptations"
    rounded: "0"
    shadow: "none"
    description: "Slide-deck mono topbar (01 // SECTION + pill) and meta footer (descriptor + 01 • 10 counter). DO NOT render on video canvases — keep top and bottom breathing zones clean."
  stat-cell:
    backgroundColor: "{colors.green} · {colors.pink} · {colors.orange} · {colors.cream}"
    textColor: "{colors.cream} on accent · {colors.ink} on cream"
    border: "0.4cqw solid {colors.ink}"
    rounded: "16px"
    padding: "{spacing.cell-pad}"
    typography: "{typography.stat-num} + {typography.mono-label}"
    shadow: "none"
    description: "Flat accent/cream stat tile, softly rounded 4 corners (16px), no shadow."
  step-card:
    backgroundColor: "{colors.cream} · {colors.pink} · {colors.yellow} · {colors.green}"
    border: "0.4cqw solid {colors.ink}"
    rounded: "18px"
    padding: "{spacing.cell-pad}"
    typography: "{typography.step-num} + {typography.step-title} + {typography.body-md}"
    shadow: "none"
    description: "Ink-bordered card with softly rounded 4 corners (18px); giant step-num top. Sequence alternates cream with accents and ENDS on green."
  marker-block:
    backgroundColor: "{colors.pink}"
    textColor: "{colors.ink}"
    border: "0.4cqw solid {colors.ink}"
    rounded: "20px"
    typography: "{typography.marker}"
    shadow: "1.25cqw 1.25cqw 0 {colors.orange}, 1.25cqw 1.25cqw 0 0.2cqw {colors.ink}"
    description: "The one hard-offset featured callout per frame, softly rounded 4 corners (20px)."
  kicker-block:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    typography: "{typography.mono-kicker}"
    padding: "0.5cqw 1cqw"
    rounded: "12px"
    description: "Inverted eyebrow chip with softly rounded corners (12px)."
  badge-rotated:
    backgroundColor: "{colors.yellow}"
    border: "0.4cqw solid {colors.ink}"
    typography: "{typography.badge-label}"
    rounded: "12px"
    transform: "rotate(-4deg)"
    description: "Deliberate-imperfection annotation with softly rounded corners (12px)."
  pill-badge:
    backgroundColor: "{colors.cream}"
    border: "0.2cqw solid {colors.ink}"
    rounded: "999px"
    typography: "{typography.mono-label}"
    description: "Full pill chip (999px)."
  stamp:
    backgroundColor: "{colors.pink}"
    border: "0.4cqw solid {colors.cream}"
    size: "~18cqw square"
    rounded: "18px"
    transform: "rotate(-6deg)"
    typography: "{typography.stamp-num}"
    description: "Closing seal with softly rounded corners (18px) and a cream circular inner ring."
  comparison-table:
    backgroundColor: "{colors.cream-2}"
    border: "0.4cqw solid {colors.ink}"
    rule: "0.3cqw solid {colors.ink}"
    rounded: "18px"
    typography: "{typography.table-head} + {typography.body-md}"
    shadow: "none"
    description: "Ink head row with cream Archivo labels; softly rounded outer frame (18px); pink/green column-fill variants."
  decorative-circle:
    backgroundColor: "{colors.yellow}"
    border: "0.4cqw solid {colors.ink}"
    rounded: "50%"
    description: "Decorative figure; pairs with a green panel for shape contrast."
  svg-pipeline-machine:
    backgroundColor: "{colors.cream-2} · {colors.ink} · {colors.green} · {colors.pink} · {colors.yellow}"
    border: "4px solid {colors.ink} (SVG stroke-width: 4)"
    shadow: "8px 8px 0 {colors.ink}"
    description: "Code-authored inline SVG mechanical/system metaphor: conveyor belt with moving dashed track, scanner arches that light up green/orange on check, processing machine with animated eyes/gears, and traveling item cards that receive tick marks and stamp slams (XONG ✓ / KHÔNG ✕)."
  card-sorter-meter:
    backgroundColor: "{colors.cream} · {colors.green} · {colors.pink} · {colors.orange}"
    border: "0.4cqw solid {colors.ink}"
    shadow: "10px 10px 0 {colors.ink}"
    description: "Interactive sorting diagram + live impact meter: a category card with an animated progress/impact bar (counting 1/N → K/N) while a stack of item cards travels through filter gates and sorts into two columns (e.g. green passed column vs cream-2/pink rejected column)."
  svg-cross-section:
    backgroundColor: "{colors.cream} · {colors.cream-2} · {colors.green} · {colors.yellow}"
    border: "4px solid {colors.ink} (SVG stroke-width: 4)"
    shadow: "12px 12px 0 {colors.ink}"
    description: "Multi-layer SVG architectural or hardware cross-section: e.g. a 3-floor office cut-away with desks, monitors, spotlight cones turning on sequentially, and task cards sliding out into a processor; OR a device X-ray showing internal battery cells, cooling pipes, and shield layers."
  svg-dataviz-chart:
    backgroundColor: "{colors.cream} · {colors.green} · {colors.pink} · {colors.orange}"
    border: "4px solid {colors.ink}"
    shadow: "10px 10px 0 {colors.ink}"
    description: "Code-driven SVG chart (diverging line chart, area gap fill, or animated bar/radar chart): crisp ink axes, dashed vertical milestone line, self-drawing SVG curves (stroke-dashoffset), shaded divergence zone between curves, and hard-bordered callout bracket (-19%, +240%)."
---

# Creative Mode — Frame (video / frame layer)

## Overview

Creative Mode at frame scale is a **neo-brutalist editorial poster in motion's clothing** — warm
cream paper, near-black ink, and four accents that collide at full saturation. Every frame is one
flat color-blocked composition: no gradients, no blurred shadows, and **softly rounded 4 corners**
on all motion frames, video windows, and text cards (`border-radius: 16px–24px` on large frames/video
windows, `12px–16px` on cards/badges/meters, `999px` on pill chips — never sharp `0px` corners).
Depth is **hard offset shadow** (a solid same-direction duplicate) or **color-block contrast**, never light.

The display voice is **Archivo Black in strict uppercase at 0.92 line-height** — letters overlap
their own cap height; that tightness is the brand. **JetBrains Mono** carries every label, kicker,
counter, and axis as a "technical artifact" register. **Space Grotesk** carries the few body lines.
The frame is loud by construction and calm by restraint: two or three accents per frame, the green
ground reserved for a single closing plate, the hard shadow spent on one featured element only.

**Key characteristics at frame scale:**

- **Cream ground** (`{colors.cream}`) on nearly every frame; `{colors.green}` reserved for the closing plate.
- **0.4cqw (4px @1920) ink borders** on every structural element; 0.3cqw internal rules.
- **Softly rounded 4 corners** (`16px–24px` on large frames/video windows, `12px–16px` on cards/badges/meters, `999px` on pill chips — never sharp `0px` square corners).
- **Hard offset shadow** (≈1.25cqw, orange+ink) on one featured block per frame — never blurred.
- **Archivo Black uppercase**, 0.92 line-height, always; sentence-case Archivo Black does not exist.
- **Two or three accents per frame**, never all four; collisions are the design.

### Frame Craft Bar

Three eyeball tests gate every frame before any structural check:

- **Squint** — exactly one element dominates, at **3–6× its nearest neighbor** (a chasm, not a ramp): the `display-hero`/`display-xl` claim or the `stat-num` figure, never two rival headlines.
- **Silence** — sparse frames (cover, claim, closer) read **45–60% empty**; the **stat grid and comparison ledger are the one dense exception**. Never fill a sparse frame to look complete.
- **Restraint** — the scarce gestures fire **once per frame**: at most one hard-offset shadow, two-to-three accents (never all four), the green ground reserved for the single closing plate.
- **Reference** — aim at a **Risograph editorial poster / punk-zine spread** (flat ink-bordered blocks, one big claim, vast cream); failure looks like a **rounded, soft-shadowed SaaS feature grid**.

## The Frame

- **Primary:** 1920×1080 (16:9). All display sizes authored in **`cqw`** (`px ÷ 1920 × 100 = cqw`).
- **Vertical:** 1080×1920 (9:16). **Square:** 1080×1080 (1:1).
- **Safe area:** chrome at `3.3cqw` (64px) inset; content at `5cqw` (96px) gutter. No load-bearing element crosses the `3.3cqw` line.

**The container law (load-bearing).** Every frame ground sets `container-type: size`. ALL
frame-relative units are `cqw`/`cqh` (1cqw = 1% of the frame's width), resolved against that
ground — **never `vw`.** `vw` measures the page viewport, so a frame inflates whenever it isn't
rendered full-screen; `cqw` resolves against the frame at any render size. This is why every size
in the display ramp is `cqw`.

## Colors

Tokens identical to the source. At frame scale: `{colors.cream}` is the **ground**, `{colors.ink}`
is borders + type, and the four accents (`green` / `pink` / `orange` / `yellow`) are **flat fills
rationed two-to-three per frame.** `{colors.orange}` is also the hard-shadow color. `{colors.green}`
doubles as the single closing-plate ground — its rarity is the impact. Never introduce a fifth
accent; never use pure white; never gradient.

## Typography

Two ramps. The **reading ramp** (body, mono labels, table heads) holds px+cqw for chrome and copy.
The **display/hero ramp** is frame-native and authored in `cqw` — from `display-head` (4.2cqw) up
to `display-hero` (15.5cqw) for a wordmark cover.

- **Legibility floor:** any load-bearing line ≥ **1.4cqw (≈27px@1920)**. Mono chrome at 1.15cqw is colophon only.
- **Fit-to-measure:** a headline's size tracks its line length. Cap the headline block at **≤ 78cqw** and never touch the safe margin. ≤3 words → `display-hero`/`display-xl`; 4–6 words → `display-lg`; 7+ words → `display-head`. Short lines go big; long lines step down.
- **Uppercase + 0.92 line-height on all Archivo Black**, always. Mono carries 0.06–0.14em tracking. Never letter-space Archivo Black beyond the encoded −0.01em; never set body centered.

## Depth & Surface

Zero blur. Two depth devices only:

- **Hard offset shadow** — a solid duplicate offset ≈1.25cqw in X and Y (`box-shadow: 1.25cqw 1.25cqw 0 {colors.orange}, 1.25cqw 1.25cqw 0 0.2cqw {colors.ink}`). **One featured block per frame** (marker, stamp). Diagram stacks may use a 0.95cqw ink-only offset.
- **Color-block contrast** — cream on cream-2, ink on cream, accent on cream. No shadow needed when contrast carries.

**Ceiling:** no blurred shadow, no gradient, no glow, anywhere.

## Shapes

- **Softly rounded 4 corners (NEVER sharp `0px` corners)** on all structural containers:
  - `16px–24px` (`0.85cqw–1.25cqw` @1920) on large motion frames, featured blocks, and B-roll video windows.
  - `12px–16px` (`0.65cqw–0.85cqw` @1920) on text cards, stat cells, badges, comparison tables, and meters.
- **50%** on decorative circles, stamp inner ring, the meta dot.
- **999px** on pill chips.
- **Rotation** only at the fixed brand angles: badge −4deg, stamp −6deg.

## Components

- **frame-chrome** — slide-deck topbar (`01 // SECTION` + pill) and meta footer (`DESCRIPTOR` + `01 • 10` counter). **OMIT on motion videos** (especially `9:16` vertical and narrated videos) so the top and bottom canvas edges stay completely clean and never clash with social UI overlays.
- **stat-cell / step-card** — ink-bordered flat-fill blocks; step sequences end on green.
- **marker-block** — the one hard-shadow featured callout per frame.
- **kicker-block** — inverted ink eyebrow chip; **badge-rotated** — −4deg yellow annotation; **pill-badge** — the lone rounded chip.
- **stamp** — the −6deg closing seal. **comparison-table** — cream-2 ledger with ink head row.
- **decorative-circle** — yellow disc for shape contrast against a green panel.
- **svg-pipeline-machine** — inline `<svg>` mechanical/system pipeline (conveyor belt, scanner gates, processing unit, moving item cards, animated checkmarks, stamp slams) styled with `4px` `#0F0F0F` strokes, flat `{colors.green}`/`{colors.pink}`/`{colors.yellow}`/`{colors.orange}` fills, and hard offset shadows.
- **card-sorter-meter** — interactive card-sorting rig + live animated progress/impact meter (`1/N → K/N` bar fill) where item cards fly through checkpoints into two categorized columns.
- **svg-cross-section** — multi-layer `<svg>` architectural or hardware cut-away diagram (e.g. 3-floor office cross-section with desk lamps lighting up and task cards sliding out, or smartphone/device X-ray anatomy showing battery cells, cooling pipes, and armor layers).
- **svg-dataviz-chart** — code-driven `<svg>` line chart, diverging curves with shaded gap area, or animated bar/radar chart with `stroke-dashoffset` line drawing and hard-shadowed metric brackets (`-19%`, `+240%`).

## Frame Treatments

> Recipe per plate: ground · container · composes · focal · chrome · accent · silence · Fixed/Free · density.
> Authored at 1920×1080 or 1080×1920. Lean centered; vary the anchor; one idea per frame.
> **MANDATORY VISUAL METAPHOR LAW (28 UNIVERSAL ARCHETYPES):** In motion videos, **at least 75%–85% of frames MUST use Code-Driven Illustrated & Interactive Archetypes (`Treatments 7–34` below)** built with `HTML + Inline SVG + CSS + GSAP`. Never chain pure-text frames; every concept, mechanism, comparison, pain point, data breakdown, or documentary narrative beat in the script must be translated into the best-fitting visual metaphor from the 28 universal archetypes below, occupying **50%–65% of the canvas**, with no two consecutive scenes repeating the same visual archetype.

### Universal 28-Archetype Visual Metaphor Taxonomy (Select per Script Beat)

| # | Archetype ID | Trigger in Script / Voiceover | Code-Driven Visual Mechanism (`Inline SVG + CSS + GSAP`) |
|---|---|---|---|
| **7** | `svg-pipeline-machine` | Quy trình, điều kiện lọc, các bước kiểm duyệt, phễu chuyển đổi | Băng tải + cổng quét (`scanner arches`), đường ống van đóng/mở, máy xử lý đóng dấu `ĐẠT ✓` / `LOẠI ✕`. |
| **8** | `card-sorter-meter` | Phân loại danh sách (Ưu/Nhược, AI/Người, Nên/Không), chấm điểm rủi ro/hiệu quả | Xấp thẻ tự bay vào 2 cột hoặc ma trận 2×2, kết hợp thanh đo `Progress Bar` hoặc đồng hồ kim quay (`Radial Gauge / Speedometer`) tăng/giảm động. |
| **9** | `svg-cross-section` | Cấu tạo bên trong sản phẩm/thiết bị, phân tầng tổ chức, tháp nhu cầu | Mặt cắt toà nhà nhiều tầng (có đèn chiếu), tia X-Ray quét linh kiện máy (`clip-path`), hoặc tháp `Pyramid`. |
| **10** | `svg-dataviz-chart` | Số liệu thống kê, tăng trưởng/sụt giảm, thị phần, chấm điểm đa tiêu chí | Biểu đồ đường tự vẽ (`stroke-dashoffset`) & tách nhánh tô vùng chênh lệch, biểu đồ cột đua (`bar race`), biểu đồ mạng nhện 5–6 cạnh (`radar chart`). |
| **11** | `balance-scale-vs` | So sánh 2 đối thủ, cân nhắc Lợi ích vs Chi phí, cú rơi giá / giảm giá sâu | Chiếc cân đĩa cơ học (`balance scale`) nghiêng theo quả cân, sàn đấu chia đôi `VS Split`, hoặc quả tạ kéo giá rơi từ đỉnh xuống đáy kèm thẻ Voucher cắt kéo. |
| **12** | `constellation-flowchart` | Hệ sinh thái, kết nối đa công cụ, sơ đồ tư duy, luồng quyết định (`Nếu A → B`) | Nút trung tâm (`Hub`) phát xung năng lượng truyền qua cáp tới các vệ tinh (`Constellation`), hoặc sơ đồ cây (`Decision Flowchart`) tự vẽ nhánh & bật sáng kết quả. |
| **13** | `ui-cursor-simulator` | Thao tác phần mềm/app, cài đặt máy, gõ lệnh AI (prompt), chỉnh sửa trực tiếp | Khung giao diện app/điện thoại bo góc nhẹ có con trỏ (`cursor`) tự di chuyển bấm nút, gõ câu lệnh (`typewriter`) và bung ra kết quả hoặc `Code Diff`. |
| **14** | `spatial-timeline-domino` | Lộ trình nâng cấp (OS 15→16→17), các bước sự nghiệp, hiệu ứng dây chuyền | Bậc thang đi lên (`staircase`), trục thời gian cột mốc nảy lần lượt, hoặc chuỗi quân cờ Domino đổ liên hoàn. |
| **15** | `geo-map-radar` | Thị trường địa lý, độ phủ sóng, xuất xứ, chuỗi cung ứng, định vị | Bản đồ vector (`SVG Map`) tô màu vùng, thả ghim (`pins`) nảy số liệu, đường bay nối các điểm (`dashed arc`), hoặc mặt phẳng quét `Radar Sweep` xoay tròn. |
| **16** | `physics-stress-test` | Thông số phần cứng: kháng nước IP68/69, sạc nhanh, dung lượng pin, góc rộng camera, 120Hz | Tia nước bắn vào khiên chắn bật ngược ra (`IP69`), viên pin bơm đầy vạch năng lượng xanh + tia sét, chùm tia góc chụp camera mở rộng `75° → 100°` (`SVG wedge`). |
| **17** | `overwhelm-to-clarity` | Nỗi đau quá tải thông tin/công việc, rối rắm chưa có giải pháp → dọn sạch tối giản | Hàng chục thẻ cảnh báo/icon vây kín giữa màn hình rồi bị đẩy văng ra ngoài (`clutter shove`), hoặc cuộn dây rối (`tangled paths`) kéo căng thành 1 đường thẳng. |
| **18** | `evidence-clipping-receipt` | Trích dẫn báo chí, nghiên cứu khoa học, bình luận người dùng (MXH), hoá đơn chi phí | Mảnh báo/nghiên cứu ghim nghiêng bo góc nhẹ có bút dạ quang (`marker highlight`) tô đậm, hoặc tờ hoá đơn dài (`receipt`) cộng tổng tiền. |
| **19** | `spatial-pan-stations` | Chuỗi cung ứng toàn cầu, hành trình lịch sử dài nhiều chặng, liên kết đa mắt xích | Mặt phẳng đại cảnh lớn gấp 3–4× màn hình gồm nhiều trạm nối với nhau; camera ảo trượt ngang/chéo từ trạm A → B → C đồng bộ theo lời đọc. |
| **20** | `zoom-out-workspace-reveal` | Mở đầu gây tò mò từ chi tiết nhỏ rồi lật mở quy mô đế chế/hệ sinh thái khổng lồ | Mở đầu cận cảnh cực sát vào 1 linh kiện/con số/cửa hàng nhỏ, sau đó camera kéo lùi (zoom-out) mượt mà lộ ra nó chỉ là 1 góc nhỏ trong bức tranh toàn cảnh lớn. |
| **21** | `transcript-scroll-artifact-reveal` | Bằng chứng pháp lý, điều khoản chữ nhỏ người dùng hay bỏ qua, danh sách dài hàng chục mục | Cuộn dọc qua một văn bản/báo cáo/hợp đồng dài rồi phanh gấp, phóng to (`pop-out`) kèm vệt dạ quang đúng dòng chữ/con số quyết định. |
| **22** | `funnel-sankey-flow` | Cơ cấu giá thành, dòng tiền doanh thu → chi phí → lợi nhuận, tỷ lệ đào thải qua từng vòng | Dòng hạt đổ vào miệng phễu lớn bị chặn qua từng tầng lọc thu hẹp, hoặc sơ đồ Sankey tách nhánh dòng tiền to/nhỏ khác nhau chảy về từng hạng mục. |
| **23** | `waffle-grid-proportion` | Thị phần, tỷ lệ người dùng, xác suất thống kê trực quan thay cho biểu đồ tròn | Mạng lưới `10×10` (`100` ô vuông/icon bo góc nhẹ) tự động quét sóng đổi màu đúng theo phần trăm (VD: 82 ô Cam `#E85A1F`, 18 ô Xám). |
| **24** | `odometer-slot-ticker` | Khối tài sản tăng vọt, khoản lỗ kỷ lục, đếm ngược năm lịch sử, giá bán chốt cuối | Các bánh xe chữ số cuộn dọc tốc độ cao như công-tơ-mét/bảng điện tử chứng khoán trước khi khớp lệnh dừng khựng lại kèm rung nhẹ. |
| **25** | `iceberg-surface-vs-depth` | Bóc tách sự thật ẩn sau bề nổi hào nhoáng, chi phí ẩn, quyền lực ngầm | Mặt cắt ngang mặt nước: phần nổi nhỏ phía trên hiển thị quảng cáo/bề nổi, camera trượt xuống dưới mặt nước lộ khối băng khổng lồ chứa sự thật ngầm. |
| **26** | `split-wipe-loupe` | So sánh 2 thế hệ sản phẩm, đối chiếu Quảng cáo vs. Thực tế, soi chi tiết siêu nhỏ | Một thanh gạt dọc quét qua lại trên khung hình (hoặc thấu kính lúp tròn di chuyển), ngăn đôi phần Thế hệ cũ/Quảng cáo và Thế hệ mới/Thực tế. |
| **27** | `exploded-layer-stack` | Giải phẫu phần cứng smartphone/laptop/bán dẫn, cấu trúc kiến trúc phần mềm đa lớp | Thân máy/khối hệ thống tách rời thành 3–4 lớp xếp chồng chéo (Kính → Màn hình → Chip → Pin) kèm đường chỉ dẫn (`leader lines`) ghim nhãn thông số từng lớp. |
| **28** | `panel-edit-live-sync` | Mối quan hệ nhân quả trực tiếp ("Tăng thông số A thì B thay đổi ngay thế nào?") | Thanh trượt thông số bên trái kéo thay đổi giá trị (nhiệt độ, xung nhịp, ngân sách) làm biểu đồ/hình ảnh sản phẩm bên phải biến đổi trạng thái tức thì. |
| **29** | `ticker-takeover-collision` | Cú Twist lật ngược vấn đề, Hook gây sốc, ra mắt sản phẩm "kẻ huỷ diệt phân khúc" | Các thẻ suy đoán đang xếp ở giữa bỗng bị khối nhân vật chính/câu trả lời lao mạnh từ cạnh màn hình vào **húc văng** sang một bên và độc chiếm trung tâm. |
| **30** | `detective-evidence-board` | Phóng sự điều tra, thương vụ ngầm, gia tộc tài phiệt, cuộc chiến pháp lý (Mẫu 5 Documentary) | Các tấm thẻ ảnh nhân vật, công ty, địa điểm ghim lên bảng, sau đó các sợi dây đỏ/mũi tên SVG tự động vẽ nối A → B → C kèm nhãn mối quan hệ. |
| **31** | `character-dossier-card` | Giới thiệu nhân vật lịch sử, CEO, "hồ sơ năng lực" của một dòng máy | Tập hồ sơ mở ra với khung ảnh bo góc nhẹ, mốc năm, 3–4 thanh chỉ số đặc trưng và con dấu đóng mạnh xuống góc thẻ (`NHÀ SÁNG LẬP`, `KẺ THÁCH THỨC`). |
| **32** | `acquisition-tree-merge` | Lịch sử mở rộng đế chế, mua bán sáp nhập (M&A), phân nhánh dòng sản phẩm | Sơ đồ phân nhánh từ 1 công ty gốc ra các nhánh con, hoặc các thẻ công ty nhỏ bị kéo hút hợp nhất vào một khối tập đoàn mẹ lớn ở trung tâm. |
| **33** | `fixed-anchor-cycle` | Thông điệp "Mọi thứ đều đổi thay, chỉ có 1 giá trị/thương hiệu cốt lõi đứng vững" | Một thẻ/biểu tượng duy nhất đứng bất động ở tâm màn hình trong suốt cả cảnh, trong khi bối cảnh thời gian hoặc đối thủ xoay vòng đổi liên tục xung quanh. |
| **34** | `chat-debate-thread` | Giải đáp thắc mắc người xem, tái hiện cuộc tranh luận 2 luồng quan điểm trái chiều | Các khung bong bóng tin nhắn bo góc nhẹ nảy lên luân phiên bên trái và bên phải như cuộc đối đáp trực tiếp (Người dùng hỏi ↔ Chuyên gia, Phe khen ↔ Phe chê). |

### 1 · Wordmark Cover (identity · move: full-frame lockup · centered)

**Ground** `{colors.cream}`, `frame-pad`. **Container** grid, focal centered with an accompanying hero `<svg>` emblem/device/machine illustration.
**Composes** kicker-block, the wordmark, hero SVG illustration. **Focal** the two-line wordmark at `display-hero`
(15.5cqw), centered, second line in an accent (`{colors.pink}`/`orange`), paired with a bold ink-stroked SVG visual icon/rig. **Accent** the second-line color + SVG accent fill. **Fixed** Archivo Black / Be Vietnam Pro uppercase, one accent on the wordmark, softly rounded 4 corners (`16px–24px`), `4px` ink borders.

### 2 · Big Claim (oversized statement · move: scale · left)

**Ground** one full-bleed accent (`{colors.pink}`/`green`/`orange`), `content-gutter`. **Container**
flex, claim left-anchored and vertically centered. **Composes** kicker-block, the claim. **Focal**
a 2–3 line claim at `display-xl`/`display-lg`, ink on the accent (ink-on-fire — never white).
**Chrome** small ink kicker-block above the claim. **Accent** the ground IS the
accent; no second accent competes. **Fixed** ink type on accent, fit-to-measure sizing, no shadow on type.

### 3 · Stat Grid (catalog · move: density — the one dense frame · centered)

**Ground** `{colors.cream}`, `content-gutter`. **Container** grid: a centered `display-head` over a
3-up row of stat-cells with animated SVG mini-gauges / icons inside each cell. **Composes** 3× stat-cell. **Focal** the row of three
ink-bordered cells (green / pink / orange), each a `stat-num` + mono label + animated SVG vector graphic.

### 4 · Closing Plate (closer · move: ground-swap · centered)

**Ground** `{colors.green-dark}` (`#136636`, the single green frame of the run), `frame-pad`. **Focal** a 2-line
sign-off at `display-lg` in `{colors.cream}`, centered. **Composes** stamp, summary SVG badge. **Accent** one `{colors.pink}` or `{colors.yellow}` stamp rotated −6deg in a corner.

### 5 · Featured Marker (callout · move: hard-shadow focal · left/asymmetric)

**Ground** `{colors.cream}`. **Composes** marker-block, illustrated SVG visual proof beside/above it.
**Focal** the pink marker-block with the signature orange+ink hard offset shadow, paired with a concrete SVG visual metaphor.

### 6 · Comparison Ledger (data · move: matrix · left)

**Ground** `{colors.cream}`, `content-gutter`. **Composes** comparison-table.
**Focal** the cream-2 table with ink head row; one column fill (pink or green) marks the winner with animated SVG check/cross stamps.

### 7 · Interactive Pipeline & Scanner Rig (`svg-pipeline-machine` · move: mechanical pose-ladder · center)

**Ground** `{colors.cream}`. **Composes** kicker-block, headline, `svg-pipeline-machine`, bottom callout banner.
**Focal** a full-width inline `<svg>` conveyor belt or processing pipeline (occupying 55%–65% of canvas) with 2–3 checkpoint arches/stations (each topped with a circular icon badge: monitor, loop arrows, checkbox, shield, chip) leading into a dark `#0F0F0F` processing machine with glowing `#1F8A4C` or `#F5C518` eyes and a rotating gear.
**Choreography** Item cards (e.g., an invoice card, a task ticket, a phone unit) travel along the conveyor track via GSAP `x`/`y` keyframes, pausing briefly at each station as the arch lights up (`#1F8A4C` green for pass, `#E85A1F` orange/red for fail), checkboxes tick (`scale: 0 → 1, ease: "back.out(2)"`), and a final stamp (`XONG ✓` or `KHÔNG ✕`) slams down (`scale: 2.2 → 1, rotation: -6`).

### 8 · Live Card Sorter & Impact Meter (`card-sorter-meter` · move: card-morph + stat-bar fill · split)

**Ground** `{colors.cream}`. **Composes** category meter card (left/top), checkpoint gates (center), 2 sorted columns (right/bottom: e.g. `{colors.green}` `AI LÀM ĐƯỢC` / `ĐẠT CHUẨN` vs `{colors.cream-2}` `VẪN CẦN NGƯỜI` / `ĐỐI THỦ`).
**Focal** A stack of 4–7 item cards deals out one by one through the central filter gates and sorts into the two columns via GSAP `x`/`y`/`rotation` tweens, while the category card's impact progress bar (`MỨC DỄ BỊ ẢNH HƯỞNG` / `ĐIỂM VƯỢT TRỘI`) dynamically fills (`scaleX` / `width` in `#E85A1F` or `#1F8A4C`) and increments its counter (`1/7 → 4/7`).

### 9 · Multi-Layer SVG Cross-Section / X-Ray (`svg-cross-section` · move: sequential spotlight + layer reveal · center)

**Ground** `{colors.cream}`. **Composes** kicker-block, headline, `svg-cross-section` (occupying 60% of canvas).
**Focal** A detailed inline `<svg>` cut-away cross-section with `4px` `#0F0F0F` structural walls:
- *Scenario A (Organization / Workflow)*: A 3-floor building cross-section (`Senior`, `Có kinh nghiệm`, `Người mới vào nghề`) with desks, chairs, computer monitors with progress bars, and overhead desk lamps that cast warm yellow (`#F5C518` at `0.35` opacity) triangular spotlight cones turning on sequentially; task cards slide out of the bottom floor into an AI processor.
- *Scenario B (Hardware / Product Tech)*: An X-ray cross-section of a device showing internal battery cells filling with `#1F8A4C` energy, cooling pipes with moving particles, and protective armor shields deflecting impact arrows.

### 10 · Animated SVG Data-Viz & Diverging Chart (`svg-dataviz-chart` · move: stroke-draw + area reveal + bracket slam · center)

**Ground** `{colors.cream}`. **Composes** kicker-block, headline, optional pinned source card (`badge-rotated`), `svg-dataviz-chart`.
**Focal** A large `<svg>` chart (`viewBox="0 0 1200 600"`) with `4px` `#0F0F0F` axes, `JetBrains Mono` axis labels (`2021..2026`), a dashed vertical milestone line, and 1–2 data curves drawn progressively from left to right via GSAP `stroke-dashoffset`. When two curves diverge (e.g. baseline in `#2A2A2A` vs impacted curve in `#1F8A4C` or `#E85A1F`), a shaded polygon fill (`#F06CA8` or `#E85A1F` at `0.25` opacity) fades in between them, followed by a vertical bracket on the right and an oversized `stat-num` callout (`-19%`, `+240%`) slamming in with a hard offset shadow.

## Composition Rules

### Do

- Compose around **one visual metaphor per frame**, where the **code-authored `<svg>` illustration, interactive diagram, or chart occupies 50%–65% of the frame**.
- Use **75%–85% Illustrated Treatments (Treatments 7–34)** across every video so the viewer watches living mechanisms, moving vectors, sorting cards, cross-sections, investigative boards, and self-drawing charts — never a wall of text boxes.
- Style every SVG illustration and container in authentic `creative-mode` Neo-Brutalism with **softly rounded 4 corners (`16px–24px` large frames / video windows, `12px–16px` cards / badges, `999px` pills — never sharp `0px`)**, crisp `4px` (`#0F0F0F`) strokes, flat fills from the approved palette (`cream`, `cream-2`, `green`, `pink`, `orange`, `yellow`), and hard offset drop shadows (`filter: drop-shadow(8px 8px 0 #0F0F0F)`).
- Use **two or three accents per frame**; reserve `{colors.green-dark}` full-bleed ground for the closing plate.
- Spend the featured orange+ink hard offset shadow on **one hero callout or card per frame** (structural SVG elements may use ink-only hard offset shadows).
- Size headlines **fit-to-measure**; keep text concise so the SVG illustration is the star.

### Don't

- **Never build a "text-only slide deck" video.** Do not chain text-only cards without an accompanying moving `<svg>` diagram, vector mechanism, or chart.
- Don't use generic floating bokeh or soft SaaS gradients; keep all SVG graphics crisp, geometric, and Neo-Brutalist (`#0F0F0F` ink strokes + flat fills).
- Don't set Archivo Black in sentence case or letter-space it beyond −0.01em.
- Don't use all four accents on one frame, a fifth accent, or pure white.
- Don't center long body paragraphs; prefer short labels attached directly to diagram nodes.

## Aspect-Ratio Behavior

| Treatment         | 16:9                            | 9:16                         | 1:1                      |
| ----------------- | ------------------------------- | ---------------------------- | ------------------------ |
| Wordmark Cover    | two lines + SVG hero centered   | stacked taller, SVG center   | centered, tighter        |
| Big Claim         | claim left, SVG icon right      | claim top, SVG below         | claim centered           |
| Stat Grid         | head over 3-up row w/ SVG icons | head top, 3 stacked w/ icons | head top, 2×2 (4th cell) |
| Closing Plate     | sign-off centered, stamp corner | stacked, stamp below         | centered, stamp corner   |
| Featured Marker   | marker + SVG visual asymmetric  | marker bottom, SVG top       | marker + SVG stacked     |
| Comparison Ledger | full-width table w/ SVG stamps  | 2-col table w/ SVG stamps    | 2-col table              |
| Pipeline & Rig    | horizontal conveyor + 3 arches  | vertical/2-tier conveyor     | compact 3-arch conveyor  |
| Card Sorter       | meter left, gates mid, 2 cols R | meter top, 2 cols side-by-side below | meter top, 2 cols below |
| SVG Cross-Section | wide 3-floor / device cut-away  | tall 3-floor / vertical X-ray| square 3-floor cut-away  |
| SVG Data-Viz Chart| wide 16:9 chart + right bracket | tall chart + bottom callout  | square chart + R bracket |

Safe area holds the `3.3cqw` chrome inset on the short edge for every ratio; re-step display per
ratio so no load-bearing line drops below the 1.4cqw floor.

## Approved Entities

No real customers, logos, or vendors are defined in the source — render any such mark as a
placeholder. Products/sections are content-agnostic; the system supplies geometry, not brands.

## Numerals & Claims (hard rule)

Never invent figures, percentages, counts, or dates at frame scale. Render data slots as
`— figure —`, `{metric}`, `N×`. Real numerals appear only when the script supplies them — the stat
grid and ledger especially carry placeholders, not fabricated values.

## Pre-Render Self-Audit

- **Visual Metaphor Ratio** — at least 75%–85% of frames feature a rich code-authored `<svg>` diagram, pipeline rig, card sorter, cross-section, investigative board, or data chart (`Treatments 7–34`) occupying 50%–65% of the canvas.
- **Squint** — the hero SVG illustration or primary figure dominates at 3–5× its neighbor.
- **Accents** — two or three per frame, never all four; green ground only on the closer.
- **Depth** — hard offset shadows (`#0F0F0F` or `#E85A1F` + `#0F0F0F`); color-block contrast otherwise.
- **Geometry** — bold `4px` `#0F0F0F` strokes and **softly rounded 4 corners (`16px–24px` / `12px–16px` / `999px`)** on all cards, video frames, and SVG containers (never `0px`); rotation at −4/−6deg for stamps/badges.
- **Type** — Be Vietnam Pro / Archivo Black uppercase (`1.14` lh for Vietnamese), fit-to-measure, ≥1.4cqw on load-bearing lines.
- **Fabrication** — every numeral traces to the script, else placeholder.

## Known Gaps

- **Archivo Black requires Google Fonts**; pair with `Be Vietnam Pro` (`weight: 900`) for Vietnamese diacritics.
- **9:16 / 1:1 are guidance**, not pixel-locked; verify the legibility floor per ratio.
- All illustrations, mechanical pipelines, cross-sections, and charts are authored 100% in code (`Inline SVG + HTML/CSS + GSAP`); no external raster stock imagery is required unless supplied by the user.

## Production Guardrails (Vietnamese, Contrast & Video Canvas)

- **No Slide-Deck Topbar / Footer Chrome on Videos:** Never render `.cm-topbar` (`01 // SECTION` + brand pill) or `.cm-footer` (`DESCRIPTOR` + `01 • 10` page counter) on motion videos. Those artifacts belong only to static slide decks and clutter the top and bottom of video frames.
- **Vietnamese Uppercase Display Line-Height:** When rendering uppercase Vietnamese text with stacked diacritics (`Ể`, `Ẳ`, `Ấ`, `Ữ`, `Ộ`, `Ệ`), use `Be Vietnam Pro` (`weight: 900`) or `Space Grotesk` (`weight: 700`) with `line-height: 1.12 – 1.18` (never `0.90–0.96`, which causes stacked accents to collide with adjacent lines).
- **No Regional-Indicator Flag Emojis on Windows Headless Chromium:** Never use `🇻🇳` or other flag emojis in HTML text (Chromium on Windows renders them as monochrome two-letter codes `VN`). Always use an inline `<svg>` vector flag/badge.
- **WCAG AA Contrast on `#1F8A4C` Green:** `#EFE9D9` cream text on `#1F8A4C` green has a `3.61:1` contrast ratio — valid for large display text (`>= 24px` bold), but **fails WCAG AA (`4.5:1`) for small mono labels (`< 24px`)**. Wrap small mono labels on green cards inside an `#0F0F0F` ink pill (`color: #EFE9D9`, `16.4:1`), and use `{colors.green-dark}` (`#136636`, `5.86:1`) for full-bleed green closing plates.
