import Image from "next/image";
import Link from "next/link";

import cartIllustration from "../../assets/cart.png";

export function CartEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
      <div className="relative mb-8 w-56 sm:w-64">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 rounded-full bg-accent/5 blur-2xl"
        />

        <Image
          src={cartIllustration}
          alt="Illustration of an empty shopping cart"
          className="pointer-events-none mx-auto h-auto w-full select-none object-contain"
        />
      </div>

      <div className="mx-auto mb-8 max-w-md space-y-3">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Your cart is feeling light
        </h2>

        <p className="text-sm leading-relaxed text-text-secondary sm:text-base">
          Looks like you haven&apos;t added any books to your cart yet.
          Discover your next great read today.
        </p>
      </div>

      <Link
        href="/books"
        className="w-full rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 sm:w-auto"
      >
        Start Shopping
      </Link>
    </div>
  );
}
