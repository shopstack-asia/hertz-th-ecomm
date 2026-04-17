"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface UseCarouselOptions {
  total: number;
  intervalMs?: number;
  transitionMs?: number;
  /** When false, the carousel does not auto-advance on an interval. */
  autoPlay?: boolean;
}

export function useCarousel({
  total,
  intervalMs = 6000,
  transitionMs = 300,
  autoPlay = true,
}: UseCarouselOptions) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (next: number) => {
      if (total <= 0) return;
      setIndex(() => ((next % total) + total) % total);
    },
    [total]
  );

  const next = useCallback(() => {
    if (total <= 0) return;
    setIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    if (total <= 0) return;
    setIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (total <= 0 || isPaused || !autoPlay) return;
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, intervalMs, isPaused, autoPlay]);

  useEffect(() => {
    const handleVisibility = () => {
      setIsPaused(document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return {
    index,
    goTo,
    next,
    prev,
    isPaused,
    pause: () => setIsPaused(true),
    resume: () => setIsPaused(false),
  };
}
