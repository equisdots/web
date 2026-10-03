---
title: Instalación
description: Requisitos y la forma recomendada de instalar el escritorio equisdots, además del primer inicio de sesión y la solución de problemas.
order: 2
section: start
---

La forma recomendada de instalar equisdots es el meta instalador `dots`. Una
única ejecución de `setup` instala las piezas del sistema (paquetes, fuentes,
tema de inicio de sesión, servicio PAM, configuraciones externas) y la carga
útil de usuario (configuración del compositor, shell, paletas, motores) de
todos los repositorios.

## Requisitos

- Arch Linux o una derivada (EndeavourOS, Manjaro, CachyOS, Garuda).
- Linux 6.x o posterior recomendado, 4 GB de RAM mínimo, 8 GB recomendado.
- Hyprland 0.55 o posterior (la configuración es Lua).
- `git`, `rsync`, `jq`, Quickshell (`qs`), `xwww-daemon`, `mpvpaper` y la
  Hack Nerd Font.

`dots doctor` comprueba todo esto y termina con un código de error cuando falta
algo; el paquete completo de fondos de pantalla es opcional y ocupa unos
1,37 GB.

## Instalación con un solo comando

El instalador clona toda la organización por sí mismo; no se necesita ningún
clon previo:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/equisdots/dots/main/dots) setup -y
```

El indicador `-y` responde a las preguntas con los valores predeterminados
recomendados y omite el paquete de fondos de pantalla. Tras la primera
ejecución, el comando `dots` está disponible en `~/.local/bin/dots`.

## Instalación manual

Paso a paso, desde un clon del [repositorio dots](https://github.com/equisdots/dots):

```sh
git clone https://github.com/equisdots/dots.git
cd dots

./dots system      # system stack (sudo): packages, fonts, login, PAM, xwww
./dots install     # clone every repo and place the user payload
./dots doctor      # verify binaries, clones and installed paths
```

Prefiera `setup` cuando sea posible; ejecuta ambas fases en el orden correcto:

```sh
./dots setup       # payload first when git/rsync exist, then the system stack
./dots setup -y    # non-interactive with defaults
```

Si falta `git` o `rsync`, `setup` ejecuta primero la pila del sistema (los
instala) y después reintenta la carga útil. Un fallo en la fase de sistema
nunca aborta la fase de carga útil, y viceversa.

## Qué hace cada fase

`dots system` ejecuta el instalador de
[hyprland](https://github.com/equisdots/hyprland):

- Instala paquetes de la distribución mediante un ayudante de AUR (Hyprland,
  Quickshell, kitty, dunst, grim, slurp, cliphist, rofi, cava,
  gpu-screen-recorder y más), además de la Hack Nerd Font y temas (adw-gtk3,
  Papirus, Bibata).
- Instala el demonio de fondos de pantalla xwww desde la versión precompilada
  verificada por suma de comprobación, con compilación desde el código fuente
  como alternativa.
- Instala el tema SDDM estático de
  [equisdots/login](https://github.com/equisdots/login).
- Instala `/etc/pam.d/quickshell` para la pantalla de bloqueo y las
  configuraciones de kitty, Neovim y starship.
- Configura NVIDIA cuando corresponde, incluidos los parámetros del kernel.

`dots install` clona cada repositorio en `~/.local/share/equisdots` y coloca la
carga útil:

- Configuración de Hyprland en `~/.config/hypr`, más las configuraciones de
  rofi, dunst y cava.
- Shell Quickshell, paletas, theme-sync, davincix, timex y xturing.
- Scripts de envoltura (wrappers) en `~/.local/bin` y el temporizador de
  actualización mensual.

`install` copia sobre una configuración activa, pero trata `settings.json` con
cuidado: solo se siembra cuando falta y después siempre se combina como valores
predeterminados más sus valores. Para un purgado completo debe eliminar
`~/.config/hypr` usted mismo.

## Instalación independiente de Hyprland

Sin el meta instalador:

```sh
git clone https://github.com/equisdots/hyprland.git
cd hyprland
chmod +x install.sh
./install.sh                 # full install
./install.sh --dotfiles-only # config only, no packages
./install.sh --nvidia-only   # NVIDIA setup only
./install.sh -y              # non-interactive defaults
```

El instalador independiente omite el paso que llama a `dots install` cuando lo
dirige `dots system` (`DOTS_SYSTEM_RUN=1`), porque el meta instalador ejecuta
la carga útil justo después.

### Demonio de fondos de pantalla

El instalador fija una versión de xwww. Anúlela cuando sea necesario:

```sh
XWWW_VERSION=v0.13.1 ./scripts/install-xwww.sh
FORCE_XWWW=1 ./install.sh   # reinstall an existing binary
```

## Verificar la instalación

```sh
dots doctor
dots list
command -v dots hyprland qs davincix theme-sync
fc-match "Hack Nerd Font"
```

`dots list` debe informar de cada repositorio como `clean`, y `dots doctor`
debe terminar sin elementos faltantes. Cada línea `!` indica lo que requiere
atención.

## Primer inicio de sesión

1. Reinicie, especialmente si el controlador de NVIDIA cambió.
2. Elija Hyprland en el gestor de pantalla (`SUPER + Return` abre kitty,
   `SUPER + D` el lanzador).
3. El primer arranque inicializa el demonio de fondos de pantalla, elige un
   fondo de pantalla aleatorio e inicia los servicios en segundo plano.

## Solución de problemas

- `git/rsync missing`: ejecute `./dots system` primero y luego
  `./dots install`.
- Fallo al clonar: compruebe la red y vuelva a ejecutar `./dots install`. Los
  fallos nunca son fatales para los demás repositorios.
- Fallo en la fase de sistema: la carga útil se instala igualmente. Inspeccione
  `ls -t /tmp/hyprland-install-*.log | head -1` y reintente `./dots system`.
- Los glifos se ven como cajas: falta la Hack Nerd Font; vuelva a ejecutar
  `./dots system`.
- No se encuentra `dots` o `davincix`: `~/.local/bin` no está en `PATH`
  (`dots doctor` lo señala).
- Discrepancia de versión de xwww: ejecute `./dots update`, que reinstala la
  versión fijada cuando el binario en ejecución difiere.

## Desinstalación

```sh
./dots uninstall            # removes wrappers and the updater timer
./hyprland/uninstall.sh    # removes deployed configs (standalone installer)
```

`dots uninstall` conserva los archivos de configuración y los clones
gestionados; el tema de inicio de sesión tiene su propio
`./install.sh --uninstall` en
[equisdots/login](https://github.com/equisdots/login).

## Siguientes pasos

Lea [Actualización y diagnóstico](/es/docs/updating) para mantener la instalación
sincronizada y después [Escritorio Hyprland](/es/docs/desktop) para la superficie
de configuración.
