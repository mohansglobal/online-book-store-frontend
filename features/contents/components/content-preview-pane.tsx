"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Copy,
  Search,
} from "lucide-react";
import type {
  AnnouncementContent,
  ContentSectionId,
  EbooksContent,
  HeroContent,
  NewsletterContent,
  PoetryContent,
} from "../types/content.types";
import { FolioReaderPreview } from "./folio-reader-preview";

interface ContentPreviewPaneProps {
  activeSection: ContentSectionId;
  hero: HeroContent;
  ebooks: EbooksContent;
  poetry: PoetryContent;
  announcement: AnnouncementContent;
  newsletter?: NewsletterContent;
}

export function ContentPreviewPane({
  activeSection,
  hero,
  ebooks,
  poetry,
  announcement,
  newsletter,
}: ContentPreviewPaneProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [heroWordIndex, setHeroWordIndex] = useState(0);

  const rotatingWords =
    hero?.rotatingWords && hero.rotatingWords.length > 0
      ? hero.rotatingWords
      : ["journey.", "curiosity.", "character.", "escapism."];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2800);

    return () => {
      window.clearInterval(timer);
    };
  }, [rotatingWords.length]);

  const handleCopyCode = () => {
    if (!announcement.code) return;

    setCopiedCode(true);

    setTimeout(() => {
      setCopiedCode(false);
    }, 2000);
  };

  const currentRotatingWord =
    rotatingWords[heroWordIndex % rotatingWords.length];

  return (
    <div className="flex flex-col space-y-4 rounded-2xl border border-border bg-surface p-5 shadow-xs sm:p-6 lg:sticky lg:top-24">
      {/* Header without decorative icons */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h2 className="text-base font-bold text-foreground">
          Live Preview
        </h2>

        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 border border-emerald-500/20">
          Real-time
        </span>
      </div>

      <div className="min-h-[380px] overflow-hidden rounded-xl border border-border bg-background p-4 shadow-inner flex flex-col justify-center">
        {/* Hero Section Live Preview with Real Storefront Background Image */}
        {activeSection === "hero" && (
          <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-[#0a0a0a] p-6 text-center text-white shadow-xl min-h-[340px] flex flex-col justify-center">
            {/* Real Storefront Hero Background Image */}
            <div
              className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden"
              aria-hidden="true"
            >
              <Image
                src="https://shelfie-joy.lovable.app/assets/hero-bookshop-DVESlcEW.jpg"
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 100vw, 600px"
                className="scale-105 object-cover object-center brightness-75 contrast-125 blur-[2px]"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/75 via-[#0a0a0a]/50 to-[#0a0a0a]/90" />
            </div>

            {/* Ambient Warm Radial Glow */}
            <div
              className="pointer-events-none absolute top-1/2 left-1/2 z-[1] h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,165,0,0.22),transparent_65%)] blur-[50px]"
              aria-hidden="true"
            />

            <div className="relative z-10 mx-auto max-w-lg space-y-4">
              <h3 className="font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
                <span className="block">{hero.headlinePart1}</span>
                <span className="mt-1 block text-lg font-normal text-zinc-200 sm:text-xl">
                  {hero.headlinePart2}{" "}
                  <span className="relative inline-flex items-center justify-center overflow-hidden px-1 align-baseline">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={currentRotatingWord}
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "-100%", opacity: 0 }}
                        transition={{ duration: 0.45 }}
                        className="font-normal italic text-orange-400 drop-shadow-md"
                      >
                        {currentRotatingWord}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </span>
              </h3>

              <p className="text-xs leading-relaxed text-zinc-300">
                {hero.description}
              </p>

              <div className="pt-2">
                <div className="mx-auto flex max-w-sm items-center rounded-full border border-white/20 bg-white/10 px-3.5 py-2 shadow-inner backdrop-blur-md">
                  <Search size={14} className="mr-2 text-zinc-400 shrink-0" />
                  <span className="truncate text-[11px] text-zinc-400">
                    Search books, authors, or categories...
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <span className="rounded-full bg-white px-3.5 py-1.5 text-[11px] font-semibold text-black">
                  Explore Collection
                </span>
                <span className="text-[11px] font-medium text-zinc-400">
                  Meet Our Authors &rarr;
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Digital Editions (E-Books) Live Preview with Exact Folio Reader Book Style */}
        {activeSection === "ebooks" && (
          <div className="overflow-hidden rounded-xl border border-border bg-gradient-to-br from-surface-elevated to-card p-5 shadow-md space-y-5">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-[10px] font-bold tracking-widest text-accent uppercase">
                {ebooks.badge}
              </span>

              <h3 className="font-display text-2xl font-normal leading-tight text-foreground sm:text-3xl">
                {ebooks.heading}
                <br />
                <em className="italic text-accent">{ebooks.headingAccent}</em>
              </h3>

              <p className="text-xs leading-relaxed text-muted-foreground">
                {ebooks.description}
              </p>

              <div className="pt-1">
                <Link
                  href={ebooks.ctaLink || "#"}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-xs font-bold text-white shadow-xs"
                >
                  <span>{ebooks.ctaText}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Exact Copy of the Storefront Interactive Folio Reader Book Style */}
            <div className="pt-2 border-t border-border/70">
              <FolioReaderPreview books={ebooks.books} />
            </div>
          </div>
        )}

        {/* Poetry & Prose Live Preview */}
        {activeSection === "poetry" && (
          <div className="overflow-hidden rounded-xl border border-border bg-card p-6 shadow-md space-y-4">
            <span className="text-[10px] font-bold tracking-widest text-accent uppercase">
              {poetry.badge}
            </span>

            <blockquote className="m-0 font-display text-xl font-normal leading-snug text-foreground sm:text-2xl">
              {poetry.quote}
            </blockquote>

            <span className="block text-xs font-medium text-muted-foreground">
              {poetry.author}
            </span>

            <div className="pt-2">
              <Link
                href={poetry.ctaLink || "#"}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
              >
                <span>{poetry.ctaText}</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* Announcement Bar Live Preview */}
        {activeSection === "announcement" && (
          <div className="relative overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2 text-[10px] text-zinc-400">
              <span>Announcement Top Bar Preview</span>
              <span className="text-amber-300 font-mono">Storefront Header</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-center text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase text-white backdrop-blur-xs">
                {announcement.badge}
              </span>

              <span className="font-medium text-zinc-200">
                {announcement.text}
              </span>

              {announcement.code && (
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1 rounded border border-white/30 bg-black/40 px-2 py-0.5 text-[10px] font-bold text-amber-200 transition-colors hover:bg-black/60 cursor-pointer"
                >
                  <span>{announcement.code}</span>
                  {copiedCode ? (
                    <Check size={10} className="text-green-300" />
                  ) : (
                    <Copy size={10} />
                  )}
                </button>
              )}

              <Link
                href={announcement.link || "#"}
                className="inline-flex items-center gap-0.5 text-[11px] font-bold text-white underline underline-offset-2 hover:text-amber-200"
              >
                <span>{announcement.cta}</span>
                <ChevronRight size={11} />
              </Link>
            </div>
          </div>
        )}

        {/* Newsletter Section Live Preview */}
        {activeSection === "newsletter" && newsletter && (
          <div className="overflow-hidden rounded-xl border border-border bg-card p-6 shadow-md space-y-4">
            <span className="text-[10px] font-bold tracking-widest text-accent uppercase">
              NEWSLETTER SECTION
            </span>

            <h3 className="m-0 font-display text-2xl font-normal leading-[1] text-foreground sm:text-3xl">
              {newsletter.heading}
              {newsletter.headingAccent && (
                <>
                  <br />
                  <em className="italic text-accent">{newsletter.headingAccent}</em>
                </>
              )}
            </h3>

            <p className="text-xs leading-relaxed text-muted-foreground">
              {newsletter.description}
            </p>

            <div className="flex flex-col gap-2 pt-2 sm:flex-row">
              <div className="h-9 min-w-0 flex-1 rounded-sm border border-border bg-secondary px-3 text-xs text-muted-foreground flex items-center">
                Your email address
              </div>

              <div className="inline-flex h-9 items-center justify-center gap-1.5 rounded-sm bg-primary px-3 text-xs font-semibold text-primary-foreground">
                <span>Join the Reading List</span>
                <ArrowRight size={13} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-background p-3 text-center text-xs text-muted-foreground">
        Changes made in the form are immediately reflected in the live preview and will update the live site when saved.
      </div>
    </div>
  );
}
