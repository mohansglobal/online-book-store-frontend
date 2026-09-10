import type { Metadata } from "next";
import { Suspense } from "react";
import CategoriesPage from "@/components/categories/categories-page";

export const metadata: Metadata = {
  title: "Categories | Indo Bangla Books",
  description: "Explore all book categories and genres.",
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
      <CategoriesPage />
    </Suspense>
  );
}