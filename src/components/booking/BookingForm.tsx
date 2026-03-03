"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LocationSelect } from "./LocationSelect";
import { DateTimePicker } from "./DateTimePicker";
import { useBooking } from "@/contexts/BookingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePromotionOptional } from "@/contexts/PromotionContext";

function toDatetimeLocal(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface BookingFormProps {
  onSearch?: () => void;
  dark?: boolean;
}

export function BookingForm({ onSearch, dark = false }: BookingFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const promotion = usePromotionOptional();
  const {
    pickupLocation,
    pickupLocationName,
    dropoffLocation,
    dropoffLocationName,
    sameAsPickup,
    pickupDate,
    pickupTime,
    dropoffDate,
    dropoffTime,
    setPickupLocation,
    setDropoffLocation,
    setSameAsPickup,
    setPickupDateTime,
    setDropoffDateTime,
  } = useBooking();

  const [promoInput, setPromoInput] = useState("");
  const today = new Date();

  useEffect(() => {
    const fromContext = promotion?.promoCode ?? "";
    if (fromContext && promoInput === "") setPromoInput(fromContext);
  }, [promotion?.promoCode]);

  const promoDisplay = promoInput || (promotion?.promoCode ?? "");
  const minDate = toDatetimeLocal(today).slice(0, 10);

  const handleSearch = async () => {
    const pickupAt = `${pickupDate}T${pickupTime}:00`;
    const dropoffAt = `${dropoffDate}T${dropoffTime}:00`;
    const dropoff = sameAsPickup ? pickupLocation : dropoffLocation;
    const dropoffName = sameAsPickup ? dropoffLocationName : dropoffLocationName;
    const params = new URLSearchParams({
      pickup: pickupLocation,
      dropoff,
      pickupAt,
      dropoffAt,
      pickupName: pickupLocationName || pickupLocation,
      dropoffName: dropoffName || dropoff,
    });

    const code = (promoInput || (promotion?.promoCode ?? "")).trim().toUpperCase();
    if (code && promotion) {
      promotion.setPromoCode(code);
      await promotion.validatePromotion(
        {
          pickup_location: pickupLocationName || pickupLocation,
          dropoff_location: dropoffName || dropoff,
          pickup_date: pickupAt,
          dropoff_date: dropoffAt,
        },
        code
      );
      params.set("promo", code);
    }

    router.push(`/search?${params}`);
    onSearch?.();
  };

  const dropoff = sameAsPickup ? pickupLocation : dropoffLocation;

  return (
    <div className="space-y-4">
      <LocationSelect
        label={t("booking.pickup_location")}
        value={pickupLocation}
        onChange={(code, loc) => setPickupLocation(code, loc?.name ?? "")}
        placeholder="Enter city or airport"
        dark={dark}
        displayName={pickupLocationName}
      />
      <DateTimePicker
        label={t("booking.pickup_date")}
        dateValue={pickupDate}
        timeValue={pickupTime}
        onDateChange={(d) => setPickupDateTime(d, pickupTime)}
        onTimeChange={(time) => setPickupDateTime(pickupDate, time)}
        minDate={minDate}
        dark={dark}
      />
      <div className="flex items-center gap-2">
        <input
          id="same-as-pickup"
          type="checkbox"
          checked={sameAsPickup}
          onChange={(e) => setSameAsPickup(e.target.checked)}
          className={dark ? "h-4 w-4 border-white/40" : "h-4 w-4 border-gray-300"}
        />
        <label
          htmlFor="same-as-pickup"
          className={dark ? "text-sm text-white/90" : "text-sm text-hertz-black-80"}
        >
          Same drop-off location
        </label>
      </div>
      {!sameAsPickup && (
        <LocationSelect
          label={t("booking.dropoff_location")}
          value={dropoffLocation}
          onChange={(code, loc) => setDropoffLocation(code, loc?.name ?? "")}
          placeholder="Enter city or airport"
          dark={dark}
          displayName={dropoffLocationName}
        />
      )}
      <DateTimePicker
        label={t("booking.dropoff_date")}
        id="dropoff-datetime"
        dateValue={dropoffDate}
        timeValue={dropoffTime}
        onDateChange={(d) => setDropoffDateTime(d, dropoffTime)}
        onTimeChange={(time) => setDropoffDateTime(dropoffDate, time)}
        minDate={pickupDate}
        dark={dark}
      />
      <div>
        <label
          className={
            dark
              ? "mb-1 block text-sm font-medium text-white/90"
              : "mb-1 block text-sm font-medium text-hertz-black-80"
          }
        >
          Promotion code
        </label>
        <input
          type="text"
          value={promoDisplay}
          onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
          placeholder="e.g. SAVE10"
          className={
            dark
              ? "w-full border border-white/40 bg-black/30 px-4 py-3 text-white placeholder:text-white/50 focus:border-hertz-yellow focus:outline-none focus:ring-1 focus:ring-hertz-yellow"
              : "w-full border border-hertz-border px-4 py-3 text-hertz-black-80 placeholder:text-hertz-black-60 focus:border-[#FFCC00] focus:outline-none focus:ring-1 focus:ring-[#FFCC00]"
          }
        />
      </div>
      <button
        type="button"
        onClick={handleSearch}
        disabled={!pickupLocation || !dropoff}
        className="flex h-12 w-full items-center justify-center bg-hertz-yellow font-bold text-black disabled:opacity-50"
      >
        {t("booking.continue")}
      </button>
    </div>
  );
}
