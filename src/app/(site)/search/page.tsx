"use client";

import { useEffect, useState, useCallback, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { FilterSidebar } from "@/components/search/FilterSidebar";
import { MobileFilterDrawer } from "@/components/search/MobileFilterDrawer";
import { usePromotionOptional } from "@/contexts/PromotionContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { SearchResultVehicleGroup } from "@/types";

const PAGE_SIZE = 9;

interface SearchApiResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  data: SearchResultVehicleGroup[];
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promotion = usePromotionOptional();
  const { t } = useLanguage();

  const pickup = searchParams.get("pickup") ?? "";
  const dropoff = searchParams.get("dropoff") ?? pickup;
  const pickupAt = searchParams.get("pickupAt") ?? "";
  const dropoffAt = searchParams.get("dropoffAt") ?? "";
  const pickupName = searchParams.get("pickupName") ?? pickup;
  const dropoffName = searchParams.get("dropoffName") ?? dropoff;
  const category = searchParams.get("category") ?? "";
  const transmission = searchParams.get("transmission") ?? "";
  const sort = searchParams.get("sort") ?? "";
  const page = searchParams.get("page") ?? "1";

  const rentalDays = useMemo(() => {
    if (!pickupAt || !dropoffAt) return 1;
    const ms = new Date(dropoffAt).getTime() - new Date(pickupAt).getTime();
    return Math.max(1, Math.ceil(ms / (24 * 60 * 60 * 1000)));
  }, [pickupAt, dropoffAt]);

  const [response, setResponse] = useState<SearchApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const promoFromUrl = searchParams.get("promo") ?? "";
  // Re-validate promotion only when search params or promo in URL change (do NOT depend on promotion object to avoid loop)
  useEffect(() => {
    const promo = promoFromUrl.trim().toUpperCase();
    if (!promo || !pickupAt || !dropoffAt) return;
    fetch("/api/promotion/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        promo_code: promo,
        pickup_location: pickupName || pickup,
        dropoff_location: dropoffName || dropoff,
        pickup_date: pickupAt,
        dropoff_date: dropoffAt,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        promotion?.setValidation({
          status: data.valid ? "valid" : "invalid",
          message: data.message,
          reason: data.message,
          discountLabel: data.discount_label,
          conditions: data.conditions,
        });
      })
      .catch(() => {});
  }, [pickupAt, dropoffAt, pickup, dropoff, pickupName, dropoffName, promoFromUrl]);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) next.set(k, v);
        else next.delete(k);
      });
      if (updates.category !== undefined || updates.transmission !== undefined || updates.sort !== undefined) {
        next.set("page", "1");
      }
      router.push(`/search?${next.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (pickup) params.set("pickup", pickup);
    if (dropoff) params.set("dropoff", dropoff);
    if (pickupAt) params.set("pickupAt", pickupAt);
    if (dropoffAt) params.set("dropoffAt", dropoffAt);
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
          setResponse({ total: 0, page: 1, page_size: PAGE_SIZE, total_pages: 0, data: [] });
        }
      })
      .catch(() => setResponse({ total: 0, page: 1, page_size: PAGE_SIZE, total_pages: 0, data: [] }))
      .finally(() => setLoading(false));
  }, [pickup, dropoff, pickupAt, dropoffAt, category, transmission, sort, page]);

  const vehicles = response?.data ?? [];
  const total = response?.total ?? 0;
  const currentPage = response?.page ?? 1;
  const totalPages = response?.total_pages ?? 0;
  const queryString = searchParams.toString();

  const handleCategoryChange = (v: string) => updateParams({ category: v });
  const handleTransmissionChange = (v: string) => updateParams({ transmission: v });
  const handleSortChange = (v: string) => updateParams({ sort: v });
  const handlePageChange = (p: number) => updateParams({ page: String(p) });

  return (
    <div className="mx-auto max-w-container px-6 py-8 lg:py-12">
      <h1 className="mb-6 text-2xl font-bold text-black lg:text-3xl">
        {t("search.search_results")}
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
              {t("search.filters")}
            </button>
            <p className="text-sm text-hertz-black-80">
              {loading ? t("search.searching") : total === 1 ? t("search.vehicles_found_one") : t("search.vehicles_found", { count: total })}
            </p>
            <select
              className="ml-auto border border-hertz-border bg-white px-3 py-2 text-sm font-medium text-hertz-black-90"
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="">{t("search.sort_by")}</option>
              <option value="price_asc">{t("search.price_asc")}</option>
              <option value="price_desc">{t("search.price_desc")}</option>
              <option value="name_asc">{t("search.name_asc")}</option>
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
                {t("search.no_vehicles")}
              </p>
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
                    rentalDays={rentalDays}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <nav
                  className="mt-8 flex flex-wrap items-center justify-center gap-2"
                  aria-label={t("common.pagination")}
                >
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="min-h-tap min-w-tap border border-hertz-border px-3 text-sm font-medium text-hertz-black-80 transition-colors hover:border-black hover:text-black disabled:opacity-50 disabled:pointer-events-none"
                    aria-label={t("common.previous")}
                  >
                    ← {t("common.previous")}
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handlePageChange(p)}
                        className={`min-h-tap min-w-tap border px-3 text-sm font-medium transition-colors ${
                          p === currentPage
                            ? "border-black bg-black text-white"
                            : "border-hertz-border text-hertz-black-80 hover:border-black hover:text-black"
                        }`}
                        aria-current={p === currentPage ? "page" : undefined}
                        aria-label={`Page ${p}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="min-h-tap min-w-tap border border-hertz-border px-3 text-sm font-medium text-hertz-black-80 transition-colors hover:border-black hover:text-black disabled:opacity-50 disabled:pointer-events-none"
                    aria-label={t("common.next")}
                  >
                    {t("common.next")} →
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-container px-6 py-12" />}>
      <SearchContent />
    </Suspense>
  );
}
