type MockProps = { className?: string };

const PLUGINS = [
  { name: "Nyx", detail: "shell · mascot island", glyph: "✕", on: true, accent: "text-c4" },
  { name: "Screenshots", detail: "mixed · capture and record", glyph: "▣", on: true, accent: "text-c1" },
  { name: "Timex", detail: "mixed · calendar + weather", glyph: "◷", on: true, accent: "text-c3" },
  { name: "Keybinds", detail: "shell · shortcut editor", glyph: "⌘", on: false, accent: "text-c5" },
];

export function PluginsMock({ className }: MockProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-surface ${className ?? ""}`}>
      <div className="p-4 font-sans">
        <div className="flex items-center gap-2">
          <span className="grid grid-cols-2 gap-[2px]">
            <span className="size-1.5 rounded-[2px] bg-c4" />
            <span className="size-1.5 rounded-[2px] bg-c4/60" />
            <span className="size-1.5 rounded-[2px] bg-c4/60" />
            <span className="size-1.5 rounded-[2px] bg-c4" />
          </span>
          <h3 className="text-xs font-bold tracking-wide text-text">Plugins</h3>
          <span className="rounded-full border border-border px-1.5 py-0.5 font-mono text-[8px] text-muted">
            63 installed
          </span>
          <span className="ml-auto font-mono text-[9px] text-c2">● compatible</span>
        </div>

        <div className="mt-2.5 flex items-center gap-2 rounded-lg border border-border bg-surface-2/50 px-2.5 py-1.5">
          <span className="text-[10px] text-muted">⌕</span>
          <span className="text-[9px] text-muted">Filter plugins</span>
          <span className="ml-auto flex gap-1">
            <span className="rounded border border-border px-1 font-mono text-[8px] text-muted">all</span>
            <span className="rounded border border-border px-1 font-mono text-[8px] text-muted">on</span>
            <span className="rounded border border-border px-1 font-mono text-[8px] text-muted">off</span>
          </span>
        </div>

        <div className="mt-2.5 space-y-1.5">
          {PLUGINS.map((plugin) => (
            <div
              key={plugin.name}
              className="flex items-center gap-2 rounded-lg border border-border/70 bg-surface-2/30 px-2.5 py-1.5"
            >
              <span className={`flex size-5 items-center justify-center rounded-md bg-bg text-[10px] ${plugin.accent}`}>
                {plugin.glyph}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[10px] font-bold text-text">{plugin.name}</p>
                <p className="truncate font-mono text-[8px] text-muted">{plugin.detail}</p>
              </div>
              <span
                className={`ml-auto flex h-3.5 w-7 items-center rounded-full p-0.5 ${
                  plugin.on ? "justify-end bg-accent" : "justify-start bg-border"
                }`}
              >
                <span className={`size-2.5 rounded-full ${plugin.on ? "bg-accent-fg" : "bg-muted/70"}`} />
              </span>
            </div>
          ))}
        </div>

        <div className="mt-2.5 flex items-center gap-1.5 font-mono text-[8px] text-muted">
          <span className="rounded bg-c5/15 px-1.5 py-0.5 text-c5">4 enabled</span>
          <span className="rounded bg-surface-2 px-1.5 py-0.5">59 available</span>
          <span className="ml-auto">registry v1</span>
        </div>
      </div>
    </div>
  );
}
