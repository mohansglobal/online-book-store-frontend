"use client";

import { CategoryBanner } from "../categories/components/CategoryBanner";
import { CartItemCard } from "./cart-item-card";
import { CartOrderSummary } from "./cart-order-summary";
import { CartEmptyState } from "./cart-empty-state";
import { useCart } from "@/features/cart";

export default function CartPage() {
  const {
    items,
    summary,
    totalCount,
    isHydrated,
    updateQuantity,
    removeItem,
  } = useCart();

  // Prevent hydration mismatch: show loading until hydrated
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-accent selection:text-white">
        <CategoryBanner categoryName="" compact />
        <main className="relative z-20 -mt-8 flex-1 px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-center py-24">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-accent selection:text-white">
      <CategoryBanner categoryName="" compact />

      <main className="relative z-20 -mt-8 flex-1 px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
              {/* Cart Items List */}
              <div className="flex flex-col gap-3 lg:col-span-8">
                {items.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onUpdateQuantity={(id, qty) => updateQuantity(id, qty)}
                    onRemove={(id) => removeItem(id)}
                  />
                ))}
              </div>

              {/* Order Summary */}
              <CartOrderSummary
                subtotal={summary.subtotal}
                totalMrp={summary.totalMrp}
                mrpSavings={summary.mrpSavings}
                totalCount={totalCount}
              />
            </div>
          ) : (
            <CartEmptyState />
          )}
        </div>
      </main>
    </div>
  );
}