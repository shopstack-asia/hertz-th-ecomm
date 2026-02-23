import type { Reservation } from "./booking";

export interface AccountProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar_url?: string;
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
