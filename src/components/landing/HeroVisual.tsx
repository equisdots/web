import { BarMock, PaletteMock, TimexMock } from "@/components/widgets";

export function HeroVisual() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-8 -top-10 bottom-4 rounded-[3rem] blur-2xl"
        style={{
          backgroundImage:
            "linear-gradient(180deg, color-mix(in srgb, var(--c5) 14%, transparent), transparent 70%)",
        }}
      />
      <div className="relative rounded-2xl border border-border bg-surface p-3 shadow-2xl">
        <BarMock />
        <div className="mt-3 grid gap-3 md:grid-cols-[1.05fr_0.95fr]">
          <PaletteMock />
          <TimexMock />
        </div>
      </div>
    </div>
  );
}
