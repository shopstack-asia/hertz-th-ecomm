# Feature logic summary — checkout

| Behavior | Doc file | Notes |
|----------|----------|--------|
| Checkout steps, pricing validate, reservation create, PAY_NOW handoff | [features/checkout-page-and-reservation-submit.md](features/checkout-page-and-reservation-submit.md) | Uses `proxyFetch` for some calls |
| Thank-you fetch + receipt link | (inline) | `GET /api/reservations/:id`, receipt GET |
| `/api/booking/create` pay-later ref | (inline) | See same doc Related files |
| `/api/checkout/price` | [features/checkout-price-bff.md](features/checkout-price-bff.md) | Large branching; vehicle page + checkout |
