// Reusable shadcn/ui DatePicker component with Popover and DayPicker Calendar
"use client";

import * as React from "react";
import { format, parseISO, isValid } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type DatePickerVariant = "input" | "outline" | "soft" | "ghost";

export interface DatePickerProps {
  id?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  fromYear?: number;
  toYear?: number;
  variant?: DatePickerVariant;
  className?: string;
}

const VARIANT_STYLES: Record<DatePickerVariant, string> = {
  input:
    "border-border bg-background text-foreground hover:border-accent/50 focus:border-accent focus:ring-1 focus:ring-accent",
  outline:
    "border-border bg-background text-foreground hover:bg-surface-hover shadow-xs",
  soft:
    "border-border/60 bg-surface/80 text-foreground hover:bg-surface hover:border-accent/40",
  ghost:
    "border-transparent bg-transparent text-foreground hover:bg-surface-hover",
};

export function DatePicker({
  id,
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  minDate,
  maxDate,
  fromYear = 1750,
  toYear = new Date().getFullYear(),
  variant = "input",
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const parsedDate = React.useMemo(() => {
    if (!value) return undefined;
    const parsed = parseISO(value);
    return isValid(parsed) ? parsed : undefined;
  }, [value]);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onChange(format(selectedDate, "yyyy-MM-dd"));
    } else {
      onChange("");
    }
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          disabled={disabled}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border px-3 text-left text-sm font-normal transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
            VARIANT_STYLES[variant],
            !parsedDate && "text-muted-foreground",
            className,
          )}
        >
          <span className="flex items-center gap-2 truncate">
            <CalendarIcon className="h-4 w-4 text-accent shrink-0" />
            {parsedDate ? format(parsedDate, "PPP") : placeholder}
          </span>
          {parsedDate && !disabled && (
            <span
              role="button"
              tabIndex={0}
              title="Clear date"
              className="flex h-5 w-5 items-center justify-center rounded-sm text-muted-foreground hover:bg-surface-hover hover:text-foreground shrink-0 cursor-pointer transition-colors"
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleClear(e as unknown as React.MouseEvent);
                }
              }}
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-50 border-border bg-surface shadow-lg rounded-xl" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={parsedDate}
          onSelect={handleSelect}
          disabled={(date) => {
            if (maxDate && date > maxDate) return true;
            if (minDate && date < minDate) return true;
            return false;
          }}
          startMonth={new Date(fromYear, 0)}
          endMonth={new Date(toYear, 11)}
        />
      </PopoverContent>
    </Popover>
  );
}
