"use client";

import { IndianRupee } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BookPricingFieldsProps {
  price: string;
  onPriceChange: (value: string) => void;
  stock: string;
  onStockChange: (value: string) => void;
}

const LABEL_CLASS =
  "text-xs font-semibold uppercase tracking-wider text-text-secondary";

const INPUT_CLASS =
  "h-10 rounded-md border-border bg-background text-foreground focus-visible:ring-1 focus-visible:ring-accent";

export function BookPricingFields({
  price,
  onPriceChange,
  stock,
  onStockChange,
}: BookPricingFieldsProps) {
  return (
    <>
      {/* Price (Always editable for seller) */}
      <div className="space-y-2">
        <Label htmlFor="price" className={LABEL_CLASS}>
          Price (MRP) <span className="text-accent">*</span>
        </Label>
        <div className="relative">
          <IndianRupee
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="price"
            type="number"
            required
            min={0}
            step="0.01"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            placeholder="0.00"
            className={`${INPUT_CLASS} pl-9 font-sans tabular-nums`}
          />
        </div>
      </div>

      {/* Stock (Always editable for seller) */}
      <div className="space-y-2">
        <Label htmlFor="stock" className={LABEL_CLASS}>
          Stock <span className="text-accent">*</span>
        </Label>
        <Input
          id="stock"
          type="number"
          required
          min={0}
          value={stock}
          onChange={(e) => onStockChange(e.target.value)}
          placeholder="0"
          className={`${INPUT_CLASS} font-sans tabular-nums`}
        />
      </div>
    </>
  );
}
