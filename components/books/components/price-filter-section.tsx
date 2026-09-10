"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export interface PriceFilterSectionProps {
  minPrice?: number;
  maxPrice?: number;
  onApplyPrice: (min?: number, max?: number) => void;
  onClearPrice: () => void;
  isOpenDefault?: boolean;
}

const MAX_SLIDER_LIMIT = 2000;
const SLIDER_STEP = 25;

const QUICK_PRESETS = [
  { label: "Under ₹150", min: undefined, max: 150 },
  { label: "₹150 - ₹300", min: 150, max: 300 },
  { label: "₹300 - ₹600", min: 300, max: 600 },
  { label: "₹600+", min: 600, max: undefined },
];

export function PriceFilterSection({
  minPrice,
  maxPrice,
  onApplyPrice,
  onClearPrice,
  isOpenDefault = true,
}: PriceFilterSectionProps) {
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  // Slider range values [min, max]
  const [sliderRange, setSliderRange] = useState<[number, number]>([
    minPrice ?? 0,
    maxPrice ?? MAX_SLIDER_LIMIT,
  ]);

  // Text inputs
  const [inputMin, setInputMin] = useState(minPrice !== undefined ? String(minPrice) : "");
  const [inputMax, setInputMax] = useState(maxPrice !== undefined ? String(maxPrice) : "");

  // Sync state when external props change
  useEffect(() => {
    const curMin = minPrice ?? 0;
    const curMax = maxPrice ?? MAX_SLIDER_LIMIT;
    setSliderRange([curMin, curMax]);
    setInputMin(minPrice !== undefined ? String(minPrice) : "");
    setInputMax(maxPrice !== undefined ? String(maxPrice) : "");
  }, [minPrice, maxPrice]);

  const handleSliderChange = (vals: number[]) => {
    const minVal = vals[0] ?? 0;
    const maxVal = vals[1] ?? MAX_SLIDER_LIMIT;
    setSliderRange([minVal, maxVal]);
    setInputMin(minVal > 0 ? String(minVal) : "");
    setInputMax(maxVal < MAX_SLIDER_LIMIT ? String(maxVal) : "");
  };

  const handleApply = (event?: React.FormEvent) => {
    event?.preventDefault();
    const parsedMin = inputMin.trim() !== "" ? Number(inputMin) : undefined;
    const parsedMax = inputMax.trim() !== "" ? Number(inputMax) : undefined;
    let safeMin = parsedMin !== undefined && !Number.isNaN(parsedMin) ? Math.max(0, parsedMin) : undefined;
    let safeMax = parsedMax !== undefined && !Number.isNaN(parsedMax) ? Math.max(0, parsedMax) : undefined;

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

  const handlePresetClick = (presetMin?: number, presetMax?: number) => {
    setInputMin(presetMin !== undefined ? String(presetMin) : "");
    setInputMax(presetMax !== undefined ? String(presetMax) : "");
    setSliderRange([presetMin ?? 0, presetMax ?? MAX_SLIDER_LIMIT]);
    onApplyPrice(presetMin, presetMax);
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
          {/* Quick Preset Buttons */}
          {/* <div className="grid grid-cols-2 gap-1.5">
            {QUICK_PRESETS.map((preset) => {
              const isSelected = minPrice === preset.min && maxPrice === preset.max;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handlePresetClick(preset.min, preset.max)}
                  className={`h-8 rounded-md px-2 text-xs font-medium border transition-colors cursor-pointer ${
                    isSelected
                      ? "border-accent bg-accent text-white"
                      : "border-border/60 bg-[#F7F1E3] text-foreground hover:border-accent/60"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div> */}

          {/* Compact Dual Range Slider */}
          <div className="pt-2 px-1 space-y-2">
            <Slider
              value={[sliderRange[0], sliderRange[1]]}
              min={0}
              max={MAX_SLIDER_LIMIT}
              step={SLIDER_STEP}
              onValueChange={handleSliderChange}
              onValueCommit={(vals) => {
                const sMin = vals[0] > 0 ? vals[0] : undefined;
                const sMax = vals[1] < MAX_SLIDER_LIMIT ? vals[1] : undefined;
                onApplyPrice(sMin, sMax);
              }}
              className="w-full"
            />
            <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
              <span>₹{sliderRange[0]}</span>
              <span>₹{sliderRange[1] >= MAX_SLIDER_LIMIT ? `${MAX_SLIDER_LIMIT}+` : sliderRange[1]}</span>
            </div>
          </div>

          {/* Custom Min / Max Inputs */}
          <form onSubmit={handleApply} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                  ₹
                </span>
                <Input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={inputMin}
                  onChange={(e) => setInputMin(e.target.value)}
                  className="h-8 bg-[#F7F1E3] border-border/70 pl-6 text-xs shadow-none"
                />
              </div>

              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                  ₹
                </span>
                <Input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={inputMax}
                  onChange={(e) => setInputMax(e.target.value)}
                  className="h-8 bg-[#F7F1E3] border-border/70 pl-6 text-xs shadow-none"
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