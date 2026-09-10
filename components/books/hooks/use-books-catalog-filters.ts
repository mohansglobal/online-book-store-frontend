"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SORT_MAP, VALID_SORTS, type SortOption } from "../components/books-catalog-toolbar";
import type { FilterItem } from "../components/books-filter-sidebar";
import { buildActiveFiltersList } from "../utils/build-active-filters";

export interface UseBooksCatalogFiltersProps {
  initialCategoryId?: string;
  initialAuthorId?: string;
  initialPublisherId?: string;
  labelLookupMap?: Record<string, string>;
}

function parseFilterParam(paramValue: string | null, initialValue?: string): string[] {
  const raw = paramValue !== null && paramValue !== undefined ? paramValue : initialValue || "";
  if (!raw.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function useBooksCatalogFilters({
  initialCategoryId,
  initialAuthorId,
  initialPublisherId,
  labelLookupMap = {},
}: UseBooksCatalogFiltersProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Pagination
  const rawPage = parseInt(searchParams.get("page") || "1", 10);
  const page = !isNaN(rawPage) && rawPage >= 1 ? rawPage : 1;
  const limit = 15;

  // Search & Sorting
  const urlSearch = searchParams.get("search") || "";
  const rawSort = searchParams.get("sort") as SortOption;
  const sortOption: SortOption = VALID_SORTS.includes(rawSort) ? rawSort : "newest";
  const currentSortConfig = SORT_MAP[sortOption];

  // Price Filters
  const rawMinPrice = searchParams.get("minPrice");
  const rawMaxPrice = searchParams.get("maxPrice");
  const minPrice = rawMinPrice ? Number(rawMinPrice) : undefined;
  const maxPrice = rawMaxPrice ? Number(rawMaxPrice) : undefined;

  // Multi-Filter IDs
  const selectedAuthorIds = useMemo(
    () => parseFilterParam(searchParams.get("author"), initialAuthorId),
    [searchParams, initialAuthorId],
  );

  const selectedPublisherIds = useMemo(
    () => parseFilterParam(searchParams.get("publisher"), initialPublisherId),
    [searchParams, initialPublisherId],
  );

  const selectedCategoryIds = useMemo(
    () => parseFilterParam(searchParams.get("category"), initialCategoryId),
    [searchParams, initialCategoryId],
  );

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [dynamicLabels, setDynamicLabels] = useState<Record<string, string>>({});

  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  // Synchronize search params to URL
  const updateUrlParams = useCallback(
    (updates: {
      page?: number;
      search?: string;
      publisher?: string[] | string;
      author?: string[] | string;
      category?: string[] | string;
      minPrice?: number | null;
      maxPrice?: number | null;
      sort?: SortOption;
    }) => {
      const params = new URLSearchParams(searchParams.toString());

      const nextPage = updates.page !== undefined ? updates.page : page;
      if (nextPage > 1) params.set("page", String(nextPage));
      else params.delete("page");

      const nextSearch = updates.search !== undefined ? updates.search : urlSearch;
      if (nextSearch.trim()) params.set("search", nextSearch.trim());
      else params.delete("search");

      if (updates.publisher !== undefined) {
        const val = Array.isArray(updates.publisher)
          ? updates.publisher.filter(Boolean).join(",")
          : updates.publisher.trim();
        if (val) params.set("publisher", val);
        else params.delete("publisher");
      }

      if (updates.author !== undefined) {
        const val = Array.isArray(updates.author)
          ? updates.author.filter(Boolean).join(",")
          : updates.author.trim();
        if (val) params.set("author", val);
        else params.delete("author");
      }

      if (updates.category !== undefined) {
        const val = Array.isArray(updates.category)
          ? updates.category.filter(Boolean).join(",")
          : updates.category.trim();
        if (val) params.set("category", val);
        else params.delete("category");
      }

      if (updates.minPrice !== undefined) {
        if (updates.minPrice !== null && !isNaN(updates.minPrice)) {
          params.set("minPrice", String(updates.minPrice));
        } else {
          params.delete("minPrice");
        }
      }
      if (updates.maxPrice !== undefined) {
        if (updates.maxPrice !== null && !isNaN(updates.maxPrice)) {
          params.set("maxPrice", String(updates.maxPrice));
        } else {
          params.delete("maxPrice");
        }
      }

      const nextSort = updates.sort !== undefined ? updates.sort : sortOption;
      if (nextSort && nextSort !== "newest") params.set("sort", nextSort);
      else params.delete("sort");

      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(targetUrl, { scroll: false });
    },
    [searchParams, pathname, router, page, urlSearch, sortOption],
  );

  const handleTogglePublisher = (pubId: string, item?: FilterItem) => {
    if (item?.name) {
      setDynamicLabels((prev) => ({
        ...prev,
        [pubId]: item.name,
        ...(item.slug ? { [item.slug]: item.name } : {}),
        ...(item._id ? { [item._id]: item.name } : {}),
      }));
    }
    const isSelected = selectedPublisherIds.includes(pubId);
    const next = isSelected
      ? selectedPublisherIds.filter((id) => id !== pubId)
      : [...selectedPublisherIds, pubId];
    updateUrlParams({ publisher: next, page: 1 });
  };

  const handleToggleAuthor = (authId: string, item?: FilterItem) => {
    if (item?.name) {
      setDynamicLabels((prev) => ({
        ...prev,
        [authId]: item.name,
        ...(item.slug ? { [item.slug]: item.name } : {}),
        ...(item._id ? { [item._id]: item.name } : {}),
      }));
    }
    const isSelected = selectedAuthorIds.includes(authId);
    const next = isSelected
      ? selectedAuthorIds.filter((id) => id !== authId)
      : [...selectedAuthorIds, authId];
    updateUrlParams({ author: next, page: 1 });
  };

  const handleToggleCategory = (catId: string, item?: FilterItem) => {
    if (item?.name) {
      setDynamicLabels((prev) => ({
        ...prev,
        [catId]: item.name,
        ...(item.slug ? { [item.slug]: item.name } : {}),
        ...(item._id ? { [item._id]: item.name } : {}),
      }));
    }
    const isSelected = selectedCategoryIds.includes(catId);
    const next = isSelected
      ? selectedCategoryIds.filter((id) => id !== catId)
      : [...selectedCategoryIds, catId];
    updateUrlParams({ category: next, page: 1 });
  };

  const handleApplyPrice = (min?: number, max?: number) => {
    updateUrlParams({ minPrice: min ?? null, maxPrice: max ?? null, page: 1 });
  };

  const handleClearPrice = () => {
    updateUrlParams({ minPrice: null, maxPrice: null, page: 1 });
  };

  const handleClearAll = () => {
    setSearchInput("");
    router.replace(pathname, { scroll: false });
  };

  // Build active filters list via helper
  const activeFiltersList = useMemo(
    () =>
      buildActiveFiltersList({
        urlSearch,
        minPrice,
        maxPrice,
        selectedPublisherIds,
        selectedAuthorIds,
        selectedCategoryIds,
        labelLookupMap,
        onRemoveSearch: () => updateUrlParams({ search: "", page: 1 }),
        onClearPrice: handleClearPrice,
        onTogglePublisher: handleTogglePublisher,
        onToggleAuthor: handleToggleAuthor,
        onToggleCategory: handleToggleCategory,
      }),
    [
      urlSearch,
      minPrice,
      maxPrice,
      selectedPublisherIds,
      selectedAuthorIds,
      selectedCategoryIds,
      labelLookupMap,
      updateUrlParams,
    ],
  );

  return {
    page,
    limit,
    urlSearch,
    sortOption,
    currentSortConfig,
    minPrice,
    maxPrice,
    selectedAuthorIds,
    selectedPublisherIds,
    selectedCategoryIds,
    searchInput,
    setSearchInput,
    dynamicLabels,
    activeFiltersList,
    updateUrlParams,
    handleTogglePublisher,
    handleToggleAuthor,
    handleToggleCategory,
    handleApplyPrice,
    handleClearPrice,
    handleClearAll,
  };
}
