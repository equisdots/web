type MockProps = { className?: string };

const BARS = [
  "h-2",
  "h-4",
  "h-7",
  "h-5",
  "h-9",
  "h-6",
  "h-3",
  "h-8",
  "h-10",
  "h-6",
  "h-4",
  "h-8",
  "h-5",
  "h-7",
  "h-3",
  "h-5",
];

export function WidgetsMock({ className }: MockProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-surface ${className ?? ""}`}>
      <div className="absolute inset-0 bg-linear-to-br from-c5/40 via-bg to-c6/30" />
      <div className="absolute -left-10 -top-12 size-36 rounded-full bg-c6/30 blur-2xl" />
      <div className="absolute -bottom-14 -right-8 size-40 rounded-full bg-c5/30 blur-2xl" />
      <div className="relative h-48 p-4 font-sans">
        <div className="absolute left-4 top-4 w-36 rounded-2xl border border-border/60 bg-surface/70 p-3 shadow-sm backdrop-blur">
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-black tracking-tight text-text">14:32</span>
            <span className="font-mono text-[10px] font-bold text-accent">:07</span>
          </div>
          <p className="text-[9px] text-muted">Saturday, October 03</p>
          <span className="mt-2 block h-0.5 w-10 rounded-full bg-accent/70" />
        </div>
        <div className="absolute right-4 top-7 flex items-center gap-2 rounded-full border border-border/60 bg-surface/70 px-3 py-1.5 shadow-sm backdrop-blur">
          <span className="size-3 rounded-full bg-c3 ring-4 ring-c3/30" />
          <span className="font-mono text-xs font-bold text-text">22°</span>
          <span className="text-[9px] text-muted">Clear</span>
        </div>
        <div className="absolute bottom-4 left-1/2 w-48 -translate-x-1/2 rounded-xl border border-border/60 bg-surface/60 p-2.5 shadow-sm backdrop-blur">
          <p className="mb-1.5 text-[8px] font-bold uppercase tracking-[0.2em] text-muted">Visualizer · Cava</p>
          <div className="flex h-10 items-end gap-[3px]">
            {BARS.map((height, index) => (
              <span
                key={index}
                className={`flex-1 rounded-full ${height} ${index % 2 === 0 ? "bg-c5/80" : "bg-c6/70"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
