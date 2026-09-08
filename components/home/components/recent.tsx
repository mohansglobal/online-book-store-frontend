"use client";

import { books } from "../data";
import { BookCard } from "./book-card";
import { SectionHeading } from "./section-heading";

interface RecentProps {
  onWish: () => void;
  onCart: () => void;
}

export function Recent({
  onWish,
  onCart,
}: RecentProps) {
  const recentBooks = books.slice(0, 12);

  return (
    <section className="bg-background py-[76px] md:py-[120px]">
      <div className="mx-auto w-[min(1320px,calc(100%-36px))] md:w-[min(1320px,calc(100%-72px))]">
        <SectionHeading
          eyebrow="JUST IN"
          title="Recently Published"
          copy="Fresh stories, new voices and the latest releases."
          action="View New Releases"
        />

        <div className="grid grid-cols-2 gap-x-3.5 gap-y-9 sm:grid-cols-3 sm:gap-x-7 sm:gap-y-[58px] md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {recentBooks.map((book) => (
            <BookCard
              key={book.title}
              book={book}
              compact
              onWish={onWish}
              onCart={onCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}