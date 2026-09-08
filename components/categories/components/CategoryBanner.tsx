"use client";

import React from "react";
import Image, { type StaticImageData } from "next/image";
import { motion } from "framer-motion";

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

const CAROUSEL_COLUMNS = Array.from({ length: 16 }, (_, i) =>
  Array.from(
    { length: 6 },
    (_, j) => ALL_IMAGES[(i * 4 + j * 7) % ALL_IMAGES.length],
  ),
);

interface CategoryBannerProps {
  categoryName?: string;
  className?: string;
  children?: React.ReactNode;
  compact?: boolean;
}

export function CategoryBanner({
  categoryName,
  className = "",
  children,
  compact = false,
}: CategoryBannerProps) {
  return (
    <div
      className={`relative flex w-full items-center justify-center overflow-hidden bg-black ${
        compact ? "h-[156px] pt-[68px]" : "h-78 pt-[76px]"
      } ${className}`}
    >
      <style>{`
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scroll-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
      `}</style>

      {/* 3D Carousel Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-50%] z-0 flex items-center justify-center opacity-40"
        style={{ perspective: "1000px" }}
      >
        <div
          className="flex h-[200%] w-[250vw] gap-4"
          style={{
            transform:
              "rotateX(20deg) rotateY(-15deg) rotateZ(10deg) scale(1.2)",
          }}
        >
          {CAROUSEL_COLUMNS.map((column, i) => (
            <div
              key={i}
              className="flex shrink-0 flex-col"
              style={{
                animation: `scroll-${i % 2 === 0 ? "up" : "down"} ${
                  90 + (i % 3) * 30
                }s linear infinite`,
              }}
            >
              {/* Group 1 */}
              <div className="flex flex-col gap-4 pb-4">
                {column.map((img, j) => (
                  <div
                    key={j}
                    className="relative h-56 w-40 overflow-hidden rounded-xl border border-white/10 shadow-lg md:h-72 md:w-56"
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 160px, 224px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              {/* Group 2 (Duplicate for seamless scroll) */}
              <div className="flex flex-col gap-4 pb-4">
                {column.map((img, j) => (
                  <div
                    key={`duplicate-${j}`}
                    className="relative h-56 w-40 overflow-hidden rounded-xl border border-white/10 shadow-lg md:h-72 md:w-56"
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 160px, 224px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 bg-black/25" />

      {children ? (
        children
      ) : categoryName ? (
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`relative z-20 px-4 text-center font-display font-bold uppercase tracking-[0.1em] text-white drop-shadow-xl ${
            compact ? "mb-3 text-2xl sm:text-3xl" : "mb-16 text-4xl md:text-5xl"
          }`}
        >
          {categoryName}
        </motion.h1>
      ) : null}
    </div>
  );
}
