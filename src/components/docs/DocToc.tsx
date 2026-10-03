"use client";

import { useEffect, useState } from "react";

export type TocHeading = { id: string; text: string; level: 2 | 3 };

/** Sticky table of contents with an IntersectionObserver scroll-spy. */
export function DocToc({ headings, label }: { headings: TocHeading[]; label: string }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    const update = () => {
      let current = elements[0]?.id ?? "";
      for (const element of elements) {
        if (element.getBoundingClientRect().top <= 128) current = element.id;
      }
      setActiveId(current);
    };

    const observer = new IntersectionObserver(update, { rootMargin: "-112px 0px -66% 0px" });
    for (const element of elements) observer.observe(element);
    update();
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden w-56 shrink-0 xl:block">
      <nav className="sticky top-20 pb-10 text-sm" aria-label={label}>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
        <ul className="space-y-1 border-l border-border">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={activeId === heading.id ? "location" : undefined}
                className={`-ml-px block border-l py-1.5 transition-colors ${heading.level === 3 ? "pl-6" : "pl-3"} ${
                  activeId === heading.id
                    ? "border-accent font-medium text-accent"
                    : "border-transparent text-muted hover:border-border hover:text-text"
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
