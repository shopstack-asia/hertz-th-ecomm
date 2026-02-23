"use client";

import type { LoyaltyProfile } from "@/types/account";

const TIER_STYLES: Record<
  string,
  { border: string; accent: string; label: string; badgeBg: string }
> = {
  SILVER: {
    border: "border-gray-300",
    accent: "text-gray-700",
    label: "Silver",
    badgeBg: "bg-gray-200 border-gray-400",
  },
  GOLD: {
    border: "border-amber-300",
    accent: "text-amber-900",
    label: "Gold",
    badgeBg: "bg-amber-100 border-amber-400",
  },
  PLATINUM: {
    border: "border-slate-600",
    accent: "text-slate-800",
    label: "Platinum",
    badgeBg: "bg-slate-200 border-slate-600",
  },
};

function formatTHB(amount: number): string {
  return `฿${amount.toLocaleString("th-TH")}`;
}

function formatQualificationPeriod(start: string, end: string): string {
  try {
    const s = new Date(start).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const e = new Date(end).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${s} – ${e}`;
  } catch {
    return `${start} – ${end}`;
  }
}

function TierBadge({
  tier,
  size = "default",
}: {
  tier: string;
  size?: "default" | "header";
}) {
  const style = TIER_STYLES[tier] ?? TIER_STYLES.SILVER;
  const icon =
    tier === "PLATINUM" ? "◆" : tier === "GOLD" ? "★" : "●";
  const sizeClass =
    size === "header" ? "h-12 w-12 text-xl" : "h-14 w-14 text-2xl";
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border-2 font-bold shadow-sm ${style.badgeBg} ${style.accent} ${sizeClass} transition-transform duration-200 hover:scale-105`}
      aria-hidden
    >
      {icon}
    </span>
  );
}

export function LoyaltyCard({
  data,
  variant = "card",
}: {
  data: LoyaltyProfile;
  variant?: "card" | "header";
}) {
  const style = TIER_STYLES[data.tier] ?? TIER_STYLES.SILVER;
  const current = data.annual_spending;
  const next = data.next_tier_spending_threshold;
  const progress = next > 0 ? Math.min(100, (current / next) * 100) : 100;
  const nextTierLabel = data.next_tier
    ? (TIER_STYLES[data.next_tier]?.label ?? data.next_tier)
    : null;
  const qualificationPeriod = formatQualificationPeriod(
    data.qualification_start,
    data.qualification_end
  );

  if (variant === "header") {
    return (
      <div
        className="rounded-2xl border border-hertz-border/60 bg-white shadow-sm"
        style={{
          borderTopWidth: "3px",
          borderTopColor: "var(--hertz-yellow, #facc15)",
          background:
            "linear-gradient(180deg, #fffbeb 0%, #fefce8 50%, #ffffff 100%)",
        }}
      >
        <div className="p-8">
          {/* Row 1: Tier badge + name (left) | Total Spending (right) */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <TierBadge tier={data.tier} size="header" />
              <h2
                className={`text-base font-bold uppercase tracking-wide ${style.accent}`}
              >
                Hertz {style.label} Member
              </h2>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold tabular-nums text-black">
                {formatTHB(data.annual_spending)}
              </p>
              <p className="mt-0.5 text-sm font-medium text-hertz-black-60">
                Total Spending
              </p>
            </div>
          </div>
          {/* Next tier */}
          {data.next_tier && nextTierLabel && next > current && (
            <p className="mt-4 text-sm font-medium text-hertz-black-80">
              Next Tier: {nextTierLabel} at{" "}
              {formatTHB(data.next_tier_spending_threshold)} annual spending
            </p>
          )}
          {/* Progress bar */}
          {data.next_tier && next > current && (
            <div className="mt-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-hertz-gray/80">
                <div
                  className="h-full rounded-full bg-hertz-yellow transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
          {/* Qualification period */}
          <p className="mt-4 text-xs text-hertz-black-60">
            Qualification period: {qualificationPeriod}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border-2 ${style.border} p-6 shadow-md transition-shadow duration-200 hover:shadow-lg`}
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #fefce8 100%)",
      }}
    >
      <div className="flex items-start gap-4">
        <TierBadge tier={data.tier} />
        <div className="min-w-0 flex-1">
          <h2
            className={`text-base font-bold uppercase tracking-wide ${style.accent}`}
          >
            Hertz {style.label} Member
          </h2>
          <p className="mt-2 text-3xl font-bold tabular-nums text-black">
            {formatTHB(data.annual_spending)}
          </p>
          <p className="mt-0.5 text-xs font-medium text-hertz-black-60">
            Total Spending
          </p>
          {data.next_tier && nextTierLabel && next > current && (
            <p className="mt-3 text-sm text-hertz-black-80">
              Next Tier: {nextTierLabel} at{" "}
              {formatTHB(data.next_tier_spending_threshold)} annual spending
            </p>
          )}
          {data.next_tier && next > current && (
            <div className="mt-3">
              <div className="h-2 w-full overflow-hidden rounded-full bg-hertz-gray/80">
                <div
                  className="h-full rounded-full bg-hertz-yellow transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
          <p className="mt-4 text-xs text-hertz-black-60">
            Qualification period: {qualificationPeriod}
          </p>
        </div>
      </div>
    </div>
  );
}
