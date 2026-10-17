import type { ReactNode } from "react";
import type { RepoAccent } from "@/lib/repos";

export type FlowGlyph =
  | "settings"
  | "palette"
  | "shell"
  | "theme"
  | "scene"
  | "wallpaper"
  | "video"
  | "screen"
  | "lock"
  | "manifest"
  | "scan"
  | "check"
  | "mount"
  | "tile"
  | "scroll";

export type FlowNode = {
  id: string;
  x: number;
  y: number;
  label: string;
  note?: string;
  accent: RepoAccent;
  glyph: FlowGlyph;
};

export type FlowEdge = {
  from: string;
  to: string;
  accent: RepoAccent;
  dashed?: boolean;
};

const GLYPHS: Record<FlowGlyph, ReactNode> = {
  settings: (
    <>
      <circle cx="0" cy="0" r="4" />
      {Array.from({ length: 8 }, (_, index) => {
        const angle = (index * Math.PI) / 4;
        return (
          <path
            key={index}
            d={`M${Math.cos(angle) * 7} ${Math.sin(angle) * 7} L${Math.cos(angle) * 10} ${Math.sin(angle) * 10}`}
          />
        );
      })}
    </>
  ),
  palette: (
    <>
      <rect x="-9" y="-9" width="7" height="7" rx="1.8" fill="currentColor" fillOpacity=".55" />
      <rect x="2" y="-9" width="7" height="7" rx="1.8" fill="currentColor" fillOpacity=".22" />
      <rect x="-9" y="2" width="7" height="7" rx="1.8" fill="currentColor" fillOpacity=".22" />
      <rect x="2" y="2" width="7" height="7" rx="1.8" fill="currentColor" fillOpacity=".55" />
    </>
  ),
  shell: (
    <>
      <rect x="-10" y="-8" width="20" height="4" rx="2" opacity=".7" />
      <rect x="-10" y="0" width="8" height="7" rx="2" />
      <rect x="1" y="0" width="9" height="7" rx="2" opacity=".55" />
    </>
  ),
  theme: (
    <>
      <path d="M0 -10 C5 -4 9 0 9 4 a9 9 0 0 1 -18 0 C-9 0 -5 -4 0 -10 Z" />
      <path d="M-4 4 a4 4 0 0 0 4 4" opacity=".7" />
    </>
  ),
  scene: (
    <>
      <circle cx="0" cy="0" r="2.8" fill="currentColor" stroke="none" />
      <ellipse cx="0" cy="0" rx="11" ry="4.5" transform="rotate(-18)" />
      <ellipse cx="0" cy="0" rx="11" ry="4.5" transform="rotate(52)" opacity=".45" />
    </>
  ),
  wallpaper: (
    <>
      <rect x="-10" y="-8" width="20" height="16" rx="2" />
      <circle cx="-5" cy="-3" r="1.8" fill="currentColor" stroke="none" opacity=".8" />
      <path d="M-8 6 L-2 -1 L2 3 L5 0 L9 6" />
    </>
  ),
  video: (
    <>
      <circle cx="0" cy="0" r="10" />
      <path d="M-3 -5 L6 0 L-3 5 Z" fill="currentColor" stroke="none" />
    </>
  ),
  screen: (
    <>
      <rect x="-10" y="-7" width="20" height="13" rx="2" />
      <path d="M-4 10 H4 M0 6 V10" />
    </>
  ),
  lock: (
    <>
      <rect x="-7" y="-1" width="14" height="11" rx="2.5" />
      <path d="M-4 -1 V-4 a4 4 0 0 1 8 0 V-1" />
      <circle cx="0" cy="4" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  manifest: (
    <>
      <rect x="-7" y="-10" width="14" height="20" rx="2" />
      <path d="M-4 -5 H4 M-4 -1 H3 M-4 3 H4" opacity=".6" />
    </>
  ),
  scan: (
    <>
      <circle cx="-2" cy="-2" r="7" />
      <path d="M3 3 L10 10" />
    </>
  ),
  check: (
    <>
      <circle cx="0" cy="0" r="10" />
      <path d="M-4 0 L-1 4 L5 -4" />
    </>
  ),
  mount: (
    <>
      <rect x="-9" y="-9" width="7" height="7" rx="1.8" />
      <rect x="2" y="-9" width="7" height="7" rx="1.8" opacity=".55" />
      <rect x="-9" y="2" width="7" height="7" rx="1.8" opacity=".55" />
      <rect x="2" y="2" width="7" height="7" rx="1.8" />
    </>
  ),
  tile: (
    <>
      <rect x="-10" y="-8" width="9" height="7" rx="1.8" />
      <rect x="1" y="-8" width="9" height="7" rx="1.8" opacity=".55" />
      <rect x="-10" y="1" width="9" height="8" rx="1.8" opacity=".55" />
      <rect x="1" y="1" width="9" height="8" rx="1.8" />
    </>
  ),
  scroll: (
    <>
      <rect x="-10" y="-8" width="5" height="16" rx="1.8" />
      <rect x="-2" y="-8" width="5" height="16" rx="1.8" opacity=".7" />
      <rect x="6" y="-8" width="4" height="16" rx="1.8" opacity=".45" />
      <path d="M-12 7 h4" />
    </>
  ),
};

const ACCENTS: RepoAccent[] = ["c1", "c2", "c3", "c4", "c5", "c6"];

function edgePath(from: FlowNode, to: FlowNode): string {
  const sx = from.x;
  const sy = from.y - 19;
  const ex = to.x;
  const ey = to.y - 19;
  const lift = Math.min(sy, ey) - Math.max(20, Math.abs(ex - sx) * 0.18);
  return `M${sx} ${sy} C ${sx + (ex - sx) * 0.35} ${lift}, ${sx + (ex - sx) * 0.7} ${lift}, ${ex} ${ey}`;
}

export function IsoFlow({
  id,
  nodes,
  edges,
  label,
}: {
  id: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  label: string;
}) {
  const byId = new Map(nodes.map((node) => [node.id, node]));

  return (
    <svg viewBox="0 0 400 330" role="img" aria-label={label} className="block h-auto w-full">
      <defs>
        {ACCENTS.map((accent) => (
          <marker
            key={accent}
            id={`flow-${id}-${accent}`}
            viewBox="0 0 8 8"
            refX="6.5"
            refY="4"
            markerWidth="6.5"
            markerHeight="6.5"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L8 4 L0 8 Z" fill={`var(--${accent})`} />
          </marker>
        ))}
      </defs>

      <g stroke="currentColor" opacity=".18" fill="none" strokeWidth="1">
        <path d="M0 1 H400" />
        <path d="M0 349 H400" />
      </g>

      {edges.map((edge) => {
        const from = byId.get(edge.from);
        const to = byId.get(edge.to);
        if (!from || !to) return null;
        return (
          <path
            key={`${edge.from}-${edge.to}`}
            d={edgePath(from, to)}
            fill="none"
            stroke={`var(--${edge.accent})`}
            strokeOpacity=".55"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeDasharray={edge.dashed ? "3 5" : undefined}
            markerEnd={`url(#flow-${id}-${edge.accent})`}
          />
        );
      })}

      {nodes.map((node) => (
        <g key={node.id} transform={`translate(${node.x} ${node.y})`}>
          <g fill={`var(--${node.accent})`} stroke={`var(--${node.accent})`}>
            <polygon points="0,18 38,37 0,56 -38,37" fillOpacity=".08" strokeOpacity=".3" />
            <polygon points="-38,37 0,56 0,64 -38,45" fillOpacity=".16" strokeOpacity=".34" />
            <polygon points="38,37 0,56 0,64 38,45" fillOpacity=".26" strokeOpacity=".34" />
          </g>
          <circle
            cx="0"
            cy="0"
            r="18"
            fill="var(--surface)"
            stroke={`var(--${node.accent})`}
            strokeOpacity=".5"
          />
          <circle
            cx="0"
            cy="0"
            r="22"
            fill="none"
            stroke={`var(--${node.accent})`}
            strokeOpacity=".16"
            strokeDasharray="2 4"
          />
          <g
            transform="translate(0 0)"
            fill="none"
            stroke={`var(--${node.accent})`}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {GLYPHS[node.glyph]}
          </g>
        </g>
      ))}
    </svg>
  );
}
