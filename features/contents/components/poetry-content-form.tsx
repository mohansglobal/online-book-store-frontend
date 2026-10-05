"use client";

import React, { useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PoetryContent } from "../types/content.types";

interface PoetryContentFormProps {
  initialData: PoetryContent;
  onChange?: (data: PoetryContent) => void;
  onSave: (data: PoetryContent) => void;
  onReset: () => void;
}

export function PoetryContentForm({
  initialData,
  onChange,
  onSave,
  onReset,
}: PoetryContentFormProps) {
  const [badge, setBadge] = useState(initialData.badge);
  const [quote, setQuote] = useState(initialData.quote);
  const [author, setAuthor] = useState(initialData.author);
  const [ctaText, setCtaText] = useState(initialData.ctaText);
  const [ctaLink, setCtaLink] = useState(initialData.ctaLink);

  const getUpdatedData = (
    overrides?: Partial<PoetryContent>,
  ): PoetryContent => ({
    badge,
    quote,
    quoteAccent: "",
    author,
    ctaText,
    ctaLink,
    ...overrides,
  });

  const handleBadgeChange = (val: string) => {
    setBadge(val);
    onChange?.(getUpdatedData({ badge: val }));
  };

  const handleQuoteChange = (val: string) => {
    setQuote(val);
    onChange?.(getUpdatedData({ quote: val }));
  };

  const handleAuthorChange = (val: string) => {
    setAuthor(val);
    onChange?.(getUpdatedData({ author: val }));
  };

  const handleCtaTextChange = (val: string) => {
    setCtaText(val);
    onChange?.(getUpdatedData({ ctaText: val }));
  };

  const handleCtaLinkChange = (val: string) => {
    setCtaLink(val);
    onChange?.(getUpdatedData({ ctaLink: val }));
  };

  const handleSave = () => {
    onSave(getUpdatedData());
  };

  const handleReset = () => {
    setBadge(initialData.badge);
    setQuote(initialData.quote);
    setAuthor(initialData.author);
    setCtaText(initialData.ctaText);
    setCtaLink(initialData.ctaLink);
    onReset();
  };

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface p-5 shadow-xs sm:p-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-base font-bold text-foreground sm:text-lg">
            Edit Poetry & Prose Content
          </h2>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Customize the highlighted literary quotation, author attribution, and collection link.
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

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="poetry-badge" className="text-xs font-bold uppercase tracking-wider">
            Badge / Eyebrow Text *
          </Label>

          <Input
            id="poetry-badge"
            value={badge}
            onChange={(e) => handleBadgeChange(e.target.value)}
            placeholder="e.g. POETRY & PROSE"
            className="h-10 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="poetry-quote" className="text-xs font-bold uppercase tracking-wider">
            Full Literary Quote *
          </Label>

          <Textarea
            id="poetry-quote"
            rows={3}
            value={quote}
            onChange={(e) => handleQuoteChange(e.target.value)}
            placeholder="e.g. “A poem begins in delight and ends in wisdom.”"
            className="min-h-[80px] rounded-xl text-sm resize-y"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="poetry-author" className="text-xs font-bold uppercase tracking-wider">
            Author Attribution *
          </Label>

          <Input
            id="poetry-author"
            value={author}
            onChange={(e) => handleAuthorChange(e.target.value)}
            placeholder="e.g. — Robert Frost"
            className="h-10 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="poetry-cta-text" className="text-xs font-bold uppercase tracking-wider">
              Link Text
            </Label>

            <Input
              id="poetry-cta-text"
              value={ctaText}
              onChange={(e) => handleCtaTextChange(e.target.value)}
              placeholder="e.g. Explore the collection"
              className="h-10 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="poetry-cta-link" className="text-xs font-bold uppercase tracking-wider">
              Link Target
            </Label>

            <Input
              id="poetry-cta-link"
              value={ctaLink}
              onChange={(e) => handleCtaLinkChange(e.target.value)}
              placeholder="e.g. /books"
              className="h-10 rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-3 border-t border-border">
        <Button
          type="button"
          onClick={handleSave}
          className="gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-accent-hover cursor-pointer"
        >
          <Save size={15} />
          <span>Save Poetry Content</span>
        </Button>
      </div>
    </div>
  );
}
