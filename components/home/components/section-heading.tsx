import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { SectionHeadingProps } from "../types";

export function SectionHeading({
  eyebrow,
  title,
  copy,
  action,
}: SectionHeadingProps) {
  return (
    <header className="mb-9 flex flex-col justify-between gap-6 md:mb-[52px] md:flex-row md:items-end md:gap-[30px]">
      <div>
        {eyebrow && (
          <p className="mb-[18px] text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">
            {eyebrow}
          </p>
        )}

        <h2 className="m-0 font-display text-[clamp(46px,5vw,72px)] leading-[0.98] font-normal tracking-normal text-foreground">
          {title}
        </h2>

        {copy && (
          <p className="mt-[18px] max-w-[520px] text-base leading-relaxed text-muted-foreground">
            {copy}
          </p>
        )}
      </div>

      {action && (
        <Link
          href="/#books"
          className="hidden items-center gap-2 whitespace-nowrap text-sm font-medium text-muted-foreground transition-all hover:gap-3 hover:text-foreground md:inline-flex"
        >
          {action}

          <ArrowUpRight
            size={16}
            aria-hidden="true"
          />
        </Link>
      )}
    </header>
  );
}