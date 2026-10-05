// In-memory auth user store (TanStack Query is authoritative for server data)

import { create } from "zustand";
import type { User } from "../types/auth.types";

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user: User | null) =>
    set({
      user,
      isAuthenticated: Boolean(user),
    }),

  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));

export const selectIsUserHydrated = () => true;
