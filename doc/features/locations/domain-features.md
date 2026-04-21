# Domain features — locations

## Single GET handler, two response shapes

The handler loads localized branches from mock data, applies optional filters (`province`, `branch_type`, `keyword` / `q`), then chooses response format:

- **Legacy:** Simple array of `{ code, name, city, address }` when the request is **not** considered “locations page style”.
- **List API:** `{ total, data: [...] }` with richer branch objects when `list=1` **or** any of: `province`, `branch_type`, `keyword`/`q`, `page`, `page_size` query params are present.

## Province normalization

`province` query can map to internal `province_code` via a fixed allowlist (underscore-normalized names like `chiang_mai`). If not in allowlist, code falls back to case-insensitive equality match on display province string.

## Branch fields (list shape)

Each branch returns id, code, name, branch_type, province, district, address, phone, opening_hours, coordinates, flags, image — see `toApiBranch` in the route file.

## Edge cases

- Unknown province token not in allowlist still filters by display name equality path.

> Needs product/domain confirmation: whether legacy shape is still required for production CS contracts or is transitional.
