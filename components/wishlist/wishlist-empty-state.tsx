"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen, Compass } from "lucide-react";
import wishlistIllustration from "@/assets/Wishlist.png";

export function WishlistEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-border/80 bg-surface px-6 py-16 text-center sm:py-20 shadow-xs">
      {/* Decorative Wishlist Illustration */}
      <div className="relative mb-6 w-48 sm:w-56">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 rounded-full"
        />
        <Image
          src={wishlistIllustration}
          alt="Illustration of empty wishlist"
          width={220}
          height={220}
          className="pointer-events-none mx-auto h-auto w-full select-none object-contain drop-shadow-sm"
          priority
        />
      </div>

      <div className="mx-auto max-w-md space-y-2.5">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Your Wishlist is Empty
        </h2>

        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          Textbooks so you can revisit or purchase them anytime.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
        <Link
          href="/books"
          className="flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-xs font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <BookOpen size={16} />
          <span>Explore All Books</span>
        </Link>

        <Link
          href="/categories"
          className="flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-xs font-semibold text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-soft hover:border-border-hover"
        >
          <Compass size={16} />
          <span>Browse Categories</span>
        </Link>
      </div>
    </div>
  );
}
