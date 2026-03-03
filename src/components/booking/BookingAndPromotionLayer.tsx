"use client";

import { useState } from "react";
import { MiniBookingDesktop } from "./MiniBookingDesktop";
import { MiniBookingMobile } from "./MiniBookingMobile";
import { BookingModal } from "./BookingModal";
import { BookingSheet } from "./BookingSheet";

/**
 * Single sticky booking bar (desktop: 3-column; mobile: vertical blocks).
 * Summary only; no CTA. Click a column/block to open booking modal/sheet.
 */
export function BookingAndPromotionLayer() {
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="flex flex-col bg-white">
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm">
        <div className="hidden lg:block">
          <MiniBookingDesktop onOpenModal={() => setModalOpen(true)} />
        </div>
        <div className="lg:hidden">
          <MiniBookingMobile onOpenSheet={() => setSheetOpen(true)} />
        </div>
      </div>

      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <BookingSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  );
}
