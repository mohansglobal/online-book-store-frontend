"use client";

import { useMemo } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { SectionHeading } from "./section-heading";
import { getCategoryImage } from "./category-images";
import { useCategories } from "@/features/categories";

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

export function Categories() {
  const { data: categoriesResponse, isLoading } = useCategories({
    limit: 9,
  });

  const categoriesList = useMemo(() => {
    if (categoriesResponse?.data && categoriesResponse.data.length > 0) {
      return categoriesResponse.data.slice(0, 9);
    }
    return [];
  }, [categoriesResponse]);

  if (!isLoading && categoriesList.length === 0) {
    return null;
  }

  return (
    <section id="categories" className="bg-card py-[76px] md:py-[120px]">
      <div className="mx-auto w-[min(1320px,calc(100%-36px))] md:w-[min(1320px,calc(100%-72px))]">
        <div className="relative md:pr-24">
          <SectionHeading
            eyebrow="FIND YOUR NEXT READ"
            title="Explore by category"
          />

          <div className="absolute right-0 bottom-1 hidden items-center gap-1.5 md:flex">
            <Link
              href="/categories"
              className="group mr-3 flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              See all
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid auto-rows-[145px] grid-cols-2 gap-3 md:auto-rows-[180px] md:grid-cols-4">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className={`relative flex flex-col justify-between overflow-hidden rounded-sm border border-border/60 bg-muted/30 p-5 ${getGridClasses(
                  index,
                )}`}
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
        ) : (
          <div className="grid auto-rows-[145px] grid-cols-2 gap-3 md:auto-rows-[180px] md:grid-cols-4">
            {categoriesList.map((category, index) => {
              const slug =
                "slug" in category && category.slug
                  ? category.slug
                  : category.name.toLowerCase().replace(/\s+/g, "-");

              const categoryImage =
                "image" in category && category.image
                  ? (category.image as StaticImageData)
                  : getCategoryImage(category.name, slug, index);

              const hasImage = Boolean(categoryImage);

              const titleSizeClass =
                index === 5
                  ? "text-[32px] md:text-[46px]"
                  : index === 0
                    ? "text-[28px] md:text-[36px]"
                    : "text-[22px] md:text-[28px]";

              const categoryTarget =
                "_id" in category && category._id ? category._id : slug;

              return (
                <Link
                  key={`${category.name}-${index}`}
                  href={`/books?category=${encodeURIComponent(categoryTarget)}`}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-sm border p-5 transition-all duration-300 hover:-translate-y-1 ${
                    hasImage
                      ? "border-border/60 shadow-sm hover:border-primary"
                      : "border-border bg-background hover:border-primary hover:bg-surface-elevated"
                  } ${getGridClasses(index)}`}
                >
                  {/* Background Image */}
                  {categoryImage && (
                    <>
                      <Image
                        src={categoryImage}
                        alt={category.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25 transition-colors duration-300 group-hover:from-black/90 group-hover:via-black/50" />
                    </>
                  )}

                  {/* Top Row */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span
                      className={
                        hasImage
                          ? "rounded-full border border-white/15 bg-black/40 px-2.5 py-0.5 text-[11px] font-medium tracking-wider text-white/90 backdrop-blur-md"
                          : "text-[11px] font-medium tracking-wider text-muted-foreground"
                      }
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {hasImage ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/90 backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                        <ArrowUpRight size={16} />
                      </div>
                    ) : (
                      <ArrowUpRight
                        size={20}
                        className="text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                      />
                    )}
                  </div>

                  {/* Category Information */}
                  <div className="relative z-10">
                    <h3
                      className={`m-0 font-display font-normal leading-tight transition-transform duration-300 group-hover:translate-x-0.5 ${
                        hasImage
                          ? "text-white drop-shadow-sm"
                          : "text-foreground group-hover:text-primary"
                      } ${titleSizeClass}`}
                    >
                      {category.name}
                    </h3>

                    {"nameBn" in category && category.nameBn && (
                      <p
                        className={`mt-1 text-[12px] font-medium ${
                          hasImage
                            ? "text-white/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        {category.nameBn}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}