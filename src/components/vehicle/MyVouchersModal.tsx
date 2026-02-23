"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { MyVoucher } from "@/app/api/vouchers/my/route";
import type { VoucherDetail } from "./PromotionsSection";
import { VOUCHER_TYPE_LABELS, isBenefitType } from "@/types/voucher";
import { useAuth } from "@/contexts/auth_context";

interface MyVouchersModalProps {
  open: boolean;
  onClose: () => void;
  rentalDays: number;
  appliedCodes: string[];
  onApplySelected: (vouchers: VoucherDetail[]) => void;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function valueOrBenefitLabel(v: MyVoucher): string {
  if (v.benefit) return v.benefit;
  if (v.type === "FIXED" && v.value != null) return `${v.value} THB`;
  if (v.type === "PERCENT" && v.value != null) return `${v.value}%`;
  return v.description;
}

/** Convert API voucher to checkout VoucherDetail */
function toVoucherDetail(v: MyVoucher): VoucherDetail {
  return {
    name: v.description,
    code: v.code,
    type: v.type,
    value: v.value,
    benefit: v.benefit,
    expired_at: `${v.expiry_date}T23:59:59`,
    stackable: v.stackable ?? true,
  };
}

export function MyVouchersModal({
  open,
  onClose,
  rentalDays,
  appliedCodes,
  onApplySelected,
}: MyVouchersModalProps) {
  const { authenticated, loading: authLoading, refreshAuth } = useAuth();
  const authenticatedRef = useRef(authenticated);
  authenticatedRef.current = authenticated;

  const [vouchers, setVouchers] = useState<MyVoucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const fetchVouchers = useCallback(async (isRetry = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/vouchers/my", { credentials: "include" });
      if (res.status === 401) {
        const isLoggedIn = authenticatedRef.current;
        if (isLoggedIn && !isRetry) {
          await refreshAuth();
          return fetchVouchers(true);
        }
        setError(
          isLoggedIn
            ? "Session expired. Please log in again."
            : "Please log in to view your vouchers."
        );
        setVouchers([]);
        return;
      }
      if (!res.ok) {
        setError("Failed to load vouchers.");
        setVouchers([]);
        return;
      }
      const data = await res.json();
      setVouchers(Array.isArray(data.vouchers) ? data.vouchers : []);
      setSelectedIds(new Set());
    } catch {
      setError("Failed to load vouchers.");
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  }, [refreshAuth]);

  useEffect(() => {
    if (!open) return;
    // รอให้ auth โหลดเสร็จก่อน (เช่น หลังล็อกอิน refreshAuth ยังไม่จบ)
    if (authLoading) {
      setError(null);
      setLoading(true);
      setVouchers([]);
      return;
    }
    if (!authenticated) {
      setError("Please log in to view your vouchers.");
      setLoading(false);
      setVouchers([]);
      return;
    }
    fetchVouchers();
  }, [open, authenticated, authLoading, fetchVouchers]);

  const selectable = vouchers.filter(
    (v) => v.status === "ACTIVE" && !appliedCodes.includes(v.code)
  );
  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const selectedCount = selectable.filter((v) => selectedIds.has(v.id)).length;

  const handleApply = () => {
    const selected = selectable.filter((v) => selectedIds.has(v.id));
    if (selected.length === 0) return;
    onApplySelected(selected.map(toVoucherDetail));
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 border border-hertz-border bg-white shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="my-vouchers-title"
      >
        <div className="flex flex-col max-h-[85vh]">
          <div className="border-b border-hertz-border px-6 py-4">
            <h2 id="my-vouchers-title" className="text-lg font-bold text-black">
              Select Your Vouchers
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {(loading || authLoading) && (
              <p className="text-sm text-hertz-black-60">
                {authLoading ? "Loading…" : "Loading vouchers…"}
              </p>
            )}
            {!authLoading && error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            {!authLoading && !loading && !error && vouchers.length === 0 && (
              <p className="text-sm text-hertz-black-60">No vouchers in your wallet.</p>
            )}
            {!authLoading && !loading && !error && vouchers.length > 0 && (
              <ul className="space-y-2">
                {vouchers.map((v) => {
                  const isActive = v.status === "ACTIVE";
                  const alreadyApplied = appliedCodes.includes(v.code);
                  const canSelect = isActive && !alreadyApplied;
                  const isSelected = selectedIds.has(v.id);
                  const meetsMinDays = rentalDays >= v.minimum_days;
                  const disabled = !canSelect || (canSelect && !meetsMinDays);

                  return (
                    <li key={v.id}>
                      <label
                        className={`flex cursor-pointer items-start gap-3 border px-4 py-3 ${
                          disabled
                            ? "cursor-not-allowed border-hertz-border bg-hertz-gray opacity-70"
                            : isSelected
                              ? "border-2 border-black bg-[#FFCC00]/15"
                              : "border-hertz-border bg-white hover:border-black/50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => canSelect && meetsMinDays && toggle(v.id)}
                          disabled={disabled}
                          className="mt-1 h-4 w-4 border-hertz-border text-black focus:ring-[#FFCC00]"
                        />
                        <div className="min-w-0 flex-1 text-sm">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium text-black">{v.code}</span>
                            {isBenefitType(v.type) && (
                              <span className="inline-block bg-[#FFCC00] px-1.5 py-0.5 text-xs font-bold text-black">
                                {(VOUCHER_TYPE_LABELS as Record<string, string>)[v.type] ?? v.type}
                              </span>
                            )}
                          </div>
                          <div className="text-hertz-black-80">{v.description}</div>
                          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-hertz-black-60">
                            <span>{valueOrBenefitLabel(v)}</span>
                            <span>Expires {formatDate(v.expiry_date)}</span>
                            <span>Min. {v.minimum_days} day{v.minimum_days !== 1 ? "s" : ""}</span>
                          </div>
                          <div className="mt-1">
                            <span
                              className={`inline text-xs font-medium ${
                                v.status === "ACTIVE"
                                  ? "text-green-700"
                                  : v.status === "USED"
                                    ? "text-hertz-black-60"
                                    : "text-red-600"
                              }`}
                            >
                              {v.status}
                            </span>
                            {canSelect && !meetsMinDays && (
                              <span className="ml-2 text-xs text-amber-700">
                                Requires {v.minimum_days}+ days
                              </span>
                            )}
                            {alreadyApplied && (
                              <span className="ml-2 text-xs text-hertz-black-60">
                                Already applied
                              </span>
                            )}
                          </div>
                        </div>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t border-hertz-border px-6 py-4">
            <span className="mr-auto self-center text-sm text-hertz-black-60">
              {selectedCount > 0 ? `${selectedCount} selected` : ""}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="min-h-tap border border-hertz-border bg-white px-5 font-medium text-black hover:bg-hertz-gray"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={selectedCount === 0}
              className="min-h-tap border-2 border-black bg-black px-5 font-bold text-white disabled:border-hertz-border disabled:bg-hertz-gray disabled:text-hertz-black-60"
            >
              Apply Selected
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
