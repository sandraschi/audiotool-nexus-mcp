# Architecture & Design

This document outlines the technical architecture of the **Audiotool Nexus MCP** node.

## 1. System Overview

The project consists of two primary components communicating with the Audiotool NEXUS ecosystem:

1.  **MCP Server (Node.js)**: A headless JSON-RPC interface that exposes Audiotool project operations (devices, cables, parameters) to AI agents.
2.  **Industrial Dashboard (React)**: A local web interface for visual monitoring and project state inspection.

## 2. The `NexusBridge` Pattern

The core logic is encapsulated in the `NexusBridge` class. It manages the lifecycle of the Audiotool SDK session:

-   **Online Mode**: Established using a Personal Access Token (PAT) for real-time synchronization with the Audiotool cloud.
-   **Offline Fallback**: If authentication fails or no PAT is provided, the bridge initializes an offline SDK document. This allows for local development and testing without network dependencies.

## 3. Tooling & Quality Stack (SOTA 14.1)

This project adheres to the **Industrial Fleet Standards** established in 2026:

-   **Quality Engine**: [Biome](https://biomejs.dev/) replaces the legacy ESLint/Prettier stack. It provides sub-millisecond linting and deterministic formatting via a Rust-native toolchain.
-   **Test Framework**: [Vitest](https://vitest.dev/) manages binary-speed test execution.
-   **Mocking Strategy**: The Audiotool SDK is mocked at the module level in unit tests (`tests/mocks/nexus-sdk.ts`) to ensure fast, deterministic verification of bridge logic.

## 4. Port Configuration

| Port | Service | Protocol |
| :--- | :--- | :--- |
| **10900** | Webapp (Vite) | HTTP/WS |

The MCP server communicates over standard I/O (stdio) and does not require an open port.
