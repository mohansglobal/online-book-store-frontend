"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useBooks } from "@/features/books/hooks/use-books";
import {
  transformApiBookToCatalogBook,
  FALLBACK_BOOK_COVER,
} from "@/features/books/types/book.types";
import { Rating } from "./rating";
import type { Book } from "../types";

export const TOPIC_CATEGORY_IDS = {
  QUIET_EVENING: "6a9eb5b4463e5a288a801270",
  SPIRITUALITY: "6a9eb5b4463e5a288a801268",
  POLITICS: "6a9eb5b4463e5a288a801275",
  SPORTS: "6a9eb5b4463e5a288a801293",
} as const;

type TopicConfig = {
  eyebrow: string;
  title: string;
  copy: string;
  categoryId: string;
};

const TOPIC_SECTIONS: TopicConfig[] = [
  {
    eyebrow: "SHORT READS",
    title: "Stories for a Quiet Evening",
    copy: "Short reads from voices across India and beyond.",
    categoryId: TOPIC_CATEGORY_IDS.QUIET_EVENING,
  },
  {
    eyebrow: "INNER LIFE",
    title: "Spirituality & Philosophy",
    copy: "Wisdom, reflection and ideas for the inner journey.",
    categoryId: TOPIC_CATEGORY_IDS.SPIRITUALITY,
  },
  {
    eyebrow: "INDIA & THE WORLD",
    title: "Politics & Current Affairs",
    copy: "Perspectives on India, democracy and a changing world.",
    categoryId: TOPIC_CATEGORY_IDS.POLITICS,
  },
  {
    eyebrow: "BEYOND THE FIELD",
    title: "Sports",
    copy: "Icons, rivalries and stories that became part of our culture.",
    categoryId: TOPIC_CATEGORY_IDS.SPORTS,
  },
];

function TopicBookCard({ book, index }: { book: Book; index: number }) {
  const [imgSrc, setImgSrc] = useState(book.cover || FALLBACK_BOOK_COVER);

  useEffect(() => {
    setImgSrc(book.cover || FALLBACK_BOOK_COVER);
  }, [book.cover]);

  const content = (
    <article className="group grid grid-cols-[22px_90px_1fr] items-end gap-3.5 cursor-pointer">
      {/* Rank */}
      <span className="self-start text-[9px] font-semibold text-muted-foreground transition-colors group-hover:text-accent">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Book Cover */}
      <div className="relative h-[135px] w-[90px] overflow-hidden rounded-[3px] bg-muted shadow-book">
        <Image
          src={imgSrc}
          alt={`${book.title} cover`}
          fill
          sizes="90px"
          onError={() => setImgSrc(FALLBACK_BOOK_COVER)}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Book Information */}
      <div className="min-w-0">
        <h3 className="mb-1.5 line-clamp-2 font-display text-[18px] leading-[1.1] font-normal text-foreground transition-colors group-hover:text-accent">
          {book.title}
        </h3>

        <p className="mb-2 line-clamp-1 text-[10px] text-muted-foreground">
          {book.author}
        </p>

        <Rating value={book.rating} />
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

function TopicRowSection({ config }: { config: TopicConfig }) {
  const { data: apiResponse, isLoading } = useBooks({
    category: config.categoryId,
    limit: 3,
  });

  const apiBooks = apiResponse?.data || [];

  const booksList: Book[] = apiBooks.map((b) => {
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

  if (!isLoading && booksList.length === 0) {
    return null;
  }

  const collectionHref = `/books?category=${config.categoryId}`;

  return (
    <section className="mx-auto grid w-[min(1320px,calc(100%-36px))] grid-cols-1 gap-9 border-b border-border py-[70px] md:w-[min(1320px,calc(100%-72px))] md:grid-cols-[0.65fr_1.35fr] md:gap-[60px] md:py-[95px]">
      {/* Topic Information */}
      <div className="flex flex-col justify-start">
        <p className="mb-4.5 text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">
          {config.eyebrow}
        </p>

        <h2 className="mb-4.5 font-display text-[43px] leading-none font-normal text-foreground md:text-[50px]">
          {config.title}
        </h2>

        <p className="mb-6 max-w-[280px] text-sm leading-relaxed text-muted-foreground">
          {config.copy}
        </p>

        <Link
          href={collectionHref}
          className="inline-flex items-center gap-2 text-xs font-semibold text-foreground transition-colors hover:text-primary"
        >
          View collection
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>

      {/* Topic Books */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-[22px_90px_1fr] items-end gap-3.5 animate-pulse"
            >
              <div className="h-3 w-3 bg-muted rounded self-start" />
              <div className="h-[135px] w-[90px] rounded-[3px] bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
                <div className="h-3 w-1/3 rounded bg-muted" />
              </div>
            </div>
          ))
        ) : (
          booksList.map((book, index) => (
            <TopicBookCard
              key={`${config.title}-${book.slug || book.title}-${index}`}
              book={book}
              index={index}
            />
          ))
        )}
      </div>
    </section>
  );
}

export function TopicRows() {
  return (
    <div className="border-t border-border">
      {TOPIC_SECTIONS.map((config) => (
        <TopicRowSection key={config.title} config={config} />
      ))}
    </div>
  );
}