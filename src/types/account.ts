import type { Reservation } from "./booking";

export interface AccountProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar_url?: string;
  /** Identity document type */
  identity_document_type?: "id_card" | "passport";
  /** Identity document (ID card / passport) – URL or data URL */
  identity_document_url?: string;
  /** Identity document expiry (YYYY-MM-DD), may be read from document */
  identity_document_expiry?: string;
  /** Driver's license document – URL or data URL */
  driver_license_url?: string;
  /** Driver's license expiry (YYYY-MM-DD) */
  driver_license_expiry?: string;
}

/** Spending-based qualification (My Profile loyalty header). */
export interface LoyaltyProfile {
  tier: "SILVER" | "GOLD" | "PLATINUM";
  annual_spending: number;
  next_tier: "GOLD" | "PLATINUM" | null;
  next_tier_spending_threshold: number;
  qualification_start: string;
  qualification_end: string;
}

export interface AccountBookingsResponse {
  bookings: Reservation[];
}
