import Image from "next/image";

import { books } from "../data";
import { SectionHeading } from "./section-heading";

const TRANSLATED_BOOKS = [
  {
    book: books[2],
    language: "Japanese → English",
    translator: "Translated by Emi Watanabe",
  },
  {
    book: books[6],
    language: "Spanish → English",
    translator: "Translated by Claire Morris",
  },
  {
    book: books[1],
    language: "Korean → English",
    translator: "Translated by June Park",
  },
].filter(
  (
    item,
  ): item is {
    book: NonNullable<typeof item.book>;
    language: string;
    translator: string;
  } => Boolean(item.book),
);

export function Translated() {
  return (
    <section className="bg-card py-[76px] md:py-[120px]">
      <div className="mx-auto w-[min(1320px,calc(100%-36px))] md:w-[min(1320px,calc(100%-72px))]">
        <SectionHeading
          eyebrow="TRANSLATED FICTION"
          title="Stories Without Borders"
          copy="Remarkable books translated from voices around the world."
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {TRANSLATED_BOOKS.map(
            ({ book, language, translator }) => (
              <article
                key={book.title}
                className="grid grid-cols-[120px_1fr] items-center gap-3.5 rounded-sm border border-border bg-background p-3 md:grid-cols-[150px_1fr] md:gap-5.5 md:p-4.5"
              >
                {/* Book Cover */}
                <div className="relative h-[180px] w-[120px] overflow-hidden rounded-[4px] shadow-book md:h-[225px] md:w-[150px]">
                  <Image
                    src={book.cover}
                    alt={`${book.title} cover`}
                    fill
                    sizes="(max-width: 768px) 120px, 150px"
                    className="object-cover"
                  />
                </div>

                {/* Book Information */}
                <div>
                  <span className="text-[10px] font-semibold tracking-wider text-accent uppercase">
                    {language}
                  </span>

                  <h3 className="my-2 font-display text-[20px] leading-none font-normal text-foreground md:text-[24px]">
                    {book.title}
                  </h3>

                  <p className="m-0 mb-1 text-[11px] text-muted-foreground">
                    {book.author}
                  </p>

                  <small className="block text-[11px] text-muted-foreground">
                    {translator}
                  </small>
                </div>
              </article>
            ),
          )}
        </div>
      </div>
    </section>
  );
}