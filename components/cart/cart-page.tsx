"use client";

import { toast } from "sonner";

import { CategoryBanner } from "../categories/components/CategoryBanner";
import { CartItemCard } from "./cart-item-card";
import { CartOrderSummary } from "./cart-order-summary";
import { CartEmptyState } from "./cart-empty-state";
import {
  useGuestCartStore,
  selectCartItems,
  selectIsHydrated,
} from "@/features/cart";

export default function CartPage() {
  const items = useGuestCartStore(selectCartItems);
  const isHydrated = useGuestCartStore(selectIsHydrated);
  const updateQuantity = useGuestCartStore((s) => s.updateQuantity);
  const removeItem = useGuestCartStore((s) => s.removeItem);

  /*
   * Calculations (derived, not stored)
   */
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const totalMrp = items.reduce(
    (total, item) => total + item.originalPrice * item.quantity,
    0,
  );

  const mrpSavings = Math.max(0, totalMrp - subtotal);

  const totalCount = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  /*
   * Handlers
   */
  const handleUpdateQuantity = (listingId: string, quantity: number): void => {
    if (quantity < 1) return;
    updateQuantity(listingId, quantity);
  };

  const handleRemoveItem = (listingId: string): void => {
    const item = items.find((i) => i.listingId === listingId);
    if (!item) return;

    removeItem(listingId);

    toast.success(`Removed "${item.title}"`, {
      action: {
        label: "Undo",
        onClick: () => {
          useGuestCartStore.getState().addItem({
            ...item,
          });
          toast.info(`Restored "${item.title}"`);
        },
      },
    });
  };

  // Prevent hydration mismatch: show nothing until localStorage hydrates
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
              {/* Cart Items */}
              <div className="flex flex-col gap-3 lg:col-span-8">
                {items.map((item) => (
                  <CartItemCard
                    key={item.listingId}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>

              {/* Order Summary */}
              <CartOrderSummary
                subtotal={subtotal}
                totalMrp={totalMrp}
                mrpSavings={mrpSavings}
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