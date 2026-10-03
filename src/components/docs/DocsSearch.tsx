"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { escapeRegExp, loadSearchIndex, pageSnippet, scorePage, type SearchPage } from "@/lib/search";
import type { Locale } from "@/lib/i18n";

type DocsSearchProps = { locale: Locale; className?: string };
type Strings = { button: string; placeholder: string; dialog: string; loading: string; empty: string; error: string; sections: Record<string, string> };

const STRINGS: Record<Locale, Strings> = {
  en: {
    button: "Search documentation", placeholder: "Search documentation...", dialog: "Search documentation",
    loading: "Loading index...", empty: "No results", error: "The search index could not be loaded.",
    sections: { start: "Start here", desktop: "Desktop", wallpapers: "Wallpapers", more: "More" },
  },
  es: {
    button: "Buscar en la documentación", placeholder: "Buscar en la documentación...", dialog: "Buscar en la documentación",
    loading: "Cargando índice...", empty: "Sin resultados", error: "No se pudo cargar el índice de búsqueda.",
    sections: { start: "Empieza aquí", desktop: "Escritorio", wallpapers: "Fondos", more: "Más" },
  },
};

const MAX_RESULTS = 10;

function highlight(text: string, query: string): ReactNode {
  if (query === "") return text;
  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? <mark key={index} className="bg-transparent font-medium text-accent">{part}</mark> : part,
  );
}

export function DocsSearch({ locale, className }: DocsSearchProps) {
  const router = useRouter();
  const t = STRINGS[locale];
  const root = locale === "es" ? "/es" : "";
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [pages, setPages] = useState<SearchPage[]>([]);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const openDialog = () => {
    setQuery("");
    setActive(0);
    setOpen(true);
  };

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openDialog();
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPages([]);
    setStatus("idle");
  }, [locale]);

  useEffect(() => {
    if (!open || status !== "idle") return;
    setStatus("loading");
    loadSearchIndex(locale)
      .then((index) => {
        setPages(index.pages);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [open, status, locale]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim();
    return pages
      .map((page) => ({ page, score: scorePage(page, q) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_RESULTS)
      .map((entry) => entry.page);
  }, [pages, query]);

  const current = Math.max(0, Math.min(active, results.length - 1));

  useEffect(() => {
    if (open && results.length > 0) document.getElementById(`docs-search-option-${current}`)?.scrollIntoView({ block: "nearest" });
  }, [open, current, results.length]);

  function onInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive(Math.min(current + 1, Math.max(0, results.length - 1)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(Math.max(0, current - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const page = results[current];
      if (page) {
        setOpen(false);
        router.push(`${root}/docs/${page.slug}`);
      }
    } else if (event.key === "Escape" || event.key === "Tab") {
      event.preventDefault();
      if (event.key === "Escape") setOpen(false);
    }
  }

  return (
    <>
      <button type="button" onClick={openDialog} aria-haspopup="dialog" className={`inline-flex min-w-52 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted transition-colors hover:border-accent/50 hover:text-text ${className ?? ""}`}>
        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></svg>
        <span className="truncate">{t.button}</span>
        <kbd className="kbd ml-auto shrink-0">Ctrl K</kbd>
      </button>

      {open ? (
        <div role="presentation" className="fixed inset-0 z-50 flex items-center justify-center bg-bg/70 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <div role="dialog" aria-modal="true" aria-label={t.dialog} className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-bg shadow-2xl">
            <div className="flex items-center gap-3 border-b border-border px-4">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 text-muted"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" /></svg>
              <input ref={inputRef} value={query} onChange={(event) => { setQuery(event.target.value); setActive(0); }} onKeyDown={onInputKeyDown} placeholder={t.placeholder} aria-label={t.placeholder} role="combobox" aria-expanded aria-controls="docs-search-results" aria-activedescendant={results[current] ? `docs-search-option-${current}` : undefined} autoComplete="off" spellCheck={false} className="h-12 w-full bg-transparent text-sm text-text outline-none placeholder:text-muted" />
              <kbd className="kbd hidden shrink-0 sm:inline">Esc</kbd>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {status === "loading" ? <p className="px-3 py-6 text-center text-sm text-muted">{t.loading}</p> : null}
              {status === "error" ? <p className="px-3 py-6 text-center text-sm text-muted">{t.error}</p> : null}
              {status === "ready" && results.length === 0 ? <p className="px-3 py-6 text-center text-sm text-muted">{t.empty}</p> : null}
              {status === "ready" && results.length > 0 ? (
                <ul id="docs-search-results" role="listbox" aria-label={t.button} className="space-y-1">
                  {results.map((page, index) => (
                    <li key={page.slug} id={`docs-search-option-${index}`} role="option" aria-selected={index === current} onMouseMove={() => setActive(index)} onClick={() => { setOpen(false); router.push(`${root}/docs/${page.slug}`); }} className={`cursor-pointer rounded-lg px-3 py-2 transition-colors ${index === current ? "bg-surface-2" : ""}`}>
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-text">{highlight(page.title, query.trim())}</span>
                        <span className="pill ml-auto shrink-0">{t.sections[page.section] ?? page.section}</span>
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted">{highlight(pageSnippet(page, query.trim()), query.trim())}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
