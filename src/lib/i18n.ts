export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export type Dict = {
  nav: { home: string; docs: string; previews: string; github: string };
  theme: { toDark: string; toLight: string };
  lang: { label: string };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    install: string;
    copy: string;
    copied: string;
    docs: string;
    previews: string;
    paletteNote: string;
  };
  home: {
    highlightsTitle: string;
    highlightsSubtitle: string;
    widgetsTitle: string;
    widgetsSubtitle: string;
    reposTitle: string;
    reposSubtitle: string;
    ctaTitle: string;
    ctaText: string;
  };
  highlights: { title: string; body: string }[];
  widgets: {
    bar: string;
    palette: string;
    timex: string;
    sysmon: string;
    davincix: string;
    music: string;
    terminal: string;
    desktop: string;
  };
  widgetNotes: {
    bar: string;
    palette: string;
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
    title: string;
    subtitle: string;
    phase: string;
    phaseNote: string;
    items: { title: string; kind: string }[];
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
    title: "Equisdots",
    subtitle:
      "An opinionated Arch-based desktop stack: Hyprland in the Lua era, a Quickshell shell, a live palette engine and a wallpaper kernel with interactive scenes.",
    install: "Install with one command",
    copy: "Copy",
    copied: "Copied",
    docs: "Read the docs",
    previews: "See previews",
    paletteNote: "This site uses two palettes from the collection: X (dark) and Catppuccin Latte (light).",
  },
  home: {
    highlightsTitle: "What makes it different",
    highlightsSubtitle: "Small repositories, one command, one palette across the whole desktop.",
    widgetsTitle: "The widgets, illustrated",
    widgetsSubtitle: "Web recreations of the shell surfaces: bar, panels, pickers and desktop widgets.",
    reposTitle: "Repositories",
    reposSubtitle: "Each piece lives in its own repository and ships with its own documentation.",
    ctaTitle: "Start with the documentation",
    ctaText: "Installation, updates, Hyprland configuration, wallpapers, scenes and theming, in English and Spanish.",
  },
  highlights: [
    { title: "Hyprland, Lua era", body: "Compositor configuration written against the Lua API (0.55+), split into reusable modules for keybinds, rules, animations and colors." },
    { title: "Live palette engine", body: "base16 palettes with semantic roles: switching one recolors the bar, window borders, widgets and running scenes without a reload." },
    { title: "Interactive scenes", body: "JavaScript wallpapers rendered by the xwww engine: procedural art that reacts to the palette and the clock." },
    { title: "Quickshell shell", body: "Bar with zones, a full settings editor, panels, popups and floating desktop widgets with a visual redactor." },
    { title: "One command", body: "dots installs, updates and diagnoses the whole stack, from packages and fonts to the login theme." },
    { title: "Open and documented", body: "Every repository ships guides, changelogs and a wiki-style documentation site you are reading now." },
  ],
  widgets: {
    bar: "Bar islands",
    palette: "Palette switcher",
    timex: "Calendar and weather",
    sysmon: "System monitor",
    davincix: "Wallpaper picker",
    music: "Music player",
    terminal: "Terminal settings",
    desktop: "Desktop widgets",
  },
  widgetNotes: {
    bar: "Floating islands for workspaces, clock and status; palette-tinted, blur-aware.",
    palette: "Switch the whole desktop palette without opening the settings editor.",
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
    title: "Previews",
    subtitle: "A gallery of the desktop is coming in the next phase.",
    phase: "Phase 2",
    phaseNote:
      "This page will host a full gallery: bar styles, palettes, wallpapers, scenes and desktop widgets. For now, here is what is planned.",
    items: [
      { title: "Bar styles", kind: "Shell" },
      { title: "Palette gallery", kind: "Theming" },
      { title: "Wallpapers", kind: "Collection" },
      { title: "Interactive scenes", kind: "Scenes" },
      { title: "Desktop widgets", kind: "Widgets" },
      { title: "Lock screen", kind: "Login" },
      { title: "Terminal settings", kind: "xturing" },
      { title: "Window borders", kind: "Hyprland" },
    ],
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
    title: "Equisdots",
    subtitle:
      "Un escritorio opinionado sobre Arch: Hyprland en la era Lua, un shell Quickshell, un motor de paletas en vivo y un kernel de fondos con escenas interactivas.",
    install: "Instala con un solo comando",
    copy: "Copiar",
    copied: "Copiado",
    docs: "Leer la documentación",
    previews: "Ver previews",
    paletteNote: "Este sitio usa dos paletas de la colección: X (oscura) y Catppuccin Latte (clara).",
  },
  home: {
    highlightsTitle: "Qué lo hace diferente",
    highlightsSubtitle: "Repositorios pequeños, un comando, una paleta en todo el escritorio.",
    widgetsTitle: "Los widgets, ilustrados",
    widgetsSubtitle: "Recreaciones web de las superficies del shell: barra, paneles, selectores y widgets de escritorio.",
    reposTitle: "Repositorios",
    reposSubtitle: "Cada pieza vive en su propio repositorio y trae su propia documentación.",
    ctaTitle: "Empieza por la documentación",
    ctaText: "Instalación, actualizaciones, configuración de Hyprland, fondos, escenas y temas, en inglés y español.",
  },
  highlights: [
    { title: "Hyprland, era Lua", body: "Configuración del compositor escrita contra la API Lua (0.55+), dividida en módulos reutilizables para atajos, reglas, animaciones y colores." },
    { title: "Motor de paletas en vivo", body: "Paletas base16 con roles semánticos: cambiar una recolorea la barra, los bordes de ventana, los widgets y las escenas activas sin recargar." },
    { title: "Escenas interactivas", body: "Fondos en JavaScript renderizados por el motor de xwww: arte procedural que reacciona a la paleta y al reloj." },
    { title: "Shell Quickshell", body: "Barra con zonas, editor de ajustes completo, paneles, popups y widgets flotantes de escritorio con redactor visual." },
    { title: "Un solo comando", body: "dots instala, actualiza y diagnostica todo el stack, desde paquetes y fuentes hasta el tema de login." },
    { title: "Abierto y documentado", body: "Cada repositorio incluye guías, changelogs y esta documentación estilo wiki que estás leyendo." },
  ],
  widgets: {
    bar: "Islas de la barra",
    palette: "Selector de paletas",
    timex: "Calendario y clima",
    sysmon: "Monitor del sistema",
    davincix: "Selector de fondos",
    music: "Reproductor de música",
    terminal: "Ajustes en terminal",
    desktop: "Widgets de escritorio",
  },
  widgetNotes: {
    bar: "Islas flotantes para espacios, reloj y estado; tintadas con la paleta y compatibles con blur.",
    palette: "Cambia la paleta de todo el escritorio sin abrir el editor de ajustes.",
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
    title: "Previews",
    subtitle: "La galería del escritorio llega en la siguiente fase.",
    phase: "Fase 2",
    phaseNote:
      "Esta página alojará una galería completa: estilos de barra, paletas, fondos, escenas y widgets de escritorio. Por ahora, esto es lo planeado.",
    items: [
      { title: "Estilos de barra", kind: "Shell" },
      { title: "Galería de paletas", kind: "Theming" },
      { title: "Fondos", kind: "Colección" },
      { title: "Escenas interactivas", kind: "Scenes" },
      { title: "Widgets de escritorio", kind: "Widgets" },
      { title: "Pantalla de bloqueo", kind: "Login" },
      { title: "Ajustes en terminal", kind: "xturing" },
      { title: "Bordes de ventana", kind: "Hyprland" },
    ],
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
