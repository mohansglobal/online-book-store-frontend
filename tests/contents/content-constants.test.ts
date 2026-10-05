// Unit tests for site content metadata and query key definitions
import { describe, expect, it } from "vitest";
import { SECTION_LABELS, siteContentKeys } from "@/features/contents";

describe("Content Configuration", () => {
  it("defines human-readable labels for all 5 sections", () => {
    expect(SECTION_LABELS.hero).toBe("Hero Section");
    expect(SECTION_LABELS.ebooks).toBe("Digital Editions");
    expect(SECTION_LABELS.poetry).toBe("Poetry & Prose");
    expect(SECTION_LABELS.announcement).toBe("Announcement Bar");
    expect(SECTION_LABELS.newsletter).toBe("Newsletter");
  });

  it("maintains consistent TanStack Query keys", () => {
    expect(siteContentKeys.all).toEqual(["site-content"]);
    expect(siteContentKeys.current()).toEqual(["site-content", "current"]);
  });
});
