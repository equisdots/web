"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { LanguageSwitch } from "./LanguageSwitch";
import { ThemeToggle } from "./ThemeToggle";
import { withBasePath } from "@/lib/base-path";
import { getDict, localeFromPath } from "@/lib/i18n";

export function Navbar() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const dict = getDict(locale);
  const root = locale === "es" ? "/es" : "";

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const links = [
    { href: root === "" ? "/" : root, label: dict.nav.home },
    { href: `${root}/docs`, label: dict.nav.docs },
    { href: `${root}/previews`, label: dict.nav.previews },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur">
      <div className="container-page flex h-14 items-center gap-6">
        <Link href={root === "" ? "/" : root} className="flex shrink-0 items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={withBasePath("/logos/equisdots-icon.svg")} alt="" width={22} height={22} className="rounded" />
          <span className="text-sm font-semibold tracking-tight">equisdots</span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm sm:flex" aria-label="Main">
          {links.map((link) => {
            const active = link.href === "/" || link.href === "/es" ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${active ? "text-text" : "text-muted hover:text-text"}`}
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href="https://github.com/equisdots"
            className="text-muted transition-colors hover:text-text"
            rel="noreferrer"
            target="_blank"
          >
            {dict.nav.github}
          </a>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <LanguageSwitch />
          <ThemeToggle dict={dict} />
        </div>
      </div>
    </header>
  );
}
