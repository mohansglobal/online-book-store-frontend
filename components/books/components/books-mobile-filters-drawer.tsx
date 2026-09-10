"use client";

import React from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface BooksMobileFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  appliedCount: number;
  onClearAll: () => void;
}

export function BooksMobileFiltersDrawer({
  isOpen,
  onClose,
  children,
  appliedCount,
  onClearAll,
}: BooksMobileFiltersDrawerProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs md:hidden"
      onClick={onClose}
    >
      <div
        className="relative ml-auto flex h-full w-[85%] max-w-sm flex-col bg-background p-6 shadow-2xl overflow-y-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
            <SlidersHorizontal size={18} className="text-accent" />
            <span>Filter Books</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1">{children}</div>

        <div className="mt-auto pt-4 border-t border-border flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClearAll}>
            Reset
          </Button>
          <Button
            className="flex-1 bg-accent text-white hover:bg-accent-hover"
            onClick={onClose}
          >
            Apply ({appliedCount})
          </Button>
        </div>
      </div>
    </div>
  );
}
