"use client";

import { useSiteContent } from "@/features/contents";
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
    // Automatically fetch and sync site CMS texts from MongoDB database
    useSiteContent();

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
