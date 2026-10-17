import { Cta } from "./Cta";
import { Features } from "./Features";
import { FlowsSection } from "./FlowsSection";
import { Hero } from "./Hero";
import { RepoList } from "./RepoList";
import { StackSection } from "./StackSection";
import { WidgetGallery } from "./WidgetGallery";
import type { Locale } from "@/lib/i18n";

export function LandingPage({ locale }: { locale: Locale }) {
  return (
    <main>
      <Hero locale={locale} />
      <Features locale={locale} />
      <StackSection locale={locale} />
      <FlowsSection locale={locale} />
      <WidgetGallery locale={locale} />
      <RepoList locale={locale} />
      <Cta locale={locale} />
    </main>
  );
}
