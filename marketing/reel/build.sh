#!/usr/bin/env bash
# Regenera el reel completo: voz -> línea de tiempo -> frames -> música/SFX -> mp4.
# Requiere: python3 (edge-tts numpy scipy pillow), node + playwright (chromium), ffmpeg.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
WORK="${WORK:-$HERE/.work}"
FPS="${FPS:-60}"
mkdir -p "$WORK/reel/assets" "$WORK/vo" "$WORK/dl"
cp "$HERE"/index.html "$HERE"/render.mjs "$WORK/reel/"
cp "$HERE"/../../public/brand/*.svg "$WORK/reel/assets/"
if [ ! -f "$WORK/reel/assets/Geist-Variable.woff2" ]; then
  (cd "$WORK/dl" && npm pack geist@1.3.1 >/dev/null && tar xzf geist-*.tgz)
  cp "$WORK"/dl/package/dist/fonts/geist-sans/Geist-Variable.woff2 "$WORK"/dl/package/dist/fonts/geist-mono/GeistMono-Variable.woff2 "$WORK/reel/assets/"
fi
# 1) Voz en off (es-AR-TomasNeural). Si ya están los mp3 del repo, se usan esos.
cp "$HERE"/vo/* "$WORK/vo/"
cd "$WORK/vo"
while IFS='|' read -r id txt; do
  [ -f "$id.mp3" ] || python3 "$HERE/scripts/tts.py" es-AR-TomasNeural "$txt" "$id.mp3" "+6%" "-2Hz"
  ffmpeg -nostdin -loglevel error -y -i "$id.mp3" -ar 48000 -ac 1 \
    -af "highpass=f=85,equalizer=f=200:t=q:w=1:g=-2,equalizer=f=3200:t=q:w=1.2:g=3,equalizer=f=9000:t=h:w=1:g=2,acompressor=threshold=-20dB:ratio=3.5:attack=5:release=80:makeup=4dB,volume=-1dB" \
    "${id}_fx.wav"
done < lines.txt
# 2) Línea de tiempo (inicio de cada frase + tiempos por palabra)
python3 "$HERE/scripts/timeline.py" "$WORK"
# 3) Frames
cd "$WORK/reel"
python3 -m http.server 8765 --bind 127.0.0.1 >/dev/null 2>&1 & SRV=$!
trap 'kill $SRV' EXIT
sleep 1
rm -rf frames && NO_PROXY=127.0.0.1 node render.mjs range frames 0 37 "$FPS"
# 4) Música + SFX + mezcla
python3 "$HERE/scripts/audio.py" "$WORK"
# 5) Video final
ffmpeg -nostdin -loglevel error -y -framerate "$FPS" -i frames/f_%05d.jpg -i mix_raw.wav \
  -af "loudnorm=I=-14:TP=-1.0:LRA=9" -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p \
  -profile:v high -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest "$HERE/moctlab-reel.mp4"
echo "Listo: $HERE/moctlab-reel.mp4"
