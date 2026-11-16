<#
.SYNOPSIS
  Cài đặt / Khôi phục trọn bộ 22 kỹ năng Motion Video ("Ê Đít Tơ") vào Antigravity / Gemini CLI.
.DESCRIPTION
  Sao chép toàn bộ thư mục con trong .\skills\ vào $HOME\.gemini\config\skills\
  Sau khi cài đặt, chạy "npm install" trong motion-studio nếu cần các script bổ trợ của motion-studio.
#>

$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$SourceSkillsDir = Join-Path $RepoRoot "skills"
$TargetSkillsDir = Join-Path $HOME ".gemini\config\skills"

if (-not (Test-Path $SourceSkillsDir)) {
  Write-Error "Không tìm thấy thư mục skills tại: $SourceSkillsDir"
  exit 1
}

New-Item -ItemType Directory -Force -Path $TargetSkillsDir | Out-Null

$skillFolders = Get-ChildItem -Path $SourceSkillsDir -Directory
$count = 0

foreach ($folder in $skillFolders) {
  $dest = Join-Path $TargetSkillsDir $folder.Name
  robocopy $folder.FullName $dest /E /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null
  $count++
  Write-Host "[OK] Đã cài đặt skill: $($folder.Name)" -ForegroundColor Green
}

Write-Host "`nHoàn tất! Đã khôi phục $count kỹ năng vào: $TargetSkillsDir" -ForegroundColor Cyan
Write-Host "Lưu ý: Hãy đảm bảo cấu hình cache hướng về D:\cache theo Global Cache Policy." -ForegroundColor Yellow
