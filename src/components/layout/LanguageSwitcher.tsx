"use client";

import { useLanguage } from "@/contexts/LanguageContext";

/** Thai flag: red-white-blue-white-red horizontal stripes (1:1:2:1:1) */
function FlagTH({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 16" aria-hidden>
      <rect width="24" height="2.67" fill="#A51931" />
      <rect y="2.67" width="24" height="2.67" fill="#fff" />
      <rect y="5.34" width="24" height="5.32" fill="#2D2A4A" />
      <rect y="10.66" width="24" height="2.67" fill="#fff" />
      <rect y="13.33" width="24" height="2.67" fill="#A51931" />
    </svg>
  );
}

/** UK/English flag: blue with St George cross (red + white) */
function FlagEN({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 16" aria-hidden>
      <rect width="24" height="16" fill="#012169" />
      <rect x="10" y="0" width="4" height="16" fill="#fff" />
      <rect x="0" y="6" width="24" height="4" fill="#fff" />
      <rect x="11" y="0" width="2" height="16" fill="#C8102E" />
      <rect x="0" y="7" width="24" height="2" fill="#C8102E" />
    </svg>
  );
}

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
      {locale === "th" ? (
        <FlagTH className="h-4 w-6 shrink-0 rounded-sm overflow-hidden border border-hertz-border" />
      ) : (
        <FlagEN className="h-4 w-6 shrink-0 rounded-sm overflow-hidden border border-hertz-border" />
      )}
      <span>{displayLabel}</span>
    </button>
  );
}
