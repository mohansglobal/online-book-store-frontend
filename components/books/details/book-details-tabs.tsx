"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Tag } from "lucide-react";
import type { ApiBook } from "@/features/books/types/book.types";
import { resolveAuthorPhoto } from "@/features/books/types/book.types";

export type TabType = "SUMMARY" | "AUTHOR" | "SPECIFICATIONS" | "REVIEWS";

const TAB_OPTIONS: readonly { key: TabType; label: string }[] = [
  { key: "SUMMARY", label: "SUMMARY" },
  { key: "AUTHOR", label: "AUTHOR" },
  { key: "SPECIFICATIONS", label: "SPECIFICATIONS" },
  { key: "REVIEWS", label: "REVIEWS" },
];

export interface BookDetailsTabsProps {
  book: ApiBook;
}

export function BookDetailsTabs({ book }: BookDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("SUMMARY");

  const author = book.authors?.[0];
  const authorName =
    book.authors && book.authors.length > 0
      ? book.authors.map((a) => a.name?.trim()).filter(Boolean).join(", ")
      : "-";
  const publisherName = book.publisher?.name?.trim() || "-";
  const categoryName =
    book.categories && book.categories.length > 0
      ? book.categories.map((c) => c.name?.trim()).filter(Boolean).join(", ")
      : "-";

  const fullSpecifications = [
    { label: "Book Name", value: book.title || "-" },
    { label: "Bengali Name", value: book.titleBn || "-" },
    { label: "Author", value: authorName },
    { label: "Publisher", value: publisherName },
    { label: "Category", value: categoryName },
    { label: "Edition", value: book.edition || "-" },
    { label: "Pages", value: book.pages ? String(book.pages) : "-" },
    { label: "Language", value: book.language || "-" },
    { label: "Binding", value: book.format || "-" },
    { label: "ISBN", value: book.isbn || "-" },
    { label: "Legacy Book ID", value: book.legacyBookId || book.legacyId || "-" },
    { label: "Published Year", value: book.publishedYear ? String(book.publishedYear) : "-" },
    { label: "Country", value: book.country || "-" },
    { label: "Weight", value: book.weight ? String(book.weight) : "-" },
    { label: "Status", value: book.status || "-" },
  ];

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
      {/* Tab Headers */}
      <div className="no-scrollbar flex overflow-x-auto border-b border-border bg-background">
        {TAB_OPTIONS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              aria-selected={isActive}
              className={`relative flex-1 cursor-pointer whitespace-nowrap px-5 py-3.5 text-xs font-semibold tracking-wide transition-colors sm:flex-none ${
                isActive
                  ? "bg-surface text-accent"
                  : "text-muted-foreground hover:bg-surface/50 hover:text-foreground"
              }`}
            >
              {tab.label}
              {isActive && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-accent" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Body */}
      <div className="min-h-[280px] p-5 sm:p-7">
        {/* 1. SUMMARY TAB */}
        {activeTab === "SUMMARY" && (
          <div className="max-w-3xl space-y-5 text-sm leading-relaxed text-muted-foreground">
            {book.description ? (
              <div
                className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground [&>p]:mb-3 [&>p]:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: book.description }}
              />
            ) : (
              <p className="text-muted-foreground">-</p>
            )}

            {/* Search Tags */}
            {book.searchTags && book.searchTags.length > 0 && (
              <div className="pt-4 border-t border-border/60">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-2">
                  <Tag size={13} className="text-accent" />
                  <span>Tags & Keywords:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {book.searchTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent border border-accent/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. AUTHOR TAB */}
        {activeTab === "AUTHOR" && (
          <div className="flex items-start gap-5">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
              <Image
                src={resolveAuthorPhoto(author?.photo)}
                alt={authorName}
                fill
                sizes="80px"
                unoptimized
                className="object-cover"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2">
                <h3 className="font-display text-xl text-foreground">
                  {authorName}
                </h3>
                {author?.nameBn && (
                  <span className="text-xs text-muted-foreground">
                    ({author.nameBn})
                  </span>
                )}
              </div>

              <p className="mb-3 max-w-xl text-sm text-muted-foreground">
                {author?.bio || "-"}
              </p>

              {author?.slug ? (
                <Link
                  href={`/authors?author=${author.slug}`}
                  className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-accent transition-transform hover:translate-x-0.5 hover:underline"
                >
                  View author profile →
                </Link>
              ) : (
                <span className="text-xs text-muted-foreground">-</span>
              )}
            </div>
          </div>
        )}

        {/* 3. SPECIFICATIONS TAB */}
        {activeTab === "SPECIFICATIONS" && (
          <div className="grid max-w-3xl grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {fullSpecifications.map((spec) => (
              <div
                key={spec.label}
                className="flex justify-between border-b border-border/60 pb-2 text-sm"
              >
                <span className="text-muted-foreground">{spec.label}</span>
                <span className="text-right font-medium text-foreground">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 4. REVIEWS TAB */}
        {activeTab === "REVIEWS" && (
          <div className="max-w-3xl space-y-6">
            <div className="flex flex-col items-center gap-6 rounded-lg border border-border bg-background p-4 sm:flex-row sm:items-start">
              <div className="text-center sm:border-r sm:border-border sm:pr-6 sm:text-left">
                <div className="font-display text-4xl font-bold text-foreground">
                  {book.rating ? String(book.rating) : "-"}
                </div>
                {book.rating && (
                  <div className="my-1 flex justify-center text-amber-500 sm:justify-start">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star key={index} size={14} className="fill-amber-500" />
                    ))}
                  </div>
                )}
                <div className="text-[10px] tracking-wide text-muted-foreground uppercase">
                  {book.rating ? "Rating" : "No Reviews (-)"}
                </div>
              </div>

              <div className="w-full flex-1 flex items-center justify-center p-4 text-xs text-muted-foreground italic">
                {book.rating ? `Overall Customer Rating: ${book.rating} / 5` : "No customer reviews yet for this book (-)"}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
