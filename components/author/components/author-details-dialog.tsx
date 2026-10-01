"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Calendar } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CategoryBanner } from "@/components/categories/components/CategoryBanner";
import type { Author } from "@/features/authors/types/author.types";
import { formatAuthorLifespan, formatDateDisplay } from "@/lib/date-utils";
import {
  cleanBio,
  getAuthorImage,
  DEFAULT_AUTHOR_FALLBACK,
} from "./author-card";

export interface AuthorDetailsDialogProps {
  author: Author | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Clean and elegant author details dialog showing full biography, lifespan, and book catalogue navigation
export function AuthorDetailsDialog({
  author,
  open,
  onOpenChange,
}: AuthorDetailsDialogProps) {
  const [imageError, setImageError] = useState(false);

  if (!author) {
    return null;
  }

  const imageSrc = imageError
    ? DEFAULT_AUTHOR_FALLBACK
    : getAuthorImage(author.photo);

  const cleanBioText = cleanBio(author.bio);

  const lifespan = formatAuthorLifespan(
    author.birthDate,
    author.deathDate,
  );

  const birthDateFormatted = formatDateDisplay(author.birthDate);

  const deathDateFormatted = formatDateDisplay(author.deathDate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl sm:max-w-2xl overflow-hidden rounded-2xl border border-border/80 bg-background p-0 shadow-2xl [&>button:last-child]:text-white [&>button:last-child]:z-30 [&>button:last-child]:bg-black/40 [&>button:last-child]:hover:bg-black/60 [&>button:last-child]:rounded-full [&>button:last-child]:p-1.5 [&>button:last-child]:transition-colors">
        <DialogDescription className="sr-only">
          Detailed biography and literary information for {author.name}
        </DialogDescription>

        {/* Decorative Top Header Banner with CategoryBanner Animated Images */}
        <div className="relative h-28 sm:h-32 w-full">
          <CategoryBanner compact className="!h-28 sm:!h-32 !pt-0 w-full" />
          <div className="absolute -bottom-10 left-6 z-20">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-background bg-surface-soft shadow-lg ring-1 ring-border/40">
              <Image
                src={imageSrc}
                alt={`Portrait of ${author.name}`}
                fill
                sizes="96px"
                unoptimized={typeof imageSrc === "string"}
                onError={() => setImageError(true)}
                className="object-cover object-top grayscale contrast-[1.1] transition-all duration-300 hover:grayscale-0"
              />
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="px-6 pt-12 pb-6">
          <DialogHeader className="space-y-1.5 text-left">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <DialogTitle className="font-display text-2xl sm:text-3xl font-medium tracking-wide text-foreground">
                {author.name}
              </DialogTitle>

              {author.nameBn && (
                <span className="flex items-center gap-1 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  {author.nameBn}
                </span>
              )}
            </div>

            {/* Lifespan & Dates */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {lifespan && (
                <span className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-surface-soft px-2.5 py-0.5 text-xs font-medium text-foreground/80">
                  <Calendar className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span>Lifespan: {lifespan}</span>
                </span>
              )}

              {birthDateFormatted && (
                <span className="text-xs text-muted-foreground">
                  Born: <strong className="text-foreground/90 font-medium">{birthDateFormatted}</strong>
                </span>
              )}

              {deathDateFormatted && (
                <span className="text-xs text-muted-foreground">
                  Died: <strong className="text-foreground/90 font-medium">{deathDateFormatted}</strong>
                </span>
              )}
            </div>
          </DialogHeader>

          <hr className="my-4 border-t border-border/60" />

          {/* Biography */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              About the Author
            </h4>

            <div className="max-h-56 sm:max-h-64 overflow-y-auto pr-2 text-justify text-xs sm:text-sm leading-relaxed text-foreground/80">
              {cleanBioText ? (
                <p className="whitespace-pre-line">{cleanBioText}</p>
              ) : (
                <p className="italic text-muted-foreground">
                  No detailed biography is available for this author at the moment.
                </p>
              )}
            </div>
          </div>

          <hr className="my-5 border-t border-border/60" />

          {/* Actions Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <BookOpen className="h-4 w-4 text-accent" />
              <span>Literary Catalog</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                data-testid="author-modal-close-btn"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="border-border/70 bg-surface-soft/60 hover:bg-surface-soft cursor-pointer"
              >
                Close
              </Button>

              <Button
                asChild
                data-testid="author-modal-explore-btn"
                size="sm"
                className="gap-1.5 bg-accent hover:bg-accent-hover text-white cursor-pointer shadow-xs"
              >
                <Link
                  href={`/books?author=${author._id}`}
                  onClick={() => onOpenChange(false)}
                >
                  <span>Explore Books</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
