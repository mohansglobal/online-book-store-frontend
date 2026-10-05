"use client";

import React, { useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AnnouncementContent } from "../types/content.types";

interface AnnouncementContentFormProps {
  initialData: AnnouncementContent;
  onChange?: (data: AnnouncementContent) => void;
  onSave: (data: AnnouncementContent) => void;
  onReset: () => void;
}

export function AnnouncementContentForm({
  initialData,
  onChange,
  onSave,
  onReset,
}: AnnouncementContentFormProps) {
  const [badge, setBadge] = useState(initialData.badge);
  const [text, setText] = useState(initialData.text);
  const [code, setCode] = useState(initialData.code);
  const [cta, setCta] = useState(initialData.cta);
  const [link, setLink] = useState(initialData.link);

  const getUpdatedData = (
    overrides?: Partial<AnnouncementContent>,
  ): AnnouncementContent => ({
    badge,
    text,
    code,
    cta,
    link,
    ...overrides,
  });

  const handleBadgeChange = (val: string) => {
    setBadge(val);
    onChange?.(getUpdatedData({ badge: val }));
  };

  const handleTextChange = (val: string) => {
    setText(val);
    onChange?.(getUpdatedData({ text: val }));
  };

  const handleCodeChange = (val: string) => {
    setCode(val);
    onChange?.(getUpdatedData({ code: val }));
  };

  const handleCtaChange = (val: string) => {
    setCta(val);
    onChange?.(getUpdatedData({ cta: val }));
  };

  const handleLinkChange = (val: string) => {
    setLink(val);
    onChange?.(getUpdatedData({ link: val }));
  };

  const handleSave = () => {
    onSave(getUpdatedData());
  };

  const handleReset = () => {
    setBadge(initialData.badge);
    setText(initialData.text);
    setCode(initialData.code);
    setCta(initialData.cta);
    setLink(initialData.link);
    onReset();
  };

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-surface p-5 shadow-xs sm:p-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-base font-bold text-foreground sm:text-lg">
            Edit Announcement Bar Content
          </h2>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Configure the top global announcement bar with discount pill and call to action.
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
            <Label htmlFor="announcement-badge" className="text-xs font-bold uppercase tracking-wider">
              Badge Pill Text *
            </Label>

            <Input
              id="announcement-badge"
              value={badge}
              onChange={(e) => handleBadgeChange(e.target.value)}
              placeholder="e.g. 20% FLAT OFF"
              className="h-10 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="announcement-code" className="text-xs font-bold uppercase tracking-wider">
              Coupon Code
            </Label>

            <Input
              id="announcement-code"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder="e.g. FLAT20"
              className="h-10 rounded-xl font-mono uppercase"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="announcement-text" className="text-xs font-bold uppercase tracking-wider">
            Announcement Message Text *
          </Label>

          <Textarea
            id="announcement-text"
            rows={2}
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="e.g. Get 20% Flat Discount on all books! Use coupon"
            className="min-h-[70px] rounded-xl text-sm resize-y"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="announcement-cta" className="text-xs font-bold uppercase tracking-wider">
              Button / CTA Text
            </Label>

            <Input
              id="announcement-cta"
              value={cta}
              onChange={(e) => handleCtaChange(e.target.value)}
              placeholder="e.g. Shop Now"
              className="h-10 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="announcement-link" className="text-xs font-bold uppercase tracking-wider">
              Destination URL
            </Label>

            <Input
              id="announcement-link"
              value={link}
              onChange={(e) => handleLinkChange(e.target.value)}
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
          className="gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-accent-hover"
        >
          <Save size={15} />
          <span>Save Announcement Content</span>
        </Button>
      </div>
    </div>
  );
}
