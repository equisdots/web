---
title: Contributing and security
description: Where to report issues, how pull requests are reviewed, the local checks to run and the security policy.
order: 12
section: more
---

Contributions are welcome across the organization. Each repository owns one
concern, so the first step is always picking the right one. There is no CI:
every repository ships a local check script and the maintainer runs it before
pushing, so please run the same checks before opening a pull request.

## Where to report

Open the issue in the repository that owns the behavior:

| Topic | Repository |
|---|---|
| Installation, updates, packages, login theme | [dots](https://github.com/equisdots/dots) |
| Compositor config, keybinds, scripts | [hyprland](https://github.com/equisdots/hyprland) |
| Bar, panels, widgets, editor | [shell](https://github.com/equisdots/shell) |
| Mascots, island/notch, dock | [nyx](https://github.com/equisdots/nyx) |
| Wallpapers, scenes, picker | [davincix](https://github.com/equisdots/davincix), [background](https://github.com/equisdots/background) |
| Colors and theming | [palettes](https://github.com/equisdots/palettes), [theme-sync](https://github.com/equisdots/theme-sync) |
| Time, weather, calendar | [timex](https://github.com/equisdots/timex) |
| Terminal settings UI | [xturing](https://github.com/equisdots/xturing) |
| Scene engine and wallpaper daemon | [x-ports/xwww](https://github.com/x-ports/xwww) |

If you are not sure, use the organization-wide issue template and pick the
component there. Support channels and the code of conduct live in
[hyprland](https://github.com/equisdots/hyprland) (`SUPPORT.md`,
`CODE_OF_CONDUCT.md`), and the organization profile summarizes the stack.

## Pull requests

1. Keep the change focused: one topic per pull request.
2. Use the existing commit style (`feat:`, `fix:`, `docs:`, `chore:`, `ci:`)
   with a short imperative subject.
3. Run the checks of every repository you touch.
4. Update the repository `CHANGELOG.md` when it exists; releases are cut from
   those entries.
5. New files default to the license already used by the repository: code is
   MIT-style unless stated otherwise; wallpapers and documentation follow the
   [background](https://github.com/equisdots/background) terms.

## Local checks

| Repository | Command |
|---|---|
| shell | `scripts/check.sh` |
| hyprland | `scripts/check.sh` |
| palettes | `scripts/check.sh` |
| theme-sync | `scripts/check.sh` |
| xturing | `scripts/check.sh` |

- Shell: `qmllint` over every `.qml` file and `node --check` over the JS
  modules.
- Hyprland: `luac -p` over every Lua config module and `bash -n` over the
  scripts (`shellcheck` is used as an advisory when installed).
- Palettes: schema validation plus `index.json` consistency.
- theme-sync: `compileall` and a CLI smoke test (`--list`, `--dry-run`).
- xturing: `cargo fmt --check`, clippy with `-D warnings` and the tests.

## Style guidelines

- Documentation is written in English.
- Configurations and scripts stay palette-driven: read the active palette
  instead of hardcoding colors.
- Prefer the small existing helpers of each repository over new dependencies.
- For xwww scenes, stay inside the documented sandbox: local assets only, no
  timers, no network, change-driven redraws.

## Security policy

Do not open a public issue for a security problem. Use GitHub's private
reporting instead:

1. Open the affected repository and go to **Security -> Report a
   vulnerability** (GitHub Security Advisories), or contact the maintainer
   listed in the repository.
2. Include the affected component and version, a description of the impact
   and a reproduction if you have one.
3. You will get an acknowledgement as soon as possible and credit in the
   advisory once a fix is published.

### Scope

The stack runs in the user's session and installs system pieces: packages, the
SDDM theme and `/etc/pam.d/quickshell`. Reports about the shell, the Hyprland
scripts, the installers, the wallpaper engine or the scene runtime are welcome.
Scenes execute user-authored code in the xwww client by design; the runtime
sandbox (memory and stack limits, frame timeout, no I/O, local assets only) is
documented in [equisdots/x-ports](https://github.com/x-ports/xwww).

### Supported versions

Only the latest release of each repository receives fixes. `dots update`
keeps an installation on the current releases, and `dots doctor` reports what
is out of sync. See [Updating and diagnosing](/docs/updating).

## Practical tips

- Test installers before running them on a machine you care about; they use
  sudo and change system configuration.
- Review scripts before forking or sharing them; personal configs may contain
  paths or tokens.
- Use xturing's dry mode or a copied `settings.json` when experimenting with
  options.
- Validate palettes before submitting them:
  `python3 tools/validate_palettes.py` in the palettes repository.

## Related pages

- [Architecture and repositories](/docs/architecture) for the layout and
  contracts.
- [Updating and diagnosing](/docs/updating) for the update flow.
