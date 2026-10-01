"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, BookOpen, Calendar } from "lucide-react";

import type { Author } from "@/features/authors/types/author.types";
import { formatAuthorLifespan } from "@/lib/date-utils";
import {
  DEFAULT_AUTHOR_FALLBACK,
  cleanBio,
  getAuthorImage,
} from "@/components/author/components/author-card";

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

export interface HomeAuthorCardProps {
  author: Author;
  index: number;
  onSelect?: (author: Author) => void;
}

// Author card rendered in homepage carousel with tap-to-modal and direct book catalog navigation
export function HomeAuthorCard({
  author,
  index,
  onSelect,
}: HomeAuthorCardProps) {
  const router = useRouter();

  const photo =
    "photo" in author
      ? author.photo
      : "image" in author
        ? (author.image as string)
        : undefined;

  const imageSrc = getAuthorImage(photo);

  const bioText: string =
    "bio" in author && typeof author.bio === "string" && author.bio
      ? cleanBio(author.bio)
      : "works" in author && typeof author.works === "string" && author.works
        ? author.works
        : "Celebrated literary author";

  const badgeText: string =
    "nameBn" in author && typeof author.nameBn === "string" && author.nameBn
      ? author.nameBn
      : "genre" in author && typeof author.genre === "string" && author.genre
        ? author.genre
        : "Classic Icon";

  const birthDate =
    "birthDate" in author && typeof author.birthDate === "string"
      ? author.birthDate
      : undefined;

  const deathDate =
    "deathDate" in author && typeof author.deathDate === "string"
      ? author.deathDate
      : undefined;

  const lifespan = formatAuthorLifespan(birthDate, deathDate);

  const hasNameBn = "nameBn" in author && Boolean(author.nameBn);

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(author);
    }
  };

  return (
    <article
      tabIndex={0}
      role="button"
      aria-label={`View details of ${author.name}`}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          router.push(`/books?author=${author._id}`);
        }
        if (e.key === " " || e.key === "Spacebar") {
          e.preventDefault();
          if (onSelect) {
            onSelect(author);
          }
        }
      }}
      className="group relative flex min-h-[400px] flex-col justify-between rounded-3xl border border-border bg-card p-8 transition-all duration-300 [scroll-snap-align:start] hover:-translate-y-2 hover:border-primary hover:shadow-soft sm:min-h-[420px] sm:p-9 cursor-pointer select-none focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
        <h3 className="mb-2 m-0 font-display text-[26px] leading-tight font-normal text-foreground transition-colors group-hover:text-primary sm:text-[30px]">
          {author.name}
        </h3>

        {(hasNameBn || lifespan) && (
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {hasNameBn && (
              <span className="text-xs font-semibold tracking-wide text-accent">
                {author.nameBn}
              </span>
            )}

            {hasNameBn && lifespan && (
              <span className="text-xs text-muted-foreground/60">•</span>
            )}

            {lifespan && (
              <span className="inline-flex items-center gap-1 rounded-md border border-border/70 bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                <Calendar size={12} className="text-accent shrink-0" />
                <span>{lifespan}</span>
              </span>
            )}
          </div>
        )}

        <p className="line-clamp-3 text-justify text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
          {bioText}
        </p>
      </div>

      {/* Bottom Actions */}
      <div className="mt-8 flex items-center justify-between border-t border-border/80 pt-6">
        <Link
          href={`/books?author=${author._id}`}
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground transition-colors hover:text-accent group-hover:text-primary cursor-pointer"
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
}
