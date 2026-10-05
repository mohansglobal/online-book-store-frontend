import { apiClient } from "@/lib/api";
import type {
  AnnouncementContent,
  ContentSectionId,
  EbooksContent,
  HeroContent,
  NewsletterContent,
  PoetryContent,
  SiteContentState,
} from "../types/content.types";

export interface SiteContentResponse {
  success: boolean;
  message: string;
  data: {
    hero: HeroContent;
    ebooks: EbooksContent;
    poetry: PoetryContent;
    announcement: AnnouncementContent;
    newsletter: NewsletterContent;
    updatedAt?: string;
  };
}

export async function getSiteContent(options?: {
  signal?: AbortSignal;
}): Promise<SiteContentResponse> {
  return apiClient.get<SiteContentResponse>("/contents", {
    signal: options?.signal,
    useApi: true,
  });
}

export async function updateSectionContent(
  section: ContentSectionId,
  data:
    | HeroContent
    | EbooksContent
    | PoetryContent
    | AnnouncementContent
    | NewsletterContent,
): Promise<SiteContentResponse> {
  return apiClient.patch<SiteContentResponse>(`/contents/${section}`, data, {
    useApi: true,
  });
}

export async function updateSiteContent(
  data: Partial<Omit<SiteContentState, "_hydrated">>,
): Promise<SiteContentResponse> {
  return apiClient.patch<SiteContentResponse>("/contents", data, {
    useApi: true,
  });
}

export async function resetSiteContent(
  section?: ContentSectionId,
): Promise<SiteContentResponse> {
  return apiClient.post<SiteContentResponse>(
    "/contents/reset",
    { section },
    { useApi: true },
  );
}
