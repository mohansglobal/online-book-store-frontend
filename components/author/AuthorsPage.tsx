"use client";

import { useMemo, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";

import { NoData } from "../ui/no-data";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthors } from "@/features/authors";
import { CategoryBanner } from "@/components/categories/components/CategoryBanner";

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
  sizes = "80px",
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

const ALPHABET = [
  "All",
  ...Array.from(
    { length: 26 },
    (_, index) => String.fromCharCode(65 + index),
  ),
];

export default function AuthorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeLetter, setActiveLetter] = useState("All");

  const { data: authorsResponse, isLoading, error, refetch } = useAuthors({
    limit: 100,
  });

  const authorsList = useMemo(() => {
    return authorsResponse?.data ?? [];
  }, [authorsResponse]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredAuthors = useMemo(() => {
    return authorsList.filter((author) => {
      const matchesSearch =
        !normalizedSearch ||
        author.name?.toLowerCase().includes(normalizedSearch) ||
        author.nameBn?.toLowerCase().includes(normalizedSearch) ||
        author.slug?.toLowerCase().includes(normalizedSearch);

      const matchesLetter =
        activeLetter === "All" ||
        author.name?.toUpperCase().startsWith(activeLetter);

      return matchesSearch && matchesLetter;
    });
  }, [authorsList, normalizedSearch, activeLetter]);

  return (
    <main className="min-h-screen bg-background pb-20 font-sans text-foreground">
      {/* 3D Carousel Banner */}
      <CategoryBanner categoryName="Authors" />

      <div className="relative z-20 mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="mb-8 flex justify-center">
          <div className="relative flex w-full max-w-2xl items-center overflow-hidden rounded-full border border-border/70 bg-[#F7F1E3] shadow-xs">
            <Search
              size={20}
              aria-hidden="true"
              className="ml-4 shrink-0 text-muted-foreground"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search author by name..."
              aria-label="Search author by name"
              className="w-full bg-transparent px-4 py-3 text-foreground outline-none placeholder:text-muted-foreground"
            />

            <button
              type="button"
              className="bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-hover cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>

        {/* Alphabet Filter */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {ALPHABET.map((letter) => {
            const isActive =
              activeLetter === letter;

            return (
              <button
                key={letter}
                type="button"
                onClick={() =>
                  setActiveLetter(letter)
                }
                aria-pressed={isActive}
                className={`flex h-8 min-w-8 items-center justify-center rounded-full border px-2 text-sm font-semibold transition-colors cursor-pointer ${isActive
                  ? "border-accent bg-accent text-white shadow-xs"
                  : "border-border/70 bg-[#F7F1E3] text-foreground/80 hover:border-accent hover:text-accent"
                  }`}
              >
                {letter}
              </button>
            );
          })}
        </div>

        {/* Error State */}
        {error && (
          <div className="mx-auto mb-10 flex max-w-md flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h3 className="font-semibold text-foreground">Failed to load authors</h3>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "An unexpected error occurred while fetching authors."}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="mt-2 gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-xl border border-border/70 bg-[#F7F1E3] p-6 shadow-xs md:p-8"
              >
                <div>
                  <div className="mb-6 flex items-start justify-between">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <Skeleton className="mb-4 h-8 w-3/4 rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-5/6 rounded" />
                    <Skeleton className="h-4 w-2/3 rounded" />
                  </div>
                </div>
                <div className="mt-8 border-t border-border/60 pt-4">
                  <Skeleton className="h-5 w-28 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Authors Grid */}
        {!isLoading && !error && filteredAuthors.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredAuthors.map((author, index) => {
              const imageSrc = getAuthorImage(author.photo);
              const bioText = author.bio
                ? cleanBio(author.bio)
                : "Celebrated literary author and thinker.";

              return (
                <article
                  key={author._id || author.slug || index}
                  className="group flex flex-col rounded-xl border border-border/70 bg-[#F7F1E3] p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-md md:p-8"
                >
                  {/* Top Avatar & Badge */}
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-border/80 bg-[#ebe4d2] shadow-xs transition-colors duration-300 group-hover:border-accent">
                      <AuthorAvatar
                        src={imageSrc}
                        alt={`Portrait of ${author.name}`}
                        fallback={DEFAULT_AUTHOR_FALLBACK}
                        sizes="80px"
                        className="object-cover object-top grayscale contrast-[1.12] brightness-95 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                      />
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className="rounded-full border border-border/50 bg-[#ebe4d2]/80 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
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
                  <h2 className="mb-2.5 font-display text-3xl sm:text-[32px] font-normal leading-tight tracking-wide text-foreground transition-colors group-hover:text-accent">
                    {author.name}
                  </h2>

                  <p className="line-clamp-4 flex-grow text-xs leading-relaxed text-muted-foreground sm:text-sm">
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
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredAuthors.length === 0 && (
          <NoData
            size={350}
            text={
              searchTerm || activeLetter !== "All"
                ? "No authors found matching your criteria."
                : "No authors available at the moment."
            }
            className="w-full"
          />
        )}
      </div>
    </main>
  );
}