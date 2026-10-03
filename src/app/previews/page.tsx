import type { Metadata } from "next";
import { PreviewsPage } from "@/components/previews/PreviewsPage";

export const metadata: Metadata = {
  title: "Previews",
  description: "Gallery of the equisdots desktop: bar styles, palettes, wallpapers, scenes and widgets.",
};

export default function Page() {
  return <PreviewsPage locale="en" />;
}
