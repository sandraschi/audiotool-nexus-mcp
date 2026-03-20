# audiotool-nexus-mcp

MCP server (Node, stdio) plus a **local React webapp** that use the **[Audiotool NEXUS SDK](https://developer.audiotool.com)** (`@audiotool/nexus`). It exposes project/device/timeline/cable operations to Claude (and similar) and gives you a browser UI to connect and inspect state.

**This is not “Cyber-Orchestration” or “Hyper-Vibecoding.”** Those phrases were marketing fluff. What you get is: **SDK calls + MCP tools + a dashboard**—useful if you accept beta SDK churn and honest limits below.

---

## What is actually here

| Piece | Reality |
|-------|---------|
| **MCP tools** | Wrap the Nexus bridge: connect, query entities, create devices/tracks/regions, cables, etc. See table below. |
| **SDK** | **Open beta** (`@audiotool/nexus` — pin version). Audiotool can break the API anytime; check their Discord before upgrading. |
| **Webapp** | OAuth in the browser (Client ID from [developer.audiotool.com/applications](https://developer.audiotool.com/applications)). When connected, **entity lists and project views** reflect synced document data from the SDK. |
| **“Pro” mixer / mastering / sampler pages** | **Mostly visual chrome.** Channel strips and spectrum-style widgets use **placeholder / random animation** for meters—not a calibrated audio engine. They help you **see layout and mood**, not broadcast-grade metering. Do not trust them as measurement tools. |

---

## Connection (NEXUS)

**stdio** → `NexusBridge` → **`createAudiotoolClient({ pat })`** → **`createSyncedDocument({ mode: "online", project: <studio URL> })`** → **`start()`** — same synced project model as [Getting Started](https://developer.audiotool.com/js-package-documentation/documents/Getting_Started.html). MCP tools read/write **entities** on that document for the given `project=` URL.

If PAT is missing or online auth fails, the bridge uses **`createOfflineDocument()`** (local/dev). That path is not your online beta session; stderr may show `[nexus-bridge] Online auth failed`.

---

## Status

**SDK: `@audiotool/nexus` v0.0.12 — open beta.** Pin the version (`npm install @audiotool/nexus@0.0.12`) and watch [Discord](https://discord.gg/5Cde4Zvret) for breaking changes.

---

## MCP tools

| Tool | Description |
|------|-------------|
| `nexus_status` | Session state, mode, token presence |
| `nexus_connect` | Connect to an Audiotool project URL |
| `nexus_disconnect` | Disconnect |
| `nexus_get_project_info` | Project summary + entity counts |
| `nexus_query_entities` | Query entities by type |
| `nexus_create_device` | Create instrument or effect |
| `nexus_list_devices` | List instruments and effects |
| `nexus_ticks_reference` | Musical time tick constants |
| `nexus_create_note_track` | Add a note track |
| `nexus_add_note_region` | Add a MIDI region |
| `nexus_create_cable` | Route audio between sockets |
| `nexus_list_cables` | List cables |

---

## Webapp (optional)

Runs on **port 10900** (`start.ps1` / `start.bat`). Pages like **Mixer**, **Sampler**, **Mastering** are **dashboard skins** around the same synced project—**not** a substitute for Audiotool’s own UI for serious mixing. Use them for **connection testing, entity browsing, and agentic demos**, not for certified loudness or spectrum analysis.

---

## Auth

### MCP (Claude Desktop / headless Node): you need a PAT

The MCP server runs **outside the browser**, so it **cannot** use the webapp’s OAuth flow. **`AUDIOTOOL_PAT` is required** for a real **online** Nexus session. Without a PAT, the bridge may stay in **offline / limited** mode—fine for local experiments, not for syncing with beta.audiotool.com.

**How to get a Personal Access Token**

1. Sign in with your Audiotool account at the **[Audiotool Developer Dashboard](https://developer.audiotool.com)** (same account you use for the DAW).
2. Open **[Personal Access Tokens](https://developer.audiotool.com/personal-access-tokens)**.
3. Create a new token, give it a label you’ll recognize (e.g. `claude-desktop-mcp`), and **copy the token immediately**—many dashboards only show it once.
4. Put it in **repo-root `.env`** as `AUDIOTOOL_PAT=...`, or pass it in the MCP `env` block (see below). Never commit the token.

**How to get a project URL (for `nexus_connect` and tests)**

Nexus attaches to an **existing** Audiotool project by URL.

1. Open the studio (e.g. **[beta.audiotool.com](https://beta.audiotool.com)** or the project link from your Audiotool account—use whatever URL your account uses for creating/editing projects).
2. **Create a new project** (or open one you already have). Wait until the studio has loaded.
3. Copy the **full URL from the browser address bar**. It should look like  
   `https://beta.audiotool.com/studio?project=<id>`  
   (the exact host may match what Audiotool shows you; the important part is the `project=` query parameter).
4. Use that string as the `project_url` argument to `nexus_connect`, and optionally set `AUDIOTOOL_TEST_PROJECT_URL` in `.env` for `npm run test`.

Keeping the **same project open in a browser tab** while using the MCP matches the NEXUS “synced document” model from the [Getting Started](https://developer.audiotool.com/js-package-documentation/documents/Getting_Started.html) docs.

---

**Webapp** — OAuth via SDK (`getLoginStatus()` / `login()`). Register an app and paste Client ID on Connect. (Separate from the PAT; the PAT is for **Node/MCP**.)

**MCP env example** — Personal Access Token: [developer.audiotool.com/personal-access-tokens](https://developer.audiotool.com/personal-access-tokens). Example:

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

Per SDK docs, PAT is passed as `pat` to `createAudiotoolClient`. **Without PAT:** MCP runs in offline / limited mode (see code and stderr messages).

Local dev: copy `.env.example` → `.env`, set `AUDIOTOOL_PAT` in the **repo root** (same folder as `package.json`). The MCP entrypoint loads that file **by path**, not only from the current working directory—so launchers don’t have to `cd` into the repo for the PAT to apply.

**What Audiotool / Nexus are:** see [docs/AUDIOTOOL_AND_NEXUS.md](docs/AUDIOTOOL_AND_NEXUS.md) (modular DAW + API; not a marketplace spec).

---

## Setup

### MCP

```powershell
Set-Location D:\Dev\repos\audiotool-nexus-mcp
npm install
npm run build
```

Verify: `node dist/index.js` — waits on stdio JSON-RPC.

### Integration test (PAT must yield **online**)

Requires `AUDIOTOOL_PAT` and `AUDIOTOOL_TEST_PROJECT_URL` in `.env` (see `.env.example`). Then:

```powershell
npm run test
```

If both are set, Vitest asserts **`nexus_connect` → `session.mode === "online"`** — not silent offline fallback. If env vars are missing, those tests **skip** (e.g. CI). See [`tests/integration/README.md`](tests/integration/README.md).

### Webapp

```powershell
.\start.bat
```

Opens at http://localhost:10900

---

## Ports

| Port | Service |
|------|---------|
| 10900 | Webapp (Vite dev) |

No separate FastAPI layer—the webapp talks to Audiotool **via the SDK in the browser**.

---

## Known limitations

- **Node PAT auth** — SDK PAT path for Node may be less documented than browser OAuth; the bridge tries PAT and can fall back to offline mode if it fails.
- **Cable sockets** — `nexus_create_cable` needs socket location strings from entity fields (e.g. `entities/.../fields/audioOutput`). Discover via `nexus_query_entities` and inspect fields.
- **MIDI detail** — Note *regions* can be created; fine-grained note editing inside a region may not be fully exposed here (see code).
- **Webapp visuals** — Mixer/mastering-style meters and spectrum blocks are **not** scientifically accurate; they are UI demos unless wired to real analytics later.

---

## Fleet / registry

- Ports: **10900** (webapp)  
- GitHub: `https://github.com/sandraschi/audiotool-nexus-mcp` (if public)
