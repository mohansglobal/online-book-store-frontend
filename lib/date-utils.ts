// Utility functions for smart date parsing, formatting, and normalization
import { format, parseISO, isValid } from "date-fns";

// Bengali digit mappings
const BENGALI_DIGITS: Record<string, string> = {
  "০": "0",
  "১": "1",
  "২": "2",
  "৩": "3",
  "৪": "4",
  "৫": "5",
  "৬": "6",
  "৭": "7",
  "৮": "8",
  "৯": "9",
};

// English month name to 0-indexed month number
const ENGLISH_MONTHS: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

// Bengali month names to 0-indexed month number
const BENGALI_MONTHS: Record<string, number> = {
  জানুয়ারি: 0,
  জানু: 0,
  ফেব্রুয়ারি: 1,
  ফেব: 1,
  মার্চ: 2,
  এপ্রিল: 3,
  মে: 4,
  জুন: 5,
  জুলাই: 6,
  আগস্ট: 7,
  আগষ্ট: 7,
  সেপ্টেম্বর: 8,
  অক্টোবর: 9,
  নভেম্বর: 10,
  ডিসেম্বর: 11,
};

// Creates a local date avoiding UTC shifts and verifying validity
export function createSafeDate(
  year: number,
  monthIndex: number,
  day: number,
): Date | null {
  if (year < 1000 || year > 2100) return null;
  if (monthIndex < 0 || monthIndex > 11) return null;
  if (day < 1 || day > 31) return null;

  const date = new Date(0);
  date.setFullYear(year, monthIndex, day);
  date.setHours(0, 0, 0, 0);

  // Guard against rollover, e.g. Feb 30 becoming Mar 2
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== monthIndex ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

// Converts a Date to YYYY-MM-DD string safely without timezone offsets
export function formatDateToISO(date: Date): string {
  const y = date.getFullYear().toString().padStart(4, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");

  return `${y}-${m}-${d}`;
}

// Formats a date string for human display (e.g. "May 7, 1861")
export function formatDateDisplay(dateStr?: string): string {
  if (!dateStr) return "";

  try {
    const parsed = parseISO(dateStr);
    return isValid(parsed) ? format(parsed, "MMM d, yyyy") : dateStr;
  } catch {
    return dateStr;
  }
}

// Helper to look up month by name or abbreviation
function lookupMonth(rawMonth: string): number | null {
  const lower = rawMonth.trim().toLowerCase();

  if (lower in ENGLISH_MONTHS) {
    return ENGLISH_MONTHS[lower];
  }

  if (lower in BENGALI_MONTHS) {
    return BENGALI_MONTHS[lower];
  }

  return null;
}

// Smart parser handling manual input, copy-pasting, messy text, and multiple formats
export function parseSmartDate(rawInput: string): Date | null {
  if (!rawInput || typeof rawInput !== "string") return null;

  // 1. Normalize Bengali digits to Latin digits and strip leading/trailing whitespace
  let text = rawInput
    .trim()
    .replace(/[০-৯]/g, (ch) => BENGALI_DIGITS[ch] || ch);

  if (!text) return null;

  // 2. Strip ISO time suffix if present (e.g. "1861-05-07T00:00:00.000Z")
  if (text.includes("T")) {
    text = text.split("T")[0];
  }

  // 3. Year only: e.g. "1861" -> 1861-01-01
  const yearOnlyMatch = text.match(/^(\d{4})$/);
  if (yearOnlyMatch) {
    const year = parseInt(yearOnlyMatch[1], 10);
    return createSafeDate(year, 0, 1);
  }

  // 4. ISO format: YYYY-MM-DD, YYYY/MM/DD, YYYY.MM.DD
  const isoMatch = text.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10) - 1;
    const day = parseInt(isoMatch[3], 10);
    return createSafeDate(year, month, day);
  }

  // 5. Day-first or month-first numeric: DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
  const numericMatch = text.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (numericMatch) {
    const num1 = parseInt(numericMatch[1], 10);
    const num2 = parseInt(numericMatch[2], 10);
    const year = parseInt(numericMatch[3], 10);

    // If num1 > 12, it must be day
    if (num1 > 12 && num2 <= 12) {
      return createSafeDate(year, num2 - 1, num1);
    }

    // If num2 > 12, it must be day
    if (num2 > 12 && num1 <= 12) {
      return createSafeDate(year, num1 - 1, num2);
    }

    // Default to day first (standard international / South Asian format)
    return createSafeDate(year, num2 - 1, num1);
  }

  // 6. Textual formats with month names:
  // Remove ordinal suffixes (1st -> 1, 2nd -> 2, 3rd -> 3, 25th -> 25)
  const cleanedText = text.replace(/(\d+)(st|nd|rd|th)/gi, "$1");

  // Pattern A: "7 May 1861" or "07 May, 1861" or "7 May 1861 – 1941"
  const dayMonthYearMatch = cleanedText.match(
    /(\d{1,2})\s+([A-Za-z\u0980-\u09FF]+)[,\s]+(\d{4})/,
  );
  if (dayMonthYearMatch) {
    const day = parseInt(dayMonthYearMatch[1], 10);
    const month = lookupMonth(dayMonthYearMatch[2]);
    const year = parseInt(dayMonthYearMatch[3], 10);

    if (month !== null) {
      const parsed = createSafeDate(year, month, day);
      if (parsed) return parsed;
    }
  }

  // Pattern B: "May 7, 1861" or "May 7 1861"
  const monthDayYearMatch = cleanedText.match(
    /([A-Za-z\u0980-\u09FF]+)\s+(\d{1,2})[,\s]+(\d{4})/,
  );
  if (monthDayYearMatch) {
    const month = lookupMonth(monthDayYearMatch[1]);
    const day = parseInt(monthDayYearMatch[2], 10);
    const year = parseInt(monthDayYearMatch[3], 10);

    if (month !== null) {
      const parsed = createSafeDate(year, month, day);
      if (parsed) return parsed;
    }
  }

  // Pattern C: "1861, May 7" or "1861 May 7"
  const yearMonthDayMatch = cleanedText.match(
    /(\d{4})[,\s]+([A-Za-z\u0980-\u09FF]+)\s+(\d{1,2})/,
  );
  if (yearMonthDayMatch) {
    const year = parseInt(yearMonthDayMatch[1], 10);
    const month = lookupMonth(yearMonthDayMatch[2]);
    const day = parseInt(yearMonthDayMatch[3], 10);

    if (month !== null) {
      const parsed = createSafeDate(year, month, day);
      if (parsed) return parsed;
    }
  }

  // 7. Embedded date inside messy copy-paste string (e.g. "(born 7 May 1861)" or "b. 1861-05-07")
  const embeddedIso = text.match(/(\d{4}[-/.]\d{1,2}[-/.]\d{1,2})/);
  if (embeddedIso) {
    const date = parseSmartDate(embeddedIso[1]);
    if (date) return date;
  }

  const embeddedNumeric = text.match(/(\d{1,2}[-/.]\d{1,2}[-/.]\d{4})/);
  if (embeddedNumeric) {
    const date = parseSmartDate(embeddedNumeric[1]);
    if (date) return date;
  }

  // 8. Native fallback parsing
  try {
    const nativeDate = new Date(text);
    if (!isNaN(nativeDate.getTime())) {
      const y = nativeDate.getFullYear();
      if (y >= 1000 && y <= 2100) {
        return createSafeDate(y, nativeDate.getMonth(), nativeDate.getDate());
      }
    }
  } catch {
    // Ignore native parse errors
  }

  return null;
}

// Parses arbitrary date input and returns canonical YYYY-MM-DD string or null
export function parseAndFormatDate(rawInput: string): string | null {
  const parsed = parseSmartDate(rawInput);
  if (!parsed) return null;

  return formatDateToISO(parsed);
}
