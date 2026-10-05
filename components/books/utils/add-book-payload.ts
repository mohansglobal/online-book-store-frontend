// Helper functions to construct CreateBookListingInput payloads
import {
  FALLBACK_BOOK_COVER,
  type CreateBookListingInput,
} from "@/features/books";

export interface AddBookFormState {
  bookId?: string;
  isbn: string;
  titleEn: string;
  titleBn: string;
  publisherId: string;
  language: string;
  categoryId: string;
  authorId: string;
  searchTag: string;
  pages: string;
  edition: string;
  mrp: string;
  sellingPrice: string;
  stock: string;
  sku: string;
  countryId?: string;
  description: string;
  coverPreview: string | null;
  extraPreviews: string[];
}

// Builds payload for a book listing entry
export function buildBookListingPayload(
  form: AddBookFormState,
): CreateBookListingInput {
  const mrpNumber = parseFloat(form.mrp);

  const sellingNumber = form.sellingPrice
    ? parseFloat(form.sellingPrice)
    : mrpNumber;

  const stockNumber = parseInt(form.stock, 10) || 0;

  const mrpInPaise = Math.round(mrpNumber * 100);

  const sellingPriceInPaise = Math.round(sellingNumber * 100);

  const cleanSku = form.sku.trim() || undefined;

  const cleanIsbn = form.isbn.trim() || undefined;

  const parsedPages = form.pages ? parseInt(form.pages, 10) : undefined;

  const parsedTags = form.searchTag
    ? form.searchTag
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  const formattedTags = parsedTags.length > 0 ? parsedTags : undefined;

  const resolvedLanguage = form.language === "bn" ? "Bengali" : "English";

  const coverImage = form.coverPreview || FALLBACK_BOOK_COVER;

  const images = form.extraPreviews.length > 0 ? form.extraPreviews : undefined;
  
  return {
    book: form.bookId || undefined,
    title: form.titleEn.trim(),
    titleBn: (form.titleBn && form.titleBn.trim()) || form.titleEn.trim(),
    isbn: cleanIsbn,
    authors: [form.authorId],
    publisher: form.publisherId,
    categories: [form.categoryId],
    description: form.description.trim() || undefined,
    coverImage,
    images,
    language: resolvedLanguage,
    format: "PAPERBACK",
    pages: parsedPages,
    edition: form.edition.trim() || undefined,
    country: form.countryId || undefined,
    searchTags: formattedTags,
    mrpInPaise,
    sellingPriceInPaise,
    stock: stockNumber,
    sku: cleanSku,
  };
}

// Backward-compatibility alias
export const buildNewBookPayload = buildBookListingPayload;
