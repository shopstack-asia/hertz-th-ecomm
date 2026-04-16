# AI agent instruction — hertz-th-ecomm

## 1. Title and purpose

This file is the **mandatory entry point** for any AI agent working in this repository. It defines the workflow, non-negotiable rules, and completion criteria so work is **scoped**, **document-aligned**, and **verifiable**.

## 2. Critical rule

Before **any** implementation (code, tests, or contract changes), the agent MUST:

1. Read **this file** in full.  
2. Read **every mandatory rule file** listed in section 3.  
3. Follow the workflow in section 4.

Skipping these steps is not allowed.

For a concise **stakeholder checklist** (continue existing structure, keep docs current, coding standards, CMS readiness, BFF/proxy), see [doc/README.md — Team implementation principles](./README.md#team-implementation-principles).

## 3. Mandatory rule files

Read all of the following under `doc/rules/` before writing code:

| File | Topic |
|------|--------|
| [rules/coding.md](./rules/coding.md) | Architecture, BFF, components, contexts, services, naming, i18n |
| [rules/testing.md](./rules/testing.md) | Test scope, cases, quality, reporting |
| [rules/lint.md](./rules/lint.md) | TypeScript and ESLint gates |
| [rules/documentation.md](./rules/documentation.md) | Where docs live, when to update |
| [rules/feature-area-documentation.md](./rules/feature-area-documentation.md) | Per-feature folder structure and naming |

Also respect the always-on Cursor rule: `.cursor/rules/ai-agent.mdc`.

## 4. Mandatory workflow (step by step)

1. Read this file and **all** mandatory rule files in section 3.  
2. **Identify the feature area** from the task description and file paths (use [feature-logic-summary.md](./feature-logic-summary.md)).  
3. Read **feature-area docs** in the order defined in section 5. If docs are missing, create the minimum set per [rules/feature-area-documentation.md](./rules/feature-area-documentation.md) before substantive code changes.  
4. Inspect related **pages** (`src/app/(site)/`), **components** (`src/components/`), **API routes** (`src/app/api/`), **contexts** (`src/contexts/`), and **services** (`src/services/`).  
5. Follow **existing patterns** in the same feature area (naming, error handling, fetch to `/api/*`, i18n keys).  
6. Implement **only** scoped changes required by the task—no unrelated refactors.  
7. **Add or update tests** for meaningful logic per [rules/testing.md](./rules/testing.md).  
8. Run **TypeScript**: `npx tsc --noEmit` (from repo root).  
9. Run **ESLint**: `npm run lint`.  
10. **Fix** all failures **newly introduced** by your changes. For pre-existing failures, follow [rules/lint.md](./rules/lint.md).  
11. If behavior, validation, flows, or BFF contracts changed, **update feature-area docs** under `doc/features/<feature-area>/` per [rules/documentation.md](./rules/documentation.md).  
12. **Report** using the format in section 10.

## 5. Feature-area documentation resolution order

For the active `<feature-area>`:

1. `doc/features/<feature-area>/README.md`  
2. `doc/features/<feature-area>/domain-features.md`  
3. `doc/features/<feature-area>/feature-logic-summary.md`  
4. `doc/features/<feature-area>/features/*.md` (detailed domain behavior docs linked from the summary)

## 6. When detailed feature docs are required

Create or extend detailed files under `features/` when **any** of the following holds:

- Logic spans **multiple** files or layers (page + API + component).  
- More than **three** distinct branches, conditions, or outcomes.  
- **Validation** rules or error codes matter for UX or support.  
- **State transitions** (e.g. checkout steps, payment status, auth steps).  
- The change is **business-critical** (payments, auth, PII, pricing, reservations).  
- The agent would otherwise need to **infer** rules from scattered code.

## 7. Do-not rules

- Do not invent product or API behavior without docs or existing code proof.  
- Do not call **external** HTTP APIs from client components or client-only modules.  
- Do not put secrets or server-only tokens in client code.  
- Do not hardcode user-visible strings; use `useLanguage()` / `t()` per rules.  
- Do not import **another feature area’s private internals**.  
- Do not skip tests for meaningful logic when a test runner exists; if none exists yet, still design for testability and document the gap in the task report.  
- Do not complete the task with **new** TypeScript or ESLint failures unresolved.  
- Do not leave feature docs **false** relative to shipped behavior.

## 8. Always rules

- Always identify the feature area and read its docs (or create the minimum doc set first).  
- Always route **external** integration through **`src/app/api/*`** (BFF). Client calls stay on **`/api/*`**.  
- Always reuse **existing types**, utilities, and UI from `@/components/ui/` where possible.  
- Always use **`useLanguage().t(...)`** (or equivalent from `@/contexts/LanguageContext`) for user-facing copy.  
- Always run `npx tsc --noEmit` and `npm run lint` before claiming completion.  
- Always update **feature-area documentation** when behavior or contracts change.  
- Always report with the **final output format** below.

## 9. BFF enforcement

- **Client code must never call external backend URLs** for business operations.  
- **All** external / core API calls MUST be implemented in **Next.js Route Handlers** under `src/app/api/` (exposed as `/api/...`).  
- API routes own: credentials, upstream URLs, auth header injection, **error mapping**, and **stable response shapes** for the frontend.

## 10. Final output format

Every task report MUST include:

1. **Files changed** — list paths.  
2. **Logic added or updated** — short, precise bullet points tied to behavior.  
3. **Tests added or updated** — file paths and what behavior they cover.  
4. **TypeScript** — command run (`npx tsc --noEmit`) and pass/fail (summarize errors if fail).  
5. **ESLint** — command run (`npm run lint`) and pass/fail (summarize errors if fail).  
6. **Docs updated** — list `doc/features/...` or `doc/...` files touched, or state “none” with reason.

## 11. Enforcement

A task is **complete** only when:

- Code matches scope and **BFF / i18n / boundary** rules.  
- **Tests** are updated as required by [rules/testing.md](./rules/testing.md).  
- **`npx tsc --noEmit`** and **`npm run lint`** pass, or any failures are **pre-existing** and explicitly documented per [rules/lint.md](./rules/lint.md).  
- **Documentation** is updated when behavior or contracts changed.  
- The **final output format** has been provided.
