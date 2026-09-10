"use client";

import { useEffect, useMemo, useState } from "react";
import type { FilterItem } from "../components/books-filter-sidebar";

export function useRetainedFilterItems(
  rawItems: FilterItem[],
  selectedIds: string[],
) {
  const [savedItems, setSavedItems] = useState<Record<string, FilterItem>>({});

  useEffect(() => {
    if (selectedIds.length > 0 && rawItems.length > 0) {
      setSavedItems((prev) => {
        const next = { ...prev };
        let changed = false;
        rawItems.forEach((item) => {
          if (
            selectedIds.includes(item._id) ||
            (item.slug && selectedIds.includes(item.slug))
          ) {
            if (!next[item._id]) {
              next[item._id] = item;
              if (item.slug) next[item.slug] = item;
              changed = true;
            }
          }
        });
        return changed ? next : prev;
      });
    }
  }, [selectedIds, rawItems]);

  const displayedItems = useMemo(() => {
    const list = [...rawItems];
    selectedIds.forEach((id) => {
      const saved = savedItems[id];
      if (
        saved &&
        !list.some(
          (p) =>
            p._id === saved._id ||
            (p.slug && saved.slug && p.slug === saved.slug),
        )
      ) {
        list.unshift(saved);
      }
    });
    return list;
  }, [rawItems, selectedIds, savedItems]);

  const saveItem = (id: string, item: FilterItem) => {
    setSavedItems((prev) => ({
      ...prev,
      [item._id]: item,
      ...(item.slug ? { [item.slug]: item } : {}),
    }));
  };

  return { displayedItems, saveItem };
}
