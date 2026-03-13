# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev          # Start dev server (Vite)
bun run build        # Type-check + build for production
bun run lint         # ESLint with auto-fix
bun run format       # Prettier format src/
bun run type-check   # vue-tsc type checking only

bun run test:unit              # Run all unit tests (Vitest)
bunx vitest run src/__tests__/App.spec.ts  # Run a single test file

bun run build && bun run test:e2e          # E2E tests (requires build first)
bun run test:e2e -- --project=chromium    # E2E on Chromium only
bun run test:e2e -- tests/example.spec.ts # Single E2E file
bun run test:e2e -- --debug               # E2E debug mode
```

## Git Workflow

- Default push target is `dev` branch (exists locally + remote). Never push to `main` unless the user explicitly says "push to prod".
- After changes: open `http://localhost:5173` in Chrome for visual review + run E2E tests before pushing.
- Only push to `main` / deploy to Netlify when the user says "push to prod".

## Architecture

This is a Vue 3 + TypeScript SPA (Vite) for the Cahico jewelry ERP. It combines a customer-facing jewelry store homepage with ERP management panels (stock, orders, materials, contact).

**Navigation model — tab-based within a single route:**
- The `/` route renders `MainPanel.vue`, which uses `useTabManager` to show either the `JewelryHome` component (when `currentTab === ''`) or one of the ERP panels (`Stock`, `Orders`, `Materials`, `Contact`).
- The header nav sets `currentTab` via `useTabManager` rather than navigating to different routes. Only `/login`, `/register`, and `/profile` are separate routes.
- `useTabManager` (`src/composables/useTabManager.ts`) holds a module-level `ref` (not Pinia), acting as singleton shared state across components.

**Supabase + mock mode:**
- `src/lib/supabase.ts` returns `null` if `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are not set (or contain placeholder values).
- All stores (`auth`, `profile`) check `if (!supabase)` and fall back to mock behavior using `localStorage`. This means the app is fully functional without a Supabase project configured.
- Copy `.env.example` to `.env` and fill in real credentials to connect to Supabase.

**Stores (Pinia, Composition API style):**
- `auth` — session management, login (email + Google OAuth), register, logout. Initializes lazily on first router navigation.
- `profile` — `profiles`, `orders`, `payment_methods` tables. All operations are no-ops in mock mode.
- `admin` (`src/stores/admin.ts`) — admin panel config: collections, products, discount codes, gift cards. Gift cards have CRUD + validate/redeem methods. All persisted to localStorage key `cahico_admin_config`.
- `reviews` (`src/stores/reviews.ts`) — product reviews with purchase-gated reviewing. localStorage keys: `cahico_reviews`, `cahico_purchases_{userId}`. Seeds 3 demo reviews on first load. Methods: `addReview`, `canReview`, `hasPurchased`, `addPurchase`, `getAverageRating`, `getReviewCount`.
- `analytics` (`src/stores/analytics.ts`) — mock analytics data generation (~200 orders over 90 days). Reactive `dateRange` ref with date-filtered computed getters. localStorage key: `cahico_analytics`. Provides: `filteredOrders`, `completedOrders`, `pendingOrders`, `averagePurchaseValue`, `totalRevenue`, `topProducts`, `ordersPerDay`, `avgValuePerDay`, `paymentBreakdown`, `shippingBreakdown`, `usersByCountry`, `trafficSources`, `searchTerms`.
- `cart` (`src/stores/cart.ts`) — shopping cart with localStorage persistence.

**Admin Panel (`src/main-panel/admin/`):**
- Tab-based: `collections | products | sales | stock | statistics | settings`
- `AdminPanel.vue` — tab container with `TabKey` type
- `tabs/AdminSalesDiscounts.vue` — discount codes + gift cards (GiftCardForm.vue)
- `tabs/AdminStatistics.vue` — date picker (7/30/90 days, all time) + chart grid
- Stats components in `components/stats/`:
  - `OrdersOverview.vue` — 4 stat cards (completed/pending/revenue/avg order)
  - `TopProductsChart.vue` — horizontal bar chart of top products
  - `TrafficSourcesChart.vue` — colored bar chart with social media SVG icons
  - `PieCharts.vue` — payment + shipping breakdowns with SVG icons in color dots
  - `TimeSeriesCharts.vue` — orders/day + avg value/day vertical bar charts
  - `WorldMapChart.vue` — interactive SVG world map (topojson-client, equirectangular projection) with zoom/drag and hover tooltips
  - `SearchTermsCloud.vue` — top 15 search terms ranked table

**Product Reviews (`src/product/ProductReviews.vue`):**
- Integrated in `ProductDetail.vue` between ProductStory and RelatedProducts
- Star rating selector, conditional states (not authenticated / no purchase / already reviewed / form)
- Purchase tracking called from `CheckoutPage.vue` `completePurchase()`

**i18n:**
- `src/i18n/index.ts` sets up `vue-i18n` with locales: `en`, `fr`, `es`, `pt`, `zh`, `de`. The active locale persists in `localStorage` under key `cahico_locale`. Note: `i18n` is imported in `src/i18n/index.ts` but **not yet registered** in `src/main.ts` — translations are not active app-wide yet.
- Translation keys exist for: `reviews.*`, `admin.tabStatistics`, `admin.giftCard*`, `admin.stats*`

**Dependencies of note:**
- `topojson-client` + `@types/topojson-client` — used by WorldMapChart for SVG map rendering from CDN-hosted world-atlas TopoJSON

**Styling:**
- SCSS with a single shared variables file at `src/styles/_variables.scss`. Import it in component styles with `@use '@/styles/variables' as *;`.
- No CSS framework — all styles are hand-written scoped SCSS per component.
- Font: `DM Sans` (set globally in `App.vue`).
- Brand color: `$color-teal` (`#175976`).
