"use client";

import { useCallback, useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { MyVoucher } from "@/app/api/vouchers/my/route";
import { VOUCHER_TYPE_LABELS, isBenefitType } from "@/types/voucher";

type VoucherStatus = MyVoucher["status"];

const STATUS_TABS: { value: VoucherStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "USED", label: "Used" },
  { value: "EXPIRED", label: "Expired" },
];

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "expiry_asc", label: "Expiry date (nearest first)" },
  { value: "expiry_desc", label: "Expiry date (latest first)" },
  { value: "value_desc", label: "Value high to low" },
  { value: "value_asc", label: "Value low to high" },
  { value: "issued_desc", label: "Recently issued" },
];

const PAGE_SIZES = [10, 20, 50];

function valueOrBenefitLabel(v: MyVoucher): string {
  if (v.benefit) return v.benefit;
  if (v.type === "FIXED" && v.value != null) return `${v.value} THB off`;
  if (v.type === "PERCENT" && v.value != null) return `${v.value}% off`;
  return v.description;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function StatusBadge({ status }: { status: VoucherStatus }) {
  const styles =
    status === "ACTIVE"
      ? "bg-green-100 text-green-800"
      : status === "USED"
        ? "bg-hertz-gray text-hertz-black-60"
        : "bg-red-100 text-red-800";
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium ${styles}`}>
      {status}
    </span>
  );
}

function VoucherRow({ v }: { v: MyVoucher }) {
  const benefitBadge = isBenefitType(v.type)
    ? (VOUCHER_TYPE_LABELS as Record<string, string>)[v.type]
    : null;
  return (
    <li className="flex flex-wrap items-start justify-between gap-3 border-b border-hertz-border py-4 last:border-b-0">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-black">{v.code}</span>
          {benefitBadge && (
            <span className="inline-block border border-hertz-border bg-white px-1.5 py-0.5 text-xs font-medium text-hertz-black-80">
              {benefitBadge}
            </span>
          )}
          <StatusBadge status={v.status} />
        </div>
        <p className="mt-1 text-sm text-hertz-black-80">{v.description}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-hertz-black-60">
          <span>{valueOrBenefitLabel(v)}</span>
          <span>Expires {formatDate(v.expiry_date)}</span>
          <span>
            Min. {v.minimum_days} day{v.minimum_days !== 1 ? "s" : ""} rental
          </span>
        </div>
      </div>
    </li>
  );
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function MyVouchersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const status = (searchParams.get("status") ?? "ACTIVE") as VoucherStatus;
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("page_size") ?? "10";
  const searchInput = searchParams.get("search") ?? "";
  const sort = searchParams.get("sort") ?? "expiry_asc";
  const typeFilter = searchParams.get("type") ?? "";
  const minDaysFilter = searchParams.get("min_days") ?? "";
  const expiringSoon = searchParams.get("expiring_soon") ?? "";
  const valueMinFilter = searchParams.get("value_min") ?? "";
  const valueMaxFilter = searchParams.get("value_max") ?? "";

  const [searchLocal, setSearchLocal] = useState(searchInput);
  const debouncedSearch = useDebounce(searchLocal, 300);

  const setParams = useCallback(
    (updates: Record<string, string>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v !== "" && v !== undefined) next.set(k, v);
        else next.delete(k);
      });
      next.set("page", "1");
      router.replace(`/my-vouchers?${next.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const setPage = useCallback(
    (p: number) => {
      const next = new URLSearchParams(searchParams.toString());
      next.set("page", String(p));
      router.replace(`/my-vouchers?${next.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  useEffect(() => {
    setSearchLocal(searchInput);
  }, [searchInput]);

  useEffect(() => {
    if (debouncedSearch !== searchInput) {
      const next = new URLSearchParams(searchParams.toString());
      if (debouncedSearch) next.set("search", debouncedSearch);
      else next.delete("search");
      next.set("page", "1");
      router.replace(`/my-vouchers?${next.toString()}`, { scroll: false });
    }
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const [data, setData] = useState<{
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    vouchers: MyVoucher[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    p.set("status", status);
    p.set("page", page);
    p.set("page_size", pageSize);
    p.set("sort", sort);
    if (searchParams.get("search")) p.set("search", searchParams.get("search")!);
    if (typeFilter) p.set("type", typeFilter);
    if (minDaysFilter) p.set("min_days", minDaysFilter);
    if (expiringSoon === "1") p.set("expiring_soon", "1");
    if (valueMinFilter) p.set("value_min", valueMinFilter);
    if (valueMaxFilter) p.set("value_max", valueMaxFilter);
    return p.toString();
  }, [
    status,
    page,
    pageSize,
    sort,
    searchParams,
    typeFilter,
    minDaysFilter,
    expiringSoon,
    valueMinFilter,
    valueMaxFilter,
  ]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/vouchers/my?${queryString}`, { credentials: "include" })
      .then((res) => {
        if (res.status === 401) {
          setError("Unauthorized");
          return null;
        }
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((d) => {
        if (d) setData(d);
        else setData({ total: 0, page: 1, page_size: 10, total_pages: 0, vouchers: [] });
      })
      .catch(() => {
        setError("Failed to load vouchers");
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [queryString]);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold text-black">My Vouchers</h1>
        <p className="mt-4 text-red-600">{error}</p>
        <Link
          href="/account/login?returnUrl=/my-vouchers"
          className="mt-4 inline-block text-sm font-medium text-black underline"
        >
          Log in
        </Link>
      </div>
    );
  }

  const total = data?.total ?? 0;
  const currentPage = data?.page ?? 1;
  const totalPages = data?.total_pages ?? 0;
  const vouchers = data?.vouchers ?? [];
  const pageSizeNum = parseInt(pageSize, 10) || 10;

  const emptyMessage =
    status === "ACTIVE"
      ? "You have no active vouchers."
      : status === "USED"
        ? "You have no used vouchers."
        : "You have no expired vouchers.";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-black">My Vouchers</h1>

      {/* Tabs */}
      <div className="mt-6 border-b border-hertz-border">
        <nav className="flex gap-6" aria-label="Voucher status">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                const next = new URLSearchParams(searchParams.toString());
                next.set("status", tab.value);
                next.set("page", "1");
                router.replace(`/my-vouchers?${next.toString()}`, { scroll: false });
              }}
              className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
                status === tab.value
                  ? "border-black text-black"
                  : "border-transparent text-hertz-black-80 hover:text-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Search & filter bar */}
      <div className="mt-6 flex flex-wrap items-center gap-3 border-b border-hertz-border pb-4">
        <input
          type="search"
          value={searchLocal}
          onChange={(e) => setSearchLocal(e.target.value)}
          placeholder="Search voucher code"
          className="min-h-tap w-48 flex-1 min-w-[140px] border border-hertz-border px-3 py-2 text-sm text-black placeholder:text-hertz-black-60 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
        <select
          value={sort}
          onChange={(e) => setParams({ sort: e.target.value })}
          className="min-h-tap border border-hertz-border bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setParams({ type: e.target.value })}
          className="min-h-tap border border-hertz-border bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none"
        >
          <option value="">All types</option>
          <option value="FIXED">Fixed</option>
          <option value="PERCENT">%</option>
        </select>
        <input
          type="number"
          min={1}
          value={minDaysFilter}
          onChange={(e) => setParams({ min_days: e.target.value })}
          placeholder="Min days"
          className="min-h-tap w-24 border border-hertz-border px-3 py-2 text-sm text-black placeholder:text-hertz-black-60 focus:border-black focus:outline-none"
        />
        <label className="flex cursor-pointer items-center gap-2 text-sm text-hertz-black-80">
          <input
            type="checkbox"
            checked={expiringSoon === "1"}
            onChange={(e) =>
              setParams({ expiring_soon: e.target.checked ? "1" : "" })
            }
            className="h-4 w-4 border-hertz-border text-black focus:ring-black"
          />
          Expiring soon (30 days)
        </label>
        <div className="flex items-center gap-1 text-sm text-hertz-black-60">
          <span>Value:</span>
          <input
            type="number"
            min={0}
            value={valueMinFilter}
            onChange={(e) => setParams({ value_min: e.target.value })}
            placeholder="Min"
            className="w-20 border border-hertz-border px-2 py-1 text-sm"
          />
          <span>–</span>
          <input
            type="number"
            min={0}
            value={valueMaxFilter}
            onChange={(e) => setParams({ value_max: e.target.value })}
            placeholder="Max"
            className="w-20 border border-hertz-border px-2 py-1 text-sm"
          />
        </div>
      </div>

      {/* List */}
      <div className="mt-6">
        {loading ? (
          <div className="space-y-0 border border-hertz-border bg-white">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-20 animate-pulse border-b border-hertz-border last:border-0"
              />
            ))}
          </div>
        ) : vouchers.length === 0 ? (
          <div className="border border-hertz-border bg-white px-6 py-12 text-center">
            <p className="text-hertz-black-80">{emptyMessage}</p>
          </div>
        ) : (
          <>
            <ul className="border border-hertz-border bg-white px-4">
              {vouchers.map((v) => (
                <VoucherRow key={v.id} v={v} />
              ))}
            </ul>

            {/* Pagination */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-hertz-border pt-4">
              <div className="flex items-center gap-2 text-sm text-hertz-black-80">
                <span>
                  Showing {(currentPage - 1) * pageSizeNum + 1}–
                  {Math.min(currentPage * pageSizeNum, total)} of {total}
                </span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    const next = new URLSearchParams(searchParams.toString());
                    next.set("page_size", e.target.value);
                    next.set("page", "1");
                    router.replace(`/my-vouchers?${next.toString()}`, {
                      scroll: false,
                    });
                  }}
                  className="border border-hertz-border bg-white px-2 py-1 text-sm"
                >
                  {PAGE_SIZES.map((n) => (
                    <option key={n} value={n}>
                      {n} per page
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="min-h-tap min-w-tap border border-hertz-border px-3 py-1.5 text-sm font-medium text-black disabled:pointer-events-none disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let p: number;
                  if (totalPages <= 5) p = i + 1;
                  else if (currentPage <= 3) p = i + 1;
                  else if (currentPage >= totalPages - 2)
                    p = totalPages - 4 + i;
                  else p = currentPage - 2 + i;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      className={`min-h-tap min-w-tap border px-3 py-1.5 text-sm font-medium ${
                        p === currentPage
                          ? "border-black bg-black text-white"
                          : "border-hertz-border text-black hover:border-black"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="min-h-tap min-w-tap border border-hertz-border px-3 py-1.5 text-sm font-medium text-black disabled:pointer-events-none disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function MyVouchersPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-2xl font-bold text-black">My Vouchers</h1>
          <div className="mt-6 h-64 animate-pulse border border-hertz-border bg-hertz-gray" />
        </div>
      }
    >
      <MyVouchersContent />
    </Suspense>
  );
}
