/**
 * In-memory store for voucher order payment sessions.
 * session_id -> { order_ref, amount }
 */
export const voucherPaymentSessions: Record<
  string,
  { order_ref: string; amount: number }
> = {};

export interface VoucherOrderRecord {
  order_ref: string;
  voucher_id: string;
  voucher_title: string;
  quantity: number;
  total: number;
  recipient_name?: string;
  gift_message?: string;
  status: "pending" | "paid";
  voucher_code?: string;
  expiry_date?: string;
  paid_at?: string;
}

/** Orders by order_ref (for thank-you page and confirm) */
export const voucherOrders: Record<string, VoucherOrderRecord> = {};
