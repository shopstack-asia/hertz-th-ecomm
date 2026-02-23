"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export function MegaMenu({
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: MegaMenuProps) {
  const { t } = useLanguage();

  const leftItems = [
    { href: "/#booking", label: t("megaMenu.book_car"), primary: true },
    { href: "/#booking", label: t("megaMenu.long_term"), primary: false },
    { href: "/#booking", label: t("megaMenu.business"), primary: false },
  ];

  const rightItems = [
    { href: "/account/bookings/upcoming", label: t("megaMenu.manage_reservation") },
    { href: "/account/bookings/upcoming", label: t("megaMenu.online_checkin") },
    { href: "/car-rental", label: t("megaMenu.requirements") },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="absolute left-0 top-full z-50 w-[560px] animate-mega-menu rounded-xl border border-gray-100 bg-white px-6 py-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Triangle indicator: left 24px, points at Book */}
      <div
        className="absolute left-6 top-0 -translate-y-[6px]"
        aria-hidden
      >
        <div
          className="h-0 w-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-white drop-shadow-[0_-1px_2px_rgba(0,0,0,0.06)]"
          style={{ borderBottomColor: "white" }}
        />
      </div>

      <div className="flex gap-8">
        <div className="min-w-0 flex-1 space-y-4">
          {leftItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[#f8f8f8] hover:text-hertz-yellow ${
                item.primary
                  ? "font-bold text-[#434244]"
                  : "font-medium text-hertz-black-80"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="w-px shrink-0 bg-gray-200" />
        <div className="min-w-0 flex-1 space-y-4">
          {rightItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-hertz-black-80 transition-colors hover:bg-[#f8f8f8] hover:text-hertz-yellow"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
