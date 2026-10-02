import { Suspense } from "react";
import AddBookPage from "@/components/books/add-book-page";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AddBookPage />
    </Suspense>
  );
}