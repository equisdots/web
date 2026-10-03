type MockProps = { className?: string };

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const DAYS = ["28", "29", "30", ...Array.from({ length: 31 }, (_, i) => `${i + 1}`), "1"];
const HOURS = [
  { time: "15", temp: "19°" },
  { time: "18", temp: "18°" },
  { time: "21", temp: "16°" },
  { time: "00", temp: "14°" },
];

export function TimexMock({ className }: MockProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-surface ${className ?? ""}`}>
      <div className="font-sans">
        <div className="border-b border-border/60 px-4 py-3 text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className="font-mono text-3xl font-black tracking-tight text-text">14:32</span>
            <span className="font-mono text-sm font-bold text-accent">:07</span>
          </div>
          <p className="mt-0.5 text-[10px] text-muted">Saturday, October 03</p>
        </div>
        <div className="p-3">
          <div className="rounded-xl border border-border bg-surface-2/40 p-2.5">
            <div className="mb-2 flex items-center justify-between text-[10px] font-black tracking-widest text-text">
              <span className="text-muted">‹</span>
              <span>OCTOBER 2026</span>
              <span className="text-muted">›</span>
            </div>
            <div className="mb-1 grid grid-cols-7 text-center text-[8px] font-bold text-muted">
              {WEEKDAYS.map((day, index) => (
                <span key={index}>{day}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {DAYS.map((day, index) => {
                const current = index >= 3 && index <= 33;
                const today = index === 5;
                return (
                  <span
                    key={index}
                    className={`flex aspect-square items-center justify-center rounded-md text-[9px] ${
                      today ? "bg-accent font-black text-accent-fg" : current ? "text-text" : "text-muted/40"
                    }`}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-surface-2/40 px-2.5 py-2">
            <span className="relative size-4 shrink-0">
              <span className="absolute inset-0 rounded-full bg-c3" />
              <span className="absolute -right-1 -top-1 size-2 rounded-full bg-c3/40" />
            </span>
            <div className="leading-tight">
              <p className="text-xs font-bold text-text">18°</p>
              <p className="text-[9px] text-muted">Partly cloudy</p>
            </div>
            <div className="ml-auto flex items-end gap-1">
              {HOURS.map((hour, index) => (
                <div
                  key={hour.time}
                  className={`flex flex-col items-center rounded-lg px-1.5 py-1 text-[9px] ${
                    index === 0 ? "bg-accent/15" : ""
                  }`}
                >
                  <span className="font-mono text-muted">{hour.time}</span>
                  <span className={`font-bold ${index === 0 ? "text-accent" : "text-text"}`}>{hour.temp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
