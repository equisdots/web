import type { Locale } from "./i18n";

export const PLUGIN_GROUPS = ["defaults", "tools", "shells", "widgets", "modules"] as const;
export type PluginGroup = (typeof PLUGIN_GROUPS)[number];

export type PluginOrigin = "hub" | "repo" | "sample";
export type PluginAccent = "c1" | "c2" | "c3" | "c4" | "c5" | "c6";

export type Plugin = {
  id: string;
  group: PluginGroup;
  origin: PluginOrigin;
  accent: PluginAccent;
  note: Record<Locale, string>;
};

export const PLUGINS: Plugin[] = [
  { id: "screenshots", group: "defaults", origin: "hub", accent: "c3", note: { en: "Area, window and full captures plus recording with virtual audio.", es: "Capturas de área, ventana y pantalla completa, más grabación con audio virtual." } },
  { id: "nyx", group: "defaults", origin: "repo", accent: "c4", note: { en: "Mascot island and control-center notch with species and live stats.", es: "Isla de mascotas y notch de centro de control con especies y datos en vivo." } },
  { id: "timex", group: "defaults", origin: "repo", accent: "c5", note: { en: "Calendar, weather engine, bar island and weather widget faces.", es: "Calendario, motor del clima, isla de barra y caras de widget del clima." } },
  { id: "rss-reader", group: "defaults", origin: "hub", accent: "c4", note: { en: "Feed reader panel with search, filters and its own feed manager.", es: "Panel lector de feeds con búsqueda, filtros y su propio gestor de fuentes." } },
  { id: "clipboard", group: "defaults", origin: "hub", accent: "c6", note: { en: "Cliphist history with text and image preview, pinned items and search.", es: "Historial de cliphist con vista de texto e imagen, fijados y búsqueda." } },
  { id: "quicknotes", group: "defaults", origin: "hub", accent: "c3", note: { en: "Scratch notepad that saves as you type, with a todo file.", es: "Bloc de notas rápido que guarda al escribir, con archivo de tareas." } },
  { id: "file-search", group: "defaults", origin: "hub", accent: "c2", note: { en: "Debounced fd search with open-in-app actions.", es: "Búsqueda con fd y acciones para abrir en la app." } },
  { id: "sysmon", group: "defaults", origin: "hub", accent: "c1", note: { en: "Floating CPU, RAM and temperature monitor plus a bar island.", es: "Monitor flotante de CPU, RAM y temperatura, más una isla de barra." } },
  { id: "keybinds", group: "defaults", origin: "hub", accent: "c5", note: { en: "Every plugin bind in one editor: re-key or mute a single shortcut.", es: "Todos los atajos de plugins en un editor: reasigna o silencia uno." } },

  { id: "bookmarks", group: "tools", origin: "hub", accent: "c6", note: { en: "Quick-link panel backed by the plugin's own settings.", es: "Panel de enlaces rápidos respaldado por los ajustes del plugin." } },
  { id: "calculator", group: "tools", origin: "hub", accent: "c3", note: { en: "Keypad calculator with qalc evaluation and a safe fallback.", es: "Calculadora con teclado, evaluación qalc y respaldo seguro." } },
  { id: "cheatsheet", group: "tools", origin: "hub", accent: "c2", note: { en: "Searchable cheat sheet of every active keybind, core and plugin.", es: "Chuleta buscable con todos los atajos activos, del núcleo y plugins." } },
  { id: "colorpicker", group: "tools", origin: "hub", accent: "c1", note: { en: "Colour picker with the last twelve picks as copyable swatches.", es: "Selector de color con las últimas doce muestras copiables." } },
  { id: "dock", group: "tools", origin: "hub", accent: "c4", note: { en: "Configurable application dock on any screen edge with launchers.", es: "Dock de aplicaciones configurable en cualquier borde con lanzadores." } },
  { id: "emojipicker", group: "tools", origin: "hub", accent: "c5", note: { en: "Searchable Unicode glyph picker with clipboard copy.", es: "Selector de glifos Unicode con búsqueda y copia al portapapeles." } },
  { id: "hello", group: "tools", origin: "sample", accent: "c3", note: { en: "Minimal POC fixture: one manifest, one keybind, one greeting.", es: "Ejemplo mínimo: un manifiesto, un atajo y un saludo." } },
  { id: "jsonview", group: "tools", origin: "hub", accent: "c6", note: { en: "Paste, pretty-print, minify and copy JSON in pure QML and JS.", es: "Pega, formatea, minifica y copia JSON en QML y JS puro." } },
  { id: "pomodoro", group: "tools", origin: "hub", accent: "c1", note: { en: "Bar island for the shared pomodoro state file.", es: "Isla de barra para el estado compartido del pomodoro." } },
  { id: "pomodoropanel", group: "tools", origin: "hub", accent: "c4", note: { en: "25/5 work-break sessions writing a shared state file.", es: "Sesiones de trabajo y descanso 25/5 con estado compartido." } },
  { id: "power-menu", group: "tools", origin: "hub", accent: "c2", note: { en: "Lock, logout, suspend, reboot and shutdown with confirmation.", es: "Bloquear, cerrar sesión, suspender, reiniciar y apagar con confirmación." } },
  { id: "processmanager", group: "tools", origin: "hub", accent: "c5", note: { en: "Top processes by CPU with per-row kill and live totals.", es: "Procesos por CPU con matar por fila y totales en vivo." } },
  { id: "snippetbox", group: "tools", origin: "hub", accent: "c3", note: { en: "Saved text snippets with clipboard copy and an inline add form.", es: "Fragmentos de texto guardados con copia e inserción en línea." } },
  { id: "todopanel", group: "tools", origin: "hub", accent: "c2", note: { en: "Task list backed by the equisdots todo file: add, toggle, clear.", es: "Lista de tareas del archivo todo de equisdots: añadir, alternar, limpiar." } },
  { id: "unitconv", group: "tools", origin: "hub", accent: "c6", note: { en: "Offline conversion for length, mass, temperature, data and time.", es: "Conversión sin conexión de longitud, masa, temperatura, datos y tiempo." } },
  { id: "xfetch-panel", group: "tools", origin: "hub", accent: "c4", note: { en: "In-shell system fetch card with logo, info and live metrics.", es: "Tarjeta de system fetch en el shell con logo, info y métricas." } },
  { id: "xfetch-themes", group: "tools", origin: "hub", accent: "c5", note: { en: "Browse and apply xfetch terminal themes from the shell.", es: "Explora y aplica temas de terminal xfetch desde el shell." } },

  { id: "hello-bar", group: "shells", origin: "sample", accent: "c3", note: { en: "Minimal complete bar fixture for the plugin standard.", es: "Barra completa mínima de ejemplo para el estándar de plugins." } },
  { id: "samurai-bar", group: "shells", origin: "hub", accent: "c1", note: { en: "Monochrome Samurai bar: flat, typographic and status-led.", es: "Barra Samurai monocroma: plana, tipográfica y centrada en estado." } },
  { id: "samurai-dock", group: "shells", origin: "hub", accent: "c1", note: { en: "Separate Samurai bottom dock with per-output workspaces.", es: "Dock inferior Samurai con espacios por salida." } },
  { id: "mos-topbar", group: "shells", origin: "hub", accent: "c6", note: { en: "macOS-style menu bar with app menus and clickable status.", es: "Barra de menús estilo macOS con menús de apps y estado clicable." } },
  { id: "mos-dock", group: "shells", origin: "hub", accent: "c6", note: { en: "macOS-style bottom dock with editable launchers and magnification.", es: "Dock inferior estilo macOS con lanzadores editables y magnificación." } },
  { id: "w11", group: "shells", origin: "hub", accent: "c2", note: { en: "Windows 11-inspired taskbar with start menu, search and tray.", es: "Barra de tareas inspirada en Windows 11 con inicio, búsqueda y bandeja." } },

  { id: "cryptowidget", group: "widgets", origin: "hub", accent: "c3", note: { en: "BTC and ETH price card with 24-hour change.", es: "Tarjeta de precio BTC y ETH con cambio de 24 horas." } },
  { id: "mos-widgets", group: "widgets", origin: "hub", accent: "c6", note: { en: "macOS-inspired clock, weather, calendar and battery cards.", es: "Tarjetas estilo macOS: reloj, clima, calendario y batería." } },
  { id: "pomodorowidget", group: "widgets", origin: "hub", accent: "c1", note: { en: "Pomodoro remaining-time card driven by the state file.", es: "Tarjeta de tiempo restante del pomodoro desde el archivo de estado." } },
  { id: "samurai-widgets", group: "widgets", origin: "hub", accent: "c1", note: { en: "Monochrome Samurai clock, system, weather and battery cards.", es: "Tarjetas Samurai monocromas de reloj, sistema, clima y batería." } },
  { id: "todowidget", group: "widgets", origin: "hub", accent: "c2", note: { en: "Open todo items from the equisdots todo file.", es: "Tareas abiertas del archivo todo de equisdots." } },
  { id: "worldclock-widget", group: "widgets", origin: "hub", accent: "c5", note: { en: "A second-timezone clock card.", es: "Tarjeta de reloj de una segunda zona horaria." } },

  { id: "batteryplus", group: "modules", origin: "hub", accent: "c2", note: { en: "Battery charge, health and time-to-empty.", es: "Carga, salud y tiempo restante de batería." } },
  { id: "brightnessbar", group: "modules", origin: "hub", accent: "c3", note: { en: "Screen brightness percentage.", es: "Porcentaje de brillo de pantalla." } },
  { id: "capsbar", group: "modules", origin: "hub", accent: "c1", note: { en: "Caps Lock indicator.", es: "Indicador de Bloq Mayús." } },
  { id: "cpufreq", group: "modules", origin: "hub", accent: "c4", note: { en: "Average CPU frequency in MHz.", es: "Frecuencia media de CPU en MHz." } },
  { id: "cryptobar", group: "modules", origin: "hub", accent: "c3", note: { en: "Bitcoin price in USD from CoinGecko.", es: "Precio de Bitcoin en USD desde CoinGecko." } },
  { id: "diskspace", group: "modules", origin: "hub", accent: "c5", note: { en: "Root filesystem usage percentage.", es: "Porcentaje de uso del sistema de archivos raíz." } },
  { id: "diskusage", group: "modules", origin: "hub", accent: "c5", note: { en: "Mountpoint usage with a threshold-coloured bar.", es: "Uso por punto de montaje con barra según umbral." } },
  { id: "dndbar", group: "modules", origin: "hub", accent: "c6", note: { en: "Notification do-not-disturb state.", es: "Estado de no molestar de las notificaciones." } },
  { id: "dockerbar", group: "modules", origin: "hub", accent: "c6", note: { en: "Running Docker containers count.", es: "Número de contenedores Docker en ejecución." } },
  { id: "fanspeed", group: "modules", origin: "hub", accent: "c1", note: { en: "Fan speed from lm_sensors.", es: "Velocidad del ventilador desde lm_sensors." } },
  { id: "ghbar", group: "modules", origin: "hub", accent: "c5", note: { en: "Unread GitHub notifications via the gh CLI.", es: "Notificaciones de GitHub sin leer vía la CLI gh." } },
  { id: "gitbar", group: "modules", origin: "hub", accent: "c4", note: { en: "Git status of the repo under the focused window.", es: "Estado git del repo de la ventana enfocada." } },
  { id: "gitsummary", group: "modules", origin: "hub", accent: "c4", note: { en: "Every git repo under $HOME with branch and dirty count.", es: "Todos los repos git bajo $HOME con rama y cambios." } },
  { id: "gputemp", group: "modules", origin: "hub", accent: "c1", note: { en: "GPU utilisation and temperature via nvidia-smi or sensors.", es: "Uso y temperatura de GPU vía nvidia-smi o sensors." } },
  { id: "kbdlayout", group: "modules", origin: "hub", accent: "c2", note: { en: "Active keyboard layout.", es: "Distribución de teclado activa." } },
  { id: "kernelbar", group: "modules", origin: "hub", accent: "c3", note: { en: "Running kernel release.", es: "Versión del kernel en ejecución." } },
  { id: "loadavg", group: "modules", origin: "hub", accent: "c6", note: { en: "One-minute load average.", es: "Carga media de un minuto." } },
  { id: "mailbar", group: "modules", origin: "hub", accent: "c5", note: { en: "Unread mail in the Maildir via mbsync or notmuch.", es: "Correo sin leer en el Maildir vía mbsync o notmuch." } },
  { id: "membar", group: "modules", origin: "hub", accent: "c2", note: { en: "RAM usage percentage from the shared SysData poller.", es: "Porcentaje de RAM desde el sondeo compartido SysData." } },
  { id: "micbar", group: "modules", origin: "hub", accent: "c1", note: { en: "Microphone mute state.", es: "Estado de silencio del micrófono." } },
  { id: "mprisbar", group: "modules", origin: "hub", accent: "c4", note: { en: "Now-playing artist and title via playerctl.", es: "Artista y título en reproducción vía playerctl." } },
  { id: "nightlight", group: "modules", origin: "hub", accent: "c4", note: { en: "Hyprsunset temperature or off.", es: "Temperatura de Hyprsunset o apagado." } },
  { id: "pkgupdates", group: "modules", origin: "hub", accent: "c3", note: { en: "Pending package updates.", es: "Actualizaciones de paquetes pendientes." } },
  { id: "procsbar", group: "modules", origin: "hub", accent: "c6", note: { en: "Running process count.", es: "Número de procesos en ejecución." } },
  { id: "swapbar", group: "modules", origin: "hub", accent: "c5", note: { en: "Swap usage percentage.", es: "Porcentaje de uso de swap." } },
  { id: "todobar", group: "modules", origin: "hub", accent: "c2", note: { en: "Open items in the quicknotes todo file.", es: "Elementos abiertos del archivo de tareas de quicknotes." } },
  { id: "torrentbar", group: "modules", origin: "hub", accent: "c4", note: { en: "Active torrent downloads via Transmission remote.", es: "Descargas de torrents activas vía Transmission remoto." } },
  { id: "uptimebar", group: "modules", origin: "hub", accent: "c3", note: { en: "System uptime, human readable.", es: "Tiempo de actividad del sistema, legible." } },
  { id: "vpnbar", group: "modules", origin: "hub", accent: "c2", note: { en: "Active VPN or WireGuard interface.", es: "Interfaz VPN o WireGuard activa." } },
  { id: "wallpaper-motion", group: "modules", origin: "hub", accent: "c1", note: { en: "Live frame rate of the animated wallpaper.", es: "Framerate en vivo del fondo animado." } },
  { id: "worldclock", group: "modules", origin: "hub", accent: "c5", note: { en: "Time in a second timezone in the bar.", es: "Hora en una segunda zona horaria en la barra." } },
];

export const PLUGIN_COUNTS = PLUGIN_GROUPS.reduce(
  (accumulator, group) => {
    accumulator[group] = PLUGINS.filter((plugin) => plugin.group === group).length;
    return accumulator;
  },
  {} as Record<PluginGroup, number>,
);
