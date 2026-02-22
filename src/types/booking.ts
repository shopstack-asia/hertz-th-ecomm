export type BookingType = "PAY_LATER" | "PAY_NOW";
export type ReservationStatus =
  | "DRAFT"
  | "PENDING_PAYMENT"
  | "PAY_AT_COUNTER"
  | "CONFIRMED"
  | "CANCELLED";
export type PaymentStatus =
  | "PENDING"
  | "AUTHORIZED"
  | "PAID"
  | "FAILED"
  | "CANCELLED";

export interface PricingLineItem {
  description: string;
  amount: number;
}

export interface PricingBreakdown {
  lineItems: PricingLineItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  currency: string;
  discount?: number;
  voucherCode?: string;
}

export interface Reservation {
  reservationNo: string;
  status: ReservationStatus;
  bookingType: BookingType;
  paymentStatus?: PaymentStatus;
  pickupLocation: string;
  pickupAt: string;
  dropoffLocation: string;
  dropoffAt: string;
  vehicleGroupCode: string;
  vehicleName: string;
  renterName: string;
  driverName?: string;
  contactEmail: string;
  contactPhone: string;
  pricing: PricingBreakdown;
  addOns?: { code: string; name: string; amount: number }[];
}
