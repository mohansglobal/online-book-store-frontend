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
 * Fetches all categories across all pages concurrently (for lookups, filters, and directory pages)
 */
export async function getAllCategories(
  options?: { signal?: AbortSignal },
): Promise<Category[]> {
  const firstPage = await getCategories({ limit: 100, page: 1 }, options);
  const totalPages = firstPage.meta?.totalPages ?? 1;
  const allCategories = [...(firstPage.data ?? [])];

  if (totalPages > 1) {
    const pagePromises: Promise<CategoriesResponse>[] = [];
    for (let p = 2; p <= totalPages; p++) {
      pagePromises.push(getCategories({ limit: 100, page: p }, options));
    }
    const remainingPages = await Promise.all(pagePromises);
    for (const res of remainingPages) {
      if (res.data) {
        allCategories.push(...res.data);
      }
    }
  }

  return allCategories;
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
