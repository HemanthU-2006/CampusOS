#!/usr/bin/env bash
# CampusOS - Video Frame Extraction for Scrub Hero
# Requires ffmpeg installed and on PATH

set -e

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLIENT_DIR="$(cd "$SOURCE_DIR/.." && pwd)"
CLIP_PATH="$SOURCE_DIR/source/clip.mp4"
FRAMES_DIR="$CLIENT_DIR/public/frames"
DESK_DIR="$FRAMES_DIR/desk"
MOB_DIR="$FRAMES_DIR/mob"

if [ ! -f "$CLIP_PATH" ]; then
  echo "❌ Source clip not found at: $CLIP_PATH"
  echo "Please place your source video at: client/scripts/source/clip.mp4"
  exit 1
fi

echo "🎬 Preparing output directories..."
mkdir -p "$DESK_DIR"
mkdir -p "$MOB_DIR"

# Clean old frames
rm -f "$DESK_DIR"/*.webp
rm -f "$MOB_DIR"/*.webp

echo "🖥️  Extracting desktop frames (1920px wide @ 15 fps)..."
ffmpeg -i "$CLIP_PATH" -vf "fps=15,scale=1920:-2" -c:v libwebp -quality 75 "$DESK_DIR/f_%04d.webp"

echo "📱 Extracting mobile frames (960px wide @ 15 fps)..."
ffmpeg -i "$CLIP_PATH" -vf "fps=15,scale=960:-2" -c:v libwebp -quality 70 "$MOB_DIR/f_%04d.webp"

# Count generated desktop frames
FRAME_COUNT=$(ls -1 "$DESK_DIR"/f_*.webp 2>/dev/null | wc -l)
echo "✅ Extracted $FRAME_COUNT frames."

# Write metadata JSON
cat <<EOF > "$FRAMES_DIR/meta.json"
{
  "frameCount": $FRAME_COUNT,
  "fps": 15,
  "desktopPath": "/frames/desk/f_%04d.webp",
  "mobilePath": "/frames/mob/f_%04d.webp",
  "generatedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

echo "📄 Metadata written to: $FRAMES_DIR/meta.json"
echo "🎉 Frame extraction complete!"
