# equisdots · web

Official website of the [equisdots](https://github.com/equisdots) desktop: a
landing page with an interactive 3D stack, a searchable 69-plugin explorer and
an illustrated catalog of all 24 repositories, wiki-style documentation
(English and Spanish) and a gallery of real captures and clips.

## Stack

Next.js 16 (App Router, static export) · React 19 · TypeScript 7 · Tailwind CSS 4
· Geist Sans/Mono · `marked` · Three.js (r187, WebGL2). Dependencies are pinned
to the latest releases and `npm audit` must stay at zero vulnerabilities.

The documentation is a static wiki: a pinned sidebar, a per-page table of
contents with scroll-spy and a command palette (Ctrl/⌘+K) backed by a search
index generated from the Markdown sources by `scripts/build-search-index.mjs`
(runs automatically on `dev` and `build`).

## Development

```sh
npm install
npm run dev          # http://localhost:3000/web
npm run typecheck    # tsc --noEmit
npm run build        # static export into out/
```

The site is served from a GitHub Pages project path, so `next.config.ts` uses
`basePath: "/web"` by default. Override it for local work at the root:

```sh
NEXT_PUBLIC_BASE_PATH="" npm run dev
```

Public assets referenced with plain `<img>` must go through
`withBasePath()` from `src/lib/base-path.ts`.

## Structure

```
content/docs/{en,es}/      documentation pages (Markdown + frontmatter)
public/logos/              equisdots brand assets (all six variants)
public/previews/shots/     optimized WebP stills (+ 640/1280 variants)
public/previews/clips/     MP4 clips and WebP posters for the gallery
public/previews/clips/gif/ optimized GIF clips for READMEs (GIFS=1)
public/search-index.*.json generated search indexes (do not edit by hand)
scripts/build-search-index.mjs
scripts/build-previews.sh  regenerates public/previews from raw captures
src/app/                   routes: /, /docs, /previews and their /es counterparts
src/components/            Navbar, Footer, previews, widget illustrations
src/components/landing/    hero, stack, flows, design, widget gallery, plugin explorer, repo sections
src/components/three/      client Three.js scenes: interactive stack and palette prism
src/components/docs/       wiki shell, sidebar, search dialog, table of contents
src/components/previews/   stills lightbox and clip cards
src/lib/                   base path, i18n dictionaries, docs loader, repo and plugin catalogs, previews
```

## Documentation pages

Each page is a Markdown file with frontmatter:

```md
---
title: Installation
description: One-line summary.
order: 2
section: start   # start | desktop | wallpapers | more
---
```

`src/lib/docs.ts` reads the folder at build time; new pages appear in the
sidebar and the index automatically, in both languages (add the file to
`content/docs/en/` and `content/docs/es/`). The current set covers the
compositors, the shell, Nyx, the design system, the plugin standard and 69-plugin
hub, theming, wallpapers, scenes, tools, architecture and contributing.

## Stack map, flows and repository catalog

The landing page has two data-driven sections:

- **Interactive stack** (`StackSection.tsx` + `components/three/StackScene.tsx`):
  a Three.js isometric stack of the five layers with a plugin orbit. Pointer
  parallax, per-layer hover and the palette tokens are live; static under
  `prefers-reduced-motion` and paused when off-screen.
- **Flows** (`FlowsSection.tsx` + `IsoFlow.tsx`): four isometric SVG flow
  diagrams for the palette, wallpaper, plugin and compositor paths.
- **Design system** (`DesignSystemSection.tsx` + `components/three/PaletteGem.tsx`):
  a palette prism that recolors with the selected swatch, beside the glass,
  frame, shadow and LiquidGlass notes.
- **Widget gallery** (`WidgetGallery.tsx`): an interactive tabbed showcase of the
  ten recreated shell surfaces.
- **Plugin explorer** (`PluginExplorer.tsx` + `src/lib/plugins.ts`): search and
  category filters over all 69 plugins with bilingual notes.
- **Repository catalog** (`RepoList.tsx` + `RepoArt.tsx`): every repository is
  grouped by layer and gets a simplified isometric illustration, a role, a
  description and its payload location. Add or edit one entry in `src/lib/repos.ts`.

The 3D surfaces import `three` only in client components; the SVG diagrams stay
for the flows and repository art. Every scene caps the pixel ratio, pauses when
hidden and disposes its geometries, materials and renderer on unmount.

## Previews

`/previews` (and `/es/previews`) is a gallery of real captures and clips. The
manifest lives in `src/lib/previews.ts` (ids, intrinsic sizes, sections) and
the copy in `src/lib/i18n.ts`. The interactive parts are two client components:
a click-to-zoom lightbox for stills, and clip cards that autoplay muted when
they enter the viewport and pause when they leave (fully paused when
`prefers-reduced-motion` is set).

Assets are pre-optimized, never edited by hand:

| Folder | Contents |
|---|---|
| `public/previews/shots/` | WebP stills, full size plus 640/1280 variants used via `srcset` |
| `public/previews/clips/` | H.264 MP4 (CRF 27, `+faststart`) plus a WebP poster per clip |
| `public/previews/clips/gif/` | gifski GIFs for READMEs (committed set: 640px wide, 12 fps, Q80) |

The raw sources live outside this repository, in `previews-equisdots/`
(`images/*.png` and `gifs/*.gif`). Regenerate everything with:

```sh
./scripts/build-previews.sh ../previews-equisdots
GIFS=1 ./scripts/build-previews.sh ../previews-equisdots   # + GIFs for READMEs (gifski)
GIFS=1 GIF_WIDTH=640 GIF_FPS=12 GIF_QUALITY=78 ./scripts/build-previews.sh ../previews-equisdots
```

The script requires `ffmpeg`; `GIFS=1` also requires `gifski`. Keep the slug
map in the script and `src/lib/previews.ts` in sync when adding new files.

## Theme

Two palettes from the equisdots collection drive the site (including the 3D
materials, which read the same CSS variables) through `src/app/globals.css`:

- dark: **X** (the default desktop palette, matching the logo)
- light: **Catppuccin Latte**

The toggle stores the choice in `localStorage` and an inline script applies it
before the first paint. The visual language follows the flat, content-led
direction shared with the X Linux docs: hairline borders, generous spacing,
restrained rounding and color used for state rather than decoration. The
interactive stack and palette prism add a restrained isometric 3D layer
(blueprint grid, accent-tinted slabs and orbiting plugin satellites); all
animation respects `prefers-reduced-motion`.

## Deploy

`.github/workflows/deploy.yml` builds the export and publishes it to GitHub
Pages on every push to `main` (`pages: write` + OIDC). The expected URL is
`https://equisdots.github.io/web/`.
