export interface PaymentInitiateRequest {
  reservationNo: string;
}

export interface PaymentInitiateResponse {
  paymentRedirectUrl: string;
  paymentId?: string;
}

export interface PaymentCallbackParams {
  status: "success" | "fail" | "cancel";
  reservationNo?: string;
  paymentId?: string;
}
