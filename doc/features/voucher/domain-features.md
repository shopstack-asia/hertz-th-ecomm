# Domain features — voucher

## Catalog and detail

`GET /api/vouchers/catalog` returns a large mock list with pricing, card styles, and categories (typed in route). Voucher checkout page refetches full catalog client-side and picks the item matching `voucher_id` query param.

## My vouchers

`GET /api/vouchers/my` requires a valid `hertz_session` cookie and session row (**401** otherwise). Returns paginated, filterable mock wallet data (`status`, `search`, `sort`, value bounds, `expiring_soon`, etc.).

## Apply by code

`POST /api/voucher/apply` resolves mock codes to normalized voucher objects used by checkout pricing.

## Purchase flow (voucher-checkout)

- Requires `useAuth`: if not `authenticated`, redirects to login with `returnUrl` back to checkout query.
- Computes subtotal/VAT client-side mirroring server VAT rate `0.07` in create route.
- `POST /api/voucher-order/create` with `voucher_id`, `quantity` 1..10, optional recipient/gift fields → returns `payment_url` → client navigates to mock gateway.

## Payment return (voucher)

When `status=success`, `type=voucher`, and `order_ref` present, `payment-return` POSTs `/api/voucher-order/confirm` then redirects to `/voucher-thank-you?order_ref=...`.

## Confirm and lookup

- **Confirm:** Idempotent-ish: if order already `paid`, returns existing `voucher_code` / `expiry_date`; else generates code, sets paid timestamps.
- **By ref:** `GET /api/voucher-order/by-ref?order_ref=...` returns stored order or 404.

## Mock gateway (voucher mode)

Session GET marks `type: "voucher"`; confirm navigates success query with `order_ref` + `type=voucher`; cancel returns to `/vouchers?payment=cancelled`.

## Edge cases

- Create: unknown `voucher_id` → 404 `Voucher not found`.
- Confirm: missing `order_ref` → 400.

> Needs product/domain confirmation: production payment session ownership between voucher SKUs and PSP metadata.
