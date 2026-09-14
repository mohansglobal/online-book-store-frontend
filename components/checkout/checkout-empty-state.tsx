"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, BookOpen } from "lucide-react";
import { CategoryBanner } from "../categories/components/CategoryBanner";

export function CheckoutEmptyState() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <CategoryBanner categoryName="Checkout" compact />
      <main className="relative z-20 -mt-6 flex-1 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-surface p-12 text-center shadow-xs">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
            <ShoppingBag size={28} />
          </div>
          <h2 className="text-xl font-bold text-foreground">Your Shopping Cart is Empty</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            You don&apos;t have any books in your cart to checkout.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-soft"
            >
              <ArrowLeft size={14} />
              View Cart
            </Link>
            <Link
              href="/books"
              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-5 py-2 text-xs font-semibold text-white hover:bg-accent-hover shadow-sm"
            >
              <BookOpen size={14} />
              Browse Catalog
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
