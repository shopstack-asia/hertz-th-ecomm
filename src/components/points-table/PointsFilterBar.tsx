"use client";

import type { PointsTransactionType } from "@/types/loyalty";

const TYPE_OPTIONS: { value: "ALL" | PointsTransactionType; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "EARN", label: "Earn" },
  { value: "REDEEM", label: "Redeem" },
  { value: "EXPIRED", label: "Expired" },
  { value: "ADJUSTMENT", label: "Adjustments" },
];

export interface PointsFilterState {
  type: "ALL" | PointsTransactionType;
  dateFrom: string;
  dateTo: string;
  sort: "newest" | "oldest";
}

interface PointsFilterBarProps {
  state: PointsFilterState;
  onChange: (state: PointsFilterState) => void;
}

export function PointsFilterBar({ state, onChange }: PointsFilterBarProps) {
  return (
    <div className="sticky top-0 z-10 -mx-4 border-b border-hertz-border bg-white/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 md:py-4">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        {/* Type filter */}
        <div className="flex flex-wrap gap-2">
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ...state, type: opt.value })}
              className={`min-h-tap rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                state.type === opt.value
                  ? "border-hertz-yellow bg-hertz-yellow/20 text-black"
                  : "border-hertz-border bg-white text-hertz-black-80 hover:bg-hertz-gray"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Date range */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={state.dateFrom}
            onChange={(e) =>
              onChange({ ...state, dateFrom: e.target.value || "" })
            }
            className="min-h-tap rounded-lg border border-hertz-border px-3 py-1.5 text-sm"
            aria-label="From date"
          />
          <span className="text-sm text-hertz-black-60">–</span>
          <input
            type="date"
            value={state.dateTo}
            onChange={(e) =>
              onChange({ ...state, dateTo: e.target.value || "" })
            }
            className="min-h-tap rounded-lg border border-hertz-border px-3 py-1.5 text-sm"
            aria-label="To date"
          />
        </div>

        {/* Sort */}
        <select
          value={state.sort}
          onChange={(e) =>
            onChange({
              ...state,
              sort: e.target.value as "newest" | "oldest",
            })
          }
          className="min-h-tap rounded-lg border border-hertz-border bg-white px-3 py-1.5 text-sm font-medium text-hertz-black-80"
          aria-label="Sort order"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>
    </div>
  );
}
