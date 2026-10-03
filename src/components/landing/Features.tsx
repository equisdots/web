import { getDict, type Locale } from "@/lib/i18n";

export function Features({ locale }: { locale: Locale }) {
  const dict = getDict(locale);

  return (
    <section className="border-t border-border">
      <div className="container-page py-16">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight">{dict.home.highlightsTitle}</h2>
          <p className="mt-2 text-muted">{dict.home.highlightsSubtitle}</p>
        </div>

        <div className="mt-10 grid gap-x-14 md:grid-cols-2">
          {dict.highlights.map((item, index) => (
            <div key={item.title} className="flex gap-5 border-t border-border py-6">
              <span className="pt-0.5 font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
              <div className="min-w-0">
                <h3 className="font-medium">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
