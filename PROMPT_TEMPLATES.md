# Bộ 5 Mẫu Câu (Prompt Templates) Chuẩn Cho Các Dự Án Video Tiếp Theo

Chỉ cần copy 1 trong 5 mẫu dưới đây, thay đường dẫn file đầu vào (`F:\...`) và tên file đầu ra, AI sẽ tự động đọc `motion-studio`, `hyperframes`, `FRAME.md` và `LESSONS_LEARNED.md` để thực hiện đúng **quy trình duyệt từng bước (Bảng B-Roll / Brief → Storyboard → Studio Preview → Render Final)** và áp dụng đồng bộ quy tắc **bo cong nhẹ 4 góc cho toàn bộ khung** trên cả 5 mẫu.

---

## MẪU 1: Video có A-Roll (Talking Head ngồi nói) + B-Roll sản phẩm (Khung ngang `16:9`)
*(Giống dạng video phân tích iPhone Duo — có mặt người nói kết hợp B-roll trên tay)*

```text
Hãy dựng motion cho video "F:\duong-dan-video.mp4" theo đúng quy trình chuẩn của motion-studio & hyperframes với phong cách creative-mode minh hoạ động (đọc kỹ FRAME.md và LESSONS_LEARNED.md trong workspace):

1. QUY TRÌNH KIỂM TRA & DUYỆT 3 BƯỚC BẮT BUỘC (TUYỆT ĐỐI KHÔNG TỰ Ý NHẢY CÓC RENDER THẲNG VIDEO FINAL):
- Bước 1 (Phân tích & Duyệt Brief phân cảnh): Dùng ffprobe + ffmpeg xuất contact sheet và bóc băng lời thoại ra D:\cache (không đọc trực tiếp file .mp4 bằng read_file). Lập bảng Brief & Kế hoạch phân cảnh chi tiết (ghi rõ từng mốc giây, đoạn nào giữ A-roll/B-roll, đoạn nào Pass-through, đoạn nào Full Motion, dùng cơ chế ẩn dụ nào trong 12 nhóm) rồi DỪNG LẠI trình bày cho tôi xác nhận trước khi tạo BRIEF.md.
- Bước 2 (Dựng & Duyệt Storyboard trực quan): Sau khi tôi duyệt Brief, tạo Storyboard trực quan (boards/storyboard.html và STORYBOARD.md theo chuẩn hyperframes-creative) phác thảo bố cục từng cảnh, mở/chụp cho tôi xem và DỪNG LẠI chờ tôi duyệt Storyboard trước khi code các file scene animation.
- Bước 3 (Code Scenes, Kiểm tra HyperFrames Check & Mở Studio Preview trước khi Render): Sau khi tôi duyệt Storyboard, tiến hành code các cảnh, khai báo đầy đủ biến data-composition-variables (nhãn tiếng Việt) trên index.html, chạy npx --yes hyperframes@0.8.181 check đạt 0 lỗi, chạy sync-text.mjs --variables, mở HyperFrames Studio Preview (kèm ảnh chụp nghiệm thu các cảnh) để tôi kiểm tra và chỉnh sửa, và CHỈ RENDER XUẤT FILE MP4 CUỐI CÙNG ra "F:\ten-video-output.mp4" sau khi tôi xác nhận đồng ý xuất.

2. BỐ CỤC CHIA TỈ LỆ A-ROLL (TALKING HEAD) & B-ROLL:
- Đoạn A-Roll (Talking Head): Chia tỉ lệ linh hoạt theo nhịp nội dung:
  + Lúc giữ nguyên cảnh người ngồi nói (Talking Head) và chèn các thẻ/vector motion (bo cong nhẹ 4 góc) ở vùng trống 2 bên (tuyệt đối không che mặt người nói, không che sản phẩm cầm trên tay và không đè nhãn mục góc dưới trái).
  + Lúc đến các đoạn phân tích sâu, giải thích cơ chế, so sánh thông số, bài toán giá hoặc tổng kết: thay thế hoàn toàn hình ảnh bằng đại cảnh 100% Full Motion Minh Hoạ Động trên nền giấy kem #EFE9D9 (giữ nguyên 100% giọng nói gốc), cảnh tổng kết cuối dùng nền xanh đậm #136636.
- Đoạn B-Roll thực tế: TUYỆT ĐỐI KHÔNG thay thế đè mất hình B-roll; luôn giữ nguyên cảnh B-roll và chỉ chèn các thẻ thông số / vector minh hoạ ở vùng trống 2 bên như A-roll (nếu đóng khung hình chữ nhật cho B-roll thì phải bo góc nhẹ và căn tỷ lệ chuẩn để không bị crop mất người hay sản phẩm).
- Đoạn Pass-through (Giữ nguyên 100%, không chèn motion): Để trống hoàn toàn tại các đoạn Intro, Outro, bảng Voucher Shopee/YouTube Shopping và các đoạn đang show ảnh/video chụp thử.

3. NGUYÊN TẮC CREATIVE-MODE BO GÓC NHẸ & ĐỒ HOẠ ĐỘNG (HTML + INLINE SVG + CSS + GSAP):
- Giữ nguyên bảng màu & chất liệu của creative-mode: nền giấy kem #EFE9D9, viền mực đen #0F0F0F dày 4px–5px, không blur, không gradient, tối đa 2–3 màu nhấn mỗi cảnh (#1F8A4C, #F06CA8, #E85A1F, #F5C518), bóng đổ khối cứng lệch góc màu Cam #E85A1F tối đa 1 khối tiêu điểm mỗi cảnh, đảm bảo Squint Test (1 tiêu điểm chính lớn gấp 3–5 lần thành phần phụ).
- QUY TẮC BO CONG 4 GÓC NHẸ (GHI ĐÈ QUY TẮC GÓC VUÔNG 0PX CŨ): Toàn bộ các khung cho motion, khung đóng cửa sổ video, khung thẻ text, bảng biểu và thanh đo BẮT BUỘC làm bo cong 4 góc nhẹ (border-radius: 16px–24px cho khung lớn/khung video; border-radius: 12px–16px cho khung text/thẻ nhỏ/badge; border-radius: 999px cho thẻ pill) — TUYỆT ĐỐI KHÔNG dùng khung góc vuông nhọn 0px.
- Ở các cảnh Full Motion và cụm minh hoạ, tự động chọn cơ chế phù hợp nhất trong 12 Nhóm Ẩn Dụ Thị Giác của FRAME.md (băng tải/cổng quét, phân loại thẻ & thanh đo/đồng hồ kim quay, mặt cắt X-Ray/toà nhà, biểu đồ đường/cột/radar tự vẽ, bàn cân đối đầu/rớt giá, mạng lưới Hub/Flowchart, mô phỏng UI/Cursor, dòng thời gian/Domino, bản đồ/Radar, thử nghiệm vật lý IP69/Pin, quá tải→dọn sạch, trích dẫn báo chí/hoá đơn).
- Không làm các cảnh chỉ có hộp chữ tĩnh; không lặp lại cùng 1 kiểu minh hoạ ở 2 cảnh liên tiếp; chia nhịp Time-Coded Shot Sequence xuất hiện khớp từng giây với lời thoại (không bung hết hình ở đầu cảnh rồi đứng im).

4. QUY CHUẨN KỸ THUẬT HYPERFRAMES & MOTION-STUDIO BẮT BUỘC:
- Mỗi cảnh có đúng 1 timeline GSAP paused: true đăng ký vào window.__timelines (seek-safe, deterministic).
- Không vẽ thanh .cm-topbar / .cm-footer kiểu slide; tiêu đề tiếng Việt in hoa dùng Be Vietnam Pro (weight 900, line-height 1.12–1.18); không dùng emoji cờ (vẽ bằng SVG); đảm bảo tương phản WCAG AA (dùng xanh đậm #136636 cho ô nhỏ, cam đậm #B83B0B trên nền kem).
- Không đặt transform trong CSS trên phần tử có GSAP tl.to(); gắn data-layout-allow-overlap / data-layout-allow-occlusion cho các xấp thẻ xếp chồng; trộn SFX đã cắt khoảng lặng đầu ở volume 0.38; lưu toàn bộ cache/temp tại D:\cache.
```

---

## MẪU 2: Video có A-Roll (Tay cầm sản phẩm nói liên tục, không có mặt) + B-Roll (Khung ngang `16:9`)
*(Giống dạng video đánh giá OPPO A7 Pro — quay từ trên xuống hai bàn tay cầm máy trên bàn kỹ thuật)*

```text
Hãy dựng motion cho video "F:\duong-dan-video.mp4" theo đúng quy trình chuẩn của motion-studio & hyperframes với phong cách creative-mode minh hoạ động (đọc kỹ FRAME.md và LESSONS_LEARNED.md trong workspace):

1. QUY TRÌNH KIỂM TRA & DUYỆT 3 BƯỚC BẮT BUỘC (TUYỆT ĐỐI KHÔNG TỰ Ý NHẢY CÓC RENDER THẲNG VIDEO FINAL):
- Bước 1 (Phân tích & Duyệt Brief phân cảnh): Dùng ffprobe + ffmpeg xuất contact sheet và bóc băng lời thoại ra D:\cache (không đọc trực tiếp file .mp4 bằng read_file). Lập bảng Brief & Kế hoạch phân cảnh chi tiết (ghi rõ từng mốc giây, đoạn nào giữ A-roll tay cầm máy / B-roll, đoạn nào Pass-through, đoạn nào Full Motion, dùng cơ chế ẩn dụ nào trong 12 nhóm) rồi DỪNG LẠI trình bày cho tôi xác nhận trước khi tạo BRIEF.md.
- Bước 2 (Dựng & Duyệt Storyboard trực quan): Sau khi tôi duyệt Brief, tạo Storyboard trực quan (boards/storyboard.html và STORYBOARD.md theo chuẩn hyperframes-creative) phác thảo bố cục từng cảnh, mở/chụp cho tôi xem và DỪNG LẠI chờ tôi duyệt Storyboard trước khi code các file scene animation.
- Bước 3 (Code Scenes, Kiểm tra HyperFrames Check & Mở Studio Preview trước khi Render): Sau khi tôi duyệt Storyboard, tiến hành code các cảnh, khai báo đầy đủ biến data-composition-variables (nhãn tiếng Việt) trên index.html, chạy npx --yes hyperframes@0.8.181 check đạt 0 lỗi, chạy sync-text.mjs --variables, mở HyperFrames Studio Preview (kèm ảnh chụp nghiệm thu các cảnh) để tôi kiểm tra và chỉnh sửa, và CHỈ RENDER XUẤT FILE MP4 CUỐI CÙNG ra "F:\ten-video-output.mp4" sau khi tôi xác nhận đồng ý xuất.

2. BỐ CỤC CHIA TỈ LỆ A-ROLL (TAY CẦM SẢN PHẨM) & B-ROLL:
- Đoạn A-Roll (Quay hai bàn tay cầm sản phẩm và nói liên tục, không có mặt người): Chia tỉ lệ linh hoạt theo mạch phân tích:
  + Lúc giữ nguyên cảnh hai bàn tay cầm sản phẩm ở trung tâm màn hình và cho các thẻ/vector motion (bo cong nhẹ 4 góc) xuất hiện ở vùng trống 2 bên cánh trái/phải (tuyệt đối không che bàn tay và thân máy ở giữa, không đè nhãn mục góc dưới trái).
  + Lúc đến các đoạn phân tích luận điểm dài, cơ chế phần cứng, bài toán rớt giá, bảng đối chiếu hiệu năng với đối thủ, hoặc tổng kết Ưu/Nhược điểm: thay thế hoàn toàn hình ảnh A-roll bằng đại cảnh 100% Full Motion Minh Hoạ Động trên nền giấy kem #EFE9D9 (giữ nguyên 100% giọng nói gốc), cảnh tổng kết cuối dùng nền xanh đậm #136636.
- Đoạn B-Roll cận cảnh sản phẩm: TUYỆT ĐỐI KHÔNG thay thế đè mất hình B-roll; giữ nguyên cảnh B-roll và chỉ chèn các thẻ thông số / callout motion ở vùng trống 2 bên giống như A-roll (nếu đóng khung hình chữ nhật cho B-roll thì phải bo góc nhẹ và căn tỷ lệ chuẩn để không bị crop mất bàn tay hay sản phẩm).
- Đoạn Pass-through (Giữ nguyên 100%, không chèn motion): Để trống hoàn toàn tại các đoạn Intro, Outro, bảng Voucher Shopee/YouTube Shopping và các đoạn đang hiển thị ảnh chụp/video quay thử từ camera.

3. NGUYÊN TẮC CREATIVE-MODE BO GÓC NHẸ & ĐỒ HOẠ ĐỘNG (HTML + INLINE SVG + CSS + GSAP):
- Giữ nguyên bảng màu & chất liệu của creative-mode: nền giấy kem #EFE9D9, viền mực đen #0F0F0F dày 4px–5px, không blur, không gradient, tối đa 2–3 màu nhấn mỗi cảnh (#1F8A4C, #F06CA8, #E85A1F, #F5C518), bóng đổ khối cứng lệch góc màu Cam #E85A1F tối đa 1 khối tiêu điểm mỗi cảnh, đảm bảo Squint Test (1 tiêu điểm chính lớn gấp 3–5 lần thành phần phụ).
- QUY TẮC BO CONG 4 GÓC NHẸ (GHI ĐÈ QUY TẮC GÓC VUÔNG 0PX CŨ): Toàn bộ các khung cho motion, khung đóng cửa sổ video, khung thẻ text, bảng biểu và thanh đo BẮT BUỘC làm bo cong 4 góc nhẹ (border-radius: 16px–24px cho khung lớn/khung video; border-radius: 12px–16px cho khung text/thẻ nhỏ/badge; border-radius: 999px cho thẻ pill) — TUYỆT ĐỐI KHÔNG dùng khung góc vuông nhọn 0px.
- Tự động chọn cơ chế minh hoạ phù hợp nhất trong 12 Nhóm Ẩn Dụ Thị Giác của FRAME.md theo từng câu thoại (mặt cắt X-Ray pin/chip/camera, thử nghiệm vật lý tia nước IP69/sạc nhanh/góc rộng 100°, bàn cân đối đầu/rớt giá kèm kéo cắt voucher, băng tải/cổng quét, phân loại thẻ & thanh đo tiến độ, biểu đồ đường/cột/radar tự vẽ, mô phỏng UI/Cursor...).
- Tuyệt đối không làm các cảnh chỉ có hộp chữ tĩnh; không lặp lại cùng 1 kiểu minh hoạ ở 2 cảnh liên tiếp; chia nhịp Time-Coded Shot Sequence đồng bộ khớp từng giây với giọng đọc.

4. QUY CHUẨN KỸ THUẬT HYPERFRAMES & MOTION-STUDIO BẮT BUỘC:
- Mỗi cảnh có đúng 1 timeline GSAP paused: true đăng ký vào window.__timelines (seek-safe, deterministic).
- Không vẽ thanh .cm-topbar / .cm-footer kiểu slide; tiêu đề tiếng Việt in hoa dùng Be Vietnam Pro (weight 900, line-height 1.12–1.18); không dùng emoji cờ (vẽ bằng SVG); đảm bảo tương phản WCAG AA (dùng xanh đậm #136636 cho ô nhỏ, cam đậm #B83B0B trên nền kem).
- Không đặt transform trong CSS trên phần tử có GSAP tl.to(); gắn data-layout-allow-overlap / data-layout-allow-occlusion cho các xấp thẻ xếp chồng; trộn SFX đã cắt khoảng lặng đầu ở volume 0.38; lưu toàn bộ cache/temp tại D:\cache.
```

---

## MẪU 3: Video thuần 100% Voice-Off (Chỉ có B-Roll xen kẽ khoảng trống — Khung ngang `16:9`)
*(Giống dạng video Explainer / Phóng sự / Giới thiệu công cụ — chỉ có giọng đọc và các đoạn B-roll minh hoạ)*

```text
Hãy dựng motion cho video thuần 100% voice-off "F:\duong-dan-video.mp4" theo đúng quy trình chuẩn của motion-studio & hyperframes với phong cách creative-mode minh hoạ động (đọc kỹ FRAME.md và LESSONS_LEARNED.md trong workspace):

1. QUY TRÌNH KIỂM TRA & DUYỆT 3 BƯỚC BẮT BUỘC (TUYỆT ĐỐI KHÔNG TỰ Ý NHẢY CÓC RENDER THẲNG VIDEO FINAL):
- Bước 1 (Phân tích & Duyệt Brief phân cảnh): Dùng ffprobe + ffmpeg xuất contact sheet và bóc băng lời thoại ra D:\cache (không đọc trực tiếp file .mp4 bằng read_file). Lập bảng Brief & Kế hoạch phân cảnh chi tiết (ghi rõ từng mốc giây, đoạn nào không có B-roll dựng Full Motion, đoạn nào có B-roll dùng Cách A tràn viền hay Cách B đóng khung hình chữ nhật, dùng cơ chế ẩn dụ nào trong 12 nhóm) rồi DỪNG LẠI trình bày cho tôi xác nhận trước khi tạo BRIEF.md.
- Bước 2 (Dựng & Duyệt Storyboard trực quan): Sau khi tôi duyệt Brief, tạo Storyboard trực quan (boards/storyboard.html và STORYBOARD.md theo chuẩn hyperframes-creative) phác thảo bố cục từng cảnh, mở/chụp cho tôi xem và DỪNG LẠI chờ tôi duyệt Storyboard trước khi code các file scene animation.
- Bước 3 (Code Scenes, Kiểm tra HyperFrames Check & Mở Studio Preview trước khi Render): Sau khi tôi duyệt Storyboard, tiến hành code các cảnh, khai báo đầy đủ biến data-composition-variables (nhãn tiếng Việt) trên index.html, chạy npx --yes hyperframes@0.8.181 check đạt 0 lỗi, chạy sync-text.mjs --variables, mở HyperFrames Studio Preview (kèm ảnh chụp nghiệm thu các cảnh) để tôi kiểm tra và chỉnh sửa, và CHỈ RENDER XUẤT FILE MP4 CUỐI CÙNG ra "F:\ten-video-output.mp4" sau khi tôi xác nhận đồng ý xuất.

2. BỐ CỤC XỬ LÝ CẢNH CÓ B-ROLL & CẢNH KHÔNG CÓ B-ROLL (BO CONG 4 GÓC NHẸ & CHỐNG CROP MẤT NGƯỜI/SẢN PHẨM):
- Những phân đoạn KHÔNG có B-Roll (hoặc cần giải thích khái niệm/dữ liệu): Dựng đại cảnh 100% Full Motion Minh Hoạ Động trên nền giấy kem #EFE9D9 (cảnh kết dùng nền xanh đậm #136636), trong đó sơ đồ/vector chuyển động chiếm 50%–65% khung hình.
- Những phân đoạn CÓ B-Roll: Giữ nguyên hình ảnh B-roll và xử lý linh hoạt theo 2 cách:
  + Cách A (B-roll toàn màn hình + Motion bao quanh): Giữ B-roll làm nền và chèn các thẻ callout, mũi tên chỉ điểm SVG, thanh đo thông số hoặc nhãn phân tích (tất cả khung thẻ đều bo cong nhẹ 4 góc) ở các vùng trống xung quanh, không che khuất chủ thể chính.
  + Cách B (Đóng khung hình chữ nhật lớn bo góc nhẹ cho B-roll + Motion xung quanh/đè viền): Đóng khung đoạn video B-roll vào một cửa sổ hình chữ nhật lớn bo cong nhẹ 4 góc (border-radius: 18px–24px, overflow: hidden), viền mực đen dày 5px (#0F0F0F) có bóng đổ khối cứng lệch góc (#E85A1F) đặt ở trung tâm trên nền giấy kem #EFE9D9. QUY TẮC B-ROLL LÀ NHÂN VẬT CHÍNH & CHỐNG CROP QUÁ NHIỀU: Khung B-roll phải chiếm phần lớn diện tích màn hình (khoảng 65%–80% khung hình), giữ gần như trọn vẹn khung hình gốc, tuyệt đối không crop quá nhiều hay thu nhỏ B-roll làm mất nhân vật chính, bàn tay hoặc sản phẩm; các thẻ motion, nhãn thông số, mũi tên vector, thanh tiến độ hoặc biểu đồ có thể hiển thị xung quanh hoặc ĐÈ NHẸ LÊN VIỀN/GÓC CỦA KHUNG B-ROLL (gắn data-layout-allow-overlap) miễn là không che khuất chủ thể chính bên trong B-roll.

3. NGUYÊN TẮC CREATIVE-MODE BO GÓC NHẸ & ĐỒ HOẠ ĐỘNG (CODE HTML + INLINE SVG + CSS + GSAP):
- Giữ nguyên bảng màu & chất liệu của creative-mode: nền giấy kem #EFE9D9, viền mực đen #0F0F0F dày 4px–5px, không blur, không gradient, tối đa 2–3 màu nhấn mỗi cảnh (#1F8A4C, #F06CA8, #E85A1F, #F5C518), bóng đổ khối cứng lệch góc màu Cam #E85A1F tối đa 1 khối tiêu điểm mỗi cảnh, đảm bảo Squint Test (1 tiêu điểm chính lớn gấp 3–5 lần thành phần phụ).
- QUY TẮC BO CONG 4 GÓC NHẸ (GHI ĐÈ QUY TẮC GÓC VUÔNG 0PX CŨ): Toàn bộ các khung cho motion, khung đóng cửa sổ video B-roll, khung thẻ text, bảng biểu và thanh đo BẮT BUỘC làm bo cong 4 góc nhẹ (border-radius: 16px–24px cho khung video và khung motion lớn; border-radius: 12px–16px cho khung text/thẻ nhỏ/badge; border-radius: 999px cho thẻ pill) — TUYỆT ĐỐI KHÔNG dùng khung góc vuông nhọn 0px.
- Tự động ánh xạ từng ý trong lời thoại sang 12 Nhóm Ẩn Dụ Thị Giác trong FRAME.md (dây chuyền băng tải & cổng quét, bộ phân loại thẻ & thanh đo mức độ, mặt cắt cấu trúc 3 tầng / X-Ray, biểu đồ đường tách nhánh / cột đua / radar tự vẽ, bàn cân đối đầu, mạng lưới Hub / Flowchart, mô phỏng giao diện & con trỏ, dòng thời gian / Domino, bản đồ / Radar, thử nghiệm vật lý, quá tải→dọn sạch, trích dẫn nghiên cứu/báo chí).
- Tuyệt đối không làm các cảnh chỉ có hộp chữ tĩnh; không lặp lại cùng 1 kiểu minh hoạ ở 2 cảnh liên tiếp; chia nhịp Time-Coded Shot Sequence khớp từng giây với giọng đọc.

4. QUY CHUẨN KỸ THUẬT HYPERFRAMES & MOTION-STUDIO BẮT BUỘC:
- Mỗi cảnh có đúng 1 timeline GSAP paused: true đăng ký vào window.__timelines (seek-safe, deterministic).
- Không vẽ thanh .cm-topbar / .cm-footer kiểu slide; tiêu đề tiếng Việt in hoa dùng Be Vietnam Pro (weight 900, line-height 1.12–1.18); không dùng emoji cờ (vẽ bằng SVG); đảm bảo tương phản WCAG AA (dùng xanh đậm #136636 cho ô nhỏ, cam đậm #B83B0B trên nền kem).
- Không đặt transform trong CSS trên phần tử có GSAP tl.to(); gắn data-layout-allow-overlap / data-layout-allow-occlusion cho các xấp thẻ xếp chồng; trộn SFX đã cắt khoảng lặng đầu ở volume 0.38; lưu toàn bộ cache/temp tại D:\cache.
```

---

## MẪU 4: Video Dọc `9:16` (`1080×1920`) cho YouTube Shorts & TikTok — Thuần 100% Voice-Off + B-Roll
*(Phiên bản chuẩn đầy đủ cho video dọc ngắn: có bước duyệt Brief & Storyboard ban đầu, tuân thủ tuyệt đối TikTok/Shorts Safe Zone, bo cong nhẹ 4 góc toàn bộ khung và đóng khung hình chữ nhật không crop mất người/sản phẩm)*

```text
Hãy dựng motion cho video dọc 9:16 (1080x1920, dùng cho YouTube Shorts và TikTok) thuần 100% voice-off "F:\duong-dan-video.mp4" theo đúng quy trình chuẩn của motion-studio & hyperframes với phong cách creative-mode minh hoạ động (đọc kỹ FRAME.md, LESSONS_LEARNED.md và ảnh quy chuẩn "F:\Work\Tài nguyên công việc\TikTok+Safe+Zone.png"):

1. QUY TRÌNH KIỂM TRA & DUYỆT 3 BƯỚC BẮT BUỘC (TUYỆT ĐỐI KHÔNG TỰ Ý NHẢY CÓC RENDER THẲNG VIDEO FINAL):
- Bước 1 (Phân tích & Duyệt Brief phân cảnh): Dùng ffprobe + ffmpeg xuất contact sheet và bóc băng lời thoại ra D:\cache (không đọc trực tiếp file .mp4 bằng read_file). Dựa trên lời thoại và hình ảnh B-roll, lập bảng Brief & Kế hoạch phân cảnh chi tiết (ghi rõ từng mốc giây, cảnh nào không có B-roll dựng Full Motion, cảnh nào có B-roll dùng Cách A tràn viền hay Cách B đóng khung hình chữ nhật, chọn cơ chế nào trong 12 Nhóm Ẩn Dụ Thị Giác) rồi DỪNG LẠI trình bày cho tôi xác nhận trước khi tạo BRIEF.md.
- Bước 2 (Dựng & Duyệt Storyboard trực quan): Sau khi tôi duyệt Brief, khởi tạo dự án 1080x1920 và tạo Storyboard trực quan (boards/storyboard.html và STORYBOARD.md theo chuẩn hyperframes-creative) phác thảo bố cục từng cảnh trong vùng TikTok Safe Zone, mở/chụp cho tôi xem và DỪNG LẠI chờ tôi duyệt Storyboard trước khi code các file scene animation.
- Bước 3 (Code Scenes, Kiểm tra HyperFrames Check & Mở Studio Preview trước khi Render): Sau khi tôi duyệt Storyboard, tiến hành code các cảnh, khai báo đầy đủ biến data-composition-variables (nhãn tiếng Việt) trên index.html, chạy npx --yes hyperframes@0.8.181 check đạt 0 lỗi, chạy sync-text.mjs --variables, mở HyperFrames Studio Preview (kèm ảnh chụp nghiệm thu các cảnh) để tôi kiểm tra và chỉnh sửa, và CHỈ RENDER XUẤT FILE MP4 CUỐI CÙNG ra "F:\ten-video-output.mp4" sau khi tôi xác nhận đồng ý xuất.

2. QUY TẮC BẮT BUỘC VỀ TIKTOK & SHORTS SAFE ZONE (KHUNG 1080x1920):
Toàn bộ chữ (text), số liệu, nhãn, thẻ thông tin và sơ đồ motion quan trọng BẮT BUỘC phải nằm gọn trong vùng trắng an toàn theo đúng sơ đồ "F:\Work\Tài nguyên công việc\TikTok+Safe+Zone.png":
- Cạnh trên (Top Dead Zone): Cách mép trên tối thiểu 160px (chỉ đặt nội dung từ y >= 160px).
- Cạnh dưới (Bottom Dead Zone): Cách mép dưới tối thiểu 480px (chỉ đặt nội dung đến y <= 1440px; vùng y: 1440..1920px để trống hoàn toàn tránh bị tên kênh, caption và thanh nhạc che khuất).
- Cạnh trái (Left Margin): Cách mép trái tối thiểu 120px (chỉ đặt nội dung từ x >= 120px).
- Cạnh phải (Right Margin & Cột nút tương tác hình chữ L ngược):
  + Ở nửa trên (y: 160..840px): Cách mép phải tối thiểu 120px (x: 120..960px, bề ngang an toàn 840px).
  + Ở nửa dưới (y: 840..1440px — khu vực có cột nút Avatar/Tim/Bình luận/Share cao 1080px tính từ đáy lên): Phải lùi vào sâu hơn, cách mép phải tối thiểu 320px (x: 120..760px, bề ngang an toàn 640px) để không bao giờ bị cột icon bên phải đè lên chữ hoặc biểu đồ.

3. BỐ CỤC XỬ LÝ CẢNH KHÔNG CÓ B-ROLL & CẢNH CÓ B-ROLL (BO CONG 4 GÓC NHẸ & CHỐNG CROP MẤT NGƯỜI/SẢN PHẨM):
- Những phân đoạn KHÔNG có B-Roll (hoặc cần giải thích khái niệm/dữ liệu): Dựng đại cảnh 100% Full Motion Minh Hoạ Động trên nền giấy kem #EFE9D9 (cảnh tổng kết cuối dùng nền xanh đậm #136636), bố trí sơ đồ/vector chuyển động theo trục dọc hoàn toàn bên trong TikTok Safe Zone.
- Những phân đoạn CÓ B-Roll: Giữ nguyên hình ảnh B-roll và xử lý linh hoạt theo 2 cách:
  + Cách A (B-roll toàn màn hình 1080x1920 + Motion chèn trong Safe Zone): Giữ B-roll tràn viền làm nền, chèn các thẻ callout, mũi tên chỉ điểm SVG, thanh đo thông số hoặc nhãn phân tích (tất cả khung thẻ đều bo cong nhẹ 4 góc) vào các khoảng trống nằm trong Safe Zone (ưu tiên vùng trên y: 170..430px, x: 120..960px hoặc vùng dưới-trái y: 1020..1420px, x: 120..760px), tuyệt đối không che khuất sản phẩm hoặc người ở trung tâm.
  + Cách B (Đóng khung hình chữ nhật lớn bo góc nhẹ cho B-roll + Motion xung quanh/đè viền trong Safe Zone): Đặt đoạn B-roll vào một khung cửa sổ hình chữ nhật lớn bo cong nhẹ 4 góc (border-radius: 18px–24px, overflow: hidden), viền mực đen dày 5px (#0F0F0F) có bóng đổ khối cứng lệch góc màu Cam (#E85A1F) trên nền giấy kem #EFE9D9. QUY TẮC B-ROLL LÀ NHÂN VẬT CHÍNH & CHỐNG CROP QUÁ NHIỀU: B-roll là trung tâm nên khung B-roll phải chiếm phần lớn diện tích vùng hiển thị, không được crop quá nhiều và TUYỆT ĐỐI KHÔNG CẮT MẤT SẢN PHẨM, BÀN TAY THAO TÁC HOẶC NGƯỜI TRONG VIDEO; các thẻ motion, sơ đồ vector, thanh tiến độ hoặc biểu đồ chạy đồng bộ có thể đặt ở vùng Safe Zone xung quanh hoặc ĐÈ NHẸ LÊN VIỀN/GÓC KHUNG B-ROLL (gắn data-layout-allow-overlap, nằm trong TikTok Safe Zone) miễn là không che khuất nhân vật/sản phẩm chính.
- Đoạn Pass-through (Intro, Outro, bảng Voucher/Giỏ hàng hoặc đoạn đang show ảnh/video kết quả thực tế): Giữ nguyên 100% B-roll gốc, không chèn motion đè lên.

4. NGUYÊN TẮC CREATIVE-MODE BO GÓC NHẸ & ĐỒ HOẠ ĐỘNG (CODE HTML + INLINE SVG + CSS + GSAP):
- Giữ nguyên bảng màu & chất liệu của creative-mode: nền giấy kem #EFE9D9, viền mực đen #0F0F0F dày 4px–5px, không blur, không gradient, tối đa 2–3 màu nhấn mỗi cảnh (#1F8A4C, #F06CA8, #E85A1F, #F5C518), bóng đổ khối cứng lệch góc màu Cam #E85A1F tối đa 1 khối tiêu điểm mỗi cảnh, đảm bảo Squint Test (1 tiêu điểm chính lớn gấp 3–5 lần thành phần phụ).
- QUY TẮC BO CONG 4 GÓC NHẸ (GHI ĐÈ QUY TẮC GÓC VUÔNG 0PX CŨ): Toàn bộ các khung cho motion, khung đóng cửa sổ video B-roll, khung thẻ text, bảng biểu và thanh đo BẮT BUỘC làm bo cong 4 góc nhẹ (border-radius: 16px–24px cho khung video và khung motion lớn; border-radius: 12px–16px cho khung text/thẻ nhỏ/badge; border-radius: 999px cho thẻ pill) — TUYỆT ĐỐI KHÔNG dùng khung góc vuông nhọn 0px.
- Tự động ánh xạ từng ý trong lời thoại sang 12 Nhóm Ẩn Dụ Thị Giác trong FRAME.md (dây chuyền băng tải & cổng quét, bộ phân loại thẻ & thanh đo mức độ, mặt cắt cấu trúc 3 tầng / X-Ray, biểu đồ đường tách nhánh / cột đua / radar tự vẽ, bàn cân đối đầu, mạng lưới Hub / Flowchart, mô phỏng giao diện & con trỏ, dòng thời gian / Domino, bản đồ / Radar, thử nghiệm vật lý, quá tải→dọn sạch, trích dẫn nghiên cứu/báo chí).
- Tuyệt đối không làm các cảnh chỉ có hộp chữ tĩnh; không lặp lại cùng 1 kiểu minh hoạ ở 2 cảnh liên tiếp; chia nhịp Time-Coded Shot Sequence khớp từng giây với giọng đọc.

5. QUY CHUẨN KỸ THUẬT HYPERFRAMES & MOTION-STUDIO BẮT BUỘC:
- Mỗi cảnh có đúng 1 timeline GSAP paused: true đăng ký vào window.__timelines (seek-safe, deterministic).
- Không vẽ thanh .cm-topbar / .cm-footer kiểu slide; tiêu đề tiếng Việt in hoa dùng Be Vietnam Pro (weight 900, line-height 1.12–1.18); không dùng emoji cờ (vẽ bằng SVG); đảm bảo tương phản WCAG AA (dùng xanh đậm #136636 cho ô nhỏ, cam đậm #B83B0B trên nền kem).
- Không đặt transform trong CSS trên phần tử có GSAP tl.to(); gắn data-layout-allow-overlap / data-layout-allow-occlusion cho các xấp thẻ xếp chồng; trộn SFX đã cắt khoảng lặng đầu ở volume 0.38; lưu toàn bộ cache/temp tại D:\cache.
```

---

## MẪU 5: Video Documentary YouTube `16:9` (`1920×1080 @ 60fps`) & Tuỳ Chọn Bản Dọc `9:16` — Từ File Kịch Bản Docs + File Voice Thu Âm → Tìm Nguồn & Lập Bảng B-Roll → Dựng Motion Video
*(Dành cho video phóng sự / tài liệu / phân tích chuyên sâu từ kịch bản chữ và file voice: đối chiếu voice cấp cụm từ, tìm & xác minh nguồn B-roll YouTube/báo chí, dựng minh hoạ SVG đồng bộ nhịp nói, SFX dịu không át voice, kiểm chứng snapshot, render 60fps phân đoạn an toàn và tuỳ chọn xuất thêm bản dọc `9:16`)*

```text
Hãy thực hiện dự án video Documentary định dạng YouTube 16:9 (1920x1080 @ 60fps) từ file kịch bản "F:\duong-dan-kich-ban.docx" và file thu âm giọng đọc "F:\duong-dan-voice.mp3" theo phong cách creative-mode minh hoạ động (đọc kỹ FRAME.md và LESSONS_LEARNED.md trong workspace):

NGUYÊN TẮC CỐT LÕI VỀ VOICE & KIỂM CHỨNG TƯ LIỆU DOCUMENTARY (BẮT BUỘC TUÂN THỦ 100%):
- Lấy VOICE THỰC TẾ làm chuẩn tuyệt đối: Tuyệt đối KHÔNG tự ý cắt lời, đổi thứ tự câu, tăng/giảm tốc độ đọc, viết lại nội dung hay tạo giọng AI thay thế nếu chưa được tôi đồng ý.
- Phân biệt rõ 2 hệ Timecode trong toàn bộ dự án:
  + `VOICE IN–OUT`: Vị trí chèn hình trên timeline video của tôi (tính theo mốc giây thực tế của file voice).
  + `SOURCE IN–OUT`: Khoảng thời gian cần cắt lấy ở trong video nguồn (ví dụ lấy từ 01:12.0 đến 01:20.5 của video YouTube gốc).
- Xác minh thực tế & Không bịa đặt:
  + Timecode hoặc gợi ý ban đầu (nếu có) chỉ là đề xuất: bắt buộc phải nghe/bóc băng đối chiếu trực tiếp với file voice, kiểm tra trực tiếp đoạn video nguồn và căn lại điểm cắt chuẩn xác. Không mặc định mọi link, số liệu hoặc mô tả ban đầu đều đã được xác minh.
  + Ưu tiên tư liệu đúng nhân vật, đúng sự kiện, đúng địa điểm và đúng thời kỳ lịch sử. Video bổ sung ưu tiên nguồn YouTube, ghi rõ link và khoảng lấy `SOURCE IN–OUT`. Có thể đề xuất nguồn tốt hơn nhưng phải nêu rõ nguồn thay thế, lý do thay thế và shot nào bị ảnh hưởng.
  + TUYỆT ĐỐI KHÔNG bịa link, không bịa tiêu đề báo, không bịa số liệu hoặc cảnh quay.
  + Phân biệt và ghi nhãn rõ ràng bản chất tư liệu trong bảng B-Roll (KHÔNG in lên khung hình video): `Footage thật` / `Ảnh tư liệu` / `Mô hình 3D` / `Hình minh hoạ`.
  + Nếu phát hiện thông tin trong kịch bản sai lệch hoặc lời đọc trong file voice khác với văn bản kịch bản: phải báo cáo đúng mốc timecode `VOICE IN–OUT` và đề xuất phương án xử lý để tôi quyết định. TUYỆT ĐỐI KHÔNG âm thầm sửa chữ hiển thị trên hình trong khi vẫn giữ nguyên lời đọc gây mâu thuẫn giữa hình và tiếng.

GIAI ĐOẠN 1 — ĐỐI CHIẾU VOICE & KỊCH BẢN, TÌM NGUỒN VÀ XUẤT FILE BẢNG B-ROLL ĐỂ DUYỆT TRƯỚC:
1. Đồng bộ Kịch bản & Timestamp Voice ở cấp từng cụm từ (`VOICE IN–OUT` & Word/Phrase Timestamps):
   - Dùng `ffprobe` và công cụ bóc băng âm thanh Whisper (lưu cache tại `D:\cache\whisper`) ở cấp word/phrase timestamp để đối chiếu từng câu trong kịch bản với file voice thực tế, ghi nhận mọi chỗ đọc khác kịch bản (nếu có) và lưu lại mốc giây bắt đầu từng ý/từ khoá để chuẩn bị khớp nhịp motion ở Giai đoạn 2.
2. Tìm kiếm & Xác minh nguồn B-Roll theo từng ý trong lời thoại:
   - Thứ tự ưu tiên nguồn B-Roll: ƯU TIÊN SỐ 1 LÀ VIDEO TRÊN YOUTUBE (đúng nhân vật, sự kiện, địa điểm, thời kỳ); chỉ khi không có video phù hợp thì mới lấy Ảnh tư liệu độ phân giải cao hoặc Tiêu đề bài báo chính thống; những đoạn giải thích cơ chế/số liệu trừu tượng thì đánh dấu là `100% Full Motion`.
   - Tạo 1 file bảng tổng hợp B-Roll chi tiết (`B_ROLL_SHEET.md` trong thư mục dự án) gồm đầy đủ 6 cột:
     + Cột 1 (`STT & VOICE IN–OUT`): Vị trí chèn trên timeline của tôi (VD: `00:14.0 – 00:22.5`).
     + Cột 2 (`Nội dung Voice thực tế & Cảnh báo lệch kịch bản nếu có`): Trích nguyên văn câu đọc trong voice và mô tả cảnh cần hiển thị.
     + Cột 3 (`Phân loại bản chất tư liệu`): Ghi rõ `Video YouTube - Footage thật` / `Video YouTube - Mô hình 3D` / `Ảnh tư liệu thật` / `Tiêu đề bài báo thật` / `Hình minh hoạ` / `100% Full Motion`.
     + Cột 4 (`Link nguồn đã xác minh & Tên video/bài báo`): Đính kèm URL có thật (không bịa link) và phương án nguồn thay thế (nếu có).
     + Cột 5 (`SOURCE IN–OUT trên Video YouTube nguồn`): Khoảng thời gian lấy trong video nguồn (VD: `SOURCE IN–OUT: 01:12.0 – 01:20.5`) kèm mô tả khoảnh khắc hình ảnh tại đúng mốc giây đó.
     + Cột 6 (`Phương án kết hợp Motion theo Mẫu 3`): Ghi rõ dùng Cách A (B-roll tràn màn hình + Motion xung quanh), Cách B (Đóng khung hình chữ nhật lớn bo góc nhẹ cho B-roll + Motion xung quanh/đè viền), Evidence Clipping (Cắt tiêu đề bài báo + highlight vàng), hay 100% Full Motion (kèm tên nhóm trong 12 Nhóm Ẩn Dụ Thị Giác).
3. ĐIỂM DỪNG DUYỆT BẢNG B-ROLL (BẮT BUỘC):
   - Sau khi xuất xong `B_ROLL_SHEET.md` kèm danh sách các điểm lệch giữa voice và kịch bản (nếu có), DỪNG LẠI trình bày cho tôi kiểm tra và duyệt trước (tuyệt đối chưa tải video hàng loạt hay code cảnh khi tôi chưa duyệt).

GIAI ĐOẠN 2 — TẢI/CẮT B-ROLL & ÁP DỤNG QUY TRÌNH EDIT MOTION VIDEO CHUẨN MẪU SỐ 3 (SAU KHI TÔI DUYỆT BẢNG B-ROLL):
1. Quy trình kiểm tra & duyệt 3 bước của Motion Video (CẤM tự ý nhảy cóc render thẳng MP4):
   - Bước 1 (Tải/cắt B-Roll chuẩn keyframe theo `SOURCE IN–OUT` & Chốt Brief): Tải và cắt đúng đoạn YouTube theo `SOURCE IN–OUT` đã duyệt qua `D:\cache` vào `assets/broll/`. Khi cắt/xử lý B-roll, re-encode chuẩn keyframe đều (`-c:v libx264 -r 30 -g 30 -keyint_min 30 -movflags +faststart`) để tránh lỗi `sparse keyframes` gây chậm/đơ seek khi render 60fps. Kiểm tra khung hình thực tế (không đưa nhãn/logo thừa hay đoạn lỗi vào) rồi chốt `BRIEF.md`.
   - Bước 2 (Dựng & Duyệt Storyboard trực quan — Xem được ngay): Tạo `boards/storyboard.html` và `STORYBOARD.md` phác thảo bố cục từng cảnh theo đúng `VOICE IN–OUT`, ĐỒNG THỜI xuất kèm bộ ảnh chụp tổng quan/lưới PNG/JPG qua Chromium để tôi xem được trực tiếp ngay (không phụ thuộc trình xem HTML tương tác) rồi DỪNG LẠI chờ tôi duyệt Storyboard trước khi code các file scene animation.
   - Bước 3 (Code Scenes, Kiểm tra HyperFrames Check, Nghiệm thu Snapshot & Mở Studio Preview trước khi Render):
     + Sau khi tôi duyệt Storyboard, code các cảnh (`data-fps="60"`), khai báo đầy đủ biến `data-composition-variables` (nhãn tiếng Việt) trên `index.html`.
     + Chạy `npx --yes hyperframes@0.8.181 check` đạt **0 lỗi / 0 cảnh báo** (bao gồm đạt chuẩn tương phản WCAG AA) và chạy `sync-text.mjs --variables` khớp 100%.
     + Chụp snapshot bằng `hyperframes snapshot` tại cả trạng thái chuyển động lẫn **điểm dừng cuối (settled frame)** của các cảnh minh hoạ quan trọng để nghiệm thu trực quan lỗi dấu tiếng Việt, lỗi đè chữ và **kiểm tra logic chỉ hướng** (kim đồng hồ, mũi tên mốc năm, biểu đồ, cực pin...) trước khi giao cho tôi xem.
     + Mở HyperFrames Studio Preview (kèm các ảnh chụp nghiệm thu) để tôi kiểm tra và chỉnh sửa, và CHỈ RENDER XUẤT FILE MP4 CUỐI CÙNG ra `"F:\ten-video-output.mp4"` sau khi tôi xác nhận đồng ý xuất.

2. Bố cục xử lý cảnh có B-Roll, cảnh không có B-Roll & Khung hình sạch tuyệt đối:
   - CẤM CHỮ METADATA / NHÃN EDIT DƯ THỪA TRÊN VIDEO: Tuyệt đối KHÔNG in lên khung hình các chữ kiểu kỹ thuật/ghi chú như `SHOT #`, `SAMSUNG ARCHIVE` / `ARCHIVE`, `XÁC MINH TƯ LIỆU BÁO CHÍ`, `EVIDENCE`, `MINH HOẠ ĐỘNG`, `FULL MOTION`, `CÁCH A/B`. Mọi chữ trên màn hình 100% chỉ dành cho khán giả xem video.
   - Những phân đoạn KHÔNG có B-Roll (`100% Full Motion`): Dựng đại cảnh minh hoạ chuyển động trên nền giấy kem `#EFE9D9` (cảnh kết dùng nền xanh đậm `#136636`). PHẢI dựng hình khối SVG/vector có tạo hình cụ thể & chuyển động cơ học/thị giác rõ nét chiếm `50%–65%` khung hình (VD: đồng hồ kim quay thật, mặt cắt thiết bị, tàu, toà nhà, biểu đồ tự vẽ, cân đối trọng...), TUYỆT ĐỐI KHÔNG làm cảnh toàn các ô vuông đóng khung chữ đơn điệu.
   - Những phân đoạn CÓ B-Roll:
     + Cách A (B-roll toàn màn hình + Motion bao quanh): Giữ B-roll làm nền và chèn thẻ callout, mũi tên chỉ điểm SVG, thanh đo thông số hoặc nhãn phân tích (bo cong nhẹ 4 góc) ở vùng trống xung quanh, không che khuất chủ thể chính.
     + Cách B (Đóng khung hình chữ nhật lớn bo góc nhẹ cho B-roll + Motion xung quanh/đè viền): Đóng khung đoạn B-roll vào cửa sổ hình chữ nhật lớn bo cong nhẹ 4 góc (`border-radius: 18px–24px`, `overflow: hidden`), viền mực đen dày 5px (`#0F0F0F`) có bóng đổ khối cứng lệch góc (`#E85A1F`) đặt ở trung tâm trên nền giấy kem `#EFE9D9`. QUY TẮC B-ROLL LÀ NHÂN VẬT CHÍNH & KHÔNG CROP QUÁ NHIỀU: Khung B-roll chiếm phần lớn diện tích khung hình (`65%–80%` với 16:9, hoặc giữ nguyên tỷ lệ khung B-roll gốc `16:9` trên nền dọc `9:16`), giữ gần như trọn vẹn khung hình gốc để nhân vật/sự kiện rõ ràng, không crop mất chủ thể; các thẻ motion, nhãn phân tích, mũi tên vector hoặc biểu đồ có thể hiển thị xung quanh hoặc ĐÈ NHẸ LÊN VIỀN/GÓC CỦA KHUNG B-ROLL (gắn `data-layout-allow-overlap`) miễn là không che khuất nhân vật/vật thể chính ở trung tâm.

3. Nguyên tắc Đồng Bộ Voice, Creative-Mode, Sound Effect & Quy chuẩn Kỹ thuật HyperFrames:
   - ĐỒNG BỘ CHẶT VỚI VOICE (TUYỆT ĐỐI KHÔNG BUNG SỚM / FRONT-LOADING): Dựa trên word/phrase timestamp của file voice, từng hình minh hoạ, thẻ thông tin, đường biểu đồ hoặc kim đồng hồ CHỈ ĐƯỢC XUẤT HIỆN ĐÚNG LÚC HOẶC SAU KHI GIỌNG ĐỌC BẮT ĐẦU NÓI TỚI Ý ĐÓ (`t >= start_of_phrase + 0.05s`). Riêng các cảnh `100% Full Motion`, các cụm đồ hoạ/thẻ bắt buộc phải xuất hiện lần lượt theo tiến trình câu nói — TUYỆT ĐỐI KHÔNG hiện tất cả cùng một lúc ngay đầu cảnh.
   - ĐÚNG LOGIC HÌNH HỌC & NHÓM PHẦN TỬ SVG: Khi vẽ kim đồng hồ, mũi tên chỉ mốc thời gian, biểu đồ hoặc vật thể di chuyển (VD: hai điện cực pin ép vào nhau), phải tính đúng góc quay/toạ độ ứng với con số trong lời thoại và **gom cả hình khối + chữ nhãn bên trong vào cùng 1 thẻ `<g id="...">`** khi chạy animation để chữ không bị trôi lệch khỏi khối nền.
   - Bảng màu & Creative-Mode bo góc nhẹ: Nền giấy kem `#EFE9D9`, viền mực đen `#0F0F0F` dày 4px–5px, không blur, không gradient, tối đa 2–3 màu nhấn mỗi cảnh (`#1F8A4C`, `#F06CA8`, `#E85A1F`, `#F5C518`), bóng đổ khối cứng lệch góc màu Cam `#E85A1F` tối đa 1 khối tiêu điểm mỗi cảnh, đảm bảo Squint Test (1 tiêu điểm chính lớn gấp 3–5 lần thành phần phụ). Toàn bộ khung motion, khung B-roll, bài báo, thẻ text, bảng biểu và thanh đo BẮT BUỘC bo cong 4 góc nhẹ (`border-radius: 16px–24px` cho khung lớn/video; `12px–16px` cho thẻ nhỏ/badge; `999px` cho pill) — TUYỆT ĐỐI KHÔNG dùng `0px`.
   - Ánh xạ từng ý lời thoại sang 12 Nhóm Ẩn Dụ Thị Giác trong `FRAME.md`; không lặp lại cùng 1 kiểu minh hoạ ở 2 cảnh liên tiếp.
   - Tiếng Việt chuẩn dấu & Font đồng bộ: Nạp Google Fonts `Be Vietnam Pro` (`500–900`), khai báo `font-family: 'Be Vietnam Pro', sans-serif` đồng bộ cho CẢ HTML lẫn mọi thẻ `<text>` / `<div>` bên trong `<svg>` / `<foreignObject>`. Tiêu đề tiếng Việt in hoa dùng `Be Vietnam Pro` weight `900`, `line-height: 1.14–1.20` và đủ khoảng trống trên (`padding-top`) để không cắt/dính dấu mũ tiếng Việt (`Ể, Ằ, Ấ, Ứ, Ộ...`). Không dùng emoji cờ (vẽ bằng SVG); đảm bảo tương phản WCAG AA (`#136636`, `#B83B0B`).
   - Kỹ thuật GSAP & Layout HyperFrames: Mỗi cảnh có đúng 1 timeline GSAP `paused: true` đăng ký vào `window.__timelines`; không vẽ thanh `.cm-topbar` / `.cm-footer`; không đặt `transform` trong CSS trên phần tử có GSAP `tl.to()`; gắn `data-layout-allow-overlap` / `data-layout-allow-occlusion` cho xấp thẻ xếp chồng và thẻ đè viền khung B-roll.
   - Âm thanh SFX tinh gọn, đúng nhịp & không át voice: Cắt bỏ khoảng lặng đầu dưới `-38dB` (`4ms` fade-in), đồng bộ đúng thời điểm từng motion xuất hiện theo voice (`≤ 1 SFX` mỗi nhịp chính, không gán SFX vô cớ khi giữ B-roll tĩnh), và **phân cấp âm lượng mềm theo mức độ chuyển động (`0.07 – 0.24` so với `1.0` của giọng đọc)**: tiếng nền trầm `thump` ~`0.07`, `whoosh-short` ~`0.08–0.09`, `click-soft`/`pop` ~`0.16`, `chime`/`ping` điểm nhấn quan trọng ~`0.22–0.24` (tuyệt đối không để quá to gây chói hoặc át giọng đọc).
   - Toàn bộ cache/temp/frame extract lưu tại `D:\cache` (`TEMP`, `TMP`, `HF_HOME`, `Whisper`, `HYPERFRAMES_EXTRACT_CACHE_DIR`), tuyệt đối không dùng ổ `C:`.

4. Quy chuẩn Render 60fps Video Dài & Tuỳ chọn xuất thêm bản dọc `9:16` (KHI ĐƯỢC XÁC NHẬN RENDER):
   - Chuẩn bị trước render: Chạy `sync-text.mjs --variables` xác nhận khớp 100%, tạm đóng các phiên `hyperframes preview` đang mở để dồn toàn bộ GPU cho quá trình render.
   - Lệnh render 60fps ổn định cho video dài (> 5 phút): Render ở `--fps 60 --quality delivery` với `--frames-cache-dir "D:\cache\hf-render-cache"`, bật `$env:HF_SEGMENTED_CAPTURE = "true"` cùng `--resume` để trình duyệt tự tái tạo sạch theo phân đoạn và lưu checkpoint khôi phục được. Nếu trong video có đoạn B-roll mở đầu bằng khung tối / nền đen silhouette dễ bị bộ lọc kích thước `drawElement` báo nhầm `suspect small frame`, chuyển sang `--experimental-fast-capture=false` + `--resume` để giữ toàn bộ phân đoạn đã hoàn thành và render bằng chụp chuẩn xác.
   - Xuất file an toàn trên Windows & Nghiệm thu sau render: Luôn xuất vào thư mục con dự án (`renders/<ten>.mp4` — tránh lỗi Windows `EPERM: mkdir 'F:\'`), sau đó mới `Copy-Item` sang `"F:\ten-video-output.mp4"`. Bắt buộc kiểm chứng file MP4 thành phẩm bằng `ffprobe` (đúng phân giải, 60fps, codec H.264/AAC, đủ thời lượng gốc) và trích xuất lưới khung hình bằng `ffmpeg` vào `D:\cache` (không dùng `read_file` trực tiếp lên `.mp4`) để kiểm tra hình ảnh thực tế trước khi bàn giao.
   - (Nếu được yêu cầu xuất thêm bản dọc `9:16` — `1080×1920 @ 60fps`): Tạo dự án riêng dùng NTFS Directory Junction trỏ `assets/` sang dự án `16:9` (không nhân đôi file), giữ nguyên 100% file voice, các mốc `VOICE IN–OUT`, `data-composition-variables` và track SFX; thiết kế lại toàn bộ giao diện theo trục dọc nằm gọn trong **TikTok / Shorts Safe Zone** (`Top y >= 160px`, `Bottom y <= 1440px`, `Left x >= 120px`; nửa trên `y: 160..840` rộng tối đa `x <= 960px`; nửa dưới `y: 840..1440` rộng tối đa `x <= 760px` để né cột nút tương tác bên phải), đặt B-roll `16:9` trong Cách B giữ nguyên tỷ lệ không crop mất chủ thể, chạy `hyperframes check` + snapshot + mở Studio Preview cho tôi duyệt trước khi render bản `9:16`.
```
