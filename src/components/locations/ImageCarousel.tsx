"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

const SWIPE_THRESHOLD = 50;

export function ImageCarousel({ images, alt, className = "" }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const touchStart = useRef<number | null>(null);
  const count = images.length;

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? count - 1 : i - 1));
  }, [count]);

  const goNext = useCallback(() => {
    setIndex((i) => (i >= count - 1 ? 0 : i + 1));
  }, [count]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = e.targetTouches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStart.current == null || count <= 1) return;
      const dx = e.changedTouches[0].clientX - touchStart.current;
      if (dx > SWIPE_THRESHOLD) goPrev();
      else if (dx < -SWIPE_THRESHOLD) goNext();
      touchStart.current = null;
    },
    [count, goPrev, goNext]
  );

  if (!count) return null;

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-hertz-gray ${className}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={images[index]}
          alt={`${alt} ${index + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 60vw"
          unoptimized={images[index]?.startsWith("http")}
        />
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
              aria-label="Previous image"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
              aria-label="Next image"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition ${
                    i === index ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white/80"
                  }`}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
