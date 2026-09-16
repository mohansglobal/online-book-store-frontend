// Helper functions to construct CreateBookListingInput payloads
import {
  FALLBACK_BOOK_COVER,
  type CanonicalBook,
  type CreateBookListingInput,
} from "@/features/books";

export interface AddBookFormState {
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
  countryId: string;
  description: string;
  coverPreview: string | null;
  extraPreviews: string[];
}

// Builds payload for an existing canonical catalog book (Scenario B)
export function buildExistingBookPayload(
  canonicalBook: CanonicalBook,
  form: AddBookFormState,
): CreateBookListingInput {
  const mrpNumber = parseFloat(form.mrp);
  const sellingNumber = form.sellingPrice
    ? parseFloat(form.sellingPrice)
    : mrpNumber;
  const stockNumber = parseInt(form.stock, 10);

  const mrpInPaise = Math.round(mrpNumber * 100);
  const sellingPriceInPaise = Math.round(sellingNumber * 100);
  const cleanSku = form.sku.trim() || undefined;
  const bookIsbn = canonicalBook.isbn || form.isbn.trim() || undefined;
  const images = form.extraPreviews.length > 0 ? form.extraPreviews : undefined;

  return {
    book: canonicalBook._id,
    isbn: bookIsbn,
    images,
    mrpInPaise,
    sellingPriceInPaise,
    stock: stockNumber,
    sku: cleanSku,
  };
}

// Builds payload for a brand new book entry (Scenario A)
export function buildNewBookPayload(
  form: AddBookFormState,
): CreateBookListingInput {
  const mrpNumber = parseFloat(form.mrp);
  const sellingNumber = form.sellingPrice
    ? parseFloat(form.sellingPrice)
    : mrpNumber;
  const stockNumber = parseInt(form.stock, 10);

  const mrpInPaise = Math.round(mrpNumber * 100);
  const sellingPriceInPaise = Math.round(sellingNumber * 100);
  const cleanSku = form.sku.trim() || undefined;
  const cleanIsbn = form.isbn.trim() || undefined;
  const parsedPages = form.pages ? parseInt(form.pages, 10) : undefined;

  const formattedTags = form.searchTag
    ? form.searchTag
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : undefined;

  const resolvedLanguage = form.language === "bn" ? "Bengali" : "English";
  const coverImage = form.coverPreview || FALLBACK_BOOK_COVER;
  const images = form.extraPreviews.length > 0 ? form.extraPreviews : undefined;

  return {
    title: form.titleEn.trim(),
    titleBn: form.titleBn.trim(),
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
