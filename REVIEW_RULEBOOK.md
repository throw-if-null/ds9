# REVIEW_RULEBOOK

This rulebook captures project-specific implementation and review rules
for the ds9 Svelte 5 + TypeScript component library.

Builder and Inspector MUST treat this file and `AGENTS.md` as
complementary sources of truth.

---

## 1. Project Overview

- Library: Svelte 5 + TypeScript component library.
- Packaging: SvelteKit packaging via `@sveltejs/package`.
- Primary entrypoints:
  - Library source under `src/lib/`.
  - Showcase app under `src/routes/` (not exported).
- Public exports originate from `src/lib/index.ts` and re-export from
  module-level `src/lib/**/index.ts` barrels.

---

## 2. Tech Stack & Runtime Constraints

- Language & tooling:
  - TypeScript for source code.
  - ESLint for linting.
  - Prettier for formatting.
  - `svelte-check` for typechecking.
  - Vitest (incl. browser tests) for unit/component tests.
  - Playwright for E2E tests.
  - `svelte-package` + `publint` for packaging checks.
- Runtime expectations:
  - Code must be SSR-safe:
    - No module-level DOM reads or writes.
    - Gate DOM access behind runtime checks.
    - Avoid global side effects.
  - Avoid top-level `await` in entrypoints/modules unless explicitly
    approved in the task.
- Repository layout constraints:
  - Only export public components/types from `src/lib/index.ts`.
  - Internal helpers go under `src/lib/internal/` or within local module
    folders and MUST NOT be exported from the public barrel.
  - Avoid exporting deep paths unintentionally.

---

## 3. Coding Rules & Conventions

### 3.1 Svelte 5 / Runes

- Prefer Svelte 5 runes mode patterns in components.
- Runes usage:
  - Use `$props()` instead of `export let` in runes components.
  - Avoid `$:` labels; use `$derived()` / `$effect()` instead.
  - Use DOM-style handlers (`onclick`, `onkeydown`, etc.), not `on:...`.
  - `$state`, `$derived`, `$effect` may appear only in:
    - `.svelte`
    - `.svelte.ts` / `.svelte.js`
  - Plain `.ts` files MUST NOT reference runes directly or indirectly.
- Barrel pattern for rune modules:
  - Place rune code in rune entrypoints such as
    `src/lib/state/index.svelte.ts`.
  - Re-export only safe entrypoints/types from `src/lib/state/index.ts`,
    which MUST NOT contain runes.

### 3.2 Component API & Reactivity

- Props:
  - Use `$props()` for props in runes components.
  - Props must be explicitly typed and have explicit defaults.
  - Avoid exporting internal prop helper types unless they are intended
    as public API.
- Events:
  - Document events (name + payload shape).
  - Prefer typed payloads (TypeScript types or clearly documented
    contracts).
- Snippets vs slots:
  - For new/updated runes components, use snippet props passed via
    props and rendered with `{@render ...}`.
  - Treat `<slot>` as legacy; only use it when:
    - maintaining existing legacy-slot components, or
    - authoring custom elements that require `<slot />`.
  - Do NOT design new public components around `<slot>` unless
    explicitly requested.
  - Do NOT mix `<slot>` and `{@render ...}` in the same component.
  - Default content should be represented by a `children` snippet prop
    and rendered with `{@render children?.()}`.
  - Multiple content placeholders should be modeled as snippet props
    (e.g. `header`, `footer`) and rendered with
    `{@render header?.()}` / `{@render footer?.()}`.
  - If a snippet takes arguments, type it explicitly and annotate the
    snippet parameters.
- Reactivity:
  - Keep state minimal.
  - Prefer derived values for pure derivations.
  - Effects MUST be narrowly scoped and avoid expensive work on each
    update.

### 3.3 TypeScript Discipline

- Avoid `any` and implicit `any`, especially for public surfaces.
- Annotate event handler parameters and snippet props (including
  snippet args).
- Public props, events, and snippet props MUST be typed.

### 3.4 Styling & Theming

- No global CSS by default unless explicitly documented.
- Prefer CSS variables for theming and stable styling hooks.
- When adding styling hooks (classes, CSS variables, parts):
  - Document which names are stable and safe for consumers to rely on.

### 3.5 Non-goals / Scope Discipline

- Non-goals unless explicitly requested by the task:
  - Large refactors.
  - Tooling migrations (including adding Histoire).
  - Dependency changes.
  - Broad formatting changes.
  - Visual redesigns or breaking CSS changes.
- Minimal diff principle:
  - Touch the fewest files possible.
  - No drive-by renames or refactors.
  - No unrelated reformatting.

---

## 4. Public API & Stability

- Public API includes:
  - All exports from `src/lib/index.ts`.
  - Component props, events, and snippet props (e.g. `children`,
    `header`, `footer`).
  - Documented classes, CSS variables, and parts that consumers rely
    on.
  - Default styling behavior and DOM structure that consumers may
    reasonably depend on.
- Stability & semver expectations:
  - Avoid accidental breaking changes.
  - Breaking changes require explicit instruction plus a semver plan.
- Documentation expectations for public components:
  - Public components should have or maintain docs in either:
    - `docs/components/<ComponentName>.md`, or
    - `src/lib/<area>/<ComponentName>.md`.
  - Minimum doc content:
    - Purpose and when to use.
    - Minimal usage example.
    - Props (type, default, description).
    - Events and payloads.
    - Snippet props (e.g. `children`, `header`, `footer`) and their
      intent (including snippet args if any).
    - Theming/styling hooks and what is safe to rely on.
    - Accessibility notes.

---

## 5. Testing Requirements

- Tooling / scripts:
  - Use `pnpm` from the repository root (where `package.json` lives).
  - Preferred scripts for code changes:
    - `pnpm lint`
    - `pnpm check`
    - `pnpm test` (or at least `pnpm test:unit` when appropriate)
    - `pnpm prepack` when packaging changes are involved.
  - If a required check cannot be run, state exactly why and what was
    run instead.
- Unit/component tests (Vitest):
  - Add tests for all new or changed behavior.
  - For interactive components, cover:
    - Keyboard interactions.
    - Emitted events / callbacks.
    - Controlled vs uncontrolled behavior (if applicable).
  - Tests MUST be deterministic (no sleeps/flaky timing).
- E2E tests (Playwright):
  - Add or adjust E2E tests only when behavior crosses integration
    boundaries.
  - Keep E2E coverage minimal and high-value.

---

## 6. Accessibility & UX

- Accessibility is a core goal (second only to correctness).
- Interactive components MUST:
  - Be keyboard operable.
  - Use correct semantics (prefer native elements where possible).
  - Have visible focus styles.
  - Use ARIA only when needed and correctly.
- A11y in reviews:
  - Inspector must ensure that interactive UI changes meet these
    standards and that Builder documents important accessibility
    behavior in the handoff.

---

## 7. Non-goals / Anti-patterns

- Avoid unless explicitly requested in the task:
  - Large, cross-cutting refactors.
  - Tooling migrations or major configuration changes.
  - Adding new dependencies.
  - Broad formatting-only changes.
  - Visual redesigns or CSS changes that break existing consumers.
- Anti-patterns that should trigger review comments:
  - Unnecessary state or effects.
  - Public surfaces using `any` or implicit `any`.
  - Runes used from plain `.ts` modules.
  - New slot-based APIs in runes components instead of snippets.

---

## 8. Inspector / Builder Expectations

- Builder responsibilities:
  - Implement only the assigned task.
  - Keep diffs minimal and focused.
  - Run the required checks (or explain precisely what was run and why
    anything was skipped).
  - Provide a complete handoff including:
    - Summary (1–3 bullets).
    - Files touched.
    - Commands run + results.
    - Public API impact (None / Describe).
    - A11y considerations.
    - Risks / follow-ups.
- Inspector responsibilities:
  - Enforce this rulebook and `AGENTS.md`.
  - Anchor review in the actual diff, code, and tests, not just
    Builder’s description.
  - Verify that required checks were run or exceptions are justified.
  - Ensure:
    - Minimal diff / no unrelated formatting.
    - Public API impact is explicitly stated and acceptable.
    - A11y is covered for interactive components.
    - Types are sound (no `any` / implicit `any` on public surfaces).
    - Required checks (`pnpm lint`, `pnpm check`, `pnpm test`, and
      `pnpm prepack` for library changes) are considered.
- Definition of Done (aligned with `AGENTS.md`):
  - Required checks pass (or explicit exceptions are documented).
  - Public API impact is stated.
  - Docs are updated if public behavior changed.
  - Accessibility is considered for interactive UI.
  - Svelte 5 / runes requirements are satisfied.

---

## 9. MCP Usage

- MCP servers available:
  - `svelte-mcp` for Svelte/SvelteKit/runes behavior and APIs.
  - `context7` for broader, non-Svelte documentation/context when
    needed.
- Preferred usage:
  - Default to `svelte-mcp` for anything involving Svelte 5,
    SvelteKit, runes, or packaging behavior.
  - Use `context7` when `svelte-mcp` is insufficient or off-topic.
- Review discipline:
  - When a decision depends on Svelte/SvelteKit-specific facts, note
    briefly what was checked via `svelte-mcp` or why MCP could not be
    used.
