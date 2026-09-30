import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "@/lib/api";
import {
  getAuthorByIdOrSlug,
  getAuthorBySlug,
  updateAuthor,
  deleteAuthor,
  getAuthors,
  getAllAuthors,
} from "./authors.api";
import { updateAuthorSchema } from "../schemas/author.schema";
import { authorKeys } from "../queries/author.keys";
import type { UpdateAuthorInput } from "../types/author.types";

vi.mock("@/lib/api", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Authors API Client & Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAuthors", () => {
    it("should send GET /authors with default sortOrder=asce when no params provided", async () => {
      const mockResponse = {
        success: true,
        message: "Authors retrieved successfully",
        data: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await getAuthors();

      expect(apiClient.get).toHaveBeenCalledWith("/authors", {
        params: { sortOrder: "asce" },
        signal: undefined,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should forward page, limit, and default sortOrder=asce", async () => {
      const mockResponse = {
        success: true,
        message: "Authors retrieved successfully",
        data: [],
        meta: { page: 1, limit: 20, total: 0, totalPages: 1 },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await getAuthors({ page: 1, limit: 20 });

      expect(apiClient.get).toHaveBeenCalledWith("/authors", {
        params: { page: 1, limit: 20, sortOrder: "asce" },
        signal: undefined,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should allow overriding sortOrder if explicitly provided", async () => {
      const mockResponse = {
        success: true,
        message: "Authors retrieved successfully",
        data: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await getAuthors({ sortOrder: "desc" });

      expect(apiClient.get).toHaveBeenCalledWith("/authors", {
        params: { sortOrder: "desc" },
        signal: undefined,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getAllAuthors", () => {
    it("should fetch all pages and return authors sorted A to Z", async () => {
      const page1Response = {
        success: true,
        message: "Page 1",
        data: [
          { _id: "1", name: "Bankim Chandra", slug: "bankim" },
          { _id: "2", name: "Abanindranath Tagore", slug: "abanindranath" },
        ],
        meta: { page: 1, limit: 100, total: 3, totalPages: 2 },
      };

      const page2Response = {
        success: true,
        message: "Page 2",
        data: [
          { _id: "3", name: "Rabindranath Tagore", slug: "rabindranath" },
        ],
        meta: { page: 2, limit: 100, total: 3, totalPages: 2 },
      };

      vi.mocked(apiClient.get)
        .mockResolvedValueOnce(page1Response)
        .mockResolvedValueOnce(page2Response);

      const authors = await getAllAuthors();

      expect(authors).toHaveLength(3);
      expect(authors[0].name).toBe("Abanindranath Tagore");
      expect(authors[1].name).toBe("Bankim Chandra");
      expect(authors[2].name).toBe("Rabindranath Tagore");
    });
  });

  describe("authorKeys", () => {
    it("should generate correct infinite query key with parameters", () => {
      const key = authorKeys.infinite({ limit: 20, sortOrder: "asce" });
      expect(key).toEqual([
        "authors",
        "list",
        "infinite",
        { limit: 20, sortOrder: "asce" },
      ]);
    });
  });

  describe("getAuthorByIdOrSlug", () => {
    it("should send GET /authors/:id when provided with MongoDB ObjectId", async () => {
      const mockAuthorId = "60c72b2f9b1d8b2bad5e0123";
      const mockResponse = {
        success: true,
        message: "Author retrieved successfully",
        data: {
          _id: mockAuthorId,
          name: "Satyajit Ray",
          slug: "satyajit-ray",
        },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await getAuthorByIdOrSlug(mockAuthorId);

      expect(apiClient.get).toHaveBeenCalledWith(`/authors/${mockAuthorId}`, {
        signal: undefined,
      });
      expect(result).toEqual(mockResponse);
      expect(result.data.name).toBe("Satyajit Ray");
    });

    it("should send GET /authors/:slug when provided with slug", async () => {
      const slug = "rabindranath-tagore";
      const mockResponse = {
        success: true,
        message: "Author retrieved successfully",
        data: {
          _id: "60c72b2f9b1d8b2bad5e0999",
          name: "Rabindranath Tagore",
          slug,
        },
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await getAuthorBySlug(slug);

      expect(apiClient.get).toHaveBeenCalledWith(`/authors/${slug}`, {
        signal: undefined,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("updateAuthor", () => {
    it("should send PATCH /authors/:id with updated payload", async () => {
      const authorId = "60c72b2f9b1d8b2bad5e0123";
      const updatePayload: UpdateAuthorInput = {
        bio: "Updated literary bio with new accolades.",
        isActive: false,
      };

      const mockResponse = {
        success: true,
        message: "Author updated successfully",
        data: {
          _id: authorId,
          name: "Satyajit Ray",
          slug: "satyajit-ray",
          bio: "Updated literary bio with new accolades.",
          isActive: false,
        },
      };

      vi.mocked(apiClient.patch).mockResolvedValueOnce(mockResponse);

      const result = await updateAuthor(authorId, updatePayload);

      expect(apiClient.patch).toHaveBeenCalledWith(
        `/authors/${authorId}`,
        updatePayload,
        {
          signal: undefined,
        },
      );
      expect(result).toEqual(mockResponse);
      expect(result.data.isActive).toBe(false);
    });
  });

  describe("deleteAuthor", () => {
    it("should send DELETE /authors/:id to soft-delete an author", async () => {
      const authorId = "60c72b2f9b1d8b2bad5e0123";
      const mockResponse = {
        success: true,
        message: "Author deleted successfully",
        data: {
          _id: authorId,
          name: "Satyajit Ray",
          slug: "satyajit-ray",
          isDel: true,
        },
      };

      vi.mocked(apiClient.delete).mockResolvedValueOnce(mockResponse);

      const result = await deleteAuthor(authorId);

      expect(apiClient.delete).toHaveBeenCalledWith(`/authors/${authorId}`, {
        signal: undefined,
      });
      expect(result).toEqual(mockResponse);
      expect(result.message).toBe("Author deleted successfully");
    });
  });

  describe("updateAuthorSchema", () => {
    it("should accept valid partial updates", () => {
      const input = {
        name: "Kazi Nazrul Islam",
        bio: "National poet of Bangladesh.",
        isActive: true,
      };

      const parsed = updateAuthorSchema.safeParse(input);
      expect(parsed.success).toBe(true);
    });

    it("should reject birthDate in the future", () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 5);

      const input = {
        birthDate: futureDate.toISOString().slice(0, 10),
      };

      const parsed = updateAuthorSchema.safeParse(input);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0].message).toContain(
          "Birth date cannot be in the future",
        );
      }
    });

    it("should reject deathDate earlier than birthDate", () => {
      const input = {
        birthDate: "1960-01-01",
        deathDate: "1940-01-01",
      };

      const parsed = updateAuthorSchema.safeParse(input);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0].message).toContain(
          "Death date cannot be earlier than birth date",
        );
      }
    });
  });
});
