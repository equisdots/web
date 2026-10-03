import Link from "next/link";
import { getDict, type Locale } from "@/lib/i18n";

export function Cta({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const root = locale === "es" ? "/es" : "";

  return (
    <section className="border-t border-border">
      <div className="container-page py-20 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">{dict.home.ctaTitle}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">{dict.home.ctaText}</p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link href={`${root}/docs`} className="btn btn-primary">
            {dict.hero.docs}
          </Link>
          <a href="https://github.com/equisdots" target="_blank" rel="noreferrer" className="btn">
            {dict.nav.github}
          </a>
        </div>
      </div>
    </section>
  );
}
