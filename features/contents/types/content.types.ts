// Content section domain types for user-facing texts

export type ContentSectionId =
  | "hero"
  | "ebooks"
  | "poetry"
  | "announcement"
  | "newsletter";

export interface HeroContent {
  headlinePart1: string;
  headlinePart2: string;
  rotatingWords: string[];
  description: string;
  searchPlaceholder?: string;
}

export interface EbookPageItem {
  title: string;
  quote: string;
  progress?: number;
}

export interface EbooksContent {
  badge: string;
  heading: string;
  headingAccent: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  books?: EbookPageItem[];
}

export interface PoetryContent {
  badge: string;
  quote: string;
  quoteAccent?: string;
  author: string;
  ctaText: string;
  ctaLink: string;
}

export interface AnnouncementContent {
  badge: string;
  text: string;
  code: string;
  cta: string;
  link: string;
}

export interface NewsletterContent {
  heading: string;
  headingAccent: string;
  description: string;
}

export interface SiteContentState {
  hero: HeroContent;
  ebooks: EbooksContent;
  poetry: PoetryContent;
  announcement: AnnouncementContent;
  newsletter: NewsletterContent;
  _hydrated?: boolean;
}
