// Stock determination and formatting helpers for books domain
import type { ApiBook, CatalogBook } from "../types/book.types";

export type StockLevel = "out_of_stock" | "critical" | "low" | "in_stock";

export interface StockInfo {
  level: StockLevel;
  label: string;
  badgeText: string;
  inStock: boolean;
  stockCount: number | null;
  canPurchase: boolean;
  maxPurchasableQuantity: number;
  badgeClassName: string;
  dotClassName: string;
}

const BADGE_STYLES = {
  outOfStock: {
    badge:
      "border-rose-500/20 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
    dot: "bg-rose-500",
  },
  critical: {
    badge:
      "border-amber-500/20 bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  low: {
    badge:
      "border-orange-500/20 bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
    dot: "bg-orange-500",
  },
  inStock: {
    badge:
      "border-emerald-500/20 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
};

/**
 * Computes detailed stock info based on stock count and availability flags.
 *
 * Rules:
 * - 0 or negative (or inStock=false / status=OUT_OF_STOCK) -> Out of Stock (cannot buy)
 * - 1 to 3 -> "Only X left in stock - order soon!" (critical)
 * - 4 to 5 -> "Only X left in stock" (low)
 * - 6 to 10 -> "In Stock (X available)"
 * - > 10 -> "In Stock"
 */
export function getStockInfo(
  stock?: number | null,
  inStock?: boolean,
  status?: string,
): StockInfo {
  const isExplicitlyOutOfStock =
    (stock !== undefined && stock !== null && stock <= 0) ||
    inStock === false ||
    (typeof status === "string" && status.toUpperCase() === "OUT_OF_STOCK");

  if (isExplicitlyOutOfStock) {
    return {
      level: "out_of_stock",
      label: "Out of Stock",
      badgeText: "Out of Stock",
      inStock: false,
      stockCount: typeof stock === "number" ? Math.max(0, stock) : 0,
      canPurchase: false,
      maxPurchasableQuantity: 0,
      badgeClassName: BADGE_STYLES.outOfStock.badge,
      dotClassName: BADGE_STYLES.outOfStock.dot,
    };
  }

  // If numeric stock count is known and positive
  if (typeof stock === "number" && !isNaN(stock) && stock > 0) {
    if (stock <= 3) {
      const label =
        stock === 1
          ? "Only 1 left in stock - order soon!"
          : `Only ${stock} left in stock - order soon!`;
      return {
        level: "critical",
        label,
        badgeText: `Only ${stock} left`,
        inStock: true,
        stockCount: stock,
        canPurchase: true,
        maxPurchasableQuantity: stock,
        badgeClassName: BADGE_STYLES.critical.badge,
        dotClassName: BADGE_STYLES.critical.dot,
      };
    }

    if (stock <= 5) {
      return {
        level: "low",
        label: `Only ${stock} left in stock`,
        badgeText: `Only ${stock} left`,
        inStock: true,
        stockCount: stock,
        canPurchase: true,
        maxPurchasableQuantity: stock,
        badgeClassName: BADGE_STYLES.low.badge,
        dotClassName: BADGE_STYLES.low.dot,
      };
    }

    if (stock <= 10) {
      return {
        level: "in_stock",
        label: `In Stock (${stock} available)`,
        badgeText: `In Stock (${stock})`,
        inStock: true,
        stockCount: stock,
        canPurchase: true,
        maxPurchasableQuantity: Math.min(stock, 10),
        badgeClassName: BADGE_STYLES.inStock.badge,
        dotClassName: BADGE_STYLES.inStock.dot,
      };
    }

    return {
      level: "in_stock",
      label: "In Stock",
      badgeText: "In Stock",
      inStock: true,
      stockCount: stock,
      canPurchase: true,
      maxPurchasableQuantity: 10,
      badgeClassName: BADGE_STYLES.inStock.badge,
      dotClassName: BADGE_STYLES.inStock.dot,
    };
  }

  // Stock count is unknown/undefined, default to in stock unless inactive
  return {
    level: "in_stock",
    label: "In Stock",
    badgeText: "In Stock",
    inStock: true,
    stockCount: null,
    canPurchase: true,
    maxPurchasableQuantity: 10,
    badgeClassName: BADGE_STYLES.inStock.badge,
    dotClassName: BADGE_STYLES.inStock.dot,
  };
}

/**
 * Helper to get stock information directly from an ApiBook or CatalogBook entity
 */
export function getBookStockInfo(
  book?: Partial<ApiBook> | Partial<CatalogBook> | null,
): StockInfo {
  if (!book) {
    return getStockInfo(0, false, "OUT_OF_STOCK");
  }

  const stock = typeof book.stock === "number" ? book.stock : undefined;
  const inStock = book.inStock;
  const status = "status" in book && typeof book.status === "string" ? book.status : undefined;

  return getStockInfo(stock, inStock, status);
}

/**
 * Returns a user-friendly string for stock display
 */
export function getStockLabel(
  stock?: number | null,
  inStock?: boolean,
  status?: string,
): string {
  return getStockInfo(stock, inStock, status).label;
}

/**
 * Boolean check whether the book is available for purchase
 */
export function canPurchaseBook(
  stock?: number | null,
  inStock?: boolean,
  status?: string,
): boolean {
  return getStockInfo(stock, inStock, status).canPurchase;
}
