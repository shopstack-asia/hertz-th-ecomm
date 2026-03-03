import { NextRequest } from "next/server";
import { getLocaleFromRequest } from "@/lib/request-locale";

type ApiLocale = "en" | "th" | "zh";

/**
 * Mock promotion rules for SAVE10 (enterprise-ready structure for future CS integration):
 * - 10% discount
 * - Only ECONOMY + COMPACT vehicle classes
 * - Minimum 2 rental days
 */
const PROMO_RULES: Record<
  string,
  {
    discount_percent: number;
    discount_label: string;
    min_rental_days: number;
    vehicle_classes: string[];
  }
> = {
  SAVE10: {
    discount_percent: 10,
    discount_label: "10% discount",
    min_rental_days: 2,
    vehicle_classes: ["ECONOMY", "COMPACT"],
  },
};

const PROMO_MESSAGES: Record<
  ApiLocale,
  {
    code_required: string;
    not_recognized: string;
    min_days: (n: number) => string;
    applied: (code: string, label: string) => string;
  }
> = {
  en: {
    code_required: "Promotion code is required",
    not_recognized: "This promotion code is not recognized.",
    min_days: (n) => `Minimum ${n} rental days required`,
    applied: (code, label) => `${code} applied – ${label}`,
  },
  th: {
    code_required: "กรุณาระบุรหัสโปรโมชัน",
    not_recognized: "ไม่รู้จักรหัสโปรโมชันนี้",
    min_days: (n) => `ต้องเช่าอย่างน้อย ${n} วัน`,
    applied: (code, label) => `ใช้ ${code} แล้ว – ${label}`,
  },
  zh: {
    code_required: "请输入促销码",
    not_recognized: "无法识别该促销码。",
    min_days: (n) => `至少需租 ${n} 天`,
    applied: (code, label) => `已应用 ${code} – ${label}`,
  },
};

const DISCOUNT_LABELS: Record<string, Record<ApiLocale, string>> = {
  SAVE10: { en: "10% discount", th: "ลด 10%", zh: "省 10%" },
};

function parseRentalDays(pickupDate: string, dropoffDate: string): number {
  const start = new Date(pickupDate).getTime();
  const end = new Date(dropoffDate).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return 0;
  return Math.ceil((end - start) / (24 * 60 * 60 * 1000));
}

export async function POST(request: NextRequest) {
  const locale = getLocaleFromRequest(request);
  const msg = PROMO_MESSAGES[locale];
  let body: {
    promo_code?: string;
    pickup_location?: string;
    dropoff_location?: string;
    pickup_date?: string;
    dropoff_date?: string;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const promoCode = (body.promo_code ?? "").trim().toUpperCase();
  const pickupDate = body.pickup_date ?? "";
  const dropoffDate = body.dropoff_date ?? "";

  if (!promoCode) {
    return Response.json({
      valid: false,
      message: msg.code_required,
      conditions: undefined,
    });
  }

  const rule = PROMO_RULES[promoCode];
  if (!rule) {
    return Response.json({
      valid: false,
      message: msg.not_recognized,
      conditions: undefined,
    });
  }

  const discountLabel = DISCOUNT_LABELS[promoCode]?.[locale] ?? rule.discount_label;
  const rentalDays = parseRentalDays(pickupDate, dropoffDate);

  if (rentalDays < rule.min_rental_days) {
    return Response.json({
      valid: false,
      message: msg.min_days(rule.min_rental_days),
      conditions: {
        min_rental_days: rule.min_rental_days,
        vehicle_classes: rule.vehicle_classes,
      },
    });
  }

  return Response.json({
    valid: true,
    message: msg.applied(promoCode, discountLabel),
    discount_label: discountLabel,
    conditions: {
      min_rental_days: rule.min_rental_days,
      vehicle_classes: rule.vehicle_classes,
    },
  });
}
