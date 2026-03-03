import { NextRequest } from "next/server";
import { getLocaleFromRequest } from "@/lib/request-locale";
import type { ApiLocale } from "@/lib/request-locale";
import { getBasePrices, getVehicleDetailByGroupCode } from "@/lib/mock/searchVehicles";
import { basePrices } from "@/lib/mock/data";

const PRICE_LABELS: Record<
  ApiLocale,
  {
    rental_days: (n: number) => string;
    long_rental_discount: string;
    vat: (pct: number) => string;
    voucher: (code: string) => string;
    campaign: (label: string) => string;
    points_redemption: string;
    promo_code: (code: string) => string;
    free_insurance: string;
    child_seat_voucher: string;
    gps_voucher: string;
    additional_driver_voucher: string;
    premium_insurance_voucher: string;
    drop_fee_voucher: string;
    upgrade_voucher: string;
    min_days_required: string;
    economy_compact_only: string;
    invalid_promo: string;
    not_applicable: string;
    addon_days: (n: number) => string;
    addon_names: Record<string, string>;
  }
> = {
  en: {
    rental_days: (n) => `Rental (${n} day${n > 1 ? "s" : ""})`,
    long_rental_discount: "Long rental discount -20%",
    vat: (pct) => `VAT (${pct}%)`,
    voucher: (code) => `Voucher: ${code}`,
    campaign: (label) => `Campaign: ${label}`,
    points_redemption: "Points Redemption",
    promo_code: (code) => `Promo code (${code})`,
    free_insurance: "Free premium insurance",
    child_seat_voucher: "Child Seat (Voucher)",
    gps_voucher: "GPS (Voucher)",
    additional_driver_voucher: "Additional Driver (Voucher)",
    premium_insurance_voucher: "Premium Insurance (Voucher)",
    drop_fee_voucher: "One-way drop fee (Voucher)",
    upgrade_voucher: "Vehicle upgrade (Voucher)",
    min_days_required: "Minimum 2 rental days required",
    economy_compact_only: "This promotion applies only to Economy and Compact vehicles.",
    invalid_promo: "Invalid promotion code",
    not_applicable: "Promotion not applicable",
    addon_days: (n: number) => ` (${n} day${n > 1 ? "s" : ""})`,
    addon_names: {
      child_seat: "Child Seat",
      gps: "GPS",
      easy_pass: "Easy Pass",
      additional_driver: "Additional Driver",
      premium_insurance: "Premium Insurance",
      zero_excess: "Zero Excess",
      wifi_router: "WiFi Router",
      snow_chains: "Snow Chains",
      drop_fee: "Drop Fee",
    },
  },
  th: {
    rental_days: (n) => `ค่าเช่า (${n} วัน)`,
    long_rental_discount: "ส่วนลดเช่ายาว -20%",
    vat: (pct) => `ภาษีมูลค่าเพิ่ม (${pct}%)`,
    voucher: (code) => `คูปอง: ${code}`,
    campaign: (label) => `แคมเปญ: ${label}`,
    points_redemption: "แลกคะแนน",
    promo_code: (code) => `รหัสโปร (${code})`,
    free_insurance: "ประกันพรีเมียมฟรี",
    child_seat_voucher: "เก้าอี้เด็ก (คูปอง)",
    gps_voucher: "GPS (คูปอง)",
    additional_driver_voucher: "คนขับเพิ่ม (คูปอง)",
    premium_insurance_voucher: "ประกันพรีเมียม (คูปอง)",
    drop_fee_voucher: "ค่าคืนต่างจุด (คูปอง)",
    upgrade_voucher: "อัปเกรดรถ (คูปอง)",
    min_days_required: "ต้องเช่าอย่างน้อย 2 วัน",
    economy_compact_only: "โปรนี้ใช้ได้กับรถเศรษฐกิจและคอมแพ็กต์เท่านั้น",
    invalid_promo: "รหัสโปรโมชันไม่ถูกต้อง",
    not_applicable: "โปรโมชันไม่สามารถใช้ได้",
    addon_days: (n: number) => ` (${n} วัน)`,
    addon_names: {
      child_seat: "เก้าอี้เด็ก",
      gps: "GPS",
      easy_pass: "อีซีพาส",
      additional_driver: "คนขับเพิ่ม",
      premium_insurance: "ประกันพรีเมียม",
      zero_excess: "ไม่ต้องสำรองความเสียหาย",
      wifi_router: "เราเตอร์ WiFi",
      snow_chains: "โซ่หิมะ",
      drop_fee: "ค่าคืนต่างจุด",
    },
  },
  zh: {
    rental_days: (n) => `租车（${n} 天）`,
    long_rental_discount: "长租折扣 -20%",
    vat: (pct) => `增值税（${pct}%）`,
    voucher: (code) => `优惠券：${code}`,
    campaign: (label) => `活动：${label}`,
    points_redemption: "积分兑换",
    promo_code: (code) => `促销码（${code}）`,
    free_insurance: "免费超级险",
    child_seat_voucher: "儿童座椅（优惠券）",
    gps_voucher: "GPS（优惠券）",
    additional_driver_voucher: "附加驾驶员（优惠券）",
    premium_insurance_voucher: "超级险（优惠券）",
    drop_fee_voucher: "异地还车费（优惠券）",
    upgrade_voucher: "车型升级（优惠券）",
    min_days_required: "至少需租 2 天",
    economy_compact_only: "该促销仅适用于经济型与紧凑型车辆。",
    invalid_promo: "促销码无效",
    not_applicable: "促销不适用",
    addon_days: (n: number) => `（${n} 天）`,
    addon_names: {
      child_seat: "儿童座椅",
      gps: "GPS",
      easy_pass: "易通卡",
      additional_driver: "附加驾驶员",
      premium_insurance: "超级险",
      zero_excess: "零免赔",
      wifi_router: "WiFi 路由器",
      snow_chains: "防滑链",
      drop_fee: "异地还车费",
    },
  },
};

/** SAVE10 mock rules: 10%, ECONOMY+COMPACT only, min 2 days. Do not fake-apply. */
function isPromoEligibleForVehicle(
  promoCode: string,
  vehicleId: string,
  rentalDays: number,
  locale: ApiLocale
): { eligible: boolean; reason?: string } {
  const L = PRICE_LABELS[locale];
  if (promoCode !== "SAVE10") return { eligible: true };
  if (rentalDays < 2) return { eligible: false, reason: L.min_days_required };
  const detail = getVehicleDetailByGroupCode(vehicleId);
  const category = (detail?.category ?? "").toUpperCase();
  const allowed = ["ECONOMY", "COMPACT"];
  if (!allowed.some((c) => category === c || category.startsWith(c)))
    return { eligible: false, reason: L.economy_compact_only };
  return { eligible: true };
}

interface VoucherInput {
  code: string;
  type: string;
  value?: number;
  benefit?: string;
}

/** Single points redemption (one per booking) */
interface PointsRedemptionInput {
  id: string;
  type: string;
  label: string;
  discount_amount: number;
  addon_key?: string;
}

interface PriceRequest {
  vehicle_id: string;
  rental_days: number;
  promotion_code?: string;
  vouchers?: VoucherInput[];
  addon_ids?: string[];
  campaign?: { type: "percent_off_rental" | "percent_off_total" | "free_insurance"; value?: number; label?: string };
  points_redemption?: PointsRedemptionInput;
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
    points_line?: BreakdownLine;
    campaign_line?: BreakdownLine;
    vat: BreakdownLine;
    total: number;
  };
  points_used?: { id: string; label: string; amount: number };
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

/** Add-on id -> daily or flat price (match /api/addons). name is en fallback. */
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

const BENEFIT_AMOUNTS: Record<string, number> = {
  FREE_ADDON: 200,
  FREE_GPS: 150,
  FREE_ADDITIONAL_DRIVER: 300,
  FREE_INSURANCE: 400,
  FREE_DROP_FEE: 500,
  FREE_UPGRADE: 400,
};
type BenefitLabelKey =
  | "child_seat_voucher"
  | "gps_voucher"
  | "additional_driver_voucher"
  | "premium_insurance_voucher"
  | "drop_fee_voucher"
  | "upgrade_voucher";
const BENEFIT_LABEL_KEYS: Record<string, BenefitLabelKey> = {
  FREE_ADDON: "child_seat_voucher",
  FREE_GPS: "gps_voucher",
  FREE_ADDITIONAL_DRIVER: "additional_driver_voucher",
  FREE_INSURANCE: "premium_insurance_voucher",
  FREE_DROP_FEE: "drop_fee_voucher",
  FREE_UPGRADE: "upgrade_voucher",
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

const MAX_DISCOUNT_PERCENT_OF_BASE = 0.8;

function computeTotal(
  dailyRate: number,
  rentalDays: number,
  promotionCode: string | undefined,
  vouchers: VoucherInput[],
  addonIds: string[],
  campaign: PriceRequest["campaign"],
  pointsRedemption: PointsRedemptionInput | undefined,
  locale: ApiLocale
): {
  lineItems: { description: string; amount: number }[];
  total: number;
  vatAmount: number;
  breakdown: NonNullable<PriceResponse["breakdown"]>;
  addonsTotal: number;
  appliedVouchers: { code: string; label: string; amount: number }[];
  appliedCampaign?: { label: string; amount: number };
  pointsUsed?: { id: string; label: string; amount: number };
} {
  const L = PRICE_LABELS[locale];
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
    const name = L.addon_names[id] ?? spec?.name ?? id;
    const daysLabel = ADDON_PRICES[id]?.type === "daily" ? L.addon_days(rentalDays) : "";
    addonsTotal += amt;
    breakdownAddons.push({ description: `${name}${daysLabel}`, amount: amt, key: id });
  }

  let runningTotal = basePrice + addonsTotal;
  const voucherLines: BreakdownLine[] = [];
  const appliedVouchers: { code: string; label: string; amount: number }[] = [];

  lineItems.push({ description: L.rental_days(rentalDays), amount: basePrice });
  for (const a of breakdownAddons) {
    lineItems.push({ description: a.description, amount: a.amount });
  }

  const subtotalBeforeDiscounts = basePrice + addonsTotal;

  let rentalOnlyForCampaign = basePrice;
  if (rentalDays >= 5) {
    const discount = Math.round(basePrice * 0.2);
    lineItems.push({ description: L.long_rental_discount, amount: -discount });
    runningTotal -= discount;
    rentalOnlyForCampaign -= discount;
  }

  let campaignDiscountAmount = 0;
  const campaignType = campaign?.type;
  const campaignValue = campaign?.value ?? 0;
  const campaignLabel = campaign?.label ?? promotionCode ?? "";
  if (promotionCode && PROMO_CODES[promotionCode] && !campaignType) {
    const rate = PROMO_CODES[promotionCode];
    const discount = Math.round(runningTotal * rate);
    lineItems.push({ description: L.promo_code(promotionCode), amount: -discount });
    runningTotal -= discount;
  } else if (campaignType === "percent_off_rental" && campaignValue > 0) {
    campaignDiscountAmount = Math.round(rentalOnlyForCampaign * (campaignValue / 100));
    lineItems.push({ description: L.campaign(campaignLabel), amount: -campaignDiscountAmount });
    voucherLines.push({ description: L.campaign(campaignLabel), amount: -campaignDiscountAmount });
    runningTotal -= campaignDiscountAmount;
  } else if (campaignType === "percent_off_total" && campaignValue > 0) {
    campaignDiscountAmount = Math.round(runningTotal * (campaignValue / 100));
    lineItems.push({ description: L.campaign(campaignLabel), amount: -campaignDiscountAmount });
    voucherLines.push({ description: L.campaign(campaignLabel), amount: -campaignDiscountAmount });
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
        lineItems.push({ description: L.voucher(v.code), amount: -amount });
        voucherLines.push({ description: L.voucher(v.code), amount: -amount });
        appliedVouchers.push({ code: v.code, label: v.code, amount });
        runningTotal -= amount;
      }
      continue;
    }

    const addonId = VOUCHER_TYPE_TO_ADDON[typeUpper];
    const benefitLabelKey = typeUpper ? BENEFIT_LABEL_KEYS[typeUpper] : undefined;
    const benefitLabel = benefitLabelKey ? (L[benefitLabelKey] as string) : undefined;
    const benefitAmount = typeUpper ? BENEFIT_AMOUNTS[typeUpper] : undefined;

    if (addonId && addonIds.includes(addonId) && benefitAmount != null) {
      const amount = getAddonAmount(addonId, rentalDays);
      if (amount > 0) {
        const label = benefitLabel ?? L.voucher(v.code);
        lineItems.push({ description: label, amount: -amount });
        voucherLines.push({ description: label, amount: -amount });
        appliedVouchers.push({ code: v.code, label, amount });
        runningTotal -= amount;
      }
      continue;
    }
    if (benefitAmount != null && benefitAmount > 0 && !addonId && benefitLabel) {
      const amount = Math.min(benefitAmount, runningTotal);
      if (amount > 0) {
        lineItems.push({ description: benefitLabel, amount: -amount });
        voucherLines.push({ description: benefitLabel, amount: -amount });
        appliedVouchers.push({ code: v.code, label: benefitLabel, amount });
        runningTotal -= amount;
      }
    }
  }

  if (campaignType === "free_insurance" && addonIds.includes("premium_insurance")) {
    campaignDiscountAmount = getAddonAmount("premium_insurance", rentalDays);
    if (campaignDiscountAmount > 0) {
      const freeLabel = campaign?.label ?? L.free_insurance;
      lineItems.push({ description: L.campaign(freeLabel), amount: -campaignDiscountAmount });
      voucherLines.push({ description: freeLabel, amount: -campaignDiscountAmount });
      runningTotal -= campaignDiscountAmount;
    }
  }

  let pointsDiscountAmount = 0;
  const baseRentalForCap = basePrice;
  const maxTotalDiscount = Math.round(baseRentalForCap * MAX_DISCOUNT_PERCENT_OF_BASE);
  const currentDiscountTotal = subtotalBeforeDiscounts - runningTotal;

  if (pointsRedemption && pointsRedemption.discount_amount > 0) {
    const rawPointsDiscount = Math.min(pointsRedemption.discount_amount, runningTotal);
    const remainingDiscountBudget = maxTotalDiscount - currentDiscountTotal;
    pointsDiscountAmount = Math.min(rawPointsDiscount, remainingDiscountBudget, runningTotal);
    if (pointsDiscountAmount > 0) {
      lineItems.push({ description: L.points_redemption, amount: -pointsDiscountAmount });
      runningTotal -= pointsDiscountAmount;
    }
  }

  runningTotal = Math.max(0, runningTotal);
  const vatRate = 0.07;
  const vatAmount = Math.round(runningTotal * vatRate);
  const total = runningTotal + vatAmount;

  lineItems.push({ description: L.vat(Math.round(vatRate * 100)), amount: vatAmount });

  const appliedCampaign =
    campaignDiscountAmount > 0
      ? { label: (campaign?.label ?? campaignLabel) || "Campaign", amount: campaignDiscountAmount }
      : undefined;

  const pointsLine: BreakdownLine | undefined =
    pointsDiscountAmount > 0
      ? { description: pointsRedemption!.label, amount: -pointsDiscountAmount }
      : undefined;

  const breakdown: NonNullable<PriceResponse["breakdown"]> = {
    rental: { description: L.rental_days(rentalDays), amount: basePrice },
    addons: breakdownAddons,
    subtotal: subtotalBeforeDiscounts,
    voucher_lines: voucherLines,
    points_line: pointsLine,
    campaign_line: appliedCampaign ? { description: appliedCampaign.label, amount: -Math.abs(appliedCampaign.amount) } : undefined,
    vat: { description: L.vat(Math.round(vatRate * 100)), amount: vatAmount },
    total,
  };

  const pointsUsed =
    pointsDiscountAmount > 0 && pointsRedemption
      ? { id: pointsRedemption.id, label: pointsRedemption.label, amount: pointsDiscountAmount }
      : undefined;

  return {
    lineItems,
    total,
    vatAmount,
    breakdown,
    addonsTotal,
    appliedVouchers,
    appliedCampaign,
    pointsUsed,
  };
}

export async function POST(request: NextRequest) {
  const locale = getLocaleFromRequest(request);
  const L = PRICE_LABELS[locale];
  let body: PriceRequest;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const vehicleId = body.vehicle_id ?? "";
  const rentalDays = Math.max(1, Math.min(365, Math.floor(body.rental_days ?? 1)));
  const rawPromoCode = body.promotion_code?.trim().toUpperCase();
  const vouchers = Array.isArray(body.vouchers) ? body.vouchers : [];
  const addonIds = Array.isArray(body.addon_ids) ? body.addon_ids : [];
  const campaign = body.campaign;
  const pointsRedemption = body.points_redemption;

  if (!vehicleId) {
    return Response.json({ error: "vehicle_id required" }, { status: 400 });
  }

  const promoEligibility =
    rawPromoCode && PROMO_CODES[rawPromoCode]
      ? isPromoEligibleForVehicle(rawPromoCode, vehicleId, rentalDays, locale)
      : { eligible: true as const };
  const promotionCode =
    rawPromoCode && promoEligibility.eligible ? rawPromoCode : undefined;

  const { payLater: dailyPayLater, payNow: dailyPayNow } = getBaseRates(vehicleId);

  const payLaterResult = computeTotal(
    dailyPayLater,
    rentalDays,
    promotionCode || undefined,
    vouchers,
    addonIds,
    campaign,
    pointsRedemption,
    locale
  );
  const payNowResult = computeTotal(
    dailyPayNow,
    rentalDays,
    promotionCode || undefined,
    vouchers,
    addonIds,
    campaign,
    pointsRedemption,
    locale
  );

  const basePricePayLater = dailyPayLater * rentalDays;
  const campaignLabel = campaign?.label ?? promotionCode ?? "";
  const discounts: DiscountItem[] = [];
  if (rentalDays >= 5) {
    discounts.push({ description: L.long_rental_discount, amount: Math.round(basePricePayLater * 0.2) });
  }
  let sub = basePricePayLater - discounts.reduce((s, d) => s + d.amount, 0);
  if (campaign?.type === "percent_off_rental" && campaign.value) {
    const d = Math.round(sub * (campaign.value / 100));
    discounts.push({ description: L.campaign(campaignLabel), amount: d });
    sub -= d;
  } else if (promotionCode && PROMO_CODES[promotionCode] && !campaign) {
    const d = Math.round(sub * PROMO_CODES[promotionCode]);
    discounts.push({ description: L.promo_code(promotionCode), amount: d });
    sub -= d;
  }
  for (const v of vouchers) {
    if (!v.code) continue;
    const typeUpper = v.type?.toUpperCase();
    if (isDiscountVoucher(v) && v.value != null && v.value > 0) {
      const amount =
        typeUpper === "FIXED" ? Math.min(v.value, sub) : Math.round(sub * (v.value / 100));
      if (amount > 0) {
        discounts.push({ description: L.voucher(v.code), amount });
        sub -= amount;
      }
      continue;
    }
    const addonId = VOUCHER_TYPE_TO_ADDON[typeUpper];
    const benefitLabelKey = typeUpper ? BENEFIT_LABEL_KEYS[typeUpper] : undefined;
    const benefitLabel = benefitLabelKey ? (L[benefitLabelKey] as string) : undefined;
    if (addonId && addonIds.includes(addonId)) {
      const amount = getAddonAmount(addonId, rentalDays);
      if (amount > 0) {
        discounts.push({ description: benefitLabel ?? v.code, amount });
        sub -= amount;
      }
      continue;
    }
    const benefitAmount = typeUpper ? BENEFIT_AMOUNTS[typeUpper] : undefined;
    if (benefitAmount != null && benefitAmount > 0 && benefitLabel) {
      const amount = Math.min(benefitAmount, sub);
      if (amount > 0) {
        discounts.push({ description: benefitLabel, amount });
        sub -= amount;
      }
    }
  }

  const promoCodeInvalid = rawPromoCode
    ? !promoEligibility.eligible
      ? promoEligibility.reason ?? L.not_applicable
      : !PROMO_CODES[rawPromoCode] && !campaign
        ? L.invalid_promo
        : undefined
    : undefined;

  const productPromo =
    rentalDays >= 5
      ? { label: L.long_rental_discount, amount: Math.round(basePricePayLater * 0.2) }
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
    points_used: payLaterResult.pointsUsed,
    benefit_vouchers_applied: hasBenefitVouchers || undefined,
    promo_code_error: promoCodeInvalid,
  };

  return Response.json(response);
}
