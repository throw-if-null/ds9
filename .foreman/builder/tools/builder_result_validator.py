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


def load_builder_result(payload: Dict[str, Any]) -> Any:
    if "data" in payload:
        return payload["data"]

    path = payload.get("path", "builder_result.json")
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
                    "message": f"builder result file not found at '{path}'"
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
                    "message": f"builder result is not valid JSON: {exc}"
                }
            ]
        }))


def validate_builder_result(data: Any) -> List[ValidationError]:
    errors: List[ValidationError] = []

    if not isinstance(data, dict):
        errors.append(
            ValidationError(
                path="<root>",
                code="type_error",
                message="builder_result must be a JSON object",
            )
        )
        return errors

    # summary: non-empty string, reasonably short
    summary = data.get("summary")
    if not isinstance(summary, str) or not summary.strip():
        errors.append(
            ValidationError(
                path="summary",
                code="required",
                message="summary must be a non-empty string",
            )
        )
    elif len(summary) > 300:
        errors.append(
            ValidationError(
                path="summary",
                code="too_long",
                message="summary should be at most 300 characters",
            )
        )

    # complexity: one of "low", "medium", "high"
    complexity = data.get("complexity")
    allowed = {"low", "medium", "high"}
    if complexity not in allowed:
        errors.append(
            ValidationError(
                path="complexity",
                code="invalid_enum",
                message="complexity must be one of 'low', 'medium', 'high'",
            )
        )

    return errors


def main() -> None:
    payload = load_input()
    result = load_builder_result(payload)
    errors = validate_builder_result(result)

    output = {
        "ok": not errors,
        "errors": [e.to_dict() for e in errors],
    }
    sys.stdout.write(json.dumps(output))


if __name__ == "__main__":
    main()
