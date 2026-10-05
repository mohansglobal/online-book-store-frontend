// Types for Newsletter feature domain

export interface NewsletterPreferences {
  newReleases?: boolean;

  priceDrops?: boolean;

  offers?: boolean;
}

export interface SubscriberPreferences {
  newReleases: boolean;

  priceDrops: boolean;

  offers: boolean;
}

export interface NewsletterSubscriber {
  _id: string;

  email: string;

  source: string;

  isSubscribed: boolean;

  preferences: SubscriberPreferences;

  createdAt: string;

  updatedAt: string;

  unsubscribedAt?: string;
}

export interface SubscribeNewsletterInput {
  email: string;

  source?: string;

  preferences?: NewsletterPreferences;
}

export interface SubscribeNewsletterResponse {
  success: boolean;

  message: string;

  data: NewsletterSubscriber;
}

export interface UnsubscribeNewsletterInput {
  email: string;
}

export interface UnsubscribeNewsletterResponse {
  success: boolean;

  message: string;

  data: {
    _id: string;

    email: string;

    isSubscribed: boolean;

    unsubscribedAt?: string;
  };
}

export interface GetSubscribersParams {
  page?: number;

  limit?: number;

  search?: string;

  isSubscribed?: boolean | "true" | "false";

  sortBy?: "createdAt" | "email";

  sortOrder?: "asc" | "desc";
}

export interface NewsletterPaginationMeta {
  page: number;

  limit: number;

  total: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPrevPage: boolean;
}

export interface GetSubscribersResponse {
  success: boolean;

  message: string;

  data: NewsletterSubscriber[];

  meta: NewsletterPaginationMeta;
}
