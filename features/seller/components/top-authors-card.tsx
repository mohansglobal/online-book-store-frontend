"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, AlertCircle, RefreshCw, User, Users } from "lucide-react";
import { getAuthorImage } from "@/components/author/components/recent-authors-list";
import { useSellerTopAuthors } from "../queries/use-seller-top-authors";

function TopAuthorAvatar({ photo, name }: { photo?: string; name: string }) {
  const [hasError, setHasError] = useState(false);
  const resolvedSrc = getAuthorImage(photo);

  if (!photo || hasError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-accent/10 font-bold text-accent">
        <User size={20} aria-hidden="true" />
      </div>
    );
  }

  return (
    <Image
      src={resolvedSrc}
      alt={name || "Author"}
      fill
      sizes="72px"
      unoptimized
      onError={() => setHasError(true)}
      className="object-cover"
    />
  );
}

export function TopAuthorsCard() {
  const { data, isLoading, isError, refetch } = useSellerTopAuthors({
    limit: 5,
  });

  const analytics = data?.data;
  const items = analytics?.items ?? [];

  const title = analytics?.title || "Top 5 Authors by Sales";
  const subtitle = analytics?.subtitle || "TOP AUTHOR VOLUME";

  const activeAuthorsCount = analytics?.activeAuthorsInCatalogCount ?? 0;
  const totalCopiesSoldFormatted =
    analytics?.formattedTotalCopiesSold ||
    `${(analytics?.totalCopiesSold ?? 0).toLocaleString("en-IN")} Total Copies Sold`;

  // Get max sales to calculate the relative 100% width for the progress bars
  const maxSales = items[0]?.booksSold || 1;

  return (
    <section className="relative overflow-hidden flex flex-col justify-between rounded-3xl border border-border/40 bg-background p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] md:col-span-7">
      {/* Background Rotated Watermark Icon */}
      <Users
        aria-hidden
        className="pointer-events-none absolute -right-3 -top-4 size-28 rotate-12 text-accent opacity-[0.06] dark:opacity-[0.09]"
      />

      <div className="relative z-10 flex flex-col justify-between h-full">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              {subtitle}
            </span>

            <h2 className="mt-0.5 text-base font-semibold text-foreground">
              {title}
            </h2>
          </div>

          <Link
            href="/authors"
            title="View All Authors"
            className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-accent hover:underline"
          >
            View all
            <ChevronRight size={14} aria-hidden="true" />
          </Link>
        </div>

        {/* Error state */}
        {isError && (
          <div className="my-6 flex flex-col items-center justify-center py-6 text-center">
            <AlertCircle className="h-7 w-7 text-destructive" />

            <p className="mt-2 text-sm font-semibold text-foreground">
              Failed to load top authors analytics
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-surface"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* Loading List Skeleton */}
        {isLoading && (
          <div className="mt-5 flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-border/20 bg-surface/10 p-2"
              >
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded bg-foreground/10 dark:bg-white/10 animate-pulse" />
                  <div className="h-8 w-8 rounded-full bg-foreground/15 dark:bg-white/15 animate-pulse" />
                  <div className="h-4 w-24 rounded bg-foreground/10 dark:bg-white/10 animate-pulse" />
                </div>
                <div className="h-4 w-16 rounded bg-foreground/10 dark:bg-white/10 animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* Relative Volume Progress Bars */}
        {!isLoading && !isError && items.length > 0 && (
          <div className="mt-5 flex flex-col gap-2.5 min-h-[220px]">
            {items.map((author, index) => {
              // Ensure minimum 5% width so even small sellers have a visible bar
              const percentage = Math.max((author.booksSold / maxSales) * 100, 5);

              return (
                <Link
                  key={author.authorId || author.slug || index}
                  href={`/authors/${author.slug}`}
                  className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-border/40 bg-surface/30 p-2 transition-colors hover:border-accent/50"
                >
                  {/* Progress Bar Background */}
                  <div
                    className="absolute left-0 top-0 h-full bg-accent/10 transition-all duration-1000 ease-out group-hover:bg-accent/20 dark:bg-accent/20"
                    style={{ width: `${percentage}%` }}
                  />

                  {/* Left Side Content */}
                  <div className="relative z-10 flex items-center gap-3">
                    <span
                      className={`w-5 text-center text-xs font-bold ${
                        index === 0
                          ? "text-amber-500"
                          : index === 1
                          ? "text-slate-400"
                          : index === 2
                          ? "text-amber-700 dark:text-amber-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      #{index + 1}
                    </span>

                    
                    <div className="relative h-9 w-9 overflow-hidden rounded-full border border-border/50 bg-background shadow-sm">
                      <TopAuthorAvatar photo={author.photo} name={author.name} />
                    </div>
                    <span className="text-sm font-semibold text-foreground group-hover:text-accent">
                      {author.name}
                    </span>
                  </div>

                  {/* Right Side Sales Data */}
                  <div className="relative z-10 pr-2 text-xs font-bold text-foreground/80 tabular-nums">
                    {author.formattedBooksSold || `${author.booksSold} sold`}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Summary Bar */}
      {!isError && (
        <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-4 text-xs text-muted-foreground">
          <span>
            Active Authors in Catalog:{" "}
            {isLoading ? (
              <span className="inline-block h-3.5 w-6 rounded bg-foreground/15 dark:bg-white/15 animate-pulse align-middle" />
            ) : (
              <strong className="font-semibold text-foreground tabular-nums">
                {activeAuthorsCount}
              </strong>
            )}
          </span>

          {isLoading ? (
            <div className="h-3.5 w-32 rounded bg-foreground/15 dark:bg-white/15 animate-pulse" />
          ) : (
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {totalCopiesSoldFormatted}
            </span>
          )}
        </div>
      )}
      </div>
    </section>
  );
}