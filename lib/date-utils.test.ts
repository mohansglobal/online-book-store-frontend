// Tests for smart date parsing and normalization utilities
import { describe, it, expect } from "vitest";
import {
  parseSmartDate,
  formatDateToISO,
  parseAndFormatDate,
  formatDateDisplay,
  createSafeDate,
} from "./date-utils";

describe("date-utils", () => {
  describe("createSafeDate and formatDateToISO", () => {
    it("should safely construct historical dates without timezone shift", () => {
      const date = createSafeDate(1861, 4, 7); // May 7, 1861
      expect(date).not.toBeNull();
      if (date) {
        expect(formatDateToISO(date)).toBe("1861-05-07");
      }
    });

    it("should reject invalid dates like February 30", () => {
      const date = createSafeDate(2023, 1, 30);
      expect(date).toBeNull();
    });

    it("should reject years out of bounds", () => {
      expect(createSafeDate(500, 0, 1)).toBeNull();
      expect(createSafeDate(2500, 0, 1)).toBeNull();
    });
  });

  describe("parseAndFormatDate - manual writing formats", () => {
    it("should parse standard ISO YYYY-MM-DD", () => {
      expect(parseAndFormatDate("1861-05-07")).toBe("1861-05-07");
      expect(parseAndFormatDate("1941-08-07")).toBe("1941-08-07");
      expect(parseAndFormatDate("1971-12-16")).toBe("1971-12-16");
    });

    it("should parse ISO with slashes and dots", () => {
      expect(parseAndFormatDate("1861/05/07")).toBe("1861-05-07");
      expect(parseAndFormatDate("1861.05.07")).toBe("1861-05-07");
    });

    it("should parse DD/MM/YYYY and DD-MM-YYYY", () => {
      expect(parseAndFormatDate("07/05/1861")).toBe("1861-05-07");
      expect(parseAndFormatDate("7/5/1861")).toBe("1861-05-07");
      expect(parseAndFormatDate("07-05-1861")).toBe("1861-05-07");
      expect(parseAndFormatDate("25-12-1971")).toBe("1971-12-25");
    });

    it("should parse MM/DD/YYYY when day > 12", () => {
      expect(parseAndFormatDate("05/25/1971")).toBe("1971-05-25");
    });

    it("should parse year only as January 1 of that year", () => {
      expect(parseAndFormatDate("1861")).toBe("1861-01-01");
      expect(parseAndFormatDate("1971")).toBe("1971-01-01");
    });
  });

  describe("parseAndFormatDate - copy-paste formats", () => {
    it("should parse textual day-month-year e.g. 7 May 1861", () => {
      expect(parseAndFormatDate("7 May 1861")).toBe("1861-05-07");
      expect(parseAndFormatDate("07 May 1861")).toBe("1861-05-07");
      expect(parseAndFormatDate("7th May 1861")).toBe("1861-05-07");
      expect(parseAndFormatDate("7th May, 1861")).toBe("1861-05-07");
      expect(parseAndFormatDate("15 August 1947")).toBe("1947-08-15");
      expect(parseAndFormatDate("15th August 1947")).toBe("1947-08-15");
    });

    it("should parse textual month-day-year e.g. May 7, 1861", () => {
      expect(parseAndFormatDate("May 7, 1861")).toBe("1861-05-07");
      expect(parseAndFormatDate("May 7th, 1861")).toBe("1861-05-07");
      expect(parseAndFormatDate("August 15, 1947")).toBe("1947-08-15");
      expect(parseAndFormatDate("December 16, 1971")).toBe("1971-12-16");
    });

    it("should parse year-month-day e.g. 1861 May 7", () => {
      expect(parseAndFormatDate("1861 May 7")).toBe("1861-05-07");
      expect(parseAndFormatDate("1861, May 7th")).toBe("1861-05-07");
    });

    it("should extract dates from messy Wikipedia copy-paste strings", () => {
      expect(parseAndFormatDate("(born 7 May 1861)")).toBe("1861-05-07");
      expect(parseAndFormatDate("b. 1861-05-07")).toBe("1861-05-07");
      expect(parseAndFormatDate("May 7, 1861 (aged 80)")).toBe("1861-05-07");
      expect(parseAndFormatDate("7 May 1861 – 7 August 1941")).toBe("1861-05-07");
      expect(parseAndFormatDate("1861-05-07T00:00:00.000Z")).toBe("1861-05-07");
    });

    it("should parse Bengali digits and months", () => {
      expect(parseAndFormatDate("৭ মে ১৮৬১")).toBe("1861-05-07");
      expect(parseAndFormatDate("১৮৬১-০৫-০৭")).toBe("1861-05-07");
    });
  });

  describe("formatDateDisplay", () => {
    it("should format ISO string to readable MMM d, yyyy", () => {
      expect(formatDateDisplay("1861-05-07")).toBe("May 7, 1861");
      expect(formatDateDisplay("1941-08-07")).toBe("Aug 7, 1941");
    });

    it("should return empty string for null or empty input", () => {
      expect(formatDateDisplay("")).toBe("");
      expect(formatDateDisplay(undefined)).toBe("");
    });
  });

  describe("invalid inputs", () => {
    it("should return null for gibberish and invalid dates", () => {
      expect(parseSmartDate("")).toBeNull();
      expect(parseSmartDate("not a date")).toBeNull();
      expect(parseAndFormatDate("")).toBeNull();
      expect(parseAndFormatDate("not a date")).toBeNull();
      expect(parseAndFormatDate("99/99/9999")).toBeNull();
      expect(parseAndFormatDate("2023-02-30")).toBeNull();
    });

    it("should return valid Date instance for recognized dates with parseSmartDate", () => {
      const parsed = parseSmartDate("7 May 1861");
      expect(parsed).toBeInstanceOf(Date);
      expect(parsed?.getFullYear()).toBe(1861);
      expect(parsed?.getMonth()).toBe(4);
      expect(parsed?.getDate()).toBe(7);
    });
  });
});
