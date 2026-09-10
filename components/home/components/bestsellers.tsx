"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useBooks } from "@/features/books/hooks/use-books";
import {
  transformApiBookToCatalogBook,
  FALLBACK_BOOK_COVER,
} from "@/features/books/types/book.types";
import { Rating } from "./rating";
import { SectionHeading } from "./section-heading";
import type { Book } from "../types";

function BestsellerItem({ book, index }: { book: Book; index: number }) {
  const [imgSrc, setImgSrc] = useState(book.cover || FALLBACK_BOOK_COVER);

  useEffect(() => {
    setImgSrc(book.cover || FALLBACK_BOOK_COVER);
  }, [book.cover]);

  const isTopSeller = index === 0;

  const articleClasses = isTopSeller
    ? "min-h-[250px] grid-cols-[45px_115px_1fr] sm:grid-cols-[70px_230px_1fr] md:col-span-2 md:min-h-[300px] lg:col-span-1 lg:row-span-2"
    : "min-h-[210px] grid-cols-[45px_90px_1fr] sm:grid-cols-[50px_110px_1fr] md:min-h-[250px]";

  const rankClasses = isTopSeller
    ? "text-[48px] text-accent sm:text-[72px]"
    : "text-[34px] text-muted-foreground sm:text-[42px]";

  const imageWrapperClasses = isTopSeller
    ? "h-[173px] w-[115px] sm:h-[345px] sm:w-[230px]"
    : "h-[135px] w-[90px] sm:h-[165px] sm:w-[110px]";

  const content = (
    <article
      className={`grid items-center gap-4 border-t border-border py-6 ${articleClasses} cursor-pointer group`}
    >
      {/* Rank */}
      <span
        className={`self-start font-display font-normal leading-none ${rankClasses}`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Book Cover */}
      <div
        className={`relative overflow-hidden rounded-[3px] bg-muted shadow-book ${imageWrapperClasses}`}
      >
        <Image
          src={imgSrc}
          alt={`${book.title} cover`}
          fill
          sizes={
            isTopSeller
              ? "(max-width: 640px) 115px, 230px"
              : "(max-width: 640px) 90px, 110px"
          }
          onError={() => setImgSrc(FALLBACK_BOOK_COVER)}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Book Information */}
      <div>
        <span className="block text-[9px] font-semibold tracking-wider text-accent uppercase">
          {book.category}
        </span>

        <h3 className="mt-3.5 mb-1.5 font-display text-[20px] leading-none font-normal text-foreground transition-colors group-hover:text-accent sm:text-[24px]">
          {book.title}
        </h3>

        <p className="mb-2 text-[11px] text-muted-foreground">
          {book.author}
        </p>

        <Rating value={book.rating} />

        <strong className="mt-4 block text-[13px] font-semibold text-foreground">
          {book.price}
        </strong>
      </div>
    </article>
  );

  return book.slug ? (
    <Link href={`/books/${book.slug}`} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}

export function Bestsellers() {
  const { data: apiResponse, isLoading } = useBooks({
    limit: 5,
    sortBy: "rating",
    sortOrder: "desc",
  });

  const apiBooks = apiResponse?.data || [];

  const bestsellerBooks: Book[] = apiBooks.map((b) => {
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

  if (!isLoading && bestsellerBooks.length === 0) {
    return null;
  }

  return (
    <section className="bg-background py-[76px] md:py-[120px]">
      <div className="mx-auto w-[min(1320px,calc(100%-36px))] md:w-[min(1320px,calc(100%-72px))]">
        <SectionHeading
          eyebrow="READERS' CHOICE"
          title="This week's best sellers"
          action="View All"
          actionHref="/books?sort=rating"
        />

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr]">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`border-t border-border py-6 animate-pulse flex gap-4 ${
                  i === 0
                    ? "md:col-span-2 lg:col-span-1 lg:row-span-2"
                    : ""
                }`}
              >
                <div className="h-10 w-8 rounded bg-muted" />
                <div
                  className={`rounded bg-muted ${
                    i === 0 ? "h-[300px] w-[200px]" : "h-[140px] w-[95px]"
                  }`}
                />
                <div className="flex-1 space-y-3">
                  <div className="h-3 w-1/4 rounded bg-muted" />
                  <div className="h-5 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                  <div className="h-4 w-1/3 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr]">
            {bestsellerBooks.map((book, index) => (
              <BestsellerItem
                key={`${book.slug || book.title}-${index}`}
                book={book}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}