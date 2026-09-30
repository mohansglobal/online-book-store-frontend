import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { Authors } from "@/components/home/components/authors";
import AuthorsPage from "@/components/author/AuthorsPage";
import { AuthorPreviewCard } from "@/components/author/components/author-preview-card";
import type { Author } from "@/features/authors/types/author.types";

vi.mock("next/image", () => ({
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={typeof src === "string" ? src : "test-image"} alt={alt} className={className} />
  ),
}));

vi.mock("@/components/categories/components/CategoryBanner", () => ({
  CategoryBanner: () => <div data-testid="mock-category-banner">Banner</div>,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/authors",
}));

const mockAuthors: Author[] = [
  {
    _id: "author_1",
    name: "Mohan Lal",
    nameBn: "মোহন লাল",
    slug: "mohan-lal",
    bio: "Historical author from Bengal.",
    birthDate: "1868-08-07T00:00:00.000Z",
    deathDate: "1946-09-02T00:00:00.000Z",
    isActive: true,
  },
  {
    _id: "author_2",
    name: "Living Poet",
    slug: "living-poet",
    bio: "Contemporary writer who is currently alive.",
    birthDate: "1586-04-23T00:00:00.000Z",
    isActive: true,
  },
  {
    _id: "author_3",
    name: "Ancient Scribe",
    slug: "ancient-scribe",
    bio: "Dates unknown.",
    isActive: true,
  },
];

vi.mock("@/features/authors", () => ({
  useAuthors: () => ({
    data: {
      success: true,
      message: "Fetched authors",
      data: mockAuthors,
    },
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
  useInfiniteAuthors: () => ({
    data: {
      pages: [
        {
          success: true,
          message: "Fetched authors",
          data: mockAuthors,
          meta: {
            page: 1,
            limit: 20,
            total: mockAuthors.length,
            totalPages: 1,
            hasNextPage: false,
          },
        },
      ],
    },
    isLoading: false,
    isFetchingNextPage: false,
    hasNextPage: false,
    fetchNextPage: vi.fn(),
    error: null,
    refetch: vi.fn(),
  }),
}));


describe("Author Lifespan Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Home Page Authors Section", () => {
    it("renders both dates as YYYY-YYYY format (e.g. 1868-1946)", () => {
      render(<Authors />);

      expect(screen.getByText("Mohan Lal")).toBeDefined();
      expect(screen.getByText("1868-1946")).toBeDefined();
    });

    it("renders living author with birthDate as YYYY- format (e.g. 1586-)", () => {
      render(<Authors />);

      expect(screen.getByText("Living Poet")).toBeDefined();
      expect(screen.getByText("1586-")).toBeDefined();
    });

    it("renders Bengali name alongside lifespan", () => {
      render(<Authors />);

      expect(screen.getAllByText("মোহন লাল").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("1868-1946")).toBeDefined();
    });
  });

  describe("Authors Catalog Page", () => {
    it("renders author cards with correct lifespan badges", () => {
      render(<AuthorsPage />);

      expect(screen.getByText("Mohan Lal")).toBeDefined();
      expect(screen.getByText("1868-1946")).toBeDefined();
      expect(screen.getByText("Living Poet")).toBeDefined();
      expect(screen.getByText("1586-")).toBeDefined();
      expect(screen.getByText("Ancient Scribe")).toBeDefined();
    });
  });

  describe("AuthorPreviewCard Component", () => {
    it("renders lifespan as YYYY-YYYY when both dates provided", () => {
      render(
        <AuthorPreviewCard
          name="Test Author"
          birthDate="1868-08-07T00:00:00.000Z"
          deathDate="1946-09-02T00:00:00.000Z"
          isUploadingPhoto={false}
          onPhotoFileChange={vi.fn()}
          onPhotoUrlChange={vi.fn()}
        />,
      );

      expect(screen.getByText("1868-1946")).toBeDefined();
    });

    it("renders lifespan as YYYY- when author is alive", () => {
      render(
        <AuthorPreviewCard
          name="Living Writer"
          birthDate="1586-04-23T00:00:00.000Z"
          isUploadingPhoto={false}
          onPhotoFileChange={vi.fn()}
          onPhotoUrlChange={vi.fn()}
        />,
      );

      expect(screen.getByText("1586-")).toBeDefined();
    });
  });
});
