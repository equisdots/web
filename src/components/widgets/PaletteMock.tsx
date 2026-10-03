type MockProps = { className?: string };

const PALETTES = [
  { name: "Lahabana", swatches: ["bg-c1", "bg-c3", "bg-c5", "bg-c6"] },
  { name: "Tokio", swatches: ["bg-c6", "bg-c5", "bg-c2", "bg-c1"] },
  { name: "Bogota", swatches: ["bg-c1", "bg-c2", "bg-c3", "bg-c6"] },
  { name: "Madrid", swatches: ["bg-c4", "bg-c1", "bg-c3", "bg-muted"] },
  { name: "Helsinki", swatches: ["bg-c6", "bg-c5", "bg-c4", "bg-c2"] },
  { name: "Paris", swatches: ["bg-c5", "bg-c1", "bg-c6", "bg-c3"] },
  { name: "Miami", swatches: ["bg-c6", "bg-c4", "bg-c1", "bg-c5"] },
  { name: "Oslo", swatches: ["bg-c6", "bg-c2", "bg-muted", "bg-c5"] },
  { name: "Praha", swatches: ["bg-c3", "bg-c4", "bg-c1", "bg-c6"] },
];

export function PaletteMock({ className }: MockProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-surface ${className ?? ""}`}>
      <div className="p-4 font-sans">
        <div className="mb-3 flex items-center gap-2">
          <h3 className="text-lg font-black tracking-tight text-text">Palette</h3>
          <span className="ml-auto font-mono text-[10px] text-muted">lahabana</span>
          <span className="flex size-4 items-center justify-center rounded-full border border-accent/60 bg-accent/20">
            <span className="size-2 rounded-full bg-accent" />
          </span>
        </div>
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-border bg-surface-2/60 px-3 py-2">
          <span className="relative size-3 shrink-0">
            <span className="absolute inset-0 rounded-full border border-muted" />
            <span className="absolute -bottom-px right-0 h-1.5 w-[2px] rotate-45 rounded-full bg-muted" />
          </span>
          <span className="text-xs text-muted">Filter palettes</span>
          <span className="ml-1 h-3 w-[2px] bg-accent/70" />
        </div>
        <p className="mb-2 text-center text-[9px] font-black uppercase tracking-[0.2em] text-muted">X</p>
        <div className="grid grid-cols-3 gap-2">
          {PALETTES.map((palette, index) => {
            const active = index === 0;
            return (
              <div
                key={palette.name}
                className={`flex items-center gap-2 rounded-xl border px-2 py-1.5 ${
                  active ? "border-accent bg-accent/15" : "border-border bg-surface-2/50"
                }`}
              >
                <span className="grid shrink-0 grid-cols-2 gap-[3px]">
                  {palette.swatches.map((swatch) => (
                    <span key={swatch} className={`size-2 rounded-[3px] ${swatch}`} />
                  ))}
                </span>
                <span className={`truncate text-[10px] ${active ? "font-bold text-accent" : "text-text"}`}>
                  {palette.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
