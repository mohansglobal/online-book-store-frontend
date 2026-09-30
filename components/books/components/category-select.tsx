"use client";

import { useMemo, useState } from "react";
import { useInfiniteCategories, type Category } from "@/features/categories";
import { useDebounce } from "@/hooks/use-debounce";
import { SearchableCombobox, type ComboboxOption } from "@/components/ui/searchable-combobox";

export interface CategorySelectProps {
  id?: string;
  value?: string;
  selectedLabel?: string;
  onChange: (value: string, category?: Category) => void;
  required?: boolean;
  disabled?: boolean;
}

export function CategorySelect({
  id = "category",
  value = "",
  selectedLabel: externalSelectedLabel,
  onChange,
  required = false,
  disabled = false,
}: CategorySelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [internalSelectedLabel, setInternalSelectedLabel] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteCategories({
    limit: 20,
    search: debouncedSearch.trim() || undefined,
  });

  const categories: Category[] = useMemo(() => {
    const pages = data?.pages ?? [];
    return pages.flatMap((page) => page.data ?? []);
  }, [data?.pages]);

  const options: ComboboxOption[] = useMemo(() => {
    return categories.map((cat) => ({
      value: cat._id || cat.slug,
      label: cat.name,
      secondaryLabel: [
        cat.nameBn,
        cat.bookCount !== undefined ? `${cat.bookCount} books` : undefined,
      ]
        .filter(Boolean)
        .join(" • "),
    }));
  }, [categories]);

  const handleValueChange = (newValue: string, option?: ComboboxOption) => {
    const selectedCategory = categories.find(
      (c) => (c._id || c.slug) === newValue,
    );
    setInternalSelectedLabel(option?.label || "");
    onChange(newValue, selectedCategory);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <SearchableCombobox
      id={id}
      value={value}
      selectedLabel={externalSelectedLabel || internalSelectedLabel}
      onValueChange={handleValueChange}
      options={options}
      placeholder="Select Category"
      searchPlaceholder="Search categories..."
      emptyMessage="No categories found."
      isLoading={isLoading}
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      required={required}
      disabled={disabled}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      onLoadMore={handleLoadMore}
    />
  );
}
