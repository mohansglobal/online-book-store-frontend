"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CategorySearchPage({
  slug,
  categoryId,
}: {
  slug?: string;
  categoryId?: string;
}) {
  const router = useRouter();
  const target = categoryId || slug || "";

  useEffect(() => {
    if (target) {
      router.replace(`/books?category=${encodeURIComponent(target)}`);
    } else {
      router.replace("/books");
    }
  }, [router, target]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      <p className="text-xs text-muted-foreground">Loading books catalog...</p>
    </div>
  );
}

export { CategorySearchPage };
