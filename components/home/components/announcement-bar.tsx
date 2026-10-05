"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAnnouncementContent } from "@/features/contents";


interface AnnouncementItem {
  id: string;
  badge: string;
  text: string;
  code: string | null;
  link: string;
  cta: string;
}

const ANNOUNCEMENTS: readonly AnnouncementItem[] = [
  {
    id: "flat20",
    badge: "20% FLAT OFF",
    text: "Get 20% Flat Discount on all books! Use coupon",
    code: "FLAT20",
    link: "/books",
    cta: "Shop Now",
  },
  {
    id: "shipping",
    badge: "FREE SHIPPING",
    text: "Free express shipping on all orders over ₹499 across India & Bengal",
    code: null,
    link: "/books",
    cta: "Browse Books",
  },
  {
    id: "student",
    badge: "STUDENT SPECIAL",
    text: "Extra 10% OFF for students & researchers with code",
    code: "STUDENT10",
    link: "/books",
    cta: "Claim Discount",
  },
  {
    id: "new-arrivals",
    badge: "NEW ARRIVALS",
    text: "Exclusive autographed & rare literature editions just added",
    code: null,
    link: "/categories",
    cta: "Explore Collection",
  },
] as const;

export function AnnouncementBar() {
  const customPromo = useAnnouncementContent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const announcements: AnnouncementItem[] = [
    ...(customPromo
      ? [
          {
            id: "custom-promo",
            badge: customPromo.badge,
            text: customPromo.text,
            code: customPromo.code || null,
            link: customPromo.link || "/books",
            cta: customPromo.cta || "Shop Now",
          },
        ]
      : []),
    ...ANNOUNCEMENTS.slice(1),
  ];

  useEffect(() => {
    if (isPaused || isDismissed) {
      return;
    }

    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);

    return () => {
      clearInterval(intervalId);
    };
  }, [isPaused, isDismissed, announcements.length]);

  if (isDismissed) {
    return null;
  }

  const currentItem = announcements[currentIndex] || announcements[0];
  const itemCode = currentItem.code;
  const isCopied = itemCode !== null && copiedCode === itemCode;

  const handlePrev = (): void => {
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const handleNext = (): void => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  const handleCopyCode = async (code: string, event: React.MouseEvent): Promise<void> => {
    event.stopPropagation();

    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(`Coupon code "${code}" copied!`);

      setTimeout(() => {
        setCopiedCode(null);
      }, 2000);
    } catch {
      toast.error("Failed to copy code");
    }
  };

  return (
    <div
      className="relative z-40 w-full overflow-hidden border-b border-white/10  text-white shadow-sm transition-all"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto flex h-9 max-w-[1420px] items-center justify-between px-3 text-xs font-medium sm:px-6">
        {/* Navigation Controls Left */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous announcement"
          className="grid h-6 w-6 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/20 hover:text-white focus:outline-none"
        >
          <ChevronLeft size={14} />
        </button>

        {/* Dynamic Carousel Content */}
        <div className="relative flex min-w-0 flex-1 items-center justify-center overflow-hidden px-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex items-center justify-center gap-2 truncate text-center"
            >
              {/* Badge */}
              <span className="hidden items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-white shadow-xs backdrop-blur-xs sm:inline-flex">
                <Sparkles size={11} className="text-amber-200" />
                {currentItem.badge}
              </span>

              {/* Text */}
              <span className="truncate text-xs font-medium text-white/95 sm:text-xs">
                {currentItem.text}
              </span>

              {/* Coupon Code Pill */}
              {itemCode && (
                <button
                  type="button"
                  onClick={(event) => handleCopyCode(itemCode, event)}
                  title="Click to copy coupon code"
                  className="group inline-flex items-center gap-1 rounded-md border border-white/30 bg-black/25 px-2 py-0.5 text-[11px] font-bold tracking-wide text-amber-200 transition-all hover:border-white/60 hover:bg-black/40 hover:text-white"
                >
                  <Tag size={11} className="text-amber-300" />
                  <span>{itemCode}</span>
                  {isCopied ? (
                    <Check size={11} className="text-green-300" />
                  ) : (
                    <Copy size={11} className="opacity-70 group-hover:opacity-100" />
                  )}
                </button>
              )}

              {/* CTA Link */}
              <Link
                href={currentItem.link}
                className="hidden items-center gap-0.5 text-[11px] font-bold text-white underline decoration-white/50 underline-offset-2 transition-colors hover:text-amber-200 hover:decoration-white md:inline-flex"
              >
                <span>{currentItem.cta}</span>
                <ChevronRight size={12} />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Controls: Next & Dismiss */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next announcement"
            className="grid h-6 w-6 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/20 hover:text-white focus:outline-none"
          >
            <ChevronRight size={14} />
          </button>

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss announcement bar"
            className="ml-1 grid h-6 w-6 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/20 hover:text-white focus:outline-none"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
