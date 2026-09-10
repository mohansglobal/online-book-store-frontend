"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BookCard } from "@/components/home/components/book-card";
import { useBooks } from "@/features/books/hooks/use-books";
import {
  transformApiBookToCatalogBook,
  FALLBACK_BOOK_COVER,
} from "@/features/books/types/book.types";

export interface BookDetailsRelatedProps {
  categoryId?: string;
  currentBookId?: string;
}

export function BookDetailsRelated({
  categoryId,
  currentBookId,
}: BookDetailsRelatedProps) {
  const { data: apiResponse, isLoading } = useBooks({
    category: categoryId || undefined,
    limit: 8,
  });

  const rawBooks = apiResponse?.data || [];
  const relatedBooks = rawBooks
    .filter((b) => b._id !== currentBookId && b.slug !== currentBookId)
    .slice(0, 6)
    .map((b) => {
      const catalog = transformApiBookToCatalogBook(b, FALLBACK_BOOK_COVER);
      return {
        id: catalog.id,
        slug: catalog.slug,
        title: catalog.title,
        author: catalog.author,
        cover: catalog.cover,
        price: catalog.price,
        rawPrice: catalog.rawPrice,
        priceIn: catalog.priceIn,
        originalPrice: catalog.originalPrice,
        rating: catalog.rating,
        category: catalog.category,
        detail: catalog.detail,
      };
    });

  if (!isLoading && relatedBooks.length === 0) return null;

  return (
    <section className="pt-8 pb-4">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <span className="mb-0.5 block text-[10px] font-bold tracking-wider text-accent uppercase">
            Handpicked Recommendations
          </span>
          <h2 className="font-display text-xl text-foreground sm:text-2xl">
            Related Reads
          </h2>
        </div>

        <Link
          href="/books"
          className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-accent transition-transform hover:translate-x-0.5 hover:underline"
        >
          View All
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
        {relatedBooks.map((book) => (
          <BookCard
            key={book.slug || book.title}
            book={book}
            size="sm"
            compact
          />
        ))}
      </div>
    </section>
  );
}

export default BookDetailsRelated;
