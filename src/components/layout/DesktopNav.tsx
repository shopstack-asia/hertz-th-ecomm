"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { MegaMenu } from "./MegaMenu";

const navItems = [
  { href: "/#booking", key: "nav.book", hasMega: true },
  { href: "/account/bookings/upcoming", key: "nav.manage_booking", hasMega: false },
  { href: "/locations", key: "nav.locations", hasMega: false },
  { href: "/special-offers", key: "nav.offers", hasMega: false },
  { href: "/vehicles", key: "nav.vehicles", hasMega: false },
  { href: "/rewards", key: "nav.rewards", hasMega: false },
] as const;

interface DesktopNavProps {
  bookMegaOpen: boolean;
  onBookMegaEnter: () => void;
  onBookMegaLeave: () => void;
}

export function DesktopNav({
  bookMegaOpen,
  onBookMegaEnter,
  onBookMegaLeave,
}: DesktopNavProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav className="relative flex items-center gap-8" aria-label="Main navigation">
      {navItems.map((item) => {
        if (item.hasMega) {
          return (
            <div
              key={item.key}
              className="relative"
              onMouseEnter={onBookMegaEnter}
              onMouseLeave={onBookMegaLeave}
            >
              <Link
                href="/#booking"
                className={`text-sm font-medium text-hertz-black-80 transition-colors hover:text-black hover:underline ${
                  pathname === "/" ? "font-bold text-black underline" : ""
                }`}
              >
                {t(item.key)}
              </Link>
              <MegaMenu
                isOpen={bookMegaOpen}
                onClose={() => {}}
                onMouseEnter={onBookMegaEnter}
                onMouseLeave={onBookMegaLeave}
                triggerRef={{ current: null }}
              />
            </div>
          );
        }
        const isActive = item.href ? pathname === item.href : false;
        return (
          <Link
            key={item.key}
            href={item.href!}
            className={`text-sm font-medium text-hertz-black-80 transition-colors hover:text-black hover:underline ${
              isActive ? "font-bold text-black underline" : ""
            }`}
          >
            {t(item.key)}
          </Link>
        );
      })}
    </nav>
  );
}
