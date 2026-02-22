"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  const handleToggle = () => {
    setLocale(locale === "th" ? "en" : "th");
  };

  const displayLabel = locale === "th" ? "TH" : "EN";

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="flex min-h-tap min-w-tap items-center gap-1.5 text-sm font-medium text-hertz-black-80 transition-colors hover:text-black hover:underline"
      aria-label={`Switch to ${locale === "th" ? "English" : "Thai"}`}
    >
      <svg
        className="h-5 w-5 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0h.5a2.5 2.5 0 002.5-2.5V8m0 4a2.5 2.5 0 01-2.5 2.5h-.5a2 2 0 00-2 2v1M12 20.414V19a2 2 0 00-2-2h-.5a2.5 2.5 0 01-2.5-2.5v-.414M12 3.586V5a2 2 0 012 2h.5a2.5 2.5 0 002.5 2.5v.414M12 12v.414a2.5 2.5 0 01-2.5 2.5h-.5a2 2 0 00-2 2V20M3 12v.414a2.5 2.5 0 002.5 2.5h.5a2 2 0 002 2V12m9-9.586V5a2 2 0 00-2 2h-.5a2.5 2.5 0 01-2.5 2.5v-.414M21 12v.414a2.5 2.5 0 01-2.5 2.5h-.5a2 2 0 00-2 2V20"
        />
      </svg>
      <span>{displayLabel}</span>
    </button>
  );
}
