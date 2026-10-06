---
title: "Tools: timex, xturing, login"
description: Reference for the timex time and weather engine, the xturing terminal settings UI and the static SDDM login theme.
order: 10
section: more
---

Beyond the compositor and the shell, three repositories provide focused
tools: timex (time and weather data plus the calendar UI), xturing (the whole
settings panel in the terminal) and login (the static SDDM greeter).

## timex

[equisdots/timex](https://github.com/equisdots/timex) is the time and weather
engine. It feeds the bar clock, the calendar popup (`SUPER + S`), the desktop
weather faces and the settings tab.

### CLI

```sh
timex --json                     # cached JSON (throttled refresh)
timex --getdata                  # force a refresh
timex --invalidate               # drop the cache after a config change
timex --current-icon             # bar module reads
timex --current-temp
timex --current-hex
timex --icon | --temp | --hex    # forecast[0] variants
timex providers list             # name|label|needs_key|hint
timex geocode "Tokyo"            # top 5 matches for the UI picker
timex test                       # ok|description or fail|error
timex snapshot                   # icon|temp|max|min|desc|updated_epoch
timex status                     # provider|city|unit|configured|key_set|last_update|last_error
timex keys set OPENWEATHER_KEY <value>
timex keys remove OPENWEATHER_KEY
timex keys list                  # NAME|label|where|0-1
```

The engine runs exactly the selected provider; there are no silent fallbacks.
If the provider is missing a city or key, the cache gets an explicit error
state (`Select a provider`, `Set a city`, `Set the API key`,
`Unknown provider`). The QML lives under `ui/` (`TimexPopup.qml` for the
calendar popup bound to `SUPER + S`, `TimexTab.qml` for the settings tab), and
the shell's old `calendar/weather.sh` path is now a thin shim over the CLI, so
bar and calendar callers did not change.

### Providers

| Name | Key | Input | Notes |
|---|---|---|---|
| `open-meteo` | none | city or `lat,lon` | Geocoding cached; 5 days, hourly. |
| `wttr` | none | city | 3 days, hourly. |
| `openweather` | yes | city + key | Free tier; geocoding with the key. |

Adding a provider is one executable under `api/providers/` that prints the
normalized JSON document, plus one catalog line in `core/timex.sh`.

### Configuration

- `settings.json -> timex`: `{ provider, city, unit }` plus the UI layout keys
  (`forecastEnabled`, `forecastPosition` `below`/`above`, `forecastSize`,
  `forecastGap`, `forecastHours`, `forecastShowTime/Icon/Temp`,
  `forecastOrder` and `clockScale`). No secrets; defaults live in the shell's
  `core/Personalization.js` timex section.
- API keys: `~/.local/state/quickshell/timex/keys.conf` (mode 600), written
  with `timex keys set`.
- Cache: `~/.cache/quickshell/timex/weather.json`, with the stable
  `current_temp` / `current_icon` / `current_hex` / `forecast[]` contract.

## xturing

[equisdots/xturing](https://github.com/equisdots/xturing) is a Rust/ratatui
TUI that exposes every option of the settings panel (the one bound to
`SUPER + SHIFT + D`). It reads and writes the same `settings.json` and calls
the same scripts, so the QML panel and xturing can coexist.

### Usage

```sh
xturing                        # installed at ~/.local/bin/xturing
xturing --page d_style         # open a page directly
xturing --search palette       # open the search palette pre-filled
xturing --dry-run              # no external commands; logs to /tmp/xturing-actions.log
xturing --help
```

| Option | Effect |
|---|---|
| `--settings <path>` | Alternative `settings.json`. |
| `--palettes <dir>` | Alternative palettes directory. |
| `--page <id>` | Open a page (`s_general`, `d_style`, `d_palette`, ...). |
| `--search <query>` | Open search pre-filled. |
| `--dry-run` | Same as `XTURING_DRY=1`. |

### Pages

25 pages across six rail groups:

- Shell: General, Timex, Keyboard, Monitors, Startup.
- Bar: Engine, Position, Style, Zones, Classic Bar, Modules, Workspaces.
- Theme: Palette, Animations, Shadows, Glass, Mascots.
- Behavior: Launcher, Notifications.
- Widgets: Popups (the `Personalization.js` sections).
- System: Hyprland, Input, GPU, Idle, About.

### Keys

```
Up/Down or j/k   move selection (wraps across pages)
Left/Right or h/l adjust / cycle
Tab / Shift+Tab  next / previous page
Enter/Space      edit, toggle, run
/ or Ctrl+P      search palette
r                reload settings.json, and in forms record a shortcut
?                help
q / Ctrl+C       quit
```

### Write contract and sandbox testing

- `settings.json` is written atomically (`tmp + rename`) with `serde_json`,
  preserving key order and unknown keys.
- Writes are immediate; the shell watchers pick them up live.
- Control characters in `bar.modules` glyphs are preserved as-is.

Test without touching anything:

```sh
XTURING_DRY=1 xturing
cp ~/.config/hypr/settings.json /tmp/settings-test.json
XTURING_DRY=1 XTURING_SETTINGS=/tmp/settings-test.json xturing
XTURING_DRY=1 XTURING_SETTINGS=/tmp/settings-test.json \
  XTURING_PALETTES_DIR=/tmp/palettes-test xturing
```

### Known differences vs. the QML panel

Interaction differs where drag and drop or swatches do not map to a TUI; the
settings file and its format are identical:

- Zones: no drag and drop; `Shift + Left/Right` move a module within and
  across zones, Enter enables or disables it.
- ClassicBar: group and ungroup with `g` / `u` instead of dragging.
- Monitors: Position X/Y fields replace the drag canvas.
- Palette: colors are edited as `#rrggbb`; New palette clones the 8 base
  colors of the active palette.
- General: the xkb layout list is a free text field.
- The Hyprland Refresh button works here (`hypr-effects.sh read`); in the
  current QML panel it calls a method that does not exist.

### Structure

```
src/
  settings.rs   atomic read/write + tests
  catalog.rs    data-driven definition of the 25 pages and controls
  app.rs        state, navigation, editing, special pages, side effects
  ui.rs         ratatui rendering (rail, content, chooser, forms, help)
  palette.rs    index.json, palette editing with backup, create/delete
  classic.rs    ClassicBar defaults, mirrorBar, normalize
  monitors.rs   hyprctl monitors, apply/reset with lua + display-config
  actions.rs    spawn/capture (with dry mode), notify-send
```

## login

[equisdots/login](https://github.com/equisdots/login) is the SDDM greeter: a
black screen with the remembered user, a white underline password field, a
session picker and small power/reboot buttons, all monochrome and drawn with
the Hack Nerd Font.

It is deliberately static. The previous palette-synced theme wrote under
`/usr/share/sddm/themes` at runtime, which required sudo from hooks and risked
PAM lockouts. This theme is installed once and never writes again:

```sh
./install.sh              # one-time sudo: theme + sddm config
./install.sh --uninstall  # remove theme and its sddm config
```

The installer copies the theme to `/usr/share/sddm/themes/x`, selects it in
`/etc/sddm.conf.d/10-x-theme.conf` and disables the on-screen keyboard. If
another display manager owns `display-manager.service`, the link is switched
to SDDM (the previous one is backed up as
`display-manager.service.equisdots-backup`). `--uninstall` restores it. The
theme lives under `theme/x/` with `metadata.desktop` and honors
`theme.conf.user`; `dots system` runs the installer for you.

`dots doctor` verifies the config file, the static theme (no `Colors.qml`) and
that SDDM is the active display manager.

## Related pages

- [Quickshell shell](/docs/shell) for the settings panel xturing mirrors.
- [Theming and palettes](/docs/theming) for palette-driven targets.
- [Architecture and repositories](/docs/architecture) for install paths.
