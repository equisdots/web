import { SectionHeader } from "./SectionHeader";
import { StackDiagram, type StackLayerView } from "./StackDiagram";
import type { RepoAccent } from "@/lib/repos";
import { getDict, type Locale } from "@/lib/i18n";

const ACCENTS: Record<StackLayerView["id"], RepoAccent> = {
  interface: "c6",
  compositor: "c1",
  engines: "c4",
  data: "c5",
  install: "c3",
};

export function StackSection({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const layers: StackLayerView[] = dict.stack.layers.map((layer) => ({
    ...layer,
    accent: ACCENTS[layer.id],
  }));

  return (
    <section id="stack" className="border-t border-border">
      <div className="container-page py-16">
        <SectionHeader
          index="02"
          label={dict.home.labels.stack}
          title={dict.home.stackTitle}
          subtitle={dict.home.stackSubtitle}
        />
        <div className="mt-10">
          <StackDiagram
            layers={layers}
            labels={{ diagram: dict.stack.diagram, plugins: dict.stack.plugins }}
          />
        </div>
      </div>
    </section>
  );
}
