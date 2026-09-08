import React from "react";
import Image from "next/image";
import CustomerFeedback from "@/assets/CustomerFeedback.png";

interface NoDataProps {
  size?: number;
  text?: string;
  className?: string;
}

export function NoData({ size = 200, text = "No data found.", className = "" }: NoDataProps) {
  const numericSize = typeof size === "number" ? size : 200;

  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
      <Image
        src={CustomerFeedback}
        alt="No data"
        width={numericSize}
        height={numericSize}
        className="mb-6 opacity-80 object-contain"
      />
      <p className="text-xl text-[var(--text-muted)] font-medium">{text}</p>
    </div>
  );
}

