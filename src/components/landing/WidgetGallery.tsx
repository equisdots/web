import type { ComponentType } from "react";
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
    <section className="border-t border-border bg-surface/30">
      <div className="container-page py-16">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight">{dict.home.widgetsTitle}</h2>
          <p className="mt-2 text-muted">{dict.home.widgetsSubtitle}</p>
        </div>

        <div className="mt-10 grid gap-x-6 gap-y-10 md:grid-cols-2">
          {ITEMS.map(({ key, Component }) => (
            <figure key={key}>
              <div className="rounded-2xl border border-border bg-bg p-3">
                <Component />
              </div>
              <figcaption className="mt-4">
                <h3 className="text-sm font-medium">{dict.widgets[key]}</h3>
                <p className="mt-1 text-sm leading-6 text-muted">{dict.widgetNotes[key]}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
