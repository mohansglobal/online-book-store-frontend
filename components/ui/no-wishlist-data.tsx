import React from "react";
import Image from "next/image";
import WishlistImg from "@/assets/Wishlist.png";

interface NoWishlistDataProps {
  size?: number;
  title?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function NoWishlistData({
  size = 200,
  title = "Your Wishlist is Empty",
  description = "Save your favorite classics, poetry collections, regional translations, and textbooks so you can revisit or purchase them anytime.",
  className = "",
  children,
}: NoWishlistDataProps) {
  const numericSize = typeof size === "number" ? size : 200;

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="relative mb-6">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 rounded-full bg-accent/10 blur-2xl animate-pulse"
        />
        <Image
          src={WishlistImg}
          alt="Empty Wishlist"
          width={numericSize}
          height={numericSize}
          className="pointer-events-none mx-auto h-auto select-none object-contain drop-shadow-sm"
          priority
        />
      </div>

      <div className="mx-auto max-w-md space-y-2.5">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </div>

      {children && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          {children}
        </div>
      )}
    </div>
  );
}
