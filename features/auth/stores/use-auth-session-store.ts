// zustand store for auth session status and global redirect signals
import { create } from "zustand";

type AuthSessionState = {
  isSessionExpired: boolean;
  setSessionExpired: (expired: boolean) => void;
  resetSession: () => void;
};

export const useAuthSessionStore = create<AuthSessionState>((set) => ({
  isSessionExpired: false,
  setSessionExpired: (expired: boolean) => set({ isSessionExpired: expired }),
  resetSession: () => set({ isSessionExpired: false }),
}));
