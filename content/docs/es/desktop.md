---
title: Escritorio Hyprland
description: La configuración Lua de Hyprland, atajos de teclado, gestión de monitores, scripts, capturas de pantalla y modos de GPU de la sesión equisdots.
order: 4
section: desktop
---

La configuración del compositor vive en
[equisdots/hyprland](https://github.com/equisdots/hyprland) y está escrita en
Lua desde Hyprland 0.55. Cada aspecto es un módulo cargado con `require()`, de
modo que los atajos de teclado, las animaciones o las reglas pueden editarse de
forma aislada sin tocar el resto.

## Estructura de la configuración

| Archivo | Propósito |
|---|---|
| `hyprland.lua` | Punto de entrada; requiere todos los módulos y las anulaciones en tiempo de ejecución de `config/`. |
| `env.lua` | Variables de entorno (backends de Wayland, indicadores Qt/GTK, directorios XDG). |
| `colors.lua` | Paleta exportada como tabla Lua más colores de borde activo/inactivo. |
| `variables.lua` | Variables principales como `mainMod = "SUPER"` y `terminal = "kitty"`. |
| `settings.lua` | Opciones general, decoration, input, dwindle, master, misc y xwayland. |
| `monitors.lua` | Configuración de monitores; por defecto, el comodín `mode = "highrr"`. |
| `keybinds.lua` | Todos los enlaces mediante `hl.bind()`, organizados por categoría. |
| `animations.lua` | Curvas de Bézier y definiciones de animación. |
| `windowrules.lua` | Reglas de flotación, centrado, tamaño, opacidad y espacios de trabajo. |
| `workspaces.lua` | Reglas de espacios de trabajo fijadas por descripción EDID y scratchpads. |
| `autostart.lua` | Comandos de inicio de la sesión (`hl.on("hyprland.start", ...)`). |
| `config/window-effects.lua` | Anulaciones de decoración generadas por widgets, cargadas al final. |
| `config/gaps.lua` | Anulaciones de gaps/bordes generadas por widgets, cargadas al final. |

Las ediciones en un archivo Lua cargado provocan una recarga completa de la
configuración. Para cambios en vivo, prefiera la API en tiempo de ejecución y
persista solo al asentar:

```sh
hyprctl reload
hyprctl eval 'hl.config({ general = { gaps_in = 5, gaps_out = 12 } })'
```

## Atajos de teclado

Enlaces esenciales, todos definidos en `config/hypr/keybinds.lua`:

| Atajo | Acción |
|---|---|
| `SUPER + Return` | Terminal (kitty) |
| `SUPER + D` | Lanzador de aplicaciones |
| `SUPER + E` / `SUPER + F` | Gestor de archivos / navegador |
| `SUPER + Q` | Cerrar la ventana activa |
| `SUPER + Space` | Alternar flotante |
| `SUPER + J` | Alternar diseño dividido |
| `SUPER + Arrow keys` | Mover el foco |
| `SUPER + SHIFT + Arrows` | Mover la ventana |
| `SUPER + CTRL + Arrows` | Redimensionar la ventana |
| `SUPER + 1-9,0` | Espacio de trabajo o escritorio unificado |
| `SUPER + Page Up/Down` | Espacio de trabajo anterior / siguiente |
| `SUPER + W` | Selector de fondos de pantalla |
| `SUPER + SHIFT + D` | Panel de ajustes (editor de barra) |
| `SUPER + SHIFT + X` | Lanzar xturing |
| `SUPER + L` | Pantalla de bloqueo |
| `SUPER + Escape` | Salir de Hyprland |
| `Print` / `SUPER + Print` | Superposición de captura / captura completa |

Los enlaces se declaran con la API de Lua:

```lua
-- config/hypr/keybinds.lua
hl.bind(mod .. "Return", hl.dsp.exec_cmd(V.terminal))
hl.bind(mod .. "D", run("bash " .. scripts .. "/qs_manager.sh", "toggle applauncher"))
hl.bind("ALT + F4", hl.dsp.window.kill())
```

La lista completa está en `docs/quick-reference.md` del repositorio, y el panel
de ajustes puede regenerar `config/user-keybinds.lua` para entradas
personalizadas.

## Multimonitor

`monitors.lua` usa la entrada comodín para que cada pantalla funcione a su tasa
de refresco más alta sin configuración por máquina:

```lua
hl.monitor({ output = "", mode = "highrr", position = "auto", scale = "auto" })
```

### Diseños guardados

Las disposiciones guardadas desde el menú de escala (`SUPER + Z`), el gestor de
monitores (`SUPER + ALT + M`) o la pestaña Monitores se escriben mediante
`scripts/persist-display-config.sh` en `~/.config/hypr/display-config`, una
línea por monitor:

```
desc|x|y|scale|mode
```

`desc` es la descripción EDID, que identifica una pantalla física incluso
cuando el kernel renombra su conector. `scripts/restore-monitors.sh` vuelve a
aplicar el diseño poco después del inicio de sesión y lo reconcilia cada dos
segundos. Los monitores desconocidos conservan el diseño automático comodín.

### Escritorios unificados

Cuando hay al menos dos pantallas conectadas de la lista (`ROSTER_DESCS` en
`scripts/ws-desktops-lib.sh`), las teclas numéricas cambian de escritorio en
todas las pantallas a la vez. Cada pantalla conserva sus propias ventanas por
escritorio. Establezca `"unifiedDesktops": false` en `settings.json` para
forzar el comportamiento clásico por monitor en cualquier caso.

## Control de monitores y ventanas con hyprctl

```sh
hyprctl monitors all
hyprctl reload
hyprctl clients
hyprctl cursorpos

hyprctl eval 'hl.monitor({ output = "DP-1", mode = "2560x1440@144", position = "0x0", scale = 1 })'
hyprctl eval 'hl.dispatch(hl.dsp.focus({ workspace = 2 }))'
hyprctl eval 'hl.dispatch(hl.dsp.exit())'
```

El shell envía los bordes de ventana en vivo mediante `hyprctl eval`, de modo
que los cambios de paleta no reinician ventanas. Consulte
[Temas y paletas](/es/docs/theming).

## Scripts

Desplegados en `~/.config/hypr/scripts/`:

| Script | Propósito |
|---|---|
| `qs_manager.sh` | Gestor IPC para cada widget de Quickshell y el enrutado de espacios de trabajo. |
| `init.sh` | Restauración de la sesión: vuelve a aplicar la escena activa o el último fondo de pantalla. |
| `lock.sh` | Lanza el bloqueo de sesión PAM del shell (`Lock.qml`). |
| `screenshot.sh` | Capturas de pantalla y grabación con audio virtual. |
| `monitor-manager.sh` | Gestor Rofi de posicionamiento de monitores y tasa de refresco. |
| `scale-menu.sh` | Selector de escala de pantalla (80% a 200%). |
| `gpu-mode.sh` | Cambio de modo NVIDIA Optimus mediante envycontrol. |
| `workspaces.sh` | Demonio de estado de espacios de trabajo para el shell. |
| `reload.sh` | Recarga completa de QML de Quickshell. |

## Capturas de pantalla y grabación

`Print` abre la superposición interactiva (selección de área, pantalla completa,
ventana activa, escaneo QR, lupa, modo edición). La grabación usa
`gpu-screen-recorder` con pistas separadas de escritorio y micrófono y escribe
archivos MP4 en `~/Videos/Recordings/`.

## Modos de GPU

En portátiles NVIDIA Optimus, `SUPER + ALT + G` alterna los modos integrado,
híbrido y NVIDIA; `SUPER + ALT + SHIFT + G` abre un selector. Se requiere
reiniciar o cerrar la sesión después del cambio.

## Siguientes pasos

- [Shell Quickshell](/es/docs/shell) para la interfaz que controla la mayor parte
  de la sesión.
- [Fondos de pantalla](/es/docs/wallpapers) para el subsistema de fondos.
- [Temas y paletas](/es/docs/theming) para colores y bordes de ventana.
