"use client";

import { AlertTriangle } from "lucide-react";
import { useBooking } from "@/contexts/BookingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePromotionOptional } from "@/contexts/PromotionContext";

interface MiniBookingMobileProps {
  onOpenSheet: () => void;
}

function formatDateRow(d: string): string {
  if (!d) return "—";
  const date = new Date(d + "T12:00:00");
  const day = date.getDate();
  const month = date.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

function formatTime(t: string): string {
  if (!t) return "—";
  const [h, m] = t.split(":");
  return `${h.padStart(2, "0")}:${(m ?? "00").padStart(2, "0")}`;
}

const ROW_DIVIDER = "border-b border-[#e5e5e5]";

export function MiniBookingMobile({ onOpenSheet }: MiniBookingMobileProps) {
  const { t } = useLanguage();
  const promotion = usePromotionOptional();
  const {
    pickupLocation,
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
  const noLocationSelected = !pickupLocation?.trim();
  const isPromoInvalid =
    hasPromo &&
    (noLocationSelected
      ? true
      : promotion?.validation?.status === "invalid");
  const promoReason = noLocationSelected
    ? t("promotion.select_locations_first")
    : promotion?.validation?.reason;

  const blockBase =
    "flex min-h-tap flex-col justify-center py-3 text-left transition-colors duration-150 hover:bg-gray-50/80 active:bg-gray-100";

  return (
    <div className="flex flex-col px-8">
      {/* Block 1 – Pickup */}
      <div
        role="button"
        tabIndex={0}
        onClick={onOpenSheet}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpenSheet(); } }}
        className={`${blockBase} ${ROW_DIVIDER} cursor-pointer`}
      >
        <p className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 text-sm leading-tight">
          <span className="text-hertz-black-60">{t("booking.pickup_location")}:</span>
          <span className="font-bold text-black">{pickupDisplay}</span>
          <span className="text-hertz-black-70">{formatDateRow(pickupDate)} {formatTime(pickupTime)}</span>
        </p>
      </div>

      {/* Block 2 – Drop-off */}
      <div
        role="button"
        tabIndex={0}
        onClick={onOpenSheet}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpenSheet(); } }}
        className={`${blockBase} ${ROW_DIVIDER} cursor-pointer`}
      >
        <p className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 text-sm leading-tight">
          <span className="text-hertz-black-60">{t("booking.dropoff_location")}:</span>
          <span className="font-bold text-black">{dropoffDisplay}</span>
          <span className="text-hertz-black-70">{formatDateRow(dropoffDate)} {formatTime(dropoffTime)}</span>
        </p>
      </div>

      {/* Block 3 – Promotion */}
      <div
        role="button"
        tabIndex={0}
        onClick={onOpenSheet}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpenSheet(); } }}
        className={`${blockBase} cursor-pointer`}
      >
        <span className="text-xs text-hertz-black-60">{t("booking.apply_promotion")}</span>
        <div className="mt-1 flex flex-col gap-0.5">
          {hasPromo ? (
            isPromoInvalid ? (
              <>
                <span className="flex items-center gap-1.5 text-xs font-medium text-amber-800">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" aria-hidden />
                  {t("promotion.not_applicable", { code: promotion.promoCode ?? "" })}
                </span>
                {promoReason && (
                  <p className="text-xs text-hertz-black-70">
                    {t("promotion.reason")}: {promoReason}
                  </p>
                )}
              </>
            ) : (
              <span
                className="inline-flex w-fit items-center rounded border border-[#e5c700] bg-[#FFF6CC] px-2.5 py-1.5 text-xs font-bold leading-none uppercase tracking-wide text-black transition-opacity duration-150"
                role="status"
              >
                {promotion.promoCode}
              </span>
            )
          ) : (
            <span className="text-sm font-medium text-hertz-black-70 underline decoration-hertz-black-50 underline-offset-2">
              {t("booking.apply_promotion")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
