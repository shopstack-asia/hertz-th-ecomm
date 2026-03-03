"use client";

import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const categories: { value: string; key: string }[] = [
  { value: "", key: "filters.all" },
  { value: "economy", key: "filters.economy" },
  { value: "compact", key: "filters.compact" },
  { value: "mid-size", key: "filters.mid_size" },
  { value: "suv", key: "filters.suv" },
  { value: "premium", key: "filters.premium" },
  { value: "luxury", key: "filters.luxury" },
  { value: "van", key: "filters.van" },
  { value: "hybrid", key: "filters.hybrid" },
  { value: "ev", key: "filters.ev" },
  { value: "pickup", key: "filters.pickup" },
];

const transmissionOptions: { value: string; key: string }[] = [
  { value: "", key: "filters.all" },
  { value: "A", key: "filters.automatic" },
  { value: "M", key: "filters.manual" },
];

interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedCategory: string;
  selectedTransmission: string;
  onCategoryChange: (v: string) => void;
  onTransmissionChange: (v: string) => void;
}

export function MobileFilterDrawer({
  open,
  onClose,
  selectedCategory,
  selectedTransmission,
  onCategoryChange,
  onTransmissionChange,
}: MobileFilterDrawerProps) {
  const { t } = useLanguage();

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 lg:hidden"
        onClick={onClose}
        aria-hidden
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto border-l border-hertz-border bg-white p-6 lg:hidden">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-black">{t("common.filters")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="min-h-tap min-w-tap p-2 text-hertz-black-80 hover:text-black"
            aria-label={t("common.close")}
          >
            ✕
          </button>
        </div>
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-black">
              {t("filters.vehicle_class")}
            </h3>
            <ul className="mt-3 space-y-1">
              {categories.map((c) => (
                <li key={c.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onCategoryChange(c.value);
                    }}
                    className={`block w-full py-2 text-left text-sm ${
                      selectedCategory === c.value
                        ? "font-bold text-black"
                        : "text-hertz-black-80"
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
              {t("filters.transmission")}
            </h3>
            <ul className="mt-3 space-y-1">
              {transmissionOptions.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => onTransmissionChange(opt.value)}
                    className={`block w-full py-2 text-left text-sm ${
                      selectedTransmission === opt.value
                        ? "font-bold text-black"
                        : "text-hertz-black-80"
                    }`}
                  >
                    {t(opt.key)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-8 flex h-12 w-full items-center justify-center bg-hertz-yellow font-bold text-black"
        >
          {t("filters.apply_filters")}
        </button>
      </div>
    </>
  );
}
