"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import type { AuthUser } from "@/contexts/auth_context";

const navItems = [
  { href: "/account/bookings/upcoming", key: "nav.manage_booking" },
  { href: "/locations", key: "nav.locations" },
  { href: "/special-offers", key: "nav.offers" },
  { href: "/vehicles", key: "nav.vehicles" },
  { href: "/vouchers", key: "nav.vouchers" },
  { href: "/rewards", key: "nav.rewards" },
] as const;

const bookSubItems = [
  { href: "/#booking", key: "megaMenu.book_car" },
  { href: "/#booking", key: "megaMenu.long_term" },
  { href: "/#booking", key: "megaMenu.business" },
  { href: "/account/bookings/upcoming", key: "megaMenu.manage_reservation" },
  { href: "/account/bookings/upcoming", key: "megaMenu.online_checkin" },
  { href: "/car-rental", key: "megaMenu.requirements" },
] as const;

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  loginHref?: string;
  registerHref?: string;
  authenticated?: boolean;
  user?: AuthUser | null;
  onLogout?: () => void;
}

export function MobileDrawer({ open, onClose, loginHref, registerHref, authenticated, user, onLogout }: MobileDrawerProps) {
  const pathname = usePathname();
  const loginUrl = loginHref ?? `/account/login?returnUrl=${encodeURIComponent(pathname ?? "/")}`;
  const registerUrl = registerHref ?? `/account/register?returnUrl=${encodeURIComponent(pathname ?? "/")}`;
  const { t, locale, setLocale } = useLanguage();
  const [bookExpanded, setBookExpanded] = useState(false);

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
              aria-expanded={open}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Book accordion */}
          <div className="border-b border-hertz-border pb-4">
            <button
              type="button"
              onClick={() => setBookExpanded(!bookExpanded)}
              className="flex min-h-tap w-full items-center justify-between py-3 text-left text-base font-medium text-hertz-black-80"
              aria-expanded={bookExpanded}
            >
              {t("nav.book")}
              <svg
                className={`h-5 w-5 transition-transform ${bookExpanded ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {bookExpanded && (
              <div className="ml-4 mt-2 space-y-1">
                {bookSubItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={onClose}
                    className="block min-h-tap py-2 text-sm text-hertz-black-80"
                  >
                    {t(item.key)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Other nav items */}
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.key}>
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

          {/* Language */}
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

          {/* Login / Register or User + Log out */}
          <div className="mt-4 flex flex-col gap-2">
            {authenticated && user && onLogout ? (
              <>
                <Link
                  href="/account/profile"
                  onClick={onClose}
                  className="min-h-tap flex items-center justify-center border border-hertz-border font-medium text-black"
                >
                  {user.first_name} {user.last_name}
                </Link>
                <Link
                  href="/my-vouchers"
                  onClick={onClose}
                  className="min-h-tap flex items-center justify-center border border-hertz-border font-medium text-black"
                >
                  My Vouchers
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="min-h-tap flex items-center justify-center bg-hertz-yellow font-bold text-black"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href={loginUrl}
                  onClick={onClose}
                  className="min-h-tap flex items-center justify-center border border-hertz-border font-medium text-black"
                >
                  {t("header.login")}
                </Link>
                <Link
                  href={registerUrl}
                  onClick={onClose}
                  className="min-h-tap flex items-center justify-center bg-hertz-yellow font-bold text-black"
                >
                  {t("header.register")}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
