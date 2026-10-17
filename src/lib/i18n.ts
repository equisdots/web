import type { ClipGroupId, ShotKind } from "./previews";

export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

type FlowCopy = {
  title: string;
  note: string;
  nodes: Record<string, { label: string; note: string }>;
};

export type Dict = {
  nav: { home: string; docs: string; previews: string; github: string };
  theme: { toDark: string; toLight: string };
  lang: { label: string };
  hero: {
    eyebrow: string;
    title: string;
    dots: string;
    subtitle: string;
    install: string;
    copy: string;
    copied: string;
    docs: string;
    previews: string;
    visualLabel: string;
    paletteNote: string;
  };
  home: {
    labels: { highlights: string; stack: string; flows: string; widgets: string; repos: string; cta: string };
    table: { repo: string; purpose: string };
    highlightsTitle: string;
    highlightsSubtitle: string;
    stackTitle: string;
    stackSubtitle: string;
    flowsTitle: string;
    flowsSubtitle: string;
    widgetsTitle: string;
    widgetsSubtitle: string;
    reposTitle: string;
    reposSubtitle: string;
    repoGroups: Record<
      "install" | "interface" | "compositor" | "engines" | "data" | "plugins" | "site",
      string
    >;
    ctaTitle: string;
    ctaText: string;
  };
  stack: {
    diagram: string;
    plugins: string;
    layers: {
      id: "interface" | "compositor" | "engines" | "data" | "install";
      title: string;
      note: string;
      repos: string;
    }[];
  };
  flows: {
    palette: FlowCopy;
    wallpaper: FlowCopy;
    plugins: FlowCopy;
    compositor: FlowCopy;
  };
  highlights: { title: string; body: string }[];
  widgets: {
    bar: string;
    nyx: string;
    palette: string;
    plugins: string;
    timex: string;
    sysmon: string;
    davincix: string;
    music: string;
    terminal: string;
    desktop: string;
  };
  widgetNotes: {
    bar: string;
    nyx: string;
    palette: string;
    plugins: string;
    timex: string;
    sysmon: string;
    davincix: string;
    music: string;
    terminal: string;
    desktop: string;
  };
  docs: {
    title: string;
    subtitle: string;
    sidebarTitle: string;
    menu: string;
    edit: string;
    sections: { start: string; desktop: string; wallpapers: string; more: string };
    prev: string;
    next: string;
    onThisPage: string;
    notFound: string;
    backToDocs: string;
  };
  previews: {
    eyebrow: string;
    title: string;
    subtitle: string;
    stats: { shots: string; clips: string };
    sections: {
      desktop: { title: string; note: string };
      shell: { title: string; note: string };
      clips: { title: string; note: string };
    };
    shots: Record<string, { title: string; note: string }>;
    kinds: Record<ShotKind, string>;
    clipLabel: string;
    clipMeta: string;
    clipGroups: Record<ClipGroupId, { title: string; note: string }>;
    a11y: { open: string; close: string; play: string; pause: string; dialog: string };
  };
  footer: {
    tagline: string;
    project: string;
    resources: string;
    more: string;
    docs: string;
    license: string;
    built: string;
  };
};

const en: Dict = {
  nav: { home: "Home", docs: "Docs", previews: "Previews", github: "GitHub" },
  theme: { toDark: "Switch to dark theme", toLight: "Switch to light theme" },
  lang: { label: "Language" },
  hero: {
    eyebrow: "equisdots · X Linux",
    title: "equisdots",
    dots: "dots",
    subtitle:
      "The X desktop: an Arch-based stack with Hyprland in the Lua era and a niri port, a compositor-neutral Quickshell shell, a 63-plugin standard, a live palette engine and a wallpaper kernel with interactive scenes.",
    install: "Install with one command",
    copy: "Copy",
    copied: "Copied",
    docs: "Read the docs",
    previews: "See previews",
    visualLabel: "Shell surfaces · bar, palette and timex",
    paletteNote: "This site uses two palettes from the collection: X (dark) and Catppuccin Latte (light).",
  },
  home: {
    labels: { highlights: "Highlights", stack: "Stack", flows: "Flows", widgets: "Widgets", repos: "Repositories", cta: "Get started" },
    table: { repo: "repo", purpose: "purpose" },
    highlightsTitle: "What makes it different",
    highlightsSubtitle: "Small repositories, one command, one palette across the whole desktop.",
    stackTitle: "One desktop, built in layers",
    stackSubtitle:
      "Five layers with a single contract each: install, data, engines, compositor and interface. The plugin system sits beside them and extends every surface without forking the core.",
    flowsTitle: "How the pieces move",
    flowsSubtitle:
      "Four paths explain the desktop: one palette recolors everything, one kernel drives every wallpaper, one manifest extends every surface, and one shell runs on both compositors.",
    widgetsTitle: "The widgets, illustrated",
    widgetsSubtitle: "Web recreations of the shell surfaces: bar, panels, pickers and desktop widgets.",
    reposTitle: "Every repository, illustrated",
    reposSubtitle:
      "All 22 repositories of the organization, grouped by the layer they own. Each card links to its source and shows where its payload lands.",
    repoGroups: {
      install: "Install and update",
      interface: "Interface and session",
      compositor: "Compositors",
      engines: "Engines and tools",
      data: "Data and content",
      plugins: "Plugin system",
      site: "Site and community",
    },
    ctaTitle: "Start with the documentation",
    ctaText: "Installation, updates, compositor configuration, plugins, wallpapers, scenes and theming, in English and Spanish.",
  },
  stack: {
    diagram: "Isometric stack map",
    plugins: "side rail · plugin system",
    layers: [
      {
        id: "interface",
        title: "Interface",
        note: "One Quickshell tree for both sessions: bar, panels, editor, lock screen and the Nyx island.",
        repos: "shell · nyx · overlays",
      },
      {
        id: "compositor",
        title: "Compositor",
        note: "Lua Hyprland and KDL niri behind a runtime-selected backend, with reversible overlays.",
        repos: "hyprland · niri",
      },
      {
        id: "engines",
        title: "Engines",
        note: "Wallpapers, cross-app theming, time and weather, and a complete terminal settings frontend.",
        repos: "davincix · theme-sync · timex · xturing",
      },
      {
        id: "data",
        title: "Data and content",
        note: "One settings file, one palette store and the wallpaper plus scene collection.",
        repos: "palettes · background",
      },
      {
        id: "install",
        title: "Install and session",
        note: "Two independent meta installers, static login themes and the Wayland session entry.",
        repos: "dots · dotsniri · login",
      },
    ],
  },
  flows: {
    palette: {
      title: "One palette, every surface",
      note: "settings.json selects a slug; the palette store feeds the shell, window borders, theme-sync and running scenes.",
      nodes: {
        settings: { label: "settings.json", note: "bar.palette" },
        palettes: { label: "palettes/*.json", note: "base16 + roles" },
        shell: { label: "shell + borders", note: "bar, panels, frames" },
        theme: { label: "theme-sync", note: "kitty, nvim, gtk…" },
        scenes: { label: "xwww scenes", note: "palette provider" },
      },
    },
    wallpaper: {
      title: "One kernel, every wallpaper",
      note: "davincix resolves a file, URL or scene directory, picks xwww or mpvpaper, and refreshes the lock-screen cache.",
      nodes: {
        davincix: { label: "davincix", note: "file · url · scene" },
        xwww: { label: "xwww", note: "still + JS scene" },
        mpvpaper: { label: "mpvpaper", note: "video" },
        surface: { label: "layer surface", note: "the screen" },
        lock: { label: "lock · SDDM", note: "current_wallpaper.png" },
      },
    },
    plugins: {
      title: "One manifest, every surface",
      note: "A plugin.json is discovered, compatibility-checked and mounted by the generic hosts; the plugin owns its UI.",
      nodes: {
        manifest: { label: "plugin.json", note: "id + provides" },
        scan: { label: "scan folders", note: "user wins" },
        compat: { label: "enable · compat", note: "api 1.0.0" },
        mount: { label: "generic hosts", note: "PluginHosts" },
        surfaces: { label: "UI surfaces", note: "panels · bars · settings" },
      },
    },
    compositor: {
      title: "One shell, two compositors",
      note: "The session selects the backend at runtime; the bar, panels, widgets and Nyx consume the same adapter surface on Hyprland and niri.",
      nodes: {
        session: { label: "session", note: "XDG_CURRENT_DESKTOP" },
        adapter: { label: "Compositor.qml", note: "runtime backend" },
        hyprland: { label: "Hyprland", note: "Lua · hyprctl" },
        niri: { label: "niri", note: "KDL · niri msg" },
        shell: { label: "shared shell", note: "same widgets" },
      },
    },
  },
  highlights: [
    { title: "Hyprland, Lua era", body: "Compositor configuration written against the Lua API (0.55+), split into reusable modules for keybinds, rules, animations and colors." },
    { title: "niri, too", body: "The same desktop also runs on niri: the shell, palettes, widgets and the Nyx mascot are shared, and a separate dotsniri meta manages the niri stack." },
    { title: "63 plugins, one standard", body: "Self-contained features declare plugin.json, ship their own settings pages, bar modules and panels, and are discovered by folder. dots installs, toggles and updates them without touching the core." },
    { title: "Live palette engine", body: "base16 palettes with semantic roles: switching one recolors the bar, window borders, widgets and running scenes without a reload." },
    { title: "Interactive scenes", body: "JavaScript wallpapers rendered by the xwww engine: procedural art that reacts to the palette and the clock." },
    { title: "Quickshell shell", body: "Bar with zones, a full settings editor, panels, popups and floating desktop widgets with a visual redactor." },
    { title: "One command", body: "dots installs, updates and diagnoses the whole stack, from packages and fonts to the login theme." },
    { title: "Open and documented", body: "Every repository ships guides, changelogs and a wiki-style documentation site you are reading now." },
  ],
  widgets: {
    bar: "Bar islands",
    nyx: "Nyx island",
    palette: "Palette switcher",
    plugins: "Plugins panel",
    timex: "Calendar and weather",
    sysmon: "System monitor",
    davincix: "Wallpaper picker",
    music: "Music player",
    terminal: "Terminal settings",
    desktop: "Desktop widgets",
  },
  widgetNotes: {
    bar: "Floating islands for workspaces, clock and status; palette-tinted, blur-aware.",
    nyx: "Mascot island that unfolds into a control center: species, live stats and quick actions.",
    palette: "Switch the whole desktop palette without opening the settings editor.",
    plugins: "63 plugins, each with its own switch, settings page and keybind surface.",
    timex: "Clock, month grid and forecast in one popup, fed by the local weather cache.",
    sysmon: "CPU, memory, disks and GPU with per-core detail.",
    davincix: "Stills, video and interactive scenes with reveal transitions.",
    music: "Album art, progress and a live spectrum fed by the shared Cava instance.",
    terminal: "The whole settings panel in a ratatui TUI, keyboard and mouse friendly.",
    desktop: "Clock, weather and visualizer cards placed anywhere, edited with the redactor.",
  },
  docs: {
    title: "Documentation",
    subtitle: "Everything about equisdots, from installation to writing your own interactive wallpapers.",
    sidebarTitle: "Documentation",
    menu: "Menu",
    edit: "Edit this page on GitHub",
    sections: { start: "Start here", desktop: "Desktop", wallpapers: "Wallpapers", more: "More" },
    prev: "Previous",
    next: "Next",
    onThisPage: "On this page",
    notFound: "That documentation page does not exist.",
    backToDocs: "Back to the documentation index",
  },
  previews: {
    eyebrow: "Real desktop",
    title: "Previews",
    subtitle:
      "Real captures and short clips of the equisdots desktop: Hyprland tiling, the Quickshell shell and settings editor, palettes, plugins, scenes and widgets.",
    stats: { shots: "captures", clips: "clips" },
    sections: {
      desktop: {
        title: "The desktop",
        note: "1440p captures of the full stack running: tiling, interactive scenes and the daily drivers.",
      },
      shell: {
        title: "Shell and settings",
        note: "The Quickshell surfaces and the settings editor, panel by panel.",
      },
      clips: {
        title: "Tours in motion",
        note: "Eighteen 10-second clips recorded on the real desktop.",
      },
    },
    shots: {
      "desktop-doctor": {
        title: "The full desktop",
        note: "equisdots doctor, the timex TUI and btop over an interactive scene.",
      },
      "desktop-tiling": {
        title: "Tiling and panels",
        note: "Hyprland tiling with btop, the widgets panel and the settings editor at once.",
      },
      "desktop-scenes": {
        title: "Scenes and monitors",
        note: "A scene wallpaper reacting to the palette, with the system monitor and terminal UI on top.",
      },
      bar: {
        title: "Bar islands",
        note: "Workspaces, clock and status islands: palette-tinted, blur-aware and position-independent.",
      },
      "settings-bar-engine": {
        title: "Bar engine",
        note: "Master switch, position, zones and modules, configured live in the settings panel.",
      },
      "settings-bar-position": {
        title: "Bar position",
        note: "Move the bar to any edge; the preview reflects position and zones.",
      },
      "settings-timex": {
        title: "Timex",
        note: "Weather provider, city, forecast layout and calendar popup options.",
      },
      "settings-monitors": {
        title: "Monitors",
        note: "Resolution, refresh rate, VRR, bit depth, HDR and mirroring per output.",
      },
      "settings-glass": {
        title: "Glass and blur",
        note: "Translucency for popups, menus and the bar; blur comes from a Hyprland layer rule.",
      },
      "widgets-panel": {
        title: "Widgets panel",
        note: "The floating hub: palettes, settings and desktop widgets one tap away.",
      },
      "app-launcher": {
        title: "App launcher",
        note: "Fuzzy search over installed applications with instant launch.",
      },
    },
    kinds: { shell: "Shell", settings: "Settings", desktop: "Desktop", theming: "Theming", scenes: "Scenes" },
    clipLabel: "Clip",
    clipMeta: "10 s · 960 × 540 · 20 fps",
    clipGroups: {
      v1: {
        title: "Desktop tour · v1",
        note: "Palettes, light theme, tiling, terminals, panels and notifications.",
      },
      v2: {
        title: "Desktop tour · v2",
        note: "The palette engine and panels on the latest build.",
      },
    },
    a11y: {
      open: "Open full size",
      close: "Close preview",
      play: "Play clip",
      pause: "Pause clip",
      dialog: "Preview",
    },
  },
  footer: {
    tagline: "Palette-driven desktop, documented and open.",
    project: "Project",
    resources: "Resources",
    more: "More",
    docs: "Documentation",
    license: "Documentation and artwork follow each repository's license.",
    built: "Built with Next.js, deployed on GitHub Pages.",
  },
};

const es: Dict = {
  nav: { home: "Inicio", docs: "Docs", previews: "Previews", github: "GitHub" },
  theme: { toDark: "Cambiar a tema oscuro", toLight: "Cambiar a tema claro" },
  lang: { label: "Idioma" },
  hero: {
    eyebrow: "equisdots · X Linux",
    title: "equisdots",
    dots: "dots",
    subtitle:
      "El escritorio X: un stack sobre Arch con Hyprland en la era Lua y un port a niri, un shell Quickshell neutral al compositor, un estándar de 63 plugins, un motor de paletas en vivo y un kernel de fondos con escenas interactivas.",
    install: "Instala con un solo comando",
    copy: "Copiar",
    copied: "Copiado",
    docs: "Leer la documentación",
    previews: "Ver previews",
    visualLabel: "Superficies del shell · barra, paleta y timex",
    paletteNote: "Este sitio usa dos paletas de la colección: X (oscura) y Catppuccin Latte (clara).",
  },
  home: {
    labels: { highlights: "Claves", stack: "Stack", flows: "Flujos", widgets: "Widgets", repos: "Repositorios", cta: "Empieza" },
    table: { repo: "repo", purpose: "propósito" },
    highlightsTitle: "Qué lo hace diferente",
    highlightsSubtitle: "Repositorios pequeños, un comando, una paleta en todo el escritorio.",
    stackTitle: "Un escritorio, construido por capas",
    stackSubtitle:
      "Cinco capas con un contrato claro cada una: instalación, datos, motores, compositor e interfaz. El sistema de plugins se sienta al lado y extiende cada superficie sin bifurcar el núcleo.",
    flowsTitle: "Cómo se mueven las piezas",
    flowsSubtitle:
      "Cuatro recorridos explican el escritorio: una paleta lo recolorea todo, un kernel gobierna cada fondo, un manifiesto extiende cada superficie y un shell corre en ambos compositores.",
    widgetsTitle: "Los widgets, ilustrados",
    widgetsSubtitle: "Recreaciones web de las superficies del shell: barra, paneles, selectores y widgets de escritorio.",
    reposTitle: "Todos los repositorios, ilustrados",
    reposSubtitle:
      "Los 22 repositorios de la organización, agrupados por la capa que poseen. Cada tarjeta enlaza a su código y muestra dónde aterriza su payload.",
    repoGroups: {
      install: "Instalación y actualización",
      interface: "Interfaz y sesión",
      compositor: "Compositores",
      engines: "Motores y herramientas",
      data: "Datos y contenido",
      plugins: "Sistema de plugins",
      site: "Sitio y comunidad",
    },
    ctaTitle: "Empieza por la documentación",
    ctaText: "Instalación, actualizaciones, configuración de los compositores, plugins, fondos, escenas y temas, en inglés y español.",
  },
  stack: {
    diagram: "Mapa isométrico del stack",
    plugins: "riel lateral · sistema de plugins",
    layers: [
      {
        id: "interface",
        title: "Interfaz",
        note: "Un único árbol Quickshell para ambas sesiones: barra, paneles, editor, bloqueo e isla Nyx.",
        repos: "shell · nyx · overlays",
      },
      {
        id: "compositor",
        title: "Compositor",
        note: "Hyprland en Lua y niri en KDL tras un backend elegido en ejecución, con overlays reversibles.",
        repos: "hyprland · niri",
      },
      {
        id: "engines",
        title: "Motores",
        note: "Fondos, temas entre aplicaciones, hora y clima, y un frontend completo de ajustes en terminal.",
        repos: "davincix · theme-sync · timex · xturing",
      },
      {
        id: "data",
        title: "Datos y contenido",
        note: "Un único settings.json, un único almacén de paletas y la colección de fondos y escenas.",
        repos: "palettes · background",
      },
      {
        id: "install",
        title: "Instalación y sesión",
        note: "Dos meta instaladores independientes, temas de login estáticos y la entrada de sesión Wayland.",
        repos: "dots · dotsniri · login",
      },
    ],
  },
  flows: {
    palette: {
      title: "Una paleta, todas las superficies",
      note: "settings.json elige un slug; el almacén de paletas alimenta el shell, los bordes de ventana, theme-sync y las escenas activas.",
      nodes: {
        settings: { label: "settings.json", note: "bar.palette" },
        palettes: { label: "palettes/*.json", note: "base16 + roles" },
        shell: { label: "shell + bordes", note: "barra, paneles, marcos" },
        theme: { label: "theme-sync", note: "kitty, nvim, gtk…" },
        scenes: { label: "escenas xwww", note: "proveedor de paleta" },
      },
    },
    wallpaper: {
      title: "Un kernel, cada fondo",
      note: "davincix resuelve un archivo, URL o directorio de escena, elige xwww o mpvpaper y refresca la caché de bloqueo.",
      nodes: {
        davincix: { label: "davincix", note: "archivo · url · escena" },
        xwww: { label: "xwww", note: "imagen + escena JS" },
        mpvpaper: { label: "mpvpaper", note: "vídeo" },
        surface: { label: "superficie", note: "la pantalla" },
        lock: { label: "bloqueo · SDDM", note: "current_wallpaper.png" },
      },
    },
    plugins: {
      title: "Un manifiesto, todas las superficies",
      note: "Un plugin.json se descubre, se comprueba su compatibilidad y lo montan hosts genéricos; el plugin posee su UI.",
      nodes: {
        manifest: { label: "plugin.json", note: "id + provides" },
        scan: { label: "escanear carpetas", note: "gana el usuario" },
        compat: { label: "activar · compat", note: "api 1.0.0" },
        mount: { label: "hosts genéricos", note: "PluginHosts" },
        surfaces: { label: "superficies UI", note: "paneles · barras · ajustes" },
      },
    },
    compositor: {
      title: "Un shell, dos compositores",
      note: "La sesión elige el backend en ejecución; barra, paneles, widgets y Nyx consumen la misma superficie del adaptador en Hyprland y niri.",
      nodes: {
        session: { label: "sesión", note: "XDG_CURRENT_DESKTOP" },
        adapter: { label: "Compositor.qml", note: "backend en ejecución" },
        hyprland: { label: "Hyprland", note: "Lua · hyprctl" },
        niri: { label: "niri", note: "KDL · niri msg" },
        shell: { label: "shell compartido", note: "mismos widgets" },
      },
    },
  },
  highlights: [
    { title: "Hyprland, era Lua", body: "Configuración del compositor escrita contra la API Lua (0.55+), dividida en módulos reutilizables para atajos, reglas, animaciones y colores." },
    { title: "niri, también", body: "El mismo escritorio corre también sobre niri: el shell, las paletas, los widgets y la mascota Nyx son compartidos, y un meta aparte, dotsniri, gestiona el stack de niri." },
    { title: "63 plugins, un estándar", body: "Funciones autocontenidas declaran plugin.json, traen su propia página de ajustes, módulos de barra y paneles, y se descubren por carpeta. dots las instala, activa y actualiza sin tocar el núcleo." },
    { title: "Motor de paletas en vivo", body: "Paletas base16 con roles semánticos: cambiar una recolorea la barra, los bordes de ventana, los widgets y las escenas activas sin recargar." },
    { title: "Escenas interactivas", body: "Fondos en JavaScript renderizados por el motor de xwww: arte procedural que reacciona a la paleta y al reloj." },
    { title: "Shell Quickshell", body: "Barra con zonas, editor de ajustes completo, paneles, popups y widgets flotantes de escritorio con redactor visual." },
    { title: "Un solo comando", body: "dots instala, actualiza y diagnostica todo el stack, desde paquetes y fuentes hasta el tema de login." },
    { title: "Abierto y documentado", body: "Cada repositorio incluye guías, changelogs y esta documentación estilo wiki que estás leyendo." },
  ],
  widgets: {
    bar: "Islas de la barra",
    nyx: "Isla Nyx",
    palette: "Selector de paletas",
    plugins: "Panel de plugins",
    timex: "Calendario y clima",
    sysmon: "Monitor del sistema",
    davincix: "Selector de fondos",
    music: "Reproductor de música",
    terminal: "Ajustes en terminal",
    desktop: "Widgets de escritorio",
  },
  widgetNotes: {
    bar: "Islas flotantes para espacios, reloj y estado; tintadas con la paleta y compatibles con blur.",
    nyx: "Isla de mascotas que se despliega en un centro de control: especies, datos en vivo y acciones rápidas.",
    palette: "Cambia la paleta de todo el escritorio sin abrir el editor de ajustes.",
    plugins: "63 plugins, cada uno con su interruptor, página de ajustes y superficie de atajos.",
    timex: "Reloj, rejilla mensual y previsión en un popup, alimentado por la caché local.",
    sysmon: "CPU, memoria, discos y GPU con detalle por núcleo.",
    davincix: "Imágenes, vídeo y escenas interactivas con transiciones de entrada.",
    music: "Carátula, progreso y espectro en vivo desde la instancia compartida de Cava.",
    terminal: "Todo el panel de ajustes en una TUI ratatui, manejable con teclado y ratón.",
    desktop: "Tarjetas de reloj, clima y visualizador colocables en cualquier sitio, editadas con el redactor.",
  },
  docs: {
    title: "Documentación",
    subtitle: "Todo sobre equisdots, desde la instalación hasta escribir tus propios fondos interactivos.",
    sidebarTitle: "Documentación",
    menu: "Menú",
    edit: "Editar esta página en GitHub",
    sections: { start: "Empieza aquí", desktop: "Escritorio", wallpapers: "Fondos", more: "Más" },
    prev: "Anterior",
    next: "Siguiente",
    onThisPage: "En esta página",
    notFound: "Esa página de documentación no existe.",
    backToDocs: "Volver al índice de documentación",
  },
  previews: {
    eyebrow: "Escritorio real",
    title: "Previews",
    subtitle:
      "Capturas y clips cortos del escritorio equisdots: tiling de Hyprland, shell y editor de ajustes de Quickshell, paletas, plugins, escenas y widgets.",
    stats: { shots: "capturas", clips: "clips" },
    sections: {
      desktop: {
        title: "El escritorio",
        note: "Capturas a 1440p con todo el stack en marcha: tiling, escenas interactivas y uso diario.",
      },
      shell: {
        title: "Shell y ajustes",
        note: "Las superficies de Quickshell y el editor de ajustes, panel a panel.",
      },
      clips: {
        title: "Tours en movimiento",
        note: "Dieciocho clips de 10 segundos grabados en el escritorio real.",
      },
    },
    shots: {
      "desktop-doctor": {
        title: "El escritorio completo",
        note: "equisdots doctor, la TUI de timex y btop sobre una escena interactiva.",
      },
      "desktop-tiling": {
        title: "Tiling y paneles",
        note: "Tiling de Hyprland con btop, el panel de widgets y el editor de ajustes a la vez.",
      },
      "desktop-scenes": {
        title: "Escenas y monitores",
        note: "Un fondo de escena que reacciona a la paleta, con el monitor del sistema y la TUI encima.",
      },
      bar: {
        title: "Islas de la barra",
        note: "Islas de espacios, reloj y estado: tintadas por la paleta, compatibles con blur e independientes de la posición.",
      },
      "settings-bar-engine": {
        title: "Motor de la barra",
        note: "Interruptor maestro, posición, zonas y módulos, configurados en vivo desde el panel.",
      },
      "settings-bar-position": {
        title: "Posición de la barra",
        note: "Mueve la barra a cualquier borde; la vista previa refleja posición y zonas.",
      },
      "settings-timex": {
        title: "Timex",
        note: "Proveedor meteorológico, ciudad, diseño de la previsión y opciones del calendario.",
      },
      "settings-monitors": {
        title: "Monitores",
        note: "Resolución, tasa de refresco, VRR, profundidad de bits, HDR y espejado por salida.",
      },
      "settings-glass": {
        title: "Cristal y blur",
        note: "Translucidez para popups, menús y barra; el blur viene de una layer rule de Hyprland.",
      },
      "widgets-panel": {
        title: "Panel de widgets",
        note: "El centro flotante: paletas, ajustes y widgets de escritorio a un toque.",
      },
      "app-launcher": {
        title: "Lanzador de apps",
        note: "Búsqueda difusa sobre las aplicaciones instaladas con lanzamiento inmediato.",
      },
    },
    kinds: { shell: "Shell", settings: "Ajustes", desktop: "Escritorio", theming: "Temas", scenes: "Escenas" },
    clipLabel: "Clip",
    clipMeta: "10 s · 960 × 540 · 20 fps",
    clipGroups: {
      v1: {
        title: "Tour del escritorio · v1",
        note: "Paletas, tema claro, tiling, terminales, paneles y notificaciones.",
      },
      v2: {
        title: "Tour del escritorio · v2",
        note: "El motor de paletas y los paneles en la última build.",
      },
    },
    a11y: {
      open: "Abrir a tamaño completo",
      close: "Cerrar vista previa",
      play: "Reproducir clip",
      pause: "Pausar clip",
      dialog: "Vista previa",
    },
  },
  footer: {
    tagline: "Escritorio guiado por paletas, documentado y abierto.",
    project: "Proyecto",
    resources: "Recursos",
    more: "Más",
    docs: "Documentación",
    license: "La documentación y el arte siguen la licencia de cada repositorio.",
    built: "Hecho con Next.js, desplegado en GitHub Pages.",
  },
};

export function getDict(locale: Locale): Dict {
  return locale === "es" ? es : en;
}

export function localeFromPath(pathname: string): Locale {
  return pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en";
}

export function switchLocalePath(pathname: string, target: Locale): string {
  const withoutEs = pathname.replace(/^\/es(?=\/|$)/, "");
  if (target === "es") {
    return withoutEs === "" ? "/es" : `/es${withoutEs}`;
  }
  return withoutEs === "" ? "/" : withoutEs;
}
