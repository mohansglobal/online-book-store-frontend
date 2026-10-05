// Category cards grid view with background images, metadata badges, and edit button
"use client";

import React from "react";
import Image from "next/image";
import { Edit2, BookOpen, Layers, CheckCircle2, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategoryImage } from "@/components/categories/category-images";
import type { Category } from "../types/category.types";

interface CategoryCardGridProps {
  categories: Category[];
  isLoading: boolean;
  onEditCategory: (category: Category) => void;
}

export function CategoryCardGrid({
  categories,
  isLoading,
  onEditCategory,
}: CategoryCardGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="relative h-[270px] w-full overflow-hidden rounded-2xl border border-border/60 bg-muted/40 p-5 shadow-xs"
          >
            <div className="flex h-full flex-col justify-between">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16 rounded-full" />
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-1/2 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface p-12 text-center shadow-xs">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
          <Layers size={28} />
        </div>

        <h3 className="mt-4 text-base font-semibold text-foreground">
          No categories found
        </h3>

        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          Try adjusting your search criteria or clear your current filters to view categories.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {categories.map((category, index) => {
        const hasCustomImage = Boolean(category.image && category.image.trim() !== "");
        const bgImage = hasCustomImage
          ? (category.image as string).trim()
          : getCategoryImage(category.name, category.slug, index);
        const isActive = category.isActive !== false;
        const bookCount = category.bookCount ?? 0;

        return (
          <div
            key={category._id}
            className="group relative flex h-[270px] flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl"
          >
            {/* Background Image with Zoom Effect */}
            <Image
              src={bgImage}
              alt={category.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* Gradient Overlays for optimal text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/35 transition-opacity duration-300 group-hover:from-black/98 group-hover:via-black/65" />

            <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-white/5 blur-2xl transition-all duration-500 group-hover:bg-accent/15" />

            {/* Top Bar: Status Badges and Edit Icon Button */}
            <div className="relative z-10 flex items-start justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {/* Bengali Name Badge */}
                {/* {category.nameBn && (
                  <span className="rounded-full border border-white/20 bg-black/45 px-2.5 py-0.5 font-bengali text-xs font-medium text-white/95 backdrop-blur-md">
                    {category.nameBn}
                  </span>
                )} */}

                {/* Active / Inactive Status Badge */}
                {isActive ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/25 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 backdrop-blur-md">
                    <CheckCircle2 size={11} />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-500/25 px-2 py-0.5 text-[11px] font-semibold text-amber-300 backdrop-blur-md">
                    <PowerOff size={11} />
                    Inactive
                  </span>
                )}
              </div>

              {/* Edit Icon Button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onEditCategory(category)}
                title={`Edit ${category.name}`}
                aria-label={`Edit ${category.name}`}
                className="h-8 w-8 shrink-0 cursor-pointer rounded-full border border-white/25 bg-black/45 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-accent hover:border-accent hover:text-white active:scale-95 shadow-sm"
              >
                <Edit2 size={13} aria-hidden="true" />
              </Button>
            </div>

            {/* Bottom Content: Book Count, Name, Slug, Description */}
            <div className="relative z-10 flex flex-col space-y-1.5">
              {/* Book Count Pill */}
              <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-md">
                <BookOpen size={12} className="text-sky-300" />
                <span>
                  {bookCount} {bookCount === 1 ? "Book" : "Books"}
                </span>
              </div>

              {/* Category Name */}
              <h3 className="font-display text-xl font-bold tracking-tight text-white drop-shadow-sm transition-colors group-hover:text-accent-foreground">
                {category.name}
              </h3>

              {/* Slug */}
              {/* <div className="inline-flex w-fit items-center rounded-md border border-white/10 bg-black/35 px-2 py-0.5 font-mono text-[11px] text-white/70 backdrop-blur-xs">
                {category.slug}
              </div> */}

              {/* Description */}
              {category.description && (
                <p className="line-clamp-2 text-xs text-white/75 leading-relaxed pt-0.5">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
