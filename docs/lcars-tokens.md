LCARS Design Tokens — Public API & Stability Guarantees

Purpose

This document defines the public LCARS token API and the stability guarantees we make to consumers. It describes which CSS variables are part of the design system contract (stable) and which variables are internal implementation details (may change without bumping major version).

Scope

- Audience: library consumers and maintainers who need to theme or rely on stable styling hooks.
- This is documentation-only: no code or API changes are included here.
- The tokens cover color, spacing, typography, elevation, and a small set of layout/shell primitives used by the components.

Stability policy (summary)

- Public tokens (listed below) are part of the public design-system contract. We guarantee their names and meaning are stable across minor and patch releases. Breaking changes to public tokens require an explicit semver-major bump and migration notes.
- Internal tokens (listed below) are implementation details used inside components. They may be renamed, removed, or reorganized at any time without a semver-major bump.
- Where possible, prefer consuming the high-level public token names rather than internal low-level tokens.

How to consume tokens

- Use the `var(--lcars-...)` names listed under "Public tokens".
- Do not depend on internal token names, because they are free to change.
- If you need a token that doesn't exist in the public list, open an issue requesting a stable token and rationale; do not read internal tokens from the library internals.

Public tokens (stable)

Each token below is documented as: `--lcars-<category>-<name>` — one-line purpose.

- `--lcars-color-primary` — Primary LCARS brand color used for key accents and interactive controls.
- `--lcars-color-primary-contrast` — Text/icon color intended to be used on `--lcars-color-primary` backgrounds (ensures legible contrast).
- `--lcars-color-surface` — Default surface/background color for panels and containers.
- `--lcars-color-surface-contrast` — Text/icon color intended for `--lcars-color-surface` surfaces.
- `--lcars-color-muted` — Muted color for de-emphasized text and UI elements.
- `--lcars-color-danger` — Accent color for destructive or error states.
- `--lcars-color-success` — Accent color for success/positive states.
- `--lcars-gap-xs` — Extra-small baseline spacing unit (e.g., 4px).
- `--lcars-gap-sm` — Small baseline spacing unit (e.g., 8px).
- `--lcars-gap-md` — Medium baseline spacing unit (e.g., 16px).
- `--lcars-gap-lg` — Large baseline spacing unit (e.g., 24px).
- `--lcars-font-family` — Primary font stack for LCARS components.
- `--lcars-font-size-base` — Base font-size used for body text in components.
- `--lcars-font-weight-regular` — Primary font weight used for body text.
- `--lcars-border-radius` — Default border radius for UI surfaces.
- `--lcars-elevation-1` — Box-shadow or elevation token for low elevation surfaces.
- `--lcars-elevation-2` — Box-shadow token for medium elevation surfaces.
- `--lcars-shell-width` — Preferred width for main shell/navigation elements (layout primitive).
- `--lcars-shell-gap` — Gap used between shell zones (layout primitive).

Notes on public tokens

- We intentionally expose high-level tokens (colors, spacing, typography, elevation, shell primitives). These are stable primitives recommended for consumer theming.
- Where a token represents a color pairing (e.g., `*-contrast`), consumers should use the pair to ensure accessible contrast.
- Units (px, rem) and specific numeric values are implementation details; we guarantee only the token names and semantic purpose. Consumers should not rely on exact numeric values (except for layout primitives where practical).

Internal tokens (unstable)

The following variables are used internally by the library and are NOT guaranteed stable. They may be renamed, removed, or their semantics changed.

- `--lcars-internal-surface-muted` — internal variant of surface used for subtle backgrounds.
- `--lcars-internal-accent-1` — internal accent shade derived from primary.
- `--lcars-internal-button-padding` — internal button padding used by the component implementation.
- `--lcars-internal-focus-ring` — internal focus ring style.
- `--lcars-internal-transition-fast` — internal transition timing used by animations.

Guidance for maintainers

- When adding a new token that consumers might need to rely on, add it to the Public tokens section and document its purpose, recommended usage, and accessibility notes.
- If a token is only used for internal composition and not intended for consumers, use the `--lcars-internal-...` prefix to make the distinction explicit.
- Avoid proliferating public tokens for one-off internal needs. Instead, prefer a small, well-documented public surface.

Layout & Shell primitives (context)

- The LCARS shell/layout primitives are a small, stable subset of tokens consumers may use to align external layout with the library's shell: `--lcars-shell-width`, `--lcars-shell-gap`, and `--lcars-font-size-base`.
- These are part of the public contract because they influence page-level composition.

Accessibility considerations

- Public color tokens that affect foreground/background relationships (e.g., `--lcars-color-primary` + `--lcars-color-primary-contrast`) are chosen so component defaults meet contrast guidelines. When consumers override these tokens, they become responsible for maintaining accessible contrast.
- Document in component docs when a component relies on a pair of tokens for accessible contrast (e.g., a button uses `--lcars-color-primary` as background and `--lcars-color-primary-contrast` for text).

Migration and deprecation policy

- To change or remove a public token, follow the project's semver policy: propose the change, add a migration guide, and release it as a major version.
- For tokens that are no longer needed but still public, prefer adding a deprecation notice in docs and keep the token in place for at least one major cycle before removal.

Where this lives

- Consumers should reference this file at `docs/lcars-tokens.md` for the authoritative list of public tokens.
- Component-level docs must reference which public tokens they rely on.

Appendix: Example usage

- Basic CSS override:

  :root {
    --lcars-color-primary: #ff9900;
    --lcars-font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  }

- Using tokens in component styles:

  .button {
    background: var(--lcars-color-primary);
    color: var(--lcars-color-primary-contrast);
    padding: var(--lcars-gap-sm);
    border-radius: var(--lcars-border-radius);
  }

Questions or Requests

If you believe a public token is missing or needs a clearer semantic name, open an issue proposing the token with use-cases and examples.


