"use client";

import React from "react";
import { Feather, Mail, Megaphone, Smartphone, Sparkles } from "lucide-react";
import type { ContentSectionId } from "../types/content.types";

interface ContentSectionNavProps {
  activeSection: ContentSectionId;
  onSelectSection: (section: ContentSectionId) => void;
}

const SECTIONS = [
  {
    id: "hero" as ContentSectionId,
    label: "Hero Section",
    sublabel: "Shelf Headline & Subheading",
    icon: Sparkles,
  },
  {
    id: "ebooks" as ContentSectionId,
    label: "Digital Editions",
    sublabel: "Carry Your Library Everywhere",
    icon: Smartphone,
  },
  {
    id: "poetry" as ContentSectionId,
    label: "Poetry & Prose",
    sublabel: "Robert Frost Quote & Accent",
    icon: Feather,
  },
  {
    id: "announcement" as ContentSectionId,
    label: "Announcement Bar",
    sublabel: "FLAT20 Pill & Promo Text",
    icon: Megaphone,
  },
  {
    id: "newsletter" as ContentSectionId,
    label: "Newsletter",
    sublabel: "Good Books Deserve Good Company",
    icon: Mail,
  },
] as const;

export function ContentSectionNav({
  activeSection,
  onSelectSection,
}: ContentSectionNavProps) {
  return (
    <div className="flex flex-col gap-2 rounded-3xl border border-border bg-surface p-3 shadow-xs">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelectSection(section.id)}
              className={`group relative overflow-hidden flex flex-col cursor-pointer items-start gap-1 rounded-xl p-3 text-left transition-all ${
                isActive
                  ? "border border-accent/40 bg-accent/10 shadow-xs"
                  : "border border-border/60 bg-background hover:border-border hover:bg-muted/40"
              }`}
            >
              {/* Background Rotated Watermark Icon (matching logout alert dialog) */}
              <Icon
                aria-hidden="true"
                className={`pointer-events-none absolute -right-2.5 -top-2.5 size-16 rotate-12 transition-transform duration-300 group-hover:scale-105 ${
                  isActive
                    ? "text-accent opacity-[0.12] dark:opacity-[0.16]"
                    : "text-foreground opacity-[0.05] dark:opacity-[0.08]"
                }`}
              />

              <div className="relative z-10 flex w-full items-center justify-between">
                <span
                  className={`mt-1 text-lg font-bold ${
                    isActive ? "text-accent" : "text-foreground"
                  }`}
                >
                  {section.label}
                </span>

                {/* <Icon
                  size={18}
                  className={isActive ? "text-accent" : "text-muted-foreground"}
                /> */}
              </div>

              <span className="relative z-10 text-[11px] leading-tight text-muted-foreground line-clamp-1">
                {section.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
