"use client";

export function TopSellingShelfSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Books skeleton container */}
      <div className="relative flex min-h-[260px] flex-1 items-end">
        {/* Background guide lines */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[72px] top-2">
          <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-border/30" />
          <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-border/30" />
          <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-border/30" />
        </div>

        {/* Shelf books skeleton */}
        <div className="relative z-10 flex w-full items-end gap-2 sm:gap-4">
          {[0, 1, 2, 3, 4].map((item) => {
            const h = Math.round(160 - item * 12);
            const w = Math.round(h * (2 / 3));
            const isTop = item === 0;

            return (
              <div
                key={item}
                className="flex min-w-0 flex-1 flex-col items-center"
              >
                {/* Sales count skeleton */}
                <div className="mb-2 flex flex-col items-center gap-1">
                  <div className="h-4 w-9 animate-pulse rounded bg-surface-soft" />
                  <div className="h-2 w-5 animate-pulse rounded bg-surface-soft/60" />
                </div>

                {/* Book Cover skeleton in 2:3 ratio */}
                <div className="relative flex w-full items-end justify-center">
                  {isTop && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                      <div className="size-6 animate-pulse rounded-full bg-accent/20" />
                    </div>
                  )}

                  <div
                    className="relative aspect-[2/3] overflow-hidden rounded-t-[5px] border border-border/50 bg-surface-soft/60 animate-pulse"
                    style={{
                      height: `${h}px`,
                      width: `${w}px`,
                    }}
                  >
                    <div className="absolute left-1.5 top-1.5 h-4 w-5 rounded bg-foreground/10" />
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-3.5 w-7 rounded bg-foreground/10" />
                  </div>
                </div>

                {/* Title & revenue skeleton */}
                <div className="mt-2.5 flex w-full flex-col items-center gap-1 text-center">
                  <div className="h-2.5 w-3/4 animate-pulse rounded bg-surface-soft" />
                  <div className="h-2 w-1/2 animate-pulse rounded bg-surface-soft/60" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shelf bar */}
      <div className="relative mt-2">
        <div className="h-[5px] rounded-full bg-foreground/10 shadow-[0_2px_5px_rgba(0,0,0,0.08)]" />
        <div className="mx-3 h-[3px] rounded-b-full bg-foreground/[0.035]" />
      </div>

      {/* Bottom explanation skeleton */}
      <div className="mt-3 flex items-center justify-between gap-4">
        <div className="h-2.5 w-36 animate-pulse rounded bg-surface-soft" />
        <div className="h-2.5 w-24 animate-pulse rounded bg-surface-soft" />
      </div>
    </div>
  );
}

export default TopSellingShelfSkeleton;
