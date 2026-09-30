import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { OrderItemRow, type OrderItemDisplay } from "@/components/checkout/order-item-row";

describe("OrderItemRow Component", () => {
  const baseItem: OrderItemDisplay = {
    bookListingId: "listing-101",
    title: "Mastering TypeScript",
    author: "Jane Doe",
    price: 350,
    quantity: 2,
    stockAvailable: 5,
    isAvailable: true,
  };

  it("renders item title, author, and calculated line total", () => {
    render(<OrderItemRow item={baseItem} />);

    expect(screen.getByText("Mastering TypeScript")).toBeInTheDocument();
    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();
    // 350 * 2 = 700.00
    expect(screen.getByText("₹700.00")).toBeInTheDocument();
    expect(screen.getByText("(₹350.00 each)")).toBeInTheDocument();
  });

  it("renders static quantity when onUpdateQuantity is not provided", () => {
    render(<OrderItemRow item={baseItem} />);

    expect(screen.getByText("Qty: 2")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Decrease quantity" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Increase quantity" })).not.toBeInTheDocument();
  });

  it("renders interactive quantity buttons when onUpdateQuantity is provided", () => {
    const handleUpdate = vi.fn();
    render(<OrderItemRow item={baseItem} onUpdateQuantity={handleUpdate} />);

    const decreaseBtn = screen.getByRole("button", { name: "Decrease quantity" });
    const increaseBtn = screen.getByRole("button", { name: "Increase quantity" });

    expect(decreaseBtn).toBeEnabled();
    expect(increaseBtn).toBeEnabled();
    expect(screen.getByText("2")).toBeInTheDocument();

    fireEvent.click(decreaseBtn);
    expect(handleUpdate).toHaveBeenCalledWith("listing-101", 1);

    fireEvent.click(increaseBtn);
    expect(handleUpdate).toHaveBeenCalledWith("listing-101", 3);
  });

  it("disables decrease button when quantity is 1", () => {
    const singleItem: OrderItemDisplay = {
      ...baseItem,
      quantity: 1,
    };
    render(<OrderItemRow item={singleItem} onUpdateQuantity={vi.fn()} />);

    const decreaseBtn = screen.getByRole("button", { name: "Decrease quantity" });
    expect(decreaseBtn).toBeDisabled();
  });

  it("disables increase button when quantity reaches stockAvailable limit", () => {
    const maxStockItem: OrderItemDisplay = {
      ...baseItem,
      quantity: 5,
      stockAvailable: 5,
    };
    render(<OrderItemRow item={maxStockItem} onUpdateQuantity={vi.fn()} />);

    const increaseBtn = screen.getByRole("button", { name: "Increase quantity" });
    expect(increaseBtn).toBeDisabled();
  });

  it("disables buttons when isUpdating is true", () => {
    render(<OrderItemRow item={baseItem} onUpdateQuantity={vi.fn()} isUpdating={true} />);

    const decreaseBtn = screen.getByRole("button", { name: "Decrease quantity" });
    const increaseBtn = screen.getByRole("button", { name: "Increase quantity" });

    expect(decreaseBtn).toBeDisabled();
    expect(increaseBtn).toBeDisabled();
  });
});
