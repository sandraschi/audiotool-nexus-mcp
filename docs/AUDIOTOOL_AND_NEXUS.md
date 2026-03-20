# What is Audiotool “beta” and what is the NEXUS SDK?

## beta.audiotool.com (the studio)

**Audiotool** is a **browser-based modular DAW**: you make music by placing and wiring **devices** on a desktop—synths (e.g. Heisenberg, Pulverisateur), drum-oriented tools, effects (stompboxes), note tracks, cables, etc. That’s the “building blocks” mental model: you’re composing a rack/patch, not writing a low-level audio engine from scratch.

**beta.audiotool.com** is where **live / multiplayer** projects run in development; the NEXUS docs use project URLs like:

`https://beta.audiotool.com/studio?project=<id>`

The **NEXUS SDK** (`@audiotool/nexus`) does **not** replace the DAW UI for normal music-making. It gives **programmatic access** to the same **project document**: create/update entities, subscribe to changes, sync in real time with the tab that has the project open—see [Getting Started](https://developer.audiotool.com/js-package-documentation/documents/Getting_Started.html).

So: **yes**, the ecosystem is “devices you combine”; **Nexus** is “script/automate/integrate with that project,” not a separate game engine.

## This MCP and NEXUS

This server’s path is: **stdio** → **`NexusBridge`** → **`createAudiotoolClient({ pat })`** → **`createSyncedDocument({ mode: "online", project: <studio URL> })`** → tools on the synced document (entities for that `project=`).

Without PAT or if auth fails, the bridge uses **`createOfflineDocument()`** — a local SDK document, not the same thing as your online project on beta.

## Personal Access Token (PAT) — required for MCP (Node)

The **MCP server** runs in Node and uses `createAudiotoolClient` with a **PAT**. It does **not** use the browser OAuth flow. **You must create a PAT** or the integration stays offline/limited.

**Get a PAT**

1. Log in at **[developer.audiotool.com](https://developer.audiotool.com)** (Audiotool account).
2. Go to **[Personal Access Tokens](https://developer.audiotool.com/personal-access-tokens)**.
3. Create a token, copy it, and store it only in **`.env`** (repo root) or your MCP client’s `env`—never in git.

**Create / find a project URL**

1. Open the **Audiotool studio** in the browser (e.g. **[beta.audiotool.com](https://beta.audiotool.com)** if that’s what your workflow uses).
2. **New project** or open an existing one.
3. Copy the **address bar URL** containing `project=…` — that is what you pass to `nexus_connect` and to `AUDIOTOOL_TEST_PROJECT_URL` for tests.

## `.env` loading

This MCP loads **`.env` from the repository root** (next to `package.json`), not only from `process.cwd()`, so Claude Desktop / other launchers can start `node …/dist/index.js` from any working directory and still pick up `AUDIOTOOL_PAT`.

## Marketplace / “download my drum machine”?

The **NEXUS developer docs** focus on **OAuth/PAT, clients, synced documents, and modifying projects**. They do **not** define a “publish this custom device to a store” workflow—that’s **product/community policy** on Audiotool’s side (racks, sharing, etc.), not something this MCP or the SDK tutorial guarantees.

If your goal is **distribution of a preset pack or project**, check **Audiotool’s own site/community** for how sharing works today. If your goal is **automation + Claude**, Nexus + this repo are in scope.
