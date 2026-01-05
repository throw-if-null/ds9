import argparse
import base64
import subprocess
import sys
import time

import requests


def run_agent():
    parser = argparse.ArgumentParser()
    parser.add_argument("--webhook", required=True)
    parser.add_argument("--cmd", required=True)
    parser.add_argument("--cwd", required=False)
    parser.add_argument("--base64", action="store_true", help="Decode cmd from base64")
    args = parser.parse_args()

    # Wait for n8n Listener
    time.sleep(5)

    command_to_run = args.cmd
    if args.base64:
        try:
            print("[Runner] Decoding Base64 command...")
            command_to_run = base64.b64decode(args.cmd).decode("utf-8")
        except Exception as e:
            print(f"[Runner] Base64 decode failed: {e}")
            # We fail the job but still try to report back to n8n
            try:
                requests.post(
                    args.webhook,
                    json={"success": False, "output": f"Base64 Error: {e}"},
                )
            except Exception as e:
                print(f"Failed to hit the webhook. Error: {e}")
                pass
            sys.exit(1)

    print(f"[Runner] Executing: {command_to_run}")
    if args.cwd:
        print(f"[Runner] CWD: {args.cwd}")

    try:
        result = subprocess.run(
            command_to_run, shell=True, cwd=args.cwd, capture_output=True, text=True
        )

        output = result.stdout + "\n" + result.stderr

        # BASIC CONTRACT CHECK:
        # Did the process crash?
        success = result.returncode == 0

        # Did it print a CLI error?
        if "Error:" in output or "usage:" in output:
            success = False
            output += "\n[Runner Detected CLI Error]"

    except Exception as e:
        success = False
        output = str(e)

    # Callback
    try:
        requests.post(args.webhook, json={"success": success, "output": output})
    except Exception as e:
        print(f"Failed to call webhook: {e}")


if __name__ == "__main__":
    run_agent()
