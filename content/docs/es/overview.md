---
title: Visión general
description: La pila de escritorio equisdots: qué es, qué repositorios incluye y cómo encajan sus partes.
order: 1
section: start
---

equisdots es un escritorio Wayland completo para Arch Linux construido en torno
a Hyprland, el shell Quickshell y el demonio de fondos de pantalla xwww. El mismo
escritorio corre también sobre **niri**, el compositor de scrollable-tiling:
barra, paneles, widgets, editor de ajustes, pantalla de bloqueo y la mascota Nyx
son compartidos, y solo cambia la capa del compositor. Cada pieza es su propio
repositorio, y un único meta instalador, `dots`, los clona, coloca y actualiza en
conjunto (`dotsniri` gestiona el stack de niri). Un estándar de plugins añade
funciones autocontenidas encima: 63 plugins acompañan al stack y los mismos
hosts los descubren, activan y actualizan sin tocar el núcleo.

## Qué proporciona la pila

- Una sesión de Hyprland configurada en Lua o una sesión de niri equivalente
  configurada en KDL: entorno, atajos de teclado, animaciones, reglas de
  ventanas, espacios de trabajo y arranque automático.
- Una interfaz Quickshell: barra, emergentes, paneles, editor de ajustes,
  widgets de escritorio, pantalla de bloqueo y la isla/notch de mascotas Nyx
  con su dock de centro de control.
- Un sistema de plugins: estándar de manifiestos, SDK de ejecución, carpetas de
  descubrimiento, activación en vivo, páginas de ajustes, paneles, módulos de
  barra y barras completas por plugin.
- Un sistema de paletas base16 compartido por el shell, los bordes de ventana,
  las terminales, los editores y los navegadores.
- Un núcleo (kernel) de fondos de pantalla con imágenes fijas, vídeos, rotación
  de presentación de diapositivas y escenas interactivas en JavaScript.
- Motores y herramientas: timex (hora y clima), xturing (interfaz de ajustes
  de terminal), theme-sync (temas entre aplicaciones) y un tema de inicio de
  sesión SDDM estático.

## Repositorios

| Repositorio | Proporciona | Se instala en |
|---|---|---|
| [hyprland](https://github.com/equisdots/hyprland) | Configuración del compositor (Lua), scripts, instalador | `~/.config/hypr` |
| [niri](https://github.com/equisdots/niri) | Configuración del compositor niri (KDL), scripts de sesión, ficheros de sesión/portal | `~/.config/niri` |
| [niri-meta](https://github.com/equisdots/niri-meta) | Meta instalador y actualizador del stack niri | `~/.local/bin/dotsniri` |
| [niri-shell](https://github.com/equisdots/niri-shell) | Overlay que hace neutral al compositor el shell compartido | se fusiona en el shell |
| [nyx-niri](https://github.com/equisdots/nyx-niri) | Overlay que hace neutral al compositor la isla Nyx | se fusiona en el shell |
| [niri-login](https://github.com/equisdots/niri-login) | Entrada de sesión Wayland para que los DM listen "Niri" | `/usr/share/wayland-sessions` |
| [shell](https://github.com/equisdots/shell) | Interfaz Quickshell (barra, paneles, editor, emergentes) | `~/.config/hypr/scripts/quickshell` |
| [nyx](https://github.com/equisdots/nyx) | Plugin de isla/notch de mascotas y dock de centro de control | `.../quickshell/ui/plugins/nyx` |
| [palettes](https://github.com/equisdots/palettes) | Paletas de color (conjunto JSON y esquema) | `~/.config/hypr/scripts/quickshell/dock/palettes` |
| [background](https://github.com/equisdots/background) | Colección curada de fondos y catálogo de escenas | publicado como `background.zip` |
| [davincix](https://github.com/equisdots/davincix) | Núcleo de descarga y aplicación de fondos | `~/.local/bin/davincix` |
| [theme-sync](https://github.com/equisdots/theme-sync) | Regeneración de temas entre aplicaciones | `~/.local/bin/theme-sync` |
| [timex](https://github.com/equisdots/timex) | Plugin de hora y clima: motor, panel de calendario e isla de barra | `.../quickshell/ui/plugins/timex` |
| [xturing](https://github.com/equisdots/xturing) | Interfaz de terminal para el panel de ajustes | `~/.local/bin/xturing` |
| [plugins](https://github.com/equisdots/plugins) | Estándar de plugins, hub de 63 plugins y registro de instalación | `.../quickshell/ui/plugins/<id>` |
| [plugin-api](https://github.com/equisdots/plugin-api) | Esquema del manifiesto, versión de API y evaluadores de compatibilidad | `.../quickshell/plugin-api.json` |
| [plugin-sdk](https://github.com/equisdots/plugin-sdk) | SDK de ejecución: PluginHost, Settings, superficies, Lua mod | `.../quickshell/core/sdk` |
| [transformpath](https://github.com/equisdots/transformpath) | Arquitectura, decisiones y estado de la migración de plugins | solo documentación |
| [login](https://github.com/equisdots/login) | Pantalla de inicio de sesión SDDM mínima y estática | `/usr/share/sddm/themes/x` |
| [dots](https://github.com/equisdots/dots) | Meta instalador y actualizador | `~/.local/bin/dots` |
| [web](https://github.com/equisdots/web) | Sitio de documentación, previews y mapa de repositorios | GitHub Pages |

Los clones gestionados viven en `~/.local/share/equisdots/<repo>` (el stack de
niri usa `~/.local/share/equisdots-niri/<repo>`). `dots` y `dotsniri` copian su
carga útil a su destino; nunca eliminan por su cuenta una configuración activa.

## Cómo se conectan las piezas

```
settings.json (bar.palette, bar, widgets, timex, plugins, ...)
      |
      +--> shell (Colors.qml) ------> bar, widgets, lock screen
      |
      +--> colors.lua (hyprland) ---> window borders
      |
      +--> theme-sync --------------> kitty, starship, nvim, vscode,
      |                               browsers, rofi, cava, qt, gtk, xfetch
      |
      +--> xwww scenes -------------> wallpaper follows the palette

davincix (kernel) --> xwww (stills/scenes) or mpvpaper (videos)
                  --> current_wallpaper.png for lock and SDDM
```

## Dónde vive cada cosa

- Ajustes: `~/.config/hypr/settings.json` (única fuente de verdad).
- Estado y cachés del shell: `~/.cache/quickshell`, `~/.local/state/quickshell`.
- Fondos de pantalla: `~/.config/hypr/wallpapers` por defecto.
- Archivos de paleta: `~/.config/hypr/scripts/quickshell/dock/palettes`.
- Plugins: gestionados en `~/.config/hypr/plugins`, de usuario en
  `~/.config/hypr/plugins-user`; UI bajo `.../quickshell/ui/plugins`.
- Wrappers: `dots`, `dotsniri`, `davincix`, `theme-sync`, `timex`, `xturing` en
  `~/.local/bin`.

## Requisitos

Una derivada de Arch Linux, Hyprland 0.55 o posterior (la configuración es Lua)
**o** niri 26.04 o posterior, `git`, `rsync`, `jq`, `quickshell` (`qs`),
`xwww-daemon`, `mpvpaper` y la Hack Nerd Font. `dots doctor` (y `dotsniri
doctor` para el stack niri) informa exactamente de lo que falta. Consulte
[Instalación](/es/docs/installation) para la lista completa.

## Mapa de la documentación

- [Instalación](/es/docs/installation) - primera configuración y requisitos.
- [Actualización y diagnóstico](/es/docs/updating) - `dots update` y `dots doctor`.
- [Escritorio Hyprland](/es/docs/desktop) - módulos de configuración, atajos de
  teclado, monitores.
- [Compositor niri](/es/docs/niri) - el frontend de compositor alternativo.
- [Shell Quickshell](/es/docs/shell) - barra, paneles, widgets e IPC.
- [Isla de mascotas Nyx](/es/docs/nyx) - especies, isla/notch y el dock.
- [Plugins y extensiones](/es/docs/plugins) - el estándar, el hub de 63 plugins y la CLI.
- [Temas y paletas](/es/docs/theming) - paletas base16 y theme-sync.
- [Fondos de pantalla](/es/docs/wallpapers) - davincix, xwww y el selector.
- [Escenas interactivas](/es/docs/scenes) - creación y ejecución de fondos JS.
- [Herramientas: timex, xturing, login](/es/docs/tools) - las herramientas
  auxiliares.
- [Arquitectura y repositorios](/es/docs/architecture) - contratos y flujo de
  datos.
- [Contribución y seguridad](/es/docs/contributing) - comprobaciones y
  notificación.

## Siguientes pasos

Ejecute el instalador desde [Instalación](/es/docs/installation), verifíquelo con
`dots doctor` y después cierre la sesión y elija Hyprland (o Niri) en la pantalla
de inicio de sesión.
