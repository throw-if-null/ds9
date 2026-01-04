import json
import subprocess
import sys
from pathlib import Path

from builder_result_validator import validate_builder_result

SCRIPT = Path(__file__).resolve().parent / "builder_result_validator.py"


def test_validate_builder_result_ok():
    data = {"summary": "Short description", "complexity": "medium"}
    errors = validate_builder_result(data)
    assert errors == []


def test_validate_builder_result_missing_fields():
    data = {}
    errors = validate_builder_result(data)
    paths = {e.path for e in errors}
    assert "summary" in paths
    assert "complexity" in paths


def test_validate_builder_result_summary_too_long():
    data = {"summary": "x" * 301, "complexity": "low"}
    errors = validate_builder_result(data)
    codes = {e.code for e in errors}
    assert "too_long" in codes


def test_cli_with_valid_data(tmp_path: Path):
    payload = {"data": {"summary": "OK", "complexity": "high"}}
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
