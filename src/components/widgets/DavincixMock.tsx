type MockProps = { className?: string };

const TILES = [
  "bg-linear-to-br from-c5 via-c6 to-c2",
  "bg-linear-to-tr from-c1/80 via-c4 to-c3",
  "bg-linear-to-b from-c6 via-c5/70 to-c5",
  "bg-linear-to-br from-c2 via-c6/70 to-c6",
  "bg-linear-to-t from-c4 via-c1/70 to-c1",
  "bg-linear-to-br from-c3 via-c4 to-c1/80",
];

const FILTERS = ["All", "Vid", "Fav"];

export function DavincixMock({ className }: MockProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-surface ${className ?? ""}`}>
      <div className="p-4 font-sans">
        <div className="mb-3 flex items-center gap-2">
          <h3 className="text-xs font-bold tracking-wide text-text">Wallpaper</h3>
          <span className="ml-auto font-mono text-[9px] text-muted">DP-1</span>
        </div>
        <div className="mb-3 flex items-center gap-1.5">
          {FILTERS.map((filter, index) => (
            <span
              key={filter}
              className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                index === 0 ? "border-accent bg-accent/15 text-accent" : "border-border bg-surface-2/50 text-muted"
              }`}
            >
              {filter}
            </span>
          ))}
          <span className="size-3 rounded-full bg-c1/80" />
          <span className="size-3 rounded-full bg-c2/80" />
          <span className="size-3 rounded-full bg-c6/80" />
          <span className="ml-auto font-mono text-[9px] text-muted">6 items</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {TILES.map((tile, index) => {
            const selected = index === 0;
            return (
              <div
                key={tile}
                className={`relative aspect-[4/3] overflow-hidden rounded-xl ${tile} ${
                  selected ? "ring-2 ring-accent" : "opacity-80"
                }`}
              >
                {index === 1 ? (
                  <span className="absolute right-1.5 top-1.5 rounded-md bg-accent/80 px-1.5 py-0.5 font-mono text-[8px] font-bold text-accent-fg">
                    JS
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
