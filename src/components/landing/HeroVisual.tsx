import { BarMock, PaletteMock, TimexMock } from "@/components/widgets";

export function HeroVisual({ label }: { label: string }) {
  return (
    <figure className="border border-border bg-bg p-3">
      <BarMock />
      <div className="mt-3 grid gap-3 md:grid-cols-[1.05fr_0.95fr]">
        <PaletteMock />
        <TimexMock />
      </div>
      <figcaption className="mt-3 flex items-center justify-between gap-4 border-t border-border px-1 pt-3">
        <span className="label">{label}</span>
        <span className="index">fig. 01</span>
      </figcaption>
    </figure>
  );
}
