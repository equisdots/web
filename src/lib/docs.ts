import fs from "node:fs";
import path from "node:path";
import { Marked, type RendererObject, type Tokens } from "marked";
import type { Locale } from "./i18n";

export const DOC_SECTIONS = ["start", "desktop", "wallpapers", "more"] as const;
export type DocSection = (typeof DOC_SECTIONS)[number];

export type DocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type DocMeta = {
  slug: string;
  title: string;
  description: string;
  order: number;
  section: DocSection;
};

export type Doc = DocMeta & { html: string; headings: DocHeading[] };

const CONTENT_DIR = path.join(process.cwd(), "content", "docs");

export const EDIT_BASE = "https://github.com/equisdots/web/blob/main/content/docs";

export function editUrl(locale: Locale, slug: string): string {
  return `${EDIT_BASE}/${locale}/${slug}.md`;
}

function isSection(value: string): value is DocSection {
  return (DOC_SECTIONS as readonly string[]).includes(value);
}

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  if (!raw.startsWith("---")) {
    return { data: {}, body: raw };
  }
  const end = raw.indexOf("\n---", 3);
  if (end === -1) {
    return { data: {}, body: raw };
  }
  const head = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).replace(/^\s*\n/, "");
  const data: Record<string, string> = {};
  for (const line of head.split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line
      .slice(separator + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (key !== "") data[key] = value;
  }
  return { data, body };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function renderMarkdown(body: string): { html: string; headings: DocHeading[] } {
  const headings: DocHeading[] = [];
  const used = new Map<string, number>();

  const renderer: RendererObject = {
    heading(token: Tokens.Heading): string {
      const inline = this.parser.parseInline(token.tokens);
      const plain = inline.replace(/<[^>]*>/g, "");
      const base = slugify(plain) || `section-${headings.length + 1}`;
      const seen = used.get(base) ?? 0;
      used.set(base, seen + 1);
      const id = seen === 0 ? base : `${base}-${seen}`;
      if (token.depth === 2 || token.depth === 3) {
        headings.push({ id, text: plain, level: token.depth });
      }
      return `<h${token.depth} id="${id}">${inline}</h${token.depth}>\n`;
    },
  };

  const marked = new Marked({ gfm: true, renderer });
  const html = marked.parse(body, { async: false }) as string;
  return { html, headings };
}

function docPath(locale: Locale, slug: string): string {
  return path.join(CONTENT_DIR, locale, `${slug}.md`);
}

export function getDocSlugs(locale: Locale): string[] {
  const dir = path.join(CONTENT_DIR, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getDocsMeta(locale: Locale): DocMeta[] {
  const docs: DocMeta[] = [];
  for (const slug of getDocSlugs(locale)) {
    const raw = fs.readFileSync(docPath(locale, slug), "utf8");
    const { data } = parseFrontmatter(raw);
    docs.push({
      slug,
      title: data.title ?? slug,
      description: data.description ?? "",
      order: Number.parseInt(data.order ?? "999", 10),
      section: isSection(data.section ?? "") ? (data.section as DocSection) : "more",
    });
  }
  return docs.sort((a, b) => a.order - b.order);
}

export function getDoc(locale: Locale, slug: string): Doc | null {
  const file = docPath(locale, slug);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, body } = parseFrontmatter(raw);
  const { html, headings } = renderMarkdown(body);
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    order: Number.parseInt(data.order ?? "999", 10),
    section: isSection(data.section ?? "") ? (data.section as DocSection) : "more",
    html,
    headings,
  };
}

export function getDocsNav(locale: Locale): { section: DocSection; docs: DocMeta[] }[] {
  const meta = getDocsMeta(locale);
  return DOC_SECTIONS.map((section) => ({
    section,
    docs: meta.filter((doc) => doc.section === section),
  })).filter((group) => group.docs.length > 0);
}
