"use client";

import type { IconButtonProps } from "../types";

export function IconButton({
  label,
  children,
  onClick,
  count,
  className = "",
}: IconButtonProps) {
  const showCount = typeof count === "number" && count > 0;

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`
        relative
        inline-grid
        h-11
        w-11
        cursor-pointer
        place-items-center
        rounded-full
        border
        border-transparent
        bg-transparent
        p-0
        text-foreground
        transition-all
        duration-200
        hover:border-border
        hover:bg-surface-hover
        ${className}
      `}
    >
      {children}

      {showCount && (
        <span className="absolute top-px right-0 grid h-4 min-w-4 place-items-center rounded-full bg-orange-600 px-1 text-[9px] font-bold text-white shadow-sm">
          {count}
        </span>
      )}
    </button>
  );
}