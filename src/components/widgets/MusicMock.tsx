type MockProps = { className?: string };

const BARS = [
  "h-3",
  "h-5",
  "h-8",
  "h-6",
  "h-10",
  "h-7",
  "h-4",
  "h-9",
  "h-12",
  "h-8",
  "h-5",
  "h-11",
  "h-7",
  "h-9",
  "h-6",
  "h-10",
  "h-4",
  "h-8",
  "h-12",
  "h-7",
  "h-5",
  "h-9",
  "h-6",
  "h-3",
];

export function MusicMock({ className }: MockProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-surface ${className ?? ""}`}>
      <div className="p-4 font-sans">
        <div className="flex items-center gap-3">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-c5 via-c5/80 to-c6 shadow-sm">
            <div className="size-8 rounded-full border-4 border-bg/40" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-text">Midnight Drive</p>
            <p className="mt-0.5 truncate text-[9px] font-bold uppercase tracking-[0.15em] text-muted">
              By Neon Runner
            </p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-border/70 bg-surface-2/60 px-2 py-0.5 font-mono text-[9px] text-muted">
              <span className="size-1.5 rounded-full bg-c6" />
              Speaker
            </span>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full w-[42%] rounded-full bg-c5" />
          </div>
          <div className="mt-1 flex justify-between font-mono text-[9px] text-muted">
            <span>01:24</span>
            <span>03:58</span>
          </div>
        </div>
        <div className="mt-3 flex h-12 items-end gap-1 rounded-xl border border-border bg-surface-2/40 p-2">
          {BARS.map((height, index) => (
            <span
              key={index}
              className={`flex-1 rounded-full ${height} ${index % 2 === 0 ? "bg-c5/80" : "bg-c6/70"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
