import type { Locale } from "./i18n";

export const REPO_GROUPS = [
  "install",
  "interface",
  "compositor",
  "engines",
  "data",
  "plugins",
  "site",
] as const;

export type RepoGroup = (typeof REPO_GROUPS)[number];

export const REPO_VISUALS = [
  "installer",
  "compositor",
  "scroll",
  "overlay",
  "login",
  "shell",
  "mascot",
  "palette",
  "theme",
  "wallpaper",
  "scene",
  "clock",
  "terminal",
  "contract",
  "sdk",
  "plugins",
  "map",
  "web",
  "org",
] as const;

export type RepoVisual = (typeof REPO_VISUALS)[number];

export type RepoAccent = "c1" | "c2" | "c3" | "c4" | "c5" | "c6";

export type Repo = {
  name: string;
  url: string;
  group: RepoGroup;
  visual: RepoVisual;
  accent: RepoAccent;
  role: Record<Locale, string>;
  description: Record<Locale, string>;
  install: string;
};

export const REPOS: Repo[] = [
  {
    name: "dots",
    url: "https://github.com/equisdots/dots",
    group: "install",
    visual: "installer",
    accent: "c3",
    role: { en: "meta installer", es: "meta instalador" },
    description: {
      en: "Installs, updates and diagnoses the whole Hyprland stack, including the plugin set.",
      es: "Instala, actualiza y diagnostica todo el stack de Hyprland, incluido el conjunto de plugins.",
    },
    install: "~/.local/bin/dots",
  },
  {
    name: "niri-meta",
    url: "https://github.com/equisdots/niri-meta",
    group: "install",
    visual: "installer",
    accent: "c2",
    role: { en: "niri meta", es: "meta de niri" },
    description: {
      en: "Parallel dotsniri installer: owns the niri config, overlays and session entry.",
      es: "Instalador dotsniri paralelo: gestiona la configuración de niri, los overlays y la entrada de sesión.",
    },
    install: "~/.local/bin/dotsniri",
  },
  {
    name: "hyprland",
    url: "https://github.com/equisdots/hyprland",
    group: "compositor",
    visual: "compositor",
    accent: "c1",
    role: { en: "compositor · Lua", es: "compositor · Lua" },
    description: {
      en: "Modular Hyprland 0.55+ configuration, session scripts, GPU modes and the Lua plugin loader.",
      es: "Configuración modular de Hyprland 0.55+, scripts de sesión, modos de GPU y el cargador Lua de plugins.",
    },
    install: "~/.config/hypr",
  },
  {
    name: "niri",
    url: "https://github.com/equisdots/niri",
    group: "compositor",
    visual: "scroll",
    accent: "c5",
    role: { en: "compositor · KDL", es: "compositor · KDL" },
    description: {
      en: "Scrollable-tiling niri 26.04 configuration, generated KDL fragments and session scripts.",
      es: "Configuración de niri 26.04 con tiling desplazable, fragmentos KDL generados y scripts de sesión.",
    },
    install: "~/.config/niri",
  },
  {
    name: "shell",
    url: "https://github.com/equisdots/shell",
    group: "interface",
    visual: "shell",
    accent: "c6",
    role: { en: "Quickshell UI", es: "interfaz Quickshell" },
    description: {
      en: "Compositor-neutral bar, panels, popups, settings editor, lock screen and desktop widgets.",
      es: "Barra, paneles, popups, editor de ajustes, pantalla de bloqueo y widgets neutrales al compositor.",
    },
    install: "~/.config/hypr/scripts/quickshell",
  },
  {
    name: "nyx",
    url: "https://github.com/equisdots/nyx",
    group: "interface",
    visual: "mascot",
    accent: "c4",
    role: { en: "mascot plugin", es: "plugin de mascotas" },
    description: {
      en: "Self-contained island/notch plugin with species, moods, live stats and a control-center dock.",
      es: "Plugin autocontenido de isla/notch con especies, estados de ánimo, datos en vivo y dock de centro de control.",
    },
    install: ".../quickshell/ui/plugins/nyx",
  },
  {
    name: "niri-shell",
    url: "https://github.com/equisdots/niri-shell",
    group: "interface",
    visual: "overlay",
    accent: "c2",
    role: { en: "shell overlay", es: "overlay del shell" },
    description: {
      en: "Overlay that adds the Niri compositor backend and the niri scripts to the shared shell.",
      es: "Overlay que añade el backend de niri y sus scripts al shell compartido.",
    },
    install: "merged into the shell",
  },
  {
    name: "nyx-niri",
    url: "https://github.com/equisdots/nyx-niri",
    group: "interface",
    visual: "overlay",
    accent: "c5",
    role: { en: "nyx overlay", es: "overlay de nyx" },
    description: {
      en: "Graceful niri adaptation of the Nyx island: event stream, no cursor IPC, optional provider.",
      es: "Adaptación de la isla Nyx a niri: event stream, sin IPC de cursor y proveedor opcional.",
    },
    install: "merged into the nyx plugin",
  },
  {
    name: "login",
    url: "https://github.com/equisdots/login",
    group: "interface",
    visual: "login",
    accent: "c3",
    role: { en: "SDDM greeter", es: "greeter SDDM" },
    description: {
      en: "Monochrome static SDDM theme with session picker, power actions and no runtime sudo.",
      es: "Tema SDDM estático y monocromo con selector de sesión, acciones de energía y sin sudo en ejecución.",
    },
    install: "/usr/share/sddm/themes/x",
  },
  {
    name: "niri-login",
    url: "https://github.com/equisdots/niri-login",
    group: "interface",
    visual: "login",
    accent: "c2",
    role: { en: "session entry", es: "entrada de sesión" },
    description: {
      en: "Installs the Niri Wayland session entry so display managers list it at login.",
      es: "Instala la entrada de sesión Wayland de Niri para que los gestores de pantalla la listen.",
    },
    install: "/usr/share/wayland-sessions/niri.desktop",
  },
  {
    name: "davincix",
    url: "https://github.com/equisdots/davincix",
    group: "engines",
    visual: "wallpaper",
    accent: "c4",
    role: { en: "wallpaper kernel", es: "kernel de fondos" },
    description: {
      en: "Headless wallpaper kernel: stills, video, slideshow, search providers and interactive scenes.",
      es: "Kernel de fondos sin interfaz: imágenes, vídeo, presentación, buscadores y escenas interactivas.",
    },
    install: "~/.local/bin/davincix",
  },
  {
    name: "theme-sync",
    url: "https://github.com/equisdots/theme-sync",
    group: "engines",
    visual: "theme",
    accent: "c6",
    role: { en: "theming engine", es: "motor de temas" },
    description: {
      en: "Regenerates kitty, starship, nvim, VS Code, browsers, rofi, cava, Qt and GTK from one palette.",
      es: "Regenera kitty, starship, nvim, VS Code, navegadores, rofi, cava, Qt y GTK desde una paleta.",
    },
    install: "~/.local/bin/theme-sync",
  },
  {
    name: "timex",
    url: "https://github.com/equisdots/timex",
    group: "engines",
    visual: "clock",
    accent: "c3",
    role: { en: "time & weather plugin", es: "plugin de hora y clima" },
    description: {
      en: "Provider-driven weather engine plus the calendar panel, bar island and weather widget faces.",
      es: "Motor meteorológico con proveedores, panel de calendario, isla de barra y caras de widget del clima.",
    },
    install: ".../quickshell/ui/plugins/timex",
  },
  {
    name: "xturing",
    url: "https://github.com/equisdots/xturing",
    group: "engines",
    visual: "terminal",
    accent: "c1",
    role: { en: "terminal settings UI", es: "ajustes en terminal" },
    description: {
      en: "Rust/ratatui TUI that exposes every settings option with search, mouse and shortcut recording.",
      es: "TUI Rust/ratatui que expone todos los ajustes con búsqueda, ratón y grabación de atajos.",
    },
    install: "~/.local/bin/xturing",
  },
  {
    name: "palettes",
    url: "https://github.com/equisdots/palettes",
    group: "data",
    visual: "palette",
    accent: "c5",
    role: { en: "palette data", es: "datos de paletas" },
    description: {
      en: "base16 palettes with semantic roles, community ports, an ordered index and a JSON schema.",
      es: "Paletas base16 con roles semánticos, ports de la comunidad, índice ordenado y esquema JSON.",
    },
    install: ".../quickshell/dock/palettes",
  },
  {
    name: "background",
    url: "https://github.com/equisdots/background",
    group: "data",
    visual: "scene",
    accent: "c2",
    role: { en: "wallpapers & scenes", es: "fondos y escenas" },
    description: {
      en: "Curated 4K wallpaper packs and the catalog of palette-reactive JavaScript scenes.",
      es: "Packs de fondos 4K seleccionados y el catálogo de escenas JavaScript reactivas a la paleta.",
    },
    install: "release asset · background.zip",
  },
  {
    name: "plugin-api",
    url: "https://github.com/equisdots/plugin-api",
    group: "plugins",
    visual: "contract",
    accent: "c6",
    role: { en: "plugin contract", es: "contrato de plugins" },
    description: {
      en: "Normative manifest schema, host API version and the bash/Lua compatibility evaluators.",
      es: "Esquema normativo del manifiesto, versión de la API y evaluadores de compatibilidad en bash/Lua.",
    },
    install: ".../quickshell/plugin-api.json",
  },
  {
    name: "plugin-sdk",
    url: "https://github.com/equisdots/plugin-sdk",
    group: "plugins",
    visual: "sdk",
    accent: "c5",
    role: { en: "plugin SDK", es: "SDK de plugins" },
    description: {
      en: "Runtime kit: PluginHost, reactive Settings, surfaces, widget kit and the Lua mod API.",
      es: "Kit de ejecución: PluginHost, Settings reactivos, superficies, kit de widgets y API Lua mod.",
    },
    install: ".../quickshell/core/sdk",
  },
  {
    name: "plugins",
    url: "https://github.com/equisdots/plugins",
    group: "plugins",
    visual: "plugins",
    accent: "c4",
    role: { en: "plugin hub", es: "hub de plugins" },
    description: {
      en: "The standard, the 63-plugin concentration folder, the install registry and smoke tests.",
      es: "El estándar, la carpeta con los 63 plugins, el registro de instalación y las pruebas de humo.",
    },
    install: ".../quickshell/ui/plugins/<id>",
  },
  {
    name: "transformpath",
    url: "https://github.com/equisdots/transformpath",
    group: "plugins",
    visual: "map",
    accent: "c3",
    role: { en: "architecture map", es: "mapa de arquitectura" },
    description: {
      en: "Architecture notes, decision log and live status of the plugin system migration.",
      es: "Notas de arquitectura, registro de decisiones y estado de la migración al sistema de plugins.",
    },
    install: "documentation · no payload",
  },
  {
    name: "web",
    url: "https://github.com/equisdots/web",
    group: "site",
    visual: "web",
    accent: "c1",
    role: { en: "documentation site", es: "sitio de documentación" },
    description: {
      en: "This Next.js static site: landing, bilingual wiki, previews gallery and repository map.",
      es: "Este sitio estático de Next.js: portada, wiki bilingüe, galería de previews y mapa de repositorios.",
    },
    install: "https://equisdots.github.io/web/",
  },
  {
    name: ".github",
    url: "https://github.com/equisdots/.github",
    group: "site",
    visual: "org",
    accent: "c6",
    role: { en: "org profile", es: "perfil de la org" },
    description: {
      en: "Organization profile, contribution workflow, security policy and issue guidance.",
      es: "Perfil de la organización, flujo de contribución, política de seguridad y guía de issues.",
    },
    install: "github.com/equisdots",
  },
];
