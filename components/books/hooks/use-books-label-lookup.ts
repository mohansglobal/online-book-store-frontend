"use client";

import { useMemo } from "react";
import type { ApiBook } from "@/features/books/types/book.types";

interface UseBooksLabelLookupProps {
  dynamicLabels: Record<string, string>;
  categoriesData?: { data?: Array<{ _id?: string; name?: string; slug?: string }> };
  authorsData?: { data?: Array<{ _id?: string; name?: string; slug?: string }> };
  publishersData?: { data?: Array<{ _id?: string; name?: string; slug?: string }> };
  categoryDetail?: { data?: { _id?: string; name?: string; slug?: string } };
  apiBooks?: ApiBook[];
}

export function useBooksLabelLookup({
  dynamicLabels,
  categoriesData,
  authorsData,
  publishersData,
  categoryDetail,
  apiBooks,
}: UseBooksLabelLookupProps) {
  return useMemo(() => {
    const map: Record<string, string> = { ...dynamicLabels };

    if (categoriesData?.data && Array.isArray(categoriesData.data)) {
      categoriesData.data.forEach((c) => {
        if (c?._id && c?.name) map[c._id] = c.name;
        if (c?.slug && c?.name) map[c.slug] = c.name;
      });
    }

    if (authorsData?.data && Array.isArray(authorsData.data)) {
      authorsData.data.forEach((a) => {
        if (a?._id && a?.name) map[a._id] = a.name;
        if (a?.slug && a?.name) map[a.slug] = a.name;
      });
    }

    if (publishersData?.data && Array.isArray(publishersData.data)) {
      publishersData.data.forEach((p) => {
        if (p?._id && p?.name) map[p._id] = p.name;
        if (p?.slug && p?.name) map[p.slug] = p.name;
      });
    }

    if (categoryDetail?.data) {
      const cd = categoryDetail.data;
      if (cd._id && cd.name) map[cd._id] = cd.name;
      if (cd.slug && cd.name) map[cd.slug] = cd.name;
    }

    if (apiBooks && Array.isArray(apiBooks)) {
      apiBooks.forEach((book) => {
        book.categories?.forEach((c) => {
          if (c?._id && c?.name) map[c._id] = c.name;
          if (c?.slug && c?.name) map[c.slug] = c.name;
        });
        book.authors?.forEach((a) => {
          if (a?._id && a?.name) map[a._id] = a.name;
          if (a?.slug && a?.name) map[a.slug] = a.name;
        });
        if (book.publisher?._id && book.publisher?.name) {
          map[book.publisher._id] = book.publisher.name;
          if (book.publisher.slug) map[book.publisher.slug] = book.publisher.name;
        }
      });
    }

    return map;
  }, [
    dynamicLabels,
    categoriesData,
    authorsData,
    publishersData,
    categoryDetail,
    apiBooks,
  ]);
}
