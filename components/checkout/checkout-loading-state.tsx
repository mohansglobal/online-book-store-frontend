"use client";

import React from "react";
import { CategoryBanner } from "../categories/components/CategoryBanner";

export function CheckoutLoadingState() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <CategoryBanner categoryName="Checkout" compact />
      <main className="relative z-20 -mt-6 flex-1 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-center py-28">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <p className="text-xs text-muted-foreground">Preparing checkout...</p>
          </div>
        </div>
      </main>
    </div>
  );
}
