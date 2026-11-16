# Bộ 4 Mẫu Câu Phiên Bản Tiết Kiệm Token (`TOKEN-LITE EDITION`)

> Bộ mẫu này sử dụng thư mục `token-lite/` (gồm sổ tay nén `PLAYBOOK_LITE.md`, thư viện dùng chung `creative-mode.css` + `cm-helpers.js`, và 2 script tự động `prep-video.mjs` + `proof-sheet.mjs`) để **giảm 50%–65% lượng token** tiêu thụ mà vẫn giữ đầy đủ **quy trình duyệt 3 bước (Brief → Storyboard → Studio Preview → Render Final)** và quy tắc **bo cong nhẹ 4 góc toàn bộ khung**.

---

## MẪU 1 (TOKEN-LITE): Video có A-Roll (Talking Head ngồi nói) + B-Roll sản phẩm (`16:9`)

```text
Hãy dựng motion cho video "F:\duong-dan-video.mp4" theo quy trình tiết kiệm token (TOKEN-LITE — chỉ đọc duy nhất file "token-lite/PLAYBOOK_LITE.md"):
1. Quy trình duyệt 3 bước bắt buộc (CẤM tự ý nhảy cóc render thẳng MP4):
   - Bước 1 (Duyệt Brief): Chạy `node token-lite/scripts/prep-video.mjs "F:\duong-dan-video.mp4" "ten-du-an-lite"` + bóc băng lời thoại ra D:\cache, lập bảng Brief phân cảnh chi tiết rồi DỪNG LẠI trình bày cho tôi xác nhận trước khi tạo BRIEF.md.
   - Bước 2 (Duyệt Storyboard): Sau khi tôi duyệt Brief, dựng `boards/storyboard.html` và `STORYBOARD.md`, mở/chụp cho tôi xem và DỪNG LẠI chờ tôi duyệt Storyboard trước khi code các file scene.
   - Bước 3 (Code, Check, Studio Preview & Chờ lệnh Render): Code xong các cảnh, khai báo `data-composition-variables`, chạy `npx --yes hyperframes@0.8.181 check` (0 lỗi), chạy `sync-text.mjs --variables`, ghép 1 ảnh nghiệm thu `node token-lite/scripts/proof-sheet.mjs` + mở Studio Preview, và CHỈ RENDER MP4 CUỐI CÙNG ra "F:\ten-video-output.mp4" sau khi tôi xác nhận đồng ý xuất.
2. Chia tỉ lệ A-Roll (Talking Head) & B-Roll:
   - Đoạn A-Roll: Lúc giữ cảnh người nói + chèn thẻ/vector ở 2 cánh (`.cm-rail-left` / `.cm-rail-right`, không che mặt/sản phẩm/nhãn góc dưới trái); lúc phân tích sâu/so sánh/kết luận thì thay hoàn toàn bằng đại cảnh 100% Full Motion trên nền kem `#EFE9D9` (cảnh kết dùng nền xanh `#136636`).
   - Đoạn B-Roll: Giữ nguyên cảnh B-roll, chỉ chèn thẻ/vector ở 2 bên như A-roll (nếu đóng khung hình chữ nhật thì không được crop mất người/sản phẩm); đoạn Pass-through (Intro, Outro, Voucher, ảnh chụp thử) đặt thẳng trên `index.html`.
3. Đồ hoạ & Bo cong 4 góc nhẹ: Dùng sẵn `assets/creative-mode.css` và `assets/cm-helpers.js`; toàn bộ khung motion, khung video và khung text làm bo cong 4 góc nhẹ (`16px–24px` cho khung lớn/video, `12px–16px` cho thẻ nhỏ, không dùng góc vuông `0px`); chọn cơ chế trong 12 Nhóm Ẩn Dụ Thị Giác của `PLAYBOOK_LITE.md` khớp từng giây lời thoại.
```

---

## MẪU 2 (TOKEN-LITE): Video có A-Roll (Tay cầm sản phẩm nói liên tục, không có mặt) + B-Roll (`16:9`)

```text
Hãy dựng motion cho video "F:\duong-dan-video.mp4" theo quy trình tiết kiệm token (TOKEN-LITE — chỉ đọc duy nhất file "token-lite/PLAYBOOK_LITE.md"):
1. Quy trình duyệt 3 bước bắt buộc (CẤM tự ý nhảy cóc render thẳng MP4):
   - Bước 1 (Duyệt Brief): Chạy `node token-lite/scripts/prep-video.mjs "F:\duong-dan-video.mp4" "ten-du-an-lite"` + bóc băng lời thoại ra D:\cache, lập bảng Brief phân cảnh chi tiết rồi DỪNG LẠI trình bày cho tôi xác nhận trước khi tạo BRIEF.md.
   - Bước 2 (Duyệt Storyboard): Sau khi tôi duyệt Brief, dựng `boards/storyboard.html` và `STORYBOARD.md`, mở/chụp cho tôi xem và DỪNG LẠI chờ tôi duyệt Storyboard trước khi code các file scene.
   - Bước 3 (Code, Check, Studio Preview & Chờ lệnh Render): Code xong các cảnh, khai báo `data-composition-variables`, chạy `npx --yes hyperframes@0.8.181 check` (0 lỗi), chạy `sync-text.mjs --variables`, ghép 1 ảnh nghiệm thu `node token-lite/scripts/proof-sheet.mjs` + mở Studio Preview, và CHỈ RENDER MP4 CUỐI CÙNG ra "F:\ten-video-output.mp4" sau khi tôi xác nhận đồng ý xuất.
2. Chia tỉ lệ A-Roll (Tay cầm sản phẩm) & B-Roll:
   - Đoạn A-Roll: Lúc giữ cảnh 2 bàn tay cầm máy ở giữa + chèn thẻ/vector ở 2 bên (`.cm-rail-left` / `.cm-rail-right`, không che bàn tay/máy ở giữa và nhãn góc dưới trái); lúc phân tích cơ chế phần cứng, bài toán rớt giá, đối đầu đối thủ hoặc tổng kết thì thay hoàn toàn bằng đại cảnh 100% Full Motion trên nền kem `#EFE9D9` (cảnh kết dùng nền xanh `#136636`).
   - Đoạn B-Roll: Giữ nguyên cảnh B-roll, chỉ chèn thẻ thông số/vector ở 2 bên như A-roll (nếu đóng khung hình chữ nhật thì không được crop mất tay/sản phẩm); đoạn Pass-through (Intro, Outro, Voucher, ảnh chụp thử) đặt thẳng trên `index.html`.
3. Đồ hoạ & Bo cong 4 góc nhẹ: Dùng sẵn `assets/creative-mode.css` và `assets/cm-helpers.js`; toàn bộ khung motion, khung video và khung text làm bo cong 4 góc nhẹ (`16px–24px` cho khung lớn/video, `12px–16px` cho thẻ nhỏ, không dùng góc vuông `0px`); chọn cơ chế trong 12 Nhóm Ẩn Dụ Thị Giác của `PLAYBOOK_LITE.md` khớp từng giây lời thoại.
```

---

## MẪU 3 (TOKEN-LITE): Video thuần 100% Voice-Off (Chỉ có B-Roll xen kẽ khoảng trống — Khung ngang `16:9`)

```text
Hãy dựng motion cho video thuần 100% voice-off "F:\duong-dan-video.mp4" theo quy trình tiết kiệm token (TOKEN-LITE — chỉ đọc duy nhất file "token-lite/PLAYBOOK_LITE.md"):
1. Quy trình duyệt 3 bước bắt buộc (CẤM tự ý nhảy cóc render thẳng MP4):
   - Bước 1 (Duyệt Brief): Chạy `node token-lite/scripts/prep-video.mjs "F:\duong-dan-video.mp4" "ten-du-an-lite"` + bóc băng lời thoại ra D:\cache, lập bảng Brief phân cảnh chi tiết (cảnh nào Full Motion, cảnh nào B-roll Cách A hay Cách B đóng khung) rồi DỪNG LẠI trình bày cho tôi xác nhận trước khi tạo BRIEF.md.
   - Bước 2 (Duyệt Storyboard): Sau khi tôi duyệt Brief, dựng `boards/storyboard.html` và `STORYBOARD.md`, mở/chụp cho tôi xem và DỪNG LẠI chờ tôi duyệt Storyboard trước khi code các file scene.
   - Bước 3 (Code, Check, Studio Preview & Chờ lệnh Render): Code xong các cảnh, khai báo `data-composition-variables`, chạy `npx --yes hyperframes@0.8.181 check` (0 lỗi), chạy `sync-text.mjs --variables`, ghép 1 ảnh nghiệm thu `node token-lite/scripts/proof-sheet.mjs` + mở Studio Preview, và CHỈ RENDER MP4 CUỐI CÙNG ra "F:\ten-video-output.mp4" sau khi tôi xác nhận đồng ý xuất.
2. Bố cục Cảnh KHÔNG có B-Roll & Cảnh CÓ B-Roll (Chống crop mất người/sản phẩm):
   - Đoạn KHÔNG có B-Roll: Dựng đại cảnh 100% Full Motion trên nền kem `#EFE9D9` (cảnh kết nền xanh `#136636`), sơ đồ/vector chuyển động chiếm 50%–65% khung hình.
   - Đoạn CÓ B-Roll: Cách A giữ B-roll tràn viền + chèn thẻ/vector ở vùng trống 2 bên; Cách B đóng khung hình chữ nhật bo góc nhẹ `.cm-broll-window` (căn tỷ lệ chuẩn không bị crop mất người/sản phẩm) đặt trên nền kem `#EFE9D9` kèm sơ đồ/biểu đồ chạy đồng bộ bên cạnh.
3. Đồ hoạ & Bo cong 4 góc nhẹ: Dùng sẵn `assets/creative-mode.css` và `assets/cm-helpers.js`; toàn bộ khung motion, khung video và khung text làm bo cong 4 góc nhẹ (`16px–24px` cho khung lớn/video, `12px–16px` cho thẻ nhỏ, không dùng góc vuông `0px`); chọn cơ chế trong 12 Nhóm Ẩn Dụ Thị Giác của `PLAYBOOK_LITE.md` khớp từng giây lời thoại.
```

---

## MẪU 4 (TOKEN-LITE): Video Dọc `9:16` (`1080×1920`) cho YouTube Shorts & TikTok — Thuần 100% Voice-Off + B-Roll

```text
Hãy dựng motion cho video dọc 9:16 (1080x1920, dùng cho YouTube Shorts và TikTok) thuần 100% voice-off "F:\duong-dan-video.mp4" theo quy trình tiết kiệm token (TOKEN-LITE — chỉ đọc duy nhất file "token-lite/PLAYBOOK_LITE.md" và ảnh "F:\Work\Tài nguyên công việc\TikTok+Safe+Zone.png"):
1. Quy trình duyệt 3 bước bắt buộc (CẤM tự ý nhảy cóc render thẳng MP4):
   - Bước 1 (Duyệt Brief): Chạy `node token-lite/scripts/prep-video.mjs "F:\duong-dan-video.mp4" "ten-du-an-lite"` + bóc băng lời thoại ra D:\cache, lập bảng Brief phân cảnh chi tiết rồi DỪNG LẠI trình bày cho tôi xác nhận trước khi tạo BRIEF.md.
   - Bước 2 (Duyệt Storyboard): Sau khi tôi duyệt Brief, dựng `boards/storyboard.html` và `STORYBOARD.md` (khung 1080x1920 chuẩn TikTok Safe Zone), mở/chụp cho tôi xem và DỪNG LẠI chờ tôi duyệt Storyboard trước khi code các file scene.
   - Bước 3 (Code, Check, Studio Preview & Chờ lệnh Render): Code xong các cảnh, khai báo `data-composition-variables`, chạy `npx --yes hyperframes@0.8.181 check` (0 lỗi), chạy `sync-text.mjs --variables`, ghép 1 ảnh nghiệm thu `node token-lite/scripts/proof-sheet.mjs` + mở Studio Preview, và CHỈ RENDER MP4 CUỐI CÙNG ra "F:\ten-video-output.mp4" sau khi tôi xác nhận đồng ý xuất.
2. Tuân thủ tuyệt đối TikTok & Shorts Safe Zone (1080x1920):
   - Top >= 160px; Bottom <= 1440px (cách đáy 480px); Left >= 120px; Right nửa trên (y: 160..840px) <= 960px (cách phải 120px), Right nửa dưới (y: 840..1440px) <= 760px (cách phải 320px tránh cột nút Tim/Comment/Share cao 1080px).
3. Bố cục B-Roll & Bo cong 4 góc nhẹ (Chống crop mất người/sản phẩm):
   - Đoạn KHÔNG có B-Roll: Đại cảnh 100% Full Motion trên nền kem `#EFE9D9` (cảnh kết nền xanh `#136636`) nằm gọn trong Safe Zone.
   - Đoạn CÓ B-Roll: Cách A giữ B-roll toàn màn hình + chèn thẻ/vector trong Safe Zone; Cách B đóng khung hình chữ nhật bo góc nhẹ `.cm-broll-window` (kiểm tra contact sheet để căn tỷ lệ chuẩn, tuyệt đối không crop mất người/bàn tay/sản phẩm) đặt trên nền kem `#EFE9D9` kèm sơ đồ/biểu đồ ở vùng Safe Zone còn lại.
   - Toàn bộ khung motion, khung video và khung text làm bo cong 4 góc nhẹ (`16px–24px` cho khung lớn/video, `12px–16px` cho thẻ nhỏ, không dùng góc vuông `0px`); dùng sẵn `assets/creative-mode.css` và `assets/cm-helpers.js`.
```

---

## MẪU 5 (TOKEN-LITE): Video Documentary YouTube `16:9` (`1920×1080`) — Từ File Kịch Bản Docs + File Voice → Bảng B-Roll → Dựng Motion Video

```text
Hãy thực hiện dự án video Documentary YouTube 16:9 (1920x1080) từ file kịch bản "F:\duong-dan-kich-ban.docx" và file thu âm giọng đọc "F:\duong-dan-voice.mp3" theo quy trình tiết kiệm token (TOKEN-LITE — chỉ đọc duy nhất file "token-lite/PLAYBOOK_LITE.md"):
1. Nguyên tắc cốt lõi về Voice & Tư liệu Documentary:
   - Lấy VOICE THỰC TẾ làm chuẩn: Không tự cắt lời, đổi thứ tự, tăng tốc, viết lại nội dung hay tạo giọng AI khi chưa được tôi đồng ý.
   - Phân biệt rõ `VOICE IN–OUT` (vị trí chèn hình trên timeline của tôi) và `SOURCE IN–OUT` (khoảng thời gian cắt lấy trong video nguồn). Mọi timecode/gợi ý ban đầu chỉ là đề xuất: phải nghe đối chiếu voice, xem trực tiếp đoạn nguồn và căn lại điểm cắt.
   - Ưu tiên tư liệu đúng nhân vật, sự kiện, địa điểm và thời kỳ (video bổ sung ưu tiên YouTube, ghi rõ link và `SOURCE IN–OUT`; nếu đề xuất nguồn tốt hơn phải nêu nguồn thay thế, lý do và shot bị ảnh hưởng).
   - Không bịa link, tiêu đề báo, số liệu hoặc cảnh quay. Phân biệt rõ: `Footage thật`, `Ảnh tư liệu`, `Mô hình 3D`, `Hình minh hoạ`. Nếu phát hiện thông tin sai hoặc voice khác kịch bản, báo đúng timecode `VOICE IN–OUT` và đề xuất cách xử lý để tôi quyết định (không âm thầm sửa chữ trên hình nhưng giữ lời đọc mâu thuẫn).
2. Giai đoạn 1 — Xuất bảng B-Roll (`B_ROLL_SHEET.md`) gồm 6 cột (`VOICE IN–OUT`, `Nội dung Voice & Cảnh báo lệch kịch bản`, `Bản chất tư liệu`, `Link đã xác minh & Nguồn thay thế`, `SOURCE IN–OUT trên video nguồn`, `Phương án Motion theo Mẫu 3`) và DỪNG LẠI chờ tôi duyệt trước khi tải video hay dựng cảnh.
3. Giai đoạn 2 — Tải/Cắt B-Roll & Áp dụng Quy trình Edit Motion Video như Mẫu số 3 (Sau khi tôi duyệt bảng B-Roll):
   - Đi qua đúng 3 bước duyệt: (1) Tải/cắt B-Roll theo `SOURCE IN–OUT` + chốt `BRIEF.md` → (2) Dựng `boards/storyboard.html` & `STORYBOARD.md` và DỪNG LẠI chờ duyệt Storyboard → (3) Code các cảnh (cảnh không có B-roll dựng 100% Full Motion; cảnh có B-roll dùng Cách A tràn viền + motion bao quanh hoặc Cách B đóng khung hình chữ nhật lớn bo góc nhẹ `.cm-broll-window` chiếm 65%–80% khung hình, không crop quá nhiều làm mất nhân vật chính, cho phép thẻ motion hiển thị xung quanh hoặc đè nhẹ lên viền/góc khung B-roll; toàn bộ khung bo cong nhẹ 4 góc `16px–24px` / `12px–16px`, không dùng góc vuông `0px`), chạy `npx --yes hyperframes@0.8.181 check` (0 lỗi), `sync-text.mjs --variables`, ghép 1 ảnh `proof-sheet.mjs` + mở Studio Preview, và CHỈ RENDER MP4 CUỐI CÙNG ra `"F:\ten-video-output.mp4"` khi tôi xác nhận đồng ý xuất.
```
