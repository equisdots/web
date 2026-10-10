---
title: Isla de mascotas Nyx
description: La isla de mascotas y el notch de nyx: especies, estados de ánimo, morfología, el dock de centro de control y sus ajustes.
order: 6
section: desktop
---

[equisdots/nyx](https://github.com/equisdots/nyx) es la isla de mascotas y el
notch de centro de control autocontenidos. Se despliega en el shell como
`ui/nyx/` (el instalador `dots` hace la copia) y lo envuelve `ui/Mascots.qml`,
que inyecta la paleta viva y las rutas. Nyx nunca importa el núcleo del shell:
la paleta, la ruta de ajustes y los datos en vivo llegan como propiedades, y
los únicos requisitos de ejecución son Quickshell, un compositor soportado
(Hyprland o niri) y una Nerd Font.

Sobre niri la misma isla corre a través del overlay
[`nyx-niri`](https://github.com/equisdots/nyx-niri). niri **no tiene IPC para la
posición global del puntero**, así que el bucle `hyprctl cursorpos` de Hyprland
se detiene y las mascotas quedan inactivas (pupilas al centro); los eventos de
ventana llegan desde `niri msg --json event-stream`. El seguimiento global del
cursor bajo niri necesita acceso privilegiado a input crudo y es opcional
mediante `NYX_CURSOR_PROVIDER` (un comando cuyo stdout emite líneas `x,y`). Ver
[Compositor niri](/es/docs/niri).

## Qué es

Dos piezas comparten el mismo overlay:

- **La isla** — una superficie de capa pequeña y click-through (`qs-mascots`,
  máscara de entrada `0x0`) tintada con la paleta activa, una por pantalla.
  Las mascotas viven dentro: sus ojos siguen el cursor, pasar por encima las
  sorprende y se calman al salir.
- **El dock** — al hacer clic en la isla se despliega un centro de control
  rectangular con buscador, un hero de reloj/now-playing, acciones rápidas y
  una rejilla de miniaturas de widgets. Elegir una lanza el widget del shell
  por el mismo camino de `qs_manager.sh` que usan los atajos.

La isla se oculta mientras el lanzador está abierto (se convierte en el dock),
cuando un widget la solapa y, tras 30 segundos sin interacción, las mascotas
se duermen. Abrir y cerrar ventanas (socket2 de Hyprland) dispara estados de
ánimo aleatorios y escalonados: enfadado, sorprendido, feliz o somnoliento.

## Especies

`mascots.species` elige el aspecto; `mixed` alterna gato, perro y ojos.

| Especie | Aspecto |
|---|---|
| `flame` | Fuego pequeño por defecto, con boca. |
| `cat` | Orejas puntiagudas, rayas en la frente, bigotes, nariz rosa. |
| `dog` | Orejas caídas, parche en el ojo, hocico y lengua cuando está feliz. |
| `eyes` | Un par de ojos manga con pestañas, párpados e iris que siguen. |
| `dots` | Un grupo de puntos de color que sigue el cursor (sin cara). |
| `watcher` | Un reloj digital reescrito con cursor de máquina de escribir. |

`classic` se acepta como alias de `flame`.

## Isla o notch

`mascots.appearance` elige entre las dos morfologías:

- `island` (por defecto) — una cápsula redondeada con borde de color que
  flota bajo la banda de la barra, en cualquiera de las nueve anclas.
- `notch` — una silueta estilo macOS pegada al borde superior y sin borde de
  color; `notchWidth`, `notchHeight` y `notchOffset` la modelan, y
  `notchReserve` (por defecto `true`) reserva la franja superior para que las
  ventanas maximizadas la esquiven. El dock sigue flotando, o se suelda bajo
  el notch con `mascots.dock.style: "joined"`.

## Ajustes

Todo vive bajo `mascots` en `settings.json` y se edita en vivo desde el grupo
Theme del editor (página Theme → Mascots, con pad de posición incluido):

| Clave | Valores | Por defecto | Significado |
|---|---|---|---|
| `mascots.enabled` | bool | `false` | Interruptor maestro. |
| `mascots.species` | `flame` `cat` `dog` `eyes` `dots` `watcher` `mixed` | `flame` | Aspecto. |
| `mascots.count` | 1..3 | `3` | Mascotas en la isla (el ancho se adapta). |
| `mascots.size` | 0.6..1.6 | `1.0` | Escala de la mascota. |
| `mascots.position` | nueve anclas | `top-center` | Posición de la isla; el dock se despliega hacia el centro. |
| `mascots.appearance` | `island` `notch` | `island` | Morfología. |
| `mascots.dock.size` | `compact` `medium` `large` `wide` | `large` | Ancho del panel. |
| `mascots.dock.columns` / `rows` | 3..7 / 1..3 | `5` / `2` | Rejilla de widgets (página). |
| `mascots.dock.hero` / `quick` / `search` | bool | `true` | Mostrar hero, acciones rápidas y búsqueda. |
| `mascots.dock.favorites` | ids de widgets | `[]` | Tarjetas fijadas en la pestaña Favorites. |
| `mascots.watcher.*` | formato, segundos, velocidad, moods, eye | — | Opciones de la especie watcher. |
| `mascots.profiles` | objeto | `{}` | Presets con nombre de todo el bloque. |

El margen de la isla sigue también `bar.position` y `bar.thickness`, y
`uiScale` aplica una escala de usuario extra.

## API pública

`MascotsOverlay` expone `enabled`, `species`, `count`, `size`, `uiScale`,
`position`, `barPosition`, `barThickness`, `appearance`, `notchWidth`,
`notchHeight`, `notchOffset`, `notchReserve`, `dockSize`, `dockWidth`,
`dockStyle`, `dockColumns`, `dockRows`, `dockShowHero`, `dockShowQuick`,
`dockShowSearch`, `quickActions`, `quickHandler`, `stats`, `favorites`, las
opciones `watcher*`, `palette`, `settingsPath`, `widgetStatePath`,
`dockWidgetName`, `widgetRectProvider`, `widgetList` y `widgetLauncher`.

El objeto de paleta necesita `base`, `surface1`, `text`, `crust`, `red`,
`yellow`, `green`, `blue`, `mauve` y `glassOn`; incluye un fallback a
Catppuccin Mocha. `widgetRectProvider(name, sw, sh, uiScale)` devuelve
`{ x, y, w, h }` en coordenadas de pantalla para los widgets que deben ocultar
la isla al solaparla, y `dockWidgetName` la oculta por completo para un widget
(por ejemplo un dock). `widgetList` es el array de tarjetas
`{ id, label, icon }` que se muestran en el dock (una entrada puede llevar un
`thumb` opcional), y `widgetLauncher(id)` se llama al elegir una.

## Ejemplo de integración

```qml
Item {
    Colors { id: themeColors }              // tu fuente de paleta

    MascotsOverlay {
        palette: themeColors
        settingsPath: "~/.config/hypr/settings.json"
        widgetStatePath: "/run/user/1000/quickshell/current_widget"
        dockWidgetName: "applauncher"
        widgetRectProvider: (name, sw, sh, scale) => computeRect(name)
    }
}
```

## Páginas relacionadas

- [Shell Quickshell](/es/docs/shell) para el wrapper y el catálogo de widgets.
- [Temas y paletas](/es/docs/theming) para el objeto de paleta que consume Nyx.
- [Arquitectura y repositorios](/es/docs/architecture) para el esquema de instalación.
