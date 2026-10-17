---
title: Plugins and extensions
description: The equisdots plugin standard, the 63-plugin hub, host discovery, enablement, extension points and the plugin CLI.
order: 7
section: desktop
---

equisdots is built from small repositories, and the plugin system is how new
features join the desktop without editing the hosts. A plugin is a
self-contained feature declared by a `plugin.json` manifest: it can ship a
settings page, a bar module, a panel, a complete bar, keybinds, scripts, a host
adapter or desktop-widget faces.

The standard is implemented by four repositories:

| Repository | Role |
|---|---|
| [plugins](https://github.com/equisdots/plugins) | The standard, the 63-plugin concentration folder, the install registry and smoke tests. |
| [plugin-api](https://github.com/equisdots/plugin-api) | Normative manifest schema, host API version and the bash/Lua compatibility evaluators. |
| [plugin-sdk](https://github.com/equisdots/plugin-sdk) | Runtime kit: `PluginHost`, reactive `Settings`, surfaces, widget kit and the Lua `mod` API. |
| [transformpath](https://github.com/equisdots/transformpath) | Architecture notes, decision log and migration status. |

Nyx and timex are plugins with their own repositories. The rest of the
converted set lives in `equisdots/plugins/plugins/`.

> Status: the standard is on `branch/experimental` and is a working POC. Nyx,
> timex, screenshots and the keybind editor are already live surfaces; the API
> and SDK are versioned in lockstep (`plugin-api.json`: API `1.0.0`, shell
> `0.1.0`).

## What a plugin can provide

| Surface | Manifest key | Example |
|---|---|---|
| Always-on UI (overlay, island) | `host` | Nyx mascot island |
| Settings page | `settings.page` | Plugins → Nyx, Timex |
| Panel / popup | `provides.panels.<name>` | calendar, clipboard, RSS reader |
| Bar module | `provides.bar.modules.<id>` | recording, weather, sysmon |
| Complete bar | `provides.bar.provider` | Samurai Bar, hello-bar POC |
| Desktop-widget faces | `provides.widgets.faces` | weather widget from timex |
| Mascot species and cards | `provides.mascots` | Nyx species catalog |
| Compositor fragment | `hypr.lua` | keybinds, startup, environment |
| Standalone Quickshell entry | `standalone` | screenshot overlay |

`provides` is free-form and passed through untouched by the hosts. Each
consumer documents its own keys; the standard never learns feature names such
as “mascots” or “weather”.

## Manifest

```json
{
  "id": "nyx",
  "name": "Nyx",
  "version": "0.1.0",
  "author": "equisdots",
  "description": "Mascot island and control-center notch for the shell",
  "type": "shell",
  "compat": { "shell": ">=0.1.0" },
  "toggle": "mascots.enabled",
  "settings": { "page": "settings/NyxPage.qml", "label": "Nyx" }
}
```

- `id` is the identity: stable, globally unique and equal to the folder name.
- `type` is `shell`, `hypr`, `mixed` or `cli`.
- `compat` is enforced by the scan: `{ "hyprland": ">=0.55", "shell": ">=0.1.0" }`.
  An incompatible plugin is listed but never mounted; `dots plugins add` refuses
  it unless `--force` is passed.
- `toggle` names the plugin's own master switch (default
  `plugins.<id>.enabled`). Nyx points at `mascots.enabled` so there is only one
  switch.
- `defaults` names a settings fragment the plugin owns; `dots` seeds the
  plugin's own settings file, never the core `settings.json`.

The full JSON Schema lives in `plugin-api/schema/plugin.schema.json`.

## Discovery and enablement

Hosts scan two folders; no host code knows plugin ids:

| Folder | Owner | Precedence |
|---|---|---|
| `~/.config/hypr/plugins/<id>/` | managed by `dots` | |
| `~/.config/hypr/plugins-user/<id>/` | user | wins on id collisions |

Any directory with a `plugin.json` is a plugin. A user plugin shadowing a
managed one is by design, but collisions are never silent: the scan reports
`shadowed` copies and `dirMismatch`, the loader records `status: "collision"`,
the manager warns on the card and `dots doctor` reports registry duplicates.

Two switches keep ownership clear:

| Switch | Key | Owns |
|---|---|---|
| Master | `toggle` or `plugins.<id>.enabled` | the whole feature; hosts mount only while enabled |
| Config menu | `plugins.<id>.config` (default `true`) | whether the plugin's page appears in the Plugins group |

The effective default is `defaultEnabled` (opt-in, `false` unless declared).
Toggling live reloads the compositor fragment and the shell watchers apply the
settings change; nothing is reinstalled.

## Deploy convention

A managed plugin deploys in two pieces:

```
whole repository  ->  ~/.config/hypr/scripts/quickshell/ui/plugins/<id>/
runtime subset    ->  ~/.config/hypr/plugins/<id>/
                      plugin.json + hypr.lua + scripts/
```

The shell-tree copy is the UI face loaded by Quickshell. The registry folder is
what discovery and the compositor loader read. User plugins stay in
`plugins-user/` and must be self-contained.

## Extension points

The hosts implement only generic mechanisms:

- **`PluginsCatalog`** scans manifests, resolves `enabled`, `config` and the
  UI path.
- **`ui/PluginHosts.qml`** mounts each enabled managed plugin's `host` and/or
  complete bar. Hosts may publish `frameObstacle` rectangles so the screen
  frame hugs them.
- **Plugins group** in the settings panel: manager plus one dynamic page per
  plugin (`p_<id>`), loaded from `settings.page`.
- **Panels**: `ui/Main.qml` resolves `provides.panels.<name>`; `qs_manager
  toggle <name>` and the bar modules keep working.
- **Bar modules**: the zone engine resolves `provides.bar.modules.<id>`; the
  core keeps the slot id, layout and user config.
- **Hyprland loader**: `plugins.lua` evaluates each enabled `hypr.lua` with a
  `pcall`, so one broken plugin never aborts the session. Results land in
  `~/.cache/equisdots/plugins-report.json`.

### The keybind editor

Every `mod.bind(key, dispatcher, { label, id })` is recorded with a stable id,
the effective key and the default key. The `keybinds` plugin shows the binds of
every plugin and lets the user re-key or mute a single one. Overrides live in
the plugin's own settings file (`<scope>.binds.<id>` = `"KEY"` or `false`); the
plugin owns the action and the user owns the key. Core shortcuts are listed
read-only and cannot be captured.

## The 63-plugin hub

`equisdots/plugins/plugins/` concentrates the converted set. It includes:

- **Defaults**: screenshots + recording, timex, RSS reader, clipboard,
  quicknotes, file search, sysmon and keybinds.
- **Desktop tools**: dock, calculator, color picker, glyph picker, unit
  converter, JSON viewer, snippets, todo, pomodoro, world clock, xfetch panel
  and themes.
- **Bar modules**: battery, brightness, caps lock, CPU frequency, crypto, disk,
  DND, Docker, fan, GitHub, git, GPU, kernel, load, mail, memory, microphone,
  media, night light, updates, process count, swap, torrents, uptime, VPN and
  more.
- **Complete bars**: the monochrome Samurai Bar and the `hello-bar` POC.

Nyx and timex live in their own repositories and are referenced by the
registry, never copied into the hub.

## CLI

```sh
dots plugins                    # installed: id, name, version, type, state
dots plugins available          # registry: installed vs available
dots plugins add <id>           # fetch, deploy by convention, enable
dots plugins add <id> --no-enable --force
dots plugins remove <id>
dots plugins enable <id>
dots plugins disable <id>
```

`dotsniri` mirrors the same surface for the niri stack. The manager page reads
the registry copy that `dots` deploys into the shell tree, so available plugins
can be installed from the UI too.

## Checks and fault isolation

There is no CI. The local gates are:

```sh
equisdots/plugins/tests/smoke.sh        # manifests, qmldir, scan, ids, registry
hyprland/tests/plugins_loader_test.sh   # loader, bind overrides, collisions
dotsniri doctor --self-test             # toolkit syntax
```

A failing plugin is isolated: a broken `hypr.lua` is caught by `pcall`, a broken
shell page fails to load, and deleting a plugin leaves orphan settings keys
harmless. The desktop always survives; the worst case is a silently absent
feature.

## Writing a plugin

1. Copy `equisdots/plugins/plugins/_template/` and set a unique `id`.
2. Add `plugin.json`, `defaults.json` and, optionally, `hypr.lua`, `scripts/`,
   `settings/<Page>.qml`, `host/` or panel QML.
3. Test locally in `~/.config/hypr/plugins-user/<id>/`.
4. Run `equisdots/plugins/tests/smoke.sh`.
5. Register the plugin in `registry.json` only if it should be installable from
   the hub; plugins in their own repository stay referenced by source.

## Related pages

- [Quickshell shell](/docs/shell) for the host mechanisms and plugin panels.
- [Nyx mascot island](/docs/nyx) for the first plugin and its extension rule.
- [Architecture and repositories](/docs/architecture) for the full repo map.
