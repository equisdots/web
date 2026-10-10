---
title: Nyx mascot island
description: The nyx mascot island and notch: species, moods, morphology, the control-center dock and the settings that drive them.
order: 6
section: desktop
---

[equisdots/nyx](https://github.com/equisdots/nyx) is the self-contained
mascot island and control-center notch. It is deployed into the shell as
`ui/nyx/` (the dots installer handles the copy) and wrapped by
`ui/Mascots.qml`, which injects the live palette and paths. Nyx never imports
the shell core: the palette, the settings path and live data arrive as
properties, and the only runtime requirements are Quickshell, a supported
compositor (Hyprland or niri) and a Nerd Font.

On niri the exact same island runs through the [`nyx-niri`](https://github.com/equisdots/nyx-niri)
overlay. niri has **no IPC for the global pointer position**, so the Hyprland
`hyprctl cursorpos` loop is stopped and the mascots idle (pupils stay centred);
window events come from `niri msg --json event-stream`. Global cursor tracking
under niri needs privileged raw input access and is opt-in through
`NYX_CURSOR_PROVIDER` (a command whose stdout streams `x,y` lines). See
[niri compositor](/docs/niri).

## What it is

Two pieces share the same overlay:

- **The island** — a small, click-through layer surface (`qs-mascots`, input
  mask `0x0`) tinted from the active palette, one per screen. The mascots
  live inside it: their eyes follow the cursor, hovering surprises them and
  they calm down on leave.
- **The dock** — clicking the island unfolds a rectangular control center
  with a search field, a clock/now-playing hero, quick actions and a grid of
  widget miniatures. Picking one launches the shell widget through the same
  `qs_manager.sh` path the keybinds use.

The island hides while the launcher is open (it becomes the dock), when a
widget overlaps it, and after 30 seconds without input the mascots fall
asleep. Window opens and closes (Hyprland socket2) trigger staggered random
moods: angry, surprised, happy or sleepy.

## Species

`mascots.species` picks the look; `mixed` alternates cat, dog and eyes.

| Species | Look |
|---|---|
| `flame` | Default little fire with a mouth. |
| `cat` | Pointy ears, forehead stripes, whiskers, pink nose. |
| `dog` | Floppy ears, eye patch, muzzle and a tongue when happy. |
| `eyes` | A pair of manga eyes with lash, lids and tracking irises. |
| `dots` | A cluster of colored dots that trails the cursor (no face). |
| `watcher` | A digital clock retyped with a typewriter cursor. |

`classic` is accepted as an alias of `flame`.

## Island or notch

`mascots.appearance` selects between the two morphologies:

- `island` (default) — a rounded capsule with a colored border that floats
  below the bar band, at any of the nine anchors.
- `notch` — a macOS-style silhouette snapped to the top edge with no colored
  border; `notchWidth`, `notchHeight` and `notchOffset` shape it, and
  `notchReserve` (default `true`) reserves the top strip so maximized windows
  clear it. The dock still floats, or welds itself under the notch with
  `mascots.dock.style: "joined"`.

## Settings

Everything lives under `mascots` in `settings.json` and is edited live from
the editor's Theme group (page Theme → Mascots, position pad included):

| Key | Values | Default | Meaning |
|---|---|---|---|
| `mascots.enabled` | bool | `false` | Master switch. |
| `mascots.species` | `flame` `cat` `dog` `eyes` `dots` `watcher` `mixed` | `flame` | Look. |
| `mascots.count` | 1..3 | `3` | Mascots in the island (width adapts). |
| `mascots.size` | 0.6..1.6 | `1.0` | Mascot scale. |
| `mascots.position` | nine anchors | `top-center` | Island position; the dock unfolds toward the screen centre. |
| `mascots.appearance` | `island` `notch` | `island` | Morphology. |
| `mascots.dock.size` | `compact` `medium` `large` `wide` | `large` | Panel width preset. |
| `mascots.dock.columns` / `rows` | 3..7 / 1..3 | `5` / `2` | Widget grid (page size). |
| `mascots.dock.hero` / `quick` / `search` | bool | `true` | Show hero, quick actions and search. |
| `mascots.dock.favorites` | widget ids | `[]` | Tiles pinned to the Favorites tab. |
| `mascots.watcher.*` | format, seconds, speed, moods, eye | — | Watcher-species options. |
| `mascots.profiles` | object | `{}` | Named presets of the whole mascots block. |

The island margin also follows `bar.position` and `bar.thickness`, and
`uiScale` applies an extra user scale on top.

## Public API

`MascotsOverlay` exposes `enabled`, `species`, `count`, `size`, `uiScale`,
`position`, `barPosition`, `barThickness`, `appearance`, `notchWidth`,
`notchHeight`, `notchOffset`, `notchReserve`, `dockSize`, `dockWidth`,
`dockStyle`, `dockColumns`, `dockRows`, `dockShowHero`, `dockShowQuick`,
`dockShowSearch`, `quickActions`, `quickHandler`, `stats`, `favorites`, the
`watcher*` options, `palette`, `settingsPath`, `widgetStatePath`,
`dockWidgetName`, `widgetRectProvider`, `widgetList` and `widgetLauncher`.

The palette object needs `base`, `surface1`, `text`, `crust`, `red`, `yellow`,
`green`, `blue`, `mauve` and `glassOn`; a Catppuccin-Mocha fallback is built
in. `widgetRectProvider(name, sw, sh, uiScale)` returns `{ x, y, w, h }` in
screen coordinates for widgets that should hide the island when they overlap
it, and `dockWidgetName` hides it entirely for one widget (for example a
dock). `widgetList` is the array of `{ id, label, icon }` cards shown in the
click dock (an entry may carry an optional `thumb`), and `widgetLauncher(id)`
is called when one is picked.

## Integration example

```qml
Item {
    Colors { id: themeColors }              // your palette source

    MascotsOverlay {
        palette: themeColors
        settingsPath: "~/.config/hypr/settings.json"
        widgetStatePath: "/run/user/1000/quickshell/current_widget"
        dockWidgetName: "applauncher"
        widgetRectProvider: (name, sw, sh, scale) => computeRect(name)
    }
}
```

## Related pages

- [Quickshell shell](/docs/shell) for the wrapper and the widget catalog.
- [Theming and palettes](/docs/theming) for the palette object Nyx consumes.
- [Architecture and repositories](/docs/architecture) for the install layout.
