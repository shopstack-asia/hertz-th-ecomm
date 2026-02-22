"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { FilterSidebar } from "@/components/search/FilterSidebar";
import { MobileFilterDrawer } from "@/components/search/MobileFilterDrawer";
import type { SearchResultVehicleGroup } from "@/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const pickup = searchParams.get("pickup") ?? "";
  const dropoff = searchParams.get("dropoff") ?? pickup;
  const pickupAt = searchParams.get("pickupAt") ?? "";
  const dropoffAt = searchParams.get("dropoffAt") ?? "";

  const [results, setResults] = useState<SearchResultVehicleGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [transmission, setTransmission] = useState("");

  useEffect(() => {
    const params = new URLSearchParams({ pickup, dropoff, pickupAt, dropoffAt });
    fetch(`/api/search?${params}`)
      .then((r) => r.json())
      .then((data) => setResults(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [pickup, dropoff, pickupAt, dropoffAt]);

  const filtered = results.filter((v) => {
    if (category && v.category.toLowerCase() !== category.toLowerCase())
      return false;
    if (transmission && v.transmission !== transmission) return false;
    return true;
  });

  const queryString = searchParams.toString();

  return (
    <div className="mx-auto max-w-container px-6 py-8 lg:py-12">
      <h1 className="mb-6 text-2xl font-bold text-black lg:text-3xl">
        Search results
      </h1>

      <div className="flex gap-8">
        <div className="hidden lg:block">
          <FilterSidebar
            selectedCategory={category}
            selectedTransmission={transmission}
            onCategoryChange={setCategory}
            onTransmissionChange={setTransmission}
          />
        </div>

        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between lg:mb-6">
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="lg:hidden min-h-tap border border-hertz-border px-4 font-semibold text-black"
            >
              Filters
            </button>
            <p className="text-sm text-hertz-black-80">
              {filtered.length} vehicle{filtered.length !== 1 ? "s" : ""} found
            </p>
            <select className="ml-auto border border-hertz-border bg-white px-3 py-2 text-sm font-medium text-hertz-black-90">
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
          ) : filtered.length === 0 ? (
            <div className="rounded border border-hertz-border bg-white p-12 text-center">
              <p className="text-hertz-black-80">
                No vehicles available for your search.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((v) => (
                <VehicleCard
                  key={v.groupCode}
                  vehicle={v}
                  searchParams={queryString}
                  showImage
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-container px-6 py-12" />}>
      <SearchContent />
    </Suspense>
  );
}
