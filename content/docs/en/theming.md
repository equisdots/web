---
title: Theming and palettes
description: The base16 palette system, live palette editing, window borders and cross-app theme propagation with theme-sync.
order: 6
section: desktop
---

Colors in equisdots come from plain JSON palettes consumed by the shell,
Hyprland's window borders, the wallpaper scenes and every application that
theme-sync manages. There is no per-wallpaper color extraction: the palette
you pick is the palette every component uses until you change it.

## Palette contract

A palette is a JSON file with base16 colors plus optional background,
foreground and semantic role overrides. The schema is published in
[equisdots/palettes](https://github.com/equisdots/palettes) (`schema.json`).

```json
{
  "name": "X",
  "slug": "x",
  "author": "xscriptor",
  "base16": {
    "color0": "#0a0a0a",
    "color1": "#fc618d",
    "color7": "#f7f1ff",
    "color15": "#f7f1ff"
  },
  "background": "#0a0a0a",
  "foreground": "#f7f1ff",
  "roles": { "workspaceActive": "#eab308" }
}
```

- `name`, `slug` and all 16 `base16` colors are required; every color is `#rrggbb`.
- `slug` matches `^[a-z0-9][a-z0-9-]*$` and is the file name, the theme id and
  the value stored in settings.
- `background` and `foreground` fall back to `color0` and `color7`.
- `roles` overrides semantic roles on top of the base16 derivation.

The repository layout:

| Path | Content |
|---|---|
| `*.json` | One palette per slug (`x.json`, `tokio.json`, ...) |
| `community/` | Base16 ports of well-known terminal themes, with attribution |
| `index.json` | Ordered list with display name and preview colors; drives the panel |
| `schema.json` | Contract v1 |

Validate a checkout with:

```sh
scripts/check.sh
python3 tools/validate_palettes.py
```

## Where palettes live

`dots install` deploys the flat set, the `community/` folder and `index.json`
to the frozen shared path:

```
~/.config/hypr/scripts/quickshell/dock/palettes/
```

This path is read by the shell (`ui/bar/Colors.qml`, `core/Theme.qml`),
`theme-sync`, Hyprland's `colors.lua` and the xwww scene provider. The active
palette slug lives in `settings.json` under `bar.palette`; the legacy
`dock.palette` shape is migrated once and `x` is the final fallback, so it
must always exist.

The UI groups palettes in three sections: X (12 built-in), Custom (community
ports) and User (palettes you create).

## Choosing and editing palettes

Open the settings panel (`SUPER + SHIFT + D`) and go to the Palette card, or
use the standalone palette widget (`SUPER + SHIFT + P`). Selecting a palette
writes `bar.palette` and the change propagates live.

The active palette can be recolored in place:

1. Palette card, **Edit colors**: 18 editable slots (`color0` to `color15`,
   plus `background` and `foreground`).
2. Committing a hex rewrites `dock/palettes/<slug>.json` atomically with `jq`
   over a temporary file and `mv`, preserving unknown keys.
3. The first edit of a session stores a pristine snapshot in
   `~/.local/state/quickshell/palette_backup/<slug>.json`; **Reset** restores
   it.
4. Creating a palette writes its JSON file and an `index.json` entry; deleting
   removes both plus the snapshot. The built-in `x` palette is protected.

Propagation is immediate: bar islands, editor chrome, desktop widget faces,
window borders and the theme-sync targets all re-read the palette file.

## theme-sync

[equisdots/theme-sync](https://github.com/equisdots/theme-sync) is the
cross-app engine. It reads the active palette and regenerates application
configuration; one target per application, and a failing target never aborts
the rest.

```sh
theme-sync --list                  # targets and availability
theme-sync --dry-run               # show what would change, write nothing
theme-sync --targets kitty,xfetch  # only these applications
theme-sync --palettes DIR --settings FILE
```

| Target | What it writes |
|---|---|
| `kitty` | Per-palette theme plus include and active border in `kitty.conf`. |
| `starship` | Per-palette themes and `STARSHIP_CONFIG` in the shell rc files. |
| `xtop` | Per-palette themes and the active theme. |
| `vscode` | Color and icon theme, or generated live tint for unlisted palettes. |
| `nvim` | `lua/themes/palettes.lua` plus the active-theme bootstrap. |
| `browsers` | Brave/Beta preferences and Firefox `user.js`. |
| `opencode` | Per-palette themes plus the active theme. |
| `rofi` | `colors.rasi` and `config.rasi`. |
| `cava` | A managed `[color]` block with a palette gradient. |
| `qt` | qt6ct/qt5ct color schemes and active config. |
| `gtk` | GTK3/4 CSS overrides and the system color-scheme. |
| `xfetch` | Per-palette hex themes and the active theme. |

Managed blocks are marked with `equisdots theme-sync`, so regenerating is
idempotent. Adding a target is one module under `themesync/targets/` with
`NAME`, `DESCRIPTION`, `available(env)` and `apply(env)`, plus one line in the
registry.

## Window borders

Window borders follow the palette by default:

- `bar.borderFollowPalette: true` uses the palette accent (`color1`) for the
  active border and a muted tone (`color8`) for inactive ones.
- Setting it to `false` uses the manual `bar.borderActive` and
  `bar.borderInactive` hex values.

`config/hypr/colors.lua` derives load-time defaults from the active palette
JSON and exports `X.active_border`, `X.inactive_border` and the colors
themselves. The shell pushes live updates through the compositor adapter:

```sh
hyprctl eval 'hl.config({ general = { col = { active_border = "rgb(eab308)" } } })'
```

## Semantic roles

`roles` lets a palette override named slots derived from base16. The current
built-in assignments of `workspaceActive` (the active workspace fill in the
bar, falling back to `mauve`) include `x` gold `#eab308`, `berlin` `#666666`
and `madrid` `#8a6408`. Edit the role directly in the palette file; it
hot-reloads through the watchers.

## Related pages

- [Quickshell shell](/docs/shell) for the editor that drives palettes.
- [Interactive scenes](/docs/scenes) for palette-reactive wallpapers.
- [Wallpapers](/docs/wallpapers) for the wallpaper stack.
