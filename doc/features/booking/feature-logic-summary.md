# Feature logic summary — booking

| Behavior | Doc file | Notes |
|----------|----------|--------|
| Search BFF and query params | [features/vehicle-search-bff.md](features/vehicle-search-bff.md) | `runSearch` mock |
| BookingContext defaults and location coupling | [features/booking-datetime-and-location-state.md](features/booking-datetime-and-location-state.md) | Client-only |
| Vehicle detail + handoff to checkout query string | (inline) | Uses `/api/checkout/price` (checkout-owned BFF) |
| `GET /api/booking/*` and add-ons catalog | (inline) | Thin proxies to mock |
