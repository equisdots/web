#!/usr/bin/env node
/**
 * Builds public/search-index.{en,es}.json for the docs search dialog.
 * Usage (from `web/`): node scripts/build-search-index.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_DIR = path.join(ROOT, "content", "docs");
const PUBLIC_DIR = path.join(ROOT, "public");
const LOCALES = ["en", "es"];
const SECTIONS = new Set(["start", "desktop", "wallpapers", "more"]);
const TEXT_LIMIT = 5000;

function parseFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(raw);
  if (match === null) return { data: {}, body: raw };
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    if (key !== "") data[key] = value;
  }
  return { data, body: raw.slice(match[0].length) };
}

function extractHeadings(body) {
  const headings = [];
  let fence = false;
  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(?:```|~~~)/.test(line)) {
      fence = !fence;
      continue;
    }
    if (fence) continue;
    const heading = /^#{2,3}\s+(.+?)\s*#*\s*$/.exec(line);
    if (heading !== null) headings.push(heading[1].trim());
  }
  return headings;
}

function stripMarkdown(body) {
  return body
    .replace(/^[ \t]*(?:```|~~~)[^\n]*$/gm, "") // fence lines: keep code, drop backticks
    .replace(/`([^`]*)`/g, "$1") // inline code
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // images -> alt text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links -> label
    .replace(/(\*\*|__)(.+?)\1/g, "$2") // bold
    .replace(/(\*|_)(?=\S)(.+?)(?<=\S)\1/g, "$2") // italic
    .replace(/~~(.+?)~~/g, "$1") // strikethrough
    .replace(/^#{1,6}\s+/gm, "") // heading markers
    .replace(/^>\s?/gm, "") // blockquotes
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, "") // list markers
    .replace(/^ {0,3}([-*_])(?:\s*\1){2,}\s*$/gm, "") // horizontal rules
    .replace(/^\s*\|?[-: |]+\|?\s*$/gm, "") // table separators
    .replace(/\|/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readPages(locale) {
  const dir = path.join(CONTENT_DIR, locale);
  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((file) => file.endsWith(".md")).sort()
    : [];
  const pages = files.map((file) => {
    const { data, body } = parseFrontmatter(fs.readFileSync(path.join(dir, file), "utf8"));
    const slug = file.replace(/\.md$/, "");
    const order = Number.parseInt(data.order ?? "", 10);
    return {
      slug,
      title: data.title ?? slug,
      description: data.description ?? "",
      order: Number.isNaN(order) ? 999 : order,
      section: SECTIONS.has(data.section ?? "") ? data.section : "more",
      headings: extractHeadings(body),
      text: stripMarkdown(body).slice(0, TEXT_LIMIT),
    };
  });
  return pages.sort((a, b) => a.order - b.order);
}

fs.mkdirSync(PUBLIC_DIR, { recursive: true });
const counts = LOCALES.map((locale) => {
  const pages = readPages(locale).map(({ order, ...page }) => page);
  fs.writeFileSync(
    path.join(PUBLIC_DIR, `search-index.${locale}.json`),
    `${JSON.stringify({ locale, pages }, null, 2)}\n`,
  );
  return `${locale}: ${pages.length}`;
});
console.log(`[search-index] pages ${counts.join(" | ")} -> public/search-index.{${LOCALES.join(",")}}.json`);
