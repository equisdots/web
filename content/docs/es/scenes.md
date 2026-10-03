---
title: Escenas interactivas
description: Cree, ejecute y depure escenas JavaScript de xwww que reaccionan a la paleta activa.
order: 8
section: wallpapers
---

Una escena interactiva es un directorio con un archivo JavaScript (`scene.js`)
que dibuja un fondo de pantalla de forma procedural sobre un canvas. Las
escenas las renderiza el motor de escenas de xwww (QuickJS más tiny-skia) y las
muestra `xwww-daemon` a través de la misma capa de fondo que se usa para las
imágenes. Reaccionan a la paleta y al reloj, pero nunca reciben entrada: el
fondo de pantalla sigue siendo transparente a los clics.

## Cómo funciona

```
scene.js -> xwww scene run -> rendered frame -> xwww-daemon -> layer surface
                 |
                 +-- palette provider (1 s polling)
```

1. Al iniciar, `xwww scene run` crea un motor por salida y renderiza el primer
   fotograma con la transición de entrada solicitada.
2. Los fotogramas posteriores son instantáneos y solo se envían cuando el
   canvas ha cambiado realmente, por lo que una escena inactiva apenas consume
   CPU.
3. El proveedor de paleta vuelve a leer su origen como máximo una vez por
   segundo; un cambio desencadena un fundido cruzado (`--palette-fade`, 800 ms
   por defecto).

Requiere `xwww` 0.13.1+ compilado con la característica `scene` (las versiones
publicadas la incluyen), un compositor con `wlr-layer-shell` y solo
rasterización por CPU.

## Integración con davincix

`davincix` detecta cualquier directorio con `scene.js` y lo aplica como
cualquier otro fondo de pantalla:

```sh
davincix set ~/.config/hypr/wallpapers/astro-palette
davincix set ~/.config/hypr/wallpapers/astro-palette --transition decrypt
DAVINCIX_SCENE_FPS=30 davincix set ~/.config/hypr/wallpapers/matrix-rain
```

- Las escenas siguen `settings.json -> bar.palette` en aproximadamente un
  segundo.
- La tasa de fotogramas es de 15 fps por defecto; anúlela con
  `DAVINCIX_SCENE_FPS`.
- `current_scene` almacena el directorio activo e `init.sh` lo vuelve a aplicar
  al iniciar la sesión; aplicar una imagen o un vídeo detiene la escena.
- El selector muestra las escenas con una insignia `JS` y la portada
  `base.jpg`.

## Ejecutar una escena directamente

El motor puede usarse sin el núcleo, lo que es la forma más rápida de iterar:

```sh
xwww scene check  scene.js                                   # compile only
xwww scene render scene.js -o preview.png --size 1920x1080   # one frame
xwww scene run    scene.js --fps 15 --palette equisdots      # live
```

| Opción | Valor predeterminado | Significado |
|---|---|---|
| `--fps` | `10` | Fotogramas renderizados y enviados por segundo. |
| `--size` | `2560x1440` | Tamaño del canvas para `render`. |
| `--palette` | archivo xwww, luego equisdots | `xwww[:path]`, `equisdots[:slug]`, `file:<path>`, `command:<cmd>`. |
| `--timeout-ms` | `100` | Presupuesto de JavaScript por fotograma (davincix usa 2000). |
| `--asset <path>` | directorio de la escena | Directorio adicional cuyas imágenes puede cargar la escena. Repetible. |
| `--palette-fade` | `800` | Fundido cruzado en milisegundos al cambiar la paleta (`0` lo desactiva). |
| `--transition-type` | `none` | Transición de entrada para el primer fotograma. |

## Ciclo de vida de una escena

Una escena es un único archivo JavaScript plano con dos funciones opcionales de
nivel superior:

```js
function setup(ctx) { /* once before the first frame */ }

function render(t, ctx) {
  // Once per frame; t is seconds since the scene started.
  // Must be synchronous and finish inside the frame budget.
}
```

Las variables a nivel de módulo persisten entre fotogramas y son el lugar para
el estado de la escena. `ctx` es de solo lectura y se reconstruye en cada
fotograma:

```js
{
  width, height,   // output size in physical pixels
  frame,           // monotonically increasing frame counter
  now,             // wall clock in milliseconds since the Unix epoch
  palette: {
    slug: "x", name: "X",
    background: { hex: "#050505", r: 5, g: 5, b: 5 },
    foreground: { hex: "#f7f1ff", r: 247, g: 241, b: 255 },
    colors: [ /* base16 color0..color15 as { hex, r, g, b } */ ],
    roles: { workspaceActive: { hex: "#eab308", r: 234, g: 179, b: 8 } }
  },
  events: []       // reserved; event providers are not implemented
}
```

Un fotograma que lanza una excepción o supera el tiempo de espera se descarta y
el fotograma anterior permanece en pantalla, de modo que los errores nunca
dejan el fondo en blanco.

## API de canvas

Todas las llamadas son métodos del objeto global `canvas`. Los colores aceptan
`#rgb`, `#rrggbb`, `#rrggbbaa` o arrays `[r, g, b]`.

| Llamada | Notas |
|---|---|
| `canvas.clear(color)` | Sobrescribe la superficie, sin mezcla. |
| `canvas.fill` / `no_fill`, `canvas.stroke` / `no_stroke` | Pinturas de relleno y trazo. |
| `canvas.alpha(value)` | Multiplicador de opacidad para pinturas posteriores. |
| `canvas.rect`, `canvas.circle`, `canvas.round_rect` | Formas. |
| `canvas.begin_path`, `move_to`, `line_to`, `quad_to`, `cubic_to`, `close_path`, `fill_path`, `stroke_path` | Construcción y dibujo de trazados. |
| `canvas.linear_gradient`, `canvas.radial_gradient` | Gradientes con paradas equidistantes. |
| `canvas.image(path, x, y, w, h)` | Activo local escalado a un cuadro. |
| `canvas.image_tinted(path, ...)` | Activo pintado con un color plano, conservando el alfa. |
| `canvas.remap(x, y, w, h, colors, strength)` | Recoloreado de región de luminancia a gradiente. |
| `canvas.push` / `pop`, `translate`, `rotate`, `scale` | Pila de transformaciones. |
| `canvas.text(str, x, y, size, color, { family, anchor, bold })` | Texto con fuente del sistema. |
| `log(...values)` | Escribe en stderr con el prefijo `[scene]`. |

## Permitido y no permitido

- Sin temporizadores (`setTimeout`, `requestAnimationFrame`): calcule el
  movimiento a partir de `t` y `ctx.frame`.
- Sin API de canvas del navegador ni DOM: use los métodos `canvas` anteriores.
- Sin `import`/`require`, red ni acceso al sistema de archivos; solo activos
  locales en el directorio de la escena (o `--asset`).
- Sin WebGL ni shaders; use dibujo 2D por CPU o un fondo de vídeo.
- Sin eventos de puntero ni de desplazamiento: reaccione a la paleta y al
  reloj.

## Rendimiento

- El motor ya omite fotogramas idénticos; termine antes cuando nada haya
  cambiado y la escena no costará nada entre actualizaciones.
- De 10 a 15 fps es el punto óptimo. La canalización de fotograma completo se
  satura mucho antes que la tasa de refresco de la pantalla (aproximadamente
  30-35 fps a 1080p).
- El texto se cachea por glifo, familia y color, pero mantenga bajos los
  dibujos únicos.
- Prefiera `canvas.remap` y los activos de imagen al trabajo por píxel.

## Depuración

- La salida de `log(...)` va a
  `$XDG_RUNTIME_DIR/quickshell/logs/xwww_debug.log` cuando se ejecuta bajo
  davincix.
- `xwww scene check scene.js` informa de errores de sintaxis;
  `xwww scene render scene.js -o out.png --size 1920x1080` es más rápido para
  iterar.
- Errores comunes: `invalid color` (color no válido: use hexadecimales o arrays
  RGB), `asset outside the allowed directories` (activo fuera de los
  directorios permitidos: use un activo local o `--asset`), `exceeded the frame
  budget` (se superó el presupuesto del fotograma: mueva el trabajo a `setup`).
- Edite la copia bajo el directorio de fondos de pantalla: es la que ejecuta
  davincix.

## Siguientes pasos

- [Fondos de pantalla](/es/docs/wallpapers) para el núcleo y el selector.
- [Temas y paletas](/es/docs/theming) para los archivos de paleta que leen las
  escenas.
