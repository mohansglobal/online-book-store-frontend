import { useQuery } from "@tanstack/react-query";
import { getCategories, getAllCategories, getCategoryBySlug } from "../api/categories.api";
import { categoryKeys } from "../queries/category.keys";
import type { GetCategoriesParams } from "../types/category.types";

/**
 * Hook to fetch paginated/filtered categories
 */
export function useCategories(params?: GetCategoriesParams) {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: ({ signal }) => getCategories(params, { signal }),
  });
}

/**
 * Hook to fetch all categories across all pages (ideal for directory pages, alphabet filters, and sidebars)
 */
export function useAllCategories() {
  return useQuery({
    queryKey: [...categoryKeys.all, "all"] as const,
    queryFn: ({ signal }) => getAllCategories({ signal }),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single category by slug or id
 */
export function useCategory(slug: string) {
  return useQuery({
    queryKey: categoryKeys.detail(slug),
    queryFn: ({ signal }) => getCategoryBySlug(slug, { signal }),
    enabled: Boolean(slug),
  });
}
