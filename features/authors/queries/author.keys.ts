// Author query key factory
import type { GetAuthorsParams } from "../types/author.types";

export const authorKeys = {
  all: ["authors"] as const,
  lists: () => [...authorKeys.all, "list"] as const,
  list: (params?: GetAuthorsParams) =>
    [...authorKeys.lists(), params ?? {}] as const,
  details: () => [...authorKeys.all, "detail"] as const,
  detail: (slug: string) => [...authorKeys.details(), slug] as const,
};
