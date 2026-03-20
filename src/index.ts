#!/usr/bin/env node
/**
 * audiotool-nexus-mcp — MCP Server Entry Point
 *
 * Bridges Claude Desktop fleet to Audiotool NEXUS SDK.
 * Transport: stdio (Claude Desktop standard)
 *
 * Auth note: NEXUS SDK OAuth is browser-based. For Node.js (headless) use,
 * we accept a Personal Access Token (PAT) via env var AUDIOTOOL_PAT.
 * If PAT support is not yet in the SDK at v0.0.12, we fall back to
 * offline/test mode and clearly report the limitation.
 */

import "dotenv/config";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { NexusBridge } from "./nexus-bridge.js";
import { registerProjectTools } from "./tools/project.js";
import { registerDeviceTools } from "./tools/devices.js";
import { registerTimelineTools } from "./tools/timeline.js";
import { registerCableTools } from "./tools/cables.js";

const SERVER_NAME = "audiotool-nexus-mcp";
const SERVER_VERSION = "0.1.0";

// ── Bootstrap ────────────────────────────────────────────────────────────────

const bridge = new NexusBridge();

const server = new Server(
  { name: SERVER_NAME, version: SERVER_VERSION },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ── Tool registry ─────────────────────────────────────────────────────────────

const allTools = [
  ...registerProjectTools(bridge),
  ...registerDeviceTools(bridge),
  ...registerTimelineTools(bridge),
  ...registerCableTools(bridge),
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: allTools.map((t) => ({
    name: t.name,
    description: t.description,
    inputSchema: t.inputSchema,
  })),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = allTools.find((t) => t.name === request.params.name);
  if (!tool) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: false,
            error: `Unknown tool: ${request.params.name}`,
            available_tools: allTools.map((t) => t.name),
          }),
        },
      ],
      isError: true,
    };
  }

  try {
    const result = await tool.handler(request.params.arguments ?? {});
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: false,
            error: message,
            tool: request.params.name,
          }),
        },
      ],
      isError: true,
    };
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // stderr only — stdout is reserved for MCP JSON-RPC
  process.stderr.write(`[${SERVER_NAME}] v${SERVER_VERSION} started (stdio)\n`);
}

main().catch((err) => {
  process.stderr.write(`[${SERVER_NAME}] Fatal: ${err}\n`);
  process.exit(1);
});
