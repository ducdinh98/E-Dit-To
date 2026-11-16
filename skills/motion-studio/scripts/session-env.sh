#!/usr/bin/env bash
# SessionStart hook, added to Claude Code's settings by setup.mjs. Claude Code sources $CLAUDE_ENV_FILE before every
# command it runs, so this:
#   - puts the skill's own Node.js first on PATH when install.sh brought one (an `env` PATH in the settings never
#     reaches commands: they take PATH from the user's shell; tested 25 Oct)
#   - keeps `npx hyperframes ...` on the HyperFrames version this skill pins (package.json "hyperframesVersion"),
#     even when it's typed from memory rather than from the rewritten skills
[ -n "${CLAUDE_ENV_FILE:-}" ] || exit 0
skill="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
pin="$(sed -n 's/.*"hyperframesVersion": *"\([^"]*\)".*/\1/p' "$skill/package.json" | head -n1)"
{
  if [ -x "$skill/.tools/node/bin/node" ]; then echo "export PATH=\"$skill/.tools/node/bin:\$PATH\""; fi
  if [ -f "$skill/.tools/node/node.exe" ]; then echo "export PATH=\"$skill/.tools/node:\$PATH\""; fi
  if [ -n "$pin" ]; then
    echo "npx() { if [ \"\$1\" = hyperframes ]; then shift; command npx hyperframes@$pin \"\$@\"; elif { [ \"\$1\" = -y ] || [ \"\$1\" = --yes ]; } && [ \"\$2\" = hyperframes ]; then shift 2; command npx -y hyperframes@$pin \"\$@\"; else command npx \"\$@\"; fi; }"
  fi
} >> "$CLAUDE_ENV_FILE"
exit 0
