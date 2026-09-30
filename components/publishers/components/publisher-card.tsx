"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Library, MapPin, Phone } from "lucide-react";

import type { Publisher } from "@/features/publishers/types/publisher.types";
import { PublisherAvatar } from "./publisher-avatar";

export interface PublisherCardProps {
  publisher: Publisher;
  index: number;
  isFirst?: boolean;
}

// Publisher card with avatar, established year, publications count, address, and keyboard navigation
export function PublisherCard({
  publisher,
  index,
  isFirst = false,
}: PublisherCardProps) {
  const router = useRouter();

  const establishedText =
    publisher.established ||
    (publisher.createdAt ? new Date(publisher.createdAt).getFullYear() : "-");

  const publicationsText = publisher.publications || "-";

  return (
    <article
      id={isFirst ? "publisher-result-0" : undefined}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          router.push(`/books?publisher=${publisher._id}`);
        }
        if (e.key === "Tab" && e.shiftKey && isFirst) {
          e.preventDefault();
          const searchInput = document.querySelector(
            'input[type="search"]',
          ) as HTMLInputElement;
          searchInput?.focus();
        }
      }}
      className="group relative flex min-h-[118px] items-center gap-3 rounded-xl border border-border/70 bg-[#F7F1E3] p-3 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-hidden focus:-translate-y-0.5 focus:border-accent/40 focus:shadow-md cursor-pointer"
    >
      {/* Publisher Logo */}
      <PublisherAvatar
        key={publisher._id || publisher.slug}
        publisher={publisher}
      />

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col py-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2
              title={publisher.name}
              className="truncate font-display text-[15px] leading-tight font-semibold text-foreground sm:text-base"
            >
              {publisher.name}
            </h2>

            {/* Meta */}
            <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
              <span>Est. {establishedText}</span>

              <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />

              <span className="flex items-center gap-1">
                <Library size={11} strokeWidth={1.8} aria-hidden="true" />
                <span>{publicationsText} books</span>
              </span>
            </div>
          </div>

          <Link
            href={`/books?publisher=${publisher._id}`}
            aria-label={`View ${publisher.name}`}
            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white"
          >
            <ArrowUpRight
              size={15}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        {/* Description */}
        <p className="mt-2 line-clamp-2 text-[11px] leading-[1.45] text-muted-foreground sm:text-xs">
          {publisher.description || "-"}
        </p>

        {/* Contact */}
        <div className="mt-auto flex flex-col gap-1.5 overflow-hidden pt-3 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5 truncate">
            <Phone
              size={11}
              aria-hidden="true"
              className="shrink-0 text-muted-foreground"
            />
            <span className="truncate">{publisher.phone || "-"}</span>
          </div>

          <div className="flex items-center gap-1.5 truncate">
            <MapPin
              size={11}
              aria-hidden="true"
              className="shrink-0 text-muted-foreground"
            />
            <span className="truncate">{publisher.address || "-"}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
