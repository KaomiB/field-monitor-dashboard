# Composio: Google Docs vs Google Drive (different MCPs)

- **Composio MCP config ID:** `625e88d9-39f7-450a-999a-eb012ec34419`
- **Setup guide:** See **COMPOSIO_GOOGLEDOCS_SETUP.md** to fix “entity_id required” and get the essay Doc working.

These are **two different** Composio MCPs. Use the matching account ID for each.

## Google Docs MCP
(e.g. `mcp_googledocs-*` / `googledocs` in Cursor)

- **Connected account ID:** `ca_OK0bepG8X0Sn`
- **Auth Config ID:** `ac_pR3hyiTU1tSh`
- Use for: reading/editing document content (Docs API).

## Google Drive MCP
(e.g. `mcp_googledrive-*` / `googledrive` in Cursor)

- **Connected account ID:** `ca_fsXa_I6q-TrE`
- **Auth Config ID (gdrive:auth):** `ac_C20ZIHiHWclA`
- Use for: file/folder operations (Drive API).

---

**Final project Doc ID:** `1f3ks1dytpnhn-iRyPMCg48xqoTQQKdESW_mW_8am2ZY`

For editing that Doc’s content, use the **Google Docs** MCP and `connected_account_id: "ca_OK0bepG8X0Sn"`.
