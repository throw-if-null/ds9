# AGENTS.md

This repository is a **Svelte 5 + TypeScript component library** packaged with **SvelteKit packaging (@sveltejs/package)**.

**Important:** Run commands from the directory that contains `package.json` (this project’s Node root is `ds9/`).

This file governs both humans and agents (Foreman + Builder + Inspector).

---

## Goals (in order)

1) Correctness and predictable component behavior  
2) Accessibility by default  
3) Stable public API + semver discipline  
4) Maintainability (clear code, clear types, clear docs)  
5) Performance (avoid unnecessary reactivity/DOM work)

---

## Non-goals (unless explicitly requested)

- Large refactors
- Tooling migrations (including adding Histoire)
- Dependency changes
- Broad formatting changes
- Visual redesign / breaking CSS changes

---

## Tooling

- Package manager: **pnpm**
- Language: **TypeScript**
- Lint: **ESLint**
- Format: **Prettier**
- Typecheck: **svelte-check**
- Unit/component tests: **Vitest** (includes browser tests)
- E2E tests: **Playwright**
- Packaging: **svelte-package** + **publint**

---

## Current scripts (source of truth)

Agents MUST use these scripts as-is unless explicitly told to modify them:

- `pnpm dev`
- `pnpm build`
- `pnpm preview`
- `pnpm prepare`
- `pnpm prepack`
- `pnpm check` / `pnpm check:watch`
- `pnpm format`
- `pnpm lint`
- `pnpm test:unit`
- `pnpm test:e2e`
- `pnpm test`

If a check cannot be run, the agent must state exactly why and what was run instead.

---

## Repository layout and API boundaries

- `src/lib/` — library source (packaged output originates here)
- `src/lib/index.ts` — **public exports** (single source of truth)
- `src/lib/**/index.ts` — module-level exports (re-exported by `src/lib/index.ts`)
- `src/routes/` — showcase app (not exported)

Rules:
- Only export public components/types from `src/lib/index.ts`.
- Internal helpers go under `src/lib/internal/` (or within local module folders) and must not be exported.
- Avoid exporting deep paths unintentionally.

---

## Public API stability (no accidental breaking changes)

Public API includes:
- exports from `src/lib/index.ts`
- component props / events / **snippet props** (e.g. `children`, `header`, `footer`)
- documented classes / CSS variables / parts that consumers rely on
- default styling behavior and DOM structure that consumers reasonably depend on

Breaking changes require explicit instruction + a semver plan.

---

## SYSTEM RULES (non-negotiable)

### 1) Minimal diffs
- Touch the fewest files possible.
- No drive-by renames or refactors.
- No reformatting unrelated code.

### 2) Accessibility by default
Interactive components MUST:
- be keyboard operable
- use correct semantics (prefer native elements)
- have visible focus
- use ARIA only when needed and correctly

### 3) SSR-safe and side-effect safe
- No module-level DOM reads/writes.
- Gate DOM access behind runtime checks.
- Avoid global side effects.

### 4) Types + tests are part of the change
- All public props/events/snippet props must be typed.
- New/changed behavior must have tests unless explicitly waived.

### 5) No new dependencies without approval
If a new dependency is needed:
- propose it, justify it, list alternatives
- wait for explicit approval

---

## Svelte 5 requirements (enforced)

### Prefer Svelte 5 idioms (runes mode)
In runes mode:
- Do not use `export let`; use `$props()`.
- Avoid `$:`; use `$derived()` / `$effect()`.
- Avoid `on:…`; use DOM-style handlers (`onclick`, `onkeydown`, etc.).

### Runes constraints
- `$state`, `$derived`, `$effect` must only appear in:
  - `.svelte`
  - `.svelte.ts` / `.svelte.js`
- Plain `.ts` files must not reference runes (directly or indirectly).

### Public API boundary for rune modules (barrel pattern)
To prevent importing rune code from plain TS, use the barrel pattern:
- Put rune code in a rune entrypoint, e.g.:
  - `src/lib/state/index.svelte.ts` (runes allowed)
- Re-export only safe entrypoints/types from:
  - `src/lib/state/index.ts` (NO runes)

### Browser targets
- Avoid top-level `await` in entrypoints/modules unless explicitly approved.
- Prefer `onMount(async () => …)` in components, or an async IIFE in `main.ts` (if applicable).

### TypeScript discipline
- Avoid `any` and implicit `any`.
- Annotate event handler parameters and snippet props (including snippet args).

---

## Component API standards

### Props
- Use `$props()` for props (runes mode).
- Props must be typed and defaults must be explicit.
- Avoid exporting internal prop helper types unless they are part of the intended public API.

### Events
- Document events (name + payload shape).
- Prefer typed payloads (TS types or explicit doc contract).

### Snippets (instead of slots)
- For new/updated runes components, use **snippets** passed via props and rendered with `{@render ...}`.
- Treat `<slot>` as **legacy** and only use it when:
  - maintaining an existing legacy-slot component, or
  - authoring custom elements where `<slot />` remains appropriate.

Rules:
- Do not design new public components around `<slot>` unless explicitly requested.
- Do not mix `<slot>` and `{@render ...}` in the same component.
- Default content should be represented by a `children` snippet prop and rendered with `{@render children?.()}`.
- Multiple content placeholders should be modeled as snippet props (e.g. `header`, `footer`) and rendered with `{@render header?.()}`.
- If a snippet takes arguments, type it explicitly and annotate snippet parameters.

### Reactivity
- Keep state minimal.
- Prefer derived values for pure derivation.
- Effects must be narrowly scoped and must not do expensive work per update.

### Styling and theming
- No global CSS by default (unless explicitly documented).
- Prefer CSS variables for theming.
- If you add new styling hooks (vars/classes), document what is stable to rely on.

---

## Documentation requirements (for public components)

For every public component, add/maintain docs (choose one approach and be consistent):
- Option A: `docs/components/<ComponentName>.md`
- Option B: co-located `src/lib/<area>/<ComponentName>.md`

Minimum content:
- purpose + when to use
- minimal usage example
- props (type, default, description)
- events and payloads
- snippet props (e.g. `children`, `header`, `footer`) and their intent (including snippet args if any)
- theming/styling hooks and what is safe to rely on
- accessibility notes

Do NOT add Histoire unless explicitly requested.

---

## Testing requirements

### Unit/component tests (Vitest)
- Add tests for new/changed behavior.
- For interactive components, cover:
  - keyboard interactions
  - emitted events / callbacks
  - controlled/uncontrolled behavior (if applicable)
- Tests must be deterministic (no sleeps/flaky timing).

### E2E tests (Playwright)
- Add/adjust E2E tests only when behavior crosses integration boundaries.
- Keep E2E coverage minimal and high value.

---

## Inspector / Builder workflow

### Inspector responsibilities
- Wait for Builder completion message.
- Review `git diff` for compliance with this AGENTS.md.
- Verify required checks were run (or exceptions are justified).
- If violations exist: provide a specific fix list and delegate back to the Builder.
- If compliant: approve and summarize changes + any remaining risks.

### Inspector review checklist (must be applied)
Svelte 5 requirements:
- No `export let` in runes components; `$props()` used instead.
- No `$:` in runes components; `$derived()` / `$effect()` used instead.
- No `on:…` in runes components; DOM-style handlers used instead.
- No runes referenced from plain `.ts` files (directly or indirectly).
- If rune logic is shared, it uses the barrel pattern:
  - `index.svelte.ts` contains runes
  - `index.ts` re-exports safe types/entrypoints (no runes)
- No top-level `await` in entrypoints/modules unless explicitly approved.

Snippets vs slots:
- New/updated runes components use snippets + `{@render ...}` (not `<slot>`).
- `<slot>` only exists for legacy-slot components or custom elements (must be justified in the handoff).
- No component mixes `<slot>` with `{@render ...}`.
- Snippet props are typed and snippet parameters are annotated.

General:
- Minimal diff / no unrelated formatting
- Public API impact stated and acceptable
- A11y covered for interactive components
- Types: no `any` / implicit `any`; handler params/snippet props annotated
- Checks run (as applicable): `pnpm lint`, `pnpm check`, `pnpm test`, and packaging sanity (`pnpm prepack`) for library changes

### Builder responsibilities
- Implement only the assigned task.
- Run required checks (or explain precisely what was run).
- Provide a complete handoff.

### Mandatory Builder handoff (final message)
Include:
- Summary (1–3 bullets)
- Files touched
- Commands run + results
- Public API impact: None / Describe
- A11y considerations
- Risks / follow-ups

End with exactly:
READY_FOR_REVIEW

---

## Definition of Done
A change is “done” only if:
- required checks pass (or an explicit exception is documented)
- public API impact is stated
- docs updated if public behavior changed
- accessibility considered for interactive UI
- Svelte 5 requirements above are satisfied

---

## MCP usage (required when available)

This project has two MCP servers installed:
- `svelte-mcp`
- `context7`

### Default choice
Use **`svelte-mcp`** by default for anything involving:
- Svelte 5 / SvelteKit / runes / packaging behavior
- Svelte/SvelteKit APIs and best practices
- Svelte-specific static analysis/autofix (when provided)

### When to use `context7`
Use **`context7`** only when:
- `svelte-mcp` cannot answer a question, is missing relevant docs, or is not providing useful signals, or
- you need broader, non-Svelte documentation/context across general libraries or tools.

### Inspector requirement
If an implementation or review depends on Svelte/SvelteKit-specific facts, the Inspector must require the Builder to:
- cite what was checked via `svelte-mcp` (briefly: what tool was used and the conclusion), or
- explicitly state why MCP could not be used.

If `svelte-mcp` repeatedly fails to help for this repo, switch the default to `context7` (explicitly note the reason in the task/PR notes).
