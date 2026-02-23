/**
 * Shared voucher types for wallet, apply, and checkout.
 * Extensible for future benefit types.
 */

export type VoucherTypeDiscount = "FIXED" | "PERCENT";
export type VoucherTypeBenefit =
  | "FREE_ADDON"
  | "FREE_GPS"
  | "FREE_ADDITIONAL_DRIVER"
  | "FREE_INSURANCE"
  | "FREE_DROP_FEE"
  | "FREE_UPGRADE";
export type VoucherType = VoucherTypeDiscount | VoucherTypeBenefit;

export const VOUCHER_TYPE_LABELS: Record<VoucherTypeBenefit, string> = {
  FREE_ADDON: "FREE ADD-ON",
  FREE_GPS: "FREE GPS",
  FREE_ADDITIONAL_DRIVER: "FREE ADDITIONAL DRIVER",
  FREE_INSURANCE: "FREE INSURANCE",
  FREE_DROP_FEE: "FREE DROP",
  FREE_UPGRADE: "FREE UPGRADE",
};

export function isDiscountType(t: VoucherType): t is VoucherTypeDiscount {
  return t === "FIXED" || t === "PERCENT";
}

export function isBenefitType(t: VoucherType): t is VoucherTypeBenefit {
  return (
    t === "FREE_ADDON" ||
    t === "FREE_GPS" ||
    t === "FREE_ADDITIONAL_DRIVER" ||
    t === "FREE_INSURANCE" ||
    t === "FREE_DROP_FEE" ||
    t === "FREE_UPGRADE"
  );
}

/** Voucher as returned from wallet or apply API */
export interface VoucherRecord {
  id: string;
  code: string;
  type: VoucherType;
  /** For FIXED/PERCENT */
  value?: number;
  /** For benefit types */
  benefit?: string;
  minimum_days: number;
  expiry_date: string;
  status: "ACTIVE" | "USED" | "EXPIRED";
  stackable: boolean;
  applicable_vehicle_classes?: string[];
}

/** Applied voucher at checkout (normalized from API) */
export interface AppliedVoucher {
  code: string;
  name: string;
  type: VoucherType;
  value?: number;
  benefit?: string;
  expired_at: string;
  stackable: boolean;
}
