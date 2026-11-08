---
title: Design system
description: The visual language of equisdots: palette roles, glass, frame, shadows, LiquidGlass, motion and compositor-aware effect controls.
order: 7
section: desktop
---

The equisdots interface is drawn by the shell, not by the compositor. That is
the single decision behind the whole design system: the same bar, panels,
popups, widgets and plugin surfaces render on Hyprland and on
[niri](/docs/niri), and a palette change recolors all of them without a
reload. This page collects the rules, the tokens and the surface primitives that
the shell and the plugin SDK share.

## Principles

- **Content first.** Hairline borders, generous spacing and restrained rounding.
  Color marks state and identity, not decoration.
- **One token set.** The shell never hardcodes a color: everything resolves
  through the active palette and its semantic roles.
- **The host draws the chrome.** Layer-shell windows are undecorated by both
  compositors, so glass, frame and shadows are drawn in QML and follow the
  animated box.
- **Motion explains, never delays.** Transitions are short, interruptible and
  disabled under `prefers-reduced-motion` / the shell's reduced-motion setting.
- **Plugins share the kit.** A third-party surface imports the same primitives
  (`LiquidGlass`, widget kit, theme tokens) instead of copying the core.

## Tokens

A palette is base16 plus explicit `background`, `foreground` and optional
`roles`. The shell derives the rest:

| Token | Meaning | Typical use |
|---|---|---|
| `base` | The palette background | Window and panel body |
| `surface0` / `surface1` / `surface2` | Subtle elevation steps | Cards, islands, hover states |
| `text` / `subtext` | Foreground and secondary text | Labels and metadata |
| `crust` | The darkest step | Behind dialogs and docks |
| `red`, `yellow`, `green`, `blue`, `mauve` | Semantic accents | Alerts, warnings, success, links, highlights |
| `workspaceActive` | Role override | Active workspace marker |
| `glassOn` | Translucency state | Enables the glass composition |

The palette collection is the source of truth
([equisdots/palettes](https://github.com/equisdots/palettes)): 155 entries at
the time of writing, split into X (30 built-in) and Custom (125 community
ports). The active slug lives in `settings.json` under `bar.palette`; the `x`
palette is the guaranteed fallback.

## Glass

`settings.json -> glass` makes shell backgrounds translucent so the compositor
backdrop blur shows through:

```json
{ "glass": { "enabled": true, "opacity": 0.72 } }
```

The mechanism differs per compositor:

- **Hyprland**: the shell enables a layer rule for the bar and popups, so the
  compositor blur samples the wallpaper behind them.
- **niri**: only surfaces that request `ext-background-effect` are blurred;
  there is no forced layer blur, and the shell degrades gracefully.

Glass is applied consistently to the bar, popups, menus and panel bodies. An
opaque palette or a low-power profile can turn it off without touching the
layout.

## Screen frame

The frame is a bezel hugging all four screen edges, drawn on the Bottom layer.
It reserves space so tiled windows never cross it, and it hugs the bar, plugin
hosts and edge-anchored widgets with rounded corners:

- `ui/frame/Frame.qml`, `core/FrameGeometry.js` and `core/FrameBus.qml`;
- plugin hosts publish `frameObstacle` rectangles and the frame adapts live;
- `settings.json -> frame` controls thickness, radius, inset and reserve
  behavior, all live from **Theme -> Frame**.

The frame is the equisdots signature: it makes an otherwise edge-to-edge
desktop look deliberately contained without changing window rules.

## Shadows

Neither compositor decorates layer-shell surfaces, so shadows are drawn by the
host:

- `settings.json -> shadows` holds `enabled`, `blur`, `spread`, `offsetX`,
  `offsetY`, `opacity` and `radius`;
- the shadow follows the animated popup box (position, size, morph and fade);
- the bar draws its own island and strip shadows from the same config;
- everything is edited live from **Theme -> Shadows**.

## LiquidGlass and the plugin kit

Panels and plugin surfaces share a glass kit with palette-tinted highlights and
a consistent refraction feel. Plugins import it through the SDK instead of
reimplementing blur, border gradients or hover states. The kit is the reason
the Samurai, MOS and W11 bars can each own a distinct personality while still
looking native to the same desktop.

Design-heavy plugins that ship their own language:

- **Samurai** — monochrome, flat, typographic; bar, dock and desktop widgets.
- **MOS** — macOS-style menu bar, magnifying dock and matching widgets.
- **W11** — Windows 11-inspired taskbar with start menu, search and tray.
- **Nyx** — mascot island and notch with its own morphology and control center.

## Motion and effect controls

The Hyprland 0.57 effects kernel is exposed in both the bar editor and xturing:

- `decoration:blur:variant` with all 11 names, plus `proportional` blur;
- `decoration:wobble` with enable and intensity;
- clamped ranges from `core/EffectRanges.js` (rounding and shadow `0..100`,
  render power `1..4`, wobble `0..2`);
- version-aware probing: values are only read or written on 0.57, and the
  generated Lua omits them on 0.56 and older.

Animations use bezier and spring curves for window open/close, workspace motion,
bar morphing and popup entrance. Every animation is short and interruptible, and
the reduced-motion path is a first-class setting, not a fallback.

## Designing with the system

When you build a new surface:

1. Read colors from the active palette; never hardcode hex values.
2. Use the kit for glass, shadows, pills and hover states.
3. Prefer a hairline border and one accent role over multiple fills.
4. Keep motion short and make the static state the complete state.
5. Test on both compositors and in both a dark and a light palette.

The documentation site follows the same language: the X palette in dark mode,
Catppuccin Latte in light mode, monospace metadata, hairline rules and one
accent color. The interactive 3D surfaces on the home page are built with
Three.js and read the same CSS tokens, so they recolor with the theme.

## Related pages

- [Theming and palettes](/docs/theming) for the palette contract and theme-sync.
- [Quickshell shell](/docs/shell) for the surfaces that implement this system.
- [Plugins and extensions](/docs/plugins) for complete bars and widget packs.
- [niri compositor](/docs/niri) for the compositor-specific fallbacks.
