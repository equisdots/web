---
title: Visión general
description: La pila de escritorio equisdots: qué es, qué repositorios incluye y cómo encajan sus partes.
order: 1
section: start
---

equisdots es un escritorio Wayland completo para Arch Linux construido en torno
a Hyprland, el shell Quickshell y el demonio de fondos de pantalla xwww. Cada
pieza es su propio repositorio, y un único meta instalador, `dots`, los clona,
coloca y actualiza en conjunto.

## Qué proporciona la pila

- Una sesión de Hyprland configurada en Lua: entorno, atajos de teclado,
  animaciones, reglas de ventanas, espacios de trabajo y arranque automático.
- Una interfaz Quickshell: barra, emergentes, paneles, editor de ajustes,
  widgets de escritorio, pantalla de bloqueo y la isla/notch de mascotas Nyx
  con su dock de centro de control.
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
| [shell](https://github.com/equisdots/shell) | Interfaz Quickshell (barra, paneles, editor, emergentes) | `~/.config/hypr/scripts/quickshell` |
| [nyx](https://github.com/equisdots/nyx) | Isla/notch de mascotas y dock de centro de control | `.../quickshell/ui/nyx` |
| [palettes](https://github.com/equisdots/palettes) | Paletas de color (conjunto JSON y esquema) | `~/.config/hypr/scripts/quickshell/dock/palettes` |
| [background](https://github.com/equisdots/background) | Colección curada de fondos y catálogo de escenas | publicado como `background.zip` |
| [davincix](https://github.com/equisdots/davincix) | Núcleo de descarga y aplicación de fondos | `~/.local/bin/davincix` |
| [theme-sync](https://github.com/equisdots/theme-sync) | Regeneración de temas entre aplicaciones | `~/.local/bin/theme-sync` |
| [timex](https://github.com/equisdots/timex) | Motor de hora y clima más interfaz de calendario | `~/.local/bin/timex`, `.../quickshell/ui/timex` |
| [xturing](https://github.com/equisdots/xturing) | Interfaz de terminal para el panel de ajustes | `~/.local/bin/xturing` |
| [login](https://github.com/equisdots/login) | Pantalla de inicio de sesión SDDM mínima y estática | `/usr/share/sddm/themes/x` |
| [dots](https://github.com/equisdots/dots) | Meta instalador y actualizador | `~/.local/bin/dots` |

Los clones gestionados viven en `~/.local/share/equisdots/<repo>`. `dots` copia
su carga útil a su destino; nunca elimina por su cuenta una configuración
activa.

## Cómo se conectan las piezas

```
settings.json (bar.palette, bar, classicbar, widgets, ...)
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
- Wrappers: `dots`, `davincix`, `theme-sync`, `timex`, `xturing` en
  `~/.local/bin`.

## Requisitos

Una derivada de Arch Linux, Hyprland 0.55 o posterior (la configuración es
Lua), `git`, `rsync`, `jq`, `quickshell` (`qs`), `xwww-daemon`, `mpvpaper` y la
Hack Nerd Font. `dots doctor` informa exactamente de lo que falta. Consulte
[Instalación](/es/docs/installation) para la lista completa.

## Mapa de la documentación

- [Instalación](/es/docs/installation) - primera configuración y requisitos.
- [Actualización y diagnóstico](/es/docs/updating) - `dots update` y `dots doctor`.
- [Escritorio Hyprland](/es/docs/desktop) - módulos de configuración, atajos de
  teclado, monitores.
- [Shell Quickshell](/es/docs/shell) - barra, paneles, widgets e IPC.
- [Isla de mascotas Nyx](/es/docs/nyx) - especies, isla/notch y el dock.
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
`dots doctor` y después cierre la sesión y elija Hyprland en la pantalla de
inicio de sesión.
