// Reusable smart DatePicker supporting direct manual typing, copy-pasting, and visual calendar selection
"use client";

import * as React from "react";
import { Calendar as CalendarIcon, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  parseSmartDate,
  formatDateToISO,
  parseAndFormatDate,
  formatDateDisplay,
} from "@/lib/date-utils";

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
  showPreviewBadge?: boolean;
}

const VARIANT_CONTAINER_STYLES: Record<DatePickerVariant, string> = {
  input:
    "border-border bg-background text-foreground hover:border-accent/50 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent",
  outline:
    "border-border bg-background text-foreground hover:bg-surface-hover shadow-xs focus-within:border-accent focus-within:ring-1 focus-within:ring-accent",
  soft:
    "border-border/60 bg-surface/80 text-foreground hover:bg-surface hover:border-accent/40 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent",
  ghost:
    "border-transparent bg-transparent text-foreground hover:bg-surface-hover focus-within:border-accent focus-within:ring-1 focus-within:ring-accent",
};

export function DatePicker({
  id,
  value = "",
  onChange,
  placeholder = "YYYY-MM-DD or e.g. 7 May 1861",
  disabled = false,
  minDate,
  maxDate,
  fromYear = 1000,
  toYear = new Date().getFullYear(),
  variant = "input",
  className,
  showPreviewBadge = true,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Local text input state for typing and pasting
  const [localText, setLocalText] = React.useState(value);
  const [prevPropValue, setPrevPropValue] = React.useState(value);

  // Synchronize state during render when prop changes without useEffect
  if (prevPropValue !== value) {
    setPrevPropValue(value);
    setLocalText(value);
  }

  // Derive parsed Date object from either prop value or currently committed valid date
  const parsedDate = React.useMemo(() => {
    if (!value) return undefined;
    const parsed = parseSmartDate(value);
    return parsed ?? undefined;
  }, [value]);

  // Derived preview of recognized date for helpful user feedback
  const recognizedDisplay = React.useMemo(() => {
    if (!localText.trim()) return null;
    const parsed = parseSmartDate(localText);
    if (!parsed) return null;
    return formatDateDisplay(formatDateToISO(parsed));
  }, [localText]);

  // Commit and normalize typed date
  const commitDate = (rawText: string) => {
    const trimmed = rawText.trim();

    if (!trimmed) {
      if (value !== "") {
        onChange("");
      }
      return;
    }

    const normalized = parseAndFormatDate(trimmed);

    if (normalized) {
      setLocalText(normalized);
      if (normalized !== value) {
        onChange(normalized);
      }
    } else {
      // Pass raw text so validation can catch it
      if (trimmed !== value) {
        onChange(trimmed);
      }
    }
  };

  // Handles manual keyboard typing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setLocalText(newVal);

    if (!newVal.trim()) {
      onChange("");
      return;
    }

    // Auto-commit if user types complete ISO date or 4-digit year
    if (newVal.length === 10 || /^\d{4}$/.test(newVal.trim())) {
      const normalized = parseAndFormatDate(newVal);
      if (normalized && normalized !== value) {
        onChange(normalized);
      }
    }
  };

  // Handles input blur to finalize and normalize the date
  const handleBlur = () => {
    commitDate(localText);
  };

  // Handles Enter key press to commit immediately
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitDate(localText);
    }
  };

  // Intercepts copy-pasting to parse arbitrary date text instantly
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");

    if (!pastedText) return;

    const normalized = parseAndFormatDate(pastedText);

    if (normalized) {
      e.preventDefault();
      setLocalText(normalized);
      onChange(normalized);
      toast.success(`Date recognized: ${formatDateDisplay(normalized)}`, {
        duration: 2500,
      });
    }
  };

  // Handles selection from visual DayPicker Calendar
  const handleSelectCalendarDate = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const normalized = formatDateToISO(selectedDate);
      setLocalText(normalized);
      onChange(normalized);
    } else {
      setLocalText("");
      onChange("");
    }

    setOpen(false);
  };

  // Clears the input and resets value
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setLocalText("");
    onChange("");
  };

  return (
    <div className="relative flex flex-col gap-1 w-full">
      <div
        className={cn(
          "group relative flex h-10 w-full items-center rounded-md border px-3 text-sm transition-all duration-200",
          VARIANT_CONTAINER_STYLES[variant],
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        {/* Direct text input for typing or pasting */}
        <input
          id={id}
          type="text"
          value={localText}
          onChange={handleChange}
          onBlur={handleBlur}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className="h-full w-full bg-transparent pr-16 text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed text-sm"
        />

        {/* Action buttons: Clear & Calendar Popover */}
        <div className="absolute right-2 flex items-center gap-1">
          {localText && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              title="Clear date"
              className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground hover:bg-surface-hover hover:text-foreground cursor-pointer transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Clear date</span>
            </button>
          )}

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                disabled={disabled}
                title="Open calendar picker"
                className="flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground hover:bg-surface-hover hover:text-accent cursor-pointer transition-colors disabled:cursor-not-allowed"
              >
                <CalendarIcon className="h-4 w-4 text-accent" />
                <span className="sr-only">Open calendar</span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 z-50 border-border bg-surface shadow-xl rounded-xl"
              align="end"
            >
              <Calendar
                mode="single"
                captionLayout="dropdown"
                defaultMonth={parsedDate || new Date()}
                selected={parsedDate}
                onSelect={handleSelectCalendarDate}
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
        </div>
      </div>

      {/* Helpful smart recognition badge when valid date is identified */}
      {showPreviewBadge && recognizedDisplay && (
        <div className="flex items-center gap-1 px-1 text-[11px] text-muted-foreground">
          <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
          <span>Recognized:</span>
          <span className="font-medium text-foreground">{recognizedDisplay}</span>
        </div>
      )}
    </div>
  );
}
