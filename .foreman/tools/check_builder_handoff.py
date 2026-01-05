import json
import os
import subprocess
import sys
from typing import Any, Dict, List


def validate_builder_result(data: Any) -> Dict[str, Any]:
    errors: List[Dict[str, str]] = []

    if not isinstance(data, dict):
        errors.append(
            {
                "path": "<root>",
                "code": "type_error",
                "message": "builder_result must be a JSON object",
            }
        )
        return {"ok": False, "errors": errors}

    summary = data.get("summary")
    if not isinstance(summary, str) or not summary.strip():
        errors.append(
            {
                "path": "summary",
                "code": "required",
                "message": "summary must be a non-empty string",
            }
        )

    complexity = data.get("complexity")
    if complexity not in ("low", "medium", "high"):
        errors.append(
            {
                "path": "complexity",
                "code": "invalid_enum",
                "message": "complexity must be one of 'low', 'medium', 'high'",
            }
        )

    return {"ok": not errors, "errors": errors}


def get_changed_files() -> List[Dict[str, str]]:
    try:
        proc = subprocess.run(
            ["git", "status", "--porcelain"],
            check=False,
            capture_output=True,
            text=True,
        )
        lines = [ln for ln in proc.stdout.splitlines() if ln.strip()]
        files: List[Dict[str, str]] = []
        for line in lines:
            status = line[:2].strip() or line[:2]
            path = line[3:].strip()
            if path:
                files.append({"path": path, "status": status})
        return files
    except Exception:
        return []


def main() -> None:
    worktree = os.getcwd()
    result_path = os.path.join(worktree, "builder_result.json")

    builder_result_ok = False
    builder_result_errors: List[Dict[str, Any]] = []

    try:
        with open(result_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        builder_result_errors.append(
            {
                "path": "builder_result.json",
                "code": "missing",
                "message": "builder_result.json not found in worktree root",
            }
        )
    except json.JSONDecodeError as e:
        builder_result_errors.append(
            {
                "path": "builder_result.json",
                "code": "invalid_json",
                "message": f"builder_result.json is not valid JSON: {e}",
            }
        )
    else:
        validation = validate_builder_result(data)
        builder_result_ok = bool(validation.get("ok"))
        builder_result_errors.extend(validation.get("errors", []))

    changed_files = get_changed_files()

    ok = builder_result_ok and not builder_result_errors
    verdict = "approved" if ok else "changes_requested"

    output = {
        "ok": ok,
        "verdict": verdict,
        "builder_result_ok": builder_result_ok,
        "builder_result_errors": builder_result_errors,
        "changed_files": changed_files,
    }

    json.dump(output, sys.stdout)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
