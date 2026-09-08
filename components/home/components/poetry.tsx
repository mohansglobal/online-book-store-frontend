"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { books } from "../data";
import { BookCard } from "./book-card";

interface PoetryProps {
  onWish: () => void;
  onCart: () => void;
}

const POETRY_BOOKS = [books[3], books[5]].filter(
  (book): book is NonNullable<typeof book> => Boolean(book),
);

export function Poetry({
  onWish,
  onCart,
}: PoetryProps) {
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
            href="/#books"
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
          {POETRY_BOOKS.map((book, index) => (
            <div
              key={book.title}
              className={index === 0 ? "md:translate-y-12" : ""}
            >
              <BookCard
                book={book}
                onWish={onWish}
                onCart={onCart}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}