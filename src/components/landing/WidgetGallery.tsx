import type { ComponentType } from "react";
import { SectionHeader } from "./SectionHeader";
import {
  BarMock,
  DavincixMock,
  MusicMock,
  PaletteMock,
  SysMonMock,
  TerminalMock,
  TimexMock,
  WidgetsMock,
} from "@/components/widgets";
import { getDict, type Dict, type Locale } from "@/lib/i18n";

type WidgetKey = keyof Dict["widgets"];

const ITEMS: { key: WidgetKey; Component: ComponentType<{ className?: string }> }[] = [
  { key: "bar", Component: BarMock },
  { key: "palette", Component: PaletteMock },
  { key: "timex", Component: TimexMock },
  { key: "sysmon", Component: SysMonMock },
  { key: "davincix", Component: DavincixMock },
  { key: "music", Component: MusicMock },
  { key: "terminal", Component: TerminalMock },
  { key: "desktop", Component: WidgetsMock },
];

export function WidgetGallery({ locale }: { locale: Locale }) {
  const dict = getDict(locale);

  return (
    <section className="border-t border-border">
      <div className="container-page py-16">
        <SectionHeader
          index="02"
          label={dict.home.labels.widgets}
          title={dict.home.widgetsTitle}
          subtitle={dict.home.widgetsSubtitle}
        />

        <div className="mt-12 grid gap-x-6 gap-y-10 md:grid-cols-2">
          {ITEMS.map(({ key, Component }, index) => (
            <figure key={key} className="min-w-0">
              <div className="mb-3 flex items-baseline justify-between gap-4 border-t border-border pt-4">
                <h3 className="text-sm font-medium">{dict.widgets[key]}</h3>
                <span className="index">fig. {String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="border border-border bg-bg p-3">
                <Component />
              </div>
              <figcaption className="mt-3 text-sm leading-6 text-muted">{dict.widgetNotes[key]}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
