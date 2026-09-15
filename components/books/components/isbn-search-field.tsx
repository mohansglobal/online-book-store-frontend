"use client";

import { CheckCircle2, Info, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { IsbnLookupResponse } from "@/features/books";

interface IsbnSearchFieldProps {
  isbn: string;
  onIsbnChange: (value: string) => void;
  isChecking: boolean;
  isBookFound: boolean;
  lookupResponse?: IsbnLookupResponse;
  debouncedIsbn: string;
}

const LABEL_CLASS =
  "text-xs font-semibold uppercase tracking-wider text-text-secondary";

export function IsbnSearchField({
  isbn,
  onIsbnChange,
  isChecking,
  isBookFound,
  lookupResponse,
  debouncedIsbn,
}: IsbnSearchFieldProps) {
  return (
    <div className="space-y-2 md:col-span-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="isbn" className={LABEL_CLASS}>
          I.S.B.N Code (Auto-Lookup)
        </Label>
        {isChecking && (
          <span className="flex items-center gap-1.5 text-xs text-accent">
            <Loader2 size={12} className="animate-spin" />
            Looking up ISBN...
          </span>
        )}
      </div>

      <div className="relative">
        <Input
          id="isbn"
          value={isbn}
          onChange={(e) => onIsbnChange(e.target.value)}
          placeholder="Enter ISBN e.g. 978-0-14-345357-4"
          className="h-10 rounded-md border-border bg-background pr-10 text-foreground focus-visible:ring-1 focus-visible:ring-accent"
        />
        <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground">
          {isChecking ? (
            <Loader2 size={16} className="animate-spin text-accent" />
          ) : isBookFound ? (
            <CheckCircle2 size={16} className="text-emerald-600" />
          ) : (
            <Search size={16} className="opacity-40" />
          )}
        </div>
      </div>

      {isBookFound && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={13} />
          Canonical book found in catalog — details autofilled and locked.
        </p>
      )}

      {lookupResponse && !lookupResponse.exists && debouncedIsbn.length >= 3 && !isChecking && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Info size={13} className="text-accent" />
          New ISBN — please fill in the book details below to register it.
        </p>
      )}
    </div>
  );
}
