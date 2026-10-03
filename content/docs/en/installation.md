---
title: Installation
description: Requirements and the recommended way to install the equisdots desktop, plus first login and troubleshooting.
order: 2
section: start
---

The recommended way to install equisdots is the `dots` meta installer. A
single `setup` run installs the system pieces (packages, fonts, login theme,
PAM service, external configs) and the user payload (compositor config, shell,
palettes, engines) from every repository.

## Requirements

- Arch Linux or a derivative (EndeavourOS, Manjaro, CachyOS, Garuda).
- Linux 6.x or newer recommended, 4 GB RAM minimum, 8 GB recommended.
- Hyprland 0.55 or newer (the configuration is Lua).
- `git`, `rsync`, `jq`, Quickshell (`qs`), `xwww-daemon`, `mpvpaper` and the
  Hack Nerd Font.

`dots doctor` checks all of these and exits with an error code when something
is missing; the full wallpaper pack is optional and about 1.37 GB.

## One-command install

The installer clones the whole organization itself; no previous clone is
needed:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/equisdots/dots/main/dots) setup -y
```

The `-y` flag answers the prompts with the recommended defaults and skips the
wallpaper pack. After the first run, the `dots` command is available at
`~/.local/bin/dots`.

## Manual install

Step by step, from a clone of the [dots repository](https://github.com/equisdots/dots):

```sh
git clone https://github.com/equisdots/dots.git
cd dots

./dots system      # system stack (sudo): packages, fonts, login, PAM, xwww
./dots install     # clone every repo and place the user payload
./dots doctor      # verify binaries, clones and installed paths
```

Prefer `setup` when possible; it runs both phases in the right order:

```sh
./dots setup       # payload first when git/rsync exist, then the system stack
./dots setup -y    # non-interactive with defaults
```

If `git` or `rsync` are missing, `setup` runs the system stack first (it
installs them) and then retries the payload. A failing system phase never
aborts the payload phase, and the other way around.

## What each phase does

`dots system` runs the [hyprland](https://github.com/equisdots/hyprland)
installer:

- Installs distro packages via an AUR helper (Hyprland, Quickshell, kitty,
  dunst, grim, slurp, cliphist, rofi, cava, gpu-screen-recorder and more),
  plus the Hack Nerd Font and themes (adw-gtk3, Papirus, Bibata).
- Installs the xwww wallpaper daemon from the checksum-verified prebuilt
  release, with a source build as fallback.
- Installs the static SDDM theme from
  [equisdots/login](https://github.com/equisdots/login).
- Installs `/etc/pam.d/quickshell` for the lock screen and the kitty, Neovim
  and starship configs.
- Configures NVIDIA when applicable, including kernel parameters.

`dots install` clones every repository under `~/.local/share/equisdots` and
places the payload:

- Hyprland config to `~/.config/hypr`, plus rofi, dunst and cava configs.
- Quickshell shell, palettes, theme-sync, davincix, timex and xturing.
- Wrapper scripts in `~/.local/bin` and the monthly updater timer.

`install` copies over a live config but treats `settings.json` carefully: it
is seeded only when missing and then always merged as defaults plus your
values. For a full purge you must remove `~/.config/hypr` yourself.

## Standalone Hyprland install

Without the meta installer:

```sh
git clone https://github.com/equisdots/hyprland.git
cd hyprland
chmod +x install.sh
./install.sh                 # full install
./install.sh --dotfiles-only # config only, no packages
./install.sh --nvidia-only   # NVIDIA setup only
./install.sh -y              # non-interactive defaults
```

The standalone installer skips the step that calls `dots install` when it is
driven by `dots system` (`DOTS_SYSTEM_RUN=1`), because the meta installer runs
the payload right after.

### Wallpaper daemon

The installer pins a release of xwww. Override it when needed:

```sh
XWWW_VERSION=v0.13.1 ./scripts/install-xwww.sh
FORCE_XWWW=1 ./install.sh   # reinstall an existing binary
```

## Verify the installation

```sh
dots doctor
dots list
command -v dots hyprland qs davincix theme-sync
fc-match "Hack Nerd Font"
```

`dots list` should report every repository as `clean`, and `dots doctor`
should end without missing items. Every `!` line names what needs attention.

## First login

1. Reboot, especially if the NVIDIA driver changed.
2. Pick Hyprland at the display manager (`SUPER + Return` opens kitty,
   `SUPER + D` the launcher).
3. The first boot initializes the wallpaper daemon, picks a random wallpaper
   and starts the background services.

## Troubleshooting

- `git/rsync missing`: run `./dots system` first, then `./dots install`.
- Clone failed: check the network and rerun `./dots install`. Failures are
  never fatal for the other repositories.
- System phase failed: the payload is still installed. Inspect
  `ls -t /tmp/hyprland-install-*.log | head -1` and retry `./dots system`.
- Glyphs render as boxes: the Hack Nerd Font is missing; rerun `./dots system`.
- `dots` or `davincix` not found: `~/.local/bin` is not in `PATH` (`dots doctor` flags this).
- xwww version mismatch: run `./dots update`, which reinstalls the pinned
  release when the running binary differs.

## Uninstall

```sh
./dots uninstall            # removes wrappers and the updater timer
./hyprland/uninstall.sh    # removes deployed configs (standalone installer)
```

`dots uninstall` keeps config files and the managed clones; the login theme
has its own `./install.sh --uninstall` in [equisdots/login](https://github.com/equisdots/login).

## Next steps

Read [Updating and diagnosing](/docs/updating) to keep the installation in
sync, then [Hyprland desktop](/docs/desktop) for the configuration surface.
