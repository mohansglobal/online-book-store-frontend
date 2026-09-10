import type { Metadata } from "next";
import { Suspense } from "react";
import CartPage from "@/components/cart/cart-page";

export const metadata: Metadata = {
  title: "Shopping Cart | Indo Bangla Books",
  description: "View and manage items in your shopping cart.",
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
        </div>
      }
    >
      <CartPage />
    </Suspense>
  );
}