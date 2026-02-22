"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { FilterSidebar } from "@/components/search/FilterSidebar";
import { MobileFilterDrawer } from "@/components/search/MobileFilterDrawer";
import type { SearchResultVehicleGroup } from "@/types";

function VehiclesContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") ?? "";

  const [vehicles, setVehicles] = useState<SearchResultVehicleGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [category, setCategory] = useState(categoryParam);
  const [transmission, setTransmission] = useState("");

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
      .then((d) => setVehicles(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCategory(categoryParam);
  }, [categoryParam]);

  const filtered = vehicles.filter((v) => {
    const cat = v.category.toLowerCase().replace(/\s+/g, "-");
    if (category && cat !== category.toLowerCase()) return false;
    if (transmission && v.transmission !== transmission) return false;
    return true;
  });

  const queryString = `pickup=BKK&dropoff=BKK&pickupAt=${encodeURIComponent(new Date().toISOString().slice(0, 16))}&dropoffAt=${encodeURIComponent(new Date(Date.now() + 86400000).toISOString().slice(0, 16))}`;

  return (
    <div className="mx-auto max-w-container px-6 py-8 lg:py-12">
      <h1 className="mb-6 text-2xl font-bold text-black lg:text-3xl">
        {categoryParam ? `${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)} vehicles` : "All vehicles"}
      </h1>

      <div className="flex gap-8">
        {/* Desktop: filter sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar
            selectedCategory={category}
            selectedTransmission={transmission}
            onCategoryChange={setCategory}
            onTransmissionChange={setTransmission}
          />
        </div>

        {/* Mobile: filter button */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between lg:mb-6">
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="lg:hidden min-h-tap border border-hertz-border px-4 font-semibold text-black"
            >
              Filters
            </button>
            <select
              className="ml-auto border border-hertz-border bg-white px-3 py-2 text-sm font-medium text-hertz-black-90"
              defaultValue=""
            >
              <option value="">Sort by price</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </div>

          <MobileFilterDrawer
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            selectedCategory={category}
            selectedTransmission={transmission}
            onCategoryChange={setCategory}
            onTransmissionChange={setTransmission}
          />

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 animate-pulse bg-hertz-gray" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((v) => (
                <VehicleCard key={v.groupCode} vehicle={v} searchParams={queryString} showImage />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <p className="py-12 text-center text-hertz-black-80">
              No vehicles match your filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VehiclesPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-container px-6 py-12" />}>
      <VehiclesContent />
    </Suspense>
  );
}
