---
title: Wallpapers
description: The davincix wallpaper kernel, xwww and mpvpaper, the Quickshell picker, search providers and slideshow.
order: 7
section: wallpapers
---

Wallpapers are managed by [equisdots/davincix](https://github.com/equisdots/davincix),
a headless kernel that applies, thumbnails, searches and rotates wallpapers.
The Quickshell picker is only a frontend: the UI decides what to apply, the
kernel decides how.

## The stack

| Piece | Role |
|---|---|
| `xwww` / `xwww-daemon` | Applies still images and interactive scenes. |
| `mpvpaper` | Applies video wallpapers. |
| ImageMagick, ffmpeg, ffprobe | Thumbnails, webp conversion and video posters. |
| `davincix` | CLI kernel: listing, applying, state, search, slideshow. |
| Quickshell picker | `SUPER + W`, card grid with filters and transitions. |

The daemon is started from `autostart.lua` and restarted by the shell after
theme changes.

## The wallpaper directory

The collection defaults to `~/.config/hypr/wallpapers` and is scanned
recursively. Nested files are flattened into their thumbnail name using `__`
as separator (`sub/dir/pic.jpg` becomes `sub__dir__pic.jpg`). A directory
containing `scene.js` is an interactive scene; its thumbnail is named
`scn_<name>.jpg`, while videos use the `000_` prefix.

## CLI

```sh
davincix set ~/.config/hypr/wallpapers/nord.png
davincix set ~/.config/hypr/wallpapers/clip.mp4 --video
davincix set ~/.config/hypr/wallpapers/astro-palette --transition decrypt

davincix current
davincix current --thumb-name
davincix thumbs
davincix search "mountains" --source wallhaven
davincix search --continue "mountains"
davincix search --clear
davincix stop
davincix rm ~/.config/hypr/wallpapers/nord.png
davincix import ~/Downloads/*.jpg
davincix slideshow start
davincix slideshow status
davincix keys set PIXABAY_KEY <value>
davincix paths
```

`set` accepts a file, an URL or a scene directory and resolves the target
itself. `--transition` accepts the xwww set (`fade`, `wipe`, `glitch`,
`decrypt`, and more) plus `random`; empty means random.

## Environment overrides

| Variable | Default | Use |
|---|---|---|
| `DAVINCIX_WALLPAPER_DIR` | `$WALLPAPER_DIR` or `~/.config/hypr/wallpapers` | Source directory. |
| `DAVINCIX_CACHE_DIR` | `~/.cache/quickshell/wallpaper_picker` | Thumbs, current wallpaper, search. |
| `DAVINCIX_STATE_DIR` | `~/.local/state/quickshell/wallpaper_picker` | Persistent flags and `current_scene`. |
| `DAVINCIX_RUN_DIR` | `$XDG_RUNTIME_DIR/quickshell/wallpaper_picker` | Control files, locks and PIDs. |
| `DAVINCIX_XWWW` | `~/.local/bin/xwww`, then `PATH` | Client binary. |
| `DAVINCIX_XWWW_DAEMON` | `~/.local/bin/xwww-daemon`, then `PATH` | Daemon binary. |

## The picker

Open with `SUPER + W`. The picker shows thumbnails from davincix, a transition
selector and filter controls. Cards carry a `JS` badge for scenes and a play
badge for videos. Applying works with a click or `Return`; `Delete` moves the
selected entry to the trash through `davincix rm`. The active wallpaper is
pre-selected when the picker opens (`davincix current --thumb-name`).

## Search

Search downloads go through provider scripts under `providers/`:

| Source | Key | Notes |
|---|---|---|
| `ddg` | none | DuckDuckGo scraper, stdlib only. |
| `wallhaven` | none (SFW) | Native resolution filter and pagination. |
| `pexels` | optional `PEXELS_KEY` | Stock videos; best mp4 >= 1920x1080. |
| `pixabay` | `PIXABAY_KEY` | Stock videos; best variant >= 1920x1080. |

Keys live in `$DAVINCIX_STATE_DIR/keys.conf` or the environment. Results are
filtered to at least 1920x1080 and validated before being kept.

## Slideshow

`davincix slideshow start [interval]` runs a detached daemon that rotates
still images with a random transition and never repeats the previous one. The
state lives in `slideshow.pid` and `slideshow_enabled` under the run/state
directories. Scenes are skipped by the slideshow.

## Contracts and state files

- `current_wallpaper.png` in the cache dir is the frame used by the lock
  screen and SDDM.
- `current_scene` in the state dir holds the directory of the running scene;
  applying an image or video removes it.
- `thumbs/.manifest` and `thumbs/.source_dir` index the thumbnail cache.
- `search_map.txt` stores `name|url` for search results.

## Troubleshooting

- Wallpaper does not change: check that `xwww-daemon` runs and that
  `xwww --version` matches the pinned release (`dots doctor` reports this).
- `davincix: xwww not found`: the kernel resolves `DAVINCIX_XWWW`, then
  `~/.local/bin/xwww`, then `PATH`; a session may not include
  `~/.local/bin`.
- Video wallpaper fails: `mpvpaper` must be installed (`dots system`).
- Missing or stale thumbnails: run `davincix thumbs`.
- Scene appears as a plain folder: it needs a `scene.js` file; see
  [Interactive scenes](/docs/scenes).

## Next steps

- [Interactive scenes](/docs/scenes) for procedural wallpapers.
- [Theming and palettes](/docs/theming) for palette-reactive scenes.
- [Quickshell shell](/docs/shell) for the picker and state handling.
