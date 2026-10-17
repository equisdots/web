import type { RepoAccent } from "@/lib/repos";

export type StackLayerView = {
  id: "interface" | "compositor" | "engines" | "data" | "install";
  title: string;
  note: string;
  repos: string;
  accent: RepoAccent;
};

type Labels = { diagram: string; plugins: string };

const CX = 280;
const HALF_W = 180;
const HALF_H = 72;
const DEPTH = 16;

function diamond(y: number): string {
  return `${CX},${y - HALF_H} ${CX + HALF_W},${y} ${CX},${y + HALF_H} ${CX - HALF_W},${y}`;
}

function leftSide(y: number): string {
  return `${CX - HALF_W},${y} ${CX},${y + HALF_H} ${CX},${y + HALF_H + DEPTH} ${CX - HALF_W},${y + DEPTH}`;
}

function rightSide(y: number): string {
  return `${CX + HALF_W},${y} ${CX},${y + HALF_H} ${CX},${y + HALF_H + DEPTH} ${CX + HALF_W},${y + DEPTH}`;
}

export function StackDiagram({
  layers,
  labels,
}: {
  layers: StackLayerView[];
  labels: Labels;
}) {
  const indexed = layers.map((layer, index) => ({ ...layer, index: index + 1 }));
  const drawn = [...indexed].reverse();
  const yFor = (position: number) => 500 - position * 100;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <figure className="relative overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="blueprint absolute inset-0" aria-hidden="true" />
        <svg
          viewBox="0 0 560 600"
          role="img"
          aria-label={labels.diagram}
          className="relative block h-auto w-full"
        >
          <g stroke="var(--border)" strokeWidth="1" opacity=".55">
            <path d={`M${CX} 46 V548`} strokeDasharray="3 6" />
            <path d={`M76 ${yFor(2.15)} H484`} strokeDasharray="3 6" opacity=".5" />
            <path d={`M76 ${yFor(4.15)} H484`} strokeDasharray="3 6" opacity=".5" />
          </g>

          {drawn.map((layer, stackPosition) => {
            const y = yFor(stackPosition);
            return (
              <g key={layer.id}>
                <ellipse
                  cx={CX}
                  cy={y + 26}
                  rx={HALF_W * 0.92}
                  ry={HALF_H * 0.52}
                  fill={`var(--${layer.accent})`}
                  opacity=".1"
                />
                <polygon
                  points={leftSide(y)}
                  fill={`var(--${layer.accent})`}
                  fillOpacity=".16"
                  stroke={`var(--${layer.accent})`}
                  strokeOpacity=".38"
                />
                <polygon
                  points={rightSide(y)}
                  fill={`var(--${layer.accent})`}
                  fillOpacity=".28"
                  stroke={`var(--${layer.accent})`}
                  strokeOpacity=".38"
                />
                <polygon
                  points={diamond(y)}
                  fill="var(--surface)"
                  fillOpacity=".86"
                  stroke={`var(--${layer.accent})`}
                  strokeOpacity=".55"
                />
                <polygon
                  points={`${CX},${y - HALF_H + 13} ${CX + HALF_W - 22},${y} ${CX},${y + HALF_H - 13} ${CX - HALF_W + 22},${y}`}
                  fill={`var(--${layer.accent})`}
                  fillOpacity=".08"
                  stroke="none"
                />
                <g>
                  <rect
                    x={CX - 16}
                    y={y - 10}
                    width="32"
                    height="20"
                    rx="10"
                    fill="var(--bg)"
                    fillOpacity=".75"
                    stroke={`var(--${layer.accent})`}
                    strokeOpacity=".5"
                  />
                  <text
                    x={CX}
                    y={y + 4}
                    textAnchor="middle"
                    fill="var(--text)"
                    fontSize="10"
                    letterSpacing="1.4"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {String(layer.index).padStart(2, "0")}
                  </text>
                </g>
                <circle
                  cx={CX + HALF_W - 18}
                  cy={y + 4}
                  r="2.5"
                  fill={`var(--${layer.accent})`}
                  opacity=".9"
                />
              </g>
            );
          })}

          <g className="stack-plugin-satellite">
            <path
              d={`M${CX + HALF_W - 12} ${yFor(4)} C ${CX + HALF_W + 48} ${yFor(4)}, ${CX + HALF_W + 50} ${yFor(4.35)}, ${CX + HALF_W - 32} ${yFor(4.35)}`}
              fill="none"
              stroke="var(--c2)"
              strokeOpacity=".45"
              strokeDasharray="3 5"
            />
            <g transform={`translate(${CX + HALF_W + 10} ${yFor(4.35)})`}>
              <polygon
                points="0,-34 42,-17 0,0 -42,-17"
                fill="var(--c2)"
                fillOpacity=".16"
                stroke="var(--c2)"
                strokeOpacity=".55"
              />
              <polygon
                points="-42,-17 0,0 0,16 -42,-1"
                fill="var(--c2)"
                fillOpacity=".2"
                stroke="var(--c2)"
                strokeOpacity=".55"
              />
              <polygon
                points="42,-17 0,0 0,16 42,-1"
                fill="var(--c2)"
                fillOpacity=".3"
                stroke="var(--c2)"
                strokeOpacity=".55"
              />
              <text
                x="0"
                y="-11"
                textAnchor="middle"
                fill="var(--text)"
                fontSize="9"
                letterSpacing="1.2"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                PLUGINS
              </text>
            </g>
          </g>
        </svg>
        <figcaption className="relative flex items-center justify-between gap-4 border-t border-border px-4 py-3">
          <span className="label">{labels.diagram}</span>
          <span className="index">{labels.plugins}</span>
        </figcaption>
      </figure>

      <ol className="flex flex-col gap-2">
        {indexed.map((layer) => (
          <li
            key={layer.id}
            className="rounded-xl border border-border bg-bg/60 p-3.5 transition-colors hover:border-accent/40"
          >
            <div className="flex items-baseline gap-3">
              <span className="index" style={{ color: `var(--${layer.accent})` }}>
                {String(layer.index).padStart(2, "0")}
              </span>
              <h3 className="text-sm font-medium">{layer.title}</h3>
              <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                {layer.repos}
              </span>
            </div>
            <p className="mt-1 text-xs leading-5 text-muted">{layer.note}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
