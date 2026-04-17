"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LocationSelect } from "@/components/booking/LocationSelect";
import { DateTimePicker } from "@/components/booking/DateTimePicker";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBooking } from "@/contexts/BookingContext";

function toDatetimeLocal(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function SecondaryBookingBar() {
  const router = useRouter();
  const { t } = useLanguage();
  const booking = useBooking();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [pickupLocation, setPickupLocationState] = useState(booking.pickupLocation);
  const [pickupLocationName, setPickupLocationNameState] = useState(booking.pickupLocationName);
  const [pickupDate, setPickupDate] = useState(toDatetimeLocal(today).slice(0, 10));
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropoffDate, setDropoffDate] = useState(toDatetimeLocal(tomorrow).slice(0, 10));
  const [dropoffTime, setDropoffTime] = useState("10:00");

  useEffect(() => {
    setPickupLocationState(booking.pickupLocation);
    setPickupLocationNameState(booking.pickupLocationName);
  }, [booking.pickupLocation, booking.pickupLocationName]);

  const setPickupLocation = (code: string, name = "") => {
    setPickupLocationState(code);
    setPickupLocationNameState(name);
    booking.setPickupLocation(code, name);
  };

  const handleSearch = () => {
    const pickupAt = `${pickupDate}T${pickupTime}:00`;
    const dropoffAt = `${dropoffDate}T${dropoffTime}:00`;
    const params = new URLSearchParams({
      pickup: pickupLocation,
      dropoff: pickupLocation,
      pickupAt,
      dropoffAt,
      pickupName: pickupLocationName || pickupLocation,
      dropoffName: pickupLocationName || pickupLocation,
    });
    router.push(`/search?${params}`);
  };

  return (
    <div className="border-b border-hertz-border bg-[#FAFAFA]">
      <div className="mx-auto max-w-container px-12 py-4">
        <div className="flex flex-wrap items-end gap-4 lg:gap-6">
          <div className="w-full min-w-[200px] lg:w-48">
            <LocationSelect
              label={t("booking.pickup_location")}
              value={pickupLocation}
              onChange={(code, loc) => {
                setPickupLocation(code, loc?.name ?? "");
              }}
              placeholder="Location"
            />
          </div>
          <div className="w-full min-w-[140px] lg:w-40">
            <DateTimePicker
              label={t("booking.pickup_date")}
              dateValue={pickupDate}
              timeValue={pickupTime}
              onDateChange={setPickupDate}
              onTimeChange={setPickupTime}
              minDate={toDatetimeLocal(today).slice(0, 10)}
            />
          </div>
          <div className="w-full min-w-[140px] lg:w-40">
            <DateTimePicker
              label={t("booking.dropoff_date")}
              dateValue={dropoffDate}
              timeValue={dropoffTime}
              onDateChange={setDropoffDate}
              onTimeChange={setDropoffTime}
              minDate={pickupDate}
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            disabled={!pickupLocation}
            className="min-h-tap shrink-0 bg-hertz-yellow px-6 font-bold text-black disabled:opacity-50"
          >
            {t("booking.continue")}
          </button>
        </div>
      </div>
    </div>
  );
}
