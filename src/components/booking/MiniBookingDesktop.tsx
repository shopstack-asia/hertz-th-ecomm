"use client";

import { useBooking } from "@/contexts/BookingContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface MiniBookingDesktopProps {
  onOpenModal: () => void;
}

export function MiniBookingDesktop({ onOpenModal }: MiniBookingDesktopProps) {
  const { t } = useLanguage();
  const {
    pickupLocationName,
    pickupDate,
    pickupTime,
    dropoffDate,
    dropoffTime,
  } = useBooking();

  const formatDate = (d: string) =>
    d ? new Date(d + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";
  const pickupDisplay = pickupLocationName || t("booking.pickup_location");
  const dropoffDisplay = formatDate(pickupDate) + " - " + formatDate(dropoffDate);

  return (
    <div className="mx-auto flex h-16 max-w-container items-center gap-4 px-6">
      <button
        type="button"
        onClick={onOpenModal}
        className="flex flex-1 items-center gap-2 border-r border-hertz-border pr-4 text-left"
      >
        <span className="text-xs text-hertz-black-60">{t("booking.pickup_location")}</span>
        <span className="text-sm font-medium text-black truncate">
          {pickupDisplay}
        </span>
      </button>
      <button
        type="button"
        onClick={onOpenModal}
        className="flex flex-1 items-center gap-2 border-r border-hertz-border pr-4 text-left"
      >
        <span className="text-xs text-hertz-black-60">{t("booking.pickup_date")}</span>
        <span className="text-sm font-medium text-black truncate">
          {formatDate(pickupDate)}
        </span>
      </button>
      <button
        type="button"
        onClick={onOpenModal}
        className="flex flex-1 items-center gap-2 border-r border-hertz-border pr-4 text-left"
      >
        <span className="text-xs text-hertz-black-60">{t("booking.pickup_time")}</span>
        <span className="text-sm font-medium text-black">{pickupTime}</span>
      </button>
      <button
        type="button"
        onClick={onOpenModal}
        className="flex flex-1 items-center gap-2 border-r border-hertz-border pr-4 text-left"
      >
        <span className="text-xs text-hertz-black-60">{t("booking.dropoff_date")}</span>
        <span className="text-sm font-medium text-black truncate">
          {formatDate(dropoffDate)}
        </span>
      </button>
      <button
        type="button"
        onClick={onOpenModal}
        className="flex flex-1 items-center gap-2 pr-4 text-left"
      >
        <span className="text-xs text-hertz-black-60">{t("booking.dropoff_time")}</span>
        <span className="text-sm font-medium text-black">{dropoffTime}</span>
      </button>
      <button
        type="button"
        onClick={onOpenModal}
        className="min-h-tap shrink-0 bg-hertz-yellow px-6 font-bold text-black"
      >
        {t("booking.continue")}
      </button>
    </div>
  );
}
