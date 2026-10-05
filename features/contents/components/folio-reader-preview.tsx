"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import type { EbookPageItem } from "../types/content.types";

interface FolioReaderPreviewProps {
  books?: EbookPageItem[];
}

const DEFAULT_BOOKS: readonly EbookPageItem[] = [
  {
    title: "Pride and Prejudice",
    quote:
      "“It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.”",
    progress: 42,
  },
  {
    title: "Alice's Adventures in Wonderland",
    quote: "“Curiouser and curiouser!”",
    progress: 56,
  },
  {
    title: "The Great Gatsby",
    quote:
      "“So we beat on, boats against the current, borne back ceaselessly into the past.”",
    progress: 71,
  },
  {
    title: "The Adventures of Sherlock Holmes",
    quote: "“There is nothing more deceptive than an obvious fact.”",
    progress: 84,
  },
];

export function FolioReaderPreview({ books }: FolioReaderPreviewProps) {
  const booksList = books && books.length > 0 ? books : DEFAULT_BOOKS;
  const [pageIndex, setPageIndex] = useState(0);

  const safeIndex =
    ((pageIndex % booksList.length) + booksList.length) % booksList.length;
  const currentBook = booksList[safeIndex] || booksList[0];
  const progressVal = currentBook.progress ?? 50;

  const handlePrevPage = () => {
    setPageIndex((prev) => prev - 1);
  };

  const handleNextPage = () => {
    setPageIndex((prev) => prev + 1);
  };

  return (
    <div className="relative mx-auto flex w-full max-w-[320px] flex-col items-center py-2">
      {/* Ambient Aura Blur (matching storefront ebooks aura) */}
      <div className="pointer-events-none absolute inset-0 m-auto h-[320px] w-[260px] rounded-full bg-primary/25 blur-[60px]" />

      {/* Folio E-Reader Device Container */}
      <div className="relative flex h-[430px] w-[270px] sm:w-[290px] flex-col overflow-hidden rounded-xl border-[6px] border-surface-hover bg-foreground shadow-2xl backdrop-blur-xl">
        {/* Device Screen */}
        <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden bg-foreground p-6 text-background">
          {/* Header with dots and device brand */}
          <div className="z-20 flex items-center justify-between">
            <div className="flex gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-background opacity-40" />
              <span className="h-1.5 w-1.5 rounded-full bg-background opacity-40" />
            </div>

            <p className="m-0 text-[9px] font-semibold tracking-[0.18em] opacity-60">
              FOLIO READER
            </p>
          </div>

          {/* Swipe Hint & Navigation Controls */}
          <div className="z-20 mt-3 flex items-center justify-between text-[10px] font-bold tracking-widest uppercase opacity-40">
            <span className="flex items-center gap-1.5">
              <MoveHorizontal size={12} />
              <span>
                {safeIndex + 1} / {booksList.length}
              </span>
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevPage}
                className="rounded p-1 hover:bg-background/20 cursor-pointer"
                title="Previous book quote"
              >
                <ChevronLeft size={13} />
              </button>
              <button
                type="button"
                onClick={handleNextPage}
                className="rounded p-1 hover:bg-background/20 cursor-pointer"
                title="Next book quote"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>

          {/* Book Page Content */}
          <div className="relative mt-5 flex h-full w-full flex-1 flex-col justify-center overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={safeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22 }}
                className="flex flex-col"
              >
                <h3 className="pointer-events-none mb-3.5 font-display text-[26px] leading-[0.92] font-normal text-background sm:text-[30px]">
                  {currentBook.title
                    .split(" ")
                    .map((word, wordIdx) => (
                      <span
                        key={`${word}-${wordIdx}`}
                        className="block"
                      >
                        {word}
                      </span>
                    ))}
                </h3>

                <blockquote className="pointer-events-none m-0 font-display text-[13px] leading-[1.4] font-normal text-background/75 line-clamp-6">
                  {currentBook.quote}
                </blockquote>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Reading Progress Line & Number */}
          <div className="relative z-20 mt-auto border-t border-background/20 pt-2">
            <motion.span
              key={`reader-progress-${safeIndex}`}
              initial={{ width: 0 }}
              animate={{ width: `${progressVal}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.6 }}
              className="absolute -top-px left-0 block h-0.5 bg-primary"
            />

            <small className="float-right text-[8px] font-bold opacity-80">
              {progressVal}%
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
