"use client";

import Link from "next/link";
import type { SearchResultVehicleGroup } from "@/types";

interface VehicleCardProps {
  vehicle: SearchResultVehicleGroup;
  searchParams?: string;
  showImage?: boolean;
}

export function VehicleCard({
  vehicle,
  searchParams = "",
  showImage = true,
}: VehicleCardProps) {
  const href = searchParams
    ? `/vehicle/${vehicle.groupCode}?${searchParams}`
    : `/vehicle/${vehicle.groupCode}`;

  return (
    <Link
      href={href}
      className="group block border border-hertz-border bg-white shadow-card transition-shadow hover:shadow-elevated"
    >
      {showImage && (
        <div className="aspect-[16/10] bg-hertz-gray">
          <div
            className="h-full w-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${vehicle.images?.[0]?.url ?? "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80"})`,
            }}
          />
        </div>
      )}
      <div className="p-4 lg:p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-hertz-black-60">
          {vehicle.category}
        </p>
        <h3 className="mt-1 text-lg font-bold text-black">{vehicle.name}</h3>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-hertz-black-80">
          <span>{vehicle.seats} seats</span>
          <span>{vehicle.transmission === "A" ? "Automatic" : "Manual"}</span>
          <span>{vehicle.luggage} luggage</span>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-hertz-border pt-4">
          <div>
            <span className="text-xs text-hertz-black-60">Pay now</span>
            <p className="text-xl font-bold text-black">
              ฿{vehicle.payNowPrice.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-hertz-black-60">Pay later</span>
            <p className="text-base font-semibold text-hertz-black-90">
              ฿{vehicle.payLaterPrice.toLocaleString()}
            </p>
          </div>
        </div>
        <span className="mt-3 inline-block text-sm font-semibold text-black group-hover:underline">
          View details →
        </span>
      </div>
    </Link>
  );
}
