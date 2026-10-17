type MockProps = { className?: string };

function Mascot() {
  return (
    <span className="relative flex size-7 items-end justify-center rounded-full bg-c4/25 ring-1 ring-c4/50">
      <span className="absolute -top-1.5 left-1 size-0 border-x-[4px] border-b-[7px] border-x-transparent border-b-c4/80" />
      <span className="absolute -top-1.5 right-1 size-0 border-x-[4px] border-b-[7px] border-x-transparent border-b-c4/80" />
      <span className="mb-2.5 flex gap-1">
        <span className="size-1 rounded-full bg-text" />
        <span className="size-1 rounded-full bg-text" />
      </span>
      <span className="absolute bottom-1 h-1 w-2 rounded-b-full border-b border-x border-c4/80" />
    </span>
  );
}

const CARDS = [
  { label: "Palette", glyph: "◐" },
  { label: "Weather", glyph: "☼" },
  { label: "Music", glyph: "♫" },
  { label: "Monitor", glyph: "▤" },
  { label: "Notes", glyph: "▦" },
  { label: "Settings", glyph: "⚙" },
];

export function NyxMock({ className }: MockProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-surface ${className ?? ""}`}>
      <div className="absolute inset-0 bg-linear-to-br from-c4/20 via-bg to-c6/20" />
      <div className="absolute -right-10 -top-12 size-32 rounded-full bg-c4/25 blur-2xl" />
      <div className="relative p-4 font-sans">
        <div className="mx-auto flex w-fit items-center gap-2.5 rounded-full border border-c4/50 bg-bg/80 px-3 py-1.5 shadow-sm backdrop-blur">
          <Mascot />
          <span className="font-mono text-[11px] font-bold text-text">14:32</span>
          <span className="h-3 w-px bg-border" />
          <span className="font-mono text-[9px] text-muted">18°</span>
          <span className="flex items-center gap-1 font-mono text-[9px] text-c2">
            <span className="size-1.5 rounded-full bg-c2" />
            42%
          </span>
        </div>

        <div className="mx-auto mt-3 w-[86%] rounded-2xl border border-border bg-surface/85 p-3 shadow-lg backdrop-blur">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-bg/60 px-2.5 py-1.5">
            <span className="text-[10px] text-muted">⌕</span>
            <span className="text-[10px] text-muted">Search widgets, actions…</span>
            <span className="ml-auto rounded border border-border px-1 font-mono text-[8px] text-muted">⌘K</span>
          </div>

          <div className="mt-2.5 flex items-end justify-between">
            <div>
              <p className="font-mono text-2xl font-black tracking-tight text-text">14:32</p>
              <p className="text-[9px] text-muted">Saturday, October 03</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-border/70 bg-surface-2/60 px-2 py-1">
              <span className="size-2.5 rounded-full bg-c3 ring-2 ring-c3/25" />
              <span className="font-mono text-[9px] font-bold text-text">22°</span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {CARDS.map((card, index) => (
              <div
                key={card.label}
                className={`rounded-lg border px-2 py-1.5 ${
                  index === 0 ? "border-accent/50 bg-accent/10" : "border-border/70 bg-surface-2/40"
                }`}
              >
                <span className={`text-xs ${index === 0 ? "text-accent" : "text-c6"}`}>{card.glyph}</span>
                <p className="mt-0.5 truncate text-[8px] font-bold text-muted">{card.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-2 flex items-center gap-1.5">
            <span className="rounded-full bg-c5/15 px-2 py-0.5 font-mono text-[8px] text-c5">Favorites</span>
            <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[8px] text-muted">All</span>
            <span className="ml-auto font-mono text-[8px] text-muted">2 / 5</span>
          </div>
        </div>
      </div>
    </div>
  );
}
