"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePromotionOptional } from "@/contexts/PromotionContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { SearchResultVehicleGroup } from "@/types";
import type { VehicleEligibility } from "@/contexts/PromotionContext";

interface VehicleCardProps {
  vehicle: SearchResultVehicleGroup;
  searchParams?: string;
  showImage?: boolean;
  /** Rental days from search (pickup/dropoff); used for eligibility check */
  rentalDays?: number;
}

const CATEGORY_KEYS: Record<string, string> = {
  economy: "filters.economy",
  compact: "filters.compact",
  "mid-size": "filters.mid_size",
  suv: "filters.suv",
  premium: "filters.premium",
  luxury: "filters.luxury",
  van: "filters.van",
  hybrid: "filters.hybrid",
  ev: "filters.ev",
  pickup: "filters.pickup",
};

export function VehicleCard({
  vehicle,
  searchParams = "",
  showImage = true,
  rentalDays = 1,
}: VehicleCardProps) {
  const promotion = usePromotionOptional();
  const { t } = useLanguage();
  const [localEligibility, setLocalEligibility] = useState<VehicleEligibility | null>(null);
  const categoryLabel = vehicle.category && CATEGORY_KEYS[vehicle.category.toLowerCase()]
    ? t(CATEGORY_KEYS[vehicle.category.toLowerCase()])
    : vehicle.category;

  const promoCode = promotion?.promoCode ?? null;
  const validation = promotion?.validation;
  const isValidPromo = validation?.status === "valid";
  const eligibilityFromMap = promoCode ? promotion?.eligibilityMap[vehicle.groupCode] : undefined;
  const eligibility = eligibilityFromMap ?? localEligibility;

  // Only depend on primitive values and eligibilityFromMap; do NOT depend on promotion object to avoid loop when context updates
  useEffect(() => {
    if (!promoCode || !promotion || !isValidPromo) {
      setLocalEligibility(null);
      return;
    }
    if (eligibilityFromMap !== undefined) return;

    let cancelled = false;
    const setEligibility = promotion?.setEligibility;
    fetch("/api/promotion/check-eligibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        promo_code: promoCode,
        vehicle_id: vehicle.groupCode,
        rental_days: rentalDays,
        vehicle_class: vehicle.category,
        base_price: vehicle.payLaterPrice,
      }),
    })
      .then((r) => r.json())
      .then((data: { eligible?: boolean; discount_amount?: number; reason_if_not_eligible?: string }) => {
        if (cancelled) return;
        const el: VehicleEligibility = {
          eligible: !!data.eligible,
          discount_amount: data.discount_amount,
          reason_if_not_eligible: data.reason_if_not_eligible,
        };
        setLocalEligibility(el);
        setEligibility?.(vehicle.groupCode, el);
      })
      .catch(() => {
        if (!cancelled) setLocalEligibility({ eligible: false });
      });
    return () => {
      cancelled = true;
    };
  }, [promoCode, isValidPromo, vehicle.groupCode, vehicle.category, vehicle.payLaterPrice, rentalDays, eligibilityFromMap]);

  const href = searchParams
    ? `/vehicle/${vehicle.groupCode}?${searchParams}`
    : `/vehicle/${vehicle.groupCode}`;

  const eligible = eligibility?.eligible ?? false;
  const discountAmount = eligibility?.discount_amount ?? 0;
  const discountedPayLater = Math.max(0, vehicle.payLaterPrice - discountAmount);
  const discountedPayNow = vehicle.payNowPrice > 0 && vehicle.payLaterPrice > 0
    ? Math.max(0, Math.round(vehicle.payNowPrice - (vehicle.payNowPrice * (discountAmount / vehicle.payLaterPrice))))
    : vehicle.payNowPrice;

  const isPromoEligible = !!(promoCode && eligibility !== undefined && eligible);

  return (
    <Link
      href={href}
      className="group block border border-hertz-border bg-white shadow-card transition-shadow hover:shadow-elevated"
    >
      {showImage && (
        <div className="relative overflow-hidden rounded-xl">
          <div className="aspect-[16/10] bg-hertz-gray">
            <div
              className="h-full w-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${vehicle.images?.[0]?.url ?? "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80"})`,
              }}
            />
          </div>
          {isPromoEligible && (
            <span
              className="absolute left-3 top-3 z-10 rounded-full py-1.5 font-semibold shadow-sm backdrop-blur-sm"
              style={
                discountAmount > 0
                  ? { background: "#FFCC00", color: "#000", paddingLeft: "10px", paddingRight: "10px", fontSize: "13px" }
                  : { background: "#E6F4EA", color: "#137333", paddingLeft: "10px", paddingRight: "10px", fontSize: "12px" }
              }
            >
              {discountAmount > 0 ? t("vehicle.save_amount", { amount: discountAmount.toLocaleString() }) : t("vehicle.promo_applied")}
            </span>
          )}
        </div>
      )}
      <div className="p-4 lg:p-5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-hertz-black-60">
            {categoryLabel}
          </p>
        </div>
        <h3 className="mt-1 text-lg font-bold text-black">{vehicle.name}</h3>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-hertz-black-80">
          <span>{vehicle.seats} {t("vehicle.seats")}</span>
          <span>{vehicle.transmission === "A" ? t("vehicle.automatic") : t("vehicle.manual")}</span>
          <span>{vehicle.luggage} {t("vehicle.luggage")}</span>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-hertz-border pt-4">
          <div>
            <span className="text-xs text-hertz-black-60">{t("vehicle.pay_now")}</span>
            {eligible && discountAmount > 0 ? (
              <div>
                <p className="text-xl font-bold text-black">
                  ฿{discountedPayNow.toLocaleString()}
                </p>
                <p className="text-sm text-hertz-black-60 line-through">
                  ฿{vehicle.payNowPrice.toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-xl font-bold text-black">
                ฿{vehicle.payNowPrice.toLocaleString()}
              </p>
            )}
          </div>
          <div className="text-right">
            <span className="text-xs text-hertz-black-60">{t("vehicle.pay_later")}</span>
            {eligible && discountAmount > 0 ? (
              <div>
                <p className="text-base font-semibold text-hertz-black-90">
                  ฿{discountedPayLater.toLocaleString()}
                </p>
                <p className="text-sm text-hertz-black-60 line-through">
                  ฿{vehicle.payLaterPrice.toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-base font-semibold text-hertz-black-90">
                ฿{vehicle.payLaterPrice.toLocaleString()}
              </p>
            )}
          </div>
        </div>
        <span className="mt-3 inline-block text-sm font-semibold text-black group-hover:underline">
          {t("vehicle.view_details")} →
        </span>
      </div>
    </Link>
  );
}
