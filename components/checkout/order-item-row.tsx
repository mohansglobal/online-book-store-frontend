"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AlertCircle, Minus, Plus } from "lucide-react";
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
  stockAvailable?: number;
}

interface OrderItemRowProps {
  item: OrderItemDisplay;
  onUpdateQuantity?: (bookListingId: string, quantity: number) => void;
  isUpdating?: boolean;
}

export function OrderItemRow({
  item,
  onUpdateQuantity,
  isUpdating = false,
}: OrderItemRowProps) {
  const [hasError, setHasError] = useState(false);
  const resolvedCover = resolveCoverUrl(item.coverImage);
  const imgSrc = hasError ? FALLBACK_BOOK_COVER : resolvedCover;

  const pricePerUnit =
    typeof item.sellingPriceInPaise === "number"
      ? item.sellingPriceInPaise / 100
      : item.price || 0;

  const totalPrice = pricePerUnit * item.quantity;
  const isAvailable = item.isAvailable ?? true;
  const maxStock = item.stockAvailable ?? 20;
  const targetListingId = item.bookListingId || item.id || "";

  const canDecrease = !isUpdating && item.quantity > 1;
  const canIncrease = !isUpdating && isAvailable && item.quantity < maxStock;

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

        <div className="mt-1 flex items-center justify-between text-[10px]">
          {onUpdateQuantity && targetListingId ? (
            <div className="flex items-center gap-1 rounded border border-border bg-surface-soft px-1 py-0.5">
              <button
                type="button"
                onClick={() => onUpdateQuantity(targetListingId, item.quantity - 1)}
                disabled={!canDecrease}
                aria-label="Decrease quantity"
                className="flex h-4 w-4 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus size={10} />
              </button>
              <span className="min-w-3 text-center text-xs font-semibold tabular-nums text-foreground">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(targetListingId, item.quantity + 1)}
                disabled={!canIncrease}
                aria-label="Increase quantity"
                className="flex h-4 w-4 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus size={10} />
              </button>
            </div>
          ) : (
            <span className="text-muted-foreground">Qty: {item.quantity}</span>
          )}

          <div className="text-right">
            <span
              className={`font-bold font-sans tabular-nums ${
                !isAvailable ? "text-muted-foreground line-through" : "text-foreground"
              }`}
            >
              ₹{totalPrice.toFixed(2)}
            </span>
            {item.quantity > 1 && (
              <span className="ml-1 text-[9px] text-muted-foreground">
                (₹{pricePerUnit.toFixed(2)} each)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
