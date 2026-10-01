"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, RefreshCw, Search } from "lucide-react";

import { NoData } from "@/components/ui/no-data";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfinitePublishers } from "@/features/publishers";
import { useDebounce } from "@/hooks/use-debounce";
import { CategoryBanner } from "@/components/categories/components/CategoryBanner";
import { PublisherCard } from "./components/publisher-card";


const ALPHABET = [
    "All",
    ...Array.from(
        { length: 26 },
        (_, index) => String.fromCharCode(65 + index),
    ),
];
function PublisherCardSkeleton() {
    return (
        <div className="flex min-h-[118px] items-start gap-3 rounded-xl border border-border/70 bg-[#F7F1E3] p-3 shadow-xs">
            <Skeleton className="h-[88px] w-[72px] shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2 py-0.5">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
                <Skeleton className="h-6 w-full rounded" />
                <div className="space-y-1 pt-2">
                    <Skeleton className="h-3 w-2/3 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                </div>
            </div>
        </div>
    );
}

export default function PublishersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeLetter, setActiveLetter] = useState("All");
    const searchInputRef = useRef<HTMLInputElement>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const debouncedSearch = useDebounce(searchTerm, 300);

    // Auto-focus search input on page visit
    useEffect(() => {
        searchInputRef.current?.focus();
        const timer = setTimeout(() => {
            searchInputRef.current?.focus();
        }, 50);
        return () => clearTimeout(timer);
    }, []);

    // Fetch publishers infinitely with 20 per batch, sorted A to Z
    const {
        data,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        error,
        refetch,
    } = useInfinitePublishers({
        limit: 20,
        search: debouncedSearch.trim() || undefined,
        letter: activeLetter !== "All" ? activeLetter : undefined,
    });

    const publishersList = useMemo(() => {
        if (!data?.pages) {
            return [];
        }

        return data.pages.flatMap((page) => page.data ?? []);
    }, [data]);

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === "Tab" && !e.shiftKey) || e.key === "ArrowDown") {
            const firstEl = document.getElementById("publisher-result-0");
            if (firstEl) {
                e.preventDefault();
                firstEl.focus();
                firstEl.scrollIntoView?.({ behavior: "smooth", block: "nearest" });
            }
        }
    };

    // Infinite scroll trigger via IntersectionObserver: only fetches next page when scrolling down
    useEffect(() => {
        if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) {
            return;
        }

        if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first?.isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { rootMargin: "250px" },
        );

        observer.observe(loadMoreRef.current);

        return () => {
            observer.disconnect();
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <main className="min-h-screen bg-background pb-20 font-sans text-foreground">
            {/* 3D Carousel Banner */}
            <CategoryBanner categoryName="Publishers" />

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
                            ref={searchInputRef}
                            type="search"
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                            onKeyDown={handleSearchKeyDown}
                            placeholder="Search publisher by name..."
                            aria-label="Search publisher by name"
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
                        <h3 className="font-semibold text-foreground">Failed to load publishers</h3>
                        <p className="text-sm text-muted-foreground">
                            {error instanceof Error ? error.message : "An unexpected error occurred while fetching publishers."}
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
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <PublisherCardSkeleton key={idx} />
                        ))}
                    </div>
                )}

                {/* Publishers Grid */}
                {!isLoading && !error && publishersList.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {publishersList.map((publisher, index) => (
                                <PublisherCard
                                    key={publisher._id || publisher.slug}
                                    publisher={publisher}
                                    index={index}
                                    isFirst={index === 0}
                                />
                            ))}
                        </div>

                        {/* Skeletons while loading the next page batch on scroll */}
                        {isFetchingNextPage && (
                            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                                {Array.from({ length: 3 }).map((_, idx) => (
                                    <PublisherCardSkeleton key={`loading-more-${idx}`} />
                                ))}
                            </div>
                        )}

                        {/* Infinite Scroll Trigger Sentinel */}
                        <div ref={loadMoreRef} className="h-6 w-full" />
                    </>
                )}

                {/* Empty State */}
                {!isLoading && !error && publishersList.length === 0 && (
                    <NoData
                        size={350}
                        text={
                            searchTerm || activeLetter !== "All"
                                ? "No publishers found matching your criteria."
                                : "No publishers available at the moment."
                        }
                        className="w-full"
                    />
                )}
            </div>
        </main>
    );
}

export { PublishersPage };