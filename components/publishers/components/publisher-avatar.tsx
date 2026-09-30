"use client";

import { useState } from "react";
import Image from "next/image";
import { Building2 } from "lucide-react";
import type { Publisher } from "@/features/publishers";

const DEFAULT_PUBLISHER_FALLBACK =
  "https://i.pinimg.com/1200x/96/6a/23/966a235a132f8b5e7312c877d99aa9c1.jpg";

function getPublisherImage(publisher: Publisher): string {
  const rawImage = publisher.logo || publisher.image;
  const hasImage =
    (publisher.isImage === "1" || publisher.isImage === 1) && Boolean(rawImage);

  if (!hasImage || !rawImage) {
    return DEFAULT_PUBLISHER_FALLBACK;
  }

  if (rawImage.startsWith("http://") || rawImage.startsWith("https://")) {
    return rawImage;
  }

  const backendBase =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ||
    "http://localhost:5000";

  return `${backendBase}/assets/upload/author/${rawImage}`;
}

export interface PublisherAvatarProps {
  publisher: Publisher;
  sizes?: string;
}

export function PublisherAvatar({
  publisher,
  sizes = "72px",
}: PublisherAvatarProps) {
  const initialSrc = getPublisherImage(publisher);
  const [currentSrc, setCurrentSrc] = useState<string>(initialSrc);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative flex h-[88px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background shadow-xs transition-colors group-hover:border-primary">
      {!hasError ? (
        <Image
          src={currentSrc}
          alt={`${publisher.name} logo`}
          fill
          sizes={sizes}
          unoptimized={true}
          onError={() => {
            if (currentSrc !== DEFAULT_PUBLISHER_FALLBACK) {
              setCurrentSrc(DEFAULT_PUBLISHER_FALLBACK);
            } else {
              setHasError(true);
            }
          }}
          className={
            currentSrc === DEFAULT_PUBLISHER_FALLBACK
              ? "object-cover transition-transform duration-500 group-hover:scale-110"
              : "object-contain p-1 transition-transform duration-500 group-hover:scale-110"
          }
        />
      ) : (
        <Building2
          size={26}
          strokeWidth={1.7}
          className="text-muted-foreground group-hover:text-primary"
        />
      )}
    </div>
  );
}
