import React from "react";
import { motion } from "framer-motion";
import type { Book } from "@/components/home/types";
import { BookCard } from "@/components/home/components/book-card";

export function CategoryBookGrid({ books }: { books: Book[] }) {
  return (
    <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-10 py-8">
      {books.map((book, idx) => (
        <motion.div
          key={book.slug || `${book.title}-${idx}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: Math.min(idx * 0.035, 0.35) }}
          className="h-full"
        >
          <BookCard
            book={book}
          />
        </motion.div>
      ))}
    </div>
  );
}
