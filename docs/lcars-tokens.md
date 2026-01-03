LCARS Design Tokens: Public API Contract

This document lists which CSS variables are considered part of the public token API
and which are internal implementation details. Public tokens should remain stable
across minor releases; internal tokens may change without notice.

Public Tokens (stable, consumers may rely on these):
- --lcars-black: core background/ink color
- --lcars-white: core white
- --lcars-orange: primary accent color for LCARS UI
- --lcars-beige: neutral accent used for highlights and variants
- --lcars-red: danger / negative actions
- --lcars-blue: secondary accent used in some components
- --lcars-font: default font-family for LCARS components
- --lcars-radius-xs / --lcars-radius-sm / --lcars-radius-md / --lcars-radius-lg: border radii scale
- --lcars-gap / --lcars-gutter: basic spacing primitives
- --lcars-transition-fast / --lcars-transition-normal: canonical timing tokens
- --lcars-z-index-dropdown / --lcars-z-index-dialog / --lcars-z-index-tooltip: z-index scale
- --theme-main: current theme primary color (set on body or via data-theme)
- --shape-color: color used for LCARS frame elements (header/sidebar/footer)
- --theme-secondary: derived secondary accent used across components

Internal Tokens (not guaranteed stable):
- --lcars-dark-* series: surface shades used internally; subject to change
- --lcars-tile-* tokens: tile-specific sizing variables
- --lcars-header-bar-* / --lcars-footer-bar-* / --sidebar-width: layout helpers used internally
- --lcars-button-* / --lcars-pin-* / --lcars-expandable-*: component-level props that may move to component-scoped CSS

Guidance:
- Prefer depending on `--theme-main`, `--shape-color`, and `--theme-secondary` for theme-aware styling.
- For layout-critical or component-specific adjustments, prefer component props or using classes scoped to LCARS rather than relying on internal tokens.

This was created after extracting tokens into `src/lib/styles/lcars-tokens.css` and
theme variants into `src/lib/styles/lcars-themes.css`.
