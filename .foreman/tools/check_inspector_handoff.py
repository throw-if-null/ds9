import json
import os
import subprocess
import sys
from typing import Any, Dict, List


def validate_inspector_result(data: Any) -> Dict[str, Any]:
    errors: List[Dict[str, str]] = []

    if not isinstance(data, dict):
        errors.append(
            {
                "path": "<root>",
                "code": "type_error",
                "message": "inspector_result must be a JSON object",
            }
        )
        return {"ok": False, "errors": errors}

    status = data.get("status")
    if status not in ("approved", "changes_requested"):
        errors.append(
            {
                "path": "status",
                "code": "invalid_enum",
                "message": "status must be 'approved' or 'changes_requested'",
            }
        )

    issues = data.get("issues")
    if not isinstance(issues, list):
        errors.append(
            {
                "path": "issues",
                "code": "type_error",
                "message": "issues must be an array",
            }
        )
    else:
        if status == "changes_requested" and not issues:
            errors.append(
                {
                    "path": "issues",
                    "code": "required",
                    "message": "issues must be non-empty when status is 'changes_requested'",
                }
            )
        for idx, issue in enumerate(issues):
            if not isinstance(issue, dict):
                errors.append(
                    {
                        "path": f"issues[{idx}]",
                        "code": "type_error",
                        "message": "each issue must be an object",
                    }
                )
                continue
            severity = issue.get("severity")
            if severity not in ("blocker", "major", "minor"):
                errors.append(
                    {
                        "path": f"issues[{idx}].severity",
                        "code": "invalid_enum",
                        "message": "severity must be 'blocker', 'major', or 'minor'",
                    }
                )
            desc = issue.get("description")
            if not isinstance(desc, str) or not desc.strip():
                errors.append(
                    {
                        "path": f"issues[{idx}].description",
                        "code": "required",
                        "message": "description must be a non-empty string",
                    }
                )
            paths = issue.get("paths")
            if not isinstance(paths, list) or not all(
                isinstance(p, str) and p.strip() for p in paths
            ):
                errors.append(
                    {
                        "path": f"issues[{idx}].paths",
                        "code": "type_error",
                        "message": "paths must be an array of non-empty strings",
                    }
                )

    next_tasks = data.get("next_tasks")
    if next_tasks is not None:
        if not isinstance(next_tasks, list) or not all(
            isinstance(t, str) and t.strip() for t in next_tasks
        ):
            errors.append(
                {
                    "path": "next_tasks",
                    "code": "type_error",
                    "message": "next_tasks must be an array of non-empty strings when present",
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
    result_path = os.path.join(worktree, "inspector_result.json")

    inspector_result_ok = False
    inspector_result_errors: List[Dict[str, Any]] = []

    status = None
    try:
        with open(result_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, dict):
                status = data.get("status")
    except FileNotFoundError:
        inspector_result_errors.append(
            {
                "path": "inspector_result.json",
                "code": "missing",
                "message": "inspector_result.json not found in worktree root",
            }
        )
    except json.JSONDecodeError as e:
        inspector_result_errors.append(
            {
                "path": "inspector_result.json",
                "code": "invalid_json",
                "message": f"inspector_result.json is not valid JSON: {e}",
            }
        )
    else:
        validation = validate_inspector_result(data)
        inspector_result_ok = bool(validation.get("ok"))
        inspector_result_errors.extend(validation.get("errors", []))
 
    changed_files = get_changed_files()
 
    ok = inspector_result_ok and not inspector_result_errors
    if not ok:
        verdict = "impossible"
    elif status == "approved":
        verdict = "approved"
    else:
        verdict = "changes_requested"
 
    output = {
        "ok": ok,
        "verdict": verdict,
        "inspector_result_ok": inspector_result_ok,
        "inspector_result_errors": inspector_result_errors,
        "changed_files": changed_files,
    }


    json.dump(output, sys.stdout)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
