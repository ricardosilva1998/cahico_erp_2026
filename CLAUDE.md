# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Vite)
npm run build        # Type-check + build for production
npm run lint         # ESLint with auto-fix
npm run format       # Prettier format src/
npm run type-check   # vue-tsc type checking only

npm run test:unit              # Run all unit tests (Vitest)
npx vitest run src/__tests__/App.spec.ts  # Run a single test file

npm run build && npm run test:e2e          # E2E tests (requires build first)
npm run test:e2e -- --project=chromium    # E2E on Chromium only
npm run test:e2e -- tests/example.spec.ts # Single E2E file
npm run test:e2e -- --debug               # E2E debug mode
```

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

**i18n:**
- `src/i18n/index.ts` sets up `vue-i18n` with locales: `en`, `fr`, `es`, `pt`, `zh`, `de`. The active locale persists in `localStorage` under key `cahico_locale`. Note: `i18n` is imported in `src/i18n/index.ts` but **not yet registered** in `src/main.ts` — translations are not active app-wide yet.

**Styling:**
- SCSS with a single shared variables file at `src/styles/_variables.scss`. Import it in component styles with `@use '@/styles/variables' as *;`.
- No CSS framework — all styles are hand-written scoped SCSS per component.
- Font: `DM Sans` (set globally in `App.vue`).
- Brand color: `$color-teal` (`#175976`).
