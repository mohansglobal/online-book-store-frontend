"use client";

import React, { useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { HeroContent } from "../types/content.types";

interface HeroContentFormProps {
  initialData: HeroContent;
  onChange?: (data: HeroContent) => void;
  onSave: (data: HeroContent) => void;
  onReset: () => void;
}

export function HeroContentForm({
  initialData,
  onChange,
  onSave,
  onReset,
}: HeroContentFormProps) {
  const [headlinePart1, setHeadlinePart1] = useState(initialData.headlinePart1);
  const [headlinePart2, setHeadlinePart2] = useState(initialData.headlinePart2);
  const [rotatingWordsStr, setRotatingWordsStr] = useState(
    initialData.rotatingWords.join(", "),
  );
  const [description, setDescription] = useState(initialData.description);

  const getUpdatedData = (overrides?: Partial<HeroContent>): HeroContent => {
    const parsedWords = rotatingWordsStr
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean);

    return {
      headlinePart1,
      headlinePart2,
      rotatingWords:
        parsedWords.length > 0 ? parsedWords : initialData.rotatingWords,
      description,
      searchPlaceholder: initialData.searchPlaceholder ?? "",
      ...overrides,
    };
  };

  const handleHeadline1Change = (val: string) => {
    setHeadlinePart1(val);
    onChange?.(getUpdatedData({ headlinePart1: val }));
  };

  const handleHeadline2Change = (val: string) => {
    setHeadlinePart2(val);
    onChange?.(getUpdatedData({ headlinePart2: val }));
  };

  const handleRotatingWordsChange = (val: string) => {
    setRotatingWordsStr(val);
    const parsed = val
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean);
    onChange?.(getUpdatedData({ rotatingWords: parsed }));
  };

  const handleDescriptionChange = (val: string) => {
    setDescription(val);
    onChange?.(getUpdatedData({ description: val }));
  };

  const handleSave = () => {
    onSave(getUpdatedData());
  };

  const handleReset = () => {
    setHeadlinePart1(initialData.headlinePart1);
    setHeadlinePart2(initialData.headlinePart2);
    setRotatingWordsStr(initialData.rotatingWords.join(", "));
    setDescription(initialData.description);
    onReset();
  };

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface p-5 shadow-xs sm:p-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-base font-bold text-foreground sm:text-lg">
            Edit Hero Section Content
          </h2>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Configure the main landing banner headline, rotating keywords, and intro paragraph.
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label
              htmlFor="hero-headline-1"
              className="text-xs font-bold uppercase tracking-wider"
            >
              Headline Line 1 *
            </Label>

            <Input
              id="hero-headline-1"
              value={headlinePart1}
              onChange={(e) => handleHeadline1Change(e.target.value)}
              placeholder="e.g. The bookshop shelf,"
              className="h-10 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="hero-headline-2"
              className="text-xs font-bold uppercase tracking-wider"
            >
              Headline Line 2 Prefix *
            </Label>

            <Input
              id="hero-headline-2"
              value={headlinePart2}
              onChange={(e) => handleHeadline2Change(e.target.value)}
              placeholder="e.g. curated for your"
              className="h-10 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="hero-rotating"
            className="text-xs font-bold uppercase tracking-wider"
          >
            Rotating Keywords (Comma-separated) *
          </Label>

          <Input
            id="hero-rotating"
            value={rotatingWordsStr}
            onChange={(e) => handleRotatingWordsChange(e.target.value)}
            placeholder="e.g. journey., curiosity., character., escapism."
            className="h-10 rounded-xl"
          />

          <span className="text-[11px] text-muted-foreground">
            These words rotate dynamically in italics with an animated transition.
          </span>
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="hero-description"
            className="text-xs font-bold uppercase tracking-wider"
          >
            Hero Description Paragraph *
          </Label>

          <Textarea
            id="hero-description"
            rows={3}
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Enter the highlighted user-facing description..."
            className="min-h-[80px] rounded-xl text-sm resize-y"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-3 border-t border-border">
        <Button
          type="button"
          onClick={handleSave}
          className="gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-accent-hover cursor-pointer"
        >
          <Save size={15} />
          <span>Save Hero Content</span>
        </Button>
      </div>
    </div>
  );
}
