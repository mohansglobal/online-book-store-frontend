import type { ActiveFilterItem } from "../components/books-active-filters";

export interface BuildActiveFiltersParams {
  urlSearch?: string;
  minPrice?: number;
  maxPrice?: number;
  selectedPublisherIds: string[];
  selectedAuthorIds: string[];
  selectedCategoryIds: string[];
  labelLookupMap: Record<string, string>;
  onRemoveSearch: () => void;
  onClearPrice: () => void;
  onTogglePublisher: (id: string) => void;
  onToggleAuthor: (id: string) => void;
  onToggleCategory: (id: string) => void;
}

export function buildActiveFiltersList({
  urlSearch,
  minPrice,
  maxPrice,
  selectedPublisherIds,
  selectedAuthorIds,
  selectedCategoryIds,
  labelLookupMap,
  onRemoveSearch,
  onClearPrice,
  onTogglePublisher,
  onToggleAuthor,
  onToggleCategory,
}: BuildActiveFiltersParams): ActiveFilterItem[] {
  const list: ActiveFilterItem[] = [];

  if (urlSearch && urlSearch.trim()) {
    list.push({
      id: "search",
      label: urlSearch.trim(),
      type: "search",
      onRemove: onRemoveSearch,
    });
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceLabel =
      minPrice !== undefined && maxPrice !== undefined
        ? `Price: ₹${minPrice} - ₹${maxPrice}`
        : minPrice !== undefined
          ? `Price: ≥ ₹${minPrice}`
          : `Price: ≤ ₹${maxPrice}`;
    list.push({
      id: "price-range",
      label: priceLabel,
      type: "price",
      onRemove: onClearPrice,
    });
  }

  selectedPublisherIds.forEach((id) => {
    list.push({
      id,
      label: labelLookupMap[id] || id,
      type: "publisher",
      onRemove: () => onTogglePublisher(id),
    });
  });

  selectedAuthorIds.forEach((id) => {
    list.push({
      id,
      label: labelLookupMap[id] || id,
      type: "author",
      onRemove: () => onToggleAuthor(id),
    });
  });

  selectedCategoryIds.forEach((id) => {
    list.push({
      id,
      label: labelLookupMap[id] || id,
      type: "category",
      onRemove: () => onToggleCategory(id),
    });
  });

  return list;
}
