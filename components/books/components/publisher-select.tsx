"use client";

import { useState } from "react";
import { usePublishers, type Publisher } from "@/features/publishers";
import { useDebounce } from "@/hooks/use-debounce";
import { SearchableCombobox, type ComboboxOption } from "@/components/ui/searchable-combobox";

export interface PublisherSelectProps {
  id?: string;
  value?: string;
  selectedLabel?: string;
  onChange: (value: string, publisher?: Publisher) => void;
  required?: boolean;
  disabled?: boolean;
}

export function PublisherSelect({
  id = "publisher",
  value = "",
  selectedLabel: externalSelectedLabel,
  onChange,
  required = false,
  disabled = false,
}: PublisherSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [internalSelectedLabel, setInternalSelectedLabel] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data, isLoading } = usePublishers({
    limit: 10000,
    search: debouncedSearch.trim() || undefined,
  });

  const publishers = data?.data || [];

  const options: ComboboxOption[] = publishers.map((pub) => ({
    value: pub._id || pub.slug,
    label: pub.name,
    secondaryLabel: pub.nameBn,
  }));

  const handleValueChange = (newValue: string, option?: ComboboxOption) => {
    const selectedPublisher = publishers.find(
      (p) => (p._id || p.slug) === newValue,
    );
    setInternalSelectedLabel(option?.label || "");
    onChange(newValue, selectedPublisher);
  };

  return (
    <SearchableCombobox
      id={id}
      value={value}
      selectedLabel={externalSelectedLabel || internalSelectedLabel}
      onValueChange={handleValueChange}
      options={options}
      placeholder="Select Publisher"
      searchPlaceholder="Search publishers..."
      emptyMessage="No publishers found."
      isLoading={isLoading}
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      required={required}
      disabled={disabled}
    />
  );
}
