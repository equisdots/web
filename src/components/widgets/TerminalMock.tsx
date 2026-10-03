import type { ReactNode } from "react";

type MockProps = { className?: string };

const PAGES = ["General", "Bar", "Theme", "Widgets", "System"];

function Line({ label, children, selected }: { label: string; children: ReactNode; selected?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between rounded px-1.5 py-0.5 ${
        selected ? "bg-accent/15 text-text" : "text-muted"
      }`}
    >
      <span className="flex items-center gap-1">
        {selected ? <span className="text-accent">▸</span> : <span className="w-2" />}
        {label}
      </span>
      <span className={selected ? "text-text" : "text-c6/80"}>{children}</span>
    </div>
  );
}

export function TerminalMock({ className }: MockProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-surface ${className ?? ""}`}>
      <div className="bg-bg font-mono text-[11px] leading-relaxed">
        <div className="flex items-center gap-2 border-b border-border bg-surface-2/70 px-3 py-2">
          <span className="size-2 rounded-full bg-c1/80" />
          <span className="size-2 rounded-full bg-c3/80" />
          <span className="size-2 rounded-full bg-c2/80" />
          <span className="ml-2 text-[10px] font-bold text-text">xturing</span>
          <span className="rounded bg-accent/15 px-1 text-[9px] text-accent">bar</span>
          <span className="ml-auto text-[9px] text-muted">settings.json</span>
        </div>
        <div className="flex">
          <div className="w-24 shrink-0 border-r border-border/70 p-2">
            <p className="mb-1 text-[8px] font-bold uppercase tracking-[0.2em] text-muted">Pages</p>
            {PAGES.map((page, index) => (
              <p
                key={page}
                className={`rounded px-1 py-0.5 text-[10px] ${
                  index === 1 ? "bg-accent/15 font-bold text-accent" : "text-muted"
                }`}
              >
                {index === 1 ? "▸ " : "  "}
                {page}
              </p>
            ))}
          </div>
          <div className="min-w-0 flex-1 p-2">
            <div className="mb-1 flex items-center gap-2 border-b border-border/60 pb-1 text-[9px]">
              <span className="text-c6">◈ d_style</span>
              <span className="text-muted">align=start</span>
              <span className="ml-auto text-c2">● saved</span>
            </div>
            <p className="mb-1 text-[8px] text-muted">── Style ────────────</p>
            <Line label="Preset">‹ modular ›</Line>
            <Line label="Thickness" selected>
              [-] 48 [+]
            </Line>
            <Line label="Roundness">1.0</Line>
            <Line label="Opacity">85%</Line>
            <div className="mt-1 flex items-center justify-between border-t border-border/60 pt-1 text-[9px] text-muted">
              <span>↑↓ move · ←→ adjust</span>
              <span className="text-c2">? help</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
