import { NextRequest } from "next/server";
import { getLocaleFromRequest } from "@/lib/request-locale";

export type CampaignDiscountType = "percent_off_rental" | "percent_off_total" | "free_insurance";

export interface CampaignLogicItem {
  type: CampaignDiscountType;
  value?: number;
  label: string;
}

type ApiLocale = "en" | "th" | "zh";

const CAMPAIGN_BY_CODE: Record<string, Omit<CampaignLogicItem, "label"> & { label: string }> = {
  SAVE10: { type: "percent_off_rental", value: 10, label: "10% off rental" },
  HERTZ10: { type: "percent_off_total", value: 10, label: "10% off total" },
  SAVE15: { type: "percent_off_rental", value: 15, label: "15% off rental" },
  WELCOME20: { type: "percent_off_rental", value: 20, label: "20% off rental" },
  INSFREE: { type: "free_insurance", label: "Free premium insurance" },
};

const CAMPAIGN_LABELS: Record<string, Record<ApiLocale, string>> = {
  SAVE10: { en: "10% off rental", th: "ลด 10% ค่าเช่า", zh: "租金省 10%" },
  HERTZ10: { en: "10% off total", th: "ลด 10% ยอดรวม", zh: "总价省 10%" },
  SAVE15: { en: "15% off rental", th: "ลด 15% ค่าเช่า", zh: "租金省 15%" },
  WELCOME20: { en: "20% off rental", th: "ลด 20% ค่าเช่า", zh: "租金省 20%" },
  INSFREE: { en: "Free premium insurance", th: "ประกันพรีเมียมฟรี", zh: "免费超级险" },
};

function getCampaignWithLocale(code: string, locale: ApiLocale): CampaignLogicItem | null {
  const base = CAMPAIGN_BY_CODE[code] ?? null;
  if (!base) return null;
  const label = CAMPAIGN_LABELS[code]?.[locale] ?? base.label;
  return { ...base, label };
}

export async function GET(request: NextRequest) {
  const locale = getLocaleFromRequest(request);
  const code = request.nextUrl.searchParams.get("code")?.trim().toUpperCase();
  if (!code) {
    return Response.json({ campaign: null });
  }
  const campaign = getCampaignWithLocale(code, locale);
  return Response.json({ campaign });
}
