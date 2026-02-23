import { NextRequest } from "next/server";
import { getBasePrices } from "@/lib/mock/searchVehicles";
import { basePrices } from "@/lib/mock/data";

interface VoucherInput {
  code: string;
  type: string;
  value?: number;
  benefit?: string;
}

interface PriceRequest {
  vehicle_id: string;
  rental_days: number;
  promotion_code?: string;
  vouchers?: VoucherInput[];
  addon_ids?: string[];
  campaign?: { type: "percent_off_rental" | "percent_off_total" | "free_insurance"; value?: number; label?: string };
}

interface DiscountItem {
  description: string;
  amount: number;
}

export interface BreakdownLine {
  description: string;
  amount: number;
  key?: string;
}

interface PriceResponse {
  base_price: number;
  addons_total: number;
  subtotal_before_discounts: number;
  discounts: DiscountItem[];
  vat_rate: number;
  vat_amount: number;
  pay_later_total: number;
  pay_now_total: number;
  line_items: { description: string; amount: number }[];
  breakdown?: {
    rental: BreakdownLine;
    addons: BreakdownLine[];
    subtotal: number;
    voucher_lines: BreakdownLine[];
    campaign_line?: BreakdownLine;
    vat: BreakdownLine;
    total: number;
  };
  currency: string;
  rental_days: number;
  product_promo?: { label: string; amount: number };
  promo_code?: { code: string; amount: number };
  voucher_discounts: { code: string; amount: number }[];
  applied_vouchers?: { code: string; label: string; amount: number }[];
  applied_campaign?: { label: string; amount: number };
  benefit_vouchers_applied?: boolean;
  promo_code_error?: string;
}

/** Add-on id -> daily or flat price (match /api/addons) */
const ADDON_PRICES: Record<string, { type: "daily" | "flat"; price: number; name: string }> = {
  child_seat: { type: "daily", price: 200, name: "Child Seat" },
  gps: { type: "daily", price: 150, name: "GPS" },
  easy_pass: { type: "flat", price: 100, name: "Easy Pass" },
  additional_driver: { type: "flat", price: 300, name: "Additional Driver" },
  premium_insurance: { type: "daily", price: 400, name: "Premium Insurance" },
  zero_excess: { type: "daily", price: 600, name: "Zero Excess" },
  wifi_router: { type: "daily", price: 250, name: "WiFi Router" },
  snow_chains: { type: "daily", price: 350, name: "Snow Chains" },
  drop_fee: { type: "flat", price: 500, name: "Drop Fee" },
};

const VOUCHER_TYPE_TO_ADDON: Record<string, string> = {
  FREE_ADDON: "child_seat",
  FREE_GPS: "gps",
  FREE_ADDITIONAL_DRIVER: "additional_driver",
  FREE_INSURANCE: "premium_insurance",
  FREE_DROP_FEE: "drop_fee",
};

function getBaseRates(vehicleId: string): { payLater: number; payNow: number } {
  const base =
    basePrices[vehicleId] ?? getBasePrices(vehicleId) ?? { payLater: 1500, payNow: 1350 };
  return base;
}

const PROMO_CODES: Record<string, number> = {
  SAVE10: 0.1,
  HERTZ10: 0.1,
  SAVE15: 0.15,
  WELCOME20: 0.2,
};

const BENEFIT_SAVINGS: Record<string, { label: string; amount: number }> = {
  FREE_ADDON: { label: "Child Seat (Voucher)", amount: 200 },
  FREE_GPS: { label: "GPS (Voucher)", amount: 150 },
  FREE_ADDITIONAL_DRIVER: { label: "Additional Driver (Voucher)", amount: 300 },
  FREE_INSURANCE: { label: "Premium Insurance (Voucher)", amount: 400 },
  FREE_DROP_FEE: { label: "One-way drop fee (Voucher)", amount: 500 },
  FREE_UPGRADE: { label: "Vehicle upgrade (Voucher)", amount: 400 },
};

function isDiscountVoucher(v: VoucherInput): boolean {
  const t = v.type?.toUpperCase();
  return t === "FIXED" || t === "PERCENT";
}

function getAddonAmount(addonId: string, rentalDays: number): number {
  const spec = ADDON_PRICES[addonId];
  if (!spec) return 0;
  return spec.type === "daily" ? spec.price * rentalDays : spec.price;
}

function computeTotal(
  dailyRate: number,
  rentalDays: number,
  promotionCode: string | undefined,
  vouchers: VoucherInput[],
  addonIds: string[],
  campaign: PriceRequest["campaign"]
): {
  lineItems: { description: string; amount: number }[];
  total: number;
  vatAmount: number;
  breakdown: NonNullable<PriceResponse["breakdown"]>;
  addonsTotal: number;
  appliedVouchers: { code: string; label: string; amount: number }[];
  appliedCampaign?: { label: string; amount: number };
} {
  const basePrice = dailyRate * rentalDays;
  const lineItems: { description: string; amount: number }[] = [];
  const breakdownAddons: BreakdownLine[] = [];
  let addonsTotal = 0;
  const coveredAddonIds = new Set<string>();
  for (const v of vouchers) {
    const addonId = VOUCHER_TYPE_TO_ADDON[v.type?.toUpperCase() ?? ""];
    if (addonId) coveredAddonIds.add(addonId);
  }
  if (campaign?.type === "free_insurance") coveredAddonIds.add("premium_insurance");

  for (const id of addonIds) {
    const amt = getAddonAmount(id, rentalDays);
    if (amt <= 0) continue;
    const spec = ADDON_PRICES[id];
    const name = spec?.name ?? id;
    const daysLabel = ADDON_PRICES[id]?.type === "daily" ? ` (${rentalDays} day${rentalDays > 1 ? "s" : ""})` : "";
    addonsTotal += amt;
    breakdownAddons.push({ description: `${name}${daysLabel}`, amount: amt, key: id });
  }

  let runningTotal = basePrice + addonsTotal;
  const voucherLines: BreakdownLine[] = [];
  const appliedVouchers: { code: string; label: string; amount: number }[] = [];

  lineItems.push({
    description: `Rental (${rentalDays} day${rentalDays > 1 ? "s" : ""})`,
    amount: basePrice,
  });
  for (const a of breakdownAddons) {
    lineItems.push({ description: a.description, amount: a.amount });
  }

  const subtotalBeforeDiscounts = basePrice + addonsTotal;

  let rentalOnlyForCampaign = basePrice;
  if (rentalDays >= 5) {
    const discount = Math.round(basePrice * 0.2);
    lineItems.push({ description: "Long rental discount -20%", amount: -discount });
    runningTotal -= discount;
    rentalOnlyForCampaign -= discount;
  }

  let campaignDiscountAmount = 0;
  const campaignType = campaign?.type;
  const campaignValue = campaign?.value ?? 0;
  if (promotionCode && PROMO_CODES[promotionCode] && !campaignType) {
    const rate = PROMO_CODES[promotionCode];
    const discount = Math.round(runningTotal * rate);
    lineItems.push({ description: `Promo code (${promotionCode})`, amount: -discount });
    runningTotal -= discount;
  } else if (campaignType === "percent_off_rental" && campaignValue > 0) {
    campaignDiscountAmount = Math.round(rentalOnlyForCampaign * (campaignValue / 100));
    lineItems.push({ description: `Campaign: ${campaign?.label ?? promotionCode ?? ""}`, amount: -campaignDiscountAmount });
    voucherLines.push({ description: `Campaign: ${campaign?.label ?? promotionCode ?? ""}`, amount: -campaignDiscountAmount });
    runningTotal -= campaignDiscountAmount;
  } else if (campaignType === "percent_off_total" && campaignValue > 0) {
    campaignDiscountAmount = Math.round(runningTotal * (campaignValue / 100));
    lineItems.push({ description: `Campaign: ${campaign?.label ?? promotionCode ?? ""}`, amount: -campaignDiscountAmount });
    voucherLines.push({ description: `Campaign: ${campaign?.label ?? promotionCode ?? ""}`, amount: -campaignDiscountAmount });
    runningTotal -= campaignDiscountAmount;
  }

  for (const v of vouchers) {
    if (!v.code) continue;
    const typeUpper = v.type?.toUpperCase();

    if (isDiscountVoucher(v) && v.value != null && v.value > 0) {
      const amount =
        typeUpper === "FIXED"
          ? Math.min(v.value, runningTotal)
          : Math.round(runningTotal * (v.value / 100));
      if (amount > 0) {
        lineItems.push({ description: `Voucher: ${v.code}`, amount: -amount });
        voucherLines.push({ description: `Voucher: ${v.code}`, amount: -amount });
        appliedVouchers.push({ code: v.code, label: v.code, amount });
        runningTotal -= amount;
      }
      continue;
    }

    const addonId = VOUCHER_TYPE_TO_ADDON[typeUpper];
    if (addonId && addonIds.includes(addonId)) {
      const amount = getAddonAmount(addonId, rentalDays);
      if (amount > 0) {
        const label = BENEFIT_SAVINGS[typeUpper]?.label ?? `Voucher: ${v.code}`;
        lineItems.push({ description: `${label}`, amount: -amount });
        voucherLines.push({ description: label, amount: -amount });
        appliedVouchers.push({ code: v.code, label, amount });
        runningTotal -= amount;
      }
      continue;
    }
    const benefitSpec = typeUpper && BENEFIT_SAVINGS[typeUpper];
    if (benefitSpec && benefitSpec.amount > 0 && !addonId) {
      const amount = Math.min(benefitSpec.amount, runningTotal);
      if (amount > 0) {
        lineItems.push({ description: `${benefitSpec.label}`, amount: -amount });
        voucherLines.push({ description: benefitSpec.label, amount: -amount });
        appliedVouchers.push({ code: v.code, label: benefitSpec.label, amount });
        runningTotal -= amount;
      }
    }
  }

  if (campaignType === "free_insurance" && addonIds.includes("premium_insurance")) {
    campaignDiscountAmount = getAddonAmount("premium_insurance", rentalDays);
    if (campaignDiscountAmount > 0) {
      lineItems.push({ description: `Campaign: ${campaign?.label ?? "Free insurance"}`, amount: -campaignDiscountAmount });
      voucherLines.push({ description: campaign?.label ?? "Free insurance", amount: -campaignDiscountAmount });
      runningTotal -= campaignDiscountAmount;
    }
  }

  runningTotal = Math.max(0, runningTotal);
  const vatRate = 0.07;
  const vatAmount = Math.round(runningTotal * vatRate);
  const total = runningTotal + vatAmount;

  lineItems.push({ description: `VAT (${vatRate * 100}%)`, amount: vatAmount });

  const appliedCampaign =
    campaignDiscountAmount > 0
      ? { label: campaign?.label ?? "Campaign", amount: campaignDiscountAmount }
      : undefined;

  const breakdown: NonNullable<PriceResponse["breakdown"]> = {
    rental: { description: `Rental (${rentalDays} day${rentalDays > 1 ? "s" : ""})`, amount: basePrice },
    addons: breakdownAddons,
    subtotal: subtotalBeforeDiscounts,
    voucher_lines: voucherLines,
    campaign_line: appliedCampaign ? { description: appliedCampaign.label, amount: -Math.abs(appliedCampaign.amount) } : undefined,
    vat: { description: `VAT ${vatRate * 100}%`, amount: vatAmount },
    total,
  };

  return {
    lineItems,
    total,
    vatAmount,
    breakdown,
    addonsTotal,
    appliedVouchers,
    appliedCampaign,
  };
}

export async function POST(request: NextRequest) {
  let body: PriceRequest;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const vehicleId = body.vehicle_id ?? "";
  const rentalDays = Math.max(1, Math.min(365, Math.floor(body.rental_days ?? 1)));
  const promotionCode = body.promotion_code?.trim().toUpperCase();
  const vouchers = Array.isArray(body.vouchers) ? body.vouchers : [];
  const addonIds = Array.isArray(body.addon_ids) ? body.addon_ids : [];
  const campaign = body.campaign;

  if (!vehicleId) {
    return Response.json({ error: "vehicle_id required" }, { status: 400 });
  }

  const { payLater: dailyPayLater, payNow: dailyPayNow } = getBaseRates(vehicleId);

  const payLaterResult = computeTotal(
    dailyPayLater,
    rentalDays,
    promotionCode || undefined,
    vouchers,
    addonIds,
    campaign
  );
  const payNowResult = computeTotal(
    dailyPayNow,
    rentalDays,
    promotionCode || undefined,
    vouchers,
    addonIds,
    campaign
  );

  const basePricePayLater = dailyPayLater * rentalDays;
  const discounts: DiscountItem[] = [];
  if (rentalDays >= 5) {
    discounts.push({ description: "Long rental discount -20%", amount: Math.round(basePricePayLater * 0.2) });
  }
  let sub = basePricePayLater - discounts.reduce((s, d) => s + d.amount, 0);
  if (campaign?.type === "percent_off_rental" && campaign.value) {
    const d = Math.round(sub * (campaign.value / 100));
    discounts.push({ description: `Campaign (${campaign.label ?? promotionCode ?? ""})`, amount: d });
    sub -= d;
  } else if (promotionCode && PROMO_CODES[promotionCode] && !campaign) {
    const d = Math.round(sub * PROMO_CODES[promotionCode]);
    discounts.push({ description: `Promo code (${promotionCode})`, amount: d });
    sub -= d;
  }
  for (const v of vouchers) {
    if (!v.code) continue;
    const typeUpper = v.type?.toUpperCase();
    if (isDiscountVoucher(v) && v.value != null && v.value > 0) {
      const amount =
        typeUpper === "FIXED" ? Math.min(v.value, sub) : Math.round(sub * (v.value / 100));
      if (amount > 0) {
        discounts.push({ description: `Voucher (${v.code})`, amount });
        sub -= amount;
      }
      continue;
    }
    const addonId = VOUCHER_TYPE_TO_ADDON[typeUpper];
    if (addonId && addonIds.includes(addonId)) {
      const amount = getAddonAmount(addonId, rentalDays);
      if (amount > 0) {
        discounts.push({ description: `${BENEFIT_SAVINGS[typeUpper]?.label ?? v.code}`, amount });
        sub -= amount;
      }
      continue;
    }
    const benefitSpec = typeUpper && BENEFIT_SAVINGS[typeUpper];
    if (benefitSpec && benefitSpec.amount > 0) {
      const amount = Math.min(benefitSpec.amount, sub);
      if (amount > 0) {
        discounts.push({ description: `${benefitSpec.label}`, amount });
        sub -= amount;
      }
    }
  }

  const promoCodeInvalid =
    promotionCode && !PROMO_CODES[promotionCode] && !campaign ? "Invalid promotion code" : undefined;

  const productPromo =
    rentalDays >= 5
      ? { label: "Long rental discount -20%", amount: Math.round(basePricePayLater * 0.2) }
      : undefined;
  const promoCodeDiscount =
    promotionCode && (PROMO_CODES[promotionCode] || campaign)
      ? {
          code: promotionCode,
          amount: payLaterResult.appliedCampaign?.amount ?? (PROMO_CODES[promotionCode] ? Math.round((basePricePayLater - (productPromo?.amount ?? 0)) * PROMO_CODES[promotionCode]) : 0),
        }
      : undefined;

  const voucherDiscounts = vouchers
    .filter((v) => v.code && isDiscountVoucher(v) && (v.value ?? 0) > 0)
    .map((v) => ({
      code: v.code,
      amount:
        v.type?.toUpperCase() === "FIXED"
          ? (v.value ?? 0)
          : Math.round(basePricePayLater * ((v.value ?? 0) / 100)),
    }));

  const hasBenefitVouchers = vouchers.some(
    (v) => v.code && (!isDiscountVoucher(v) || VOUCHER_TYPE_TO_ADDON[v.type?.toUpperCase() ?? ""])
  );

  const response: PriceResponse = {
    base_price: basePricePayLater,
    addons_total: payLaterResult.addonsTotal,
    subtotal_before_discounts: basePricePayLater + payLaterResult.addonsTotal,
    discounts,
    vat_rate: 0.07,
    vat_amount: payLaterResult.vatAmount,
    pay_later_total: payLaterResult.total,
    pay_now_total: payNowResult.total,
    line_items: payLaterResult.lineItems,
    breakdown: payLaterResult.breakdown,
    currency: "THB",
    rental_days: rentalDays,
    product_promo: productPromo,
    promo_code: promoCodeDiscount,
    voucher_discounts: voucherDiscounts,
    applied_vouchers: payLaterResult.appliedVouchers.length > 0 ? payLaterResult.appliedVouchers : undefined,
    applied_campaign: payLaterResult.appliedCampaign,
    benefit_vouchers_applied: hasBenefitVouchers || undefined,
    promo_code_error: promoCodeInvalid,
  };

  return Response.json(response);
}
