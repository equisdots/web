---
title: Shell Quickshell
description: La interfaz Quickshell de equisdots: motores de barra, paneles, editor de ajustes, widgets de escritorio e IPC.
order: 5
section: desktop
---

El shell de [equisdots/shell](https://github.com/equisdots/shell) es una
aplicación Quickshell que proporciona la barra, los emergentes, los paneles, el
editor de ajustes, los widgets de escritorio y la pantalla de bloqueo. Está
escrito en QML con una pequeña capa JavaScript para la lógica pura.

Es **neutral al compositor**: `core/Compositor.qml` selecciona un backend en
tiempo de ejecución (Hyprland por defecto, [niri](/es/docs/niri) cuando
`XDG_CURRENT_DESKTOP` contiene `niri` o hay un `NIRI_SOCKET` definido). Los
widgets nunca ramifican por compositor; consumen la misma superficie del
adaptador. Bajo niri el shell compartido se completa con el overlay
`niri-shell` (ver [Arquitectura](/es/docs/architecture)).

`Shell.qml` es la entrada principal: monta la ventana maestra, la barra, la
capa flotante y los widgets de escritorio. `Lock.qml` es la entrada alternativa
para el bloqueo de sesión PAM (`WlSessionLock`), lanzada por `lock.sh`; ambas
importan los mismos servicios de `core/`.

## Arquitectura

```
Shell.qml
  core/            services and contracts (no visuals)
    Config.qml     settings.json: rawSettings + setSetting/updateJsonBulk
    WindowRegistry.js widget layout + position math
    Personalization.js option tables; EditorNav.js panel pages
    Theme, Cava, SysData, WidgetSync, compositors/, scripts/watchers/
  ui/
    Main.qml       master window, widget stack, morph, IPC handler
    bar/           host, zones engine, classic engine, modules, popups
    timex/         calendar/clock UI (engine lives in equisdots/timex)
    panels/        clipboard, wallpaper, file search, system and tools
    widgets/       floating desktop widgets and their redactor
```

La cadena de llamadas de los widgets es siempre la misma:
`keybind -> qs_manager.sh -> qs ipc call main handleCommand "toggle <widget>"
-> ui/Main.qml -> WindowRegistry.getLayout() -> StackView.replace`.

`settings.json` es la única fuente de verdad. Los paneles escriben mediante
`Config.setSetting(key, value)` y vigilan el archivo para que las ediciones
externas (xturing, ediciones manuales del JSON) se apliquen en vivo.

## La barra

El host de la barra (`ui/bar/Bar.qml`) ejecuta dos motores intercambiables en
cualquier borde de pantalla (`top`, `bottom`, `left`, `right`), conmutados en
vivo mediante `settings.json -> barEngine`:

- `bar` (predeterminado): islas agrupadas en zonas basadas en datos (`start`,
  `center`, `end`) con arrastrar y soltar de módulos, fondos por zona y modo
  unificado.
- `classic`: secciones izquierda/centro/derecha, ocultación automática y
  estilos de píldora distintos.

Ambos motores comparten la paleta y los 18 módulos: help, search, settings,
update, recording, time, date, media, workspaces, tray, keyboard, wifi,
bluetooth, sysmon, volume, battery, weather y focus. `weather` y `focus` se
distribuyen desactivados para que las actualizaciones nunca cambien un diseño
por sí solas.

### Personalizar la barra y sus módulos

Cada módulo de `ui/bar/modules/` es una isla construida sobre el componente
compartido `ModulePill`: el módulo declara qué muestra y la píldora se encarga
del fondo, el borde, la escala al pasar, la animación de entrada y los clics.
La zona (o el motor classic) inyecta siempre las mismas siete propiedades —
`bar`, `colors`, `zoneReady`, `slotIndex`, `effectiveBorderWidth`,
`effectiveBorderColor` y `unified` — y `ModulePill` añade los ayudantes de
orientación y la configuración normalizada del módulo.

Los valores por módulo viven bajo `bar.modules.<id>` y todos los campos son
opcionales:

| Campo | Significado |
|---|---|
| `icon` | Glifo de reemplazo (help, search, settings, update, keyboard, wifi, bluetooth, volume, battery, weather, focus, recording). |
| `color` | Color del contenido: un rol `colors.*` o una cadena `#hex`. |
| `fill` | Relleno de la isla: `default` / `on` / `off`. |
| `accent` | Rol de acento de reemplazo (por ejemplo `green`), convirtiendo la isla en isla de acento. |
| `size` | Tamaño de fuente en píxeles (0 mantiene el predeterminado). |
| `effect` / `cursor` | Efecto de vista por módulo (`typewriter` en el reloj) y su cursor parpadeante. |

El módulo workspaces tiene sus propias opciones globales de barra:
`workspacesMarker` (`number`, `dot`, `letter`, `custom`) y
`workspacesMarkerText`. Los valores integrados dan a `battery`, `settings`,
`search`, `time` y `help` su relleno de paleta, y cada módulo tiene un rol de
acento integrado que sigue la paleta activa.

Opciones clave bajo `bar` en `settings.json`:

```json
{
  "barEngine": "bar",
  "bar": {
    "position": "top",
    "palette": "x",
    "thickness": 48,
    "edgeGap": 8,
    "pillBg": true,
    "barBg": false,
    "dragModules": true,
    "zones": [
      { "id": "start", "align": "start",
        "modules": [ { "id": "help", "enabled": true } ] }
    ]
  }
}
```

El editor de barra (grupos Tema y Barra) expone las mismas claves de forma
visual; consulte las páginas indicadas abajo. Los colores siempre provienen de
la paleta activa mediante `ui/bar/Colors.qml`.

## Widgets y paneles

Todos los emergentes se despachan mediante `qs_manager.sh`. Atajos principales:

| Atajo | Widget |
|---|---|
| `SUPER + D` | Lanzador de aplicaciones |
| `SUPER + C` / `V` / `B` / `N` | Portapapeles / volumen / batería / red |
| `SUPER + S` / `Z` | Calendario (timex) / escala de pantalla |
| `SUPER + M` / `SUPER + P` | Música / inactividad |
| `SUPER + W` | Selector de fondos (davincix) |
| `SUPER + I` / `SUPER + U` | Monitor del sistema / actualizador |
| `SUPER + Y` / `SUPER + O` | Notas rápidas / lector RSS |
| `SUPER + '` | Búsqueda de archivos |
| `SUPER + SHIFT + S` / `D` | Panel de ajustes (editor de barra) |
| `SUPER + SHIFT + W` | Editor de widgets de escritorio |
| `SUPER + SHIFT + P` | Widget de paleta |

El panel de ajustes se basa en datos de `core/EditorNav.js` con los grupos
Shell, Barra, Tema, Comportamiento y Sistema. El estado de plegado y el orden
de las páginas persisten en `settings.editor`. El sistema de notificaciones
tiene sus propias opciones (`settings.notifications`), y las sombras, el cristal
y las mascotas se configuran desde el grupo Tema.

## Ventanas, sombras y cristal

`Shell.qml` monta `ui/Main.qml` (ventana maestra, pila de widgets, morph, IPC),
`ui/bar/Bar.qml` (el host de la barra), `ui/Floating.qml` (notificaciones y
superficies tipo OSD), `ui/Mascots.qml` (el wrapper de la isla Nyx, véase
[Isla de mascotas Nyx](/es/docs/nyx)), `ui/widgets/Widgets.qml` (un cargador
de widgets por pantalla) y `ui/ScreenshotOverlay.qml`; `Lock.qml` es la entrada
alternativa de bloqueo de sesión PAM.

Hyprland no decora las superficies layer-shell, así que las sombras de los
emergentes las dibuja QML en `Main.qml` y siguen la caja animada (posición,
tamaño, morph y fundido). Se configuran en `settings.json -> shadows`
(`enabled`, `blur`, `spread`, `offsetX`, `offsetY`, `opacity`, `radius`;
escaladas por la escala de UI) desde Tema -> Sombras; `settings.json -> glass`
(`enabled`, `opacity`) vuelve translúcidos los fondos del shell para que se vea
el blur del compositor. La barra dibuja sus propias sombras con la misma
configuración.

## Widgets de escritorio

Pulse `SUPER + SHIFT + W` para abrir el editor en el monitor actual. Las
ventanas reales de los widgets se ocultan durante la edición, y cada cambio se
guarda automáticamente unos 300 ms después de la última edición.

Cinco tipos con variantes: Reloj (digital, analógico, minimalista), Música,
Tiempo (lee la caché de timex), Visualizador (instancia compartida de cava) e
Imagen (desde la carpeta de fondos de pantalla). Los diseños se almacenan por
monitor:

```
~/.local/state/quickshell/widgets/<monitor>/layout.json
```

Cada entrada del diseño guarda la variante, la posición, el tamaño, la
rotación, la opacidad y, para los widgets de Imagen, el archivo elegido; el
selector navega la carpeta de fondos. Los widgets se dibujan por encima del
fondo de pantalla y por debajo de las ventanas, en todos los monitores, con
ajuste a cuadrícula y bordes, rotación, opacidad y tiradores de
redimensionado. Los cambios de paleta los recolorean al instante.

## IPC

```sh
~/.config/hypr/scripts/qs_manager.sh toggle volume
~/.config/hypr/scripts/qs_manager.sh close
~/.config/hypr/scripts/qs_manager.sh 3        # switch to workspace 3
~/.config/hypr/scripts/qs_manager.sh 3 move   # move the window there
~/.config/hypr/scripts/qs_manager.sh prev
~/.config/hypr/scripts/qs_manager.sh next

qs ipc call main handleCommand "toggle calendar"
qs ipc call main forceReload
```

Los nombres de los widgets son las claves de `WindowRegistry.js` (`bar-editor`,
`calendar`, `volume`, etc.).

## Desarrollo

No hay CI; cada repositorio incluye una comprobación local:

```sh
scripts/check.sh   # qmllint over every .qml + node --check over JS modules
```

Recargue mientras desarrolla con `qs ipc call main forceReload`, o ejecute una
copia de la configuración (`quickshell -p /tmp/qstest/Shell.qml`) para ver los
errores de QML en primer plano. `Process` de QML llama a los scripts
directamente, por lo que los scripts copiados deben seguir siendo ejecutables,
y los glifos deben existir en la Hack Nerd Font.

## Páginas relacionadas

- [Temas y paletas](/es/docs/theming) para `Colors.qml` y las paletas.
- [Fondos de pantalla](/es/docs/wallpapers) para el selector y davincix.
- [Arquitectura y repositorios](/es/docs/architecture) para el diseño de la
  instalación.
