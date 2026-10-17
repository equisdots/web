---
title: Nyx mascot island
description: The nyx mascot island and notch: species, moods, morphology, the control-center dock and the settings that drive them.
order: 6
section: desktop
---

[equisdots/nyx](https://github.com/equisdots/nyx) is the self-contained
mascot island and control-center notch, and plugin #1 of the equisdots plugin
standard. It is deployed into the shell as `ui/plugins/nyx/` (the dots installer
handles the copy) and mounted by the generic `ui/PluginHosts.qml` through its
manifest `host` entry, which injects the live palette and paths. Nyx never
imports the shell core: the palette, the settings path and live data arrive as
properties, and the only runtime requirements are Quickshell, a supported
compositor (Hyprland or niri) and a Nerd Font.

On niri the exact same island runs through the [`nyx-niri`](https://github.com/equisdots/nyx-niri)
overlay. niri has **no IPC for the global pointer position**, so the Hyprland
`hyprctl cursorpos` loop is stopped and the mascots idle (pupils stay centred);
window events come from `niri msg --json event-stream`. Global cursor tracking
under niri needs privileged raw input access and is opt-in through
`NYX_CURSOR_PROVIDER` (a command whose stdout streams `x,y` lines). See
[niri compositor](/docs/niri).

## Plugin integration

Nyx declares a host adapter and its own settings page in `plugin.json`:

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

- `host` is mounted generically by `ui/PluginHosts.qml`; it runs inside the
  shell tree and publishes `frameObstacle` rects so the screen frame hugs the
  island.
- `settings.page` appears as **Plugins → Nyx** and edits the whole mascots
  block. The master switch is the same `mascots.enabled`, so the plugin card
  never duplicates it.
- `provides.mascots` is Nyx's own extension rule: any installed plugin may
  declare the same keys to add species or notch cards; user files under
  `~/.config/hypr/mascots/` still win on `id`.
- `defaults.json` owns the mascots defaults; the core `settings.json` keeps
  only plugin enablement.

See [Plugins and extensions](/docs/plugins) for the standard and the CLI.

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

`mascots.species` picks the look: one id paints every mascot (or `mixed`), and
an **array** gives one mascot per id. `classic` is an alias of `flame`.

| Species | Look |
|---|---|
| `flame` | Default little fire with a mouth. |
| `cat` | Pointy ears, forehead stripes, whiskers, pink nose. |
| `dog` | Floppy ears, eye patch, muzzle and a tongue when happy. |
| `eyes` | A pair of manga eyes with lash, lids and tracking irises. |
| `dots` | A cluster of colored dots that trails the cursor (no face). |
| `watcher` | A digital clock retyped with a typewriter cursor. |
| `battery` `cpu` `memory` `wifi` `volume` `temperature` | Info species built on `InfoMascot`: glyph plus live value. |
| `github` | Octocat that opens a contribution heatmap popover for `options.user`. |

Species are discovered from the plugin's `mascots/` folder and the user folder
`~/.config/hypr/mascots/species/`; a user manifest with the same `id`
overrides the shipped one. An optional `popover` QML file makes a species
clickable. `customizable` and `controls` declare the options the settings page
exposes (`color`, `size`, `text`).

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

Everything lives under `mascots` in the plugin's own settings file
(`~/.config/hypr/plugins/nyx/settings.json`) and is edited live from
**Plugins → Nyx** (the same page is mirrored in the Theme group):

| Key | Values | Default | Meaning |
|---|---|---|---|
| `mascots.enabled` | bool | `false` | Master switch (the plugin's `toggle`). |
| `mascots.species` | species id, `mixed`, or an array of ids | `flame` | Look; an array is a lineup. |
| `mascots.count` | 1..8 | `3` | Mascots in the island (string mode only). |
| `mascots.size` | 0.6..1.6 | `1.0` | Mascot scale. |
| `mascots.position` | nine anchors | `top-center` | Island position; the dock unfolds toward the screen centre. |
| `mascots.appearance` | `island` `notch` | `island` | Morphology. |
| `mascots.notchWidth` / `notchHeight` / `notchOffset` | px | `260` / `0` / `0` | Notch shape; height `0` is automatic. |
| `mascots.notchReserve` | bool | `true` | Reserve the top strip so maximized windows clear the notch. |
| `mascots.dock.size` | `compact` `medium` `large` `wide` | `large` | Panel width preset. |
| `mascots.dock.width` | px | `0` | Explicit width (`0` uses the preset). |
| `mascots.dock.style` | `floating` `joined` | `floating` | Weld the dock under the notch or float it. |
| `mascots.dock.columns` / `rows` | 3..7 / 1..3 | `5` / `2` | Widget grid (page size). |
| `mascots.dock.hero` / `quick` / `search` | bool | `true` | Show hero, quick actions and search. |
| `mascots.dock.favorites` | widget ids | `[]` | Tiles pinned to the Favorites tab. |
| `mascots.watcher.*` | format, seconds, speed, moods, eye | — | Watcher-species options. |
| `mascots.profiles` | object | `{}` | Named presets of the whole mascots block. |
| `uiScale` | number | `1.0` | Extra user scale. |
| `bar.position` / `bar.thickness` | string / px | `top` / `48` | Island margin below the bar band. |

The island margin also follows `bar.position` and `bar.thickness`.

## Public API

`MascotsOverlay` exposes `enabled`, `species` (string or array),
`mascotCatalog`, `count`, `size`, `uiScale`, `position`, `barPosition`,
`barThickness`, `appearance`, `notchWidth`, `notchHeight`, `notchOffset`,
`notchReserve`, `dockSize`, `dockWidth`, `dockStyle`, `dockColumns`,
`dockRows`, `dockShowHero`, `dockShowQuick`, `dockShowSearch`, `quickActions`,
`quickHandler`, `stats`, `favorites`, the `watcher*` options, `palette`,
`settingsPath`, `widgetStatePath`, `dockWidgetName`, `widgetRectProvider`,
`widgetList` and `widgetLauncher`.

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

- [Plugins and extensions](/docs/plugins) for the manifest and plugin CLI.
- [Quickshell shell](/docs/shell) for the host adapter and the widget catalog.
- [Theming and palettes](/docs/theming) for the palette object Nyx consumes.
- [Architecture and repositories](/docs/architecture) for the install layout.
