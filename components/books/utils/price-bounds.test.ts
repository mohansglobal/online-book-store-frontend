import { describe, expect, it } from "vitest";
import {
  calculatePriceBounds,
  DEFAULT_PRICE_MAX,
  DEFAULT_PRICE_MIN,
  extractBookPrice,
  getSliderStep,
} from "./price-bounds";

describe("extractBookPrice", () => {
  it("extracts price from rawPrice", () => {
    const book = { rawPrice: 250 };
    const price = extractBookPrice(book);

    expect(price).toBe(250);
  });

  it("extracts rupee price from sellingPriceInPaise", () => {
    const book = { sellingPriceInPaise: 49900 };
    const price = extractBookPrice(book);

    expect(price).toBe(499);
  });

  it("extracts rupee price from mrpInPaise if sellingPriceInPaise is absent", () => {
    const book = { mrpInPaise: 35000 };
    const price = extractBookPrice(book);

    expect(price).toBe(350);
  });

  it("extracts price from string with currency symbol", () => {
    const book = { price: "₹180.00" };
    const price = extractBookPrice(book);

    expect(price).toBe(180);
  });

  it("returns null for invalid book object or missing prices", () => {
    expect(extractBookPrice(null)).toBeNull();
    expect(extractBookPrice({})).toBeNull();
    expect(extractBookPrice({ price: 0 })).toBeNull();
  });
});

describe("calculatePriceBounds", () => {
  it("returns default bounds when no books provided", () => {
    const bounds = calculatePriceBounds([]);

    expect(bounds.minLimit).toBe(DEFAULT_PRICE_MIN);
    expect(bounds.maxLimit).toBe(DEFAULT_PRICE_MAX);
    expect(bounds.hasBooks).toBe(false);
  });

  it("calculates dynamic min and max limits from list of books", () => {
    const books = [
      { rawPrice: 125 },
      { rawPrice: 350 },
      { rawPrice: 780 },
    ];

    const bounds = calculatePriceBounds(books);

    expect(bounds.hasBooks).toBe(true);
    expect(bounds.minLimit).toBeLessThanOrEqual(125);
    expect(bounds.maxLimit).toBeGreaterThanOrEqual(780);
  });

  it("handles single book price without collapsing slider range to zero", () => {
    const books = [{ rawPrice: 500 }];
    const bounds = calculatePriceBounds(books);

    expect(bounds.hasBooks).toBe(true);
    expect(bounds.minLimit).toBeLessThan(500);
    expect(bounds.maxLimit).toBeGreaterThan(500);
  });
});

describe("getSliderStep", () => {
  it("returns step 1 for narrow price ranges <= 100", () => {
    expect(getSliderStep(10, 50)).toBe(1);
  });

  it("returns step 5 for ranges <= 1000 with multiple of 5", () => {
    expect(getSliderStep(100, 800)).toBe(5);
  });

  it("returns step 10 for ranges <= 5000 with multiple of 10", () => {
    expect(getSliderStep(200, 2500)).toBe(10);
  });

  it("falls back to step 1 for irregular non-divisible ranges", () => {
    expect(getSliderStep(85, 999)).toBe(1);
  });
});
