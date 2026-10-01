"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

import { IconButton } from "./icon-button";
import { SectionHeading } from "./section-heading";
import { HomeAuthorCard } from "./home-author-card";
import { AuthorDetailsDialog } from "@/components/author/components/author-details-dialog";
import { useAuthors, type Author } from "@/features/authors";

type CarouselDirection = -1 | 1;

export function Authors() {
  const railRef = useRef<HTMLDivElement>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: authorsResponse, isLoading } = useAuthors({
    limit: 10,
    sortOrder: "asce",
    homepage: true,
  });

  const authorsList = useMemo(() => {
    if (authorsResponse?.data && authorsResponse.data.length > 0) {
      return authorsResponse.data.slice(0, 10);
    }
    return [];
  }, [authorsResponse]);

  if (!isLoading && authorsList.length === 0) {
    return null;
  }

  const moveCarousel = (direction: CarouselDirection): void => {
    railRef.current?.scrollBy({
      left: direction * 380,
      behavior: "smooth",
    });
  };

  const handleSelectAuthor = (author: Author) => {
    setSelectedAuthor(author);
    setIsModalOpen(true);
  };

  return (
    <section
      id="authors"
      className="bg-background py-[76px] md:py-[120px]"
    >
      <div className="mx-auto w-[min(1320px,calc(100%-36px))] md:w-[min(1320px,calc(100%-72px))]">
        <div className="relative md:pr-32">
          <SectionHeading
            eyebrow="VOICES TO KNOW"
            title="Authors shaping today's stories"
            copy="Legendary poets, novelists, and thinkers from India and Bengal whose words continue to inspire generations."
          />

          <div className="absolute right-0 bottom-1 hidden items-center gap-1.5 md:flex">
            <Link
              href="/authors"
              className="group mr-3 flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              See all

              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            <IconButton
              label="Previous Authors"
              onClick={() => moveCarousel(-1)}
            >
              <ArrowLeft size={19} />
            </IconButton>

            <IconButton
              label="Next Authors"
              onClick={() => moveCarousel(1)}
            >
              <ArrowRight size={19} />
            </IconButton>
          </div>
        </div>

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-flow-col auto-cols-[minmax(280px,78vw)] gap-6 overflow-x-auto -mr-4 px-1 py-3 pb-6 sm:auto-cols-[minmax(320px,360px)] md:mr-0 md:gap-7">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="flex min-h-[400px] flex-col justify-between rounded-3xl border border-border bg-card p-8 sm:min-h-[420px] sm:p-9"
              >
                <div>
                  <div className="mb-8 flex items-start justify-between">
                    <div className="h-20 w-20 rounded-full bg-muted/60 animate-pulse sm:h-24 sm:w-24" />
                    <div className="h-6 w-20 rounded-full bg-muted/60 animate-pulse" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-7 w-3/4 rounded bg-muted/60 animate-pulse" />
                    <div className="h-4 w-1/2 rounded bg-muted/60 animate-pulse" />
                    <div className="h-14 w-full rounded bg-muted/60 animate-pulse" />
                  </div>
                </div>
                <div className="border-t border-border/80 pt-6">
                  <div className="h-4 w-1/3 rounded bg-muted/60 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Author Carousel */
          <div
            ref={railRef}
            className="grid grid-flow-col auto-cols-[minmax(280px,78vw)] gap-6 overflow-x-auto -mr-4 px-1 py-3 pb-6 [scroll-snap-type:x_mandatory] [scrollbar-width:none] sm:auto-cols-[minmax(320px,360px)] md:mr-0 md:gap-7 [&::-webkit-scrollbar]:hidden"
          >
            {authorsList.map((author, index) => (
              <HomeAuthorCard
                key={`${author.name}-${index}`}
                author={author}
                index={index}
                onSelect={handleSelectAuthor}
              />
            ))}
          </div>
        )}
      </div>

      {/* Author Details Modal */}
      <AuthorDetailsDialog
        author={selectedAuthor}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </section>
  );
}