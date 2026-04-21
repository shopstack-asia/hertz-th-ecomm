# Feature logic summary — voucher

| Behavior | Doc file | Notes |
|----------|----------|--------|
| Auth-gated checkout, create order, pay-return confirm | [features/voucher-order-create-pay-and-confirm.md](features/voucher-order-create-pay-and-confirm.md) | Uses `/api/payment/session` for display |
| Catalog / apply / my wallet | (inline) | Large mock catalog in route file |
| `voucher-benefits` BFF | (inline) | Separate route; see code for shape |
