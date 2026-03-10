# Hertz Thailand – E‑commerce (Car Rental)

Next.js frontend for Hertz Thailand car rental. The app talks only to Next.js API routes; Commerce Suite (CS) integration is used for backend. PWA and multi-locale (EN/TH/ZH) supported.

## Stack

- **Next.js 15** (App Router)
- **React 18**
- **Tailwind CSS**
- **TypeScript**
- **PWA** (@ducanh2912/next-pwa)
- **Google Maps** (locations)

## Prerequisites

- Node.js 20+
- npm

## Environment

Copy `.env.example` to `.env` and set values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Server port (default: **4100** if unset) |
| `CS_API_BASE_URL` | Commerce Suite API base URL (e.g. `http://localhost:3000`) |
| `CS_APP_KEY` | Commerce Suite app key |
| `CS_SECRET_KEY` | Commerce Suite secret key |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key (for Locations page) |

## Install & Run

```bash
npm install
npm run dev
```

- Dev server: **http://localhost:4100** (or the port set by `PORT` in `.env`).

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server (default port 4100) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run generate-location-images` | Generate location images (TSX script) |

## Architecture

- The UI calls only **Next.js API routes** (`/api/*`). No direct backend or payment gateway calls from the client.
- API routes proxy to Commerce Suite when configured; mocks are used when CS is not available.
- Business rules (pricing, promotions, reservations) live in the backend; the frontend handles presentation and flow.

## Layout

- **Mobile** (< 1024px): App-like UI, touch-first, sticky bottom bar, single column.
- **Desktop** (≥ 1024px): Two-column layout with sticky summary panel.

## Project Structure

```
src/
  app/
    (site)/           # Main site routes
    api/              # Next.js API routes (mock → CS)
  components/
    layout/
    booking/
    vehicle/
    checkout/
    account/
    ui/
  lib/
    api/
    i18n/
  types/
scripts/
  postinstall-workbox-patch.js
  generate-location-images.ts
```

## Main Pages

| Route | Description |
|-------|-------------|
| `/` | Home – booking widget (locations, dates) → Search |
| `/search` | Vehicle list (Pay Later / Pay Now) |
| `/vehicle/[groupCode]` | Vehicle detail, specs, CTA to Checkout |
| `/checkout` | Renter/driver info, voucher, confirm |
| `/thank-you` | Booking confirmation |
| `/payment/status`, `/payment-return` | Payment redirect handling |
| `/account/login`, `/account/register`, `/account/forgot-password` | Auth |
| `/account/profile` | Profile |
| `/account/bookings/upcoming`, `/account/bookings/past` | Bookings |
| `/locations` | Locations (map) |
| `/special-offers` | Special offers |
| `/vouchers`, `/vouchers/[id]`, `/voucher-checkout` | Vouchers |
| `/rewards`, `/my-points`, `/my-vouchers` | Rewards & vouchers |
| `/car-rental`, `/vehicle-guide`, `/products-services`, `/drivers` | Info pages |

## Brand

- **Hertz Yellow**: `#FFCC00`
- **Grays**: `#434244`, `#58595B`, `#808285`
- **Font**: Ride / Arial
