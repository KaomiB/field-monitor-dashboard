# Blynk MCP server – auth token setup

The Blynk MCP server uses **OAuth 2.0**. You need to create an OAuth2 token in Blynk and (optionally) add credentials to Cursor so the MCP can get an access token.

## 1. In Blynk Console

1. Go to [Blynk Console](https://blynk.cloud) → **Settings** → **Developers** → **OAuth2**.
2. Click **Create New Token** (or add a new OAuth2 app).
3. **Name:** e.g. `Cursor MCP`.
4. **Redirect URLs:** Add the redirect URI your client uses.  
   - If you use **Cursor** with the Blynk MCP, Cursor may use Dynamic Client Registration and send its own redirect URI.  
   - If Blynk returns *"One of the redirect URIs is not a valid URL"*, try adding:
     - `http://localhost`
     - `https://cursor.com`  
   (Check [Blynk MCP docs](https://docs.blynk.io/en/getting-started/mcp-server) or Cursor MCP docs for the exact redirect URI.)
5. Save and copy **Client ID** and **Client Secret** (hover → copy).

## 2. In Cursor (mcp.json)

Edit `~/.cursor/mcp.json` and add an `auth` block to the Blynk server with your Client ID and Client Secret:

```json
"blynk": {
  "url": "https://blynk.cloud/mcp",
  "headers": {},
  "auth": {
    "CLIENT_ID": "your_client_id_from_blynk",
    "CLIENT_SECRET": "your_client_secret_from_blynk"
  }
}
```

Restart Cursor (or reload MCP). When you use a Blynk MCP tool, Cursor should open a browser so you can log in to Blynk and authorize; the access token is then stored and used for later requests.

## 3. Developer mode (for create/edit tools)

For tools that **create or edit** templates, datastreams, or events, enable **Developer Mode** in your Blynk user profile (see [Developer Mode](https://docs.blynk.io/en/concepts/developer-mode)).

## References

- [Blynk MCP Server](https://docs.blynk.io/en/getting-started/mcp-server)
- [Blynk OAuth2 settings](https://docs.blynk.io/en/blynk.console/settings/developers/oauth2)
