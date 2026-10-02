// Book summary card displayed inside discount management modal
"use client";

import React from "react";
import Image from "next/image";

interface DiscountBookSummaryProps {
  coverUrl: string | null;

  titleEn: string;

  author: string;

  mrp: number;

  hasDiscount: boolean;

  currentSellingPrice: number;

  campaignName?: string;
}

export function DiscountBookSummary({
  coverUrl,
  titleEn,
  author,
  mrp,
  hasDiscount,
  currentSellingPrice,
  campaignName,
}: DiscountBookSummaryProps) {
  const isExternalImage = typeof coverUrl === "string" && !coverUrl.startsWith("/");

  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-border bg-background p-3 my-2">
      <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md border border-border bg-surface-soft">
        <Image
          src={coverUrl || "/placeholder-book.png"}
          alt={titleEn}
          fill
          sizes="48px"
          unoptimized={isExternalImage}
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1 space-y-0.5">
        <h4 className="truncate text-sm font-semibold text-foreground">{titleEn}</h4>

        <p className="truncate text-xs text-muted-foreground">{author}</p>

        <div className="flex items-center gap-2">
          <p className="text-xs font-bold text-accent">MRP: ₹{mrp}</p>

          {hasDiscount && (
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              (Current: ₹{currentSellingPrice})
            </span>
          )}
        </div>

        {campaignName && (
          <p className="text-[11px] font-medium text-accent truncate">
            Campaign: {campaignName}
          </p>
        )}
      </div>
    </div>
  );
}
