import { BookDetailsClient } from "@/components/books/book-details-book";

interface BookPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function BookPage({
    params,
}: BookPageProps) {
    const { id } = await params;

    return <BookDetailsClient bookId={id} />;
}