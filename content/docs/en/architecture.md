---
title: Architecture and repositories
description: How the equisdots repositories fit together, the shared contracts they rely on and the decisions behind them.
order: 11
section: more
---

equisdots is a set of small repositories with one clear owner each, tied
together by two shared contracts: `settings.json` for configuration and the
palette files for color. This page maps the repositories, the data flow and
the invariants the pieces rely on.

## Repositories and install paths

| Repository | Role | Payload location |
|---|---|---|
| [dots](https://github.com/equisdots/dots) | Meta installer, updater, diagnostics | `~/.local/bin/dots` |
| [hyprland](https://github.com/equisdots/hyprland) | Compositor config and scripts | `~/.config/hypr` |
| [niri](https://github.com/equisdots/niri) | niri compositor config (KDL) and scripts | `~/.config/niri` |
| [niri-meta](https://github.com/equisdots/niri-meta) | Meta installer, updater, diagnostics (`dotsniri`) | `~/.local/bin/dotsniri` |
| [niri-shell](https://github.com/equisdots/niri-shell) | Shell overlay (Niri backend) | merged into the shell |
| [nyx-niri](https://github.com/equisdots/nyx-niri) | Nyx overlay (compositor-neutral) | merged into the shell |
| [niri-login](https://github.com/equisdots/niri-login) | Wayland session entry | `/usr/share/wayland-sessions` |
| [shell](https://github.com/equisdots/shell) | Quickshell UI | `~/.config/hypr/scripts/quickshell` |
| [nyx](https://github.com/equisdots/nyx) | Mascot island/notch and control-center dock | `.../quickshell/ui/nyx` |
| [palettes](https://github.com/equisdots/palettes) | Palette data and schema | `.../quickshell/dock/palettes` |
| [background](https://github.com/equisdots/background) | Curated wallpapers and scene catalog | release asset `background.zip` |
| [theme-sync](https://github.com/equisdots/theme-sync) | Cross-app theming engine | `~/.local/bin/theme-sync` |
| [davincix](https://github.com/equisdots/davincix) | Wallpaper kernel | `~/.local/bin/davincix` |
| [timex](https://github.com/equisdots/timex) | Weather/time engine and UI | `~/.local/bin/timex`, `.../quickshell/ui/timex` |
| [xturing](https://github.com/equisdots/xturing) | Terminal settings UI | `~/.local/bin/xturing` |
| [login](https://github.com/equisdots/login) | SDDM greeter | `/usr/share/sddm/themes/x` |

Managed clones live under `~/.local/share/equisdots/<repo>` (the niri stack uses
`~/.local/share/equisdots-niri/<repo>`). Wrappers in `~/.local/bin` exec the
cloned engines, so `dots update` changes behavior without touching the wrapper.

`hyprland` and `niri` are the two compositor front ends; `shell`, `nyx`,
`palettes`, `theme-sync`, `background`, `timex`, `davincix` and `login` are
shared by both.

## One shell, two compositors

The `shell` repository is Hyprland-first; `niri-shell` and `nyx-niri` are
overlays that add what niri needs and leave every other file untouched. The niri
meta merges them into the deployed shell, so one tree drives both sessions:

```
shell (base)  +  niri-shell  +  nyx-niri  =  ~/.config/hypr/scripts/quickshell
```

`core/Compositor.qml` has no hard-coded compositor. It reads the environment and
picks `core/compositors/Niri.qml` when `XDG_CURRENT_DESKTOP` contains `niri` or
`NIRI_SOCKET` is set, otherwise `core/compositors/Hyprland.qml`. Both backends
implement the same surface — `workspacesCommand`, `keyboardCommand`,
`focusCommand`, `setWindowBorders`, `switchWorkspace`,
`cycleKeyboardLayout` — plus the neutral persistence calls in `core/Config.qml`
(`persistKeybinds`, `persistStartup`, `applyMonitors`, `resetMonitors`,
`reload`). Widgets never branch on the compositor.

The shared data root stays `~/.config/hypr` on both compositors (settings,
palettes, wallpapers, shell); only the compositor output moves to
`~/.config/niri`. The niri scripts read the shared root through
`EQUISDOTS_CONFIG_DIR`.

| Concern | Hyprland | niri |
|---|---|---|
| Workspaces | `hyprctl` + `.socket2.sock` | `niri msg --json event-stream` |
| Borders | `hyprctl eval` | `generated/borders.kdl` + reload |
| Keybinds / startup / appearance | `config/*.lua` + reload | `generated/user-*.kdl` + reload |
| Effects / monitors | `hyprctl getoption/eval`, `hl.monitor` | `generated/*.kdl` + reload |

The two meta installers are independent: `dots` owns the Hyprland stack
(`~/.local/share/equisdots`), `dotsniri` owns the niri stack
(`~/.local/share/equisdots-niri`), and both can coexist. Overlays are
conditional and reversible: a shared file is only replaced by its niri variant
while the niri session is selected. See [niri compositor](/docs/niri).

## Configuration flow

```
settings.json  (single source of truth: bar, classicbar, widgets, timex, ...)
   |  read/write atomically (tmp + mv), watched by the shell
   |
   +--> shell Config.qml -----------> live UI updates
   +--> xturing --------------------- terminal edits
   +--> hyprland colors.lua ---------> border defaults at load
   +--> theme-sync ------------------> active palette for every target
   +--> timex -----------------------> provider, city, unit
   +--> davincix --------------------> slideshow and wallpaper options
```

Writes are atomic so file watchers keep working: `dots` merges `settings.json`
as shipped defaults plus user values, xturing preserves unknown keys, and the
shell editor debounces its own writes.

## Palette flow

```
palettes repo --> dock/palettes/{*.json, community/, index.json, schema.json}
                        |
      settings.json bar.palette selects the slug (fallback: x)
                        |
   +--------------------+--------------------+
   |                    |                    |
shell Colors.qml   theme-sync targets   Hyprland colors.lua
   |                    |                    |
bar, widgets,      kitty, starship,      window borders
lock screen        nvim, vscode, gtk,    (live via hyprctl eval)
                   qt, browsers, ...
                        |
                   xwww scenes (--palette equisdots)
```

Consumers never hardcode colors; a scene that reads the same palette file
agrees with the rest of the desktop by construction. See
[Theming and palettes](/docs/theming).

## Wallpaper flow

```
davincix (kernel CLI)
   +--> xwww img ......... still images
   +--> xwww scene run ... interactive scenes (JS, palette-driven)
   +--> mpvpaper ......... video wallpapers
   +--> current_wallpaper.png ... lock screen, SDDM
   +--> current_scene, thumbs, slideshow state ... cache/state/run dirs
```

The Quickshell picker is a thin frontend over the same CLI. The shell, the
lock screen and `init.sh` only consume the contract files.

## Session startup

`autostart.lua` starts `xwww-daemon` and `init.sh`; `init.sh` re-applies the
scene recorded in `current_scene` when present, otherwise the previous
wallpaper is restored. `restore-monitors.sh` re-applies the saved monitor
layout and reconciles it every couple of seconds. The shell and its data
watchers then run for the whole session.

## Update invariants

- Managed clones are read-only: `dots` fetches `origin/main` and hard-resets.
- A clone with uncommitted changes is never deployed, so a stale checkout
  cannot downgrade live files.
- `xwww` is pinned to a release; `dots update`/`dots system` reinstall when
  the running binary differs, and `dots doctor` reports mismatches.
- `settings.json` is never regenerated from scratch; it is always defaults
  plus user overrides.

See [Updating and diagnosing](/docs/updating) for the command details.

## Design decisions

- **Lua Hyprland config (0.55+)**: modular `require()` files with runtime
  overrides; runtime changes go through `hyprctl eval`, never by rewriting
  loaded files mid-session.
- **No Matugen**: palettes are fixed JSON data, so colors are predictable and
  shared across compositor, shell and applications.
- **Static SDDM theme**: no runtime sudo and no palette sync at the greeter,
  which avoids PAM failures.
- **Scenes render in the xwww client**: the daemon stays a dumb frame
  consumer, and the sandbox keeps scene code CPU-only with no I/O or input.
- **Two compositor front ends, one shell**: `hyprland` and `niri` are swappable
  behind `core/Compositor.qml`; the shell, palettes and Nyx are shared, the
  shared data root stays at `~/.config/hypr`, and niri-specific code ships as
  reversible overlays (`niri-shell`, `nyx-niri`).
- **No CI**: each repository ships a local check script, run before pushing.

## Development checks

| Repository | Command | Checks |
|---|---|---|
| shell | `scripts/check.sh` | `qmllint` on QML, `node --check` on JS |
| hyprland | `scripts/check.sh` | `luac -p` on Lua, `bash -n` on scripts |
| niri | `scripts/check.sh` | `bash -n` on scripts, KDL brace balance |
| niri-meta | `dotsniri doctor --self-test` | `bash -n` over the toolkit (works without niri) |
| palettes | `scripts/check.sh` | Schema and `index.json` consistency |
| theme-sync | `scripts/check.sh` | `compileall` plus CLI smoke test |
| xturing | `scripts/check.sh` | `cargo fmt`, clippy and tests |

## External dependencies

The stack also installs from outside the organization:
[xscriptor-colors/terminal](https://github.com/xscriptor-colors/terminal)
(kitty and starship), [xscriptor-colors/nvim](https://github.com/xscriptor-colors/nvim),
[xscriptor-colors/vscode](https://github.com/xscriptor-colors/vscode) and
[x-ports/xwww](https://github.com/x-ports/xwww) (the wallpaper daemon and
scene engine).

## Related pages

- [Contributing and security](/docs/contributing) for checks and reporting.
- [Updating and diagnosing](/docs/updating) for the update flow.
