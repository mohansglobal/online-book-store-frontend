"use client";

import { Barcode, IndianRupee, Layers, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BookPricingFieldsProps {
  isBookFound?: boolean;
  mrp: string;
  onMrpChange: (value: string) => void;
  sellingPrice: string;
  onSellingPriceChange: (value: string) => void;
  stock: string;
  onStockChange: (value: string) => void;
  sku: string;
  onSkuChange: (value: string) => void;
}

const LABEL_CLASS =
  "text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1";

const INPUT_CLASS =
  "h-10 rounded-md border-border bg-background text-foreground focus-visible:ring-1 focus-visible:ring-accent disabled:cursor-not-allowed disabled:bg-surface-soft/80 disabled:text-muted-foreground disabled:opacity-75 disabled:border-border/60";

export function BookPricingFields({
  isBookFound = false,
  mrp,
  onMrpChange,
  sellingPrice,
  onSellingPriceChange,
  stock,
  onStockChange,
  sku,
  onSkuChange,
}: BookPricingFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="mrp" className={LABEL_CLASS}>
          <span>Original Price (MRP)</span>
          {!isBookFound && <span className="text-accent">*</span>}
          {isBookFound && <Lock size={11} className="text-muted-foreground" />}
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
            disabled={isBookFound}
            value={mrp}
            onChange={(e) => onMrpChange(e.target.value)}
            placeholder="550.00"
            className={`${INPUT_CLASS} pl-9 font-sans tabular-nums`}
          />
        </div>
        {isBookFound && (
          <p className="text-[11px] text-muted-foreground">
            Locked from canonical book catalog.
          </p>
        )}
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

      <div className="space-y-2">
        <Label htmlFor="sku" className={LABEL_CLASS}>
          <span>SKU Code</span>
          <span className="text-xs font-normal normal-case text-muted-foreground">
            (optional)
          </span>
        </Label>
        <div className="relative">
          <Barcode
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="sku"
            type="text"
            value={sku}
            onChange={(e) => onSkuChange(e.target.value)}
            placeholder="SKU-CLEANCODE-01"
            className={`${INPUT_CLASS} pl-9 font-sans`}
          />
        </div>
      </div>
    </>
  );
}
