import type { User } from "@/features/auth/types/auth.types";

export const MOCK_USER: User = {
  id: "user_mock_01",
  name: "Mohan Das",
  email: "mohan@example.com",
  mobileNumber: "+91 98765 12345",
  role: "BUYER",
  profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
  isActive: true,
  isEmailVerified: true,
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-06-01T12:00:00.000Z",
};
