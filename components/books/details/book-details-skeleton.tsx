"use client";


function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted/60 ${className}`}
    />
  );
}

export function BookDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Banner Skeleton */}
      <div className="h-40 w-full bg-muted/30 sm:h-48">
        <div className="mx-auto flex h-full max-w-6xl items-end px-4 pb-14 sm:px-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32 bg-muted/50" />
            <Skeleton className="h-8 w-52 bg-muted/70 sm:w-64" />
          </div>
        </div>
      </div>

      <main className="relative z-10 -mt-8 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Main Book Section - #F6F1E2 Skeleton Card */}
          <section className="rounded-2xl border border-border bg-[#F6F1E2] p-5 shadow-sm sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-12">
              {/* Book Cover */}
              <div>
                <Skeleton className="mx-auto aspect-[2/3] w-full max-w-[260px] rounded-xl" />

                {/* Thumbnail row */}
                <div className="mx-auto mt-4 flex max-w-[260px] justify-center gap-2">
                  <Skeleton className="h-12 w-9 rounded-md" />
                  <Skeleton className="h-12 w-9 rounded-md" />
                  <Skeleton className="h-12 w-9 rounded-md" />
                </div>
              </div>

              {/* Book Information */}
              <div className="min-w-0">
                {/* Breadcrumb / category */}
                <div className="mb-4 flex items-center gap-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-3 w-24" />
                </div>

                {/* Title */}
                <div className="space-y-3">
                  <Skeleton className="h-9 w-[85%] max-w-xl" />
                  <Skeleton className="h-9 w-[55%] max-w-sm" />
                </div>

                {/* Author */}
                <div className="mt-4 flex items-center gap-2">
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-4 w-32" />
                </div>

                {/* Rating / status */}
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-28" />
                </div>

                {/* Divider */}
                <div className="my-6 border-t border-border" />

                {/* Price */}
                <div className="flex flex-wrap items-end gap-3">
                  <Skeleton className="h-9 w-28" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>

                <Skeleton className="mt-3 h-4 w-48" />

                {/* Seller / stock */}
                <div className="mt-6 rounded-xl border border-border bg-muted/10 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-24" />
                    </div>

                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </div>

                {/* Quantity + Actions */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Skeleton className="h-11 w-full rounded-lg sm:w-28" />
                  <Skeleton className="h-11 flex-1 rounded-lg" />
                  <Skeleton className="h-11 flex-1 rounded-lg" />
                  <Skeleton className="h-11 w-full rounded-lg sm:w-11" />
                </div>

                {/* Quick Specs */}
                <div className="mt-8 border-t border-border pt-6">
                  <Skeleton className="mb-5 h-5 w-28" />

                  <div className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-4"
                      >
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Details Section - #F6F1E2 Skeleton Card */}
          <section className="overflow-hidden rounded-2xl border border-border bg-[#F6F1E2] shadow-sm">
            {/* Tabs */}
            <div className="flex gap-7 overflow-hidden border-b border-border px-5 sm:px-7">
              <Skeleton className="my-5 h-4 w-20 shrink-0" />
              <Skeleton className="my-5 h-4 w-24 shrink-0" />
              <Skeleton className="my-5 h-4 w-28 shrink-0" />
              <Skeleton className="my-5 h-4 w-20 shrink-0" />
            </div>

            {/* Description */}
            <div className="p-5 sm:p-7">
              <Skeleton className="mb-5 h-6 w-40" />

              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[92%]" />
                <Skeleton className="h-4 w-[86%]" />
                <Skeleton className="h-4 w-[70%]" />
              </div>

              <div className="mt-8 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[95%]" />
                <Skeleton className="h-4 w-[78%]" />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}