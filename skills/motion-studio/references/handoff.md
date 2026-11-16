# The hand-off to HyperFrames

One request that carries the style and every answer, so HyperFrames' interview (`hyperframes` →
`references/intent-interview.md`) skips what's settled and goes to its brief summary. It skips a question only when
the request already answered it, so say each answer plainly. Leave out a line the user didn't answer; HyperFrames
will ask it.

```
Make a new video (fresh creation) with HyperFrames.

What it is: <a 25-second promo for ...: the subject in one sentence>
The one message: "<the line the video must land>"
Offer / numbers: <price, dates, figures, exactly as the user gave them; "none">
Who watches and where: <audience>; plays on <destination>, so aspect <1920x1080 | 1080x1920 | 1080x1080 | 1080x1350>
Length: <N>s
Words on screen in: <language code and name, e.g. vi (Vietnamese)>
Talk to me in: Vietnamese (every question, the brief summary, progress and the Studio tips; the words on screen stay
in the language above, quoted as they will appear)
Material: <paths of the logo, photos, screenshots, data; or "none: invent the visuals">
Website: <URL to capture | "none" | "don't capture">

Design spec: they have one, at <path to FRAME.md>. Adopt it as frame.md at the project root after init, and treat
it as brand truth. <If it came from a reference: "Made from <reference>; what the user likes: <their sentence>.">
(or) Design spec: none; pick a look that fits, or show the design picker.

Editable copy: make every word, number, colour and picture I might change a composition variable (data-var-text,
var(--id), or built from getVariables() for animated text), so each is one field in Studio's Variables panel:
<list them: the headline, the price, the product name, the web address, the accent colour, the logo>.
Give each variable a Vietnamese label, since Studio shows it: "Tiêu đề", "Giá", "Tên sản phẩm", "Màu nhấn".

Run shape: flow automation, storyboard <yes | no>.
Ask only what this leaves open, then show me the brief summary to confirm before building.
```

Notes:

- **Variables** are what make the video editable like Claude Motion's Tweaks (retype the price, the video changes) and
  what a spreadsheet batch fills in. Name them in plain ids (`headline`, `price`, `cta_url`) with Vietnamese labels;
  a batch column can use either.
- **Music:** HyperFrames' music needs a HeyGen sign-in; without one the video has no sound. Say nothing about music
  here; after the build, `music.mjs` makes a bed and HyperFrames places it.
- **Website capture:** if the user gave a site, HyperFrames captures it and remixes the site's colours and fonts onto
  the preset's layout. When they picked a look on purpose, add "keep the picked look's colours unless the brand's
  are needed" or "use the brand's colours on this layout", whichever they said.
- **Storyboard:** `yes` shows stills of each scene before the full build; `no` builds straight from the confirmed
  brief. Anything beyond a couple of scenes is better with `yes`.
- **Companion:** if the user wants to build it step by step with Claude rather than run a workflow, say
  `flow companion` instead of `automation`.
- **Talk to me in** is the chat's language, set by this skill: Vietnamese. HyperFrames' interview and summary are
  written in English; they still reach the user in Vietnamese. It never changes the words on screen.
- **Language:** with non-Latin or accented text (Vietnamese, for one), HyperFrames swaps fonts that can't set it.
  Check the first stills for missing marks anyway.

## Quy chuẩn bắt buộc rút ra từ thực tế (Production Guardrails)

Khi truyền brief hoặc trực tiếp dựng cảnh trong HyperFrames, **bắt buộc** tuân thủ 6 quy chuẩn dưới đây để không lặp lại lỗi:

1. **Tuyệt đối không vẽ thanh Header / Footer kiểu slide (`01 // SECTION`, `01 • 10`) ở mép trên và dưới video:**
   - Các thành phần `frame-chrome` (`.cm-topbar` có số thứ tự mục + pill tên thương hiệu ở trên cùng, và `.cm-footer` có dòng mô tả + bộ đếm trang `01 • 10` ở dưới cùng) là tàn dư của slide thuyết trình.
   - Trên khung hình video (đặc biệt là `9:16` dọc hoặc video minh hoạ có lời thoại), **bỏ hoàn toàn topbar và footer** để giữ khoảng thở thoáng đãng ở 2 đầu trên/dưới và không đụng UI của TikTok/Reels/Shorts.
2. **Đồng bộ 100% tốc độ animation & điểm cắt cảnh theo từng câu, từng cụm từ giọng đọc (Voiceover-Locked Progressive Choreography):**
   - **Cắt cảnh (`data-start` / `data-duration`):** Phải nghe trực tiếp file giọng đọc (dùng thước đo âm thanh `0.25s / 0.5s / 1.0s` nếu cần) và đặt ranh giới cảnh khớp chính xác (`±0.05s`) vào nhịp nghỉ kết thúc câu nói. Tuyệt đối không cắt cảnh giữa chừng khi người nói chưa dứt câu.
   - **Không dồn toàn bộ phần tử xuất hiện ở `0.0s–1.4s` đầu cảnh:** Trong video có voiceover, nếu cho toàn bộ tiêu đề, thẻ, bảng xuất hiện hết ngay giây đầu tiên thì phần còn lại của cảnh (`5–10s`) sẽ đứng im nhàm chán và lệch nhịp nói. Phải tách từng dòng tiêu đề, từng vế câu hỏi/trả lời, từng thẻ bước (`01 → 02 → 03`), từng hàng bảng so sánh, từng con dấu kết cảnh để mỗi phần tử chỉ xuất hiện **đúng khoảnh khắc người nói đọc tới từ/ý đó** (không bao giờ để đáp án hiện ra trước khi câu hỏi tu từ kết thúc).
   - **Tốc độ tween mượt mà, có trọng lượng (`0.48s–0.60s`):** Dùng thời lượng `0.48s–0.60s` với các hàm giảm tốc tự nhiên (`power3.out`, `back.out(1.25)`, `circ.out`, `power2.out`) thay vì `0.32s–0.36s expo.out` (vốn giật 85% quãng đường trong `0.10s` đầu khiến chữ/thẻ trông như bật ra cùng lúc). Chỉ dùng `power4.out` (`0.48s–0.52s`) cho cú đóng dấu (`stamp`/`badge`).
3. **Hiệu ứng âm thanh (SFX) khớp 1:1 theo từng chuyển động và không lấn át giọng nói:**
   - Không dùng tiếng gió white-noise tổng hợp (`swish`/`exitSwish` trong `sound.js`) dưới giọng nói vì nghe giống tiếng xì nhiễu nền.
   - Kết hợp các sample thật đã cắt khoảng lặng đầu (`pop.mp3`, `whoosh-short.mp3`, `click-soft.mp3`, `key-press.mp3`, `ping.mp3`, `chime.mp3`, `notification.mp3` trong `media-use/audio/assets/sfx`) với tiếng trống trầm `thump` (`sound.js`, lưu ý gọi `wav([oL, oR])` với mảng 2 kênh).
   - Khóa chính xác mốc thời gian từng tiếng SFX (`±0.01s`) theo đúng mốc `tl.fromTo(...)` của từng phần tử trên màn hình, chuẩn hoá biên độ mềm (`tanh` ở `-1.5 dBFS`) và đặt trên track riêng với `data-volume="0.38"` để rõ ràng nhưng luôn nằm êm dưới giọng đọc chính (`data-volume="1.0"`).
4. **Typography tiếng Việt có dấu tầng & Cờ SVG trên Windows Chromium:**
   - Khi viết hoa toàn bộ (`text-transform: uppercase`) tiếng Việt có dấu chồng (`Ể`, `Ẳ`, `Ấ`, `Ữ`, `Ộ`, `Ệ`), dùng font hỗ trợ đầy đủ dấu tiếng Việt (`Be Vietnam Pro` 800/900 hoặc `Space Grotesk` 700) và đặt `line-height: 1.12 – 1.18` (tuyệt đối không dùng `0.90–0.96` của tiếng Anh vì dấu mũ + dấu hỏi/sắc sẽ đè lên dòng trên).
   - Không dùng emoji cờ (`🇻🇳`) trên Windows Headless Chromium vì sẽ bị hiển thị thành chữ `VN` đen trắng; luôn vẽ bằng `<svg>` inline.
5. **Đảm bảo độ tương phản WCAG AA (`4.5:1`) trên nền xanh lá `#1F8A4C`:**
   - Chữ kem `#EFE9D9` trên nền xanh `#1F8A4C` chỉ đạt `3.61:1` (đạt chuẩn cho chữ lớn `>= 24px` đậm, nhưng **trượt WCAG AA `4.5:1`** với nhãn mono nhỏ `< 24px`).
   - Bắt buộc bọc các nhãn mono nhỏ trên thẻ xanh trong pill nền đen `#0F0F0F` (`color: #EFE9D9`, tương phản `16.4:1`), và dùng `#136636` (`green-dark`, tương phản `5.86:1`) cho nền toàn khung của cảnh kết (`Closing Plate`).
6. **Quy chuẩn Sub-Composition StaticGuard & Chống tràn khung (`container_overflow`):**
   - File `index.html` gốc phải có thẻ `<script src=".../gsap.min.js"></script>` và mỗi `.scene-slot` phải có đủ cả `data-composition-id` lẫn `data-composition-src`.
   - Khi nhúng `<video data-start="0">` bên trong sub-composition, đặt `<video>` trong một thẻ bọc `.cm-browser` không gắn `data-start` và chỉ animate thẻ bọc `#sX-browser` để tránh xung đột với lifecycle của video.
   - Các nhãn/con dấu xoay (`rotate(-4deg)` / `rotate(-6deg)`) nằm trong khung `.cm-video-viewport` (`overflow: hidden`) phải đặt cách mép tối thiểu `52px` (`bottom: 52px; right: 52px`) và `scale` xuất hiện `<= 1.28` để không bị cảnh báo `container_overflow` ở những frame đầu.
