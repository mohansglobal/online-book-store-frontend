import { Skeleton } from "@/components/ui/skeleton";

export function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
      {/* Cart Items List Skeleton */}
      <div className="flex flex-col gap-3 lg:col-span-8">
        {[1, 2].map((key) => (
          <div
            key={key}
            className="flex items-stretch overflow-hidden rounded-xl border border-border bg-surface"
          >
            {/* Cover Skeleton */}
            <div className="relative h-36 w-24 shrink-0 border-r border-border/50 bg-surface-soft sm:w-32">
              <Skeleton className="h-full w-full rounded-none" />
            </div>

            {/* Content Skeleton */}
            <div className="flex min-w-0 flex-1 flex-col justify-between p-3 sm:p-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="mt-2 h-5 w-24" />
              </div>

              <div className="flex items-center justify-between border-t border-border/60 pt-3">
                <Skeleton className="h-7 w-20 rounded-md" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary Skeleton */}
      <aside className="sticky top-24 space-y-5 lg:col-span-4">
        <div className="space-y-4 rounded-lg border border-border bg-surface p-6 shadow-sm">
          <Skeleton className="h-5 w-32 border-b border-border pb-3" />
          <div className="space-y-3 pt-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
          <div className="my-5 flex justify-between border-t border-border pt-4">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
      </aside>
    </div>
  );
}
