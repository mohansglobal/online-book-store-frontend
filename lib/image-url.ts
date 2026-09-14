import { FALLBACK_BOOK_COVER } from "@/features/books/types/book.types";

export function resolveCoverUrl(image?: string | null): string {
  if (!image || typeof image !== "string" || !image.trim()) {
    return FALLBACK_BOOK_COVER;
  }
  const trimmed = image.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
    return trimmed;
  }
  if (!trimmed.includes("/")) {
    return `https://indobanglabooks.in/upload/product/${trimmed}`;
  }
  return trimmed;
}
