import { SectionHeader } from "./SectionHeader";
import { StackScene } from "@/components/three/StackScene";
import type { RepoAccent } from "@/lib/repos";
import { getDict, type Locale } from "@/lib/i18n";

const ACCENTS: Record<"interface" | "compositor" | "engines" | "data" | "install", RepoAccent> = {
  interface: "c6",
  compositor: "c1",
  engines: "c4",
  data: "c5",
  install: "c3",
};

export function StackSection({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const layers = dict.stack.layers.map((layer) => ({
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
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <StackScene
            layers={layers.map((layer) => ({
              title: layer.title,
              repos: layer.repos,
              accent: layer.accent,
            }))}
            label={dict.stack.diagram}
            hint={dict.stack.interactiveHint}
          />

          <ol className="flex flex-col gap-2">
            {layers.map((layer, index) => (
              <li
                key={layer.id}
                className="group rounded-xl border border-border bg-bg/60 p-3.5 transition-colors hover:border-accent/40"
              >
                <div className="flex items-baseline gap-3">
                  <span className="index" style={{ color: `var(--${layer.accent})` }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-sm font-medium">{layer.title}</h3>
                  <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    {layer.repos}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-5 text-muted">{layer.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
