// Price range filter section with dual range slider and responsive min/max inputs
"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  DEFAULT_PRICE_MAX,
  DEFAULT_PRICE_MIN,
  getSliderStep,
} from "../utils/price-bounds";

export interface PriceFilterSectionProps {
  minPrice?: number;

  maxPrice?: number;

  minLimit?: number;

  maxLimit?: number;

  step?: number;

  isLoading?: boolean;

  onApplyPrice: (min?: number, max?: number) => void;

  onClearPrice: () => void;

  isOpenDefault?: boolean;
}

export function PriceFilterSection({
  minPrice,
  maxPrice,
  minLimit,
  maxLimit,
  step,
  onApplyPrice,
  onClearPrice,
  isOpenDefault = true,
}: PriceFilterSectionProps) {
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  const effectiveMinLimit = minLimit ?? DEFAULT_PRICE_MIN;

  const effectiveMaxLimit = maxLimit ?? DEFAULT_PRICE_MAX;

  const sliderStep = step ?? getSliderStep(effectiveMinLimit, effectiveMaxLimit);

  // Slider range values [min, max]
  const [sliderRange, setSliderRange] = useState<[number, number]>([
    minPrice ?? effectiveMinLimit,
    maxPrice ?? effectiveMaxLimit,
  ]);

  // Text inputs
  const [inputMin, setInputMin] = useState(
    minPrice !== undefined ? String(minPrice) : "",
  );

  const [inputMax, setInputMax] = useState(
    maxPrice !== undefined ? String(maxPrice) : "",
  );

  // Sync state when external props change
  useEffect(() => {
    const curMin = minPrice ?? effectiveMinLimit;

    const curMax = maxPrice ?? effectiveMaxLimit;

    setSliderRange([curMin, curMax]);

    setInputMin(minPrice !== undefined ? String(minPrice) : "");

    setInputMax(maxPrice !== undefined ? String(maxPrice) : "");
  }, [minPrice, maxPrice, effectiveMinLimit, effectiveMaxLimit]);

  const handleSliderChange = (vals: number[]) => {
    const minVal = vals[0] ?? effectiveMinLimit;

    const maxVal = vals[1] ?? effectiveMaxLimit;

    setSliderRange([minVal, maxVal]);

    const displayMin = minVal > effectiveMinLimit ? String(minVal) : "";

    const displayMax = maxVal < effectiveMaxLimit ? String(maxVal) : "";

    setInputMin(displayMin);

    setInputMax(displayMax);
  };

  const handleSliderCommit = (vals: number[]) => {
    const rawMin = vals[0] ?? effectiveMinLimit;

    const rawMax = vals[1] ?? effectiveMaxLimit;

    const sMin = rawMin > effectiveMinLimit ? rawMin : undefined;

    const sMax = rawMax < effectiveMaxLimit ? rawMax : undefined;

    onApplyPrice(sMin, sMax);
  };

  const handleApply = (event?: React.FormEvent) => {
    event?.preventDefault();

    const trimmedMin = inputMin.trim();

    const trimmedMax = inputMax.trim();

    const parsedMin = trimmedMin !== "" ? Number(trimmedMin) : undefined;

    const parsedMax = trimmedMax !== "" ? Number(trimmedMax) : undefined;

    let safeMin =
      parsedMin !== undefined && !Number.isNaN(parsedMin)
        ? Math.max(0, parsedMin)
        : undefined;

    let safeMax =
      parsedMax !== undefined && !Number.isNaN(parsedMax)
        ? Math.max(0, parsedMax)
        : undefined;

    // Handle inverted range edge case
    if (safeMin !== undefined && safeMax !== undefined && safeMin > safeMax) {
      const temp = safeMin;

      safeMin = safeMax;

      safeMax = temp;

      setInputMin(String(safeMin));

      setInputMax(String(safeMax));
    }

    onApplyPrice(safeMin, safeMax);
  };

  const hasActivePrice = minPrice !== undefined || maxPrice !== undefined;

  return (
    <section className="border-b border-border py-4">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between text-left cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
            Price Range (₹)
          </span>

          {hasActivePrice && (
            <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
              Active
            </span>
          )}
        </div>

        <span className="text-muted-foreground group-hover:text-foreground transition-colors">
          {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </span>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4">
          {/* Dual Range Slider with dynamic book min/max bounds */}
          <div className="pt-2 px-1 space-y-2">
            <Slider
              value={[sliderRange[0], sliderRange[1]]}
              min={effectiveMinLimit}
              max={effectiveMaxLimit}
              step={sliderStep}
              onValueChange={handleSliderChange}
              onValueCommit={handleSliderCommit}
              className="w-full"
            />

            <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
              <span>₹{sliderRange[0]}</span>

              <span>₹{sliderRange[1]}</span>
            </div>
          </div>

          {/* Custom Min / Max Inputs */}
          <form onSubmit={handleApply} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground select-none">
                  ₹
                </span>

                <Input
                  type="number"
                  min="0"
                  placeholder={`Min (${effectiveMinLimit})`}
                  value={inputMin}
                  onChange={(e) => setInputMin(e.target.value)}
                  className="h-8 bg-surface-soft/60 border-border/70 pl-6 pr-1.5 text-xs shadow-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground select-none">
                  ₹
                </span>

                <Input
                  type="number"
                  min="0"
                  placeholder={`Max (${effectiveMaxLimit})`}
                  value={inputMax}
                  onChange={(e) => setInputMax(e.target.value)}
                  className="h-8 bg-surface-soft/60 border-border/70 pl-6 pr-1.5 text-xs shadow-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="submit"
                size="sm"
                className="h-8 flex-1 text-xs bg-accent text-white hover:bg-accent-hover"
              >
                Apply (₹)
              </Button>

              {hasActivePrice && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onClearPrice}
                  className="h-8 text-xs text-destructive hover:bg-destructive/10"
                >
                  Clear
                </Button>
              )}
            </div>
          </form>
        </div>
      )}
    </section>
  );
}