"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCookieConsent, type CookieConsentState } from "@/contexts/CookieConsentContext";

interface CookieSettingsModalProps {
  onClose: () => void;
}

export function CookieSettingsModal({ onClose }: CookieSettingsModalProps) {
  const { t } = useLanguage();
  const { consent, setConsent, closeModal } = useCookieConsent();
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consent) {
      setAnalytics(consent.analytics);
      setMarketing(consent.marketing);
    }
  }, [consent]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleSavePreferences = () => {
    setConsent({
      necessary: true,
      analytics,
      marketing,
      timestamp: Date.now(),
    });
    closeModal();
    onClose();
  };

  const handleAcceptAll = () => {
    setConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    });
    closeModal();
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-modal-title"
      className="cookie-modal-overlay-in fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4"
      onClick={handleOverlayClick}
    >
      <div
        className="cookie-modal-content-in max-h-[90vh] w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex max-h-[90vh] flex-col">
          <div className="border-b border-hertz-border px-6 py-4">
            <h2
              id="cookie-modal-title"
              className="text-lg font-bold text-black"
            >
              {t("cookie.title")}
            </h2>
          </div>
          <div className="overflow-y-auto px-6 py-4">
            {/* Necessary - always on, disabled toggle */}
            <section className="border-b border-hertz-border pb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-black">
                    {t("cookie.necessary_title")}
                  </h3>
                  <p className="mt-1 text-sm text-hertz-black-70">
                    {t("cookie.necessary_desc")}
                  </p>
                </div>
                <div className="shrink-0 pt-0.5">
                  <span
                    role="switch"
                    aria-checked="true"
                    aria-label={t("cookie.necessary_title")}
                    aria-disabled="true"
                    className="inline-flex h-6 w-11 cursor-not-allowed items-center rounded-full bg-gray-300 px-1 opacity-80"
                  >
                    <span className="h-4 w-4 translate-x-5 rounded-full bg-white shadow" />
                  </span>
                </div>
              </div>
            </section>

            {/* Analytics - toggle */}
            <section className="border-b border-hertz-border py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-black">
                    {t("cookie.analytics_title")}
                  </h3>
                  <p className="mt-1 text-sm text-hertz-black-70">
                    {t("cookie.analytics_desc")}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={analytics}
                  aria-label={t("cookie.analytics_title")}
                  onClick={() => setAnalytics((v) => !v)}
                  className="shrink-0 pt-0.5 focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:ring-offset-2 rounded-full"
                >
                  <span
                    className={`inline-flex h-6 w-11 items-center rounded-full px-1 transition ${
                      analytics ? "bg-[#FFCC00]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        analytics ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </span>
                </button>
              </div>
            </section>

            {/* Marketing - toggle */}
            <section className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-black">
                    {t("cookie.marketing_title")}
                  </h3>
                  <p className="mt-1 text-sm text-hertz-black-70">
                    {t("cookie.marketing_desc")}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={marketing}
                  aria-label={t("cookie.marketing_title")}
                  onClick={() => setMarketing((v) => !v)}
                  className="shrink-0 pt-0.5 focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:ring-offset-2 rounded-full"
                >
                  <span
                    className={`inline-flex h-6 w-11 items-center rounded-full px-1 transition ${
                      marketing ? "bg-[#FFCC00]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        marketing ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </span>
                </button>
              </div>
            </section>
          </div>
          <div className="flex flex-wrap gap-3 border-t border-hertz-border bg-hertz-gray/30 px-6 py-4">
            <button
              type="button"
              onClick={handleSavePreferences}
              className="min-h-tap rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:ring-offset-2"
            >
              {t("cookie.save_preferences")}
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="min-h-tap rounded-lg bg-[#FFCC00] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#FFCC00]/90 focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:ring-offset-2"
            >
              {t("cookie.accept_all")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
