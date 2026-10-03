---
title: Arquitectura y repositorios
description: Cómo encajan los repositorios de equisdots, los contratos compartidos en los que se apoyan y las decisiones que hay detrás.
order: 10
section: more
---

equisdots es un conjunto de repositorios pequeños con un propietario claro
cada uno, unidos por dos contratos compartidos: `settings.json` para la
configuración y los archivos de paleta para el color. Esta página traza un mapa
de los repositorios, el flujo de datos y los invariantes en los que se apoyan
las piezas.

## Repositorios y rutas de instalación

| Repositorio | Rol | Ubicación de la carga útil |
|---|---|---|
| [dots](https://github.com/equisdots/dots) | Meta instalador, actualizador, diagnóstico | `~/.local/bin/dots` |
| [hyprland](https://github.com/equisdots/hyprland) | Configuración y scripts del compositor | `~/.config/hypr` |
| [shell](https://github.com/equisdots/shell) | Interfaz Quickshell | `~/.config/hypr/scripts/quickshell` |
| [palettes](https://github.com/equisdots/palettes) | Datos de paletas y esquema | `.../quickshell/dock/palettes` |
| [theme-sync](https://github.com/equisdots/theme-sync) | Motor de temas entre aplicaciones | `~/.local/bin/theme-sync` |
| [davincix](https://github.com/equisdots/davincix) | Núcleo de fondos de pantalla | `~/.local/bin/davincix` |
| [timex](https://github.com/equisdots/timex) | Motor de clima/hora e interfaz | `~/.local/bin/timex`, `.../quickshell/ui/timex` |
| [xturing](https://github.com/equisdots/xturing) | Interfaz de ajustes de terminal | `~/.local/bin/xturing` |
| [login](https://github.com/equisdots/login) | Pantalla de inicio de sesión SDDM | `/usr/share/sddm/themes/x` |

Los clones gestionados viven en `~/.local/share/equisdots/<repo>`. Los
wrappers de `~/.local/bin` ejecutan los motores clonados, por lo que
`dots update` cambia el comportamiento sin tocar el wrapper.

## Flujo de configuración

```
settings.json  (single source of truth: bar, classicbar, widgets, timex, ...)
   |  read/write atomically (tmp + mv), watched by the shell
   |
   +--> shell Config.qml -----------> live UI updates
   +--> xturing --------------------- terminal edits
   +--> hyprland colors.lua ---------> border defaults at load
   +--> theme-sync ------------------> active palette for every target
   +--> timex -----------------------> provider, city, unit
   +--> davincix --------------------> slideshow and wallpaper options
```

Las escrituras son atómicas para que los vigilantes de archivos sigan
funcionando: `dots` combina `settings.json` como valores predeterminados
distribuidos más los valores del usuario, xturing conserva las claves
desconocidas y el editor del shell aplica antirrebote a sus propias escrituras.

## Flujo de paletas

```
palettes repo --> dock/palettes/{*.json, community/, index.json, schema.json}
                        |
      settings.json bar.palette selects the slug (fallback: x)
                        |
   +--------------------+--------------------+
   |                    |                    |
shell Colors.qml   theme-sync targets   Hyprland colors.lua
   |                    |                    |
bar, widgets,      kitty, starship,      window borders
lock screen        nvim, vscode, gtk,    (live via hyprctl eval)
                   qt, browsers, ...
                        |
                   xwww scenes (--palette equisdots)
```

Los consumidores nunca codifican colores; una escena que lee el mismo archivo
de paleta concuerda con el resto del escritorio por construcción. Consulte
[Temas y paletas](/es/docs/theming).

## Flujo de fondos de pantalla

```
davincix (kernel CLI)
   +--> xwww img ......... still images
   +--> xwww scene run ... interactive scenes (JS, palette-driven)
   +--> mpvpaper ......... video wallpapers
   +--> current_wallpaper.png ... lock screen, SDDM
   +--> current_scene, thumbs, slideshow state ... cache/state/run dirs
```

El selector de Quickshell es un frontend fino sobre la misma CLI. El shell, la
pantalla de bloqueo e `init.sh` solo consumen los archivos del contrato.

## Arranque de la sesión

`autostart.lua` inicia `xwww-daemon` e `init.sh`; `init.sh` vuelve a aplicar la
escena registrada en `current_scene` cuando existe; en caso contrario, se
restaura el fondo de pantalla anterior. `restore-monitors.sh` vuelve a aplicar
el diseño guardado de monitores y lo reconcilia cada dos segundos. El shell y
sus vigilantes de datos se ejecutan después durante toda la sesión.

## Invariantes de actualización

- Los clones gestionados son de solo lectura: `dots` descarga `origin/main` y
  restablece por la fuerza.
- Un clon con cambios sin confirmar nunca se despliega, por lo que una copia
  obsoleta no puede degradar archivos activos.
- `xwww` está fijado a una versión; `dots update`/`dots system` reinstalan
  cuando el binario en ejecución difiere, y `dots doctor` informa de las
  discrepancias.
- `settings.json` nunca se regenera desde cero; siempre son valores
  predeterminados más anulaciones del usuario.

Consulte [Actualización y diagnóstico](/es/docs/updating) para los detalles de los
comandos.

## Decisiones de diseño

- **Configuración Lua de Hyprland (0.55+)**: archivos modulares con `require()`
  y anulaciones en tiempo de ejecución; los cambios en vivo pasan por
  `hyprctl eval`, nunca reescribiendo archivos cargados a mitad de sesión.
- **Sin Matugen**: las paletas son datos JSON fijos, así que los colores son
  predecibles y compartidos entre compositor, shell y aplicaciones.
- **Tema SDDM estático**: sin sudo en tiempo de ejecución y sin sincronización
  de paleta en la pantalla de inicio de sesión, lo que evita fallos de PAM.
- **Las escenas se renderizan en el cliente xwww**: el demonio sigue siendo un
  simple consumidor de fotogramas y el sandbox mantiene el código de las
  escenas solo en CPU, sin E/S ni entrada.
- **Sin CI**: cada repositorio incluye un script de comprobación local, que se
  ejecuta antes de hacer push.

## Comprobaciones de desarrollo

| Repositorio | Comando | Comprueba |
|---|---|---|
| shell | `scripts/check.sh` | `qmllint` sobre QML, `node --check` sobre JS |
| hyprland | `scripts/check.sh` | `luac -p` sobre Lua, `bash -n` sobre scripts |
| palettes | `scripts/check.sh` | Consistencia del esquema y de `index.json` |
| theme-sync | `scripts/check.sh` | `compileall` más una prueba de humo de la CLI |
| xturing | `scripts/check.sh` | `cargo fmt`, clippy y pruebas |

## Dependencias externas

La pila también instala desde fuera de la organización:
[xscriptor-colors/terminal](https://github.com/xscriptor-colors/terminal)
(kitty y starship),
[xscriptor-colors/nvim](https://github.com/xscriptor-colors/nvim),
[xscriptor-colors/vscode](https://github.com/xscriptor-colors/vscode) y
[x-ports/xwww](https://github.com/x-ports/xwww) (el demonio de fondos de
pantalla y el motor de escenas).

## Páginas relacionadas

- [Contribución y seguridad](/es/docs/contributing) para comprobaciones y
  notificación.
- [Actualización y diagnóstico](/es/docs/updating) para el flujo de actualización.
