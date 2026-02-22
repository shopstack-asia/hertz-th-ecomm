"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Returns true when the user has scrolled past the hero booking section (80% threshold).
 * Uses IntersectionObserver for performance.
 */
export function useScrollTrigger(
  targetId: string,
  threshold = 0.2
): boolean {
  const [shouldShow, setShouldShow] = useState(false);

  const handleIntersect = useCallback<IntersectionObserverCallback>(
    (entries) => {
      const entry = entries[0];
      if (!entry) return;
      // When hero is less than threshold visible (e.g. 20%), user has scrolled past 80%
      setShouldShow(entry.intersectionRatio < threshold);
    },
    [threshold]
  );

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: [0, threshold, 1],
      rootMargin: "0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [targetId, threshold, handleIntersect]);

  return shouldShow;
}
