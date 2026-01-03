#!/usr/bin/env bash
set -euo pipefail

# Usage: build_foreman_request TASK_ID [WEBHOOK_URL]
# Example:
#   ./build_foreman_request.sh ds9-1
#   ./build_foreman_request.sh ds9-1 http://localhost:3000/test-hook
#
# If WEBHOOK_URL is omitted, the script uses the FOREMAN_WEBHOOK_URL
# environment variable.
#
# This prints a curl command that POSTs:
#   {
#     "task_id": "<TASK_ID>",
#     "prompt": "<Title>. <Description ...>"
#   }
# using the task definition from docs/TODO.md.

TASK_ID="${1:-}"
# Prefer explicit argument; fall back to FOREMAN_WEBHOOK_URL env var.
WEBHOOK_URL="${2:-${FOREMAN_WEBHOOK_URL:-}}"

if [[ -z "$TASK_ID" || -z "$WEBHOOK_URL" ]]; then
  echo "Usage: build_foreman_request <TASK_ID> [WEBHOOK_URL] (or set FOREMAN_WEBHOOK_URL)" >&2
  exit 1
fi

TODO_FILE="$(dirname "$0")/TODO.md"

if [[ ! -f "$TODO_FILE" ]]; then
  echo "Error: $TODO_FILE not found" >&2
  exit 1
fi

# Find the line number of the task header (e.g. '### 1.1 [ds9-1] ...')
start_line="$(grep -nE "^### .*\\[${TASK_ID}\\]" "$TODO_FILE" | head -n1 | cut -d: -f1 || true)"

if [[ -z "$start_line" ]]; then
  echo "Error: Task ID '${TASK_ID}' not found in ${TODO_FILE}" >&2
  exit 1
fi

# Prefer the next task header ('### ') after the current task as the block end.
# If no next header exists, fall back to the next '---' separator; if neither
# exists, read until EOF.
next_header_rel="$(tail -n +"$((start_line + 1))" "$TODO_FILE" | grep -nE "^### " | head -n1 | cut -d: -f1 || true)"
if [[ -n "$next_header_rel" ]]; then
  # Number of lines to include (relative to tail starting at start_line).
  end_line="$next_header_rel"
else
  # Find the next section separator ('---') after the task to bound the block.
  sep_rel="$(tail -n +"$start_line" "$TODO_FILE" | grep -n "^---$" | head -n1 | cut -d: -f1 || true)"
  if [[ -n "$sep_rel" ]]; then
    # We want lines up to just before the separator.
    end_line="$(( sep_rel - 1 ))"
    if [[ "$end_line" -lt 1 ]]; then
      end_line=1
    fi
  else
    # If no separator is found, read until end of file (relative count).
    total_tail_lines="$(tail -n +"$start_line" "$TODO_FILE" | wc -l)"
    end_line="$total_tail_lines"
  fi
fi

# Extract the task block.
task_block="$(tail -n +"$start_line" "$TODO_FILE" | head -n "$end_line")"

# Extract Title and Description lines.
title_line="$(printf '%s\n' "$task_block" | grep -E "^- \*\*Title\*\*:" | head -n1 || true)"
desc_lines="$(printf '%s\n' "$task_block" | sed -n '/^- \*\*Description\*\*:/,$p' | sed '1d' || true)"

if [[ -z "$title_line" || -z "$desc_lines" ]]; then
  echo "Error: Could not extract Title/Description for '${TASK_ID}' from ${TODO_FILE}" >&2
  exit 1
fi

# Clean up markdown formatting.

# Title: '- **Title**: ...' -> strip prefix, keep the content.
title="${title_line#- **Title**: }"
title="$(echo "$title" | sed 's/`//g' | sed 's/[[:space:]]\+$//')"

# Description: multi-line, markdown bullets; join into one sentence-ish paragraph.
# - strip leading '- ' and indentation
# - strip backticks
# - collapse newlines to spaces
desc_clean="$(
  printf '%s\n' "$desc_lines" \
    | sed 's/^[[:space:]]*-[[:space:]]*//g' \
    | sed 's/^[[:space:]]*//g' \
    | sed 's/`//g' \
    | tr '\n' ' ' \
    | sed 's/[[:space:]]\+/ /g' \
    | sed 's/[[:space:]]\+$//'
)"

prompt="${title}. ${desc_clean}"

# Escape double quotes and backslashes for JSON inside single-quoted -d.
prompt_escaped="${prompt//\\/\\\\}"
prompt_escaped="${prompt_escaped//\"/\\\"}"

cat <<EOF
curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '{
    "task_id": "${TASK_ID}",
    "prompt": "${prompt_escaped}"
  }' \\
  "${WEBHOOK_URL}"
EOF
