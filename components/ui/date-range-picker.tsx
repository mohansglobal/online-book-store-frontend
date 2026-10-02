// Reusable visual DateRangePicker component using Popover and Calendar primitives
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Select promotion date range",
  disabled = false,
  minDate,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  const formattedText = React.useMemo(() => {
    if (!value?.from) {
      return null;
    }

    if (!value.to) {
      return format(value.from, "LLL dd, yyyy");
    }

    return `${format(value.from, "LLL dd, yyyy")} – ${format(value.to, "LLL dd, yyyy")}`;
  }, [value]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="dateRange"
            variant="outline"
            disabled={disabled}
            className={cn(
              "h-10 w-full justify-start text-left font-normal text-xs cursor-pointer border-border hover:border-accent/40 transition-colors",
              !value && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-3.5 w-3.5 text-accent shrink-0" />
            <span className="flex-1 truncate">
              {formattedText || placeholder}
            </span>
            {value?.from && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleClear(e as unknown as React.MouseEvent);
                  }
                }}
                className="ml-2 rounded-full p-0.5 hover:bg-surface-hover text-muted-foreground hover:text-foreground cursor-pointer"
                title="Clear date range"
              >
                <X className="h-3 w-3" />
              </span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-0 z-50 border-border bg-surface shadow-md"
          align="start"
        >
          <Calendar
            mode="range"
            defaultMonth={value?.from || minDate || new Date()}
            selected={value}
            onSelect={onChange}
            numberOfMonths={1}
            disabled={minDate ? { before: minDate } : undefined}
            className="rounded-md border-0"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
