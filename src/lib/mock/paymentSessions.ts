/**
 * In-memory store for mock payment gateway sessions.
 * session_id -> { booking_ref, amount }
 */
export const paymentSessions: Record<
  string,
  { booking_ref: string; amount: number }
> = {};