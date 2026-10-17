---
title: Isla de mascotas Nyx
description: La isla de mascotas y el notch de nyx: especies, estados de ánimo, morfología, el dock de centro de control y sus ajustes.
order: 6
section: desktop
---

[equisdots/nyx](https://github.com/equisdots/nyx) es la isla de mascotas y el
notch de centro de control autocontenidos, y el plugin #1 del estándar de
plugins de equisdots. Se despliega en el shell como `ui/plugins/nyx/` (el
instalador `dots` hace la copia) y lo monta el genérico `ui/PluginHosts.qml` a
través de la entrada `host` de su manifiesto, que inyecta la paleta viva y las
rutas. Nyx nunca importa el núcleo del shell: la paleta, la ruta de ajustes y
los datos en vivo llegan como propiedades, y los únicos requisitos de ejecución
son Quickshell, un compositor soportado (Hyprland o niri) y una Nerd Font.

Sobre niri la misma isla corre a través del overlay
[`nyx-niri`](https://github.com/equisdots/nyx-niri). niri **no tiene IPC para la
posición global del puntero**, así que el bucle `hyprctl cursorpos` de Hyprland
se detiene y las mascotas quedan inactivas (pupilas al centro); los eventos de
ventana llegan desde `niri msg --json event-stream`. El seguimiento global del
cursor bajo niri necesita acceso privilegiado a input crudo y es opcional
mediante `NYX_CURSOR_PROVIDER` (un comando cuyo stdout emite líneas `x,y`). Ver
[Compositor niri](/es/docs/niri).

## Integración como plugin

Nyx declara un adaptador de host y su propia página de ajustes en `plugin.json`:

```json
{
  "id": "nyx",
  "type": "shell",
  "toggle": "mascots.enabled",
  "host": "host/Mascots.qml",
  "settings": { "page": "settings/NyxPage.qml", "label": "Nyx" },
  "provides": { "mascots": { "species": "mascots", "cards": "notch" } }
}
```

- `host` lo monta genéricamente `ui/PluginHosts.qml`; corre dentro del árbol del
  shell y publica rectángulos `frameObstacle` para que el marco de pantalla se
  adapte a la isla.
- `settings.page` aparece como **Plugins → Nyx** y edita todo el bloque de
  mascotas. El interruptor maestro es el mismo `mascots.enabled`, así que la
  tarjeta del plugin nunca lo duplica.
- `provides.mascots` es la regla de extensión propia de Nyx: cualquier plugin
  instalado puede declarar las mismas claves para añadir especies o tarjetas de
  notch; los archivos de usuario en `~/.config/hypr/mascots/` siguen ganando por
  `id`.
- `defaults.json` posee los valores por defecto de mascotas; el `settings.json`
  central solo guarda la activación del plugin.

Consulte [Plugins y extensiones](/es/docs/plugins) para el estándar y la CLI.

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

`mascots.species` elige el aspecto: un id pinta todas las mascotas (o `mixed`), y
un **array** asigna una mascota por id. `classic` es un alias de `flame`.

| Especie | Aspecto |
|---|---|
| `flame` | Fuego pequeño por defecto, con boca. |
| `cat` | Orejas puntiagudas, rayas en la frente, bigotes, nariz rosa. |
| `dog` | Orejas caídas, parche en el ojo, hocico y lengua cuando está feliz. |
| `eyes` | Un par de ojos manga con pestañas, párpados e iris que siguen. |
| `dots` | Un grupo de puntos de color que sigue el cursor (sin cara). |
| `watcher` | Un reloj digital reescrito con cursor de máquina de escribir. |
| `battery` `cpu` `memory` `wifi` `volume` `temperature` | Especies informativas sobre `InfoMascot`: glifo más valor en vivo. |
| `github` | Octocat que abre un popover con el heatmap de contribuciones de `options.user`. |

Las especies se descubren en la carpeta `mascots/` del plugin y en
`~/.config/hypr/mascots/species/`; un manifiesto de usuario con el mismo `id`
anula el distribuido. Un archivo QML `popover` opcional hace la especie
clicable. `customizable` y `controls` declaran las opciones que expone la página
de ajustes (`color`, `size`, `text`).

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

Todo vive bajo `mascots` en el archivo de ajustes propio del plugin
(`~/.config/hypr/plugins/nyx/settings.json`) y se edita en vivo desde
**Plugins → Nyx** (la misma página se refleja en el grupo Tema):

| Clave | Valores | Por defecto | Significado |
|---|---|---|---|
| `mascots.enabled` | bool | `false` | Interruptor maestro (el `toggle` del plugin). |
| `mascots.species` | id, `mixed` o array de ids | `flame` | Aspecto; un array es una alineación. |
| `mascots.count` | 1..8 | `3` | Mascotas en la isla (solo en modo string). |
| `mascots.size` | 0.6..1.6 | `1.0` | Escala de la mascota. |
| `mascots.position` | nueve anclas | `top-center` | Posición de la isla; el dock se despliega hacia el centro. |
| `mascots.appearance` | `island` `notch` | `island` | Morfología. |
| `mascots.notchWidth` / `notchHeight` / `notchOffset` | px | `260` / `0` / `0` | Forma del notch; altura `0` es automática. |
| `mascots.notchReserve` | bool | `true` | Reserva la franja superior para que las ventanas maximizadas esquiven el notch. |
| `mascots.dock.size` | `compact` `medium` `large` `wide` | `large` | Ancho del panel. |
| `mascots.dock.width` | px | `0` | Ancho explícito (`0` usa el preset). |
| `mascots.dock.style` | `floating` `joined` | `floating` | Suelda el dock bajo el notch o lo deja flotando. |
| `mascots.dock.columns` / `rows` | 3..7 / 1..3 | `5` / `2` | Rejilla de widgets (página). |
| `mascots.dock.hero` / `quick` / `search` | bool | `true` | Mostrar hero, acciones rápidas y búsqueda. |
| `mascots.dock.favorites` | ids de widgets | `[]` | Tarjetas fijadas en la pestaña Favorites. |
| `mascots.watcher.*` | formato, segundos, velocidad, moods, eye | — | Opciones de la especie watcher. |
| `mascots.profiles` | objeto | `{}` | Presets con nombre de todo el bloque. |
| `uiScale` | número | `1.0` | Escala de usuario extra. |
| `bar.position` / `bar.thickness` | string / px | `top` / `48` | Margen de la isla bajo la barra. |

El margen de la isla sigue también `bar.position` y `bar.thickness`.

## API pública

`MascotsOverlay` expone `enabled`, `species` (string o array),
`mascotCatalog`, `count`, `size`, `uiScale`, `position`, `barPosition`,
`barThickness`, `appearance`, `notchWidth`, `notchHeight`, `notchOffset`,
`notchReserve`, `dockSize`, `dockWidth`, `dockStyle`, `dockColumns`, `dockRows`,
`dockShowHero`, `dockShowQuick`, `dockShowSearch`, `quickActions`,
`quickHandler`, `stats`, `favorites`, las opciones `watcher*`, `palette`,
`settingsPath`, `widgetStatePath`, `dockWidgetName`, `widgetRectProvider`,
`widgetList` y `widgetLauncher`.

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

- [Plugins y extensiones](/es/docs/plugins) para el manifiesto y la CLI.
- [Shell Quickshell](/es/docs/shell) para el adaptador de host y el catálogo de widgets.
- [Temas y paletas](/es/docs/theming) para el objeto de paleta que consume Nyx.
- [Arquitectura y repositorios](/es/docs/architecture) para el esquema de instalación.
