---
title: Compositor niri
description: El compositor alternativo niri: configuración KDL, scripts de sesión, el shell neutral al compositor y cómo el stack compartido corre en Hyprland y niri.
order: 8
section: desktop
---

equisdots corre también sobre **niri**. niri es un compositor Wayland de
scrollable-tiling: las ventanas viven en columnas sobre una tira horizontal
infinita por monitor, los espacios de trabajo son dinámicos e independientes por
monitor, y la configuración es un único documento KDL que se recarga en
caliente al guardar. Toda la interfaz es compartida: la misma barra, paneles,
widgets, editor de ajustes, pantalla de bloqueo y la mascota Nyx corren en ambos
compositores, y solo cambia la capa del compositor.

## Los repositorios de niri

El soporte de niri es un conjunto de repositorios pequeños que se sitúan junto a
los de Hyprland.

| Repositorio | Rol | Se instala en |
|---|---|---|
| [niri](https://github.com/equisdots/niri) | Config del compositor niri (KDL), scripts de sesión, ficheros de sesión/portal | `~/.config/niri` |
| [niri-meta](https://github.com/equisdots/niri-meta) | Meta instalador y actualizador (`dotsniri`) del stack niri | `~/.local/bin/dotsniri` |
| [niri-shell](https://github.com/equisdots/niri-shell) | Overlay que hace neutral al compositor el shell Quickshell compartido | se fusiona en `.../quickshell` |
| [nyx-niri](https://github.com/equisdots/nyx-niri) | Overlay que hace neutral al compositor la isla de mascotas Nyx compartida | se fusiona en `.../quickshell/ui/nyx` |
| [niri-login](https://github.com/equisdots/niri-login) | Entrada de sesión Wayland para que los gestores de sesión listen "Niri" | `/usr/share/wayland-sessions` |

`hyprland` y `niri` son los dos frontends de compositor; el resto del stack
(`shell`, `nyx`, `palettes`, `theme-sync`, `background`, `timex`, `davincix`,
`login`) es compartido por ambos.

## Una raíz de datos, dos compositores

La capa de niri usa la **estrategia A**: la raíz de datos compartida de
equisdots se queda en `~/.config/hypr`, y solo la config del compositor se mueve
a `~/.config/niri`.

- `~/.config/hypr/settings.json`, `palettes/`, `wallpapers/`, el shell
  Quickshell (`~/.config/hypr/scripts/quickshell`) y los scripts compartidos
  (`lock.sh`, `volume.sh`, `qs_manager.sh`, ...) se reutilizan sin cambios.
- Los scripts de niri leen la raíz compartida a través de `EQUISDOTS_CONFIG_DIR`
  (por defecto `~/.config/hypr`).
- Hyprland y niri pueden correr en paralelo desde un mismo `settings.json` y un
  mismo almacén de paletas.

Solo difieren las piezas específicas del compositor: la config KDL, el demonio
de espacios (event-stream) y el backend del shell.

## El shell neutral al compositor

El repositorio `shell` es Hyprland-primero; [`niri-shell`](https://github.com/equisdots/niri-shell)
es un overlay que añade lo que niri necesita y deja todo lo demás intacto:

```
equisdots/shell/             (base, sin cambios)
        +
niri-shell/ + nyx-niri/      (overlays: solo los ficheros que difieren)
        =
~/.config/hypr/scripts/quickshell/   (desplegado, neutral al compositor)
```

`core/Compositor.qml` selecciona el backend en tiempo de ejecución:

- `XDG_CURRENT_DESKTOP` con `niri`, o un `NIRI_SOCKET` definido, carga
  `core/compositors/Niri.qml`;
- cualquier otro valor (o ambos sin definir) carga
  `core/compositors/Hyprland.qml`.

niri define `XDG_CURRENT_DESKTOP=niri` y `NIRI_SOCKET`, así que aceptar
cualquiera de las dos señales mantiene el backend correcto. Los widgets nunca
ramifican por compositor: consumen la misma superficie (`workspacesCommand`,
`keyboardCommand`, `focusCommand`, `setWindowBorders`, `switchWorkspace`,
`cycleKeyboardLayout`).

| Aspecto | Hyprland | niri |
|---|---|---|
| JSON de espacios | `hyprctl` + `.socket2.sock` | `niri msg --json event-stream` |
| Distribución de teclado | `hyprctl devices -j` | `niri msg --json keyboard-layouts` |
| Ventana enfocada | `hyprctl activewindow -j` | `niri msg --json focused-window` |
| Bordes | `hyprctl eval` | `generated/borders.kdl` + recarga |
| Atajos / startup / apariencia | `config/*.lua` + recarga | `generated/user-*.kdl` + recarga |
| Efectos | `hyprctl getoption/eval` | `generated/theme-effects.kdl` + recarga |
| Monitores | `hl.monitor` + `display-config` | `generated/outputs.kdl` + recarga |

Los cambios en vivo bajo niri escriben un fragmento en
`~/.config/niri/generated/` y recargan, porque niri no tiene `hyprctl eval`.

## Configuración

`~/.config/niri/config.kdl` es el punto de entrada; incluye los módulos
traducidos y los fragmentos generados:

```
config/niri/
  config.kdl            entrada: incluye módulos, opciones top-level, generados
  modules/
    environment.kdl     variables de entorno (GDK_BACKEND no se define a propósito)
    input.kdl           teclado, touchpad, ratón
    layout.kdl          gaps, bordes, focus-ring
    animations.kdl      springs y easing
    workspaces.kdl      espacios nombrados
    window-rules.kdl    reglas por aplicación
    layer-rules.kdl     superficies de capa (sin blur forzado)
    autostart.kdl       arranque de sesión
    keybinds.kdl        atajos
  generated/            fragmentos en tiempo de ejecución (gitignored)
```

El parser KDL de niri es estricto: un bloque cuyo último nodo no termina antes
de `}` no se parsea, y una config inválida hace que niri caiga a sus valores por
defecto (pantalla gris con el overlay de atajos, sin error en pantalla). Valida
siempre:

```sh
niri validate -c ~/.config/niri/config.kdl
```

## Atajos y espacios de trabajo

La mayoría de atajos coinciden con Hyprland. Donde Hyprland permitía dos
acciones para una tecla, niri rechaza duplicados, así que los conflictos se
resolvieron: gana el foco para `Super+H/J/L`, y el bloqueo pasa a `Super+Alt+L`.
El scratchpad es un espacio nombrado (`Super+A`). Los espacios son dinámicos,
pero los atajos numéricos siguen funcionando (índices `1..0`); la colocación de
apps usa espacios nombrados (`browser`, `code`, `chat`, `media`, `games`,
`scratch`).

## Sustituciones gráficas

Donde una función visual de Hyprland no tiene equivalente en niri, se sustituye
en vez de eliminarla en silencio:

| Hyprland | niri |
|---|---|
| Tearing por ventana (`immediate`) | `variable-refresh-rate on-demand=true` + una regla de ventana de juego |
| Blur de capa por namespace (`ignore_alpha`) | Sin blur de capa forzado; las superficies `ext-background-effect` usan el `blur {}` global |
| Borde activo con acento | Gris neutro por defecto, refinado por el shell desde el `color8` mate de la paleta |
| Demonio `mako`/`dunst` | El shell registra `org.freedesktop.Notifications` por sí mismo |
| `dim_inactive` | `window-rule { match is-active=false; opacity 0.80 }` |
| Espacio especial (scratchpad overlay) | Espacio nombrado `scratch` (`Super+A`) |
| Regla floating `center` | posición flotante recordada |
| `hyprpicker` | `niri_pick_color.sh` (niri pick-color) |
| Screenshot `--edit` | se canaliza la captura a `satty` en `niri_screenshot.sh` |
| Espejado de salidas | no hay espejo por hardware; usa `wl-mirror` como ventana |

Las capturas abren el mismo overlay de equisdots que Hyprland, y la grabación
usa `gpu-screen-recorder` a través de `niri_record.sh`.

## Nyx en niri

La isla de mascotas corre sin cambios, con una limitación asumida: niri **no
tiene IPC para la posición global del puntero**, así que el bucle `hyprctl
cursorpos` de Hyprland se detiene y las mascotas quedan inactivas (las pupilas
al centro). Los eventos de ventana llegan desde `niri msg --json event-stream`.
El seguimiento global del cursor necesita acceso privilegiado a input crudo; es
opcional y experimental mediante `NYX_CURSOR_PROVIDER` (un comando cuyo stdout
emite líneas `x,y`). Ver [Isla de mascotas Nyx](/es/docs/nyx).

## Instalar niri con dotsniri

`dotsniri` es un meta instalador y actualizador aparte, paralelo a `dots`. Usa
su propia raíz de clones (`~/.local/share/equisdots-niri`) para no tocar una
instalación de `dots` en paralelo, y los dos stacks conviven en una máquina.

```sh
# instalación en un comando
bash <(curl -fsSL https://raw.githubusercontent.com/equisdots/niri-meta/main/bin/dotsniri) install

# comandos habituales
dotsniri install          # clona/actualiza y despliega el stack niri
dotsniri desktop niri     # selecciona niri como sesión por defecto
dotsniri doctor           # comprueba binarios, clones, deploy y config
dotsniri system           # instala paquetes de la distro (niri, portales, ...)
dotsniri login install    # instala la entrada de sesión del DM (niri-login)
```

`dotsniri desktop <niri|hyprland|both>` fija la sesión por defecto, refleja la
elección en `settings.json` bajo `compositor`, y aplica o retira los overlays
del shell. Los overlays son condicionales y reversibles: un archivo compartido
nunca se reemplaza por una variante niri salvo que se seleccione la sesión niri,
y `dotsniri deploy` los vuelve a aplicar tras un `dots update` que reescriba el
shell.

## Requisitos

niri 26.04 o superior con `xwayland-satellite`, `jq`, `python3` y, para captura,
`grim`, `slurp`, `satty` y `wl-clipboard`. `dotsniri doctor` reporta lo que
falta y `dotsniri doctor --self-test` comprueba el toolkit sin requerir niri.

## Páginas relacionadas

- [Escritorio Hyprland](/es/docs/desktop) para el otro frontend de compositor.
- [Shell Quickshell](/es/docs/shell) para la interfaz neutral al compositor.
- [Arquitectura y repositorios](/es/docs/architecture) para el mapa completo de repos.
