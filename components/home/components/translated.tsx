"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useBooks } from "@/features/books/hooks/use-books";
import {
  transformApiBookToCatalogBook,
  FALLBACK_BOOK_COVER,
} from "@/features/books/types/book.types";
import { SectionHeading } from "./section-heading";
import type { StaticImageData } from "next/image";

export const TRANSLATED_CATEGORY_ID = "6a9eb5b4463e5a288a801270";

type TranslatedBookItem = {
  id: string;
  slug: string;
  title: string;
  author: string;
  cover: string | StaticImageData;
  language: string;
  translator?: string;
};

function TranslatedCard({ item }: { item: TranslatedBookItem }) {
  const [imgSrc, setImgSrc] = useState(item.cover || FALLBACK_BOOK_COVER);

  useEffect(() => {
    setImgSrc(item.cover || FALLBACK_BOOK_COVER);
  }, [item.cover]);

  const content = (
    <article className="group grid grid-cols-[120px_1fr] items-center gap-3.5 rounded-sm border border-border bg-background p-3 transition-all duration-200 hover:border-border-hover hover:shadow-sm md:grid-cols-[150px_1fr] md:gap-5.5 md:p-4.5 cursor-pointer">
      {/* Book Cover */}
      <div className="relative h-[180px] w-[120px] overflow-hidden rounded-[4px] bg-muted shadow-book md:h-[225px] md:w-[150px]">
        <Image
          src={imgSrc}
          alt={`${item.title} cover`}
          fill
          sizes="(max-width: 768px) 120px, 150px"
          onError={() => setImgSrc(FALLBACK_BOOK_COVER)}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Book Information */}
      <div className="min-w-0">
        <span className="text-[10px] font-semibold tracking-wider text-accent uppercase">
          {item.language}
        </span>

        <h3 className="my-2 line-clamp-2 font-display text-[20px] leading-tight font-normal text-foreground transition-colors group-hover:text-accent md:text-[24px]">
          {item.title}
        </h3>

        <p className="m-0 mb-1 line-clamp-1 text-[11px] text-muted-foreground">
          {item.author}
        </p>

        {item.translator && (
          <small className="line-clamp-1 block text-[11px] text-muted-foreground">
            {item.translator}
          </small>
        )}
      </div>
    </article>
  );

  return item.slug ? (
    <Link href={`/books/${item.slug}`} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}

export function Translated() {
  const { data: apiResponse, isLoading } = useBooks({
    category: TRANSLATED_CATEGORY_ID,
    limit: 3,
  });

  const apiBooks = apiResponse?.data || [];

  const translatedList: TranslatedBookItem[] = apiBooks.map((b) => {
    const catalog = transformApiBookToCatalogBook(b, FALLBACK_BOOK_COVER);
    return {
      id: catalog.id,
      slug: catalog.slug,
      title: catalog.title,
      author: catalog.author,
      cover: catalog.cover,
      language: b.language?.trim() || "Translated Edition",
      translator: b.translation
        ? `Translated by ${b.translation.trim()}`
        : b.publisher?.name
          ? `Published by ${b.publisher.name.trim()}`
          : undefined,
    };
  });

  if (!isLoading && translatedList.length === 0) {
    return null;
  }

  const actionHref = `/books?category=${TRANSLATED_CATEGORY_ID}`;

  return (
    <section className="bg-card py-[76px] md:py-[120px]">
      <div className="mx-auto w-[min(1320px,calc(100%-36px))] md:w-[min(1320px,calc(100%-72px))]">
        <SectionHeading
          eyebrow="TRANSLATED FICTION"
          title="Stories Without Borders"
          copy="Remarkable books translated from voices around the world."
          action="Explore All"
          actionHref={actionHref}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[120px_1fr] items-center gap-3.5 rounded-sm border border-border bg-background p-3 md:grid-cols-[150px_1fr] md:gap-5.5 md:p-4.5 animate-pulse"
                >
                  <div className="h-[180px] w-[120px] rounded-[4px] bg-muted md:h-[225px] md:w-[150px]" />
                  <div className="space-y-3">
                    <div className="h-3 w-1/3 rounded bg-muted" />
                    <div className="h-5 w-3/4 rounded bg-muted" />
                    <div className="h-3 w-1/2 rounded bg-muted" />
                    <div className="h-3 w-2/5 rounded bg-muted" />
                  </div>
                </div>
              ))
            : translatedList.map((item) => (
                <TranslatedCard key={item.slug || item.id} item={item} />
              ))}
        </div>
      </div>
    </section>
  );
}