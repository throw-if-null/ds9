import argparse
import subprocess
import time

import requests

# Usage: python agent_runner.py --webhook "http://localhost:5678/..." --cmd "opencode..."


def run_agent():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--webhook", required=True, help="n8n Webhook URL to call when done"
    )
    parser.add_argument("--cmd", required=True, help="Command to run the agent")
    args = parser.parse_args()

    print(f"[Runner] Starting agent command: {args.cmd}")
    print(f"[Runner] Will callback to: {args.webhook}")

    # We use a slight delay to ensure n8n has time to reach the "Wait" node
    # if this script was launched very quickly.
    time.sleep(2)

    # Run the actual OpenCode agent
    # capture_output=True captures stdout/stderr to send back to n8n
    try:
        # We run this synchronously here because this script itself is running
        # in the background relative to the main n8n process (via nohup usually)
        result = subprocess.run(
            args.cmd, shell=True, capture_output=True, text=True, check=False
        )

        success = result.returncode == 0
        output = result.stdout + "\n" + result.stderr

        # Prepare payload for n8n
        payload = {
            "success": success,
            "output": output,
            # In a real scenario, you might parse the agent's specific JSON output here
            # For now we send the raw log
        }

    except Exception as e:
        payload = {"success": False, "output": str(e)}

    # Call n8n back to wake up the workflow
    print("[Runner] Work done. Calling webhook...")
    try:
        response = requests.post(args.webhook, json=payload)
        print(f"[Runner] Webhook response: {response.status_code}")
    except Exception as e:
        print(f"[Runner] Failed to call webhook: {e}")


if __name__ == "__main__":
    run_agent()
