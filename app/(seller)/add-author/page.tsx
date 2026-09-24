import type { Metadata } from "next";
import AddAuthorPage from "@/components/author/add-author-page";

export const metadata: Metadata = {
  title: "Add Author | Admin Portal | Indo Bangla Books",
  description: "Register a new author with auto-slug generation and catalog indexing.",
};

export default function Page() {
  return <AddAuthorPage />;
}
