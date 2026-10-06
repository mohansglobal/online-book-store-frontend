import type { OrderHealthTimelinePoint } from "../types/seller.types";

export interface PointCoord {
  x: number;
  y: number;
}

export function generateSmoothPath(coords: PointCoord[]): string {
  if (coords.length === 0) {
    return "";
  }

  if (coords.length === 1) {
    return `M 0 ${coords[0].y} L 400 ${coords[0].y}`;
  }

  let path = `M ${coords[0].x} ${coords[0].y}`;

  for (let i = 0; i < coords.length - 1; i++) {
    const curr = coords[i];
    const next = coords[i + 1];

    const cpX1 = curr.x + (next.x - curr.x) / 2;
    const cpY1 = curr.y;
    const cpX2 = curr.x + (next.x - curr.x) / 2;
    const cpY2 = next.y;

    path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
  }

  return path;
}

export function calculateSeriesCoords(
  points: OrderHealthTimelinePoint[],
  getter: (p: OrderHealthTimelinePoint) => number,
  maxValue: number,
  width: number,
  height: number,
  topPadding = 14,
  bottomPadding = 24,
  leftPadding = 8,
  rightPadding = 8,
): PointCoord[] {
  if (points.length === 0) {
    return [];
  }

  const usableWidth = width - leftPadding - rightPadding;
  const usableHeight = height - topPadding - bottomPadding;

  return points.map((p, index) => {
    const x =
      points.length === 1
        ? width / 2
        : leftPadding + (index / (points.length - 1)) * usableWidth;

    const val = getter(p);
    const normalized = Math.min(1, Math.max(0, val / maxValue));
    const y = topPadding + (1 - normalized) * usableHeight;

    return { x, y };
  });
}
