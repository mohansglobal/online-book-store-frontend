"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ShoppingBag, X } from "lucide-react";

export interface BookDetailsPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onAddToCart: () => void;
}

export function BookDetailsPreviewModal({
  isOpen,
  onClose,
  title,
  onAddToCart,
}: BookDetailsPreviewModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sample-preview-title"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overscroll-contain"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-xl rounded-2xl border border-border bg-surface p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <h3
                id="sample-preview-title"
                className="flex items-center gap-2 font-display text-lg font-bold text-foreground"
              >
                <BookOpen size={16} className="text-accent" />
                Sample Preview: {title || "-"}
              </h3>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close preview"
                title="Close preview"
                className="cursor-pointer rounded-full p-1 text-muted-foreground transition-all hover:bg-background hover:text-foreground active:scale-95"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-2 font-serif text-sm leading-relaxed text-muted-foreground overscroll-contain">
              <h4 className="mb-2 text-center font-display text-xl text-foreground">
                Chapter One: An Excerpt
              </h4>

              <p>
                Literature is the mirror of life, reflecting human emotions, journeys, and
                unspoken truths. Every chapter opens a gateway into uncharted realms of thought,
                inviting the reader to immerse in evocative storytelling...
              </p>

              <p>
                Those who seek knowledge through books discover not merely facts, but deep
                resonance with human perseverance and beauty. Each page holds a memory, each word
                a gentle resonance across time and space...
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-border pt-4">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-full border border-border px-5 py-2 text-xs font-semibold transition-all hover:border-foreground hover:bg-background active:scale-95"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  onAddToCart();
                  onClose();
                }}
                className="flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary-hover hover:shadow active:scale-95"
              >
                <ShoppingBag size={14} />
                Add to Bag
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
