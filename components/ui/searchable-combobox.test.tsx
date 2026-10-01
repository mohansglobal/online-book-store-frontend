import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  SearchableCombobox,
  type ComboboxOption,
} from "./searchable-combobox";

describe("SearchableCombobox Component", () => {
  const sampleOptions: ComboboxOption[] = [
    { value: "opt-1", label: "HarperCollins", secondaryLabel: "হার্পারকোলিন্স" },
    { value: "opt-2", label: "Penguin Random House" },
    { value: "opt-3", label: "O'Reilly Media" },
  ];

  it("renders placeholder when no value is selected", () => {
    render(
      <SearchableCombobox
        options={sampleOptions}
        value=""
        searchValue=""
        onSearchChange={vi.fn()}
        onValueChange={vi.fn()}
        placeholder="Select Publisher"
      />,
    );

    expect(screen.getByText("Select Publisher")).toBeInTheDocument();
  });

  it("renders selectedLabel when provided", () => {
    render(
      <SearchableCombobox
        options={sampleOptions}
        value="opt-1"
        selectedLabel="HarperCollins"
        searchValue=""
        onSearchChange={vi.fn()}
        onValueChange={vi.fn()}
      />,
    );

    expect(screen.getByText("HarperCollins")).toBeInTheDocument();
  });

  it("immediately displays options when opened without needing to type in search", () => {
    render(
      <SearchableCombobox
        options={sampleOptions}
        value=""
        searchValue=""
        onSearchChange={vi.fn()}
        onValueChange={vi.fn()}
        placeholder="Select Publisher"
        searchPlaceholder="Search publishers..."
      />,
    );

    const triggerButton = screen.getByRole("button", { name: "Select Publisher" });
    fireEvent.click(triggerButton);

    // Options must be visible immediately upon opening
    expect(screen.getByRole("textbox", { name: "Search publishers..." })).toBeInTheDocument();
    expect(screen.getByText("HarperCollins")).toBeInTheDocument();
    expect(screen.getByText("হার্পারকোলিন্স")).toBeInTheDocument();
    expect(screen.getByText("Penguin Random House")).toBeInTheDocument();
    expect(screen.getByText("O'Reilly Media")).toBeInTheDocument();
  });

  it("calls onSearchChange when typing into the search input", () => {
    const handleSearchChange = vi.fn();

    render(
      <SearchableCombobox
        options={sampleOptions}
        value=""
        searchValue=""
        onSearchChange={handleSearchChange}
        onValueChange={vi.fn()}
        placeholder="Select Publisher"
        searchPlaceholder="Search publishers..."
      />,
    );

    const triggerButton = screen.getByRole("button", { name: "Select Publisher" });
    fireEvent.click(triggerButton);

    const searchInput = screen.getByRole("textbox", { name: "Search publishers..." });
    fireEvent.change(searchInput, { target: { value: "Penguin" } });

    expect(handleSearchChange).toHaveBeenCalledWith("Penguin");
  });

  it("calls onValueChange with the selected option when clicked", () => {
    const handleValueChange = vi.fn();

    render(
      <SearchableCombobox
        options={sampleOptions}
        value=""
        searchValue=""
        onSearchChange={vi.fn()}
        onValueChange={handleValueChange}
        placeholder="Select Publisher"
      />,
    );

    const triggerButton = screen.getByRole("button", { name: "Select Publisher" });
    fireEvent.click(triggerButton);

    const optionBtn = screen.getByText("Penguin Random House");
    fireEvent.click(optionBtn);

    expect(handleValueChange).toHaveBeenCalledWith(
      "opt-2",
      expect.objectContaining({ value: "opt-2", label: "Penguin Random House" }),
    );
  });

  it("navigates from search input to first card and then next cards on Tab keypresses", () => {
    const handleValueChange = vi.fn();

    render(
      <SearchableCombobox
        options={sampleOptions}
        value=""
        searchValue=""
        onSearchChange={vi.fn()}
        onValueChange={handleValueChange}
        placeholder="Select Publisher"
        searchPlaceholder="Search publishers..."
      />,
    );

    const triggerButton = screen.getByRole("button", { name: "Select Publisher" });
    fireEvent.click(triggerButton);

    const searchInput = screen.getByRole("textbox", { name: "Search publishers..." });
    const optionCards = screen.getAllByRole("option");

    // Press Tab from search input -> focuses card 0 (HarperCollins)
    fireEvent.keyDown(searchInput, { key: "Tab", shiftKey: false });
    expect(document.activeElement).toBe(optionCards[0]);

    // Press Tab from card 0 -> focuses card 1 (Penguin Random House)
    fireEvent.keyDown(optionCards[0], { key: "Tab", shiftKey: false });
    expect(document.activeElement).toBe(optionCards[1]);

    // Press Tab from card 1 -> focuses card 2 (O'Reilly Media)
    fireEvent.keyDown(optionCards[1], { key: "Tab", shiftKey: false });
    expect(document.activeElement).toBe(optionCards[2]);

    // Press Enter on card 2 -> selects O'Reilly Media
    fireEvent.keyDown(optionCards[2], { key: "Enter" });
    expect(handleValueChange).toHaveBeenCalledWith(
      "opt-3",
      expect.objectContaining({ value: "opt-3", label: "O'Reilly Media" }),
    );
  });

  it("navigates between cards using ArrowDown and ArrowUp keys", () => {
    render(
      <SearchableCombobox
        options={sampleOptions}
        value=""
        searchValue=""
        onSearchChange={vi.fn()}
        onValueChange={vi.fn()}
        placeholder="Select Publisher"
        searchPlaceholder="Search publishers..."
      />,
    );

    const triggerButton = screen.getByRole("button", { name: "Select Publisher" });
    fireEvent.click(triggerButton);

    const searchInput = screen.getByRole("textbox", { name: "Search publishers..." });
    const optionCards = screen.getAllByRole("option");

    // ArrowDown from search input moves to card 0
    fireEvent.keyDown(searchInput, { key: "ArrowDown" });
    expect(document.activeElement).toBe(optionCards[0]);

    // ArrowDown from card 0 moves to card 1
    fireEvent.keyDown(optionCards[0], { key: "ArrowDown" });
    expect(document.activeElement).toBe(optionCards[1]);

    // ArrowUp from card 1 moves back to card 0
    fireEvent.keyDown(optionCards[1], { key: "ArrowUp" });
    expect(document.activeElement).toBe(optionCards[0]);
  });

  it("displays emptyMessage when options list is empty and not loading", () => {
    render(
      <SearchableCombobox
        options={[]}
        value=""
        searchValue="NonExistent"
        onSearchChange={vi.fn()}
        onValueChange={vi.fn()}
        placeholder="Select Publisher"
        emptyMessage="No publishers found."
      />,
    );

    const triggerButton = screen.getByRole("button", { name: "Select Publisher" });
    fireEvent.click(triggerButton);

    expect(screen.getByText("No publishers found.")).toBeInTheDocument();
  });

  it("displays loading indicator when options list is empty and loading", () => {
    render(
      <SearchableCombobox
        options={[]}
        value=""
        searchValue=""
        onSearchChange={vi.fn()}
        onValueChange={vi.fn()}
        placeholder="Select Publisher"
        isLoading={true}
      />,
    );

    const triggerButton = screen.getByRole("button", { name: "Select Publisher" });
    fireEvent.click(triggerButton);

    expect(screen.getByText("Loading items...")).toBeInTheDocument();
  });
});
