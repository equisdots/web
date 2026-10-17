import type { ReactNode } from "react";
import type { RepoAccent, RepoVisual } from "@/lib/repos";

const GLYPHS: Record<RepoVisual, ReactNode> = {
  installer: (
    <>
      <rect x="-13" y="-10" width="26" height="20" rx="3" />
      <path d="M-8 -4 l4 4 -4 4" />
      <path d="M-1 4 h7" />
    </>
  ),
  compositor: (
    <>
      <rect x="-14" y="-10" width="16" height="13" rx="2" />
      <rect x="-2" y="-3" width="16" height="15" rx="2" />
      <path d="M2 -3 v15" />
      <path d="M-14 -3 h16" />
    </>
  ),
  scroll: (
    <>
      <rect x="-14" y="-9" width="8" height="18" rx="2" />
      <rect x="-3" y="-9" width="8" height="18" rx="2" />
      <rect x="8" y="-9" width="6" height="18" rx="2" opacity=".55" />
      <path d="M-16 6 h5" />
      <path d="M-14 4 l-2 2 2 2" />
    </>
  ),
  overlay: (
    <>
      <rect x="-13" y="-9" width="19" height="15" rx="2.5" opacity=".55" />
      <rect x="-4" y="-2" width="17" height="13" rx="2.5" />
      <path d="M-9 -9 v-2" strokeDasharray="2 2" />
    </>
  ),
  login: (
    <>
      <rect x="-9" y="-2" width="18" height="14" rx="3" />
      <path d="M-5 -2 v-4 a5 5 0 0 1 10 0 v4" />
      <circle cx="0" cy="5" r="1.6" fill="currentColor" stroke="none" />
    </>
  ),
  shell: (
    <>
      <rect x="-14" y="-11" width="28" height="6" rx="3" opacity=".7" />
      <rect x="-13" y="-2" width="8" height="6" rx="2" />
      <rect x="-2" y="-2" width="8" height="6" rx="2" />
      <rect x="9" y="-2" width="5" height="6" rx="2" opacity=".55" />
      <rect x="-7" y="7" width="14" height="5" rx="2" opacity=".4" />
    </>
  ),
  mascot: (
    <>
      <path d="M-12 -5 L-11 -13 L-5 -9 H5 L11 -13 L12 -5 V4 a12 12 0 0 1 -24 0 Z" />
      <circle cx="-5" cy="-1" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="5" cy="-1" r="1.4" fill="currentColor" stroke="none" />
      <path d="M-2 4 q2 2 4 0" />
    </>
  ),
  palette: (
    <>
      <rect x="-12" y="-12" width="10" height="10" rx="2.5" fill="currentColor" fillOpacity=".55" />
      <rect x="2" y="-12" width="10" height="10" rx="2.5" fill="currentColor" fillOpacity=".22" />
      <rect x="-12" y="2" width="10" height="10" rx="2.5" fill="currentColor" fillOpacity=".22" />
      <rect x="2" y="2" width="10" height="10" rx="2.5" fill="currentColor" fillOpacity=".55" />
    </>
  ),
  theme: (
    <>
      <path d="M0 -13 C6 -6 11 -1 11 4 a11 11 0 0 1 -22 0 C-11 -1 -6 -6 0 -13 Z" />
      <path d="M-5 5 a5 5 0 0 0 5 5" opacity=".7" />
    </>
  ),
  wallpaper: (
    <>
      <rect x="-13" y="-10" width="26" height="20" rx="2.5" />
      <circle cx="-6" cy="-4" r="2.4" fill="currentColor" stroke="none" opacity=".8" />
      <path d="M-11 6 L-3 -3 L2 3 L6 -1 L12 6" />
    </>
  ),
  scene: (
    <>
      <circle cx="0" cy="0" r="3.2" fill="currentColor" stroke="none" />
      <ellipse cx="0" cy="0" rx="14" ry="5.5" transform="rotate(-18)" />
      <ellipse cx="0" cy="0" rx="14" ry="5.5" transform="rotate(52)" opacity=".45" />
      <circle cx="11" cy="-5" r="1.8" fill="currentColor" stroke="none" />
    </>
  ),
  clock: (
    <>
      <circle cx="0" cy="0" r="13" />
      <path d="M0 0 V-7" />
      <path d="M0 0 L6 3" />
      <circle cx="0" cy="0" r="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  terminal: (
    <>
      <rect x="-13" y="-10" width="26" height="20" rx="2.5" />
      <path d="M-13 -5 h26" opacity=".55" />
      <path d="M-7 0 l3 3 -3 3" />
      <path d="M-1 6 h6" />
    </>
  ),
  contract: (
    <>
      <rect x="-9" y="-13" width="18" height="26" rx="2.5" />
      <path d="M-5 -7 h10" opacity=".55" />
      <path d="M-5 -3 h7" opacity=".55" />
      <path d="M-5 3 l3 3 6 -7" />
    </>
  ),
  sdk: (
    <>
      <path d="M0 -13 L12 -6 V7 L0 14 L-12 7 V-6 Z" />
      <path d="M-12 -6 L0 1 L12 -6" opacity=".6" />
      <path d="M0 1 V14" opacity=".6" />
    </>
  ),
  plugins: (
    <>
      {[-11, 0, 11].flatMap((x) =>
        [-11, 0, 11].map((y) => (
          <rect
            key={`${x}-${y}`}
            x={x - 3.5}
            y={y - 3.5}
            width="7"
            height="7"
            rx="1.8"
            fill={x === 0 && y === 0 ? "currentColor" : "none"}
            fillOpacity=".55"
            opacity={x === 0 && y === 0 ? 1 : 0.55}
          />
        ))
      )}
    </>
  ),
  map: (
    <>
      <path d="M-11 -8 L0 0 L11 -9 M0 0 L7 10 M0 0 L-8 9" opacity=".55" />
      <circle cx="-11" cy="-8" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="11" cy="-9" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="7" cy="10" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="-8" cy="9" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="0" cy="0" r="3" fill="currentColor" stroke="none" />
    </>
  ),
  web: (
    <>
      <rect x="-14" y="-10" width="28" height="20" rx="2.5" />
      <path d="M-14 -5 h28" opacity=".55" />
      <circle cx="-10" cy="-7.5" r="1" fill="currentColor" stroke="none" />
      <path d="M-6 0 l-3 3 3 3" />
      <path d="M6 0 l3 3 -3 3" />
      <path d="M1 -1 l-2 8" opacity=".65" />
    </>
  ),
  org: (
    <>
      <path d="M-10 -8 L0 2 L10 -8 M0 2 V10" opacity=".55" />
      <circle cx="-10" cy="-8" r="3" fill="currentColor" stroke="none" />
      <circle cx="10" cy="-8" r="3" fill="currentColor" stroke="none" />
      <circle cx="0" cy="2" r="3" fill="currentColor" stroke="none" />
      <circle cx="0" cy="11" r="3" opacity=".55" fill="currentColor" stroke="none" />
    </>
  ),
};

export function RepoArt({
  visual,
  accent,
  className,
}: {
  visual: RepoVisual;
  accent: RepoAccent;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 150"
      aria-hidden="true"
      className={`block h-auto w-full ${className ?? ""}`}
      style={{ color: `var(--${accent})` }}
    >
      <g fill="currentColor" stroke="none">
        <polygon points="100,78 162,109 100,140 38,109" opacity=".07" />
        <polygon points="38,109 100,140 100,148 38,117" opacity=".13" />
        <polygon points="162,109 100,140 100,148 162,117" opacity=".2" />
        <polygon points="100,58 148,82 100,106 52,82" opacity=".04" />
        <polygon points="52,82 100,106 100,111 52,87" opacity=".08" />
        <polygon points="148,82 100,106 100,111 148,87" opacity=".11" />
      </g>

      <g stroke="currentColor" opacity=".22" fill="none" strokeWidth="1">
        <path d="M69 92 L131 123" />
        <path d="M100 78 L100 140" />
        <path d="M100 78 L38 109" />
        <path d="M100 78 L162 109" />
      </g>

      <path d="M100 71 V79" stroke="currentColor" strokeOpacity=".4" strokeDasharray="2 3" />

      <circle cx="100" cy="46" r="24" fill="var(--surface)" stroke="currentColor" strokeOpacity=".28" />
      <circle
        cx="100"
        cy="46"
        r="28"
        fill="none"
        stroke="currentColor"
        strokeOpacity=".18"
        strokeDasharray="2 4"
      />

      <g
        transform="translate(100 46)"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {GLYPHS[visual]}
      </g>
    </svg>
  );
}
