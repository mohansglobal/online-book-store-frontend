"use client";

// Loading skeleton for recent orders feed matching row geometry
export function RecentOrdersSkeleton() {
  return (
    <div className="mt-1 divide-y divide-border overflow-x-hidden">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex w-full items-center justify-between gap-3.5 rounded-xl px-1.5 py-3 animate-pulse"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-full bg-foreground/15 dark:bg-white/15" />

            <div className="min-w-0 space-y-1.5">
              <div className="h-3.5 w-24 rounded bg-foreground/15 dark:bg-white/15" />
              <div className="h-3 w-32 rounded bg-foreground/15 dark:bg-white/15" />
              <div className="h-3 w-16 rounded bg-foreground/15 dark:bg-white/15" />
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <div className="h-5 w-16 rounded-md bg-foreground/15 dark:bg-white/15" />
            <div className="h-3 w-12 rounded bg-foreground/15 dark:bg-white/15" />
          </div>
        </div>
      ))}
    </div>
  );
}
