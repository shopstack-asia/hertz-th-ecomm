# Documentation standards — hertz-th-ecomm

## 1. Purpose

Documentation makes **business logic and BFF contracts discoverable** for developers and AI agents. It reduces wrong assumptions and keeps onboarding cheap.

## 2. Where feature-area docs live

| Location | Content |
|----------|---------|
| `doc/features/<feature-area>/README.md` | Purpose, scope, **reading order** for that area. |
| `doc/features/<feature-area>/domain-features.md` | High-level overview of behaviors and responsibilities. |
| `doc/features/<feature-area>/feature-logic-summary.md` | Short index linking to detailed docs under `features/`. |
| `doc/features/<feature-area>/features/` | Detailed domain behavior docs (behavior-centric filenames). |
| `doc/rules/` | **Shared** standards only—no replacement for feature logic. |

Global navigation: [../feature-logic-summary.md](../feature-logic-summary.md).

## 3. When documentation must be updated

Update the relevant `doc/features/<feature-area>/` docs when:

- **Business logic** or decision rules change.  
- **Validation** or eligibility rules change.  
- **User flows** or steps change (including redirects and error states).  
- **BFF contracts** change: request shape, response shape, status codes, or error payload conventions.

## 4. When to add feature docs

Add or extend detailed docs under `features/` when:

- Logic spans **multiple** files or layers.  
- There are more than **three** meaningful branches or conditions.  
- There is non-trivial **validation** or compliance-sensitive handling.  
- There are **state machines** or step-based flows.  
- The behavior is **business-critical** (payments, identity, reservations, pricing).

## 5. Feature file structure (recommended sections)

Each detailed behavior doc under `features/` should be easy to scan and contain, as applicable:

1. **Title**  
2. **Purpose** — what user or system outcome this covers  
3. **Related files** — pointers to `src/app/`, `src/components/`, `src/app/api/`, not a dump of every import  
4. **Business logic** — rules in plain language  
5. **Conditions** — when each branch applies  
6. **Validation rules** — inputs, limits, error cases  
7. **API contracts** — relevant `/api/*` routes, main fields, success vs error  
8. **User flows** — step order, entry/exit points  
9. **Edge cases** — known sharp edges  
10. **Required tests** — behaviors that must stay covered

## 6. Documentation style

- **Concise**, structured headings, bullet lists for rules.  
- Written for **both** humans and AI: explicit nouns, stable terminology, links to routes and files.  
- Avoid duplicating obvious code line-by-line; summarize **intent** and **invariants**.

## 7. BFF contract documentation

When a Route Handler’s **request or response contract** changes:

- Update the **feature area** that owns that endpoint.  
- Include **example payloads** only when they clarify ambiguity—not full generated dumps.  
- Note **breaking** vs **backward-compatible** changes when relevant.
