"use client";

import { useState } from "react";
import { useScrollTrigger } from "@/hooks/useScrollTrigger";
import { MiniBookingDesktop } from "./MiniBookingDesktop";
import { MiniBookingMobile } from "./MiniBookingMobile";
import { BookingModal } from "./BookingModal";
import { BookingSheet } from "./BookingSheet";

const HERO_ID = "booking";

interface StickyBookingBarProps {
  /** When true, always show the bar (e.g. on Vehicle list / Special Offers). When false, show after scroll past hero. */
  alwaysShow?: boolean;
}

export function StickyBookingBar({ alwaysShow = false }: StickyBookingBarProps) {
  const scrollShow = useScrollTrigger(HERO_ID, 0.2);
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const shouldShow = alwaysShow || scrollShow;
  if (!shouldShow) return null;

  return (
    <>
      {/* Desktop: fixed top, below header */}
      <div className="fixed left-0 right-0 top-0 z-40 hidden animate-slide-down border-b border-hertz-border bg-white shadow-sm lg:block">
        <MiniBookingDesktop onOpenModal={() => setModalOpen(true)} />
      </div>

      {/* Mobile: fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 animate-slide-up border-t border-hertz-border bg-white shadow-elevated lg:hidden">
        <MiniBookingMobile onOpenSheet={() => setSheetOpen(true)} />
      </div>

      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <BookingSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}
