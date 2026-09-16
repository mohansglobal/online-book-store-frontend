import type { Review } from "@/features/reviews/types/review.types";

export const MOCK_REVIEWS: Review[] = [
  {
    _id: "rev_mock_01",
    bookId: "book_curated_01",
    rating: 5,
    title: "Timeless Bengali classic",
    review: "Bibhutibhushan's writing transports you directly to the quiet rural groves of Nischindipur. The paper quality and print are excellent!",
    isVerifiedPurchase: true,
    user: {
      _id: "user_mock_01",
      name: "Mohan Das",
      profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    },
    seller: {
      _id: "seller_main_01",
      name: "Bengal Book Distributors",
    },
    createdAt: "2024-05-15T10:00:00.000Z",
  },
  {
    _id: "rev_mock_02",
    bookId: "book_curated_01",
    rating: 5,
    title: "An unforgettable literary journey",
    review: "Every Indian book lover should read Pather Panchali at least once in their life. Beautiful storytelling.",
    isVerifiedPurchase: true,
    user: {
      _id: "user_mock_02",
      name: "Ananya Sen",
      profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    },
    seller: {
      _id: "seller_main_01",
      name: "Bengal Book Distributors",
    },
    createdAt: "2024-05-20T14:30:00.000Z",
  },
  {
    _id: "rev_mock_03",
    bookId: "book_curated_02",
    rating: 5,
    title: "Pure poetic divinity",
    review: "Gitanjali touches the deepest corners of one's soul. Tagore's poetry will forever remain unmatched.",
    isVerifiedPurchase: true,
    user: {
      _id: "user_mock_03",
      name: "Debashis Mukherjee",
    },
    seller: {
      _id: "seller_main_01",
      name: "Bengal Book Distributors",
    },
    createdAt: "2024-04-12T16:00:00.000Z",
  },
];
