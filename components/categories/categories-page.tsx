"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    BookOpen,
    Search,
} from "lucide-react";

import { categories } from "@/components/home/data";
import { CategoryBanner } from "./components/CategoryBanner";
import { NoData } from "@/components/ui/no-data";

function createCategorySlug(name: string): string {
    return name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
}

export default function CategoriesPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const normalizedSearch = searchTerm
        .trim()
        .toLowerCase();

    const filteredCategories = categories.filter(
        (category) =>
            category.name
                .toLowerCase()
                .includes(normalizedSearch),
    );

    return (
        <main className="min-h-screen bg-background pb-20 font-sans text-foreground">
            <CategoryBanner categoryName="Categories" />

            <div className="relative z-20 mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Search */}
                <div className="mb-10 flex justify-center">
                    <div className="relative flex w-full max-w-2xl items-center overflow-hidden rounded-full border border-border bg-background shadow-sm">
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
                            placeholder="Find a category..."
                            aria-label="Search categories"
                            className="w-full bg-background px-4 py-3 text-foreground outline-none placeholder:text-muted-foreground"
                        />

                        <button
                            type="button"
                            className="bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-hover"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid auto-rows-[280px] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredCategories.map(
                        (category, index) => {
                            const isFeatured = index === 0;

                            return (
                                <Link
                                    key={category.name}
                                    href={`/category/${createCategorySlug(
                                        category.name,
                                    )}`}
                                    className={`group relative h-full w-full overflow-hidden rounded-2xl border border-border shadow-sm transition-all duration-500 hover:shadow-xl ${isFeatured
                                        ? "lg:col-span-2 lg:row-span-2"
                                        : "col-span-1 row-span-1"
                                        }`}
                                >
                                    {/* Background Image */}
                                    {category.image && (
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            sizes={
                                                isFeatured
                                                    ? "(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 50vw"
                                                    : "(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
                                            }
                                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/90" />

                                    {/* Content */}
                                    <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 transition-all duration-500 group-hover:pb-20">
                                        <h2
                                            className={`mb-1 font-display font-bold text-white drop-shadow-md ${isFeatured
                                                ? "text-3xl lg:text-5xl"
                                                : "text-2xl"
                                                }`}
                                        >
                                            {category.name}
                                        </h2>

                                        <div className="flex items-center gap-1.5 text-sm font-medium text-white/80">
                                            <BookOpen
                                                size={14}
                                                aria-hidden="true"
                                            />

                                            <span>
                                                {category.count} Books
                                            </span>
                                        </div>
                                    </div>

                                    {/* Hover Action */}
                                    <div className="absolute inset-x-0 bottom-0 z-20 flex h-16 translate-y-full items-center justify-between border-t border-white/20 bg-white/10 px-6 backdrop-blur-md transition-transform duration-500 ease-out group-hover:translate-y-0">
                                        <span className="text-sm font-medium text-white">
                                            Explore Category
                                        </span>

                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors duration-300 group-hover:bg-white group-hover:text-black">
                                            <ArrowRight
                                                size={16}
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </div>
                                </Link>
                            );
                        },
                    )}
                </div>

                {/* Empty State */}
                {filteredCategories.length === 0 && (
                    <NoData
                        size={350}
                        text="No categories found matching your search."
                        className="w-full"
                    />
                )}
            </div>
        </main>
    );
}

export { CategoriesPage };