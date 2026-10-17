---
title: Plugins y extensiones
description: El estándar de plugins de equisdots, el hub de 63 plugins, el descubrimiento por carpetas, la activación, los puntos de extensión y la CLI.
order: 7
section: desktop
---

equisdots se construye con repositorios pequeños, y el sistema de plugins es la
forma de añadir funciones al escritorio sin editar los hosts. Un plugin es una
función autocontenida declarada por un manifiesto `plugin.json`: puede traer una
página de ajustes, un módulo de barra, un panel, una barra completa, atajos,
scripts, un adaptador de host o caras de widgets de escritorio.

El estándar lo implementan cuatro repositorios:

| Repositorio | Rol |
|---|---|
| [plugins](https://github.com/equisdots/plugins) | El estándar, la carpeta con los 63 plugins, el registro de instalación y las pruebas de humo. |
| [plugin-api](https://github.com/equisdots/plugin-api) | Esquema normativo del manifiesto, versión de la API y evaluadores de compatibilidad en bash/Lua. |
| [plugin-sdk](https://github.com/equisdots/plugin-sdk) | Kit de ejecución: `PluginHost`, `Settings` reactivos, superficies, kit de widgets y API Lua `mod`. |
| [transformpath](https://github.com/equisdots/transformpath) | Notas de arquitectura, registro de decisiones y estado de la migración. |

Nyx y timex son plugins con repositorio propio. El resto del conjunto convertido
vive en `equisdots/plugins/plugins/`.

> Estado: el estándar está en `branch/experimental` y es un POC funcional. Nyx,
> timex, screenshots y el editor de atajos ya son superficies reales; la API y el
> SDK se versionan en paralelo (`plugin-api.json`: API `1.0.0`, shell `0.1.0`).

## Qué puede aportar un plugin

| Superficie | Clave del manifiesto | Ejemplo |
|---|---|---|
| UI siempre visible (overlay, isla) | `host` | isla de mascotas Nyx |
| Página de ajustes | `settings.page` | Plugins → Nyx, Timex |
| Panel / popup | `provides.panels.<name>` | calendario, portapapeles, lector RSS |
| Módulo de barra | `provides.bar.modules.<id>` | grabación, clima, sysmon |
| Barra completa | `provides.bar.provider` | Samurai Bar, POC hello-bar |
| Caras de widgets de escritorio | `provides.widgets.faces` | widget del clima de timex |
| Especies y tarjetas de mascotas | `provides.mascots` | catálogo de especies de Nyx |
| Fragmento del compositor | `hypr.lua` | atajos, startup, entorno |
| Entrada Quickshell independiente | `standalone` | overlay de capturas |

`provides` es libre y los hosts lo pasan sin tocarlo. Cada consumidor documenta
sus claves; el estándar nunca conoce nombres de funciones como “mascots” o
“weather”.

## Manifiesto

```json
{
  "id": "nyx",
  "name": "Nyx",
  "version": "0.1.0",
  "author": "equisdots",
  "description": "Mascot island and control-center notch for the shell",
  "type": "shell",
  "compat": { "shell": ">=0.1.0" },
  "toggle": "mascots.enabled",
  "settings": { "page": "settings/NyxPage.qml", "label": "Nyx" }
}
```

- `id` es la identidad: estable, única globalmente e igual al nombre de carpeta.
- `type` es `shell`, `hypr`, `mixed` o `cli`.
- `compat` lo aplica el escaneo: `{ "hyprland": ">=0.55", "shell": ">=0.1.0" }`.
  Un plugin incompatible se lista pero nunca se monta; `dots plugins add` lo
  rechaza salvo con `--force`.
- `toggle` nombra el interruptor maestro propio del plugin (por defecto
  `plugins.<id>.enabled`). Nyx apunta a `mascots.enabled` para tener un solo
  interruptor.
- `defaults` nombra un fragmento de ajustes propiedad del plugin; `dots` siembra
  el archivo de ajustes del plugin, nunca el `settings.json` central.

El JSON Schema completo vive en `plugin-api/schema/plugin.schema.json`.

## Descubrimiento y activación

Los hosts escanean dos carpetas; ningún código de host conoce ids de plugins:

| Carpeta | Propietario | Prioridad |
|---|---|---|
| `~/.config/hypr/plugins/<id>/` | gestionada por `dots` | |
| `~/.config/hypr/plugins-user/<id>/` | usuario | gana en colisiones de id |

Cualquier directorio con un `plugin.json` es un plugin. Que un plugin de usuario
solape uno gestionado es intencionado, pero las colisiones nunca son silenciosas:
el escaneo informa de copias `shadowed` y `dirMismatch`, el cargador registra
`status: "collision"`, el gestor avisa en la tarjeta y `dots doctor` informa de
duplicados del registro.

Dos interruptores mantienen la propiedad clara:

| Interruptor | Clave | Posee |
|---|---|---|
| Maestro | `toggle` o `plugins.<id>.enabled` | toda la función; los hosts montan solo mientras está activo |
| Menú de configuración | `plugins.<id>.config` (por defecto `true`) | si la página aparece en el grupo Plugins |

El valor efectivo por defecto es `defaultEnabled` (opt-in, `false` salvo que se
declare). El cambio en vivo recarga el fragmento del compositor y los vigilantes
del shell aplican el ajuste; no se reinstala nada.

## Convención de despliegue

Un plugin gestionado se despliega en dos piezas:

```
repositorio completo  ->  ~/.config/hypr/scripts/quickshell/ui/plugins/<id>/
subconjunto runtime   ->  ~/.config/hypr/plugins/<id>/
                         plugin.json + hypr.lua + scripts/
```

La copia del árbol del shell es la cara UI que carga Quickshell. La carpeta del
registro es lo que leen el descubrimiento y el cargador del compositor. Los
plugins de usuario se quedan en `plugins-user/` y deben ser autocontenidos.

## Puntos de extensión

Los hosts implementan solo mecanismos genéricos:

- **`PluginsCatalog`** escanea manifiestos, resuelve `enabled`, `config` y la
  ruta de UI.
- **`ui/PluginHosts.qml`** monta el `host` y/o la barra completa de cada plugin
  gestionado activo. Los hosts pueden publicar rectángulos `frameObstacle` para
  que el marco de pantalla se adapte.
- **Grupo Plugins** del panel de ajustes: gestor más una página dinámica por
  plugin (`p_<id>`), cargada desde `settings.page`.
- **Paneles**: `ui/Main.qml` resuelve `provides.panels.<name>`; `qs_manager
  toggle <name>` y los módulos de barra siguen funcionando.
- **Módulos de barra**: el motor de zonas resuelve `provides.bar.modules.<id>`;
  el núcleo conserva el id del hueco, el diseño y la configuración del usuario.
- **Cargador de Hyprland**: `plugins.lua` evalúa cada `hypr.lua` activo con un
  `pcall`, así que un plugin roto nunca aborta la sesión. Los resultados van a
  `~/.cache/equisdots/plugins-report.json`.

### El editor de atajos

Cada `mod.bind(key, dispatcher, { label, id })` se registra con un id estable, la
tecla efectiva y la tecla por defecto. El plugin `keybinds` muestra los atajos de
todos los plugins y permite reasignar o silenciar uno solo. Las anulaciones viven
en el archivo de ajustes del plugin (`<scope>.binds.<id>` = `"KEY"` o `false`);
el plugin posee la acción y el usuario la tecla. Los atajos del núcleo se listan
solo lectura y no se pueden capturar.

## El hub de 63 plugins

`equisdots/plugins/plugins/` concentra el conjunto convertido. Incluye:

- **Por defecto**: screenshots + grabación, timex, lector RSS, portapapeles,
  quicknotes, búsqueda de archivos, sysmon y keybinds.
- **Herramientas de escritorio**: dock, calculadora, selector de color, selector
  de glifos, conversor de unidades, visor JSON, snippets, tareas, pomodoro,
  reloj mundial, panel y temas de xfetch.
- **Módulos de barra**: batería, brillo, caps lock, frecuencia de CPU, cripto,
  disco, DND, Docker, ventilador, GitHub, git, GPU, kernel, carga, correo,
  memoria, micrófono, media, luz nocturna, actualizaciones, procesos, swap,
  torrents, uptime, VPN y más.
- **Barras completas**: la Samurai Bar monocroma y el POC `hello-bar`.

Nyx y timex viven en sus propios repositorios y se referencian desde el registro,
nunca se copian al hub.

## CLI

```sh
dots plugins                    # instalados: id, nombre, versión, tipo, estado
dots plugins available          # registro: instalados vs disponibles
dots plugins add <id>           # descarga, despliega por convención y activa
dots plugins add <id> --no-enable --force
dots plugins remove <id>
dots plugins enable <id>
dots plugins disable <id>
```

`dotsniri` replica la misma superficie para el stack de niri. La página del gestor
lee la copia del registro que `dots` despliega en el árbol del shell, así que los
plugins disponibles también se instalan desde la UI.

## Comprobaciones y aislamiento de fallos

No hay CI. Las puertas locales son:

```sh
equisdots/plugins/tests/smoke.sh        # manifiestos, qmldir, escaneo, ids, registro
hyprland/tests/plugins_loader_test.sh   # cargador, anulaciones de atajos, colisiones
dotsniri doctor --self-test             # sintaxis del toolkit
```

Un plugin roto queda aislado: un `hypr.lua` defectuoso lo captura `pcall`, una
página del shell rota no carga, y borrar un plugin deja claves huérfanas
inofensivas. El escritorio siempre sobrevive; el peor caso es una función
ausente en silencio.

## Escribir un plugin

1. Copie `equisdots/plugins/plugins/_template/` y asigne un `id` único.
2. Añada `plugin.json`, `defaults.json` y, opcionalmente, `hypr.lua`, `scripts/`,
   `settings/<Page>.qml`, `host/` o QML de panel.
3. Pruebe en local en `~/.config/hypr/plugins-user/<id>/`.
4. Ejecute `equisdots/plugins/tests/smoke.sh`.
5. Registre el plugin en `registry.json` solo si debe instalarse desde el hub;
   los plugins con repositorio propio se referencian por `source`.

## Páginas relacionadas

- [Shell Quickshell](/es/docs/shell) para los mecanismos de host y los paneles.
- [Isla de mascotas Nyx](/es/docs/nyx) para el primer plugin y su regla de
  extensión.
- [Arquitectura y repositorios](/es/docs/architecture) para el mapa completo.
