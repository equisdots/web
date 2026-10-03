"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDict, localeFromPath, switchLocalePath, type Locale } from "@/lib/i18n";

export function LanguageSwitch() {
  const pathname = usePathname();
  const current = localeFromPath(pathname);
  const dict = getDict(current);
  const targets: { locale: Locale; label: string }[] = [
    { locale: "en", label: "EN" },
    { locale: "es", label: "ES" },
  ];

  return (
    <div className="flex items-center gap-2 text-xs" role="group" aria-label={dict.lang.label}>
      {targets.map(({ locale, label }) => {
        const active = current === locale;
        return (
          <Link
            key={locale}
            href={switchLocalePath(pathname, locale)}
            aria-current={active ? "true" : undefined}
            className={`transition-colors ${active ? "font-medium text-text" : "text-muted hover:text-text"}`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
