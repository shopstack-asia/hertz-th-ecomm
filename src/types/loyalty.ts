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
