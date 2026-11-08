"use client";

import { useState, type ComponentType } from "react";
import { SectionHeader } from "./SectionHeader";
import {
  BarMock,
  DavinciMock,
  MusicMock,
  NyxMock,
  PaletteMock,
  PluginsMock,
  SysMonMock,
  TerminalMock,
  TimexMock,
  WidgetsMock,
} from "@/components/widgets";
import { getDict, type Dict, type Locale } from "@/lib/i18n";

type WidgetKey = keyof Dict["widgets"];

const ITEMS: { key: WidgetKey; Component: ComponentType<{ className?: string }>; accent: string }[] = [
  { key: "bar", Component: BarMock, accent: "c6" },
  { key: "nyx", Component: NyxMock, accent: "c4" },
  { key: "palette", Component: PaletteMock, accent: "c5" },
  { key: "plugins", Component: PluginsMock, accent: "c2" },
  { key: "timex", Component: TimexMock, accent: "c3" },
  { key: "sysmon", Component: SysMonMock, accent: "c1" },
  { key: "davinci", Component: DavinciMock, accent: "c4" },
  { key: "music", Component: MusicMock, accent: "c1" },
  { key: "terminal", Component: TerminalMock, accent: "c3" },
  { key: "desktop", Component: WidgetsMock, accent: "c6" },
];

export function WidgetGallery({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const [active, setActive] = useState(0);
  const selected = ITEMS[active] ?? ITEMS[0]!;
  const Component = selected.Component;

  return (
    <section className="border-t border-border">
      <div className="container-wide py-16">
        <SectionHeader
          index="05"
          label={dict.home.labels.widgets}
          title={dict.home.widgetsTitle}
          subtitle={dict.home.widgetsSubtitle}
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <div
            role="tablist"
            aria-label={dict.home.labels.widgets}
            className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {ITEMS.map((item, index) => {
              const current = index === active;
              return (
                <button
                  key={item.key}
                  type="button"
                  id={`widget-tab-${item.key}`}
                  role="tab"
                  aria-selected={current}
                  aria-controls="widget-panel"
                  onClick={() => setActive(index)}
                  onMouseEnter={() => setActive(index)}
                  className={`flex min-w-max items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors lg:min-w-0 ${
                    current
                      ? "border-accent/50 bg-surface text-text"
                      : "border-border bg-bg/40 text-muted hover:border-border hover:bg-surface/60 hover:text-text"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="size-1.5 shrink-0 rounded-full transition-transform"
                    style={{
                      backgroundColor: `var(--${item.accent})`,
                      transform: current ? "scale(1.6)" : "scale(1)",
                    }}
                  />
                  <span className="text-sm font-medium">{dict.widgets[item.key]}</span>
                  <span className="ml-auto hidden font-mono text-[10px] text-muted lg:inline">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>

          <figure id="widget-panel" role="tabpanel" aria-labelledby={`widget-tab-${selected.key}`} className="min-w-0">
            <div className="mb-3 flex items-baseline justify-between gap-4 border-t border-border pt-4">
              <h3 className="text-sm font-medium">{dict.widgets[selected.key]}</h3>
              <span className="index">fig. {String(active + 1).padStart(2, "0")}</span>
            </div>
            <div className="border border-border bg-bg p-3">
              <Component />
            </div>
            <figcaption className="mt-3 text-sm leading-6 text-muted">{dict.widgetNotes[selected.key]}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
