import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { mediaTools } from 'file:///C:/Users/Cong%20Duc/.gemini/config/skills/motion-studio/scripts/lib.mjs';
import { SR, wav } from 'file:///C:/Users/Cong%20Duc/.gemini/config/skills/motion-studio/scripts/sound.js';

const { ffmpeg } = mediaTools();
const voPath = 'F:/App nha lam/motion-video-demo/videos/viesnap-illustrated/assets/voiceover.mp3';
const scratch = 'C:/Users/Cong Duc/.gemini/antigravity/brain/bbfe727a-dcec-4197-bb7d-d882f0c9fe54/scratch';

const r = spawnSync(ffmpeg, ['-v', 'error', '-i', voPath, '-f', 'f32le', '-ac', '1', '-ar', String(SR), 'pipe:1'], {
  maxBuffer: 64 * 1024 * 1024,
  shell: false
});
const mono = new Float32Array(r.stdout.buffer, r.stdout.byteOffset, Math.floor(r.stdout.byteLength / 4));

// Exact sentence-aligned scene boundaries!
const scenes = [
  [1,  0.00, 4.95],  // "Ảo vãi! Nhiều anh em còn tải video theo cách cũ để dính logo và mờ căm như thế này cơ á?"
  [2,  4.95, 6.80],  // "Để tôi chỉ cho anh em cách tải nét căng, không dính logo, FREE, cả video, hình ảnh lẫn âm thanh để anh em làm nhạc chuông luôn nhá!" (4.95 -> 11.75)
  [3, 11.75, 9.45],  // "Rồi anh em cứ vào video bất kỳ, chọn chia sẻ, sao chép liên kết, xong mở web VieSnap lên, dán vào đây, ấn nút tải video HD hoặc là tải âm thanh, anh em ấn tải thế là xong!" (11.75 -> 21.20)
  [4, 21.20, 5.15],  // "Đây! Thành quả là chúng ta có một cái video với độ phân giải cao, rất nét và không hề dính logo TikTok một tí nào!" (21.20 -> 26.35)
  [5, 26.35, 9.50],  // "Các bạn cũng có thể áp dụng cách này để có thể tải ảnh về làm hình nền này, hoặc là tải âm thanh ở trên TikTok về làm nhạc chuông cho điện thoại luôn cũng được. Tất cả đã được tích hợp sẵn ở bên trong VieSnap rồi vậy nên là dùng rất là tiện." (26.35 -> 35.85)
  [6, 35.85, 4.75],  // "Ngoài TikTok ra thì VieSnap cũng hỗ trợ rất là nhiều những cái nền tảng khác nhau để cho các bạn có thể thoải mái sử dụng." (35.85 -> 40.60)
  [7, 40.60, 9.50],  // "Mà anh em đọc cái tên web cũng như là nhìn cái giao diện nó quen quen đúng không? Đúng rồi! Bởi vì đây là công cụ do người Việt làm ra, vậy nên là cái trải nghiệm sử dụng không thua kém gì so với cả hàng của thế giới!" (40.60 -> 50.10)
  [8, 50.10, 7.60],  // "Thậm chí là còn hơn luôn, bởi vì web này nhá: FREE và không hề có bất kỳ một cái quảng cáo nào bên trong giao diện web, vậy nên là dùng nó sướng cực kỳ các bạn ạ!" (50.10 -> 57.70)
  [9, 57.70, 8.55],  // "Vào website thôi là chúng ta đã thấy hình ảnh Trống Đồng rồi Bản đồ Việt Nam có đầy đủ Hoàng Sa, Trường Sa là tôi đã ưng rồi! Cộng một công cụ mà chắc chắn là tôi sẽ sử dụng một cách thường xuyên." (57.70 -> 66.25)
  [10, 66.25, 9.62], // "Vậy nên với những anh em nào mà thường xuyên tải video ở trên TikTok hoặc là những cái nền tảng khác như kiểu là Douyin này kia các thứ ấy, thì anh em hoàn toàn có thể sử dụng VieSnap nha! Người Việt Nam ưu tiên dùng hàng Việt Nam anh em ạ!" (66.25 -> 75.87)
];

for (const [id, st, dur] of scenes) {
  const i0 = Math.round(st * SR);
  const len = Math.min(mono.length - i0, Math.round(dur * SR));
  const L = new Float32Array(len);
  const R = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    L[i] = mono[i0 + i] * 0.9;
    R[i] = mono[i0 + i] * 0.85;
  }
  // Distinct ruler pips in R channel:
  // Whole second (0, 1, 2, ...): 1600Hz 28ms pip (and at 5.0s, double pip so it's unmistakable!)
  // Half second (.5): 880Hz 15ms pip
  // Quarter second (.25, .75): 520Hz 8ms soft tick
  for (let q = 0; q * 0.25 < dur; q++) {
    const t = q * 0.25;
    const mod4 = q % 4;
    const freq = mod4 === 0 ? (q === 20 ? 2000 : 1550) : mod4 === 2 ? 900 : 520;
    const pipDur = mod4 === 0 ? 0.026 : mod4 === 2 ? 0.015 : 0.008;
    const amp = mod4 === 0 ? 0.42 : mod4 === 2 ? 0.20 : 0.09;
    const p0 = Math.round(t * SR);
    const pN = Math.round(pipDur * SR);
    for (let k = 0; k < pN && p0 + k < len; k++) {
      const env = Math.sin((Math.PI * k) / pN);
      R[p0 + k] += amp * env * Math.sin((2 * Math.PI * freq * k) / SR);
    }
  }
  const wavPath = `${scratch}/v2-s${String(id).padStart(2, '0')}.wav`;
  const mp3Path = `${scratch}/v2-s${String(id).padStart(2, '0')}.mp3`;
  writeFileSync(wavPath, wav([L, R]));
  spawnSync(ffmpeg, ['-y', '-v', 'error', '-i', wavPath, '-b:a', '128k', mp3Path], { shell: false });
}
console.log('Generated 10 exact-boundary v2 ruler clips!');
