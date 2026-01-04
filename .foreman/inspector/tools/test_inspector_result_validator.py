import json
import subprocess
import sys
from pathlib import Path

from inspector_result_validator import validate_inspector_result

SCRIPT = Path(__file__).resolve().parent / "inspector_result_validator.py"


def test_validate_inspector_result_approved_ok():
    data = {"status": "approved", "issues": [], "next_tasks": []}
    errors = validate_inspector_result(data)
    assert errors == []


def test_validate_inspector_result_changes_requested_requires_issues():
    data = {"status": "changes_requested", "issues": [], "next_tasks": []}
    errors = validate_inspector_result(data)
    paths = {e.path for e in errors}
    assert "issues" in paths


def test_validate_inspector_result_issue_shape():
    data = {
        "status": "changes_requested",
        "issues": [
            {
                "severity": "major",
                "description": "Something is wrong",
                "paths": ["src/file.ts"],
            }
        ],
        "next_tasks": ["Fix the issue"],
    }
    errors = validate_inspector_result(data)
    assert errors == []


def test_cli_with_valid_data():
    payload = {
        "data": {
            "status": "approved",
            "issues": [],
            "next_tasks": [],
        }
    }
    proc = subprocess.run(
        [sys.executable, str(SCRIPT)],
        input=json.dumps(payload).encode("utf-8"),
        capture_output=True,
        check=True,
    )
    out = json.loads(proc.stdout.decode("utf-8") or "{}")
    assert out.get("ok") is True
    assert out.get("errors") == []


def test_cli_invalid_json_stdin():
    proc = subprocess.run(
        [sys.executable, str(SCRIPT)],
        input=b"not-json",
        capture_output=True,
        check=False,
    )
    out = json.loads(proc.stdout.decode("utf-8") or proc.stderr.decode("utf-8") or "{}")
    assert out.get("ok") is False
    assert out.get("errors")
