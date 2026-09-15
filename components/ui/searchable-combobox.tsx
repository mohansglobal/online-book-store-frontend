"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, Search, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
  secondaryLabel?: string;
}

export interface SearchableComboboxProps {
  id?: string;
  value?: string;
  selectedLabel?: string;
  onValueChange: (value: string, option?: ComboboxOption) => void;
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  searchValue: string;
  onSearchChange: (search: string) => void;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  required?: boolean;
  allowClear?: boolean;
}

export function SearchableCombobox({
  id,
  value,
  selectedLabel,
  onValueChange,
  options,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  isLoading = false,
  searchValue,
  onSearchChange,
  disabled = false,
  className,
  triggerClassName,
  allowClear = true,
}: SearchableComboboxProps) {
  const [open, setOpen] = React.useState(false);

  // Determine display label: prop selectedLabel, or find matching option, or placeholder
  const activeOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedLabel || activeOption?.label;

  const handleSelect = (option: ComboboxOption) => {
    if (value === option.value && allowClear) {
      onValueChange("", undefined);
    } else {
      onValueChange(option.value, option);
    }
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange("", undefined);
    onSearchChange("");
  };

  return (
    <div className={cn("relative w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            id={id}
            disabled={disabled}
            aria-expanded={open}
            className={cn(
              "flex h-10 w-full cursor-pointer items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors hover:border-accent/50 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:cursor-not-allowed disabled:bg-surface-soft/80 disabled:text-muted-foreground disabled:opacity-75 disabled:border-border/60",
              !displayLabel && "text-muted-foreground",
              triggerClassName,
            )}
          >
            <span className="truncate text-left font-normal">
              {displayLabel || placeholder}
            </span>
            <div className="ml-2 flex shrink-0 items-center gap-1 opacity-60">
              {value && allowClear && !disabled && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClear}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleClear(e as unknown as React.MouseEvent);
                    }
                  }}
                  className="rounded-full p-0.5 hover:bg-surface-hover hover:text-foreground"
                  title="Clear selection"
                  aria-label="Clear selection"
                >
                  <X className="h-3 w-3" />
                </span>
              )}
              <ChevronsUpDown className="h-4 w-4" />
            </div>
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={4}
          className="w-[var(--radix-popover-trigger-width)] min-w-[240px] max-w-[400px] overflow-hidden rounded-lg border border-border bg-surface p-0 shadow-lg"
        >
          {/* Search Header */}
          <div className="flex items-center border-b border-border px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="flex h-7 w-full rounded-md bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground sm:text-sm"
              autoFocus
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="cursor-pointer rounded p-0.5 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                aria-label="Clear search text"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Results List */}
          <div className="max-h-56 overflow-y-auto p-1.5 text-sm">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-accent" />
                <span>Loading items...</span>
              </div>
            ) : options.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">
                {emptyMessage}
              </div>
            ) : (
              <div className="space-y-0.5">
                {options.map((option) => {
                  const isSelected = value === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={cn(
                        "flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-2 text-left text-xs transition-colors sm:text-sm",
                        isSelected
                          ? "bg-accent/10 font-semibold text-accent"
                          : "text-foreground hover:bg-surface-hover",
                      )}
                    >
                      <div className="flex min-w-0 flex-col pr-2">
                        <span className="truncate">{option.label}</span>
                        {option.secondaryLabel && (
                          <span className="truncate text-[11px] text-muted-foreground">
                            {option.secondaryLabel}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 shrink-0 text-accent" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
