"use client";

import { IndianRupee, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BookPricingFieldsProps {
  mrp: string;
  onMrpChange: (value: string) => void;
  sellingPrice: string;
  onSellingPriceChange: (value: string) => void;
  stock: string;
  onStockChange: (value: string) => void;
  sku?: string;
  onSkuChange?: (value: string) => void;
}

const LABEL_CLASS =
  "text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1";

const INPUT_CLASS =
  "h-10 rounded-md border-border bg-background text-foreground focus-visible:ring-1 focus-visible:ring-accent";

export function BookPricingFields({
  mrp,
  onMrpChange,
  sellingPrice,
  onSellingPriceChange,
  stock,
  onStockChange,
}: BookPricingFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="mrp" className={LABEL_CLASS}>
          <span>Original Price (MRP)</span>
          <span className="text-accent">*</span>
        </Label>
        <div className="relative">
          <IndianRupee
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="mrp"
            type="number"
            required
            min={0}
            step="0.01"
            value={mrp}
            onChange={(e) => onMrpChange(e.target.value)}
            placeholder="550.00"
            className={`${INPUT_CLASS} pl-9 font-sans tabular-nums`}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sellingPrice" className={LABEL_CLASS}>
          <span>Selling Price</span>
          <span className="text-accent">*</span>
        </Label>
        <div className="relative">
          <IndianRupee
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="sellingPrice"
            type="number"
            required
            min={0}
            step="0.01"
            value={sellingPrice}
            onChange={(e) => onSellingPriceChange(e.target.value)}
            placeholder={mrp || "450.00"}
            className={`${INPUT_CLASS} pl-9 font-sans tabular-nums`}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="stock" className={LABEL_CLASS}>
          <span>Stock Quantity</span>
          <span className="text-accent">*</span>
        </Label>
        <div className="relative">
          <Layers
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="stock"
            type="number"
            required
            min={0}
            value={stock}
            onChange={(e) => onStockChange(e.target.value)}
            placeholder="25"
            className={`${INPUT_CLASS} pl-9 font-sans tabular-nums`}
          />
        </div>
      </div>
    </>
  );
}
