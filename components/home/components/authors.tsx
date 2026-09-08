"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
} from "lucide-react";

import { authors } from "../data";
import { IconButton } from "./icon-button";
import { SectionHeading } from "./section-heading";

type CarouselDirection = -1 | 1;

export function Authors() {
  const railRef = useRef<HTMLDivElement>(null);

  const moveCarousel = (direction: CarouselDirection): void => {
    railRef.current?.scrollBy({
      left: direction * 380,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="authors"
      className="bg-background py-[76px] md:py-[120px]"
    >
      <div className="mx-auto w-[min(1320px,calc(100%-36px))] md:w-[min(1320px,calc(100%-72px))]">
        <div className="relative md:pr-32">
          <SectionHeading
            eyebrow="VOICES TO KNOW"
            title="Authors shaping today's stories"
            copy="Legendary poets, novelists, and thinkers from India and Bengal whose words continue to inspire generations."
          />

          <div className="absolute right-0 bottom-1 hidden items-center gap-1.5 md:flex">
            <Link
              href="/authors"
              className="group mr-3 flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              See all

              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            <IconButton
              label="Previous Authors"
              onClick={() => moveCarousel(-1)}
            >
              <ArrowLeft size={19} />
            </IconButton>

            <IconButton
              label="Next Authors"
              onClick={() => moveCarousel(1)}
            >
              <ArrowRight size={19} />
            </IconButton>
          </div>
        </div>

        {/* Author Carousel */}
        <div
          ref={railRef}
          className="grid grid-flow-col auto-cols-[minmax(280px,78vw)] gap-6 overflow-x-auto -mr-4 px-1 py-3 pb-6 [scroll-snap-type:x_mandatory] [scrollbar-width:none] sm:auto-cols-[minmax(320px,360px)] md:mr-0 md:gap-7 [&::-webkit-scrollbar]:hidden"
        >
          {authors.map((author, index) => (
            <article
              key={`${author.name}-${index}`}
              className="group relative flex min-h-[400px] flex-col justify-between rounded-3xl border border-border bg-card p-8 transition-all duration-300 [scroll-snap-align:start] hover:-translate-y-2 hover:border-primary hover:shadow-soft sm:min-h-[420px] sm:p-9"
            >
              <div>
                {/* Avatar */}
                <div className="mb-8 flex items-start justify-between gap-4">
                  <div className="relative">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-border bg-background shadow-md transition-colors duration-300 group-hover:border-primary sm:h-24 sm:w-24">
                      <Image
                        src={author.image}
                        alt={`Portrait of ${author.name}`}
                        fill
                        sizes="(max-width: 640px) 80px, 96px"
                        className="object-cover object-top grayscale contrast-[1.12] brightness-95 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                      />
                    </div>

                    <span className="absolute -right-1 -bottom-1 grid h-6 w-6 place-items-center rounded-full border-2 border-card bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <span className="rounded-full border border-border bg-secondary/80 px-3 py-1 text-[10px] font-semibold tracking-wider text-accent uppercase">
                    Classic Icon
                  </span>
                </div>

                {/* Author Information */}
                <h3 className="mb-3 m-0 font-display text-[26px] leading-tight font-normal text-foreground transition-colors group-hover:text-primary sm:text-[30px]">
                  {author.name}
                </h3>

                <p className="mb-3 text-xs font-semibold tracking-wide text-accent uppercase">
                  {author.genre}
                </p>

                <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
                  {author.bio ?? author.works}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="mt-8 flex items-center justify-between border-t border-border/80 pt-6">
                <Link
                  href="/#books"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground transition-colors group-hover:text-primary"
                >
                  Explore Collection

                  <ArrowUpRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>

                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <BookOpen size={13} className="text-primary" />
                  View Books
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}