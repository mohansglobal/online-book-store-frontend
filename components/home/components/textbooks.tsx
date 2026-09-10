"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { useBooks } from "@/features/books/hooks/use-books";
import {
  transformApiBookToCatalogBook,
  FALLBACK_BOOK_COVER,
} from "@/features/books/types/book.types";
import { useGuestCartStore } from "@/features/cart";
import { BookCard } from "./book-card";
import { SectionHeading } from "./section-heading";
import type { Book } from "../types";

export const TEXTBOOKS_CATEGORY_ID = "6a9eb5b4463e5a288a801273";

interface TextbooksProps {
  onWish?: (book: Book) => void;
  onCart?: (book: Book) => void;
}

const SUBJECTS = [
  "Computer Science",
  "Engineering",
  "Mathematics",
  "Business",
  "Science",
  "Humanities",
] as const;

export function Textbooks({ onWish, onCart }: TextbooksProps) {
  const addToCart = useGuestCartStore((s) => s.addItem);

  const { data: apiResponse, isLoading } = useBooks({
    category: TEXTBOOKS_CATEGORY_ID,
    limit: 1,
  });

  const apiBooks = apiResponse?.data || [];

  const featuredBook: Book | null =
    apiBooks.length > 0
      ? (() => {
          const catalog = transformApiBookToCatalogBook(
            apiBooks[0],
            FALLBACK_BOOK_COVER,
          );
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
        })()
      : null;

  const handleCartClick = (book: Book) => {
    if (onCart) {
      onCart(book);
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

  const handleWishClick = (book: Book) => {
    if (onWish) {
      onWish(book);
      return;
    }
    toast.success(`"${book.title}" added to wishlist!`);
  };

  const actionHref = `/books?category=${TEXTBOOKS_CATEGORY_ID}`;

  return (
    <section id="textbooks" className="bg-card py-[76px] md:py-[120px]">
      <div className="mx-auto w-[min(1320px,calc(100%-36px))] md:w-[min(1320px,calc(100%-72px))]">
        <SectionHeading
          eyebrow="BOOKS FOR CURIOUS MINDS"
          title="Learn Something New"
          copy="Computer science, engineering, mathematics, business and humanities."
          action="Browse Textbooks"
          actionHref={actionHref}
        />

        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[1fr_260px] md:gap-20">
          {/* Subjects */}
          <div className="border-t border-border">
            {SUBJECTS.map((subject, index) => (
              <Link
                key={subject}
                href={`/books?category=${TEXTBOOKS_CATEGORY_ID}&search=${encodeURIComponent(subject)}`}
                className="group grid min-h-[64px] grid-cols-[38px_1fr_auto] items-center border-b border-border font-display text-[23px] text-foreground transition-all hover:px-2 hover:text-accent md:min-h-[72px] md:grid-cols-[60px_1fr_auto] md:text-[27px]"
              >
                <span className="font-sans text-[9px] font-semibold text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span>{subject}</span>

                <ArrowUpRight
                  size={20}
                  aria-hidden="true"
                  className="text-muted-foreground transition-colors group-hover:text-accent"
                />
              </Link>
            ))}
          </div>

          {/* Featured Textbook */}
          <div className="mx-auto w-2/3 md:w-full">
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="aspect-[2/3] rounded-md bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
              </div>
            ) : featuredBook ? (
              <BookCard
                book={featuredBook}
                onWish={() => handleWishClick(featuredBook)}
                onCart={() => handleCartClick(featuredBook)}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}