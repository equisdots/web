"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DocsSearch } from "@/components/docs/DocsSearch";
import type { DocMeta, DocSection } from "@/lib/docs";
import { getDict, localeFromPath } from "@/lib/i18n";

export function DocsSidebar({ nav }: { nav: { section: DocSection; docs: DocMeta[] }[] }) {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const dict = getDict(locale);
  const root = locale === "es" ? "/es" : "";
  const current = pathname.split("/").filter(Boolean).pop() ?? "";

  return (
    <div className="space-y-6 text-sm">
      <DocsSearch locale={locale} />

      <nav className="space-y-6" aria-label={dict.docs.sidebarTitle}>
        <Link
          href={`${root}/docs`}
          className={`block transition-colors ${
            current === "docs" ? "font-medium text-text" : "text-muted hover:text-text"
          }`}
        >
          {dict.docs.title}
        </Link>

        {nav.map((group) => (
          <div key={group.section}>
            <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
              {dict.docs.sections[group.section]}
            </h2>
            <ul className="space-y-1.5 border-l border-border">
              {group.docs.map((doc) => {
                const active = current === doc.slug;
                return (
                  <li key={doc.slug}>
                    <Link
                      href={`${root}/docs/${doc.slug}`}
                      className={`-ml-px block border-l px-3 py-0.5 transition-colors ${
                        active
                          ? "border-accent font-medium text-text"
                          : "border-transparent text-muted hover:text-text"
                      }`}
                    >
                      {doc.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}
