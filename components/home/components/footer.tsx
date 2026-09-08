import Link from "next/link";
import {
  BookOpen,
  ChevronDown,
  CircleUserRound,
} from "lucide-react";

import { FaInstagram, FaXTwitter } from "react-icons/fa6";

interface FooterColumn {
  heading: string;
  links: readonly {
    label: string;
    href: string;
  }[];
}

const FOOTER_COLUMNS = [
  {
    heading: "Discover",
    links: [
      { label: "New Releases", href: "/#books" },
      { label: "Best Sellers", href: "/#bestsellers" },
      { label: "Authors", href: "/authors" },
      { label: "Publishers", href: "/publishers" },
    ],
  },
  {
    heading: "Categories",
    links: [
      { label: "Novels", href: "/categories" },
      { label: "Poetry", href: "/#poetry" },
      { label: "Short Stories", href: "/categories" },
      { label: "E-Books", href: "/#ebooks" },
      { label: "Textbooks", href: "/#textbooks" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Journal", href: "/journal" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help", href: "/help" },
      { label: "Delivery", href: "/delivery" },
      { label: "Returns", href: "/returns" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
] as const satisfies readonly FooterColumn[];

export function Footer() {
  return (
    <footer className="border-t border-border pt-[90px] pb-7">
      <div className="mx-auto grid w-[min(1320px,calc(100%-36px))] grid-cols-2 gap-11 md:w-[min(1320px,calc(100%-72px))] md:grid-cols-3 md:gap-[60px] lg:grid-cols-[2fr_repeat(4,1fr)]">
        {/* Brand */}
        <div className="col-span-2 md:col-span-3 lg:col-span-1">
          <Link
            href="/#top"
            className="inline-flex w-fit items-center gap-2.5 text-[21px] font-semibold text-foreground"
          >
            <span className="grid h-[34px] w-[34px] place-items-center rounded-sm border border-border text-foreground">
              <BookOpen size={18} />
            </span>

            <span>
              Folio
              <em className="not-italic text-primary">.</em>
            </span>
          </Link>

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Stories, ideas and voices
            <br />
            worth discovering.
          </p>
        </div>

        {/* Navigation Columns */}
        {FOOTER_COLUMNS.map(({ heading, links }) => (
          <nav
            key={heading}
            aria-label={`${heading} footer navigation`}
            className="flex flex-col gap-3.5"
          >
            <h3 className="m-0 mb-3 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
              {heading}
            </h3>

            {links.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="mx-auto mt-[70px] flex w-[min(1320px,calc(100%-36px))] flex-wrap items-center justify-between gap-5 border-t border-border pt-6 text-[10px] text-muted-foreground md:w-[min(1320px,calc(100%-72px))]">
        <span>Indo Bangla Books</span>

        <div className="flex gap-4.5">
          <a
            href="#top"
            aria-label="Instagram"
            className="transition-colors hover:text-foreground"
          >
            <FaInstagram size={17} />
          </a>

          <a
            href="#top"
            aria-label="Twitter"
            className="transition-colors hover:text-foreground"
          >
            <FaXTwitter size={17} />
          </a>

          <a
            href="#top"
            aria-label="Profile"
            className="transition-colors hover:text-foreground"
          >
            <CircleUserRound size={17} />
          </a>
        </div>

        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 border-0 bg-transparent text-muted-foreground transition-colors hover:text-foreground"
        >
          English / USD
          <ChevronDown size={14} />
        </button>
      </div>
    </footer>
  );
}