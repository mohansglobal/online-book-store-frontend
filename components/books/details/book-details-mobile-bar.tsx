"use client";

import React from "react";
import { Heart, ShoppingBag, Zap } from "lucide-react";

export interface BookDetailsMobileBarProps {
  priceText: string;
  formatLabel: string;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

export function BookDetailsMobileBar({
  priceText,
  formatLabel,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
}: BookDetailsMobileBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-border bg-surface/95 p-3 px-4 shadow-lg backdrop-blur-md md:hidden">
      <div>
        <span className="block text-[10px] text-muted-foreground">
          Price ({formatLabel || "-"})
        </span>
        <span className="text-lg leading-none font-bold text-primary">
          {priceText}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border transition-all hover:border-accent active:scale-95"
        >
          <Heart
            size={18}
            className={isWishlisted ? "fill-accent text-accent" : ""}
          />
        </button>

        <button
          type="button"
          onClick={onAddToCart}
          className="flex h-10 cursor-pointer items-center gap-1.5 rounded-full border border-primary px-3.5 text-xs font-semibold text-primary transition-all hover:bg-primary/10 active:scale-95"
        >
          <ShoppingBag size={14} />
          Cart
        </button>

        <button
          type="button"
          onClick={onBuyNow}
          className="flex h-10 cursor-pointer items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary-hover hover:shadow active:scale-95"
        >
          <Zap size={14} className="fill-current" />
          Buy Now
        </button>
      </div>
    </div>
  );
}
