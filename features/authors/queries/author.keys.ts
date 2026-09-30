// Author query key factory
import type { GetAuthorsParams } from "../types/author.types";

export const authorKeys = {
  all: ["authors"] as const,
  lists: () => [...authorKeys.all, "list"] as const,
  list: (params?: GetAuthorsParams) =>
    [...authorKeys.lists(), params ?? {}] as const,
  infinite: (params?: GetAuthorsParams) =>
    [...authorKeys.lists(), "infinite", params ?? {}] as const,
  details: () => [...authorKeys.all, "detail"] as const,
  detail: (idOrSlug: string) => [...authorKeys.details(), idOrSlug] as const,
};
