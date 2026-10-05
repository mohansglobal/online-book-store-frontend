import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import { CategoryTable } from "@/features/categories/components/category-table";
import { CategoryCardGrid } from "@/features/categories/components/category-card-grid";
import { CategoryStatsCards } from "@/features/categories/components/category-stats-cards";
import { AdminTopNav } from "@/components/books/components/AdminTopNav";
import type { Category } from "@/features/categories/types/category.types";

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin-categories",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock("@/features/auth", () => ({
  useCurrentUser: () => ({
    data: { role: "ADMIN", name: "Admin User", email: "admin@example.com" },
  }),
}));

const mockCategories: Category[] = [
  {
    _id: "cat-1",
    name: "Fiction",
    nameBn: "কথাসাহিত্য",
    slug: "fiction",
    description: "Novels and stories",
    isActive: true,
    bookCount: 25,
    createdAt: "2026-01-15T10:00:00.000Z",
  },
  {
    _id: "cat-2",
    name: "Science",
    nameBn: "বিজ্ঞান",
    slug: "science",
    description: "Physics, chemistry, biology",
    isActive: false,
    bookCount: 8,
    createdAt: "2026-02-10T10:00:00.000Z",
  },
];

describe("Category Admin Dashboard Components", () => {
  it("renders AdminTopNav with the Category tab active and pointing to /admin-categories", () => {
    render(<AdminTopNav activeTab="category" />);

    const categoryLink = screen.getByRole("link", { name: /Category/i });
    expect(categoryLink).toBeInTheDocument();
    expect(categoryLink).toHaveAttribute("href", "/admin-categories");
    expect(categoryLink).toHaveAttribute("aria-current", "page");
  });

  it("renders CategoryStatsCards with accurate metric counts", () => {
    render(
      <CategoryStatsCards
        totalCategories={50}
        activeCategories={42}
        inactiveCategories={8}
        totalBookListings={120}
      />,
    );

    expect(screen.getByText("Total Categories")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("Active Categories")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("Inactive Categories")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("Total Book Listings")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();
  });

  it("renders CategoryTable with category rows, badges, and triggers edit icon click", () => {
    const handleEdit = vi.fn();

    render(
      <CategoryTable
        categories={mockCategories}
        isLoading={false}
        onEditCategory={handleEdit}
      />,
    );

    expect(screen.getByText("Fiction")).toBeInTheDocument();
    expect(screen.getByText("কথাসাহিত্য")).toBeInTheDocument();
    expect(screen.getByText("fiction")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();

    expect(screen.getByText("Science")).toBeInTheDocument();
    expect(screen.getByText("science")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();

    // Check edit button with accessible title
    const editButton = screen.getByRole("button", { name: "Edit Fiction" });
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);
    expect(handleEdit).toHaveBeenCalledTimes(1);
    expect(handleEdit).toHaveBeenCalledWith(mockCategories[0]);
  });

  it("renders CategoryCardGrid with background images, metadata, and triggers edit icon click", () => {
    const handleEdit = vi.fn();

    render(
      <CategoryCardGrid
        categories={mockCategories}
        isLoading={false}
        onEditCategory={handleEdit}
      />,
    );

    // Verify category titles and details
    expect(screen.getByRole("heading", { name: "Fiction" })).toBeInTheDocument();
    expect(screen.getByText("25 Books")).toBeInTheDocument();
    expect(screen.getByText("fiction")).toBeInTheDocument();
    expect(screen.getByText("Novels and stories")).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: "Science" })).toBeInTheDocument();
    expect(screen.getByText("8 Books")).toBeInTheDocument();
    expect(screen.getByText("science")).toBeInTheDocument();

    // Verify edit icon button on card
    const editButton = screen.getByRole("button", { name: "Edit Fiction" });
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);
    expect(handleEdit).toHaveBeenCalledTimes(1);
    expect(handleEdit).toHaveBeenCalledWith(mockCategories[0]);
  });

  it("renders empty state in CategoryCardGrid when no categories match", () => {
    render(
      <CategoryCardGrid
        categories={[]}
        isLoading={false}
        onEditCategory={vi.fn()}
      />,
    );

    expect(screen.getByText("No categories found")).toBeInTheDocument();
  });
});
