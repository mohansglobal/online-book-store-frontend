import type { Metadata } from "next";
import { Suspense } from "react";
import PublishersPage from "@/components/publishers/PublishersPage";

export const metadata: Metadata = {
  title: "Publishers | Indo Bangla Books",
  description: "Browse publications and distinguished literary publishers.",
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
      <PublishersPage />
    </Suspense>
  );
}
