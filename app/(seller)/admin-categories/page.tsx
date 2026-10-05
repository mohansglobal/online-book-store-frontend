import type { Metadata } from "next";
import { AdminCategoriesPage } from "@/features/categories";

export const metadata: Metadata = {
  title: "Categories | Admin Portal | Indo Bangla Books",
  description: "Manage bookstore taxonomy, active visibility, and catalog classifications.",
};

export default function AdminCategoriesPageRoute() {
  return <AdminCategoriesPage />;
}
