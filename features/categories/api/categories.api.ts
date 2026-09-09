// Category API endpoint functions
import { apiClient } from "@/lib/api";
import type {
  CategoriesResponse,
  Category,
  GetCategoriesParams,
  SingleCategoryResponse,
} from "../types/category.types";

/**
 * Fetches paginated list of categories from /api/v1/categories
 */
export async function getCategories(
  params?: GetCategoriesParams,
  options?: { signal?: AbortSignal },
): Promise<CategoriesResponse> {
  return apiClient.get<CategoriesResponse>("/categories", {
    params: params as Record<string, string | number | boolean | undefined>,
    signal: options?.signal,
  });
}

/**
 * Fetches a single category by slug or id from /api/v1/categories/:identifier
 */
export async function getCategoryBySlug(
  slug: string,
  options?: { signal?: AbortSignal },
): Promise<SingleCategoryResponse> {
  return apiClient.get<SingleCategoryResponse>(`/categories/${encodeURIComponent(slug)}`, {
    signal: options?.signal,
  });
}
