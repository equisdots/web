import type { Metadata } from "next";
import { PreviewsPage } from "@/components/previews/PreviewsPage";

export const metadata: Metadata = {
  title: "Previews",
  description: "Galería del escritorio equisdots: estilos de barra, paletas, fondos, escenas y widgets.",
};

export default function Page() {
  return <PreviewsPage locale="es" />;
}
