"use client";

import { useState } from "react";
import Link from "next/link";
import { DesktopNav } from "./DesktopNav";
import { MobileDrawer } from "./MobileDrawer";
import { MegaMenu } from "./MegaMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookMegaOpen, setBookMegaOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      {/* Desktop header (≥1024px) */}
      <header className="hidden lg:block">
        <div className="relative border-b border-hertz-border bg-white">
          <div className="mx-auto flex h-[72px] max-w-container items-center justify-between px-6">
            <Link
              href="/"
              className="inline-block border-b-2 border-hertz-yellow pb-0.5"
              aria-label="Hertz Thailand"
            >
              <span className="text-2xl font-bold text-black">Hertz</span>
            </Link>
            <DesktopNav
              bookMegaOpen={bookMegaOpen}
              onBookMegaEnter={() => setBookMegaOpen(true)}
              onBookMegaLeave={() => setBookMegaOpen(false)}
            />
            <div className="flex items-center gap-6">
              <LanguageSwitcher />
              <Link
                href="/account/login"
                className="text-sm font-medium text-hertz-black-80 hover:text-black hover:underline"
              >
                {t("header.login")}
              </Link>
              <Link
                href="/account/register"
                className="min-h-tap inline-flex items-center justify-center bg-hertz-yellow px-5 font-bold text-black"
              >
                {t("header.register")}
              </Link>
            </div>
            </div>
        </div>
        <div className="h-0.5 bg-hertz-yellow" />
      </header>

      {/* Mobile header (<1024px) */}
      <header className="lg:hidden">
        <div className="sticky top-0 z-50 border-b border-hertz-border bg-white">
          <div className="flex h-[60px] items-center justify-between px-4">
            <Link href="/" className="text-xl font-bold text-black">
              Hertz
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex min-h-tap min-w-tap items-center justify-center text-hertz-black-80"
              aria-label="Open menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        <div className="h-0.5 bg-hertz-yellow" />
        <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
      </header>
    </>
  );
}
