# Hertz Thailand – Car Booking Website (Frontend)

Next.js frontend for Hertz Thailand car rental. Phase 1 uses mock API routes; Commerce Suite (CS) integration is planned for later phases.

## Stack

- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS**
- **TypeScript**

## Architecture

- FE calls only **Next.js API routes** (`/api/*`). No direct CarPro or payment gateway calls.
- API routes use mock handlers now; later they will call CS APIs via `cs_client`.
- Business logic (pricing, promotions, reservations) lives in CS. FE is presentation + orchestration only.

## Layout

- **Mobile** (< 1024px): App-like UI, touch-first, sticky bottom action bar, single column
- **Desktop** (≥ 1024px): 2-column layout with sticky summary panel, same card-based hierarchy

## Project Structure

```
/src
  /app
    /(site)           # Main site routes
    /api              # Next.js API routes (mock → CS)
  /components
    /layout
    /booking
    /vehicle
    /checkout
    /account
    /ui
  /lib
    /api
    /mock
    /config
  /types
```

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

1. **Home** – Booking widget (locations, dates) → Search
2. **Search** – Vehicle list with Pay Later / Pay Now prices
3. **Vehicle** – Detail, specs, inclusions, CTA to Checkout
4. **Checkout** – Renter/driver info, voucher, confirm
5. **Payment status** – Mock payment redirect handling
6. **Booking confirmation** – Reservation details, price breakdown
7. **Account** – Login, Register, Forgot password, Profile, Upcoming/Past bookings (mock)

## Brand

Hertz Yellow (#FFCC00), blacks (#434244, #58595B, #808285), Ride/Arial font.
