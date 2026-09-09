// Publisher API endpoint functions
import { apiClient } from "@/lib/api";
import type {
  GetPublishersParams,
  Publisher,
  PublishersResponse,
  SinglePublisherResponse,
} from "../types/publisher.types";


//Fetches paginated list of publishers from /api/v1/publishers

export async function getPublishers(
  params?: GetPublishersParams,
  options?: { signal?: AbortSignal },
): Promise<PublishersResponse> {
  return apiClient.get<PublishersResponse>("/publishers", {
    params: params as Record<string, string | number | boolean | undefined>,
    signal: options?.signal,
  });
}

/**
 * Fetches all publishers across all pages concurrently (for lookups and filters)
 */
export async function getAllPublishers(
  options?: { signal?: AbortSignal },
): Promise<Publisher[]> {
  const firstPage = await getPublishers({ limit: 100, page: 1 }, options);
  const totalPages = firstPage.meta?.totalPages ?? 1;
  const allPublishers = [...(firstPage.data ?? [])];

  if (totalPages > 1) {
    const pagePromises: Promise<PublishersResponse>[] = [];
    for (let p = 2; p <= totalPages; p++) {
      pagePromises.push(getPublishers({ limit: 100, page: p }, options));
    }
    const remainingPages = await Promise.all(pagePromises);
    for (const res of remainingPages) {
      if (res.data) {
        allPublishers.push(...res.data);
      }
    }
  }

  return allPublishers;
}

//
export async function getPublisherBySlug(
  slug: string,
  options?: { signal?: AbortSignal },
): Promise<SinglePublisherResponse> {
  return apiClient.get<SinglePublisherResponse>(`/publishers/${encodeURIComponent(slug)}`, {
    signal: options?.signal,
  });
}
