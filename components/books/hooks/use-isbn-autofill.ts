"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useIsbnLookup, type CanonicalBook } from "@/features/books";
import { useDebounce } from "@/hooks/use-debounce";
import { resolveCoverUrl } from "@/lib/image-url";

export interface AutofillCallbacks {
  setTitleEn: (v: string) => void;
  setTitleBn: (v: string) => void;
  setPublisher: (id: string, name: string) => void;
  setAuthor: (id: string, name: string) => void;
  setCategory: (id: string, name: string) => void;
  setCountry: (id: string, name: string) => void;
  setDescription: (v: string) => void;
  setEdition: (v: string) => void;
  setPages: (v: string) => void;
  setSearchTag: (v: string) => void;
  setLanguage: (v: string) => void;
  setCoverPreview: (v: string | null) => void;
  setExtraPreviews: (v: string[]) => void;
  setMrp?: (v: string) => void;
}

export function useIsbnAutofill(isbn: string, callbacks: AutofillCallbacks) {
  const trimmedIsbn = isbn.trim();
  const debouncedIsbn = useDebounce(trimmedIsbn, 400);
  const lastAutofilledIsbn = useRef<string | null>(null);

  const isQueryEnabled = trimmedIsbn.length >= 3 && debouncedIsbn.length >= 3;

  const {
    data: lookupResponse,
    isLoading: isLookingUpIsbn,
    isFetching: isFetchingIsbn,
  } = useIsbnLookup(debouncedIsbn, isQueryEnabled);

  const hasValidInput = trimmedIsbn.length >= 3 && debouncedIsbn.length >= 3;
  const canonicalBook = hasValidInput ? lookupResponse?.data : undefined;
  const isBookFound = Boolean(hasValidInput && lookupResponse?.exists && canonicalBook);
  const isAlreadyListed = Boolean(hasValidInput && lookupResponse?.alreadyListedBySeller);
  const isChecking = hasValidInput && (isLookingUpIsbn || isFetchingIsbn);

  useEffect(() => {
    if (!hasValidInput) {
      lastAutofilledIsbn.current = null;
      return;
    }

    if (
      isBookFound &&
      canonicalBook &&
      lastAutofilledIsbn.current !== canonicalBook.isbn
    ) {
      lastAutofilledIsbn.current = canonicalBook.isbn;

      if (canonicalBook.title) callbacks.setTitleEn(canonicalBook.title);
      if (canonicalBook.titleBn) callbacks.setTitleBn(canonicalBook.titleBn);

      if (canonicalBook.publisher) {
        callbacks.setPublisher(
          canonicalBook.publisher._id,
          canonicalBook.publisher.name,
        );
      }

      if (canonicalBook.authors?.[0]) {
        callbacks.setAuthor(
          canonicalBook.authors[0]._id,
          canonicalBook.authors[0].name,
        );
      }

      if (canonicalBook.categories?.[0]) {
        callbacks.setCategory(
          canonicalBook.categories[0]._id,
          canonicalBook.categories[0].name,
        );
      }

      if (canonicalBook.country) {
        callbacks.setCountry(
          canonicalBook.country._id,
          canonicalBook.country.name,
        );
      }

      if (canonicalBook.description) callbacks.setDescription(canonicalBook.description);
      if (canonicalBook.edition) callbacks.setEdition(canonicalBook.edition);
      if (canonicalBook.pages) callbacks.setPages(String(canonicalBook.pages));

      if (canonicalBook.searchTags && canonicalBook.searchTags.length > 0) {
        callbacks.setSearchTag(canonicalBook.searchTags.join(", "));
      }

      if (canonicalBook.language) {
        const langLower = canonicalBook.language.toLowerCase();
        const isBengali = langLower === "bengali" || langLower === "bn";
        callbacks.setLanguage(isBengali ? "bn" : "en");
      }

      if (canonicalBook.coverImage) {
        callbacks.setCoverPreview(resolveCoverUrl(canonicalBook.coverImage));
      }

      if (canonicalBook.images && canonicalBook.images.length > 0) {
        callbacks.setExtraPreviews(
          canonicalBook.images.map((img) => resolveCoverUrl(img)).slice(0, 3),
        );
      }

      // Prefill canonical MRP / price
      const rawPrice =
        canonicalBook.mrp ??
        canonicalBook.originalPrice ??
        canonicalBook.price ??
        canonicalBook.priceIn ??
        (canonicalBook.mrpInPaise ? canonicalBook.mrpInPaise / 100 : undefined);

      if (rawPrice !== undefined && rawPrice !== null && callbacks.setMrp) {
        const parsedPrice =
          typeof rawPrice === "number"
            ? rawPrice
            : parseFloat(String(rawPrice).replace(/[^0-9.]/g, "")) || 0;

        if (parsedPrice > 0) {
          callbacks.setMrp(String(parsedPrice));
        }
      }

      toast.success(
        `Found book "${canonicalBook.title}" in catalog! Canonical data locked.`,
      );
    }
  }, [isBookFound, canonicalBook, callbacks]);

  const clearAutofillRef = () => {
    lastAutofilledIsbn.current = null;
  };

  return {
    debouncedIsbn,
    lookupResponse,
    canonicalBook,
    isBookFound,
    isAlreadyListed,
    isChecking,
    clearAutofillRef,
  };
}
