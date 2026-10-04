import type { Metadata } from "next";
import { PreviewsPage } from "@/components/previews/PreviewsPage";

export const metadata: Metadata = {
  title: "Previews",
  description:
    "Capturas y clips reales del escritorio equisdots: tiling de Hyprland, barra y editor de ajustes de Quickshell, paletas, escenas interactivas y widgets.",
};

export default function Page() {
  return <PreviewsPage locale="es" />;
}
