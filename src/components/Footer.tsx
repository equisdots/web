"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { withBasePath } from "@/lib/base-path";
import { getDict, localeFromPath } from "@/lib/i18n";

const COLUMNS: { key: "project" | "resources" | "more"; repos: { name: string; href: string }[] }[] = [
  {
    key: "project",
    repos: [
      { name: "dots", href: "https://github.com/equisdots/dots" },
      { name: "hyprland", href: "https://github.com/equisdots/hyprland" },
      { name: "shell", href: "https://github.com/equisdots/shell" },
      { name: "davincix", href: "https://github.com/equisdots/davincix" },
    ],
  },
  {
    key: "resources",
    repos: [
      { name: "palettes", href: "https://github.com/equisdots/palettes" },
      { name: "theme-sync", href: "https://github.com/equisdots/theme-sync" },
      { name: "background", href: "https://github.com/equisdots/background" },
      { name: "xwww", href: "https://github.com/x-ports/xwww" },
    ],
  },
  {
    key: "more",
    repos: [
      { name: "timex", href: "https://github.com/equisdots/timex" },
      { name: "xturing", href: "https://github.com/equisdots/xturing" },
      { name: "login", href: "https://github.com/equisdots/login" },
      { name: ".github", href: "https://github.com/equisdots/.github" },
    ],
  },
];

export function Footer() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const dict = getDict(locale);
  const root = locale === "es" ? "/es" : "";

  return (
    <footer className="border-t border-border">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={withBasePath("/logos/equisdots-icon.svg")} alt="" width={22} height={22} className="rounded" />
            <span className="text-sm font-semibold tracking-tight">equisdots</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted">{dict.footer.tagline}</p>
          <p className="mt-4 text-xs text-muted">{dict.footer.built}</p>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.key}>
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted">{dict.footer[column.key]}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {column.repos.map((repo) => (
                <li key={repo.name}>
                  <a href={repo.href} className="text-muted transition-colors hover:text-text" target="_blank" rel="noreferrer">
                    {repo.name}
                  </a>
                </li>
              ))}
              {column.key === "project" ? (
                <li>
                  <Link href={`${root}/docs`} className="text-muted transition-colors hover:text-text">
                    {dict.footer.docs}
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{dict.footer.license}</p>
          <p>
            © {new Date().getFullYear()} xscriptor ·{" "}
            <a href="https://github.com/equisdots" className="transition-colors hover:text-text" target="_blank" rel="noreferrer">
              github.com/equisdots
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
