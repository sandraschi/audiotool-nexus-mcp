# Audiotool Nexus Guide

This guide explains the **Audiotool NEXUS** ecosystem and how it integrates with this MCP node.

## 1. What is Audiotool?

**Audiotool** is a browser-based modular DAW. Users create music by placing and wiring virtual hardware devices (synths, drum machines, effects) on a digital workspace.

### Core Concepts
-   **Devices**: The fundamental building blocks (e.g., Heisenberg, Pulverisateur).
-   **Cables**: Routes audio and control signals between device sockets.
-   **Ticks**: The standard unit of musical time in the Audiotool timeline.

## 2. The NEXUS SDK (`@audiotool/nexus`)

The NEXUS SDK provides programmatic access to Audiotool projects. It synchronizes a **Project Document** across clients, allowing scripts and agents to:
-   Query the state of all entities in a project.
-   Create, modify, and delete devices and cables.
-   Automate timeline and parameter changes.

## 3. Project URLs

Nexus attaches to specific project instances via their URL. 
- **Format**: `https://beta.audiotool.com/studio?project=<id>`
- **Live Sync**: When you connect to a project URL, your changes are reflected instantly in any browser tab that has that project open.

## 4. Connection Modes

### Online Session
Requires a **Personal Access Token (PAT)**. This mode allows the MCP server to sync with the Audiotool cloud and participate in live, multiplayer-enabled projects.

### Offline Session
If a PAT is missing or authentication fails, the bridge falls back to a local SDK document.
-   **Stability**: Guaranteed to work without an Internet connection.
-   **Scope**: Changes are local to the session and will not sync to the Audiotool cloud.

## 5. Beta Status
The NEXUS SDK is currently in **Open Beta**. The API surface and project model are subject to change. Always check the [Audiotool Discord](https://discord.gg/5Cde4Zvret) for the latest developer updates.
