# Feature logic summary — loyalty

| Behavior | Doc file | Notes |
|----------|----------|--------|
| Redemption options computation | [features/loyalty-redemption-options-bff.md](features/loyalty-redemption-options-bff.md) | Session-gated |
| Summary / profile / points mocks | (inline) | Fixed JSON or simple rules |
| Transactions filtering + pagination | (inline) | `GET /api/loyalty/transactions` |
| `loyalty.service.ts` | (inline) | Client fetch helpers |
