type MockProps = { className?: string };

const METRICS = [
  { label: "CPU", value: "62%", width: "w-[62%]", fill: "bg-c2" },
  { label: "RAM", value: "48%", width: "w-[48%]", fill: "bg-c3" },
  { label: "Disk", value: "71%", width: "w-[71%]", fill: "bg-c4" },
  { label: "GPU", value: "35%", width: "w-[35%]", fill: "bg-c1" },
];

const CORES = ["w-2/3", "w-1/3", "w-5/6", "w-1/2", "w-3/4", "w-2/5", "w-4/5", "w-3/5"];

export function SysMonMock({ className }: MockProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-surface ${className ?? ""}`}>
      <div className="p-4 font-sans">
        <div className="mb-3 flex items-center gap-2">
          <span className="grid grid-cols-2 gap-[2px]">
            <span className="size-1.5 rounded-[2px] bg-c5" />
            <span className="size-1.5 rounded-[2px] bg-c5/60" />
            <span className="size-1.5 rounded-[2px] bg-c5/60" />
            <span className="size-1.5 rounded-[2px] bg-c5" />
          </span>
          <h3 className="text-xs font-bold tracking-wide text-text">System Monitor</h3>
          <span className="ml-auto font-mono text-[9px] text-muted">3d 04h</span>
        </div>
        <div className="space-y-2.5">
          {METRICS.map((metric) => (
            <div key={metric.label} className="flex items-center gap-2">
              <span className="w-8 text-[10px] font-bold text-muted">{metric.label}</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                <span className={`block h-full rounded-full ${metric.fill} ${metric.width}`} />
              </span>
              <span className="w-8 text-right font-mono text-[10px] text-text">{metric.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-4 gap-1.5">
          {CORES.map((width, index) => (
            <div key={width} className="rounded-md border border-border/60 bg-surface-2/40 px-1.5 py-1">
              <span className="text-[8px] font-bold text-muted">C{index}</span>
              <span className="mt-1 block h-1 overflow-hidden rounded-full bg-surface">
                <span className={`block h-full rounded-full bg-c6/80 ${width}`} />
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 font-mono text-[9px] text-muted">
          <span className="rounded-full border border-border/70 bg-surface-2/50 px-2 py-0.5">54°C</span>
          <span className="rounded-full border border-border/70 bg-surface-2/50 px-2 py-0.5">312 procs</span>
          <span className="ml-auto">16 threads</span>
        </div>
      </div>
    </div>
  );
}
