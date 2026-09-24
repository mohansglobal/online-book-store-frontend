import Image from "next/image";
import Link from "next/link";
import { BookOpen, Home } from "lucide-react";

import { Footer, Navbar } from "@/components/home/components";
import NotFoundImg from "@/assets/404.png";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
     

      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          <div className="relative mx-auto mb-8 flex items-center justify-center">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 rounded-full bg-accent/10 blur-3xl animate-pulse"
            />

            <Image
              src={NotFoundImg}
              alt="404 Page Not Found"
              width={300}
              height={300}
              className="pointer-events-none mx-auto h-auto max-w-[260px] select-none object-contain drop-shadow-sm sm:max-w-[300px]"
              priority
            />
          </div>

          <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Error 404
          </span>

          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Page Not Found
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-accent/90 active:scale-[0.98]"
            >
              <Home size={16} aria-hidden="true" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/books"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-foreground transition-colors hover:border-muted-foreground hover:bg-surface-soft active:scale-[0.98]"
            >
              <BookOpen size={16} aria-hidden="true" />
              <span>Explore Books</span>
            </Link>
          </div>
        </div>
      </main>

     
    </div>
  );
}
