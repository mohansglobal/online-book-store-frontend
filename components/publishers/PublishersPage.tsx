"use client";

import { useMemo, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
    AlertCircle,
    ArrowUpRight,
    Building2,
    Library,
    MapPin,
    Phone,
    RefreshCw,
    Search,
} from "lucide-react";

import { NoData } from "@/components/ui/no-data";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublishers, useAllPublishers, type Publisher } from "@/features/publishers";
import { CategoryBanner } from "@/components/categories/components/CategoryBanner";

const DEFAULT_PUBLISHER_FALLBACK = "https://i.pinimg.com/1200x/96/6a/23/966a235a132f8b5e7312c877d99aa9c1.jpg";

const ALPHABET = [
    "All",
    ...Array.from(
        { length: 26 },
        (_, index) => String.fromCharCode(65 + index),
    ),
];

function getPublisherImage(publisher: Publisher): string {
    const rawImage = publisher.logo || publisher.image;
    const hasImage = (publisher.isImage === "1" || publisher.isImage === 1) && Boolean(rawImage);

    if (!hasImage || !rawImage) {
        return DEFAULT_PUBLISHER_FALLBACK;
    }

    if (rawImage.startsWith("http://") || rawImage.startsWith("https://")) {
        return rawImage;
    }

    const backendBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") || "http://localhost:5000";
    return `${backendBase}/assets/upload/author/${rawImage}`;
}

function PublisherAvatar({
    publisher,
    sizes = "72px",
}: {
    publisher: Publisher;
    sizes?: string;
}) {
    const initialSrc = getPublisherImage(publisher);
    const [currentSrc, setCurrentSrc] = useState<string>(initialSrc);
    const [hasError, setHasError] = useState(false);

    return (
        <div className="relative flex h-[88px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background shadow-xs transition-colors group-hover:border-primary">
            {!hasError ? (
                <Image
                    src={currentSrc}
                    alt={`${publisher.name} logo`}
                    fill
                    sizes={sizes}
                    unoptimized={true}
                    onError={() => {
                        if (currentSrc !== DEFAULT_PUBLISHER_FALLBACK) {
                            setCurrentSrc(DEFAULT_PUBLISHER_FALLBACK);
                        } else {
                            setHasError(true);
                        }
                    }}
                    className={
                        currentSrc === DEFAULT_PUBLISHER_FALLBACK
                            ? "object-cover transition-transform duration-500 group-hover:scale-110"
                            : "object-contain p-1 transition-transform duration-500 group-hover:scale-110"
                    }
                />
            ) : (
                <Building2 size={26} strokeWidth={1.7} className="text-muted-foreground group-hover:text-primary" />
            )}
        </div>
    );
}

export default function PublishersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeLetter, setActiveLetter] = useState("All");

    const { data: allPublishers, isLoading, error, refetch } = useAllPublishers();

    const publishersList = useMemo(() => {
        return allPublishers ?? [];
    }, [allPublishers]);

    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filteredPublishers = useMemo(() => {
        return publishersList.filter((publisher) => {
            const matchesSearch =
                !normalizedSearch ||
                publisher.name?.toLowerCase().includes(normalizedSearch) ||
                publisher.nameBn?.toLowerCase().includes(normalizedSearch) ||
                publisher.slug?.toLowerCase().includes(normalizedSearch);

            const matchesLetter =
                activeLetter === "All" ||
                publisher.name?.toUpperCase().startsWith(activeLetter);

            return matchesSearch && matchesLetter;
        });
    }, [publishersList, normalizedSearch, activeLetter]);

    return (
        <main className="min-h-screen bg-background pb-20 font-sans text-foreground">
            {/* 3D Carousel Banner */}
            <CategoryBanner categoryName="Publishers" />

            <div className="relative z-20 mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Search */}
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
                            <div
                                key={idx}
                                className="flex min-h-[118px] items-start gap-3 rounded-xl border border-border/70 bg-[#F7F1E3] p-3 shadow-xs"
                            >
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
                        ))}
                    </div>
                )}

                {/* Publishers Grid */}
                {!isLoading && !error && filteredPublishers.length > 0 && (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {filteredPublishers.map((publisher) => (
                            <article
                                key={publisher._id || publisher.slug}
                                className="group relative flex min-h-[118px] items-center gap-3 rounded-xl border border-border/70 bg-[#F7F1E3] p-3 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                            >
                                {/* Publisher Logo */}
                                <PublisherAvatar key={publisher._id || publisher.slug} publisher={publisher} />

                                {/* Content */}
                                <div className="flex min-w-0 flex-1 flex-col py-0.5">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <h2
                                                title={publisher.name}
                                                className="truncate font-display text-[15px] leading-tight font-semibold text-foreground sm:text-base"
                                            >
                                                {publisher.name}
                                            </h2>

                                            {/* Meta */}
                                            <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                                                <span>
                                                    Est. {publisher.established || (publisher.createdAt ? new Date(publisher.createdAt).getFullYear() : "-")}
                                                </span>

                                                <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />

                                                <span className="flex items-center gap-1">
                                                    <Library
                                                        size={11}
                                                        strokeWidth={1.8}
                                                        aria-hidden="true"
                                                    />

                                                    <span>{publisher.publications || "-"} books</span>
                                                </span>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/books?publisher=${publisher._id}`}
                                            aria-label={`View ${publisher.name}`}
                                            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white"
                                        >
                                            <ArrowUpRight
                                                size={15}
                                                aria-hidden="true"
                                                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                            />
                                        </Link>
                                    </div>

                                    {/* Description */}
                                    <p className="mt-2 line-clamp-2 text-[11px] leading-[1.45] text-muted-foreground sm:text-xs">
                                        {publisher.description || "-"}
                                    </p>

                                    {/* Contact */}
                                    <div className="mt-auto flex flex-col gap-1.5 overflow-hidden pt-3 text-[11px] text-muted-foreground">
                                        <div className="flex items-center gap-1.5 truncate">
                                            <Phone
                                                size={11}
                                                aria-hidden="true"
                                                className="shrink-0 text-muted-foreground"
                                            />

                                            <span className="truncate">
                                                {publisher.phone || "-"}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5 truncate">
                                            <MapPin
                                                size={11}
                                                aria-hidden="true"
                                                className="shrink-0 text-muted-foreground"
                                            />

                                            <span className="truncate">
                                                {publisher.address || "-"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && filteredPublishers.length === 0 && (
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

export { PublishersPage, PublishersPage as PublishersPageIntegrated };