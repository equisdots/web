import { IsoFlow, type FlowEdge, type FlowNode } from "./IsoFlow";
import { SectionHeader } from "./SectionHeader";
import { getDict, type Locale } from "@/lib/i18n";

export function FlowsSection({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const copy = dict.flows;
  const node = (nodes: Record<string, { label: string; note: string }>, key: string) =>
    nodes[key] ?? { label: key, note: "" };

  const paletteNodes: FlowNode[] = [
    { id: "settings", x: 62, y: 170, accent: "c3", glyph: "settings", ...node(copy.palette.nodes, "settings") },
    { id: "palettes", x: 190, y: 105, accent: "c5", glyph: "palette", ...node(copy.palette.nodes, "palettes") },
    { id: "shell", x: 328, y: 55, accent: "c6", glyph: "shell", ...node(copy.palette.nodes, "shell") },
    { id: "theme", x: 338, y: 158, accent: "c4", glyph: "theme", ...node(copy.palette.nodes, "theme") },
    { id: "scenes", x: 320, y: 255, accent: "c2", glyph: "scene", ...node(copy.palette.nodes, "scenes") },
  ];

  const paletteEdges: FlowEdge[] = [
    { from: "settings", to: "palettes", accent: "c3" },
    { from: "palettes", to: "shell", accent: "c6" },
    { from: "palettes", to: "theme", accent: "c4" },
    { from: "palettes", to: "scenes", accent: "c2" },
  ];

  const wallpaperNodes: FlowNode[] = [
    { id: "davincix", x: 62, y: 170, accent: "c4", glyph: "wallpaper", ...node(copy.wallpaper.nodes, "davincix") },
    { id: "xwww", x: 195, y: 95, accent: "c6", glyph: "scene", ...node(copy.wallpaper.nodes, "xwww") },
    { id: "mpvpaper", x: 195, y: 240, accent: "c1", glyph: "video", ...node(copy.wallpaper.nodes, "mpvpaper") },
    { id: "surface", x: 330, y: 115, accent: "c2", glyph: "screen", ...node(copy.wallpaper.nodes, "surface") },
    { id: "lock", x: 326, y: 252, accent: "c3", glyph: "lock", ...node(copy.wallpaper.nodes, "lock") },
  ];

  const wallpaperEdges: FlowEdge[] = [
    { from: "davincix", to: "xwww", accent: "c6" },
    { from: "davincix", to: "mpvpaper", accent: "c1" },
    { from: "xwww", to: "surface", accent: "c2" },
    { from: "mpvpaper", to: "surface", accent: "c2" },
    { from: "davincix", to: "lock", accent: "c3", dashed: true },
  ];

  const pluginNodes: FlowNode[] = [
    { id: "manifest", x: 62, y: 170, accent: "c4", glyph: "manifest", ...node(copy.plugins.nodes, "manifest") },
    { id: "scan", x: 175, y: 100, accent: "c6", glyph: "scan", ...node(copy.plugins.nodes, "scan") },
    { id: "compat", x: 288, y: 100, accent: "c3", glyph: "check", ...node(copy.plugins.nodes, "compat") },
    { id: "mount", x: 350, y: 195, accent: "c5", glyph: "mount", ...node(copy.plugins.nodes, "mount") },
    { id: "surfaces", x: 210, y: 242, accent: "c2", glyph: "shell", ...node(copy.plugins.nodes, "surfaces") },
  ];

  const pluginEdges: FlowEdge[] = [
    { from: "manifest", to: "scan", accent: "c6" },
    { from: "scan", to: "compat", accent: "c3" },
    { from: "compat", to: "mount", accent: "c5" },
    { from: "mount", to: "surfaces", accent: "c2" },
  ];

  const compositorNodes: FlowNode[] = [
    { id: "session", x: 60, y: 170, accent: "c5", glyph: "screen", ...node(copy.compositor.nodes, "session") },
    { id: "adapter", x: 190, y: 105, accent: "c6", glyph: "mount", ...node(copy.compositor.nodes, "adapter") },
    { id: "hyprland", x: 330, y: 55, accent: "c1", glyph: "tile", ...node(copy.compositor.nodes, "hyprland") },
    { id: "niri", x: 330, y: 175, accent: "c2", glyph: "scroll", ...node(copy.compositor.nodes, "niri") },
    { id: "shell", x: 200, y: 260, accent: "c4", glyph: "shell", ...node(copy.compositor.nodes, "shell") },
  ];

  const compositorEdges: FlowEdge[] = [
    { from: "session", to: "adapter", accent: "c5" },
    { from: "adapter", to: "hyprland", accent: "c1" },
    { from: "adapter", to: "niri", accent: "c2" },
    { from: "hyprland", to: "shell", accent: "c1" },
    { from: "niri", to: "shell", accent: "c2" },
  ];

  const diagrams = [
    { id: "palette", copy: copy.palette, nodes: paletteNodes, edges: paletteEdges },
    { id: "wallpaper", copy: copy.wallpaper, nodes: wallpaperNodes, edges: wallpaperEdges },
    { id: "plugins", copy: copy.plugins, nodes: pluginNodes, edges: pluginEdges },
    { id: "compositor", copy: copy.compositor, nodes: compositorNodes, edges: compositorEdges },
  ];

  return (
    <section id="flows" className="border-t border-border">
      <div className="container-wide py-16">
        <SectionHeader
          index="03"
          label={dict.home.labels.flows}
          title={dict.home.flowsTitle}
          subtitle={dict.home.flowsSubtitle}
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {diagrams.map((diagram) => (
            <figure
              key={diagram.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/40"
            >
              <div className="relative border-b border-border p-3">
                <div className="blueprint absolute inset-0" aria-hidden="true" />
                <div className="relative">
                  <IsoFlow
                    id={diagram.id}
                    nodes={diagram.nodes}
                    edges={diagram.edges}
                    label={diagram.copy.title}
                  />
                </div>
              </div>
              <figcaption className="p-4">
                <h3 className="text-sm font-medium">{diagram.copy.title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-muted">{diagram.copy.note}</p>
                <ul className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1.5 border-t border-border pt-3 sm:grid-cols-2">
                  {diagram.nodes.map((item) => (
                    <li key={item.id} className="flex min-w-0 gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-1 size-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: `var(--${item.accent})` }}
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-[10.5px] font-medium text-text">{item.label}</span>
                        <span className="block truncate font-mono text-[8.5px] text-muted">{item.note}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
