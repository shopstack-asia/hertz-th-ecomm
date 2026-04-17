"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DesktopNav } from "./DesktopNav";
import { MobileDrawer } from "./MobileDrawer";
import { MegaMenu } from "./MegaMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth_context";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookMegaOpen, setBookMegaOpen] = useState(false);
  const bookMegaCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { authenticated, user, refreshAuth } = useAuth();
  const loginHref = `/account/login?returnUrl=${encodeURIComponent(pathname ?? "/")}`;
  const registerHref = `/account/register?returnUrl=${encodeURIComponent(pathname ?? "/")}`;

  useEffect(() => {
    if (!profileOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [profileOpen]);

  const onBookMegaEnter = useCallback(() => {
    if (bookMegaCloseTimerRef.current) {
      clearTimeout(bookMegaCloseTimerRef.current);
      bookMegaCloseTimerRef.current = null;
    }
    setBookMegaOpen(true);
  }, []);

  const onBookMegaLeave = useCallback(() => {
    bookMegaCloseTimerRef.current = setTimeout(() => setBookMegaOpen(false), 100);
  }, []);

  useEffect(() => {
    return () => {
      if (bookMegaCloseTimerRef.current) clearTimeout(bookMegaCloseTimerRef.current);
    };
  }, []);

  const handleLogout = async () => {
    setProfileOpen(false);
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    await refreshAuth();
    router.push("/account/login");
  };

  return (
    <>
      {/* Desktop header (≥1024px) */}
      <header className="hidden lg:block">
        <div className="relative border-b border-hertz-border bg-white">
          <div className="mx-auto flex h-[72px] max-w-container items-center justify-between px-12">
            <Link
              href="/"
              className="inline-block border-b-2 border-hertz-yellow pb-0.5"
              aria-label={t("common.hertz_thailand")}
            >
              <span className="text-2xl font-bold text-black">Hertz</span>
            </Link>
            <DesktopNav
              bookMegaOpen={bookMegaOpen}
              onBookMegaEnter={onBookMegaEnter}
              onBookMegaLeave={onBookMegaLeave}
            />
            <div className="flex items-center gap-6">
              <LanguageSwitcher />
              {authenticated && user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => setProfileOpen((o) => !o)}
                    className="flex items-center gap-2 text-sm font-medium text-hertz-black-80 hover:text-black"
                    aria-expanded={profileOpen}
                    aria-haspopup="true"
                  >
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt=""
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-hertz-gray text-xs font-bold text-hertz-black-60">
                        {(user.first_name?.[0] ?? "") + (user.last_name?.[0] ?? "") || "?"}
                      </span>
                    )}
                    {user.first_name} {user.last_name}
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-full z-[9999] mt-1 min-w-[160px] border border-hertz-border bg-white shadow">
                      <Link
                        href="/account/profile"
                        onClick={() => setProfileOpen(false)}
                        className="block border-b border-hertz-border px-4 py-3 text-sm font-medium text-black hover:bg-hertz-gray"
                      >
                        My profile
                      </Link>
                      <Link
                        href="/account/bookings/upcoming"
                        onClick={() => setProfileOpen(false)}
                        className="block border-b border-hertz-border px-4 py-3 text-sm font-medium text-black hover:bg-hertz-gray"
                      >
                        {t("header.my_booking")}
                      </Link>
                      <Link
                        href="/my-points"
                        onClick={() => setProfileOpen(false)}
                        className="block border-b border-hertz-border px-4 py-3 text-sm font-medium text-black hover:bg-hertz-gray"
                      >
                        My Points
                      </Link>
                      <Link
                        href="/my-vouchers"
                        onClick={() => setProfileOpen(false)}
                        className="block border-b border-hertz-border px-4 py-3 text-sm font-medium text-black hover:bg-hertz-gray"
                      >
                        My Vouchers
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="block w-full px-4 py-3 text-left text-sm font-medium text-hertz-black-80 hover:bg-hertz-gray"
                      >
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href={loginHref}
                    className="text-sm font-medium text-hertz-black-80 hover:text-black hover:underline"
                  >
                    {t("header.login")}
                  </Link>
                  <Link
                    href={registerHref}
                    className="min-h-tap inline-flex items-center justify-center bg-hertz-yellow px-5 font-bold text-black"
                  >
                    {t("header.register")}
                  </Link>
                </>
              )}
            </div>
            </div>
        </div>
        <div className="h-0.5 bg-hertz-yellow" />
      </header>

      {/* Mobile header (<1024px) */}
      <header className="lg:hidden">
        <div className="sticky top-0 z-50 border-b border-hertz-border bg-white">
          <div className="flex h-[60px] items-center justify-between gap-2 px-4">
            <Link href="/" className="text-xl font-bold text-black">
              Hertz
            </Link>
            <div className="flex min-w-0 flex-1 items-center justify-end gap-1 sm:gap-2">
              <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex min-h-tap min-w-tap shrink-0 items-center justify-center text-hertz-black-80"
              aria-label={t("common.open_menu")}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            </div>
          </div>
        </div>
        <div className="h-0.5 bg-hertz-yellow" />
        <MobileDrawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          loginHref={loginHref}
          registerHref={registerHref}
          authenticated={authenticated}
          user={user}
          onLogout={handleLogout}
        />
      </header>
    </>
  );
}
