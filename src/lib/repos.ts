import type { Locale } from "./i18n";

export type Repo = {
  name: string;
  url: string;
  description: Record<Locale, string>;
};

export const REPOS: Repo[] = [
  {
    name: "dots",
    url: "https://github.com/equisdots/dots",
    description: {
      en: "Meta installer and updater: clones, wires and updates the whole stack.",
      es: "Meta instalador y actualizador: clona, conecta y actualiza todo el stack.",
    },
  },
  {
    name: "hyprland",
    url: "https://github.com/equisdots/hyprland",
    description: {
      en: "Hyprland compositor configuration (Lua era), scripts and system installer.",
      es: "Configuración del compositor Hyprland (era Lua), scripts e instalador del sistema.",
    },
  },
  {
    name: "niri",
    url: "https://github.com/equisdots/niri",
    description: {
      en: "niri compositor configuration (KDL), session scripts and session/portal files.",
      es: "Configuración del compositor niri (KDL), scripts de sesión y ficheros de sesión/portal.",
    },
  },
  {
    name: "niri-meta",
    url: "https://github.com/equisdots/niri-meta",
    description: {
      en: "Meta installer and updater (dotsniri) for the niri stack.",
      es: "Meta instalador y actualizador (dotsniri) del stack de niri.",
    },
  },
  {
    name: "niri-shell",
    url: "https://github.com/equisdots/niri-shell",
    description: {
      en: "Overlay that makes the shared Quickshell shell compositor-neutral.",
      es: "Overlay que hace neutral al compositor el shell Quickshell compartido.",
    },
  },
  {
    name: "nyx-niri",
    url: "https://github.com/equisdots/nyx-niri",
    description: {
      en: "Overlay that makes the Nyx mascot island compositor-neutral.",
      es: "Overlay que hace neutral al compositor la isla de mascotas Nyx.",
    },
  },
  {
    name: "niri-login",
    url: "https://github.com/equisdots/niri-login",
    description: {
      en: "Wayland session entry so display managers list \"Niri\".",
      es: "Entrada de sesión Wayland para que los gestores de pantalla listen \"Niri\".",
    },
  },
  {
    name: "shell",
    url: "https://github.com/equisdots/shell",
    description: {
      en: "Quickshell shell: bar, settings editor, panels, popups and desktop widgets.",
      es: "Shell Quickshell: barra, editor de ajustes, paneles, popups y widgets de escritorio.",
    },
  },
  {
    name: "nyx",
    url: "https://github.com/equisdots/nyx",
    description: {
      en: "Self-contained mascot island and control-center notch with a widget dock.",
      es: "Isla de mascotas y notch de centro de control, autocontenida, con dock de widgets.",
    },
  },
  {
    name: "davincix",
    url: "https://github.com/equisdots/davincix",
    description: {
      en: "Wallpaper kernel: images, video and interactive scenes, with the picker frontend.",
      es: "Kernel de fondos: imágenes, vídeo y escenas interactivas, con el selector como frontend.",
    },
  },
  {
    name: "palettes",
    url: "https://github.com/equisdots/palettes",
    description: {
      en: "base16 color palettes with semantic roles and the schema they follow.",
      es: "Paletas de color base16 con roles semánticos y el esquema que siguen.",
    },
  },
  {
    name: "theme-sync",
    url: "https://github.com/equisdots/theme-sync",
    description: {
      en: "Palette-driven theming engine for the applications in the stack.",
      es: "Motor de temas guiado por paletas para las aplicaciones del stack.",
    },
  },
  {
    name: "background",
    url: "https://github.com/equisdots/background",
    description: {
      en: "Wallpaper collection and the interactive scene catalog.",
      es: "Colección de fondos y catálogo de escenas interactivas.",
    },
  },
  {
    name: "timex",
    url: "https://github.com/equisdots/timex",
    description: {
      en: "Time and weather engine: calendar popup, forecast and settings tab.",
      es: "Motor de hora y clima: popup de calendario, previsión y pestaña de ajustes.",
    },
  },
  {
    name: "xturing",
    url: "https://github.com/equisdots/xturing",
    description: {
      en: "Terminal UI (ratatui) for the settings panel: a mouse-friendly second frontend.",
      es: "Interfaz de terminal (ratatui) para los ajustes: un segundo frontend manejable con ratón.",
    },
  },
  {
    name: "login",
    url: "https://github.com/equisdots/login",
    description: {
      en: "Minimal static SDDM login theme with session picker and power actions.",
      es: "Tema de login SDDM estático y minimalista con selector de sesión y acciones de energía.",
    },
  },
];
