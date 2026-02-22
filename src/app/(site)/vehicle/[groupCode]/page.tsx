"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PriceSummaryCard } from "@/components/checkout/PriceSummaryCard";
import { StickyBottomBar } from "@/components/layout/StickyBottomBar";
import type { VehicleDetail } from "@/types";

const basePrices: Record<string, { payLater: number; payNow: number }> = {
  ECAR: { payLater: 1200, payNow: 1080 },
  CARS: { payLater: 1500, payNow: 1350 },
  CDAR: { payLater: 2000, payNow: 1800 },
  SFAR: { payLater: 3500, payNow: 3150 },
  PCAR: { payLater: 4200, payNow: 3780 },
  LCAR: { payLater: 8500, payNow: 7650 },
  MVAR: { payLater: 5500, payNow: 4950 },
  HCAR: { payLater: 2800, payNow: 2520 },
  EVAR: { payLater: 4500, payNow: 4050 },
  PTAR: { payLater: 3200, payNow: 2880 },
};

export default function VehicleDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const groupCode = params.groupCode as string;

  const [vehicle, setVehicle] = useState<VehicleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);

  const pickup = searchParams.get("pickup") ?? "";
  const dropoff = searchParams.get("dropoff") ?? pickup;
  const pickupAt = searchParams.get("pickupAt") ?? "";
  const dropoffAt = searchParams.get("dropoffAt") ?? "";
  const pickupName = searchParams.get("pickupName") ?? pickup;
  const dropoffName = searchParams.get("dropoffName") ?? dropoff;

  const checkoutParams = new URLSearchParams({
    pickup,
    dropoff,
    pickupAt,
    dropoffAt,
    pickupName,
    dropoffName,
    groupCode,
  });

  const rawDays = vehicle && pickupAt && dropoffAt
    ? Math.ceil(
        (new Date(dropoffAt).getTime() - new Date(pickupAt).getTime()) /
          (24 * 60 * 60 * 1000)
      )
    : 1;
  const days = Number.isFinite(rawDays) ? Math.max(1, rawDays) : 1;

  const apiVehicle = vehicle as VehicleDetail & { dailyPayNow?: number; dailyPayLater?: number };
  const base =
    basePrices[groupCode] ??
    (apiVehicle?.dailyPayNow != null && apiVehicle?.dailyPayLater != null
      ? { payLater: apiVehicle.dailyPayLater, payNow: apiVehicle.dailyPayNow }
      : { payLater: 1000, payNow: 900 });
  const payLaterTotal = base.payLater * days;
  const payNowTotal = base.payNow * days;
  const vat = 0.07;
  const payLaterVat = Math.round(payLaterTotal * vat);
  const payNowVat = Math.round(payNowTotal * vat);
  const payLaterBreakdown = {
    lineItems: [
      {
        description: `Rental (${days} day${days > 1 ? "s" : ""})`,
        amount: payLaterTotal,
      },
    ],
    subtotal: payLaterTotal,
    vatRate: vat,
    vatAmount: payLaterVat,
    total: payLaterTotal + payLaterVat,
    currency: "THB",
  };

  useEffect(() => {
    fetch(`/api/vehicle/${groupCode}`)
      .then((r) => r.json())
      .then(setVehicle)
      .finally(() => setLoading(false));
  }, [groupCode]);

  if (loading) {
    return (
      <div className="mx-auto max-w-container px-6 py-12">
        <div className="h-96 animate-pulse bg-hertz-gray" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="mx-auto max-w-container px-6 py-12 text-center">
        <p className="text-hertz-black-80">Vehicle not found.</p>
        <Link href="/vehicles" className="mt-4 inline-block font-bold text-black underline">
          Browse vehicles
        </Link>
      </div>
    );
  }

  const images = vehicle.images?.length
    ? vehicle.images
    : [{ url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800" }];

  return (
    <div className="mx-auto max-w-container px-6 py-8 pb-28 lg:pb-12 lg:py-12">
      <div className="lg:grid lg:grid-cols-3 lg:gap-12">
        {/* Left: gallery + specs */}
        <div className="lg:col-span-2">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <div className="aspect-[4/3] bg-hertz-gray">
                <div
                  className="h-full w-full bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${images[imageIndex]?.url ?? images[0].url})` }}
                />
              </div>
              {images.length > 1 && (
                <div className="mt-2 flex gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImageIndex(i)}
                      className={`h-16 w-20 border-2 ${
                        i === imageIndex ? "border-black" : "border-hertz-border"
                      }`}
                    >
                      <div
                        className="h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${images[i].url})` }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black lg:text-3xl">
                {vehicle.name}
              </h1>
              <p className="mt-1 text-sm uppercase tracking-wide text-hertz-black-60">
                {vehicle.category}
              </p>
              {vehicle.description && (
                <p className="mt-4 text-hertz-black-80">{vehicle.description}</p>
              )}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-hertz-black-60">Seats</span>
                  <p className="font-bold">{vehicle.seats}</p>
                </div>
                <div>
                  <span className="text-xs text-hertz-black-60">Transmission</span>
                  <p className="font-bold">
                    {vehicle.transmission === "A" ? "Automatic" : "Manual"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-hertz-black-60">Luggage</span>
                  <p className="font-bold">{vehicle.luggage}</p>
                </div>
              </div>
              <div className="mt-6 border-t border-hertz-border pt-6">
                <h2 className="text-lg font-bold text-black">Inclusions</h2>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-hertz-black-80">
                  {vehicle.inclusions.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right: sticky booking summary (desktop) */}
        <div className="mt-8 lg:mt-0">
          <div className="hidden border border-hertz-border bg-white p-6 shadow-card lg:block">
            <h3 className="text-lg font-bold text-black">Your rental</h3>
            <p className="mt-2 text-sm text-hertz-black-80">
              {pickupName} → {dropoffName}
            </p>
            <p className="text-sm text-hertz-black-80">
              {pickupAt ? new Date(pickupAt).toLocaleDateString() : "—"} –{" "}
              {dropoffAt ? new Date(dropoffAt).toLocaleDateString() : "—"}
            </p>
            <PriceSummaryCard pricing={payLaterBreakdown} title="Price" className="mt-4 !border-0 !p-0 !shadow-none" />
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href={`/checkout?${checkoutParams}&bookingType=PAY_LATER`}
                className="flex h-12 items-center justify-center border-2 border-black bg-white font-bold text-black"
              >
                Pay later
              </Link>
              <Link
                href={`/checkout?${checkoutParams}&bookingType=PAY_NOW`}
                className="flex h-12 items-center justify-center bg-hertz-yellow font-bold text-black"
              >
                Pay now
              </Link>
            </div>
          </div>

          {/* Mobile: sticky bottom bar */}
          <StickyBottomBar>
            <div className="flex gap-3">
              <Link
                href={`/checkout?${checkoutParams}&bookingType=PAY_LATER`}
                className="flex h-12 flex-1 items-center justify-center border-2 border-black font-bold text-black"
              >
                Pay later
              </Link>
              <Link
                href={`/checkout?${checkoutParams}&bookingType=PAY_NOW`}
                className="flex h-12 flex-1 items-center justify-center bg-hertz-yellow font-bold text-black"
              >
                Pay now
              </Link>
            </div>
          </StickyBottomBar>
        </div>
      </div>
    </div>
  );
}
