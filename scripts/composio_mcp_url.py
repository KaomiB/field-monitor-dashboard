#!/usr/bin/env python3
"""
Get Composio MCP URL for Cursor (same pattern as composio.dev/toolkits/cursor).

Run once to print the MCP URL and the exact JSON to add to Cursor's mcp.json.
Requires: pip install composio
"""
import os
import sys

def main():
    try:
        from composio import Composio
    except ImportError:
        print("Install Composio: pip install composio", file=sys.stderr)
        sys.exit(1)

    api_key = os.environ.get("COMPOSIO_API_KEY", "").strip()
    user_id = os.environ.get("COMPOSIO_USER_ID", "pg-test-8e6ed7df-8a1e-40c6-a47b-3d2d7e5600bd")

    if not api_key:
        print("Set COMPOSIO_API_KEY (from https://platform.composio.dev/).", file=sys.stderr)
        print("Example: export COMPOSIO_API_KEY=your-key", file=sys.stderr)
        sys.exit(1)

    composio = Composio(api_key=api_key)
    session = composio.create(user_id=user_id)
    url = session.mcp.url if hasattr(session.mcp, "url") else getattr(session, "mcp_url", None)

    if not url:
        print("Could not get MCP URL from session. Session keys:", getattr(session, "__dict__", {}), file=sys.stderr)
        sys.exit(1)

    print("# Composio MCP URL (use in Cursor with x-api-key header)\n")
    print("URL:", url)
    print()
    print("# Add this to ~/.cursor/mcp.json under mcpServers.googledocs:")
    print('"googledocs": {')
    print(f'  "url": "{url}",')
    print('  "headers": {')
    print('    "x-api-key": "<your-Composio-API-key>"')
    print("  }")
    print("}")
    print()
    print("Restart Cursor after editing mcp.json.")

if __name__ == "__main__":
    main()
