import Image from "next/image";

import { books } from "../data";
import { Rating } from "./rating";
import { SectionHeading } from "./section-heading";

export function Bestsellers() {
  const bestsellerBooks = books.slice(0, 5);

  return (
    <section className="bg-background py-[76px] md:py-[120px]">
      <div className="mx-auto w-[min(1320px,calc(100%-36px))] md:w-[min(1320px,calc(100%-72px))]">
        <SectionHeading
          eyebrow="READERS' CHOICE"
          title="This week's best sellers"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr]">
          {bestsellerBooks.map((book, index) => {
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

            return (
              <article
                key={`${book.title}-${index}`}
                className={`grid items-center gap-4 border-t border-border py-6 ${articleClasses}`}
              >
                {/* Rank */}
                <span
                  className={`self-start font-display font-normal leading-none ${rankClasses}`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Book Cover */}
                <div
                  className={`relative overflow-hidden rounded-[3px] shadow-book ${imageWrapperClasses}`}
                >
                  <Image
                    src={book.cover}
                    alt={`${book.title} cover`}
                    fill
                    sizes={
                      isTopSeller
                        ? "(max-width: 640px) 115px, 230px"
                        : "(max-width: 640px) 90px, 110px"
                    }
                    className="object-cover"
                  />
                </div>

                {/* Book Information */}
                <div>
                  <span className="block text-[9px] font-semibold tracking-wider text-accent uppercase">
                    {book.category}
                  </span>

                  <h3 className="mt-3.5 mb-1.5 font-display text-[20px] leading-none font-normal text-foreground sm:text-[24px]">
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
          })}
        </div>
      </div>
    </section>
  );
}