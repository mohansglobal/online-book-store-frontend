import CategorySearchPage from "@/components/categories/components/CategorySearchPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CategorySearchPage categoryId={slug} />;
}
