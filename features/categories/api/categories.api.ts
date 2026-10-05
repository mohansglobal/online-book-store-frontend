// Category API endpoint functions
import { apiClient } from "@/lib/api";
import type {
  CategoriesResponse,
  Category,
  GetCategoriesParams,
  SingleCategoryResponse,
  UpdateCategoryInput,
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
  const firstPage = await getCategories({ limit: 20, page: 1 }, options);
  const totalPages = firstPage.meta?.totalPages ?? 1;
  const allCategories = [...(firstPage.data ?? [])];

  if (totalPages > 1) {
    const pagePromises: Promise<CategoriesResponse>[] = [];
    for (let p = 2; p <= totalPages; p++) {
      pagePromises.push(getCategories({ limit: 20, page: p }, options));
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

/**
 * Updates an existing category by its ID (supports both JSON and multipart/form-data for direct image upload)
 */
export async function updateCategory(
  id: string,
  data: UpdateCategoryInput,
): Promise<SingleCategoryResponse> {
  const encodedId = encodeURIComponent(id);

  if (typeof window !== "undefined" && data.image instanceof File) {
    const formData = new FormData();

    if (data.name !== undefined) formData.append("name", data.name);
    if (data.nameBn !== undefined) formData.append("nameBn", data.nameBn);
    if (data.slug !== undefined) formData.append("slug", data.slug);
    if (data.description !== undefined) formData.append("description", data.description);
    if (data.isActive !== undefined) formData.append("isActive", String(data.isActive));
    formData.append("image", data.image);

    return apiClient.patch<SingleCategoryResponse>(`/categories/${encodedId}`, undefined, {
      body: formData,
    });
  }

  return apiClient.patch<SingleCategoryResponse>(`/categories/${encodedId}`, data);
}


