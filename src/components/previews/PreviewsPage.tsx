import { ClipGallery, type ClipGroupView } from "./ClipGallery";
import { StillsGallery, type StillItem, type StillSection } from "./StillsGallery";
import { getDict, type Locale } from "@/lib/i18n";
import { CLIPS, SHOTS, SHOT_SECTIONS, shotById } from "@/lib/previews";

export function PreviewsPage({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const t = dict.previews;

  const stillSections: StillSection[] = SHOT_SECTIONS.map((section) => {
    const items: StillItem[] = section.shots.map((id) => {
      const shot = shotById(id);
      const text = t.shots[id] ?? { title: id, note: "" };
      return {
        id,
        title: text.title,
        note: text.note,
        kind: t.kinds[shot.kind],
        width: shot.width,
        height: shot.height,
        variantWidths: shot.variantWidths,
      };
    });

    const sectionText = t.sections[section.id];
    if (section.layout === "masonry") {
      const [strip, ...rest] = items;
      if (!strip) throw new Error(`Empty preview section: ${section.id}`);
      return { id: section.id, layout: "masonry", title: sectionText.title, note: sectionText.note, strip, items: rest };
    }
    return { id: section.id, layout: "feature", title: sectionText.title, note: sectionText.note, items };
  });

  const clipGroups: ClipGroupView[] = (["v1", "v2"] as const).map((groupId) => ({
    id: groupId,
    title: t.clipGroups[groupId].title,
    note: t.clipGroups[groupId].note,
    items: CLIPS.filter((clip) => clip.group === groupId).map((clip) => ({
      id: clip.id,
      label: `${t.clipLabel} ${String(clip.index).padStart(2, "0")}`,
    })),
  }));

  return (
    <main className="pb-20">
      <header className="container-wide pt-14">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">{t.title}</h1>
        <p className="mt-4 max-w-3xl leading-7 text-muted">{t.subtitle}</p>
        <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted">
          <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1">
            {SHOTS.length} {t.stats.shots}
          </span>
          <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1">
            {CLIPS.length} {t.stats.clips}
          </span>
        </div>
      </header>

      <StillsGallery
        sections={stillSections}
        labels={{ open: t.a11y.open, close: t.a11y.close, dialog: t.a11y.dialog }}
      />

      <section id="clips" className="container-wide mt-20">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">{t.sections.clips.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{t.sections.clips.note}</p>
          </div>
          <p className="font-mono text-xs text-muted">{t.clipMeta}</p>
        </div>
        <div className="mt-8">
          <ClipGallery groups={clipGroups} playLabel={t.a11y.play} pauseLabel={t.a11y.pause} />
        </div>
      </section>
    </main>
  );
}
