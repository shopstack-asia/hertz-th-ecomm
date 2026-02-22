"use client";

import { useBooking } from "@/contexts/BookingContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface MiniBookingMobileProps {
  onOpenSheet: () => void;
}

export function MiniBookingMobile({ onOpenSheet }: MiniBookingMobileProps) {
  const { t } = useLanguage();
  const { pickupLocationName, pickupDate, dropoffDate } = useBooking();

  const formatDate = (d: string) =>
    d ? new Date(d + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—";
  const pickupDisplay = pickupLocationName || t("booking.pickup_location");
  const datesDisplay =
    pickupDate && dropoffDate
      ? `${formatDate(pickupDate)} - ${formatDate(dropoffDate)}`
      : "—";

  return (
    <button
      type="button"
      onClick={onOpenSheet}
      className="flex min-h-tap w-full items-center justify-between gap-4 px-4 py-3"
    >
      <div className="flex-1 text-left">
        <p className="truncate text-sm font-medium text-black">
          {pickupDisplay}
        </p>
        <p className="text-xs text-hertz-black-60">{datesDisplay}</p>
      </div>
      <span className="flex min-h-tap shrink-0 items-center bg-hertz-yellow px-5 font-bold text-black">
        {t("booking.modify_search")}
      </span>
    </button>
  );
}
