"use client";

import { useMemo, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
} from "lucide-react";

import { authors as staticAuthors } from "../data";
import { IconButton } from "./icon-button";
import { SectionHeading } from "./section-heading";
import { useAuthors } from "@/features/authors";

 const DEFAULT_AUTHOR_FALLBACK = "https://i.pinimg.com/1200x/65/f4/d9/65f4d91a400d893d02d1151c4616bba5.jpg";

function cleanBio(bio?: string): string {
  if (!bio) return "";
  return bio
    .replace(/<[^>]*>?/gm, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&lsquo;|&rsquo;|&#39;/g, "'")
    .replace(/&ldquo;|&rdquo;|&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&mdash;/g, "—")
    .replace(/\s+/g, " ")
    .trim();
}

function getAuthorImage(photo?: string): string {
  if (photo && (photo.startsWith("http://") || photo.startsWith("https://"))) {
    return photo;
  }
  if (photo) {
    const backendBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") || "http://localhost:5000";
    return `${backendBase}/assets/upload/author/${photo}`;
  }
  return DEFAULT_AUTHOR_FALLBACK;
}

function AuthorAvatar({
  src,
  alt,
  fallback = DEFAULT_AUTHOR_FALLBACK,
  className = "",
  sizes = "(max-width: 640px) 80px, 96px",
}: {
  src: StaticImageData | string;
  alt: string;
  fallback?: StaticImageData | string;
  className?: string;
  sizes?: string;
}) {
  const [currentSrc, setCurrentSrc] = useState<StaticImageData | string>(src);

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      sizes={sizes}
      unoptimized={typeof currentSrc === "string"}
      onError={() => {
        if (currentSrc !== fallback) {
          setCurrentSrc(fallback);
        }
      }}
      className={className}
    />
  );
}

type CarouselDirection = -1 | 1;

export function Authors() {
  const railRef = useRef<HTMLDivElement>(null);

  const { data: authorsResponse, isLoading } = useAuthors({
    limit: 10,
  });

  const authorsList = useMemo(() => {
    if (authorsResponse?.data && authorsResponse.data.length > 0) {
      return authorsResponse.data.slice(0, 10);
    }
    return staticAuthors.slice(0, 10);
  }, [authorsResponse]);

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

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-flow-col auto-cols-[minmax(280px,78vw)] gap-6 overflow-x-auto -mr-4 px-1 py-3 pb-6 sm:auto-cols-[minmax(320px,360px)] md:mr-0 md:gap-7">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="flex min-h-[400px] flex-col justify-between rounded-3xl border border-border bg-card p-8 sm:min-h-[420px] sm:p-9"
              >
                <div>
                  <div className="mb-8 flex items-start justify-between">
                    <div className="h-20 w-20 rounded-full bg-muted/60 animate-pulse sm:h-24 sm:w-24" />
                    <div className="h-6 w-20 rounded-full bg-muted/60 animate-pulse" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-7 w-3/4 rounded bg-muted/60 animate-pulse" />
                    <div className="h-4 w-1/2 rounded bg-muted/60 animate-pulse" />
                    <div className="h-14 w-full rounded bg-muted/60 animate-pulse" />
                  </div>
                </div>
                <div className="border-t border-border/80 pt-6">
                  <div className="h-4 w-1/3 rounded bg-muted/60 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Author Carousel */
          <div
            ref={railRef}
            className="grid grid-flow-col auto-cols-[minmax(280px,78vw)] gap-6 overflow-x-auto -mr-4 px-1 py-3 pb-6 [scroll-snap-type:x_mandatory] [scrollbar-width:none] sm:auto-cols-[minmax(320px,360px)] md:mr-0 md:gap-7 [&::-webkit-scrollbar]:hidden"
          >
            {authorsList.map((author, index) => {
              const photo = "photo" in author ? author.photo : "image" in author ? (author.image as string) : undefined;
              const imageSrc = getAuthorImage(photo);

              const bioText =
                "bio" in author && author.bio
                  ? cleanBio(author.bio)
                  : "works" in author && author.works
                    ? author.works
                    : "Celebrated literary author";

              const badgeText =
                "nameBn" in author && author.nameBn
                  ? author.nameBn
                  : "genre" in author && author.genre
                    ? author.genre
                    : "Classic Icon";

              return (
                <article
                  key={`${author.name}-${index}`}
                  className="group relative flex min-h-[400px] flex-col justify-between rounded-3xl border border-border bg-card p-8 transition-all duration-300 [scroll-snap-align:start] hover:-translate-y-2 hover:border-primary hover:shadow-soft sm:min-h-[420px] sm:p-9"
                >
                  <div>
                    {/* Avatar */}
                    <div className="mb-8 flex items-start justify-between gap-4">
                      <div className="relative">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-border bg-background shadow-md transition-colors duration-300 group-hover:border-primary sm:h-24 sm:w-24">
                          <AuthorAvatar
                            src={imageSrc}
                            alt={`Portrait of ${author.name}`}
                            fallback={DEFAULT_AUTHOR_FALLBACK}
                            className="object-cover object-top grayscale contrast-[1.12] brightness-95 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                          />
                        </div>

                        <span className="absolute -right-1 -bottom-1 grid h-6 w-6 place-items-center rounded-full border-2 border-card bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <span className="rounded-full border border-border bg-secondary/80 px-3 py-1 text-[10px] font-semibold tracking-wider text-accent uppercase">
                        {badgeText}
                      </span>
                    </div>

                    {/* Author Information */}
                    <h3 className="mb-3 m-0 font-display text-[26px] leading-tight font-normal text-foreground transition-colors group-hover:text-primary sm:text-[30px]">
                      {author.name}
                    </h3>

                    {"nameBn" in author && author.nameBn && (
                      <p className="mb-2 text-xs font-semibold tracking-wide text-accent">
                        {author.nameBn}
                      </p>
                    )}

                    <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
                      {bioText}
                    </p>
                  </div>

                  {/* Bottom Actions */}
                  <div className="mt-8 flex items-center justify-between border-t border-border/80 pt-6">
                    <Link
                      href="/authors"
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
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}