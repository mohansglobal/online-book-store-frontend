import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Mock next/navigation
const mockPush = vi.fn();
const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: vi.fn(),
  }),
  usePathname: () => "/books",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={typeof src === "string" ? src : "test-image"} alt={alt} className={className} />
  ),
}));

// Mock Banner
vi.mock("@/components/categories/components/CategoryBanner", () => ({
  CategoryBanner: () => <div data-testid="mock-banner">Banner</div>,
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

// Mock Wishlist & Cart
vi.mock("@/features/wishlist", () => ({
  useWishlist: () => ({
    isInWishlist: () => false,
    toggleWishlist: vi.fn(),
    wishlistIds: null,
  }),
}));

vi.mock("@/features/cart", () => ({
  useCart: () => ({
    addItem: vi.fn(),
  }),
}));

// Import components
import { BooksSearchBar } from "@/components/books/components/books-search-bar";
import { BookCard } from "@/components/books/components/book-card";
import AuthorsPage from "@/components/author/AuthorsPage";
import PublishersPage from "@/components/publishers/PublishersPage";
import CategoriesPage from "@/components/categories/categories-page";
import { CategoryCard } from "@/components/categories/components/category-card";

// Mock feature hooks
const mockAuthorsData = [
  {
    _id: "author_101",
    name: "Rabindranath Tagore",
    slug: "rabindranath-tagore",
    bio: "Nobel laureate poet and writer.",
    isActive: true,
  },
  {
    _id: "author_102",
    name: "Kazi Nazrul Islam",
    slug: "kazi-nazrul-islam",
    bio: "National poet of Bangladesh.",
    isActive: true,
  },
];

vi.mock("@/features/authors", () => ({
  useAuthors: () => ({
    data: { data: mockAuthorsData },
    isLoading: false,
    error: null,
  }),
  useInfiniteAuthors: () => ({
    data: { pages: [{ data: mockAuthorsData }] },
    isLoading: false,
    error: null,
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage: vi.fn(),
    refetch: vi.fn(),
  }),
}));

const mockPublishersData = [
  {
    _id: "pub_101",
    name: "Ananda Publishers",
    slug: "ananda-publishers",
    description: "Renowned Indian publisher.",
    phone: "1234567890",
    address: "Kolkata, India",
    publications: 50,
  },
];

vi.mock("@/features/publishers", () => ({
  usePublishers: () => ({
    data: { data: mockPublishersData },
    isLoading: false,
  }),
  useAllPublishers: () => ({
    data: mockPublishersData,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
  useInfinitePublishers: () => ({
    data: { pages: [{ data: mockPublishersData }] },
    isLoading: false,
    error: null,
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage: vi.fn(),
    refetch: vi.fn(),
  }),
}));

const mockCategoriesData = [
  {
    _id: "cat_101",
    name: "Fiction",
    nameBn: "কথাসাহিত্য",
    slug: "fiction",
    description: "Literary and imaginative fiction books.",
    bookCount: 25,
  },
];

vi.mock("@/features/categories", () => ({
  useCategories: () => ({
    data: { data: mockCategoriesData },
    isLoading: false,
  }),
  useCategory: () => ({
    data: mockCategoriesData[0],
    isLoading: false,
  }),
  useInfiniteCategories: () => ({
    data: { pages: [{ data: mockCategoriesData }] },
    isLoading: false,
    error: null,
    hasNextPage: false,
    isFetchingNextPage: false,
    fetchNextPage: vi.fn(),
    refetch: vi.fn(),
  }),
}));

describe("Search Main Text Field & Keyboard Navigation Workflow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Books Search & BookCard Keyboard Workflow", () => {
    it("calls onTabToResults when Tab is pressed in BooksSearchBar", () => {
      const handleTab = vi.fn();
      render(
        <BooksSearchBar
          value=""
          onChange={vi.fn()}
          onSubmit={vi.fn()}
          onClear={vi.fn()}
          onTabToResults={handleTab}
        />,
      );

      const input = screen.getByRole("searchbox");
      fireEvent.keyDown(input, { key: "Tab", code: "Tab" });

      expect(handleTab).toHaveBeenCalledTimes(1);
    });

    it("navigates inside when Enter is pressed on a focused BookCard", () => {
      const mockBook = {
        id: "book_1",
        listingId: "listing_999",
        bookId: "canonical_book_1",
        title: "Gitanjali",
        author: "Rabindranath Tagore",
        price: "Rs. 250",
        rawPrice: 250,
        inStock: true,
        stock: 5,
        slug: "gitanjali",
        publisher: "Ananda",
        category: "Poetry",
        rating: "4.8",
        cover: "/cover.jpg",
      };

      render(<BookCard book={mockBook} isFirst resultIndex={0} />);

      const article = document.getElementById("book-catalog-item-0");
      expect(article).toBeInTheDocument();

      // Press Enter on the focused book card
      fireEvent.keyDown(article!, { key: "Enter", code: "Enter" });

      expect(mockPush).toHaveBeenCalledWith("/books/listing_999");
    });
  });

  describe("Authors Page Auto-Focus & Keyboard Workflow", () => {
    it("auto-focuses search input when visiting AuthorsPage", async () => {
      render(<AuthorsPage />);

      const searchInput = screen.getByPlaceholderText("Search author by name...");
      await waitFor(() => {
        expect(document.activeElement).toBe(searchInput);
      });
    });

    it("focuses first author result on Tab and navigates inside on Enter", async () => {
      render(<AuthorsPage />);

      const searchInput = screen.getByPlaceholderText("Search author by name...");

      // Hit Tab while in search input
      fireEvent.keyDown(searchInput, { key: "Tab", code: "Tab" });

      const firstAuthorCard = document.getElementById("author-result-0");
      expect(firstAuthorCard).toBeInTheDocument();
      expect(document.activeElement).toBe(firstAuthorCard);

      // Hit Enter on selected author card
      fireEvent.keyDown(firstAuthorCard!, { key: "Enter", code: "Enter" });

      expect(mockPush).toHaveBeenCalledWith("/books?author=author_102");
    });
  });

  describe("Publishers Page Auto-Focus & Keyboard Workflow", () => {
    it("auto-focuses search input when visiting PublishersPage", async () => {
      render(<PublishersPage />);

      const searchInput = screen.getByPlaceholderText("Search publisher by name...");
      await waitFor(() => {
        expect(document.activeElement).toBe(searchInput);
      });
    });

    it("focuses first publisher result on Tab and navigates inside on Enter", async () => {
      render(<PublishersPage />);

      const searchInput = screen.getByPlaceholderText("Search publisher by name...");

      // Hit Tab while in search input
      fireEvent.keyDown(searchInput, { key: "Tab", code: "Tab" });

      const firstPublisherCard = document.getElementById("publisher-result-0");
      expect(firstPublisherCard).toBeInTheDocument();
      expect(document.activeElement).toBe(firstPublisherCard);

      // Hit Enter on selected publisher card
      fireEvent.keyDown(firstPublisherCard!, { key: "Enter", code: "Enter" });

      expect(mockPush).toHaveBeenCalledWith("/books?publisher=pub_101");
    });
  });

  describe("Categories Page Auto-Focus & Keyboard Workflow", () => {
    it("auto-focuses search input when visiting CategoriesPage", async () => {
      render(<CategoriesPage />);

      const searchInput = screen.getByPlaceholderText("Search category by name or Bangla title...");
      await waitFor(() => {
        expect(document.activeElement).toBe(searchInput);
      });
    });

    it("focuses first category result on Tab and navigates inside on Enter", async () => {
      render(<CategoriesPage />);

      const searchInput = screen.getByPlaceholderText("Search category by name or Bangla title...");

      // Hit Tab while in search input
      fireEvent.keyDown(searchInput, { key: "Tab", code: "Tab" });

      const firstCategoryCard = document.getElementById("category-result-0");
      expect(firstCategoryCard).toBeInTheDocument();
      expect(document.activeElement).toBe(firstCategoryCard);

      // Hit Enter on selected category card
      fireEvent.keyDown(firstCategoryCard!, { key: "Enter", code: "Enter" });

      expect(mockPush).toHaveBeenCalledWith("/books?category=cat_101");
    });

    it("navigates inside when Enter is pressed on CategoryCard", () => {
      render(
        <CategoryCard
          category={mockCategoriesData[0]}
          index={0}
          isFirst
        />,
      );

      const categoryCard = document.getElementById("category-result-0");
      expect(categoryCard).toBeInTheDocument();

      fireEvent.keyDown(categoryCard!, { key: "Enter", code: "Enter" });

      expect(mockPush).toHaveBeenCalledWith("/books?category=cat_101");
    });
  });
});
