import { BASE_PATH } from "@/lib/base-path";
import type { Locale } from "@/lib/i18n";

export type SearchPage = {
  slug: string;
  title: string;
  description: string;
  section: string;
  headings: string[];
  text: string;
};

export type SearchIndex = {
  locale: Locale;
  pages: SearchPage[];
};

/** Client-side loader for the prebuilt index; call it lazily from the search dialog. */
export async function loadSearchIndex(locale: Locale): Promise<SearchIndex> {
  const response = await fetch(`${BASE_PATH}/search-index.${locale}.json`);
  if (!response.ok) {
    throw new Error(`could not load search-index.${locale}.json (${response.status})`);
  }
  const data = (await response.json()) as SearchIndex;
  if (data.locale !== locale || !Array.isArray(data.pages)) {
    throw new Error(`unexpected search-index.${locale}.json shape`);
  }
  return data;
}

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Relevance tier: title (4) > description (3) > headings (2) > text (1); 0 means no match. */
export function scorePage(page: SearchPage, query: string): number {
  if (query === "") return 1;
  const q = query.toLowerCase();
  if (page.title.toLowerCase().includes(q)) return 4;
  if (page.description.toLowerCase().includes(q)) return 3;
  if (page.headings.some((heading) => heading.toLowerCase().includes(q))) return 2;
  return page.text.toLowerCase().includes(q) ? 1 : 0;
}

/** Excerpt around the first match, drawn from text, description or headings in that order. */
export function pageSnippet(page: SearchPage, query: string): string {
  const q = query.toLowerCase();
  const source = page.text.toLowerCase().includes(q)
    ? page.text
    : page.description.toLowerCase().includes(q)
      ? page.description
      : page.headings.join(" · ");
  const at = q === "" ? 0 : source.toLowerCase().indexOf(q);
  const start = Math.max(0, at - 60);
  const end = at === -1 ? 140 : Math.min(source.length, at + q.length + 100);
  return `${start > 0 ? "..." : ""}${source.slice(start, end)}${end < source.length ? "..." : ""}`;
}
