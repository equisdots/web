---
title: Sistema de diseño
description: El lenguaje visual de equisdots: roles de paleta, cristal, marco, sombras, LiquidGlass, movimiento y controles de efectos según el compositor.
order: 7
section: desktop
---

La interfaz de equisdots la dibuja el shell, no el compositor. Esa es la única
decisión detrás de todo el sistema de diseño: la misma barra, paneles, popups,
widgets y superficies de plugins se renderizan en Hyprland y en
[niri](/es/docs/niri), y cambiar la paleta lo recolorea todo sin recargar. Esta
página reúne las reglas, los tokens y las primitivas de superficie que comparten
el shell y el SDK de plugins.

## Principios

- **El contenido primero.** Bordes de un píxel, espaciado generoso y redondeo
  contenido. El color marca estado e identidad, no decoración.
- **Un único conjunto de tokens.** El shell nunca fija un color: todo se
  resuelve a través de la paleta activa y sus roles semánticos.
- **El host dibuja el cromo.** Ninguno de los dos compositores decora las
  superficies layer-shell, así que el cristal, el marco y las sombras se dibujan
  en QML y siguen la caja animada.
- **El movimiento explica, nunca retrasa.** Las transiciones son cortas,
  interrumpibles y se desactivan con `prefers-reduced-motion` / el ajuste de
  movimiento reducido del shell.
- **Los plugins comparten el kit.** Una superficie de terceros importa las
  mismas primitivas (`LiquidGlass`, kit de widgets, tokens de tema) en lugar de
  copiar el núcleo.

## Tokens

Una paleta es base16 más `background`, `foreground` y `roles` opcionales. El
shell deriva el resto:

| Token | Significado | Uso típico |
|---|---|---|
| `base` | Fondo de la paleta | Cuerpo de ventanas y paneles |
| `surface0` / `surface1` / `surface2` | Pasos sutiles de elevación | Tarjetas, islas, estados hover |
| `text` / `subtext` | Primer plano y texto secundario | Etiquetas y metadatos |
| `crust` | El paso más oscuro | Detrás de diálogos y docks |
| `red`, `yellow`, `green`, `blue`, `mauve` | Acentos semánticos | Alertas, avisos, éxito, enlaces, resaltes |
| `workspaceActive` | Override de rol | Marcador del espacio activo |
| `glassOn` | Estado de translucidez | Activa la composición de cristal |

La colección de paletas es la fuente de verdad
([equisdots/palettes](https://github.com/equisdots/palettes)): 155 entradas en el
momento de escribir esto, divididas en X (30 integradas) y Custom (125 ports de
la comunidad). El slug activo vive en `settings.json` bajo `bar.palette`; la
paleta `x` es el respaldo garantizado.

## Cristal

`settings.json -> glass` vuelve translúcidos los fondos del shell para que se
vea el blur del compositor:

```json
{ "glass": { "enabled": true, "opacity": 0.72 } }
```

El mecanismo cambia según el compositor:

- **Hyprland**: el shell activa una layer rule para la barra y los popups, así
  el blur del compositor muestrea el fondo detrás de ellos.
- **niri**: solo se difuminan las superficies que piden
  `ext-background-effect`; no hay blur forzado de capas y el shell degrada con
  elegancia.

El cristal se aplica de forma consistente a la barra, popups, menús y cuerpos de
paneles. Una paleta opaca o un perfil de bajo consumo pueden desactivarlo sin
tocar el diseño.

## Marco de pantalla

El marco es un bisel que abraza los cuatro bordes de la pantalla, dibujado en la
capa Bottom. Reserva espacio para que las ventanas en mosaico nunca lo crucen y
se adapta a la barra, a los hosts de plugins y a los widgets anclados a los
bordes con esquinas redondeadas:

- `ui/frame/Frame.qml`, `core/FrameGeometry.js` y `core/FrameBus.qml`;
- los hosts de plugins publican rectángulos `frameObstacle` y el marco se adapta
  en vivo;
- `settings.json -> frame` controla grosor, radio, inset y comportamiento de
  reserva, todo en vivo desde **Tema -> Frame**.

El marco es la firma de equisdots: hace que un escritorio de otro modo de borde
a borde se vea deliberadamente contenido sin cambiar las reglas de ventanas.

## Sombras

Ninguno de los compositores decora las superficies layer-shell, así que las
sombras las dibuja el host:

- `settings.json -> shadows` guarda `enabled`, `blur`, `spread`, `offsetX`,
  `offsetY`, `opacity` y `radius`;
- la sombra sigue la caja animada del popup (posición, tamaño, morph y fade);
- la barra dibuja sus propias sombras de isla y tira desde la misma config;
- todo se edita en vivo desde **Tema -> Sombras**.

## LiquidGlass y el kit de plugins

Los paneles y las superficies de plugins comparten un kit de cristal con brillos
tintados por la paleta y una sensación de refracción consistente. Los plugins lo
importan a través del SDK en lugar de reimplementar blur, gradientes de borde o
estados hover. El kit es la razón por la que las barras Samurai, MOS y W11 pueden
tener personalidades distintas y aun así parecer nativas del mismo escritorio.

Plugins con lenguaje propio:

- **Samurai** — monocromo, plano, tipográfico; barra, dock y widgets.
- **MOS** — barra de menús estilo macOS, dock con magnificación y widgets.
- **W11** — barra de tareas inspirada en Windows 11 con inicio, búsqueda y
  bandeja.
- **Nyx** — isla de mascotas y notch con su propia morfología y centro de
  control.

## Movimiento y controles de efectos

El kernel de efectos de Hyprland 0.57 se expone en el editor de la barra y en
xturing:

- `decoration:blur:variant` con los 11 nombres, más blur `proportional`;
- `decoration:wobble` con activación e intensidad;
- rangos limitados desde `core/EffectRanges.js` (rounding y sombra `0..100`,
  render power `1..4`, wobble `0..2`);
- sondeo según versión: los valores solo se leen o escriben en 0.57, y el Lua
  generado los omite en 0.56 y anteriores.

Las animaciones usan curvas bezier y spring para abrir/cerrar ventanas,
movimiento de espacios, morph de la barra y entrada de popups. Toda animación es
corta e interrumpible, y la ruta de movimiento reducido es un ajuste de primera
clase, no un respaldo.

## Diseñar con el sistema

Cuando construyas una superficie nueva:

1. Lee los colores de la paleta activa; nunca fijes valores hex.
2. Usa el kit para cristal, sombras, píldoras y estados hover.
3. Prefiere un borde de un píxel y un rol de acento en lugar de varios rellenos.
4. Mantén el movimiento corto y haz que el estado estático sea el estado
   completo.
5. Prueba en ambos compositores y con una paleta oscura y otra clara.

El sitio de documentación sigue el mismo lenguaje: la paleta X en modo oscuro,
Catppuccin Latte en modo claro, metadatos monoespaciados, reglas de un píxel y
un único color de acento. Las superficies 3D interactivas de la portada están
hechas con Three.js y leen los mismos tokens CSS, así que se recolorean con el
tema.

## Páginas relacionadas

- [Temas y paletas](/es/docs/theming) para el contrato de paletas y theme-sync.
- [Shell Quickshell](/es/docs/shell) para las superficies que implementan este
  sistema.
- [Plugins y extensiones](/es/docs/plugins) para barras completas y packs de
  widgets.
- [Compositor niri](/es/docs/niri) para los respaldos específicos del
  compositor.
