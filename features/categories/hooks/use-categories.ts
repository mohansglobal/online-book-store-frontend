import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  getAllCategories,
  getCategoryBySlug,
  updateCategory,
} from "../api/categories.api";
import { categoryKeys } from "../queries/category.keys";
import type {
  GetCategoriesParams,
  UpdateCategoryInput,
} from "../types/category.types";


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

/**
 * Hook to fetch categories infinitely with pagination for virtualized infinite scroll
 */
export function useInfiniteCategories(params?: Omit<GetCategoriesParams, "page">) {
  const queryParams: GetCategoriesParams = {
    limit: 20,
    ...params,
  };

  return useInfiniteQuery({
    queryKey: categoryKeys.infinite(queryParams),
    queryFn: ({ pageParam = 1, signal }) =>
      getCategories({ ...queryParams, page: pageParam as number }, { signal }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = lastPage.meta;
      if (!meta) return undefined;

      const currentPage = meta.page ?? 1;
      const totalPages = meta.totalPages ?? 1;
      const hasNext =
        "hasNextPage" in meta && typeof (meta as Record<string, unknown>).hasNextPage === "boolean"
          ? Boolean((meta as Record<string, unknown>).hasNextPage)
          : currentPage < totalPages;

      return hasNext ? currentPage + 1 : undefined;
    },
  });
}

/**
 * Hook to update category details by ID
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryInput }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

