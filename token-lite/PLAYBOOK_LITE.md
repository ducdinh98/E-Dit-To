# PLAYBOOK LITE — Creative-Mode Motion Video (Phiên Bản Tiết Kiệm Token)

> **QUY TẮC TIẾT KIỆM TOKEN CHO AI**: Khi chạy quy trình `token-lite`, **CHỈ ĐỌC DUY NHẤT FILE NÀY** làm chuẩn thiết kế & kỹ thuật. Không đọc lại các file `SKILL.md`, `FRAME.md` hay `LESSONS_LEARNED.md` dài dòng trừ khi gặp lỗi lạ chưa có trong danh mục dưới đây.

---

## 1. ADN Thiết Kế Gốc `creative-mode` (Bất Di Bất Dịch)
- **Bảng màu chuẩn & Tương phản WCAG AA (Bắt buộc đạt 100%):**
  - Nền giấy kem chính: `#EFE9D9` (`--cm-paper`) | Nền cảnh Kết/Verdict: `#136636` (`--cm-green-dark`)
  - Mực/Viền đen: `#0F0F0F` (`--cm-ink`) | Khối phụ: `#E3DCC8` (`--cm-paper-alt`)
  - 4 Màu nhấn (Tối đa 2–3 màu nhấn/cảnh):
    1. Xanh lá: `#1F8A4C` (Ô nhỏ có chữ trắng `< 24px` bắt buộc dùng `#136636` để đạt chuẩn AA `>= 4.5:1`)
    2. Hồng: `#F06CA8` (Đi kèm chữ đen `#0F0F0F`)
    3. Cam: `#E85A1F` (Chữ cam đứng trực tiếp trên nền kem `#EFE9D9` bắt buộc dùng `#B83B0B` để đạt chuẩn AA `>= 3.0:1`)
    4. Vàng: `#F5C518` (Đi kèm chữ đen `#0F0F0F`)
- **Hình khối Neo-Brutalist Bo Góc Nhẹ:**
  - Viền mực đen đặc `4px–5px solid #0F0F0F`.
  - **Bo cong nhẹ 4 góc cho toàn bộ khung (Không dùng góc vuông `0px`)**: `border-radius: 16px–24px` cho khung lớn và khung đóng cửa sổ video B-roll (`.cm-broll-window`, `.cm-card-featured`); `border-radius: 12px–16px` cho khung thẻ text/motion nhỏ, badge và thanh đo (`.cm-card`, `.cm-badge`, `.cm-meter-track`); `border-radius: 999px` cho thẻ `.cm-pill`.
  - **Không `blur`, không `gradient`, không bóng mềm.**
  - **Bóng đổ khối cứng lệch góc:** Mỗi cảnh chỉ có **tối đa 1 khối tiêu điểm** dùng `.cm-card-featured` (`box-shadow: 10px 10px 0 #E85A1F, 10px 10px 0 3px #0F0F0F`); các thẻ phụ dùng bóng đen mỏng `6px 6px 0 #0F0F0F` hoặc phẳng.
- **Typography & Tiếng Việt:**
  - Tiêu đề lớn tiếng Việt có dấu: dùng `Be Vietnam Pro` (`font-weight: 900`, `line-height: 1.15`, `letter-spacing: -0.02em`) để không bao giờ vỡ dấu.
  - Số lớn / VS / %: dùng `Archivo Black`. Nhãn kỹ thuật / bước / thông số: dùng `JetBrains Mono` (`font-weight: 700–800`).
- **Bố cục & Squint Test:**
  - 1 tiêu điểm chính lớn gấp `3–5×` thành phần phụ; chừa `30%–45%` nền giấy kem thoáng.
  - **CẤM** vẽ thanh `.cm-topbar` hoặc `.cm-footer` chạy ngang kiểu slide thuyết trình.
  - **CẤM** dùng emoji cờ quốc gia (như `🇻🇳`, `🇺🇸`) — phải vẽ bằng inline `<svg>`.

---

## 2. Bảng 28 Nhóm Ẩn Dụ Thị Giác Động (Chọn Theo Ý Lời Thoại — Không Lặp Lại Ở 2 Cảnh Liên Tiếp)
1. **Dây chuyền / Băng tải & Cổng quét (`svg-pipeline-machine`)**: Giải thích quy trình, thuật toán, luồng xử lý đầu vào → đầu ra.
2. **Phân loại thẻ & Thanh đo / Đồng hồ kim quay (`card-sorter-meter`)**: Chấm điểm tiêu chí, 3 câu hỏi kiểm chứng, đếm cộng dồn mức độ.
3. **Mặt cắt X-Ray / Kiến trúc 3 tầng (`svg-cross-section`)**: Mổ xẻ phần cứng (pin, chip, camera), cấu trúc hệ thống, tầng sâu bên trong.
4. **Biểu đồ tự vẽ (`svg-dataviz-chart`)**: Biểu đồ đường tách nhánh (`stroke-dashoffset`), cột đua, bánh rán, radar tăng trưởng/suy giảm.
5. **Bàn cân đối đầu / Rớt giá & Kéo cắt Voucher (`balance-scale-vs`)**: Đặt 2 sản phẩm/lựa chọn lên bàn cân nghiêng hoặc thanh trượt giá rơi.
6. **Mạng lưới Hub & Flowchart (`constellation-flowchart`)**: Hệ sinh thái, kết nối đa thiết bị, sơ đồ rẽ nhánh quyết định.
7. **Mô phỏng Giao diện & Con trỏ (`ui-cursor-simulator`)**: Cửa sổ trình duyệt/chat/terminal bo góc nhẹ, gõ chữ, con trỏ SVG click nút.
8. **Dòng thời gian & Hiệu ứng Domino (`spatial-timeline-domino`)**: Lịch sử phát triển, lộ trình, chuỗi nguyên nhân → kết quả đổ domino.
9. **Bản đồ Không gian & Radar (`geo-map-radar`)**: Độ phủ thị trường, định vị, vòng sóng radar quét toả tròn.
10. **Thử nghiệm Vật lý & Độ bền (`physics-stress-test`)**: Tia nước IP69 bắn bật lại, tia sét sạc nhanh bơm đầy pin, góc rộng mở quạt `100°`.
11. **Quá tải Hỗn loạn → Dọn Sạch (`overwhelm-to-clarity`)**: 6–8 thẻ cảnh báo rối rắm bị gạt phăng, nhường chỗ cho 1 giải pháp gọn sắc nét.
12. **Bằng chứng Báo chí / Hoá đơn (`evidence-clipping-receipt`)**: Mảnh báo + bút dạ quang vàng quét ngang hoặc hoá đơn cộng tổng.
13. **Bản đồ Đại cảnh & Camera Pan Đa Trạm (`spatial-pan-stations`)**: Mặt phẳng lớn gấp 3–4× màn hình gồm nhiều trạm nối nhau; camera ảo lướt ngang/chéo theo lời đọc.
14. **Cú Zoom-Out Lộ Diện Toàn Cảnh (`zoom-out-workspace-reveal`)**: Mở đầu cận cảnh 1 chi tiết nhỏ rồi kéo lùi camera lộ ra cả đế chế/hệ sinh thái khổng lồ.
15. **Cuộn Dài Hồ Sơ & Phóng To Điểm Đắt Giá (`transcript-scroll-artifact-reveal`)**: Cuộn dọc qua báo cáo/hợp đồng dài rồi dừng gấp, phóng to + tô dạ quang dòng quyết định.
16. **Phễu Lọc & Thác Chảy Hao Hụt (`funnel-sankey-flow`)**: Dòng hạt qua từng tầng phễu lọc hoặc luồng Sankey chia tách doanh thu → chi phí → lợi nhuận ròng.
17. **Lưới 100 Ô Tỷ Lệ (`waffle-grid-proportion`)**: Mạng lưới `10×10` ô bo góc nhẹ quét sóng đổi màu đúng theo phần trăm thị phần/thống kê.
18. **Đồng Hồ Công-Tơ-Mét / Máy Cuộn Số (`odometer-slot-ticker`)**: Bánh xe chữ số cuộn dọc tốc độ cao rồi khớp lệnh dừng ở con số chốt.
19. **Tảng Băng Chìm 2 Tầng (`iceberg-surface-vs-depth`)**: Phần nổi nhỏ trên mặt nước (quảng cáo/bề nổi), trượt xuống dưới mặt nước lộ khối băng khổng lồ (sự thật ngầm).
20. **Thanh Gạt Cắt Ngang Trước–Sau / Kính Lúp Soi (`split-wipe-loupe`)**: Thanh gạt dọc hoặc thấu kính lúp tròn quét đối chiếu Thế hệ cũ vs. Mới / Quảng cáo vs. Thực tế.
21. **Mô Hình Bóc Tách Đa Lớp (`exploded-layer-stack`)**: Thân máy/hệ thống tách rời 3–4 lớp xếp chồng chéo kèm đường chỉ dẫn ghi chú từng lớp.
22. **Thanh Kéo Biến Đổi Thời Gian Thực (`panel-edit-live-sync`)**: Kéo thanh trượt thông số bên trái làm biểu đồ/sản phẩm bên phải biến đổi tức thì.
23. **Cú Húc Va Chạm Chiếm Chỗ (`ticker-takeover-collision`)**: Nhân vật chính/câu trả lời thật lao mạnh vào húc văng các thẻ suy đoán cũ để chiếm trung tâm.
24. **Bảng Điều Tra Nối Dây Đỏ (`detective-evidence-board`)**: Ghim thẻ nhân vật/công ty/sự kiện kèm sợi dây đỏ SVG tự vẽ nối mối quan hệ (rất mạnh cho Mẫu 5 Documentary).
25. **Hồ Sơ Nhân Vật / Thẻ Chỉ Số (`character-dossier-card`)**: Tập hồ sơ mở ra gồm ảnh nhân vật/CEO, năm, thanh chỉ số và con dấu đóng mạnh.
26. **Cây Phả Hệ & Sơ Đồ Thâu Tóm M&A (`acquisition-tree-merge`)**: Sơ đồ phân nhánh công ty mẹ → con hoặc hút hợp nhất các công ty nhỏ vào tập đoàn lớn.
27. **Trụ Cố Định – Vạn Vật Xoay Vòng (`fixed-anchor-cycle`)**: 1 thẻ/biểu tượng bất động ở giữa trong khi bối cảnh thời kỳ hoặc đối thủ xoay vòng xung quanh.
28. **Khung Đối Thoại / Tranh Luận 2 Chiều (`chat-debate-thread`)**: Bong bóng tin nhắn bo góc nhẹ nảy luân phiên trái–phải giữa 2 phe quan điểm.

---

## 3. Quy Tắc Bố Cục A-Roll / B-Roll & Tối Ưu Số File (Kiến Trúc Gộp Cảnh Tiết Kiệm Token)
- **Tối ưu cấu trúc file (Giảm 40%–50% token):**
  - **Không tách file sub-composition riêng cho các đoạn Pass-through** (Intro, Outro, bảng Voucher Shopee, đoạn show ảnh/video chụp thử) — đặt trực tiếp trên video gốc ở `index.html`.
  - **Gộp các thẻ nổi 2 bên A-Roll / B-Roll** có thời lượng ngắn gần nhau vào cùng 1 lớp overlay hoặc gộp theo chương (Macro-Scene), chỉ tách file `compositions/scene-XX.html` riêng cho các đại cảnh **Full Motion** hoặc cụm phân tích lớn.
- **Vùng an toàn khi đè lên A-Roll / B-Roll:**
  - Thẻ motion chỉ nằm ở 2 cánh trái/phải (`x: 56..460px` hoặc `x: 1420..1864px`), **tuyệt đối không che mặt người nói, không che bàn tay/sản phẩm ở giữa, không đè nhãn mục góc dưới trái** (`x < 420px, y > 880px`).

---

## 4. Quy Chuẩn Kỹ Thuật HyperFrames & Quy Trình Duyệt 3 Bước (0 Lỗi Ngay Lần Đầu)
1. **Quy trình duyệt 3 bước chuẩn `motion-studio` & `hyperframes` (CẤM tự ý render thẳng MP4 khi chưa duyệt):**
   - **Cổng 1 (Duyệt Brief)**: Chạy `node token-lite/scripts/prep-video.mjs "<input.mp4>" "<slug>"` + bóc băng lời thoại, lập bảng Brief phân cảnh chi tiết rồi **DỪNG LẠI chờ người dùng xác nhận Brief** trước khi tạo `BRIEF.md`.
   - **Cổng 2 (Duyệt Storyboard)**: Sau khi duyệt Brief, dựng `boards/storyboard.html` & `STORYBOARD.md`, mở/chụp cho người dùng xem và **DỪNG LẠI chờ người dùng duyệt Storyboard** trước khi code các `scene-XX.html`.
   - **Cổng 3 (Check, Studio Preview & Chờ lệnh Render)**: Code `index.html` và các `scene-XX.html` (dùng `creative-mode.css` + `cm-helpers.js`), chạy `npx --yes hyperframes@0.8.181 check` (0 lỗi), `sync-text.mjs --variables`, ghép 1 ảnh nghiệm thu `proof-sheet.mjs` + mở Studio Preview, rồi **CHỈ RENDER MP4 CUỐI CÙNG khi người dùng xác nhận đồng ý xuất**.
2. **Dùng thư viện có sẵn**: Luôn nhúng `<link rel="stylesheet" href="assets/creative-mode.css">` và `<script src="assets/cm-helpers.js"></script>` trong các cảnh để không phải viết lại CSS/JS cơ bản.
3. **Không xung đột Transform (`gsap_css_transform_conflict`)**: **CẤM** viết `transform: ...` trong CSS trên bất kỳ phần tử nào có dùng `tl.to()` hoặc `CM.popIn` / `CM.fillBar`. Đặt trạng thái đầu bằng `tl.set(..., 0)`.
4. **Thẻ xếp chồng (`content_overlap` / `text_occluded`)**: Mọi xấp thẻ đè lên nhau (như bộ bài/thẻ phân loại) bắt buộc gắn `data-layout-allow-overlap` và `data-layout-allow-occlusion`.
5. **Biến Studio (`data-composition-variables`)**: Khai báo biến JSON trên `index.html` và chạy `sync-text.mjs --variables` sau khi dựng xong.
