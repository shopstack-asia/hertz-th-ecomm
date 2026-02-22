"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

const navItems = [
  { href: "/car-rental", key: "nav.car_rental" },
  { href: "/special-offers", key: "nav.special_offers" },
  { href: "/locations", key: "nav.locations" },
  { href: "/rewards", key: "nav.gold_rewards" },
  { href: "/vehicle-guide", key: "nav.vehicle_guide" },
  { href: "/products-services", key: "nav.products_services" },
  { href: "/drivers", key: "nav.drivers" },
] as const;

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { t, locale, setLocale } = useLanguage();

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={onClose}
        aria-hidden
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto border-l border-hertz-border bg-white lg:hidden">
        <div className="flex flex-col p-6">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-lg font-bold text-black">Menu</span>
            <button
              type="button"
              onClick={onClose}
              className="flex min-h-tap min-w-tap items-center justify-center text-hertz-black-80 hover:text-black"
              aria-label="Close menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`block min-h-tap py-3 text-base font-medium ${
                      isActive ? "font-bold text-black underline" : "text-hertz-black-80"
                    }`}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-8 flex items-center gap-2 border-t border-hertz-border pt-6">
            <span className="text-sm text-hertz-black-60">Language</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLocale("th")}
                className={`min-h-tap px-4 font-medium ${
                  locale === "th" ? "font-bold text-black underline" : "text-hertz-black-60"
                }`}
              >
                ไทย
              </button>
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={`min-h-tap px-4 font-medium ${
                  locale === "en" ? "font-bold text-black underline" : "text-hertz-black-60"
                }`}
              >
                English
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/account/login"
              onClick={onClose}
              className="min-h-tap flex items-center justify-center border border-hertz-border font-medium text-black"
            >
              {t("header.login")}
            </Link>
            <Link
              href="/account/register"
              onClick={onClose}
              className="min-h-tap flex items-center justify-center bg-hertz-yellow font-bold text-black"
            >
              {t("header.register")}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
