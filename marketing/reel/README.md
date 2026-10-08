# Reel de venta — moctLab.

Reel vertical 1080×1920 (Instagram/TikTok), 37 s, 60 fps.

- **Visual**: `index.html` es una animación determinística (`render(t)`) con la
  paleta y el logo del sitio. `render.mjs` la recorre cuadro por cuadro con Playwright.
- **Voz en off**: Microsoft Edge TTS, voz `es-AR-TomasNeural` (argentina, gratis).
  El guion está en `vo/lines.txt`; los mp3 y los tiempos por palabra ya están generados.
- **Música y efectos**: `scripts/audio.py` los sintetiza desde cero (sin samples
  de terceros, sin licencias), con ducking bajo la voz y loudness a −14 LUFS.

Regenerar todo: `./build.sh` (deja `moctlab-reel.mp4` acá; está en `.gitignore`).
Para cambiar una frase: editarla en `vo/lines.txt`, borrar su mp3 y su json, y
correr de nuevo. Si cambia la duración, ajustar `START` en `scripts/timeline.py`
y los tiempos `T` en `index.html`.
