import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "@/lib/api";
import {
  getAuthorByIdOrSlug,
  getAuthorBySlug,
  updateAuthor,
  deleteAuthor,
} from "./authors.api";
import { updateAuthorSchema } from "../schemas/author.schema";
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
