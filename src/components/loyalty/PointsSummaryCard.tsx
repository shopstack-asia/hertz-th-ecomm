"use client";

import type { LoyaltySummary } from "@/types/loyalty";

const TIER_LABELS: Record<string, string> = {
  SILVER: "Silver",
  GOLD: "Gold",
  PLATINUM: "Platinum",
};

export function PointsSummaryCard({ data }: { data: LoyaltySummary }) {
  const tierLabel = TIER_LABELS[data.tier] ?? data.tier;
  const nextTierLabel = data.next_tier
    ? TIER_LABELS[data.next_tier] ?? data.next_tier
    : null;
  const progress =
    data.next_tier_threshold > 0
      ? Math.min(100, (data.available_points / data.next_tier_threshold) * 100)
      : 100;
  const expiryFormatted =
    data.expiring_date &&
    (() => {
      try {
        return new Date(data.expiring_date).toLocaleDateString(undefined, {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      } catch {
        return data.expiring_date;
      }
    })();

  return (
    <div className="rounded-2xl border-2 border-hertz-yellow/40 bg-white p-6 shadow-md md:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-hertz-black-60">
            Available points
          </p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-black">
            {data.available_points.toLocaleString()}
          </p>
          {data.expiring_points > 0 && data.expiring_date && (
            <>
              <p className="mt-4 text-sm font-medium text-hertz-black-80">
                Points expiring soon:{" "}
                <span className="font-semibold">
                  {data.expiring_points.toLocaleString()}
                </span>
              </p>
              <p className="text-xs text-hertz-black-60">
                Expiry date: {expiryFormatted}
              </p>
            </>
          )}
          {data.expiring_points === 0 && (
            <p className="mt-4 text-sm text-hertz-black-60">
              No points expiring in next 90 days
            </p>
          )}
        </div>
        <div className="shrink-0 md:text-right">
          <p className="text-sm font-medium uppercase tracking-wide text-hertz-black-60">
            Tier
          </p>
          <p className="mt-1 text-lg font-bold text-black">
            {tierLabel} Member
          </p>
          {nextTierLabel && (
            <>
              <p className="mt-3 text-sm text-hertz-black-80">
                Progress to {nextTierLabel}:{" "}
                {data.available_points.toLocaleString()} /{" "}
                {data.next_tier_threshold.toLocaleString()}
              </p>
              <div className="mt-2 h-2 w-full min-w-[160px] overflow-hidden rounded-full bg-hertz-gray/80 md:ml-auto md:w-48">
                <div
                  className="h-full rounded-full bg-hertz-yellow transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
