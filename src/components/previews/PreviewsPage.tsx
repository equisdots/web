import { withBasePath } from "@/lib/base-path";
import { getDict, type Locale } from "@/lib/i18n";

const GRADIENTS: [string, string][] = [
  ["c1", "c5"],
  ["c3", "c6"],
  ["c2", "c5"],
  ["c4", "c1"],
  ["c6", "c2"],
  ["c5", "c3"],
  ["c1", "c2"],
  ["c4", "c3"],
];

export function PreviewsPage({ locale }: { locale: Locale }) {
  const dict = getDict(locale);

  return (
    <main className="container-page py-14">
      <p className="eyebrow">{dict.previews.phase}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">{dict.previews.title}</h1>
      <p className="mt-4 max-w-2xl text-muted">{dict.previews.subtitle}</p>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{dict.previews.phaseNote}</p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {dict.previews.items.map((item, index) => {
          const pair = GRADIENTS[index % GRADIENTS.length] ?? ["c1", "c5"];
          const [from, to] = pair;
          return (
            <article key={item.title}>
              <div
                className="relative flex aspect-[4/3] items-center justify-center rounded-xl border border-border"
                style={{
                  backgroundImage: `linear-gradient(150deg, color-mix(in srgb, var(--${from}) 16%, var(--surface)) 0%, color-mix(in srgb, var(--${to}) 14%, var(--surface)) 100%)`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={withBasePath("/logos/equisdots-icon.svg")} alt="" className="h-12 w-12 rounded-lg opacity-70" />
              </div>
              <h2 className="mt-3 text-sm font-medium">{item.title}</h2>
              <p className="mt-0.5 text-xs text-muted">{item.kind}</p>
            </article>
          );
        })}
      </div>
    </main>
  );
}
