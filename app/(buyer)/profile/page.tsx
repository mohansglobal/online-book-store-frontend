import type { Metadata } from "next";
import { ProfilePage } from "@/components/profile";

export const metadata: Metadata = {
  title: "My Profile | Indo Bangla Books",
  description: "Manage your account settings, personal details, security and preferences.",
};

export default function Page() {
  return <ProfilePage />;
}