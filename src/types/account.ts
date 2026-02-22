import type { Reservation } from "./booking";

export interface AccountProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AccountBookingsResponse {
  bookings: Reservation[];
}
