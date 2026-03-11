# Cahico ERP 2026 - AI Agent Coding Instructions

## Project Overview

**Cahico ERP 2026** is a Vue 3 + TypeScript + Vite ERP frontend application. It uses Pinia for state management, Vue Router for navigation, and Playwright/Vitest for testing. The app implements a tab-based UI with a header navigation and content panels for managing stock and orders.

## Architecture & Key Components

### Component Structure

- **App.vue**: Root component managing global tabs state (Stock/Orders)
- **Header/**: Logo and tab navigation (fires custom `tabChanged` events)
- **MainPanel/**: Tab content container that conditionally renders Stock or Orders panels
- **Stores/**: Pinia stores using Composition API syntax with `defineStore`

### Data Flow

1. App.vue defines tabs array and passes to Header
2. Tab.vue calls `setTab()` from shared `useTabManager()` composable when clicked
3. MainPanel.vue reads `currentTab` from shared `useTabManager()` composable
4. currentTab state updates trigger v-if conditionals to show/hide panels

**Important**: Tab communication uses shared composable (`src/composables/useTabManager.ts`), NOT custom events. Add routes to `src/router/index.ts` only for URL-based navigation.

## Development Workflow

### Essential Commands

```sh
npm run dev           # Start dev server with HMR
npm run build         # Type-check + minify for production
npm run test:unit     # Run Vitest (jsdom environment)
npm run test:e2e      # Run Playwright tests
npm run lint          # Fix eslint violations
npm run format        # Format code with Prettier
```

### Build Pipeline

- Type checking: `vue-tsc` (not `tsc` - required for .vue files)
- Bundler: Vite with Vue plugin
- Path alias: `@/` → `src/`

### Testing

- Unit tests: Vitest + jsdom (see `src/__tests__/`)
- E2E tests: Playwright (see `e2e/`)
- First e2e run requires: `npx playwright install`

## Code Patterns & Conventions

### Vue Components

- **Setup syntax only**: All components use `<script setup lang="ts">`
- **Styling**: SCSS with `scoped` (prevents style leakage)
- **Reactive data**: Use `ref()` for state, `computed()` for derived values
- **Props validation**: Use `defineProps()` with type and required fields

**Example** (from Tab.vue):

```vue
<script setup lang="ts">
import { useTabManager } from '@/composables/useTabManager'

const { setTab } = useTabManager()

const handleClick = (tabName: string) => {
  setTab(tabName)
}
</script>
```

### Composables

- Use composables for shared state logic (see `src/composables/useTabManager.ts`)
- Composables return reactive refs and action functions
- Import composables with `useComposableName()` in components

**Location**: `src/composables/` - add new composables for cross-component state

### Pinia Stores

- Use Composition API syntax with `defineStore('storeName', () => {...})`
- Return state refs, computed values, and action functions
- Import stores with `useStoreName()` in components

**Location**: `src/stores/` - add new stores here as needed

## Project Setup Details

### TypeScript Configuration

- Multiple configs: `tsconfig.json` (references), `tsconfig.app.json` (app), `tsconfig.vitest.json` (tests), `tsconfig.node.json` (build tools)
- Node requirement: `^20.19.0 || >=22.12.0`

### Dependency Constraints

- Vue: `^3.5.26` (Composition API + <script setup> supported)
- Vite: `^7.3.0`
- No UI frameworks (direct styling with SCSS)

### File Organization

```
src/
  main.ts              # App bootstrap (Pinia + Router)
  App.vue              # Root component
  router/              # Vue Router config (currently empty routes array)
  stores/              # Pinia stores
  composables/         # Shared composables (useTabManager.ts for tab state)
  header/              # Header sub-components
  main-panel/          # Content area sub-components
    stock/             # Stock feature
    orders/            # Orders feature
    bubble-items/      # Reusable bubble components
```

## Common Tasks

### Adding a New Tab/Feature

1. Create feature folder in `src/main-panel/` (e.g., `products/`)
2. Export component from folder (e.g., `Products.vue`)
3. Import in MainPanel.vue and add conditional render: `<Products v-if="currentTab === 'Products'" />`
4. Add tab object to App.vue `tabs` array: `{ name: 'Products' }`

### Adding State Management

1. Create store in `src/stores/newFeature.ts` using Composition API + `defineStore`
2. Import in component: `import { useNewFeatureStore } from '@/stores/newFeature'`
3. Use in template/script: `const store = useNewFeatureStore()`

### Styling Guidelines

- Use SCSS with `scoped` attribute on `<style>` tags
- Variables defined inline (no global theme system currently)
- Responsive layout uses flexbox (no tailwind/bootstrap)

## Avoid Common Pitfalls

- **Don't**: Use `type-check` command directly (breaks on .vue files) - use `npm run type-check` instead
- **Don't**: Create global CSS in components (use scoped styles)
- **Don't**: Add routes to router without URL-based navigation requirements
- **Don't**: Use class syntax for components (all use Composition API)
- **Don't**: Forget to run `npm run lint` before committing (fixes import paths, etc.)
