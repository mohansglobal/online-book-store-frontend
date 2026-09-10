"use client";

import Link from "next/link";
import { ChevronRight, Share2, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { WishlistItem } from "@/features/wishlist";

type WishlistHeaderProps = {
  items: WishlistItem[];
  onMoveAllToCart: () => void;
  onOpenClearDialog: () => void;
};

export function WishlistHeader({
  items,
  onMoveAllToCart,
  onOpenClearDialog,
}: WishlistHeaderProps) {
  const inStockCount = items.filter((i) => i.inStock !== false).length;
  const totalValue = items.reduce((acc, curr) => acc + (curr.price || 0), 0);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Wishlist on Indo Bangla Books",
          text: `Check out my curated reading wishlist containing ${items.length} books!`,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Wishlist link copied to clipboard!");
    } else {
      toast.info("Share feature is ready.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <ChevronRight size={13} className="text-border" />
        <span className="font-medium text-foreground">Wishlist</span>
      </nav>

      {/* Main Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Saved Literary Gems
            </h1>
            <span className="rounded-full bg-surface-soft px-3 py-0.5 text-xs font-semibold text-text-secondary border border-border/60">
              {items.length} {items.length === 1 ? "Book" : "Books"}
            </span>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Your personal collection of books to read, gift, and collect.
            {totalValue > 0 && (
              <span className="ml-1 font-medium text-text-secondary">
                (Estimated value: ₹{totalValue.toFixed(2)})
              </span>
            )}
          </p>
        </div>

        {/* Bulk Action Buttons */}
        {items.length > 0 && (
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleShare}
              title="Share Wishlist"
              className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-foreground transition-all hover:border-border-hover hover:bg-surface-hover"
            >
              <Share2 size={14} />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              type="button"
              onClick={onOpenClearDialog}
              title="Clear Wishlist"
              className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-destructive transition-all hover:bg-destructive/10 hover:border-destructive"
            >
              <Trash2 size={14} />
              <span className="hidden sm:inline">Clear</span>
            </button>

            <button
              type="button"
              onClick={onMoveAllToCart}
              disabled={inStockCount === 0}
              className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold shadow-xs transition-all duration-200 ${
                inStockCount === 0
                  ? "cursor-not-allowed bg-muted text-muted-foreground opacity-60"
                  : "bg-accent text-white hover:bg-accent-hover active:scale-[0.98]"
              }`}
            >
              <ShoppingBag size={14} />
              <span>Move All to Cart ({inStockCount})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
