import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import AddBookPage from "./add-book-page";
import { useAddBookForm } from "./hooks/use-add-book-form";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => "/add-book",
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

function renderWithQueryClient(ui: React.ReactElement) {
  const testClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testClient}>
      {ui}
    </QueryClientProvider>,
  );
}

vi.mock("@/components/home/components", () => ({
  Navbar: () => <nav data-testid="mock-navbar">Navbar</nav>,
  Footer: () => <footer data-testid="mock-footer">Footer</footer>,
}));

vi.mock("../categories/components/CategoryBanner", () => ({
  CategoryBanner: ({ categoryName }: { categoryName: string }) => (
    <div data-testid="mock-category-banner">{categoryName}</div>
  ),
}));

vi.mock("./components/AdminTopNav", () => ({
  default: ({ activeTab }: { activeTab: string }) => (
    <div data-testid="mock-admin-nav">Tab: {activeTab}</div>
  ),
}));

vi.mock("./hooks/use-add-book-form", () => ({
  useAddBookForm: vi.fn(),
}));

describe("AddBookPage Component", () => {
  const mockHandleSubmit = vi.fn((e) => e?.preventDefault?.());
  const mockHandleReset = vi.fn();
  const mockHandleCoverChange = vi.fn();
  const mockHandleExtraImagesChange = vi.fn();

  const defaultMockFormState = {
    isbn: "978-0-14-345357-4",
    setIsbn: vi.fn(),
    titleEn: "Clean Code",
    setTitleEn: vi.fn(),
    titleBn: "ক্লিন কোড",
    setTitleBn: vi.fn(),
    publisherId: "pub_1",
    setPublisherId: vi.fn(),
    publisherName: "Pearson",
    setPublisherName: vi.fn(),
    language: "en",
    setLanguage: vi.fn(),
    categoryId: "cat_1",
    setCategoryId: vi.fn(),
    categoryName: "Software",
    setCategoryName: vi.fn(),
    authorId: "auth_1",
    setAuthorId: vi.fn(),
    authorName: "Robert C. Martin",
    setAuthorName: vi.fn(),
    searchTag: "programming",
    setSearchTag: vi.fn(),
    pages: "464",
    setPages: vi.fn(),
    edition: "1st Edition",
    setEdition: vi.fn(),
    mrp: "600",
    setMrp: vi.fn(),
    sellingPrice: "500",
    setSellingPrice: vi.fn(),
    stock: "10",
    setStock: vi.fn(),
    sku: "SKU-001",
    setSku: vi.fn(),
    countryId: "cnt_1",
    setCountryId: vi.fn(),
    countryName: "India",
    setCountryName: vi.fn(),
    description: "Handbook of agile software craftsmanship",
    setDescription: vi.fn(),
    coverPreview: null,
    setCoverPreview: vi.fn(),
    extraPreviews: [],
    setExtraPreviews: vi.fn(),
    isUploadingCover: false,
    isUploadingGallery: false,
    isSubmitting: false,
    formKey: 0,
    handleCoverChange: mockHandleCoverChange,
    handleExtraImagesChange: mockHandleExtraImagesChange,
    handleReset: mockHandleReset,
    handleSubmit: mockHandleSubmit,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAddBookForm).mockReturnValue(defaultMockFormState);
  });

  it("should render page header, admin navigation, and form sections", () => {
    renderWithQueryClient(<AddBookPage />);

    expect(screen.getByTestId("mock-navbar")).toBeInTheDocument();
    expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
    expect(screen.getByTestId("mock-admin-nav")).toHaveTextContent("Tab: add-book");
    expect(screen.getByText("Book Details")).toBeInTheDocument();
    expect(
      screen.getByText("Enter book information and inventory details to create a listing."),
    ).toBeInTheDocument();
  });

  it("should render standard action buttons in idle state", () => {
    renderWithQueryClient(<AddBookPage />);

    const submitBtn = screen.getByRole("button", { name: "Save Changes" });
    const cancelBtn = screen.getByRole("button", { name: "Cancel" });

    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).not.toBeDisabled();
    expect(cancelBtn).not.toBeDisabled();
  });

  it("should trigger handleReset when Cancel button is clicked", () => {
    renderWithQueryClient(<AddBookPage />);

    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelBtn);

    expect(mockHandleReset).toHaveBeenCalledTimes(1);
  });

  it("should trigger handleSubmit when form is submitted", () => {
    const { container } = renderWithQueryClient(<AddBookPage />);

    const form = container.querySelector("form");
    expect(form).toBeInTheDocument();

    if (form) {
      fireEvent.submit(form);
    }

    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });

  it("should display spinner and 'Creating Listing...' text when submitting", () => {
    vi.mocked(useAddBookForm).mockReturnValue({
      ...defaultMockFormState,
      isSubmitting: true,
    });

    renderWithQueryClient(<AddBookPage />);

    expect(screen.getByText("Creating Listing...")).toBeInTheDocument();
    const submitBtn = screen.getByRole("button", { name: /Creating Listing.../i });
    const cancelBtn = screen.getByRole("button", { name: "Cancel" });

    expect(submitBtn).toBeDisabled();
    expect(cancelBtn).toBeDisabled();
  });

  it("should display spinner and 'Uploading Images...' text when cover is uploading", () => {
    vi.mocked(useAddBookForm).mockReturnValue({
      ...defaultMockFormState,
      isUploadingCover: true,
    });

    renderWithQueryClient(<AddBookPage />);

    expect(screen.getByText("Uploading Images...")).toBeInTheDocument();
    const submitBtn = screen.getByRole("button", { name: /Uploading Images.../i });
    expect(submitBtn).toBeDisabled();
  });

  it("should display spinner and 'Uploading Images...' text when gallery images are uploading", () => {
    vi.mocked(useAddBookForm).mockReturnValue({
      ...defaultMockFormState,
      isUploadingGallery: true,
    });

    renderWithQueryClient(<AddBookPage />);

    expect(screen.getByText("Uploading Images...")).toBeInTheDocument();
    const submitBtn = screen.getByRole("button", { name: /Uploading Images.../i });
    expect(submitBtn).toBeDisabled();
  });
});
