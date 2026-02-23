"use client";

function daysUntil(dateStr: string): number {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
}

export function ExpiringPointsAlert({
  expiringPoints,
  expiringDate,
}: {
  expiringPoints: number;
  expiringDate: string | null;
}) {
  if (expiringPoints <= 0 || !expiringDate) return null;

  const days = daysUntil(expiringDate);
  const isUrgent = days < 30;

  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-4 py-3 ${
        isUrgent
          ? "border-red-300 bg-red-50 text-red-800"
          : "border-amber-200 bg-amber-50/80 text-amber-900"
      }`}
      role="alert"
    >
      <span className="text-lg" aria-hidden>
        ⚠
      </span>
      <p className="text-sm font-medium">
        {expiringPoints.toLocaleString()} points will expire in {days} day
        {days !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
