"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { useBooks } from "@/features/books/hooks/use-books";
import {
  transformApiBookToCatalogBook,
  FALLBACK_BOOK_COVER,
} from "@/features/books/types/book.types";
import { useCart } from "@/features/cart";
import { BookCard } from "./book-card";
import type { Book } from "../types";

export const POETRY_CATEGORY_ID = "6a9eb5b4463e5a288a801292";

interface PoetryProps {
  onWish?: (book: Book) => void;
  onCart?: (book: Book) => void;
}

export function Poetry({ onWish, onCart }: PoetryProps) {
  const { addItem: addToCart } = useCart();

  const { data: apiResponse, isLoading } = useBooks({
    category: POETRY_CATEGORY_ID,
    limit: 2,
  });

  const apiBooks = apiResponse?.data || [];

  const poetryBooks: Book[] = apiBooks.map((b) => {
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

  if (!isLoading && poetryBooks.length === 0) {
    return null;
  }

  const actionHref = `/books?category=${POETRY_CATEGORY_ID}`;

  return (
    <section className="bg-card py-[76px] md:py-[120px]">
      <div className="mx-auto grid w-[min(1320px,calc(100%-36px))] grid-cols-1 items-center gap-12 md:w-[min(1320px,calc(100%-72px))] md:grid-cols-[1fr_1.2fr] md:gap-[100px]">
        {/* Poetry Content */}
        <div>
          <p className="mb-4.5 text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">
            POETRY & PROSE
          </p>

          <blockquote className="m-0 font-display text-[clamp(44px,5vw,78px)] leading-[0.98] font-normal text-foreground">
            “A poem begins in delight and ends in{" "}
            <em className="italic text-accent">
              wisdom.
            </em>
            ”
          </blockquote>

          <span className="my-6 mb-11 block text-sm font-medium text-muted-foreground">
            — Robert Frost
          </span>

          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium text-muted-foreground transition-all hover:gap-3 hover:text-foreground"
          >
            Explore the collection

            <ArrowUpRight
              size={16}
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Featured Poetry Books */}
        <div className="grid grid-cols-2 gap-3.5 md:gap-7.5">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className={`animate-pulse space-y-3 ${index === 0 ? "md:translate-y-12" : ""}`}
              >
                <div className="aspect-[2/3] rounded-md bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
              </div>
            ))
          ) : (
            poetryBooks.map((book, index) => (
              <div
                key={book.slug || book.id || book.title}
                className={index === 0 ? "md:translate-y-12" : ""}
              >
                <BookCard
                  book={book}
                  onWish={onWish ? () => onWish(book) : undefined}
                  onCart={onCart ? () => onCart(book) : undefined}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}