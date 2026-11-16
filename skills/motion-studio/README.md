# Motion Studio

Motion Studio là một skill miễn phí cho Claude Code (gõ `/motion-studio`) để làm video ngắn có chuyển động theo một
quy trình rõ ràng: bạn chọn phong cách, mô tả video bằng lời của mình, xác nhận một brief chi tiết, rồi Claude làm
video. Sau đó bạn xem lại, sửa bất cứ chỗ nào, và xuất ra file MP4. Skill chạy được với mọi gói trả phí của Claude,
trên cả Mac và Windows, và mọi thứ đều được render ngay trên máy của bạn.

Phần dựng video do HyperFrames đảm nhận (một framework làm video mã nguồn mở và miễn phí của HeyGen). Skill này lo
phần việc xung quanh: tự cài HyperFrames cùng mọi thứ nó cần, bắt đầu mọi video từ phong cách bạn chọn, và lưu lại những phong cách
bạn thích để dùng cho lần sau.

## Làm được những gì

Video quảng cáo, biểu đồ động cho buổi họp, video giới thiệu sản phẩm, thông báo, video giải thích, và bài đăng mạng
xã hội, ở khung 16:9, 9:16, 1:1 hoặc 4:5. Skill tạo chuyển động cho chữ, con số, hình khối, biểu đồ, logo, ảnh, và
ảnh chụp màn hình của bạn. Skill không làm được cảnh quay người thật hay địa điểm thật.

## Bạn cần có

- Claude Code với một gói trả phí (Pro, Max, Team hoặc Enterprise)
- Khoảng 700 MB dung lượng trống, phần lớn là bản Chrome chạy ngầm mà HyperFrames tải về ở lần đầu

Node.js và FFmpeg thì bạn không cần tự cài: nếu máy chưa có, Claude sẽ cài giúp bạn.

## Cài đặt (chỉ một lần)

1. Tải file `motion-studio-<phiên bản>.zip` về (link ở phần mô tả video).
2. Mở Claude Code ở thư mục bạn vẫn hay làm việc, kéo file zip vào khung chat, rồi nhắn "cài skill này giúp mình".
3. Claude sẽ cài skill vào cùng chỗ với các skill khác của bạn (`~/.claude/skills`), rồi tự cài mọi thứ cần thiết,
   kể cả Node.js nếu máy chưa có (1 bản riêng cho skill, không cần mật khẩu). Nếu Claude Code xin phép chạy lệnh, bạn
   cứ đồng ý. Lần đầu sẽ mất vài phút.
4. Cài xong thì bạn mở một phiên Claude Code mới là dùng được, ở bất cứ thư mục nào.

Mỗi video là một thư mục riêng trong thư mục `videos` ở chỗ bạn đang làm việc. Phong cách bạn lưu thì nằm cùng skill,
nên dùng được ở mọi thư mục.

## Làm một video

Bạn cứ nhắn yêu cầu bằng lời bình thường, ví dụ "làm cho mình một video quảng cáo 20 giây cho món cold brew mới của
quán cà phê". Sau đó:

1. **Chọn phong cách.** Trình duyệt sẽ mở một trang có tất cả phong cách xếp cạnh nhau. Bạn chọn một phong cách, hoặc gửi
   cho Claude 3 đến 5 ảnh chụp màn hình có phong cách bạn thích, một website, hoặc một file video, kèm một câu về điều
   bạn thích ở đó. Claude sẽ biến nó thành một phong cách và lưu vào thư viện cho lần sau. Còn nếu chưa biết chọn gì,
   bạn chỉ cần nói "bạn chọn giúp mình".
2. **Mô tả video.** Claude hỏi những gì còn thiếu trong một tin nhắn: video cần nói điều gì, ai xem và xem ở đâu, dài
   bao lâu, logo và hình ảnh của bạn, cũng như chữ trên video viết bằng ngôn ngữ nào.
3. **Xác nhận brief.** Claude cho bạn xem kế hoạch: thông điệp, các cảnh, khung hình, và độ dài. Bạn chưa đồng ý thì
   Claude chưa làm gì cả.
4. **Claude làm video,** rồi mở trình chỉnh sửa (HyperFrames Studio) trong trình duyệt.
5. **Xem lại và sửa.** Gõ lại giá, tên hay tiêu đề trong bảng Variables rồi bấm play là bạn sẽ thấy video thay đổi
   theo. Sau đó bấm "Set default" để file xuất ra giữ chữ mới. Bạn cũng có thể bấm vào bất cứ thứ gì để di chuyển hay
   đổi kích thước, đổi font và màu, cắt ngắn các cảnh trên Timeline, hoặc đơn giản là nhắn cho Claude biết cần sửa gì.
   Xong thì nhờ Claude xuất ra file MP4. Nếu bạn có gõ lại chữ ngay trên khung hình, Claude sẽ chép chữ đó sang
   Variables trước khi xuất.
6. **Thêm nhạc** nếu bạn muốn: Claude tạo một đoạn nhạc nền ngay trên máy (không cần tài khoản hay license) và lồng vào
   video. Bạn nhớ nghe thử nhé, vì Claude không nghe được.
7. **Làm việc tiếp theo? Gõ `/clear` trước.** Khi một video đã xong và bạn muốn làm thêm một phiên bản khác, làm
   hàng loạt, hay làm video mới, hãy gõ `/clear` để bắt đầu cuộc trò chuyện mới, rồi nhắn yêu cầu kèm tên thư mục của
   video (ví dụ "làm bản 9:16 của videos/my-ad"). Brief, phong cách, và các ô chỉnh sửa đều đã lưu trong thư mục đó,
   nên không mất gì cả, đồng thời mỗi việc sẽ tốn ít usage hơn nhiều so với làm tiếp ở cuối một cuộc trò chuyện dài.

## Làm thêm

- Bản 9:16 cho Reels và TikTok: nhắn cho Claude sau khi bản 16:9 đã xong.
- 10 phiên bản từ một bảng tính: gửi cho Claude một file CSV, mỗi dòng là một phiên bản, các cột đặt tên giống các ô
  trong bảng Variables ("Giá", "Tiêu đề"...), thêm một cột "name" để đặt tên file. Ô nào để trống thì giữ nguyên như
  bản gốc.
- Video nền trong suốt để đặt lên video quay của bạn trong phần mềm dựng video: nhờ Claude xuất file MOV.
- Voiceover của riêng bạn: công cụ âm thanh của HyperFrames sẽ đặt giọng vào và hạ nhạc xuống bên dưới giọng nói.

## Lưu ý

- Làm video sẽ tính vào usage trong gói Claude của bạn, và mỗi lần dựng là một việc khá nặng. Vậy nên bạn hãy chốt
  kế hoạch bằng lời trước, sửa chữ và giá trong trình chỉnh sửa (không tốn usage), và bắt đầu mỗi việc mới bằng
  `/clear`.
- Video được render trên máy của bạn, nên video dài hoặc nhiều hiệu ứng sẽ mất vài phút.
- Trình chỉnh sửa HyperFrames Studio có giao diện tiếng Anh (Design, Variables, Timeline, Export); Claude sẽ giải
  thích từng phần bằng tiếng Việt khi mở.
- HyperFrames gửi dữ liệu sử dụng ẩn danh; muốn tắt thì chạy `npx hyperframes telemetry disable`.
- Skill dùng cố định HyperFrames bản 0.8.181, đúng bản trong video, vì các bản mới hơn làm việc theo cách khác. Khi
  chuyển sang bản mới, mình sẽ ra 1 bản Motion Studio mới.
- Muốn gỡ, bạn nhờ Claude gỡ skill Motion Studio cùng các skill của HyperFrames đi kèm.
