"use client";

import { useState } from "react";
import type { BreakdownLine } from "@/app/api/checkout/price/route";

interface LineItem {
  description: string;
  amount: number;
}

interface Breakdown {
  rental: BreakdownLine;
  addons: BreakdownLine[];
  subtotal: number;
  voucher_lines: BreakdownLine[];
  points_line?: BreakdownLine;
  campaign_line?: BreakdownLine;
  vat: BreakdownLine;
  total: number;
}

interface CheckoutPricePanelProps {
  lineItems: LineItem[];
  payLaterTotal: number;
  payNowTotal: number;
  currency: string;
  onPayLater: () => void;
  onPayNow: () => void;
  isValid: boolean;
  loading?: boolean;
  className?: string;
  breakdown?: Breakdown;
  appliedVouchers?: { code: string; label: string; amount: number }[];
  appliedCampaign?: { label: string; amount: number };
  pointsUsed?: { id: string; label: string; amount: number };
  benefitVouchersApplied?: boolean;
}

function AnimatedAmount({ amount, className = "" }: { amount: number; className?: string }) {
  const isNegative = amount < 0;
  const abs = Math.abs(amount);
  return (
    <span
      className={`tabular-nums transition-all duration-300 ${className}`}
      key={abs}
    >
      {isNegative ? "-" : ""}฿{abs.toLocaleString()}
    </span>
  );
}

export function CheckoutPricePanel({
  lineItems,
  payLaterTotal,
  payNowTotal,
  currency,
  onPayLater,
  onPayNow,
  isValid,
  loading = false,
  className = "",
  breakdown,
  appliedVouchers,
  appliedCampaign,
  pointsUsed,
  benefitVouchersApplied,
}: CheckoutPricePanelProps) {
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const disabled = !isValid || loading;

  const hasBreakdown = breakdown && (breakdown.addons.length > 0 || breakdown.voucher_lines.length > 0 || breakdown.points_line || breakdown.campaign_line);

  return (
    <div
      className={`border border-hertz-border bg-white p-6 transition-opacity duration-300 ${
        loading ? "opacity-70" : "opacity-100"
      } ${className}`}
    >
      <h3 className="text-lg font-bold text-black">Price summary</h3>

      {hasBreakdown ? (
        <>
          <div className="mt-4 space-y-2 border-b border-hertz-border pb-4">
            <div className="flex justify-between text-sm">
              <span className="text-hertz-black-80">{breakdown.rental.description}</span>
              <AnimatedAmount
                amount={breakdown.rental.amount}
                className="font-medium text-black"
              />
            </div>
            {breakdown.addons.map((a, i) => (
              <div key={a.key ?? i} className="flex justify-between text-sm">
                <span className="text-hertz-black-80">{a.description}</span>
                <AnimatedAmount amount={a.amount} className="font-medium text-black" />
              </div>
            ))}
            <div className="flex justify-between border-t border-hertz-border pt-2 text-sm">
              <span className="text-hertz-black-80">Subtotal</span>
              <AnimatedAmount amount={breakdown.subtotal} className="font-medium text-black" />
            </div>
            {breakdown.voucher_lines.map((v, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-hertz-black-80">{v.description}</span>
                <AnimatedAmount amount={v.amount} className="font-medium text-green-700" />
              </div>
            ))}
            {breakdown.points_line && (
              <div className="flex justify-between text-sm">
                <span className="text-hertz-black-80">{breakdown.points_line.description}</span>
                <AnimatedAmount amount={breakdown.points_line.amount} className="font-medium text-green-700" />
              </div>
            )}
            {breakdown.campaign_line && (
              <div className="flex justify-between text-sm">
                <span className="text-hertz-black-80">{breakdown.campaign_line.description}</span>
                <AnimatedAmount
                  amount={breakdown.campaign_line.amount}
                  className="font-medium text-green-700"
                />
              </div>
            )}
            <div className="flex justify-between border-t border-hertz-border pt-2 text-sm">
              <span className="text-hertz-black-80">{breakdown.vat.description}</span>
              <AnimatedAmount amount={breakdown.vat.amount} className="font-medium text-black" />
            </div>
            <div className="flex justify-between border-t border-hertz-border pt-2 text-sm font-bold">
              <span className="text-black">Total</span>
              <AnimatedAmount amount={breakdown.total} className="text-black" />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setBreakdownOpen((o) => !o)}
            className="mt-2 flex w-full items-center justify-between text-sm font-medium text-hertz-black-80 hover:text-black"
          >
            {breakdownOpen ? "Hide breakdown" : "Show full breakdown"}
            <span className="transition-transform duration-200">{breakdownOpen ? "−" : "+"}</span>
          </button>
          {breakdownOpen && (
            <dl className="mt-2 space-y-1 border-t border-hertz-border pt-2 text-xs text-hertz-black-60">
              {lineItems.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <dt>{item.description}</dt>
                  <dd className={item.amount < 0 ? "text-green-700" : ""}>
                    {item.amount < 0 ? "-" : ""}฿{Math.abs(item.amount).toLocaleString()}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </>
      ) : (
        <dl className="mt-4 space-y-2 border-b border-hertz-border pb-4">
          {lineItems.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <dt className="text-hertz-black-80">{item.description}</dt>
              <dd
                className={`font-medium transition-all duration-300 ${
                  item.amount < 0 ? "text-green-700" : "text-black"
                }`}
              >
                <AnimatedAmount amount={item.amount} />
              </dd>
            </div>
          ))}
        </dl>
      )}

      {benefitVouchersApplied && (
        <div className="mb-3 flex items-center gap-2 border border-[#FFCC00] bg-[#FFCC00]/10 px-3 py-2">
          <span className="text-sm font-medium text-black">Benefit voucher(s) applied</span>
        </div>
      )}
      {appliedVouchers && appliedVouchers.length > 0 && (
        <div className="mb-2 space-y-1 text-xs text-hertz-black-80">
          {appliedVouchers.map((v) => (
            <div key={v.code}>
              Voucher: {v.label} — -฿{v.amount.toLocaleString()}
            </div>
          ))}
        </div>
      )}
      {appliedCampaign && appliedCampaign.amount > 0 && (
        <div className="mb-2 text-xs text-hertz-black-80">
          Campaign: {appliedCampaign.label} — -฿{appliedCampaign.amount.toLocaleString()}
        </div>
      )}
      {pointsUsed && pointsUsed.amount > 0 && (
        <div className="mb-2 text-xs text-hertz-black-80">
          Points: {pointsUsed.label} — -฿{pointsUsed.amount.toLocaleString()}
        </div>
      )}

      <div className="flex flex-col gap-3 pt-4">
        <button
          type="button"
          onClick={onPayLater}
          disabled={disabled}
          className="flex h-12 w-full items-center justify-center border-2 border-black bg-white font-bold text-black transition-all duration-200 hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
        >
          Pay later — <AnimatedAmount amount={payLaterTotal} className="ml-1" />
        </button>
        <button
          type="button"
          onClick={onPayNow}
          disabled={disabled}
          className="flex h-12 w-full items-center justify-center bg-[#FFCC00] font-bold text-black transition-all duration-200 hover:bg-[#FFCC00]/90 disabled:pointer-events-none disabled:opacity-50"
        >
          Pay now — <AnimatedAmount amount={payNowTotal} className="ml-1" />
        </button>
      </div>
    </div>
  );
}
