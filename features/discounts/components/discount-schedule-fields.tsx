// Form inputs for scheduling date-wise promotional discounts using UI components
"use client";

import React from "react";
import { format } from "date-fns";
import { Calendar, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import type { DateRange } from "react-day-picker";

interface DiscountScheduleFieldsProps {
  isScheduled: boolean;

  onIsScheduledChange: (checked: boolean) => void;

  campaignName: string;

  onCampaignNameChange: (val: string) => void;

  startDate: string;

  onStartDateChange: (val: string) => void;

  endDate: string;

  onEndDateChange: (val: string) => void;
}

const LABEL_CLASS =
  "text-[10px] font-bold uppercase tracking-wider text-muted-foreground";

export function DiscountScheduleFields({
  isScheduled,
  onIsScheduledChange,
  campaignName,
  onCampaignNameChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
}: DiscountScheduleFieldsProps) {
  const dateRangeValue: DateRange | undefined = React.useMemo(() => {
    if (!startDate) return undefined;

    return {
      from: new Date(startDate),
      to: endDate ? new Date(endDate) : undefined,
    };
  }, [startDate, endDate]);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (!range?.from) {
      onStartDateChange("");

      onEndDateChange("");

      return;
    }

    onStartDateChange(format(range.from, "yyyy-MM-dd"));

    if (range.to) {
      onEndDateChange(format(range.to, "yyyy-MM-dd"));
    } else {
      onEndDateChange("");
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-border/80 bg-surface-soft/40 p-3.5">
      <div className="flex items-center justify-between">
        <Label
          htmlFor="isScheduledSwitch"
          className="text-xs font-semibold text-foreground cursor-pointer flex items-center gap-1.5"
        >
          <Calendar className="h-3.5 w-3.5 text-accent" />
          Schedule Promotion (Date-Wise Window)
        </Label>

        <Switch
          id="isScheduledSwitch"
          checked={isScheduled}
          onCheckedChange={onIsScheduledChange}
        />
      </div>

      {isScheduled && (
        <div className="space-y-3 pt-2 border-t border-border/60">
          <div className="space-y-1.5">
            <Label htmlFor="campaignName" className={LABEL_CLASS}>
              Campaign Name (Optional)
            </Label>

            <Input
              id="campaignName"
              type="text"
              placeholder="e.g. Festive Super Sale"
              value={campaignName}
              onChange={(e) => onCampaignNameChange(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className={LABEL_CLASS}>Promotion Date Range</Label>

            <DateRangePicker
              value={dateRangeValue}
              onChange={handleDateRangeChange}
              placeholder="Select start and end dates"
              minDate={new Date()}
            />
          </div>

          <div className="flex items-start gap-1.5 rounded-lg bg-accent/5 border border-accent/15 p-2.5 text-[11px] text-muted-foreground">
            <Info className="h-3.5 w-3.5 shrink-0 text-accent mt-0.5" />

            <p>
              The promotional price applies automatically between the start and end dates.
              Once expired, the listing automatically reverts to its normal base price.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
