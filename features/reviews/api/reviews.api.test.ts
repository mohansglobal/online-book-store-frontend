import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "@/lib/api";
import { createReview, getBookReviews, checkReviewEligibility } from "./reviews.api";
import { extractReviewsList } from "../hooks/use-reviews";

vi.mock("@/lib/api", () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
  isApiClientError: vi.fn(),
}));

describe("Reviews API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits a review with JSON payload when images are strings", async () => {
    const mockResponse = {
      success: true,
      message: "Review submitted successfully",
      data: {
        _id: "rev123",
        rating: 5,
        title: "Great read",
        review: "Loved the quality and binding.",
        createdAt: "2026-09-14T18:00:00.000Z",
      },
    };
    (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

    const result = await createReview({
      bookId: "book123",
      sellerId: "seller456",
      rating: 5,
      title: "Great read",
      review: "Loved the quality and binding.",
      images: ["https://example.com/photo.jpg"],
    });

    expect(apiClient.post).toHaveBeenCalledWith("/reviews", {
      bookId: "book123",
      sellerId: "seller456",
      rating: 5,
      title: "Great read",
      review: "Loved the quality and binding.",
      images: ["https://example.com/photo.jpg"],
    });
    expect(result).toEqual(mockResponse);
  });

  it("submits a review with FormData when file attachments are provided", async () => {
    const mockResponse = {
      success: true,
      message: "Review submitted successfully",
      data: {
        _id: "rev123",
        rating: 4,
        review: "Good book",
        createdAt: "2026-09-14T18:00:00.000Z",
      },
    };
    (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

    const file = new File(["dummy content"], "photo.png", { type: "image/png" });

    const result = await createReview({
      bookId: "book123",
      rating: 4,
      review: "Good book",
      images: [file],
    });

    expect(apiClient.post).toHaveBeenCalledWith(
      "/reviews",
      undefined,
      expect.objectContaining({
        body: expect.any(FormData),
      }),
    );
    expect(result).toEqual(mockResponse);
  });

  it("fetches book reviews with query parameter", async () => {
    const mockResponse = {
      success: true,
      data: [
        {
          _id: "rev1",
          rating: 5,
          review: "Excellent!",
          createdAt: "2026-09-14T18:00:00.000Z",
        },
      ],
    };
    (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

    const result = await getBookReviews("book123");
    expect(apiClient.get).toHaveBeenCalledWith(
      "/reviews?bookId=book123",
      expect.any(Object),
    );
    expect(result).toEqual(mockResponse);
  });

  it("checks review eligibility for a book", async () => {
    const mockResponse = {
      success: true,
      message: "You are eligible to review this book.",
      data: {
        canReview: true,
        hasPurchased: true,
        hasDelivered: true,
        existingReview: null,
        eligibleSellers: [
          {
            sellerId: "seller123",
            sellerName: "Global Book Depot",
            orderId: "order456",
            bookListingId: "list789",
            deliveredAt: "2026-09-10T12:00:00.000Z",
            hasReviewed: false,
          },
        ],
      },
    };
    (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

    const result = await checkReviewEligibility("book123", { sellerId: "seller123" });
    expect(apiClient.get).toHaveBeenCalledWith(
      "/reviews/check-eligibility",
      expect.objectContaining({
        params: { bookId: "book123", sellerId: "seller123" },
      }),
    );
    expect(result).toEqual(mockResponse);
  });

  it("extracts reviews array safely from various response formats", () => {
    const directArray = [{ _id: "1", rating: 5, review: "A", createdAt: "now" }];
    expect(extractReviewsList(directArray)).toEqual(directArray);

    const objectWithReviews = {
      reviews: directArray,
      totalReviews: 1,
    };
    expect(extractReviewsList(objectWithReviews)).toEqual(directArray);

    expect(extractReviewsList(null)).toEqual([]);
    expect(extractReviewsList(undefined)).toEqual([]);
  });
});

