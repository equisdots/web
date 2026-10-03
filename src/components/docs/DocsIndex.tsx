import Link from "next/link";
import { getDocsNav } from "@/lib/docs";
import { getDict, type Locale } from "@/lib/i18n";

export function DocsIndex({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const nav = getDocsNav(locale);
  const root = locale === "es" ? "/es" : "";

  return (
    <main className="container-page max-w-4xl py-14">
      <p className="eyebrow">{dict.docs.subtitle}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">{dict.docs.title}</h1>

      <div className="mt-12 space-y-12">
        {nav.map((group) => (
          <section key={group.section}>
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted">
              {dict.docs.sections[group.section]}
            </h2>
            <ul className="mt-4 border-t border-border">
              {group.docs.map((doc) => (
                <li key={doc.slug}>
                  <Link
                    href={`${root}/docs/${doc.slug}`}
                    className="group flex flex-col gap-1 border-b border-border py-4 transition-colors sm:flex-row sm:items-baseline sm:gap-6"
                  >
                    <span className="w-48 shrink-0 font-medium transition-colors group-hover:text-accent">
                      {doc.title}
                    </span>
                    <span className="text-sm text-muted">{doc.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
