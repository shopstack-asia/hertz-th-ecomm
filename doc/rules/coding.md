# Coding standards — hertz-th-ecomm

## 1. Core principle

**Consistency over cleverness.** Match existing patterns in the same feature area and layer. If two patterns exist, prefer the one used in the files you are touching unless the task explicitly migrates style.

## 2. Architecture rules

| Layer | Location | Responsibility |
|--------|-----------|----------------|
| **Pages** | `src/app/(site)/` | Routing and **server-oriented data loading** for the route. Prefer **Server Components** when the page does not need client-only APIs. |
| **Components** | `src/components/` | **Presentation** and **local UI state**. **No** direct calls to **external** (non-Next) APIs. Use **`fetch('/api/...')`** or props/context when the existing feature already does. |
| **API routes** | `src/app/api/` | **BFF only**: proxy to backends, inject auth, map errors, shape JSON for the app. **All secrets stay server-side.** |
| **Contexts** | `src/contexts/` | **Global client state**: language, auth, booking, promotion, cookie consent, etc. |
| **Services** | `src/services/` | **Reusable server-side logic** consumed from API routes or other **server-only** code—not from client components. |

## 3. Component rules

- Prefer **Server Components** by default. Add **`'use client'`** only when required: hooks, event handlers, browser APIs, or client-only libraries.  
- **Co-locate** helper logic with the feature component when it is not reused elsewhere; move to `src/lib/` when shared across features.  
- Use **`src/components/ui/`** before adding new primitives (buttons, modals, loaders).  
- **Layout components** (`src/components/layout/`, route `layout.tsx`) orchestrate structure only—avoid embedding **business rules** there.

## 4. API route rules

- Every **external** or **core backend** call MUST go through a **Route Handler** under `src/app/api/`.  
- Route Handlers should: validate input where appropriate, attach **auth/session** context for upstream calls, **normalize errors** to safe client messages, and return a **consistent JSON shape** per route family.  
- **Never** return raw upstream stack traces or sensitive fields to the client.  
- Document request/response changes in the owning feature area under `doc/features/<feature-area>/`.

## 5. State management rules

- **Global** UI state uses **React Context** in `src/contexts/`.  
- Avoid **prop drilling** beyond **two** levels for the same concern—prefer context or composition.  
- Do not mirror **server state** in client context unless there is a clear UX need (loading, optimistic UI); prefer server data or refetch via `/api/*` following existing patterns.

## 6. Naming conventions

| Kind | Convention |
|------|---------------|
| Variables and functions | `camelCase` |
| React components | `PascalCase` |
| File and folder names (new) | `kebab-case` unless matching existing adjacent files |
| True constants | `SCREAMING_SNAKE_CASE` |

## 7. i18n rules

- All **user-visible** strings in client UI must use **`useLanguage()`** from `@/contexts/LanguageContext` and the **`t`** function with stable keys.  
- Do not embed Thai, English, or other copy directly in JSX for production UI.

## 8. Reuse rules

- Search for **existing hooks**, **lib** helpers, and **types** before adding parallel implementations.  
- Align **import paths** with `@/` alias used across the repo.

## 9. Forbidden patterns

- **Business rules** hidden in global layout components.  
- **External API** calls from `'use client'` modules or from components that run in the browser against non-`/api/*` URLs.  
- **Hardcoded** user-facing language strings.  
- **Over-engineered** abstractions (generic “engines”, deep inheritance) not already present in the codebase.
