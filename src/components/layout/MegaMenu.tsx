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
      className="absolute left-1/2 top-full z-50 w-screen -translate-x-1/2 border-b border-hertz-border bg-white opacity-100 transition-opacity duration-200"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="mx-auto max-w-container px-6 py-6">
        <div className="flex gap-12">
          <div className="flex-1 space-y-3">
            {leftItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block text-sm transition-colors hover:text-black ${
                  item.primary ? "font-bold text-black" : "text-hertz-black-80"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="h-auto w-px bg-hertz-border" />
          <div className="flex-1 space-y-3">
            {rightItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block text-sm text-hertz-black-80 transition-colors hover:text-black"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
