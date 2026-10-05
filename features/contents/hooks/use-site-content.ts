"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSiteContent,
  resetSiteContent,
  updateSectionContent,
  updateSiteContent,
} from "../api/contents.api";
import type {
  AnnouncementContent,
  ContentSectionId,
  EbooksContent,
  HeroContent,
  NewsletterContent,
  PoetryContent,
  SiteContentState,
} from "../types/content.types";

export const siteContentKeys = {
  all: ["site-content"] as const,
  current: () => [...siteContentKeys.all, "current"] as const,
};

// Public hook to fetch real dynamic site texts directly via TanStack Query from MongoDB
export function useSiteContent() {
  return useQuery({
    queryKey: siteContentKeys.current(),
    queryFn: ({ signal }) => getSiteContent({ signal }),
    staleTime: 60 * 1000,
  });
}

// Selector hook for real Hero section content from database
export function useHeroContent(): HeroContent | undefined {
  const { data } = useSiteContent();

  return data?.data?.hero;
}

// Selector hook for real Digital Editions (Ebooks) content from database
export function useEbooksContent(): EbooksContent | undefined {
  const { data } = useSiteContent();

  return data?.data?.ebooks;
}

// Selector hook for real Poetry & Prose content from database
export function usePoetryContent(): PoetryContent | undefined {
  const { data } = useSiteContent();

  return data?.data?.poetry;
}

// Selector hook for real Announcement bar content from database
export function useAnnouncementContent(): AnnouncementContent | undefined {
  const { data } = useSiteContent();

  return data?.data?.announcement;
}

// Selector hook for real Newsletter section content from database
export function useNewsletterContent(): NewsletterContent | undefined {
  const { data } = useSiteContent();

  return data?.data?.newsletter;
}

// Admin hook for content updates and resets
export function useSiteContentAdmin() {
  const queryClient = useQueryClient();

  const updateSectionMutation = useMutation({
    mutationFn: async ({
      section,
      data,
    }: {
      section: ContentSectionId;
      data:
        | HeroContent
        | EbooksContent
        | PoetryContent
        | AnnouncementContent
        | NewsletterContent;
    }) => {
      return updateSectionContent(section, data);
    },
    onSuccess: (res) => {
      queryClient.setQueryData(siteContentKeys.current(), res);
      queryClient.invalidateQueries({ queryKey: siteContentKeys.all });
    },
  });

  const updateAllMutation = useMutation({
    mutationFn: async (data: Partial<Omit<SiteContentState, "_hydrated">>) => {
      return updateSiteContent(data);
    },
    onSuccess: (res) => {
      queryClient.setQueryData(siteContentKeys.current(), res);
      queryClient.invalidateQueries({ queryKey: siteContentKeys.all });
    },
  });

  const resetMutation = useMutation({
    mutationFn: async (section?: ContentSectionId) => {
      return resetSiteContent(section);
    },
    onSuccess: (res) => {
      queryClient.setQueryData(siteContentKeys.current(), res);
      queryClient.invalidateQueries({ queryKey: siteContentKeys.all });
    },
  });

  const isSaving =
    updateSectionMutation.isPending ||
    updateAllMutation.isPending ||
    resetMutation.isPending;

  return {
    updateSectionMutation,
    updateAllMutation,
    resetMutation,
    isSaving,
  };
}
