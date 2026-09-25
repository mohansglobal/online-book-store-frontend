import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "@/lib/api";
import { getHeroStats } from "./stats.api";
import type { HeroStatsResponse } from "../types/stats.types";

vi.mock("@/lib/api", () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe("Stats API Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should request GET /stats/hero with homepage pageKey", async () => {
    const mockResponse: HeroStatsResponse = {
      success: true,
      message: "Hero stats retrieved successfully",
      data: {
        curatedTitles: {
          rawCount: 341,
          display: "300+",
          label: "Curated Titles",
        },
        indieAuthors: {
          rawCount: 92,
          display: "90+",
          label: "Indie Authors",
        },
        verifiedSellers: {
          rawCount: 28,
          display: "25+",
          label: "Verified Sellers",
        },
        readerRating: {
          rawCount: 3.5,
          display: "3.5",
          label: "Reader Rating",
          totalReviews: 25,
        },
        stats: [
          {
            id: "curated-titles",
            label: "Curated Titles",
            value: "300+",
            rawCount: 341,
            type: "count",
          },
          {
            id: "indie-authors",
            label: "Indie Authors",
            value: "90+",
            rawCount: 92,
            type: "count",
          },
          {
            id: "verified-sellers",
            label: "Verified Sellers",
            value: "25+",
            rawCount: 28,
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
        ],
      },
    };

    vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

    const abortController = new AbortController();
    const result = await getHeroStats({ signal: abortController.signal });

    expect(apiClient.get).toHaveBeenCalledWith("/stats/hero", {
      signal: abortController.signal,
      pageKey: "homepage",
    });

    expect(result).toEqual(mockResponse);
    expect(result.data.stats).toHaveLength(4);
    expect(result.data.stats[0].value).toBe("300+");
    expect(result.data.readerRating.rawCount).toBe(3.5);
  });
});
