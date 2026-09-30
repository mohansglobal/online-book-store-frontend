"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Calendar, Sparkles } from "lucide-react";

import type { Author } from "@/features/authors/types/author.types";
import { formatAuthorLifespan } from "@/lib/date-utils";

const DEFAULT_AUTHOR_FALLBACK =
  "https://i.pinimg.com/1200x/65/f4/d9/65f4d91a400d893d02d1151c4616bba5.jpg";

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
    const backendBase =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ||
      "http://localhost:5000";
    return `${backendBase}/assets/upload/author/${photo}`;
  }

  return DEFAULT_AUTHOR_FALLBACK;
}

function AuthorAvatar({
  src,
  alt,
  fallback = DEFAULT_AUTHOR_FALLBACK,
}: {
  src: StaticImageData | string;
  alt: string;
  fallback?: StaticImageData | string;
}) {
  const [currentSrc, setCurrentSrc] = useState<StaticImageData | string>(src);

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      sizes="80px"
      unoptimized={typeof currentSrc === "string"}
      onError={() => {
        if (currentSrc !== fallback) {
          setCurrentSrc(fallback);
        }
      }}
      className="object-cover object-top grayscale contrast-[1.12] brightness-95 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
    />
  );
}

export interface AuthorCardProps {
  author: Author;
  index: number;
  isFirst?: boolean;
}

// Author card rendering portrait, lifespan, bio, and catalog link
export function AuthorCard({ author, index, isFirst = false }: AuthorCardProps) {
  const router = useRouter();
  const imageSrc = getAuthorImage(author.photo);

  const bioText = author.bio
    ? cleanBio(author.bio)
    : "Celebrated literary author and thinker.";

  const lifespan = formatAuthorLifespan(
    author.birthDate,
    author.deathDate,
  );

  const displayIndex = String(index + 1).padStart(2, "0");

  return (
    <article
      id={isFirst ? "author-result-0" : undefined}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          router.push(`/books?author=${author._id}`);
        }
        if (e.key === "Tab" && e.shiftKey && isFirst) {
          e.preventDefault();
          const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
          searchInput?.focus();
        }
      }}
      className="group flex flex-col rounded-xl border border-border/70 bg-[#F7F1E3] p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-md md:p-8 focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-hidden focus:-translate-y-1 focus:border-accent/40 focus:shadow-md cursor-pointer"
    >
      {/* Top Avatar & Badge */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-border/80 bg-[#ebe4d2] shadow-xs transition-colors duration-300 group-hover:border-accent">
          <AuthorAvatar
            src={imageSrc}
            alt={`Portrait of ${author.name}`}
            fallback={DEFAULT_AUTHOR_FALLBACK}
          />
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <span className="rounded-full border border-border/50 bg-[#ebe4d2]/80 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-muted-foreground">
            {displayIndex}
          </span>

          {author.nameBn && (
            <span className="flex items-center gap-1 rounded-full border border-accent/20 bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold text-accent">
              <Sparkles className="h-3 w-3" />
              {author.nameBn}
            </span>
          )}
        </div>
      </div>

      {/* Author Information */}
      <h2
        className={`font-display text-3xl sm:text-[32px] font-normal leading-tight tracking-wide text-foreground transition-colors group-hover:text-accent ${
          lifespan ? "mb-1.5" : "mb-2.5"
        }`}
      >
        {author.name}
      </h2>

      {lifespan && (
        <div className="mb-3 flex items-center">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-[#ebe4d2]/90 px-2.5 py-0.5 text-xs font-medium text-foreground/80">
            <Calendar className="h-3.5 w-3.5 text-accent shrink-0" />
            <span>{lifespan}</span>
          </span>
        </div>
      )}

      <p className="line-clamp-4 flex-grow text-justify text-xs leading-relaxed text-muted-foreground sm:text-sm">
        {bioText}
      </p>

      <hr className="my-6 w-full border-t border-border/60" />

      {/* Action */}
      <div className="mt-auto flex items-center justify-between">
        <Link
          href={`/books?author=${author._id}`}
          className="group/link flex items-center gap-1 text-sm font-bold text-foreground transition-colors hover:text-accent"
        >
          Explore Books

          <ArrowUpRight
            size={16}
            aria-hidden="true"
            className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
          />
        </Link>

        <span className="text-xs text-muted-foreground font-medium">
          Author
        </span>
      </div>
    </article>
  );
}
