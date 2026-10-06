import { SectionHeader } from "./SectionHeader";
import { getDict, type Locale } from "@/lib/i18n";

export function Features({ locale }: { locale: Locale }) {
  const dict = getDict(locale);

  return (
    <section>
      <div className="container-page py-16">
        <SectionHeader
          index="01"
          label={dict.home.labels.highlights}
          title={dict.home.highlightsTitle}
          subtitle={dict.home.highlightsSubtitle}
        />

        <ol className="mt-12 grid gap-x-14 md:grid-cols-2">
          {dict.highlights.map((item, index) => (
            <li key={item.title} className="flex gap-5 border-t border-border py-6">
              <span className="index pt-1">{String(index + 1).padStart(2, "0")}</span>
              <div className="min-w-0">
                <h3 className="font-medium">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
