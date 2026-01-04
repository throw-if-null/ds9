# Smoke tests

To manually check that our agents are sane we can prompt them to summarize their roles which they can only do if they are able to read their respective prompts.

```
opencode run --agent builder "Summarize your role and the REQUIRED handoff marker you must output at the end."

opencode run --agent inspector "Summarize your role and what you do when you receive READY_FOR_REVIEW."
```

## Triggering Foreman manually

If you have the Foreman webhook URL (for example from n8n), you can
trigger a full Builder → Inspector run with `curl` by posting a JSON
payload that includes a unique task ID and a natural-language prompt.

Example:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "task_id": "demo-task-001",
    "prompt": "Update the primary button component to support a loading state and add tests."
  }' \
  "https://your-n8n-instance.example.com/webhook/foreman-entrypoint"
```

- `task_id` should be unique per run (Foreman typically uses it to name
  git worktrees and branches).
- `prompt` is the user task Foreman will pass into the Builder agent.

## Result JSON validators (Builder & Inspector)

To make `builder_result.json` and `inspector_result.json` deterministic and
schema-correct, the `ds9` package exposes two validator scripts that run under
`pnpm` from the package root:

```bash
pnpm validate:builder-result
pnpm validate:inspector-result
```

- `pnpm validate:builder-result` runs
  `node tools/builder-result-validator.cjs builder_result.json` and enforces the
  Builder contract:
  - Root JSON value is an object
  - Top-level keys: `summary` (non-empty string), `complexity` (`low` | `medium` | `high`)
  - No additional top-level keys are allowed

- `pnpm validate:inspector-result` runs
  `node tools/inspector-result-validator.cjs inspector_result.json` and enforces
  the Inspector contract:
  - `status`: `approved` | `changes_requested`
  - `issues`: array of
    `{ severity: 'blocker' | 'major' | 'minor', description: string, paths: string[] }`
  - `next_tasks`: array of strings
  - If `status === 'changes_requested'`, both `issues` and `next_tasks` must be non-empty

### Expected usage by agents

- Builder SHOULD run `pnpm validate:builder-result` after writing
  `builder_result.json` and fix any reported issues before finishing the task.
- Inspector SHOULD run `pnpm validate:inspector-result` after writing
  `inspector_result.json` and fix any reported issues before completing the
  review.

Foreman and CI MAY also run these validators as a fast guardrail before acting
on the result files.
