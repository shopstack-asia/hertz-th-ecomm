"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type { PricingBreakdown } from "@/types";

interface PriceSummaryCardProps {
  pricing: PricingBreakdown;
  title?: string;
  className?: string;
}

export function PriceSummaryCard({
  pricing,
  title,
  className = "",
}: PriceSummaryCardProps) {
  const { t } = useLanguage();
  const displayTitle = title ?? t("checkout.price_summary");

  return (
    <div
      className={`border border-hertz-border bg-white p-6 shadow-card lg:sticky lg:top-24 ${className}`}
    >
      <h3 className="text-lg font-bold text-black">{displayTitle}</h3>
      <div className="mt-4 space-y-2">
        {pricing.lineItems.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-hertz-black-80">{item.description}</span>
            <span className="font-medium text-hertz-black-90">
              {item.amount >= 0 ? "฿" : "-฿"}
              {Math.abs(item.amount).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
      {pricing.vatAmount > 0 && (
        <div className="mt-2 flex justify-between border-t border-hertz-border pt-2 text-sm">
          <span className="text-hertz-black-60">{t("checkout.vat_label")}</span>
          <span className="text-hertz-black-80">
            ฿{pricing.vatAmount.toLocaleString()}
          </span>
        </div>
      )}
      <div className="mt-4 flex justify-between border-t-2 border-black pt-4">
        <span className="font-bold text-black">{t("thankYou.total")}</span>
        <span className="text-xl font-bold text-black">
          ฿{pricing.total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
