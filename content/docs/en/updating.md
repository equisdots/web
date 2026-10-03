---
title: Updating and diagnosing
description: How dots update, list, doctor and uninstall keep the stack in sync and how to fix common failures.
order: 3
section: start
---

`dots` manages the whole stack from a single command. Updating pulls every
repository, redeploys the payload and keeps the wallpaper daemon aligned with
the pinned release. Diagnosing is a separate read-only pass that tells you
what is missing or out of sync.

## Command reference

| Command | Action |
|---|---|
| `dots install` | Clone or update every repo and place its payload. |
| `dots update` | `dots install` plus the xwww release check. |
| `dots system` | Run the hyprland installer (packages, fonts, login, PAM, sudo required). |
| `dots doctor` | Check binaries, clones and installed paths. Exits non-zero on failure. |
| `dots list` | Repository status: `clean`, `dirty` or `missing`. |
| `dots uninstall` | Remove wrappers and the updater timer; configs and clones stay. |

```sh
dots update
dots doctor
dots list
```

## What dots update does

For every repository in the org (`dots`, `palettes`, `theme-sync`, `davincix`,
`shell`, `hyprland`, `timex`, `xturing`, `login`):

1. Fetch `origin/main` at depth 1 and hard-reset the managed clone to it.
   The hard reset also recovers from upstream force-pushes, where a
   fast-forward pull would fail forever.
2. If `dots` itself changed during the fetch, the script re-executes with the
   new version before touching any payload.
3. Deploy the payload for that repository, skipping clones with local changes.

After the payload phase, `dots update` checks the running `xwww` binary
against the version pinned in `scripts/install-xwww.sh` and reinstalls when
they differ (`XWWW_VERSION` overrides the pin). It also writes the version
state used by the About page and the updater popup.

## Local changes in managed clones

Managed clones are read-only from `dots`'s point of view. A clone with
uncommitted changes is kept exactly as it is and its payload is **not
deployed**, so a stale checkout can never downgrade or delete live files.

```sh
dots list                                  # shows dirty clones
git -C ~/.local/share/equisdots/shell status
```

Reconcile by committing or stashing the changes, or by parking the clone:

```sh
mv ~/.local/share/equisdots/shell{,.local}
dots install
```

`dots doctor` flags every dirty clone so updates do not silently stall.

## settings.json merge rules

`dots install` never overwrites your settings. The file is seeded from
`default_settings.json` only when missing, and on every update it is
rewritten as **shipped defaults plus your values** with `jq`:

1. The pre-equisdots `dock` object is migrated to the canonical `bar` key.
2. Legacy keys nothing reads anymore are dropped.
3. Shipped defaults are applied as the base; your values win, and user arrays
   such as `bar.zones` are kept as-is.

If the merge fails, the file is left untouched and `dots` prints a warning.

## The monthly updater timer

`dots install` registers a systemd user timer that runs the dotfiles update
monthly:

```sh
systemctl --user status dotfiles-update.timer
systemctl --user list-timers dotfiles-update.timer
```

`dots uninstall` removes the timer and the wrappers. The service points at
`~/.config/hypr/scripts/dotfiles-update.sh`; `dots doctor` warns when the unit
points somewhere else.

## dots doctor checks

The doctor is the first diagnostic to run. It reports, in order:

- Required binaries: `git`, `rsync`, `hyprland`, `qs`, `jq`, `curl`,
  `python3`, `cava`, `playerctl`, `wl-paste`, `cliphist`, `brightnessctl`,
  `pamixer`, `kitty`, `rofi`, `xwww-daemon`, `mpvpaper`.
- Optional binaries: `grim`, `slurp`, `satty`, `hyprpicker`, `blueman-applet`,
  `nm-applet`, `gsettings`, `cargo`.
- Font check via `fc-match "Hack Nerd Font"`.
- The running `xwww` version against the pinned release.
- Repository clones and dirty clones.
- Installed payload paths (palettes, `hyprland.lua`, `Shell.qml`, wrappers,
  `settings.json` and more).
- Hyprland version (0.55+ required for Lua) and `~/.local/bin` in `PATH`.
- System pieces: `/etc/pam.d/quickshell`, the SDDM theme config, the static
  theme and the active display manager.
- The monthly updater timer.

```sh
dots doctor; echo "exit: $?"
```

The command exits `1` when at least one item failed, which makes it usable in
scripts.

## Troubleshooting

- Update reports `local changes; skipping its payload`: reconcile the clone as
  shown above, then run `dots update` again.
- Fetch failed (network): the existing checkout is kept and the rest of the
  update continues; retry later.
- `settings.json could not be migrated`: see the warning output; the file is
  intact. Check that `jq` is installed.
- `hyprland < 0.55`: update the compositor package; the Lua config needs Lua
  support.
- xwww mismatch: `dots update` (or `scripts/install-xwww.sh`) reinstalls the
  pinned release.
- Active display manager is not SDDM: the static login theme will not show;
  `dots system` switches the display-manager link.
- System phase failure: inspect the newest log with
  `ls -t /tmp/hyprland-install-*.log | head -1`.

## Related pages

- [Installation](/docs/installation) for the first setup.
- [Architecture and repositories](/docs/architecture) for the install layout
  and contracts.
- [Contributing and security](/docs/contributing) for reporting problems.
