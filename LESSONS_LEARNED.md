# Tổng Hợp Lỗi & Kinh Nghiệm Thực Chiến — `motion-video-demo`

Tài liệu này lưu trữ toàn bộ các lỗi kỹ thuật, giới hạn thiết kế và giải pháp chuẩn đã đúc kết qua các dự án thực chiến trong workspace `f:\App nha lam\motion-video-demo`:
- `videos/viesnap-demo` & `videos/viesnap-illustrated` (Video 9:16 giới thiệu ứng dụng VieSnap)
- `videos/iphone-duo-quan-diem` & `videos/iphone-duo-review-5m` (Video 16:9 4K dài 8p46s & 29p04s phân tích iPhone Duo)
- `videos/oppo-a7-pro` (Video 16:9 dài 10p52s đánh giá OPPO A7 Pro 5G)
- `videos/ai-3-cau-hoi` (Video 16:9 minh hoạ động 100% bằng SVG + GSAP)
- `videos/samsung-documentary` & `videos/samsung-documentary-9x16` (Video Documentary dài 18p33.7s @ 60fps bản ngang `16:9` & bản dọc `9:16`)

---

## 1. Thiết Kế Thị Giác & Phong Cách (`Creative Mode` & Minh Hoạ Động)

| Vấn đề / Lỗi gặp phải | Nguyên nhân gốc rễ | Giải pháp chuẩn đã áp dụng |
| :--- | :--- | :--- |
| **1.1. Video chỉ toàn hộp chữ tĩnh, thiếu sinh động** | File gốc `creative-mode/FRAME.md` ban đầu được viết cho *poster chữ* (chỉ có 6 mẫu hộp chữ và ghi chú *"Decorative geometry is CSS-only"*), khiến AI chỉ đóng khung văn bản. | Đã nâng cấp trực tiếp `FRAME.md` với **Luật Bắt Buộc Minh Hoạ Động (75%–85% số cảnh)** và **Từ điển 12 Nhóm Ẩn Dụ Thị Giác (`Treatments 7–18`)** dựng bằng `Inline SVG + CSS + GSAP` (băng tải/phễu lọc, phân loại thẻ & đồng hồ đo, mặt cắt X-Ray, biểu đồ tự vẽ, bàn cân đối đầu, mạng lưới Hub, mô phỏng UI/Cursor, dòng thời gian/Domino, bản đồ/Radar, thử nghiệm vật lý IP69/Pin, quá tải→dọn sạch, trích dẫn báo chí/hoá đơn). |
| **1.2. Dính thanh Header/Footer kiểu Slide (`.cm-topbar`, `.cm-footer`)** | Preset gốc có thanh `01 // SECTION` ở đỉnh và số trang `01 • 10` ở đáy làm rối khung hình video và đè lên giao diện TikTok/Reels/YouTube. | **Cấm tuyệt đối** vẽ `.cm-topbar` và `.cm-footer` trên mọi video chuyển động; giữ vùng biên trên/dưới thoáng sạch. |
| **1.3. Chữ tiếng Việt in hoa bị dính dấu (`Ể, Ẳ, Ấ, Ữ, Ộ, Ệ`)** | Font `Archivo Black` với `line-height: 0.90–0.96` làm dấu mũ chồng dấu hỏi/ngã của tiếng Việt va vào dòng trên. | Dùng `Be Vietnam Pro` (`weight: 900`) kết hợp `line-height: 1.12 – 1.18` cho toàn bộ tiêu đề tiếng Việt in hoa. |
| **1.4. Emoji cờ Việt Nam (`🇻🇳`) bị biến thành chữ `VN` đen trắng** | Trình duyệt Headless Chromium trên Windows không có font màu cho Regional-Indicator Flag Emojis. | **Không bao giờ dùng emoji cờ trong HTML**; luôn vẽ bằng thẻ `<svg>` inline. |
| **1.5. Lỗi tương phản WCAG AA (`< 4.5:1` cho chữ nhỏ, `< 3.0:1` cho chữ lớn)** | • Chữ kem `#EFE9D9` trên nền xanh `#1F8A4C` chỉ đạt `3.61:1` (báo lỗi với chữ `< 24px`).<br>• Chữ cam `#E85A1F` trên nền kem `#EFE9D9` chỉ đạt `2.93:1` (thiếu `0.07` để đạt chuẩn `3.0:1`). | • Với ô tick/nhãn nhỏ màu xanh: dùng xanh đậm `#136636` (`5.86:1`) hoặc bọc chữ trong pill mực đen `#0F0F0F` (`16.4:1`).<br>• Với số/chữ màu cam trên nền kem: dùng mã cam đậm `#B83B0B` (`> 4.2:1`) hoặc chữ đen `#0F0F0F` trên nền vàng `#F5C518`. |

---

## 2. Kỹ Thuật Code GSAP, SVG & Kiểm Tra Tự Động (`hyperframes check`)

| Vấn đề / Lỗi gặp phải | Nguyên nhân gốc rễ | Giải pháp chuẩn đã áp dụng |
| :--- | :--- | :--- |
| **2.1. Lỗi `gsap_css_transform_conflict` khi chạy `hyperframes check`** | Đặt `transform: scaleX(0)` hoặc `translate(-50%, -50%)` trong CSS trên cùng phần tử được GSAP animate bằng `tl.to()`, làm GSAP ghi đè mất CSS transform ban đầu. | Bỏ `transform` khỏi CSS trên phần tử chuyển động; khởi tạo trạng thái đầu bằng `tl.set(el, { scaleX: 0 }, 0)` hoặc dùng `tl.fromTo()` (được miễn trừ). |
| **2.2. Lỗi `content_overlap` / `text_occluded` khi xếp chồng xấp thẻ bài** | Bộ kiểm tra bố cục của HyperFrames báo lỗi khi 7 thẻ công việc xếp chồng lên nhau thành một xấp bài (card deck) trước khi chia vào 2 cột. | Gắn thuộc tính `data-layout-allow-overlap` và `data-layout-allow-occlusion` trực tiếp lên các thẻ bài và phần tử chữ bên trong xấp bài có chủ đích xếp chồng. |
| **2.3. Chuyển động bị tĩnh ở nửa cuối cảnh (Front-loading / Hiệu ứng PowerPoint)** | Toàn bộ phần tử xuất hiện hết trong 25% thời gian đầu rồi đứng yên suốt phần còn lại của cảnh. | Chia mỗi cảnh thành chuỗi **Time-Coded Shot Sequence** khớp từng giây với câu thoại (`voiceover`): nói đến đâu mới vẽ đường biểu đồ, chạy thẻ qua cổng, hoặc bật đèn đến đó. |
| **2.4. Mất chữ sửa trên Studio khi xuất video** | Khi sửa chữ trên Canvas của Studio 0.8.181, thay đổi lưu vào `scene-XX.html` nhưng lúc render lại lấy giá trị `default` trong `data-composition-variables` ở `index.html`. | Luôn chạy `node .../sync-text.mjs videos/<ten-project>` trước khi render để đồng bộ hai chiều giữa Canvas và Variables. |

---

## 3. Bố Cục Video Dài (A-Roll + B-Roll + Full Motion) & Âm Thanh (SFX)

| Vấn đề / Lỗi gặp phải | Nguyên nhân gốc rễ | Giải pháp chuẩn đã áp dụng |
| :--- | :--- | :--- |
| **3.1. Thẻ đồ hoạ đè lên mặt người nói, sản phẩm trên tay hoặc bảng Voucher có sẵn** | Đặt thẻ ở giữa màn hình hoặc chèn motion vào cả những đoạn video gốc đã có chữ/bảng giá/intro/outro. | Áp dụng **Kiến trúc 4 Chế độ Hiển thị**:<br>1. **A-roll + Card Overlay**: Chỉ đặt thẻ ở vùng trống 2 bên cạnh, tránh mặt, tay cầm máy và nhãn góc dưới trái.<br>2. **B-roll + Overlay**: Đặt callout ở góc đối diện thiết bị.<br>3. **100% Full Motion**: Thay toàn bộ hình bằng cảnh đồ hoạ SVG trên nền kem `#EFE9D9` (giữ nguyên tiếng nói) ở các đoạn phân tích sâu.<br>4. **100% Pass-through**: Để trống hoàn toàn ở đoạn Intro, Outro, bảng Voucher Shopee và ảnh/video test camera. |
| **3.2. Tiếng hiệu ứng (SFX) bị trễ nhịp hoặc lấn át giọng đọc** | File SFX gốc có khoảng lặng ở đầu (`leading silence` 100–250ms) và âm lượng mặc định quá to so với giọng nói. | Dùng script DSP (`build-*-sfx.mjs`) tự động cắt bỏ khoảng lặng dưới `-38dB` ở đầu mỗi mẫu âm thanh, tạo `4ms` fade-in chống nổ tiếng, ghép thêm tiếng trống trầm (`thump`) và đặt `data-volume="0.38"` (so với `1.0` của giọng đọc). |

---

## 4. Hạ Tầng Render, Ổ Đĩa Cache & Xử Lý File Video Lớn

| Vấn đề / Lỗi gặp phải | Nguyên nhân gốc rễ | Giải pháp chuẩn đã áp dụng |
| :--- | :--- | :--- |
| **4.1. Đầy ổ `C:` khi tải model AI, trình duyệt hoặc render video 4K dài** | Mặc định Node/NPM/Puppeteer/FFmpeg/HyperFrames lưu cache và frame tạm vào `C:\Users\...\AppData\Local` hoặc `.cache`. | Tuân thủ tuyệt đối **Global Cache Policy**: chuyển toàn bộ biến môi trường (`TEMP`, `TMP`, `XDG_CACHE_HOME`, `PUPPETEER_CACHE_DIR`, `PLAYWRIGHT_BROWSERS_PATH`, `NPM_CONFIG_CACHE`) sang **`D:\cache`**. |
| **4.2. Lỗi `EPERM: operation not permitted, mkdir 'F:\'` khi xuất video** | Truyền đường dẫn gốc ổ đĩa (`--output "F:\video.mp4"`) vào `hyperframes render` khiến hàm `fs.mkdirSync('F:\\')` của Node.js trên Windows bị từ chối quyền. | Luôn xuất vào một thư mục con (ví dụ `renders/ten-video.mp4` hoặc `F:\renders\ten-video.mp4`), sau đó dùng `Copy-Item` chép ra `F:\ten-video.mp4` nếu cần. |
| **4.3. Lỗi tràn bộ nhớ ngữ cảnh (Context Overflow) khi AI đọc trực tiếp file `.mp4` lớn** | Gọi công cụ `read_file` trực tiếp lên file video nặng hàng chục/trăm MB (như `F:\test.mp4` 94MB) làm tràn bộ đệm của phiên làm việc. | **Không bao giờ `read_file` trực tiếp file `.mp4` lớn**; luôn dùng `ffprobe` kiểm tra thông số và dùng `ffmpeg` trích xuất lưới ảnh缩略 (`contact sheet 4x4` có gắn số giây `t=%{eif:t:d}s`) vào `D:\cache` (chỉ ~300KB/ảnh) để xem toàn bộ video nhanh và chính xác. |
| **4.4. Lỗi `Fontconfig error: Cannot load default config file` khi dùng `drawtext` của FFmpeg trên Windows** | Bộ lọc `drawtext` của FFmpeg trên Windows không tự tìm được đường dẫn font mặc định nếu không khai báo `fontfile`. | Khi dùng `drawtext` trên Windows, luôn truyền rõ `fontfile='C\:/Windows/Fonts/consola.ttf'` (hoặc bỏ `drawtext` nếu chỉ cần ghép lưới `tile=4x4`). |
| **4.5. Tối ưu thời gian Render cho video 4K dài (10–30 phút)** | Render 52.320 frames 4K qua trình duyệt tốn nhiều thời gian ở những đoạn không có đồ hoạ (Pass-through). | Trong các dự án siêu dài (`render-4k-30fps-ultra.mjs`), tạo sẵn **1 ảnh PNG 4K trong suốt (`transparent-4k.png`)** để tái sử dụng tức thì cho toàn bộ các frame Pass-through, chỉ chạy trình duyệt ở những khoảng giây có cảnh Motion, và bật GPU hardware acceleration (`NVIDIA RTX 3060`). |

---

## 5. Quy Chuẩn Video Dọc `9:16` (`1080×1920`) Cho YouTube Shorts & TikTok

| Hạng mục | Quy tắc bắt buộc (Theo sơ đồ `TikTok+Safe+Zone.png`) | Giải pháp thực thi chuẩn (Best Practice) |
| :--- | :--- | :--- |
| **5.1. Toạ độ TikTok & Shorts Safe Zone (`1080×1920`)** | Giao diện TikTok/Shorts che phủ 4 cạnh (thanh tìm kiếm ở trên, tên kênh/caption/nhạc ở dưới, và cột nút Avatar/Tim/Comment/Share cao `1080px` ở góc phải dưới). | Toàn bộ text, số liệu, thẻ thông tin và sơ đồ motion phải nằm gọn trong vùng trắng an toàn:<br>- **Top**: `y >= 160px` (cách đỉnh `160px`)<br>- **Bottom**: `y <= 1440px` (cách đáy `480px`)<br>- **Left**: `x >= 120px` (cách trái `120px`)<br>- **Right (Nửa trên `y: 160..840px`)**: `x <= 960px` (cách phải `120px`, rộng `840px`)<br>- **Right (Nửa dưới `y: 840..1440px`)**: `x <= 760px` (cách phải `320px`, rộng `640px` để tránh cột nút tương tác cao `1080px` từ đáy lên). |
| **5.2. Đóng khung hình chữ nhật cho B-Roll không bị crop mất người/sản phẩm** | Đóng khung B-roll vào ô hẹp hoặc dùng `object-fit: cover` mặc định dễ làm mất đầu người, mất bàn tay hoặc cắt cụt sản phẩm. | Khi dùng **Cách B (Đóng khung hình chữ nhật cho B-roll)**: kiểm tra trước vị trí chủ thể trên contact sheet, đặt khung hình chữ nhật rộng rãi trong vùng Safe Zone (ví dụ `x: 120..960px, y: 180..740px`) và căn chỉnh tỷ lệ/vị trí (`scale` / `object-position`) sao cho hiển thị trọn vẹn người và sản phẩm, đồng thời đặt sơ đồ/biểu đồ motion ở vùng Safe Zone còn lại (`y: 780..1420px, x: 120..760px`). |
| **5.3. Bo cong nhẹ 4 góc cho toàn bộ khung (Không dùng góc vuông `0px`)** | Khung góc vuông nhọn `0px` trên màn hình dọc `9:16` tạo cảm giác cứng và thiếu tự nhiên khi kết hợp với giao diện bo tròn của TikTok/Shorts. | Toàn bộ khung đóng cửa sổ video B-roll, khung cho motion và khung thẻ text đều phải **bo cong nhẹ 4 góc** (`border-radius: 16px–24px` cho khung video và khung motion lớn; `border-radius: 12px–16px` cho khung text/thẻ nhỏ/badge; `border-radius: 999px` cho thẻ pill) — tuyệt đối không dùng góc vuông `0px`. |

---

## 6. Quy Tắc Đóng Khung B-Roll Lớn & Kiểm Chứng Tư Liệu Documentary (Mẫu 5)

| Hạng mục | Quy tắc bắt buộc | Giải pháp thực thi chuẩn (Best Practice) |
| :--- | :--- | :--- |
| **6.1. Đóng khung B-Roll lớn làm trung tâm & Cho phép Motion đè nhẹ lên viền khung** | Nếu thu nhỏ B-roll vào một ô quá bé hoặc crop sâu sẽ làm mất nhân vật chính và bối cảnh của tư liệu. | Khi đóng khung hình chữ nhật bo góc nhẹ cho B-roll (**Cách B**): **B-roll là nhân vật chính nên khung B-roll phải chiếm phần lớn diện tích màn hình (`65%–80%`)** và giữ gần như nguyên vẹn khung hình gốc (không crop quá nhiều). Các thẻ motion, nhãn phân tích, mũi tên vector hoặc biểu đồ có thể **hiển thị xung quanh hoặc đè nhẹ lên viền/góc của khung B-roll** (`data-layout-allow-overlap`) miễn là không che mặt người hay vật thể chính ở trung tâm. |
| **6.2. Lấy Voice thực tế làm chuẩn & Phân biệt `VOICE IN–OUT` vs `SOURCE IN–OUT`** | Tự ý cắt/tăng tốc voice hoặc nhầm lẫn giữa mốc giây trên timeline với mốc giây của video nguồn trên YouTube sẽ làm lệch toàn bộ nhịp hình và tiếng. | - Giữ nguyên 100% file voice thực tế (không cắt lời, đổi thứ tự, tăng tốc hay tạo giọng AI khi chưa được đồng ý).<br>- Tách bạch 2 cột: `VOICE IN–OUT` (vị trí chèn trên timeline của video mình) và `SOURCE IN–OUT` (khoảng thời gian cắt lấy trong video YouTube nguồn).<br>- Nếu lời đọc trong voice khác kịch bản hoặc có thông tin lệch: báo cáo đúng `VOICE IN–OUT` và đề xuất hướng xử lý để người dùng quyết định; tuyệt đối không âm thầm sửa chữ trên hình khiến hình và tiếng mâu thuẫn. |
| **6.3. Xác minh nguồn thực tế & Phân loại rõ bản chất tư liệu** | Bịa link, bịa tiêu đề báo hoặc đánh đồng hình 3D/minh hoạ với tư liệu lịch sử thật làm mất uy tín video Documentary. | - Không mặc định gợi ý ban đầu là đã xác minh: phải kiểm tra trực tiếp nguồn và căn lại điểm cắt.<br>- Ưu tiên tư liệu đúng nhân vật, sự kiện, địa điểm, thời kỳ (ưu tiên số 1 là Video YouTube có link thật và `SOURCE IN–OUT` rõ ràng).<br>- Ghi nhãn phân biệt rõ: `Footage thật` / `Ảnh tư liệu` / `Mô hình 3D` / `Hình minh hoạ`. |

---

## 7. Kinh Nghiệm Thực Chiến Documentary Dài 60fps & Xuất Song Song `16:9` + `9:16` (`Samsung Documentary`)

| Vấn đề / Lỗi gặp phải | Nguyên nhân gốc rễ | Giải pháp chuẩn đã áp dụng |
| :--- | :--- | :--- |
| **7.1. Dư thừa chữ ghi chú hậu kỳ / kỹ thuật trên video** | Đưa các nhãn quy trình như `SHOT #`, `SAMSUNG ARCHIVE` / `ARCHIVE`, `XÁC MINH TƯ LIỆU BÁO CHÍ`, `EVIDENCE`, `MINH HOẠ ĐỘNG`, `FULL MOTION`, `CÁCH A/B` vào khung hình video. | **Cấm tuyệt đối in nhãn/ghi chú kỹ thuật lên video.** Mọi chữ trên khung hình `100%` chỉ phục vụ người xem. Phân loại bản chất tư liệu (`Footage thật` / `Ảnh tư liệu` / `Mô hình 3D` / `Hình minh hoạ`) chỉ ghi trong bảng `B_ROLL_SHEET.md`. |
| **7.2. Cảnh `100% Full Motion` bung sớm (front-loading) hoặc toàn ô chữ đơn điệu** | Đặt nhiều phần tử xuất hiện cùng lúc đầu cảnh mà không bám word/phrase timestamp của giọng đọc, hoặc lạm dụng hộp chữ hình chữ nhật thay vì tạo hình SVG. | • Bóc băng Whisper cấp **word/phrase timestamp** (`D:\cache\whisper`), đồng bộ từng cụm motion chỉ xuất hiện đúng lúc hoặc sau khi giọng đọc bắt đầu ý đó (`t >= start_of_phrase + 0.05s`).<br>• Cảnh `100% Full Motion` bắt buộc dựng hình khối SVG/vector có tạo hình và chuyển động cụ thể (`50%–65%` khung hình), không làm toàn hộp chữ tĩnh. |
| **7.3. Lỗi dấu tiếng Việt trong SVG & Sai hướng/trôi nhãn khi animate** | Một số thẻ `<text>` hoặc `<foreignObject>` thiếu khai báo `'Be Vietnam Pro'` đồng bộ, thiếu khoảng thoáng dòng trên, hoặc xoay/di chuyển khối SVG tách rời nhãn chữ; góc xoay kim đồng hồ đặt sai với năm cần chỉ (ví dụ đọc `1938` nhưng kim trỏ `1995`). | • Khai báo `font-family: 'Be Vietnam Pro'` cho cả HTML lẫn mọi `<text>`/`<div>` trong `<svg>` (`line-height: 1.14–1.20`).<br>• **Gom cả khối hình + chữ nhãn bên trong vào cùng 1 `<g id="...">`** (như `#s29_anode`/`#s29_cathode`) để đồng bộ chuyển động.<br>• Kiểm chứng logic hình học (kim đồng hồ `1938` trỏ đúng hướng) bằng `hyperframes snapshot` cả lúc đang chạy lẫn **điểm dừng cuối (settled frame)**. |
| **7.4. Tiếng SFX quá to hoặc chèn thừa trên B-roll tĩnh** | Đặt mức âm lượng mặc định cao, giữ khoảng lặng đầu hoặc gán SFX ở cả đoạn giữ nguyên B-roll khiến tiếng hiệu ứng át giọng đọc. | • Cắt khoảng lặng dưới `-38dB` (`afade=t=in:d=0.004`, `volume=-3dB`), phân bổ lên `3` track song song (`build-samsung-doc-sfx.mjs`), không chèn SFX ở B-roll tĩnh.<br>• Phân cấp âm lượng mềm (`SFX_SPEC_MAP`): `thump` `0.07`, `whoosh-short` `0.08–0.09`, `click-soft`/`pop` `0.15–0.16`, `chime`/`ping` `0.22–0.24` so với `1.0` của voice. |
| **7.5. Lỗi không mở được Storyboard HTML tương tác & Sparse Keyframes ở 60fps** | Trình xem HTML bị hạn chế script/hiển thị, hoặc B-roll cắt trực tiếp thiếu keyframe đều làm browser seek chậm khi render `60fps`. | • Luôn xuất kèm bộ **ảnh PNG/JPG chụp Storyboard** qua Chromium để duyệt ngay mọi lúc.<br>• Re-encode B-roll với keyframe đều (`-c:v libx264 -r 30 -g 30 -keyint_min 30 -movflags +faststart`) giúp seek nhanh, mượt ở `60fps`. |
| **7.6. Lỗi `suspect small frame` khi render 60fps cảnh B-roll tối & Cách nhân bản sang `9:16`** | Khi mở đầu cảnh B-roll nền tối silhouette (`shot-27`), `drawElement` tính diện tích khung nhỏ hơn `12%` trung vị cuộn và báo nhầm `suspect small frame`. | • Tạm đóng Studio Preview để dồn GPU cho render.<br>• Dùng `$env:HF_SEGMENTED_CAPTURE = "true"` + `--fps 60 --quality delivery --resume --frames-cache-dir D:\cache\hf-render-cache`. Nếu gặp cảnh tối gây `suspect small frame`, chuyển `--experimental-fast-capture=false --resume` để giữ toàn bộ phân đoạn đã xong và chụp chuẩn xác (`23` phân đoạn ghép nối thành công cho `66,824` frame).<br>• Nhân bản bản dọc `9:16` (`1080×1920`) bằng thư mục dự án riêng nối **NTFS Directory Junction** `assets/` sang bản `16:9`, giữ nguyên `100%` voice, `VOICE IN–OUT` & `207` Studio variables, đặt khung Cách B giữ nguyên tỷ lệ `16:9` (`840×472`) gọn trong TikTok Safe Zone (`§5`). |
