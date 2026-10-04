import type { Metadata } from "next";
import { PreviewsPage } from "@/components/previews/PreviewsPage";

export const metadata: Metadata = {
  title: "Previews",
  description:
    "Real captures and clips of the equisdots desktop: Hyprland tiling, the Quickshell bar and settings editor, palettes, interactive scenes and widgets.",
};

export default function Page() {
  return <PreviewsPage locale="en" />;
}
