import { redirect } from "next/navigation";
import { getCategoryBySlug } from "@/features/categories/api/categories.api";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let categoryTarget = slug;

  try {
    const res = await getCategoryBySlug(slug);
    if (res?.data?._id) {
      categoryTarget = res.data._id;
    }
  } catch {
    // If lookup fails, fallback to passing the slug parameter directly
  }

  redirect(`/books?category=${encodeURIComponent(categoryTarget)}`);
}
