"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { FadeInSection } from "./FadeInSection";
import { useCarousel } from "@/hooks/useCarousel";
import { VoucherProductTile } from "@/components/voucher/VoucherProductTile";
import type { VoucherCatalogItem } from "@/app/api/vouchers/catalog/route";

function VoucherCard({ v }: { v: VoucherCatalogItem }) {
  const saveAmount = v.type === "FIXED" ? v.value - v.selling_price : 0;
  const savePercent =
    v.type === "FIXED" && v.value > 0
      ? Math.round((saveAmount / v.value) * 100)
      : 0;
  const saveBadge = savePercent > 0 ? `Save ${savePercent}%` : undefined;

  return (
    <Link
      href={`/vouchers/${v.id}`}
      className="group flex h-full flex-col overflow-hidden rounded border border-white bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      <VoucherProductTile
        cardStyle={v.card_style}
        value={v.value}
        label={v.product_category}
      />
      <div className="flex flex-1 flex-col border-t border-hertz-border bg-[#FFFFFF] p-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-hertz-black-60">
          {v.product_category}
        </span>
        <h3 className="mt-1 font-bold text-black">{v.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-hertz-black-80">
          {v.description}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-hertz-black-80">
            Pay ฿{v.selling_price.toLocaleString()}
          </span>
          {saveBadge && (
            <span className="text-xs font-medium text-green-700">{saveBadge}</span>
          )}
        </div>
        <span className="mt-4 flex min-h-tap items-center justify-center border-2 border-black bg-white font-bold text-black group-hover:bg-[#F5F5F5]">
          Buy Now
        </span>
      </div>
    </Link>
  );
}

export function GiftVouchersSection() {
  const [vouchers, setVouchers] = useState<VoucherCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vouchers/catalog")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data.vouchers) ? data.vouchers : [];
        const featured = list.filter((v: VoucherCatalogItem) => v.featured).slice(0, 4);
        setVouchers(featured.length >= 3 ? featured : list.slice(0, 4));
      })
      .catch(() => setVouchers([]))
      .finally(() => setLoading(false));
  }, []);

  const carousel = useCarousel({
    total: vouchers.length || 1,
    intervalMs: 5000,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  if (loading || vouchers.length === 0) return null;

  return (
    <FadeInSection>
      <section className="border-b border-hertz-border bg-[#F8F8F8] py-14 lg:py-20">
        <div className="mx-auto max-w-container px-12">
          <h2 className="mb-10 text-2xl font-bold text-black lg:text-3xl">
            Gift Vouchers &amp; Special Deals
          </h2>

          {/* Desktop: grid */}
          <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-4 lg:gap-8">
            {vouchers.map((v) => (
              <VoucherCard key={v.id} v={v} />
            ))}
          </div>

          {/* Mobile: carousel */}
          <div className="lg:hidden" ref={containerRef}>
            <div className="overflow-hidden">
              {vouchers.map((v, i) => (
                <div
                  key={v.id}
                  className={`transition-transform duration-300 ${
                    i === carousel.index ? "block" : "hidden"
                  }`}
                >
                  <VoucherCard v={v} />
                </div>
              ))}
            </div>
            {vouchers.length > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => carousel.prev()}
                  className="min-h-tap min-w-tap border border-hertz-border bg-white p-2 font-bold text-black"
                  aria-label="Previous"
                >
                  ←
                </button>
                <div className="flex gap-1">
                  {vouchers.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => carousel.goTo(i)}
                      className={`h-2 w-2 rounded-full ${
                        i === carousel.index ? "bg-black" : "bg-hertz-border"
                      }`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => carousel.next()}
                  className="min-h-tap min-w-tap border border-hertz-border bg-white p-2 font-bold text-black"
                  aria-label="Next"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
