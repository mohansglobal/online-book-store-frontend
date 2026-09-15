"use client";

import { useState } from "react";
import { useCountries, type Country } from "@/features/countries";
import { useDebounce } from "@/hooks/use-debounce";
import { SearchableCombobox, type ComboboxOption } from "@/components/ui/searchable-combobox";

export interface CountrySelectProps {
  id?: string;
  value?: string;
  selectedLabel?: string;
  onChange: (value: string, country?: Country) => void;
  required?: boolean;
  disabled?: boolean;
}

export function CountrySelect({
  id = "country",
  value = "",
  selectedLabel: externalSelectedLabel,
  onChange,
  required = false,
  disabled = false,
}: CountrySelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [internalSelectedLabel, setInternalSelectedLabel] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data, isLoading } = useCountries({
    limit: 10000,
    search: debouncedSearch.trim() || undefined,
  });

  const countries = data?.data || [];

  const options: ComboboxOption[] = countries.map((c) => ({
    value: c._id || c.code,
    label: c.name,
    secondaryLabel: c.code ? `${c.code}${c.currency ? ` • ${c.currency}` : ""}` : undefined,
  }));

  const handleValueChange = (newValue: string, option?: ComboboxOption) => {
    const selectedCountry = countries.find(
      (c) => (c._id || c.code) === newValue || c.code === newValue,
    );
    setInternalSelectedLabel(option?.label || selectedCountry?.name || "");
    onChange(newValue, selectedCountry);
  };

  return (
    <SearchableCombobox
      id={id}
      value={value}
      selectedLabel={externalSelectedLabel || internalSelectedLabel}
      onValueChange={handleValueChange}
      options={options}
      placeholder="Select Country"
      searchPlaceholder="Search countries..."
      emptyMessage="No countries found."
      isLoading={isLoading}
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      required={required}
      disabled={disabled}
    />
  );
}
