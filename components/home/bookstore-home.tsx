"use client";


import { useState } from "react";
import { books } from "./data";

import {
    Authors,
    Bestsellers,
    BookCarousel,
    Categories,
    Ebooks,
    Footer,
    Hero,
    Navbar,
    Newsletter,
    Poetry,
    Publishers,
    Recent,
    Textbooks,
    TopicRows,
    Translated,
} from "./components";

export function BookstoreHome() {
    const [wishCount, setWishCount] = useState(0);
    const [cartCount, setCartCount] = useState(0);

    const handleAddToWishlist = () => {
        setWishCount((count) => count + 1);
    };

    const handleAddToCart = () => {
        setCartCount((count) => count + 1);
    };

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
            {/* <Navbar wish={wishCount} cart={cartCount} /> */}

            <Hero />

            <BookCarousel
                eyebrow="CURATED THIS WEEK"
                title="Books worth discovering"
                items={books}
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

            <BookCarousel
                eyebrow="READER FAVOURITES"
                title="Popular Novels"
                items={[...books].reverse()}
                onWish={handleAddToWishlist}
                onCart={handleAddToCart}
                className="bg-background"
            />

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