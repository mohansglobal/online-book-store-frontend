"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { CategoryBanner } from "../categories/components/CategoryBanner";
import { useBook } from "@/features/books/hooks/use-books";
import { useRequireAuth } from "@/features/auth";
import { FALLBACK_BOOK_COVER } from "@/features/books/types/book.types";
import { getBookStockInfo } from "@/features/books/utils/stock.utils";
import { useCart } from "@/features/cart";
import { useWishlist } from "@/features/wishlist";
import { BookDetailsGallery } from "./details/book-details-gallery";
import { BookDetailsHeaderInfo } from "./details/book-details-header-info";
import { BookDetailsTabs } from "./details/book-details-tabs";
import { BookDetailsRelated } from "./details/book-details-related";
import { BookDetailsPreviewModal } from "./details/book-details-preview-modal";
import { BookDetailsMobileBar } from "./details/book-details-mobile-bar";
import { BookDetailsSkeleton } from "./details/book-details-skeleton";
import { resolveCoverUrl } from "@/lib/image-url";

export interface BookDetailsClientProps {
  bookId: string;
}

export function BookDetailsClient({ bookId }: BookDetailsClientProps) {
  const router = useRouter();
  const { data: bookResponse, isLoading, isError, refetch } = useBook(bookId);
  const book = bookResponse?.data;
  const { isAuthenticated, redirectToLogin } = useRequireAuth();
  const { addItem: addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [previewOpen, setPreviewOpen] = useState(false);

  const isWishlisted = book ? isInWishlist(book._id || book.slug) : false;
  const stockInfo = getBookStockInfo(book);

  if (isLoading) {
    return <BookDetailsSkeleton />;
  }

  if (isError || !book) {
    return (
      <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
        <CategoryBanner categoryName="Book Details" compact />
        <main className="relative z-20 -mt-10 flex-1 px-4 pb-16 sm:px-6">
          <div className="mx-auto max-w-xl text-center py-16 px-6 bg-surface border border-border rounded-2xl shadow-sm">
            <AlertCircle className="mx-auto text-destructive mb-3" size={36} />
            <h2 className="text-xl font-display font-bold text-foreground mb-2">
              Book Not Found
            </h2>
            <p className="text-xs text-muted-foreground mb-6">
              We couldn&apos;t load the requested book. It may have been moved or is currently unavailable.
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => refetch()}
                className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:border-foreground transition-colors cursor-pointer"
              >
                <RotateCcw size={13} />
                Try Again
              </button>
              <Link
                href="/books"
                className="rounded-full bg-accent px-5 py-2 text-xs font-semibold text-white hover:bg-accent-hover transition-colors"
              >
                Browse All Books
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Resolve Images: cover image is first, followed by all listing and gallery images
  const mainCover = resolveCoverUrl(book.coverImage);
  const rawListImages = [
    ...(Array.isArray(book.listingImages) ? book.listingImages : []),
    ...(Array.isArray(book.effectiveImages) ? book.effectiveImages : []),
    ...(Array.isArray(book.images) ? book.images : []),
  ];

  const additionalImages = rawListImages
    .map((img) => resolveCoverUrl(img))
    .filter((img): img is string => Boolean(img) && img !== mainCover);

  const allImages: string[] = Array.from(
    new Set([
      ...(mainCover ? [mainCover] : []),
      ...additionalImages,
    ]),
  );

  if (allImages.length === 0) {
    allImages.push(FALLBACK_BOOK_COVER);
  }

  const rawPrice =
    book.price !== undefined && book.price !== null && book.price !== ""
      ? typeof book.price === "number"
        ? book.price
        : parseFloat(String(book.price).replace(/[^0-9.]/g, ""))
      : undefined;

  const priceText =
    rawPrice !== undefined && !isNaN(rawPrice)
      ? rawPrice === 0
        ? "Free"
        : `₹${rawPrice}`
      : "-";

  const handleAddToCart = () => {
    if (!book) return;

    if (!stockInfo.canPurchase) {
      toast.error("This book is currently out of stock.");
      return;
    }

    addToCart({
      listingId: book._id,
      bookListingId: book._id,
      bookId: book._id,
      slug: book.slug || book._id,
      title: book.title || "-",
      coverImage: mainCover,
      author:
        book.authors && book.authors.length > 0
          ? book.authors.map((a) => a.name).join(", ")
          : "-",
      seller: book.seller?.name,
      format: book.format || "Paperback",
      price: rawPrice ?? 0,
      originalPrice:
        typeof book.originalPrice === "number"
          ? book.originalPrice
          : parseFloat(String(book.originalPrice || 0).replace(/[^0-9.]/g, "")) || (rawPrice ?? 0),
      quantity,
    });
  };

  const handleBuyNow = () => {
    if (!book) return;

    if (!stockInfo.canPurchase) {
      toast.error("This book is currently out of stock.");
      return;
    }

    const bookListingId = book.listingId || book._id;
    if (!bookListingId) {
      toast.error("Unable to purchase this book at this moment.");
      return;
    }

    const checkoutUrl =
      `/checkout?mode=buy-now` +
      `&listingId=${encodeURIComponent(bookListingId)}` +
      `&quantity=${quantity}`;

    if (!isAuthenticated) {
      redirectToLogin(checkoutUrl);
      return;
    }

    router.push(checkoutUrl);
  };

  const handleToggleWishlist = () => {
    if (!book) return;
    const coverSrc = resolveCoverUrl(book.coverImage);
    const itemPrice =
      typeof book.price === "number"
        ? book.price
        : parseFloat(String(book.price || 0).replace(/[^0-9.]/g, "")) || 0;
    const origPrice = book.originalPrice
      ? typeof book.originalPrice === "number"
        ? book.originalPrice
        : parseFloat(String(book.originalPrice).replace(/[^0-9.]/g, "")) || undefined
      : undefined;

    toggleWishlist({
      id: book._id,
      bookId: book._id,
      listingId: book._id,
      slug: book.slug || book._id,
      title: book.title,
      author: book.authors?.map((a) => a.name).join(", ") || "-",
      seller: book.seller?.name,
      coverImage: coverSrc,
      format: book.format || "Paperback",
      price: itemPrice,
      originalPrice: origPrice,
      inStock: stockInfo.inStock,
      rating: book.rating,
      category: book.categories?.[0]?.name,
      quantity,
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      {/* Hero Category Banner */}
      <CategoryBanner categoryName="" compact />

      <main
        data-book-id={book._id}
        data-book-slug={book.slug}
        className="relative z-20 -mt-10 flex-1 px-4 pb-16 sm:px-6"
      >
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Main Book Card Container */}
          <section className="rounded-lg border border-border bg-surface p-5 shadow-sm sm:p-8">
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[340px_1fr] lg:gap-12">
              {/* Left Column: Gallery & Look Inside */}
              <BookDetailsGallery
                title={book.title || "-"}
                images={allImages}
                formatLabel={book.format || "-"}
                onOpenPreview={() => setPreviewOpen(true)}
              />

              {/* Right Column: Info, Pricing, Trust, Actions & Quick Specs */}
              <BookDetailsHeaderInfo
                book={book}
                quantity={quantity}
                onQuantityChange={setQuantity}
                isWishlisted={isWishlisted}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            </div>
          </section>

          {/* Detailed Tabs: Summary, Author, Specifications, Reviews */}
          <BookDetailsTabs book={book} />

          {/* Related Reads */}
          <BookDetailsRelated
            categoryId={book.categories?.[0]?._id || book.categories?.[0]?.slug}
            currentBookId={book._id}
            currentIsbn={book.isbn}
          />
        </div>
      </main>

      {/* Look Inside Modal */}
      <BookDetailsPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={book.title || "-"}
        canPurchase={stockInfo.canPurchase}
        onAddToCart={handleAddToCart}
      />

      {/* Mobile Bottom Sticky Bar */}
      <BookDetailsMobileBar
        priceText={priceText}
        formatLabel={book.format || "-"}
        isWishlisted={isWishlisted}
        canPurchase={stockInfo.canPurchase}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
    </div>
  );
}

export default BookDetailsClient;