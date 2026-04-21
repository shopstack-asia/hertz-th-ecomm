# Feature-area documentation — hertz-th-ecomm

## 1. Rule

For every **feature area** that receives **meaningful** behavioral or contract changes, documentation MUST be **created or maintained** under:

```text
doc/features/<feature-area>/
```

“Meaningful” includes logic, validation, user-visible flows, and BFF request/response shapes.

## 2. Required structure per feature area

| Path | Required |
|------|----------|
| `README.md` | Yes — purpose, scope, reading order for the folder. |
| `domain-features.md` | Yes — high-level behavior map for the area. |
| `feature-logic-summary.md` | Yes — index of links into `features/`. |
| `features/*.md` | As needed — one doc per **domain behavior** worth explaining (see sections 4–5). |

## 3. Purpose of each file

- **`README.md`** — Onboarding: what belongs in this area, how to read the rest, links to global rules in `doc/`.  
- **`domain-features.md`** — Narrative overview: main capabilities, dependencies on other areas, non-obvious constraints.  
- **`feature-logic-summary.md`** — Table or bullet list pointing to each `features/<name>.md` with one-line descriptions.  
- **`features/`** — Deep dives for flows that need more than a short paragraph.

## 4. Feature definition rule

Feature docs describe **user-facing or system-facing domain behavior**, not the source tree.

**Good file name examples:**

- `booking-form-flow.md`  
- `vehicle-search-and-filter.md`  
- `otp-verification-flow.md`  
- `voucher-redemption-flow.md`

**Invalid as primary feature doc names:**

- Names that mirror a single React component (`BookingForm.md`).  
- Names that mirror only a route file (`route.md`, `page.md`).  
- Names that mirror **only** an API path with no domain meaning (`api-route.md`) unless the doc’s body is clearly **contract-centric** and still framed as behavior.

Inside a doc, **Related files** may list components and routes; the **title** stays domain-centric.

## 5. When detailed feature docs are mandatory

Create or update a file under `features/` when **any** of:

- Behavior spans **multiple** implementation files.  
- More than **three** non-trivial conditions or branches.  
- **Validation** or legal/compliance-sensitive rules exist.  
- **State transitions** (steps, statuses) must stay consistent.  
- The behavior is **business-critical**.

## 6. Required reading order

Before implementing in `<feature-area>`:

1. `doc/features/<feature-area>/README.md`  
2. `doc/features/<feature-area>/domain-features.md`  
3. `doc/features/<feature-area>/feature-logic-summary.md`  
4. Relevant `doc/features/<feature-area>/features/*.md`  
5. Application code

## 7. Maintenance rule

When **user flows**, **API contracts**, or **business logic** change, update the same feature-area docs in the **same change** whenever possible. If a follow-up is unavoidable, the task report must call out **pending doc debt**.

## 8. Enforcement

An implementation is **incomplete** if:

- Feature-area docs are **missing** for new meaningful behavior.  
- Docs are **outdated** relative to merged code.  
- Docs **only mirror** code structure without explaining behavior, rules, and contracts.

Use [../feature-logic-summary.md](../feature-logic-summary.md) to resolve `<feature-area>` names consistently.
