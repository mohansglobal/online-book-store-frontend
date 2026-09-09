import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Book } from "@/components/home/types";

export function CategoryBookGrid({ books }: { books: Book[] }) {
  return (
    <div
      className="
        flex-1
        grid grid-cols-2
        sm:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        gap-x-5 gap-y-10
        py-8
      "
    >
      {books.map((book, idx) => (
        <article
          key={`${book.title}-${idx}`}
          className="
            group
            min-w-0
            cursor-pointer
          "
        >
          {/* Book Cover */}
          <div
            className="
              relative
              aspect-[2/3]
              overflow-hidden
              rounded-[14px]
              bg-muted/50
            "
          >
            <Image
              src={book.cover}
              alt={book.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="
                h-full w-full
                object-cover
                transition-transform
                duration-500
                ease-[cubic-bezier(0.22,1,0.36,1)]
                group-hover:scale-[1.025]
              "
            />

            {/* Very subtle image treatment */}
            <div
              className="
                pointer-events-none
                absolute inset-0
                bg-gradient-to-t
                from-black/[0.08]
                via-transparent
                to-transparent
                opacity-0
                transition-opacity
                duration-300
                group-hover:opacity-100
              "
            />

            {/* Single interaction cue */}
            <div
              className="
                absolute right-3 top-3
                flex h-8 w-8
                items-center justify-center
                rounded-full
                bg-background/90
                text-foreground
                shadow-sm
                backdrop-blur-md

                opacity-0
                translate-y-1
                scale-95

                transition-all
                duration-300

                group-hover:opacity-100
                group-hover:translate-y-0
                group-hover:scale-100
              "
              aria-hidden="true"
            >
              <ArrowUpRight size={15} strokeWidth={1.8} />
            </div>
          </div>

          {/* Content */}
          <div className="pt-3.5">
            {/* Title */}
            <h3
              className="
                line-clamp-2
                font-display
                text-[15px]
                sm:text-[16px]
                font-semibold
                leading-[1.35]
                tracking-[-0.01em]
                text-foreground

                transition-colors
                duration-200

                group-hover:text-primary
              "
            >
              {book.title}
            </h3>

            {/* Author */}
            <p
              className="
                mt-1
                truncate
                text-[13px]
                leading-5
                text-muted-foreground
              "
            >
              {book.author}
            </p>

            {/* Price */}
            <div className="mt-2.5 flex items-center gap-1.5">
              <span
                className="
                  text-[14px]
                  font-semibold
                  tracking-[-0.01em]
                  text-foreground
                "
              >
                {book.price}
              </span>
              {book.originalPrice && (
                <span className="text-[12px] text-muted-foreground/70 line-through">
                  {book.originalPrice}
                </span>
              )}
              {book.priceIn && book.priceIn !== book.price && (
                <span className="text-[11px] text-muted-foreground">
                  ({book.priceIn})
                </span>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
