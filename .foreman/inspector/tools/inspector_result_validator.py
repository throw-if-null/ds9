#!/usr/bin/env python3
import json
import sys
from dataclasses import dataclass
from typing import Any, Dict, List, Optional


@dataclass
class ValidationError:
    path: str
    message: str
    code: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        data: Dict[str, Any] = {"path": self.path, "message": self.message}
        if self.code is not None:
            data["code"] = self.code
        return data


def load_input() -> Dict[str, Any]:
    try:
        raw = sys.stdin.read()
        return json.loads(raw or "{}")
    except json.JSONDecodeError as exc:
        raise SystemExit(json.dumps({
            "ok": False,
            "errors": [
                {
                    "path": "<stdin>",
                    "code": "invalid_json",
                    "message": f"Failed to parse stdin as JSON: {exc}"
                }
            ]
        }))


def load_inspector_result(payload: Dict[str, Any]) -> Any:
    if "data" in payload:
        return payload["data"]

    path = payload.get("path", "inspector_result.json")
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        raise SystemExit(json.dumps({
            "ok": False,
            "errors": [
                {
                    "path": path,
                    "code": "file_not_found",
                    "message": f"inspector result file not found at '{path}'"
                }
            ]
        }))
    except json.JSONDecodeError as exc:
        raise SystemExit(json.dumps({
            "ok": False,
            "errors": [
                {
                    "path": path,
                    "code": "invalid_json",
                    "message": f"inspector result is not valid JSON: {exc}"
                }
            ]
        }))


def validate_inspector_result(data: Any) -> List[ValidationError]:
    errors: List[ValidationError] = []

    if not isinstance(data, dict):
        errors.append(
            ValidationError(
                path="<root>",
                code="type_error",
                message="inspector_result must be a JSON object",
            )
        )
        return errors

    # status: "approved" or "changes_requested"
    status = data.get("status")
    if status not in {"approved", "changes_requested"}:
        errors.append(
            ValidationError(
                path="status",
                code="invalid_enum",
                message="status must be 'approved' or 'changes_requested'",
            )
        )

    # issues: array; non-empty when status === "changes_requested"
    issues = data.get("issues")
    if issues is None:
        errors.append(
            ValidationError(
                path="issues",
                code="required",
                message="issues array is required",
            )
        )
        issues = []
    elif not isinstance(issues, list):
        errors.append(
            ValidationError(
                path="issues",
                code="type_error",
                message="issues must be an array",
            )
        )
        issues = []

    if status == "changes_requested" and not issues:
        errors.append(
            ValidationError(
                path="issues",
                code="empty_for_changes_requested",
                message="issues must be non-empty when status is 'changes_requested'",
            )
        )

    # Validate each issue structure
    for idx, issue in enumerate(issues):
        path_prefix = f"issues[{idx}]"
        if not isinstance(issue, dict):
            errors.append(
                ValidationError(
                    path=path_prefix,
                    code="type_error",
                    message="each issue must be an object",
                )
            )
            continue

        severity = issue.get("severity")
        if severity not in {"blocker", "major", "minor"}:
            errors.append(
                ValidationError(
                    path=f"{path_prefix}.severity",
                    code="invalid_enum",
                    message="severity must be one of 'blocker', 'major', 'minor'",
                )
            )

        description = issue.get("description")
        if not isinstance(description, str) or not description.strip():
            errors.append(
                ValidationError(
                    path=f"{path_prefix}.description",
                    code="required",
                    message="description must be a non-empty string",
                )
            )

        paths = issue.get("paths")
        if not isinstance(paths, list) or not paths:
            errors.append(
                ValidationError(
                    path=f"{path_prefix}.paths",
                    code="required",
                    message="paths must be a non-empty array of strings",
                )
            )
        else:
            for p_idx, p in enumerate(paths):
                if not isinstance(p, str) or not p.strip():
                    errors.append(
                        ValidationError(
                            path=f"{path_prefix}.paths[{p_idx}]",
                            code="type_error",
                            message="each path must be a non-empty string",
                        )
                    )

    # next_tasks: array of strings (may be empty when status is approved)
    next_tasks = data.get("next_tasks")
    if next_tasks is None:
        # Treat missing as empty array (permissive)
        next_tasks = []
    elif not isinstance(next_tasks, list):
        errors.append(
            ValidationError(
                path="next_tasks",
                code="type_error",
                message="next_tasks must be an array of strings",
            )
        )
        next_tasks = []

    for idx, task in enumerate(next_tasks):
        if not isinstance(task, str) or not task.strip():
            errors.append(
                ValidationError(
                    path=f"next_tasks[{idx}]",
                    code="type_error",
                    message="each next_tasks entry must be a non-empty string",
                )
            )

    return errors


def main() -> None:
    payload = load_input()
    result = load_inspector_result(payload)
    errors = validate_inspector_result(result)

    output = {
        "ok": not errors,
        "errors": [e.to_dict() for e in errors],
    }
    sys.stdout.write(json.dumps(output))


if __name__ == "__main__":
    main()
