"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { ArrowUpRight, Search } from "lucide-react";

import { NoData } from "../ui/no-data";

import author1 from "../../assets/author-1.jpg";
import author2 from "../../assets/author-2.jpg";
import author3 from "../../assets/author-3.jpg";

import cover1 from "../../assets/cover-code.jpg";
import cover2 from "../../assets/cover-garden.jpg";
import cover3 from "../../assets/cover-light.jpg";
import cover4 from "../../assets/cover-midnight.jpg";
import cover5 from "../../assets/cover-ocean.jpg";
import cover6 from "../../assets/cover-orbit.jpg";
import cover7 from "../../assets/cover-river.jpg";
import cover8 from "../../assets/cover-silence.jpg";

import book1 from "../../assets/fineBalance.jpeg";
import book2 from "../../assets/midnightsChildren.jpeg";
import book3 from "../../assets/namesake.jpeg";
import book4 from "../../assets/palaceIllusions.jpeg";
import book5 from "../../assets/novels.jpeg";
import book6 from "../../assets/poetry.jpeg";
import book7 from "../../assets/politics.jpeg";
import book8 from "../../assets/short.jpeg";
import book9 from "../../assets/smallThings.jpeg";
import book10 from "../../assets/sport.jpeg";
import book11 from "../../assets/sprit.jpeg";
import book12 from "../../assets/suitableBoy.jpeg";
import book13 from "../../assets/text-book.jpeg";
import book14 from "../../assets/trainPakistan.jpeg";
import book15 from "../../assets/translation.jpeg";
import book16 from "../../assets/whiteTiger.jpeg";
import book17 from "../../assets/ebook.jpeg";

interface Author {
  id: number;
  name: string;
  image: string;
  rank: string;
  badge: string;
  categories: readonly string[];
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

const AUTHORS = [
  {
    id: 1,
    name: "Rabindranath Tagore",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM1qBsjaMPs9D00G12QGLwHclccepERlku-OHdBPWkBviHmB7UikEIzMg&s=10",
    rank: "01",
    badge: "CLASSIC ICON",
    categories: [
      "POETRY",
      "PHILOSOPHY",
      "NOBEL LAUREATE",
    ],
    description:
      "Asia's first Nobel laureate, whose poetry, stories and songs transformed Bengali literature and music in the late 19th and early 20th centuries.",
  },
  {
    id: 2,
    name: "A. P. J. Abdul Kalam",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/b/b0/A._P._J._Abdul_Kalam_in_2008.jpg",
    rank: "02",
    badge: "VISIONARY",
    categories: [
      "SCIENCE",
      "AUTOBIOGRAPHY",
      "INSPIRATIONAL",
    ],
    description:
      "An Indian aerospace scientist and statesman who served as the 11th president of India. Widely known as the Missile Man of India.",
  },
  {
    id: 3,
    name: "Satyajit Ray",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsS5CDp911FarOEtnSk-IaPY2T-U2LEsxOMb2yz7j96UCoiHxuG7Od1uUF&s=10",
    rank: "03",
    badge: "MASTER STORYTELLER",
    categories: [
      "MYSTERY",
      "FICTION",
      "FILMMAKING",
    ],
    description:
      "Considered one of the greatest filmmakers of all time, he was also a prolific writer, creating the famous detective Feluda and scientist Professor Shonku.",
  },
  {
    id: 4,
    name: "Ashapurna Debi",
    image:
      "https://assets-in.bmscdn.com/iedb/artist/images/website/poster/large/ashapoorna-devi-iein010376-24-03-2017-14-59-11.jpg",
    rank: "04",
    badge: "FEMINIST VOICE",
    categories: [
      "LITERARY FICTION",
      "SOCIAL REALISM",
    ],
    description:
      "A prominent Bengali novelist and poet, known for her sharp critique of patriarchal society and deeply moving portrayals of women's lives.",
  },
] as const satisfies readonly Author[];

const ALPHABET = [
  "All",
  ...Array.from(
    { length: 26 },
    (_, index) => String.fromCharCode(65 + index),
  ),
];

export default function AuthorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeLetter, setActiveLetter] =
    useState("All");

  const normalizedSearch = searchTerm
    .trim()
    .toLowerCase();

  const filteredAuthors = AUTHORS.filter(
    (author) => {
      const matchesSearch = author.name
        .toLowerCase()
        .includes(normalizedSearch);

      const matchesLetter =
        activeLetter === "All" ||
        author.name
          .toUpperCase()
          .startsWith(activeLetter);

      return matchesSearch && matchesLetter;
    },
  );

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

        {/* Animated Book Background */}
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
                    animation: `scroll-${
                      columnIndex % 2 === 0
                        ? "up"
                        : "down"
                    } ${
                      30 +
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

        {/* Overlay */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-black/25" />

        <h1 className="relative z-20 font-display text-4xl font-bold tracking-widest text-white uppercase drop-shadow-xl md:text-5xl">
          Authors
        </h1>
      </section>

      <div className="relative z-20 mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="mb-8 flex justify-center">
          <div className="relative flex w-full max-w-2xl items-center overflow-hidden rounded-full border border-border bg-background bg-surface shadow-sm">
            <Search
              size={20}
              aria-hidden="true"
              className="ml-4 shrink-0  text-muted-foreground"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search author by name..."
              aria-label="Search author by name"
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
                className={`flex h-8 min-w-8 items-center justify-center rounded-full border px-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface text-text-secondary hover:border-primary hover:text-foreground"
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>

        {/* Authors Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredAuthors.map((author) => (
            <article
              key={author.id}
              className="flex flex-col rounded-xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft md:p-8"
            >
              {/* Avatar */}
              <div className="mb-6 flex">
                <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-background shadow-sm">
                  <Image
                    src={author.image}
                    alt={`Portrait of ${author.name}`}
                    fill
                    sizes="80px"
                    className="object-cover grayscale contrast-125"
                  />
                </div>
              </div>

              {/* Author Information */}
              <h2 className="mb-4 font-display text-3xl leading-tight text-foreground sm:text-4xl">
                {author.name}
              </h2>

              <p className="line-clamp-3 flex-grow text-sm leading-relaxed text-muted-foreground sm:text-base">
                {author.description}
              </p>

              <hr className="my-6 w-full border-t border-border" />

              {/* Action */}
              <div className="mt-auto flex items-center">
                <button
                  type="button"
                  className="group flex items-center gap-1 font-bold text-foreground transition-colors hover:text-accent"
                >
                  View details

                  <ArrowUpRight
                    size={18}
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredAuthors.length === 0 && (
          <NoData
            size={350}
            text="No authors found matching your criteria."
            className="w-full"
          />
        )}
      </div>
    </main>
  );
}