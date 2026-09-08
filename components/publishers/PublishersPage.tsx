"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import {
    ArrowUpRight,
    Library,
    MapPin,
    Phone,
    Search,
} from "lucide-react";

import { NoData } from "@/components/ui/no-data";

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

interface Publisher {
    id: number;
    name: string;
    logo: string;
    established: string;
    publications: string;
    phone: string;
    address: string;
    description: string;
}

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

const PUBLISHERS = [
    {
        id: 1,
        name: "Ananda Publishers",
        logo:
            "https://media.licdn.com/dms/image/v2/C510BAQGhr_-1xBVe2g/company-logo_200_200/company-logo_200_200/0/1630614473016/ananda_publishers_pvt_ltd_logo?e=2147483647&v=beta&t=607HgR7RT302lTtLYJufP2tQiXxo2oXgkh5xQhqKkHQ",
        established: "1957",
        publications: "5,000+",
        phone: "+91 33 2241 4352",
        address: "9 Prafulla Sarkar St, Kolkata",
        description:
            "One of the most prominent Bengali publishing houses, known for publishing major literary works in Bengali.",
    },
    {
        id: 2,
        name: "Penguin Random House",
        logo:
            "https://www.haveagonews.com.au/wp-content/uploads/2022/07/Survey_1600x800_2.jpg",
        established: "2013",
        publications: "100,000+",
        phone: "+91 124 478 5600",
        address: "Gurugram, Haryana",
        description:
            "The multinational conglomerate publishing company, bringing a vast collection of international and regional literature.",
    },
    {
        id: 3,
        name: "Dey's Publishing",
        logo:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwSzvR0l79w_E1ByRpd4NBgODDlLK31MfCLXmP1Z6jlNhRrT4FnFn_uME&s=10",
        established: "1971",
        publications: "3,000+",
        phone: "+91 33 2241 2330",
        address: "13 Bankim Chatterjee St, Kolkata",
        description:
            "A renowned publishing house in Kolkata, significantly contributing to Bengali literature and academic texts.",
    },
    {
        id: 4,
        name: "Rupa Publications",
        logo:
            "https://upload.wikimedia.org/wikipedia/commons/e/e9/Rupa_Publications_logo.png",
        established: "1936",
        publications: "8,000+",
        phone: "+91 11 4322 6666",
        address: "Ansari Road, Daryaganj, New Delhi",
        description:
            "An Indian publishing company, famously known for publishing biographies, business guides, and contemporary fiction.",
    },
    {
        id: 5,
        name: "Oxford University Press",
        logo:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmfvZ0lev9BW9TvOqOaVJimTaau8eljGt3plAuDOSaqg&s=10",
        established: "1586",
        publications: "1M+",
        phone: "+91 11 4360 0300",
        address: "YMCA Library Building, New Delhi",
        description:
            "The largest university press in the world, publishing dictionaries, educational resources, and academic journals.",
    },
    {
        id: 6,
        name: "HarperCollins",
        logo:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH5rgOO_DzMPh3wiyuItLwj-s_Ftl2ogjsoFz4TiBBtkA0ZlCJCu2H6bby&s=10",
        established: "1989",
        publications: "50,000+",
        phone: "+91 120 404 4800",
        address: "Noida, Uttar Pradesh",
        description:
            "One of the 'Big Five' English-language publishing companies, offering a wide variety of popular fiction and non-fiction.",
    },
    {
        id: 7,
        name: "Indo Bangla Books",
        logo:
            "https://indobanglabooks.in/upload/author/1618992250.jpg",
        established: "2001",
        publications: "1,200+",
        phone: "+91 98300 12345",
        address: "College Street, Kolkata",
        description:
            "A leading distributor and publisher promoting cultural exchange through literature.",
    },
    {
        id: 8,
        name: "Mitra & Ghosh Publishers",
        logo:
            "https://indobanglabooks.in/upload/author/1618983105.jpg",
        established: "1934",
        publications: "4,000+",
        phone: "+91 33 2241 6262",
        address: "10 Shyama Charan De St, Kolkata",
        description:
            "A historic publishing house in Kolkata, known for publishing seminal Bengali authors.",
    },
    {
        id: 9,
        name: "Patra Bharati",
        logo:
            "https://indobanglabooks.in/upload/author/1618991382.jpg",
        established: "1981",
        publications: "2,500+",
        phone: "+91 33 2219 2311",
        address: "1/1, Brindaban Mallick Lane, Kolkata",
        description:
            "Renowned for popularizing children's literature and contemporary Bengali fiction.",
    },
    {
        id: 10,
        name: "Sishu Sahitya Samsad",
        logo:
            "https://indobanglabooks.in/upload/author/1618990309.jpg",
        established: "1951",
        publications: "1,500+",
        phone: "+91 33 2241 3612",
        address: "32A APC Road, Kolkata",
        description:
            "Dedicated to producing high-quality educational materials and literature for children.",
    },
    {
        id: 11,
        name: "Purbashaa Publishers",
        logo:
            "https://indobanglabooks.in/upload/author/1618982265.jpg",
        established: "1995",
        publications: "800+",
        phone: "+91 98310 98765",
        address: "Jadavpur, Kolkata",
        description:
            "A modern publishing house focusing on diverse contemporary voices in Bengal.",
    },
] as const satisfies readonly Publisher[];

const ALPHABET = [
    "All",
    ...Array.from(
        { length: 26 },
        (_, index) => String.fromCharCode(65 + index),
    ),
];

export default function PublishersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeLetter, setActiveLetter] =
        useState("All");

    const normalizedSearch = searchTerm
        .trim()
        .toLowerCase();

    const filteredPublishers = PUBLISHERS.filter(
        (publisher) => {
            const matchesSearch = publisher.name
                .toLowerCase()
                .includes(normalizedSearch);

            const matchesLetter =
                activeLetter === "All" ||
                publisher.name
                    .toUpperCase()
                    .startsWith(activeLetter);

            return matchesSearch && matchesLetter;
        },
    );

    return (
        <main className="min-h-screen bg-background pb-20 font-sans text-foreground">
            {/* <Navbar wish={0} cart={0} /> */}

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
                                    {/* First Copy */}
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

                                    {/* Duplicate */}
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
                <div className="mb-8 flex justify-center">
                    <div className="relative  bg-background flex w-full max-w-2xl items-center overflow-hidden rounded-full border border-border bg-surface shadow-sm">
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
                                className={`flex h-8 min-w-8 items-center justify-center rounded-full border px-2 text-sm font-semibold transition-colors ${isActive
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border bg-surface text-text-secondary hover:border-primary hover:text-foreground"
                                    }`}
                            >
                                {letter}
                            </button>
                        );
                    })}
                </div>

                {/* Publishers Grid */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPublishers.map(
                        (publisher) => (
                            <article
                                key={publisher.id}
                                className="group relative flex min-h-[118px] items-center gap-3 rounded-xl border border-border bg-surface p-3 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                            >
                                {/* Publisher Logo */}
                                <div className="relative flex h-[88px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
                                    <Image
                                        src={publisher.logo}
                                        alt={`${publisher.name} logo`}
                                        fill
                                        sizes="72px"
                                        className="object-contain transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>

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
                                                    Est. {publisher.established}
                                                </span>

                                                <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />

                                                <span className="flex items-center gap-1">
                                                    <Library
                                                        size={11}
                                                        strokeWidth={1.8}
                                                        aria-hidden="true"
                                                    />

                                                    {publisher.publications} books
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            aria-label={`View ${publisher.name}`}
                                            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white"
                                        >
                                            <ArrowUpRight
                                                size={15}
                                                aria-hidden="true"
                                                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                            />
                                        </button>
                                    </div>

                                    {/* Description */}
                                    <p className="mt-2 line-clamp-2 text-[11px] leading-[1.45] text-muted-foreground sm:text-xs">
                                        {publisher.description}
                                    </p>

                                    {/* Contact */}
                                    <div className="mt-auto flex flex-col gap-1.5 overflow-hidden pt-3 text-[11px] text-muted-foreground">
                                        <div className="flex items-center gap-1.5 truncate">
                                            <Phone
                                                size={11}
                                                aria-hidden="true"
                                                className="shrink-0 text-text-secondary"
                                            />

                                            <span className="truncate">
                                                {publisher.phone}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5 truncate">
                                            <MapPin
                                                size={11}
                                                aria-hidden="true"
                                                className="shrink-0 text-text-secondary"
                                            />

                                            <span className="truncate">
                                                {publisher.address}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ),
                    )}
                </div>

                {/* Empty State */}
                {filteredPublishers.length === 0 && (
                    <NoData
                        size={350}
                        text="No publishers found matching your criteria."
                        className="w-full"
                    />
                )}
            </div>
        </main>
    );
}

export { PublishersPage };