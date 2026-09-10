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

export function BookstoreHome() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
            {/* <Navbar wish={wishCount} cart={cartCount} /> */}

            <Hero />

            <CuratedBooks className="bg-card" />

            <Authors />

            <Publishers />

            <Ebooks />

            <Recent />

            <Categories />

            <PopularNovels />

            <Poetry />

            <TopicRows />

            <Translated />

            <Textbooks />

            <Bestsellers />

            <Newsletter />

            {/* <Footer /> */}
        </main>
    );
}