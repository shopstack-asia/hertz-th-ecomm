"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { VoucherProductTile } from "@/components/voucher/VoucherProductTile";
import type { VoucherCatalogItem } from "@/app/api/vouchers/catalog/route";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "gift", label: "Gift vouchers" },
  { value: "travel", label: "Travel vouchers" },
  { value: "corporate", label: "Corporate vouchers" },
];

const TYPES = [
  { value: "", label: "All" },
  { value: "FIXED", label: "Fixed value" },
  { value: "PERCENT", label: "Discount %" },
  { value: "BENEFIT", label: "Free add-ons" },
];

function formatValidity(days: number): string {
  if (days >= 365) return "Valid 1 year";
  if (days >= 180) return "Valid 6 months";
  return `Valid ${days} days`;
}

function VoucherListingCard({ v }: { v: VoucherCatalogItem }) {
  const saveAmount = v.type === "FIXED" ? v.value - v.selling_price : 0;
  const saveBadge =
    saveAmount > 0 ? `Save ฿${saveAmount.toLocaleString()}` : undefined;

  return (
    <Link
      href={`/vouchers/${v.id}`}
      className="group flex flex-col overflow-hidden rounded border border-white bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      <VoucherProductTile
        cardStyle={v.card_style}
        value={v.value}
        label={v.product_category}
        compact
      />
      <div className="flex flex-1 flex-col border-t border-hertz-border bg-white p-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-hertz-black-60">
          {v.product_category}
        </span>
        <h2 className="mt-1 font-bold text-black group-hover:underline">{v.title}</h2>
        <p className="mt-1 line-clamp-2 text-sm text-hertz-black-80">
          {v.description}
        </p>
        <p className="mt-1 text-sm text-hertz-black-80">
          Pay ฿{v.selling_price.toLocaleString()}
        </p>
        <p className="mt-1 text-xs text-hertz-black-60">
          {formatValidity(v.validity_days)}
        </p>
        {saveBadge && (
          <p className="mt-1 text-xs font-medium text-green-700">{saveBadge}</p>
        )}
        <span className="mt-4 inline-block border-2 border-black px-4 py-2 text-center text-sm font-bold text-black">
          View Details
        </span>
      </div>
    </Link>
  );
}

function VouchersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeFilter = searchParams.get("type") ?? "";
  const categoryFilter = searchParams.get("category") ?? "";
  const priceMin = searchParams.get("price_min") ?? "";
  const priceMax = searchParams.get("price_max") ?? "";

  const [vouchers, setVouchers] = useState<VoucherCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/vouchers/catalog")
      .then((r) => r.json())
      .then((data) => {
        setVouchers(Array.isArray(data.vouchers) ? data.vouchers : []);
      })
      .catch(() => setVouchers([]))
      .finally(() => setLoading(false));
  }, []);

  const updateFilter = useCallback(
    (updates: Record<string, string>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) next.set(k, v);
        else next.delete(k);
      });
      next.set("page", "1");
      router.push(`/vouchers?${next.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const filtered = vouchers.filter((v) => {
    if (typeFilter && v.type !== typeFilter) return false;
    if (categoryFilter && v.category !== categoryFilter) return false;
    const price = v.selling_price;
    if (priceMin && price < Number(priceMin)) return false;
    if (priceMax && price > Number(priceMax)) return false;
    return true;
  });

  const paymentCancelled = searchParams.get("payment") === "cancelled";

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <div className="mx-auto max-w-container px-6 py-10 lg:py-14">
        <h1 className="mb-8 text-2xl font-bold text-black lg:text-3xl">
          Vouchers
        </h1>

      {paymentCancelled && (
        <div className="mb-6 border border-hertz-border bg-hertz-gray p-4">
          <p className="text-sm font-medium text-black">Payment was cancelled.</p>
          <p className="mt-1 text-sm text-hertz-black-80">
            You can select a voucher and try again when ready.
          </p>
        </div>
      )}

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-black">
                Voucher type
              </h3>
              <ul className="mt-3 space-y-1">
                {TYPES.map((t) => (
                  <li key={t.value}>
                    <button
                      type="button"
                      onClick={() => updateFilter({ type: t.value })}
                      className={`block w-full py-2 text-left text-sm ${
                        typeFilter === t.value
                          ? "font-bold text-black"
                          : "text-hertz-black-80 hover:text-black"
                      }`}
                    >
                      {t.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-black">
                Category
              </h3>
              <ul className="mt-3 space-y-1">
                {CATEGORIES.map((c) => (
                  <li key={c.value}>
                    <button
                      type="button"
                      onClick={() => updateFilter({ category: c.value })}
                      className={`block w-full py-2 text-left text-sm ${
                        categoryFilter === c.value
                          ? "font-bold text-black"
                          : "text-hertz-black-80 hover:text-black"
                      }`}
                    >
                      {c.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-black">
                Price range (฿)
              </h3>
              <div className="mt-3 flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => updateFilter({ price_min: e.target.value })}
                  className="w-24 border border-hertz-border px-2 py-2 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => updateFilter({ price_max: e.target.value })}
                  className="w-24 border border-hertz-border px-2 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <p className="mb-4 text-sm text-hertz-black-80">
            {loading
              ? "Loading…"
              : `${filtered.length} voucher${filtered.length !== 1 ? "s" : ""} found`}
          </p>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 animate-pulse bg-hertz-gray" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded border border-hertz-border bg-white p-12 text-center">
              <p className="text-hertz-black-80">
                No vouchers match your filters.
              </p>
              <button
                type="button"
                onClick={() =>
                  updateFilter({
                    type: "",
                    category: "",
                    price_min: "",
                    price_max: "",
                  })
                }
                className="mt-4 font-bold text-black underline hover:no-underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((v) => (
                <VoucherListingCard key={v.id} v={v} />
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

export default function VouchersPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-container px-6 py-12" />}>
      <VouchersContent />
    </Suspense>
  );
}
