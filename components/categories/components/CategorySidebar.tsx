"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { publishers, authors } from "@/components/home/data";

export function CategorySidebar() {
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);

  const toggleSelection = (set: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    set((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  };

  return (
    <div className="w-full md:w-64 shrink-0 space-y-8 pr-4 py-8">
      {/* PUBLISHERS */}
      <div>
        <h3 className="text-[12px] font-semibold tracking-[0.1em] text-muted-foreground uppercase mb-5 pb-3 border-b border-border">
          Publishers
        </h3>
        <div className="space-y-3">
          {publishers.map((pub) => (
            <label key={pub} className="flex items-center gap-3 cursor-pointer group">
              <div
                className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-colors shrink-0 ${
                  selectedPublishers.includes(pub)
                    ? "bg-foreground border-foreground text-background"
                    : "border-border bg-transparent group-hover:border-foreground/50"
                }`}
              >
                {selectedPublishers.includes(pub) && <Check size={12} strokeWidth={4} />}
              </div>
              <span className="text-[13px] text-foreground/80 group-hover:text-foreground transition-colors leading-tight">
                {pub}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* AUTHORS */}
      <div>
        <h3 className="text-[12px] font-semibold tracking-[0.1em] text-muted-foreground uppercase mb-5 pb-3 border-b border-border">
          Authors
        </h3>
        <div className="space-y-3">
          {authors.map((author) => (
            <label key={author.name} className="flex items-center gap-3 cursor-pointer group">
              <div
                className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-colors shrink-0 ${
                  selectedAuthors.includes(author.name)
                    ? "bg-foreground border-foreground text-background"
                    : "border-border bg-transparent group-hover:border-foreground/50"
                }`}
              >
                {selectedAuthors.includes(author.name) && <Check size={12} strokeWidth={4} />}
              </div>
              <span className="text-[13px] text-foreground/80 group-hover:text-foreground transition-colors leading-tight">
                {author.name}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
