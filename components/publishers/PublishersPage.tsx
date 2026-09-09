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

import author1 from "@/assets/author-1.jpg";
import author2 from "@/assets/author-2.jpg";
import author3 from "@/assets/author-3.jpg";

import cover1 from "@/assets/cover-code.jpg";
import cover2 from "@/assets/cover-garden.jpg";
import cover3 from "@/assets/cover-light.jpg";
import cover4 from "@/assets/cover-midnight.jpg";
import cover5 from "@/assets/cover-ocean.jpg";
import cover6 from "@/assets/cover-orbit.jpg";
import cover7 from "@/assets/cover-river.jpg";
import cover8 from "@/assets/cover-silence.jpg";

import book1 from "@/assets/fineBalance.jpeg";
import book2 from "@/assets/midnightsChildren.jpeg";
import book3 from "@/assets/namesake.jpeg";
import book4 from "@/assets/palaceIllusions.jpeg";
import book5 from "@/assets/novels.jpeg";
import book6 from "@/assets/poetry.jpeg";
import book7 from "@/assets/politics.jpeg";
import book8 from "@/assets/short.jpeg";
import book9 from "@/assets/smallThings.jpeg";
import book10 from "@/assets/sport.jpeg";
import book11 from "@/assets/sprit.jpeg";
import book12 from "@/assets/suitableBoy.jpeg";
import book13 from "@/assets/text-book.jpeg";
import book14 from "@/assets/trainPakistan.jpeg";
import book15 from "@/assets/translation.jpeg";
import book16 from "@/assets/whiteTiger.jpeg";
import book17 from "@/assets/ebook.jpeg";

const DEFAULT_PUBLISHER_FALLBACK = "https://i.pinimg.com/1200x/96/6a/23/966a235a132f8b5e7312c877d99aa9c1.jpg";

const ALL_IMAGES: readonly StaticImageData[] = [
    author1,
    author2,
    author3,
    cover1,
    cover2,
    cover3,
    cover4,
    cover5,
    cover6,
    cover7,
    cover8,
    book1,
    book2,
    book3,
    book4,
    book5,
    book6,
    book7,
    book8,
    book9,
    book10,
    book11,
    book12,
    book13,
    book14,
    book15,
    book16,
    book17,
];

const CAROUSEL_COLUMNS = Array.from(
    { length: 16 },
    (_, columnIndex) =>
        Array.from(
            { length: 6 },
            (_, imageIndex) =>
                ALL_IMAGES[
                (columnIndex * 4 + imageIndex * 7) %
                ALL_IMAGES.length
                ],
        ),
);

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
            {/* Header Banner */}
            <section className="relative flex h-78 w-full items-center justify-center overflow-hidden bg-black">
                <style>{`
          @keyframes scroll-up {
            0% {
              transform: translateY(0);
            }

            100% {
              transform: translateY(-50%);
            }
          }

          @keyframes scroll-down {
            0% {
              transform: translateY(-50%);
            }

            100% {
              transform: translateY(0);
            }
          }
        `}</style>

                {/* Animated Background */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-[-50%] z-0 flex items-center justify-center opacity-40"
                    style={{
                        perspective: "1000px",
                    }}
                >
                    <div
                        className="flex h-[200%] w-[250vw] gap-4"
                        style={{
                            transform:
                                "rotateX(20deg) rotateY(-15deg) rotateZ(10deg) scale(1.2)",
                        }}
                    >
                        {CAROUSEL_COLUMNS.map(
                            (column, columnIndex) => (
                                <div
                                    key={columnIndex}
                                    className="flex shrink-0 flex-col"
                                    style={{
                                        animation: `scroll-${columnIndex % 2 === 0
                                            ? "up"
                                            : "down"
                                            } ${30 +
                                            (columnIndex % 3) * 10
                                            }s linear infinite`,
                                    }}
                                >
                                    {/* First copy */}
                                    <div className="flex flex-col gap-4 pb-4">
                                        {column.map(
                                            (image, imageIndex) => (
                                                <div
                                                    key={imageIndex}
                                                    className="relative h-56 w-40 overflow-hidden rounded-xl border border-white/10 shadow-lg md:h-72 md:w-56"
                                                >
                                                    <Image
                                                        src={image}
                                                        alt=""
                                                        fill
                                                        sizes="(max-width: 768px) 160px, 224px"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ),
                                        )}
                                    </div>

                                    {/* Duplicate for seamless animation */}
                                    <div className="flex flex-col gap-4 pb-4">
                                        {column.map(
                                            (image, imageIndex) => (
                                                <div
                                                    key={`duplicate-${imageIndex}`}
                                                    className="relative h-56 w-40 overflow-hidden rounded-xl border border-white/10 shadow-lg md:h-72 md:w-56"
                                                >
                                                    <Image
                                                        src={image}
                                                        alt=""
                                                        fill
                                                        sizes="(max-width: 768px) 160px, 224px"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                </div>

                <div className="pointer-events-none absolute inset-0 z-10 bg-black/25" />

                <h1 className="relative z-20 font-display text-4xl font-bold tracking-widest text-white uppercase drop-shadow-xl md:text-5xl">
                    Publishers
                </h1>
            </section>

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