---
title: Fondos de pantalla
description: El núcleo de fondos davincix, xwww y mpvpaper, el selector de Quickshell, los proveedores de búsqueda y la presentación de diapositivas.
order: 7
section: wallpapers
---

Los fondos de pantalla se gestionan con
[equisdots/davincix](https://github.com/equisdots/davincix), un núcleo sin
interfaz que aplica, genera miniaturas, busca y rota fondos de pantalla. El
selector de Quickshell es solo un frontend: la interfaz decide qué aplicar y el
núcleo decide cómo.

## La pila

| Pieza | Función |
|---|---|
| `xwww` / `xwww-daemon` | Aplica imágenes fijas y escenas interactivas. |
| `mpvpaper` | Aplica fondos de vídeo. |
| ImageMagick, ffmpeg, ffprobe | Miniaturas, conversión a webp y pósteres de vídeo. |
| `davincix` | CLI del núcleo: listado, aplicación, estado, búsqueda y presentación. |
| Selector de Quickshell | `SUPER + W`, cuadrícula de tarjetas con filtros y transiciones. |

El demonio se inicia desde `autostart.lua` y el shell lo reinicia tras los
cambios de tema.

## El directorio de fondos de pantalla

La colección está en `~/.config/hypr/wallpapers` por defecto y se escanea
recursivamente. Los archivos anidados se aplanan en el nombre de su miniatura
usando `__` como separador (`sub/dir/pic.jpg` pasa a ser
`sub__dir__pic.jpg`). Un directorio que contiene `scene.js` es una escena
interactiva; su miniatura se llama `scn_<name>.jpg`, mientras que los vídeos
usan el prefijo `000_`.

## CLI

```sh
davincix set ~/.config/hypr/wallpapers/nord.png
davincix set ~/.config/hypr/wallpapers/clip.mp4 --video
davincix set ~/.config/hypr/wallpapers/astro-palette --transition decrypt

davincix current
davincix current --thumb-name
davincix thumbs
davincix search "mountains" --source wallhaven
davincix search --continue "mountains"
davincix search --clear
davincix stop
davincix rm ~/.config/hypr/wallpapers/nord.png
davincix import ~/Downloads/*.jpg
davincix slideshow start
davincix slideshow status
davincix keys set PIXABAY_KEY <value>
davincix paths
```

`set` acepta un archivo, una URL o un directorio de escena y resuelve el
destino por sí mismo. `--transition` acepta el conjunto de xwww (`fade`,
`wipe`, `glitch`, `decrypt` y más) más `random`; vacío significa aleatorio.

## Anulaciones de entorno

| Variable | Valor predeterminado | Uso |
|---|---|---|
| `DAVINCIX_WALLPAPER_DIR` | `$WALLPAPER_DIR` o `~/.config/hypr/wallpapers` | Directorio de origen. |
| `DAVINCIX_CACHE_DIR` | `~/.cache/quickshell/wallpaper_picker` | Miniaturas, fondo actual y búsqueda. |
| `DAVINCIX_STATE_DIR` | `~/.local/state/quickshell/wallpaper_picker` | Indicadores persistentes y `current_scene`. |
| `DAVINCIX_RUN_DIR` | `$XDG_RUNTIME_DIR/quickshell/wallpaper_picker` | Archivos de control, bloqueos y PIDs. |
| `DAVINCIX_XWWW` | `~/.local/bin/xwww`, luego `PATH` | Binario del cliente. |
| `DAVINCIX_XWWW_DAEMON` | `~/.local/bin/xwww-daemon`, luego `PATH` | Binario del demonio. |

## El selector

Ábralo con `SUPER + W`. El selector muestra las miniaturas de davincix, un
selector de transición y controles de filtro. Las tarjetas llevan una insignia
`JS` para las escenas y una insignia de reproducción para los vídeos. La
aplicación se realiza con un clic o `Return`; `Delete` mueve la entrada
seleccionada a la papelera mediante `davincix rm`. El fondo activo se
preselecciona al abrir el selector (`davincix current --thumb-name`).

## Búsqueda

Las descargas de búsqueda pasan por scripts de proveedor en `providers/`:

| Fuente | Clave | Notas |
|---|---|---|
| `ddg` | ninguna | Scraper de DuckDuckGo, solo biblioteca estándar. |
| `wallhaven` | ninguna (SFW) | Filtro de resolución nativa y paginación. |
| `pexels` | `PEXELS_KEY` opcional | Vídeos de stock; mejor mp4 >= 1920x1080. |
| `pixabay` | `PIXABAY_KEY` | Vídeos de stock; mejor variante >= 1920x1080. |

Las claves viven en `$DAVINCIX_STATE_DIR/keys.conf` o en el entorno. Los
resultados se filtran a al menos 1920x1080 y se validan antes de conservarlos.

## Presentación de diapositivas

`davincix slideshow start [interval]` ejecuta un demonio independiente que rota
imágenes fijas con una transición aleatoria y nunca repite la anterior. El
estado vive en `slideshow.pid` y `slideshow_enabled` bajo los directorios de
ejecución y estado. La presentación omite las escenas.

## Contratos y archivos de estado

- `current_wallpaper.png` en el directorio de caché es el fotograma que usan la
  pantalla de bloqueo y SDDM.
- `current_scene` en el directorio de estado contiene el directorio de la escena
  en ejecución; aplicar una imagen o un vídeo lo elimina.
- `thumbs/.manifest` y `thumbs/.source_dir` indexan la caché de miniaturas.
- `search_map.txt` almacena `name|url` para los resultados de búsqueda.

## Solución de problemas

- El fondo no cambia: compruebe que `xwww-daemon` se ejecuta y que
  `xwww --version` coincide con la versión fijada (`dots doctor` lo informa).
- `davincix: xwww not found` (no se encuentra xwww): el núcleo resuelve
  `DAVINCIX_XWWW`, luego `~/.local/bin/xwww` y luego `PATH`; puede que una
  sesión no incluya `~/.local/bin`.
- Falla el fondo de vídeo: `mpvpaper` debe estar instalado (`dots system`).
- Miniaturas ausentes u obsoletas: ejecute `davincix thumbs`.
- La escena aparece como una carpeta normal: necesita un archivo `scene.js`;
  consulte [Escenas interactivas](/es/docs/scenes).

## Siguientes pasos

- [Escenas interactivas](/es/docs/scenes) para fondos de pantalla procedurales.
- [Temas y paletas](/es/docs/theming) para escenas reactivas a la paleta.
- [Shell Quickshell](/es/docs/shell) para el selector y la gestión de estado.
