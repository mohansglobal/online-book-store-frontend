import type { Metadata } from "next";
import { Suspense } from "react";
import AuthorsPage from "@/components/author/AuthorsPage";

export const metadata: Metadata = {
  title: "Authors | Indo Bangla Books",
  description: "Discover curated authors and their literary works.",
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
      <AuthorsPage />
    </Suspense>
  );
}