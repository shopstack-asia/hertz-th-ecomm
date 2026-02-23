"use client";

import type { PointsTransaction, PointsTransactionType } from "@/types/loyalty";

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

const TYPE_STYLES: Record<
  PointsTransactionType,
  { label: string; className: string }
> = {
  EARN: { label: "Earn", className: "bg-emerald-100 text-emerald-800" },
  REDEEM: { label: "Redeem", className: "bg-amber-100 text-amber-900" },
  EXPIRED: { label: "Expired", className: "bg-red-100 text-red-800" },
  ADJUSTMENT: {
    label: "Adjustment",
    className: "bg-gray-200 text-gray-800",
  },
};

function TypeBadge({ type }: { type: PointsTransactionType }) {
  const style = TYPE_STYLES[type] ?? {
    label: type,
    className: "bg-hertz-gray text-hertz-black-80",
  };
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-semibold uppercase ${style.className}`}
    >
      {style.label}
    </span>
  );
}

export function PointActivityTable({
  transactions,
}: {
  transactions: PointsTransaction[];
}) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-hertz-border bg-white py-16 text-center">
        <p className="text-hertz-black-60">No point activity found.</p>
        <p className="mt-1 text-sm text-hertz-black-60">
          Try adjusting filters or date range.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-hertz-border bg-white">
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-hertz-border bg-hertz-gray/50">
              <th className="px-4 py-3 font-semibold text-hertz-black-80">
                Date
              </th>
              <th className="px-4 py-3 font-semibold text-hertz-black-80">
                Type
              </th>
              <th className="px-4 py-3 font-semibold text-hertz-black-80">
                Description
              </th>
              <th className="px-4 py-3 font-semibold text-hertz-black-80">
                Booking ref.
              </th>
              <th className="px-4 py-3 text-right font-semibold text-hertz-black-80">
                Points
              </th>
              <th className="px-4 py-3 text-right font-semibold text-hertz-black-80">
                Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr
                key={t.id}
                className="border-b border-hertz-border/80 last:border-0 hover:bg-hertz-gray/30"
              >
                <td className="whitespace-nowrap px-4 py-3 text-hertz-black-80">
                  {formatDate(t.date)}
                </td>
                <td className="px-4 py-3">
                  <TypeBadge type={t.type} />
                </td>
                <td className="max-w-[200px] px-4 py-3 text-hertz-black-80">
                  {t.description}
                  {t.admin_note && (
                    <span className="mt-1 block text-xs text-hertz-black-60">
                      {t.admin_note}
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-hertz-black-60">
                  {t.booking_ref ?? "–"}
                </td>
                <td
                  className={`whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums ${
                    t.points >= 0 ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {t.points >= 0 ? "+" : ""}
                  {t.points.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-hertz-black-80">
                  {t.balance_after.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="border-b border-hertz-border/80 px-4 py-4 last:border-0"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm text-hertz-black-60">
                {formatDate(t.date)}
              </span>
              <TypeBadge type={t.type} />
            </div>
            <p className="mt-1 font-medium text-hertz-black-90">
              {t.description}
            </p>
            {t.booking_ref && (
              <p className="text-xs text-hertz-black-60">
                Ref: {t.booking_ref}
              </p>
            )}
            {t.admin_note && (
              <p className="mt-0.5 text-xs text-hertz-black-60">
                {t.admin_note}
              </p>
            )}
            <div className="mt-2 flex justify-between text-sm">
              <span
                className={
                  t.points >= 0 ? "font-medium text-emerald-700" : "font-medium text-red-700"
                }
              >
                {t.points >= 0 ? "+" : ""}
                {t.points.toLocaleString()} pts
              </span>
              <span className="text-hertz-black-60">
                Balance: {t.balance_after.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
