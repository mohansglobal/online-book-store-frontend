"use client";

import type { ButtonProps } from "../types";

export function Button({
  children,
  secondary = false,
  onClick,
  type = "button",
}: ButtonProps) {
  const variantClasses = secondary
    ? "border border-border bg-secondary text-foreground hover:bg-surface-hover"
    : "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        inline-flex
        min-h-[48px]
        cursor-pointer
        items-center
        justify-center
        gap-[9px]
        rounded-sm
        px-[21px]
        text-sm
        font-semibold
        transition-all
        duration-200
        hover:-translate-y-0.5
        ${variantClasses}
      `}
    >
      {children}
    </button>
  );
}