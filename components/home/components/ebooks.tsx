"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  MoveHorizontal,
} from "lucide-react";

import arrowImg from "@/assets/arrow.png";

import { Button } from "./button";

interface BookPage {
  title: string;
  quote: string;
  progress: number;
}

type Direction = -1 | 0 | 1;
type PaginationDirection = -1 | 1;
type PageState = [page: number, direction: Direction];

const BOOK_PAGES: readonly BookPage[] = [
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
] as const;

const pageVariants: Variants = {
  enter: (direction: Direction) => ({
    x: direction > 0 ? 150 : -150,
    opacity: 0,
    scale: 0.9,
    rotate: direction > 0 ? 5 : -5,
  }),

  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
  },

  exit: (direction: Direction) => ({
    zIndex: 0,
    x: direction < 0 ? 150 : -150,
    opacity: 0,
    scale: 0.9,
    rotate: direction < 0 ? 5 : -5,
  }),
};

const SWIPE_CONFIDENCE_THRESHOLD = 50;

function getSwipePower(offset: number, velocity: number): number {
  return Math.abs(offset) * velocity;
}

function getWrappedIndex(page: number, length: number): number {
  return ((page % length) + length) % length;
}

export function Ebooks() {
  const [[page, direction], setPage] = useState<PageState>([0, 0]);

  const pageIndex = getWrappedIndex(page, BOOK_PAGES.length);
  const currentBook = BOOK_PAGES[pageIndex];

  const paginate = (newDirection: PaginationDirection): void => {
    setPage(([currentPage]) => [
      currentPage + newDirection,
      newDirection,
    ]);
  };

  return (
    <section className="py-[76px] md:py-[120px]">
      <div className="relative mx-auto grid min-h-[500px] w-[min(1320px,calc(100%-36px))] grid-cols-1 items-center gap-12 overflow-hidden rounded-lg border border-border bg-gradient-to-br from-surface-elevated to-card px-6 py-12 md:min-h-[600px] md:w-[min(1320px,calc(100%-72px))] md:grid-cols-2 md:gap-20 md:px-[8%] md:py-[70px]">
        {/* Left Content */}
        <div className="z-10">
          <p className="mb-4.5 text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">
            DIGITAL EDITIONS
          </p>

          <h2 className="mb-6 font-display text-[clamp(44px,5vw,76px)] leading-[0.9] font-normal text-foreground">
            Carry your library
            <br />

            <em className="italic text-accent">
              everywhere.
            </em>
          </h2>

          <p className="mb-7.5 max-w-[450px] text-base leading-relaxed text-muted-foreground">
            Discover thousands of books available instantly as digital
            editions.{" "}
            <strong>
              Drag or swipe the text on the reader
            </strong>{" "}
            to experience seamless page turning.
          </p>

          <Button>
            Explore E-Books
            <ArrowRight size={17} />
          </Button>
        </div>

        {/* Interactive E-Reader */}
        <div className="relative z-10 flex items-center justify-center py-4">
          {/* Ambient Aura */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute inset-0 m-auto max-h-[400px] max-w-[300px] rounded-full bg-primary/30 blur-[80px]"
          />

          <div className="relative">
            {/* Swipe Indicator */}
            <div className="pointer-events-none absolute -top-12 -right-16 z-30 flex flex-col items-center select-none sm:-top-16 sm:-right-20 md:-right-24 xl:-right-24 2xl:-right-28">
              <Image
                src={arrowImg}
                alt=""
                width={64}
                height={64}
                aria-hidden="true"
                className="h-14 w-14 -scale-x-100 rotate-45 object-contain opacity-85 drop-shadow-md dark:invert sm:h-14 sm:w-14 md:h-16 md:w-16"
              />

              <span className="-mt-1 rotate-[12deg] whitespace-nowrap font-handwriting text-lg leading-none text-accent sm:-mt-2 sm:text-2xl md:text-[28px]">
                swipe!!
              </span>
            </div>

            {/* E-Reader Device */}
            <div className="relative flex h-[390px] w-[270px] flex-col overflow-hidden rounded-xl border-[6px] border-surface-hover bg-foreground shadow-2xl backdrop-blur-xl md:h-[500px] md:w-[360px] md:border-[8px]">
              {/* Screen */}
              <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden bg-foreground p-7 text-background md:p-[38px]">
                {/* Header */}
                <div className="z-20 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-background opacity-40" />
                    <span className="h-1.5 w-1.5 rounded-full bg-background opacity-40" />
                  </div>

                  <p className="m-0 text-[9px] tracking-[0.18em] opacity-60">
                    FOLIO READER
                  </p>
                </div>

                {/* Swipe Hint */}
                <div className="absolute top-20 right-8 z-20 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase opacity-30">
                  <MoveHorizontal size={14} />
                  Swipe
                </div>

                {/* Draggable Page */}
                <div className="relative mt-8 flex h-full w-full flex-1 items-center justify-center md:mt-11">
                  <AnimatePresence
                    initial={false}
                    custom={direction}
                  >
                    <motion.div
                      key={page}
                      custom={direction}
                      variants={pageVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: {
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        },
                        opacity: {
                          duration: 0.2,
                        },
                        rotate: {
                          duration: 0.3,
                        },
                      }}
                      drag="x"
                      dragConstraints={{
                        left: 0,
                        right: 0,
                      }}
                      onDragEnd={(_, { offset, velocity }) => {
                        const swipe = getSwipePower(
                          offset.x,
                          velocity.x,
                        );

                        if (swipe < -SWIPE_CONFIDENCE_THRESHOLD) {
                          paginate(1);
                        } else if (
                          swipe > SWIPE_CONFIDENCE_THRESHOLD
                        ) {
                          paginate(-1);
                        }
                      }}
                      className="absolute inset-0 flex h-full w-full cursor-grab flex-col active:cursor-grabbing"
                    >
                      <h3 className="pointer-events-none mb-6 font-display text-[37px] leading-[0.92] font-normal md:text-[47px]">
                        {currentBook.title
                          .split(" ")
                          .map((word, index) => (
                            <span
                              key={`${word}-${index}`}
                              className="block"
                            >
                              {word}
                            </span>
                          ))}
                      </h3>

                      <blockquote className="pointer-events-none m-0 font-display text-[16px] leading-[1.45] font-normal opacity-75 md:text-[19px]">
                        {currentBook.quote}
                      </blockquote>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Reading Progress */}
                <div className="relative z-20 mt-auto border-t border-background/20 pt-2">
                  <motion.span
                    key={`progress-${pageIndex}`}
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${currentBook.progress}%`,
                    }}
                    transition={{
                      type: "spring",
                      bounce: 0,
                      duration: 0.8,
                      delay: 0.1,
                    }}
                    className="absolute -top-px left-0 block h-0.5 bg-primary"
                  />

                  <small className="float-right text-[8px] font-bold opacity-80">
                    {currentBook.progress}%
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}