"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Search,
  Star,
} from "lucide-react";

const ROTATING_WORDS = [
  "journey.",
  "character.",
  "escapism.",
  "curiosity.",
] as const;

const PLACEHOLDER_QUERIES = [
  "the great gatsby",
  "haruki murakami",
  "philosophy & ethics",
  "rare 1st editions",
  "virginia woolf",
  "essays & poetry",
] as const;

const POPULAR_TAGS = [
  "Literary Fiction",
  "Philosophy",
  "Rare Editions",
  "Essays & Poetry",
  "Art & Architecture",
] as const;

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: EASE_OUT,
    },
  },
};

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [placeholderText, setPlaceholderText] = useState("");

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setWordIndex(
        (currentIndex) =>
          (currentIndex + 1) % ROTATING_WORDS.length,
      );
    }, 2800);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let phraseIndex = 0;
    let characterIndex = 0;
    let isDeleting = false;

    let timeoutId: number;

    const typeSpeed = 60;
    const deleteSpeed = 30;
    const pauseEnd = 1600;
    const pauseStart = 350;

    const tick = (): void => {
      const currentPhrase = PLACEHOLDER_QUERIES[phraseIndex];

      if (!isDeleting) {
        characterIndex += 1;

        setPlaceholderText(
          currentPhrase.slice(0, characterIndex),
        );

        if (characterIndex === currentPhrase.length) {
          isDeleting = true;
          timeoutId = window.setTimeout(tick, pauseEnd);
          return;
        }

        timeoutId = window.setTimeout(tick, typeSpeed);
        return;
      }

      characterIndex -= 1;

      setPlaceholderText(
        currentPhrase.slice(0, characterIndex),
      );

      if (characterIndex === 0) {
        isDeleting = false;
        phraseIndex =
          (phraseIndex + 1) %
          PLACEHOLDER_QUERIES.length;

        timeoutId = window.setTimeout(tick, pauseStart);
        return;
      }

      timeoutId = window.setTimeout(tick, deleteSpeed);
    };

    timeoutId = window.setTimeout(tick, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const scrollToBooks = (): void => {
    document.getElementById("books")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleSearchSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();

    if (!searchQuery.trim()) {
      return;
    }

    scrollToBooks();
  };

  const handleTagClick = (tag: string): void => {
    setSearchQuery(tag);
    scrollToBooks();
  };

  return (
    <section
      id="top"
      className="relative flex h-[min(940px,100svh)] min-h-[840px] items-center justify-center overflow-hidden bg-[#0a0a0a] pt-[110px] pb-[60px]"
    >
      {/* Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full overflow-hidden"
        aria-hidden="true"
      >
        <Image
          src="https://shelfie-joy.lovable.app/assets/hero-bookshop-DVESlcEW.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-105 object-cover object-center brightness-90 contrast-125 blur-[3px] transition-transform duration-[15000ms]"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/40 to-[#0a0a0a]/90" />
      </motion.div>

      {/* Ambient Glow */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9,
        }}
        animate={{
          opacity: 0.2,
          scale: 1,
        }}
        transition={{
          duration: 1.2,
        }}
        className="pointer-events-none absolute top-1/2 left-1/2 z-[2] h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,165,0,0.15),transparent_60%)] blur-[80px]"
        aria-hidden="true"
      />

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex w-full max-w-[960px] flex-col items-center px-5 pt-4 text-center"
      >
        {/* Heading */}
        <h1 className="mb-6 max-w-[860px] font-display text-5xl leading-[1.15] font-medium tracking-tight text-white md:text-7xl lg:text-[92px]">
          <motion.span
            variants={itemVariants}
            className="block text-center"
          >
            The bookshop shelf,
          </motion.span>

          <motion.span
            variants={itemVariants}
            className="mt-2 block text-center text-3xl font-normal text-zinc-200 md:text-5xl lg:text-[58px]"
          >
            curated for your{" "}
            <span className="relative inline-flex items-center justify-center overflow-hidden px-1 py-1 text-center align-baseline">
              {/* Keeps width stable */}
              <span
                aria-hidden="true"
                className="pointer-events-none invisible px-1 font-normal italic select-none"
              >
                curiosity.
              </span>

              <AnimatePresence
                mode="popLayout"
                initial={false}
              >
                <motion.span
                  key={ROTATING_WORDS[wordIndex]}
                  initial={{
                    y: "100%",
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  exit={{
                    y: "-100%",
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.55,
                    ease: EASE_OUT,
                  }}
                  className="absolute inset-0 flex items-center justify-center px-1 font-normal whitespace-nowrap text-orange-400 italic drop-shadow-lg"
                >
                  {ROTATING_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.span>
        </h1>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="mb-8 max-w-2xl text-base leading-relaxed text-zinc-300 md:text-lg"
        >
          Discover handpicked literary masterpieces, rare
          editions, and timeless voices waiting to be explored
          by passionate readers and thoughtful minds.
        </motion.p>

        {/* Search */}
        <motion.form
          variants={itemVariants}
          onSubmit={handleSearchSubmit}
          role="search"
          className="mb-8 flex w-full max-w-2xl flex-col items-center gap-5"
        >
          <div className="flex w-full items-center rounded-full border border-white/15 bg-white/5 py-1.5 pr-2 pl-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all hover:bg-white/10 focus-within:border-white/30 focus-within:bg-white/15">
            <Search
              size={20}
              className="mr-3 shrink-0 text-zinc-400"
              aria-hidden="true"
            />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder={placeholderText}
              aria-label="Search books, authors, or categories"
              className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-zinc-500"
            />

            <button
              type="submit"
              className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:bg-orange-500 hover:shadow-orange-500/25"
            >
              <span>Find Books</span>
              <ArrowRight
                size={16}
                aria-hidden="true"
              />
            </button>
          </div>

          {/* Popular Tags */}
          <div className="hidden flex-wrap items-center justify-center gap-3 text-sm sm:flex">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="cursor-pointer rounded-full border border-white/5 bg-white/5 px-4 py-1.5 text-xs text-zinc-300 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/15 hover:text-white"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </motion.form>

        {/* CTA */}
        <motion.div
          variants={itemVariants}
          className="mb-14 flex w-full flex-col items-center justify-center gap-6 sm:w-auto sm:flex-row"
        >
          <a
            href="#books"
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black shadow-lg transition-all hover:scale-105 hover:bg-zinc-100 sm:w-auto"
          >
            <BookOpen
              size={18}
              aria-hidden="true"
            />
            Explore Collection
          </a>

          <a
            href="#authors"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
          >
            Meet Our Authors

            <ArrowUpRight
              size={16}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="grid w-full max-w-[820px] grid-cols-2 items-center justify-center gap-6 rounded-2xl border border-white/5 bg-white/[0.02] p-6 shadow-2xl backdrop-blur-md md:flex md:gap-10 md:px-10"
        >
          <div className="flex flex-col items-center gap-1">
            <strong className="font-display text-2xl font-normal tracking-tight text-white">
              50,000+
            </strong>

            <span className="text-[11px] tracking-widest text-zinc-500 uppercase">
              Curated Titles
            </span>
          </div>

          <div className="hidden h-8 w-px bg-white/10 md:block" />

          <div className="flex flex-col items-center gap-1">
            <strong className="font-display text-2xl font-normal tracking-tight text-white">
              1,200+
            </strong>

            <span className="text-[11px] tracking-widest text-zinc-500 uppercase">
              Indie Authors
            </span>
          </div>

          <div className="hidden h-8 w-px bg-white/10 md:block" />

          <div className="flex flex-col items-center gap-1">
            <strong className="font-display text-2xl font-normal tracking-tight text-white">
              100%
            </strong>

            <span className="text-[11px] tracking-widest text-zinc-500 uppercase">
              Eco-Friendly
            </span>
          </div>

          <div className="hidden h-8 w-px bg-white/10 md:block" />

          <div className="flex flex-col items-center gap-1">
            <strong className="inline-flex items-center gap-1.5 font-display text-2xl font-normal tracking-tight text-white">
              4.9

              <Star
                size={16}
                aria-hidden="true"
                className="fill-orange-500 text-orange-500"
              />
            </strong>

            <span className="text-[11px] tracking-widest text-zinc-500 uppercase">
              Reader Rating
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}