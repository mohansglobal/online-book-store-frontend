// Stats domain types

export type HeroStatItem = {
  id: string;
  label: string;
  value: string;
  rawCount: number;
  type: string;
  hasStar?: boolean;
};

export type HeroCountStat = {
  rawCount: number;
  display: string;
  label: string;
};

export type HeroRatingStat = {
  rawCount: number;
  display: string;
  label: string;
  totalReviews?: number;
};

export type HeroStatsData = {
  curatedTitles: HeroCountStat;
  indieAuthors: HeroCountStat;
  verifiedSellers: HeroCountStat;
  readerRating: HeroRatingStat;
  stats: HeroStatItem[];
};

export type HeroStatsResponse = {
  success: boolean;
  message?: string;
  data: HeroStatsData;
};

export const DEFAULT_HERO_STATS: HeroStatItem[] = [
  {
    id: "curated-titles",
    label: "Curated Titles",
    value: "300+",
    rawCount: 300,
    type: "count",
  },
  {
    id: "indie-authors",
    label: "Indie Authors",
    value: "90+",
    rawCount: 90,
    type: "count",
  },
  {
    id: "verified-sellers",
    label: "Verified Sellers",
    value: "25+",
    rawCount: 25,
    type: "count",
  },
  {
    id: "reader-rating",
    label: "Reader Rating",
    value: "3.5",
    rawCount: 3.5,
    type: "rating",
    hasStar: true,
  },
];
