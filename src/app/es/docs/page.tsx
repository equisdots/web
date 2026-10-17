import type { Metadata } from "next";
import { DocsIndex } from "@/components/docs/DocsIndex";

export const metadata: Metadata = {
  title: "Documentación",
  description:
    "Todo sobre equisdots: instalación, compositores, shell, plugins, fondos, escenas y temas.",
};

export default function Page() {
  return <DocsIndex locale="es" />;
}
