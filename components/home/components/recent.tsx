"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useBooks } from "@/features/books/hooks/use-books";
import {
  transformApiBookToCatalogBook,
  FALLBACK_BOOK_COVER,
} from "@/features/books/types/book.types";
import { useCart } from "@/features/cart";
import { BookCard } from "./book-card";
import { SectionHeading } from "./section-heading";
import type { Book } from "../types";

interface RecentProps {
  onWish?: () => void;
  onCart?: () => void;
}

export function Recent({ onWish, onCart }: RecentProps) {
  const { addItem: addToCart } = useCart();

  const { data: apiResponse, isLoading } = useBooks({
    limit: 6,
    sortBy: "publicationDate",
    sortOrder: "desc",
  });

  const apiBooks = apiResponse?.data || [];

  const recentBooks: Book[] = apiBooks.map((b) => {
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

  const handleCartClick = (book: Book) => {
    if (onCart) {
      onCart();
      return;
    }

    const rawPrice =
      book.rawPrice ??
      (typeof book.price === "number"
        ? book.price
        : parseFloat(String(book.price || 0).replace(/[^0-9.]/g, "")) || 0);

    const origPrice =
      typeof book.originalPrice === "number"
        ? book.originalPrice
        : parseFloat(String(book.originalPrice || 0).replace(/[^0-9.]/g, "")) || rawPrice;

    addToCart({
      listingId: book.id || book.slug || book.title,
      bookId: book.id || book.slug || book.title,
      slug: book.slug || "",
      title: book.title,
      coverImage:
        typeof book.cover === "string"
          ? book.cover
          : (book.cover as { src?: string })?.src || "",
      author: book.author || "-",
      format: "Paperback",
      price: rawPrice,
      originalPrice: origPrice,
      quantity: 1,
    });

    toast.success(`"${book.title}" added to cart!`);
  };

  if (!isLoading && recentBooks.length === 0) {
    return null;
  }

  return (
    <section className="bg-background py-[76px] md:py-[120px]">
      <div className="mx-auto w-[min(1320px,calc(100%-36px))] md:w-[min(1320px,calc(100%-72px))]">
        <SectionHeading
          eyebrow="JUST IN"
          title="Recently Published"
          copy="Fresh stories, new voices and the latest releases."
          action="View New Releases"
          actionHref="/books?sort=publicationDate"
        />

        {isLoading ? (
          <div className="grid grid-cols-2 gap-x-3.5 gap-y-9 sm:grid-cols-3 sm:gap-x-7 sm:gap-y-[58px] md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="aspect-[2/3] rounded-md bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3.5 gap-y-9 sm:grid-cols-3 sm:gap-x-7 sm:gap-y-[58px] md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {recentBooks.map((book) => (
              <BookCard
                key={book.slug || book.id || book.title}
                book={book}
                compact
                onWish={onWish ? () => onWish() : undefined}
                onCart={onCart ? () => onCart() : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}