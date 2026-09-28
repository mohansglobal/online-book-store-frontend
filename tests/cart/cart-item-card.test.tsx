import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartItemCard } from "@/components/cart/cart-item-card";
import type { CartItemView } from "@/features/cart/types/cart.types";

vi.mock("next/image", () => ({
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} data-testid="mock-cart-image" />
  ),
}));

describe("CartItemCard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockItem: CartItemView = {
    id: "item_123",
    listingId: "listing_123",
    bookListingId: "listing_123",
    bookId: "book_123",
    slug: "clean-architecture",
    title: "Clean Architecture",
    author: "Robert C. Martin",
    seller: "Tech Books Direct",
    coverImage: "/images/clean-architecture.jpg",
    format: "Paperback",
    price: 499,
    originalPrice: 699,
    quantity: 2,
    subtotal: 998,
    savings: 400,
    isAvailable: true,
    isOutOfStock: false,
    exceedsStock: false,
    availableStock: 10,
  };

  it("renders cover flush to the left of the card in proper 2:3 book aspect ratio", () => {
    const handleUpdateQuantity = vi.fn();
    const handleRemove = vi.fn();

    const { container } = render(
      <CartItemCard
        item={mockItem}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemove}
      />,
    );

    // Card article has overflow-hidden and no outer padding (flush left edge)
    const article = container.querySelector("article");
    expect(article?.className).toContain("overflow-hidden");
    expect(article?.className).not.toContain("p-3.5");
    expect(article?.className).not.toContain("gap-");

    // Book cover container must have aspect-[2/3] and border-r
    const coverContainer = container.querySelector(".aspect-\\[2\\/3\\]");
    expect(coverContainer).toBeInTheDocument();
    expect(coverContainer?.className).toContain("border-r");

    // Image alt text matches title
    const image = screen.getByTestId("mock-cart-image");
    expect(image).toHaveAttribute("alt", "Clean Architecture cover");
  });

  it("renders book title, author, price and discount correctly", () => {
    const handleUpdateQuantity = vi.fn();
    const handleRemove = vi.fn();

    render(
      <CartItemCard
        item={mockItem}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemove}
      />,
    );

    expect(screen.getByText("Clean Architecture")).toBeInTheDocument();
    expect(screen.getByText("Robert C. Martin")).toBeInTheDocument();
    expect(screen.getByText("Tech Books Direct")).toBeInTheDocument();
    expect(screen.getByText("Paperback")).toBeInTheDocument();
    expect(screen.getByText("499.00")).toBeInTheDocument();
    expect(screen.getByText("(29% OFF)")).toBeInTheDocument();
  });

  it("triggers quantity update and item removal handlers", () => {
    const handleUpdateQuantity = vi.fn();
    const handleRemove = vi.fn();

    render(
      <CartItemCard
        item={mockItem}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemove}
      />,
    );

    // Increase quantity
    const plusButton = screen.getByRole("button", {
      name: "Increase quantity of Clean Architecture",
    });
    fireEvent.click(plusButton);
    expect(handleUpdateQuantity).toHaveBeenCalledWith("item_123", 3);

    // Decrease quantity
    const minusButton = screen.getByRole("button", {
      name: "Decrease quantity of Clean Architecture",
    });
    fireEvent.click(minusButton);
    expect(handleUpdateQuantity).toHaveBeenCalledWith("item_123", 1);

    // Remove item
    const removeButton = screen.getByTitle("Remove item");
    fireEvent.click(removeButton);
    expect(handleRemove).toHaveBeenCalledWith("item_123");
  });
});
