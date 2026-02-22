"use client";

import { useEffect, useState } from "react";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { FadeInSection } from "./FadeInSection";
import type { SearchResultVehicleGroup } from "@/types";

export function FeaturedVehicles() {
  const [vehicles, setVehicles] = useState<SearchResultVehicleGroup[]>([]);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const pad = (n: number) => n.toString().padStart(2, "0");
    const d = new Date();
    const d2 = tomorrow;
    const pickupAt = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T10:00:00`;
    const dropoffAt = `${d2.getFullYear()}-${pad(d2.getMonth() + 1)}-${pad(d2.getDate())}T10:00:00`;
    fetch(
      `/api/search?pickup=BKK&dropoff=BKK&pickupAt=${pickupAt}&dropoffAt=${dropoffAt}`
    )
      .then((r) => r.json())
      .then((d) => setVehicles(Array.isArray(d) ? d.slice(0, 4) : []));
  }, []);

  if (vehicles.length === 0) return null;

  return (
    <FadeInSection>
      <section className="border-b border-hertz-border bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-container px-6">
        <h2 className="mb-8 text-2xl font-bold text-black lg:text-3xl">
          Featured vehicles
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {vehicles.map((v) => (
            <VehicleCard key={v.groupCode} vehicle={v} showImage />
          ))}
        </div>
      </div>
    </section>
    </FadeInSection>
  );
}
