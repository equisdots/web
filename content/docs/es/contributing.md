---
title: Contribución y seguridad
description: Dónde notificar problemas, cómo se revisan las pull requests, las comprobaciones locales que hay que ejecutar y la política de seguridad.
order: 13
section: more
---

Las contribuciones son bienvenidas en toda la organización. Cada repositorio
posee un único cometido, así que el primer paso es siempre elegir el correcto.
No hay CI: cada repositorio incluye un script de comprobación local y el
mantenedor lo ejecuta antes de hacer push, así que ejecute las mismas
comprobaciones antes de abrir una pull request.

## Dónde informar

Abra el issue en el repositorio que posee el comportamiento:

| Tema | Repositorio |
|---|---|
| Instalación, actualizaciones, paquetes, tema de inicio de sesión, `dots plugins` | [dots](https://github.com/equisdots/dots) |
| Configuración del compositor, atajos de teclado, scripts | [hyprland](https://github.com/equisdots/hyprland) |
| Configuración del compositor niri, scripts, sesión/portales | [niri](https://github.com/equisdots/niri) |
| Instalación/actualización del stack niri, overlays, entrada de sesión | [niri-meta](https://github.com/equisdots/niri-meta) |
| Overlays de shell y Nyx neutrales al compositor | [niri-shell](https://github.com/equisdots/niri-shell), [nyx-niri](https://github.com/equisdots/nyx-niri) |
| Barra, paneles, widgets, editor | [shell](https://github.com/equisdots/shell) |
| Mascotas, isla/notch, dock | [nyx](https://github.com/equisdots/nyx) |
| Fondos de pantalla, escenas, selector | [davincix](https://github.com/equisdots/davincix), [background](https://github.com/equisdots/background) |
| Colores y temas | [palettes](https://github.com/equisdots/palettes), [theme-sync](https://github.com/equisdots/theme-sync) |
| Hora, clima, calendario | [timex](https://github.com/equisdots/timex) |
| Estándar de plugins, hub, registro y plugins convertidos | [plugins](https://github.com/equisdots/plugins) |
| Esquema del manifiesto, versión de API, compatibilidad | [plugin-api](https://github.com/equisdots/plugin-api) |
| PluginHost, Settings, superficies, Lua `mod` | [plugin-sdk](https://github.com/equisdots/plugin-sdk) |
| Arquitectura y migración de plugins | [transformpath](https://github.com/equisdots/transformpath) |
| Interfaz de ajustes de terminal | [xturing](https://github.com/equisdots/xturing) |
| Motor de escenas y demonio de fondos de pantalla | [x-ports/xwww](https://github.com/x-ports/xwww) |

Si no está seguro, use la plantilla de issue de toda la organización y elija el
componente allí. Los canales de soporte y el código de conducta viven en
[hyprland](https://github.com/equisdots/hyprland) (`SUPPORT.md`,
`CODE_OF_CONDUCT.md`), y el perfil de la organización resume la pila.

## Pull requests

1. Mantenga el cambio enfocado: un tema por pull request.
2. Use el estilo de commit existente (`feat:`, `fix:`, `docs:`, `chore:`, `ci:`)
   con un asunto imperativo breve.
3. Ejecute las comprobaciones de cada repositorio que toque.
4. Actualice el `CHANGELOG.md` del repositorio cuando exista; las versiones
   salen de esas entradas.
5. Los archivos nuevos usan por defecto la licencia que ya emplea el
   repositorio: el código es estilo MIT salvo que se indique lo contrario; los
   fondos de pantalla y la documentación siguen los términos de
   [background](https://github.com/equisdots/background).

## Comprobaciones locales

| Repositorio | Comando |
|---|---|
| shell | `scripts/check.sh` |
| hyprland | `scripts/check.sh` |
| niri | `scripts/check.sh` |
| niri-meta | `dotsniri doctor --self-test` |
| palettes | `scripts/check.sh` |
| theme-sync | `scripts/check.sh` |
| xturing | `scripts/check.sh` |
| plugins | `tests/smoke.sh` |
| plugin-api | fixtures de evaluadores de compatibilidad |
| plugin-sdk | `qmllint` + pruebas Lua |

- Shell: `qmllint` sobre cada archivo `.qml` y `node --check` sobre los módulos
  JS.
- Hyprland: `luac -p` sobre cada módulo de configuración Lua y `bash -n` sobre
  los scripts (`shellcheck` se usa como asesor cuando está instalado).
- niri: `bash -n` sobre los scripts y comprobación de balance de llaves KDL;
  ejecute `niri validate -c ~/.config/niri/config.kdl` en una máquina con niri.
- niri-meta: `dotsniri doctor --self-test` ejecuta `bash -n` sobre el toolkit y
  funciona sin niri instalado.
- Paletas: validación del esquema más consistencia de `index.json`.
- theme-sync: `compileall` y una prueba de humo de la CLI (`--list`,
  `--dry-run`).
- xturing: `cargo fmt --check`, clippy con `-D warnings` y las pruebas.
- plugins: el harness de humo comprueba manifiestos, imports `qmldir`,
  resolución del escaneo, ids duplicados y consistencia del registro.
- plugin-api: los evaluadores semver de bash y Lua deben coincidir en los
  fixtures compartidos.
- plugin-sdk: valide el kit QML de host y ejecute las pruebas del `mod` Lua.

## Guías de estilo

- La documentación se escribe en inglés.
- Las configuraciones y los scripts siguen siendo controlados por la paleta:
  lea la paleta activa en lugar de codificar colores.
- Prefiera los pequeños ayudantes existentes de cada repositorio a nuevas
  dependencias.
- Para las escenas de xwww, permanezca dentro del sandbox documentado: solo
  activos locales, sin temporizadores, sin red y redibujado dirigido por
  cambios.
- Para los plugins, mantenga la función autocontenida: el manifiesto es el
  único contrato, el plugin posee su UI, ajustes, valores por defecto y scripts,
  y los hosts nunca deben conocer ids de plugins. No copie repositorios de
  plugins externos al hub; referéncielos por `source`.

## Política de seguridad

No abra un issue público para un problema de seguridad. Use en su lugar el
sistema de notificación privada de GitHub:

1. Abra el repositorio afectado y vaya a **Security -> Report a vulnerability**
   (Seguridad -> Notificar una vulnerabilidad; GitHub Security Advisories), o
   póngase en contacto con el mantenedor indicado en el repositorio.
2. Incluya el componente y la versión afectados, una descripción del impacto y
   una reproducción si la tiene.
3. Recibirá un acuse de recibo lo antes posible y crédito en el aviso una vez
   publicado el arreglo.

### Alcance

La pila se ejecuta en la sesión del usuario e instala piezas del sistema:
paquetes, el tema SDDM y `/etc/pam.d/quickshell`. Los informes sobre el shell,
los scripts de Hyprland, los instaladores, el cargador de plugins, el motor de
fondos de pantalla o el entorno de ejecución de escenas son bienvenidos. Las escenas ejecutan código
escrito por el usuario en el cliente xwww por diseño; el sandbox en tiempo de
ejecución (límites de memoria y pila, tiempo de espera por fotograma, sin E/S,
solo activos locales) está documentado en
[equisdots/x-ports](https://github.com/x-ports/xwww).

### Versiones compatibles

Solo la última versión de cada repositorio recibe correcciones. `dots update`
mantiene la instalación en las versiones actuales, y `dots doctor` informa de
lo que está desincronizado. Consulte
[Actualización y diagnóstico](/es/docs/updating).

## Consejos prácticos

- Pruebe los instaladores antes de ejecutarlos en una máquina que le importe;
  usan sudo y cambian la configuración del sistema.
- Revise los scripts antes de bifurcarlos o compartirlos; las configuraciones
  personales pueden contener rutas o tokens.
- Use el modo dry-run de xturing o una copia de `settings.json` al experimentar
  con opciones.
- Valide las paletas antes de enviarlas:
  `python3 tools/validate_palettes.py` en el repositorio de paletas.

## Páginas relacionadas

- [Arquitectura y repositorios](/es/docs/architecture) para el diseño y los
  contratos.
- [Actualización y diagnóstico](/es/docs/updating) para el flujo de actualización.
