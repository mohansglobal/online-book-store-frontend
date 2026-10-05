"use client";

import React, { useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { NewsletterContent } from "../types/content.types";

interface NewsletterContentFormProps {
  initialData: NewsletterContent;
  onChange?: (data: NewsletterContent) => void;
  onSave: (data: NewsletterContent) => void;
  onReset: () => void;
}

export function NewsletterContentForm({
  initialData,
  onChange,
  onSave,
  onReset,
}: NewsletterContentFormProps) {
  const [heading, setHeading] = useState(initialData.heading);
  const [headingAccent, setHeadingAccent] = useState(initialData.headingAccent);
  const [description, setDescription] = useState(initialData.description);

  const getUpdatedData = (overrides?: Partial<NewsletterContent>): NewsletterContent => ({
    heading,
    headingAccent,
    description,
    ...overrides,
  });

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

  const handleSave = () => {
    onSave(getUpdatedData());
  };

  const handleReset = () => {
    setHeading(initialData.heading);
    setHeadingAccent(initialData.headingAccent);
    setDescription(initialData.description);
    onReset();
  };

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface p-5 shadow-xs sm:p-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-base font-bold text-foreground sm:text-lg">
            Edit Newsletter Section Content
          </h2>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Customize the &quot;Good books deserve good company&quot; newsletter invite.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="gap-1.5 rounded-lg text-xs font-semibold"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="newsletter-heading" className="text-xs font-bold uppercase tracking-wider">
              Heading Main Line *
            </Label>

            <Input
              id="newsletter-heading"
              value={heading}
              onChange={(e) => handleHeadingChange(e.target.value)}
              placeholder="e.g. Good books deserve"
              className="h-10 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="newsletter-accent" className="text-xs font-bold uppercase tracking-wider">
              Heading Accent Line (Italic) *
            </Label>

            <Input
              id="newsletter-accent"
              value={headingAccent}
              onChange={(e) => handleAccentChange(e.target.value)}
              placeholder="e.g. good company."
              className="h-10 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="newsletter-description" className="text-xs font-bold uppercase tracking-wider">
            Description Paragraph *
          </Label>

          <Textarea
            id="newsletter-description"
            rows={3}
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Enter newsletter description..."
            className="min-h-[80px] rounded-xl text-sm resize-y"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-3 border-t border-border">
        <Button
          type="button"
          onClick={handleSave}
          className="gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-accent-hover"
        >
          <Save size={15} />
          <span>Save Newsletter Content</span>
        </Button>
      </div>
    </div>
  );
}
