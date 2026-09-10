import type { Metadata } from "next";
import { Suspense } from "react";
import { WishlistPage } from "@/components/wishlist";

export const metadata: Metadata = {
  title: "My Wishlist | Indo Bangla Books",
  description:
    "View and manage your saved books, curated reading lists, and literary wishlist on Indo Bangla Books.",
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
      <WishlistPage />
    </Suspense>
  );
}
