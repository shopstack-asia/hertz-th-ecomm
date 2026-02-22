"use client";

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
  return (
    <aside className="w-64 shrink-0 space-y-6">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-black">
          Vehicle class
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
                className={`block w-full text-left py-2 text-sm ${
                  selectedTransmission === t.value
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
    </aside>
  );
}
