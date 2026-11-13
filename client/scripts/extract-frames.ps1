# CampusOS - Video Frame Extraction for Scrub Hero (PowerShell)
# Requires ffmpeg installed and on PATH

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$clientDir = Split-Path -Parent $scriptDir
$clipPath = Join-Path $scriptDir "source\clip.mp4"
$framesDir = Join-Path $clientDir "public\frames"
$deskDir = Join-Path $framesDir "desk"
$mobDir = Join-Path $framesDir "mob"

if (!(Test-Path $clipPath)) {
    Write-Error "Source clip not found at: $clipPath. Please place clip.mp4 in client/scripts/source/"
    exit 1
}

New-Item -ItemType Directory -Force -Path $deskDir | Out-Null
New-Item -ItemType Directory -Force -Path $mobDir | Out-Null

Write-Host "🎬 Extracting desktop frames (1920px wide @ 15fps)..." -ForegroundColor Cyan
ffmpeg -y -i "$clipPath" -vf "fps=15,scale=1920:-2" -c:v libwebp -quality 75 "$deskDir\f_%04d.webp"

Write-Host "📱 Extracting mobile frames (960px wide @ 15fps)..." -ForegroundColor Cyan
ffmpeg -y -i "$clipPath" -vf "fps=15,scale=960:-2" -c:v libwebp -quality 70 "$mobDir\f_%04d.webp"

$frames = Get-ChildItem -Path $deskDir -Filter "f_*.webp"
$frameCount = $frames.Count

$meta = @{
    frameCount = $frameCount
    fps = 15
    desktopPath = "/frames/desk/f_%04d.webp"
    mobilePath = "/frames/mob/f_%04d.webp"
    generatedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
} | ConvertTo-Json

$metaPath = Join-Path $framesDir "meta.json"
Set-Content -Path $metaPath -Value $meta -Encoding UTF8

Write-Host "✅ Extracted $frameCount frames." -ForegroundColor Green
Write-Host "📄 Metadata written to $metaPath" -ForegroundColor Green
