// Query keys factory for newsletter queries

import type { GetSubscribersParams } from "../types/newsletter.types";

export const newsletterKeys = {
  all: ["newsletter"] as const,

  subscribersList: () => [...newsletterKeys.all, "subscribers"] as const,

  subscribers: (params?: GetSubscribersParams) =>
    params !== undefined
      ? ([...newsletterKeys.subscribersList(), params] as const)
      : ([...newsletterKeys.subscribersList()] as const),
};
