"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPromptBanner() {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      if (!dismissed) setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    const standalone = (window.navigator as Navigator & { standalone?: boolean }).standalone;
    const isPWA = !!(
      window.matchMedia("(display-mode: standalone)").matches || standalone
    );
    setIsInstalled(isPWA);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShowBanner(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  if (!showBanner || isInstalled || !deferredPrompt) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-hertz-border bg-white p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.1)]"
      role="banner"
      aria-label={t("pwa.install_app")}
    >
      <div className="mx-auto flex max-w-container items-center justify-between gap-4 px-6">
        <div>
          <p className="font-bold text-black">{t("pwa.install_title")}</p>
          <p className="text-sm text-hertz-black-80">
            {t("pwa.install_subtitle")}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={handleDismiss}
            className="min-h-tap px-4 text-sm font-medium text-hertz-black-80 hover:text-black"
          >
            {t("pwa.not_now")}
          </button>
          <button
            type="button"
            onClick={handleInstall}
            className="min-h-tap bg-[#FFCC00] px-5 font-bold text-black"
          >
            {t("pwa.install")}
          </button>
        </div>
      </div>
    </div>
  );
}
