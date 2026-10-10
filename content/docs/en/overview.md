---
title: Overview
description: The equisdots desktop stack: what it is, which repositories it includes, and how its parts fit together.
order: 1
section: start
---

equisdots is a complete Wayland desktop for Arch Linux built around Hyprland,
the Quickshell shell and the xwww wallpaper daemon. The same desktop also runs
on **niri**, the scrollable-tiling compositor: bar, panels, widgets, settings
editor, lock screen and the Nyx mascot are shared, and only the compositor layer
changes. Every piece is its own repository, and a single meta installer, `dots`,
clones, places and updates them together (`dotsniri` manages the niri stack).

## What the stack provides

- A Lua-configured Hyprland session or an equivalent KDL-configured niri
  session: environment, keybinds, animations, window rules, workspaces and
  autostart.
- A Quickshell UI: bar, popups, panels, settings editor, desktop widgets,
  lock screen and the Nyx mascot island/notch with its control-center dock.
- A base16 palette system shared by the shell, window borders, terminals,
  editors and browsers.
- A wallpaper kernel with still images, videos, slideshow rotation and
  interactive JavaScript scenes.
- Engines and tools: timex (time and weather), xturing (terminal settings
  UI), theme-sync (cross-app theming) and a static SDDM login theme.

## Repositories

| Repository | Provides | Installed to |
|---|---|---|
| [hyprland](https://github.com/equisdots/hyprland) | Compositor config (Lua), scripts, installer | `~/.config/hypr` |
| [niri](https://github.com/equisdots/niri) | niri compositor config (KDL), session scripts, session/portal files | `~/.config/niri` |
| [niri-meta](https://github.com/equisdots/niri-meta) | Meta installer and updater for the niri stack | `~/.local/bin/dotsniri` |
| [niri-shell](https://github.com/equisdots/niri-shell) | Overlay making the shared shell compositor-neutral | merged into the shell |
| [nyx-niri](https://github.com/equisdots/nyx-niri) | Overlay making the Nyx island compositor-neutral | merged into the shell |
| [niri-login](https://github.com/equisdots/niri-login) | Wayland session entry so DMs list "Niri" | `/usr/share/wayland-sessions` |
| [shell](https://github.com/equisdots/shell) | Quickshell UI (bar, panels, editor, popups) | `~/.config/hypr/scripts/quickshell` |
| [nyx](https://github.com/equisdots/nyx) | Mascot island/notch and control-center dock | `.../quickshell/ui/nyx` |
| [palettes](https://github.com/equisdots/palettes) | Color palettes (JSON set and schema) | `~/.config/hypr/scripts/quickshell/dock/palettes` |
| [background](https://github.com/equisdots/background) | Curated wallpaper collection and scene catalog | released as `background.zip` |
| [davincix](https://github.com/equisdots/davincix) | Wallpaper fetch/apply kernel | `~/.local/bin/davincix` |
| [theme-sync](https://github.com/equisdots/theme-sync) | Cross-app theme regeneration | `~/.local/bin/theme-sync` |
| [timex](https://github.com/equisdots/timex) | Time and weather engine plus calendar UI | `~/.local/bin/timex`, `.../quickshell/ui/timex` |
| [xturing](https://github.com/equisdots/xturing) | Terminal UI for the settings panel | `~/.local/bin/xturing` |
| [login](https://github.com/equisdots/login) | Static minimal SDDM greeter | `/usr/share/sddm/themes/x` |
| [dots](https://github.com/equisdots/dots) | Meta installer and updater | `~/.local/bin/dots` |

Managed clones live under `~/.local/share/equisdots/<repo>` (the niri stack uses
`~/.local/share/equisdots-niri/<repo>`). `dots` and `dotsniri` copy their
payload into place; they never delete a live config on their own.

## How the pieces connect

```
settings.json (bar.palette, bar, classicbar, widgets, ...)
      |
      +--> shell (Colors.qml) ------> bar, widgets, lock screen
      |
      +--> colors.lua (hyprland) ---> window borders
      |
      +--> theme-sync --------------> kitty, starship, nvim, vscode,
      |                               browsers, rofi, cava, qt, gtk, xfetch
      |
      +--> xwww scenes -------------> wallpaper follows the palette

davincix (kernel) --> xwww (stills/scenes) or mpvpaper (videos)
                  --> current_wallpaper.png for lock and SDDM
```

## Where things live

- Settings: `~/.config/hypr/settings.json` (single source of truth).
- Shell state and caches: `~/.cache/quickshell`, `~/.local/state/quickshell`.
- Wallpapers: `~/.config/hypr/wallpapers` by default.
- Palette files: `~/.config/hypr/scripts/quickshell/dock/palettes`.
- Wrappers: `dots`, `davincix`, `theme-sync`, `timex`, `xturing` in
  `~/.local/bin`.

## Requirements

An Arch Linux derivative, Hyprland 0.55 or newer (the config is Lua) **or**
niri 26.04 or newer, `git`, `rsync`, `jq`, `quickshell` (`qs`), `xwww-daemon`,
`mpvpaper` and the Hack Nerd Font. `dots doctor` (and `dotsniri doctor` for the
niri stack) reports exactly what is missing. See
[Installation](/docs/installation) for the full list.

## Documentation map

- [Installation](/docs/installation) - first setup and requirements.
- [Updating and diagnosing](/docs/updating) - `dots update` and `dots doctor`.
- [Hyprland desktop](/docs/desktop) - config modules, keybinds, monitors.
- [niri compositor](/docs/niri) - the alternative compositor front end.
- [Quickshell shell](/docs/shell) - bar, panels, widgets and IPC.
- [Nyx mascot island](/docs/nyx) - species, island/notch and the widget dock.
- [Theming and palettes](/docs/theming) - base16 palettes and theme-sync.
- [Wallpapers](/docs/wallpapers) - davincix, xwww and the picker.
- [Interactive scenes](/docs/scenes) - authoring and running JS wallpapers.
- [Tools: timex, xturing, login](/docs/tools) - the side tools.
- [Architecture and repositories](/docs/architecture) - contracts and data flow.
- [Contributing and security](/docs/contributing) - checks and reporting.

## Next steps

Run the installer from [Installation](/docs/installation), verify it with
`dots doctor`, then log out and pick Hyprland (or Niri) at the login screen.
