# audiotool-nexus-mcp

MCP server + React webapp bridging the Claude Desktop fleet to the [Audiotool NEXUS SDK](https://developer.audiotool.com).

Control a live Audiotool cloud DAW session through Claude, or inspect project state via the dashboard.

---

## Status

**SDK: `@audiotool/nexus` v0.0.12 — open beta.** Audiotool explicitly warns the API may break at any time. Pin the SDK version (`npm install @audiotool/nexus@0.0.12`) and watch their [Discord](https://discord.gg/5Cde4Zvret) for breaking changes before upgrading.

---

## MCP Tools

| Tool | Description |
|---|---|
| `nexus_status` | Current session state, mode, token presence |
| `nexus_connect` | Connect to an Audiotool project URL |
| `nexus_disconnect` | Disconnect current session |
| `nexus_get_project_info` | Project summary + entity counts |
| `nexus_query_entities` | Query entities by type |
| `nexus_create_device` | Create instrument or effect |
| `nexus_list_devices` | List all instruments and effects |
| `nexus_ticks_reference` | Musical time tick constants |
| `nexus_create_note_track` | Add a note track linked to a device |
| `nexus_add_note_region` | Add a MIDI region to a track |
| `nexus_create_cable` | Route audio between device sockets |
| `nexus_list_cables` | List all audio cables |

---

## Auth

Two separate auth paths:

**Webapp (browser)** — OAuth flow via `getLoginStatus()` / `login()` from the SDK.
Register an app at [developer.audiotool.com/applications](https://developer.audiotool.com/applications).
Enter the Client ID in the Connect page.

**MCP server (Node.js stdio)** — Personal Access Token (PAT).
Generate at [developer.audiotool.com/personal-access-tokens](https://developer.audiotool.com/personal-access-tokens).
Set in Claude Desktop config:

```json
{
  "mcpServers": {
    "audiotool-nexus": {
      "command": "node",
      "args": ["D:/Dev/repos/audiotool-nexus-mcp/dist/index.js"],
      "env": {
        "AUDIOTOOL_PAT": "your-pat-here"
      }
    }
  }
}
```

**Without a PAT:** The MCP server operates in offline mode — documents are local, no sync to Audiotool. Useful for testing tool calls before setting up auth.

---

## Setup

### MCP Server

```powershell
Set-Location D:\Dev\repos\audiotool-nexus-mcp
npm install
npm run build
```

Verify: `node dist/index.js` — should print startup message to stderr and wait for stdin JSON-RPC.

### Webapp

```powershell
.\start.bat   # or .\start.ps1
```

Opens at http://localhost:10900

---

## Ports

| Port | Service |
|---|---|
| 10900 | Webapp (Vite dev server) |

No backend API server — the webapp talks to Audiotool directly via the SDK.

---

## Known limitations

- **Node.js PAT auth**: The SDK's PAT integration for Node.js is not yet formally documented. The bridge attempts it and falls back to offline mode if it fails. Once Audiotool stabilises Node.js auth, this will work cleanly.
- **Socket location references**: The `nexus_create_cable` tool requires socket location strings from inside entity fields. These look like `entities/abc123/fields/audioOutput`. Currently the only way to get them is via `nexus_query_entities` and inspecting the raw fields.
- **Read-only entities**: `noteRegion` MIDI content (individual notes inside a region) is not yet exposed through this MCP layer — only the region container is created.

---

## Fleet registration

- Ports: 10900 (webapp frontend)  
- FLEET_INDEX.md: `audiotool-nexus-mcp`  
- GitHub: `https://github.com/sandraschi/audiotool-nexus-mcp`
