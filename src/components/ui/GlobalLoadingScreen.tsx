"use client";

/**
 * Shown until translations are ready. Prevents translation key flash (FOUC).
 * Minimal: white background, centered Hertz-style loading indicator.
 */
export function GlobalLoadingScreen() {
  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-white"
      role="status"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="h-10 w-32 bg-[#FFCC00]/20 rounded" aria-hidden />
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-[#FFCC00] border-t-transparent"
          aria-hidden
        />
      </div>
    </div>
  );
}
