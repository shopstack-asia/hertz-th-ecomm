"use client";

import { MapPin, RotateCcw, Tag } from "lucide-react";
import { useBooking } from "@/contexts/BookingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePromotionOptional } from "@/contexts/PromotionContext";

interface MiniBookingDesktopProps {
  onOpenModal: () => void;
}

/** Format date as DD MMM YYYY */
function formatDateRow(d: string): string {
  if (!d) return "—";
  const date = new Date(d + "T12:00:00");
  const day = date.getDate();
  const month = date.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/** Time as HH:mm */
function formatTime(t: string): string {
  if (!t) return "—";
  const [h, m] = t.split(":");
  return `${h.padStart(2, "0")}:${(m ?? "00").padStart(2, "0")}`;
}

const ICON_PROPS = {
  size: 18,
  strokeWidth: 1.5,
  className: "shrink-0 text-[#444]",
  "aria-hidden": true as const,
};

const COLUMN_DIVIDER = "border-r border-[#e5e5e5]";

export function MiniBookingDesktop({ onOpenModal }: MiniBookingDesktopProps) {
  const { t } = useLanguage();
  const promotion = usePromotionOptional();
  const {
    pickupLocationName,
    dropoffLocationName,
    sameAsPickup,
    pickupDate,
    pickupTime,
    dropoffDate,
    dropoffTime,
  } = useBooking();

  const pickupDisplay = pickupLocationName || "—";
  const dropoffDisplay = sameAsPickup ? pickupDisplay : dropoffLocationName || "—";

  const hasPromo = promotion?.promoCode != null && promotion.promoCode !== "";

  const columnBase =
    "flex min-w-0 flex-col justify-center gap-0.5 px-4 py-3 text-left transition-colors duration-150 hover:bg-gray-50/70 active:bg-gray-100 cursor-pointer";

  return (
    <div
      className="mx-auto grid max-w-container grid-cols-[2fr_2fr_1fr] gap-0 px-4 lg:px-6"
      style={{ maxHeight: 72 }}
    >
      {/* Column 1 – Pickup */}
      <div
        role="button"
        tabIndex={0}
        onClick={onOpenModal}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpenModal(); } }}
        className={`${columnBase} ${COLUMN_DIVIDER}`}
      >
        <div className="grid min-w-0 grid-cols-[auto_1fr] items-center gap-y-0.5" style={{ columnGap: 8 }}>
          <MapPin {...ICON_PROPS} />
          <span className="truncate text-sm font-semibold text-black">{pickupDisplay}</span>
          <span />
          <span className="text-xs text-[#666]">{formatDateRow(pickupDate)} • {formatTime(pickupTime)}</span>
        </div>
      </div>

      {/* Column 2 – Drop-off */}
      <div
        role="button"
        tabIndex={0}
        onClick={onOpenModal}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpenModal(); } }}
        className={`${columnBase} ${COLUMN_DIVIDER}`}
      >
        <div className="grid min-w-0 grid-cols-[auto_1fr] items-center gap-y-0.5" style={{ columnGap: 8 }}>
          <RotateCcw {...ICON_PROPS} />
          <span className="truncate text-sm font-semibold text-black">{dropoffDisplay}</span>
          <span />
          <span className="text-xs text-[#666]">{formatDateRow(dropoffDate)} • {formatTime(dropoffTime)}</span>
        </div>
      </div>

      {/* Column 3 – Promotion */}
      <div
        role="button"
        tabIndex={0}
        onClick={onOpenModal}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpenModal(); } }}
        className={columnBase}
      >
        <div className="flex min-w-0 items-center" style={{ gap: "8px" }}>
          <Tag {...ICON_PROPS} />
          {hasPromo ? (
            <span
              className="inline-flex items-center rounded border border-[#e5c700] bg-[#FFF6CC] px-2 py-1 text-xs font-semibold uppercase tracking-wide text-black"
              role="status"
            >
              {promotion.promoCode}
            </span>
          ) : (
            <span className="text-sm text-[#666]">{t("booking.apply_promotion")}</span>
          )}
        </div>
      </div>
    </div>
  );
}
