"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";

import { CategoryBanner } from "./components/CategoryBanner";
import {
  USE_ASSET_IMAGES,
  CARD_GRADIENTS,
  getCategoryImage,
} from "./category-images";
import { NoData } from "@/components/ui/no-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAllCategories } from "@/features/categories";

const ALPHABET = [
  "All",
  ...Array.from({ length: 26 }, (_, index) =>
    String.fromCharCode(65 + index),
  ),
];

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeLetter, setActiveLetter] = useState("All");

  const { data: allCategories, isLoading, error, refetch } = useAllCategories();

  const categoriesList = useMemo(() => {
    return allCategories ?? [];
  }, [allCategories]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    return categoriesList.filter((category) => {
      const matchesSearch =
        !normalizedSearch ||
        category.name?.toLowerCase().includes(normalizedSearch) ||
        category.nameBn?.toLowerCase().includes(normalizedSearch) ||
        category.slug?.toLowerCase().includes(normalizedSearch);

      const matchesLetter =
        activeLetter === "All" ||
        category.name?.trim().toUpperCase().startsWith(activeLetter) ||
        category.slug?.trim().toUpperCase().startsWith(activeLetter);

      return matchesSearch && matchesLetter;
    });
  }, [categoriesList, normalizedSearch, activeLetter]);

  return (
    <main className="min-h-screen bg-background pb-20 font-sans text-foreground">
      {/* 3D Carousel Banner */}
      <CategoryBanner categoryName="Categories" />

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
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search category by name or Bangla title..."
              aria-label="Search categories"
              className="w-full bg-transparent px-4 py-3 text-foreground outline-none placeholder:text-muted-foreground"
            />

            <button
              type="button"
              className="cursor-pointer bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              Search
            </button>
          </div>
        </div>

        {/* Alphabet Filter */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {ALPHABET.map((letter) => {
            const isActive = activeLetter === letter;

            return (
              <button
                key={letter}
                type="button"
                onClick={() => setActiveLetter(letter)}
                aria-pressed={isActive}
                className={`flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-full border px-2 text-sm font-semibold transition-colors ${
                  isActive
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
            <h3 className="font-semibold text-foreground">Failed to load categories</h3>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "An unexpected error occurred while fetching categories."}
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

        {/* Loading Skeleton Grid */}
        {isLoading && (
          <div className="grid auto-rows-[280px] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className={`relative h-full w-full overflow-hidden rounded-2xl border border-border/60 bg-muted/40 p-6 ${
                  idx === 0 ? "lg:col-span-2 lg:row-span-2" : "col-span-1 row-span-1"
                }`}
              >
                <div className="flex h-full flex-col justify-between">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-3/4 rounded-md" />
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Categories Grid */}
        {!isLoading && !error && filteredCategories.length > 0 && (
          <div className="grid auto-rows-[280px] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCategories.map((category, index) => {
              const isFeatured = index === 0;
              const image = getCategoryImage(category.name, category.slug, index);
              const gradientClass = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

              return (
                <Link
                  key={category._id || category.slug}
                  href={`/books?category=${category._id || encodeURIComponent(category.slug)}`}
                  className={`group relative h-full w-full overflow-hidden rounded-2xl border border-border/70 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl ${
                    isFeatured ? "lg:col-span-2 lg:row-span-2" : "col-span-1 row-span-1"
                  }`}
                >
                  {USE_ASSET_IMAGES ? (
                    <>
                      {/* Background Image from Assets */}
                      <Image
                        src={image}
                        alt={category.name}
                        fill
                        sizes={
                          isFeatured
                            ? "(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 50vw"
                            : "(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
                        }
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Dark Gradient Overlay for legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/25 transition-all duration-500 group-hover:from-black/95 group-hover:via-black/60" />
                    </>
                  ) : (
                    /* Gradient Background Pattern */
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${gradientClass} transition-transform duration-700 ease-out group-hover:scale-105`}
                    />
                  )}

                  {/* Decorative Ambient Light */}
                  <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-white/5 blur-2xl transition-all duration-500 group-hover:bg-white/10" />

                  {/* Top Metadata Badges */}
                  <div className="absolute top-5 inset-x-5 z-10 flex items-center justify-between">
                    {/* {category.nameBn ? (
                      <span className="rounded-full border border-white/15 bg-black/50 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
                        {category.nameBn}
                      </span>
                    ) : (
                      <span className="rounded-full border border-white/15 bg-black/50 px-3 py-1 text-xs font-medium text-white/70 backdrop-blur-md">
                        Category
                      </span>
                    )} */}

                    {/* {isFeatured && (
                      <span className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-200 backdrop-blur-md">
                        <Sparkles className="h-3 w-3" />
                        Featured
                      </span>
                    )} */}
                  </div>

                  {/* Bottom Content */}
                  <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 transition-all duration-500 group-hover:pb-20">
                    <h2
                      className={`mb-1 font-display font-bold text-white drop-shadow-md transition-colors group-hover:text-accent-foreground ${
                        isFeatured ? "text-3xl lg:text-5xl" : "text-xl md:text-2xl"
                      }`}
                    >
                      {category.name}
                    </h2>

                    {category.description ? (
                      <p className="line-clamp-2 text-xs font-normal text-white/80">
                        {category.description}
                      </p>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-white/80">
                        <BookOpen size={13} aria-hidden="true" />
                        <span>Browse Books</span>
                      </div>
                    )}
                  </div>

                  {/* Hover Action Bar */}
                  <div className="absolute inset-x-0 bottom-0 z-20 flex h-16 translate-y-full items-center justify-between border-t border-white/20 bg-black/60 px-6 backdrop-blur-md transition-transform duration-500 ease-out group-hover:translate-y-0">
                    <span className="text-sm font-semibold text-white">
                      Explore Category
                    </span>

                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors duration-300 group-hover:bg-white group-hover:text-black">
                      <ArrowRight size={16} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredCategories.length === 0 && (
          <div className="mt-8 flex justify-center">
            <NoData
              size={320}
              text={
                searchTerm || activeLetter !== "All"
                  ? `No categories found matching ${
                      searchTerm ? `"${searchTerm}"` : ""
                    }${searchTerm && activeLetter !== "All" ? " under " : ""}${
                      activeLetter !== "All" ? `letter "${activeLetter}"` : ""
                    }.`
                  : "No categories available at the moment."
              }
              className="w-full"
            />
          </div>
        )}
      </div>
    </main>
  );
}

export { CategoriesPage };
