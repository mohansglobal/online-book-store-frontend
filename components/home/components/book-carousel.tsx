"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

import type { BookCarouselProps } from "../types";
import { BookCard } from "./book-card";
import { IconButton } from "./icon-button";
import { SectionHeading } from "./section-heading";

type CarouselDirection = -1 | 1;

export function BookCarousel({
  title,
  eyebrow,
  items,
  actionText = "See all",
  actionHref = "/books",
  onWish,
  onCart,
  className = "bg-card",
  id = "books",
}: BookCarouselProps) {
  const railRef = useRef<HTMLDivElement>(null);

  const moveCarousel = (direction: CarouselDirection): void => {
    railRef.current?.scrollBy({
      left: direction * 520,
      behavior: "smooth",
    });
  };

  return (
    <section
      id={id}
      className={`py-[76px] md:py-[120px] ${className}`}
    >
      <div className="mx-auto w-[min(1320px,calc(100%-36px))] md:w-[min(1320px,calc(100%-72px))]">
        <div className="relative md:pr-32">
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            action={actionText}
            actionHref={actionHref}
          />

          <div className="absolute right-0 bottom-1 hidden items-center gap-1.5 md:flex">
            <Link
              href={actionHref}
              className="group mr-3 flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {actionText}

              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            <IconButton
              label="Previous"
              onClick={() => moveCarousel(-1)}
            >
              <ArrowLeft size={19} />
            </IconButton>

            <IconButton
              label="Next"
              onClick={() => moveCarousel(1)}
            >
              <ArrowRight size={19} />
            </IconButton>
          </div>
        </div>

        <div
          ref={railRef}
          className="grid grid-flow-col auto-cols-[minmax(155px,66vw)] gap-4.5 overflow-x-auto -mr-4 px-1 py-2.5 pb-7.5 [scroll-snap-type:x_mandatory] [scrollbar-width:none] sm:auto-cols-[minmax(190px,230px)] md:mr-0 md:gap-7 [&::-webkit-scrollbar]:hidden"
        >
          {items.map((book, index) => (
            <BookCard
              key={`${title}-${book.title}-${index}`}
              book={book}
              onWish={onWish}
              onCart={onCart}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-center md:hidden">
          <Link
            href={actionHref}
            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-hover transition-colors uppercase tracking-wider"
          >
            <span>{actionText}</span>
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}