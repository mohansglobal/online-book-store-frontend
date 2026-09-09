import type { Metadata } from "next";
import { Suspense } from "react";
import { BooksCatalogPage } from "@/components/books";

export const metadata: Metadata = {
  title: "Books Catalog | Indo Bangla Books",
  description:
    "Explore our complete collection of literary fiction, Indian classics, poetry, drama, science fiction, and regional translations.",
};

export default function BooksPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      }
    >
      <BooksCatalogPage title="ALL BOOKS" />
    </Suspense>
  );
}
