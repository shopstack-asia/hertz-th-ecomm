"use client";

import { useEffect } from "react";

const categories = [
  { value: "", label: "All" },
  { value: "economy", label: "Economy" },
  { value: "compact", label: "Compact" },
  { value: "mid-size", label: "Mid-size" },
  { value: "suv", label: "SUV" },
  { value: "premium", label: "Premium" },
  { value: "luxury", label: "Luxury" },
  { value: "van", label: "Van" },
  { value: "hybrid", label: "Hybrid" },
  { value: "ev", label: "EV" },
  { value: "pickup", label: "Pickup" },
];

const transmission = [
  { value: "", label: "All" },
  { value: "A", label: "Automatic" },
  { value: "M", label: "Manual" },
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
          <h2 className="text-lg font-bold text-black">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className="min-h-tap min-w-tap p-2 text-hertz-black-80 hover:text-black"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-black">
              Vehicle class
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
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-black">
              Transmission
            </h3>
            <ul className="mt-3 space-y-1">
              {transmission.map((t) => (
                <li key={t.value}>
                  <button
                    type="button"
                    onClick={() => onTransmissionChange(t.value)}
                    className={`block w-full py-2 text-left text-sm ${
                      selectedTransmission === t.value
                        ? "font-bold text-black"
                        : "text-hertz-black-80"
                    }`}
                  >
                    {t.label}
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
          Apply filters
        </button>
      </div>
    </>
  );
}
