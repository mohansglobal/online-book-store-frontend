"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useBooks } from "@/features/books/hooks/use-books";
import {
  FALLBACK_BOOK_COVER,
  transformApiBookToCatalogBook,
} from "@/features/books/types/book.types";
import { BookCard } from "@/components/home/components/book-card";

export function WishlistRecommendations() {
  const { data: response, isLoading } = useBooks({ limit: 5 });

  const books = (response?.data || []).map((b) =>
    transformApiBookToCatalogBook(b, FALLBACK_BOOK_COVER),
  );

  if (!isLoading && books.length === 0) {
    return null;
  }

  return (
    <section className="mt-14 space-y-6">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-accent" />
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Recommended Reads
          </h2>
        </div>

        <Link
          href="/books"
          className="text-xs font-semibold text-accent hover:underline"
        >
          View All Books →
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="aspect-[2/3] animate-pulse rounded-2xl bg-surface border border-border/50"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {books.map((book, idx) => (
            <motion.div
              key={book.id || book.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.4) }}
              className="h-full"
            >
              <BookCard
                book={{
                  id: book.id,
                  slug: book.slug,
                  title: book.title,
                  author: book.author,
                  cover: book.cover,
                  price: book.price,
                  rawPrice: book.rawPrice,
                  priceIn: book.priceIn,
                  originalPrice: book.originalPrice,
                  rating: book.rating,
                  category: book.category,
                }}
              />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

export default WishlistRecommendations;
