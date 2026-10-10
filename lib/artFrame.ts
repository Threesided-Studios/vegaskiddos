// Where the illustration actually sits inside each 3:2 type-art file
// (img.vegaskiddos.com/type/<id>/…, measured on the 640×427 render).
// Several templates are a round vignette on a flat cream canvas, so plain
// object-fit: cover in the 120px card band left flat bands at both sides.
// The card thumb zooms each file so its art spans the full card width.
// Re-measure if ART_TEMPLATES_VERSION changes (bbox of non-background pixels).
const ART_W = 640;
const ART_H = 427;
const MAX_ZOOM = 2;

// [x0, x1, y0, y1]; types whose art already reaches both edges are omitted.
const BOX: Record<string, [number, number, number, number]> = {
  animals: [163, 594, 46, 395],
  art: [158, 586, 76, 387],
  baby: [41, 583, 40, 391],
  boardgame: [24, 611, 51, 426],
  dino: [132, 465, 34, 396],
  festival: [110, 517, 34, 401],
  food: [108, 522, 34, 392],
  gaming: [0, 606, 37, 392],
  market: [34, 602, 72, 390],
  music: [68, 581, 47, 385],
  nature: [158, 607, 47, 410],
  scavenger: [42, 584, 54, 388],
  stem: [27, 602, 33, 426],
  storytime: [103, 491, 21, 410],
  swim: [72, 590, 68, 407],
  theater: [44, 569, 42, 386],
  yoga: [59, 573, 52, 381],
};

export function artTypeFromSrc(src: string): string | undefined {
  return /\/type\/([a-z0-9-]+)\//.exec(src)?.[1];
}

export type ArtFrame = { zoom: number; cx: number; cy: number };

/** Zoom factor (relative to the card width) and art centre (0–1) for a type. */
export function artFrame(src: string): ArtFrame {
  const box = BOX[artTypeFromSrc(src) || ""];
  if (!box) return { zoom: 1, cx: 0.5, cy: 0.5 };
  const [x0, x1, y0, y1] = box;
  const zoom = Math.min(MAX_ZOOM, ART_W / (x1 - x0 + 1));
  if (zoom < 1.03) return { zoom: 1, cx: 0.5, cy: 0.5 };
  // Keep the zoomed file covering the frame horizontally.
  const half = 0.5 / zoom;
  const cx = Math.min(1 - half, Math.max(half, (x0 + x1) / 2 / ART_W));
  return { zoom: +zoom.toFixed(3), cx: +cx.toFixed(3), cy: +((y0 + y1) / 2 / ART_H).toFixed(3) };
}
