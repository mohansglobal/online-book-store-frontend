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
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
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
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
}: SearchableComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const listParentRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const observerRef = React.useRef<IntersectionObserver | null>(null);

  // Setup intersection observer on bottom sentinel for infinite scrolling
  const loadMoreSentinelRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (!node || !hasNextPage || isFetchingNextPage || !onLoadMore) {
        return;
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry?.isIntersecting) {
            onLoadMore();
          }
        },
        { root: listParentRef.current, threshold: 0.1 },
      );

      observerRef.current.observe(node);
    },
    [hasNextPage, isFetchingNextPage, onLoadMore],
  );

  // Fallback scroll listener for infinite load
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!hasNextPage || isFetchingNextPage || !onLoadMore) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;

    if (isNearBottom) {
      onLoadMore();
    }
  };

  // Determine display label: selectedLabel prop, or matching option label, only when a value exists
  const activeOption = value ? options.find((opt) => opt.value === value) : undefined;
  const displayLabel = value ? (selectedLabel || activeOption?.label || "") : "";

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

  // Key navigation from search input to cards
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      if (!e.shiftKey && options.length > 0) {
        e.preventDefault();
        e.stopPropagation();
        itemRefs.current[0]?.focus();
      }
    } else if (e.key === "ArrowDown") {
      if (options.length > 0) {
        e.preventDefault();
        e.stopPropagation();
        itemRefs.current[0]?.focus();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  // Key navigation between option cards
  const handleItemKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
    option: ComboboxOption,
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      handleSelect(option);
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      if (e.shiftKey) {
        if (index > 0) {
          itemRefs.current[index - 1]?.focus();
        } else {
          searchInputRef.current?.focus();
        }
      } else {
        if (index < options.length - 1) {
          itemRefs.current[index + 1]?.focus();
        } else if (!hasNextPage) {
          searchInputRef.current?.focus();
        }
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      e.stopPropagation();

      if (index < options.length - 1) {
        itemRefs.current[index + 1]?.focus();
      } else if (!hasNextPage) {
        searchInputRef.current?.focus();
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      e.stopPropagation();

      if (index > 0) {
        itemRefs.current[index - 1]?.focus();
      } else {
        searchInputRef.current?.focus();
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
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
            aria-haspopup="listbox"
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
          <div className="flex items-center border-b border-border px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="flex h-7 w-full rounded-md bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground sm:text-sm"
              autoFocus
            />
            {searchValue && (
              <button
                type="button"
                tabIndex={-1}
                onClick={() => {
                  onSearchChange("");
                  searchInputRef.current?.focus();
                }}
                className="cursor-pointer rounded p-0.5 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                aria-label="Clear search text"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div
            ref={listParentRef}
            onScroll={handleScroll}
            role="listbox"
            className="max-h-60 overflow-y-auto p-1.5 text-sm"
          >
            {isLoading && options.length === 0 ? (
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
                {options.map((option, index) => {
                  const isSelected = value === option.value;

                  return (
                    <button
                      key={option.value}
                      ref={(el) => {
                        itemRefs.current[index] = el;
                      }}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(option)}
                      onKeyDown={(e) => handleItemKeyDown(e, index, option)}
                      onFocus={(e) => {
                        if (typeof e.currentTarget.scrollIntoView === "function") {
                          e.currentTarget.scrollIntoView({ block: "nearest" });
                        }
                      }}
                      className={cn(
                        "flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition-colors sm:text-sm outline-none",
                        isSelected
                          ? "bg-accent/15 font-semibold text-accent ring-1 ring-accent/30"
                          : "text-foreground hover:bg-surface-hover",
                        "focus:bg-accent/15 focus:text-accent focus:ring-1 focus:ring-accent/50 focus-visible:bg-accent/15 focus-visible:text-accent focus-visible:ring-1 focus-visible:ring-accent",
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

                {hasNextPage && (
                  <div
                    ref={loadMoreSentinelRef}
                    className="flex items-center justify-center py-2 text-xs text-muted-foreground"
                  >
                    {isFetchingNextPage ? (
                      <div className="flex items-center gap-1.5">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
                        <span>Loading more...</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={onLoadMore}
                        className="cursor-pointer font-medium text-accent hover:underline"
                      >
                        Load more
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
