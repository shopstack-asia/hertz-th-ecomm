"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { VoucherProductTile } from "@/components/voucher/VoucherProductTile";
import { useLanguage } from "@/contexts/LanguageContext";
import type { VoucherCatalogItem } from "@/app/api/vouchers/catalog/route";

const CATEGORIES: { value: string; key: string }[] = [
  { value: "", key: "vouchers.category_all" },
  { value: "gift", key: "vouchers.category_gift" },
  { value: "travel", key: "vouchers.category_travel" },
  { value: "corporate", key: "vouchers.category_corporate" },
];

const TYPES: { value: string; key: string }[] = [
  { value: "", key: "vouchers.type_all" },
  { value: "FIXED", key: "vouchers.type_fixed" },
  { value: "PERCENT", key: "vouchers.type_percent" },
  { value: "BENEFIT", key: "vouchers.type_benefit" },
];

function formatValidity(t: (key: string, params?: Record<string, number>) => string, days: number): string {
  if (days >= 365) return t("vouchers.valid_1_year");
  if (days >= 180) return t("vouchers.valid_6_months");
  return t("vouchers.valid_days", { days });
}

function VoucherListingCard({ v, t }: { v: VoucherCatalogItem; t: (key: string, params?: Record<string, string | number>) => string }) {
  const saveAmount = v.type === "FIXED" ? v.value - v.selling_price : 0;
  const saveBadge =
    saveAmount > 0 ? t("vouchers.save_amount", { amount: saveAmount.toLocaleString() }) : undefined;

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
          {t("vouchers.pay_amount", { amount: v.selling_price.toLocaleString() })}
        </p>
        <p className="mt-1 text-xs text-hertz-black-60">
          {formatValidity(t, v.validity_days)}
        </p>
        {saveBadge && (
          <p className="mt-1 text-xs font-medium text-green-700">{saveBadge}</p>
        )}
        <span className="mt-4 inline-block border-2 border-black px-4 py-2 text-center text-sm font-bold text-black">
          {t("vouchers.view_details")}
        </span>
      </div>
    </Link>
  );
}

function VouchersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
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
          {t("vouchers.page_title")}
        </h1>

      {paymentCancelled && (
        <div className="mb-6 border border-hertz-border bg-hertz-gray p-4">
          <p className="text-sm font-medium text-black">{t("vouchers.payment_cancelled_title")}</p>
          <p className="mt-1 text-sm text-hertz-black-80">
            {t("vouchers.payment_cancelled_body")}
          </p>
        </div>
      )}

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-black">
                {t("vouchers.voucher_type")}
              </h3>
              <ul className="mt-3 space-y-1">
                {TYPES.map((typeOpt) => (
                  <li key={typeOpt.value}>
                    <button
                      type="button"
                      onClick={() => updateFilter({ type: typeOpt.value })}
                      className={`block w-full py-2 text-left text-sm ${
                        typeFilter === typeOpt.value
                          ? "font-bold text-black"
                          : "text-hertz-black-80 hover:text-black"
                      }`}
                    >
                      {t(typeOpt.key)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-black">
                {t("vouchers.category")}
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
                      {t(c.key)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-black">
                {t("vouchers.price_range")}
              </h3>
              <div className="mt-3 flex gap-2">
                <input
                  type="number"
                  placeholder={t("vouchers.min")}
                  value={priceMin}
                  onChange={(e) => updateFilter({ price_min: e.target.value })}
                  className="w-24 border border-hertz-border px-2 py-2 text-sm"
                />
                <input
                  type="number"
                  placeholder={t("vouchers.max")}
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
              ? t("vouchers.loading")
              : filtered.length === 1
                ? t("vouchers.voucher_found_one")
                : t("vouchers.vouchers_found", { count: filtered.length })}
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
                {t("vouchers.no_match")}
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
                {t("vouchers.clear_filters")}
              </button>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((v) => (
                <VoucherListingCard key={v.id} v={v} t={t} />
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
