import Link from "next/link";
import { CopyCommand } from "@/components/CopyCommand";
import { AsciiBrailleShadow } from "./AsciiLogo";
import { HeroVisual } from "./HeroVisual";
import { getDict, type Locale } from "@/lib/i18n";

const INSTALL_COMMAND =
  "bash <(curl -fsSL https://raw.githubusercontent.com/equisdots/dots/main/dots) setup";

export function Hero({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const root = locale === "es" ? "/es" : "";

  return (
    <section className="border-b border-border px-6 pb-16 pt-14 sm:pt-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="label">{dict.hero.eyebrow}</p>

        <div className="mt-10 flex flex-col items-center">
          <AsciiBrailleShadow />
          <hr className="x-rule mt-7 w-24" />
          <h1 className="mt-6 font-mono text-4xl font-medium tracking-[0.3em] text-text sm:text-5xl">
            <span className="sr-only">{dict.hero.title}</span>
            <span aria-hidden="true" className="pl-[0.3em]">
              {dict.hero.dots}
            </span>
          </h1>
        </div>

        <p className="mx-auto mt-8 max-w-xl text-base leading-7 text-muted">{dict.hero.subtitle}</p>

        <div className="mx-auto mt-8 max-w-xl">
          <CopyCommand command={INSTALL_COMMAND} copyLabel={dict.hero.copy} copiedLabel={dict.hero.copied} />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href={`${root}/docs`} className="btn btn-primary">
            {dict.hero.docs}
          </Link>
          <Link href={`${root}/previews`} className="btn">
            {dict.hero.previews}
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-5xl">
        <HeroVisual label={dict.hero.visualLabel} />
      </div>

      <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        {dict.hero.paletteNote}
      </p>
    </section>
  );
}
