import { NextRequest } from "next/server";
import type { VoucherType } from "@/types/voucher";

/** Normalized voucher detail returned to checkout */
export interface VoucherApplyResponse {
  name: string;
  code: string;
  type: VoucherType;
  value?: number;
  benefit?: string;
  expired_at: string;
  stackable: boolean;
}

/** Mock: code -> voucher (discount + benefit). Keep in sync with wallet samples for apply-by-code. */
const MOCK_APPLY: Record<
  string,
  {
    name: string;
    type: VoucherType;
    value?: number;
    benefit?: string;
    expired_at: string;
    stackable: boolean;
  }
> = {
  ABC: {
    name: "Welcome Voucher",
    type: "FIXED",
    value: 100,
    expired_at: "2026-12-31T23:59:59",
    stackable: true,
  },
  XYZ: {
    name: "10% Off",
    type: "PERCENT",
    value: 10,
    expired_at: "2026-12-31T23:59:59",
    stackable: true,
  },
  SAVE500: {
    name: "500 THB Discount",
    type: "FIXED",
    value: 500,
    expired_at: "2026-06-30T23:59:59",
    stackable: true,
  },
  EXTRA15: {
    name: "Extra 15%",
    type: "PERCENT",
    value: 15,
    expired_at: "2026-08-31T23:59:59",
    stackable: true,
  },
  FREESEAT: {
    name: "Free child seat",
    type: "FREE_ADDON",
    benefit: "Free child seat",
    expired_at: "2026-12-31T23:59:59",
    stackable: true,
  },
  INSFREE: {
    name: "Free premium insurance upgrade",
    type: "FREE_INSURANCE",
    benefit: "Free premium insurance upgrade",
    expired_at: "2026-08-31T23:59:59",
    stackable: false,
  },
  NODROP: {
    name: "Free one-way drop fee",
    type: "FREE_DROP_FEE",
    benefit: "Free one-way drop fee",
    expired_at: "2026-10-01T23:59:59",
    stackable: true,
  },
  UPGRADE1: {
    name: "Free vehicle class upgrade",
    type: "FREE_UPGRADE",
    benefit: "Free vehicle class upgrade",
    expired_at: "2026-09-01T23:59:59",
    stackable: false,
  },
  FREEGPS: {
    name: "Free GPS",
    type: "FREE_GPS",
    benefit: "Free GPS",
    expired_at: "2026-12-31T23:59:59",
    stackable: true,
  },
  EXTRADRIVER: {
    name: "Free additional driver",
    type: "FREE_ADDITIONAL_DRIVER",
    benefit: "Free additional driver",
    expired_at: "2026-12-31T23:59:59",
    stackable: true,
  },
};

export async function POST(request: NextRequest) {
  let body: { code?: string; vehicle_id?: string; rental_days?: number };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const code = body.code?.trim().toUpperCase();
  if (!code) {
    return Response.json({ error: "Voucher code is required" }, { status: 400 });
  }

  const voucher = MOCK_APPLY[code];
  if (!voucher) {
    return Response.json({ error: "Invalid or expired voucher code" }, { status: 400 });
  }

  const now = new Date();
  const expiredAt = new Date(voucher.expired_at);
  if (expiredAt < now) {
    return Response.json({ error: "This voucher has expired" }, { status: 400 });
  }

  const detail: VoucherApplyResponse = {
    name: voucher.name,
    code,
    type: voucher.type,
    value: voucher.value,
    benefit: voucher.benefit,
    expired_at: voucher.expired_at,
    stackable: voucher.stackable,
  };

  return Response.json({ ok: true, voucher: detail });
}
