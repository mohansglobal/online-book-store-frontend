// Price calculation and boundary utilities for books catalog filtering

export interface PriceBounds {
  minLimit: number;
  maxLimit: number;
  hasBooks: boolean;
}

export const DEFAULT_PRICE_MIN = 0;

export const DEFAULT_PRICE_MAX = 2000;

// Extracts a positive numeric price from any book object format
export function extractBookPrice(book: unknown): number | null {
  if (!book || typeof book !== "object") {
    return null;
  }

  const candidate = book as Record<string, unknown>;

  // Check rawPrice if catalog book is already transformed
  if (typeof candidate.rawPrice === "number" && candidate.rawPrice > 0) {
    return candidate.rawPrice;
  }

  // Check sellingPriceInPaise directly from backend listing
  if (
    typeof candidate.sellingPriceInPaise === "number" &&
    candidate.sellingPriceInPaise > 0
  ) {
    const rupeePrice = candidate.sellingPriceInPaise / 100;
    return rupeePrice;
  }

  // Check mrpInPaise if selling price is not present
  if (typeof candidate.mrpInPaise === "number" && candidate.mrpInPaise > 0) {
    const rupeeMrp = candidate.mrpInPaise / 100;
    return rupeeMrp;
  }

  // Check price field as number
  if (typeof candidate.price === "number" && candidate.price > 0) {
    return candidate.price;
  }

  // Check price field as string
  if (typeof candidate.price === "string") {
    const cleanedPrice = candidate.price.replace(/[^0-9.]/g, "");
    const parsedPrice = Number(cleanedPrice);

    if (!Number.isNaN(parsedPrice) && parsedPrice > 0) {
      return parsedPrice;
    }
  }

  return null;
}

// Determines appropriate step size based on price range
export function getSliderStep(min: number, max: number): number {
  const range = max - min;

  if (range <= 100) {
    return 1;
  }

  const preferredStep = range <= 1000 ? 5 : range <= 5000 ? 10 : 25;

  // Ensure both min and max can be hit exactly
  if (range % preferredStep === 0) {
    return preferredStep;
  }

  // Fallback to clean divisor or 1
  if (range % 5 === 0) {
    return 5;
  }

  return 1;
}

// Calculates dynamic minimum and maximum price boundaries directly from visible books
export function calculatePriceBounds(books?: unknown[]): PriceBounds {
  if (!Array.isArray(books) || books.length === 0) {
    return {
      minLimit: DEFAULT_PRICE_MIN,
      maxLimit: DEFAULT_PRICE_MAX,
      hasBooks: false,
    };
  }

  const validPrices: number[] = [];

  for (const item of books) {
    const price = extractBookPrice(item);

    if (price !== null && price > 0) {
      validPrices.push(price);
    }
  }

  if (validPrices.length === 0) {
    return {
      minLimit: DEFAULT_PRICE_MIN,
      maxLimit: DEFAULT_PRICE_MAX,
      hasBooks: false,
    };
  }

  const rawLowest = Math.min(...validPrices);
  const rawHighest = Math.max(...validPrices);

  // Handle single price point or identical min/max
  if (rawLowest >= rawHighest) {
    const safeMin = Math.max(0, rawLowest - 50);
    const safeMax = rawHighest + 50;

    return {
      minLimit: safeMin,
      maxLimit: safeMax,
      hasBooks: true,
    };
  }

  return {
    minLimit: rawLowest,
    maxLimit: rawHighest,
    hasBooks: true,
  };
}
