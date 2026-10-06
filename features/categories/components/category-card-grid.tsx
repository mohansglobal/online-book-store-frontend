// Category cards grid view matching the homepage bento layout, with edit button and status badges
"use client";

import React from "react";
import Image from "next/image";
import { Edit2, BookOpen, Layers, CheckCircle2, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCategoryImage } from "@/components/categories/category-images";
import type { Category } from "../types/category.types";

interface CategoryCardGridProps {
  categories: Category[];
  isLoading: boolean;
  onEditCategory: (category: Category) => void;
}

function getGridClasses(index: number): string {
  switch (index) {
    case 0:
      return "col-span-2";
    case 3:
      return "row-span-1 md:row-span-2";
    case 5:
      return "col-span-2 row-span-1 md:row-span-2";
    case 7:
      return "col-span-1 md:col-span-2";
    case 8:
      return "col-span-2";
    default:
      return "";
  }
}

export function CategoryCardGrid({
  categories,
  isLoading,
  onEditCategory,
}: CategoryCardGridProps) {
  if (isLoading) {
    return (
      <div className="grid auto-rows-[145px] grid-cols-2 gap-3 md:auto-rows-[180px] md:grid-cols-4">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className={`relative flex flex-col justify-between overflow-hidden rounded-sm border border-border/60 bg-muted/30 p-5 ${getGridClasses(index)}`}
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-6 rounded bg-muted/60 animate-pulse" />
              <div className="h-8 w-8 rounded-full bg-muted/60 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-6 w-3/4 rounded bg-muted/60 animate-pulse" />
              <div className="h-3 w-1/4 rounded bg-muted/60 animate-pulse" />
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
    <div className="grid auto-rows-[145px] grid-cols-2 gap-3 md:auto-rows-[180px] md:grid-cols-4">
      {categories.map((category, index) => {
        const hasCustomImage = Boolean(category.image && category.image.trim() !== "");
        const bgImage = hasCustomImage
          ? (category.image as string).trim()
          : getCategoryImage(category.name, category.slug, index);

        const isActive = category.isActive !== false;
        const bookCount = category.bookCount ?? 0;

        const titleSizeClass =
          index === 5
            ? "text-[32px] md:text-[46px]"
            : index === 0
              ? "text-[28px] md:text-[36px]"
              : "text-[22px] md:text-[28px]";

        return (
          <div
            key={category._id}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-sm border border-border/60 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary ${getGridClasses(index)}`}
          >
            {/* Background image */}
            <Image
              src={bgImage}
              alt={category.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25 transition-colors duration-300 group-hover:from-black/90 group-hover:via-black/50" />

            {/* Top row: status badge + edit button */}
            <div className="relative z-10 flex items-center justify-between gap-2">
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

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onEditCategory(category)}
                title={`Edit ${category.name}`}
                aria-label={`Edit ${category.name}`}
                className="h-8 w-8 shrink-0 cursor-pointer rounded-full border border-white/25 bg-black/45 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-primary hover:border-primary hover:text-primary-foreground active:scale-95 shadow-sm"
              >
                <Edit2 size={13} aria-hidden="true" />
              </Button>
            </div>

            {/* Bottom content: name + metadata */}
            <div className="relative z-10">
              <h3
                className={`m-0 font-display font-normal leading-tight text-white drop-shadow-sm transition-transform duration-300 group-hover:translate-x-0.5 ${titleSizeClass}`}
              >
                {category.name}
              </h3>

              <div className="mt-1 flex items-center gap-2">
                {category.nameBn && (
                  <p className="text-[12px] font-medium text-white/80">
                    {category.nameBn}
                  </p>
                )}

                {category.nameBn && (
                  <span className="text-[10px] text-white/60">•</span>
                )}

                <p className="flex items-center gap-1 text-[12px] font-medium text-white/90">
                  <BookOpen size={11} className="text-sky-300" />
                  {bookCount} {bookCount === 1 ? "Book" : "Books"}
                </p>
              </div>

              {category.description && (
                <p className="mt-1 line-clamp-1 text-[11px] text-white/70 leading-relaxed">
                  {category.description}
                </p>
              )}

              {category.slug && (
                <div className="mt-1 inline-flex w-fit items-center rounded-md border border-white/10 bg-black/35 px-2 py-0.5 font-mono text-[10px] text-white/70 backdrop-blur-xs">
                  {category.slug}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
