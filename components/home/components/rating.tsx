import { Star } from "lucide-react";

interface RatingProps {
  value: string;
}

export function Rating({ value }: RatingProps) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-foreground">
      <Star
        size={13}
        aria-hidden="true"
        className="shrink-0 fill-amber-500 text-amber-500"
      />

      <span>{value}</span>
    </span>
  );
}