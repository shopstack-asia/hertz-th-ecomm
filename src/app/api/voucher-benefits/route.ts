import { NextRequest } from "next/server";

/** Maps voucher benefit type to add-on id covered by voucher. */
const VOUCHER_TYPE_TO_ADDON_ID: Record<string, string> = {
  FREE_ADDON: "child_seat",
  FREE_GPS: "gps",
  FREE_ADDITIONAL_DRIVER: "additional_driver",
  FREE_INSURANCE: "premium_insurance",
  FREE_DROP_FEE: "drop_fee",
};

export interface VoucherBenefitsResponse {
  covered_addon_ids: string[];
}

/** POST body: { voucher_types: string[] } — types of applied vouchers. Returns add-on ids covered. */
export async function POST(request: NextRequest) {
  let body: { voucher_types?: string[] };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const types = Array.isArray(body.voucher_types) ? body.voucher_types : [];
  const covered = new Set<string>();
  for (const t of types) {
    const addonId = VOUCHER_TYPE_TO_ADDON_ID[String(t).toUpperCase()];
    if (addonId) covered.add(addonId);
  }
  return Response.json({ covered_addon_ids: Array.from(covered) } as VoucherBenefitsResponse);
}
