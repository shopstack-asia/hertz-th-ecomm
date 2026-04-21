# Feature logic summary — payment

| Behavior | Doc file | Notes |
|----------|----------|--------|
| Mock rental payment: initiate, create-session, session lookup, confirm, callback, status page | [features/mock-rental-payment-flow.md](features/mock-rental-payment-flow.md) | In-memory maps; shares session route with voucher |
| Payment-return cancel redirect | (inline) | `/vehicles?payment=cancelled` |
| Voucher branch on payment-return / mock gateway | (inline) | Owned by **voucher**; see that area’s summary |
