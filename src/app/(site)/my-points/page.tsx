"use client";

import { useEffect, useState, useCallback } from "react";
import { PointsSummaryCard } from "@/components/loyalty/PointsSummaryCard";
import { ExpiringPointsAlert } from "@/components/loyalty/ExpiringPointsAlert";
import {
  PointsFilterBar,
  type PointsFilterState,
} from "@/components/points-table/PointsFilterBar";
import { PointActivityTable } from "@/components/points-table/PointActivityTable";
import { PointsPagination } from "@/components/points-table/PointsPagination";
import * as loyaltyService from "@/services/loyalty.service";
import type { LoyaltySummary } from "@/types/loyalty";
import type { PointsTransaction } from "@/types/loyalty";

const DEFAULT_FILTERS: PointsFilterState = {
  type: "ALL",
  dateFrom: "",
  dateTo: "",
  sort: "newest",
};

export default function MyPointsPage() {
  const [summary, setSummary] = useState<LoyaltySummary | null>(null);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [pagination, setPagination] = useState({ page: 1, total_pages: 1 });
  const [filters, setFilters] = useState<PointsFilterState>(DEFAULT_FILTERS);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    setLoadingSummary(true);
    setError(null);
    try {
      const data = await loyaltyService.getPointsSummary();
      setSummary(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load summary");
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  const loadTransactions = useCallback(
    async (page: number) => {
      setLoadingTransactions(true);
      setError(null);
      try {
        const res = await loyaltyService.getPointsTransactions({
          page,
          type: filters.type,
          dateFrom: filters.dateFrom || undefined,
          dateTo: filters.dateTo || undefined,
          sort: filters.sort,
        });
        setTransactions(res.data);
        setPagination(res.pagination);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Failed to load transactions"
        );
      } finally {
        setLoadingTransactions(false);
      }
    },
    [filters.type, filters.dateFrom, filters.dateTo, filters.sort]
  );

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    loadTransactions(pagination.page);
  }, [
    filters.type,
    filters.dateFrom,
    filters.dateTo,
    filters.sort,
    pagination.page,
    loadTransactions,
  ]);

  const handleFilterChange = useCallback((newFilters: PointsFilterState) => {
    setFilters(newFilters);
    setPagination((p) => ({ ...p, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPagination((p) => ({ ...p, page }));
  }, []);

  if (error && !summary && !transactions.length) {
    return (
      <div className="mx-auto max-w-[1100px] px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-hertz-black-90">
          My Points
        </h1>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
          <p className="font-medium">{error}</p>
          <button
            type="button"
            onClick={() => {
              loadSummary();
              loadTransactions(1);
            }}
            className="mt-3 text-sm font-medium underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 md:py-10">
      <h1 className="mb-6 text-2xl font-bold text-hertz-black-90">
        My Points
      </h1>

      {/* Summary section */}
      <section className="mb-10">
        {loadingSummary ? (
          <div className="rounded-2xl border-2 border-hertz-yellow/30 bg-white p-6 shadow-md md:p-8">
            <div className="h-8 w-48 animate-pulse rounded bg-hertz-gray" />
            <div className="mt-4 h-6 w-32 animate-pulse rounded bg-hertz-gray" />
            <div className="mt-6 flex gap-4">
              <div className="h-16 w-24 animate-pulse rounded bg-hertz-gray" />
              <div className="h-16 w-32 animate-pulse rounded bg-hertz-gray" />
            </div>
          </div>
        ) : summary ? (
          <>
            <PointsSummaryCard data={summary} />
            {summary.expiring_points > 0 && summary.expiring_date && (
              <div className="mt-4">
                <ExpiringPointsAlert
                  expiringPoints={summary.expiring_points}
                  expiringDate={summary.expiring_date}
                />
              </div>
            )}
          </>
        ) : null}
      </section>

      {/* Point Activity */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-hertz-black-90">
          Point Activity
        </h2>

        <PointsFilterBar state={filters} onChange={handleFilterChange} />

        <div className="mt-4">
          {loadingTransactions ? (
            <div className="rounded-xl border border-hertz-border bg-white py-12">
              <div className="flex flex-col gap-4 px-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-16 animate-pulse rounded-lg bg-hertz-gray/60"
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              <PointActivityTable transactions={transactions} />
              <PointsPagination
                page={pagination.page}
                totalPages={pagination.total_pages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
