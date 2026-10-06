"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  Award,
  Crown,
  RefreshCw,
  Store,
  TrendingUp,
} from "lucide-react";
import { useSellerTopSellers } from "../queries/use-seller-top-sellers";

export interface TopSellersCardProps {
  className?: string;
}

function SellerAvatar({
  profilePicture,
  name,
  size = 40,
}: {
  profilePicture?: string;
  name: string;
  size?: number;
}) {
  const [hasError, setHasError] = useState(false);
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "S";

  if (!profilePicture || hasError) {
    return (
      <div className="flex size-full items-center justify-center bg-accent/10 font-bold text-accent text-xs">
        {initial}
      </div>
    );
  }

  return (
    <Image
      src={profilePicture}
      alt={name || "Seller"}
      fill
      sizes={`${size}px`}
      unoptimized
      onError={() => setHasError(true)}
      className="object-cover"
    />
  );
}

export function 
TopSellersCard({
  className = "",
}: TopSellersCardProps) {
  const { data, isLoading, isError, refetch } = useSellerTopSellers({
    limit: 11,
  });

  const analytics = data?.data;
  const items = analytics?.items ?? [];

  const totalRegisteredSellers = analytics?.totalRegisteredSellers ?? 0;
  const totalItemsSold = analytics?.totalItemsSold ?? 0;

  const topSeller = items[0];
  const remainingSellers = items.slice(1);

  const getShare = (itemsSold: number) => {
    if (!totalItemsSold) return 0;
    return (itemsSold / totalItemsSold) * 100;
  };

  return (
    <section
      className={`relative overflow-hidden flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-xs ${className}`}
    >
      <Award
        aria-hidden="true"
        className="pointer-events-none absolute -right-3 -top-4 size-28 rotate-12 text-accent opacity-[0.06] dark:opacity-[0.09]"
      />

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Leaderboard
              </p>

              <h2 className="mt-0.5 text-base font-bold tracking-tight text-foreground sm:text-[17px]">
                Top Sellers
              </h2>
            </div>

            {isLoading ? (
              <div className="h-6 w-20 animate-pulse rounded-full border border-border/40 bg-surface-soft/60" />
            ) : (
              !isError && (
                <div className="flex cursor-pointer select-none items-center gap-1.5 rounded-full border border-border bg-surface-soft/60 px-3 py-1 text-muted-foreground transition-all duration-150 hover:bg-surface-soft hover:text-foreground active:scale-[0.98]">
                  <TrendingUp className="size-3.5 text-accent" />
                  <span className="text-[11px] font-semibold tabular-nums text-foreground">
                    {totalItemsSold.toLocaleString("en-IN")} sold
                  </span>
                </div>
              )
            )}
          </div>

          {/* Error State */}
          {isError && (
            <div className="my-6 flex flex-col items-center justify-center py-6 text-center">
              <AlertCircle className="size-7 text-destructive" />
              <p className="mt-2 text-sm font-semibold text-foreground">
                Failed to load top sellers
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-all duration-200 hover:border-accent hover:bg-accent hover:text-white active:scale-[0.96]"
              >
                <RefreshCw size={13} aria-hidden="true" />
                Retry
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading && !isError && (
            <div className="mt-4 space-y-3">
              {/* Featured #1 Leader Seller Skeleton */}
              <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/10 via-accent/[0.03] to-transparent p-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <div className="size-12 animate-pulse rounded-xl bg-surface-soft" />
                    <div className="absolute -bottom-1 -right-1 size-5 rounded-md bg-accent/30" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="h-2.5 w-20 animate-pulse rounded bg-accent/20" />
                    <div className="h-3.5 w-28 animate-pulse rounded bg-surface-soft" />
                    <div className="h-2.5 w-16 animate-pulse rounded bg-surface-soft/60" />
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <div className="h-5 w-10 animate-pulse rounded bg-surface-soft" />
                    <div className="h-2 w-7 animate-pulse rounded bg-surface-soft/60" />
                    <div className="h-3 w-12 animate-pulse rounded bg-accent/20" />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-accent/10 pt-2">
                  <div className="h-2 w-24 animate-pulse rounded bg-surface-soft/60" />
                  <div className="h-2 w-8 animate-pulse rounded bg-surface-soft" />
                </div>
              </div>

              {/* Remaining Sellers (#2 - #5) Skeleton */}
              <div className="divide-y divide-border/30">
                {[2, 3, 4, 5].map((rank) => (
                  <div
                    key={rank}
                    className="grid grid-cols-[24px_1fr_auto] items-center gap-3 px-2 py-2.5"
                  >
                    <span className="text-center text-xs font-bold text-muted-foreground/40 tabular-nums">
                      #{rank}
                    </span>

                    <div className="flex items-center gap-2.5">
                      <div className="size-8 animate-pulse rounded-lg bg-surface-soft" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-28 animate-pulse rounded bg-surface-soft" />
                        <div className="h-2 w-20 animate-pulse rounded bg-surface-soft/60" />
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 text-right">
                      <div className="h-3 w-10 animate-pulse rounded bg-surface-soft" />
                      <div className="h-2.5 w-12 animate-pulse rounded bg-accent/20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && items.length === 0 && (
            <div className="my-6 flex flex-col items-center justify-center py-6 text-center">
              <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Store size={20} aria-hidden="true" />
              </div>
              <p className="mt-3 text-xs font-semibold text-foreground">
                No seller activity yet
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Top performing sellers will appear once orders are placed
              </p>
            </div>
          )}

          {/* Content with Real Data */}
          {!isLoading && !isError && topSeller && (
            <>
              {/* Featured #1 Leader Seller */}
              <div className="relative mt-4 cursor-pointer select-none overflow-hidden rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/12 via-accent/[0.04] to-transparent p-4 transition-all duration-200 hover:border-accent/40 hover:bg-accent/15 hover:shadow-sm active:scale-[0.99]">
                <div className="pointer-events-none absolute right-3 top-2">
                  <Crown className="size-16 rotate-12 text-accent opacity-[0.08]" />
                </div>

                <div className="relative flex items-center gap-3.5">
                  <div className="relative">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-border bg-surface shadow-xs">
                      <SellerAvatar
                        profilePicture={topSeller.seller?.profilePicture}
                        name={topSeller.seller?.name || "Seller"}
                        size={48}
                      />
                    </div>

                    <div className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-md bg-accent text-[10px] font-bold text-white shadow-xs">
                      1
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <Crown className="size-3 text-accent" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                        Leading Seller
                      </span>
                    </div>

                    <h3 className="mt-0.5 truncate text-sm font-bold text-foreground">
                      {topSeller.seller?.name || "Seller"}
                    </h3>

                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {topSeller.activeListingsCount.toLocaleString("en-IN")}{" "}
                      active{" "}
                      {topSeller.activeListingsCount === 1
                        ? "listing"
                        : "listings"}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-lg font-bold tracking-tight tabular-nums text-foreground">
                      {topSeller.itemsSold.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      items sold
                    </p>
                    <p className="mt-0.5 text-xs font-bold tabular-nums text-accent">
                      {topSeller.formattedRevenue}
                    </p>
                  </div>
                </div>
                          
                <div className="mt-3 flex items-center justify-between border-t border-accent/15 pt-2 text-[10px]">
                  <span className="font-medium text-muted-foreground">
                    Share of total sales
                  </span>
                  <span className="font-bold tabular-nums text-foreground">
                    {getShare(topSeller.itemsSold).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Remaining Sellers (#2 - #5) */}
              {remainingSellers.length > 0 && (
                <div className="mt-2.5 divide-y divide-border/40">
                  {remainingSellers.map((item, index) => {
                    const rank = index + 2;
                    const sellerName = item.seller?.name || "-";
                    const share = getShare(item.itemsSold);

                    return (
                      <div
                        key={item.sellerId || item.seller?.id || rank}
                        className="group grid cursor-pointer select-none grid-cols-[24px_1fr_auto] items-center gap-3 rounded-xl px-2 py-2 transition-all duration-150 hover:bg-surface-soft hover:shadow-2xs active:scale-[0.99]"
                      >
                        <span className="text-center text-xs font-bold tabular-nums text-muted-foreground">
                          #{rank}
                        </span>

                        <div className="flex min-w-0 items-center gap-2.5">
                          <div className="relative size-8 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-surface shadow-2xs">
                            <SellerAvatar
                              profilePicture={item.seller?.profilePicture}
                              name={sellerName}
                              size={32}
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-foreground transition-colors group-hover:text-accent">
                              {sellerName}
                            </p>

                            <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                              <span>
                                {item.activeListingsCount.toLocaleString("en-IN")}{" "}
                                listings
                              </span>
                              <span className="size-0.5 rounded-full bg-border" />
                              <span>{share.toFixed(1)}% share</span>
                            </div>
                          </div>
                        </div>

                        <div className="min-w-[70px] text-right">
                          <div className="flex items-baseline justify-end gap-1">
                            <span className="text-xs font-bold tabular-nums text-foreground">
                              {item.itemsSold.toLocaleString("en-IN")}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              sold
                            </span>
                          </div>

                          <p className="mt-0.5 text-[10px] font-semibold tabular-nums text-accent">
                            {item.formattedRevenue}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!isError && (
          <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
            {/* <span className="text-[11px]">Registered sellers</span> */}
            {isLoading ? (
              <div className="h-3.5 w-10 animate-pulse rounded bg-surface-soft" />
            ) : (
              <div className="flex items-center gap-1.5">
                {/* <span className="size-1.5 rounded-full bg-emerald-500" />
                <span className="font-semibold text-foreground tabular-nums">
                  {totalRegisteredSellers.toLocaleString("en-IN")}
                </span> */}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default TopSellersCard;