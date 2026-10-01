"use client";

import { useMemo, useState } from "react";
import { useInfiniteAuthors, type Author } from "@/features/authors";
import { useDebounce } from "@/hooks/use-debounce";
import {
  SearchableCombobox,
  type ComboboxOption,
} from "@/components/ui/searchable-combobox";

export interface AuthorSelectProps {
  id?: string;
  value?: string;
  selectedLabel?: string;
  onChange: (value: string, author?: Author) => void;
  required?: boolean;
  disabled?: boolean;
}

export function AuthorSelect({
  id = "author",
  value = "",
  selectedLabel: externalSelectedLabel,
  onChange,
  required = false,
  disabled = false,
}: AuthorSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [internalSelectedLabel, setInternalSelectedLabel] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Paginated infinite query fetching 20 authors per batch sorted A to Z
  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteAuthors({
    limit: 20,
    search: debouncedSearch.trim() || undefined,
    sortOrder: "asce",
  });

  const authors: Author[] = useMemo(() => {
    const pages = data?.pages ?? [];
    return pages.flatMap((page) => page.data ?? []);
  }, [data?.pages]);

  const options: ComboboxOption[] = useMemo(() => {
    return authors.map((author) => ({
      value: author._id || author.slug,
      label: author.name,
      secondaryLabel: author.nameBn,
    }));
  }, [authors]);

  const handleValueChange = (newValue: string, option?: ComboboxOption) => {
    const selectedAuthor = authors.find(
      (a) => (a._id || a.slug) === newValue,
    );
    setInternalSelectedLabel(option?.label || "");
    onChange(newValue, selectedAuthor);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const effectiveSelectedLabel = value
    ? (externalSelectedLabel !== undefined ? externalSelectedLabel : internalSelectedLabel)
    : "";

  return (
    <SearchableCombobox
      id={id}
      value={value}
      selectedLabel={effectiveSelectedLabel}
      onValueChange={handleValueChange}
      options={options}
      placeholder="Select Author"
      searchPlaceholder="Search authors..."
      emptyMessage="No authors found."
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
