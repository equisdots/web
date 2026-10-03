---
title: "Herramientas: timex, xturing, login"
description: Referencia del motor de hora y clima timex, la interfaz de ajustes de terminal xturing y el tema de inicio de sesión SDDM estático.
order: 9
section: more
---

Además del compositor y el shell, tres repositorios proporcionan herramientas
específicas: timex (datos de hora y clima más la interfaz de calendario),
xturing (todo el panel de ajustes en la terminal) y login (la pantalla de
inicio de sesión SDDM estática).

## timex

[equisdots/timex](https://github.com/equisdots/timex) es el motor de hora y
clima. Alimenta el reloj de la barra, el emergente de calendario (`SUPER + S`),
las caras de clima de escritorio y la pestaña de ajustes.

### CLI

```sh
timex --json                     # cached JSON (throttled refresh)
timex --getdata                  # force a refresh
timex --invalidate               # drop the cache after a config change
timex --current-icon             # bar module reads
timex --current-temp
timex --current-hex
timex providers list             # name|label|needs_key|hint
timex geocode "Tokyo"            # top 5 matches for the UI picker
timex test                       # ok|description or fail|error
timex status
timex keys set OPENWEATHER_KEY <value>
timex keys list
```

El motor ejecuta exactamente el proveedor seleccionado; no hay alternativas
silenciosas. Si al proveedor le falta una ciudad o una clave, la caché recibe
un estado de error explícito (`Select a provider` ["seleccione un proveedor"],
`Set a city` ["establezca una ciudad"], `Set the API key` ["establezca la clave
de API"]).

### Proveedores

| Nombre | Clave | Entrada | Notas |
|---|---|---|---|
| `open-meteo` | ninguna | ciudad o `lat,lon` | Geocodificación en caché; 5 días, por horas. |
| `wttr` | ninguna | ciudad | 3 días, por horas. |
| `openweather` | sí | ciudad + clave | Plan gratuito; geocodificación con la clave. |

Añadir un proveedor es un ejecutable en `api/providers/` que imprime el
documento JSON normalizado, más una línea de catálogo en `core/timex.sh`.

### Configuración

- `settings.json -> timex`: `{ provider, city, unit }` más las claves de diseño
  de la interfaz (`forecastEnabled`, `forecastPosition`, `forecastHours`,
  `clockScale` y más). Sin secretos.
- Claves de API: `~/.local/state/quickshell/timex/keys.conf` (modo 600),
  escritas con `timex keys set`.
- Caché: `~/.cache/quickshell/timex/weather.json`, con el contrato estable
  `current_temp` / `current_icon` / `current_hex` / `forecast[]`.

## xturing

[equisdots/xturing](https://github.com/equisdots/xturing) es una TUI de
Rust/ratatui que expone todas las opciones del panel de ajustes (el vinculado a
`SUPER + SHIFT + D`). Lee y escribe el mismo `settings.json` y llama a los
mismos scripts, por lo que el panel QML y xturing pueden coexistir.

### Uso

```sh
xturing                        # installed at ~/.local/bin/xturing
xturing --page d_style         # open a page directly
xturing --search palette       # open the search palette pre-filled
xturing --dry-run              # no external commands; logs to /tmp/xturing-actions.log
xturing --help
```

| Opción | Efecto |
|---|---|
| `--settings <path>` | `settings.json` alternativo. |
| `--palettes <dir>` | Directorio de paletas alternativo. |
| `--page <id>` | Abrir una página (`s_general`, `d_style`, `d_palette`, ...). |
| `--search <query>` | Abrir la búsqueda prerrellenada. |
| `--dry-run` | Igual que `XTURING_DRY=1`. |

### Páginas

25 páginas repartidas en seis grupos de navegación:

- Shell: General, Timex, Teclado, Monitores, Arranque.
- Barra: Motor, Posición, Estilo, Zonas, Barra clásica, Módulos, Espacios de
  trabajo.
- Tema: Paleta, Animaciones, Sombras, Cristal, Mascotas.
- Comportamiento: Lanzador, Notificaciones.
- Widgets: Emergentes (las secciones de `Personalization.js`).
- Sistema: Hyprland, Entrada, GPU, Inactividad, Acerca de.

### Teclas

```
Up/Down or j/k   move selection (wraps across pages)
Left/Right or h/l adjust / cycle
Tab / Shift+Tab  next / previous page
Enter/Space      edit, toggle, run
/ or Ctrl+P      search palette
r                reload settings.json, and in forms record a shortcut
?                help
q / Ctrl+C       quit
```

### Contrato de escritura y pruebas en sandbox

- `settings.json` se escribe de forma atómica (`tmp + rename`) con
  `serde_json`, conservando el orden de claves y las claves desconocidas.
- Las escrituras son inmediatas; los vigilantes del shell las recogen en vivo.
- Los caracteres de control en los glifos de `bar.modules` se conservan tal
  cual.

Pruebe sin tocar nada:

```sh
XTURING_DRY=1 xturing
cp ~/.config/hypr/settings.json /tmp/settings-test.json
XTURING_DRY=1 XTURING_SETTINGS=/tmp/settings-test.json xturing
XTURING_DRY=1 XTURING_SETTINGS=/tmp/settings-test.json \
  XTURING_PALETTES_DIR=/tmp/palettes-test xturing
```

## login

[equisdots/login](https://github.com/equisdots/login) es la pantalla de inicio
de sesión SDDM: una pantalla negra con el usuario recordado, un campo de
contraseña con subrayado blanco, un selector de sesión y pequeños botones de
apagado/reinicio, todo monocromo y dibujado con la Hack Nerd Font.

Es deliberadamente estática. El tema anterior sincronizado con la paleta
escribía en `/usr/share/sddm/themes` en tiempo de ejecución, lo que requería
sudo desde hooks y corría el riesgo de bloqueos PAM. Este tema se instala una
vez y nunca vuelve a escribir:

```sh
./install.sh              # one-time sudo: theme + sddm config
./install.sh --uninstall  # remove theme and its sddm config
```

El instalador copia el tema a `/usr/share/sddm/themes/x`, lo selecciona en
`/etc/sddm.conf.d/10-x-theme.conf` y desactiva el teclado en pantalla. Si otro
gestor de pantalla posee `display-manager.service`, el enlace se cambia a SDDM
(el anterior se respalda como `display-manager.service.equisdots-backup`).
`--uninstall` lo restaura.

`dots doctor` verifica el archivo de configuración, el tema estático (sin
`Colors.qml`) y que SDDM sea el gestor de pantalla activo.

## Páginas relacionadas

- [Shell Quickshell](/es/docs/shell) para el panel de ajustes que xturing replica.
- [Temas y paletas](/es/docs/theming) para los destinos controlados por paletas.
- [Arquitectura y repositorios](/es/docs/architecture) para las rutas de
  instalación.
