import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAddBookForm } from "./use-add-book-form";
import { toast } from "sonner";
import { useCreateBookListingMutation } from "@/features/books";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
  })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock("@/features/books", () => ({
  useCreateBookListingMutation: vi.fn(),
  useUpdateListingMutation: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useBook: vi.fn(() => ({ data: null, isLoading: false })),
  FALLBACK_BOOK_COVER: "https://example.com/fallback-cover.jpg",
}));

vi.mock("@/lib/api", () => ({
  uploadSingleImage: vi.fn(),
  uploadMultipleImages: vi.fn(),
}));

vi.mock("@/features/countries", () => ({
  useCountries: vi.fn(() => ({
    data: {
      data: [{ _id: "country_in_01", name: "India", code: "IN" }],
    },
  })),
}));

type CreateListingMutationReturn = ReturnType<typeof useCreateBookListingMutation>;

describe("useAddBookForm Hook", () => {
  let mockMutate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockMutate = vi.fn();
    vi.mocked(useCreateBookListingMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as unknown as CreateListingMutationReturn);

    if (!globalThis.URL.createObjectURL) {
      globalThis.URL.createObjectURL = vi.fn(() => "blob:http://localhost/test");
    }
  });

  const fillValidFields = (result: { current: ReturnType<typeof useAddBookForm> }) => {
    act(() => {
      result.current.setTitleEn("Effective TypeScript");
      result.current.setTitleBn("ইফেক্টিভ টাইপস্ক্রিপ্ট");
      result.current.setPublisherId("pub_o_reilly");
      result.current.setAuthorId("auth_dan");
      result.current.setCategoryId("cat_tech");
      result.current.setMrp("650");
      result.current.setSellingPrice("550");
      result.current.setStock("20");
      result.current.setIsbn("978-1-49-205374-2");
      result.current.setEdition("2nd Edition");
    });
  };


    




  it("should initialize with default empty form state", () => {
    const { result } = renderHook(() => useAddBookForm());

    expect(result.current.isbn).toBe("");
    expect(result.current.titleEn).toBe("");
    expect(result.current.titleBn).toBe("");
    expect(result.current.language).toBe("bn");
    expect(result.current.publisherId).toBe("");
    expect(result.current.coverPreview).toBeNull();
    expect(result.current.extraPreviews).toEqual([]);
    expect(result.current.isSubmitting).toBe(false);
  });

  it("should reset all fields when handleReset is called", () => {
    const { result } = renderHook(() => useAddBookForm());

    fillValidFields(result);
    expect(result.current.titleEn).toBe("Effective TypeScript");

    act(() => {
      result.current.handleReset();
    });

    expect(result.current.titleEn).toBe("");
    expect(result.current.publisherId).toBe("");
    expect(result.current.mrp).toBe("");
    expect(result.current.stock).toBe("");
    expect(result.current.isbn).toBe("");
    expect(result.current.formKey).toBe(1);
  });

  it("should validate client-side required fields before submission", () => {
    const { result } = renderHook(() => useAddBookForm());
    const dummyEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    act(() => {
      result.current.handleSubmit(dummyEvent);
    });
    expect(toast.error).toHaveBeenCalledWith("Book Title is required");
    expect(mockMutate).not.toHaveBeenCalled();

    act(() => {
      result.current.setTitleEn("Refactoring");
    });
    act(() => {
      result.current.handleSubmit(dummyEvent);
    });
    expect(toast.error).toHaveBeenCalledWith("Bengali Title is required");

    act(() => {
      result.current.setTitleBn("রিফ্যাক্টরিং");
    });
    act(() => {
      result.current.handleSubmit(dummyEvent);
    });
    expect(toast.error).toHaveBeenCalledWith("Please select a publisher");

    act(() => {
      result.current.setPublisherId("pub_1");
    });
    act(() => {
      result.current.handleSubmit(dummyEvent);
    });
    expect(toast.error).toHaveBeenCalledWith("Please select an author");

    act(() => {
      result.current.setAuthorId("auth_1");
    });
    act(() => {
      result.current.handleSubmit(dummyEvent);
    });
    expect(toast.error).toHaveBeenCalledWith("Please select a category");

    act(() => {
      result.current.setCategoryId("cat_1");
    });
    act(() => {
      result.current.handleSubmit(dummyEvent);
    });
    expect(toast.error).toHaveBeenCalledWith("Please enter a valid MRP price");

    act(() => {
      result.current.setMrp("500");
    });
    act(() => {
      result.current.handleSubmit(dummyEvent);
    });
    expect(toast.error).toHaveBeenCalledWith("Please enter a valid stock quantity");
  });

  it("should invoke createListing mutation when all validations pass", () => {
    const { result } = renderHook(() => useAddBookForm());
    const dummyEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    fillValidFields(result);

    act(() => {
      result.current.handleSubmit(dummyEvent);
    });

    expect(mockMutate).toHaveBeenCalledTimes(1);
    const [payload] = mockMutate.mock.calls[0];
    expect(payload.title).toBe("Effective TypeScript");
    expect(payload.isbn).toBe("978-1-49-205374-2");
    expect(payload.mrpInPaise).toBe(65000);
    expect(payload.sellingPriceInPaise).toBe(55000);
    expect(payload.stock).toBe(20);
    expect(payload.country).toBe("country_in_01");
  });

  it("should show success toast and navigate to inventory on mutation success", () => {
    const { result } = renderHook(() => useAddBookForm());
    const dummyEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    fillValidFields(result);

    act(() => {
      result.current.handleSubmit(dummyEvent);
    });

    const [, options] = mockMutate.mock.calls[0];

    act(() => {
      options.onSuccess({ message: "Book and listing created successfully" });
    });

    expect(toast.success).toHaveBeenCalledWith("Book and listing created successfully");
    expect(mockPush).toHaveBeenCalledWith("/inventory");
  });

  const isbnStandardErrorCases = [
    {
      rule: "Rule 1 (Different Publisher)",
      errorMessage:
        'Per International ISBN standards, ISBN "978-1-49-205374-2" is already registered to another publisher. A different publisher must assign their own ISBN.',
    },
    {
      rule: "Rule 2 (Different Format)",
      errorMessage:
        'Per International ISBN standards, ISBN "978-1-49-205374-2" is already registered as Hardcover. Different product formats (Paperback, Hardcover, eBook) must have separate ISBNs.',
    },
    {
      rule: "Rule 3 (Different Language)",
      errorMessage:
        'Per International ISBN standards, ISBN "978-1-49-205374-2" is already registered in Bengali. Each language edition must have its own ISBN.',
    },
    {
      rule: "Rule 4 (Different Edition)",
      errorMessage:
        'Per International ISBN standards, ISBN "978-1-49-205374-2" is already registered as "1st Edition". A new edition requires its own ISBN.',
    },
  ];

  it.each(isbnStandardErrorCases)(
    "should display backend error toast for ISBN $rule",
    ({ errorMessage }) => {
      const { result } = renderHook(() => useAddBookForm());
      const dummyEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

      fillValidFields(result);

      act(() => {
        result.current.handleSubmit(dummyEvent);
      });

      const [, options] = mockMutate.mock.calls[0];

      act(() => {
        options.onError(new Error(errorMessage));
      });

      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    },
  );

  it("should succeed and navigate when second seller adds identical publication", () => {
    const { result } = renderHook(() => useAddBookForm());
    const dummyEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

    fillValidFields(result);

    act(() => {
      result.current.setCoverPreview("https://res.cloudinary.com/seller2/copy.png");
    });

    act(() => {
      result.current.handleSubmit(dummyEvent);
    });

    const [payload, options] = mockMutate.mock.calls[0];
    expect(payload.coverImage).toBe("https://res.cloudinary.com/seller2/copy.png");

    act(() => {
      options.onSuccess({ message: "Listing added to existing publication!" });
    });

    expect(toast.success).toHaveBeenCalledWith("Listing added to existing publication!");
    expect(mockPush).toHaveBeenCalledWith("/inventory");
  });
});
