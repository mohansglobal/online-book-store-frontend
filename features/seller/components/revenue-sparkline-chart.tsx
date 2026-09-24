"use client";

// Dynamic SVG sparkline area chart for seller revenue trend
import type { SellerRevenuePoint } from "../types/seller.types";

interface RevenueSparklineChartProps {
  points: SellerRevenuePoint[];
  isLoading?: boolean;
  width?: number;
  height?: number;
}

const DEFAULT_LABELS: readonly string[] = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

const PLACEHOLDER_PATH =
  "M 0 55 C 40 45, 80 60, 120 40 S 200 50, 240 30 S 320 45, 360 25 L 420 35";
const PLACEHOLDER_AREA = `${PLACEHOLDER_PATH} L 420 80 L 0 80 Z`;

function generateChartPaths(
  points: SellerRevenuePoint[],
  width = 420,
  height = 80,
) {
  if (!points || points.length === 0) {
    return { linePath: "", areaPath: "", lastPoint: { x: 0, y: 0 } };
  }

  const values = points.map((p) => p.revenueInRupees);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const topPadding = 12;
  const bottomPadding = 16;
  const usableHeight = height - topPadding - bottomPadding;

  const coords = points.map((p, index) => {
    const x =
      points.length === 1
        ? width / 2
        : (index / (points.length - 1)) * width;

    const normalized = (p.revenueInRupees - minVal) / range;
    const y = height - bottomPadding - normalized * usableHeight;

    return { x, y };
  });

  if (coords.length === 1) {
    const single = coords[0];
    const linePath = `M 0 ${single.y} L ${width} ${single.y}`;
    const areaPath = `M 0 ${single.y} L ${width} ${single.y} L ${width} ${height} L 0 ${height} Z`;

    return { linePath, areaPath, lastPoint: single };
  }

  let linePath = `M ${coords[0].x} ${coords[0].y}`;

  for (let i = 0; i < coords.length - 1; i++) {
    const curr = coords[i];
    const next = coords[i + 1];

    const cpX1 = curr.x + (next.x - curr.x) / 2;
    const cpY1 = curr.y;
    const cpX2 = curr.x + (next.x - curr.x) / 2;
    const cpY2 = next.y;

    linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
  }

  const lastPoint = coords[coords.length - 1];
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  return { linePath, areaPath, lastPoint };
}

export function RevenueSparklineChart({
  points,
  isLoading = false,
  width = 420,
  height = 80,
}: RevenueSparklineChartProps) {
  const { linePath, areaPath, lastPoint } = generateChartPaths(
    points,
    width,
    height,
  );

  const activeLinePath = isLoading ? PLACEHOLDER_PATH : linePath;
  const activeAreaPath = isLoading ? PLACEHOLDER_AREA : areaPath;

  return (
    <div>
      <div
        className={`relative h-[82px] w-full ${
          isLoading ? "animate-pulse opacity-50" : ""
        }`}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="h-full w-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="sellerRevenueArea" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-accent)"
                stopOpacity="0.22"
              />

              <stop
                offset="100%"
                stopColor="var(--color-accent)"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {activeAreaPath && (
            <path d={activeAreaPath} fill="url(#sellerRevenueArea)" />
          )}

          {activeLinePath && (
            <path
              d={activeLinePath}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {!isLoading && lastPoint.x > 0 && (
            <circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              r="4"
              fill="var(--color-accent)"
              stroke="var(--color-surface)"
              strokeWidth="3"
            />
          )}
        </svg>
      </div>

      <div className="mt-1 flex justify-between text-[9px] font-medium text-muted-foreground">
        {isLoading || points.length === 0
          ? DEFAULT_LABELS.map((day) => <span key={day}>{day}</span>)
          : points.map((pt) => (
              <span key={pt.date || pt.label}>{pt.label}</span>
            ))}
      </div>
    </div>
  );
}
