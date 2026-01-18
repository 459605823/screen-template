# Agent Context for This Project

Attention AI Agents: This document provides context, conventions, and guidelines for working on this project.

## 1. Tech Stack Setup

- **Core**: Vue 3 (Composition API, `<script setup>`), Vite, TypeScript.
- **Styling**:
  - **UnoCSS**: Primary utility-first CSS framework.
  - **Sass**: For complex custom styles (`.scss`).
  - **Element Plus**: UI Component library (likely used sparingly or for specific controls).
- **Routing**: `vue-router` with **File-based routing** (`unplugin-vue-router`).
- **Utilities**:
  - `VueUse`: Collection of essential Vue composition utilities.
  - `lodash-es`: Utility library.
  - `dayjs`: Date manipulation.
  - `mitt`: Event bus (found in `utils/eventEmitter.ts`).

## 2. Key Development Conventions

### A. Component & API Auto-Import

- **Do NOT manually import** Vue APIs (`ref`, `computed`, `watch`, etc.) or Vue Router APIs.
- **Do NOT manually import** components located in `src/components/`.
- This is handled by `unplugin-auto-import` and `unplugin-vue-components`.
- Refer to `auto-imports.d.ts` and `components.d.ts` for available auto-imports.

### B. Styling

- **UnoCSS**: Prefer using UnoCSS utility classes for layout, margins, padding, and typography.
  - Example: `<div class="flex items-center justify-center text-white">`
  - must refer to `unocss.config.ts` for custom shortcuts or rules.
  - must use unocss `transformerVariantGroup` feature for grouping variants.
- **Scss**: Use `src/styles/` for global variables or mixins.

### C. File System Routing

- Pages are defined in `src/pages/`.
- The file structure in `src/pages/` automatically maps to routes.
- Example: `src/pages/index.vue` -> `/`

### D. Icons

- **SVG Icons**: Placed in `src/assets/svgs/`.
- Usage: Typically via a specifically configured `<SvgIcon name="filename" />` component (check `src/components/SvgIcon.vue` or `vite-plugin-svg-icons` config).

## 3. Folder Structure Insights

- `src/api/`: API definition and `fetch.ts` encapsulator.
- `src/composables/`: Shared logic (Hooks), e.g., `EchartsControl.ts` (chart logic), `infinityScroll.ts`.
- `src/components/`: Reusable Vue components.
- `src/utils/`: Utility functions
- `src/store/`: Common stores for state management.
- `src/types/`: TypeScript type definitions.

## 4. Coding Standards

- **Linter**: ESLint with `@antfu/eslint-config`.
- **Formatting**: Adhere to the existing code style (no semicolons, single quotes, etc., typical of Antfu's config).
- **TypeScript**: Strict typing is encouraged. Avoid `any` where possible.
- **Composition API**: Always use `<script setup lang="ts">`.
