"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen } from "lucide-react";
import type { Category } from "@/features/categories";
import { resolveCategoryImageUrl } from "@/lib/image-url";
import {
  USE_ASSET_IMAGES,
  CARD_GRADIENTS,
  getCategoryImage,
} from "../category-images";

export interface CategoryCardProps {
  category: Category;
  index: number;
  isFirst?: boolean;
}

export function CategoryCard({
  category,
  index,
  isFirst = false,
}: CategoryCardProps) {
  const router = useRouter();
  const isFeatured = index === 0;

  const fallbackImage = getCategoryImage(category.name, category.slug, index);
  const resolvedRemote = resolveCategoryImageUrl(category.image);
  const [imgSrc, setImgSrc] = useState<string | StaticImageData>(
    resolvedRemote || fallbackImage,
  );

  const gradientClass = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const targetHref = `/books?category=${category._id || encodeURIComponent(category.slug)}`;

  return (
    <Link
      id={isFirst ? "category-result-0" : undefined}
      href={targetHref}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          router.push(targetHref);
        }
        if (e.key === "Tab" && e.shiftKey && isFirst) {
          e.preventDefault();
          const searchInput = document.querySelector(
            'input[type="search"]',
          ) as HTMLInputElement;
          searchInput?.focus();
        }
      }}
      className={`group relative h-full w-full overflow-hidden rounded-2xl border border-border/70 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl focus:ring-4 focus:ring-accent focus:ring-offset-2 focus:outline-hidden focus:-translate-y-1 ${
        isFeatured ? "lg:col-span-2 lg:row-span-2" : "col-span-1 row-span-1"
      }`}
    >
      {USE_ASSET_IMAGES ? (
        <>
          <Image
            src={imgSrc}
            alt={category.name}
            fill
            sizes={
              isFeatured
                ? "(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 50vw"
                : "(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
            }
            unoptimized={typeof imgSrc === "string" && !imgSrc.startsWith("/")}
            onError={() => setImgSrc(fallbackImage)}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/25 transition-all duration-500 group-hover:from-black/95 group-hover:via-black/60" />
        </>
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradientClass} transition-transform duration-700 ease-out group-hover:scale-105`}
        />
      )}

      <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-white/5 blur-2xl transition-all duration-500 group-hover:bg-white/10" />

      {/* Top Metadata Badges */}
      <div className="absolute top-5 inset-x-5 z-10 flex items-center justify-between">
        {category.nameBn ? (
          <span className="rounded-full border border-white/15 bg-black/50 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
            {category.nameBn}
          </span>
        ) : (
          <span className="rounded-full border border-white/15 bg-black/50 px-3 py-1 text-xs font-medium text-white/70 backdrop-blur-md">
            Category
          </span>
        )}

        {category.bookCount !== undefined && (
          <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
            <BookOpen className="h-3 w-3" />
            {category.bookCount} {category.bookCount === 1 ? "Book" : "Books"}
          </span>
        )}
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
}
