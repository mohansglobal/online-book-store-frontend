"use client";

import { useQuery } from "@tanstack/react-query";
import { getCountries } from "../api/countries.api";
import { countryKeys } from "../queries/country.keys";
import type { GetCountriesParams } from "../types/country.types";

/**
 * Hook to fetch countries
 */
export function useCountries(params?: GetCountriesParams) {
  return useQuery({
    queryKey: countryKeys.list(params),
    queryFn: ({ signal }) => getCountries(params, { signal }),
  });
}
