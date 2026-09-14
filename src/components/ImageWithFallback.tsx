"use client";

import Image, { ImageProps } from "next/image";
import { forwardRef, useState } from "react";

interface ImageWithFallbackProps extends Omit<ImageProps, "onError"> {
  fallback?: React.ReactNode;
  onImageError?: () => void;
}

const ImageWithFallback = forwardRef<HTMLImageElement, ImageWithFallbackProps>(
  function ImageWithFallback({ fallback, alt, onImageError, ...props }, ref) {
    const [hasError, setHasError] = useState(false);

    if (hasError || !props.src) {
      return (
        fallback || (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-surface-2 text-muted">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-9 w-9 opacity-50"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <span className="text-xs font-medium uppercase tracking-wide">Bild nicht gefunden</span>
          </div>
        )
      );
    }

    return <Image {...props} ref={ref} alt={alt} onError={() => { setHasError(true); onImageError?.(); }} />;
  }
);

export default ImageWithFallback;
