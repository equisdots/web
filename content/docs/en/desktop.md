---
title: Hyprland desktop
description: The Lua Hyprland configuration, keybinds, monitor handling, scripts, screenshots and GPU modes of the equisdots session.
order: 4
section: desktop
---

The compositor configuration lives in [equisdots/hyprland](https://github.com/equisdots/hyprland)
and is written in Lua since Hyprland 0.55. Each concern is a module loaded
with `require()`, so keybinds, animations or rules can be edited in isolation
without touching the rest.

## Configuration layout

| File | Purpose |
|---|---|
| `hyprland.lua` | Entry point; requires every module and the runtime overrides in `config/`. |
| `env.lua` | Environment variables (Wayland backends, Qt/GTK flags, XDG dirs). |
| `colors.lua` | Palette exported as a Lua table plus active/inactive border colors. |
| `variables.lua` | Core variables such as `mainMod = "SUPER"` and `terminal = "kitty"`. |
| `settings.lua` | General, decoration, input, dwindle, master, misc and xwayland options. |
| `monitors.lua` | Monitor setup; defaults to wildcard `mode = "highrr"`. |
| `keybinds.lua` | All bindings via `hl.bind()`, organized by category. |
| `animations.lua` | Bezier curves and animation definitions. |
| `windowrules.lua` | Floating, centering, size, opacity and workspace rules. |
| `workspaces.lua` | Workspace rules pinned by EDID description and scratchpads. |
| `autostart.lua` | Session startup commands (`hl.on("hyprland.start", ...)`). |
| `config/window-effects.lua` | Widget-generated decoration overrides, loaded last. |
| `config/gaps.lua` | Widget-generated gaps/border overrides, loaded last. |

Edits to a loaded Lua file trigger a full config reload. For live changes,
prefer the runtime API and persist only on settle:

```sh
hyprctl reload
hyprctl eval 'hl.config({ general = { gaps_in = 5, gaps_out = 12 } })'
```

## Keybinds

Essential bindings, all defined in `config/hypr/keybinds.lua`:

| Shortcut | Action |
|---|---|
| `SUPER + Return` | Terminal (kitty) |
| `SUPER + D` | App launcher |
| `SUPER + E` / `SUPER + F` | File manager / browser |
| `SUPER + Q` | Close active window |
| `SUPER + Space` | Toggle floating |
| `SUPER + J` | Toggle split layout |
| `SUPER + Arrow keys` | Move focus |
| `SUPER + SHIFT + Arrows` | Move window |
| `SUPER + CTRL + Arrows` | Resize window |
| `SUPER + 1-9,0` | Workspace or unified desktop |
| `SUPER + Page Up/Down` | Previous / next workspace |
| `SUPER + W` | Wallpaper picker |
| `SUPER + SHIFT + D` | Settings panel (bar editor) |
| `SUPER + SHIFT + X` | Launch xturing |
| `SUPER + L` | Lock screen |
| `SUPER + Escape` | Exit Hyprland |
| `Print` / `SUPER + Print` | Screenshot overlay / full screenshot |

Bindings are declared with the Lua API:

```lua
-- config/hypr/keybinds.lua
hl.bind(mod .. "Return", hl.dsp.exec_cmd(V.terminal))
hl.bind(mod .. "D", run("bash " .. scripts .. "/qs_manager.sh", "toggle applauncher"))
hl.bind("ALT + F4", hl.dsp.window.kill())
```

The full list is in the repository's `docs/quick-reference.md`, and the
settings panel can regenerate `config/user-keybinds.lua` for custom entries.

## Multi-monitor

`monitors.lua` uses the wildcard entry so every screen runs at its highest
refresh rate without per-machine configuration:

```lua
hl.monitor({ output = "", mode = "highrr", position = "auto", scale = "auto" })
```

### Saved layouts

Arrangements saved from the scale menu (`SUPER + Z`), the monitor manager
(`SUPER + ALT + M`) or the Monitors tab are written by
`scripts/persist-display-config.sh` to `~/.config/hypr/display-config`, one
line per monitor:

```
desc|x|y|scale|mode
```

`desc` is the EDID description, which identifies a physical screen even when
the kernel renames its connector. `scripts/restore-monitors.sh` re-applies the
layout shortly after login and reconciles it every couple of seconds. Unknown
monitors keep the wildcard auto layout.

### Unified desktops

When at least two screens listed in the roster (`ROSTER_DESCS` in
`scripts/ws-desktops-lib.sh`) are connected, the number keys switch desktops
across all screens at once. Each screen keeps its own windows per desktop.
Set `"unifiedDesktops": false` in `settings.json` to force the classic
per-monitor behavior anywhere.

## Monitor and window control with hyprctl

```sh
hyprctl monitors all
hyprctl reload
hyprctl clients
hyprctl cursorpos

hyprctl eval 'hl.monitor({ output = "DP-1", mode = "2560x1440@144", position = "0x0", scale = 1 })'
hyprctl eval 'hl.dispatch(hl.dsp.focus({ workspace = 2 }))'
hyprctl eval 'hl.dispatch(hl.dsp.exit())'
```

Window borders are pushed live by the shell through `hyprctl eval`, so palette
changes do not restart windows. See [Theming and palettes](/docs/theming).

## Scripts

Deployed to `~/.config/hypr/scripts/`:

| Script | Purpose |
|---|---|
| `qs_manager.sh` | IPC manager for every Quickshell widget and workspace routing. |
| `init.sh` | Session restore: re-applies the active scene or the last wallpaper. |
| `lock.sh` | Launches the shell's PAM session lock (`Lock.qml`). |
| `screenshot.sh` | Screenshots and recording with virtual audio. |
| `monitor-manager.sh` | Rofi monitor positioning and refresh-rate manager. |
| `scale-menu.sh` | Display scale selector (80% to 200%). |
| `gpu-mode.sh` | NVIDIA Optimus mode switching via envycontrol. |
| `workspaces.sh` | Workspace state daemon for the shell. |
| `reload.sh` | Full Quickshell QML reload. |

## Screenshots and recording

`Print` opens the interactive overlay (area selection, full screen, active
window, QR scan, magnifier, edit mode). Recording uses
`gpu-screen-recorder` with separate desktop and microphone tracks and writes
MP4 files to `~/Videos/Recordings/`.

## GPU modes

On NVIDIA Optimus laptops, `SUPER + ALT + G` cycles integrated, hybrid and
NVIDIA modes; `SUPER + ALT + SHIFT + G` opens a selector. A reboot or logout
is required after switching.

## Next steps

- [Quickshell shell](/docs/shell) for the UI that drives most of the session.
- [Wallpapers](/docs/wallpapers) for the wallpaper subsystem.
- [Theming and palettes](/docs/theming) for colors and window borders.
