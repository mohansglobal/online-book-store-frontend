import { describe, expect, it } from "vitest";
import {
  canPurchaseBook,
  getBookStockInfo,
  getStockInfo,
  getStockLabel,
} from "./stock.utils";

describe("stock.utils", () => {
  describe("getStockInfo", () => {
    it("handles 0 or negative stock correctly as out of stock", () => {
      const zeroStock = getStockInfo(0);
      expect(zeroStock.level).toBe("out_of_stock");
      expect(zeroStock.label).toBe("Out of Stock");
      expect(zeroStock.badgeText).toBe("Out of Stock");
      expect(zeroStock.inStock).toBe(false);
      expect(zeroStock.canPurchase).toBe(false);
      expect(zeroStock.maxPurchasableQuantity).toBe(0);

      const negStock = getStockInfo(-2);
      expect(negStock.canPurchase).toBe(false);
      expect(negStock.inStock).toBe(false);
    });

    it("handles explicit inStock = false or OUT_OF_STOCK status", () => {
      const statusOut = getStockInfo(5, false);
      expect(statusOut.canPurchase).toBe(false);
      expect(statusOut.label).toBe("Out of Stock");

      const statusEnumOut = getStockInfo(10, true, "OUT_OF_STOCK");
      expect(statusEnumOut.canPurchase).toBe(false);
      expect(statusEnumOut.label).toBe("Out of Stock");
    });

    it("handles critical stock (<= 3)", () => {
      const stock1 = getStockInfo(1);
      expect(stock1.level).toBe("critical");
      expect(stock1.label).toBe("Only 1 left in stock - order soon!");
      expect(stock1.badgeText).toBe("Only 1 left");
      expect(stock1.canPurchase).toBe(true);
      expect(stock1.maxPurchasableQuantity).toBe(1);

      const stock3 = getStockInfo(3);
      expect(stock3.level).toBe("critical");
      expect(stock3.label).toBe("Only 3 left in stock - order soon!");
      expect(stock3.badgeText).toBe("Only 3 left");
      expect(stock3.canPurchase).toBe(true);
      expect(stock3.maxPurchasableQuantity).toBe(3);
    });

    it("handles low stock (4 to 5)", () => {
      const stock4 = getStockInfo(4);
      expect(stock4.level).toBe("low");
      expect(stock4.label).toBe("Only 4 left in stock");
      expect(stock4.badgeText).toBe("Only 4 left");
      expect(stock4.canPurchase).toBe(true);
      expect(stock4.maxPurchasableQuantity).toBe(4);

      const stock5 = getStockInfo(5);
      expect(stock5.level).toBe("low");
      expect(stock5.label).toBe("Only 5 left in stock");
      expect(stock5.canPurchase).toBe(true);
      expect(stock5.maxPurchasableQuantity).toBe(5);
    });

    it("handles in stock (6 to 10)", () => {
      const stock8 = getStockInfo(8);
      expect(stock8.level).toBe("in_stock");
      expect(stock8.label).toBe("In Stock (8 available)");
      expect(stock8.badgeText).toBe("In Stock (8)");
      expect(stock8.canPurchase).toBe(true);
      expect(stock8.maxPurchasableQuantity).toBe(8);
    });

    it("handles plenty stock (> 10)", () => {
      const stock15 = getStockInfo(15);
      expect(stock15.level).toBe("in_stock");
      expect(stock15.label).toBe("In Stock");
      expect(stock15.badgeText).toBe("In Stock");
      expect(stock15.canPurchase).toBe(true);
      expect(stock15.maxPurchasableQuantity).toBe(10);
    });

    it("handles undefined stock gracefully", () => {
      const undef = getStockInfo(undefined);
      expect(undef.level).toBe("in_stock");
      expect(undef.label).toBe("In Stock");
      expect(undef.canPurchase).toBe(true);
    });
  });

  describe("getBookStockInfo helper", () => {
    it("returns out of stock for null book", () => {
      const res = getBookStockInfo(null);
      expect(res.canPurchase).toBe(false);
      expect(res.label).toBe("Out of Stock");
    });

    it("extracts stock correctly from book object", () => {
      const book = { _id: "1", title: "Test", stock: 2, inStock: true };
      const res = getBookStockInfo(book);
      expect(res.level).toBe("critical");
      expect(res.label).toBe("Only 2 left in stock - order soon!");
      expect(res.canPurchase).toBe(true);
    });
  });

  describe("getStockLabel and canPurchaseBook", () => {
    it("returns label string directly", () => {
      expect(getStockLabel(2)).toBe("Only 2 left in stock - order soon!");
      expect(getStockLabel(0)).toBe("Out of Stock");
    });

    it("returns canPurchase boolean directly", () => {
      expect(canPurchaseBook(0)).toBe(false);
      expect(canPurchaseBook(5)).toBe(true);
    });
  });
});
