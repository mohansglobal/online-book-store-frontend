// Category query key factory
import type { GetCategoriesParams } from "../types/category.types";

export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (params?: GetCategoriesParams) =>
    [...categoryKeys.lists(), params ?? {}] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (slug: string) => [...categoryKeys.details(), slug] as const,
};
