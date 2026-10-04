// Catalog of the preview gallery. Every entry maps to optimized assets in
// `public/previews/`: screenshots (`shots/<id>.webp` plus `<id>-<width>.webp`
// variants) and clips (`clips/<id>.mp4`, `clips/<id>-poster.webp`).
// Regenerate them with `scripts/build-previews.sh`.

export type ShotKind = "shell" | "settings" | "desktop" | "theming" | "scenes";

export type Shot = {
  id: string;
  width: number;
  height: number;
  kind: ShotKind;
  variantWidths: number[];
};

export const SHOTS: Shot[] = [
  { id: "desktop-doctor", width: 2560, height: 1440, kind: "desktop", variantWidths: [1280, 640] },
  { id: "desktop-tiling", width: 2560, height: 1440, kind: "desktop", variantWidths: [1280, 640] },
  { id: "desktop-scenes", width: 2560, height: 1440, kind: "scenes", variantWidths: [1280, 640] },
  { id: "bar", width: 1539, height: 201, kind: "shell", variantWidths: [1280, 640] },
  { id: "settings-bar-engine", width: 1427, height: 1073, kind: "settings", variantWidths: [1280, 640] },
  { id: "settings-bar-position", width: 1901, height: 831, kind: "settings", variantWidths: [1280, 640] },
  { id: "settings-timex", width: 1145, height: 690, kind: "settings", variantWidths: [640] },
  { id: "settings-monitors", width: 1145, height: 690, kind: "settings", variantWidths: [640] },
  { id: "settings-glass", width: 1293, height: 869, kind: "theming", variantWidths: [1280, 640] },
  { id: "widgets-panel", width: 669, height: 276, kind: "shell", variantWidths: [640] },
  { id: "app-launcher", width: 243, height: 228, kind: "shell", variantWidths: [] },
];

export type ShotSectionLayout = "feature" | "masonry";

export type ShotSection = {
  id: "desktop" | "shell";
  layout: ShotSectionLayout;
  shots: string[];
};

export const SHOT_SECTIONS: ShotSection[] = [
  {
    id: "desktop",
    layout: "feature",
    shots: ["desktop-doctor", "desktop-tiling", "desktop-scenes"],
  },
  {
    id: "shell",
    layout: "masonry",
    shots: [
      "bar",
      "settings-bar-engine",
      "settings-bar-position",
      "settings-timex",
      "settings-monitors",
      "settings-glass",
      "widgets-panel",
      "app-launcher",
    ],
  },
];

export type ClipGroupId = "v1" | "v2";

export type Clip = {
  id: string;
  group: ClipGroupId;
  index: number;
};

export const CLIPS: Clip[] = [
  ...Array.from({ length: 14 }, (_, i) => ({
    id: `tour-v1-part${String(i + 1).padStart(2, "0")}`,
    group: "v1" as const,
    index: i + 1,
  })),
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `tour-v2-part${String(i + 1).padStart(2, "0")}`,
    group: "v2" as const,
    index: i + 1,
  })),
];

export function shotById(id: string): Shot {
  const shot = SHOTS.find((item) => item.id === id);
  if (!shot) throw new Error(`Unknown preview shot: ${id}`);
  return shot;
}
