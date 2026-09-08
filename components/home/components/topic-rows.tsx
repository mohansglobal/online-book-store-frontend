import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { topicRows } from "../data";
import { Rating } from "./rating";

export function TopicRows() {
  return (
    <div className="border-t border-border">
      {topicRows.map((row) => (
        <section
          key={row.title}
          className="mx-auto grid w-[min(1320px,calc(100%-36px))] grid-cols-1 gap-9 border-b border-border py-[70px] md:w-[min(1320px,calc(100%-72px))] md:grid-cols-[0.65fr_1.35fr] md:gap-[60px] md:py-[95px]"
        >
          {/* Topic Information */}
          <div className="flex flex-col justify-start">
            <p className="mb-4.5 text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">
              {row.eyebrow}
            </p>

            <h2 className="mb-4.5 font-display text-[43px] leading-none font-normal text-foreground md:text-[50px]">
              {row.title}
            </h2>

            <p className="mb-6 max-w-[280px] text-sm leading-relaxed text-muted-foreground">
              {row.copy}
            </p>

            <Link
              href="/#books"
              className="inline-flex items-center gap-2 text-xs font-semibold text-foreground transition-colors hover:text-primary"
            >
              View collection

              <ArrowRight
                size={15}
                aria-hidden="true"
              />
            </Link>
          </div>

          {/* Topic Books */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {row.books.map((book, index) => (
              <article
                key={`${book.title}-${index}`}
                className="grid grid-cols-[22px_90px_1fr] items-end gap-3.5"
              >
                {/* Rank */}
                <span className="self-start text-[9px] font-semibold text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Book Cover */}
                <div className="relative h-[135px] w-[90px] overflow-hidden rounded-[3px] shadow-book">
                  <Image
                    src={book.cover}
                    alt={`${book.title} cover`}
                    fill
                    sizes="90px"
                    className="object-cover"
                  />
                </div>

                {/* Book Information */}
                <div>
                  <h3 className="mb-1.5 font-display text-[18px] leading-[1.1] font-normal text-foreground">
                    {book.title}
                  </h3>

                  <p className="mb-3 text-[10px] text-muted-foreground">
                    {book.author}
                  </p>

                  <Rating value={book.rating} />
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}