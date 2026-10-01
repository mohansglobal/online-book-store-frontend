import { Skeleton } from "@/components/ui/skeleton";

// Loading placeholder matching the parchment styled AuthorCard
export function AuthorCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-border/70 bg-[#F7F1E3] p-6 shadow-xs md:p-8">
      <div>
        <div className="mb-6 flex items-start justify-between">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="mb-4 h-8 w-3/4 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
      </div>
      <div className="mt-8 border-t border-border/60 pt-4">
        <Skeleton className="h-5 w-28 rounded" />
      </div>
    </div>
  );
}
