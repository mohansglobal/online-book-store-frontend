import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { OrderItemsDialog } from "@/features/orders/components/order-items-dialog";
import type { OrderItem } from "@/features/orders/types/order.types";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} data-testid="mock-dialog-image" />
  ),
}));

describe("OrderItemsDialog Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockItems: OrderItem[] = [
    {
      _id: "item_1",
      bookListing: "listing_clean_code",
      title: "Clean Code",
      priceInPaise: 45000,
      quantity: 2,
      subtotalInPaise: 90000,
      coverImage: "/assets/clean-code.jpg",
    },
    {
      _id: "item_2",
      book: "book_pragmatic",
      bookListing: "",
      title: "The Pragmatic Programmer",
      priceInPaise: 60000,
      quantity: 1,
      subtotalInPaise: 60000,
    },
  ];

  it("renders items with clickable links to book details page", () => {
    const handleOpenChange = vi.fn();

    render(
      <OrderItemsDialog
        items={mockItems}
        open={true}
        onOpenChange={handleOpenChange}
        orderNumber="ORD-10294"
      />,
    );

    // Cover thumbnail link for Clean Code
    const cleanCodeCoverLink = screen.getByRole("link", {
      name: "View details for Clean Code",
    });
    expect(cleanCodeCoverLink).toHaveAttribute("href", "/books/listing_clean_code");

    // Title link for Clean Code
    const cleanCodeTitleLink = screen.getByRole("link", {
      name: "Clean Code",
    });
    expect(cleanCodeTitleLink).toHaveAttribute("href", "/books/listing_clean_code");

    // Title link for Pragmatic Programmer (uses item.book fallback)
    const pragmaticTitleLink = screen.getByRole("link", {
      name: "The Pragmatic Programmer",
    });
    expect(pragmaticTitleLink).toHaveAttribute("href", "/books/book_pragmatic");
  });

  it("closes the modal when a book link is clicked", () => {
    const handleOpenChange = vi.fn();

    render(
      <OrderItemsDialog
        items={mockItems}
        open={true}
        onOpenChange={handleOpenChange}
      />,
    );

    const titleLink = screen.getByRole("link", { name: "Clean Code" });
    fireEvent.click(titleLink);

    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});
