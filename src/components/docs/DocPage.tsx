import Link from "next/link";
import { Markdown } from "@/components/Markdown";
import { DocsShell } from "@/components/docs/DocsShell";
import { editUrl, getDoc, getDocsNav } from "@/lib/docs";
import { getDict, type Locale } from "@/lib/i18n";

export function DocPage({ locale, slug }: { locale: Locale; slug: string }) {
  const dict = getDict(locale);
  const root = locale === "es" ? "/es" : "";
  const nav = getDocsNav(locale);
  const doc = getDoc(locale, slug);

  if (!doc) {
    return (
      <main className="container-page py-24 text-center">
        <p className="text-muted">{dict.docs.notFound}</p>
        <Link href={`${root}/docs`} className="btn mt-6 inline-flex">
          {dict.docs.backToDocs}
        </Link>
      </main>
    );
  }

  const flat = nav.flatMap((group) => group.docs);
  const index = flat.findIndex((entry) => entry.slug === slug);
  const previous = index > 0 ? flat[index - 1] : undefined;
  const next = index >= 0 && index < flat.length - 1 ? flat[index + 1] : undefined;

  const footerNav = (
    <nav className="flex items-stretch justify-between gap-4">
      {previous ? (
        <Link href={`${root}/docs/${previous.slug}`} className="group max-w-[48%]">
          <span className="text-xs text-muted">{dict.docs.prev}</span>
          <span className="block transition-colors group-hover:text-accent">{previous.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={`${root}/docs/${next.slug}`} className="group max-w-[48%] text-right">
          <span className="text-xs text-muted">{dict.docs.next}</span>
          <span className="block transition-colors group-hover:text-accent">{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );

  return (
    <DocsShell
      locale={locale}
      section={doc.section}
      title={doc.title}
      description={doc.description}
      headings={doc.headings}
      nav={nav}
      editHref={editUrl(locale, slug)}
      footerNav={footerNav}
    >
      <Markdown html={doc.html} />
    </DocsShell>
  );
}
