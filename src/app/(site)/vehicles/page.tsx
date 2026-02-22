"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { FilterSidebar } from "@/components/search/FilterSidebar";
import { MobileFilterDrawer } from "@/components/search/MobileFilterDrawer";
import type { SearchResultVehicleGroup } from "@/types";

const PAGE_SIZE = 9;

interface SearchApiResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  data: SearchResultVehicleGroup[];
}

function defaultDates() {
  const d = new Date();
  const d2 = new Date(Date.now() + 86400000);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return {
    pickupAt: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T10:00:00`,
    dropoffAt: `${d2.getFullYear()}-${pad(d2.getMonth() + 1)}-${pad(d2.getDate())}T10:00:00`,
  };
}

function VehiclesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") ?? "";
  const transmission = searchParams.get("transmission") ?? "";
  const sort = searchParams.get("sort") ?? "";
  const page = searchParams.get("page") ?? "1";

  const [response, setResponse] = useState<SearchApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) next.set(k, v);
        else next.delete(k);
      });
      if (
        updates.category !== undefined ||
        updates.transmission !== undefined ||
        updates.sort !== undefined
      ) {
        next.set("page", "1");
      }
      router.push(`/vehicles?${next.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  useEffect(() => {
    const { pickupAt, dropoffAt } = defaultDates();
    const params = new URLSearchParams();
    params.set("pickup", "BKK");
    params.set("dropoff", "BKK");
    params.set("pickupAt", pickupAt);
    params.set("dropoffAt", dropoffAt);
    if (category) params.set("category", category);
    if (transmission) params.set("transmission", transmission);
    if (sort) params.set("sort", sort);
    params.set("page", page);
    params.set("page_size", String(PAGE_SIZE));

    setLoading(true);
    fetch(`/api/search?${params}`)
      .then((r) => r.json())
      .then((data: SearchApiResponse) => {
        if (data && typeof data.total === "number" && Array.isArray(data.data)) {
          setResponse(data);
        } else {
          setResponse({
            total: 0,
            page: 1,
            page_size: PAGE_SIZE,
            total_pages: 0,
            data: [],
          });
        }
      })
      .catch(() =>
        setResponse({
          total: 0,
          page: 1,
          page_size: PAGE_SIZE,
          total_pages: 0,
          data: [],
        })
      )
      .finally(() => setLoading(false));
  }, [category, transmission, sort, page]);

  const vehicles = response?.data ?? [];
  const total = response?.total ?? 0;
  const currentPage = response?.page ?? 1;
  const totalPages = response?.total_pages ?? 0;

  const { pickupAt, dropoffAt } = defaultDates();
  const queryString = `pickup=BKK&dropoff=BKK&pickupAt=${encodeURIComponent(pickupAt)}&dropoffAt=${encodeURIComponent(dropoffAt)}`;

  const handleCategoryChange = (v: string) => updateParams({ category: v });
  const handleTransmissionChange = (v: string) => updateParams({ transmission: v });
  const handleSortChange = (v: string) => updateParams({ sort: v });
  const handlePageChange = (p: number) => updateParams({ page: String(p) });

  const pageTitle = category
    ? `${category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")} vehicles`
    : "All vehicles";

  return (
    <div className="mx-auto max-w-container px-6 py-8 lg:py-12">
      <h1 className="mb-6 text-2xl font-bold text-black lg:text-3xl">
        {pageTitle}
      </h1>

      <div className="flex gap-8">
        <div className="hidden lg:block">
          <FilterSidebar
            selectedCategory={category}
            selectedTransmission={transmission}
            onCategoryChange={handleCategoryChange}
            onTransmissionChange={handleTransmissionChange}
          />
        </div>

        <div className="flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-4 lg:mb-6">
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="lg:hidden min-h-tap border border-hertz-border px-4 font-semibold text-black"
            >
              Filters
            </button>
            <p className="text-sm text-hertz-black-80">
              {loading
                ? "Loading…"
                : `${total} vehicle${total !== 1 ? "s" : ""} found`}
            </p>
            <select
              className="ml-auto border border-hertz-border bg-white px-3 py-2 text-sm font-medium text-hertz-black-90"
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="">Sort by</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
              <option value="name_asc">Name: A–Z</option>
            </select>
          </div>

          <MobileFilterDrawer
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            selectedCategory={category}
            selectedTransmission={transmission}
            onCategoryChange={handleCategoryChange}
            onTransmissionChange={handleTransmissionChange}
          />

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div key={i} className="h-80 animate-pulse bg-hertz-gray" />
              ))}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="rounded border border-hertz-border bg-white p-12 text-center">
              <p className="text-hertz-black-80">
                No vehicles match your filters. Try adjusting your selection.
              </p>
              <button
                type="button"
                onClick={() =>
                  updateParams({
                    category: "",
                    transmission: "",
                    sort: "",
                    page: "1",
                  })
                }
                className="mt-4 font-bold text-black underline hover:no-underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((v) => (
                  <VehicleCard
                    key={v.groupCode}
                    vehicle={v}
                    searchParams={queryString}
                    showImage
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <nav
                  className="mt-8 flex flex-wrap items-center justify-center gap-2"
                  aria-label="Pagination"
                >
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="min-h-tap min-w-tap border border-hertz-border px-3 text-sm font-medium text-hertz-black-80 transition-colors hover:border-black hover:text-black disabled:opacity-50 disabled:pointer-events-none"
                    aria-label="Previous page"
                  >
                    ← Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handlePageChange(p)}
                          className={`min-h-tap min-w-tap border px-3 text-sm font-medium transition-colors ${
                            p === currentPage
                              ? "border-black bg-black text-white"
                              : "border-hertz-border text-hertz-black-80 hover:border-black hover:text-black"
                          }`}
                          aria-current={
                            p === currentPage ? "page" : undefined
                          }
                          aria-label={`Page ${p}`}
                        >
                          {p}
                        </button>
                      )
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="min-h-tap min-w-tap border border-hertz-border px-3 text-sm font-medium text-hertz-black-80 transition-colors hover:border-black hover:text-black disabled:opacity-50 disabled:pointer-events-none"
                    aria-label="Next page"
                  >
                    Next →
                  </button>
                </nav>
              )}
            </>
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
