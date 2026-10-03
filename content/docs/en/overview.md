---
title: Overview
description: The equisdots desktop stack: what it is, which repositories it includes, and how its parts fit together.
order: 1
section: start
---

equisdots is a complete Wayland desktop for Arch Linux built around Hyprland,
the Quickshell shell and the xwww wallpaper daemon. Every piece is its own
repository, and a single meta installer, `dots`, clones, places and updates
them together.

## What the stack provides

- A Lua-configured Hyprland session: environment, keybinds, animations,
  window rules, workspaces and autostart.
- A Quickshell UI: bar, popups, panels, settings editor, desktop widgets and
  lock screen.
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
| [shell](https://github.com/equisdots/shell) | Quickshell UI (bar, panels, editor, popups) | `~/.config/hypr/scripts/quickshell` |
| [palettes](https://github.com/equisdots/palettes) | Color palettes (JSON set and schema) | `~/.config/hypr/scripts/quickshell/dock/palettes` |
| [davincix](https://github.com/equisdots/davincix) | Wallpaper fetch/apply kernel | `~/.local/bin/davincix` |
| [theme-sync](https://github.com/equisdots/theme-sync) | Cross-app theme regeneration | `~/.local/bin/theme-sync` |
| [timex](https://github.com/equisdots/timex) | Time and weather engine plus calendar UI | `~/.local/bin/timex`, `.../quickshell/ui/timex` |
| [xturing](https://github.com/equisdots/xturing) | Terminal UI for the settings panel | `~/.local/bin/xturing` |
| [login](https://github.com/equisdots/login) | Static minimal SDDM greeter | `/usr/share/sddm/themes/x` |
| [dots](https://github.com/equisdots/dots) | Meta installer and updater | `~/.local/bin/dots` |

Managed clones live under `~/.local/share/equisdots/<repo>`. `dots` copies
their payload into place; it never deletes a live config on its own.

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

An Arch Linux derivative, Hyprland 0.55 or newer (the config is Lua), `git`,
`rsync`, `jq`, `quickshell` (`qs`), `xwww-daemon`, `mpvpaper` and the Hack
Nerd Font. `dots doctor` reports exactly what is missing. See
[Installation](/docs/installation) for the full list.

## Documentation map

- [Installation](/docs/installation) - first setup and requirements.
- [Updating and diagnosing](/docs/updating) - `dots update` and `dots doctor`.
- [Hyprland desktop](/docs/desktop) - config modules, keybinds, monitors.
- [Quickshell shell](/docs/shell) - bar, panels, widgets and IPC.
- [Theming and palettes](/docs/theming) - base16 palettes and theme-sync.
- [Wallpapers](/docs/wallpapers) - davincix, xwww and the picker.
- [Interactive scenes](/docs/scenes) - authoring and running JS wallpapers.
- [Tools: timex, xturing, login](/docs/tools) - the side tools.
- [Architecture and repositories](/docs/architecture) - contracts and data flow.
- [Contributing and security](/docs/contributing) - checks and reporting.

## Next steps

Run the installer from [Installation](/docs/installation), verify it with
`dots doctor`, then log out and pick Hyprland at the login screen.
