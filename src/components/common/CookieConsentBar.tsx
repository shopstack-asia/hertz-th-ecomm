"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCookieConsent } from "@/contexts/CookieConsentContext";

export function CookieConsentBar() {
  const { t } = useLanguage();
  const { consent, setConsent, openModal } = useCookieConsent();
  const [isHiding, setIsHiding] = useState(false);

  const handleAccept = () => {
    setIsHiding(true);
    setTimeout(() => {
      setConsent({
        necessary: true,
        analytics: true,
        marketing: true,
        timestamp: Date.now(),
      });
    }, 220);
  };

  const handleManage = () => {
    openModal();
  };

  if (consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label={t("cookie.title")}
      aria-live="polite"
      className={`fixed bottom-0 left-0 right-0 z-[100] flex flex-col bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] ${isHiding ? "cookie-consent-fade-out" : "animate-slide-up"}`}
    >
      {/* Hertz yellow stripe */}
      <div className="h-1 w-full shrink-0 bg-[#FFCC00]" aria-hidden />
      <div className="px-4 py-4 sm:px-6 sm:py-5 md:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <Link
              href="/"
              className="shrink-0 border-b-2 border-[#FFCC00] pb-0.5 font-bold text-black transition-opacity hover:opacity-90"
              aria-label={t("common.hertz_thailand")}
            >
              <span className="text-xl sm:text-2xl">Hertz</span>
            </Link>
            <p className="text-sm text-gray-700 sm:text-base">
              {t("cookie.description")}{" "}
              <Link
                href="/cookie-policy"
                className="font-medium text-hertz-yellow-500 underline decoration-hertz-yellow-500/60 underline-offset-2 transition hover:text-hertz-yellow-600 hover:decoration-hertz-yellow-600"
              >
                {t("cookie.learn_more")}
              </Link>
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handleManage}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-hertz-yellow-400 focus:ring-offset-2"
            >
              {t("cookie.manage")}
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="rounded-lg bg-hertz-yellow-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-hertz-yellow-400 focus:outline-none focus:ring-2 focus:ring-hertz-yellow-400 focus:ring-offset-2"
            >
              {t("cookie.accept")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
