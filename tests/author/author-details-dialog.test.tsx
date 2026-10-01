import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AuthorsPage from "@/components/author/AuthorsPage";
import { AuthorDetailsDialog } from "@/components/author/components/author-details-dialog";
import type { Author } from "@/features/authors/types/author.types";

const mockPush = vi.fn();

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
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/authors",
}));

const mockAuthors: Author[] = [
  {
    _id: "author_101",
    name: "Rabindranath Tagore",
    nameBn: "রবীন্দ্রনাথ ঠাকুর",
    slug: "rabindranath-tagore",
    bio: "<p>Legendary poet, philosopher, and polymath who reshaped Bengali literature &amp; music.</p>",
    photo: "tagore.jpg",
    birthDate: "1861-05-07T00:00:00.000Z",
    deathDate: "1941-08-07T00:00:00.000Z",
    isActive: true,
  },
  {
    _id: "author_102",
    name: "Living Novelist",
    slug: "living-novelist",
    bio: "",
    birthDate: "1980-01-15T00:00:00.000Z",
    isActive: true,
  },
];

vi.mock("@/features/authors", () => ({
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

describe("Author Details Modal Interaction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("opens modal with all author details when tapping on author card", () => {
    render(<AuthorsPage />);

    // Initially modal content like 'About the Author' should not be present
    expect(screen.queryByText("About the Author")).toBeNull();

    // Click author card for Rabindranath Tagore
    const tagoreName = screen.getByRole("heading", { name: "Rabindranath Tagore" });
    const tagoreCard = tagoreName.closest("article");
    expect(tagoreCard).toBeInTheDocument();

    fireEvent.click(tagoreCard!);

    // Modal opens displaying complete author details
    expect(screen.getByText("About the Author")).toBeInTheDocument();
    expect(screen.getAllByText("Rabindranath Tagore").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("রবীন্দ্রনাথ ঠাকুর").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Lifespan: 1861-1941")).toBeInTheDocument();
    expect(screen.getByText("May 7, 1861")).toBeInTheDocument();
    expect(screen.getByText("Aug 7, 1941")).toBeInTheDocument();

    // Cleaned HTML bio
    expect(
      screen.getAllByText(/Legendary poet, philosopher, and polymath who reshaped Bengali literature & music/).length,
    ).toBeGreaterThanOrEqual(1);

    // Navigation CTA
    const exploreButtons = screen.getAllByRole("link", { name: /explore books/i });
    expect(exploreButtons.length).toBeGreaterThanOrEqual(1);
  });

  it("closes modal when clicking Close button", () => {
    render(<AuthorsPage />);

    const tagoreName = screen.getByRole("heading", { name: "Rabindranath Tagore" });
    const tagoreCard = tagoreName.closest("article");
    fireEvent.click(tagoreCard!);

    expect(screen.getByText("About the Author")).toBeInTheDocument();

    const closeButton = screen.getByTestId("author-modal-close-btn");
    fireEvent.click(closeButton);

    expect(screen.queryByText("About the Author")).toBeNull();
  });

  it("does not open modal when clicking the direct Explore Books link inside the card", () => {
    render(<AuthorsPage />);

    // Find all links with 'Explore Books'
    const exploreLinks = screen.getAllByRole("link", { name: /explore books/i });
    const firstCardLink = exploreLinks[0];

    fireEvent.click(firstCardLink);

    // Modal should NOT open because stopPropagation was called
    expect(screen.queryByText("About the Author")).toBeNull();
  });

  it("renders AuthorDetailsDialog with living author fallback bio gracefully", () => {
    const onOpenChange = vi.fn();

    render(
      <AuthorDetailsDialog
        author={mockAuthors[1]}
        open={true}
        onOpenChange={onOpenChange}
      />,
    );

    expect(screen.getByText("Living Novelist")).toBeInTheDocument();
    expect(screen.getByText("Lifespan: 1980-")).toBeInTheDocument();
    expect(screen.getByText("Jan 15, 1980")).toBeInTheDocument();
    expect(
      screen.getByText("No detailed biography is available for this author at the moment."),
    ).toBeInTheDocument();
  });

  it("moves focus to next author card on Tab instead of getting stuck on explore books", () => {
    render(<AuthorsPage />);

    const firstCard = document.getElementById("author-result-0");
    const secondCard = document.getElementById("author-result-1");

    expect(firstCard).toBeInTheDocument();
    expect(secondCard).toBeInTheDocument();

    firstCard?.focus();
    expect(document.activeElement).toBe(firstCard);

    // Tab key on first card moves directly to second card
    fireEvent.keyDown(firstCard!, { key: "Tab", code: "Tab" });
    expect(document.activeElement).toBe(secondCard);

    // Inner Explore Books links have tabIndex={-1}
    const exploreLinks = screen.getAllByRole("link", { name: /explore books/i });
    exploreLinks.forEach((link) => {
      expect(link).toHaveAttribute("tabindex", "-1");
    });
  });
});
