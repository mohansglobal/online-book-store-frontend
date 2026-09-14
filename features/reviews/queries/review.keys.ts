// Standardized React Query keys for reviews domain

export const reviewKeys = {
  all: ["reviews"] as const,
  books: () => [...reviewKeys.all, "book"] as const,
  book: (bookId: string) => [...reviewKeys.books(), bookId] as const,
  eligibilities: () => [...reviewKeys.all, "eligibility"] as const,
  eligibility: (bookId: string, sellerId?: string) =>
    [...reviewKeys.eligibilities(), bookId, sellerId || "all"] as const,
};

