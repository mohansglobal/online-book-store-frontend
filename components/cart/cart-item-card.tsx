"use client";

import Image from "next/image";
import Link from "next/link";
import { AlertCircle, Minus, Plus, Trash2 } from "lucide-react";
import type { CartItemView } from "@/features/cart/types/cart.types";

type CartItemCardProps = {
  item: CartItemView;
  onUpdateQuantity: (identifier: string, quantity: number) => void;
  onRemove: (identifier: string) => void;
};

export function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemCardProps) {
  const discountPercent =
    item.originalPrice > item.price
      ? Math.round(
          ((item.originalPrice - item.price) / item.originalPrice) * 100,
        )
      : 0;

  const isUnavailable = !item.isAvailable || item.isOutOfStock;

  return (
    <article
      className={`group flex items-stretch overflow-hidden rounded-xl border border-border bg-surface transition-all duration-200 hover:border-border-hover hover:shadow-sm ${
        isUnavailable ? "opacity-85 border-destructive/30" : ""
      }`}
    >
      {/* Cover */}
      <div className="relative w-24 shrink-0 overflow-hidden border-r border-border/50 bg-surface-soft sm:w-32">
        <Image
          src={item.coverImage}
          alt={`${item.title} cover`}
          fill
          sizes="(max-width: 640px) 96px, 128px"
          className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
            isUnavailable ? "grayscale" : ""
          }`}
          unoptimized
        />
        {isUnavailable && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center p-1 text-center">
            <span className="text-[10px] font-bold text-destructive uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link
              href={item.slug ? `/books/${item.slug}` : "/books"}
              className="line-clamp-2 text-sm leading-tight font-bold text-foreground transition-colors hover:text-accent sm:text-base"
            >
              {item.title}
            </Link>

            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <span className="max-w-[120px] truncate font-medium text-text-secondary sm:max-w-none">
                {item.author}
              </span>

              <span className="h-1 w-1 shrink-0 rounded-full bg-border" />

              <span className="truncate">{item.format}</span>
            </div>
          </div>
        </div>

        {/* Stock status alerts */}
        {item.exceedsStock && typeof item.availableStock === "number" && (
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
            <AlertCircle size={13} />
            <span>Only {item.availableStock} unit(s) available in stock.</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-bold tracking-tight text-foreground">
            <span className="font-sans">₹</span>
            {item.price.toFixed(2)}
          </span>

          {discountPercent > 0 && (
            <>
              <span className="text-xs text-muted-foreground line-through decoration-border">
                ₹{item.originalPrice.toFixed(2)}
              </span>

              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                ({discountPercent}% OFF)
              </span>
            </>
          )}
        </div>

        <div className="mt-auto pt-3" />

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3">
          <div className="flex items-center gap-3">
            {/* Quantity Controls */}
            <div className="flex h-7 items-center overflow-hidden rounded-md border border-border bg-background">
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1 || isUnavailable}
                aria-label={`Decrease quantity of ${item.title}`}
                className="flex h-full w-7 cursor-pointer items-center justify-center text-text-secondary transition-colors hover:bg-surface-soft hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Minus size={12} />
              </button>

              <span
                aria-label={`Quantity of ${item.title}`}
                className="flex h-full min-w-8 items-center justify-center border-x border-border bg-transparent px-2 text-center text-xs font-bold text-foreground"
              >
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                disabled={
                  isUnavailable ||
                  (item.exceedsStock &&
                    typeof item.availableStock === "number" &&
                    item.quantity >= item.availableStock)
                }
                aria-label={`Increase quantity of ${item.title}`}
                className="flex h-full w-7 cursor-pointer items-center justify-center text-text-secondary transition-colors hover:bg-surface-soft hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            title="Remove item"
            className="flex cursor-pointer items-center gap-1 text-xs font-medium text-text-secondary transition-colors hover:text-rose-600 dark:hover:text-rose-400"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>
    </article>
  );
}
