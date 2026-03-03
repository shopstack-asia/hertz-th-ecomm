"use client";

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

interface FilterSidebarProps {
  selectedCategory: string;
  selectedTransmission: string;
  onCategoryChange: (v: string) => void;
  onTransmissionChange: (v: string) => void;
}

export function FilterSidebar({
  selectedCategory,
  selectedTransmission,
  onCategoryChange,
  onTransmissionChange,
}: FilterSidebarProps) {
  const { t } = useLanguage();
  return (
    <aside className="w-64 shrink-0 space-y-6">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-black">
          {t("filters.vehicle_class")}
        </h3>
        <ul className="mt-3 space-y-1">
          {categories.map((c) => (
            <li key={c.value}>
              <button
                type="button"
                onClick={() => onCategoryChange(c.value)}
                className={`block w-full text-left py-2 text-sm ${
                  selectedCategory === c.value
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
          {t("filters.transmission")}
        </h3>
        <ul className="mt-3 space-y-1">
          {transmissionOptions.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => onTransmissionChange(opt.value)}
                className={`block w-full text-left py-2 text-sm ${
                  selectedTransmission === opt.value
                    ? "font-bold text-black"
                    : "text-hertz-black-80 hover:text-black"
                }`}
              >
                {t(opt.key)}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
