// Publisher query key factory
import type { GetPublishersParams } from "../types/publisher.types";

export const publisherKeys = {
  all: ["publishers"] as const,
  lists: () => [...publisherKeys.all, "list"] as const,
  list: (params?: GetPublishersParams) =>
    [...publisherKeys.lists(), params ?? {}] as const,
  details: () => [...publisherKeys.all, "detail"] as const,
  detail: (slug: string) => [...publisherKeys.details(), slug] as const,
};
