"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { LocaleOption } from "@/contexts/LanguageContext";

function LocaleFlag({ lang }: { lang: LocaleOption }) {
  if (lang.flagUrl) {
    return (
      <img
        src={lang.flagUrl}
        alt=""
        className="h-5 w-6 shrink-0 rounded-sm border border-hertz-border object-cover"
      />
    );
  }
  if (lang.flag) {
    return (
      <span
        className="flex h-5 w-6 shrink-0 items-center justify-center rounded-sm border border-hertz-border text-base"
        aria-hidden
      >
        {lang.flag}
      </span>
    );
  }
  return null;
}

export function LanguageSwitcher() {
  const { availableLocales, locale, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = availableLocales.find((l) => l.code === locale) ?? availableLocales[0];

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [open]);

  if (availableLocales.length === 0) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-tap min-w-tap items-center gap-1.5 text-sm font-medium text-hertz-black-80 transition-colors hover:text-black hover:underline"
        aria-label={current ? `${t("common.language")}: ${current.label}` : t("common.language")}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {current && <LocaleFlag lang={current} />}
        <span>{current?.label ?? locale}</span>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul
          className="absolute right-0 top-full z-30 mt-1 min-w-[120px] border border-hertz-border bg-white shadow"
          role="menu"
        >
          {availableLocales.map((lang) => (
            <li key={lang.code} role="none">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setLocale(lang.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium hover:bg-hertz-gray ${
                  locale === lang.code ? "bg-hertz-gray text-black" : "text-hertz-black-80"
                }`}
              >
                <LocaleFlag lang={lang} />
                <span>{lang.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
