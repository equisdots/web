import Link from "next/link";
import type { ReactNode } from "react";
import { DocsSidebar } from "@/components/DocsSidebar";
import { DocToc } from "@/components/docs/DocToc";
import type { DocHeading, DocMeta, DocSection } from "@/lib/docs";
import { getDict, type Locale } from "@/lib/i18n";

export function DocsShell({
  locale,
  section,
  title,
  description,
  headings,
  nav,
  editHref,
  children,
  footerNav,
}: {
  locale: Locale;
  section?: DocSection;
  title: string;
  description: string;
  headings?: DocHeading[];
  nav: { section: DocSection; docs: DocMeta[] }[];
  editHref?: string;
  children: ReactNode;
  footerNav?: ReactNode;
}) {
  const dict = getDict(locale);
  const root = locale === "es" ? "/es" : "";

  return (
    <div className="container-page flex w-full items-start gap-10 py-10">
      <aside className="sticky top-20 hidden w-56 shrink-0 pb-16 lg:block">
        <DocsSidebar nav={nav} />
      </aside>

      <div className="min-w-0 flex-1 pb-20">
        <details className="mb-8 rounded-xl border border-border px-4 py-3 lg:hidden">
          <summary className="cursor-pointer text-sm font-medium">{dict.docs.menu}</summary>
          <div className="pt-5">
            <DocsSidebar nav={nav} />
          </div>
        </details>

        <nav className="flex items-center gap-1.5 text-xs text-muted" aria-label="Breadcrumb">
          <Link href={`${root}/docs`} className="transition-colors hover:text-text">
            {dict.docs.title}
          </Link>
          {section ? (
            <>
              <span aria-hidden="true">/</span>
              <span>{dict.docs.sections[section]}</span>
            </>
          ) : null}
          <span aria-hidden="true">/</span>
          <span className="text-text">{title}</span>
        </nav>

        <article className="mt-6 max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          {description !== "" ? <p className="mt-3 text-muted">{description}</p> : null}
          <div className="prose-docs mt-8">{children}</div>
        </article>

        {editHref ? (
          <p className="mt-12 text-xs text-muted">
            <a href={editHref} className="transition-colors hover:text-text" target="_blank" rel="noreferrer">
              {dict.docs.edit}
            </a>
          </p>
        ) : null}

        {footerNav ? <div className="mt-6 max-w-3xl border-t border-border pt-6 text-sm">{footerNav}</div> : null}
      </div>

      {headings && headings.length > 0 ? (
        <DocToc headings={headings} label={dict.docs.onThisPage} />
      ) : null}
    </div>
  );
}
