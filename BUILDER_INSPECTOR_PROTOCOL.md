# Smoke tests

To manually check that our agents are sane we can prompt them to summarize their roles which they can only do if they are able to read their respective prompts.

```
opencode run --agent builder "Summarize your role and the REQUIRED handoff marker you must output at the end."

opencode run --agent inspector "Summarize your role and what you do when you receive READY_FOR_REVIEW."
```
