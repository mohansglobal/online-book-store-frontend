"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { useBooks } from "@/features/books/hooks/use-books";
import {
  transformApiBookToCatalogBook,
  FALLBACK_BOOK_COVER,
} from "@/features/books/types/book.types";
import { useCart } from "@/features/cart";
import { BookCard } from "./book-card";
import { IconButton } from "./icon-button";
import { SectionHeading } from "./section-heading";
import type { Book } from "../types";

export const CURATED_BOOKS_CATEGORY_ID = "6a9eb5b4463e5a288a801286";

interface CuratedBooksProps {
  onWish?: (book: Book) => void;
  onCart?: (book: Book) => void;
  className?: string;
}

export function CuratedBooks({
  onWish,
  onCart,
  className = "bg-card",
}: CuratedBooksProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const { addItem: addToCart } = useCart();

  const { data: apiResponse, isLoading } = useBooks({
    category: CURATED_BOOKS_CATEGORY_ID,
    limit: 8,
  });

  const apiBooks = apiResponse?.data || [];

  const curatedBooks: Book[] = apiBooks.map((b) => {
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

  const moveCarousel = (direction: -1 | 1): void => {
    railRef.current?.scrollBy({
      left: direction * 520,
      behavior: "smooth",
    });
  };

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

  if (!isLoading && curatedBooks.length === 0) {
    return null;
  }

  const actionHref = `/books?category=${CURATED_BOOKS_CATEGORY_ID}`;

  return (
    <section id="curated-books" className={`py-[76px] md:py-[120px] ${className}`}>
      <div className="mx-auto w-[min(1320px,calc(100%-36px))] md:w-[min(1320px,calc(100%-72px))]">
        <div className="relative md:pr-32">
          <SectionHeading
            eyebrow="CURATED THIS WEEK"
            title="Award winning books"
            action="See all"
            actionHref={actionHref}
          />

          <div className="absolute right-0 bottom-1 hidden items-center gap-1.5 md:flex">
            <Link
              href={actionHref}
              className="group mr-3 flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              See all
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            <IconButton label="Previous" onClick={() => moveCarousel(-1)}>
              <ArrowLeft size={19} />
            </IconButton>

            <IconButton label="Next" onClick={() => moveCarousel(1)}>
              <ArrowRight size={19} />
            </IconButton>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-flow-col auto-cols-[minmax(155px,66vw)] gap-4.5 overflow-x-auto -mr-4 px-1 py-2.5 pb-7.5 sm:auto-cols-[minmax(190px,230px)] md:mr-0 md:gap-7 [&::-webkit-scrollbar]:hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="min-w-[190px] animate-pulse space-y-3 [scroll-snap-align:start]"
              >
                <div className="aspect-[2/3] rounded-md bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={railRef}
            className="grid grid-flow-col auto-cols-[minmax(155px,66vw)] gap-4.5 overflow-x-auto -mr-4 px-1 py-2.5 pb-7.5 [scroll-snap-type:x_mandatory] [scrollbar-width:none] sm:auto-cols-[minmax(190px,230px)] md:mr-0 md:gap-7 [&::-webkit-scrollbar]:hidden"
          >
            {curatedBooks.map((book, index) => (
              <BookCard
                key={book.slug || `${book.title}-${index}`}
                book={book}
                onWish={onWish ? () => onWish(book) : undefined}
                onCart={onCart ? () => onCart(book) : undefined}
              />
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-center md:hidden">
          <Link
            href={actionHref}
            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-hover transition-colors uppercase tracking-wider"
          >
            <span>See all</span>
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
