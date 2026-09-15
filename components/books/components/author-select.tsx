"use client";

import { useState } from "react";
import { useAuthors, type Author } from "@/features/authors";
import { useDebounce } from "@/hooks/use-debounce";
import { SearchableCombobox, type ComboboxOption } from "@/components/ui/searchable-combobox";

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

  const { data, isLoading } = useAuthors({
    limit: 10000,
    search: debouncedSearch.trim() || undefined,
  });

  const authors = data?.data || [];

  const options: ComboboxOption[] = authors.map((author) => ({
    value: author._id || author.slug,
    label: author.name,
    secondaryLabel: author.nameBn,
  }));

  const handleValueChange = (newValue: string, option?: ComboboxOption) => {
    const selectedAuthor = authors.find(
      (a) => (a._id || a.slug) === newValue,
    );
    setInternalSelectedLabel(option?.label || "");
    onChange(newValue, selectedAuthor);
  };

  return (
    <SearchableCombobox
      id={id}
      value={value}
      selectedLabel={externalSelectedLabel || internalSelectedLabel}
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
    />
  );
}
