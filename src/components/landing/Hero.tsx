import Link from "next/link";
import { CopyCommand } from "@/components/CopyCommand";
import { HeroVisual } from "./HeroVisual";
import { getDict, type Locale } from "@/lib/i18n";

const INSTALL_COMMAND =
  "bash <(curl -fsSL https://raw.githubusercontent.com/equisdots/dots/main/dots) setup";

export function Hero({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const root = locale === "es" ? "/es" : "";

  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-20 sm:pt-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[440px] opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(45% 60% at 50% 0%, var(--c5), transparent 70%), radial-gradient(35% 45% at 85% 8%, var(--c6), transparent 70%), radial-gradient(35% 45% at 15% 12%, var(--c1), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <p className="eyebrow">{dict.hero.eyebrow}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">{dict.hero.title}</h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted">{dict.hero.subtitle}</p>

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

      <div className="relative mx-auto mt-16 max-w-5xl">
        <HeroVisual />
      </div>

      <p className="relative mt-8 text-center text-xs text-muted">{dict.hero.paletteNote}</p>
    </section>
  );
}
