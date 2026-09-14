// Review domain types and API contracts

export type ReviewUser = {
  _id: string;
  name: string;
  profilePicture?: string | null;
  avatar?: string | null;
};

export type ReviewSeller = {
  _id: string;
  name: string;
};

export type Review = {
  _id: string;
  bookId?: string;
  sellerId?: string;
  rating: number;
  title?: string;
  review: string;
  images?: string[];
  isVerifiedPurchase?: boolean;
  user?: ReviewUser;
  seller?: ReviewSeller;
  createdAt: string;
  updatedAt?: string;
};

export type CreateReviewInput = {
  bookId: string;
  sellerId?: string;
  rating: number;
  title?: string;
  review: string;
  images?: File[] | string[];
};

export type CreateReviewResponse = {
  success: boolean;
  message: string;
  data: Review;
};

export type BookReviewsData = {
  reviews: Review[];
  totalReviews?: number;
  averageRating?: number;
  ratingDistribution?: Record<number, number>;
};

export type BookReviewsResponse = {
  success: boolean;
  message?: string;
  data: Review[] | BookReviewsData;
};

export type EligibleSeller = {
  sellerId: string;
  sellerName: string;
  orderId?: string;
  bookListingId?: string;
  deliveredAt?: string;
  hasReviewed?: boolean;
};

export type ReviewEligibilityData = {
  canReview: boolean;
  hasPurchased: boolean;
  hasDelivered: boolean;
  existingReview?: Review | null;
  eligibleSellers: EligibleSeller[];
};

export type ReviewEligibilityResponse = {
  success: boolean;
  message: string;
  data: ReviewEligibilityData;
};
