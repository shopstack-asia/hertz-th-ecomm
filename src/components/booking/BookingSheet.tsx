"use client";

import { useEffect } from "react";
import { BookingForm } from "./BookingForm";

interface BookingSheetProps {
  open: boolean;
  onClose: () => void;
}

export function BookingSheet({ open, onClose }: BookingSheetProps) {
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
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-lg border-t border-hertz-border bg-white p-6 shadow-elevated"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-sheet-title"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 id="booking-sheet-title" className="text-lg font-bold text-black">
            Search availability
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-tap min-w-tap items-center justify-center text-hertz-black-80 hover:text-black"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <BookingForm onSearch={onClose} />
      </div>
    </>
  );
}
