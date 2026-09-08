"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { books } from "../data";
import { BookCard } from "./book-card";
import { SectionHeading } from "./section-heading";

interface TextbooksProps {
  onWish: () => void;
  onCart: () => void;
}

const SUBJECTS = [
  "Computer Science",
  "Engineering",
  "Mathematics",
  "Business",
  "Science",
  "Humanities",
] as const;

export function Textbooks({
  onWish,
  onCart,
}: TextbooksProps) {
  const featuredBook = books[7];

  return (
    <section
      id="textbooks"
      className="bg-card py-[76px] md:py-[120px]"
    >
      <div className="mx-auto w-[min(1320px,calc(100%-36px))] md:w-[min(1320px,calc(100%-72px))]">
        <SectionHeading
          eyebrow="BOOKS FOR CURIOUS MINDS"
          title="Learn Something New"
          copy="Computer science, engineering, mathematics, business and humanities."
          action="Browse Textbooks"
        />

        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[1fr_260px] md:gap-20">
          {/* Subjects */}
          <div className="border-t border-border">
            {SUBJECTS.map((subject, index) => (
              <Link
                key={subject}
                href="/#books"
                className="group grid min-h-[64px] grid-cols-[38px_1fr_auto] items-center border-b border-border font-display text-[23px] text-foreground transition-all hover:px-2 hover:text-accent md:min-h-[72px] md:grid-cols-[60px_1fr_auto] md:text-[27px]"
              >
                <span className="font-sans text-[9px] font-semibold text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span>{subject}</span>

                <ArrowUpRight
                  size={20}
                  aria-hidden="true"
                  className="text-muted-foreground transition-colors group-hover:text-accent"
                />
              </Link>
            ))}
          </div>

          {/* Featured Textbook */}
          {featuredBook && (
            <div className="mx-auto w-2/3 md:w-full">
              <BookCard
                book={featuredBook}
                onWish={onWish}
                onCart={onCart}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}