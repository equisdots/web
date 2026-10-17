import type { Metadata } from "next";
import { DocsIndex } from "@/components/docs/DocsIndex";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Everything about equisdots: installation, compositors, shell, plugins, wallpapers, scenes and theming.",
};

export default function Page() {
  return <DocsIndex locale="en" />;
}
