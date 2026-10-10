---
title: niri compositor
description: The niri alternative compositor: KDL config, session scripts, the compositor-neutral shell and how the shared stack runs on both Hyprland and niri.
order: 8
section: desktop
---

equisdots runs on **niri** as well as Hyprland. niri is a scrollable-tiling
Wayland compositor: windows live in columns on an infinite horizontal strip per
monitor, workspaces are dynamic and independent per monitor, and the config is a
single KDL document that hot-reloads on save. The whole UI is shared: the same
bar, panels, widgets, settings editor, lock screen and Nyx mascot run on both
compositors, and only the compositor layer changes.

## The niri repositories

niri support is a set of small repositories that sit beside the Hyprland ones.

| Repository | Role | Installed to |
|---|---|---|
| [niri](https://github.com/equisdots/niri) | niri compositor config (KDL), session scripts, session/portal files | `~/.config/niri` |
| [niri-meta](https://github.com/equisdots/niri-meta) | Meta installer and updater (`dotsniri`) for the niri stack | `~/.local/bin/dotsniri` |
| [niri-shell](https://github.com/equisdots/niri-shell) | Overlay that makes the shared Quickshell shell compositor-neutral | merged into `.../quickshell` |
| [nyx-niri](https://github.com/equisdots/nyx-niri) | Overlay that makes the shared Nyx mascot island compositor-neutral | merged into `.../quickshell/ui/nyx` |
| [niri-login](https://github.com/equisdots/niri-login) | Wayland session entry so display managers list "Niri" | `/usr/share/wayland-sessions` |

`hyprland` and `niri` are the two compositor front ends; the rest of the stack
(`shell`, `nyx`, `palettes`, `theme-sync`, `background`, `timex`, `davincix`,
`login`) is shared by both.

## One data root, two compositors

The niri layer uses **strategy A**: the shared equisdots data root stays at
`~/.config/hypr`, and only the compositor config moves to `~/.config/niri`.

- `~/.config/hypr/settings.json`, `palettes/`, `wallpapers/`, the Quickshell
  shell (`~/.config/hypr/scripts/quickshell`) and the shared scripts
  (`lock.sh`, `volume.sh`, `qs_manager.sh`, ...) are reused unchanged.
- The niri scripts read the shared root through `EQUISDOTS_CONFIG_DIR`
  (default `~/.config/hypr`).
- Hyprland and niri can run side by side from one `settings.json` and one
  palette store.

Only the compositor-specific pieces differ: the KDL config, the workspace
event-stream daemon and the shell backend.

## The compositor-neutral shell

The `shell` repository stays Hyprland-first; [`niri-shell`](https://github.com/equisdots/niri-shell)
is an overlay that adds what niri needs and leaves everything else untouched:

```
equisdots/shell/             (base, unchanged)
        +
niri-shell/ + nyx-niri/      (overlays: only the files that differ)
        =
~/.config/hypr/scripts/quickshell/   (deployed, compositor-neutral)
```

`core/Compositor.qml` selects the backend at runtime:

- `XDG_CURRENT_DESKTOP` containing `niri`, or a set `NIRI_SOCKET`, loads
  `core/compositors/Niri.qml`;
- any other value (or both unset) loads `core/compositors/Hyprland.qml`.

niri sets both `XDG_CURRENT_DESKTOP=niri` and `NIRI_SOCKET`, so accepting either
signal keeps the backend correct. Widgets never branch on the compositor: they
consume the same surface (`workspacesCommand`, `keyboardCommand`,
`focusCommand`, `setWindowBorders`, `switchWorkspace`,
`cycleKeyboardLayout`).

| Concern | Hyprland | niri |
|---|---|---|
| Workspaces JSON | `hyprctl` + `.socket2.sock` | `niri msg --json event-stream` |
| Keyboard layout | `hyprctl devices -j` | `niri msg --json keyboard-layouts` |
| Focused window | `hyprctl activewindow -j` | `niri msg --json focused-window` |
| Borders | `hyprctl eval` | `generated/borders.kdl` + reload |
| Keybinds / startup / appearance | `config/*.lua` + reload | `generated/user-*.kdl` + reload |
| Effects | `hyprctl getoption/eval` | `generated/theme-effects.kdl` + reload |
| Monitors | `hl.monitor` + `display-config` | `generated/outputs.kdl` + reload |

Live changes under niri write a fragment under `~/.config/niri/generated/` and
reload, because niri has no `hyprctl eval`.

## Configuration

`~/.config/niri/config.kdl` is the entry point; it includes the translated
modules and the generated fragments:

```
config/niri/
  config.kdl            entry: includes modules, top-level options, generated
  modules/
    environment.kdl     env vars (GDK_BACKEND is deliberately not set)
    input.kdl           keyboard, touchpad, mouse
    layout.kdl          gaps, borders, focus-ring
    animations.kdl      springs and easing
    workspaces.kdl      named workspaces
    window-rules.kdl    per-app rules
    layer-rules.kdl     layer surfaces (no forced blur)
    autostart.kdl       session startup
    keybinds.kdl        binds
  generated/            runtime fragments (gitignored)
```

niri's KDL parser is strict: a block whose last node is not terminated before
`}` fails to parse, and an invalid config makes niri fall back to its defaults
(a grey screen with the hotkeys overlay, no error on screen). Always validate:

```sh
niri validate -c ~/.config/niri/config.kdl
```

## Keybinds and workspaces

Most bindings match Hyprland. Where Hyprland allowed a key to have two actions,
niri rejects duplicates, so the conflicts were resolved: focus wins for
`Super+H/J/L`, and lock moved to `Super+Alt+L`. The `scratch` overlay is a named
workspace (`Super+A`). Workspaces are dynamic, but the numbered binds still work
(indices `1..0`); app placement uses named workspaces (`browser`, `code`,
`chat`, `media`, `games`, `scratch`).

## Graphical substitutions

Where a Hyprland visual feature has no niri equivalent, it is replaced rather
than dropped silently:

| Hyprland | niri |
|---|---|
| Per-window tearing (`immediate`) | `variable-refresh-rate on-demand=true` + a game window rule |
| Layer blur per namespace (`ignore_alpha`) | No forced layer blur; `ext-background-effect` surfaces use the global `blur {}` tuning |
| Accent coloured active border | Neutral grey default, refined by the shell from the palette's muted `color8` |
| `mako`/`dunst` daemon | The shell registers `org.freedesktop.Notifications` itself |
| `dim_inactive` | `window-rule { match is-active=false; opacity 0.80 }` |
| Special workspace (scratchpad overlay) | Named workspace `scratch` (`Super+A`) |
| `center` floating rule | remembered floating position |
| `hyprpicker` | `niri_pick_color.sh` (niri pick-color) |
| Screenshot `--edit` | pipe the capture to `satty` in `niri_screenshot.sh` |
| Output mirroring | no hardware mirror; run `wl-mirror` as a window |

Screenshots open the same equisdots overlay as Hyprland, and recording uses
`gpu-screen-recorder` through `niri_record.sh`.

## Nyx on niri

The mascot island runs unchanged, with one graceful limitation: niri has **no
IPC for the global pointer position**, so the Hyprland `hyprctl cursorpos` loop
is stopped and the mascots idle (pupils stay centred). Window events come from
`niri msg --json event-stream`. Global cursor tracking needs privileged raw
input access; it is opt-in and experimental through `NYX_CURSOR_PROVIDER` (a
command whose stdout streams `x,y` lines). See [Nyx mascot island](/docs/nyx).

## Installing niri with dotsniri

`dotsniri` is a separate meta installer and updater, parallel to `dots`. It uses
its own clone root (`~/.local/share/equisdots-niri`) so a parallel `dots`
install is untouched, and the two stacks coexist on one machine.

```sh
# one-liner install
bash <(curl -fsSL https://raw.githubusercontent.com/equisdots/niri-meta/main/bin/dotsniri) install

# common commands
dotsniri install          # clone/update and deploy the niri stack
dotsniri desktop niri     # select niri as the default session
dotsniri doctor           # check binaries, clones, deploy and config
dotsniri system           # install distro packages (niri, portals, ...)
dotsniri login install    # install the DM session entry (niri-login)
```

`dotsniri desktop <niri|hyprland|both>` sets the default session, mirrors the
choice into `settings.json` under `compositor`, and applies or removes the
shell overlays. The overlays are conditional and reversible: a shared file is
never replaced by a niri variant unless the niri session is selected, and
`dotsniri deploy` re-applies them after a `dots update` rewrites the shell.

## Requirements

niri 26.04 or newer with `xwayland-satellite`, `jq`, `python3`, and for capture
`grim`, `slurp`, `satty` and `wl-clipboard`. `dotsniri doctor` reports what is
missing and `dotsniri doctor --self-test` checks the toolkit without requiring
niri.

## Related pages

- [Hyprland desktop](/docs/desktop) for the other compositor front end.
- [Quickshell shell](/docs/shell) for the compositor-neutral UI.
- [Architecture and repositories](/docs/architecture) for the full repo map.
