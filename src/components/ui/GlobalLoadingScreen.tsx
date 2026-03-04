"use client";

/**
 * Shown until translations are ready. Prevents translation key flash (FOUC).
 * Minimal: white background, Hertz logo + spinner.
 */
export function GlobalLoadingScreen() {
  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-white"
      role="status"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="inline-block border-b-2 border-[#FFCC00] pb-0.5" aria-hidden>
          <span className="text-3xl font-bold text-black">Hertz</span>
        </div>
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-[#FFCC00] border-t-transparent"
          aria-hidden
        />
      </div>
    </div>
  );
}
