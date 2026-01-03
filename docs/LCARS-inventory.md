# LCARS Design System Inventory

This document inventories tokens, class primitives, composed components, and JS hooks found in `docs/index.html` for extraction into the library.

**Note:** class names, CSS variables, and JS hooks are captured verbatim from the source.

## 1) Global design tokens (CSS variables)
- `--lcars-black` — core background / deep surface color (#000000).
- `--lcars-white` — pure white (#ffffff).
- `--lcars-orange` — primary LCARS accent (#ff9900).
- `--lcars-purple` — accent/palette purple (#cc99cc).
- `--lcars-red` — danger/red accent (#cc6666).
- `--lcars-blue` — blue accent (#9999cc).
- `--lcars-beige` — beige accent (#ffcc99).
- `--lcars-gray` — neutral mid-gray (#999999).

- `--lcars-dark-1`, `--lcars-dark-2`, `--lcars-dark-3` — darker surface shades (#111111, #222222, #444444).

- `--lcars-font` — primary font family (`"Antonio", sans-serif`).

- Spacing / layout tokens:
  - `--lcars-gutter` — small gutter (5px).
  - `--lcars-gap` — small gap (10px).
  - `--lcars-spacing-xs`, `--lcars-spacing-sm`, `--lcars-spacing-md`, `--lcars-spacing-lg`, `--lcars-spacing-xl` — spacing scale (5px, 8px, 15px, 20px, 30px).

- Border radii:
  - `--lcars-radius-xs` (5px)
  - `--lcars-radius-sm` (14px)
  - `--lcars-radius-md` (20px)
  - `--lcars-radius-lg` (30px)

- Tile sizing tokens:
  - `--lcars-tile-stripe-width` (12px)
  - `--lcars-tile-stripe-width-lg` (15px)
  - `--lcars-tile-min-height` (110px)
  - `--lcars-tile-min-height-lg` (140px)

- Layout primitives:
  - `--sidebar-width` — sidebar column width (160px)
  - `--header-height` — header row height (80px)

- Focus system:
  - `--lcars-focus-outline-width` (3px)
  - `--lcars-focus-outline-color` (defaults to `var(--lcars-white)`)
  - `--lcars-focus-outline-offset` (2px)

- Z-index scale:
  - `--lcars-z-index-dropdown` (1000)
  - `--lcars-z-index-dialog` (2000)
  - `--lcars-z-index-tooltip` (3000)

- Transitions:
  - `--lcars-transition-fast` (0.1s ease-out)
  - `--lcars-transition-normal` (0.2s ease-out)

- Button / component documented variables (component-level variables set inline or by JS):
  - `--cat-color` — category button background (set by JS via `style.setProperty`).
  - `--lcars-button-bg` — button background color (per-component override).
  - `--lcars-button-fg` — button foreground color.
  - `--lcars-button-radius` — button border radius.
  - `--lcars-button-hover-filter` — hover filter for buttons (e.g., `brightness(1.1)`).
  - `--lcars-pin-size` — pin (circular control) size.
  - `--lcars-pin-bg` — pin background color.
  - `--lcars-pin-fg` — pin foreground color.
  - `--tile-color` — per-tile color hook used to set `--lcars-tile-bg` (via inline style).
  - `--lcars-tile-bg`, `--lcars-tile-fg`, `--lcars-tile-stripe-bg` — tile internals.
  - `--shape-color` — LCARS frame color (header/footer/sidebar/elbows); usually derived from `--theme-main`.

## 2) Theme variants (body[data-theme="..."])
- `body[data-theme="laan"]` — defines `--theme-main`, `--shape-color`, `--theme-secondary`.
- `body[data-theme="data"]`
- `body[data-theme="doctor"]`
- `body[data-theme="chapel"]`
- `body[data-theme="spock"]`
- `body[data-theme="seven"]`
- `body[data-theme="mbenga"]`
- `body[data-theme="shran"]`

Each theme sets `--theme-main` and `--shape-color` and computes a `--theme-secondary` used for secondary surfaces (often via `color-mix`).

## 3) LCARS class primitives (one-line purpose)
- `.lcars-app` — root app container; grid layout, global app scope, sets base colors and font.
- `.lcars-app--fullpage` — modifier that makes the app full-viewport and hides overflow.
- `.lcars-frame-segment` — generic frame element (header/footer/sidebar segments), uses `--shape-color`.
- `.lcars-frame-segment--horizontal` — horizontal orientation helper for frame segments.
- `.lcars-frame-segment--left-rounded` — left-side rounded corner variant.

Shell bars:
- `.lcars-header-bar` — header bar primitive, left-rounded corner, contains home button and fill.
- `.lcars-header-bar-home` — large home button branding in header.
- `.lcars-header-bar-fill` — flexible filler inside header.
- `.lcars-header-bar-end-cap` — small end cap visual piece for header.
- `.lcars-footer-bar` — footer bar primitive, contains actions and status display.
- `.lcars-footer-bar-status` — status display region inside footer.
- `.lcars-footer-bar-actions` — action container inside footer.
- `.lcars-footer-bar-button` — footer-specific button styling (uses button primitive colors).
- `.lcars-sidebar-bar` — sidebar column primitive (right-hand rail) with top/bottom caps.
- `.lcars-sidebar-bar-top-cap` — top elbow decorative cap for sidebar.
- `.lcars-sidebar-bar-track` — scrollable track area inside sidebar (hosts categories).
- `.lcars-sidebar-bar-filler` — filler block to push content.
- `.lcars-sidebar-bar-bottom-cap` — bottom elbow cap for sidebar.

Layout helpers:
- `.lcars-elbow` — generic elbow connector (radial gradient cutout) used for top/bottom caps and connectors.
- `.lcars-scroll-container` — scrollable container that hides native scrollbars.
- `.lcars-arrow-btn` — directional arrow button primitive (used in sidebar scroll controls).

Navigation and status:
- `.lcars-status-display` — status region combining label and status info.
- `.lcars-status-text` — status label text.
- `.lcars-status-info` — status info block (CT/BM counts).
- `.lcars-status-label` / `.lcars-status-value` — small label/value elements.

Menus / dropdowns:
- `.lcars-expandable` — container for a trigger + absolute menu; supports `.is-open` and direction modifiers.
- `.lcars-expandable-menu` — the menu element, shown/hidden and positioned via JS & modifiers.
- `.lcars-expandable-item` — a menu item inside expandable.

Sidebar / categories:
- `.lcars-sidebar-btn` — category button primitive that composes `lcars-button` defaults and picks up `--cat-color`.
- `.lcars-sidebar-item` — wrapper for a sidebar item (allows submenu positioning)
- `.lcars-sidebar-submenu` — fixed-position submenu for nested categories.

Breadcrumb:
- `.lcars-breadcrumb` — breadcrumb container (label + path).
- `.lcars-breadcrumb-label` — static label portion.
- `.lcars-breadcrumb-path` — path container for breadcrumb segments.
- `.lcars-breadcrumb-segment` — a single breadcrumb segment (button or current span).
- `.lcars-breadcrumb-separator` — visual separator between breadcrumb segments.

Tiles / content:
- `.lcars-tile` — unified tile primitive (grid with left stripe + content); configurable via `--tile-color`/vars.
- `.lcars-tile--bookmark` — bookmark tile variant (larger, footer row)
- `.lcars-tile--category` — category tile variant (uses `--tile-color` from JS)
- `.lcars-tile--settings` — settings tile variant (button-like)
- `.lcars-tile--danger` — danger variant for tiles (uses `--lcars-red`)
- `.lcars-tile-label` — tile label area (top row)
- `.lcars-tile-meta` — meta area in tile (black background)
- `.lcars-tile-meta--bookmark` — bookmark meta variant with clamped lines
- `.lcars-tile-meta-primary` / `--secondary` — meta text variants
- `.lcars-tile-footer` — footer row for tile actions

Buttons / actions:
- `.lcars-button` — base button primitive (typography, bg/fg tokens via `--lcars-button-*`).
- `.lcars-pill` — rounded pill modifier (sets `--lcars-button-radius`).
- Color utility classes for buttons: `.lcars-color-orange`, `.lcars-color-dark`, `.lcars-color-danger`, `.lcars-color-beige` — set `--lcars-button-bg`/`--lcars-button-fg`.
- Semantic hooks: `.lcars-dialog-action`, `.lcars-settings-action` — empty semantic role classes for contextual styling.
- Footer modifiers: `.lcars-action-btn--small`, `.lcars-action-btn` (used in markup) — layout variants.

Form primitives:
- `.lcars-input` — text input styling primitive.
- `.lcars-select` — select primitive.
- `.lcars-textarea` — textarea primitive.
- `.lcars-form-group` — grouping wrapper for form rows.

Pins (circular controls):
- `.lcars-pin` — circular action control primitive (size/color tokens).
- Size modifiers: `.lcars-pin--sm`, `.lcars-pin--lg` — small/large sizes.
- Color variants: `.lcars-pin--edit`, `.lcars-pin--url`, `.lcars-pin--open`, `.lcars-pin--delete` — color presets.
- Style modifiers: `.lcars-pin--bordered` — adds inset border.
- SVG support: glyph adjustments via `data-glyph="..."` (e.g., `up`, `down`, `plus`, `delete`).

Misc:
- `.main-content` — main content region.
- `.bookmark-grid` — grid list for bookmark tiles.
- `.main-view`, `.main-view.active` — view visibility toggles.
- `.settings-panel`, `.settings-accent`, `.settings-content`, `.settings-section` — settings layout primitives.
- `.settings-tile-grid`, `.settings-tile-group`, `.settings-tile-group-label` — settings tile layout pieces.
- `.settings-subpage`, `.settings-main-grid`, `.settings-subpage-content` — settings navigation scaffolding.
- `.color-grid`, `.color-option` — color palette grid / option (used by color picker)
- `.category-config-list`, `.category-config-row`, `.category-config-row-controls`, `.category-color-swatch` — category config UI primitives

## 4) JS hooks, data- attributes, and inline style expectations
- JS selector classes (root-scoped):
  - `.js-lcars-app` — app root used as query root.
  - `.js-bookmark-grid`, `.js-empty-state`, `.js-category-sidebar`, `.js-sidebar-scroll-up`, `.js-sidebar-scroll-down` — sidebar / grid controls.
  - `.js-bookmarks-view`, `.js-settings-view`, `.js-about-view` — main views.
  - `.js-settings-breadcrumb-path`, `.js-settings-main-grid`, `.js-settings-page-*` — settings navigation.
  - `.js-settings-category-section-main`, `.js-category-config-list`, `.js-add-category-btn-main`, `.js-export-btn-main`, `.js-import-btn-main`, `.js-reset-btn-main` — config actions.
  - `.js-theme-controls-container`, `.js-theme-status-readout`, `.js-settings-active-theme` — theme UI.
  - `.js-add-btn`, `.js-add-menu`, `.js-add-bookmark-btn`, `.js-add-category-btn` — expandable add menu hooks.
  - `.js-bookmark-dialog`, `.js-category-dialog`, `.js-confirm-dialog`, `.js-color-picker-dialog`, `.js-bookmark-form`, `.js-category-form` — dialogs and forms.
  - `.js-title-input`, `.js-description-input`, `.js-url-input`, `.js-landing-category-select`, `.js-import-input`, etc. — form element hooks.

- Inline style expectations / JS-set CSS vars:
  - Category buttons set `--cat-color` via `btn.style.setProperty("--cat-color", cat.color)`.
  - Tiles set `--tile-color` via `tile.style.setProperty("--tile-color", color)`; tile CSS expects `--lcars-tile-bg: var(--tile-color, var(--theme-main))`.
  - Color picker/color-option elements set `style.backgroundColor = color` and may toggle `outline`/`border` to indicate selection.
  - Buttons and other components may rely on `--lcars-button-*` variables being present on the element or inherited.

- Data / aria usage:
  - `data-settings-page` on `.lcars-tile--settings` — used to navigate to sub-pages.
  - `data-glyph` on `.lcars-pin` for icon variants.
  - `aria-*` attributes applied for accessibility (e.g., `aria-live`, `aria-label`, `aria-expanded`, `aria-haspopup`).

## 5) Composed components and the primitives they use
- Header (shell)
  - Uses: `.lcars-header-bar` (frame segment), `.lcars-header-bar-home` (home button), `.lcars-header-bar-fill`, `.lcars-header-bar-end-cap`.
  - Tokens: relies on `--shape-color`, `--lcars-font`, `--lcars-orange` for branding.

- Sidebar (category rail)
  - Uses: `.lcars-sidebar-bar`, `.lcars-elbow` (top/bottom caps), `.lcars-sidebar-bar-track`, `.lcars-scroll-container`, `.lcars-arrow-btn`, `.lcars-sidebar-btn`, `.lcars-sidebar-submenu`.
  - JS: sets `--cat-color` on category buttons; uses `js-*` hooks for scroll controls and keyboard nav.

- Bookmark / Category Grid (main content)
  - Uses: `.bookmark-grid`, list of `.lcars-tile` elements, `.lcars-tile--bookmark`, `.lcars-tile--category`, `.lcars-pin` inside `.lcars-tile-footer`.
  - Tokens: tiles expect `--tile-color` to be set (via inline style) for tile background; uses `--lcars-tile-stripe-width`, `--lcars-tile-min-height`.

- Breadcrumb
  - Uses: `.lcars-breadcrumb`, `.lcars-breadcrumb-path`, `.lcars-breadcrumb-segment`, `.lcars-breadcrumb-separator`.
  - JS renders segments and uses `.is-current` and `aria-current`.

- Expandable / Add Menu
  - Uses: `.lcars-expandable`, `.lcars-button` trigger, `.lcars-expandable-menu`, `.lcars-expandable-item`.
  - JS toggles `.is-open` and manages `aria-expanded` and keyboard behavior.

- Dialogs (Bookmark, Category, Confirm, Color Picker)
  - Uses: native `<dialog>` with `.lcars-dialog-container` outer wrapper and `.lcars-dialog`, `.lcars-dialog-header`, `.lcars-dialog-body`, `.lcars-dialog-footer`.
  - Form primitives: `.lcars-input`, `.lcars-select`, `.lcars-textarea`, `.lcars-form-group`.
  - Focus behavior: `openDialogWithFocusTrap` enforces focus trap; buttons use `.lcars-dialog-action` semantic hook.

- Settings screen (tile-based)
  - Uses: `.settings-panel`, `.settings-accent` (frame), `.settings-content`, `.settings-main-grid`, `.settings-tile-grid`, `.lcars-tile--settings` tiles, `.js-theme-controls-container` for theme buttons.
  - JS sets inline `--tile-color` on tiles.

- Category Config Row (settings)
  - Uses: `.category-config-row`, `.category-color-swatch`, `.category-config-row-controls`, `.lcars-pin` controls (`--lg`, `--bordered`, `--edit`, `--delete`).

## 6) Short recommendations for library extraction
- Export token list (CSS variable names) as part of the design tokens module.
- Provide Theme variants API that toggles `data-theme` on `body` and exposes `--theme-main` / `--shape-color` semantics.
- Implement primitives as small, composable components:
  - `LcarsApp`, `FrameSegment`, `HeaderBar`, `FooterBar`, `SidebarBar`, `Elbow`, `ScrollContainer`, `ArrowBtn`, `Expandable` (with menu), `Tile`, `Breadcrumb`, `Button` (base), `Pin`, `Dialog` (wrapping native dialog), `FormInput` / `Select` / `Textarea`, `ColorGrid`.
- Ensure JS hooks are documented: `--cat-color`, `--tile-color`, `data-glyph`, `data-settings-page`, `js-*` class names used for behavior. The library should provide APIs to set tile/category colors programmatically instead of relying on raw `style.setProperty` when possible.

---

Inventory generated from `docs/index.html` (CSS + markup + inline JS) on inspection.
