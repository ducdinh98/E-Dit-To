# Installing Motion Studio (for Claude Code)

The user gave you this skill's zip (`motion-studio-<version>.zip`) and asked you to install it, in words like "cài
skill này giúp mình". Do this, and talk to them in Vietnamese the whole time:

1. **Unzip it next to their other skills:** into `~/.claude/skills/`, so this folder becomes
   `~/.claude/skills/motion-studio/` (Windows: `%USERPROFILE%\.claude\skills\motion-studio`; under
   `$CLAUDE_CONFIG_DIR/skills/` if that is set). Use `unzip`, or `ditto -x -k` on a Mac, or PowerShell's
   `Expand-Archive` on Windows. If `motion-studio/` is already there (an update), unzip over it and keep its `styles/`
   (their saved styles), `.tools/` and `node_modules/`. If it is a link to somewhere else (a developer's own copy),
   stop and ask before touching it. Only if they ask to keep the skill to one project, unzip into
   that project's `.claude/skills/` instead.
2. **Run its install,** from any folder:

   ```
   bash ~/.claude/skills/motion-studio/scripts/install.sh
   ```

   It takes a few minutes the first time. If the computer has no Node.js 22 or newer, it downloads the official
   Node.js 22 from nodejs.org into the skill's `.tools/node` (checked against nodejs.org's checksums, no admin
   password). Then it installs FFmpeg and FFprobe into the skill, puts HyperFrames' skills next to this one (the
   release this skill is pinned to, 0.8.181), writes
   their settings into Claude Code's user settings (`~/.claude/settings.json`, after keeping a copy as
   `settings.json.before-motion-studio`): `env` for HyperFrames, plus a small SessionStart hook that keeps
   `npx hyperframes` on the pinned version and puts the private Node.js first on PATH when it brought one. Then it checks HyperFrames, which downloads a background Chrome once. If Claude
   Code asks for permission to run it, say it's this skill's own install.
3. **Tell them how it went:**
   - It ends with "Xong": in about these words, "Cài xong rồi. Bạn hãy mở 1 phiên Claude Code mới (để Claude nạp skill
     vừa cài), rồi nhắn cho mình video bạn muốn làm, ví dụ "làm cho mình 1 video quảng cáo 20 giây cho quán cà phê"."
     Add the line about HyperFrames' anonymous usage data that the install printed. Don't start a video in this session.
   - It lists "LỖI" lines: what each one means and how to fix it, in plain words; fix what you can, then run the
     install again.
