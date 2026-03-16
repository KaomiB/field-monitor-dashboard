# Set up Composio Google Docs MCP for your essay

This guide gets the **Google Docs MCP** working in Cursor so you can read and edit your final project paper in Google Docs. It follows the same pattern as [Composio’s Cursor integration](https://composio.dev/toolkits/cursor): API key, `user_id`, MCP URL, and `x-api-key` header.

---

## What you already have

- **Google Doc (essay):** [Final project paper](https://docs.google.com/document/d/1f3ks1dytpnhn-iRyPMCg48xqoTQQKdESW_mW_8am2ZY/edit)  
  Doc ID: `1f3ks1dytpnhn-iRyPMCg48xqoTQQKdESW_mW_8am2ZY`
- **Composio Google Docs connection:** Account ID `ca_OK0bepG8X0Sn`, Auth Config `ac_pR3hyiTU1tSh`
- **MCP config ID:** `625e88d9-39f7-450a-999a-eb012ec34419`
- **User/entity ID** (for Composio): `pg-test-8e6ed7df-8a1e-40c6-a47b-3d2d7e5600bd`

The remaining issue: when the MCP runs a tool (e.g. “read document”), Composio’s API returns *“User ID is required with connected account (entity_id)”*. So we need Composio to know **which user** is making the call.

---

## Option A: Use Composio backend URL + API key (recommended)

Composio’s docs say the MCP URL should include `user_id`, and requests should send an **x-api-key** header. That way the backend can tie the call to your user and connected account.

### 1. Get your Composio API key

As in [Composio’s Cursor toolkit](https://composio.dev/toolkits/cursor): *"Connect Cursor without Auth hassles … We manage OAuth, API Key, token refresh, and scopes."*

1. Go to [Composio Platform](https://platform.composio.dev/) (or app.composio.dev).
2. Sign in and open your project/organization.
3. Find **API Keys** or **Settings → API Key** and copy your key.

### 2. Point Cursor at the backend MCP with headers

Same idea as [“Connect Cursor MCP Tool with your Agent”](https://composio.dev/toolkits/cursor): use an MCP URL and pass the **x-api-key** header.

**Option 2a – Use your existing MCP config (already in Cursor)**  
Edit **`~/.cursor/mcp.json`** and set your real API key in the `googledocs` entry. Replace the `googledocs` entry with:

```json
"googledocs": {
  "url": "https://backend.composio.dev/v3/mcp/625e88d9-39f7-450a-999a-eb012ec34419?user_id=pg-test-8e6ed7df-8a1e-40c6-a47b-3d2d7e5600bd",
  "headers": {
    "x-api-key": "YOUR_COMPOSIO_API_KEY"
  }
}
```

Replace `YOUR_COMPOSIO_API_KEY` with your key from step 1. The `user_id` in the URL must match the user that owns the Google Docs connection in Composio.

**Option 2b – Generate MCP URL via script**  
From the repo root: `export COMPOSIO_API_KEY=your-key` then `python scripts/composio_mcp_url.py`. Use the printed URL and the same `x-api-key` header in `~/.cursor/mcp.json`.

### 3. Restart Cursor

Restart Cursor (or reload MCP servers) so it picks up the new URL and headers.

### 4. Test

In a Cursor chat, ask the agent to read your Google Doc (e.g. “Read the Google Doc with ID 1f3ks1dytpnhn-iRyPMCg48xqoTQQKdESW_mW_8am2ZY” or “Open my final project paper in Google Docs”). If the backend correctly associates `user_id` with your connected account, the entity_id error should stop and the Doc should be readable.

---

## Option B: Regenerate config with Composio CLI

Composio can generate a Cursor-ready MCP config (including URL and any needed params) for Google Docs.

### 1. Run the CLI

In a terminal:

```bash
npx @composio/cli add cursor --app googledocs
```

Follow the prompts (sign in, pick Google Docs, allow access). The CLI will output an MCP URL and any headers.

### 2. Apply the output to Cursor

Copy the URL (and headers if given) into `~/.cursor/mcp.json` under a `googledocs` (or similar) server entry.

### 3. Restart Cursor and test

Same as in Option A: restart Cursor and ask the agent to read your essay Doc.

---

## Option C: Fix the connection in Composio (if A/B still fail)

If you still see “User ID / entity_id required”:

1. In [Composio Platform](https://platform.composio.dev/), open **Connected accounts** (or **Connections**).
2. Find the **Google Docs** connection with ID `ca_OK0bepG8X0Sn`.
3. Check which **user / entity** it’s linked to. Composio may show “Entity ID”, “User ID”, or “Linked to”.
4. Make sure the **same** identifier is used in the MCP URL as `user_id` (e.g. `pg-test-8e6ed7df-8a1e-40c6-a47b-3d2d7e5600bd`). If the connection is tied to a different ID (e.g. your email or another UUID), use **that** value in the URL instead.

---

## Summary

- **Essay Doc ID:** `1f3ks1dytpnhn-iRyPMCg48xqoTQQKdESW_mW_8am2ZY`
- **Use Option A** if you have a Composio API key: backend URL + `user_id` + `x-api-key` in `~/.cursor/mcp.json`.
- **Use Option B** if you prefer a fresh, CLI-generated config.
- **Use Option C** to align the connected account’s user/entity with the `user_id` in the MCP URL.

Once the MCP runs without the entity_id error, you can use the same Doc ID and account ID (see `COMPOSIO_GOOGLEDOCS.md`) to have the agent read and edit your essay in Google Docs.
