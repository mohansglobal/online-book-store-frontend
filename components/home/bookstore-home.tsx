"use client";

import {
    Authors,
    Bestsellers,
    Categories,
    CuratedBooks,
    Ebooks,
    Footer,
    Hero,
    Navbar,
    Newsletter,
    Poetry,
    PopularNovels,
    Publishers,
    Recent,
    Textbooks,
    TopicRows,
    Translated,
} from "./components";

import { toast } from "sonner";
import { useGuestCartStore } from "@/features/cart";
import { useWishlist } from "@/features/wishlist";
import type { Book } from "./types";

export function BookstoreHome() {
    const addToCart = useGuestCartStore((s) => s.addItem);
    const { toggleWishlist } = useWishlist();

    const handleAddToWishlist = (book?: Book) => {
        if (!book) {
            toast.info("Select a book to save to wishlist");
            return;
        }
        const coverSrc =
            typeof book.cover === "string"
                ? book.cover
                : (book.cover as { src?: string })?.src || "";
        const rawPrice =
            typeof book.price === "number"
                ? book.price
                : parseFloat(String(book.price).replace(/[^0-9.]/g, "")) || 0;
        const origPrice = book.originalPrice
            ? typeof book.originalPrice === "number"
                ? book.originalPrice
                : parseFloat(String(book.originalPrice).replace(/[^0-9.]/g, "")) || undefined
            : undefined;

        toggleWishlist({
            id: book.title,
            bookId: book.title,
            slug: book.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            title: book.title,
            author: book.author || "-",
            coverImage: coverSrc,
            format: "Paperback",
            price: rawPrice,
            originalPrice: origPrice,
            category: book.category,
        });
    };

    const handleAddToCart = () => {
        toast.info("Select a book to add to cart");
    };

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
            {/* <Navbar wish={wishCount} cart={cartCount} /> */}

            <Hero />

            <CuratedBooks
                onWish={handleAddToWishlist}
                onCart={handleAddToCart}
                className="bg-card"
            />

            <Authors />

            <Publishers />

            <Ebooks />

            <Recent
                onWish={handleAddToWishlist}
                onCart={handleAddToCart}
            />

            <Categories />

            <PopularNovels />

            <Poetry
                onWish={handleAddToWishlist}
                onCart={handleAddToCart}
            />

            <TopicRows />

            <Translated />

            <Textbooks
                onWish={handleAddToWishlist}
                onCart={handleAddToCart}
            />

            <Bestsellers />

            <Newsletter />

            {/* <Footer /> */}
        </main>
    );
}