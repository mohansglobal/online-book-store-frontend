"use client";

import { useState } from "react";
import { Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { EbookPageItem, EbooksContent } from "../types/content.types";

interface EbooksContentFormProps {
  initialData: EbooksContent;
  onChange?: (data: EbooksContent) => void;
  onSave: (data: EbooksContent) => void;
  onReset: () => void;
}

const DEFAULT_BOOKS: EbookPageItem[] = [
  {
    title: "Pride and Prejudice",
    quote:
      "“It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.”",
    progress: 42,
  },
  {
    title: "Alice's Adventures in Wonderland",
    quote: "“Curiouser and curiouser!”",
    progress: 56,
  },
  {
    title: "The Great Gatsby",
    quote:
      "“So we beat on, boats against the current, borne back ceaselessly into the past.”",
    progress: 71,
  },
  {
    title: "The Adventures of Sherlock Holmes",
    quote: "“There is nothing more deceptive than an obvious fact.”",
    progress: 84,
  },
];

export function EbooksContentForm({
  initialData,
  onChange,
  onSave,
  onReset,
}: EbooksContentFormProps) {
  const [badge, setBadge] = useState(initialData.badge);
  const [heading, setHeading] = useState(initialData.heading);
  const [headingAccent, setHeadingAccent] = useState(initialData.headingAccent);
  const [description, setDescription] = useState(initialData.description);
  const [ctaText, setCtaText] = useState(initialData.ctaText);
  const [ctaLink, setCtaLink] = useState(initialData.ctaLink);

  const initialBooks =
    initialData.books && initialData.books.length > 0
      ? initialData.books
      : DEFAULT_BOOKS;

  const [books, setBooks] = useState<EbookPageItem[]>(initialBooks);

  const getUpdatedData = (overrides?: Partial<EbooksContent>): EbooksContent => ({
    badge,
    heading,
    headingAccent,
    description,
    ctaText,
    ctaLink,
    books,
    ...overrides,
  });

  const handleBadgeChange = (val: string) => {
    setBadge(val);
    onChange?.(getUpdatedData({ badge: val }));
  };

  const handleHeadingChange = (val: string) => {
    setHeading(val);
    onChange?.(getUpdatedData({ heading: val }));
  };

  const handleAccentChange = (val: string) => {
    setHeadingAccent(val);
    onChange?.(getUpdatedData({ headingAccent: val }));
  };

  const handleDescriptionChange = (val: string) => {
    setDescription(val);
    onChange?.(getUpdatedData({ description: val }));
  };

  const handleCtaTextChange = (val: string) => {
    setCtaText(val);
    onChange?.(getUpdatedData({ ctaText: val }));
  };

  const handleCtaLinkChange = (val: string) => {
    setCtaLink(val);
    onChange?.(getUpdatedData({ ctaLink: val }));
  };

  const handleBookTitleChange = (index: number, val: string) => {
    const updated = books.map((b, i) => (i === index ? { ...b, title: val } : b));
    setBooks(updated);
    onChange?.(getUpdatedData({ books: updated }));
  };

  const handleBookQuoteChange = (index: number, val: string) => {
    const updated = books.map((b, i) => (i === index ? { ...b, quote: val } : b));
    setBooks(updated);
    onChange?.(getUpdatedData({ books: updated }));
  };

  const handleBookProgressChange = (index: number, val: number) => {
    const clamped = Math.max(0, Math.min(100, isNaN(val) ? 50 : val));
    const updated = books.map((b, i) => (i === index ? { ...b, progress: clamped } : b));
    setBooks(updated);
    onChange?.(getUpdatedData({ books: updated }));
  };

  const handleAddBook = () => {
    const newBook: EbookPageItem = {
      title: "New Classic Book",
      quote: "“A memorable quote from the book that inspires thoughtful reading.”",
      progress: 50,
    };
    const updated = [...books, newBook];
    setBooks(updated);
    onChange?.(getUpdatedData({ books: updated }));
  };

  const handleRemoveBook = (index: number) => {
    if (books.length <= 1) {
      return;
    }
    const updated = books.filter((_, i) => i !== index);
    setBooks(updated);
    onChange?.(getUpdatedData({ books: updated }));
  };

  const handleSave = () => {
    onSave(getUpdatedData());
  };

  const handleReset = () => {
    setBadge(initialData.badge);
    setHeading(initialData.heading);
    setHeadingAccent(initialData.headingAccent);
    setDescription(initialData.description);
    setCtaText(initialData.ctaText);
    setCtaLink(initialData.ctaLink);
    setBooks(initialBooks);
    onReset();
  };

  return (
    <div className="space-y-6 rounded-2xl border border-border bg-surface p-5 shadow-xs sm:p-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-base font-bold text-foreground sm:text-lg">
            Edit Digital Editions (E-Books) Content
          </h2>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Customize the heading, description, and the interactive array of book titles &amp; quotes in the e-reader.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="gap-1.5 rounded-lg text-xs font-semibold cursor-pointer"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </Button>
      </div>

      {/* Main Section Header Fields */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="ebooks-badge" className="text-xs font-bold uppercase tracking-wider">
            Badge / Eyebrow Text *
          </Label>

          <Input
            id="ebooks-badge"
            value={badge}
            onChange={(e) => handleBadgeChange(e.target.value)}
            placeholder="e.g. DIGITAL EDITIONS"
            className="h-10 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="ebooks-heading" className="text-xs font-bold uppercase tracking-wider">
              Heading Main Line *
            </Label>

            <Input
              id="ebooks-heading"
              value={heading}
              onChange={(e) => handleHeadingChange(e.target.value)}
              placeholder="e.g. Carry your library"
              className="h-10 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ebooks-accent" className="text-xs font-bold uppercase tracking-wider">
              Heading Accent Word (Italic) *
            </Label>

            <Input
              id="ebooks-accent"
              value={headingAccent}
              onChange={(e) => handleAccentChange(e.target.value)}
              placeholder="e.g. everywhere."
              className="h-10 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ebooks-description" className="text-xs font-bold uppercase tracking-wider">
            Description Paragraph *
          </Label>

          <Textarea
            id="ebooks-description"
            rows={3}
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Enter e-reader description and instructions..."
            className="min-h-[80px] rounded-xl text-sm resize-y"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="ebooks-cta-text" className="text-xs font-bold uppercase tracking-wider">
              CTA Button Text
            </Label>

            <Input
              id="ebooks-cta-text"
              value={ctaText}
              onChange={(e) => handleCtaTextChange(e.target.value)}
              placeholder="e.g. Explore E-Books"
              className="h-10 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ebooks-cta-link" className="text-xs font-bold uppercase tracking-wider">
              CTA Target Link
            </Label>

            <Input
              id="ebooks-cta-link"
              value={ctaLink}
              onChange={(e) => handleCtaLinkChange(e.target.value)}
              placeholder="e.g. /books"
              className="h-10 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Array of Quotes & Titles in E-Reader */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Interactive Quotes &amp; Titles ({books.length})
            </h3>

            <p className="text-[11px] text-muted-foreground">
              Readers swipe through these cards inside the folio e-reader device.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddBook}
            className="gap-1.5 rounded-xl border-accent/40 text-xs font-semibold text-accent hover:bg-accent/10 cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Title &amp; Quote</span>
          </Button>
        </div>

        <div className="space-y-3.5">
          {books.map((bookItem, index) => (
            <div
              key={`book-${index}`}
              className="relative space-y-3 rounded-xl border border-border/80 bg-background/80 p-4 shadow-2xs transition-all hover:border-border"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[11px] font-bold text-accent">
                  Book Page #{index + 1}
                </span>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={books.length <= 1}
                  onClick={() => handleRemoveBook(index)}
                  className="h-7 px-2 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer disabled:opacity-30"
                  title={books.length <= 1 ? "At least one book quote is required" : "Remove this book quote"}
                >
                  <Trash2 size={13} />
                  <span className="ml-1 text-[11px]">Remove</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                <div className="sm:col-span-8 space-y-1">
                  <Label className="text-[11px] font-semibold text-muted-foreground">
                    Book Title *
                  </Label>
                  <Input
                    value={bookItem.title}
                    onChange={(e) => handleBookTitleChange(index, e.target.value)}
                    placeholder="e.g. Pride and Prejudice"
                    className="h-9 rounded-lg text-xs"
                  />
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <Label className="text-[11px] font-semibold text-muted-foreground">
                    Reading Progress ({bookItem.progress ?? 50}%)
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={bookItem.progress ?? 50}
                    onChange={(e) => handleBookProgressChange(index, parseInt(e.target.value, 10))}
                    placeholder="50"
                    className="h-9 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-muted-foreground">
                  Featured Quote *
                </Label>
                <Textarea
                  rows={2}
                  value={bookItem.quote}
                  onChange={(e) => handleBookQuoteChange(index, e.target.value)}
                  placeholder="Enter the quote displayed on this reader page..."
                  className="min-h-[60px] rounded-lg text-xs resize-y"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-3 border-t border-border">
        <Button
          type="button"
          onClick={handleSave}
          className="gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-accent-hover cursor-pointer"
        >
          <Save size={15} />
          <span>Save Digital Editions Content</span>
        </Button>
      </div>
    </div>
  );
}
