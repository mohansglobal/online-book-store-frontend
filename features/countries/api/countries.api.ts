// Country API endpoint functions
import { apiClient } from "@/lib/api";
import type { CountriesResponse, GetCountriesParams } from "../types/country.types";

/**
 * Fetches list of countries from /api/v1/countries
 */
export async function getCountries(
  params?: GetCountriesParams,
  options?: { signal?: AbortSignal },
): Promise<CountriesResponse> {
  return apiClient.get<CountriesResponse>("/countries", {
    params: params as Record<string, string | number | boolean | undefined>,
    signal: options?.signal,
  });
}
