"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleLocale = () => {
    setLocale(locale === "th" ? "en" : "th");
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex min-h-[44px] min-w-[44px] items-center gap-1.5 text-hertz-black-80 hover:text-black"
        aria-label="Change language"
        aria-expanded={open}
      >
        <svg
          className="h-5 w-5"
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
        <span className="text-sm font-medium">{t("header.lang")}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 border border-hertz-border bg-white py-1 shadow-card">
          <button
            type="button"
            onClick={toggleLocale}
            className="min-h-tap w-full px-4 py-2 text-left text-sm font-medium text-hertz-black-80 hover:bg-hertz-gray hover:text-black"
          >
            {locale === "th" ? "English" : "ไทย"}
          </button>
        </div>
      )}
    </div>
  );
}
