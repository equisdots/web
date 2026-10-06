import type { ReactNode } from "react";

type MockProps = { className?: string };

function Island({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-full border border-border bg-surface-2/70 px-3 py-1.5 shadow-sm backdrop-blur-sm ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

function Chip({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <span className="flex items-center gap-1 rounded-full border border-border/70 bg-surface px-1.5 py-0.5 font-mono text-[10px] text-muted">
      {children}
      {label ? <span>{label}</span> : null}
    </span>
  );
}

function CpuGlyph() {
  return (
    <span className="flex items-end gap-[2px]">
      <span className="h-1 w-[2px] rounded-full bg-c2" />
      <span className="h-2 w-[2px] rounded-full bg-c2" />
      <span className="h-1.5 w-[2px] rounded-full bg-c2/70" />
    </span>
  );
}

function RamGlyph() {
  return (
    <span className="flex flex-col gap-[2px]">
      <span className="h-[2px] w-2 rounded-full bg-c6/80" />
      <span className="h-[2px] w-2 rounded-full bg-c6/50" />
    </span>
  );
}

function BatteryGlyph() {
  return (
    <span className="flex items-center gap-[2px]">
      <span className="flex h-2.5 w-5 rounded-[3px] border border-muted/60 p-[1px]">
        <span className="h-full w-2/3 rounded-[1px] bg-c2/80" />
      </span>
      <span className="h-1 w-[2px] rounded-r-full bg-muted/60" />
    </span>
  );
}

function VolumeGlyph() {
  return (
    <span className="flex items-center gap-[2px]">
      <span className="size-0 border-y-[3px] border-y-transparent border-l-[4px] border-l-muted" />
      <span className="h-2 w-[3px] rounded-r-full border-y border-r border-muted" />
    </span>
  );
}

export function BarMock({ className }: MockProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-surface ${className ?? ""}`}>
      <div className="bg-linear-to-b from-bg/70 via-surface to-surface px-4 pt-4">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-between">
          <Island>
            <span className="flex size-5 items-center justify-center rounded-full bg-accent font-mono text-[10px] font-bold text-accent-fg">
              2
            </span>
            {[0, 1, 2, 3].map((dot) => (
              <span
                key={dot}
                className={`size-1.5 rounded-full ${dot === 2 ? "bg-muted/80" : "bg-muted/40"}`}
              />
            ))}
          </Island>
          <Island className="gap-1.5 border-accent/60 bg-accent/15">
            <span className="font-mono text-sm font-bold text-accent">14:32</span>
            <span className="font-mono text-[10px] text-accent/70">:07</span>
            <span className="hidden text-[10px] text-muted sm:inline">Sat, Oct 03</span>
          </Island>
          <Island className="flex-wrap justify-center gap-1.5">
            <Chip label="18%">
              <CpuGlyph />
            </Chip>
            <Chip label="42%">
              <RamGlyph />
            </Chip>
            <Chip label="86%">
              <BatteryGlyph />
            </Chip>
            <Chip>
              <VolumeGlyph />
            </Chip>
          </Island>
        </div>
        <div className="mt-6 h-12 rounded-t-xl border border-b-0 border-border/60 bg-surface-2/30" />
      </div>
    </div>
  );
}
