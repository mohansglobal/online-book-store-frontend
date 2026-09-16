// Normalization and transformation utilities for books domain

import type { StaticImageData } from "next/image";

import { resolveCoverUrl } from "@/lib/image-url";

import {
  DEFAULT_AUTHOR_FALLBACK,
  FALLBACK_BOOK_COVER,
  type ApiBook,
  type ApiListing,
  type BookAuthor,
  type BookCategory,
  type BookPublisher,
  type CatalogBook,
  type ListingSeller,
} from "../types/book.types";

function getValidImages(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const validImages: string[] = [];

  for (const image of value) {
    if (typeof image !== "string") {
      continue;
    }

    const trimmedImage = image.trim();

    if (!trimmedImage) {
      continue;
    }

    validImages.push(trimmedImage);
  }

  return validImages;
}

function removeDuplicateImages(images: string[]): string[] {
  return [...new Set(images)];
}

function getCoverImage(
  book: Partial<ApiBook>,
  record: Record<string, unknown>,
): string | null {
  if (typeof book.coverImage === "string") {
    const bookCover = book.coverImage.trim();

    if (bookCover) {
      return bookCover;
    }
  }

  if (typeof record.coverImage === "string") {
    const listingCover = record.coverImage.trim();

    if (listingCover) {
      return listingCover;
    }
  }

  return null;
}

function getListingGalleryImages(
  book: Partial<ApiBook>,
  record: Record<string, unknown>,
  coverImage: string | null,
): string[] {
  const listingImages = getValidImages(record.listingImages);
  const recordImages = getValidImages(record.images);
  const effectiveImages = getValidImages(record.effectiveImages);
  const bookImages = getValidImages(book.images);

  const additionalImages = [
    ...listingImages,
    ...recordImages,
    ...effectiveImages,
    ...bookImages,
  ];

  const uniqueAdditionalImages = removeDuplicateImages(additionalImages);

  const galleryImages: string[] = [];

  if (coverImage) {
    galleryImages.push(coverImage);
  }

  galleryImages.push(...uniqueAdditionalImages);

  return removeDuplicateImages(galleryImages);
}

function getSellingPrice(
  record: Record<string, unknown>,
): number | undefined {
  if (typeof record.sellingPriceInPaise !== "number") {
    return undefined;
  }

  return record.sellingPriceInPaise;
}

function getMrp(record: Record<string, unknown>): number | undefined {
  if (typeof record.mrpInPaise !== "number") {
    return undefined;
  }

  return record.mrpInPaise;
}

function getCalculatedPrice(
  sellingPriceInPaise: number | undefined,
  book: Partial<ApiBook>,
): number | string | undefined {
  if (sellingPriceInPaise !== undefined) {
    return sellingPriceInPaise / 100;
  }

  return book.price;
}

function getCalculatedMrp(
  mrpInPaise: number | undefined,
  book: Partial<ApiBook>,
  calculatedPrice: number | string | undefined,
): number | string | undefined {
  if (mrpInPaise !== undefined) {
    return mrpInPaise / 100;
  }

  if (book.priceIn !== undefined) {
    return book.priceIn;
  }

  if (book.originalPrice !== undefined) {
    return book.originalPrice;
  }

  return calculatedPrice;
}

function getPublisher(
  book: Partial<ApiBook>,
  record: Record<string, unknown>,
): BookPublisher | undefined {
  if (book.publisher) {
    if (typeof book.publisher === "object") {
      return book.publisher as BookPublisher;
    }
  }

  if (record.publisher) {
    if (typeof record.publisher === "object") {
      return record.publisher as BookPublisher;
    }
  }

  return undefined;
}

function getAuthors(book: Partial<ApiBook>): BookAuthor[] {
  if (!Array.isArray(book.authors)) {
    return [];
  }

  return book.authors as BookAuthor[];
}

function getCategories(book: Partial<ApiBook>): BookCategory[] {
  if (!Array.isArray(book.categories)) {
    return [];
  }

  return book.categories as BookCategory[];
}

function getStock(
  book: Partial<ApiBook>,
  record: Record<string, unknown>,
): number | undefined {
  if (typeof record.stock === "number") {
    return record.stock;
  }

  return book.stock;
}

function getInStock(
  stock: number | undefined,
  book: Partial<ApiBook>,
): boolean {
  if (stock !== undefined) {
    return stock > 0;
  }

  if (book.inStock !== undefined) {
    return book.inStock;
  }

  return true;
}

function getAverageRating(
  book: Partial<ApiBook>,
  record: Record<string, unknown>,
): number | undefined {
  if (typeof record.averageRating === "number") {
    return record.averageRating;
  }

  if (typeof book.averageRating === "number") {
    return book.averageRating;
  }

  return undefined;
}

function getRating(
  book: Partial<ApiBook>,
  record: Record<string, unknown>,
  averageRating: number | undefined,
): number | string | undefined {
  if (record.rating !== undefined) {
    return record.rating as number | string;
  }

  if (book.rating !== undefined) {
    return book.rating;
  }

  return averageRating;
}

function getRatingCount(
  book: Partial<ApiBook>,
  record: Record<string, unknown>,
): number | undefined {
  if (typeof record.ratingCount === "number") {
    return record.ratingCount;
  }

  if (typeof book.ratingCount === "number") {
    return book.ratingCount;
  }

  return undefined;
}

function getTotalRatings(
  book: Partial<ApiBook>,
  record: Record<string, unknown>,
  ratingCount: number | undefined,
): number | undefined {
  if (typeof record.totalRatings === "number") {
    return record.totalRatings;
  }

  if (typeof book.totalRatings === "number") {
    return book.totalRatings;
  }

  return ratingCount;
}

function getTotalReviews(
  book: Partial<ApiBook>,
  record: Record<string, unknown>,
): number | undefined {
  if (typeof record.totalReviews === "number") {
    return record.totalReviews;
  }

  if (typeof book.totalReviews === "number") {
    return book.totalReviews;
  }

  if (typeof record.reviewCount === "number") {
    return record.reviewCount;
  }

  if (typeof book.reviewCount === "number") {
    return book.reviewCount;
  }

  return undefined;
}

function getReviewCount(
  book: Partial<ApiBook>,
  record: Record<string, unknown>,
  totalReviews: number | undefined,
): number | undefined {
  if (typeof record.reviewCount === "number") {
    return record.reviewCount;
  }

  if (typeof book.reviewCount === "number") {
    return book.reviewCount;
  }

  return totalReviews;
}

function getSearchTags(book: Partial<ApiBook>): string[] {
  if (!Array.isArray(book.searchTags)) {
    return [];
  }

  return book.searchTags as string[];
}

function getStatus(
  book: Partial<ApiBook>,
  record: Record<string, unknown>,
): string {
  if (book.status) {
    return String(book.status);
  }

  if (record.isActive) {
    return "ACTIVE";
  }

  return "INACTIVE";
}

function getCreatedBy(
  book: Partial<ApiBook>,
  record: Record<string, unknown>,
): string | undefined {
  if (book.createdBy) {
    return book.createdBy as string;
  }

  if (!record.seller) {
    return undefined;
  }

  if (typeof record.seller !== "object") {
    return undefined;
  }

  const seller = record.seller as Record<string, unknown>;

  if (typeof seller._id !== "string") {
    return undefined;
  }

  return seller._id;
}

function getLegacyBookId(book: Partial<ApiBook>): string | undefined {
  if (book.legacyBookId) {
    return book.legacyBookId as string;
  }

  if (book.legacyId) {
    return book.legacyId as string;
  }

  return undefined;
}

function getLegacyId(book: Partial<ApiBook>): string | undefined {
  if (book.legacyId) {
    return book.legacyId as string;
  }

  if (book.legacyBookId) {
    return book.legacyBookId as string;
  }

  return undefined;
}

function normalizeListing(
  record: Record<string, unknown>,
): ApiBook {
  const book = record.book as Partial<ApiBook> & Record<string, unknown>;

  const initialCoverImage = getCoverImage(book, record);

  const listingImages = getValidImages(record.listingImages);
  const recordImages = getValidImages(record.images);
  const effectiveImages = getValidImages(record.effectiveImages);
  const bookImages = getValidImages(book.images);

  const additionalImages = [
    ...listingImages,
    ...recordImages,
    ...effectiveImages,
    ...bookImages,
  ];

  const uniqueAdditionalImages = removeDuplicateImages(additionalImages);

  let coverImage = initialCoverImage;

  if (!coverImage) {
    if (uniqueAdditionalImages.length > 0) {
      coverImage = uniqueAdditionalImages[0];
    }
  }

  const galleryImages = getListingGalleryImages(
    book,
    record,
    coverImage,
  );

  const sellingPriceInPaise = getSellingPrice(record);
  const mrpInPaise = getMrp(record);

  const calculatedPrice = getCalculatedPrice(
    sellingPriceInPaise,
    book,
  );

  const calculatedMrp = getCalculatedMrp(
    mrpInPaise,
    book,
    calculatedPrice,
  );

  const publisher = getPublisher(book, record);
  const authors = getAuthors(book);
  const categories = getCategories(book);

  const stock = getStock(book, record);
  const inStock = getInStock(stock, book);

  const averageRating = getAverageRating(book, record);

  const rating = getRating(
    book,
    record,
    averageRating,
  );

  const ratingCount = getRatingCount(book, record);

  const totalRatings = getTotalRatings(
    book,
    record,
    ratingCount,
  );

  const totalReviews = getTotalReviews(book, record);

  const reviewCount = getReviewCount(
    book,
    record,
    totalReviews,
  );

  const searchTags = getSearchTags(book);
  const status = getStatus(book, record);
  const createdBy = getCreatedBy(book, record);

  const legacyBookId = getLegacyBookId(book);
  const legacyId = getLegacyId(book);

  let id = "";

  if (typeof record._id === "string") {
    id = record._id;
  } else if (typeof book._id === "string") {
    id = book._id;
  }

  let slug = "";

  if (typeof book._id === "string") {
    slug = book._id;
  } else if (typeof record._id === "string") {
    slug = record._id;
  } else if (typeof book.slug === "string") {
    slug = book.slug;
  }

  let createdAt: string | undefined;

  if (typeof record.createdAt === "string") {
    createdAt = record.createdAt;
  } else if (typeof book.createdAt === "string") {
    createdAt = book.createdAt;
  }

  let updatedAt: string | undefined;

  if (typeof record.updatedAt === "string") {
    updatedAt = record.updatedAt;
  } else if (typeof book.updatedAt === "string") {
    updatedAt = book.updatedAt;
  }

  return {
    _id: id,
    title: String(book.title || ""),
    titleBn: book.titleBn as string | undefined,
    slug,
    isbn: book.isbn as string | undefined,
    description: book.description as string | undefined,
    authors,
    publisher,
    categories,
    language: book.language as string | undefined,
    searchTags,
    format: book.format as string | undefined,
    pages: book.pages as number | undefined,

    coverImage,
    images: galleryImages,

    status,

    price: calculatedPrice,
    priceIn: calculatedMrp,
    originalPrice: calculatedMrp,
    originalPriceIn: calculatedMrp,

    rating,
    averageRating,
    ratingCount,
    totalRatings,
    totalReviews,
    reviewCount,

    stock,
    inStock,

    publishedYear: book.publishedYear as
      | string
      | number
      | undefined,

    legacyBookId,
    legacyId,

    edition: book.edition as string | undefined,
    translation: book.translation as string | undefined,
    country: book.country as ApiBook["country"],
    weight: book.weight as string | number | undefined,

    createdBy,
    createdAt,
    updatedAt,

    listingId: record._id as string,
    bookId: book._id as string,

    seller: record.seller as ListingSeller | undefined,

    mrpInPaise,
    sellingPriceInPaise,

    sku: record.sku as string | undefined,
    isActive: record.isActive as boolean | undefined,

    effectiveImages: galleryImages,
  };
}

function normalizeDirectBook(book: ApiBook): ApiBook {
  let coverImage: string | null = null;

  if (typeof book.coverImage === "string") {
    const trimmedCover = book.coverImage.trim();

    if (trimmedCover) {
      coverImage = trimmedCover;
    }
  }

  const listingImages = getValidImages(book.listingImages);
  const effectiveImages = getValidImages(book.effectiveImages);
  const galleryImages = getValidImages(book.images);

  const allImages: string[] = [];

  if (coverImage) {
    allImages.push(coverImage);
  }

  allImages.push(...listingImages);
  allImages.push(...effectiveImages);
  allImages.push(...galleryImages);

  const uniqueImages = removeDuplicateImages(allImages);

  if (!coverImage) {
    if (galleryImages.length > 0) {
      coverImage = galleryImages[0];
    }
  }

  return {
    ...book,
    coverImage,
    images: uniqueImages,
  };
}

export function normalizeListingToApiBook(
  item: ApiBook | ApiListing | Record<string, unknown>,
): ApiBook {
  if (!item) {
    return item as ApiBook;
  }

  if (typeof item !== "object") {
    return item as ApiBook;
  }

  const record = item as Record<string, unknown>;

  if (record.book) {
    if (typeof record.book === "object") {
      return normalizeListing(record);
    }
  }

  return normalizeDirectBook(item as ApiBook);
}

export function parsePrice(
  value?: number | string,
): {
  text: string;
  num: number;
} {
  if (value === undefined) {
    return {
      text: "-",
      num: 0,
    };
  }

  if (value === null) {
    return {
      text: "-",
      num: 0,
    };
  }

  if (value === "") {
    return {
      text: "-",
      num: 0,
    };
  }

  let parsedNumber: number;

  if (typeof value === "number") {
    parsedNumber = value;
  } else {
    const cleanValue = String(value).replace(
      /[^0-9.]/g,
      "",
    );

    parsedNumber = parseFloat(cleanValue);
  }

  if (!Number.isNaN(parsedNumber)) {
    let text = `₹${parsedNumber}`;

    if (parsedNumber === 0) {
      text = "Free";
    }

    return {
      text,
      num: parsedNumber,
    };
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();

    if (trimmedValue) {
      return {
        text: trimmedValue,
        num: 0,
      };
    }
  }

  return {
    text: "-",
    num: 0,
  };
}

function getNamesText(
  items: Array<{ name?: string }> | undefined,
): string {
  if (!items) {
    return "-";
  }

  if (items.length === 0) {
    return "-";
  }

  const names: string[] = [];

  for (const item of items) {
    if (!item) {
      continue;
    }

    if (!item.name) {
      continue;
    }

    const name = item.name.trim();

    if (!name) {
      continue;
    }

    names.push(name);
  }

  if (names.length === 0) {
    return "-";
  }

  return names.join(", ");
}

function getPublisherText(
  publisher?: BookPublisher,
): string {
  if (!publisher) {
    return "-";
  }

  if (!publisher.name) {
    return "-";
  }

  const publisherName = publisher.name.trim();

  if (!publisherName) {
    return "-";
  }

  return publisherName;
}

function getSellerText(
  seller?: ListingSeller,
): string | undefined {
  if (!seller) {
    return undefined;
  }

  if (!seller.name) {
    return undefined;
  }

  const sellerName = seller.name.trim();

  if (!sellerName) {
    return undefined;
  }

  return sellerName;
}

function getFinalPrice(
  priceText: string,
  priceInText: string,
): string {
  if (priceText !== "-") {
    return priceText;
  }

  if (priceInText !== "-") {
    return priceInText;
  }

  return "-";
}

function getFinalRawPrice(
  rawPrice: number,
  rawPriceIn: number,
): number {
  if (rawPrice) {
    return rawPrice;
  }

  if (rawPriceIn) {
    return rawPriceIn;
  }

  return 0;
}

function getCatalogRating(book: ApiBook): string {
  if (book.averageRating !== undefined) {
    if (book.averageRating !== null) {
      if (book.averageRating > 0) {
        return Number(book.averageRating).toFixed(1);
      }
    }
  }

  if (book.rating !== undefined) {
    if (book.rating !== null) {
      if (book.rating !== "") {
        const ratingNumber = Number(book.rating);

        if (ratingNumber > 0) {
          return ratingNumber.toFixed(1);
        }
      }
    }
  }

  return "-";
}

function getCatalogTotalRatings(book: ApiBook): number {
  if (book.totalRatings !== undefined) {
    if (book.totalRatings !== null) {
      return book.totalRatings;
    }
  }

  if (book.ratingCount !== undefined) {
    if (book.ratingCount !== null) {
      return book.ratingCount;
    }
  }

  if (book.totalReviews !== undefined) {
    if (book.totalReviews !== null) {
      return book.totalReviews;
    }
  }

  if (book.reviewCount !== undefined) {
    if (book.reviewCount !== null) {
      return book.reviewCount;
    }
  }

  return 0;
}

function getCatalogId(book: ApiBook): string {
  if (book._id) {
    return book._id;
  }

  if (book.listingId) {
    return book.listingId;
  }

  if (book.slug) {
    return book.slug;
  }

  return "-";
}

function getBookTitle(book: ApiBook): string {
  if (!book.title) {
    return "-";
  }

  const title = book.title.trim();

  if (!title) {
    return "-";
  }

  return title;
}

function getBookDescription(book: ApiBook): string {
  if (!book.description) {
    return "-";
  }

  const plainDescription = book.description.replace(
    /<[^>]*>?/gm,
    "",
  );

  const description = plainDescription.trim();

  if (!description) {
    return "-";
  }

  return description;
}

function getPublishedYear(book: ApiBook): string {
  if (!book.publishedYear) {
    return "-";
  }

  return String(book.publishedYear);
}

function getCatalogInStock(book: ApiBook): boolean {
  if (book.inStock !== undefined) {
    return book.inStock;
  }

  if (book.stock !== undefined) {
    return book.stock > 0;
  }

  return true;
}

export function transformApiBookToCatalogBook(
  rawBook: ApiBook,
  fallbackCover: StaticImageData | string = FALLBACK_BOOK_COVER,
): CatalogBook {
  const book = normalizeListingToApiBook(rawBook);

  const authorsText = getNamesText(book.authors);
  const categoryText = getNamesText(book.categories);
  const publisherText = getPublisherText(book.publisher);
  const sellerText = getSellerText(book.seller);

  const parsedPrice = parsePrice(book.price);
  const parsedPriceIn = parsePrice(book.priceIn);

  const finalPrice = getFinalPrice(
    parsedPrice.text,
    parsedPriceIn.text,
  );

  const finalRawPrice = getFinalRawPrice(
    parsedPrice.num,
    parsedPriceIn.num,
  );

  const parsedOriginalPrice = parsePrice(
    book.originalPrice,
  );

  const parsedOriginalPriceIn = parsePrice(
    book.originalPriceIn,
  );

  let cover: StaticImageData | string = fallbackCover;

  if (book.coverImage) {
    cover = resolveCoverUrl(book.coverImage);
  }

  const id = getCatalogId(book);
  const rating = getCatalogRating(book);
  const totalRatings = getCatalogTotalRatings(book);
  const title = getBookTitle(book);
  const detail = getBookDescription(book);
  const publishedYear = getPublishedYear(book);
  const inStock = getCatalogInStock(book);

  let priceIn: string | undefined;

  if (parsedPriceIn.text !== "-") {
    priceIn = parsedPriceIn.text;
  }

  let rawPriceIn: number | undefined;

  if (parsedPriceIn.num) {
    rawPriceIn = parsedPriceIn.num;
  }

  let originalPrice: string | undefined;

  if (parsedOriginalPrice.text !== "-") {
    originalPrice = parsedOriginalPrice.text;
  }

  let originalPriceIn: string | undefined;

  if (parsedOriginalPriceIn.text !== "-") {
    originalPriceIn = parsedOriginalPriceIn.text;
  }

  let format = "-";

  if (book.format) {
    format = book.format;
  }

  let isbn = "-";

  if (book.isbn) {
    isbn = book.isbn;
  }

  let language = "-";

  if (book.language) {
    language = book.language;
  }

  return {
    id,
    slug: id,

    title,
    author: authorsText,
    publisher: publisherText,
    seller: sellerText,
    category: categoryText,

    price: finalPrice,
    rawPrice: finalRawPrice,

    priceIn,
    rawPriceIn,

    originalPrice,
    originalPriceIn,

    rating,
    totalRatings,
    ratingCount: totalRatings,

    cover,
    detail,

    publishedYear,

    inStock,
    stock: book.stock,

    format,
    pages: book.pages,
    isbn,
    language,
  };
}

export function resolveAuthorPhoto(
  photo?: string | null,
): string {
  if (!photo) {
    return DEFAULT_AUTHOR_FALLBACK;
  }

  if (typeof photo !== "string") {
    return DEFAULT_AUTHOR_FALLBACK;
  }

  const trimmedPhoto = photo.trim();

  if (!trimmedPhoto) {
    return DEFAULT_AUTHOR_FALLBACK;
  }

  if (trimmedPhoto.startsWith("http://")) {
    return trimmedPhoto;
  }

  if (trimmedPhoto.startsWith("https://")) {
    return trimmedPhoto;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  let backendBase = "http://localhost:5000";

  if (apiUrl) {
    backendBase = apiUrl.replace(
      /\/api\/v1\/?$/,
      "",
    );
  }

  return `${backendBase}/assets/upload/author/${trimmedPhoto}`;
}