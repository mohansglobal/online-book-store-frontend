"use client";

import {
  useEffect,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  ArrowRight,
  Banknote,
  BookOpen,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Heart,
  RotateCcw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  X,
  Zap,
} from "lucide-react";

import { toast } from "sonner";

import { CategoryBanner } from "../categories/components/CategoryBanner";
import { BookCard } from "@/components/home/components/book-card";
import { Footer } from "@/components/home/components/footer";
import { Navbar } from "@/components/home/components/navbar";
import { books } from "@/components/home/data";

import coverImg from "../../assets/mastisker-malikana.jpg";
import bookImg2 from "../../assets/picturethree.jpeg";
import bookImg3 from "../../assets/pictureseven.jpeg";

interface Specification {
  label: string;
  value: string;
  highlight?: boolean;
}

interface BookDetailsClientProps {
  bookId: string;
}

type FormatType =
  | "hardcover"
  | "paperback"
  | "ebook";

type TabType =
  | "SUMMARY"
  | "AUTHOR"
  | "SPECIFICATIONS"
  | "REVIEWS";

interface FormatPricing {
  price: number;
  original: number;
  discount: string;
  label: string;
}

const BOOK_IMAGES = [
  coverImg,
  bookImg2,
  bookImg3,
] as const;

const FORMAT_PRICING: Record<
  FormatType,
  FormatPricing
> = {
  hardcover: {
    price: 100,
    original: 140,
    discount: "28% OFF",
    label: "Hardcover",
  },
  paperback: {
    price: 80,
    original: 110,
    discount: "27% OFF",
    label: "Paperback",
  },
  ebook: {
    price: 50,
    original: 75,
    discount: "33% OFF",
    label: "E-Book (PDF/ePub)",
  },
};

const PRIMARY_SPECIFICATIONS: readonly Specification[] =
  [
    {
      label: "Title",
      value: "Mastering The Mind",
    },
    {
      label: "Author",
      value: "Humayun Ahmed",
    },
    {
      label: "Publisher",
      value: "Patra Bharati",
    },
    {
      label: "Edition",
      value: "1st Published, 2016",
    },
    {
      label: "Binding",
      value: "Hardcover (Gold Foil)",
    },
    {
      label: "Pages",
      value: "200 Pages",
    },
    {
      label: "Language",
      value: "English",
    },
    {
      label: "Paper Quality",
      value: "80 GSM Swedish Cream",
    },
    {
      label: "ISBN Code",
      value: "978-984-99878",
    },
    {
      label: "Genre",
      value: "Mind Science & Career",
    },
    {
      label: "Country",
      value: "India & Bangladesh",
    },
    {
      label: "Item Weight",
      value: "320 Grams",
    },
    {
      label: "Seller",
      value: "A2ZC141 (Official)",
    },
  ];

const FULL_SPECIFICATIONS: readonly Specification[] =
  [
    {
      label: "Book Name",
      value: "Mastering The Mind",
    },
    {
      label: "Author",
      value: "Humayun Ahmed",
    },
    {
      label: "Publisher",
      value:
        "Patra Bharati / Joykoli Publications",
    },
    {
      label: "Edition",
      value:
        "1st Edition, 2016 (Reprint 2024)",
    },
    {
      label: "Pages",
      value: "200",
    },
    {
      label: "Language",
      value: "English",
    },
    {
      label: "Binding",
      value:
        "Premium Hardcover (Gold Foil)",
    },
    {
      label: "Paper Type",
      value:
        "80 GSM Swedish Craft Cream Paper",
    },
    {
      label: "ISBN",
      value: "978-984-99878-9-9",
    },
    {
      label: "Country",
      value: "Bangladesh & India",
    },
    {
      label: "Category",
      value:
        "Mind Science, Career & Motivation",
    },
    {
      label: "Weight",
      value: "320g",
    },
  ];

const TAB_OPTIONS: readonly {
  key: TabType;
  label: string;
}[] = [
  {
    key: "SUMMARY",
    label: "SUMMARY",
  },
  {
    key: "AUTHOR",
    label: "AUTHOR",
  },
  {
    key: "SPECIFICATIONS",
    label: "SPECIFICATIONS",
  },
  {
    key: "REVIEWS",
    label: "REVIEWS",
  },
];

const SUMMARY_POINTS = [
  "Converting subconscious energy into positive habits",
  "Practical ways to overcome exam anxiety",
  "Psychological frameworks for retaining memory",
  "Techniques for daily goal setting",
] as const;

const REVIEW_DISTRIBUTION = [
  { stars: 5, percentage: "92%" },
  { stars: 4, percentage: "6%" },
  { stars: 3, percentage: "2%" },
  { stars: 2, percentage: "0%" },
  { stars: 1, percentage: "0%" },
] as const;

const REVIEWS = [
  {
    id: "review-1",
    name: "Rakibul Hasan",
    date: "3 days ago",
    text:
      "The paper quality and hardcover binding are truly excellent. Very helpful for mental stress during exams.",
  },
  {
    id: "review-2",
    name: "Sumaiya Binte",
    date: "2 weeks ago",
    text:
      "The author's language is extraordinary. Psychological concepts explained so simply.",
  },
] as const;

export function BookDetailsClient({
  bookId,
}: BookDetailsClientProps) {
  const [activeTab, setActiveTab] =
    useState<TabType>("SUMMARY");

  const [quantity, setQuantity] =
    useState(1);

  const [
    selectedFormat,
    setSelectedFormat,
  ] =
    useState<FormatType>("hardcover");

  const [
    isWishlisted,
    setIsWishlisted,
  ] = useState(false);

  const [wishCount, setWishCount] =
    useState(0);

  const [cartCount, setCartCount] =
    useState(0);

  const [
    previewOpen,
    setPreviewOpen,
  ] = useState(false);

  const [
    copiedLink,
    setCopiedLink,
  ] = useState(false);

  const [
    selectedThumbnail,
    setSelectedThumbnail,
  ] = useState(0);

  const [
    slideDirection,
    setSlideDirection,
  ] = useState<1 | -1>(1);

  const shouldReduceMotion =
    useReducedMotion();

  const activePricing =
    FORMAT_PRICING[selectedFormat];

  const relatedBooks = books.slice(
    0,
    6,
  );

  useEffect(() => {
    if (!previewOpen) {
      return;
    }

    const originalOverflow =
      document.body.style.overflow;

    const handleKeyDown = (
      event: KeyboardEvent,
    ): void => {
      if (event.key === "Escape") {
        setPreviewOpen(false);
      }
    };

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        originalOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [previewOpen]);

  const handleThumbnailChange = (
    index: number,
  ): void => {
    if (
      index === selectedThumbnail
    ) {
      return;
    }

    setSlideDirection(
      index > selectedThumbnail
        ? 1
        : -1,
    );

    setSelectedThumbnail(index);
  };

  const handlePreviousImage =
    (): void => {
      const nextIndex =
        (selectedThumbnail -
          1 +
          BOOK_IMAGES.length) %
        BOOK_IMAGES.length;

      handleThumbnailChange(
        nextIndex,
      );
    };

  const handleNextImage = (): void => {
    const nextIndex =
      (selectedThumbnail + 1) %
      BOOK_IMAGES.length;

    handleThumbnailChange(
      nextIndex,
    );
  };

  const handleAddToCart =
    (): void => {
      setCartCount(
        (currentCount) =>
          currentCount + quantity,
      );

      toast.success(
        `"${PRIMARY_SPECIFICATIONS[0].value}" added to cart!`,
        {
          description: `Qty: ${quantity} • Format: ${activePricing.label}`,
        },
      );
    };

  const handleBuyNow = (): void => {
    setCartCount(
      (currentCount) =>
        currentCount + quantity,
    );

    toast.success(
      `Proceeding to checkout with "${PRIMARY_SPECIFICATIONS[0].value}"!`,
      {
        description: `Qty: ${quantity} • Total: ₹${
          activePricing.price *
          quantity
        }`,
      },
    );
  };

  const handleToggleWishlist =
    (): void => {
      const nextState =
        !isWishlisted;

      setIsWishlisted(nextState);

      setWishCount(
        (currentCount) =>
          nextState
            ? currentCount + 1
            : Math.max(
                0,
                currentCount - 1,
              ),
      );

      toast[
        nextState
          ? "success"
          : "info"
      ](
        nextState
          ? "Added to wishlist!"
          : "Removed from wishlist",
      );
    };

  const handleCopyLink =
    async (): Promise<void> => {
      try {
        await navigator.clipboard.writeText(
          window.location.href,
        );

        setCopiedLink(true);

        toast.success(
          "Link copied!",
        );

        window.setTimeout(() => {
          setCopiedLink(false);
        }, 2500);
      } catch {
        toast.error(
          "Unable to copy link",
        );
      }
    };

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
     

      <CategoryBanner
        categoryName=""
        compact
      />

      <main
        data-book-id={bookId}
        className="relative z-20 -mt-10 flex-1 px-4 pb-16 sm:px-6"
      >
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Book Details */}
          <section className="rounded-lg border border-border bg-surface p-5 shadow-sm sm:p-8">
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[340px_1fr] lg:gap-12">
              {/* Cover */}
              <div className="flex flex-col items-center">
                <div className="group relative w-full max-w-[280px]">
                  <div className="pointer-events-none absolute -inset-3 rounded-2xl bg-accent/10 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />

                  <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg border border-black/10 bg-black/5 shadow-book">
                    <AnimatePresence
                      initial={false}
                      custom={
                        slideDirection
                      }
                    >
                      <motion.div
                        key={
                          selectedThumbnail
                        }
                        custom={
                          slideDirection
                        }
                        className="absolute inset-0"
                        initial={
                          shouldReduceMotion
                            ? {
                                opacity: 0,
                              }
                            : {
                                clipPath:
                                  slideDirection >=
                                  0
                                    ? "inset(0 100% 0 0)"
                                    : "inset(0 0 0 100%)",
                              }
                        }
                        animate={
                          shouldReduceMotion
                            ? {
                                opacity: 1,
                              }
                            : {
                                clipPath:
                                  "inset(0 0% 0 0)",
                              }
                        }
                        exit={
                          shouldReduceMotion
                            ? {
                                opacity: 0,
                              }
                            : {
                                clipPath:
                                  slideDirection >=
                                  0
                                    ? "inset(0 0 0 100%)"
                                    : "inset(0 100% 0 0)",
                              }
                        }
                        transition={{
                          duration:
                            shouldReduceMotion
                              ? 0.25
                              : 0.75,
                          ease: [
                            0.76,
                            0,
                            0.24,
                            1,
                          ],
                        }}
                      >
                        <Image
                          src={
                            BOOK_IMAGES[
                              selectedThumbnail
                            ] ??
                            coverImg
                          }
                          alt="Mastering The Mind cover"
                          fill
                          priority={
                            selectedThumbnail ===
                            0
                          }
                          sizes="280px"
                          className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                        />

                        <div className="pointer-events-none absolute inset-0 bg-black/[0.04]" />
                      </motion.div>
                    </AnimatePresence>

                    {/* Spine */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-3 bg-gradient-to-r from-black/20 via-white/10 to-transparent" />

                    {BOOK_IMAGES.length >
                      1 && (
                      <>
                        <button
                          type="button"
                          onClick={
                            handlePreviousImage
                          }
                          aria-label="Previous book cover"
                          className="absolute top-1/2 left-2 z-20 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white opacity-0 shadow-md backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 hover:scale-110 hover:bg-black/70 active:scale-95"
                        >
                          <ChevronLeft
                            size={
                              16
                            }
                          />
                        </button>

                        <button
                          type="button"
                          onClick={
                            handleNextImage
                          }
                          aria-label="Next book cover"
                          className="absolute top-1/2 right-2 z-20 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white opacity-0 shadow-md backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 hover:scale-110 hover:bg-black/70 active:scale-95"
                        >
                          <ChevronRight
                            size={
                              16
                            }
                          />
                        </button>
                      </>
                    )}

                    <div className="pointer-events-none absolute bottom-2 left-2 z-10 flex gap-1.5">
                      <span className="rounded-sm bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white uppercase backdrop-blur-md">
                        {
                          activePricing.label
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  {BOOK_IMAGES.map(
                    (
                      image,
                      index,
                    ) => (
                      <button
                        key={
                          image.src
                        }
                        type="button"
                        onClick={() =>
                          handleThumbnailChange(
                            index,
                          )
                        }
                        aria-label={`View cover ${
                          index + 1
                        }`}
                        aria-pressed={
                          selectedThumbnail ===
                          index
                        }
                        className={`relative h-16 w-12 cursor-pointer overflow-hidden rounded-sm border transition-all duration-200 ${
                          selectedThumbnail ===
                          index
                            ? "scale-105 border-accent shadow-sm ring-2 ring-accent/30"
                            : "border-border opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={image}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </button>
                    ),
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setPreviewOpen(
                      true,
                    )
                  }
                  className="mt-4 flex h-9 w-full max-w-[280px] cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-background text-xs font-medium transition-colors hover:border-primary"
                >
                  <BookOpen
                    size={14}
                    className="text-accent"
                  />

                  Look Inside
                </button>
              </div>

              {/* Details */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <h1 className="mb-2 font-display text-2xl leading-tight text-foreground sm:text-3xl lg:text-4xl">
                    Mastering The Mind
                  </h1>

                  <button
                    type="button"
                    onClick={() =>
                      void handleCopyLink()
                    }
                    className="mx-2 flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs text-muted-foreground transition-all hover:bg-surface hover:text-foreground active:scale-95 sm:mx-4"
                    title="Share this book"
                  >
                    {copiedLink ? (
                      <CheckCheck
                        size={14}
                        className="text-emerald-500"
                      />
                    ) : (
                      <Share2
                        size={14}
                      />
                    )}

                    {copiedLink
                      ? "Copied"
                      : "Share"}
                  </button>
                </div>

                {/* Author */}
                <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <Link
                    href="/authors"
                    className="cursor-pointer font-medium text-foreground underline-offset-4 transition-colors hover:text-accent hover:underline"
                  >
                    Humayun Ahmed
                  </Link>

                  <span className="h-1 w-1 rounded-full bg-border" />

                  <Link
                    href="/publishers"
                    className="cursor-pointer underline-offset-4 transition-colors hover:text-accent hover:underline"
                  >
                    Patra Bharati
                  </Link>

                  <span className="h-1 w-1 rounded-full bg-border" />

                  <div className="flex items-center gap-1 text-amber-500">
                    <Star
                      size={14}
                      className="fill-current"
                    />

                    <span className="font-medium text-foreground">
                      4.9
                    </span>

                    <span className="text-xs">
                      (186)
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6 rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-5">
                  <div className="flex flex-col justify-between gap-3 border-b border-border/60 pb-3.5 sm:flex-row sm:items-center">
                    <div className="flex items-baseline gap-3">
                      <span className="font-display text-3xl leading-none font-bold text-primary sm:text-4xl">
                        ₹
                        {
                          activePricing.price
                        }
                      </span>

                      <span className="text-sm text-muted-foreground line-through sm:text-base">
                        ₹
                        {
                          activePricing.original
                        }
                      </span>

                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        Save ₹
                        {activePricing.original -
                          activePricing.price}{" "}
                        (
                        {
                          activePricing.discount
                        }
                        )
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

                        In Stock
                      </span>

                      <span className="font-medium text-muted-foreground">
                        •{" "}
                        {
                          activePricing.label
                        }
                      </span>
                    </div>
                  </div>

                  {/* Trust */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 text-[11px] text-muted-foreground sm:text-xs">
                    <div className="flex items-center gap-1.5">
                      <Truck
                        size={14}
                        className="shrink-0 text-accent"
                      />
                      Free Express Delivery
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Banknote
                        size={14}
                        className="shrink-0 text-accent"
                      />
                      COD Available
                    </div>

                    <div className="flex items-center gap-1.5">
                      <ShieldCheck
                        size={14}
                        className="shrink-0 text-accent"
                      />
                      100% Genuine
                    </div>

                    <div className="flex items-center gap-1.5">
                      <RotateCcw
                        size={14}
                        className="shrink-0 text-accent"
                      />
                      7 Days Replacement
                    </div>
                  </div>
                </div>

                {/* Purchase Actions */}
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <div className="flex h-11 w-28 shrink-0 items-center justify-between rounded-full border border-border bg-surface px-1">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(
                          (
                            current,
                          ) =>
                            Math.max(
                              1,
                              current -
                                1,
                            ),
                        )
                      }
                      aria-label="Decrease quantity"
                      className="flex h-full w-8 cursor-pointer items-center justify-center text-lg text-muted-foreground hover:text-foreground"
                    >
                      −
                    </button>

                    <span className="text-sm font-semibold">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(
                          (
                            current,
                          ) =>
                            current +
                            1,
                        )
                      }
                      aria-label="Increase quantity"
                      className="flex h-full w-8 cursor-pointer items-center justify-center text-lg text-muted-foreground hover:text-foreground"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={
                      handleAddToCart
                    }
                    className="flex h-11 min-w-[130px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-primary text-xs font-semibold text-primary shadow-sm transition-all hover:bg-primary/5 sm:text-sm"
                  >
                    <ShoppingBag
                      size={16}
                    />
                    ADD TO CART
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleBuyNow
                    }
                    className="flex h-11 min-w-[130px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary-hover hover:shadow sm:text-sm"
                  >
                    <Zap
                      size={16}
                      className="fill-current"
                    />
                    BUY NOW
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleToggleWishlist
                    }
                    aria-label={
                      isWishlisted
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                    title="Wishlist"
                    className={`flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors ${
                      isWishlisted
                        ? "border-accent bg-accent text-white"
                        : "border-border text-foreground hover:bg-background"
                    }`}
                  >
                    <Heart
                      size={18}
                      className={
                        isWishlisted
                          ? "fill-white"
                          : ""
                      }
                    />
                  </button>
                </div>

                {/* Quick Details */}
                <div className="border-t border-border pt-5">
                  <h2 className="mb-3 text-sm font-semibold text-foreground">
                    Quick Details
                  </h2>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
                    {PRIMARY_SPECIFICATIONS.slice(
                      1,
                    ).map(
                      (spec) => (
                        <div
                          key={
                            spec.label
                          }
                          className="flex items-center justify-between border-b border-border/40 pb-1.5"
                        >
                          <span className="text-muted-foreground">
                            {
                              spec.label
                            }
                          </span>

                          <span className="text-right font-medium text-foreground">
                            {
                              spec.value
                            }
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tabs */}
          <section className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
            <div className="no-scrollbar flex overflow-x-auto border-b border-border bg-background">
              {TAB_OPTIONS.map(
                (tab) => {
                  const isActive =
                    activeTab ===
                    tab.key;

                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() =>
                        setActiveTab(
                          tab.key,
                        )
                      }
                      aria-selected={
                        isActive
                      }
                      className={`relative flex-1 cursor-pointer whitespace-nowrap px-5 py-3.5 text-xs font-semibold tracking-wide transition-all sm:flex-none ${
                        isActive
                          ? "bg-surface text-accent"
                          : "text-muted-foreground hover:bg-surface/50 hover:text-foreground"
                      }`}
                    >
                      {
                        tab.label
                      }

                      {isActive && (
                        <motion.div
                          layoutId="activeTabIndicator"
                          className="absolute inset-x-0 bottom-0 h-0.5 bg-accent"
                        />
                      )}
                    </button>
                  );
                },
              )}
            </div>

            <div className="min-h-[280px] p-5 sm:p-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{
                    opacity: 0,
                    y: shouldReduceMotion
                      ? 0
                      : 5,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: shouldReduceMotion
                      ? 0
                      : -5,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  {activeTab ===
                    "SUMMARY" && (
                    <div className="max-w-3xl space-y-5 text-sm leading-relaxed text-muted-foreground">
                      <p>
                        <strong className="text-foreground">
                          ‘Mastering The
                          Mind’
                        </strong>{" "}
                        is a unique
                        guideline for
                        human thought,
                        self-development,
                        and boosting
                        mental
                        performance. It
                        scientifically
                        breaks down how
                        everyday stimuli
                        and thoughts can
                        be converted into
                        positive,
                        productive
                        habits using
                        simple,
                        accessible
                        language.
                      </p>

                      <blockquote className="rounded-r border-l-2 border-accent bg-background p-4 text-foreground italic">
                        &quot;If you do
                        not consciously
                        learn to control
                        your mind, your
                        surroundings
                        will dictate the
                        trajectory of
                        your
                        life.&quot;

                        <footer className="mt-2 text-xs font-semibold text-accent not-italic">
                          — Page 42
                        </footer>
                      </blockquote>

                      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                        {SUMMARY_POINTS.map(
                          (
                            item,
                          ) => (
                            <li
                              key={
                                item
                              }
                              className="flex items-start gap-2"
                            >
                              <Check
                                size={
                                  16
                                }
                                className="shrink-0 text-accent"
                              />

                              {item}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                  {activeTab ===
                    "AUTHOR" && (
                    <div className="flex items-start gap-5">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-border">
                        <Image
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM1qBsjaMPs9D00G12QGLwHclccepERlku-OHdBPWkBviHmB7UikEIzMg&s=10"
                          alt="Humayun Ahmed"
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <h3 className="font-display text-xl text-foreground">
                            Humayun Ahmed
                          </h3>

                          <span className="rounded-sm bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 uppercase">
                            Bestselling
                          </span>
                        </div>

                        <p className="mb-2 max-w-xl text-sm text-muted-foreground">
                          One of the
                          leading figures
                          in modern
                          literature,
                          playwright, and
                          filmmaker. His
                          fluid narrative
                          style and
                          character
                          creation skills
                          have won
                          readers&apos;
                          hearts for
                          decades.
                        </p>

                        <Link
                          href="/authors"
                          className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-accent transition-transform hover:translate-x-0.5 hover:underline"
                        >
                          View all 200+
                          books →
                        </Link>
                      </div>
                    </div>
                  )}

                  {activeTab ===
                    "SPECIFICATIONS" && (
                    <div className="grid max-w-2xl grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                      {FULL_SPECIFICATIONS.map(
                        (spec) => (
                          <div
                            key={
                              spec.label
                            }
                            className="flex justify-between border-b border-border/60 pb-2 text-sm"
                          >
                            <span className="text-muted-foreground">
                              {
                                spec.label
                              }
                            </span>

                            <span className="text-right font-medium text-foreground">
                              {
                                spec.value
                              }
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                  {activeTab ===
                    "REVIEWS" && (
                    <div className="max-w-3xl space-y-6">
                      <div className="flex flex-col items-center gap-6 rounded-lg border border-border bg-background p-4 sm:flex-row sm:items-start">
                        <div className="text-center sm:border-r sm:border-border sm:pr-6 sm:text-left">
                          <div className="font-display text-4xl font-bold text-foreground">
                            4.9
                          </div>

                          <div className="my-1 flex justify-center text-amber-500 sm:justify-start">
                            {Array.from(
                              {
                                length:
                                  5,
                              },
                              (
                                _,
                                index,
                              ) => (
                                <Star
                                  key={
                                    index
                                  }
                                  size={
                                    14
                                  }
                                  className="fill-amber-500"
                                />
                              ),
                            )}
                          </div>

                          <div className="text-[10px] tracking-wide text-muted-foreground uppercase">
                            186 Reviews
                          </div>
                        </div>

                        <div className="w-full flex-1 space-y-1">
                          {REVIEW_DISTRIBUTION.map(
                            (
                              review,
                            ) => (
                              <div
                                key={
                                  review.stars
                                }
                                className="flex items-center gap-2 text-xs text-muted-foreground"
                              >
                                <span className="w-4">
                                  {
                                    review.stars
                                  }
                                  ★
                                </span>

                                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                                  <div
                                    className="h-full bg-amber-500"
                                    style={{
                                      width:
                                        review.percentage,
                                    }}
                                  />
                                </div>

                                <span className="w-8 text-right">
                                  {
                                    review.percentage
                                  }
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {REVIEWS.map(
                          (review) => (
                            <div
                              key={
                                review.id
                              }
                              className="border-b border-border pb-4"
                            >
                              <div className="mb-1 flex items-start justify-between">
                                <div>
                                  <span className="text-sm font-medium text-foreground">
                                    {
                                      review.name
                                    }
                                  </span>

                                  <span className="ml-2 text-[10px] text-muted-foreground">
                                    •{" "}
                                    {
                                      review.date
                                    }
                                  </span>
                                </div>

                                <div className="flex gap-0.5 text-amber-500">
                                  {Array.from(
                                    {
                                      length:
                                        5,
                                    },
                                    (
                                      _,
                                      index,
                                    ) => (
                                      <Star
                                        key={
                                          index
                                        }
                                        size={
                                          12
                                        }
                                        className="fill-amber-500"
                                      />
                                    ),
                                  )}
                                </div>
                              </div>

                              <p className="text-xs leading-relaxed text-muted-foreground">
                                {
                                  review.text
                                }
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>

          {/* Related Books */}
          <section className="pt-8 pb-4">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <span className="mb-0.5 block text-[10px] font-bold tracking-wider text-accent uppercase">
                  Handpicked
                  Recommendations
                </span>

                <h2 className="font-display text-xl text-foreground sm:text-2xl">
                  Related Reads
                </h2>
              </div>

              <Link
                href="/category/prep"
                className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-accent transition-transform hover:translate-x-0.5 hover:underline"
              >
                View All

                <ArrowRight
                  size={14}
                />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
              {relatedBooks.map(
                (book) => (
                  <BookCard
                    key={book.title}
                    book={book}
                    size="sm"
                    compact
                    onWish={() =>
                      toast.success(
                        `"${book.title}" wishlisted`,
                      )
                    }
                    onCart={() =>
                      toast.success(
                        `"${book.title}" added to bag`,
                      )
                    }
                  />
                ),
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Look Inside Modal */}
      <AnimatePresence>
        {previewOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sample-preview-title"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overscroll-contain"
            onClick={() =>
              setPreviewOpen(false)
            }
          >
            <motion.div
              initial={{
                scale: 0.98,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.98,
                opacity: 0,
              }}
              onClick={(event) =>
                event.stopPropagation()
              }
              className="relative w-full max-w-xl rounded-2xl border border-border bg-surface p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                <h3
                  id="sample-preview-title"
                  className="flex items-center gap-2 font-display text-lg font-bold text-foreground"
                >
                  <BookOpen
                    size={16}
                    className="text-accent"
                  />

                  Sample Preview
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    setPreviewOpen(
                      false,
                    )
                  }
                  aria-label="Close preview"
                  title="Close preview"
                  className="cursor-pointer rounded-full p-1 text-muted-foreground transition-all hover:bg-background hover:text-foreground active:scale-95"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-2 font-serif text-sm leading-relaxed text-muted-foreground overscroll-contain">
                <h4 className="mb-2 text-center font-display text-xl text-foreground">
                  Chapter One: The
                  Genesis of Thought
                </h4>

                <p>
                  Humanity&apos;s
                  greatest limitation
                  is not physical, but
                  mental. We make most
                  of our decisions
                  based on past fears
                  or subconscious
                  biases...
                </p>

                <p>
                  Those who excel in
                  competitive exams do
                  not necessarily
                  possess intelligence
                  a hundred times
                  greater than
                  average. The
                  difference lies in
                  mental discipline...
                </p>
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() =>
                    setPreviewOpen(
                      false,
                    )
                  }
                  className="cursor-pointer rounded-full border border-border px-5 py-2 text-xs font-semibold transition-all hover:border-foreground hover:bg-background active:scale-95"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart();

                    setPreviewOpen(
                      false,
                    );
                  }}
                  className="flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary-hover hover:shadow active:scale-95"
                >
                  <ShoppingBag
                    size={14}
                  />

                  Add to Bag
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Buy Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-border bg-surface/95 p-3 px-4 shadow-lg backdrop-blur-md md:hidden">
        <div>
          <span className="block text-[10px] text-muted-foreground">
            Price (
            {activePricing.label})
          </span>

          <span className="text-lg leading-none font-bold text-primary">
            ₹{activePricing.price}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={
              handleToggleWishlist
            }
            aria-label={
              isWishlisted
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border transition-all hover:border-accent active:scale-95"
          >
            <Heart
              size={18}
              className={
                isWishlisted
                  ? "fill-accent text-accent"
                  : ""
              }
            />
          </button>

          <button
            type="button"
            onClick={
              handleAddToCart
            }
            className="flex h-10 cursor-pointer items-center gap-1.5 rounded-full border border-primary px-3.5 text-xs font-semibold text-primary transition-all hover:bg-primary/10 active:scale-95"
          >
            <ShoppingBag
              size={14}
            />
            Cart
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="flex h-10 cursor-pointer items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary-hover hover:shadow active:scale-95"
          >
            <Zap
              size={14}
              className="fill-current"
            />
            Buy Now
          </button>
        </div>
      </div>

     
    </div>
  );
}