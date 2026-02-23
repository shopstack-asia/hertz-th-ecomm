"use client";

import { useEffect, useState, useCallback } from "react";
import type { AddOnItem } from "@/app/api/addons/route";

interface EnhanceYourRentalSectionProps {
  vehicleId: string;
  seats: number;
  rentalDays: number;
  oneWay: boolean;
  selectedAddonIds: string[];
  coveredByVoucher: string[];
  onSelectionChange: (addonIds: string[]) => void;
}

function formatPrice(addon: AddOnItem, rentalDays: number): string {
  if (addon.type === "daily") {
    const total = addon.price * rentalDays;
    return `฿${addon.price.toLocaleString()} / day · ฿${total.toLocaleString()} total`;
  }
  return `฿${addon.price.toLocaleString()} flat`;
}

function InfoIcon({ tooltip }: { tooltip: string }) {
  return (
    <span
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-hertz-border bg-hertz-gray text-[10px] font-bold text-hertz-black-60 transition-colors hover:border-[#FFCC00] hover:bg-[#FFCC00]/20 hover:text-black"
      title={tooltip}
      role="img"
      aria-label="Info"
    >
      i
    </span>
  );
}

export function EnhanceYourRentalSection({
  vehicleId,
  seats,
  rentalDays,
  oneWay,
  selectedAddonIds,
  coveredByVoucher,
  onSelectionChange,
}: EnhanceYourRentalSectionProps) {
  const [addons, setAddons] = useState<AddOnItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ vehicleId, seats: String(seats), oneWay: String(oneWay) });
    fetch(`/api/addons?${params}`)
      .then((r) => r.json())
      .then((data) => setAddons(Array.isArray(data.addons) ? data.addons : []))
      .catch(() => setAddons([]))
      .finally(() => setLoading(false));
  }, [vehicleId, seats, oneWay]);

  const toggle = useCallback(
    (addon: AddOnItem) => {
      const covered = coveredByVoucher.includes(addon.id);
      if (covered) return;

      const isInsurance = addon.insurance_type != null;
      const isPremium = addon.insurance_type === "premium";
      const isZeroExcess = addon.insurance_type === "zero_excess";

      if (isInsurance && isZeroExcess) {
        onSelectionChange([
          ...selectedAddonIds.filter((id) => id !== "premium_insurance"),
          addon.id,
        ]);
        return;
      }
      if (isInsurance && isPremium) {
        onSelectionChange([
          ...selectedAddonIds.filter((id) => id !== "zero_excess"),
          addon.id,
        ]);
        return;
      }

      if (selectedAddonIds.includes(addon.id)) {
        onSelectionChange(selectedAddonIds.filter((id) => id !== addon.id));
      } else {
        onSelectionChange([...selectedAddonIds, addon.id]);
      }
    },
    [selectedAddonIds, coveredByVoucher, onSelectionChange]
  );

  const isDisabled = useCallback(
    (addon: AddOnItem) => {
      if (addon.insurance_type === "premium") {
        return selectedAddonIds.includes("zero_excess") || coveredByVoucher.includes("zero_excess");
      }
      if (addon.insurance_type === "zero_excess") {
        return selectedAddonIds.includes("premium_insurance") || coveredByVoucher.includes("premium_insurance");
      }
      return false;
    },
    [selectedAddonIds, coveredByVoucher]
  );

  if (loading) {
    return (
      <section className="border border-hertz-border bg-white p-6">
        <h2 className="text-lg font-bold text-black">Enhance your rental</h2>
        <div className="mt-4 h-32 animate-pulse rounded bg-hertz-gray" />
      </section>
    );
  }

  if (addons.length === 0) {
    return null;
  }

  return (
    <section className="border border-hertz-border bg-white p-6">
      <h2 className="text-lg font-bold text-black">Enhance your rental</h2>
      <p className="mt-1 text-sm text-hertz-black-80">
        Optional add-ons for your trip. Select what you need.
      </p>
      <ul className="mt-4 space-y-2">
        {addons.map((addon) => {
          const selected = selectedAddonIds.includes(addon.id) || coveredByVoucher.includes(addon.id);
          const covered = coveredByVoucher.includes(addon.id);
          const disabled = isDisabled(addon);
          return (
            <li key={addon.id}>
              <label
                className={`flex cursor-pointer items-start gap-4 rounded border p-4 transition-all duration-200 ${
                  disabled ? "cursor-not-allowed border-hertz-border bg-hertz-gray opacity-60" : ""
                } ${
                  selected && !disabled
                    ? "border-[#FFCC00] bg-[#FFCC00]/10 shadow-sm"
                    : "border-hertz-border bg-white hover:border-hertz-black-60 hover:bg-hertz-gray/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  disabled={disabled}
                  onChange={() => toggle(addon)}
                  className="mt-1 h-4 w-4 shrink-0 border-hertz-border text-[#FFCC00] focus:ring-[#FFCC00]"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-black">{addon.name}</span>
                    {covered && (
                      <span className="rounded bg-[#FFCC00] px-1.5 py-0.5 text-[10px] font-bold text-black">
                        Covered by voucher
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-hertz-black-80">{addon.description}</p>
                  {addon.disclaimer && (
                    <p className="mt-1 text-xs text-hertz-black-60">{addon.disclaimer}</p>
                  )}
                </div>
                <div className="flex shrink-0 items-start gap-2">
                  <span className="text-right text-sm font-medium text-black">
                    {formatPrice(addon, rentalDays)}
                  </span>
                  <InfoIcon tooltip={addon.description} />
                </div>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
