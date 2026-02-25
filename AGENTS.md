# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Hertz Thailand car rental frontend — a Next.js 15 (App Router) + React 18 + Tailwind CSS application. All API routes (`/api/*`) return mock data from in-memory stores; no database or external backend is needed.

### Services

| Service | Command | Port |
|---|---|---|
| Dev server | `npm run dev` | 4100 |

### Commands

- **Dev:** `npm run dev` (port 4100)
- **Lint:** `npm run lint`
- **Build:** `npm run build` (currently fails due to a pre-existing lint error in `src/app/(site)/payment/status/page.tsx` — an `<a>` tag used instead of `<Link />`)
- **TypeScript check:** `npx tsc --noEmit`

### Gotchas

- ESLint is not listed in the repo's `package.json` by default. The update script installs `eslint@8` and `eslint-config-next@15` as devDependencies, and creates `.eslintrc.json` with `"extends": "next/core-web-vitals"` if missing. Without these, `npm run lint` prompts interactively (blocking CI/agents).
- `npm run build` fails on lint errors (Next.js runs lint during build). The dev server (`npm run dev`) is unaffected.
- Google Maps API key (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`) is optional; the Locations page map won't render without it, but the rest of the app works fine.
- The PWA service worker is disabled in development mode (`process.env.NODE_ENV === "development"`).
