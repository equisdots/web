---
title: Interactive scenes
description: Author, run and debug xwww JavaScript scenes that react to the active palette.
order: 9
section: wallpapers
---

An interactive scene is a directory with a JavaScript file (`scene.js`) that
draws a wallpaper procedurally on a canvas. Scenes are rendered by the xwww
scene engine (QuickJS plus tiny-skia) and displayed by `xwww-daemon` through
the same background layer used for images. They react to the palette and the
clock, but never receive input: the wallpaper stays click-through.

## How it works

```
scene.js -> xwww scene run -> rendered frame -> xwww-daemon -> layer surface
                 |
                 +-- palette provider (1 s polling)
```

1. On start, `xwww scene run` creates one engine per output and renders the
   first frame with the requested entry transition.
2. Later frames are instant and only sent when the canvas actually changed,
   so an idle scene costs almost no CPU.
3. The palette provider re-reads its source at most once per second; a change
   triggers a crossfade (`--palette-fade`, 800 ms by default).

Requires `xwww` 0.13.1+ built with the `scene` feature (releases include it),
a `wlr-layer-shell` compositor and CPU rasterization only.

## Catalog

The collection ships 21 scenes; their cards draw a shared palette swatch block
at the position measured on the original 3840x2160 artwork
(`x:1112 y:1104 w:1528 h:604`).

| Scene | Art |
|---|---|
| `astro-palette` | Astronaut line art with live palette swatch cards. |
| `astro-ascii` | ASCII-art astronaut (stencil alpha as ink coverage). |
| `ascii-astro` | Refined ASCII render kept alongside the previous one. |
| `matrix-rain` | Palette-driven glyph rain (`XSCRIPTORDEV` plus geometric glyphs). |
| `kanji-rain` | Kana/kanji/Chinese glyph rain; needs `noto-fonts-cjk`. |
| `cartesian-veil` | Cartesian plane, mirrored points and a revealed curve. |
| `asymptote-veil` | Graph of `f(x) = 1/x` approaching both asymptotes. |
| `fourier-synth` | Square wave rebuilt from its odd harmonics. |
| `lissajous-orbit` | Parametric Lissajous ratios with a trailing head. |
| `field-lines` | Rotating vector field with particles on closed orbits. |
| `riemann-sum` | Left Riemann rectangles converging to the area. |
| `bezier-mesh` | Three cubic Bézier meshes with a de Casteljau rider. |
| `phase-portrait` | Damped pendulum in phase space. |
| `monte-carlo` | π estimation by deterministic point throwing. |
| `bifurcation` | Logistic map period doubling into chaos. |
| `descent-path` | Gradient descent with contour ellipses and a path. |
| `interference` | Two coherent sources with drifting nodal lines. |
| `epicycle-veil` | Fifteen epicycles projecting a square wave. |
| `matrix-veil` | Live 2×2 linear map with a transformed grid. |
| `kepler-veil` | Eccentric Kepler orbit with the swept wedge. |
| `complex-veil` | n-th roots of unity on the Argand plane. |

## Integration with davincix

`davincix` detects any directory with `scene.js` and applies it like any other
wallpaper:

```sh
davincix set ~/.config/hypr/wallpapers/astro-palette
davincix set ~/.config/hypr/wallpapers/astro-palette --transition decrypt
DAVINCIX_SCENE_FPS=30 davincix set ~/.config/hypr/wallpapers/matrix-rain
```

- Scenes follow `settings.json -> bar.palette` within about a second.
- The frame rate defaults to 15 fps; override it with `DAVINCIX_SCENE_FPS`.
- `current_scene` stores the active directory and `init.sh` re-applies it on
  session start; applying an image or video stops the scene.
- The picker shows scenes with a `JS` badge and the `base.jpg` cover.

## Running a scene directly

The engine can be used without the kernel, which is the fastest way to
iterate:

```sh
xwww scene check  scene.js                                   # compile only
xwww scene render scene.js -o preview.png --size 1920x1080   # one frame
xwww scene run    scene.js --fps 15 --palette equisdots      # live
```

| Flag | Default | Meaning |
|---|---|---|
| `--fps` | `10` | Frames rendered and pushed per second. |
| `--size` | `2560x1440` | Canvas size for `render`. |
| `--palette` | xwww file, then equisdots | `xwww[:path]`, `equisdots[:slug]`, `file:<path>`, `command:<cmd>`. |
| `--timeout-ms` | `100` | Per-frame JavaScript budget (davincix uses 2000). |
| `--asset <path>` | scene directory | Extra directory whose images the scene may load. Repeatable. |
| `--palette-fade` | `800` | Crossfade in milliseconds on palette change (`0` disables). |
| `--transition-type` | `none` | Entry transition for the first frame. |

## Scene lifecycle

A scene is one plain JavaScript file with two optional top-level functions:

```js
function setup(ctx) { /* once before the first frame */ }

function render(t, ctx) {
  // Once per frame; t is seconds since the scene started.
  // Must be synchronous and finish inside the frame budget.
}
```

Module-level variables persist between frames and are the place for scene
state. `ctx` is read-only and rebuilt every frame:

```js
{
  width, height,   // output size in physical pixels
  frame,           // monotonically increasing frame counter
  now,             // wall clock in milliseconds since the Unix epoch
  palette: {
    slug: "x", name: "X",
    background: { hex: "#050505", r: 5, g: 5, b: 5 },
    foreground: { hex: "#f7f1ff", r: 247, g: 241, b: 255 },
    colors: [ /* base16 color0..color15 as { hex, r, g, b } */ ],
    roles: { workspaceActive: { hex: "#eab308", r: 234, g: 179, b: 8 } }
  },
  events: []       // reserved; event providers are not implemented
}
```

A frame that throws or exceeds the timeout is discarded and the previous
frame stays on screen, so bugs never blank the wallpaper.

## Canvas API

All calls are methods of the global `canvas` object. Colors accept `#rgb`,
`#rrggbb`, `#rrggbbaa` or `[r, g, b]` arrays.

| Call | Notes |
|---|---|
| `canvas.clear(color)` | Overwrites the surface, no blending. |
| `canvas.fill` / `no_fill`, `canvas.stroke` / `no_stroke` | Fill and stroke paints. |
| `canvas.alpha(value)` | Opacity multiplier for later paints. |
| `canvas.rect`, `canvas.circle`, `canvas.round_rect` | Shapes. |
| `canvas.begin_path`, `move_to`, `line_to`, `quad_to`, `cubic_to`, `close_path`, `fill_path`, `stroke_path` | Path construction and drawing. |
| `canvas.linear_gradient`, `canvas.radial_gradient` | Gradients with evenly spaced stops. |
| `canvas.image(path, x, y, w, h)` | Local asset scaled into a box. |
| `canvas.image_tinted(path, ...)` | Asset painted with a flat color, alpha kept. |
| `canvas.remap(x, y, w, h, colors, strength)` | Luminance-to-gradient region recolor. |
| `canvas.push` / `pop`, `translate`, `rotate`, `scale` | Transform stack. |
| `canvas.text(str, x, y, size, color, { family, anchor, bold })` | System-font text. |
| `log(...values)` | Writes to stderr with a `[scene]` prefix. |

## Allowed and not allowed

- No timers (`setTimeout`, `requestAnimationFrame`): compute motion from `t`
  and `ctx.frame`.
- No browser canvas API or DOM: use the `canvas` methods above.
- No `import`/`require`, network or filesystem access; only local assets in
  the scene directory (or `--asset`).
- No WebGL or shaders; use CPU 2D drawing or a video wallpaper instead.
- No pointer or scroll events: react to the palette and the clock.

## Performance

- The engine already skips identical frames; return early when nothing
  changed and the scene costs nothing between updates.
- 10 to 15 fps is the sweet spot. The full-frame pipeline saturates long
  before the display refresh rate (roughly 30-35 fps at 1080p).
- Text is cached per glyph, family and color, but keep unique draws low.
- Prefer `canvas.remap` and image assets over per-pixel work.
- Hard limits: one synchronous frame at a time, a `--timeout-ms` budget
  (100 ms by default, 2000 ms under davincix) and 32 MB of JavaScript memory
  with a 1 MB stack.

## Publishing a scene

Scenes live under `scenes/` in
[equisdots/background](https://github.com/equisdots/background). To contribute
one:

1. Add the directory with `scene.js` and `base.jpg`.
2. Add a row to the catalog in `docs/interactive-scenes.md`.
3. Add an entry to `CHANGELOG.md` under the current dated section.
4. Regenerate thumbnails and test the transition locally:
   `davincix thumbs` and `davincix set <dir> --transition decrypt`.
5. Open a pull request; only submit artwork you own or that is explicitly
   redistributable.

## Debugging

- `log(...)` output goes to `$XDG_RUNTIME_DIR/quickshell/logs/xwww_debug.log`
  when running under davincix.
- `xwww scene check scene.js` reports syntax errors; `xwww scene render
  scene.js -o out.png --size 1920x1080` is faster to iterate on.
- Common errors: `invalid color` (use hex or RGB arrays), `asset outside the
  allowed directories` (use a local asset or `--asset`), `exceeded the frame
  budget` (move work to `setup`).
- Edit the copy under the wallpaper directory: that is the one davincix runs.

## Next steps

- [Wallpapers](/docs/wallpapers) for the kernel and the picker.
- [Theming and palettes](/docs/theming) for the palette files scenes read.
