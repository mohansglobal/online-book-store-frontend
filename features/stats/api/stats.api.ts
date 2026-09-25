// Stats API calls
import { apiClient } from "@/lib/api";
import type { HeroStatsResponse } from "../types/stats.types";

export async function getHeroStats(
  options?: { signal?: AbortSignal },
): Promise<HeroStatsResponse> {
  return apiClient.get<HeroStatsResponse>("/stats/hero", {
    signal: options?.signal,
    pageKey: "homepage",
  });
}
