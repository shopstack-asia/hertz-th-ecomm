/**
 * Loyalty / Points redemption types.
 * Extensible for future Commerce Suite contract.
 */

export type PointsRedemptionType =
  | "FIXED_DISCOUNT"
  | "FREE_DAY"
  | "FREE_ADDON"
  | "PERCENTAGE"
  | "FREE_UPGRADE";

export interface PointsRedemptionOption {
  id: string;
  type: PointsRedemptionType;
  points_required: number;
  /** For FIXED_DISCOUNT, PERCENTAGE */
  discount_amount?: number;
  /** For PERCENTAGE */
  discount_percent?: number;
  /** For FREE_ADDON - addon key (e.g. child_seat, gps) */
  addon_key?: string;
  /** For FREE_UPGRADE - vehicle class (mock) */
  upgrade_to_class?: string;
  label: string;
}

export interface LoyaltyPointsResponse {
  available_points: number;
}

/** My Points summary (GET /api/loyalty/summary) */
export interface LoyaltySummary {
  available_points: number;
  expiring_points: number;
  expiring_date: string | null;
  tier: "SILVER" | "GOLD" | "PLATINUM";
  next_tier: "GOLD" | "PLATINUM" | null;
  next_tier_threshold: number;
}

/** Point transaction type */
export type PointsTransactionType =
  | "EARN"
  | "REDEEM"
  | "EXPIRED"
  | "ADJUSTMENT";

export interface PointsTransaction {
  id: string;
  date: string;
  type: PointsTransactionType;
  description: string;
  booking_ref: string | null;
  points: number;
  balance_after: number;
  /** For ADJUSTMENT: admin note */
  admin_note?: string;
}

export interface LoyaltyTransactionsResponse {
  data: PointsTransaction[];
  pagination: {
    page: number;
    total_pages: number;
  };
}
