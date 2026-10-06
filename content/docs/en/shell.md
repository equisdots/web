---
title: Quickshell shell
description: The Quickshell UI of equisdots: bar engines, panels, settings editor, desktop widgets and IPC.
order: 5
section: desktop
---

The shell in [equisdots/shell](https://github.com/equisdots/shell) is a
Quickshell application that provides the bar, popups, panels, the settings
editor, the desktop widgets and the lock screen. It is written in QML with a
small JavaScript layer for pure logic.

`Shell.qml` is the main entry: it mounts the master window, the bar, the
floating layer and the desktop widgets. `Lock.qml` is the alternate entry for
the PAM session lock (`WlSessionLock`), launched by `lock.sh`; both import the
same `core/` services.

## Architecture

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

The widget call chain is always the same:
`keybind -> qs_manager.sh -> qs ipc call main handleCommand "toggle <widget>"
-> ui/Main.qml -> WindowRegistry.getLayout() -> StackView.replace`.

`settings.json` is the single source of truth. Panels write through
`Config.setSetting(key, value)` and watch the file so external edits (xturing,
manual JSON edits) apply live.

## The bar

The bar host (`ui/bar/Bar.qml`) runs two interchangeable engines on any screen
edge (`top`, `bottom`, `left`, `right`), switched live through
`settings.json -> barEngine`:

- `bar` (default): islands grouped into data-driven zones (`start`, `center`,
  `end`) with module drag and drop, per-zone backgrounds and unify mode.
- `classic`: left/center/right sections, autohide and distinct pill styles.

Both engines share the palette and the 18 modules: help, search, settings,
update, recording, time, date, media, workspaces, tray, keyboard, wifi,
bluetooth, sysmon, volume, battery, weather and focus. `weather` and `focus`
ship disabled so upgrades never change a layout on their own.

### Customizing the bar and its modules

Every module in `ui/bar/modules/` is one island pill built on the shared
`ModulePill` component: it declares what to show, and the pill handles the
background, border, hover scale, entrance animation and clicks. The zone (or
the classic engine) always injects the same seven properties — `bar`,
`colors`, `zoneReady`, `slotIndex`, `effectiveBorderWidth`,
`effectiveBorderColor` and `unified` — and `ModulePill` adds the orientation
helpers plus the normalized per-module config.

Per-module values live under `bar.modules.<id>` and every field is optional:

| Field | Meaning |
|---|---|
| `icon` | Glyph override (help, search, settings, update, keyboard, wifi, bluetooth, volume, battery, weather, focus, recording). |
| `color` | Content color: a `colors.*` role name or a `#hex` string. |
| `fill` | Island fill: `default` / `on` / `off`. |
| `accent` | Accent role override (for example `green`), turning the island into an accent island. |
| `size` | Font pixel size override (0 keeps the module default). |
| `effect` / `cursor` | Per-module view effect (`typewriter` on the clock) and its blinking cursor. |

The workspaces module has its own bar-wide options: `workspacesMarker`
(`number`, `dot`, `letter`, `custom`) and `workspacesMarkerText`. Built-in
defaults give `battery`, `settings`, `search`, `time` and `help` their
palette fill, and every module has a built-in accent role that follows the
active palette.

Key options under `bar` in `settings.json`:

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

The Bar Editor (Theme and Bar groups) exposes the same keys visually; see the
pages listed below. Colors always come from the active palette through
`ui/bar/Colors.qml`.

## Widgets and panels

All popups dispatch through `qs_manager.sh`. Main shortcuts:

| Shortcut | Widget |
|---|---|
| `SUPER + D` | App launcher |
| `SUPER + C` / `V` / `B` / `N` | Clipboard / volume / battery / network |
| `SUPER + S` / `Z` | Calendar (timex) / display scale |
| `SUPER + M` / `SUPER + P` | Music / idle |
| `SUPER + W` | Wallpaper picker (davincix) |
| `SUPER + I` / `SUPER + U` | System monitor / updater |
| `SUPER + Y` / `SUPER + O` | Quick notes / RSS reader |
| `SUPER + '` | File search |
| `SUPER + SHIFT + S` / `D` | Settings panel (bar editor) |
| `SUPER + SHIFT + W` | Desktop widget redactor |
| `SUPER + SHIFT + P` | Palette widget |

The settings panel is data-driven from `core/EditorNav.js` with groups Shell,
Bar, Theme, Behavior and System. Collapse state and page order persist under
`settings.editor`. The notification system has its own options
(`settings.notifications`), and shadows, glass and mascots are configured from
the Theme group.

## Windows, shadows and glass

`Shell.qml` mounts `ui/Main.qml` (master window, widget stack, morph, IPC),
`ui/bar/Bar.qml` (the bar host), `ui/Floating.qml` (notifications and
OSD-like surfaces), `ui/Mascots.qml` (the Nyx island wrapper, see
[Nyx mascot island](/docs/nyx)), `ui/widgets/Widgets.qml` (one widget loader
per screen) and `ui/ScreenshotOverlay.qml`; `Lock.qml` is the alternate PAM
session-lock entry.

Hyprland does not decorate layer-shell surfaces, so popup shadows are drawn
in QML by `Main.qml` and follow the animated box (position, size, morph and
fade). Configure them under `settings.json -> shadows` (`enabled`, `blur`,
`spread`, `offsetX`, `offsetY`, `opacity`, `radius`; scaled by the UI scale)
from Theme -> Shadows; `settings.json -> glass` (`enabled`, `opacity`) makes
the shell backgrounds translucent so the compositor backdrop blur shows
through. The bar draws its own shadows from the same config.

## Desktop widgets

Press `SUPER + SHIFT + W` to open the redactor on the current monitor. The
real widget windows are hidden while editing, and every change is persisted
automatically about 300 ms after the last edit.

Five types with variants: Clock (digital, analog, minimal), Music, Weather
(reads the timex cache), Visualizer (shared cava instance) and Image (from the
wallpaper folder). Layouts are stored per monitor:

```
~/.local/state/quickshell/widgets/<monitor>/layout.json
```

Each layout entry stores the variant, position, size, rotation, opacity and,
for Image widgets, the chosen file; the picker browses the wallpaper folder.
Widgets render above the wallpaper and below windows, on every monitor, with
grid and edge snapping, rotation, opacity and resize handles. Palette changes
recolor them instantly.

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

Widget names are the `WindowRegistry.js` keys (`bar-editor`, `calendar`,
`volume`, and so on).

## Development

There is no CI; each repository ships a local check:

```sh
scripts/check.sh   # qmllint over every .qml + node --check over JS modules
```

Reload while developing with `qs ipc call main forceReload`, or run a copied
config (`quickshell -p /tmp/qstest/Shell.qml`) to see QML errors in the
foreground. QML `Process` calls scripts directly, so copied scripts must stay
executable, and glyphs must exist in the Hack Nerd Font.

## Related pages

- [Theming and palettes](/docs/theming) for `Colors.qml` and palettes.
- [Wallpapers](/docs/wallpapers) for the picker and davincix.
- [Architecture and repositories](/docs/architecture) for the install layout.
