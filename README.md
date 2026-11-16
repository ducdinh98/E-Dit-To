# Ê Đít Tơ (E-Dit-To) — Hệ Thống Kỹ Năng & Quy Chuẩn Dựng Motion Video Tự Động

Kho lưu trữ trọn bộ **22 kỹ năng (`motion-studio`, `hyperframes`, `creative-mode`...)**, bộ **5 Mẫu Câu Prompt chuẩn**, sổ tay **kinh nghiệm thực chiến (`LESSONS_LEARNED.md`)**, bộ công cụ **tiết kiệm token (`token-lite/`)** và **tài nguyên dùng chung (`assets/`)** để dựng Motion Video minh hoạ động bằng code (`HTML + Inline SVG + CSS + GSAP`) trên **HyperFrames**.

---

## Cấu trúc thư mục chính

- **[PROMPT_TEMPLATES.md](PROMPT_TEMPLATES.md)**: Bộ **5 Mẫu Câu chuẩn đầy đủ** cho 5 thể loại video, luôn tuân thủ quy trình duyệt 3 bước (`Brief` → `Storyboard` → `Studio Preview` → `Render Final`) và quy tắc bo cong nhẹ 4 góc:
  1. **Mẫu 1**: A-Roll Talking Head + B-Roll (`16:9`)
  2. **Mẫu 2**: A-Roll Tay cầm sản phẩm nói liên tục + B-Roll (`16:9`)
  3. **Mẫu 3**: Thuần 100% Voice-Off + B-Roll (`16:9` — Cách A tràn viền & Cách B đóng khung B-roll lớn chiếm 65%–80%, motion đè nhẹ viền khung)
  4. **Mẫu 4**: Video dọc `9:16` (`1080×1920`) cho YouTube Shorts & TikTok — Tuân thủ tuyệt đối `TikTok Safe Zone`
  5. **Mẫu 5**: Video Documentary YouTube `16:9` — Từ file Docs kịch bản + file Voice thu âm → Đối chiếu `VOICE IN–OUT` / `SOURCE IN–OUT`, tìm & xác minh nguồn YouTube/báo chí, xuất `B_ROLL_SHEET.md` duyệt trước → Dựng Motion theo Mẫu 3
- **[PROMPT_TEMPLATES_TOKEN_LITE.md](PROMPT_TEMPLATES_TOKEN_LITE.md)** & **[token-lite/](token-lite/)**: Phiên bản **Tiết Kiệm Token (giảm 50%–65% token)**:
  - `token-lite/PLAYBOOK_LITE.md`: Sổ tay nén 1 file duy nhất
  - `token-lite/shared/creative-mode.css` & `cm-helpers.js`: Thư viện CSS/GSAP dùng chung (tất cả khung bo cong nhẹ 4 góc, chống lỗi `gsap_css_transform_conflict`)
  - `token-lite/scripts/prep-video.mjs` & `proof-sheet.mjs`: Tự động chuẩn bị dự án, tách âm, xuất 1 ảnh contact sheet & ghép 1 ảnh lưới nghiệm thu
- **[LESSONS_LEARNED.md](LESSONS_LEARNED.md)**: Tổng hợp toàn bộ lỗi thực tế và quy tắc vàng rút ra từ các dự án thực chiến (WCAG AA, font `Be Vietnam Pro`, SVG cờ, xử lý `gsap_css_transform_conflict`, TikTok Safe Zone, xác minh tư liệu Documentary...).
- **[skills/](skills/)**: Trọn bộ 22 kỹ năng (`motion-studio`, `hyperframes`, `hyperframes-creative` với preset `creative-mode/FRAME.md` đã nâng cấp **28 Nhóm Ẩn Dụ Thị Giác** & quy tắc bo góc nhẹ, `hyperframes-animation`, `hyperframes-core`, `hyperframes-audio`, `hyperframes-keyframes`, `hyperframes-registry`, `faceless-explainer`, `embedded-captions`, v.v.).
- **[assets/](assets/)**:
  - `assets/TikTok+Safe+Zone.png`: Sơ đồ vùng an toàn `1080×1920` cho YouTube Shorts & TikTok
  - `assets/sfx/`: Bộ âm thanh hiệu ứng (`.wav`) đã cắt khoảng lặng đầu (`trim` / `fade`) để trộn trực tiếp vào timeline
- **[scripts/](scripts/)**: Các script tham khảo từ các dự án mẫu (`analyze-vo-beats.mjs`, `build-sfx.mjs`, `render-4k-30fps-ultra.mjs`, v.v.).
- **[install-skills.ps1](install-skills.ps1)**: Script PowerShell cài đặt/khôi phục nhanh toàn bộ 22 kỹ năng trên máy mới.

---

## Cài đặt / Khôi phục nhanh trên máy mới (Windows PowerShell)

```powershell
git clone https://github.com/ducdinh98/E-Dit-To.git
cd E-Dit-To
.\install-skills.ps1
```

Lệnh trên sẽ tự động sao chép toàn bộ 22 kỹ năng trong `skills\` vào `%USERPROFILE%\.gemini\config\skills\`.

### Lưu ý khi dùng `motion-studio`
Thư mục `.tools/` và `node_modules/` của `motion-studio` không được đẩy lên GitHub để giữ repo gọn nhẹ. Nếu cần chạy các script bên trong `motion-studio`, chạy `npm install` tại `%USERPROFILE%\.gemini\config\skills\motion-studio` hoặc làm theo `skills/motion-studio/INSTALL.md`.
