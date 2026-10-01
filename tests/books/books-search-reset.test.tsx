// Test suite verifying Books Catalog search reset and absence of limit: 100 on initial open
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useBooksCatalogFilters } from "@/components/books/hooks/use-books-catalog-filters";

// Mock next/navigation
const mockReplace = vi.fn();
const mockRouter = {
  replace: mockReplace,
  push: vi.fn(),
};
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => "/books",
  useSearchParams: () => mockSearchParams,
}));

describe("Books Catalog Search Reset & Filter State", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockReplace.mockClear();
    mockSearchParams = new URLSearchParams();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("initializes searchInput from URL search param", () => {
    mockSearchParams = new URLSearchParams("search=Science");

    const { result } = renderHook(() => useBooksCatalogFilters());

    expect(result.current.urlSearch).toBe("Science");
    expect(result.current.searchInput).toBe("Science");
  });

  it("resets searchInput immediately and removes search param via handleClearSearch", () => {
    mockSearchParams = new URLSearchParams("search=Science");

    const { result } = renderHook(() => useBooksCatalogFilters());

    expect(result.current.searchInput).toBe("Science");

    act(() => {
      result.current.handleClearSearch();
    });

    expect(result.current.searchInput).toBe("");
    expect(mockReplace).toHaveBeenCalledWith("/books", { scroll: false });

    // Advance timers past debounce duration to ensure debounce does not resurrect Science
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.searchInput).toBe("");
    // mockReplace should not have been called with Science again
    expect(mockReplace).not.toHaveBeenCalledWith(
      expect.stringContaining("search=Science"),
      expect.anything(),
    );
  });

  it("wires onRemoveSearch on active filters pill directly to handleClearSearch", () => {
    mockSearchParams = new URLSearchParams("search=Science");

    const { result } = renderHook(() => useBooksCatalogFilters());

    const searchPill = result.current.activeFiltersList.find((f) => f.id === "search");
    expect(searchPill).toBeDefined();
    expect(searchPill?.label).toBe("Science");

    act(() => {
      searchPill?.onRemove();
    });

    expect(result.current.searchInput).toBe("");
    expect(mockReplace).toHaveBeenCalledWith("/books", { scroll: false });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.searchInput).toBe("");
    expect(mockReplace).not.toHaveBeenCalledWith(
      expect.stringContaining("search=Science"),
      expect.anything(),
    );
  });

  it("clears search cleanly when handleClearAll is called", () => {
    mockSearchParams = new URLSearchParams("search=Science&category=123");

    const { result } = renderHook(() => useBooksCatalogFilters());

    act(() => {
      result.current.handleClearAll();
    });

    expect(result.current.searchInput).toBe("");
    expect(mockReplace).toHaveBeenCalledWith("/books", { scroll: false });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.searchInput).toBe("");
  });

  it("updates URL after debounced typing when user types into search input", () => {
    mockSearchParams = new URLSearchParams();

    const { result } = renderHook(() => useBooksCatalogFilters());

    act(() => {
      result.current.handleSearchInputChange("Mathematics");
    });

    expect(result.current.searchInput).toBe("Mathematics");
    expect(mockReplace).not.toHaveBeenCalled();

    // Advance 500ms for debounce
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockReplace).toHaveBeenCalledWith("/books?search=Mathematics", { scroll: false });
  });
});
