---
title: Temas y paletas
description: El sistema de paletas base16, la edición de paletas en vivo, los bordes de ventana y la propagación de temas entre aplicaciones con theme-sync.
order: 7
section: desktop
---

Los colores de equisdots provienen de paletas JSON planas que consumen el
shell, los bordes de ventana del compositor (Hyprland o [niri](/es/docs/niri)),
las escenas de fondos de pantalla y todas las aplicaciones que gestiona
theme-sync. No hay extracción de color por fondo de pantalla: la paleta que elija
es la que usan todos los componentes hasta que la cambie.

## Contrato de paleta

Una paleta es un archivo JSON con colores base16 más anulaciones opcionales de
fondo, primer plano y roles semánticos. El esquema se publica en
[equisdots/palettes](https://github.com/equisdots/palettes) (`schema.json`).

```json
{
  "name": "X",
  "slug": "x",
  "author": "xscriptor",
  "base16": {
    "color0": "#0a0a0a",
    "color1": "#fc618d",
    "color7": "#f7f1ff",
    "color15": "#f7f1ff"
  },
  "background": "#0a0a0a",
  "foreground": "#f7f1ff",
  "roles": { "workspaceActive": "#eab308" }
}
```

- `name`, `slug` y los 16 colores `base16` son obligatorios; cada color es
  `#rrggbb`.
- `slug` coincide con `^[a-z0-9][a-z0-9-]*$` y es el nombre del archivo, el
  identificador del tema y el valor almacenado en los ajustes.
- `background` y `foreground` recurren a `color0` y `color7`.
- `roles` anula los roles semánticos sobre la derivación base16.

El diseño del repositorio:

| Ruta | Contenido |
|---|---|
| `*.json` | Una paleta por slug (`x.json`, `tokio.json`, ...) |
| `community/` | Portes base16 de temas de terminal conocidos, con atribución |
| `index.json` | Lista ordenada con nombre visible y colores de vista previa; alimenta el panel |
| `schema.json` | Contrato v1 |

Valide una copia de trabajo con:

```sh
scripts/check.sh
python3 tools/validate_palettes.py
```

## Dónde viven las paletas

`dots install` despliega el conjunto plano, la carpeta `community/` e
`index.json` en la ruta compartida congelada:

```
~/.config/hypr/scripts/quickshell/dock/palettes/
```

Esta ruta la leen el shell (`ui/bar/Colors.qml`, `core/Theme.qml`),
`theme-sync`, `colors.lua` de Hyprland y el proveedor de escenas de xwww. El
slug de la paleta activa vive en `settings.json` bajo `bar.palette`; la forma
heredada `dock.palette` se migra una vez y `x` es el último recurso, por lo que
siempre debe existir.

El conjunto `community/` se convierte desde las definiciones de esquemas
base16 recopiladas por [tinted-theming](https://github.com/tinted-theming)
(`base16-schemes` y `schemes`, MIT); cada archivo conserva el nombre original
del esquema y la atribución de su autor, y las ranuras base16 se mapean a la
disposición `color0`-`color15` de equisdots. Se incluyen solo como referencias
de color, sin afiliación con los proyectos originales.

La interfaz agrupa las paletas en tres secciones: X (12 integradas),
Personalizadas (portes de la comunidad) y Usuario (paletas que usted cree).

## Elegir y editar paletas

Abra el panel de ajustes (`SUPER + SHIFT + D`) y vaya a la tarjeta Paleta, o
use el widget de paleta independiente (`SUPER + SHIFT + P`). Seleccionar una
paleta escribe `bar.palette` y el cambio se propaga en vivo.

La paleta activa puede recolorearse in situ:

1. Tarjeta Paleta, **Editar colores**: 18 ranuras editables (`color0` a
   `color15`, más `background` y `foreground`).
2. Al confirmar un hexadecimal se reescribe `dock/palettes/<slug>.json` de
   forma atómica con `jq` sobre un archivo temporal y `mv`, conservando las
   claves desconocidas.
3. La primera edición de una sesión guarda una instantánea prístina en
   `~/.local/state/quickshell/palette_backup/<slug>.json`; **Restablecer** la
   recupera.
4. Crear una paleta escribe su archivo JSON y una entrada en `index.json`;
   eliminarla borra ambos más la instantánea. La paleta integrada `x` está
   protegida.

La propagación es inmediata: las islas de la barra, el cromo del editor, las
caras de los widgets de escritorio, los bordes de ventana y los destinos de
theme-sync vuelven a leer el archivo de paleta.

## theme-sync

[equisdots/theme-sync](https://github.com/equisdots/theme-sync) es el motor
entre aplicaciones. Lee la paleta activa y regenera la configuración de las
aplicaciones; un destino por aplicación, y un destino que falla nunca aborta el
resto.

```sh
theme-sync --list                  # targets and availability
theme-sync --dry-run               # show what would change, write nothing
theme-sync --targets kitty,xfetch  # only these applications
theme-sync --palettes DIR --settings FILE
```

| Destino | Qué escribe |
|---|---|
| `kitty` | Tema por paleta más include y borde activo en `kitty.conf`. |
| `starship` | Temas por paleta y `STARSHIP_CONFIG` en los archivos rc del shell. |
| `xtop` | Temas por paleta y el tema activo. |
| `vscode` | Tema de color e iconos, o tinte en vivo generado para paletas no listadas. |
| `nvim` | `lua/themes/palettes.lua` más el arranque del tema activo. |
| `browsers` | Preferencias de Brave/Beta y `user.js` de Firefox. |
| `opencode` | Temas por paleta más el tema activo. |
| `rofi` | `colors.rasi` y `config.rasi`. |
| `cava` | Un bloque `[color]` gestionado con un gradiente de la paleta. |
| `qt` | Esquemas de color de qt6ct/qt5ct y configuración activa. |
| `gtk` | Anulaciones CSS de GTK3/4 y el esquema de color del sistema. |
| `xfetch` | Temas hexadecimales por paleta y el tema activo. |

Los bloques gestionados se marcan con `equisdots theme-sync`, por lo que
regenerar es idempotente. Añadir un destino es un módulo en
`themesync/targets/` con `NAME`, `DESCRIPTION`, `available(env)` y `apply(env)`,
más una línea en el registro.

## Bordes de ventana

Los bordes de ventana siguen la paleta por defecto:

- `bar.borderFollowPalette: true` usa el acento de la paleta (`color1`) para el
  borde activo y un tono apagado (`color8`) para los inactivos.
- Establecerlo en `false` usa los valores hexadecimales manuales
  `bar.borderActive` y `bar.borderInactive`.

`config/hypr/colors.lua` deriva los valores predeterminados en tiempo de carga
del JSON de la paleta activa y exporta `X.active_border`, `X.inactive_border` y
los colores en sí. El shell envía las actualizaciones en vivo mediante el
adaptador del compositor (`core/Compositor.qml`), así que el mecanismo difiere
por compositor:

```sh
# Hyprland: config en vivo mediante hyprctl
hyprctl eval 'hl.config({ general = { col = { active_border = "rgb(eab308)" } } })'

# niri: escribe generated/borders.kdl y recarga (sin hyprctl eval)
```

Bajo niri el borde parte de un gris neutro (el `color8` apagado de la paleta,
no el acento llamativo) y el focus-ring se desactiva para que toda ventana
conserve un borde, igual que en Hyprland. Ver
[Compositor niri](/es/docs/niri).

## Roles semánticos

`roles` permite que una paleta anule ranuras con nombre derivadas de base16.
Las asignaciones integradas actuales de `workspaceActive` (el relleno del
espacio de trabajo activo en la barra, con `mauve` como reserva) incluyen el
oro `#eab308` de `x`, el `#666666` de `berlin` y el `#8a6408` de `madrid`.
Edite el rol directamente en el archivo de paleta; se recarga en caliente
mediante los vigilantes.

## Páginas relacionadas

- [Shell Quickshell](/es/docs/shell) para el editor que controla las paletas.
- [Escenas interactivas](/es/docs/scenes) para fondos de pantalla reactivos a la
  paleta.
- [Fondos de pantalla](/es/docs/wallpapers) para la pila de fondos.
