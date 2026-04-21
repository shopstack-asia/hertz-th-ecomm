# Domain features — payment

## Pay-later vs pay-now (from checkout)

Checkout creates a reservation via `/api/reservation/create`. For `PAY_LATER`, the client navigates to `/booking/{reservationNo}`. For `PAY_NOW`, it calls `/api/payment/initiate` with `reservationNo` and follows the returned redirect URL (with `reservationNo` appended as a query param in the client).

> Needs product/domain confirmation: whether production would use the same redirect shape or a real external PSP URL.

## Mock “create session” pay path

`/api/payment/create-session` accepts renter/vehicle/datetime fields, creates a `PAY_NOW` reservation via mock handlers, maps a generated `booking_ref` to `reservationNo`, stores amount in `paymentSessions`, and returns `session_id`, `booking_ref`, and `payment_url` pointing at `/mock-kbank-gateway?...`.

## Mock gateway page

`/mock-kbank-gateway` loads `/api/payment/session/{sessionId}`. If the payload includes `type: "voucher"`, the UI treats the flow as a voucher order; otherwise it uses `booking_ref`. Confirm/Cancel navigate to `payment-return` or voucher listing with cancel params.

## Payment return (booking)

On `status=success` and `booking_ref`, the page POSTs `/api/payment/confirm` with `{ booking_ref }`. That route resolves `booking_ref` to `reservationNo`, runs mock `payment.callback` with status `success`, then the client redirects to `/thank-you?booking_ref=...&type=pay_now`. Errors surface as a string `error` from JSON.

## Payment status page (alternate path)

`/payment/status` reads `reservationNo` and `status` query params. With `reservationNo`, it POSTs `/api/payment/callback` with `{ reservationNo, status }` mapped from `success` / `cancel` / other → `fail`. On success it replaces the route to `/booking/{reservationNo}`.

## Callback BFF

`/api/payment/callback` is documented as a placeholder for server-to-server gateway callbacks; the mock is also invoked from the payment status page client.

## Edge cases visible in code

- `/api/payment/session/:sessionId` returns **404** if neither car-rental nor voucher session exists.
- `/api/payment/confirm` returns **400** if `booking_ref` missing, **404** if ref not in the in-memory map (mock process restart loses refs).
- `payment-return` with `status=cancel` redirects to `/vehicles?payment=cancelled` without calling confirm.
