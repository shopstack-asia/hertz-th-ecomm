import { NextRequest } from "next/server";

export type CampaignDiscountType = "percent_off_rental" | "percent_off_total" | "free_insurance";

export interface CampaignLogicItem {
  type: CampaignDiscountType;
  value?: number;
  label: string;
}

const CAMPAIGN_BY_CODE: Record<string, CampaignLogicItem> = {
  SAVE10: { type: "percent_off_rental", value: 10, label: "10% off rental" },
  HERTZ10: { type: "percent_off_total", value: 10, label: "10% off total" },
  SAVE15: { type: "percent_off_rental", value: 15, label: "15% off rental" },
  WELCOME20: { type: "percent_off_rental", value: 20, label: "20% off rental" },
  INSFREE: { type: "free_insurance", label: "Free premium insurance" },
};

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")?.trim().toUpperCase();
  if (!code) {
    return Response.json({ campaign: null });
  }
  const campaign = CAMPAIGN_BY_CODE[code] ?? null;
  return Response.json({ campaign });
}
