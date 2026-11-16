# Review, change and export

## What to tell the user when the preview opens

Keep it to this, in Vietnamese. Studio's panels and buttons are in English, so name them as Studio shows them:

> Video đã mở trong HyperFrames Studio. Bạn có thể tự sửa:
> - **Bấm vào bất cứ thứ gì** trong khung hình để di chuyển hoặc đổi kích thước.
> - **Variables:** giá, tên, tiêu đề, và màu sắc, mỗi thứ một ô. Gõ lại một ô, rồi bấm play (hoặc kéo đầu phát trên
>   Timeline) là bạn sẽ thấy cảnh đó thay đổi theo. Nhớ bấm "Set default" thì file xuất ra mới có chữ mới.
> - **Design** (bảng bên phải): đổi chữ, font, và màu của thứ bạn đang chọn. Chữ nào đã có ô trong Variables thì
>   bạn nên sửa ở Variables. Nếu bạn gõ lại chữ ngay trên khung hình, hãy nhờ mình xuất file: mình sẽ chép chữ đó
>   sang Variables trước, vì video xuất ra luôn lấy chữ trong Variables.
> - **Timeline:** kéo mép của một clip để cảnh đó dài hơn hoặc ngắn hơn.
> - **Export:** chọn định dạng và chất lượng, rồi lưu file MP4.
>
> Hoặc bạn cứ nhắn cho mình cần sửa gì ngay ở đây, ví dụ "cho chữ giá to hơn" hay "cảnh thứ hai chậm quá".

HyperFrames may also mention its free desktop app, where you chat with the video and draw on a frame to point at
something. Pass that on in Vietnamese: an option, not a requirement.

## Changes asked in the chat

Route them to HyperFrames' skills (an edit to an existing project goes straight to the edit, no interview). Say
what stays the same when it matters ("only the price, nothing else"). After each change, a still or the preview
shows it before a full render.

## Export settings

From the video's folder (the install's settings already point HyperFrames at FFmpeg), after
`node <skill>/scripts/sync-text.mjs videos/<name>` (SKILL.md, step 5: words retyped on the canvas go into their
variables first):

```
npx hyperframes render --quality delivery                          # the final MP4 in renders/
npx hyperframes render --resolution landscape-4k                   # 4K of a 16:9 video (portrait-4k, square-4k)
npx hyperframes render --fps 60
npx hyperframes render --format mov -o renders/overlay.mov         # transparent, for laying over footage
npx hyperframes render --format gif --fps 15                        # a GIF for a doc or a chat
```

Quality: `draft` for a quick look, `looks` (the default) for review, `delivery` for the final file.

The aspect ratio belongs to the composition: a 9:16 version of a 16:9 video is a new version of the film, not a
render flag. Ask HyperFrames for it.

## Many versions from a spreadsheet

1. The words, numbers, colours or pictures that change must be variables. Ask HyperFrames to make them variables
   (it declares them in `data-composition-variables` on `index.html`), and check them in Studio's Variables panel.
2. A CSV with one row per version: a column per variable (its id, or its label as Studio shows it, such as
   "Giá", or both parts of "Giá (Price)"), plus `name` for the file name. Excel's "CSV UTF-8" is fine. An empty cell keeps
   the default. Files come out as `0-<name>.mp4`, `1-<name>.mp4`... (HyperFrames counts from 0).
3. `node <skill>/scripts/batch.mjs videos/<name> data.csv` (`--dry` writes the rows without rendering).

Only what the composition reads from its variables changes per row: a count in the text won't redraw a picture of
that many items unless the scene is built from the variable.
