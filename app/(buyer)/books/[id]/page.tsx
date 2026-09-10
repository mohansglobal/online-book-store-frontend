import type { Metadata } from "next";
import { BookDetailsClient } from "@/components/books/book-details-book";
import { getBookByIdOrSlug } from "@/features/books/api/books.api";

interface BookPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await getBookByIdOrSlug(id);
    if (res?.data?.title) {
      const cleanDesc = res.data.description
        ? res.data.description.replace(/<[^>]*>?/gm, "").slice(0, 160)
        : `Buy ${res.data.title} online at Indo Bangla Books.`;
      return {
        title: `${res.data.title} | Indo Bangla Books`,
        description: cleanDesc,
      };
    }
  } catch {
    // Fallback if fetch fails on server
  }

  return {
    title: "Book Details | Indo Bangla Books",
    description: "Explore book details, specifications, summary, and reviews at Indo Bangla Books.",
  };
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params;
  return <BookDetailsClient bookId={id} />;
}