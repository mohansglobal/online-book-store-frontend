"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AlertCircle } from "lucide-react";
import { FALLBACK_BOOK_COVER } from "@/features/books/types/book.types";
import { resolveCoverUrl } from "@/lib/image-url";

export interface OrderItemDisplay {
  id?: string;
  bookListingId?: string;
  title: string;
  author?: string;
  format?: string;
  coverImage?: string | null;
  quantity: number;
  price?: number;
  sellingPriceInPaise?: number;
  isAvailable?: boolean;
  unavailableReason?: string;
}

interface OrderItemRowProps {
  item: OrderItemDisplay;
}

export function OrderItemRow({ item }: OrderItemRowProps) {
  const [hasError, setHasError] = useState(false);
  const resolvedCover = resolveCoverUrl(item.coverImage);
  const imgSrc = hasError ? FALLBACK_BOOK_COVER : resolvedCover;

  const pricePerUnit =
    typeof item.sellingPriceInPaise === "number"
      ? item.sellingPriceInPaise / 100
      : item.price || 0;

  const totalPrice = pricePerUnit * item.quantity;
  const isAvailable = item.isAvailable ?? true;

  return (
    <div
      className={`flex items-center gap-2.5 rounded-md p-1.5 transition-colors ${
        !isAvailable ? "border border-destructive/20 bg-destructive/5" : ""
      }`}
    >
      <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded border border-border bg-muted">
        <Image
          src={imgSrc}
          alt={`${item.title} cover`}
          fill
          sizes="36px"
          unoptimized={typeof imgSrc === "string" && !imgSrc.startsWith("/")}
          onError={() => setHasError(true)}
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <h3 className="line-clamp-1 text-xs font-semibold text-foreground">
            {item.title}
          </h3>
          {!isAvailable && (
            <span className="flex shrink-0 items-center gap-0.5 text-[9px] font-bold text-destructive">
              <AlertCircle size={10} />
              {item.unavailableReason === "OUT_OF_STOCK"
                ? "Out of stock"
                : item.unavailableReason === "INSUFFICIENT_STOCK"
                ? "Low stock"
                : "Unavailable"}
            </span>
          )}
        </div>

        <p className="line-clamp-1 text-[10px] text-muted-foreground">
          {item.author} {item.format ? `• ${item.format}` : ""}
        </p>

        <div className="mt-0.5 flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground">Qty: {item.quantity}</span>
          <span
            className={`font-bold font-sans tabular-nums ${
              !isAvailable ? "text-muted-foreground line-through" : "text-foreground"
            }`}
          >
            ₹{totalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
