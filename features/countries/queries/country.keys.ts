import type { GetCountriesParams } from "../types/country.types";

export const countryKeys = {
  all: ["countries"] as const,
  lists: () => [...countryKeys.all, "list"] as const,
  list: (params?: GetCountriesParams) =>
    params !== undefined
      ? ([...countryKeys.lists(), params] as const)
      : ([...countryKeys.lists()] as const),
};
