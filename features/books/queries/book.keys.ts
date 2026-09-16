import type { GetBooksParams } from "../types/book.types";
import type { GetSellerListingsParams } from "../types/listing.types";

export const bookKeys = {
  all: ["books"] as const,
  lists: () => [...bookKeys.all, "list"] as const,
  list: (params?: GetBooksParams) =>
    params !== undefined
      ? ([...bookKeys.lists(), params] as const)
      : ([...bookKeys.lists()] as const),
  details: () => [...bookKeys.all, "detail"] as const,
  detail: (identifier: string) => [...bookKeys.details(), identifier] as const,
  isbnLookup: (isbn: string) => [...bookKeys.all, "isbn-lookup", isbn] as const,
  myListingsAll: () => [...bookKeys.all, "my-listings"] as const,
  myListings: (params?: GetSellerListingsParams) =>
    params !== undefined
      ? ([...bookKeys.myListingsAll(), params] as const)
      : ([...bookKeys.myListingsAll()] as const),
};

