"use client";

import { LocationSelect } from "@/components/booking/LocationSelect";
import { DateTimePicker } from "@/components/booking/DateTimePicker";
import type { Location } from "@/types";

interface RentalDetailsSectionProps {
  pickup: string;
  dropoff: string;
  pickupAt: string;
  dropoffAt: string;
  pickupName: string;
  dropoffName: string;
  onPickupChange: (code: string, location?: Location) => void;
  onDropoffChange: (code: string, location?: Location) => void;
  onPickupAtChange: (iso: string) => void;
  onDropoffAtChange: (iso: string) => void;
}

export function RentalDetailsSection({
  pickup,
  dropoff,
  pickupAt,
  dropoffAt,
  pickupName,
  dropoffName,
  onPickupChange,
  onDropoffChange,
  onPickupAtChange,
  onDropoffAtChange,
}: RentalDetailsSectionProps) {
  const pickupDate = pickupAt ? pickupAt.slice(0, 10) : "";
  const pickupTime = pickupAt ? pickupAt.slice(11, 16) : "10:00";
  const dropoffDate = dropoffAt ? dropoffAt.slice(0, 10) : "";
  const dropoffTime = dropoffAt ? dropoffAt.slice(11, 16) : "10:00";

  const minDropoffDate = pickupDate || undefined;
  const minDropoffTime =
    pickupDate === dropoffDate ? pickupTime : undefined;

  return (
    <section className="border border-hertz-border bg-white p-6">
      <h2 className="text-lg font-bold text-black">Rental details</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <LocationSelect
          label="Pick-up location"
          value={pickup}
          onChange={(code, loc) => onPickupChange(code, loc)}
          placeholder="Select pick-up"
        />
        <LocationSelect
          label="Drop-off location"
          value={dropoff}
          onChange={(code, loc) => onDropoffChange(code, loc)}
          placeholder="Select drop-off"
        />
        <DateTimePicker
          label="Pick-up date & time"
          dateValue={pickupDate}
          timeValue={pickupTime}
          onDateChange={(d) =>
            onPickupAtChange(`${d}T${pickupTime}:00`)
          }
          onTimeChange={(t) =>
            onPickupAtChange(`${pickupDate || "2026-02-23"}T${t}:00`)
          }
          id="pickup-datetime"
        />
        <DateTimePicker
          label="Drop-off date & time"
          dateValue={dropoffDate}
          timeValue={dropoffTime}
          minDate={minDropoffDate}
          minTime={minDropoffTime}
          onDateChange={(d) =>
            onDropoffAtChange(`${d}T${dropoffTime}:00`)
          }
          onTimeChange={(t) =>
            onDropoffAtChange(`${dropoffDate || "2026-02-24"}T${t}:00`)
          }
          id="dropoff-datetime"
        />
      </div>
      {(pickupName || dropoffName) && (
        <p className="mt-2 text-sm text-hertz-black-60">
          {pickupName || "—"} → {dropoffName || "—"}
        </p>
      )}
    </section>
  );
}
