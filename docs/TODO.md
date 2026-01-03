docs/TODO.md
============

LCARS Design System Extraction Plan
-----------------------------------

Goal: Extract the LCARS design system from `docs/index.html` into a reusable, documented Svelte 5 + TypeScript component library, while preserving current behavior and accessibility.

Conventions:
- "Depends on" means the parent task should be completed first.
- Tasks are intentionally small and AI‑friendly.
- Groups: tokens, primitives, components, behaviors, docs, and cleanup.

---

## 0. Dependency Tree (High‑Level)

This tree shows main dependency relationships. Leaf tasks are more implementation‑heavy; higher nodes are foundations.

- 1. Discovery & Alignment  
  - 1.1 Inventory Existing LCARS Tokens & Primitives

- 2. Design Tokens Layer  
  - 2.1 Extract LCARS CSS Variables into Library Stylesheet  
  - 2.2 Extract Theme Variant Rules  
  - 2.3 Define Public Tokens API Contract  
    - depends on: 2.1, 2.2

- 3. Layout & Shell Primitives  
  - 3.1 Extract `.lcars-app` Container Styles  
    - depends on: 2.1  
  - 3.2 Extract Shell Bar & Frame Segment Primitives  
    - depends on: 3.1  
  - 3.3 Extract Elbow & Scroll Container Primitives  
    - depends on: 3.2

- 4. Core Component Primitives (CSS‑First)  
  - 4.1 Extract Focus System Styles  
    - depends on: 2.1  
  - 4.2 Extract Base Button & Color Utility Classes  
    - depends on: 2.1, 4.1  
  - 4.3 Extract Arrow Button Primitive  
    - depends on: 3.3, 4.2  
  - 4.4 Extract Tile Primitive  
    - depends on: 2.1, 3.1  
  - 4.5 Extract Breadcrumb Primitive  
    - depends on: 2.1, 4.1  
  - 4.6 Extract Form Control Primitives  
    - depends on: 4.1  
  - 4.7 Extract Dialog Primitive Styles  
    - depends on: 3.1, 4.2  
  - 4.8 Extract Pin Primitive  
    - depends on: 2.1, 4.1  

- 5. App‑Level Components (Svelte 5)  
  - 5.1 Create `<LcarsShell>` Component  
    - depends on: 3.1, 3.2  
  - 5.2 Create `<LcarsHeaderBar>` Component  
    - depends on: 5.1, 4.1, 4.2  
  - 5.3 Create `<LcarsSidebar>` and Scroll Controls  
    - depends on: 3.3, 4.3, 5.1  
  - 5.4 Create `<LcarsBreadcrumb>` Component  
    - depends on: 4.5  
  - 5.5 Create `<LcarsTile>` Component  
    - depends on: 4.4  
  - 5.6 Create `<LcarsButton>` / `<LcarsFooterButton>` Components  
    - depends on: 4.2, 4.1  
  - 5.7 Create `<LcarsDialog>` Component  
    - depends on: 4.7, 5.6  
  - 5.8 Create `<LcarsPin>` Component  
    - depends on: 4.8  

- 6. Theming & Tokens Integration  
  - 6.1 Add Theme Management API (Non‑UI)  
    - depends on: 2.2  
  - 6.2 Integrate Theme Management in Docs App  
    - depends on: 6.1  

- 7. Accessibility & Interaction Checks  
  - 7.1 A11y Audit for Extracted Components  
    - depends on: 5.1–5.8  
  - 7.2 Apply A11y Fixes Identified in Audit  
    - depends on: 7.1  

- 8. Documentation & Testing  
  - 8.1 Write Component‑Level Docs for LCARS Primitives  
    - depends on: 5.1–5.8, 2.3  
  - 8.2 Add Unit/Component Tests for LCARS Components  
    - depends on: 5.1–5.8  
  - 8.3 Add Minimal E2E Coverage for Integration  
    - depends on: 6.2, 5.3, 5.7  

- 9. Cleanup & Deprecation  
  - 9.1 Remove Redundant Inline Styles From `docs/index.html`  
    - depends on: 2.x, 3.x, 4.x  
  - 9.2 Mark Internal Classes As Private (If Needed)  
    - depends on: 2.3, 5.x  

---

## 1. Discovery & Alignment

### 1.1 [ds9-1] Inventory Existing LCARS Tokens & Primitives

- **Title**: Inventory LCARS tokens and primitives from `docs/index.html`  
- **Description**:  
  Go through `docs/index.html` CSS and markup to list all design system pieces that should become part of the library:  
  - Global design tokens (colors, spacing, radii, typography, transitions, z‑index, focus).  
  - Theme variants (`body[data-theme=…]`).  
  - Layout primitives: `.lcars-app`, `.lcars-frame-segment`, header/footer/sidebar bars, elbows, scroll container.  
  - UI primitives: buttons, tiles, breadcrumb, scroll arrows, pins, form controls, dialogs, settings tiles, etc.  
  Capture class names, CSS variables used, and any JS hooks (`js-*` classes, inline style expectations like `--tile-color`, `--cat-color`).
- **Expectations**:  
  - A markdown note listing:  
    - All token variables (`--lcars-*`, `--theme-*`, layout vars) with short descriptions.  
    - All LCARS class “primitives” with a one‑line purpose.  
    - All “composed” components and which primitives they use.  
  - No code changes; documentation/inventory only.

---

## 2. Design Tokens Layer

### 2.1 [ds9-2] Extract LCARS CSS Variables into Library Stylesheet

- **Title**: Extract LCARS design tokens into `src/lib/styles/lcars-tokens.css`  
- **Description**:  
  Move the `:root` design system section from `docs/index.html` into a dedicated library stylesheet (e.g., `src/lib/styles/lcars-tokens.css`). Keep exactly the same variable names and values, only adjusting to be library‑friendly (e.g., comments, grouping).
- **Expectations**:  
  - New file `src/lib/styles/lcars-tokens.css` containing:  
    - All global `--lcars-*` and layout‑level tokens currently in `:root`.  
    - Existing comments kept or lightly clarified.  
  - `docs/index.html` updated to import this stylesheet (or reference built output) instead of redefining tokens inline.  
  - No behavior or visual regression when serving the docs page.

### 2.2 [ds9-3] Extract Theme Variant Rules

- **Title**: Extract LCARS theme variants from `body[data-theme=…]`  
- **Description**:  
  Move the `body[data-theme="laan" | "data" | "doctor" | "chapel" | "spock" | "seven" | "mbenga" | "shran"]` rules into a library stylesheet (e.g., `src/lib/styles/lcars-themes.css`) while preserving variable semantics (`--theme-main`, `--shape-color`, `--theme-secondary`).
- **Expectations**:  
  - New file `src/lib/styles/lcars-themes.css` containing all theme rules, unchanged in behavior.  
  - Clear comments documenting each theme’s intended identity.  
  - `docs/index.html` updated to consume the extracted theme stylesheet.  
  - Theme switching still works via `data-theme`.

### 2.3 [ds9-4] Define Public Tokens API Contract

- **Title**: Define public LCARS token API and stability guarantees  
- **Description**:  
  Decide which CSS variables are part of the public design system contract vs internal implementation details. Document which variables consumers may rely on and which might change. This is documentation only.
- **Expectations**:  
  - Section in `docs/TODO.md` or `docs/lcars-tokens.md` listing:  
    - Public tokens (names + one‑line purpose).  
    - Internal tokens not guaranteed stable.  
  - No code changes, but this informs how later tasks expose things.

_Depends on: 2.1, 2.2_

---

## 3. Layout & Shell Primitives

### 3.1 [ds9-5] Extract `.lcars-app` Container Styles

- **Title**: Extract LCARS app container styles into library CSS  
- **Description**:  
  Move `.lcars-app` and `.lcars-app--fullpage` styles from `docs/index.html` into a library stylesheet (e.g., `src/lib/styles/lcars-shell.css`). Keep the same grid layout, gap, padding, and color usage.
- **Expectations**:  
  - `.lcars-app` and `.lcars-app--fullpage` styles defined in a library CSS file.  
  - `docs/index.html` updated to use the shared CSS without behavior changes.  
  - No introduction of JS dependencies; purely CSS/layout extraction.

_Depends on: 2.1_

### 3.2 [ds9-6] Extract Shell Bar & Frame Segment Primitives

- **Title**: Extract LCARS frame segment and bar primitives  
- **Description**:  
  Move CSS for:  
  - `.lcars-frame-segment`, `.lcars-frame-segment--horizontal`, `.lcars-frame-segment--left-rounded`  
  - `.lcars-header-bar`, `.lcars-header-bar-home`, `.lcars-header-bar-fill`, `.lcars-header-bar-end-cap`  
  - `.lcars-footer-bar` and related status/action elements  
  - `.lcars-sidebar-bar` (base layout), `.lcars-sidebar-bar-top-cap`, `.lcars-sidebar-bar-track`, `.lcars-sidebar-bar-filler`, `.lcars-sidebar-bar-bottom-cap`  
  into reusable library CSS, keeping structure and semantics intact.
- **Expectations**:  
  - Shell primitives live in a library stylesheet (may reuse `lcars-shell.css` or a dedicated file).  
  - All class names remain unchanged; only their location moves.  
  - `docs/index.html` retains visual layout identical to current state.

_Depends on: 3.1_

### 3.3 [ds9-7] Extract Elbow & Scroll Container Primitives

- **Title**: Extract LCARS elbow and scroll container primitives  
- **Description**:  
  Centralize CSS for:  
  - `.lcars-elbow` and its orientation overrides.  
  - `.lcars-scroll-container` (scrollbar hiding, overflow behavior).  
  - Sidebar‑specific composition of `.lcars-scroll-container` within `.lcars-sidebar-bar-track`.
- **Expectations**:  
  - Library stylesheet defines these primitives clearly grouped with comments.  
  - Docs page uses the extracted styles and behaves the same (scrolling, elbows).  
  - No changes to JS logic; CSS relocation only.

_Depends on: 3.2_

---

## 4. Core Component Primitives (CSS‑First)

### 4.1 [ds9-8] Extract Focus System Styles

- **Title**: Extract LCARS focus system and helper classes  
- **Description**:  
  Move:  
  - Focus variables (`--lcars-focus-outline-*`) and  
  - Focus styles for `.lcars-app :focus-visible`, `.lcars-dialog-container :focus-visible`, `.lcars-focus-outline`, `.lcars-pill:focus-visible`, `.lcars-input:focus-visible`, `.lcars-select:focus-visible`, `.lcars-textarea:focus-visible`, `.category-config-btn:focus-visible`  
  into a centralized library CSS module (e.g., `lcars-focus.css`), ensuring accessible, consistent focus styling.
- **Expectations**:  
  - Focus system defined in one place, with comments explaining scope and a11y rationale.  
  - Docs continue to show the same focus behavior.  
  - No change to focusable markup or JS; CSS only.

_Depends on: 2.1_

### 4.2 [ds9-9] Extract Base Button & Color Utility Classes

- **Title**: Extract LCARS button primitive and color utility classes  
- **Description**:  
  Move CSS for:  
  - `.lcars-button`, `.lcars-pill`  
  - `.lcars-color-orange`, `.lcars-color-dark`, `.lcars-color-danger`, `.lcars-color-beige`  
  - `.lcars-dialog-action`, `.lcars-settings-action` (semantic hooks)  
  into a library stylesheet (e.g., `lcars-buttons.css`). Ensure hover/filter behavior and typography match current behavior.
- **Expectations**:  
  - Library CSS defines reusable button primitives and color utilities.  
  - Docs buttons still render identically.  
  - No Svelte components yet; styling extraction only.

_Depends on: 2.1, 4.1_

### 4.3 [ds9-10] Extract Arrow Button Primitive

- **Title**: Extract LCARS arrow button primitive  
- **Description**:  
  Centralize CSS for `.lcars-arrow-btn` and its hover/focus/disabled SVG styles into the library. Keep configuration via CSS custom properties (`--lcars-arrow-btn-*`).
- **Expectations**:  
  - Styles for `.lcars-arrow-btn` live in library CSS.  
  - Scroll buttons in the sidebar still behave and look the same.  
  - SVG sprite usage remains as in docs (no change in HTML yet).

_Depends on: 3.3, 4.2_

### 4.4 [ds9-11] Extract Tile Primitive

- **Title**: Extract LCARS tile primitive and variants  
- **Description**:  
  Move CSS for `.lcars-tile` and variants (`--bookmark`, `--category`, `--settings`, `--danger`) plus sub‑components (`.lcars-tile-label`, `.lcars-tile-label--bookmark`, `.lcars-tile-meta`, `.lcars-tile-meta--bookmark`, `.lcars-tile-meta-*`, `.lcars-tile-footer`) into the library.
- **Expectations**:  
  - Library CSS defines a generic tile primitive with documented custom properties (`--lcars-tile-bg`, `--tile-color`, etc.).  
  - Bookmark and settings tiles still render exactly the same in docs.  
  - No Svelte components yet; this is CSS extraction only.

_Depends on: 2.1, 3.1_

### 4.5 [ds9-12] Extract Breadcrumb Primitive

- **Title**: Extract LCARS breadcrumb primitive and variants  
- **Description**:  
  Move CSS for `.lcars-breadcrumb`, `.lcars-breadcrumb-label`, `.lcars-breadcrumb-path`, `.lcars-breadcrumb-segment`, `.lcars-breadcrumb-separator`, `.lcars-breadcrumb--settings`, including focus styles and modifiers (`.is-current`, `.is-root`), into library CSS.
- **Expectations**:  
  - Breadcrumb visual semantics preserved.  
  - Configuration via CSS variables documented in comments.  
  - Settings breadcrumb variant continues to look and behave the same.

_Depends on: 2.1, 4.1_

### 4.6 [ds9-13] Extract Form Control Primitives

- **Title**: Extract LCARS form input/select/textarea primitives  
- **Description**:  
  Move CSS for `.lcars-input`, `.lcars-select`, `.lcars-textarea`, `.js-url-protocol` into library CSS. Ensure these are independent, reusable primitives with LCARS look and feel.
- **Expectations**:  
  - Forms in settings dialogs keep their current styling.  
  - Focus behavior remains consistent with focus system.  
  - No changes to markup or JS; CSS only.

_Depends on: 4.1_

### 4.7 [ds9-14] Extract Dialog Primitive Styles

- **Title**: Extract LCARS dialog primitive styles  
- **Description**:  
  Centralize CSS for:  
  - `.lcars-dialog-container`, `.lcars-dialog-container::backdrop`  
  - `.lcars-dialog`, `.lcars-dialog-header`, `.lcars-dialog-title`, `.lcars-dialog-meta`  
  - `.lcars-dialog-body`, `.lcars-dialog-footer`  
  - Color picker overrides (`.js-color-picker-dialog` and descendants)  
  and document how they compose with the base button primitive.
- **Expectations**:  
  - Dialog appearance unchanged in docs.  
  - Dialog styling defined as a reusable primitive in library CSS.  
  - A brief comment describing expectations for markup.

_Depends on: 3.1, 4.2_

### 4.8 [ds9-15] Extract Pin Primitive

- **Title**: Extract LCARS pin primitive and variants  
- **Description**:  
  Move CSS for `.lcars-pin`, size modifiers (`--sm`, `--lg`), color variants (`--edit`, `--url`, `--open`, `--delete`), and SVG support rules into library CSS. Preserve hover/focus interactions.
- **Expectations**:  
  - Pins in tiles and settings keep current visuals.  
  - Custom props documented (e.g., `--lcars-pin-size`, `--lcars-pin-bg`, `--lcars-pin-fg`).  
  - No Svelte yet; pure CSS extraction.

_Depends on: 2.1, 4.1_

---

## 5. App‑Level Components (Svelte 5)

### 5.1 [ds9-16] Create `<LcarsShell>` Component

- **Title**: Create Svelte `<LcarsShell>` layout component  
- **Description**:  
  Create a Svelte component (e.g., `src/lib/layout/LcarsShell.svelte`) that:  
  - Applies `.lcars-app` and optional `.lcars-app--fullpage`.  
  - Exposes snippet props for `header`, `sidebar`, and `children` (main content).  
  - Does not hardcode "ZANDER" or any app‑specific strings.
- **Expectations**:  
  - Component uses `$props()` and snippets per repo guidelines.  
  - Showcase usage updated to consume `<LcarsShell>` while preserving layout.  
  - No theming logic yet, just structure.

_Depends on: 3.1, 3.2_

### 5.2 [ds9-17] Create `<LcarsHeaderBar>` Component

- **Title**: Create Svelte `<LcarsHeaderBar>` component  
- **Description**:  
  Encapsulate `.lcars-header-bar` and its contents as a Svelte component that:
  - Accepts snippet props for a “home” area and optional trailing content.  
  - Exposes props for `aria-label` of the home button or region.
- **Expectations**:  
  - Component reuses existing CSS classes; no breaking changes to class names.  
  - Docs app or showcase updated to render header through this component.  
  - Accessibility attributes (labels, focus) preserved.

_Depends on: 5.1, 4.1, 4.2_

### 5.3 [ds9-18] Create `<LcarsSidebar>` and Scroll Controls

- **Title**: Create Svelte `<LcarsSidebar>` component with scroll controls  
- **Description**:  
  Wrap `.lcars-sidebar-bar`, `.lcars-elbow`, `.lcars-sidebar-bar-track`, arrow buttons, and scroll container into reusable Svelte components, e.g.:  
  - `<LcarsSidebar>` for the full aside.  
  - `<LcarsSidebarScrollArea>` snippet for categories.  
  Respect current keyboard and pointer behavior, delegating scroll logic to props or events.
- **Expectations**:  
  - Existing logic that injects categories can integrate without major changes.  
  - Visual behavior (scroll up/down controls, filler) unchanged.  
  - Accessible names and roles maintained or improved.

_Depends on: 3.3, 4.3, 5.1_

### 5.4 [ds9-19] Create `<LcarsBreadcrumb>` Component

- **Title**: Create Svelte `<LcarsBreadcrumb>` component  
- **Description**:  
  Provide a component encapsulating `.lcars-breadcrumb` and its segments, with Svelte props for:  
  - `label` (e.g., “LOCATION”).  
  - An array of segments with `label`, `isCurrent`, and optional click handler/event.  
  Support the settings variant via a boolean or variant prop.
- **Expectations**:  
  - Existing bookmark and settings breadcrumbs ported to the component.  
  - Keyboard and screen‑reader behavior equivalent or improved.  
  - Typed props and snippet props (for custom segment rendering, if needed).

_Depends on: 4.5_

### 5.5 [ds9-20] Create `<LcarsTile>` Component

- **Title**: Create Svelte `<LcarsTile>` component with variants  
- **Description**:  
  Implement a Svelte component mapping to `.lcars-tile` primitives with props for:  
  - `variant` (`bookmark`, `category`, `settings`, `danger`).  
  - `label`, optional meta primary/secondary text.  
  - Optional footer snippet for actions.  
  Allow `--tile-color` customization via style or CSS class.
- **Expectations**:  
  - Bookmarks and settings tiles in docs migrate to `<LcarsTile>` usage.  
  - Component remains themable via CSS variables.  
  - Accessibility: clickable tile vs button semantics clarified (role/button vs link).

_Depends on: 4.4_

### 5.6 [ds9-21] Create `<LcarsButton>` / `<LcarsFooterButton>` Components

- **Title**: Create LCARS button components  
- **Description**:  
  Create Svelte components wrapping:  
  - `.lcars-button` plus color utilities.  
  - `.lcars-footer-bar-button` specialized footer actions.  
  Expose props for:  
  - `variant` (orange, dark, danger, beige).  
  - `size` (normal, small).  
  - `as` or tag selection (`button`/`a`).
- **Expectations**:  
  - Footer actions and other buttons in docs migrate to these components.  
  - Focus and hover remain accessible and visible.  
  - Typed click events and accessible labels.

_Depends on: 4.2, 4.1_

### 5.7 [ds9-22] Create `<LcarsDialog>` Component

- **Title**: Create Svelte `<LcarsDialog>` component wrapping native `<dialog>`  
- **Description**:  
  Implement a rune‑based component that:  
  - Wraps native `<dialog>` with `.lcars-dialog-container` and `.lcars-dialog` structure.  
  - Provides snippet props for `header`, `body`, `footer`.  
  - Offers props/events for open/close state and escape handling.
- **Expectations**:  
  - Existing dialogs in docs ported to `<LcarsDialog>`.  
  - Focus trapping and keyboard interaction remain usable and accessible.  
  - No top‑level DOM access; use Svelte runes patterns.

_Depends on: 4.7, 5.6_

### 5.8 [ds9-23] Create `<LcarsPin>` Component

- **Title**: Create Svelte `<LcarsPin>` component  
- **Description**:  
  Wrap `.lcars-pin` styles into a component with props:  
  - `size` (`sm`, `lg`, default).  
  - `variant` (`edit`, `url`, `open`, `delete`).  
  - `glyph` to choose correct SVG child (icon mapping).
- **Expectations**:  
  - Bookmarks, category config, and other pin uses migrate to `<LcarsPin>`.  
  - Click events and ARIA labels configurable via props.  
  - Visual behavior unchanged.

_Depends on: 4.8_

---

## 6. Theming & Tokens Integration

### 6.1 [ds9-24] Add Theme Management API (Non‑UI)

- **Title**: Create LCARS theme management module  
- **Description**:  
  Add a TypeScript module that:
  - Exposes a typed list of available themes (names + IDs).  
  - Provides helpers to apply/remove `data-theme` attribute on `document.body` in an SSR‑safe way (e.g. via `onMount` or consumer code).
- **Expectations**:  
  - No direct DOM calls at module top‑level; SSR‑safe.  
  - Existing docs theme toggle logic can call into this helper instead of duplicating constants.  
  - Types ensure theme IDs stay in sync with CSS.

_Depends on: 2.2_

### 6.2 [ds9-25] Integrate Theme Management in Docs App

- **Title**: Wire docs theme controls to theme management API  
- **Description**:  
  Update docs theme selector code to use the new theme management module instead of direct `data-theme` string usage and ad‑hoc constants.
- **Expectations**:  
  - No behavior change; users can still switch between all themes.  
  - Theme names and IDs maintained in one place.  
  - Minimal JS diff; focus on wiring, not refactor.

_Depends on: 6.1_

---

## 7. Accessibility & Interaction Checks

### 7.1 [ds9-26] A11y Audit for Extracted Components

- **Title**: Perform accessibility audit of LCARS primitives and components  
- **Description**:  
  Review extracted components for keyboard access, focus visibility, ARIA usage, and color contrast. Identify any regressions or missing semantics introduced during extraction.
- **Expectations**:  
  - Short checklist documenting:  
    - Keyboard flows for sidebar, dialogs, breadcrumbs, tiles, and buttons.  
    - Focus outlines visible and consistent.  
    - Any contrast issues or missing ARIA attributes.  
  - No code changes yet; this task just identifies issues.

_Depends on: 5.1–5.8_

### 7.2 [ds9-27] Apply A11y Fixes Identified in Audit

- **Title**: Implement accessibility fixes from audit  
- **Description**:  
  Address findings from the previous task: adding ARIA attributes, adjusting roles, fine‑tuning focus styles, or keyboard handlers where necessary.
- **Expectations**:  
  - Updated components pass the documented checks.  
  - No regressions in visual design.  
  - Changes are minimal and justified by audit notes.

_Depends on: 7.1_

---

## 8. Documentation & Testing

### 8.1 [ds9-28] Write Component‑Level Docs for LCARS Primitives

- **Title**: Document each public LCARS component and primitive  
- **Description**:  
  For each public Svelte component and key CSS primitive, create documentation pages describing:  
  - Purpose and when to use it.  
  - Props/variants, snippet props, and events.  
  - Relevant CSS variables and styling hooks.  
  - Accessibility considerations and recommended patterns.
- **Expectations**:  
  - One doc per public component under `docs/components/` or co‑located per repo guidelines.  
  - Examples using current LCARS theme.  
  - No code changes; docs only.

_Depends on: 5.1–5.8, 2.3_

### 8.2 [ds9-29] Add Unit/Component Tests for LCARS Components

- **Title**: Add unit/component tests for LCARS components  
- **Description**:  
  Create Vitest tests verifying:  
  - Correct rendering of core structure and class names.  
  - Props and variant behavior (e.g., tile variants, button colors).  
  - Basic interaction (click events, open/close for dialogs, breadcrumb segment clicks).
- **Expectations**:  
  - New tests in locations consistent with repo patterns.  
  - `pnpm test:unit` passes.  
  - Tests focus on core behavior, not exhaustive visual details.

_Depends on: 5.1–5.8_

### 8.3 [ds9-30] Add Minimal E2E Coverage for Integration

- **Title**: Add Playwright E2E tests for LCARS docs app  
- **Description**:  
  Add a small set of Playwright tests covering:  
  - Theme switching.  
  - Sidebar navigation interactions.  
  - Opening and closing a dialog.
- **Expectations**:  
  - Tests live under `e2e/` consistent with existing pattern.  
  - No flakiness (no arbitrary sleeps).  
  - `pnpm test:e2e` passes locally.

_Depends on: 6.2, 5.3, 5.7_

---

## 9. Cleanup & Deprecation

### 9.1 [ds9-31] Remove Redundant Inline Styles From `docs/index.html`

- **Title**: Remove inline LCARS CSS duplicated in library  
- **Description**:  
  Once all CSS primitives are extracted and used from the library, delete or drastically simplify embedded `<style>` in `docs/index.html`, leaving only page‑specific overrides if necessary.
- **Expectations**:  
  - `docs/index.html` mostly references shared CSS; only very page‑specific styles remain inline (if any).  
  - Visual behavior unchanged.  
  - All removed CSS is now sourced from library files.

_Depends on: 2.x, 3.x, 4.x_

### 9.2 [ds9-32] Mark Internal Classes As Private (If Needed)

- **Title**: Mark internal LCARS classes as private/non‑API  
- **Description**:  
  For any classes that should not be part of the public API (e.g., `js-*` hooks, temporary layout helpers), document them as internal and avoid exporting or documenting them as stable surface.
- **Expectations**:  
  - Comments or docs clearly indicate which classes/selectors/helpers are internal.  
  - Public API section updated to only include intended primitives and Svelte components.  
  - No code changes beyond comments or minor compatibility‑preserving renames, if any.

_Depends on: 2.3, 5.x_
