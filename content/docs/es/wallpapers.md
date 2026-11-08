---
title: Fondos de pantalla
description: El núcleo de fondos davinci, xwww y mpvpaper, el selector de Quickshell, los proveedores de búsqueda y la presentación de diapositivas.
order: 12
section: wallpapers
---

Los fondos de pantalla se gestionan con
[equisdots/davinci](https://github.com/equisdots/davinci), un núcleo sin
interfaz que aplica, genera miniaturas, busca y rota fondos de pantalla. El
selector de Quickshell es solo un frontend: la interfaz decide qué aplicar y el
núcleo decide cómo.

## La pila

| Pieza | Función |
|---|---|
| `xwww` / `xwww-daemon` | Aplica imágenes fijas y escenas interactivas. |
| `mpvpaper` | Aplica fondos de vídeo. |
| ImageMagick, ffmpeg, ffprobe | Miniaturas, conversión a webp y pósteres de vídeo. |
| `davinci` | CLI del núcleo: listado, aplicación, estado, búsqueda y presentación. |
| Selector de Quickshell | `SUPER + W`, cuadrícula de tarjetas con filtros y transiciones. |

El demonio se inicia desde `autostart.lua` de Hyprland (o `autostart.kdl` de
niri) y el shell lo reinicia tras los cambios de tema. El stack de fondos es
neutral al compositor: corre igual en Hyprland y [niri](/es/docs/niri).

## El directorio de fondos de pantalla

La colección está en `~/.config/hypr/wallpapers` por defecto y se escanea
recursivamente. Los archivos anidados se aplanan en el nombre de su miniatura
usando `__` como separador (`sub/dir/pic.jpg` pasa a ser
`sub__dir__pic.jpg`). Un directorio que contiene `scene.js` es una escena
interactiva; su miniatura se llama `scn_<name>.jpg`, mientras que los vídeos
usan el prefijo `000_`.

## CLI

```sh
davinci set <file|url|scene-dir> [--video] [--monitors all|A,B] \
         [--transition name] [--thumb <poster>] [--notify] [--dry-run]
davinci set ~/.config/hypr/wallpapers/astro-palette --transition decrypt
davinci fetch --name <n> --map <f> --dest <f>

davinci current
davinci current --thumb-name
davinci thumbs
davinci search "mountains" --source wallhaven
davinci search --continue "mountains"
davinci search --clear
davinci stop
davinci rm ~/.config/hypr/wallpapers/nord.png
davinci import ~/Downloads/*.jpg
davinci slideshow start|stop|status [interval]
davinci keys list
davinci keys set PIXABAY_KEY <value>
davinci paths
davinci --version
```

`set` acepta un archivo, una URL o un directorio de escena y resuelve el
destino por sí mismo; `--monitors`, `--thumb`, `--notify` y `--dry-run`
refinan la aplicación. `--transition` acepta el conjunto de xwww (`fade`,
`wipe`, `glitch`, `decrypt` y más) más `random`; vacío significa aleatorio.
`fetch` es el descargador que el selector llama tras elegir un resultado, y
`keys` gestiona las claves de proveedor en `keys.conf`. El selector resuelve
la CLI mediante `$DAVINCI_CLI` y luego un `../kernel/davinci.sh` hermano, así
que otros frontends solo necesitan la ruta.

## Anulaciones de entorno

| Variable | Valor predeterminado | Uso |
|---|---|---|
| `DAVINCI_WALLPAPER_DIR` | `$WALLPAPER_DIR` o `~/.config/hypr/wallpapers` | Directorio de origen. |
| `DAVINCI_CACHE_DIR` | `~/.cache/quickshell/wallpaper_picker` | Miniaturas, fondo actual y búsqueda. |
| `DAVINCI_STATE_DIR` | `~/.local/state/quickshell/wallpaper_picker` | Indicadores persistentes y `current_scene`. |
| `DAVINCI_RUN_DIR` | `$XDG_RUNTIME_DIR/quickshell/wallpaper_picker` | Archivos de control, bloqueos y PIDs. |
| `DAVINCI_LOG_DIR` | `$XDG_RUNTIME_DIR/quickshell/logs` | Registros del núcleo. |
| `DAVINCI_XWWW` | `~/.local/bin/xwww`, luego `PATH` | Binario del cliente. |
| `DAVINCI_XWWW_DAEMON` | `~/.local/bin/xwww-daemon`, luego `PATH` | Binario del demonio. |
| `DAVINCI_CLI` | — | Ruta explícita a `davinci.sh` que consume el selector. |

## El selector

Ábralo con `SUPER + W`. El selector muestra las miniaturas de davinci, un
selector de transición y controles de filtro. Las tarjetas llevan una insignia
`JS` para las escenas y una insignia de reproducción para los vídeos. La
aplicación se realiza con un clic o `Return`; `Delete` mueve la entrada
seleccionada a la papelera mediante `davinci rm`. El fondo activo se
preselecciona al abrir el selector (`davinci current --thumb-name`).

## Búsqueda

Las descargas de búsqueda pasan por scripts de proveedor en `providers/`:

| Fuente | Clave | Notas |
|---|---|---|
| `ddg` | ninguna | Scraper de DuckDuckGo, solo biblioteca estándar. |
| `wallhaven` | ninguna (SFW) | Filtro de resolución nativa y paginación. |
| `pexels` | `PEXELS_KEY` opcional | Vídeos de stock; mejor mp4 >= 1920x1080. |
| `pixabay` | `PIXABAY_KEY` | Vídeos de stock; mejor variante >= 1920x1080. |

Las claves viven en `$DAVINCI_STATE_DIR/keys.conf` o en el entorno. Los
resultados se filtran a al menos 1920x1080 y se validan (`content-type` más
mime) antes de conservarlos. La paginación guarda un cursor por proveedor en
`search_cursors/<source>`, y el proveedor activo se persiste en `search_source`
para que `search --continue` pregunte a la misma fuente.

## Presentación de diapositivas

`davinci slideshow start [interval]` ejecuta un demonio independiente que rota
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
- `ddg_search_control` lleva `run`, `pause` o `stop`, escrito por la interfaz.
- `search_cursors/<source>` y `search_source` persisten la paginación y el proveedor.
- `slideshow.pid` y `slideshow_enabled` guardan el estado del demonio de diapositivas.
- `keys.conf` (modo 600) almacena las claves de API de los proveedores.

## Contribuir con fondos de pantalla

El repositorio [background](https://github.com/equisdots/background) alberga la
colección de fondos y el catálogo de escenas. Las imágenes se distribuyen como
assets de release, nunca se rastrean en git:

- Envíe solo imágenes creadas por usted o con licencia explícita para su
  redistribución; se rechaza la procedencia poco clara.
- JPEG (optimizado), 4K preferido y 2560x1440 mínimo, 16:9 o más ancho, menos de
  unos 5 MB, sin marcas de agua.
- Abra un PR o issue titulado `wallpaper: <nombre corto>`, adjunte la imagen e
  incluya autor, fuente, licencia y una descripción breve.
- Las releases publicadas incluyen `LICENSE` y `CREDITS.md`; las imágenes y la
  documentación se licencian CC BY 4.0 y cada autor recibe crédito.

## Solución de problemas

- El fondo no cambia: compruebe que `xwww-daemon` se ejecuta y que
  `xwww --version` coincide con la versión fijada (`dots doctor` lo informa).
- `davinci: xwww not found` (no se encuentra xwww): el núcleo resuelve
  `DAVINCI_XWWW`, luego `~/.local/bin/xwww` y luego `PATH`; puede que una
  sesión no incluya `~/.local/bin`.
- Falla el fondo de vídeo: `mpvpaper` debe estar instalado (`dots system`).
- Miniaturas ausentes u obsoletas: ejecute `davinci thumbs`.
- La escena aparece como una carpeta normal: necesita un archivo `scene.js`;
  consulte [Escenas interactivas](/es/docs/scenes).

## Siguientes pasos

- [Escenas interactivas](/es/docs/scenes) para fondos de pantalla procedurales.
- [Temas y paletas](/es/docs/theming) para escenas reactivas a la paleta.
- [Shell Quickshell](/es/docs/shell) para el selector y la gestión de estado.
