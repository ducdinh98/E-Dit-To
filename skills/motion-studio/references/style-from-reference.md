# A look from the user's reference

The result is a `FRAME.md` in HyperFrames' design-spec format, saved in the library (`<library>/<name>/`, where `styles.mjs lib` says the library is), so this
video and every later one can use it. HyperFrames reads the frontmatter as brand truth (exact colours, fonts, weight
relationships) and the prose as intent; it lays out the frames itself.

## 1. Get the reference

Ask for one sentence on what they like about it: the colours, the type, the layout, the energy. A look is taken
from a reference; a specific piece is never copied (no one else's logo, characters or exact layouts).

| They give | Do |
|---|---|
| Screenshots or images | Read each image file directly. 3 to 5 is enough |
| A website link | `npx hyperframes capture <url> -o <library>/_refs/<slug>/capture`, then read its screenshots and extracted tokens. A single-page app's home page can come back empty: try a blog, press or docs page |
| A video file | `node <skill>/scripts/styles.mjs frames <file>`, then read `sheet.jpg` and a few stills full size |
| A YouTube or social link | If `yt-dlp` is installed, download it into `<library>/_refs/` and treat it as a video file; otherwise ask for the file or 3 to 5 screenshots. Claude can't watch a link |
| A Figma file | HyperFrames' `/figma` skill imports its tokens; use them as the frontmatter |
| A brand guide (PDF) | Read it for the hex values, fonts and do's and don'ts |

## 2. Read it like a designer

Write down, before choosing anything:

- **Palette:** sample the exact hex values from the images (background, text, one accent, a second accent at most,
  muted greys). Name them by role.
- **Type:** serif or sans, weight, case, tracking, how big the headline is against the frame. Name the nearest free
  Google Font for each role, and check it covers the language on screen (Vietnamese: Be Vietnam Pro, Inter,
  Montserrat, Playfair Display, Source Serif 4, IBM Plex, JetBrains Mono and many more do; some display faces don't).
- **Surfaces and texture:** flat or gradient, grain, shadows (soft, hard offset or none), borders, corner radius.
- **Layout:** centred or asymmetric, how much empty space, where text sits, grids and rules.
- **Motion** (from a video): what enters how, how fast, overshoot or not, how scenes cut. Motion isn't in the
  frontmatter; put it in the prose under a "Motion notes" section.

## 3. Write the FRAME.md

Start from the built-in preset closest to the reference (`styles.mjs list`, then copy its `FRAME.md` from
`styles.mjs path <name>`), and change it to match: the `name` and `description` (the description in Vietnamese, one
or two sentences, since the gallery shows it), every value under `colors`, the
`fontFamily` of each typography role (keep the role names), `components` that don't fit, and the prose sections (what
the look is, when to use it, do's and don'ts). Add at the end: `Made from: <reference>. What the user likes: <their
sentence>.` Keep the frontmatter valid YAML: quoted hex values, two-space indents.

## 4. Save it and show it

```
node <skill>/scripts/styles.mjs save <your FRAME.md> --name "<short name>" --refs <the reference images>
```

It reopens the gallery with the new look under "Phong cách của bạn". Ask whether it's right; adjust the card (not the
video) until it is, so the fix carries to every later video.
