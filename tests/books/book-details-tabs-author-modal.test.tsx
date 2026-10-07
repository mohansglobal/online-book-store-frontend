import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BookDetailsTabs } from "@/components/books/details/book-details-tabs";
import type { ApiBook } from "@/features/books/types/book.types";

vi.mock("next/image", () => ({
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} data-testid="mock-image" />
  ),
}));

vi.mock("@/components/categories/components/CategoryBanner", () => ({
  CategoryBanner: () => <div data-testid="mock-banner">Banner</div>,
}));

describe("BookDetailsTabs - Author Modal Integration", () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const mockBook: ApiBook = {
    _id: "book-123",
    title: "Gitanjali",
    slug: "gitanjali",
    description: "Song offerings",
    authors: [
      {
        _id: "author-456",
        name: "Rabindranath Tagore",
        nameBn: "রবীন্দ্রনাথ ঠাকুর",
        slug: "rabindranath-tagore",
        bio: "Nobel laureate poet and polymath from Bengal.",
        photo: "/tagore.jpg",
      },
    ],
  };

  it("opens author details modal when clicking 'View author profile'", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BookDetailsTabs book={mockBook} />
      </QueryClientProvider>,
    );

    // Switch to AUTHOR tab
    const authorTabButton = screen.getByRole("button", { name: "AUTHOR" });
    fireEvent.click(authorTabButton);

    // Click "View author profile"
    const viewProfileButton = screen.getByRole("button", {
      name: "View author profile",
    });
    expect(viewProfileButton).toBeInTheDocument();

    fireEvent.click(viewProfileButton);

    // Verify modal opened with author details
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getAllByText("Nobel laureate poet and polymath from Bengal.").length).toBe(2);
    expect(screen.getByTestId("author-modal-explore-btn")).toBeInTheDocument();
  });
});
