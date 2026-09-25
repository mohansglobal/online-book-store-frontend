// React TanStack Query hook for hero stats
"use client";

import { useQuery } from "@tanstack/react-query";
import { getHeroStats } from "../api/stats.api";
import { statsKeys } from "../queries/stats.keys";
import { DEFAULT_HERO_STATS } from "../types/stats.types";
import type { HeroStatItem } from "../types/stats.types";

export function useHeroStats() {
  const query = useQuery({
    queryKey: statsKeys.hero(),
    queryFn: ({ signal }) => getHeroStats({ signal }),
    staleTime: 5 * 60 * 1000,
  });

  const apiStats = query.data?.data?.stats;
  const hasStats = apiStats && apiStats.length > 0;
  const stats: HeroStatItem[] = hasStats ? apiStats : DEFAULT_HERO_STATS;

  const curatedTitles = query.data?.data?.curatedTitles;
  const indieAuthors = query.data?.data?.indieAuthors;
  const verifiedSellers = query.data?.data?.verifiedSellers;
  const readerRating = query.data?.data?.readerRating;

  return {
    ...query,
    stats,
    curatedTitles,
    indieAuthors,
    verifiedSellers,
    readerRating,
  };
}
