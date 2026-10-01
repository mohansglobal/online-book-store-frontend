// Test to verify that BooksFilterSidebar does not pass limit: 100 on initial render
import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { render } from "@testing-library/react";
import { BooksFilterSidebar } from "@/components/books/components/books-filter-sidebar";

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

// Mock hooks
const mockUsePublishers = vi.fn((_params?: unknown) => ({
  data: { data: [] },
  isFetching: false,
}));

const mockUseAuthors = vi.fn((_params?: unknown) => ({
  data: { data: [] },
  isFetching: false,
}));

const mockUseCategories = vi.fn((_params?: unknown) => ({
  data: { data: [] },
  isFetching: false,
}));

vi.mock("@/features/publishers", () => ({
  usePublishers: (params: unknown) => mockUsePublishers(params),
}));

vi.mock("@/features/authors", () => ({
  useAuthors: (params: unknown) => mockUseAuthors(params),
}));

vi.mock("@/features/categories", () => ({
  useCategories: (params: unknown) => mockUseCategories(params),
}));

describe("BooksFilterSidebar API Queries without limit: 100", () => {
  beforeEach(() => {
    mockUsePublishers.mockClear();
    mockUseAuthors.mockClear();
    mockUseCategories.mockClear();
  });

  it("does not pass limit: 100 to publishers, authors, or categories on initial render", () => {
    render(
      <BooksFilterSidebar
        selectedPublisherIds={[]}
        onSelectPublisher={vi.fn()}
        selectedAuthorIds={[]}
        onSelectAuthor={vi.fn()}
        selectedCategoryIds={[]}
        onSelectCategory={vi.fn()}
        onApplyPrice={vi.fn()}
        onClearPrice={vi.fn()}
        onClearAll={vi.fn()}
      />,
    );

    // Verify usePublishers was called without limit: 100
    expect(mockUsePublishers).toHaveBeenCalled();
    const firstPublisherCall = mockUsePublishers.mock.calls[0] as unknown[] | undefined;
    const publisherParams = firstPublisherCall?.[0] as Record<string, unknown> | undefined;
    expect(publisherParams?.limit).toBeUndefined();

    // Verify useAuthors was called without limit: 100
    expect(mockUseAuthors).toHaveBeenCalled();
    const firstAuthorCall = mockUseAuthors.mock.calls[0] as unknown[] | undefined;
    const authorParams = firstAuthorCall?.[0] as Record<string, unknown> | undefined;
    expect(authorParams?.limit).toBeUndefined();

    // Verify useCategories was called without limit: 100
    expect(mockUseCategories).toHaveBeenCalled();
    const firstCategoryCall = mockUseCategories.mock.calls[0] as unknown[] | undefined;
    const categoryParams = firstCategoryCall?.[0] as Record<string, unknown> | undefined;
    expect(categoryParams?.limit).toBeUndefined();
  });
});
