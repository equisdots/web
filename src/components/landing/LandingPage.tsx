import { Cta } from "./Cta";
import { DesignSystemSection } from "./DesignSystemSection";
import { Features } from "./Features";
import { FlowsSection } from "./FlowsSection";
import { Hero } from "./Hero";
import { PluginExplorer } from "./PluginExplorer";
import { RepoList } from "./RepoList";
import { StackSection } from "./StackSection";
import { StatsStrip } from "./StatsStrip";
import { WidgetGallery } from "./WidgetGallery";
import type { Locale } from "@/lib/i18n";

export function LandingPage({ locale }: { locale: Locale }) {
  return (
    <main>
      <Hero locale={locale} />
      <StatsStrip locale={locale} />
      <Features locale={locale} />
      <StackSection locale={locale} />
      <FlowsSection locale={locale} />
      <DesignSystemSection locale={locale} />
      <WidgetGallery locale={locale} />
      <PluginExplorer locale={locale} />
      <RepoList locale={locale} />
      <Cta locale={locale} />
    </main>
  );
}
