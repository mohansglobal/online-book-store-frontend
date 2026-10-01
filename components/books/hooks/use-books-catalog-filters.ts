"use client";

import { useCallback, useMemo, useState, useEffect, useRef } from "react";
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

export interface BooksUrlUpdates {
  page?: number;
  search?: string;
  publisher?: string[] | string;
  author?: string[] | string;
  category?: string[] | string;
  minPrice?: number | null;
  maxPrice?: number | null;
  sort?: SortOption;
}

function parseFilterParam(paramValue: string | null, initialValue?: string): string[] {
  const raw = paramValue !== null && paramValue !== undefined ? paramValue : initialValue || "";
  if (!raw.trim()) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function setListParam(params: URLSearchParams, key: string, val: string[] | string | undefined) {
  if (val === undefined) return;
  const str = Array.isArray(val) ? val.filter(Boolean).join(",") : val.trim();
  if (str) params.set(key, str);
  else params.delete(key);
}

function setNumericParam(params: URLSearchParams, key: string, val: number | null | undefined) {
  if (val === undefined) return;
  if (val !== null && !isNaN(val)) params.set(key, String(val));
  else params.delete(key);
}

function toggleMultiId(currentList: string[], targetId: string): string[] {
  return currentList.includes(targetId)
    ? currentList.filter((id) => id !== targetId)
    : [...currentList, targetId];
}

function getLabelUpdates(id: string, item?: FilterItem): Record<string, string> {
  if (!item?.name) return {};
  return {
    [id]: item.name,
    ...(item.slug ? { [item.slug]: item.name } : {}),
    ...(item._id ? { [item._id]: item.name } : {}),
  };
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

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch);
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [dynamicLabels, setDynamicLabels] = useState<Record<string, string>>({});

  // Sync search input state when URL search changes externally
  if (prevUrlSearch !== urlSearch) {
    setPrevUrlSearch(urlSearch);
    setSearchInput(urlSearch);
  }

  const clearTimer = () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
  };

  useEffect(() => clearTimer, []);

  // Synchronize search params to URL
  const updateUrlParams = useCallback(
    (updates: BooksUrlUpdates) => {
      const params = new URLSearchParams(searchParams.toString());

      const nextPage = updates.page !== undefined ? updates.page : page;
      if (nextPage > 1) params.set("page", String(nextPage));
      else params.delete("page");

      const nextSearch = updates.search !== undefined ? updates.search : urlSearch;
      if (nextSearch.trim()) params.set("search", nextSearch.trim());
      else params.delete("search");

      setListParam(params, "publisher", updates.publisher);
      setListParam(params, "author", updates.author);
      setListParam(params, "category", updates.category);

      setNumericParam(params, "minPrice", updates.minPrice);
      setNumericParam(params, "maxPrice", updates.maxPrice);

      const nextSort = updates.sort !== undefined ? updates.sort : sortOption;
      if (nextSort && nextSort !== "newest") params.set("sort", nextSort);
      else params.delete("sort");

      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(targetUrl, { scroll: false });
    },
    [searchParams, pathname, router, page, urlSearch, sortOption],
  );

  const applyDynamicLabels = (id: string, item?: FilterItem) => {
    const labels = getLabelUpdates(id, item);
    if (Object.keys(labels).length > 0) {
      setDynamicLabels((prev) => ({ ...prev, ...labels }));
    }
  };

  const handleSearchInputChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      clearTimer();
      searchTimeoutRef.current = setTimeout(() => {
        updateUrlParams({ search: value.trim(), page: 1 });
      }, 350);
    },
    [updateUrlParams],
  );

  const handleSetSearchInput = useCallback(
    (value: string | ((prev: string) => string)) => {
      if (typeof value === "string") {
        handleSearchInputChange(value);
      } else {
        setSearchInput(value);
      }
    },
    [handleSearchInputChange],
  );

  const handleSearchSubmit = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      clearTimer();
      updateUrlParams({ search: searchInput.trim(), page: 1 });
    },
    [searchInput, updateUrlParams],
  );

  const handleClearSearch = useCallback(() => {
    clearTimer();
    setSearchInput("");
    updateUrlParams({ search: "", page: 1 });
  }, [updateUrlParams]);

  const handleTogglePublisher = useCallback(
    (pubId: string, item?: FilterItem) => {
      applyDynamicLabels(pubId, item);
      updateUrlParams({ publisher: toggleMultiId(selectedPublisherIds, pubId), page: 1 });
    },
    [selectedPublisherIds, updateUrlParams],
  );

  const handleToggleAuthor = useCallback(
    (authId: string, item?: FilterItem) => {
      applyDynamicLabels(authId, item);
      updateUrlParams({ author: toggleMultiId(selectedAuthorIds, authId), page: 1 });
    },
    [selectedAuthorIds, updateUrlParams],
  );

  const handleToggleCategory = useCallback(
    (catId: string, item?: FilterItem) => {
      applyDynamicLabels(catId, item);
      updateUrlParams({ category: toggleMultiId(selectedCategoryIds, catId), page: 1 });
    },
    [selectedCategoryIds, updateUrlParams],
  );

  const handleApplyPrice = useCallback((min?: number, max?: number) => {
    updateUrlParams({ minPrice: min ?? null, maxPrice: max ?? null, page: 1 });
  }, [updateUrlParams]);

  const handleClearPrice = useCallback(() => {
    updateUrlParams({ minPrice: null, maxPrice: null, page: 1 });
  }, [updateUrlParams]);

  const handleClearAll = useCallback(() => {
    clearTimer();
    setSearchInput("");
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

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
        onRemoveSearch: () => {
          setSearchInput("");
          updateUrlParams({ search: "", page: 1 });
        },
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
      handleClearPrice,
      handleTogglePublisher,
      handleToggleAuthor,
      handleToggleCategory,
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
    setSearchInput: handleSetSearchInput,
    handleSearchInputChange,
    handleSearchSubmit,
    handleClearSearch,
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
