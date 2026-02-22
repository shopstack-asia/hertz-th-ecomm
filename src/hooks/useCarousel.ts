"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface UseCarouselOptions {
  total: number;
  intervalMs?: number;
  transitionMs?: number;
}

export function useCarousel({
  total,
  intervalMs = 6000,
  transitionMs = 300,
}: UseCarouselOptions) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (next: number) => {
      setIndex((prev) => (next + total) % total);
    },
    [total]
  );

  const next = useCallback(() => goTo(index + 1), [index, goTo]);
  const prev = useCallback(() => goTo(index - 1), [index, goTo]);

  useEffect(() => {
    if (total <= 0 || isPaused) return;
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, intervalMs, isPaused]);

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
