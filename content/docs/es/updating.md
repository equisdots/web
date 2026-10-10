---
title: Actualización y diagnóstico
description: Cómo dots update, list, doctor y uninstall mantienen la pila sincronizada y cómo corregir los fallos más comunes.
order: 3
section: start
---

`dots` gestiona toda la pila desde un único comando. Actualizar descarga todos
los repositorios, vuelve a desplegar la carga útil y mantiene el demonio de
fondos de pantalla alineado con la versión fijada. El diagnóstico es una pasada
independiente de solo lectura que indica qué falta o está desincronizado.

## Referencia de comandos

| Comando | Acción |
|---|---|
| `dots install` | Clonar o actualizar cada repositorio y colocar su carga útil. |
| `dots update` | `dots install` más la comprobación de la versión de xwww. |
| `dots system` | Ejecutar el instalador de hyprland (paquetes, fuentes, login, PAM, requiere sudo). |
| `dots doctor` | Comprobar binarios, clones y rutas instaladas. Termina con código distinto de cero si falla. |
| `dots list` | Estado de los repositorios: `clean`, `dirty` o `missing`. |
| `dots reset` | Reinstalación limpia forzada de la carga útil (los datos de usuario se conservan). |
| `dots uninstall` | Eliminar los wrappers y el temporizador de actualización; las configuraciones y los clones permanecen. |

```sh
dots update
dots doctor
dots list
```

## El stack de niri (dotsniri)

La sesión de niri tiene su propio meta instalador, `dotsniri`, paralelo a
`dots`. Usa una raíz de clones aparte (`~/.local/share/equisdots-niri`) y nunca
toca una instalación de `dots` en paralelo, así que los dos stacks conviven en
una máquina.

| Comando | Acción |
|---|---|
| `dotsniri install` | Clonar/actualizar y desplegar el stack de niri (repos propios + `shell`/`nyx` compartidos). |
| `dotsniri update` | Descargar los repos propios más las bases compartidas `shell`/`nyx` y volver a desplegar. |
| `dotsniri deploy` | Volver a desplegar desde los clones existentes (reaplica los overlays tras un `dots update`). |
| `dotsniri desktop <niri\|hyprland\|both>` | Fijar la sesión por defecto y aplicar o retirar los overlays del shell. |
| `dotsniri login <install\|remove\|status>` | Gestionar la entrada de sesión del gestor de pantalla (vía `niri-login`, sudo). |
| `dotsniri system [--apply]` | Instalar paquetes de la distro (niri, portales, ...). |
| `dotsniri doctor` | Comprobar binarios, clones, deploy, el backend del shell y `niri validate`. |
| `dotsniri doctor --self-test` | Comprobar la sintaxis del toolkit; funciona sin niri. |
| `dotsniri reset` | Reinstalación limpia forzada del deploy de niri (elimina los clones propios). |

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/equisdots/niri-meta/main/bin/dotsniri) install
dotsniri doctor
dotsniri desktop niri
```

Los overlays del shell son condicionales y reversibles: un archivo compartido
solo se reemplaza por su variante niri mientras se selecciona la sesión niri, y
`dotsniri deploy` los reaplica cuando `dots update` reescribe el shell. Ver
[Compositor niri](/es/docs/niri).

## Qué hace dots update

Para cada repositorio de la organización (`dots`, `palettes`, `theme-sync`,
`davincix`, `shell`, `nyx`, `hyprland`, `timex`, `xturing`, `login`):

1. Descarga `origin/main` con profundidad 1 y restablece por la fuerza el clon
   gestionado a esa versión. El restablecimiento forzado también recupera de
   los force-push ascendentes, donde un pull de avance rápido fallaría siempre.
2. Si `dots` cambió durante la descarga, el script se vuelve a ejecutar con la
   nueva versión antes de tocar ninguna carga útil.
3. Despliega la carga útil de ese repositorio, omitiendo los clones con cambios
   locales.

Tras la fase de carga útil, `dots update` compara el binario `xwww` en
ejecución con la versión fijada en `scripts/install-xwww.sh` y reinstala cuando
difieren (`XWWW_VERSION` anula la versión fijada). También escribe el estado de
versión que usan la página Acerca de y el emergente del actualizador.

## Cambios locales en clones gestionados

Los clones gestionados son de solo lectura desde el punto de vista de `dots`.
Un clon con cambios sin confirmar se conserva exactamente como está y su carga
útil **no se despliega**, de modo que una copia obsoleta nunca puede degradar
ni eliminar archivos activos.

```sh
dots list                                  # shows dirty clones
git -C ~/.local/share/equisdots/shell status
```

Reconcilie confirmando o guardando los cambios, o apartando el clon:

```sh
mv ~/.local/share/equisdots/shell{,.local}
dots install
```

`dots doctor` señala cada clon sucio para que las actualizaciones no se detengan
en silencio.

## Reinstalación forzada con dots reset

`dots reset` es la salida de emergencia para una instalación rota: elimina los
archivos gestionados (configuración/scripts de Hyprland, shell, configuraciones
de aplicaciones) y los clones gestionados, reinstala todo desde el último
`origin/main` y vuelve a aplicar la paleta activa. Nunca toca sus datos:
`settings.json`, los overrides de `config/`, `wallpapers/`, el almacén de
paletas (`dock/palettes`, incluidos los cambios de la comunidad y del editor),
`display-config`, `idle-settings.json` y las instantáneas
`hyprland-backup-*` sobreviven. También es la forma de recuperar clones
gestionados sucios que bloquean su carga útil durante `update`/`install`. La
pila del sistema (sudo) queda fuera: ejecute `dots system` para paquetes,
fuentes, tema de login y PAM.

`dots install`, `dots update` y `dots reset` normalizan un `~` inicial en
`wallpaperDir` de `settings.json` a una ruta absoluta, para que el selector de
fondos siempre encuentre la colección (un `~` literal dejaba la rejilla vacía y
hacía fallar cada aplicación con `File not found`).

## Reglas de combinación de settings.json

`dots install` nunca sobrescribe sus ajustes. El archivo se siembra desde
`default_settings.json` solo cuando falta, y en cada actualización se reescribe
como **valores predeterminados distribuidos más sus valores** con `jq`:

1. El objeto `dock` anterior a equisdots se migra a la clave canónica `bar`.
2. Se eliminan las claves heredadas que ya no lee nadie.
3. Los valores predeterminados distribuidos se aplican como base; sus valores
   ganan, y los arrays de usuario como `bar.zones` se conservan tal cual.

Si la combinación falla, el archivo se deja intacto y `dots` imprime una
advertencia.

## El temporizador mensual de actualización

`dots install` registra un temporizador de usuario de systemd que ejecuta la
actualización de los dotfiles mensualmente:

```sh
systemctl --user status dotfiles-update.timer
systemctl --user list-timers dotfiles-update.timer
```

`dots uninstall` elimina el temporizador y los wrappers. El servicio apunta a
`~/.config/hypr/scripts/dotfiles-update.sh`; `dots doctor` avisa cuando la
unidad apunta a otro sitio.

## Comprobaciones de dots doctor

El doctor es el primer diagnóstico que debe ejecutar. Informa, en orden:

- Binarios requeridos: `git`, `rsync`, `hyprland`, `qs`, `jq`, `curl`,
  `python3`, `cava`, `playerctl`, `wl-paste`, `cliphist`, `brightnessctl`,
  `pamixer`, `kitty`, `rofi`, `xwww-daemon`, `mpvpaper`.
- Binarios opcionales: `grim`, `slurp`, `satty`, `hyprpicker`, `blueman-applet`,
  `nm-applet`, `gsettings`, `cargo`.
- Comprobación de fuentes mediante `fc-match "Hack Nerd Font"`.
- La versión de `xwww` en ejecución frente a la versión fijada.
- Clones de repositorios y clones con cambios.
- Rutas de la carga útil instalada (paletas, `hyprland.lua`, `Shell.qml`,
  wrappers, `settings.json` y más).
- Versión de Hyprland (se requiere 0.55+ para Lua) y `~/.local/bin` en `PATH`.
- Piezas del sistema: `/etc/pam.d/quickshell`, la configuración del tema SDDM,
  el tema estático y el gestor de pantalla activo.
- El temporizador mensual de actualización.

```sh
dots doctor; echo "exit: $?"
```

El comando termina con `1` cuando al menos un elemento ha fallado, lo que lo
hace utilizable en scripts.

## Solución de problemas

- La actualización informa de `local changes; skipping its payload` (cambios
  locales; se omite su carga útil): reconcilie el clon como se muestra arriba y
  vuelva a ejecutar `dots update`.
- Fallo en la descarga (red): la copia existente se conserva y el resto de la
  actualización continúa; reintente más tarde.
- `settings.json could not be migrated` (no se pudo migrar settings.json):
  consulte la advertencia; el archivo está intacto. Compruebe que `jq` está
  instalado.
- `hyprland < 0.55`: actualice el paquete del compositor; la configuración Lua
  necesita soporte de Lua.
- Discrepancia de xwww: `dots update` (o `scripts/install-xwww.sh`) reinstala
  la versión fijada.
- El gestor de pantalla activo no es SDDM: el tema de inicio de sesión estático
  no se mostrará; `dots system` cambia el enlace del gestor de pantalla.
- Fallo en la fase de sistema: inspeccione el registro más reciente con
  `ls -t /tmp/hyprland-install-*.log | head -1`.

## Páginas relacionadas

- [Instalación](/es/docs/installation) para la primera configuración.
- [Arquitectura y repositorios](/es/docs/architecture) para el diseño de la
  instalación y los contratos.
- [Contribución y seguridad](/es/docs/contributing) para notificar problemas.
