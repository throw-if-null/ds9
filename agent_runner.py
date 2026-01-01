import subprocess
import requests
import argparse
import time
import sys

def run_agent():
    parser = argparse.ArgumentParser()
    parser.add_argument("--webhook", required=True)
    parser.add_argument("--cmd", required=True)
    parser.add_argument("--cwd", required=False)
    args = parser.parse_args()

    # Wait for n8n Listener
    time.sleep(5)

    try:
        result = subprocess.run(
            args.cmd, 
            shell=True, 
            cwd=args.cwd,
            capture_output=True, 
            text=True
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
