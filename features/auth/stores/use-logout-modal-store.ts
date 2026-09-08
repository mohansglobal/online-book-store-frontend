// global client UI store for logout confirmation modal
import { create } from "zustand";

interface LogoutModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useLogoutModalStore = create<LogoutModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export const useLogoutModal = () => useLogoutModalStore((state) => state);
