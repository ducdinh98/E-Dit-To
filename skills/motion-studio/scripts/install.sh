#!/usr/bin/env bash
# First-time install of Motion Studio, after its zip is unzipped (INSTALL.md). Run from the folder Claude Code is in:
#   bash ~/.claude/skills/motion-studio/scripts/install.sh [--update]
# Mac, Linux, and Windows (Claude Code runs its commands in Git Bash there). Uses the computer's Node.js if it is 22
# or newer; otherwise downloads the official Node.js 22 build from nodejs.org into the skill's .tools/node, checked
# against nodejs.org's SHA-256 list: no admin password, nothing installed system-wide. Then runs setup.mjs with that
# Node, which also puts it first on PATH in Claude Code's settings, so from the next session on every command
# (HyperFrames' npx included) finds it.
set -euo pipefail

skill="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
if [ ! -f "$skill/scripts/setup.mjs" ]; then
  echo "LỖI  Không thấy setup.mjs trong $skill: hãy giải nén lại file zip của Motion Studio."
  exit 1
fi
local_node="$skill/.tools/node"

case "$(uname -s)" in
  Darwin) os=darwin; ext=tar.gz ;;
  Linux) os=linux; ext=tar.xz ;;
  MINGW* | MSYS* | CYGWIN*) os=win; ext=zip ;;
  *) echo "LỖI  Hệ điều hành này chưa được hỗ trợ: $(uname -s)"; exit 1 ;;
esac
case "$(uname -m)" in
  arm64 | aarch64) arch=arm64 ;;
  x86_64 | amd64) arch=x64 ;;
  *) echo "LỖI  Loại máy này chưa được hỗ trợ: $(uname -m)"; exit 1 ;;
esac
if [ "$os" = win ]; then bin="$local_node"; exe="$bin/node.exe"; else bin="$local_node/bin"; exe="$bin/node"; fi

# the major version of a node binary, 0 if it doesn't run
major() { "$1" -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0; }

node_cmd=""
if [ -x "$exe" ] && [ "$(major "$exe")" -ge 22 ]; then
  node_cmd="$exe"                                        # brought on an earlier run
elif command -v node >/dev/null 2>&1 && [ "$(major node)" -ge 22 ]; then
  node_cmd="node"                                        # the computer's own Node.js
fi

if [ -z "$node_cmd" ]; then
  echo "Máy chưa có Node.js 22 trở lên, nên mình tải 1 bản Node.js 22 riêng cho skill (bản chính thức của nodejs.org, khoảng 30 MB)..."
  base="https://nodejs.org/dist/latest-v22.x"
  sums="$(curl -fsSL "$base/SHASUMS256.txt")" || { echo "LỖI  Không kết nối được tới nodejs.org: hãy kiểm tra mạng rồi chạy lại."; exit 1; }
  file="$(printf '%s\n' "$sums" | awk -v want="-$os-$arch.$ext" '$2 ~ /^node-v22\./ && substr($2, length($2) - length(want) + 1) == want { print $2; exit }')"
  want_sum="$(printf '%s\n' "$sums" | awk -v f="$file" '$2 == f { print $1; exit }')"
  if [ -z "$file" ] || [ -z "$want_sum" ]; then echo "LỖI  nodejs.org không có bản Node.js 22 cho $os-$arch."; exit 1; fi

  tmp="$skill/.tools/download"
  rm -rf "$tmp"; mkdir -p "$tmp"
  curl -fL --progress-bar -o "$tmp/$file" "$base/$file" || { echo "LỖI  Tải Node.js không thành công: hãy kiểm tra mạng rồi chạy lại."; rm -rf "$tmp"; exit 1; }
  if command -v sha256sum >/dev/null 2>&1; then got="$(sha256sum "$tmp/$file" | awk '{ print $1 }')"; else got="$(shasum -a 256 "$tmp/$file" | awk '{ print $1 }')"; fi
  if [ "$got" != "$want_sum" ]; then echo "LỖI  File Node.js tải về không khớp mã kiểm tra của nodejs.org, nên mình đã xoá nó. Hãy chạy lại."; rm -rf "$tmp"; exit 1; fi

  if [ "$ext" = zip ]; then
    # Git Bash may have no unzip; PowerShell's Expand-Archive is on every Windows 10 and 11
    if command -v unzip >/dev/null 2>&1; then (cd "$tmp" && unzip -q "$file"); else (cd "$tmp" && powershell.exe -NoProfile -Command "Expand-Archive -LiteralPath '$file' -DestinationPath '.'"); fi
  else
    tar -xf "$tmp/$file" -C "$tmp"
  fi
  rm -rf "$local_node"
  mv "$tmp/${file%."$ext"}" "$local_node"
  rm -rf "$tmp"
  if [ "$(major "$exe")" -lt 22 ]; then echo "LỖI  Đã tải Node.js nhưng không chạy được ($exe)."; exit 1; fi
  echo "ok   Node.js $("$exe" --version), bản riêng của skill"
  node_cmd="$exe"
fi

# setup runs npm and npx, which come with that Node: put it first on PATH
if [ "$node_cmd" != node ]; then export PATH="$bin:$PATH"; fi
exec "$node_cmd" "$skill/scripts/setup.mjs" "$@"
