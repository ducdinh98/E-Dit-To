---
name: motion-studio
description: >-
  Start here when someone wants a new video made in Claude Code or Antigravity (an ad or promo,
  an animated chart or KPI clip, a product or feature intro, an announcement, an explainer, a
  social post, in 16:9, 9:16, 1:1 or 4:5): the style comes first, from a gallery of looks or from
  the user's own reference (screenshots, a website link or a video file), then the user describes
  the video in plain words, HyperFrames writes a detailed brief the user confirms, builds it, and
  opens its Studio editor for review, changes and export. Also installs itself from its zip next
  to the user's other skills (Node.js if missing, FFmpeg, HyperFrames' skills: INSTALL.md), saves
  looks for reuse, makes a music bed without an account, and makes one video per row of a
  spreadsheet. Talks to the user in Vietnamese, and fires on Vietnamese requests too ("làm cho
  mình một video quảng cáo", "video giới thiệu sản phẩm", "biểu đồ động"). Runs before the
  hyperframes skill and hands over to it; for edits to an existing HyperFrames project, use
  hyperframes directly. Not for editing filmed footage by hand.
---

# Make a video, style first

The making is done by HyperFrames (HeyGen's open-source video framework: a video is an HTML page, rendered on this
computer, edited in its Studio). This skill is the front door around it, so the process is the same every time:

1. **Style:** the user picks a look from the gallery, or brings a reference.
2. **Describe:** they say what the video is, in plain words, in one go.
3. **Brief:** HyperFrames turns that into a detailed brief; the user confirms it.
4. **Build:** HyperFrames builds it.
5. **Review, change, export:** in HyperFrames Studio, or by asking here.
6. **Next job:** `/clear`, then ask; the video carries over in its folder.

## Talk in Vietnamese

Everything the user reads is in Vietnamese unless they ask for another language: questions, plans, the brief
summary, progress, Studio tips, errors and the `/clear` line. That holds while following HyperFrames' skills too:
their questions and summaries are written in English, so say them in Vietnamese. Write like a Vietnamese peer talks:
"mình" for Claude and "bạn" for the user, full and plain sentences, English for the words people use at work (video,
brief, storyboard, font, preview, render, export, variables, voiceover), "phong cách" for a style, digits for
numbers, a comma before "và" in a list of three or more, no hype. HyperFrames Studio's own panels and buttons are in
English: name them as they appear (Design, Variables, Timeline, Export) and explain them in Vietnamese. The words on
screen follow the brief (an ad for Australia stays in English) whatever language the chat is in; quote them as they
will appear. Commands, file names and paths stay as they are.

Don't redo what HyperFrames does: its interview, brief, storyboard, build, checks, Studio and render belong to its
skills (`hyperframes` is the entry). This skill adds the setup, the style step and the library, a complete hand-off,
a music bed with no account, and the batch from a spreadsheet.

Scripts are in this skill's folder (`<skill>` below: `~/.claude/skills/motion-studio` for the usual install, next to
the user's other skills) and run with Node 22 or newer from the folder Claude Code is open in. Each video is a folder
in that folder's `videos/`; if it's the home folder, suggest a folder for videos first (for example
`Documents/Videos`).

| Command | What it does |
|---|---|
| `bash <skill>/scripts/install.sh` | One-time install (below): Node.js if missing, then `setup.mjs`. `--update` fetches HyperFrames' pinned skills again |
| `node <skill>/scripts/styles.mjs gallery --open` | `gallery.html` in the style library: every built-in look and the user's saved ones, opened in the browser |
| `node <skill>/scripts/styles.mjs lib` | Where the style library is (`<skill>/styles` for the usual install, `styles/` in the videos folder for a project install) |
| `node <skill>/scripts/styles.mjs list` / `path <name>` | The looks as text / where a look's `FRAME.md` is |
| `node <skill>/scripts/styles.mjs frames <video> [--count 12]` | Stills from a reference video and a contact sheet, in the library's `_refs/` |
| `node <skill>/scripts/styles.mjs save <FRAME.md> --name "<name>" [--refs a.png,b.png]` | Adds a look to the library (`<library>/<name>/`) |
| `node <skill>/scripts/music.mjs videos/<name> [--mood vibes]` | A music bed made on this computer (`assets/music.wav`), following the scenes. Moods: vibes, pulse, lofi, keys, pluck |
| `node <skill>/scripts/batch.mjs videos/<name> data.csv` | One MP4 per row, in `videos/<name>/renders/batch/` |
| `node <skill>/scripts/sync-text.mjs videos/<name>` | Before every render: a word retyped on Studio's canvas goes into its variable, a Variables edit into the scene. Exit 2 lists the ones to ask about |

## 0. Is it installed?

It is when HyperFrames' `hyperframes` skill sits next to this one (in the same `skills` folder, or the project's
`.claude/skills`) and Claude Code's settings for that place have `HYPERFRAMES_FFPROBE_PATH` and
`HYPERFRAMES_SKIP_SKILLS` in their `env`. If not (the skill was just unzipped), install it the way `INSTALL.md` says:
run `bash <skill>/scripts/install.sh`, then tell the user to start a new Claude Code session (new skills and settings
load at start) and continue there. The install brings a private Node.js 22 into `<skill>/.tools/node` when the
computer has none, FFmpeg and FFprobe from npm into the skill, HyperFrames' skills next to this one, and
`HYPERFRAMES_SKIP_SKILLS=1` so HyperFrames never installs skills anywhere else. It writes `env` into the settings and
a SessionStart hook (`scripts/session-env.sh`) that puts a private Node.js first on PATH for every command (an `env`
PATH doesn't reach commands: they take PATH from the user's shell) and keeps `npx hyperframes` on the pinned version.
It keeps a copy of Claude Code's user settings as `settings.json.before-motion-studio` the first time.

**HyperFrames is pinned** to the release in `package.json` (`hyperframesVersion`, 0.8.181): its skills come from that
release's tag, and every `npx hyperframes` in them now names that version. Run the CLI the same way
(`npx hyperframes@0.8.181 …`). Never run `npx hyperframes upgrade`, `skills update`, or anything `@latest`: newer
HyperFrames works differently from the process below (3 storylines and a SPEC instead of the brief), and a project's
own pin stays where `init` set it. Moving to a newer HyperFrames is a new Motion Studio release, tested first.

## 1. Style

Unless the request already names a look or brings a reference, run `styles.mjs gallery --open` and say:

> Mình vừa mở trang chọn phong cách trong trình duyệt. Bạn có 3 cách chọn:
> 1. Chọn một phong cách theo tên hoặc số thứ tự, ví dụ "Dùng phong cách coral".
> 2. Gửi cho mình 3 đến 5 ảnh chụp màn hình, một link website, hoặc một file video có phong cách bạn thích, kèm một
>    câu về điều bạn thích ở đó.
> 3. Hoặc nói "bạn chọn giúp mình".

- **A look from the gallery:** `styles.mjs path <name>` gives its `FRAME.md`. That's the style.
- **A reference:** make a look from it, the way `references/style-from-reference.md` says (images are read
  directly, a website goes through `npx hyperframes capture`, a video through `styles.mjs frames`), save it with
  `styles.mjs save`, reopen the gallery, and ask whether it's right before going on.
- **"Bạn chọn giúp mình"** (or "tuỳ bạn", "you choose"): no style; HyperFrames' design step picks one or shows mood boards (its "design picker").

## 2. Describe

Ask for everything still missing in **one** message, with a recommended answer for each so a "yes" is enough. Skip
what the request already said:

- What it's for: the one thing it must say, and the offer, price or numbers if any.
- Who watches and where: that sets the format (website, YouTube or a meeting screen: 16:9; Reels, TikTok or
  Shorts: 9:16; a feed post: 1:1 or 4:5).
- Length (20 to 30 s for an ad, 15 to 25 s for a chart, under 10 s for a sting or a title).
- Their material: logo, photos, screenshots, a website, data. Only what they give is used.
- The language of the words on screen.
- Review a storyboard first, or build it straight away? (A storyboard for anything over a few scenes.)

## 3. Hand over to HyperFrames

Load the `hyperframes` skill and follow it from "Fresh creation", passing one request that carries the style and
every answer, in the shape of `references/handoff.md`. With the design spec named and the run's shape stated, its
interview asks only what is still open, then shows the brief as one summary. The request also asks for every word,
number, colour and picture the user might change to be a HyperFrames variable: each then shows as one field in
Studio's Variables panel (retype a price and the video changes), and the same variables drive the spreadsheet batch.
Without them a counting price is eight separate letters in Studio's Design panel. **The user confirms the brief before
anything is built**: never write `BRIEF.md` yourself, and never skip HyperFrames' summary. Their corrections are
folded in and shown again, as its rules say.

## 4. Build

HyperFrames' workflow builds, checks and opens the Studio preview at its final look. Let it run its own steps. When
it's done, before the user edits anything, run `sync-text.mjs videos/<name> --variables` once: it records every
variable, so the sync before each export can tell a canvas edit from a Variables edit (step 5).

## 5. Review, change, export

When the preview opens, tell the user what they can do, in plain words (`references/review-and-export.md` has the
short version; a variable retyped in Studio shows in a scene once the preview plays or the playhead moves): click anything to move or resize it, change words, fonts and colours in Design, trim on the
timeline, Export; or ask here. Then:

- **Before any render** (the export, another resolution or format; `batch.mjs` does it itself): run
  `sync-text.mjs videos/<name>`. A word that is a variable sits in two places, the scene file and the variable's
  default on `index.html`. Studio 0.8.181 saves a word retyped on the canvas or in Design into the scene only, and the
  render (like Studio's preview once it reloads) takes the variable, so the edit would vanish; the script carries
  each change to the side that didn't change. If it exits 2, it wrote nothing for the words it lists: ask the user
  which wording to keep for each (quote both), rerun with `--canvas=<ids>` or `--variables=<ids>`, then render. A
  value retyped in Variables reaches the files only through "Set default", so a Variables change that the export
  lacks was probably never set.
- **Music:** HyperFrames' own music needs a HeyGen sign-in. If the video has none, run `music.mjs` (pick the mood
  with the user: vibes for most ads, pulse for corporate and data) and ask HyperFrames to place `assets/music.wav`
  under the whole video at full volume (it's already leveled to about -16 LUFS); its audio skill fades it and carves
  it under a voiceover. Say that Claude can't hear it: the
  user should listen.
- **Another format** (a 9:16 version of a 16:9 ad): a next job, so `/clear` first (step 7), then ask HyperFrames for
  it as a new version of the same film; it builds a sibling composition (`hyperframes-studio` covers follow-ons).
- **Other export settings:** `npx hyperframes render` (`--resolution`, `--fps`, `--quality draft|looks|delivery`,
  `--format mp4|mov|webm|gif`; MOV keeps transparency for laying over footage).
- **Many versions from a spreadsheet:** a next job, so `/clear` first (step 7). The words that change must be
  HyperFrames variables (the hand-off asks for them). `batch.mjs` takes a CSV whose columns are the variables, by id or by the label Studio shows, plus `name` for
  the file names. Before rendering, check what each row changes: a count or a colour in the words should also change
  the picture (the number of items drawn, text that stays readable on a new colour). If a scene doesn't read it from
  the variable, ask HyperFrames to make it, then batch.

## 6. Keep the look

If the user changed the look along the way (colours, fonts) and likes it, offer to save it for next time:
`styles.mjs save videos/<name>/frame.md --name "<name>"`. It shows under "Phong cách của bạn" in the gallery.

## 7. Start the next job with /clear

A video's state lives in its files (`BRIEF.md`, `frame.md`, the variables, `STORYBOARD.md`, the scenes), while every
call re-reads the whole conversation so far, so a second job in the same chat costs far more than the first. When
a video is delivered and the user wants another job (another format, a batch, re-rendering every version, or a new
video):

1. Write anything decided in the chat that isn't in the files yet (a new price, a dropped scene) into the project's
   `BRIEF.md`, as HyperFrames' write-back rule says.
2. Tell the user, in about these words:

   > Để làm tiếp, bạn hãy gõ `/clear` rồi nhắn yêu cầu kèm tên thư mục của video, ví dụ "làm bản 9:16 của
   > videos/<name>". Brief, phong cách, và các variables đều đã lưu trong thư mục đó, nên không mất gì cả, đồng
   > thời việc tiếp theo cũng tốn ít usage hơn nhiều so với tiếp tục trong cuộc trò chuyện dài này.

Small changes right after delivery (a word, a colour, a scene's timing) stay in the same chat. A new video always
starts with `/clear`.

## Pitfalls

- HyperFrames' skills are fetched again (the same pinned release) only through `install.sh --update`, because HyperFrames' own skill installs are off.
- HyperFrames collects anonymous usage data; `npx hyperframes telemetry disable` turns it off. Setup prints this;
  pass it on once.
- Studio 0.8.181 marks variables "unused" when the scenes read them in their own files (it only looks in
  `index.html`). They are in use; say so if the user asks.
- A website that doesn't load can't be captured; ask for screenshots instead.
- Rendering runs on this computer: slower than a cloud tool, and long or effect-heavy videos take minutes.
- Building counts toward the user's Claude plan. HyperFrames checks remaining usage itself (`npx hyperframes usage`).

## Production Guardrails (Bắt buộc áp dụng cho mọi video)

Chi tiết đầy đủ nằm trong `references/handoff.md` (mục *Quy chuẩn bắt buộc rút ra từ thực tế*). Tóm tắt các nguyên tắc bất di bất dịch:

1. **Không vẽ thanh trên/dưới kiểu slide (`01 // ...`, `01 • 10`):** Bỏ hoàn toàn `.cm-topbar` và `.cm-footer` trên khung hình video để giữ phần đầu và cuối khung hình sạch thoáng.
2. **Đồng bộ 100% animation & cắt cảnh theo từng câu/cụm từ giọng nói:** Cắt cảnh (`data-start` / `data-duration`) khớp chính xác nhịp nghỉ hết câu (`±0.05s`). Không bao giờ dồn mọi phần tử xuất hiện hết trong `1.0–1.5s` đầu cảnh; phải tách từng dòng tiêu đề, từng thẻ bước (`01 → 02 → 03`), từng dòng bảng so sánh để xuất hiện lần lượt đúng khoảnh khắc người nói đọc tới ý đó, với thời lượng tween mượt `0.48s–0.60s` (`power3.out`, `back.out(1.25)`, `circ.out`, `power2.out`).
3. **SFX tinh tế khớp 1:1 với chuyển động:** Dùng sample thật đã cắt khoảng lặng đầu (`pop`, `whoosh-short`, `click-soft`, `key-press`, `ping`, `chime`, `notification`) kết hợp `thump` trầm (`wav([oL, oR])`), đặt ở `data-volume="0.38"` dưới giọng nói (`1.0`). Không dùng white-noise `swish` dưới giọng nói.
4. **Tiếng Việt, Cờ SVG, Tương phản WCAG AA & StaticGuard:** Đặt `line-height: 1.12–1.18` cho chữ hoa tiếng Việt có dấu tầng (`Be Vietnam Pro` 900); dùng `<svg>` thay cho emoji `🇻🇳` trên Windows; bọc nhãn mono nhỏ trên nền `#1F8A4C` trong pill `#0F0F0F` và dùng `#136636` cho nền xanh kết cảnh (`54/54 WCAG AA`); đặt con dấu xoay cách mép `52px` (`scale <= 1.28`) và luôn chạy `hf.mjs check` đạt `0 errors, 0 warnings, 0 layout issues`.
