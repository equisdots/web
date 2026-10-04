#!/usr/bin/env bash
#
# Regenerates the optimized preview assets consumed by /previews.
#
#   ./scripts/build-previews.sh [source-dir]
#
# `source-dir` defaults to ../previews-equisdots (the raw captures repository
# folder next to `web/`). It must contain:
#
#   images/Screenshot_*.png   raw stills (any resolution)
#   gifs/*.gif                960x540 @ 20 fps desktop clips
#
# Outputs, relative to this repository:
#
#   public/previews/shots/<id>.webp          full-size WebP stills
#   public/previews/shots/<id>-<w>.webp      downscaled variants (640/1280)
#   public/previews/clips/<id>.mp4           H.264 clip (CRF 27, faststart)
#   public/previews/clips/<id>-poster.webp   frame at 5 s, WebP q84
#   public/previews/clips/gif/<id>.gif       only with GIFS=1 (needs gifski)
#
# Requires: ffmpeg. GIFS=1 additionally requires gifski in PATH
# (cargo install gifski --no-default-features --features binary).
#
# The slug map below is the single source of truth: add new screenshots or
# clips here and in src/lib/previews.ts so the gallery picks them up.

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="${1:-$REPO_DIR/../previews-equisdots}"
IMG_DIR="$SRC_DIR/images"
GIF_DIR="$SRC_DIR/gifs"
SHOTS_OUT="$REPO_DIR/public/previews/shots"
CLIPS_OUT="$REPO_DIR/public/previews/clips"

command -v ffmpeg >/dev/null || { echo "ffmpeg is required" >&2; exit 1; }
[ -d "$IMG_DIR" ] || { echo "missing $IMG_DIR" >&2; exit 1; }
[ -d "$GIF_DIR" ] || { echo "missing $GIF_DIR" >&2; exit 1; }

mkdir -p "$SHOTS_OUT" "$CLIPS_OUT"

declare -A SHOT_SLUGS=(
  [Screenshot_2026-10-04-131010.png]=bar
  [Screenshot_2026-10-04-131031.png]=widgets-panel
  [Screenshot_2026-10-04-131059.png]=settings-timex
  [Screenshot_2026-10-04-131108.png]=settings-monitors
  [Screenshot_2026-10-04-131213.png]=settings-bar-engine
  [Screenshot_2026-10-04-131317.png]=settings-bar-position
  [Screenshot_2026-10-04-131553.png]=settings-glass
  [Screenshot_2026-10-04-131619.png]=desktop-tiling
  [Screenshot_2026-10-04-132520.png]=desktop-scenes
  [Screenshot_2026-10-04-132601.png]=app-launcher
  [Screenshot_2026-10-04-132700.png]=desktop-doctor
)

convert_shot() {
  local src="$1" slug="$2" width
  width=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$src")
  echo "shot  $slug (${width}px)"
  ffmpeg -v error -y -i "$src" -map_metadata -1 \
    -c:v libwebp -quality 88 -compression_level 6 -preset text "$SHOTS_OUT/$slug.webp"
  if [ "$width" -gt 1280 ]; then
    ffmpeg -v error -y -i "$src" -map_metadata -1 -vf "scale=1280:-1:flags=lanczos" \
      -c:v libwebp -quality 88 -compression_level 6 -preset text "$SHOTS_OUT/$slug-1280.webp"
  fi
  if [ "$width" -gt 640 ]; then
    ffmpeg -v error -y -i "$src" -map_metadata -1 -vf "scale=640:-1:flags=lanczos" \
      -c:v libwebp -quality 86 -compression_level 6 -preset text "$SHOTS_OUT/$slug-640.webp"
  fi
}

for src in "${!SHOT_SLUGS[@]}"; do
  convert_shot "$IMG_DIR/$src" "${SHOT_SLUGS[$src]}"
done

for gif in "$GIF_DIR"/*.gif; do
  base=$(basename "$gif" .gif)
  name=${base/hyprland-/tour-}
  echo "clip  $name"
  ffmpeg -v error -y -i "$gif" -map_metadata -1 -an \
    -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart \
    "$CLIPS_OUT/$name.mp4"
  ffmpeg -v error -y -ss 5 -i "$gif" -map_metadata -1 -frames:v 1 \
    -c:v libwebp -quality 84 -compression_level 6 "$CLIPS_OUT/$name-poster.webp"
done

# Optional inline-animation exports for READMEs. gifski beats a plain ffmpeg
# GIF re-encode; tweak the profile with GIF_WIDTH/GIF_FPS/GIF_QUALITY
# (for example 640/12/78 for a lighter file).
if [ "${GIFS:-0}" = "1" ]; then
  command -v gifski >/dev/null || { echo "GIFS=1 requires gifski in PATH" >&2; exit 1; }
  gif_width="${GIF_WIDTH:-960}"
  gif_fps="${GIF_FPS:-20}"
  gif_quality="${GIF_QUALITY:-90}"
  mkdir -p "$CLIPS_OUT/gif"
  tmp=$(mktemp -d)
  trap 'rm -rf "$tmp"' EXIT
  for gif in "$GIF_DIR"/*.gif; do
    base=$(basename "$gif" .gif)
    name=${base/hyprland-/tour-}
    echo "gif   $name (${gif_width}px @ ${gif_fps}fps, q$gif_quality)"
    ffmpeg -v error -y -i "$gif" -vf "fps=$gif_fps,scale=$gif_width:-1:flags=lanczos" \
      -pix_fmt yuv444p "$tmp/$name.y4m"
    gifski -o "$CLIPS_OUT/gif/$name.gif" -r "$gif_fps" --quality "$gif_quality" "$tmp/$name.y4m"
  done
fi

echo "done -> $SHOTS_OUT, $CLIPS_OUT"
