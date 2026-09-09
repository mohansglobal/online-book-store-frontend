"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePublishers } from "@/features/publishers";

export function Publishers() {
  const { data: publishersResponse } = usePublishers({
    limit: 15,
  });

  const publisherList = useMemo(() => {
    if (publishersResponse?.data && publishersResponse.data.length > 0) {
      return publishersResponse.data.slice(0, 15).map((p) => p.name);
    }
    return [];
  }, [publishersResponse]);

  // Duplicate for seamless infinite marquee loop (0% to -50% translation)
  const marqueePublishers = [...publisherList, ...publisherList];

  if (publisherList.length === 0) {
    return null;
  }

  return (
    <section
      id="publishers"
      aria-label="Publishers Marquee"
      className="overflow-hidden border-y border-border bg-card py-11 md:py-[60px]"
    >
      <div className="mx-auto w-[min(1320px,calc(100%-36px))] md:w-[min(1320px,calc(100%-72px))]">
        <div className="flex w-max gap-[45px] animate-[marquee_32s_linear_infinite] hover:[animation-play-state:paused]">
          {marqueePublishers.map((publisher, index) => (
            <Link
              key={`${publisher}-${index}`}
              href="/publishers"
              className="flex items-center gap-[45px] font-display text-[23px] text-muted-foreground transition-colors hover:text-primary md:text-[27px]"
            >
              <span>{publisher}</span>

              <span
                aria-hidden="true"
                className="text-[10px] text-primary"
              >
                ✦
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}