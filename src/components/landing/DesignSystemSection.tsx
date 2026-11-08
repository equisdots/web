import { SectionHeader } from "./SectionHeader";
import { PaletteGem, type PaletteSwatch } from "@/components/three/PaletteGem";
import { getDict, type Locale } from "@/lib/i18n";

const SWATCHES: PaletteSwatch[] = [
  { name: "X · gold", hex: "#eab308" },
  { name: "X · rose", hex: "#fc618d" },
  { name: "X · green", hex: "#7bd88f" },
  { name: "X · orange", hex: "#fd9353" },
  { name: "X · violet", hex: "#948ae3" },
  { name: "X · cyan", hex: "#5ad4e6" },
];

const ACCENTS = ["c1", "c2", "c3", "c4", "c5", "c6"] as const;

export function DesignSystemSection({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const notes = dict.design.notes;

  return (
    <section id="design" className="border-t border-border">
      <div className="container-wide py-16">
        <SectionHeader
          index="04"
          label={dict.home.labels.design}
          title={dict.home.designTitle}
          subtitle={dict.home.designSubtitle}
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col gap-2">
            {notes.map((note, index) => (
              <article
                key={note.title}
                className="group rounded-xl border border-border bg-surface/40 p-4 transition-colors hover:border-accent/40 hover:bg-surface"
              >
                <div className="flex items-baseline gap-3">
                  <span className="index" style={{ color: `var(--${ACCENTS[index % ACCENTS.length]})` }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-sm font-medium">{note.title}</h3>
                  <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    {note.tag}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-5 text-muted">{note.body}</p>
              </article>
            ))}

            <div className="mt-2 rounded-xl border border-border bg-bg/60 p-4">
              <p className="label">{dict.design.tokensLabel}</p>
              <div className="mt-3 flex flex-wrap gap-1.5" aria-hidden="true">
                {Array.from({ length: 18 }, (_, index) => (
                  <span
                    key={index}
                    className="h-6 flex-1 rounded-sm border border-border/50"
                    style={{
                      backgroundColor: `color-mix(in srgb, var(--${ACCENTS[index % ACCENTS.length]}) ${
                        22 + (index % 6) * 12
                      }%, var(--surface))`,
                    }}
                  />
                ))}
              </div>
              <p className="mt-3 text-xs leading-5 text-muted">{dict.design.tokensNote}</p>
            </div>
          </div>

          <PaletteGem palettes={SWATCHES} label={dict.design.gemLabel} hint={dict.design.gemHint} />
        </div>
      </div>
    </section>
  );
}
