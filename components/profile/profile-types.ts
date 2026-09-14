import {
  Bell,
  LockKeyhole,
  Palette,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export type SettingsSection = "profile" | "security" | "notifications" | "appearance";

export interface ProfileMenuItem {
  id: SettingsSection;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const PROFILE_MENU_ITEMS: readonly ProfileMenuItem[] = [
  {
    id: "profile",
    label: "Personal information",
    description: "Name, email and contact",
    icon: UserRound,
  },
  {
    id: "security",
    label: "Login & security",
    description: "Password and account security",
    icon: LockKeyhole,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Choose what we send you",
    icon: Bell,
  },
  
];
