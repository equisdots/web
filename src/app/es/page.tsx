import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: { absolute: "Equisdots" },
  description:
    "El escritorio X: un stack sobre Arch con Hyprland en la era Lua y un port a niri, un shell Quickshell neutral al compositor, un estándar de 63 plugins, un motor de paletas en vivo y escenas interactivas de fondo.",
};

export default function Page() {
  return <LandingPage locale="es" />;
}
