"use client";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { CategoryBanner } from "./CategoryBanner";
import { CategorySidebar } from "./CategorySidebar";
import { CategoryBookGrid } from "./CategoryBookGrid";
import { books } from "@/components/home/data";

export default function CategorySearchPage({ categoryId }: { categoryId: string }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Format category ID to readable name: "religious-books" -> "Religious Books"
  const categoryName = categoryId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId]);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20">
      <CategoryBanner categoryName={categoryName} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* SEARCH BAR */}
        <div className="flex justify-center mb-10">
          <div className="relative w-full max-w-2xl flex items-center shadow-sm rounded-full overflow-hidden bg-background border border-border">
            <div className="pl-4 text-muted-foreground">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search books by title or author..."
              className="w-full py-3 px-4 bg-background outline-none text-foreground placeholder:text-muted-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-accent text-white px-6 py-3 font-semibold hover:bg-accent-hover transition-colors">
              Search
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
          <CategorySidebar />
          <CategoryBookGrid books={filteredBooks} />
        </div>
      </div>
    </div>
  );
}

export { CategorySearchPage };
