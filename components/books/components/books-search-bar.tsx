"use client";

import React from "react";
import { Search, X } from "lucide-react";

export interface BooksSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onClear: () => void;
  placeholder?: string;
}

export function BooksSearchBar({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder = "Search books by title, Bangla title, tags, description...",
}: BooksSearchBarProps) {
  return (
    <div className="flex justify-center mb-8">
      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-2xl flex items-center shadow-xs rounded-full overflow-hidden bg-[#F7F1E3] border border-border/70"
      >
        <div className="pl-4 text-muted-foreground">
          <Search size={20} aria-hidden="true" />
        </div>

        <input
          type="search"
          placeholder={placeholder}
          aria-label="Search books"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full py-3 px-4 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm sm:text-base [&::-webkit-search-cancel-button]:hidden"
        />

        {value && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search text"
            className="pr-2 text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        )}

        <button
          type="submit"
          className="bg-accent text-white px-6 sm:px-8 py-3 font-semibold hover:bg-accent-hover transition-colors text-sm sm:text-base shrink-0 cursor-pointer"
        >
          Search
        </button>
      </form>
    </div>
  );
}
