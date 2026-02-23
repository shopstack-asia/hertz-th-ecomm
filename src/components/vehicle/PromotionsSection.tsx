"use client";

import { useState } from "react";
import { MyVouchersModal } from "./MyVouchersModal";
import { VOUCHER_TYPE_LABELS } from "@/types/voucher";
import type { PointsRedemptionOption } from "@/types/loyalty";

/** Applied voucher at checkout (from apply API or My Vouchers). */
export interface VoucherDetail {
  name: string;
  code: string;
  type: string;
  value?: number;
  benefit?: string;
  expired_at: string;
  stackable: boolean;
}

/** Shape sent to price API */
export interface VoucherInput {
  code: string;
  type: string;
  value?: number;
  benefit?: string;
}

function voucherDisplayLine(v: VoucherDetail): string {
  if (v.benefit) return v.benefit;
  if (v.type?.toUpperCase() === "FIXED" && v.value != null)
    return `${v.value} THB`;
  if (v.type?.toUpperCase() === "PERCENT" && v.value != null) return `${v.value}%`;
  return v.name;
}

function benefitBadge(type: string): string | null {
  const t = type?.toUpperCase();
  return (VOUCHER_TYPE_LABELS as Record<string, string>)[t] ?? null;
}

export interface PointsRedemptionSelection {
  id: string;
  type: string;
  label: string;
  discount_amount: number;
  addon_key?: string;
}

interface PromotionsSectionProps {
  appliedPromoCode: string | null;
  promoCodeError: string | null;
  appliedVouchers: VoucherDetail[];
  onPromoCodeApply: (code: string) => void;
  onPromoCodeRemove: () => void;
  onVoucherAdd: (code: string) => Promise<void>;
  onVoucherRemove: (index: number) => void;
  onApplyMyVouchers?: (vouchers: VoucherDetail[]) => void;
  voucherError?: string | null;
  hasProductPromo?: boolean;
  /** When true, show "My Vouchers" button and allow wallet selection */
  authenticated?: boolean;
  rentalDays?: number;
  /** Use Points section - hide when availablePoints is 0 or undefined */
  availablePoints?: number;
  pointsRedemptionOptions?: PointsRedemptionOption[];
  selectedPointsRedemption?: PointsRedemptionSelection | null;
  onPointsRedemptionChange?: (option: PointsRedemptionSelection | null) => void;
}

function formatExpired(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function PromotionsSection({
  appliedPromoCode,
  promoCodeError,
  appliedVouchers,
  onPromoCodeApply,
  onPromoCodeRemove,
  onVoucherAdd,
  onVoucherRemove,
  onApplyMyVouchers,
  voucherError = null,
  hasProductPromo,
  authenticated = false,
  rentalDays = 1,
  availablePoints = 0,
  pointsRedemptionOptions = [],
  selectedPointsRedemption = null,
  onPointsRedemptionChange,
}: PromotionsSectionProps) {
  const [promoInput, setPromoInput] = useState(appliedPromoCode ?? "");
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherAdding, setVoucherAdding] = useState(false);
  const [myVouchersOpen, setMyVouchersOpen] = useState(false);

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code) onPromoCodeApply(code);
  };

  const handleAddVoucher = async () => {
    const code = voucherCode.trim();
    if (!code) return;
    setVoucherAdding(true);
    try {
      await onVoucherAdd(code);
      setVoucherCode("");
    } finally {
      setVoucherAdding(false);
    }
  };

  return (
    <section className="border border-hertz-border bg-white p-6">
      <h2 className="text-lg font-bold text-black">Promotions &amp; discounts</h2>

      {hasProductPromo && (
        <div className="mt-4 flex items-center gap-2 border border-[#FFCC00] bg-[#FFCC00]/10 px-3 py-2">
          <span className="text-sm font-medium text-black">
            Long rental discount -20% applied
          </span>
        </div>
      )}

      <div className="mt-4">
        <label className="text-sm font-medium text-hertz-black-80">
          Promotion code
        </label>
        {appliedPromoCode && !promoCodeError ? (
          <div className="mt-2 flex items-center justify-between border border-hertz-border bg-hertz-gray px-3 py-2">
            <span className="text-sm font-medium text-green-700">
              Promo code {appliedPromoCode} applied
            </span>
            <button
              type="button"
              onClick={() => {
                setPromoInput("");
                onPromoCodeRemove();
              }}
              className="text-sm font-medium text-hertz-black-80 hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              placeholder="Enter code"
              className="min-h-tap flex-1 border border-hertz-border px-4 py-3 text-hertz-black-80 focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/30"
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              disabled={!promoInput.trim()}
              className="min-h-tap border-2 border-black bg-white px-6 font-bold text-black disabled:opacity-50"
            >
              Apply
            </button>
          </div>
        )}
        {promoCodeError && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {promoCodeError}
          </p>
        )}
        <p className="mt-1 text-xs text-hertz-black-60">
          Try SAVE10, HERTZ10, SAVE15, WELCOME20
        </p>
      </div>

      <div className="mt-6">
        <label className="text-sm font-medium text-hertz-black-80">
          Vouchers
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          <input
            type="text"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            placeholder="Voucher code"
            className="min-h-tap flex-1 min-w-[120px] border border-hertz-border px-4 py-3 text-hertz-black-80 focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/30"
          />
          <button
            type="button"
            onClick={handleAddVoucher}
            disabled={!voucherCode.trim() || voucherAdding}
            className="min-h-tap border border-hertz-border bg-white px-4 font-medium text-black hover:bg-hertz-gray disabled:opacity-50"
          >
            {voucherAdding ? "Adding…" : "Add"}
          </button>
          {authenticated && onApplyMyVouchers && (
            <button
              type="button"
              onClick={() => setMyVouchersOpen(true)}
              className="min-h-tap border-2 border-black bg-white px-4 font-bold text-black hover:bg-hertz-gray"
            >
              My Vouchers
            </button>
          )}
        </div>
        <MyVouchersModal
          open={myVouchersOpen}
          onClose={() => setMyVouchersOpen(false)}
          rentalDays={rentalDays}
          appliedCodes={appliedVouchers.map((v) => v.code)}
          onApplySelected={onApplyMyVouchers ?? (() => {})}
        />
        {voucherError && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {voucherError}
          </p>
        )}
        {appliedVouchers.length > 0 && (
          <ul className="mt-3 space-y-2">
            {appliedVouchers.map((v, i) => {
              const badge = benefitBadge(v.type);
              return (
                <li
                  key={`${v.code}-${i}`}
                  className="flex items-center justify-between border border-hertz-border bg-hertz-gray px-3 py-2"
                >
                  <div className="text-sm">
                    {badge && (
                      <span className="mr-2 inline-block bg-[#FFCC00] px-1.5 py-0.5 text-xs font-bold text-black">
                        {badge}
                      </span>
                    )}
                    <span className="font-medium">{v.name}</span>
                    <span className="text-hertz-black-80"> ({v.code})</span>
                    <span className="text-hertz-black-80">
                      {" "}
                      — {voucherDisplayLine(v)}
                    </span>
                    <span className="ml-1 text-hertz-black-60">
                      · Expires {formatExpired(v.expired_at)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onVoucherRemove(i)}
                    className="min-h-tap min-w-tap px-2 text-sm font-medium text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {availablePoints > 0 && onPointsRedemptionChange && (
        <div className="mt-6">
          <label className="text-sm font-medium text-hertz-black-80">
            Use Points
          </label>
          <p className="mt-1 text-xs text-hertz-black-60">
            You have {availablePoints.toLocaleString()} points available
          </p>
          <select
            value={selectedPointsRedemption?.id ?? ""}
            onChange={(e) => {
              const id = e.target.value;
              if (!id) {
                onPointsRedemptionChange(null);
                return;
              }
              const opt = pointsRedemptionOptions.find((o) => o.id === id);
              if (opt && opt.points_required <= availablePoints) {
                onPointsRedemptionChange({
                  id: opt.id,
                  type: opt.type,
                  label: opt.label,
                  discount_amount: opt.discount_amount ?? 0,
                  addon_key: opt.addon_key,
                });
              } else {
                onPointsRedemptionChange(null);
              }
            }}
            className="mt-2 min-h-tap w-full border border-hertz-border bg-white px-4 py-3 text-hertz-black-80 focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/30"
          >
            <option value="">Select redemption</option>
            {pointsRedemptionOptions.map((opt) => {
              const hasEnough = opt.points_required <= availablePoints;
              return (
                <option
                  key={opt.id}
                  value={opt.id}
                  disabled={!hasEnough}
                >
                  {hasEnough ? opt.label : `${opt.label} — Not enough points`}
                </option>
              );
            })}
          </select>
          {selectedPointsRedemption && (
            <button
              type="button"
              onClick={() => onPointsRedemptionChange(null)}
              className="mt-2 text-sm font-medium text-hertz-black-80 hover:underline"
            >
              Remove points redemption
            </button>
          )}
        </div>
      )}
    </section>
  );
}
