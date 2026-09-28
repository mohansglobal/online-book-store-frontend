"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface IsbnSearchFieldProps {
  isbn: string;
  onIsbnChange: (value: string) => void;
}

export function IsbnSearchField({ isbn, onIsbnChange }: IsbnSearchFieldProps) {
  return (
    <div className="space-y-2 md:col-span-2">
      <Label
        htmlFor="isbn"
        className="text-xs font-semibold uppercase tracking-wider text-text-secondary"
      >
        I.S.B.N Code (Optional)
      </Label>
      <Input
        id="isbn"
        value={isbn}
        onChange={(e) => onIsbnChange(e.target.value)}
        placeholder="Enter ISBN e.g. 978-0-14-345357-4"
        className="h-10 rounded-md border-border bg-background text-foreground focus-visible:ring-1 focus-visible:ring-accent"
      />
    </div>
  );
}
