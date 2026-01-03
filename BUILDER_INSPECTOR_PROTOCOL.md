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
